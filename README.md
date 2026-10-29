# openshift-install-visualizations

Independent web apps for understanding OpenShift bare-metal installation. Install dependencies once at the repository root with `npm ci`, then launch an app:

| App | Command | Local URL | Source |
| --- | --- | --- | --- |
| Installation journey | `npm run app:journey` | <http://localhost:5174> | [apps/install-journey](apps/install-journey/README.md) |
| Agent-based installation decisions | `npm run app:decisions` | <http://localhost:5173> | [apps/install-decisions](apps/install-decisions/README.md) |

Each app owns its source, content, styles, entry point, Vite configuration and production output. Both use the repository's shared dependencies, TypeScript defaults and formatting rules. See the [app directory](apps/README.md) for the layout and conventions for another visualization.

`npm run build` builds both apps into their respective `apps/<name>/dist/` directories. Use `build:journey` or `build:decisions` to build one, and `preview:journey` or `preview:decisions` to serve its production output.

`npm run check` runs type checking, linting, both app test suites and the shared lockfile audit. Use `check:journey` or `check:decisions` for one app's checks. The shared audit lives in `tests/audit.test.ts`, reads the root `package-lock.json`, and fails when the npm advisory database reports a vulnerability.

Launch commands forward Vite options, for example `npm run app:decisions -- --port 5180 --strictPort`.
