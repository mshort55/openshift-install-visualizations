import { scenes } from "./model";

export type ReadinessState = { kind: "failed" } | { kind: "recovered" };
export const initialReadiness: ReadinessState = { kind: "failed" };

const preservedResults = [
  "Five nodes Ready; core Cluster Operators available and not degraded. OpenShift Virtualization configured and selected storage verified.",
  "Customer site-validation pre-hook passed its declared site checks before boot.",
];

const failedAttempt = {
  reference: "demo://aap/vm-network-validation/881",
  time: "11:12 UTC",
  result:
    "Failed — guest DNS resolved app-probe-01.dc.example.com to 10.20.60.20; HTTPS /health timed out. Expected HTTP 200 / edge-east-smoke-ok.",
};
const passingAttempt = {
  reference: "demo://aap/vm-network-validation/882",
  time: "11:16 UTC",
  result:
    "Job execution succeeded; declared guest checks passed. DNS resolved app-probe-01.dc.example.com to 10.20.60.20; HTTPS /health returned HTTP 200 / edge-east-smoke-ok.",
};

export const completedScope = {
  checks: [
    "Customer vm-network-validation post-hook passed its declared guest DNS and HTTPS checks after targeted retry.",
    "Guest responsiveness and separate PVC-backed data-disk write/read passed.",
    "Bounded image pull, scheduling on both workers, pod DNS, cross-node traffic and baseline Route checks passed.",
  ],
  cleanup:
    "Cleanup verified: temporary VM/VMI, DataVolumes, test PVCs and backend volumes, platform test resources and temporary access resources removed. Configured Virtualization and storage remain; result artifacts are retained.",
  handoff:
    "Sample infrastructure handoff available: Platform team → Application team. Application validation remains with the recipient.",
};

export function recoverReadiness(): ReadinessState {
  return { kind: "recovered" };
}

export function readinessView({ state }: { state: ReadinessState }) {
  const recovered = state.kind === "recovered";
  return {
    ...scenes.readiness,
    status: recovered ? "Complete" : scenes.readiness.status,
    preservedResults,
    attempts: recovered ? [failedAttempt, passingAttempt] : [failedAttempt],
    completion: recovered ? completedScope : null,
  };
}
