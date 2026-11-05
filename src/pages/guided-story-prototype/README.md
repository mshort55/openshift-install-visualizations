# Guided story A — review prototype

Restores the original guided-story alternative alongside the current Solution example. It keeps one chapter visible at a time with persistent pre-installation, installation and post-installation navigation.

In development, use **Prototype review → Guided story A** beneath the main navigation, or open `#/guided-story-prototype`. The optional `phase=pre|install|post` parameter shares the reading location. `npm run prototype:guided-story` opens a dedicated review server on port 5175; the ordinary `npm run app` also serves this page. Production builds omit the review page and entry.

The source was recovered from local branch `prototype/cluster-installation-solution-layouts`, commit `502c5fb956f14f45df3ce0f4a9ccb46b9b216432`. Only A is restored. The other layouts and their comparison switcher remain in that archive.

The original `ocp5.dc.example.com` example and its illustrative status labels are retained. Replay controls and sequential actions demonstrate incomplete preparation, automated boot, guided manual boot and a required post-installation failure. Reading a phase does not advance or rewind execution. This prototype has no persistence; leaving or reloading resets its simulated work. Its state is independent of the current Solution example's browser-saved deployment.

Pre-installation now opens with an unfolding DNS handoff. Generate a sample request to reveal its records and acceptance criteria, copy it, and save the incomplete journey. Simulated team fulfillment adds a report; sample verification adds scoped lookup evidence. The optional mismatched application record fails verification and affects the overall journey status. Correcting it and verifying again retains both attempts. DNS success advances preparation from three to four completed items; a separate action resolves boot access and runs the sample pre-installation hook before installation. DNS evidence survives chapter navigation and the later installation steps. Replay controls replace the example with the selected sample state.

Generation and verification use brief timers to make their simulated transitions visible. They create no external request and run no DNS queries. Resetting the example cancels pending work.

The current app owns navigation, page history and return behavior. Prototype styles use the shared theme tokens. This is a review artifact, not the final solution-page implementation.
