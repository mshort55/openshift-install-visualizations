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
        "Extend self-contained installation through a selected storage integration, network and first VM.",
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
        "Export actionable host-check failures, preview the next site's configuration and request missing offline content.",
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
        "Open the failed configuration job and preview the changed inputs and work its supported rerun will perform.",
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
        "The first-VM profile proposed in deployment planning carries this milestone into the selected storage, network and guest setup.",
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
        "Choose storage by required VM behavior, map source networks to verified connections and explain access for a specific user task.",
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
        "Rehearse an application migration on an isolated test target before reviewing production cutover.",
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
        "Collect evidence from the failed task and tie policy-impact reviews to application owners and the tested policy revision.",
    },
    note: "Complete operational preparation before handover. The platform team retains cluster operations after application teams receive access.",
  },
];
