# Solution example

The guided story follows `ocp5.dc.example.com` from incomplete preparation through Agent-based installation and scoped infrastructure readiness. It is the sole Solution example in development and production, reached from the main navigation or `#/solution-example?phase=pre|install|post`.

`model.ts` derives journey and phase status from illustrative execution snapshots. `session.ts` retains the current snapshot above page switching and owns the cancellable DNS simulation timers. `ui.tsx` renders one chapter at a time with persistent phase navigation. `dns.tsx` presents the generated request, fulfillment report and verification evidence. All results are simulated.

Phase progress is separate from reading location. Current phases have an explicit label, completed phases have checks, and future phases show a lock and their prerequisite. An outline identifies the open chapter; selecting it leaves status text and layout unchanged. Future chapters remain previewable with blocked start actions. DNS success advances preparation from three to four completed items; boot access and the required pre-installation hook must also pass before installation becomes current. Base installation completion unlocks post-installation. A required hook failure retains earlier phase checks and changes the overall journey to Needs attention.

The DNS handoff reveals a copyable request for the three cluster access records. Simulated fulfillment adds a team report; verification adds scoped lookup evidence. An optional application-record mismatch fails verification. Correction and retry retain the failed attempt. Generation and verification have brief timers; resetting the example cancels pending work.

The manual boot path retains the prepared Agent media and guides the Infrastructure team through host boot. Reporting boot completion does not establish installation success; the example requires a separate installation result. A post-installation failure demonstrates a customer AAP network check and a targeted repair/retry.

Progress remains in memory while navigating the app. Refresh and Reset example start a new simulated journey. No local-storage record or external service is read or changed. The former solution's persistence model, template workflow and page components have been removed.

The app owns navigation, page history and contextual returns. URLs share only the phase being read. Former `chapter=` links and the old guided-story review URL normalize to the corresponding phase on this page; they never restore or execute work. `links.ts` maps Journey topics to phases. The opportunity-catalog link supports a contextual return to the story.

Run the combined browser verifier in development and production. The focused coverage is in `scripts/verify-solution.mjs`; the maintained recipe and screenshot targets are in `.agents/skills/verify-openshift-install-visualizations/features/solution-example.md`.
