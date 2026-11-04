# Network prerequisites

An illustrative five-node Agent-based installation with OCP 4.22, IPv4, `platform: baremetal`, managed VIPs, OVN-Kubernetes, a full agent ISO and BMC virtual media. This page connects the installation journey to the infrastructure and IT handoffs that one concrete design needs.

The map opens first, followed by addressing, DNS, IT handoffs, firewall flows and sources. The addressing and external-DNS controls change the example and its shareable URL. They do not assess site readiness or inherit answers from Choices. Other topologies and installation methods need their own review.

The content was ported from `2026-10-27-agent-baremetal-network-prerequisites.html`, reviewed on 4 November 2026. Maintain the app content here. It has no runtime dependency on the standalone file, external fonts or a content service.

## Ownership

- `data.ts` supplies the shared node inventory for the topology, BMC addresses and addressing table.
- `content.tsx` contains the detailed explanations, handoffs, configuration excerpts, flow table and public technical sources.
- `services.tsx` supplies the map's shared-service summaries.
- `model.ts` defines valid section/scenario links and the contextual Journey entry points.
- `interactions.tsx` owns local section links and disclosure state. Navigation callbacks go through the app; this page does not write browser history.
- `ui.tsx` composes the map, controls and detailed sections. Styles stay beneath `.prerequisites-page` and use the app's bundled fonts.

The app retains disclosure state across page switches. A shared handoff link opens that handoff after refresh; other disclosures are session-only. Returning to Journey restores the topic, expansion, reading position and entry-link focus. Section links and scenario changes participate in browser Back/Forward and Share view.

## Evidence boundaries

Keep the scope beside the example and the qualification beside each technical claim. The DNS explanation distinguishes documented Assisted guidance from the Agent managed-network behavior established by release-4.22 source review. The workstation hosts-file mapping is an implementation-based workaround. No five-node deployment was performed for the source visual. This conclusion does not cover multi-node `platform: none` or external-DNS configurations.

The firewall table supports planning and retains the unresolved exact VIP failover ACLs. BMC ports, firmware, licensing and media retrieval require hardware-specific checks. Example addresses, MACs and owners are site-design illustrations. Public technical documentation and source links belong here; private customer evidence remains outside the app.

## Verification

Run the root `npm run check`, `npm run build` and `npm run verify:browser`. The browser suite calls `scripts/verify-prerequisites.mjs` to exercise all five contextual entries, return focus/position, both scenario controls, handoff expansion, retained state across Choices, Back/Forward, refresh, sharing, keyboard controls and invalid-link recovery. The combined suite also captures the page and an expanded handoff at 320, 390, 768 and 1440 pixels.
