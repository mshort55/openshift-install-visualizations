# OpenShift installation journey

One web app for understanding OpenShift installation on bare metal. **Journey map** opens by default; **Solution example** demonstrates one saved installation journey from prerequisites to infrastructure readiness; **Network prep** illustrates five-node network handoffs; **Install options** explores Agent-based Installer configuration decisions. The shared header shows these four production pages in that order. The current page has a filled card and check mark. Cards use one row on desktop and two columns on narrow screens.

```bash
npm ci
npm run app
```

Open <http://localhost:5174>. Choose **Install options** in the header, or follow **Explore Install options** from Journey's deployment-planning explanation. **Return to Journey map** restores the previous step and reading position. Page switches preserve Journey's expanded sections and Choices answers for the current session.

Choose **Network prep** in the header, or follow its contextual links from networking, addressing, DNS, firewall review and host management. The page presents a network map, five site handoffs and expandable technical references. Node addressing and site DNS publication are equally prominent controls above the map. DNS can be published before installation or deferred until afterward in this managed bare-metal example; the visible note explains the installation-time resolution needs. Section links preserve both selections, and reference links open their panel. Page switches retain selections, expanded references and reading position.

Choose **Solution example** to follow one guided journey for `ocp5.dc.example.com`, or enter from a matching Journey task or Network prep link. Generate a DNS request, save the incomplete journey, simulate fulfillment and verify the answers separately. An optional mismatched record demonstrates correction and retry with retained evidence.

Persistent navigation shows the current phase, checks for completed phases and locks with prerequisite explanations for future phases. Every chapter can be previewed; its execution actions remain blocked until the preceding phase finishes. An outline identifies the chapter being read without changing its status label. Automated Agent-based installation and guided manual boot lead to the same post-installation work. A failed required customer hook affects the overall journey even after the base cluster is installed.

Progress stays in memory while you explore other pages in the app. Refresh or Reset example starts a new simulation. All external results are illustrative. Contextual links retain a return path; general page entry restores the last reading position. URLs share the chapter being read and never include execution state.

```bash
npm run check
npm run build
npm run preview
npm run verify:browser
```

`check` runs TypeScript, Biome, and the page and route tests. `verify:browser` starts disposable Vite and Chrome processes, exercises the combined app, saves screenshots under `artifacts/verify/combined-app/`, and cleans up its processes. It downloads Chrome for Testing on first use. After building, `VERIFY_PRODUCTION=1 npm run verify:browser` runs the same checks against the production preview.

The single production output is `dist/`. Serve it at a root or subdirectory URL. Hash routing supports direct links without server rewrite rules. Fonts and content are bundled; no external service is required to explore the app.

## Pages and links

- `#/journey` opens the timeline. For example, `#/journey/dns?view=problems` opens a topic and perspective.
- `#/solution-example?phase=pre|install|post` reads a phase without executing it. Missing or invalid phases open pre-installation. Former `chapter=` links and `#/guided-story-prototype` links redirect to this replacement; execution parameters are ignored.
- `#/choices` opens the decision tree with nothing selected. `#/choices?mode=map&host-addressing=static` opens every option with Static NMState selected.
- `#/prerequisites` opens the five-node network map with DHCP and published client DNS. `#/prerequisites/dns?addressing=static` focuses the DNS handoff with static addressing. `#/prerequisites/dns-access?dns=pending` opens the temporary-access reference. Existing `#/prerequisites/tickets/network` links reach the consolidated addresses/network handoff.
- Earlier Journey `#/<topic>?view=...` and Choices `?view=map#decision=option&...` links are accepted at the new app address. Existing content redirects remain supported.
- An empty address opens Journey. Old standalone deployment addresses must be redirected by their host to the new app, preserving query strings and fragments; the app cannot redirect a different host or port. An old empty Choices address must explicitly target `#/choices`.

The browser address identifies the active page and selection. Copy it to reopen that view. Refresh restores the linked selection; session-only expansion resets.

## Source organization

```text
src/
  app/                 Shared header, navigation, routes, base styles
  pages/
    solution-example/  Guided story, phase progress, DNS handoff and simulated execution
    journey/           Timeline, perspectives, explanatory content and evidence
    choices/           Decision tree, dependency rules and configuration catalog
    prerequisites/     Five-node topology, scenarios, IT handoffs and public sources
  main.tsx             Single React entry point
public/                Bundled fonts and favicon
scripts/verify-app.mjs  Combined-app browser verification
```

`src/app/navigation.ts` is the sole owner of browser URL/history writes and cross-page scroll restoration. Pages receive state and navigation callbacks. Journey and Prerequisites disclosure state lives above the page switch. Solution execution state also lives above page switching, in memory: Back/Forward changes reading location without rewinding work. Refresh resets the simulated journey. The former solution's browser-storage model and template workflow are removed. Each page’s content remains independent.

Page CSS is scoped beneath `.journey-page`, `.choices-page` or `.prerequisites-page` or `.solution-page`. The Prerequisites palette, typography, spacing, corner sizes and page frame are shared through `src/app/theme.css`; use its tokens for colors and selection states on every page. The shared header and footer live in `src/app/styles.css`. Pages own their content grids within the common frame. To add a page with another layout, add its folder under `src/pages`, a route variant/parser/serializer, navigation entry and page rendering in `src/app`. Keep its controls and layout styles in that folder, and add its navigation behavior to browser verification.

Detailed content guidance: [Journey map](src/pages/journey/README.md), [Install options](src/pages/choices/README.md), [Network prep](src/pages/prerequisites/README.md), [Solution example](src/pages/solution-example/README.md). The original decision-tree design history is retained in `.audit/`.
