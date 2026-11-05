# Step through

Choices opens in Step through. No option is pressed. Only CPU architecture is on the page, because later decisions stay hidden until the ones before them have a choice.

## Sub-features

- `default-heading` shows the page heading.
- `default-unselected` leaves every option unpressed, including `x86_64`.
- `default-hash` keeps the URL hash at `#/choices`.
- `default-first-only` hides the ethernet interface decision until earlier decisions are answered.

## How to get to it (user POV)

- Open `#/choices` at the app URL from launch.

## Driving it with verify-decisions

Preconditions:

- `doctor` prints `ok` and `heading Install options`.
- `browser hash` prints `/choices`.
- `browser search` prints a blank line.

- **Open the page.** Run `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .agents/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser wait --role heading --name "Install options"`. The command prints `found heading Install options`.
- **Nothing is selected.** Run `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .agents/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser pressed --name "x86_64"`. It prints `false`.
- **The ethernet interface decision is not on the page yet.** Run `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .agents/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser attr --decision nmstate-ethernet --attr data-active`. The command prints a blank line because that decision is not rendered.
- **Proof.** Run `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .agents/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser snapshot --aria --path artifacts/verify/default-path/tree.aria.txt` and `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .agents/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser screenshot --path artifacts/verify/default-path/tree.png`. The snapshot contains `heading "Install options"`, `button "Step through" pressed=true`, and `button "x86_64" pressed=false`. It does not contain `button "NIC bond"`.

## Gotchas

- `Step through` is pressed. That is the mode control, not a catalog choice. Catalog options use `aria-pressed="false"` until the user clicks one.
- The `#/choices` route without answer parameters means no answers. It does not select catalog defaults.
- `x86_64` is the first architecture option. Choosing it writes `architecture=amd64` even though that value is the catalog default.
