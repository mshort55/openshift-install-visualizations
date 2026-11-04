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
  stageForTopic,
  stages,
  topics,
} from "./catalog";

// Content is the app's navigation model. Broken edges make otherwise valid UI routes dead ends.
describe("journey content integrity", () => {
  test("the approved problems cover preparation, installation and post-installation without filling evidence gaps", () => {
    expect(problems).toHaveLength(21);
    expect(
      stages.map(
        (stage) =>
          problems.filter(
            (problem) => stageForTopic(problem.topic)?.id === stage.id,
          ).length,
      ),
    ).toEqual([2, 6, 0, 3, 0, 5, 2, 3]);
  });
  test("ordered stages cover every detailed topic exactly once in its phase", () => {
    expect(new Set(stages.map((stage) => stage.id)).size).toBe(stages.length);
    expect([...new Set(stages.map((stage) => stage.phase))]).toEqual(phaseIds);
    for (const topic of topics.filter(
      (topic) => topic.phase && topic.parent !== "journey",
    )) {
      const owners = stages.filter((stage) =>
        stage.topics.some((root) => descendantsOf(root).has(topic.id)),
      );
      expect(owners, topic.id).toHaveLength(1);
      expect(owners[0]?.phase).toBe(topic.phase);
      expect(stageForTopic(topic.id)).toBe(owners[0]);
    }
    for (const stage of stages) {
      for (const id of stage.topics) {
        expect(topics.find((topic) => topic.id === id)?.parent).toBe(
          stage.phase,
        );
      }
    }
  });
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
      if (topic.kind === "group") {
        expect(childrenOf(topic.id).length).toBeGreaterThan(0);
        expect(topic.flow).toHaveLength(0);
      } else {
        expect(topic.flow.length).toBeGreaterThanOrEqual(2);
      }
    }
  });

  test("all customer accounts and ideas remain reachable and connected", () => {
    const topicIds = new Set(topics.map((topic) => topic.id));
    const problemIds = new Set(problems.map((problem) => problem.id));
    expect(problemIds.size).toBe(problems.length);
    expect(new Set(opportunities.map((idea) => idea.id)).size).toBe(
      opportunities.length,
    );
    for (const problem of problems) {
      expect(stageForTopic(problem.topic), problem.id).toBeDefined();
      expect(
        topics.find((topic) => topic.id === problem.topic)?.parent,
      ).not.toBe("approach");
      for (const topic of [problem.topic, ...problem.relatedTopics])
        expect(topicIds.has(topic), problem.id).toBe(true);
      expect(new Set([problem.topic, ...problem.relatedTopics]).size).toBe(
        problem.relatedTopics.length + 1,
      );
      expect(problem.limit.length).toBeGreaterThan(30);
      expect(problem.context.length).toBeGreaterThan(10);
      expect(problem.outcome.length).toBeGreaterThan(30);
      expect(problem.examples.length, problem.id).toBeGreaterThan(0);
      expect(
        new Set(problem.examples.map((example) => example.title)).size,
      ).toBe(problem.examples.length);
      expect(
        opportunities.some((idea) =>
          idea.basis.some(
            (basis) => basis.kind === "problem" && basis.id === problem.id,
          ),
        ),
      ).toBe(true);
    }
    for (const opportunity of opportunities) {
      expect(
        stageForTopic(opportunity.topics[0]),
        opportunity.id,
      ).toBeDefined();
      expect(
        topics.find((topic) => topic.id === opportunity.topics[0])?.parent,
      ).not.toBe("approach");
      expect(opportunity.topics.length).toBeGreaterThan(0);
      for (const topic of opportunity.topics)
        expect(topicIds.has(topic)).toBe(true);
      expect(opportunity.basis.length).toBeGreaterThan(0);
      for (const basis of opportunity.basis)
        expect(
          (basis.kind === "problem" ? problemIds : topicIds).has(basis.id),
          opportunity.id,
        ).toBe(true);
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
    expect(ancestorsOf("dns").map((topic) => topic.id)).toEqual([
      "journey",
      "pre-installation",
      "networking",
      "dns",
    ]);
  });
});

describe("shareable navigation and discovery", () => {
  test("expanded stages round-trip in every perspective and invalid stage links fall back to the phase", () => {
    for (const stage of stages) {
      for (const lens of ["process", "problems", "opportunities"] as const) {
        const route = { topic: stage.phase, stage: stage.id, lens };
        expect(parseRoute(routeHref(route))).toEqual(route);
      }
    }
    expect(
      parseRoute("#/pre-installation?stage=enable-dependencies&view=problems"),
    ).toEqual({
      topic: "pre-installation",
      lens: "problems",
    });
    expect(parseRoute("#/installation?stage=missing")).toEqual({
      topic: "installation",
      lens: "process",
    });
    expect(parseRoute("#/dns?stage=enable-dependencies")).toEqual({
      topic: "dns",
      lens: "process",
    });
  });
  test("all topics and record links round-trip", () => {
    for (const topic of topics) {
      for (const lens of ["process", "problems", "opportunities"] as const) {
        const route = { topic: topic.id, lens };
        expect(parseRoute(routeHref(route))).toEqual(route);
      }
    }
    for (const record of problems) {
      const route = {
        topic: record.topic,
        lens: "problems" as const,
        item: record.id,
      };
      expect(parseRoute(routeHref(route))).toEqual(route);
    }
    for (const record of opportunities) {
      const route = {
        topic: record.topics[0],
        lens: "opportunities" as const,
        item: record.id,
      };
      expect(parseRoute(routeHref(route))).toEqual(route);
    }
  });

  test("malformed and legacy links preserve valid topics without unrelated records", () => {
    for (const topic of ["managed-dns", "dns-consumers"]) {
      expect(parseRoute(`#/${topic}`)).toEqual({
        topic: "dns",
        lens: "process",
      });
      expect(parseRoute(`#/${topic}?view=problems&item=owner-wait`)).toEqual({
        topic: "networking",
        lens: "problems",
        item: "owner-wait",
      });
      expect(
        parseRoute(`#/${topic}?view=opportunities&item=precise-handoffs`),
      ).toEqual({
        topic: "dns",
        lens: "opportunities",
        item: "precise-handoffs",
      });
    }
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
    expect(parseRoute("#/storage-behavior")).toEqual({
      topic: "storage-drivers",
      lens: "process",
    });
    expect(
      parseRoute("#/storage-behavior?view=problems&item=readiness-unproven"),
    ).toEqual({
      topic: "acceptance",
      lens: "process",
    });
    expect(
      parseRoute(
        "#/storage-behavior?view=opportunities&item=confidence-rehearsal",
      ),
    ).toEqual({
      topic: "acceptance",
      lens: "opportunities",
      item: "confidence-rehearsal",
    });
    expect(parseRoute("#/preboot-readiness")).toEqual({
      topic: "media",
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

  test("related and phase links open the problem at its main step", () => {
    for (const problem of problems) {
      for (const topic of [
        "journey",
        problem.topic,
        ...problem.relatedTopics,
      ]) {
        expect(
          parseRoute(routeHref({ topic, lens: "problems", item: problem.id })),
        ).toEqual({
          topic: problem.topic,
          lens: "problems",
          item: problem.id,
        });
      }
    }
    expect(
      problemsFor("platform-operators").map((problem) => problem.id),
    ).toContain("missing-dependencies");
  });

  test("related and ancestor links open an opportunity at its assigned step", () => {
    for (const opportunity of opportunities) {
      for (const topic of new Set(
        opportunity.topics.flatMap((id) =>
          ancestorsOf(id).map((topic) => topic.id),
        ),
      )) {
        expect(
          parseRoute(
            routeHref({ topic, lens: "opportunities", item: opportunity.id }),
          ),
        ).toEqual({
          topic: opportunity.topics[0],
          lens: "opportunities",
          item: opportunity.id,
        });
      }
    }
    expect(
      parseRoute("#/access?view=opportunities&item=storage-outcome"),
    ).toEqual({
      topic: "access",
      lens: "opportunities",
    });
  });

  test("published links follow merged accounts and relocated guidance", () => {
    expect(
      parseRoute("#/storage-drivers?view=problems&item=storage-behavior-gap"),
    ).toEqual({
      topic: "storage-drivers",
      lens: "problems",
      item: "storage-not-usable",
    });
    for (const [item, topic] of [
      ["readiness-unproven", "acceptance"],
      ["secret-recovery", "backups"],
      ["upgrade-dependencies", "upgrades"],
      ["handover-knowledge", "acceptance"],
      ["physical-evidence-gap", "hosts"],
    ]) {
      expect(parseRoute(`#/journey?view=problems&item=${item}`)).toEqual({
        topic,
        lens: "process",
      });
    }
    expect(
      searchJourney("secret restoration").some(
        (result) =>
          result.route.lens === "process" &&
          result.route.topic === "acceptance",
      ),
    ).toBe(true);
    const rehearsal = opportunities.find(
      (idea) => idea.id === "confidence-rehearsal",
    );
    expect(rehearsal?.basis).toContainEqual({ kind: "task", id: "backups" });
  });

  test("search finds problem details and multiword concepts with working destinations", () => {
    for (const [query, id] of [
      ["reservation error", "first-vm-blocked"],
      ["June 17, 2026", "method-choice"],
      ["study report March 12, 2025", "migration-workload-readiness"],
      ["direct research notes June 9, 2026", "operating-knowledge-gap"],
    ] satisfies [string, string][]) {
      expect(
        searchJourney(query).some((result) => result.route.item === id),
        query,
      ).toBe(true);
    }
    expect(
      searchJourney(" default storage class ").some(
        (result) => result.route.item === "storage-not-usable",
      ),
    ).toBe(true);
    expect(
      searchJourney("deferred dns").some(
        (result) => result.route.topic === "dns",
      ),
    ).toBe(true);
    expect(searchJourney("     ")).toEqual([]);
    expect(searchJourney("not-a-topic-in-this-corpus")).toEqual([]);
    expect(
      searchJourney("registry redirects").some(
        (result) => result.route.topic === "service-access",
      ),
    ).toBe(true);
    expect(
      searchJourney("tang remote storage").some(
        (result) => result.route.topic === "service-access",
      ),
    ).toBe(true);
    for (const query of ["MetalLB", "compliance checks", "backup credentials"])
      expect(
        searchJourney(query).some(
          (result) =>
            result.route.topic === "platform-operators" &&
            result.route.lens === "process",
        ),
      ).toBe(true);
    for (const result of searchJourney("storage"))
      expect(parseRoute(routeHref(result.route))).toEqual(result.route);
  });
});
