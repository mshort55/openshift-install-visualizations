# Step through

The first page is Step through. No option is pressed. Only CPU architecture is on the page, because later decisions stay hidden until the ones before them have a choice.

## Sub-features

- `default-heading` shows the page heading.
- `default-unselected` leaves every option unpressed, including `x86_64`.
- `default-hash` leaves the URL hash empty.
- `default-first-only` hides the ethernet interface decision until earlier decisions are answered.

## How to get to it (user POV)

- Open the app URL from launch with no hash and no `view` query.

## Driving it with verify-decisions

Preconditions:

- `doctor` prints `ok` and `heading Agent-based bare metal decisions`.
- `browser hash` prints a blank line.
- `browser search` prints a blank line.

- **Open the page.** Run `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser wait --role heading --name "Agent-based bare metal decisions"`. The command prints `found heading Agent-based bare metal decisions`.
- **Nothing is selected.** Run `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser pressed --name "x86_64"`. It prints `false`.
- **The ethernet interface decision is not on the page yet.** Run `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser attr --decision nmstate-ethernet --attr data-active`. The command fails because that decision is not rendered.
- **Proof.** Run `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser snapshot --aria --path artifacts/verify/default-path/tree.aria.txt` and `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser screenshot --path artifacts/verify/default-path/tree.png`. The snapshot contains `heading "Agent-based bare metal decisions"`, `button "Step through" pressed=true`, and `button "x86_64" pressed=false`. It does not contain `button "NIC bond"`.

## Gotchas

- `Step through` is pressed. That is the mode control, not a catalog choice. Catalog options use `aria-pressed="false"` until the user clicks one.
- An empty hash means no answers. It does not select catalog defaults.
- `x86_64` is the first architecture option. Choosing it writes `architecture=amd64` even though that value is the catalog default.
