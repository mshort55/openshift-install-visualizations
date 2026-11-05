# Solution example

The page demonstrates one browser-saved installation journey for a new `edge-east` deployment, from incomplete preparation through Agent-based installation to scoped infrastructure readiness. External operations and their evidence are simulated. Completing cluster installation does not complete the journey.

`model.ts` owns the versioned Zod persistence schema, execution transitions, dependency gates, attempt history, derived status and explicit reusable-plan projection. `session.ts` owns browser persistence and the disposable installation timer. Each save result is associated with the exact journey revision so an earlier successful write cannot confirm a later unsaved edit. A schema-invalid saved record remains untouched until an explicit edit or reset.

Reading selection remains in the existing route and navigation owner; disclosures use the existing reading snapshots. Neither inspection, browser history nor contextual return executes or rewinds work. The `chapter` URL parameter remains compatible with old links. `handoff` now opens readiness and evidence; `reuse` opens the optional template action. New actions have direct locations too. Sharing includes only the location, never deployment state.

`ui.tsx` composes the opening, persistent overview and selected action. Preparation, installation and post-installation panels use the same journey. Inputs and capability choices freeze when installation begins. Reset starts a fresh example and clears its saved template by replacing only `openshift.solution-journey.v1`; other app/browser state is untouched.

The automated route advances media preparation, boot and observation on short demonstration timers. The manual route pauses until an explicit sample Agent observation. The two-worker topology uses external CSI storage; Virtualization depends on storage. NMState site configuration is supplied by the customer post-installation hook. Selected operators must be installed, configured and verified. Customer hooks and proposed Red Hat checks are separate activities.

Failures contribute to aggregate journey status until the affected action succeeds. Retry appends evidence and retains earlier successful work. VM recovery records an example network correction, then reruns the failed guest checks and dependent Virtualization readiness. Each VM attempt records cleanup. Completion requires all selected capabilities, required customer automation and scoped checks; template saving is optional.

The verifier drives the rendered UI, including both boot routes, capability selection, operator/configuration/hook failures, scoped VM recovery, nested contextual returns, browser reloads, storage-write failure and template projection. See `.agents/skills/verify-openshift-install-visualizations/features/solution-example.md` for commands and screenshot inspection targets.
