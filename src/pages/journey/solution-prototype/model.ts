// Throwaway: three compositions of one solution example on /journey?prototype=solution&variant=A|B|C.
export type PrototypeVariant = "A" | "B" | "C";
export type Phase = "pre" | "install" | "post";
export type Snapshot =
  | { kind: "draft" | "saved" | "ready" | "manual" }
  | {
      kind: "observing" | "installed" | "failed" | "complete";
      boot: "automated" | "manual";
    };

export const variants: {
  key: PrototypeVariant;
  name: string;
  question: string;
}[] = [
  {
    key: "A",
    name: "Guided story",
    question: "Does a chapter at a time make the proposal easier to explain?",
  },
  {
    key: "B",
    name: "Saved journey",
    question:
      "Does the whole record make continuity and overall status clearer?",
  },
  {
    key: "C",
    name: "Coordinated timeline",
    question:
      "Do visible handoffs make the orchestration easier to understand?",
  },
];
export const phases: {
  key: Phase;
  name: string;
  short: string;
  title: string;
  idea: string;
}[] = [
  {
    key: "pre",
    name: "Pre-installation",
    short: "Prepare",
    title: "Start before you have every answer.",
    idea: "The journey exists before the cluster. Save the plan, assign what is missing, and pick it up later.",
  },
  {
    key: "install",
    name: "Installation",
    short: "Install",
    title: "Automate the path. Guide the handoff.",
    idea: "The hub prepares Agent media and coordinates boot. When remote boot is unavailable, the same journey guides a person through it.",
  },
  {
    key: "post",
    name: "Post-installation",
    short: "Verify",
    title: "An installed cluster is one milestone.",
    idea: "Required infrastructure configuration and its checks still need to pass. A failed hook keeps the overall journey from being ready.",
  },
];

export function phaseFor(snapshot: Snapshot): Phase {
  switch (snapshot.kind) {
    case "draft":
    case "saved":
    case "ready":
      return "pre";
    case "manual":
    case "observing":
      return "install";
    case "installed":
    case "failed":
    case "complete":
      return "post";
  }
}

export function journeyStatus(snapshot: Snapshot) {
  switch (snapshot.kind) {
    case "draft":
      return {
        label: "Prerequisites incomplete",
        tone: "waiting",
        detail:
          "Two inputs are missing. A journey can be saved before it is ready to run.",
      };
    case "saved":
      return {
        label: "Saved for later",
        tone: "waiting",
        detail:
          "Waiting on DNS and the boot-access decision. The planned cluster, owners and completed work are retained.",
      };
    case "ready":
      return {
        label: "Ready to install",
        tone: "active",
        detail:
          "Prerequisites and the required pre-installation hook passed in this illustrative run.",
      };
    case "manual":
      return {
        label: "Waiting for manual boot",
        tone: "waiting",
        detail:
          "Remote BMC access is unavailable. The prepared Agent media and the same journey remain available.",
      };
    case "observing":
      return {
        label: "Installation in progress",
        tone: "active",
        detail:
          "Boot was reported. The example still needs separate evidence of base installation completion.",
      };
    case "installed":
      return {
        label: "Post-installation pending",
        tone: "active",
        detail:
          "Base installation succeeded. Infrastructure configuration and a required smoke test remain.",
      };
    case "failed":
      return {
        label: "Needs attention",
        tone: "failed",
        detail:
          "The base cluster is installed, but the required workload-network smoke test failed. Infrastructure is not ready.",
      };
    case "complete":
      return {
        label: "Infrastructure ready",
        tone: "success",
        detail:
          "The selected infrastructure work and bounded smoke test passed. This does not establish readiness for every application.",
      };
  }
}

export function phaseStatus(phase: Phase, snapshot: Snapshot) {
  const preparationIncomplete =
    snapshot.kind === "draft" || snapshot.kind === "saved";
  if (phase === "pre")
    return preparationIncomplete ? "3 of 5 complete" : "5 of 5 complete";
  if (phase === "install") {
    if (preparationIncomplete || snapshot.kind === "ready")
      return "Not started";
    if (snapshot.kind === "manual") return "Manual boot needed";
    if (snapshot.kind === "observing") return "In progress";
    return "Base cluster installed";
  }
  if (snapshot.kind === "failed") return "Required hook failed";
  if (snapshot.kind === "complete") return "Checks passed";
  if (snapshot.kind === "installed") return "Ready to configure";
  return "Not started";
}
