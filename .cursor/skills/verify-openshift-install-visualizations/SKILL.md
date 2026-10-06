---
name: verify-openshift-install-visualizations
description: Drive the OpenShift agent-based bare metal decision-tree web UI in a disposable Vite session and headless Chrome. Use when proving a user-visible change to the tree, a selected option, the URL hash, scroll position, or Clear choices.
---

# Verify the decision tree

The app is one client-rendered page. State lives in the URL hash. There is no login, no seed data, and no second product surface.

Run every command from the repository root. Paths below are relative to that root. The harness resolves them from its own location, so a different working directory still targets this repo, but keep the root so the printed paths match.

## Launch

Install dependencies first when `node_modules/vite` is missing:

```bash
npm install
```

`npm install` must finish with `found 0 vulnerabilities` and no `install-scripts` warning. `esbuild@0.28.2` is already listed in `package.json` `allowScripts` because Vite needs its postinstall to fetch the platform binary.

Start a disposable instance:

```bash
node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs launch
```

Launch picks a free Vite port starting at `4173` and a free Chrome DevTools port starting at `9333`, starts `npm run dev -- --host 127.0.0.1 --port <port> --strictPort`, downloads Chrome for Testing `154.0.8037.92` headless shell for this machine's architecture on first use (cache: `.cursor/skills/verify-openshift-install-visualizations/cache/`), and opens the app. It is ready when it prints:

```text
VERIFY_RUN_DIR=/tmp/verify-openshift-install-visualizations-<id>
URL=http://127.0.0.1:<port>/
```

Export `VERIFY_RUN_DIR` from that line before any later command. The page is ready when the heading `Agent-based bare metal decisions` is present. Launch waits for that heading before it prints the lines above.

A second launch uses another port, another DevTools port, and another Chrome profile. Do not drive a Vite process you did not start with this command.

## Doctor

```bash
VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs doctor
```

A healthy instance prints `ok`, then `url`, `title Bare metal install decisions`, `heading Agent-based bare metal decisions`, and the Vite and Chrome pids from this run. Anything else means the instance is not worth driving. Run doctor before a feature recipe and again when a later command fails.

## Drive

The harness is `verify-decisions.mjs`. Prefer the accessible name and the `data-decision` attribute over coordinates. Option buttons expose `aria-label` set to the choice label (`Static NMState`, `DHCP`, `NIC bond`) and `aria-pressed`. Each decision is an article with `data-decision="<id>"` and `data-active="true"` or `data-active="false"`.

```bash
node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser wait --role heading --name "Agent-based bare metal decisions"
node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser click --role button --name "Static NMState"
node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser hash
node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser pressed --name "Static NMState"
node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser attr --decision nmstate-ethernet --attr data-active
node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser scroll --decision host-addressing
node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser scroll-by --y 800
node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser scroll-y
node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser box --role button --name "Static NMState"
node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser search
node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser navigate --hash "host-addressing=static"
node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser snapshot --aria --path artifacts/verify/<feature>/<name>.aria.txt
node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser screenshot --path artifacts/verify/<feature>/<name>.png
```

Prefix browser, doctor, and cleanup commands with `VERIFY_RUN_DIR="$VERIFY_RUN_DIR"`. `browser hash` and `browser click` print the hash without a leading `#`. An empty line means no answers. `browser click` prints the hash after the page applies the choice. `browser scroll-y` prints `window.scrollY`. `browser search` prints `location.search`, which is `?view=map` in See every option and empty in Step through.

The feature map is the source of which entry points to drive. A proof that uses one entry point does not cover the others listed in that feature.

## Evidence

Write proof under `artifacts/verify/<feature>/`. Cleanup must not delete that directory.

A proof exercises the page a user opens. Do not call `walk`, `withAnswer`, or any other catalog function as a substitute for a click or a hash navigation.

Capture the action and the resulting state: the hash before the click, the hash the click prints, `aria-pressed` on the chosen button, and `data-active` on the decision that choice opens. Then write an ARIA snapshot and a screenshot that show the same choice. The snapshot lists named accessibility nodes as `role "name"` plus `pressed` or `level` when Chrome reports them.

There is no external service to mock. The catalog is the JSON bundled into the page. There is no dry-run mode.

## Cleanup

```bash
VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs cleanup
```

Cleanup sends `SIGTERM` to the Vite and Chrome process groups recorded in that run's `meta.json`, then deletes the run directory. It does not signal processes by name and it does not remove `artifacts/verify/` or the Chrome cache.

Run cleanup after a failed launch too. Launch already does that when startup fails. If you kill the harness yourself mid-run, run cleanup with the printed `VERIFY_RUN_DIR` so the ports are released.

## Helpers

`.cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs` is the only helper. Invoke it as shown in Launch, Doctor, Drive, and Cleanup. `launch` prints `VERIFY_RUN_DIR` and `URL`. `doctor` prints the health lines. `browser click` and `browser hash` print the hash without `#`. `browser pressed` prints `true` or `false`. `browser attr` prints the attribute value. `browser snapshot` and `browser screenshot` print the absolute file path they wrote.
