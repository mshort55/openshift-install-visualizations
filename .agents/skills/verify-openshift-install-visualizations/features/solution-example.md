# Solution example: guided installation journey

One illustrative cluster connects preparation, Agent-based installation and infrastructure readiness. The current phase follows execution; chapter inspection is independent. This is the sole Solution example in both development and production.

## Sub-features

- `entry`: the main Solution example card opens the guided story; there is no separate prototype page or old deployment/template interface.
- `phases`: current, complete and blocked states; stable labels while selecting chapters; future chapters previewable with disabled start actions.
- `dns`: generation reveals a copyable request; fulfillment adds a report; verification adds scoped evidence. Failed and passing attempts remain inspectable after correction.
- `preparation`: incomplete work can be saved for the session; DNS verification alone leaves boot access and the required pre-hook pending.
- `boot`: automated boot or guided manual fallback; operator report and installation completion remain separate.
- `recovery`: required post-installation failure affects overall status while earlier phases retain checks; repair and retry complete the journey.
- `navigation`: progress survives page switches and context returns; history and shared URLs change reading selection only; reload resets execution.
- `layouts`: keyboard access, live status, stable navigation text, 320/390/768/1440 widths and enlarged text.

## How to get to it (user POV)

- Choose **Solution example** in the main header.
- Follow **See this in the solution example** from Journey or Network prep.
- Open `#/solution-example?phase=pre`, `phase=install` or `phase=post`.
- Former `chapter=` links and `#/guided-story-prototype?phase=...` redirect to this page.
- Use the opportunity-catalog link, contextual Return links and browser Back/Forward.

## Driving it with verify-decisions

Preconditions: dependencies installed according to the parent skill. Run commands from the repository root. The combined verifier owns and cleans up its disposable Vite and Chrome processes.

- **Connected flow:** Run `npm run verify:browser`. Require the Guided Solution coverage in its PASS line and exit code 0. The recipe generates and copies a request, saves incomplete work, switches pages, simulates fulfillment, fails DNS verification, corrects it and checks both attempts remain.
- **Phase gates:** The same recipe requires DNS success to leave preparation at 4/5. Only boot resolution and the pre-hook unlock installation. Boot observation cannot unlock post-installation. Selecting another phase must preserve all navigation labels and their positions.
- **Installation and recovery:** Both boot paths reach a separately reported installation result. A required post-installation failure preserves the earlier checks; retry completes all three phases with no current-phase marker remaining.
- **Navigation and reset:** The recipe covers header entry, Journey and Network prep links, nested catalog returns, direct and legacy locations, keyboard activation, Back/Forward, page-state retention and cancellation of a pending generation on reset. Reload resets the example while retaining the URL's reading phase. Browser storage remains untouched.
- **Production:** Run `npm run build`, then `VERIFY_PRODUCTION=1 npm run verify:browser`. Require the same PASS result against the built app.
- **Visual evidence:** Inspect `artifacts/verify/combined-app/solution-{phases,manual,failure,dns-failure}-{320,390,768,1440}.png`, plus `solution-opening-1440.png`, `solution-dns-request-1440.png`, `solution-complete-1440.png` and `solution-preview-enlarged-1440.png`. Require visible phase states, readable DNS evidence/manual instructions and unclipped controls.

## Gotchas

- Execution is session-only. Refresh starts a new journey; old persisted Solution data is unused and left untouched.
- Copying a location shares the reading phase only. Opening a future phase must never advance the example.
- Save incomplete journey records the illustrative save point in memory. It does not write browser storage or create a ticket.
- DNS fulfillment and operator boot reports are distinct from technical verification.
- Replay controls replace the sample state intentionally. Ordinary chapter navigation preserves it.
- Keep ignored screenshot artifacts. Cleanup only the disposable processes created by the verification run.
