# Static addressing

Choosing static host addressing selects that option, records it in the URL hash, and makes the NIC layout decision active. NIC bond, VLAN, and SR-IOV stay visible under that layout.

## Sub-features

- `static-select` presses Static NMState and unpresses DHCP.
- `static-hash` sets the hash to `host-addressing=static`.
- `static-nic-active` marks the NIC layout decision active.

## How to get to it (user POV)

- On the default page, under Host addressing, choose the `Static NMState` button.

## Driving it with verify-decisions

Preconditions:

- `doctor` prints `ok` and `heading Agent-based bare metal decisions`.
- Start from the default page. `browser hash` prints a blank line and `browser pressed --name "DHCP"` prints `true`.

- **Record the starting hash.** Run `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser hash`. The printed line is empty.
- **Choose static addressing.** Choose `Static NMState`. Run `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser click --role button --name "Static NMState"`. The command prints `host-addressing=static`.
- **Confirm the pressed option.** Run `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser pressed --name "Static NMState"`. It prints `true`. Run `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser pressed --name "DHCP"`. It prints `false`.
- **Confirm NIC layout opened.** Run `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser attr --decision nic-layout --attr data-active`. It prints `true`.
- **Proof.** Scroll host addressing into view so the selected option and the NIC layout are on screen. Run `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser scroll --decision host-addressing`, `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser snapshot --aria --path artifacts/verify/static-addressing/tree.aria.txt`, and `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser screenshot --path artifacts/verify/static-addressing/tree.png`. The snapshot contains `button "Static NMState" pressed=true`, `heading "NIC layout"`, and `button "NIC bond"`.

## Gotchas

- The NIC layout article is already in the document while DHCP is selected. Activation is `data-active="true"`, not the first appearance of `NIC bond`.
- The button's accessible name is `Static NMState`. The summary sentence is not part of the name.
- Clicking `Static NMState` again after it is selected prints the same hash and does not toggle back to DHCP.
- `Single interface` is the default NIC layout once static addressing is selected. The hash stays `host-addressing=static` and does not gain a `nic-layout` entry until a non-default layout is chosen.
