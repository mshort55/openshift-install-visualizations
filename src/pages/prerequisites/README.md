# Network prerequisites

An illustrative five-node Agent-based installation with OCP 4.22, IPv4, `platform: baremetal`, managed VIPs, OVN-Kubernetes, a full agent ISO and BMC virtual media. This page connects the installation journey to the infrastructure and IT handoffs that one concrete design needs.

The page has three sections: Network map, Site handoff and Technical reference. Five visible handoffs cover addresses/network, DNS/time, image access, network access and server management. Inventory, YAML, detailed firewall flows, DNS implementation details and sources are collapsed reference panels.

Node addressing and site DNS publication are equally prominent controls above the map. Client DNS defaults to publication before installation; the alternative defers publication until after cluster installation. A visible note limits this choice to the managed bare-metal example and preserves the need for upstream DNS and monitoring-workstation API resolution during installation. Both selections are shareable and independent of Choices. They illustrate a design rather than assessing site readiness.

The content was ported from `2026-10-27-agent-baremetal-network-prerequisites.html`, reviewed on 4 November 2026. Maintain the app content here. It has no runtime dependency on the standalone file, external fonts or a content service.

## Ownership

- `data.ts` supplies the shared node inventory for the topology, BMC addresses and addressing table.
- `content.tsx` contains the five concise site handoffs.
- `reference.tsx` contains inventory, configuration excerpts, flow details, DNS implementation details and public sources.
- `services.tsx` supplies the map's shared-service summaries.
- `model.ts` defines valid section/scenario links and the contextual Journey entry points.
- `interactions.tsx` owns local section links and disclosure state. Navigation callbacks go through the app; this page does not write browser history.
- `ui.tsx` composes the map, controls and detailed sections. Styles stay beneath `.prerequisites-page` and use the app's bundled fonts.

The app retains disclosure state across page switches. Shared reference links open their panel after refresh; other disclosures are session-only. Existing addressing, DNS and handoff links focus their consolidated content. Returning to Journey restores the topic, expansion, reading position and entry-link focus. Section links and scenario changes participate in browser Back/Forward and Share view. Unspecified DNS means published; `dns=pending` selects deferred publication.

## Evidence boundaries

Keep the scope beside the example and the qualification beside each technical claim. The DNS explanation distinguishes documented Assisted guidance from the Agent managed-network behavior established by release-4.22 source review. The workstation hosts-file mapping is an implementation-based workaround. No five-node deployment was performed for the source visual. This conclusion does not cover multi-node `platform: none` or external-DNS configurations.

The firewall table supports planning and retains the unresolved exact VIP failover ACLs. NodePort access is conditional on using NodePort services, following the specific OCP 4.22 firewall guidance. BMC ports, firmware, licensing and media retrieval require hardware-specific checks. Example addresses, MACs and owners are site-design illustrations. Public technical documentation and source links belong here; private customer evidence remains outside the app.

## Verification

Run the root `npm run check`, `npm run build` and `npm run verify:browser`. The browser suite calls `scripts/verify-prerequisites.mjs` to exercise all five contextual entries, return focus/position, both scenario controls, reference expansion, retained state across Choices, Back/Forward, refresh, sharing, keyboard controls and invalid-link recovery. Existing handoff URLs are checked against their visible destinations. The combined suite captures the page and handoff at 320, 390, 768 and 1440 pixels.
