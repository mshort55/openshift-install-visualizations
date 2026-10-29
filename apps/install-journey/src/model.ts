export type PhaseId = "pre-installation" | "installation" | "post-installation";
export type Lens = "process" | "problems" | "opportunities";

export interface FlowStep {
  title: string;
  detail: string;
  command?: string;
}

/** A topic has one navigational parent in the installation journey. */
export interface Topic {
  id: string;
  /** Groups introduce child tasks; other topics present their own process and context. */
  kind?: "group";
  parent: string | null;
  phase: PhaseId | null;
  title: string;
  /** Applicability label shown beside the title, including while collapsed. */
  condition?: string;
  summary: string;
  question: string;
  outcome: string;
  owners: string;
  scope: string;
  /** Empty for groups whose process is explained by their child tasks. */
  flow: FlowStep[];
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
  stage?: string;
}
