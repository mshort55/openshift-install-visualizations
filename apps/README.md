# Visualization apps

Each experience has its own entry point, source, styles, content, configuration and production output. The root repository provides installed dependencies and shared tooling defaults. Adding an app does not require adding a route to an existing experience.

| Experience | Source | Launch command | Production output |
| --- | --- | --- | --- |
| Installation journey | [install-journey](install-journey/README.md) | `npm run app:journey` | `apps/install-journey/dist/` |
| Agent-based installation decisions | [install-decisions](install-decisions/README.md) | `npm run app:decisions` | `apps/install-decisions/dist/` |

Both apps follow this structure:

```text
apps/<app-name>/
  src/
    data/
  index.html
  package.json
  tsconfig.json
  biome.json
  vite.config.ts
  README.md
  dist/              # generated, ignored by Git
```

An app can also have `public/` for static assets and bundled references. The decision app retains its original design history in `.audit/`. Repository-wide verification tools and their artifacts stay at the root.

For another visualization, create a sibling directory using the same structure. Extend `../../tsconfig.base.json` and `../../biome.json`, declare the app's own inputs, and add an `app` launch script. Give its server and preview distinct ports. Add root `app:<name>`, `build:<name>`, `preview:<name>`, `test:<name>` and `check:<name>` commands, and include the app in the aggregate build, typecheck and test commands. A future collection page can link to independently hosted apps.
