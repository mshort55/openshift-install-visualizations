# Solution example: three demonstrations

Six independently readable scenes explain one proposed installation journey. Navigation retains reading context, preparation, boot choice and recovery; shared links contain chapter location only. Preparation demonstrates partial save/resume. Installation compares automated and approved local-BMC boot. Readiness demonstrates focused customer-hook recovery; handoff and template reuse remain independent samples.

## Sub-features

- `chapters`: six direct defaults with phase orientation and distinct journey/installation outcomes.
- `preparation`: save with the API address missing, leave for supporting material, return and resume the same answers/checklist/gap; apply the sample IPAM answer without manufacturing readiness.
- `dns`: one later static request, owned wait and publication/closure report, with separately observed client lookups and exact sample commands/results in a disclosure.
- `boot`: automated default and local-BMC comparison retain the same plan/hosts/media; local instructions name the owner, access station, five BMCs, media r3, one-time boot and report. Separate the named wait, attachment/readback/report, observed Agent activity and observed installation completion.
- `recovery`: failed guest HTTPS alongside installed cluster; one targeted retry preserves earlier successes and failed history, then shows bounded checks, verified cleanup and handoff.
- `context`: canonical catalog links and nested returns restore source selection, disclosures, scroll and focus.
- `share`: clipboard and manual-copy paths share chapter only; fresh documents/reloads reset defaults.
- `samples`: handoff names scope, owners, access, evidence, cleanup and application validation; west inherits no results.
- `layouts`: keyboard navigation, 320/390/768/1440 widths, enlarged text and reduced motion.

## How to get to it (user POV)

- Choose **Solution example** after Journey in the header.
- Follow **See this in the solution example** from a mapped task/record or Network prep.
- Open `#/solution-example?chapter=<chapter>` with introduction, preparation, installation, readiness, handoff or reuse.
- Follow the story’s related links and destination-specific Return links; use browser Back/Forward.

## Driving it with verify-decisions

Preconditions: dependencies installed; run from the repository root. The combined recipe owns disposable Vite/Chrome processes and requires no separate launch or doctor.

- Run `npm run verify:browser`. Require the Solution coverage in the `PASS` line and exit code 0. The recipe uses real keyboard events for Save/Resume, the sample answer, boot selection, recovery, chapter navigation, disclosures and nested entry; inspects input labels, missing information and live-status semantics; tests clipboard success/denial; and compares exact reading snapshots on returns.
- The focused cycle saves with a blank API address, visits nested supporting pages, returns and resumes. Require `edge-east`, `dc.example.com`, ingress `10.20.30.11`, resolver `10.20.10.53`, Network team ownership and the five-item checklist to remain. Applying sample `10.20.30.12` leaves DNS Not run, installation Not started and readiness Not established. Back/Forward and page/chapter switches retain state; reload restores the blank/default plan. DNS evidence covers `admin-probe-01` on the admin/client network through the example resolver over UDP and TCP; report/closure remains separate from lookup results.
- In Installation, use Tab/Enter to select local boot and open instructions. Require programmatic selection and visible focus, the Site operations wait, approved `site-admin-01` access, BMC mapping `cp-0`–`cp-2` → `10.20.40.20`–`.22` and `worker-0`/`worker-1` → `10.20.40.30`/`.31`, the same ISO r3, and separate evidence milestones. Both routes end at installed / Ready to run for required post-installation work. Context/page/chapter returns retain selection and disclosures; Back/Forward does not rewind the choice. Switching preserves the prepared answers and readiness scene; reload restores automated boot. Share includes only the installation chapter.
- In Readiness, require Failed — customer hook beside successful installation, Network team ownership and the accepted guest fixture timeout. Use Tab/Enter on **Show recovery and retry**. Require focus on the result heading, an atomic status update, successful job execution and declared guest checks, retained failure 881 beside passing 882, bounded guest/storage/platform verification and complete cleanup. Read the optional history, evidence and assumptions. Handoff visits, supporting-page returns, page/chapter changes and Back/Forward preserve the result. Preparation and boot choice remain intact; sharing includes only the chapter. Reload restores failure with closed details. Visiting handoff before retry must leave readiness failed.
- Run `npm run build`, then `VERIFY_PRODUCTION=1 npm run verify:browser`. Require the same PASS result for production entry and fresh direct chapter routes.
- Inspect `artifacts/verify/combined-app/solution-*.png`, including preparation and boot controls, `solution-hook-*.png`, `solution-readiness-{verification,assumptions}-*.png` and `solution-handoff-evidence-enlarged-*.png`. Confirm phase, identity, statuses, open instructions, media addresses, recovery results, attempt references, cleanup and sample outputs remain readable at every supported width, including enlarged text and reduced motion, with no clipped controls or page overflow.

## Gotchas

- Fresh entry has no return origin. A general page entry restores the last position in this document. Context returns unwind one origin at a time.
- Journey’s old record links may canonicalize to another topic. Preserve their catalog destination when asserting return labels.
- History snapshots contain reading state only. All three demonstrations stay outside those snapshots.
- Keep recovery bounded to one demonstration action with displayed verification and cleanup. Keep preparation bounded to Save/Resume and its sample answer, and boot to two comparison choices with optional instructions. General editing, request lifecycle, manual-evidence collection, live rechecks and per-step boot confirmations remain outside scope.
- Screenshots are retained in the ignored artifacts directory. Only the processes created by this run may be cleaned up.
