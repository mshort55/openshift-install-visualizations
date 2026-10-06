# Static addressing

In See every option, choosing Static NMState records that choice, presses the button, and marks the ethernet interface decision active. The window stays at the same scroll position.

## Sub-features

- `static-select` presses Static NMState and leaves DHCP unpressed.
- `static-hash` adds `host-addressing=static` to the hash.
- `static-nic-active` marks the ethernet interface decision active.
- `static-scroll` keeps `window.scrollY` after the click.

## How to get to it (user POV)

- Choose `See every option`, scroll to Host addressing, and choose `Static NMState`.

## Driving it with verify-decisions

Preconditions:

- `doctor` prints `ok` and `heading Agent-based bare metal decisions`.
- Start from Step through with an empty hash.

- **Show every option.** Choose `See every option`. Run `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser click --role button --name "See every option"`. Then run `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser search`. It prints `?view=map`.
- **Move down the page.** Run `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser scroll-by --y 1800`. Then run `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser scroll-y`. It prints `1800`.
- **Choose static addressing.** Run `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser click --role button --name "Static NMState"`. The command prints a hash that contains `host-addressing=static`.
- **The window did not jump.** Run `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser scroll-y`. It still prints `1800`.
- **Confirm the pressed option.** Run `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser pressed --name "Static NMState"`. It prints `true`. Run `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser pressed --name "DHCP"`. It prints `false`.
- **Confirm the ethernet interface decision opened.** Run `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser attr --decision nmstate-ethernet --attr data-active`. It prints `true`.
- **Proof.** Run `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser snapshot --aria --path artifacts/verify/static-addressing/tree.aria.txt` and `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser screenshot --path artifacts/verify/static-addressing/tree.png`. The snapshot contains `button "Static NMState" pressed=true` and `heading "Ethernet interface"`.

## Gotchas

- Step through does not show Host addressing until every earlier reachable decision has a choice. Use See every option to reach it directly.
- Other answers to a question stay full color until one of them is selected. After that, the ones you did not pick are greyed. An option whose decision is not active is disabled.
- Clicking `Static NMState` again prints the same hash and does not return to DHCP.
- Step through keeps every answer to the current question on the page. Choosing one reveals the next decision. It does not remove the other answers to the same question.
