# OpenShift installation journey

One web app for understanding OpenShift installation on bare metal. **Journey** opens by default; **Choices** explores Agent-based Installer configuration decisions; **Prerequisites** illustrates the network and IT handoffs for a five-node Agent installation. The shared header provides page navigation. Each page owns its layout and controls.

```bash
npm ci
npm run app
```

Open <http://localhost:5174>. Choose **Choices** in the header, or follow **Explore Agent-based choices** from Journey's deployment-planning explanation. **Return to journey** restores the previous step and reading position. Page switches preserve Journey's expanded sections and Choices answers for the current session.

Choose **Prerequisites** in the header, or follow its contextual links from networking, addressing, DNS, firewall review and host management. The page presents a network map, five site handoffs and expandable technical references. Node addressing and site DNS publication are equally prominent controls above the map. DNS can be published before installation or deferred until afterward in this managed bare-metal example; the visible note explains the installation-time resolution needs. Section links preserve both selections, and reference links open their panel. Page switches retain selections, expanded references and reading position.

```bash
npm run check
npm run build
npm run preview
npm run verify:browser
```

`check` runs TypeScript, Biome, the page and route tests, and the npm dependency audit. `verify:browser` starts disposable Vite and Chrome processes, exercises the combined app, saves screenshots under `artifacts/verify/combined-app/`, and cleans up its processes. It downloads Chrome for Testing on first use.

The single production output is `dist/`. Serve it at a root or subdirectory URL. Hash routing supports direct links without server rewrite rules. Fonts and content are bundled; no external service is required to explore the app.

## Pages and links

- `#/journey` opens the timeline. For example, `#/journey/dns?view=problems` opens a topic and perspective.
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
    journey/           Timeline, perspectives, explanatory content and evidence
    choices/           Decision tree, dependency rules and configuration catalog
    prerequisites/     Five-node topology, scenarios, IT handoffs and public sources
  main.tsx             Single React entry point
public/                Bundled fonts and favicon
scripts/verify-app.mjs  Combined-app browser verification
```

`src/app/navigation.ts` is the sole owner of browser URL/history writes and cross-page scroll restoration. Pages receive their state and navigation callbacks. Journey and Prerequisites expansion state lives above the page switch; the three pages' content remains independent.

Page CSS is scoped beneath `.journey-page`, `.choices-page` or `.prerequisites-page`. The Prerequisites palette, typography, spacing, corner sizes and page frame are shared through `src/app/theme.css`; use its tokens for colors and selection states on every page. The shared header and footer live in `src/app/styles.css`. Pages own their content grids within the common frame. To add a page with another layout, add its folder under `src/pages`, a route variant/parser/serializer, navigation entry and page rendering in `src/app`. Keep its controls and layout styles in that folder, and add its navigation behavior to browser verification.

Detailed content guidance: [Journey](src/pages/journey/README.md), [Choices](src/pages/choices/README.md), [Prerequisites](src/pages/prerequisites/README.md). The original decision-tree design history is retained in `.audit/`.
