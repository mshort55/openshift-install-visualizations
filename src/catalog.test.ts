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
import { decisionTree, type TreeDecision } from "./tree";

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

function findNode(
  nodes: readonly TreeDecision[],
  id: string,
): TreeDecision | undefined {
  for (const node of nodes) {
    if (node.id === id) return node;
    for (const choice of node.options) {
      const child = findNode(choice.children, id);
      if (child) return child;
    }
  }
  return undefined;
}

test("the default path is an agent-based baremetal cluster with DHCP and a managed provisioning network", () => {
  const catalog = load();
  const current = walk(catalog, NO_ANSWERS);
  expect(current.steps.map(line)).toEqual([
    "architecture=amd64",
    "platform=baremetal",
    "topology=ha",
    "network-access=connected",
    "release-source=connected-pull",
    "proxy=direct",
    "boot-image=full-iso",
    "ip-family=ipv4",
    "host-addressing=dhcp",
    "rendezvous=control-plane-dhcp",
    "cluster-network=defaults",
    "fips=off",
    "capabilities=vcurrent",
    "extra-capabilities=no",
    "cpu-partitioning=none",
    "hyperthreading=enabled",
    "ssh-key=provide",
    "ntp=existing",
    "host-roles=installer",
    "root-device=discover",
    "provisioning-network=managed",
    "baremetal-records=later",
    "br-ex=default",
  ]);
  expect(encodeAnswers(current)).toBe("");
  expect(JSON.stringify(rawCatalog)).not.toContain("assisted");
  expect(JSON.stringify(rawCatalog)).not.toContain("ipi");
  expect(JSON.stringify(rawCatalog)).not.toContain("upi");
});

test("static addressing opens the NIC tree, and a bond opens bond attributes", () => {
  const catalog = load();
  const baseline = walk(catalog, NO_ANSWERS);
  const addressing = baseline.steps.find(
    (step) => step.decision.id === "host-addressing",
  );
  if (!addressing) throw new Error("missing addressing");
  const current = walk(
    catalog,
    withAnswer(
      NO_ANSWERS,
      addressing.decision.id,
      option(addressing, "static"),
    ),
  );
  expect(current.steps.map(line)).toContain("nic-layout=single");
  expect(current.steps.map(line)).toContain("rendezvous=explicit");
  const tree = decisionTree(
    catalog,
    current.steps[0]
      ? decodeAnswers(catalog, encodeAnswers(current))
      : NO_ANSWERS,
  );
  const nics = findNode(tree.roots, "nic-layout");
  if (!nics) throw new Error("missing nic node");
  const bond = nics.options.find((item) => item.id === "bond");
  expect(bond?.children.map((child) => child.id)).toEqual(["bond-attributes"]);
  const sriov = nics.options.find((item) => item.id === "bond-sriov");
  expect(sriov?.children.map((child) => child.id)).toEqual([
    "bond-attributes",
    "sriov-vfs",
  ]);
});

test("platform none on a high availability cluster asks for load balancers, and single-node does not", () => {
  const catalog = load();
  const baseline = walk(catalog, NO_ANSWERS);
  const platform = baseline.steps.find(
    (step) => step.decision.id === "platform",
  );
  const topology = baseline.steps.find(
    (step) => step.decision.id === "topology",
  );
  if (!platform || !topology) throw new Error("missing platform or topology");
  const none = walk(
    catalog,
    withAnswer(NO_ANSWERS, platform.decision.id, option(platform, "none")),
  );
  expect(none.steps.map(line)).toContain("external-lb=shared");
  expect(none.steps.map((step) => step.decision.id)).not.toContain(
    "provisioning-network",
  );
  const sno = walk(
    catalog,
    withAnswer(
      withAnswer(NO_ANSWERS, platform.decision.id, option(platform, "none")),
      topology.decision.id,
      option(topology, "sno"),
    ),
  );
  expect(sno.steps.map((step) => step.decision.id)).not.toContain(
    "external-lb",
  );
});

test("a disconnected network selects a mirror and hides the public pull", () => {
  const catalog = load();
  const baseline = walk(catalog, NO_ANSWERS);
  const access = baseline.steps.find(
    (step) => step.decision.id === "network-access",
  );
  if (!access) throw new Error("missing access");
  const current = walk(
    catalog,
    withAnswer(NO_ANSWERS, access.decision.id, option(access, "disconnected")),
  );
  expect(current.steps.map(line)).toContain("release-source=mirror");
  expect(current.steps.map(line)).toContain("mirror-command=oc-mirror");
  expect(current.steps.map(line)).toContain(
    "mirror-trust=additional-trust-bundle",
  );
  const text = encodeAnswers(current);
  expect(text).toBe("network-access=disconnected");
  expect(walk(catalog, decodeAnswers(catalog, text)).steps.map(line)).toEqual(
    current.steps.map(line),
  );
});

test("the agent-based inventory passes", () => {
  const catalog = load();
  expect(audit(catalog, inventory).failures).toEqual([]);
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
                url: "https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/installing_an_on-premise_cluster_with_the_agent-based_installer/installation-config-parameters-agent",
                locator: "Chapter 9",
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
                url: "https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/installing_an_on-premise_cluster_with_the_agent-based_installer/installation-config-parameters-agent",
                locator: "Chapter 9",
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
