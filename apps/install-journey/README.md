# OpenShift Installation Journey

A standalone learning app for Red Hat engineers exploring the complete bare-metal customer experience. A three-phase overview opens into focused topics, customer problems and candidate improvements. It includes 37 topics, 19 representative problem records and 15 engineering hypotheses.

Install the repository dependencies once from the repository root, then start this app:

```bash
npm ci
npm run app:journey
```

Open <http://localhost:5174>. The decision-tree app lives alongside this one in `apps/install-decisions/` and starts with `npm run app:decisions`. This app shares development tools with the repository, but has no runtime dependency on the original app's source, state, styles or catalog.

```bash
npm run check:journey
npm run build:journey
npm run preview:journey
```

The production output is `apps/install-journey/dist/`. Serve that directory from a static web server at a root or subdirectory URL. Hash routes preserve direct links without a server rewrite rule. Fonts and app content are bundled; the explorer does not require an external service.

The overview has three perspectives: **How it works**, **Customer problems**, and **Improvement opportunities**. Start with a phase, then open a topic or record for more detail. A perspective stays selected while moving through topics. Breadcrumbs and the phase strip provide orientation; browser Back restores the earlier scroll position and expanded list. Search spans topics and record content. Share view copies the current topic, perspective and record, with a manual-copy fallback when clipboard access is unavailable.

Content lives in `src/data/topics.ts` and `src/data/evidence.ts`. Each topic has one parent, an outcome, owners, a scoped explanation and optional connections to other topics. Customer problems describe the situation, consequence and limits of the available evidence without naming customers. Opportunities connect to those problems and explain existing capabilities, an intervention, an investigation and useful observations. Neither the displayed order nor the number of records is a severity or prevalence score.

Content reflects research assembled in September–October 2026 and uses an OCP 4.22 technical baseline. Preserve the distinction between historical experience, acceptance requirements, adjacent-platform evidence, documented capabilities and hypotheses when editing it. Do not store customer names, source documents, reference registries or citation identifiers in the app.

The automated checks validate navigation integrity, problem/opportunity connections, route round-trips, invalid-link recovery and search. Browser checks cover progressive disclosure, linked problems and ideas, refresh/share, history and focus restoration, and responsive layouts. Human usability testing with engineers can assess whether the information structure helps them learn.

The app-specific CSS lint configuration allows descending specificity because component descendants and responsive rules are grouped together. Other inherited lint rules remain enabled. The bundled DM Sans and Manrope fonts include their SIL Open Font License files in `public/fonts/`.
