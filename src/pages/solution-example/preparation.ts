import { scenes } from "./model";

type ApiAddress = "" | "10.20.30.12";
export type PreparationState =
  | { kind: "draft"; apiAddress: "" }
  | { kind: "saved" | "resumed"; apiAddress: ApiAddress }
  | { kind: "answered"; apiAddress: "10.20.30.12" };
export type PreparationAction = "save" | "resume" | "supply-sample";

export const initialPreparation: PreparationState = {
  kind: "draft",
  apiAddress: "",
};

export function updatePreparation({
  state,
  action,
}: {
  state: PreparationState;
  action: PreparationAction;
}): PreparationState {
  switch (action) {
    case "save":
      return { kind: "saved", apiAddress: state.apiAddress };
    case "resume":
      return state.kind === "saved"
        ? { kind: "resumed", apiAddress: state.apiAddress }
        : state;
    case "supply-sample":
      return state.kind === "saved" || state.apiAddress
        ? state
        : { kind: "answered", apiAddress: "10.20.30.12" };
  }
}

export function preparationView({ state }: { state: PreparationState }) {
  const answer = state.apiAddress
    ? `API address ${state.apiAddress}. DNS checks not run.`
    : "API address missing — awaiting IPAM. Needs input.";
  const messages = {
    draft: "",
    saved: `Preparation saved. ${answer} Answers and checklist retained in this session-only demonstration; reload restores defaults.`,
    resumed: `Preparation resumed. ${answer} Answers and checklist retained.`,
    answered:
      "Sample IPAM answer applied: 10.20.30.12. DNS checks not run; cluster installation not started.",
  };
  return {
    ...scenes.preparation,
    status: state.apiAddress
      ? "Ready to run — prerequisite checks"
      : "Needs input",
    identity: "edge-east",
    baseDomain: "dc.example.com",
    apiAddress: state.apiAddress,
    ingressAddress: "10.20.30.11",
    resolver: "10.20.10.53",
    owner: "Network team",
    dns: "Not run",
    readiness: "Not established",
    message: messages[state.kind],
  };
}
