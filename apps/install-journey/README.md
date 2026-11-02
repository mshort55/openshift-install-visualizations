# OpenShift Bare-metal Installation Journey

A standalone learning app for Red Hat engineers exploring the installation customer experience on bare metal, using the Agent-based Installer as the main path. A vertical timeline maps eight stages across preparation, installation and post-installation. Stages expand into steps, customer problems and candidate improvements. It includes 50 topics, 19 representative problem records and 15 engineering hypotheses.

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

The timeline has three perspectives: **How it works**, **Customer problems**, and **Improvement opportunities**. Each uses the same stages in the same order. Open a stage, then a step to reveal its content inline. Nested steps expose deeper explanations; problem and opportunity records open within the selected step. Switching perspectives preserves the expanded sections and their position on screen.

Groups—**Networking and shared services**, **Content, configuration and media**, **Enable workload storage**, and **Prepare platform operations**—introduce their task subsections without repeating a parent process or context block. Individual tasks show a summary, the main process, any optional details or variations, and **Outcome, people and context** last. The other two perspectives replace the main process with relevant findings; groups retain their combined findings. Topics marked `kind: "group"` use the grouping layout; other topics use the task layout.

An **Expand all** control above the timeline opens every stage, step, detail panel and record list. Each phase, stage and step has its own **Expand all** control for the content beneath it. The control changes to **Collapse all** when that scope is fully open. The ordinary stage and step controls still open or close one item. Expansion lasts while exploring the three perspectives; shared links continue to point to the selected stage, topic or record.

A sticky perspective selector stays available while reading. Browser Back restores the earlier selection, scroll position and expanded record list. Search opens the matching step or record in the timeline. Share view copies the current stage, topic, perspective and record, with a manual-copy fallback when clipboard access is unavailable. Existing topic and record links still work.

The timeline shows typical progression. Local notes explain parallel preparation, retry loops and continuing operations. Installer methods are labeled as alternatives rather than successive tasks. The same vertical layout adapts to mobile screens.

The **Plan the deployment** step provides an optional, collapsed comparison of four installation methods. Selecting a method reveals its distinct process steps for orientation; the timeline continues to follow the standard local Agent CLI workflow. **How it works** includes expandable sections for cluster and host configuration, full/minimal ISO and PXE boot options, and the separate local-web-interface workflow that installs without an external registry. **Customer problems** and **Improvement opportunities** show the shared findings once at the approach level. Existing method links and search results open the corresponding comparison choice. Comparison expansion is independent of outcome/context expansion and participates in every applicable Expand all control. Commands appear within the relevant expanded process steps. DNS preparation, external-record timing, and access checks are consolidated in **DNS and cluster access**; links to the former DNS subsections open this section.

Content lives in `src/data/topics.ts` and `src/data/evidence.ts`. The ordered stage groups and their perspective summaries live in `src/data/stages.ts`. Every detailed topic belongs to one stage through its existing parent hierarchy. Each topic has an outcome, owners and a scoped explanation. Customer problems describe the situation, consequence and limits of the available evidence without naming customers. Opportunities connect to those problems and explain existing capabilities, an intervention, an investigation and useful observations. Neither the displayed order nor the number of records is a severity or prevalence score.

Pre-installation exposes release, topology, hardware and security decisions before infrastructure preparation. Conditional details cover installation storage, workload dependencies, advanced networking, proxy configuration and custom manifests. The service-access table identifies consumers, destinations, applicability and owners; it is an overview rather than a complete firewall allowlist. Boot-media preparation ends with a brief readiness checkpoint; runtime validation is covered under host installation. Links to the former readiness section open boot-media preparation. New technical topics do not imply new customer evidence.

The overview describes shared bare-metal decisions and tasks. Detailed installation examples follow the OCP 4.22 Agent-based Installer, as explained in About. Installer-specific behavior, configuration, and commands retain their precise terminology and method context. Customer reports retain their original installation-method and evidence labels.

Post-installation begins with a successfully installed cluster and ends with application-team handover. It covers required Operators, storage, workload networking, image access, identities, monitoring, and operational preparation. Representative workloads verify the agreed requirements using application-team access. Additional components are conditional on workload and site requirements. Update, recovery and support preparation precede final acceptance; platform administrators retain cluster operations. Handover reuses workload validation results and supplies operating information, project request procedures and incident contacts. Storage provisioning and behavior checks share one detail section, with links to the former storage-behavior section redirected there. Existing stage IDs and shared topic links remain usable.

The **Install and configure required Operators** step includes a searchable table of representative additions for storage, networking, virtualization, logging, application recovery, delivery and compliance. Each example identifies the configuration that follows Operator installation. Select additions by workload and site requirements, checking what the installer already supplied. Core Cluster Operators, basic networking and platform monitoring are already part of the base cluster. The examples draw on Red Hat documentation reviewed in November 2026.

Content reflects research assembled in 2026 and uses an OCP 4.22 technical baseline. Preserve the distinction between historical experience, acceptance requirements, adjacent-platform evidence, documented capabilities and hypotheses when editing it. Do not store customer names, source documents, reference registries or citation identifiers in the app.

The automated checks validate complete stage coverage, navigation integrity, problem/opportunity connections, route round-trips, invalid-link recovery and search. Browser checks cover inline disclosure, perspective switching without losing position, linked problems and ideas, refresh/share, history, keyboard navigation and layouts at 320, 390, 768 and 1440 pixels. Human usability testing with engineers can assess whether the information structure helps them learn.

The app-specific CSS lint configuration allows descending specificity because component descendants and responsive rules are grouped together. Other inherited lint rules remain enabled. The bundled DM Sans and Manrope fonts include their SIL Open Font License files in `public/fonts/`.
