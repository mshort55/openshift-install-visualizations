#!/usr/bin/env node
import { spawn } from "node:child_process";
import { createWriteStream } from "node:fs";
import fs from "node:fs/promises";
import net from "node:net";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";

const CHROME_VERSION = "154.0.8037.92";
const HEADING = "Agent-based bare metal decisions";
const TITLE = "Bare metal install decisions";
const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../..",
);

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

function parseArgs(argv) {
  const positionals = [];
  const flags = {};
  const booleans = new Set(["aria"]);
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === undefined) continue;
    if (token.startsWith("--")) {
      const key = token.slice(2);
      const value = argv[i + 1];
      if (booleans.has(key) && (value === undefined || value.startsWith("--"))) {
        flags[key] = true;
        continue;
      }
      if (value === undefined || value.startsWith("--")) {
        throw new Error(`missing value for --${key}`);
      }
      flags[key] = value;
      i += 1;
    } else {
      positionals.push(token);
    }
  }
  return { positionals, flags };
}

function slug(value, label) {
  if (!/^[a-z0-9-]+$/.test(value)) throw new Error(`unsafe ${label}: ${value}`);
  return value;
}

function freePort(start) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", () => {
      if (start > 65000) reject(new Error("no free port"));
      else resolve(freePort(start + 1));
    });
    server.listen(start, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : start;
      server.close(() => resolve(port));
    });
  });
}

function runDir() {
  const dir = process.env.VERIFY_RUN_DIR;
  if (!dir) throw new Error("VERIFY_RUN_DIR is not set");
  return dir;
}

async function readMeta() {
  const file = path.join(runDir(), "meta.json");
  return JSON.parse(await fs.readFile(file, "utf8"));
}

function alive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function stopPid(pid) {
  if (!pid || !alive(pid)) return;
  try {
    process.kill(-pid, "SIGTERM");
  } catch {
    try {
      process.kill(pid, "SIGTERM");
    } catch {
      return;
    }
  }
}

async function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let next = 0;
  const pending = new Map();
  await new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve, { once: true });
    ws.addEventListener("error", () => reject(new Error("CDP socket failed")), {
      once: true,
    });
  });
  ws.addEventListener("message", (event) => {
    const message = JSON.parse(String(event.data));
    if (!message.id || !pending.has(message.id)) return;
    const waiter = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) waiter.reject(new Error(message.error.message));
    else waiter.resolve(message.result);
  });
  return {
    send(method, params = {}) {
      const id = ++next;
      const result = new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
      });
      ws.send(JSON.stringify({ id, method, params }));
      return result;
    },
    close() {
      ws.close();
    },
  };
}

async function withPage(meta, fn) {
  const list = await fetch(`http://127.0.0.1:${meta.cdpPort}/json/list`).then(
    (response) => response.json(),
  );
  const page = list.find((target) => target.type === "page");
  if (!page) throw new Error("Chrome has no page target");
  const cdp = await connect(page.webSocketDebuggerUrl);
  try {
    return await fn(cdp);
  } finally {
    cdp.close();
  }
}

async function evaluate(cdp, expression) {
  const result = await cdp.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    const text =
      result.exceptionDetails.exception?.description ??
      result.exceptionDetails.text ??
      "page script failed";
    throw new Error(text);
  }
  return result.result.value;
}

const FIND = `
function implicitRole(el) {
  const role = el.getAttribute("role");
  if (role) return role;
  const tag = el.tagName.toLowerCase();
  if (tag === "button") return "button";
  if (tag === "a" && el.hasAttribute("href")) return "link";
  if (/^h[1-6]$/.test(tag)) return "heading";
  return "";
}
function accessibleName(el) {
  const label = el.getAttribute("aria-label");
  if (label) return label.trim();
  return (el.innerText || el.textContent || "").trim().replace(/\\s+/g, " ");
}
function matches(role, name) {
  return [...document.querySelectorAll("button, a, h1, h2, h3, h4, [role]")].filter(
    (el) => implicitRole(el) === role && accessibleName(el) === name,
  );
}
`;

async function waitFor(meta, predicate, timeoutMs) {
  const started = Date.now();
  let last = "not ready";
  while (Date.now() - started < timeoutMs) {
    try {
      const value = await predicate();
      if (value !== false && value !== null && value !== undefined) return value;
      last = "condition false";
    } catch (error) {
      last = error instanceof Error ? error.message : String(error);
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error(last);
}

function chromePlatform() {
  if (process.arch === "arm64") return "linux-arm64";
  if (process.arch === "x64") return "linux64";
  throw new Error(`no Chrome for Testing build for ${process.arch}`);
}

async function chromeBinary() {
  const platform = chromePlatform();
  const cache = path.join(
    repoRoot,
    ".cursor/skills/verify-openshift-install-visualizations/cache",
    platform,
  );
  const binary = path.join(cache, `chrome-headless-shell-${platform}`, "chrome-headless-shell");
  try {
    await fs.access(binary);
    await fs.chmod(binary, 0o755);
    return binary;
  } catch {
    // download below
  }
  await fs.mkdir(cache, { recursive: true });
  const zipPath = path.join(cache, "chrome-headless-shell.zip");
  const url = `https://storage.googleapis.com/chrome-for-testing-public/${CHROME_VERSION}/${platform}/chrome-headless-shell-${platform}.zip`;
  console.error(`downloading ${url}`);
  const response = await fetch(url);
  if (!response.ok || !response.body) {
    throw new Error(`Chrome download failed: ${response.status}`);
  }
  await pipeline(response.body, createWriteStream(zipPath));
  await new Promise((resolve, reject) => {
    const child = spawn("python3", ["-m", "zipfile", "-e", zipPath, cache], {
      stdio: "inherit",
    });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`unzip failed: ${code}`));
    });
  });
  await fs.chmod(binary, 0o755);
  return binary;
}

function started(child) {
  return new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("spawn", () => resolve(child));
  });
}

async function writeMeta(dir, meta) {
  const file = path.join(dir, "meta.json");
  const temporary = `${file}.tmp`;
  await fs.writeFile(temporary, JSON.stringify(meta, null, 2));
  await fs.rename(temporary, file);
}

async function launch() {
  const id = `${Date.now()}-${process.pid}`;
  const dir = `/tmp/verify-openshift-install-visualizations-${id}`;
  await fs.mkdir(dir, { recursive: true });
  const port = await freePort(4173);
  const cdpPort = await freePort(9333);
  const url = `http://127.0.0.1:${port}/`;
  const viteLog = await fs.open(path.join(dir, "vite.log"), "a");
  const vite = spawn(
    "npm",
    ["run", "dev", "--", "--host", "127.0.0.1", "--port", String(port), "--strictPort"],
    {
      cwd: repoRoot,
      detached: true,
      env: { ...process.env, BROWSER: "none" },
      stdio: ["ignore", viteLog.fd, viteLog.fd],
    },
  );
  const meta = {
    url,
    port,
    cdpPort,
    vitePid: vite.pid ?? 0,
    chromePid: 0,
    repoRoot,
  };
  process.env.VERIFY_RUN_DIR = dir;
  try {
    await started(vite);
    vite.unref();
    meta.vitePid = vite.pid ?? 0;
    await writeMeta(dir, meta);
    await waitFor(
      meta,
      async () => {
        const response = await fetch(url);
        const body = await response.text();
        return response.status === 200 && body.includes(`<title>${TITLE}</title>`);
      },
      30000,
    );
    const binary = await chromeBinary();
    const chromeLog = await fs.open(path.join(dir, "chrome.log"), "a");
    const chrome = spawn(
      binary,
      [
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        "--disable-dev-shm-usage",
        `--remote-debugging-port=${cdpPort}`,
        `--user-data-dir=${path.join(dir, "chrome-profile")}`,
        "--window-size=1280,1600",
        url,
      ],
      { detached: true, stdio: ["ignore", chromeLog.fd, chromeLog.fd] },
    );
    await started(chrome);
    chrome.unref();
    meta.chromePid = chrome.pid ?? 0;
    await writeMeta(dir, meta);
    await waitFor(
      meta,
      async () => {
        const found = await withPage(meta, (cdp) =>
          evaluate(
            cdp,
            `(() => { ${FIND} return matches("heading", ${JSON.stringify(HEADING)}).length === 1 })()`,
          ),
        );
        return found === true;
      },
      30000,
    );
  } catch (error) {
    const viteLog = await fs.readFile(path.join(dir, "vite.log"), "utf8").catch(() => "");
    const chromeLog = await fs.readFile(path.join(dir, "chrome.log"), "utf8").catch(() => "");
    if (viteLog) console.error(viteLog.slice(-1500));
    if (chromeLog) console.error(chromeLog.slice(-1500));
    await writeMeta(dir, meta);
    await cleanup();
    throw error;
  }
  console.log(`VERIFY_RUN_DIR=${dir}`);
  console.log(`URL=${url}`);
}

async function doctor() {
  const meta = await readMeta();
  const problems = [];
  if (!alive(meta.vitePid)) problems.push(`vite pid ${meta.vitePid} is not running`);
  if (!alive(meta.chromePid)) problems.push(`chrome pid ${meta.chromePid} is not running`);
  try {
    const response = await fetch(meta.url);
    const body = await response.text();
    if (response.status !== 200 || !body.includes(`<title>${TITLE}</title>`)) {
      problems.push(`expected title ${TITLE} from ${meta.url}`);
    }
  } catch (error) {
    problems.push(error instanceof Error ? error.message : String(error));
  }
  try {
    const version = await fetch(`http://127.0.0.1:${meta.cdpPort}/json/version`);
    if (!version.ok) problems.push("CDP version endpoint failed");
  } catch (error) {
    problems.push(error instanceof Error ? error.message : String(error));
  }
  try {
    const ready = await withPage(meta, (cdp) =>
      evaluate(
        cdp,
        `(() => { ${FIND} return matches("heading", ${JSON.stringify(HEADING)}).length === 1 })()`,
      ),
    );
    if (ready !== true) problems.push(`heading ${HEADING} is missing`);
  } catch (error) {
    problems.push(error instanceof Error ? error.message : String(error));
  }
  if (problems.length > 0) {
    fail(problems.join("\n"));
    return;
  }
  console.log("ok");
  console.log(`url ${meta.url}`);
  console.log(`title ${TITLE}`);
  console.log(`heading ${HEADING}`);
  console.log(`vite ${meta.vitePid}`);
  console.log(`chrome ${meta.chromePid}`);
}

async function cleanup() {
  const dir = runDir();
  let meta = null;
  try {
    meta = JSON.parse(await fs.readFile(path.join(dir, "meta.json"), "utf8"));
  } catch {
    meta = null;
  }
  if (meta) {
    stopPid(meta.chromePid);
    stopPid(meta.vitePid);
  }
  await fs.rm(dir, { recursive: true, force: true });
  console.log(`removed ${dir}`);
}

async function browser(action, flags) {
  const meta = await readMeta();
  if (action === "wait") {
    const role = flags.role;
    const name = flags.name;
    if (!role || !name) throw new Error("wait requires --role and --name");
    await waitFor(
      meta,
      async () =>
        (await withPage(meta, (cdp) =>
          evaluate(
            cdp,
            `(() => { ${FIND} return matches(${JSON.stringify(role)}, ${JSON.stringify(name)}).length === 1 })()`,
          ),
        )) === true,
      10000,
    );
    console.log(`found ${role} ${name}`);
    return;
  }
  if (action === "click") {
    const role = flags.role;
    const name = flags.name;
    if (!role || !name) throw new Error("click requires --role and --name");
    const hash = await withPage(meta, (cdp) =>
      evaluate(
        cdp,
        `(() => {
          ${FIND}
          const found = matches(${JSON.stringify(role)}, ${JSON.stringify(name)});
          if (found.length !== 1) return { error: "expected 1 " + ${JSON.stringify(role)} + " named " + ${JSON.stringify(name)} + ", found " + found.length };
          const before = location.hash.replace(/^#/, "");
          found[0].click();
          return { before };
        })()`,
      ),
    );
    if (!hash || hash.error) throw new Error(hash?.error ?? "click failed");
    const after = await waitFor(
      meta,
      async () => {
        const current = await withPage(meta, (cdp) =>
          evaluate(cdp, `location.hash.replace(/^#/, "")`),
        );
        if (current !== hash.before) return current;
        return false;
      },
      2000,
    ).catch(async () =>
      withPage(meta, (cdp) => evaluate(cdp, `location.hash.replace(/^#/, "")`)),
    );
    console.log(after);
    return;
  }
  if (action === "hash") {
    const value = await withPage(meta, (cdp) =>
      evaluate(cdp, `location.hash.replace(/^#/, "")`),
    );
    console.log(value);
    return;
  }
  if (action === "pressed") {
    const name = flags.name;
    if (!name) throw new Error("pressed requires --name");
    const value = await withPage(meta, (cdp) =>
      evaluate(
        cdp,
        `(() => {
          ${FIND}
          const found = matches("button", ${JSON.stringify(name)});
          if (found.length !== 1) throw new Error("expected 1 button");
          return found[0].getAttribute("aria-pressed");
        })()`,
      ),
    );
    console.log(value);
    return;
  }
  if (action === "attr") {
    const decision = slug(flags.decision ?? "", "decision");
    const attr = flags.attr;
    if (!attr || !/^[a-z0-9-]+$/.test(attr)) throw new Error("attr requires --attr");
    const value = await withPage(meta, (cdp) =>
      evaluate(
        cdp,
        `document.querySelector('[data-decision="${decision}"]')?.getAttribute(${JSON.stringify(attr)}) ?? ""`,
      ),
    );
    console.log(value);
    return;
  }
  if (action === "scroll") {
    const decision = slug(flags.decision ?? "", "decision");
    await withPage(meta, (cdp) =>
      evaluate(
        cdp,
        `document.querySelector('[data-decision="${decision}"]')?.scrollIntoView({ block: "start" })`,
      ),
    );
    console.log(`scrolled ${decision}`);
    return;
  }
  if (action === "navigate") {
    const hash = flags.hash ?? "";
    if (hash.startsWith("#") || hash.includes(" ")) throw new Error("pass the hash without #");
    await withPage(meta, async (cdp) => {
      await cdp.send("Page.enable");
      await cdp.send("Page.navigate", { url: `${meta.url}#${hash}` });
    });
    await waitFor(
      meta,
      async () => {
        const current = await withPage(meta, (cdp) =>
          evaluate(cdp, `location.hash.replace(/^#/, "")`),
        );
        return current === hash;
      },
      10000,
    );
    console.log(hash);
    return;
  }
  if (action === "snapshot") {
    if (flags.aria !== true) throw new Error("snapshot requires --aria");
    if (!flags.path) throw new Error("snapshot requires --path");
    const file = path.resolve(repoRoot, flags.path);
    await fs.mkdir(path.dirname(file), { recursive: true });
    const text = await withPage(meta, async (cdp) => {
      await cdp.send("Accessibility.enable");
      const tree = await cdp.send("Accessibility.getFullAXTree");
      const nodes = tree.nodes ?? [];
      const byId = new Map(nodes.map((node) => [node.nodeId, node]));
      const children = new Map();
      const roots = [];
      for (const node of nodes) {
        const parent = node.parentId ? byId.get(node.parentId) : undefined;
        if (!parent) roots.push(node.nodeId);
        else {
          const list = children.get(parent.nodeId) ?? [];
          list.push(node.nodeId);
          children.set(parent.nodeId, list);
        }
      }
      const lines = [];
      const walk = (id, depth) => {
        const node = byId.get(id);
        if (!node) return;
        const role = node.role?.value ?? "";
        const name = node.name?.value ?? "";
        if (role && name && role !== "generic" && role !== "none" && role !== "InlineTextBox") {
          const extras = (node.properties ?? [])
            .filter((prop) => ["pressed", "expanded", "level"].includes(prop.name))
            .map((prop) => `${prop.name}=${prop.value?.value}`)
            .join(" ");
          lines.push(`${"  ".repeat(depth)}${role} ${JSON.stringify(name)}${extras ? ` ${extras}` : ""}`);
        }
        for (const child of children.get(id) ?? []) walk(child, depth + 1);
      };
      for (const root of roots) walk(root, 0);
      return `${lines.join("\n")}\n`;
    });
    await fs.writeFile(file, text);
    console.log(file);
    return;
  }
  if (action === "screenshot") {
    if (!flags.path) throw new Error("screenshot requires --path");
    const file = path.resolve(repoRoot, flags.path);
    await fs.mkdir(path.dirname(file), { recursive: true });
    const image = await withPage(meta, async (cdp) => {
      await cdp.send("Page.enable");
      const shot = await cdp.send("Page.captureScreenshot", { format: "png" });
      return shot.data;
    });
    await fs.writeFile(file, Buffer.from(image, "base64"));
    console.log(file);
    return;
  }
  throw new Error(`unknown browser action ${action}`);
}

const usage = `usage:
  verify-decisions.mjs launch
  VERIFY_RUN_DIR=... verify-decisions.mjs doctor
  VERIFY_RUN_DIR=... verify-decisions.mjs browser wait --role heading --name "..."
  VERIFY_RUN_DIR=... verify-decisions.mjs browser click --role button --name "..."
  VERIFY_RUN_DIR=... verify-decisions.mjs browser hash
  VERIFY_RUN_DIR=... verify-decisions.mjs browser pressed --name "..."
  VERIFY_RUN_DIR=... verify-decisions.mjs browser attr --decision <id> --attr <name>
  VERIFY_RUN_DIR=... verify-decisions.mjs browser scroll --decision <id>
  VERIFY_RUN_DIR=... verify-decisions.mjs browser navigate --hash <hash-without-#>
  VERIFY_RUN_DIR=... verify-decisions.mjs browser snapshot --aria --path <repo-relative>
  VERIFY_RUN_DIR=... verify-decisions.mjs browser screenshot --path <repo-relative>
  VERIFY_RUN_DIR=... verify-decisions.mjs cleanup`;

async function main() {
  const { positionals, flags } = parseArgs(process.argv.slice(2));
  const command = positionals[0];
  if (command === "launch") await launch();
  else if (command === "doctor") await doctor();
  else if (command === "cleanup") await cleanup();
  else if (command === "browser") await browser(positionals[1] ?? "", flags);
  else {
    fail(usage);
  }
}

main().catch((error) => {
  fail(error instanceof Error ? error.message : String(error));
});
