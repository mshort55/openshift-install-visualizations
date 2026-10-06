# Shared link

Opening the app URL with `#host-addressing=static` selects Static NMState. Step through still shows the first unanswered decision, CPU architecture, and it also shows the stored Host addressing choice.

## Sub-features

- `link-hash` loads `host-addressing=static` from the URL.
- `link-pressed` presses Static NMState.
- `link-gap` still shows CPU architecture because it has no answer yet.

## How to get to it (user POV)

- Open the app URL with the hash `#host-addressing=static`.
- Paste that hash onto the current page and load it.

## Driving it with verify-decisions

Preconditions:

- `doctor` prints `ok` and `heading Agent-based bare metal decisions`.
- Start from an empty hash so the navigation is what changes the choice.

- **Open the shared hash.** Run `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser navigate --hash "host-addressing=static"`. The command prints `host-addressing=static`.
- **The option is pressed.** Run `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser pressed --name "Static NMState"`. It prints `true`.
- **The first open decision is still there.** Run `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser pressed --name "x86_64"`. It prints `false`.
- **Proof.** Run `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser snapshot --aria --path artifacts/verify/shared-link/tree.aria.txt` and `VERIFY_RUN_DIR="$VERIFY_RUN_DIR" node .cursor/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs browser screenshot --path artifacts/verify/shared-link/tree.png`. The snapshot contains `button "Static NMState" pressed=true` and `button "x86_64" pressed=false`.

## Gotchas

- Pass the hash without a leading `#`.
- Step through hides unanswered decisions that sit between the first gap and a stored later choice. Platform stays hidden in this recipe. Host addressing stays visible because it has an answer.
- A hash for an unknown decision is ignored.
- An explicit catalog default stays in the hash. `architecture=amd64` is kept after choosing `x86_64`.
