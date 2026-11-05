# OpenShift installation journey

One web app for understanding OpenShift installation on bare metal. **Journey map** opens by default; **Solution example** tells a proposed installation journey in six independently readable chapters; **Network prep** illustrates five-node network handoffs; **Install options** explores Agent-based Installer configuration decisions. The shared header shows these four production pages in that order. The current page has a filled card and check mark. Cards use one row on desktop and two columns on narrow screens.

```bash
npm ci
npm run app
```

Open <http://localhost:5174>. Choose **Install options** in the header, or follow **Explore Install options** from Journey's deployment-planning explanation. **Return to Journey map** restores the previous step and reading position. Page switches preserve Journey's expanded sections and Choices answers for the current session.

Choose **Network prep** in the header, or follow its contextual links from networking, addressing, DNS, firewall review and host management. The page presents a network map, five site handoffs and expandable technical references. Node addressing and site DNS publication are equally prominent controls above the map. DNS can be published before installation or deferred until afterward in this managed bare-metal example; the visible note explains the installation-time resolution needs. Section links preserve both selections, and reference links open their panel. Page switches retain selections, expanded references and reading position.

Choose **Solution example** after Journey, or follow **See this in the solution example** from a matching task or record. Every chapter has a useful default scene, a phase and separate journey/installation outcomes. Later chapters state their assumptions. In Preparation, save with the API address missing, explore a supporting page, then return and resume the retained answers and checklist. **Use sample IPAM answer** supplies the example address; checks remain unrun and installation has not started. A separate, ready-written DNS request distinguishes the owner's publication report from scoped client lookup evidence.

In Installation, compare **Automated boot** (the default) with **Guided local-BMC boot** for the same five hosts and Agent ISO revision. Local boot shows the Site operations wait and optional instructions for approved access from `site-admin-01`. The short progression separates attached media, BMC readback or human reports, observed Agent activity and installation completion. Both routes leave required post-installation work outstanding. Switching routes preserves preparation and other chapters. In Readiness, **Show recovery and retry** explains the Network team’s repair and successful customer Ansible retry while preserving installation and earlier results. Complete includes the remaining declared checks, verified cleanup and a sample handoff. Optional history retains failed and passing attempts. **View sample handoff** reads an independent completed sample; it performs no work and cannot clear an unresolved readiness failure. Template reuse remains a static comparison.

Contextual links preserve a nested return path, selected topic/record, disclosures, scroll and invoking focus. General page entry restores the last reading position in this document. **Share view** copies only the chapter URL and provides a manual-copy dialog if clipboard access fails. A fresh document or reload uses chapter defaults, without an invented origin or stored execution state.

```bash
npm run check
npm run build
npm run preview
npm run verify:browser
```

`check` runs TypeScript, Biome, the page and route tests, and the npm dependency audit. `verify:browser` starts disposable Vite and Chrome processes, exercises the combined app, saves screenshots under `artifacts/verify/combined-app/`, and cleans up its processes. It downloads Chrome for Testing on first use. After building, `VERIFY_PRODUCTION=1 npm run verify:browser` runs the same checks against the production preview.

The single production output is `dist/`. Serve it at a root or subdirectory URL. Hash routing supports direct links without server rewrite rules. Fonts and content are bundled; no external service is required to explore the app.

## Pages and links

- `#/journey` opens the timeline. For example, `#/journey/dns?view=problems` opens a topic and perspective.
- `#/solution-example?chapter=readiness` opens the failed customer-hook scene beside successful cluster installation. Chapters are `introduction`, `preparation`, `installation`, `readiness`, `handoff` and `reuse`; missing/invalid chapter values use introduction. Old prototype substeps and simulation parameters are ignored.
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
    solution-example/  Six chapters, three focused demonstrations and sample outputs
    journey/           Timeline, perspectives, explanatory content and evidence
    choices/           Decision tree, dependency rules and configuration catalog
    prerequisites/     Five-node topology, scenarios, IT handoffs and public sources
  main.tsx             Single React entry point
public/                Bundled fonts and favicon
scripts/verify-app.mjs  Combined-app browser verification
```

`src/app/navigation.ts` is the sole owner of browser URL/history writes and cross-page scroll restoration. Pages receive their state and navigation callbacks. Journey, Prerequisites and Solution disclosure state lives above the page switch. Context returns restore only the source page’s reading snapshot. Solution preparation, boot selection and hook recovery also live above page switching, separately from those snapshots: Back/Forward retains current demonstration results. Reload resets these session-only demonstrations. Each page’s content remains independent.

Page CSS is scoped beneath `.journey-page`, `.choices-page` or `.prerequisites-page` or `.solution-page`. The Prerequisites palette, typography, spacing, corner sizes and page frame are shared through `src/app/theme.css`; use its tokens for colors and selection states on every page. The shared header and footer live in `src/app/styles.css`. Pages own their content grids within the common frame. To add a page with another layout, add its folder under `src/pages`, a route variant/parser/serializer, navigation entry and page rendering in `src/app`. Keep its controls and layout styles in that folder, and add its navigation behavior to browser verification.

Detailed content guidance: [Journey map](src/pages/journey/README.md), [Install options](src/pages/choices/README.md), [Network prep](src/pages/prerequisites/README.md), [Solution example](src/pages/solution-example/README.md). The original decision-tree design history is retained in `.audit/`.
