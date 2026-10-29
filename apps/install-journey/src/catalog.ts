import { opportunities, problems } from "./data/evidence";
import { topics } from "./data/topics";
import type { Lens, Route, Topic } from "./model";

export { opportunities, problems, topics };
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
    problem.topics.some((topic) => descendants.has(topic)),
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
  return `#/${route.topic}${params.size ? `?${params}` : ""}`;
}

/** Invalid or out-of-scope items fall back to their topic rather than showing an unrelated record. */
export function parseRoute(hash: string): Route {
  const [path, query] = hash.replace(/^#\/?/, "").split("?");
  const topic = path && topicById.has(path) ? path : "journey";
  const params = new URLSearchParams(query);
  const value = params.get("view");
  const lens: Lens =
    value === "problems" || value === "opportunities" ? value : "process";
  const route: Route = { topic, lens };
  const item = params.get("item");
  const records =
    lens === "problems"
      ? problemsFor(topic)
      : lens === "opportunities"
        ? opportunitiesFor(topic)
        : [];
  if (item && records.some((record) => record.id === item)) route.item = item;
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
          ...topic.flow.map((step) => `${step.title} ${step.detail}`),
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
      searchText: `${problem.evidence} ${problem.impact} ${problem.limit} ${problem.context}`,
      route: {
        topic: problem.topics[0] ?? "journey",
        lens: "problems" as const,
        item: problem.id,
      },
    })),
    ...opportunities.map((opportunity) => ({
      id: `opportunity-${opportunity.id}`,
      title: opportunity.title,
      summary: opportunity.summary,
      context: "Improvement opportunity",
      searchText: `${opportunity.intervention} ${opportunity.existing} ${opportunity.investigate}`,
      route: {
        topic: opportunity.topics[0] ?? "journey",
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
