# Clear choices

Clear choices removes every answer from the URL hash. No option is pressed afterward. The current mode stays.

## Sub-features

- `clear-hash` removes `host-addressing=static` from the hash.
- `clear-unselected` leaves Static NMState unpressed.

## How to get to it (user POV)

- Choose the `Clear choices` button in the page header.

## Driving it with verify-decisions

Preconditions:

- `doctor` prints `ok` and `heading Agent-based bare metal decisions`.
- The hash contains `host-addressing=static`. Follow [Static addressing](./static-addressing.md) first when the hash is empty.

- **Clear.** Choose `Clear choices`. Run `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser click --role button --name "Clear choices"`. The command prints a blank line.
- **Static is not selected.** Run `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser pressed --name "Static NMState"`. It prints `false` when that button is still on the page. In Step through the button is gone, and the command fails with `expected 1 button`.
- **Proof.** Run `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser snapshot --aria --path artifacts/verify/reset-defaults/tree.aria.txt` and `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser screenshot --path artifacts/verify/reset-defaults/tree.png`. The snapshot contains `button "Clear choices"` and does not contain `pressed=true` on `Static NMState`.

## Gotchas

- Clear choices does not switch modes. `?view=map` remains if See every option was on.
- On an empty hash, Clear choices prints a blank line and changes nothing.
- Step through after a clear shows only CPU architecture.
