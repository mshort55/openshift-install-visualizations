---
name: verify-openshift-install-visualizations
description: Verify Journey, Solution example, Choices and Prerequisites in the combined OpenShift app using disposable Vite and headless Chrome. Use for page navigation, retained state, shared links, decision-tree changes, or responsive layouts.
---

# Verify the installation app

Run commands from the repository root. Install dependencies with `npm ci` when `node_modules/vite` is missing.

## Combined-app verification

```bash
npm run verify:browser
```

This launches disposable Vite and Chrome processes, drives the real UI and cleans up in `finally`. Completion requires the `PASS` line and exit code 0. Solution coverage follows the guided story through phase gates, DNS request/fulfillment/verification with retained retries, both boot routes and required post-installation failure/recovery. Page and contextual navigation retain session progress; reload starts a new simulation. Existing Journey, Choices and Network prep coverage remains part of the same run.

Screenshots remain under `artifacts/verify/combined-app/`. Inspect the Solution phase navigation, DNS evidence, manual boot and failure states at 320, 390, 768 and 1440 pixels, plus enlarged text. Overflow assertions alone do not establish readability. Read [Solution example: guided installation journey](features/solution-example.md) for the focused recipe and exact screenshot targets.

After `npm run build`, run `VERIFY_PRODUCTION=1 npm run verify:browser` to exercise the same entry and direct routes against Vite production preview. This mode uses the same disposable-process cleanup.

The first run downloads Chrome for Testing to this skill's ignored `cache/` directory. The app has no login, database or external runtime service.

## Focused Choices session

```bash
node .agents/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs launch
```

Launch prints `VERIFY_RUN_DIR=/tmp/verify-openshift-install-visualizations-<id>` and `URL=http://127.0.0.1:<port>/`. Export the run directory before later commands. It starts the combined app and opens `#/choices`; the root URL itself opens Journey. Use only the processes created by this launch.

```bash
VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .agents/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs doctor
```

Doctor requires running Vite/Chrome processes and the heading `Install options`. It checks the served HTML title `OpenShift Bare-metal Installation Journey`; the browser document title changes with the active page. Run doctor before a Choices recipe or after a failed command. Navigate back to Choices before running doctor if you visited Journey.

Read [the feature map](features/README.md), then follow the matching recipe. Option buttons expose accessible names, `aria-pressed`, `data-decision`, and `data-option`. Decisions expose `data-active`.

```bash
VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .agents/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser click --role button --name "See every option"
VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .agents/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser click --role button --name "Static NMState"
VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .agents/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser hash
VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .agents/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser pressed --name "Static NMState"
VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .agents/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser attr --decision nmstate-ethernet --attr data-active
```

Hashes print without `#`. No answers in Step through is `/choices`; See every option is `/choices?mode=map`. The document search is empty. Clear choices preserves the page and mode while removing answers. Legacy `#decision=option` links are still accepted; a full load normalizes them to the Choices route.

## Evidence

Capture the action and result: hash, pressed state, active decision, ARIA snapshot, and screenshot. Exercise each relevant entry point through the rendered UI.

```bash
VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .agents/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser snapshot --aria --path artifacts/verify/<feature>/page.aria.txt
VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .agents/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser screenshot --path artifacts/verify/<feature>/page.png
```

Report a failed or unreachable entry point with its attempted command and unmet condition. Preserve artifacts when cleaning up.

## Cleanup

```bash
VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .agents/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs cleanup
```

Cleanup stops only this run's process groups and removes its temporary directory. A failed launch cleans itself up. `npm run verify:browser` cleans up automatically when it owns the run; with an existing `VERIFY_RUN_DIR`, the caller retains responsibility for cleanup.
