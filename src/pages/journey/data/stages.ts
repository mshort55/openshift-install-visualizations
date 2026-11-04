import type { Lens, PhaseId } from "../model";

export interface JourneyStage {
  id: string;
  phase: PhaseId;
  title: string;
  topics: string[];
  summaries: Record<Lens, string>;
  note?: string;
}

/** Ordered milestones group existing topics without making parallel tasks or installer choices sequential. */
export const stages: JourneyStage[] = [
  {
    id: "choose-approach",
    phase: "pre-installation",
    title: "Plan the deployment",
    topics: ["approach", "topology", "hardware", "security"],
    summaries: {
      process:
        "Choose the release and layout; confirm hardware, workload and security requirements.",
      problems:
        "Hardware fit and installation-path constraints can add work before deployment.",
      opportunities:
        "Compare supported paths to remove avoidable prerequisites while preserving workload fit and operating requirements.",
    },
  },
  {
    id: "prepare-environment",
    phase: "pre-installation",
    title: "Prepare infrastructure and content",
    topics: ["networking", "content"],
    summaries: {
      process:
        "Choose network and image-access responsibilities, prepare services and media, and review readiness for boot.",
      problems:
        "Owner handoffs, connectivity corrections, content delivery and reusable configuration can delay deployment preparation.",
      opportunities:
        "Verify prerequisites where they are consumed, reuse working configuration and prepare offline content through first use.",
    },
    note: "Teams can prepare services in parallel. Distinguish agreed settings, prepared services and checks verified from the booted hosts.",
  },
  {
    id: "install-hosts",
    phase: "installation",
    title: "Boot and install the hosts",
    topics: ["hosts"],
    summaries: {
      process:
        "Boot the installation media, resolve validation failures, and monitor host installation.",
      problems:
        "No separate problem account is assigned to host boot and discovery.",
      opportunities:
        "Current physical-install observations are needed before choosing a new boot-handoff intervention.",
    },
    note: "Host installation and bootstrap overlap.",
  },
  {
    id: "bootstrap-cluster",
    phase: "installation",
    title: "Bootstrap, monitor and recover",
    topics: ["bootstrap", "progress", "recovery"],
    summaries: {
      process:
        "Monitor bootstrap and installation completion; collect diagnostics and correct failures.",
      problems:
        "Image provisioning, cross-tool diagnosis and recovery can interrupt installation; each account retains its original platform context.",
      opportunities:
        "Connect a failed attempt to its resource, actual inputs, evidence and supported next action.",
    },
    note: "A failed attempt can return to preparation. Correct the dependency before retrying.",
  },
  {
    id: "verify-cluster",
    phase: "installation",
    title: "Verify cluster completion",
    topics: ["completion"],
    summaries: {
      process:
        "Confirm installation completes, verify nodes and core Cluster Operators, and record remaining Operator and workload setup.",
      problems:
        "No separate problem account is assigned to base-cluster verification.",
      opportunities:
        "The first-workload opportunity connects this milestone to remaining configuration and demonstrated use.",
    },
  },
  {
    id: "enable-dependencies",
    phase: "post-installation",
    title: "Configure platform services",
    topics: [
      "platform-operators",
      "storage",
      "workload-network",
      "image-access",
      "access",
      "observability",
    ],
    summaries: {
      process:
        "Install and configure the components required for the intended workloads.",
      problems:
        "Platform, storage, network and identity configuration can remain after installation. Effective access and misleading health displays can complicate use and diagnosis.",
      opportunities:
        "Verify delegated access through a real task; connect storage and network configuration to the first-workload investigation.",
    },
    note: "Tasks can run in parallel where their dependencies allow. Select additional components according to workload and site requirements.",
  },
  {
    id: "first-workload",
    phase: "post-installation",
    title: "Prove workload readiness",
    topics: ["workloads"],
    summaries: {
      process:
        "Test deployment, storage, networking, access, and required maintenance behavior with representative workloads.",
      problems:
        "VM creation and workload migration can remain blocked after the target cluster is installed.",
      opportunities:
        "Complete the customer's actual first workload, with separate preparation when that workload must be migrated.",
    },
  },
  {
    id: "handover-operations",
    phase: "post-installation",
    title: "Prepare operations and hand over to application teams",
    topics: ["operations", "acceptance"],
    summaries: {
      process:
        "Prepare update, recovery and support procedures. Review workload results and give application teams operating instructions and request procedures.",
      problems:
        "Diagnostic access, operating skills and agreed security policies can still need work before teams can support the intended environment.",
      opportunities:
        "Enable evidence collection and escalation, and agree the initial security baseline when policy rollout is required.",
    },
    note: "Complete operational preparation before handover. The platform team retains cluster operations after application teams receive access.",
  },
];
