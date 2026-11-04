// Throwaway prerequisite story: all requests, timestamps and observations are illustrative.
export type Answers = {
  baseDomain: string;
  api: string;
  ingress: string;
  resolver: string;
  owner: string;
  addressing: "dhcp" | "static";
  changeApproval: boolean;
};
export type DnsInputs = Pick<
  Answers,
  "baseDomain" | "api" | "ingress" | "resolver"
>;
export type CheckId = "api" | "apps" | "client";
export type Evidence = {
  id: number;
  inputs: DnsInputs;
  method: "automatic" | "manual";
  outcome: "passed" | "failed";
  at: string;
};
export type Request = {
  reference: string;
  owner: string;
  inputs: DnsInputs;
  body: string;
  report: null | { by: string; at: string };
};
export type Observation =
  | { kind: "idle" }
  | { kind: "unavailable" }
  | { kind: "running"; inputs: DnsInputs };
export type PreparationState = {
  answers: Answers;
  requests: Request[];
  evidence: Evidence[];
  observation: Observation;
  history: string[];
};
export const initialPreparation = (): PreparationState => ({
  answers: {
    baseDomain: "dc.example.com",
    api: "",
    ingress: "10.20.30.11",
    resolver: "10.20.10.53",
    owner: "Network team",
    addressing: "dhcp",
    changeApproval: false,
  },
  requests: [],
  evidence: [],
  observation: { kind: "idle" },
  history: [
    "Example plan created for edge-east · three control plane hosts and two workers.",
  ],
});
const ipv4 = (value: string) =>
  /^(\d{1,3}\.){3}\d{1,3}$/.test(value) &&
  value.split(".").every((part) => Number(part) <= 255);
export function missingAnswers(answers: Answers) {
  const missing: string[] = [];
  if (
    !answers.baseDomain ||
    answers.baseDomain.length > 230 ||
    !answers.baseDomain
      .split(".")
      .every((label) => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(label))
  )
    missing.push("Valid base domain");
  if (!ipv4(answers.api)) missing.push("API virtual IP address");
  if (!ipv4(answers.ingress)) missing.push("Ingress virtual IP address");
  if (answers.api && answers.api === answers.ingress)
    missing.push("Distinct API and ingress addresses");
  if (!ipv4(answers.resolver)) missing.push("DNS resolver address");
  if (!answers.owner.trim()) missing.push("Responsible IT team");
  return missing;
}
export function dnsInputs(answers: DnsInputs): DnsInputs {
  return {
    baseDomain: answers.baseDomain,
    api: answers.api,
    ingress: answers.ingress,
    resolver: answers.resolver,
  };
}
export function sameInputs(a: DnsInputs, b: DnsInputs) {
  return (
    a.baseDomain === b.baseDomain &&
    a.api === b.api &&
    a.ingress === b.ingress &&
    a.resolver === b.resolver
  );
}
export const checkNames: Record<CheckId, string> = {
  api: "API client DNS",
  apps: "Application wildcard DNS",
  client: "Client DNS readiness · depends on both lookups",
};
export function affected(check: CheckId, a: DnsInputs, b: DnsInputs) {
  return (
    a.baseDomain !== b.baseDomain ||
    a.resolver !== b.resolver ||
    ((check === "api" || check === "client") && a.api !== b.api) ||
    ((check === "apps" || check === "client") && a.ingress !== b.ingress)
  );
}
export function checkState(state: PreparationState, check: CheckId) {
  const latest = state.evidence.at(-1);
  if (!latest) return "Not checked";
  if (affected(check, latest.inputs, state.answers)) return "Needs recheck";
  return latest.outcome === "passed" ? "Passed" : "Failed";
}
export function currentRequest(state: PreparationState) {
  const request = state.requests.at(-1);
  return request && sameInputs(request.inputs, state.answers)
    ? request
    : undefined;
}
export function preparationStatus(state: PreparationState) {
  const missing = missingAnswers(state.answers);
  const request = currentRequest(state);
  if (state.observation.kind === "running")
    return {
      label: "Running",
      detail:
        "Checking client DNS from admin-probe-01 on the admin/client network.",
      tone: "active",
    };
  if (missing.length)
    return {
      label: "Needs input",
      detail: `${missing.join("; ")} still needed. Save what you know and return later.`,
      tone: "waiting",
    };
  if (checkState(state, "client") === "Needs recheck")
    return {
      label: "Needs recheck",
      detail:
        "DNS inputs changed. Affected evidence is historical; update the request and rerun the affected checks.",
      tone: "waiting",
    };
  if (state.observation.kind === "unavailable")
    return {
      label: "Status unknown",
      detail:
        "The hub cannot observe DNS from the client network. Follow the local check instructions; no failure has been observed.",
      tone: "waiting",
    };
  if (checkState(state, "client") === "Failed")
    return {
      label: "Failed",
      detail:
        "The client DNS check returned an unexpected answer. Ask the owner to correct it, then retry.",
      tone: "failed",
    };
  if (checkState(state, "client") === "Passed")
    return {
      label: "Ready to run",
      detail:
        "Client DNS is verified for these inputs. Continue with the remaining preflight work; cluster installation has not started.",
      tone: "active",
    };
  if (request && !request.report)
    return {
      label: "Waiting",
      detail: `Waiting on ${state.answers.owner} — DNS records requested (${request.reference}).`,
      tone: "waiting",
    };
  return {
    label: "Ready to run",
    detail: request?.report
      ? "Completion reported. Verify DNS from the client network next."
      : "Inputs captured. Prepare the DNS request next.",
    tone: "active",
  };
}
export function commands(inputs: DnsInputs) {
  const domain = `edge-east.${inputs.baseDomain}`;
  return `# Run on admin-probe-01 (admin/client network), not on your laptop.\n# Record hostname and UTC time with the output.\nhostname; date -u\ndig @${inputs.resolver} api.${domain} A +noall +answer\ndig @${inputs.resolver} api.${domain} A +tcp +noall +answer\ndig @${inputs.resolver} guidance-check.apps.${domain} A +noall +answer\ndig @${inputs.resolver} guidance-check.apps.${domain} A +tcp +noall +answer`;
}
export function requestText(answers: Answers) {
  const domain = `edge-east.${answers.baseDomain}`;
  return `Subject: Prepare client DNS for edge-east\nTo: ${answers.owner}\nJourney: J-042 · 3 control plane + 2 workers\n\nPlease publish these records in the DNS view used by admin and application clients:\napi.${domain}.  A  ${answers.api}\n*.apps.${domain}.  A  ${answers.ingress}\n\nResolver to validate: ${answers.resolver}\nClients: admin-probe-01 on the admin/client network\nWhen: before monitoring installation from this context and before browser/route access\nUse the site's standard TTL and confirm the effective value.\nScope the wildcard to *.apps; do not create *.${domain}.\n\nAcceptance: the API name returns ${answers.api}; a fresh name under apps returns ${answers.ingress}, via UDP and TCP DNS. Confirm resolver visibility and attach command output, source host, time and request reference.\n\n${commands(answers)}\n\nThis request covers client DNS publication. Target-host resolver access, node identity, managed internal DNS, API connectivity and application reachability are separate checks. Reported completion will trigger verification; closing a ticket does not establish readiness.`;
}
export type PreparationAction =
  | { kind: "answers"; answers: Answers }
  | { kind: "saved" }
  | { kind: "requested"; reference: string }
  | { kind: "reported" }
  | { kind: "unavailable" }
  | { kind: "start" }
  | {
      kind: "finish";
      method: "automatic" | "manual";
      outcome: "passed" | "failed";
    };
export function updatePreparation(
  state: PreparationState,
  action: PreparationAction,
): PreparationState {
  switch (action.kind) {
    case "answers": {
      const changed = !sameInputs(state.answers, action.answers);
      return {
        ...state,
        answers: action.answers,
        observation: { kind: "idle" },
        history: [
          ...state.history,
          changed
            ? "DNS inputs saved. Earlier requests and check inputs retained."
            : "Checklist or owner updated. DNS evidence unchanged.",
        ],
      };
    }
    case "saved":
      return {
        ...state,
        history: [
          ...state.history,
          "Incomplete journey saved, including missing answers, checklist and owners.",
        ],
      };
    case "requested": {
      if (missingAnswers(state.answers).length || !action.reference.trim())
        return state;
      return {
        ...state,
        observation: { kind: "idle" },
        requests: [
          ...state.requests,
          {
            reference: action.reference.trim(),
            owner: state.answers.owner,
            inputs: dnsInputs(state.answers),
            body: requestText(state.answers),
            report: null,
          },
        ],
        history: [
          ...state.history,
          `Request ${action.reference.trim()} recorded for ${state.answers.owner}. Waiting for their work.`,
        ],
      };
    }
    case "reported": {
      const request = currentRequest(state);
      if (!request) return state;
      return {
        ...state,
        requests: state.requests.map((item) =>
          item === request
            ? {
                ...item,
                report: {
                  by: state.answers.owner,
                  at: "04 Nov · 10:15 UTC (example)",
                },
              }
            : item,
        ),
        history: [
          ...state.history,
          `${state.answers.owner} reported DNS completion. Verification is still required.`,
        ],
      };
    }
    case "unavailable":
      return {
        ...state,
        observation: { kind: "unavailable" },
        history: [
          ...state.history,
          "Automatic observation unavailable from the required network. Local verification offered.",
        ],
      };
    case "start": {
      if (
        !currentRequest(state)?.report ||
        missingAnswers(state.answers).length
      )
        return state;
      return {
        ...state,
        observation: { kind: "running", inputs: dnsInputs(state.answers) },
      };
    }
    case "finish": {
      if (!currentRequest(state)?.report) return state;
      const inputs =
        state.observation.kind === "running"
          ? state.observation.inputs
          : dnsInputs(state.answers);
      return {
        ...state,
        observation: { kind: "idle" },
        evidence: [
          ...state.evidence,
          {
            id: state.evidence.length + 1,
            inputs,
            method: action.method,
            outcome: action.outcome,
            at: `04 Nov · 10:${20 + state.evidence.length} UTC (example)`,
          },
        ],
        history: [
          ...state.history,
          `${action.method === "manual" ? "Reviewed local command output" : "Automatic client-network check"}: ${action.outcome}. Earlier attempts retained.`,
        ],
      };
    }
  }
}
