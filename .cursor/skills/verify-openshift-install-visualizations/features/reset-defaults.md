# Reset to defaults

Reset to defaults clears the URL hash and returns every visible choice to the catalog default, including DHCP under host addressing.

## Sub-features

- `reset-clear-hash` removes `host-addressing=static` from the hash.
- `reset-dhcp` presses DHCP again and marks NIC layout inactive.

## How to get to it (user POV)

- Choose the `Reset to defaults` button in the page header. It is on every view of the tree.

## Driving it with verify-decisions

Preconditions:

- `doctor` prints `ok` and `heading Agent-based bare metal decisions`.
- The page is already on static addressing: `browser hash` prints `host-addressing=static`. Follow [Static addressing](./static-addressing.md) first when the hash is empty.

- **Reset.** Choose `Reset to defaults`. Run `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser click --role button --name "Reset to defaults"`. The command prints a blank line.
- **DHCP is selected again.** Run `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser pressed --name "DHCP"`. It prints `true`. Run `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser pressed --name "Static NMState"`. It prints `false`.
- **NIC layout is inactive again.** Run `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser attr --decision nic-layout --attr data-active`. It prints `false`.
- **Proof.** Run `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser scroll --decision host-addressing`, `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser snapshot --aria --path artifacts/verify/reset-defaults/tree.aria.txt`, and `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser screenshot --path artifacts/verify/reset-defaults/tree.png`. The snapshot contains `button "Reset to defaults"` and `button "DHCP" pressed=true`.

## Gotchas

- Reset only clears the hash. It does not reload the document. Wait for `browser click` to print the new hash, which is empty.
- On the default page, Reset is a no-op. The click prints a blank line either way, so prove it from a non-default hash.
- `NIC bond` remains on the page after reset. Check `data-active`, not the presence of that button.
