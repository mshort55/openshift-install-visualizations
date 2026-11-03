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
        "Hardware and storage assumptions can block the intended workload; historical accounts also describe difficulty selecting an installation path.",
      opportunities:
        "Explain method responsibilities and check feasibility before committing to a design.",
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
        "Team handoffs, connectivity corrections and mirrored-content preparation can delay a usable environment.",
      opportunities:
        "Translate site requirements into clear requests and guide content and boot preparation.",
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
        "Observe real physical installations and connect each host’s state to a useful next action.",
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
        "Finding the failed component and choosing a cleanup or rerun can require work across resources and tools.",
      opportunities:
        "Explain progress, identify the owner of a failure and preserve context through retry.",
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
        "Carry the intended workload and its remaining tasks across the installation boundary.",
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
        "Reported accounts describe remaining platform, storage and VM-network configuration, plus difficulty understanding effective access.",
      opportunities:
        "Guide setup through a representative workload operation and verify effective access.",
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
        "No separate problem account is assigned to workload validation.",
      opportunities:
        "Show and verify the remaining work between an installed cluster and a useful outcome.",
    },
  },
  {
    id: "handover-operations",
    phase: "post-installation",
    title: "Hand over to application teams",
    topics: ["operations", "acceptance"],
    summaries: {
      process:
        "Prepare update, recovery and support procedures. Review workload results and give application teams operating instructions and request procedures.",
      problems:
        "Acceptance requirements and lifecycle context are in How it works.",
      opportunities:
        "Link workload and restore results to known restrictions, operating instructions and named support contacts.",
    },
    note: "Complete operational preparation before handover. The platform team retains cluster operations after application teams receive access.",
  },
];
