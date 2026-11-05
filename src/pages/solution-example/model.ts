// Illustrative execution state is separate from the chapter being read.
export type Phase = "pre" | "install" | "post";
export type DnsAttempt = "passed" | "failed";
export type VerifiedDns = { kind: "verified"; attempts: DnsAttempt[] };
export type DnsRequest =
  | { kind: "needed" }
  | { kind: "generating" }
  | { kind: "requested" }
  | {
      kind: "fulfilled" | "verifying";
      mismatch: boolean;
      attempts: DnsAttempt[];
    }
  | { kind: "failed"; attempts: DnsAttempt[] }
  | VerifiedDns;

export type Snapshot =
  | { kind: "draft" | "saved"; dns: DnsRequest }
  | { kind: "ready" | "manual"; dns: VerifiedDns }
  | {
      kind: "observing" | "installed" | "failed" | "complete";
      boot: "automated" | "manual";
      dns: VerifiedDns;
    };

export const sampleVerifiedDns: VerifiedDns = {
  kind: "verified",
  attempts: ["passed"],
};

export function dnsStatus(dns: DnsRequest) {
  switch (dns.kind) {
    case "needed":
      return "Request not generated · API and application records needed";
    case "generating":
      return "Generating a sample request from the cluster plan";
    case "requested":
      return "Awaiting DNS team · sample request DNS-1042 generated";
    case "fulfilled":
      return "Reported complete · verification pending";
    case "verifying":
      return "Running sample verification · admin-network lookups";
    case "failed":
      return "Verification failed · application record does not match";
    case "verified":
      return "Verified · sample admin-network lookups passed";
  }
}

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
      return "pre";
    case "ready":
    case "manual":
    case "observing":
      return "install";
    case "installed":
    case "failed":
    case "complete":
      return "post";
  }
}

export type PhaseProgress =
  | { kind: "complete" }
  | { kind: "current"; needsAttention: boolean }
  | { kind: "blocked"; prerequisite: "pre" | "install" };

export function phaseProgress(phase: Phase, snapshot: Snapshot): PhaseProgress {
  const current = phaseFor(snapshot);
  const currentIndex = phases.findIndex((item) => item.key === current);
  const phaseIndex = phases.findIndex((item) => item.key === phase);
  if (snapshot.kind === "complete" || phaseIndex < currentIndex)
    return { kind: "complete" };
  if (phase === current)
    return {
      kind: "current",
      needsAttention:
        snapshot.kind === "failed" || snapshot.dns.kind === "failed",
    };
  return {
    kind: "blocked",
    prerequisite: phase === "post" ? "install" : "pre",
  };
}

export function phaseProgressLabel(progress: PhaseProgress) {
  switch (progress.kind) {
    case "complete":
      return "Complete";
    case "current":
      return "Current phase";
    case "blocked":
      return progress.prerequisite === "pre"
        ? "Requires pre-installation"
        : "Requires installation";
  }
}

export function journeyStatus(snapshot: Snapshot) {
  if (
    (snapshot.kind === "draft" || snapshot.kind === "saved") &&
    snapshot.dns.kind === "failed"
  ) {
    return {
      label: "Needs attention",
      tone: "failed",
      detail:
        "DNS publication was reported, but the application lookup failed verification. The DNS team must correct the record before installation.",
    };
  }
  switch (snapshot.kind) {
    case "draft":
      return {
        label: "Prerequisites incomplete",
        tone: "waiting",
        detail:
          snapshot.dns.kind === "verified"
            ? "DNS is verified. The boot-access decision and required pre-installation hook remain."
            : "DNS and boot access are unfinished. Save the journey with its request, owners and completed work.",
      };
    case "saved":
      return {
        label: "Saved for later",
        tone: "waiting",
        detail:
          snapshot.dns.kind === "verified"
            ? "DNS verification is retained. Boot access and the required pre-installation hook still need to be resolved."
            : `${dnsStatus(snapshot.dns)}. The planned cluster, boot-access decision and completed work are retained in this preview.`,
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
    return preparationIncomplete
      ? snapshot.dns.kind === "verified"
        ? "4 of 5 complete"
        : "3 of 5 complete"
      : "5 of 5 complete";
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
