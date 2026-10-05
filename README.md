# openshift-install-visualizations

Decision tree for an OpenShift Container Platform 4.22 bare metal cluster installed with the Agent-based Installer.

The catalog is `data/bare-metal-4.22.json`. Choosing a branch opens the decisions that follow from it. Static host addressing opens NIC bonds, VLANs, and SR-IOV. A disconnected network opens the mirror registry. `platform: none` opens the API and ingress load balancers. Day-2 steps such as the `br-ex` bridge stay in the tree.

```bash
npm install
npm run check
npm run dev
```

`npm run check` runs the type checker, the linters, the walk tests, and a lockfile audit. The audit reads `package-lock.json` and fails when the npm advisory database reports any vulnerability.
