import { expect, test } from "vitest";
import rawCatalog from "../data/bare-metal-4.22.json";
import inventory from "../data/inventory.json";
import {
  audit,
  decodeAnswers,
  encodeAnswers,
  NO_ANSWERS,
  parseCatalog,
  type WalkStep,
  walk,
  withAnswer,
} from "./catalog";

function load() {
  const parsed = parseCatalog(rawCatalog);
  if (!parsed.ok) {
    throw new Error(
      parsed.issues.map((issue) => `${issue.kind} ${issue.path}`).join("\n"),
    );
  }
  return parsed.value;
}

function line(step: WalkStep): string {
  return `${step.decision.id}=${step.chosen}`;
}

function option(step: WalkStep, id: string) {
  const found = step.options.find((item) => item.id === id);
  if (!found) throw new Error(`missing option ${id}`);
  return found.id;
}

test("default answers follow the connected Assisted Installer path", () => {
  const catalog = load();
  const current = walk(catalog, NO_ANSWERS);
  expect(current.steps.map(line)).toEqual([
    "network-connectivity=connected",
    "install-method=assisted",
    "fips=off",
  ]);
  expect(encodeAnswers(current)).toBe("");
  expect(current.dormant).toEqual([]);
});

test("a disconnected network selects the Agent-based installer and hides Assisted", () => {
  const catalog = load();
  const baseline = walk(catalog, NO_ANSWERS);
  const connectivity = baseline.steps[0];
  if (!connectivity) throw new Error("missing connectivity");
  const current = walk(
    catalog,
    withAnswer(
      NO_ANSWERS,
      connectivity.decision.id,
      option(connectivity, "disconnected"),
    ),
  );
  const method = current.steps[1];
  if (!method) throw new Error("missing method");
  expect(current.steps.map(line)).toEqual([
    "network-connectivity=disconnected",
    "install-method=agent",
    "fips=off",
  ]);
  expect(method.options.map((item) => item.id)).toEqual([
    "agent",
    "ipi",
    "upi",
  ]);
  expect(encodeAnswers(current)).toBe("network-connectivity=disconnected");
});

test("installer-provisioned infrastructure adds the ingress load balancer at its default", () => {
  const catalog = load();
  const baseline = walk(catalog, NO_ANSWERS);
  const method = baseline.steps[1];
  if (!method) throw new Error("missing method");
  const current = walk(
    catalog,
    withAnswer(NO_ANSWERS, method.decision.id, option(method, "ipi")),
  );
  expect(current.steps.map(line)).toEqual([
    "network-connectivity=connected",
    "install-method=ipi",
    "external-load-balancer=baseline",
    "fips=off",
  ]);
  const balancer = current.steps[2];
  if (!balancer) throw new Error("missing balancer");
  expect(balancer.because).toEqual([method.decision.id]);
  expect(balancer.source).toBe("default");
});

test("the hash round trip keeps a non-default answer and drops defaults", () => {
  const catalog = load();
  const baseline = walk(catalog, NO_ANSWERS);
  const method = baseline.steps[1];
  if (!method) throw new Error("missing method");
  const current = walk(
    catalog,
    withAnswer(NO_ANSWERS, method.decision.id, option(method, "upi")),
  );
  const text = encodeAnswers(current);
  expect(text).toBe("install-method=upi");
  const again = walk(catalog, decodeAnswers(catalog, text));
  expect(again.steps.map(line)).toEqual(current.steps.map(line));
});

test("a decision without a citation does not parse", () => {
  const broken = structuredClone(rawCatalog);
  broken.decisions[0]?.variants[0]?.citations.splice(0, 1);
  const parsed = parseCatalog(broken);
  expect(parsed.ok).toBe(false);
  if (parsed.ok) return;
  expect(
    parsed.issues.some(
      (issue) => issue.kind === "malformed" && issue.path.includes("citations"),
    ),
  ).toBe(true);
});

test("a guard that reads a later decision does not parse", () => {
  const parsed = parseCatalog({
    release: "4.22",
    platform: "bare-metal",
    sections: [
      { id: "a", title: "A" },
      { id: "b", title: "B" },
    ],
    decisions: [
      {
        id: "first",
        section: "a",
        stance: "fact",
        title: "First",
        variants: [
          {
            when: { kind: "answer", decision: "second", isAnyOf: ["yes"] },
            prompt: "First?",
            default: { id: "no", label: "No", summary: "No" },
            defaultRationale: "No is first.",
            alternatives: [],
            citations: [
              {
                url: "https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/installation_overview/index",
                locator: "Chapter 1",
                extraction: "extracted",
              },
            ],
          },
        ],
      },
      {
        id: "second",
        section: "b",
        stance: "choice",
        title: "Second",
        variants: [
          {
            when: { kind: "always" },
            prompt: "Second?",
            default: { id: "yes", label: "Yes", summary: "Yes" },
            defaultRationale: "Yes.",
            alternatives: [],
            citations: [
              {
                url: "https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/installation_overview/index",
                locator: "Chapter 1",
                extraction: "extracted",
              },
            ],
          },
        ],
      },
    ],
  });
  expect(parsed.ok).toBe(false);
  if (parsed.ok) return;
  expect(parsed.issues.map((issue) => issue.kind)).toContain("forward-guard");
});

test("an http citation does not parse", () => {
  const broken = structuredClone(rawCatalog);
  const citation = broken.decisions[0]?.variants[0]?.citations[0];
  if (!citation) throw new Error("missing citation");
  citation.url = "http://example.com/install";
  const parsed = parseCatalog(broken);
  expect(parsed.ok).toBe(false);
  if (parsed.ok) return;
  expect(parsed.issues.map((issue) => issue.kind)).toContain("bad-citation");
});

test("the overview inventory passes, and a missing section fails", () => {
  const catalog = load();
  expect(audit(catalog, inventory).failures).toEqual([]);
  const missing = audit(catalog, {
    decisionIds: inventory.decisionIds,
    sectionIds: [...inventory.sectionIds, "storage"],
  });
  expect(missing.failures).toEqual([
    { kind: "missing-required-section", section: "storage" },
  ]);
});
