# Decision tree verification map

This directory is the maintained source for verifying the user-facing behavior of the agent-based bare metal decision tree. Read the index before driving the app, then use the matching feature file as the recipe.

## Baseline preconditions

- Launch with `node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs launch` and export the printed `VERIFY_RUN_DIR`.
- The page URL is the `URL=` line from that launch. It is `http://127.0.0.1:<port>/` on a port chosen for this run, starting from `4173`.
- There is no account and no seeded database. An empty hash selects nothing.
- Run `doctor` and require `ok`, the title `Bare metal install decisions`, and the heading `Agent-based bare metal decisions`.
- Never drive a Vite or Chrome process that this launch did not start.

## Driving conventions

- Start every recipe from the default page unless its preconditions say otherwise.
- Prefer the accessible name (`aria-label` on option buttons) and `data-decision` over CSS selectors or screen position.
- Treat every command as literal. Keep quoted names and flags unchanged.
- Run browser actions through `verify-decisions.mjs browser` with `VERIFY_RUN_DIR` set.
- Leave `artifacts/verify/` in place during cleanup.

## Proof and skip reporting

- Capture the user action and the resulting state, not only the final screen.
- UI proof includes the hash, `aria-pressed`, `data-active` when a choice opens a later decision, an ARIA snapshot, and a screenshot that shows the app heading or the decision that changed.
- Record the feature ID and entry point used with every artifact.
- Report an unreachable path with the attempted command and the unmet precondition.
- Do not report a skipped entry point as verified through a different path.

## Feature entry contract

Each feature file starts with an H1 title and one paragraph describing the user-visible behavior. It then uses exactly four H2 sections in this order.

1. `Sub-features` lists short IDs with one line for each behavior.
2. `How to get to it (user POV)` lists every user entry point.
3. `Driving it with verify-decisions` starts with `Preconditions:` and uses labeled bullets that pair each user action with an exact command and observable result.
4. `Gotchas` lists traps that can waste or invalidate a verification run.

## Features

- [Step through](./default-path.md) covers the first page: nothing pressed, only CPU architecture, empty hash.
- [Static addressing](./static-addressing.md) covers See every option, choosing Static NMState, and keeping the scroll position.
- [Clear choices](./reset-defaults.md) covers the header control that clears the hash.
- [Shared link](./shared-link.md) covers opening a hash URL without clicking the option.
