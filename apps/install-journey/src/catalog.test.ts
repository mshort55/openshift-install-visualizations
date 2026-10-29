import { describe, expect, test } from "vitest";
import {
  ancestorsOf,
  childrenOf,
  descendantsOf,
  opportunities,
  opportunitiesFor,
  parseRoute,
  phaseIds,
  problems,
  problemsFor,
  routeHref,
  searchJourney,
  topics,
} from "./catalog";

// Content is the app's navigation model. Broken edges make otherwise valid UI routes dead ends.
describe("journey content integrity", () => {
  test("every topic belongs to exactly one phase, without cycles or orphaned branches", () => {
    const byId = new Map(topics.map((topic) => [topic.id, topic]));
    expect(byId.size).toBe(topics.length);
    expect(childrenOf("journey").map((topic) => topic.id)).toEqual(phaseIds);
    for (const topic of topics) {
      const seen = new Set<string>();
      let node = topic;
      while (node.parent) {
        expect(seen.has(node.id), `cycle at ${node.id}`).toBe(false);
        seen.add(node.id);
        const parent = byId.get(node.parent);
        expect(parent, `missing parent of ${node.id}`).toBeDefined();
        if (!parent) break;
        node = parent;
      }
      expect(node.id).toBe("journey");
      if (topic.id !== "journey") {
        expect(topic.phase).not.toBeNull();
        expect(descendantsOf(topic.phase ?? "").has(topic.id)).toBe(true);
      }
      expect(topic.flow.length).toBeGreaterThanOrEqual(2);
      for (const related of topic.related ?? [])
        expect(byId.has(related)).toBe(true);
    }
  });

  test("all customer accounts and ideas remain reachable and connected", () => {
    const topicIds = new Set(topics.map((topic) => topic.id));
    const problemIds = new Set(problems.map((problem) => problem.id));
    expect(problemIds.size).toBe(problems.length);
    expect(new Set(opportunities.map((idea) => idea.id)).size).toBe(
      opportunities.length,
    );
    for (const record of [...problems, ...opportunities]) {
      expect(record.topics.length).toBeGreaterThan(0);
      for (const topic of record.topics) expect(topicIds.has(topic)).toBe(true);
    }
    for (const problem of problems) {
      expect(problem.limit.length).toBeGreaterThan(30);
      expect(problem.context.length).toBeGreaterThan(10);
      expect(
        opportunities.some((idea) => idea.problems.includes(problem.id)),
      ).toBe(true);
    }
    for (const opportunity of opportunities) {
      expect(opportunity.problems.length).toBeGreaterThan(0);
      for (const problem of opportunity.problems)
        expect(problemIds.has(problem)).toBe(true);
      expect(opportunity.existing.length).toBeGreaterThan(30);
      expect(opportunity.investigate.length).toBeGreaterThan(30);
    }
  });

  test("cross-cutting findings appear once within a phase and keep narrower scopes meaningful", () => {
    expect(problemsFor("networking").map((problem) => problem.id)).toContain(
      "network-layers",
    );
    expect(problemsFor("dns").map((problem) => problem.id)).not.toContain(
      "network-layers",
    );
    expect(
      problemsFor("pre-installation").filter(
        (problem) => problem.id === "owner-wait",
      ),
    ).toHaveLength(1);
    expect(
      opportunitiesFor("storage").filter(
        (idea) => idea.id === "storage-outcome",
      ),
    ).toHaveLength(1);
    expect(ancestorsOf("managed-dns").map((topic) => topic.id)).toEqual([
      "journey",
      "pre-installation",
      "networking",
      "dns",
      "managed-dns",
    ]);
  });
});

describe("shareable navigation and discovery", () => {
  test("all topics and record links round-trip", () => {
    for (const topic of topics) {
      for (const lens of ["process", "problems", "opportunities"] as const) {
        const route = { topic: topic.id, lens };
        expect(parseRoute(routeHref(route))).toEqual(route);
      }
    }
    for (const record of problems) {
      const route = {
        topic: record.topics[0] ?? "journey",
        lens: "problems" as const,
        item: record.id,
      };
      expect(parseRoute(routeHref(route))).toEqual(route);
    }
    for (const record of opportunities) {
      const route = {
        topic: record.topics[0] ?? "journey",
        lens: "opportunities" as const,
        item: record.id,
      };
      expect(parseRoute(routeHref(route))).toEqual(route);
    }
  });

  test("malformed and legacy links preserve valid topics without unrelated records", () => {
    expect(parseRoute("#/missing?view=unknown&item=missing&tour=NaN")).toEqual({
      topic: "journey",
      lens: "process",
    });
    expect(parseRoute("#/dns?view=problems&item=storage-not-usable")).toEqual({
      topic: "dns",
      lens: "problems",
    });
    expect(parseRoute("#/dns?tour=0")).toEqual({
      topic: "dns",
      lens: "process",
    });
    expect(parseRoute("#/pre-installation?tour=0")).toEqual({
      topic: "pre-installation",
      lens: "process",
    });
    expect(
      parseRoute("#/storage?view=opportunities&item=storage-outcome").item,
    ).toBe("storage-outcome");
  });

  test("search finds problem details and multiword concepts with working destinations", () => {
    expect(
      searchJourney(" default storage class ").some(
        (result) => result.route.item === "storage-not-usable",
      ),
    ).toBe(true);
    expect(
      searchJourney("dns workstation").some(
        (result) => result.route.topic === "dns-consumers",
      ),
    ).toBe(true);
    expect(searchJourney("     ")).toEqual([]);
    expect(searchJourney("not-a-topic-in-this-corpus")).toEqual([]);
    for (const result of searchJourney("storage"))
      expect(parseRoute(routeHref(result.route))).toEqual(result.route);
  });
});
