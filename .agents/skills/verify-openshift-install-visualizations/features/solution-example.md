# Solution example: connected installation journey

One editable, browser-saved deployment connects preparation, Agent-based installation, selected infrastructure capabilities, customer Ansible configuration and readiness checks. Phase inspection is separate from execution. External operations are simulated; successful cluster installation alone cannot complete the journey.

## Sub-features

- `entry`: agent-based rationale, New deployment and a visible undemonstrated Start from template option.
- `preparation`: incomplete editable inputs and prerequisite drafts autosave; owner fulfillment and execution dependencies remain distinct.
- `dns`: requests derive from current inputs; fulfillment does not verify DNS; evidence names the probe, resolver, records and protocols.
- `boot`: default automated media/Redfish boot, or named local task followed by an explicit Agent observation; both reach the same installation outcome.
- `operators`: five conditional examples with Installed → Configured → Ready; external storage for two workers; Virtualization depends on storage and NMState configuration depends on the customer hook.
- `hooks`: customer-authored pre/post jobs on existing Ansible infrastructure, separate from proposed Red Hat checks and smoke tests.
- `recovery`: operator install/configuration, hook and check failures affect the journey while preserving cluster success; targeted retries retain failed attempts and earlier results.
- `template`: completed plans can be named and saved without cluster bindings, progress or evidence; storage failures never produce a saved confirmation.
- `context`: page switches, nested contextual returns, Back/Forward, legacy links and location-only sharing retain their navigation contracts.
- `layouts`: keyboard controls, live status, 320/390/768/1440 widths, enlarged text and reduced motion.

## How to get to it (user POV)

- Choose **Solution example** in the header, then **New deployment**.
- Follow **See this in the solution example** from Journey or Network prep.
- Open `#/solution-example?chapter=<action>` with introduction, preparation, dns, pre-hooks, preflight, installation, operators, post-hooks, readiness or reuse.
- Legacy `chapter=handoff` opens infrastructure readiness and evidence. No handoff activity remains in this example.
- Follow related guidance and destination-specific Return links; use browser Back/Forward.

## Driving it with verify-decisions

Preconditions: dependencies installed according to the parent skill. Run commands from the repository root. The combined verification owns and cleans up its disposable Vite and Chrome processes.

- **Connected flow:** Run `npm run verify:browser`. Require the connected Solution coverage in its `PASS` line and exit code 0. The recipe enters through the actual controls, reloads partial inputs and prerequisite drafts, checks future-phase inspection, fulfills and verifies DNS separately, runs customer preparation and preflight, then installs through the automated route.
- **Dependencies and failures:** The same command varies the operator selection, proves storage/Virtualization dependencies, and exercises failed operator installation, configuration and customer hooks. It then fails a VM guest network check, verifies retained successful installation and cleanup evidence, records a correction, and reruns affected checks. Require both failed and passing attempts to remain visible.
- **Saving and reset:** The recipe saves a named customized template, injects a browser-storage write error to check the unsaved message, retries saving, reloads, and checks the saved plan excludes deployment fields and outcomes. Reset must leave an unrelated browser-storage marker intact. It then completes the local boot route with a smaller selected plan.
- **Navigation and access:** The recipe uses keyboard activation for entry, disclosures, boot selection and recovery; checks live status semantics; follows nested Solution → Journey → Network prep returns with exact reading restoration; and exercises clipboard success/fallback and legacy links.
- **Production:** Run `npm run build`, then `VERIFY_PRODUCTION=1 npm run verify:browser`. Require the same `PASS` result against the built app.
- **Visual evidence:** Inspect `artifacts/verify/combined-app/solution-{operators,storage,manual,pre-hooks,post-hooks,failure,evidence}-{320,390,768,1440}.png` and the corresponding `solution-*-enlarged-*.png` files. Require readable operator dependencies, local steps/BMC addresses, hook purpose/owner/location/inputs, failure diagnosis, attempt history and cleanup, with unclipped controls and no page overflow. `solution-opening-1440.png`, `solution-complete-1440.png` and `solution-local-complete-1440.png` show the entry and end states.

## Gotchas

- Browser storage belongs only to this demonstration. `Reset example` resets its journey and saved template; it does not clear other app/browser keys.
- Fresh documents restore saved execution. Shared URLs carry reading selection only and recipients use their own saved state.
- Inputs and selections freeze once installation starts. Reset is the explicit replay action. Inspecting alternate instructions cannot change recorded execution.
- Manual boot waits for the explicit simulated Agent observation. Instructions and owner reports are not proof of boot.
- Configuration supplied by a hook cannot become Ready before that hook and verification pass. An already-present CSI integration still needs configuration and checks.
- A correction report alone leaves the journey Failed. Only a successful affected rerun resolves it; template saving is never required for completion.
- Screenshots remain in ignored artifacts. Cleanup only the disposable processes created by the verification run, following the parent skill.
