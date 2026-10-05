# Shared link

Opening the app URL with `#host-addressing=static` selects Static NMState and activates NIC layout without a click on that button.

## Sub-features

- `link-hash` loads `host-addressing=static` from the URL.
- `link-pressed` presses Static NMState.
- `link-nic-active` marks NIC layout active.

## How to get to it (user POV)

- Open the app URL with the hash `#host-addressing=static`.
- Paste that hash onto the current page and load it.

## Driving it with verify-decisions

Preconditions:

- `doctor` prints `ok` and `heading Agent-based bare metal decisions`.
- Start from the default page so the navigation is what changes the choice. `browser hash` prints a blank line.

- **Open the shared hash.** Run `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser navigate --hash "host-addressing=static"`. The command prints `host-addressing=static`.
- **The option is pressed.** Run `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser pressed --name "Static NMState"`. It prints `true`.
- **NIC layout is active.** Run `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser attr --decision nic-layout --attr data-active`. It prints `true`.
- **Proof.** Run `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser scroll --decision host-addressing`, `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser snapshot --aria --path artifacts/verify/shared-link/tree.aria.txt`, and `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser screenshot --path artifacts/verify/shared-link/tree.png`. The snapshot contains `button "Static NMState" pressed=true` and `heading "NIC layout"`.

## Gotchas

- `browser navigate` is the user path of loading the hash. Do not set React state from the catalog API.
- Pass the hash without a leading `#`. The command rejects a value that starts with `#`.
- A hash that names an unknown decision is ignored by the page and the walk stays on defaults. This recipe uses only `host-addressing=static`.
- Reloading the same hash does not prove the entry point. Start from an empty hash.
