export type PhaseId = "pre-installation" | "installation" | "post-installation";
export type Lens = "process" | "problems" | "opportunities";

export interface FlowStep {
  title: string;
  detail: string;
  command?: string;
}

/** A service dependency for preparation planning, not a complete firewall rule. */
export interface ServiceFlow {
  source: string;
  destination: string;
  protocol: string;
  purpose: string;
  owner: string;
  applies: string;
}

/** A representative add-on selected for a workload or site requirement. */
export interface OperatorExample {
  need: string;
  operators: string;
  configuration: string;
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
  /** Supporting context shown only in How it works. */
  notes?: Omit<FlowStep, "command">[];
  /** Optional service dependencies displayed in the process perspective. */
  serviceFlows?: ServiceFlow[];
  /** Optional examples shown before the installation process and included in search. */
  operatorExamples?: OperatorExample[];
}

export type ReportedDate =
  | { kind: "reported" | "study"; date: string }
  | { kind: "disputed"; dates: [string, string] }
  | { kind: "unknown" };

export type OccurrenceDate =
  | { kind: "dated"; period: string }
  | { kind: "ongoing" | "unknown"; detail: string };

/** One anonymous account keeps its event timing separate from its source date. */
export interface EvidenceExample {
  title: string;
  platform: string;
  reported: ReportedDate;
  occurred: OccurrenceDate;
  basis:
    | "Interview transcript"
    | "Research report"
    | "Direct research notes"
    | "Copied meeting notes"
    | "Historical field report"
    | "Historical usability study";
  finding: string;
  limitation: string;
}

export interface Problem {
  id: string;
  /** The one step that displays this problem's full summary card. */
  topic: string;
  /** Former topic associations retained for published problem links. */
  relatedTopics: string[];
  title: string;
  summary: string;
  context: string;
  examples: EvidenceExample[];
  impact: string;
  outcome: string;
  limit: string;
  kind: "Reported experience" | "Historical evidence";
}

export type OpportunityBasis =
  | { kind: "problem"; id: string }
  | { kind: "task"; id: string };

export interface Opportunity {
  id: string;
  topics: string[];
  title: string;
  summary: string;
  /** Distinguishes reported problems from tasks and acceptance requirements. */
  basis: [OpportunityBasis, ...OpportunityBasis[]];
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
