// Illustrative prototype only: no installation, network or automation calls.
import type { PreparationState } from "./prerequisite-model";

export const chapters = [
  { id: "introduction", label: "Why Agent-based", phase: "Pre-installation" },
  {
    id: "preparation",
    label: "Guide the prerequisites",
    phase: "Pre-installation",
  },
  { id: "installation", label: "Boot and install", phase: "Installation" },
  {
    id: "readiness",
    label: "Establish infrastructure readiness",
    phase: "Post-installation",
  },
  { id: "handoff", label: "Generate the handoff", phase: "Post-installation" },
  { id: "reuse", label: "Reuse the plan", phase: "Post-installation" },
] as const;
export type Chapter = (typeof chapters)[number]["id"];
export function parseChapter(value: string | null): Chapter {
  return chapters.find((chapter) => chapter.id === value)?.id ?? "introduction";
}
export type BootRoute = "automated" | "local-bmc";
export type Entry = {
  id: number;
  at: string;
  source: string;
  result: string;
  inputs: string;
};
export const hosts = [
  ["cp-0", "10.20.30.20", "10.20.40.20", "Control plane · rendezvous"],
  ["cp-1", "10.20.30.21", "10.20.40.21", "Control plane"],
  ["cp-2", "10.20.30.22", "10.20.40.22", "Control plane"],
  ["worker-0", "10.20.30.30", "10.20.40.30", "Worker"],
  ["worker-1", "10.20.30.31", "10.20.40.31", "Worker"],
];
export const bootSteps = [
  "Prepare configuration and ISO",
  "Attach media",
  "Request boot",
  "Observe hosts",
  "Observe installation running",
  "Observe installation complete",
];
export const postSteps = [
  "Observe nodes, core health and virtualization prerequisites",
  "Configure and verify the selected VM storage",
  "Install and configure OpenShift Virtualization",
  "Create and boot the disposable VM",
  "Launch customer VM network hook",
  "Observe failed guest connection",
  "Record network repair",
  "Retry affected hook",
  "Observe successful retry",
  "Run guest, storage and platform smoke tests",
  "Verify all declared smoke-test results",
  "Verify test cleanup",
];
export type Template = {
  name: string;
  addressing: string;
  changeApproval: boolean;
  release: string;
};
export const emptyWest = () => ({
  domain: "",
  api: "",
  ingress: "",
  resolver: "",
  storage: "",
  hosts: "",
  network: "",
  probes: "",
  owners: "",
  bindings: "",
  access: "",
});
export type WestInputs = ReturnType<typeof emptyWest>;
export const exampleWest: WestInputs = {
  domain: "west.example.com",
  api: "10.40.30.10",
  ingress: "10.40.30.11",
  resolver: "10.40.10.53",
  storage:
    "west-vm-storage; existing supported CSI backend west-storage; RWX/Block; capacity, driver compatibility and Delete reclaim policy selected",
  hosts:
    "west cp-0/1/2: .20/.21/.22; worker-0/1: .30/.31 in 10.40.30.0/24; BMCs on 10.40.40.0/24; eno1 MAC inventory west-hosts-v1; installation disk /dev/disk/by-id/wwn-west-<host>",
  network:
    "West reservations west-ipam-v1; VLAN 430, gateway 10.40.30.1; pod/service ranges 10.128.0.0/14 and 172.30.0.0/16 reviewed for overlap; registry.west.example.com; ntp.west.example.com",
  probes:
    "west-admin-probe / admin network; west-app-probe / 10.40.60.20 HTTPS fixture; guest default pod network / masquerade; west-site-admin / approved BMC network",
  owners:
    "West Network team; West Site operations; West Platform team → West Application team",
  bindings:
    "West controller connection; site-validation + vm-network-validation templates; inventory west-hosts; target edge-west; west credential references",
  access:
    "West hardware-admin and registry credential references selected; trust bundle west-ca; install window awaiting new approval if selected",
};
export const westLabels: Record<keyof WestInputs, string> = {
  domain: "Base domain",
  api: "API address",
  ingress: "Ingress address",
  resolver: "Resolver",
  storage: "VM storage",
  hosts: "Hosts, BMCs, NICs and disks",
  network: "Site network and services",
  probes: "Execution and probe locations",
  owners: "Owners and receiving team",
  bindings: "Controller, hooks and targets",
  access: "Access and credential references",
};
export function handoffText(
  preparation: PreparationState,
  history: Entry[],
  route: BootRoute,
) {
  const a = preparation.answers;
  return `# Infrastructure handoff — edge-east

ILLUSTRATIVE PROTOTYPE · 04 November 2026 · J-042

Infrastructure owner: Platform team
Receiving team: Application team
Cluster installation: successful (separate from journey completion)
Boot route: ${route}
Release: OpenShift 4.22 / matching OpenShift Virtualization · 3 control plane + 2 workers

## Verified scope
Five expected nodes Ready; core Cluster Operators available and not degraded.
Worker hardware virtualization enabled and capacity checked for the selected test.
Existing supported CSI backend connected; vm-storage class and profile use RWX/Block; test volumes provisioned and attached.
OpenShift Virtualization Operator installed and HyperConverged configuration observed Available, not progressing or degraded.
Disposable Linux VM virt-smoke booted on worker-0. Guest responded over approved API-mediated SSH; guest wrote, flushed, reopened and read the expected data on its separate PVC-backed data disk.
Customer site-validation pre-hook and vm-network-validation post-hook passed declared checks.
Guest DNS resolved app-probe-01.dc.example.com to 10.20.60.20. Guest HTTPS request returned 200 / edge-east-smoke-ok after the recorded firewall repair.
Image pull, scheduling on both workers, pod DNS, cross-node traffic and test Route response checks passed.
VM, VMI, DataVolumes, test PVCs, underlying temporary volumes and platform smoke resources removed; result artifacts retained. Configured virtualization and vm-storage remain.

## Endpoints and access
API: https://api.edge-east.${a.baseDomain}:6443
Console: https://console-openshift-console.apps.edge-east.${a.baseDomain}
API/ingress VIPs: ${a.api} / ${a.ingress}
VM access: request namespace RBAC and an approved SSH credential reference from Platform team; connect through the cluster API using virtctl. The test VM has been deleted.
Guest external test destination: https://app-probe-01.dc.example.com/health, existing fixture 10.20.60.20.
Test Route: https://smoke.apps.edge-east.${a.baseDomain} (removed after test).
No secrets included.

## Evidence and execution context
Prerequisite DNS: admin-probe-01 / admin-client network, resolver ${a.resolver}, UDP and TCP.
${preparation.evidence.map((e) => `DNS attempt ${e.id}: ${e.outcome}, ${e.at}, API ${e.inputs.api}, ingress ${e.inputs.ingress}, resolver ${e.inputs.resolver}`).join("\n")}
${history.map((e) => `${e.at} — ${e.source}: ${e.result} [${e.inputs}]`).join("\n")}
Customer hook records: demo://aap/site-validation/880; demo://aap/vm-network-validation/881 (failed); demo://aap/vm-network-validation/882 (passed). Illustrative artifact references, not live links.
Guest checks: customer controller → cluster API → virt-smoke guest via approved SSH; application fixture reached from inside that guest. Route check: app-probe-01 → ingress.
Test configuration: Linux guest image fixture linux-smoke-v1, 2 vCPU / 4 GiB, separate root and data PVCs, default pod network with masquerade. These settings illustrate a check, not production sizing.

## Limits and next steps
This is scoped, dated infrastructure evidence, not an ongoing availability guarantee. Live migration, HA, performance, application migration and general application readiness were not tested. No additional physical VM network or NMState policy was selected. Storage-vendor compatibility is an explicit site prerequisite, not certified by this prototype.
Platform team retains infrastructure ownership. Application team requests access and validates its own guest images, data, policies and application behavior. No acknowledgement is required to complete this journey.
`;
}
