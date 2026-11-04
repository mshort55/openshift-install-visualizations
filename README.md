# OpenShift installation journey

One web app for understanding OpenShift installation on bare metal. **Journey** opens by default; **Choices** explores Agent-based Installer configuration decisions. The shared header provides page navigation and sharing. Each page owns its layout and controls.

```bash
npm ci
npm run app
```

Open <http://localhost:5174>. Choose **Choices** in the header, or follow **Explore Agent-based choices** from Journey's deployment-planning explanation. **Return to journey** restores the previous step and reading position. Page switches preserve Journey's expanded sections and Choices answers for the current session.

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
- Earlier Journey `#/<topic>?view=...` and Choices `?view=map#decision=option&...` links are accepted at the new app address. Existing content redirects remain supported.
- An empty address opens Journey. Old standalone deployment addresses must be redirected by their host to the new app, preserving query strings and fragments; the app cannot redirect a different host or port. An old empty Choices address must explicitly target `#/choices`.

**Share view** copies the active page's selection and display mode, with a manual-copy dialog when clipboard access is unavailable. It does not serialize every expanded Journey section. Refresh restores the linked selection; session-only expansion resets. **Search the journey** searches Journey content and remains on that page.

## Source organization

```text
src/
  app/                 Shared header, navigation, routes, dialogs, base styles
  pages/
    journey/           Timeline, perspectives, explanatory content and evidence
    choices/           Decision tree, dependency rules and configuration catalog
  main.tsx             Single React entry point
public/                Bundled fonts and favicon
scripts/verify-app.mjs  Combined-app browser verification
```

`src/app/navigation.ts` is the sole owner of browser URL/history writes and cross-page scroll restoration. Pages receive their state and navigation callbacks. Journey's expansion state lives above the page switch; the two content catalogs remain independent.

Page CSS is scoped beneath `.journey-page` or `.choices-page`. Shared typography, header, dialogs and footer live in `src/app/styles.css`. The app does not impose a content width or grid on pages. To add a page with another layout, add its folder under `src/pages`, a route variant/parser/serializer, navigation entry and page rendering in `src/app`. Keep its controls and layout styles in that folder, and add its navigation behavior to browser verification.

Detailed content guidance: [Journey](src/pages/journey/README.md), [Choices](src/pages/choices/README.md). The original decision-tree design history is retained in `.audit/`.
