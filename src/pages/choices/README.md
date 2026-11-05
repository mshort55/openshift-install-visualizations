# Agent-based installation choices

Decision tree for an OpenShift Container Platform 4.22 bare metal cluster installed with the Agent-based Installer.

The catalog is `data/bare-metal-4.22.json`. Nothing starts selected. Step through reveals the next decision after a choice. See every option keeps the other choices visible. After you pick one answer, the other answers to that question are greyed. A selected answer shows one example value from the Red Hat documentation. Questions marked NMState are written as NMState, in the host networkConfig or in a day-2 NodeNetworkConfigurationPolicy. Static host addressing opens the NMState sections OpenShift 4.22 documents for a node desired state. Ethernet, bond, VLAN, Linux bridge, VRF, and IP over InfiniBand can be combined. SR-IOV is a setting on the ethernet interface. DNS, routes, route rules, and IPv4 forwarding are separate sections. A disconnected network opens the mirror registry. `platform: none` opens the API and ingress load balancers. Day-2 steps such as the `br-ex` bridge stay in the tree. Every path chooses a storage class. The self-contained ISO also chooses the Virtualization bundle or single operators.

Run and build the combined app using the [root instructions](../../../README.md). Choose **Choices** in the shared header or open `#/choices`. This page owns the tree and its Step through / See every option controls. The shared app owns its URL, navigation and return to Journey.

The catalog and conditional-answer logic remain independent of Journey's explanatory topics. Answers and display mode are passed to `ChoicesPage`; changes flow through its `onChange` callback. The page retains its option-scroll anchoring and uses styles scoped beneath `.choices-page`.

Browser verification uses `.agents/skills/verify-openshift-install-visualizations/` from the repository root. `npm run verify:browser` also covers cross-page navigation, old links and responsive layouts. Original design history is retained in the root `.audit/` directory.
