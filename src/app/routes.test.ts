import { describe, expect, test } from "vitest";
import { topics } from "../pages/journey/catalog";
import {
  journeyPrerequisites,
  type PrerequisitesTarget,
  prerequisitesHome,
} from "../pages/prerequisites/model";
import { contextRoute, storyContexts } from "../pages/solution-example/links";
import { appHref, journeyHome, parseLocation } from "./routes";

describe("combined app links", () => {
  test("opens Journey by default and recovers unknown pages", () => {
    expect(parseLocation("")).toEqual(journeyHome);
    expect(parseLocation("#/missing")).toEqual(journeyHome);
    expect(appHref(journeyHome)).toBe("#/journey");
  });

  test("opens and shares only the six production chapter locations", () => {
    for (const chapter of [
      "introduction",
      "preparation",
      "installation",
      "readiness",
      "handoff",
      "reuse",
    ]) {
      const hash = `#/solution-example?chapter=${chapter}`;
      expect(parseLocation(hash)).toEqual({
        page: "solution-example",
        chapter,
      });
      expect(
        appHref(
          parseLocation(
            `${hash}&moment=5&variant=C&api=10.20.30.12&recovered=true&origin=dns`,
          ),
        ),
      ).toBe(hash);
    }
  });

  test("missing, invalid and obsolete solution state opens the introduction", () => {
    for (const hash of [
      "#/solution-example",
      "#/solution-example?chapter=unknown",
      "#/solution-example?moment=5&layout=B",
    ]) {
      expect(appHref(parseLocation(hash))).toBe(
        "#/solution-example?chapter=introduction",
      );
    }
    expect(parseLocation("#/journey?prototype=solution&moment=5")).toEqual(
      journeyHome,
    );
  });

  test("story links preserve real canonical catalog records and topics", () => {
    for (const context of storyContexts) {
      const route = parseLocation(appHref(contextRoute(context)));
      expect(route.page).toBe("journey");
      if (route.page !== "journey") throw new Error("Expected catalog route");
      if (context.item) expect(route.view.item).toBe(context.item);
      else expect(route.view.topic).toBe(context.topic);
      expect(route.view.lens).toBe(context.lens);
      expect(topics.some((topic) => topic.id === route.view.topic)).toBe(true);
    }
  });

  test("retains every published Journey topic and perspective", () => {
    for (const topic of topics) {
      for (const view of ["process", "problems", "opportunities"]) {
        const old = parseLocation(`#/${topic.id}?view=${view}`);
        expect(old.page).toBe("journey");
        expect(parseLocation(appHref(old))).toEqual(old);
      }
    }
    expect(parseLocation("#/dns?view=problems&item=owner-wait")).toEqual(
      parseLocation("#/journey/dns?view=problems&item=owner-wait"),
    );
  });

  test("retains former Choices answers and moves its display mode into the page URL", () => {
    const old = parseLocation(
      "#architecture=amd64&host-addressing=static",
      "?view=map",
    );
    expect(old.page).toBe("choices");
    const href = appHref(old);
    expect(href).toContain("#/choices?mode=map&");
    expect(href).toContain("architecture=amd64");
    expect(href).toContain("host-addressing=static");
    expect(parseLocation(href)).toEqual(old);
  });

  test("an empty Choices route stays on Choices without selecting defaults", () => {
    expect(appHref(parseLocation("#/choices"))).toBe("#/choices");
    expect(appHref(parseLocation("", "?view=map"))).toBe("#/choices?mode=map");
    expect(appHref(parseLocation("#/choices?mode=map"))).toBe(
      "#/choices?mode=map",
    );
  });

  test("prunes unavailable answers and ignores malformed or unrelated parameters", () => {
    const route = parseLocation(
      "#/choices?mode=bogus&architecture=invalid&host-addressing=dhcp&nmstate-bond=include&unknown=yes&bad=%ZZ",
    );
    expect(appHref(route)).toBe("#/choices?host-addressing=dhcp");
  });

  test("Journey perspectives and Choices modes cannot select each other's page", () => {
    expect(parseLocation("#/journey/dns?view=problems", "?view=map").page).toBe(
      "journey",
    );
    expect(appHref(parseLocation("#/choices?view=problems"))).toBe("#/choices");
  });

  test("shares prerequisite scenarios at a section or a specific handoff", () => {
    for (const target of [
      "overview",
      "addressing",
      "dns",
      "management",
      "tickets/network",
      "tickets/bmc",
      "firewall",
      "sources",
      "reference",
      "inventory",
      "configuration",
      "ports",
      "dns-access",
      "tickets/ipam",
      "tickets/dhcp",
      "tickets/admin",
    ] satisfies PrerequisitesTarget[]) {
      for (const addressing of ["dhcp", "static"] satisfies (
        | "dhcp"
        | "static"
      )[]) {
        for (const dns of ["pending", "published"] satisfies (
          | "pending"
          | "published"
        )[]) {
          const route = {
            page: "prerequisites",
            view: { target, addressing, dns },
          } satisfies Parameters<typeof appHref>[0];
          expect(parseLocation(appHref(route))).toEqual(route);
        }
      }
    }
  });

  test("recovers unknown prerequisite sections and scenarios without changing page", () => {
    expect(
      parseLocation(
        "#/prerequisites/unknown?addressing=invalid&dns=invalid&mode=map&view=problems",
      ),
    ).toEqual({ page: "prerequisites", view: prerequisitesHome });
    expect(
      appHref(
        parseLocation("#/prerequisites/dns/?addressing=static&dns=published"),
      ),
    ).toBe("#/prerequisites/dns?addressing=static");
    expect(
      appHref(
        parseLocation("#/prerequisites/tickets/missing?addressing=static"),
      ),
    ).toBe("#/prerequisites?addressing=static");
  });

  test("each contextual prerequisite entry belongs to an existing Journey topic", () => {
    for (const [topic, target] of journeyPrerequisites) {
      expect(topics.some((item) => item.id === topic)).toBe(true);
      const view = { ...prerequisitesHome, target };
      expect(parseLocation(appHref({ page: "prerequisites", view }))).toEqual({
        page: "prerequisites",
        view,
      });
    }
  });
});
