export type PhaseId = "pre-installation" | "installation" | "post-installation";
export type Lens = "process" | "problems" | "opportunities";

export interface FlowStep {
  title: string;
  detail: string;
}

/** A topic has one navigational parent; related topics connect it across phases. */
export interface Topic {
  id: string;
  parent: string | null;
  phase: PhaseId | null;
  title: string;
  summary: string;
  question: string;
  outcome: string;
  owners: string;
  scope: string;
  flow: FlowStep[];
  related?: string[];
}

export interface Problem {
  id: string;
  topics: string[];
  title: string;
  summary: string;
  context: string;
  evidence: string;
  impact: string;
  limit: string;
  kind:
    | "Reported experience"
    | "Historical evidence"
    | "Acceptance requirement"
    | "Research gap";
}

export interface Opportunity {
  id: string;
  topics: string[];
  title: string;
  summary: string;
  problems: string[];
  intervention: string;
  existing: string;
  investigate: string;
  measure: string;
}

export interface Route {
  topic: string;
  lens: Lens;
  item?: string;
}
