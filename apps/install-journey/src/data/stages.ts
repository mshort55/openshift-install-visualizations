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
    title: "Choose the deployment approach",
    topics: ["approach", "hardware"],
    summaries: {
      process:
        "Match the installation method and available hardware to the intended workload.",
      problems:
        "Fixed site constraints and uncertain hardware fit make the starting path hard to choose.",
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
        "Prepare networks, host access, configuration and the content needed to boot machines.",
      problems:
        "Network assumptions, restricted content and physical handoffs can leave prerequisites unfinished.",
      opportunities:
        "Translate site requirements into clear requests and guide content and boot preparation.",
    },
    note: "Work can run in parallel across infrastructure, network and platform teams.",
  },
  {
    id: "verify-readiness",
    phase: "pre-installation",
    title: "Verify readiness to begin",
    topics: ["handoffs"],
    summaries: {
      process:
        "Confirm owners, approvals and prerequisites before starting an installation attempt.",
      problems:
        "The installation owner depends on specialists and approvals beyond their control.",
      opportunities:
        "Make prerequisite requests testable and distinguish waiting for an owner from a failed check.",
    },
  },
  {
    id: "install-hosts",
    phase: "installation",
    title: "Boot and install the hosts",
    topics: ["hosts"],
    summaries: {
      process:
        "Bring the prepared hosts into the installation and follow their progress.",
      problems:
        "Unclear host progress and limited observation of physical execution make diagnosis difficult.",
      opportunities:
        "Observe real physical installations and connect each host’s state to a useful next action.",
    },
  },
  {
    id: "bootstrap-cluster",
    phase: "installation",
    title: "Bootstrap, monitor and recover",
    topics: ["bootstrap", "progress", "recovery"],
    summaries: {
      process:
        "Establish the control plane, interpret progress and correct a blocked attempt.",
      problems:
        "Quiet intervals, late dependency failures and repeated setup obscure the path forward.",
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
        "Confirm the base cluster is installed and identify the work still needed for the workload.",
      problems:
        "An installed cluster can look finished while workload dependencies remain incomplete.",
      opportunities:
        "Carry the intended workload and its remaining tasks across the installation boundary.",
    },
  },
  {
    id: "enable-dependencies",
    phase: "post-installation",
    title: "Configure workload dependencies",
    topics: ["storage", "workload-network", "access"],
    summaries: {
      process:
        "Connect storage, workload networking and access to the operations users need to perform.",
      problems:
        "Storage, network attachments and permissions can remain unusable after the console is available.",
      opportunities:
        "Guide setup through a representative workload operation and verify effective access.",
    },
    note: "Storage, networking and access can be prepared together; the workload needs them to work together.",
  },
  {
    id: "first-workload",
    phase: "post-installation",
    title: "Run the first useful workload",
    topics: ["workloads"],
    summaries: {
      process:
        "Complete the workload’s dependencies and demonstrate its first useful task.",
      problems:
        "Missing components can stall the intended workload after base installation succeeds.",
      opportunities:
        "Show and verify the remaining work between an installed cluster and a useful outcome.",
    },
  },
  {
    id: "handover-operations",
    phase: "post-installation",
    title: "Demonstrate readiness and hand over",
    topics: ["acceptance", "operations"],
    summaries: {
      process:
        "Test required behavior, transfer operating knowledge and plan for change and recovery.",
      problems:
        "Recovery, add-on compatibility and operating knowledge can remain unresolved after first use.",
      opportunities:
        "Rehearse readiness, diagnosis and recovery with the team that will operate the environment.",
    },
    note: "Operations continue beyond installation, including updates, content refresh and recovery.",
  },
];
