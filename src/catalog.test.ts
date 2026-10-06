import { expect, test } from "vitest";
import rawCatalog from "../data/bare-metal-4.22.json";
import inventory from "../data/inventory.json";
import {
  audit,
  decodeAnswers,
  encodeAnswers,
  encodeSelection,
  NO_ANSWERS,
  parseCatalog,
  pruneAnswers,
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
    "custom-manifests=omit",
    "storage-class=lvm",
    "array-storage=omit",
    "registry-storage=removed",
    "monitoring-storage=ephemeral",
    "user-workload-monitoring=omit",
    "logging-store=omit",
    "alert-receiver=console",
    "identity-provider=none",
    "infra-nodes=omit",
    "update-channel=stable",
    "etcd-encryption=identity",
    "worker-latency=default",
  ]);
  expect(encodeAnswers(current)).toBe("");
  expect(JSON.stringify(rawCatalog)).not.toContain("assisted");
  expect(JSON.stringify(rawCatalog)).not.toContain("ipi");
  expect(JSON.stringify(rawCatalog)).not.toContain("upi");
});

test("self-contained media opens the operator choice, and every path chooses a storage class", () => {
  const catalog = load();
  const baseline = walk(catalog, NO_ANSWERS);
  const release = baseline.steps.find(
    (step) => step.decision.id === "release-source",
  );
  if (!release) throw new Error("missing release-source");
  const current = walk(
    catalog,
    withAnswer(
      NO_ANSWERS,
      release.decision.id,
      option(release, "no-external-registry"),
    ),
  );
  expect(current.steps.map(line)).toContain(
    "install-operators=virtualization-bundle",
  );
  expect(current.steps.map(line)).toContain("storage-class=lvm");
  const storage = current.steps.find(
    (step) => step.decision.id === "storage-class",
  );
  expect(storage?.options.map((item) => item.id)).toEqual([
    "lvm",
    "lso",
    "odf",
    "hostpath",
  ]);
});

test("external storage can include the SAN class and the SMB class together", () => {
  const catalog = load();
  const baseline = walk(catalog, NO_ANSWERS);
  const arrayStorage = baseline.steps.find(
    (step) => step.decision.id === "array-storage",
  );
  if (!arrayStorage) throw new Error("missing array storage");
  const opened = walk(
    catalog,
    withAnswer(
      NO_ANSWERS,
      arrayStorage.decision.id,
      option(arrayStorage, "include"),
    ),
  );
  const ids = ["array-san", "array-smb"] as const;
  const answers = ids.reduce(
    (current, id) => {
      const step = opened.steps.find((item) => item.decision.id === id);
      if (!step) throw new Error(`missing ${id}`);
      return withAnswer(current, step.decision.id, option(step, "include"));
    },
    withAnswer(
      NO_ANSWERS,
      arrayStorage.decision.id,
      option(arrayStorage, "include"),
    ),
  );
  const lines = walk(catalog, answers).steps.map(line);
  for (const id of ids) expect(lines).toContain(`${id}=include`);
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
  expect(current.steps.map(line)).toContain("nmstate-ethernet=include");
  expect(current.steps.map(line)).toContain("nmstate-bond=omit");
  expect(current.steps.map(line)).toContain("rendezvous=explicit");
  expect(current.steps.map((step) => step.decision.id)).not.toContain(
    "bond-mode",
  );
  const tree = decisionTree(
    catalog,
    decodeAnswers(catalog, encodeAnswers(current)),
    "map",
  );
  const ethernet = findNode(tree.roots, "nmstate-ethernet");
  if (!ethernet) throw new Error("missing ethernet node");
  const included = ethernet.options.find((item) => item.id === "include");
  expect(included?.children.map((child) => child.id)).toEqual([
    "interface-identifier",
    "nmstate-alt-names",
    "nmstate-sriov",
  ]);
  const sriov = included?.children.find(
    (child) => child.id === "nmstate-sriov",
  );
  const configure = sriov?.options.find((item) => item.id === "configure");
  expect(configure?.children.map((child) => child.id)).toEqual(["sriov-vfs"]);
  const bond = findNode(tree.roots, "nmstate-bond");
  const bondInclude = bond?.options.find((item) => item.id === "include");
  expect(bondInclude?.children.map((child) => child.id)).toEqual(["bond-mode"]);
  const modes = bondInclude?.children.find((child) => child.id === "bond-mode");
  expect(modes?.options.map((item) => item.id)).toEqual([
    "active-backup",
    "balance-xor",
    "802.3ad",
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

test("step through starts unanswered, and an explicit default stays in the hash", () => {
  const catalog = load();
  const start = decisionTree(catalog, NO_ANSWERS, "path");
  expect(start.roots.map((node) => node.id)).toEqual(["architecture"]);
  const first = start.roots[0];
  if (!first) throw new Error("missing architecture");
  expect(first.options.map((option) => option.selected)).toEqual([
    false,
    false,
    false,
    false,
  ]);
  const chosen = first.options[0];
  if (!chosen) throw new Error("missing architecture option");
  const answered = pruneAnswers(
    catalog,
    withAnswer(NO_ANSWERS, first.id, chosen.id),
  );
  const next = decisionTree(catalog, answered, "path");
  expect(next.roots.map((node) => node.id)).toEqual([
    "architecture",
    "platform",
  ]);
  expect(next.roots[0]?.options.map((option) => option.id)).toEqual([
    "amd64",
    "arm64",
    "ppc64le",
    "s390x",
  ]);
  expect(next.roots[0]?.options.map((option) => option.selected)).toEqual([
    true,
    false,
    false,
    false,
  ]);
  expect(next.roots[1]?.options.map((option) => option.id)).toEqual([
    "baremetal",
    "none",
  ]);
  expect(next.roots[1]?.options.map((option) => option.selected)).toEqual([
    false,
    false,
  ]);
  const platform = next.roots[1];
  const none = platform?.options.find((option) => option.id === "none");
  if (!platform || !none) throw new Error("missing platform option");
  const withNone = decisionTree(
    catalog,
    pruneAnswers(catalog, withAnswer(answered, platform.id, none.id)),
    "path",
  );
  const platformNode = withNone.roots.find((node) => node.id === "platform");
  expect(platformNode?.options.map((option) => option.id)).toEqual([
    "baremetal",
    "none",
  ]);
  expect(platformNode?.options.map((option) => option.selected)).toEqual([
    false,
    true,
  ]);
  expect(encodeSelection(catalog, answered)).toBe("architecture=amd64");
});

test("selecting connected greys disconnected, and neither is grey before a choice", () => {
  const catalog = load();
  const open = findNode(
    decisionTree(catalog, NO_ANSWERS, "map").roots,
    "network-access",
  );
  if (!open) throw new Error("missing network access");
  expect(open.options.map((option) => option.muted)).toEqual([false, false]);
  const connected = open.options.find((option) => option.id === "connected");
  if (!connected) throw new Error("missing connected");
  const chosen = findNode(
    decisionTree(
      catalog,
      pruneAnswers(catalog, withAnswer(NO_ANSWERS, open.id, connected.id)),
      "path",
    ).roots,
    "network-access",
  );
  if (!chosen) throw new Error("missing chosen network access");
  expect(
    chosen.options.map((option) => [option.id, option.selected, option.muted]),
  ).toEqual([
    ["connected", true, false],
    ["disconnected", false, true],
  ]);
  const cleared = findNode(
    decisionTree(
      catalog,
      pruneAnswers(
        catalog,
        withAnswer(
          pruneAnswers(catalog, withAnswer(NO_ANSWERS, open.id, connected.id)),
          open.id,
          null,
        ),
      ),
      "map",
    ).roots,
    "network-access",
  );
  if (!cleared) throw new Error("missing cleared network access");
  expect(
    cleared.options.map((option) => [option.selected, option.muted]),
  ).toEqual([
    [false, false],
    [false, false],
  ]);
});

test("step through still shows a later choice when an earlier decision is open", () => {
  const catalog = load();
  const baseline = walk(catalog, NO_ANSWERS);
  const addressing = baseline.steps.find(
    (step) => step.decision.id === "host-addressing",
  );
  if (!addressing) throw new Error("missing addressing");
  const answers = pruneAnswers(
    catalog,
    withAnswer(
      NO_ANSWERS,
      addressing.decision.id,
      option(addressing, "static"),
    ),
  );
  const ids: string[] = [];
  const visit = (nodes: readonly TreeDecision[]) => {
    for (const node of nodes) {
      ids.push(node.id);
      for (const option of node.options) visit(option.children);
    }
  };
  visit(decisionTree(catalog, answers, "path").roots);
  expect(ids).toContain("architecture");
  expect(ids).toContain("host-addressing");
  expect(ids).not.toContain("platform");
});

test("switching off static addressing drops the NIC choice that no longer applies", () => {
  const catalog = load();
  const baseline = walk(catalog, NO_ANSWERS);
  const addressing = baseline.steps.find(
    (step) => step.decision.id === "host-addressing",
  );
  if (!addressing) throw new Error("missing addressing");
  const withStatic = walk(
    catalog,
    withAnswer(
      NO_ANSWERS,
      addressing.decision.id,
      option(addressing, "static"),
    ),
  );
  const bond = withStatic.steps.find(
    (step) => step.decision.id === "nmstate-bond",
  );
  if (!bond) throw new Error("missing bond");
  const chosen = pruneAnswers(
    catalog,
    withAnswer(
      withAnswer(
        NO_ANSWERS,
        addressing.decision.id,
        option(addressing, "static"),
      ),
      bond.decision.id,
      option(bond, "include"),
    ),
  );
  expect(encodeSelection(catalog, chosen)).toBe(
    "host-addressing=static&nmstate-bond=include",
  );
  const dhcp = pruneAnswers(
    catalog,
    withAnswer(chosen, addressing.decision.id, option(addressing, "dhcp")),
  );
  expect(encodeSelection(catalog, dhcp)).toBe("host-addressing=dhcp");
  expect(
    decisionTree(catalog, dhcp, "map")
      .roots.flatMap((node) => node.options)
      .some((option) => option.selected && option.id === "dhcp"),
  ).toBe(true);
});

test("the agent-based inventory passes", () => {
  const catalog = load();
  expect(audit(catalog, inventory).failures).toEqual([]);
}, 20_000);

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
            default: { id: "no", label: "No", summary: "No", example: "no" },
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
            default: {
              id: "yes",
              label: "Yes",
              summary: "Yes",
              example: "yes",
            },
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
