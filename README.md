# openshift-install-visualizations

Ordered decisions for an OpenShift Container Platform 4.22 bare metal install.

The catalog is `data/bare-metal-4.22.json`. Defaults follow the installation overview. A connected network uses the Assisted Installer. A disconnected network uses the Agent-based installer. Installer-provisioned infrastructure adds the ingress load balancer question.

```bash
npm install
npm run check
npm run dev
```

`npm run check` runs the type checker, the linters, and the walk tests.
