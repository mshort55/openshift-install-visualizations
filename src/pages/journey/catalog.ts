import { opportunities, problems } from "./data/evidence";
import { stages } from "./data/stages";
import { topics } from "./data/topics";
import { occurrenceDateLabel, reportedDateLabel } from "./evidence-dates";
import type { Lens, Route, Topic } from "./model";

export { opportunities, problems, stages, topics };

/** Finds the timeline stage containing a topic, including its nested explanations. */
export function stageForTopic(id: string) {
  const ancestors = new Set(ancestorsOf(id).map((topic) => topic.id));
  return stages.find((stage) =>
    stage.topics.some((topic) => ancestors.has(topic)),
  );
}
export const topicById = new Map(topics.map((topic) => [topic.id, topic]));
export const phaseIds = [
  "pre-installation",
  "installation",
  "post-installation",
] as const;
export const lenses: { id: Lens; label: string; description: string }[] = [
  {
    id: "process",
    label: "How it works",
    description: "Understand the work and what it takes to move forward.",
  },
  {
    id: "problems",
    label: "Customer problems",
    description:
      "Explore reported difficulties, their consequences and evidence.",
  },
  {
    id: "opportunities",
    label: "Improvement opportunities",
    description:
      "Explore possible interventions and how we could evaluate them.",
  },
];

/** Returns the topic's direct children in their editorial order. */
export function childrenOf(id: string): Topic[] {
  return topics.filter((topic) => topic.parent === id);
}

/** Includes the selected topic, so records attached to a branch and its leaves are both discoverable. */
export function descendantsOf(id: string): Set<string> {
  const result = new Set<string>();
  const visit = (current: string) => {
    if (result.has(current)) return;
    result.add(current);
    for (const child of childrenOf(current)) visit(child.id);
  };
  visit(id);
  return result;
}

export function ancestorsOf(id: string): Topic[] {
  const result: Topic[] = [];
  let current = topicById.get(id);
  while (current) {
    result.unshift(current);
    current = current.parent ? topicById.get(current.parent) : undefined;
  }
  return result;
}

export function problemsFor(id: string) {
  const descendants = descendantsOf(id);
  return problems.filter((problem) =>
    [problem.topic, ...problem.relatedTopics].some((topic) =>
      descendants.has(topic),
    ),
  );
}

export function opportunitiesFor(id: string) {
  const descendants = descendantsOf(id);
  return opportunities.filter((opportunity) =>
    opportunity.topics.some((topic) => descendants.has(topic)),
  );
}

/** Hash routes let every topic and record work on an ordinary static host, including subdirectories. */
export function routeHref(route: Route): string {
  const params = new URLSearchParams();
  if (route.lens !== "process") params.set("view", route.lens);
  if (route.item) params.set("item", route.item);
  if (route.stage) params.set("stage", route.stage);
  return `#/journey${route.topic === "journey" ? "" : `/${route.topic}`}${params.size ? `?${params}` : ""}`;
}

// Published problem links follow the content when it is merged or moved into guidance.
const retiredProblemRoutes = new Map<string, Route>([
  [
    "storage-behavior-gap",
    { topic: "storage-drivers", lens: "problems", item: "storage-not-usable" },
  ],
  ["readiness-unproven", { topic: "acceptance", lens: "process" }],
  ["secret-recovery", { topic: "backups", lens: "process" }],
  ["upgrade-dependencies", { topic: "upgrades", lens: "process" }],
  ["handover-knowledge", { topic: "acceptance", lens: "process" }],
  ["physical-evidence-gap", { topic: "hosts", lens: "process" }],
]);

// Retired opportunity links follow the replacement or the retained research/guidance.
const retiredOpportunityRoutes = new Map<string, Route>([
  [
    "constraint-led-choice",
    { topic: "approach", lens: "opportunities", item: "fewer-prerequisites" },
  ],
  [
    "whole-deployment-fit",
    { topic: "approach", lens: "opportunities", item: "fewer-prerequisites" },
  ],
  [
    "network-translation",
    { topic: "workloads", lens: "opportunities", item: "first-workload" },
  ],
  [
    "outcome-plan",
    { topic: "workloads", lens: "opportunities", item: "first-workload" },
  ],
  [
    "storage-outcome",
    { topic: "workloads", lens: "opportunities", item: "first-workload" },
  ],
  [
    "first-vm-guidance",
    { topic: "workloads", lens: "opportunities", item: "first-workload" },
  ],
  [
    "earlier-dependency-feedback",
    { topic: "networking", lens: "opportunities", item: "precise-handoffs" },
  ],
  [
    "actionable-progress",
    { topic: "progress", lens: "opportunities", item: "supported-recovery" },
  ],
  [
    "retry-continuity",
    { topic: "progress", lens: "opportunities", item: "supported-recovery" },
  ],
  [
    "clear-boot-handoff",
    { topic: "media", lens: "problems", item: "boot-handoff" },
  ],
  ["confidence-rehearsal", { topic: "acceptance", lens: "process" }],
  ["dependency-aware-change", { topic: "upgrades", lens: "process" }],
]);

/** Invalid or out-of-scope items fall back to their topic rather than showing an unrelated record. */
export function parseRoute(hash: string): Route {
  const [path, query] = hash
    .replace(/^#\/?/, "")
    .replace(/^journey\//, "")
    .split("?");
  const topicId =
    path === "managed-dns" || path === "dns-consumers"
      ? "dns"
      : path === "preboot-readiness"
        ? "media"
        : path === "storage-behavior"
          ? "storage-drivers"
          : path;
  const topic = topicId && topicById.has(topicId) ? topicId : "journey";
  const params = new URLSearchParams(query);
  const value = params.get("view");
  const lens: Lens =
    value === "problems" || value === "opportunities" ? value : "process";
  const route: Route = { topic, lens };
  const stage = stages.find(
    (stage) => stage.id === params.get("stage") && stage.phase === topic,
  );
  if (stage) route.stage = stage.id;
  const item = params.get("item");
  if (lens === "problems" && item) {
    const retired = retiredProblemRoutes.get(item);
    if (retired) return { ...retired };
    const problem = problemsFor(topic).find((problem) => problem.id === item);
    if (problem) return { topic: problem.topic, lens, item };
  }
  if (lens === "opportunities" && item) {
    const retired = retiredOpportunityRoutes.get(item);
    if (retired) return { ...retired };
    const opportunity = opportunitiesFor(topic).find(
      (opportunity) => opportunity.id === item,
    );
    if (opportunity) return { topic: opportunity.topics[0], lens, item };
  }
  return route;
}

export interface SearchResult {
  id: string;
  title: string;
  summary: string;
  context: string;
  searchText: string;
  route: Route;
}

/** Searches all three perspectives; results retain a concrete place in the journey. */
export function searchJourney(query: string): SearchResult[] {
  const words = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const records: SearchResult[] = [
    ...topics
      .filter((topic) => topic.id !== "journey")
      .map((topic) => ({
        id: `topic-${topic.id}`,
        title: topic.title,
        summary: topic.summary,
        searchText: [
          topic.question,
          topic.outcome,
          topic.owners,
          topic.scope,
          ...topic.flow.map(
            (step) => `${step.title} ${step.detail} ${step.command ?? ""}`,
          ),
          ...(topic.notes ?? []).map((note) => `${note.title} ${note.detail}`),
          ...(topic.serviceFlows ?? []).map((flow) =>
            [
              flow.source,
              flow.destination,
              flow.protocol,
              flow.purpose,
              flow.owner,
              flow.applies,
            ].join(" "),
          ),
          ...(topic.operatorExamples ?? []).map((example) =>
            [example.need, example.operators, example.configuration].join(" "),
          ),
        ].join(" "),
        context:
          ancestorsOf(topic.id)
            .slice(1, -1)
            .map((part) => part.title)
            .join(" / ") || "Journey phase",
        route: { topic: topic.id, lens: "process" as const },
      })),
    ...problems.map((problem) => ({
      id: `problem-${problem.id}`,
      title: problem.title,
      summary: problem.summary,
      context: "Customer problem",
      searchText: [
        problem.impact,
        problem.outcome,
        problem.limit,
        problem.context,
        problem.researchQuestion ?? "",
        ...problem.examples.flatMap((example) => [
          example.title,
          example.platform,
          reportedDateLabel(example.reported),
          occurrenceDateLabel(example.occurred),
          example.basis,
          example.finding,
          example.limitation,
        ]),
      ].join(" "),
      route: {
        topic: problem.topic,
        lens: "problems" as const,
        item: problem.id,
      },
    })),
    ...opportunities.map((opportunity) => ({
      id: `opportunity-${opportunity.id}`,
      title: opportunity.title,
      summary: opportunity.summary,
      context: "Improvement opportunity",
      searchText: [
        opportunity.priority === "recommended"
          ? "Recommended next investigation"
          : "",
        opportunity.applicability,
        opportunity.intervention,
        opportunity.existing,
        opportunity.alternative,
        opportunity.investigate,
        opportunity.measure,
        opportunity.stopWhen,
        opportunity.owners,
      ].join(" "),
      route: {
        topic: opportunity.topics[0],
        lens: "opportunities" as const,
        item: opportunity.id,
      },
    })),
  ];
  return records
    .filter((record) =>
      words.every((word) =>
        `${record.title} ${record.summary} ${record.context} ${record.searchText}`
          .toLocaleLowerCase()
          .includes(word),
      ),
    )
    .sort(
      (a, b) =>
        Number(b.title.toLocaleLowerCase().includes(words.join(" "))) -
        Number(a.title.toLocaleLowerCase().includes(words.join(" "))),
    );
}
