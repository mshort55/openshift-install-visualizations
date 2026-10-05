# Default path

The first page shows the agent-based bare metal tree with catalog defaults selected and the branches those defaults do not take still visible underneath the unselected options.

## Sub-features

- `default-heading` shows the page heading.
- `default-dhcp` leaves DHCP pressed and Static NMState unpressed.
- `default-hash` leaves the URL hash empty.
- `default-idle-nic` keeps NIC layout inactive while still showing NIC bond under Static NMState.

## How to get to it (user POV)

- Open the app URL from launch with no hash.

## Driving it with verify-decisions

Preconditions:

- `doctor` prints `ok` and `heading Agent-based bare metal decisions`.
- The hash is empty. Run `browser hash` and expect a blank line.

- **Open the page.** Launch already navigated here. Run `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser wait --role heading --name "Agent-based bare metal decisions"`. The command prints `found heading Agent-based bare metal decisions`.
- **DHCP is selected.** Run `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser pressed --name "DHCP"`. It prints `true`.
- **Static is not selected.** Run `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser pressed --name "Static NMState"`. It prints `false`.
- **NIC layout stays inactive.** Run `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser attr --decision nic-layout --attr data-active`. It prints `false`.
- **Proof.** Scroll the host addressing decision into view, then capture the tree. Run `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser scroll --decision host-addressing`, `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser snapshot --aria --path artifacts/verify/default-path/tree.aria.txt`, and `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser screenshot --path artifacts/verify/default-path/tree.png`. The snapshot contains `heading "Agent-based bare metal decisions"`, `button "DHCP" pressed=true`, `button "Static NMState" pressed=false`, and `button "NIC bond"`.

## Gotchas

- `NIC bond` and `SR-IOV` are on the default page under the unselected Static NMState branch. Seeing that text does not mean static addressing is selected. Check `data-active` on `nic-layout`.
- The hash of the default walk is empty because default answers are omitted. Do not expect a query string.
- The first HTTP response is the document title `Bare metal install decisions` and an empty `#root`. Wait for the heading before reading buttons.
