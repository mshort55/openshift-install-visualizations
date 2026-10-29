import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { expect, test } from "vitest";

const root = fileURLToPath(new URL("..", import.meta.url));

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function viaText(via: unknown): string {
  if (!Array.isArray(via)) return "";
  const parts: string[] = [];
  for (const item of via) {
    if (typeof item === "string") {
      parts.push(item);
      continue;
    }
    if (!isRecord(item)) continue;
    const title = typeof item.title === "string" ? item.title : "";
    const url = typeof item.url === "string" ? item.url : "";
    if (title && url) parts.push(`${title} (${url})`);
    else if (title) parts.push(title);
    else if (url) parts.push(url);
  }
  return parts.join("; ");
}

function findingLines(report: Record<string, unknown>): string[] {
  const vulnerabilities = report.vulnerabilities;
  if (!isRecord(vulnerabilities)) return [];
  const lines: string[] = [];
  for (const [name, info] of Object.entries(vulnerabilities)) {
    if (!isRecord(info)) {
      lines.push(`unknown ${name}`);
      continue;
    }
    const severity =
      typeof info.severity === "string" ? info.severity : "unknown";
    const detail = viaText(info.via);
    lines.push(
      detail ? `${severity} ${name}: ${detail}` : `${severity} ${name}`,
    );
  }
  lines.sort();
  return lines;
}

function vulnerabilityTotal(report: Record<string, unknown>): number {
  const metadata = report.metadata;
  if (!isRecord(metadata) || !isRecord(metadata.vulnerabilities)) {
    throw new Error("npm audit JSON is missing metadata.vulnerabilities");
  }
  const total = metadata.vulnerabilities.total;
  if (typeof total !== "number") {
    throw new Error("npm audit JSON is missing a vulnerability total");
  }
  return total;
}

function auditReport(): string {
  try {
    return execFileSync(
      "npm",
      ["audit", "--package-lock-only", "--json", "--audit-level=info"],
      {
        cwd: root,
        encoding: "utf8",
        timeout: 30_000,
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
  } catch (error) {
    if (
      !isRecord(error) ||
      typeof error.stdout !== "string" ||
      error.stdout.length === 0
    ) {
      const stderr =
        isRecord(error) && typeof error.stderr === "string"
          ? error.stderr.trim()
          : "";
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(stderr ? `${message}\n${stderr}` : message);
    }
    return error.stdout;
  }
}

function auditFindings(): string[] {
  const parsed: unknown = JSON.parse(auditReport());
  if (!isRecord(parsed))
    throw new Error("npm audit did not return a JSON object");
  const total = vulnerabilityTotal(parsed);
  const lines = findingLines(parsed);
  if (total === 0) return lines;
  if (lines.length > 0) return lines;
  return [`${total} vulnerabilities with no package details`];
}

test("package-lock.json has no known vulnerabilities", () => {
  expect(auditFindings()).toEqual([]);
}, 45_000);
