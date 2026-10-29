# Agent-based installation decisions

Decision tree for an OpenShift Container Platform 4.22 bare metal cluster installed with the Agent-based Installer.

The catalog is `src/data/bare-metal-4.22.json`. Nothing starts selected. Step through reveals the next decision after a choice. See every option keeps the other choices visible. After you pick one answer, the other answers to that question are greyed. A selected answer shows one example value from the Red Hat documentation. Questions marked NMState are written as NMState, in the host networkConfig or in a day-2 NodeNetworkConfigurationPolicy. Static host addressing opens the NMState sections OpenShift 4.22 documents for a node desired state. Ethernet, bond, VLAN, Linux bridge, VRF, and IP over InfiniBand can be combined. SR-IOV is a setting on the ethernet interface. DNS, routes, route rules, and IPv4 forwarding are separate sections. A disconnected network opens the mirror registry. `platform: none` opens the API and ingress load balancers. Day-2 steps such as the `br-ex` bridge stay in the tree. Every path chooses a storage class. The self-contained ISO also chooses the Virtualization bundle or single operators.

Run these commands from the repository root after `npm ci`:

```bash
npm run app:decisions
npm run check:decisions
npm run build:decisions
npm run preview:decisions
```

The app opens at <http://localhost:5173>. Its production output is `apps/install-decisions/dist/`. The source, catalog, styles and configuration are independent of the journey app. Both apps use the dependencies installed at the repository root.

Browser verification uses the repository’s `.cursor/skills/verify-openshift-install-visualizations/` harness. The original design history is preserved in this app’s `.audit/` directory. Shared dependency auditing runs from the root with `npm test` or `npm run check`; it reads the root `package-lock.json`.
