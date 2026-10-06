import {
  type Answers,
  type Catalog,
  type Decision,
  type DecisionId,
  type Guard,
  holds,
  type NmstateDocument,
  type OptionId,
  pruneAnswers,
  type Variant,
} from "./catalog";

export type TreeMode = "path" | "map";

export interface TreeOption {
  readonly id: OptionId;
  readonly label: string;
  readonly summary: string;
  readonly example: string;
  readonly selected: boolean;
  readonly isDefault: boolean;
  readonly muted: boolean;
  readonly enabled: boolean;
  readonly children: readonly TreeDecision[];
}

export interface TreeDecision {
  readonly id: DecisionId;
  readonly title: string;
  readonly nmstate: NmstateDocument | null;
  readonly prompt: string;
  readonly rationale: string;
  readonly locator: string;
  readonly url: string;
  readonly active: boolean;
  readonly answered: boolean;
  readonly options: readonly TreeOption[];
}

export interface DecisionTree {
  readonly roots: readonly TreeDecision[];
}

function leaves(
  guard: Guard,
): { decision: DecisionId; options: readonly OptionId[] }[] {
  switch (guard.kind) {
    case "always":
      return [];
    case "answer":
      return [{ decision: guard.decision, options: guard.isAnyOf }];
    case "not":
      return [];
    case "all":
    case "any":
      return guard.of.flatMap((child) => leaves(child));
    default: {
      const neverGuard: never = guard;
      return neverGuard;
    }
  }
}

function parentOf(
  decision: Decision,
): { parent: DecisionId; options: Set<string> } | null {
  const found = decision.variants.flatMap((variant) => leaves(variant.when));
  const first = found[0];
  if (!first) return null;
  const options = new Set<string>();
  for (const leaf of found) {
    if (leaf.decision !== first.decision) continue;
    for (const option of leaf.options) options.add(option);
  }
  return { parent: first.decision, options };
}

function variantOnBranch(
  decision: Decision,
  parent: DecisionId | null,
  option: OptionId | null,
  chosen: ReadonlyMap<DecisionId, OptionId>,
): Variant {
  if (parent && option) {
    const match = decision.variants.find((variant) =>
      leaves(variant.when).some(
        (leaf) => leaf.decision === parent && leaf.options.includes(option),
      ),
    );
    if (match) return match;
  }
  return (
    decision.variants.find((variant) => holds(variant.when, chosen)) ??
    decision.variants[0]
  );
}

function visibleDecisions(
  catalog: Catalog,
  chosen: ReadonlyMap<DecisionId, OptionId>,
  mode: TreeMode,
  byParent: Map<string, Decision[]>,
): Set<DecisionId> {
  const visible = new Set<DecisionId>();
  if (mode === "path") {
    let gap = false;
    for (const decision of catalog.decisions) {
      const open = decision.variants.some((item) => holds(item.when, chosen));
      if (!open) continue;
      if (!chosen.has(decision.id)) {
        if (gap) continue;
        visible.add(decision.id);
        gap = true;
        continue;
      }
      visible.add(decision.id);
    }
    return visible;
  }
  for (const decision of catalog.decisions) {
    if (decision.variants.some((item) => holds(item.when, chosen))) {
      visible.add(decision.id);
    }
  }
  const childrenOf = new Map<string, DecisionId[]>();
  for (const [key, children] of byParent) {
    const splitAt = key.indexOf("\0");
    const parent = splitAt === -1 ? "" : key.slice(0, splitAt);
    if (!parent) continue;
    const list = childrenOf.get(parent) ?? [];
    for (const child of children) list.push(child.id);
    childrenOf.set(parent, list);
  }
  const pending = [...visible];
  while (pending.length > 0) {
    const id = pending.pop();
    if (id === undefined) continue;
    for (const child of childrenOf.get(id) ?? []) {
      if (visible.has(child)) continue;
      visible.add(child);
      pending.push(child);
    }
  }
  return visible;
}

function build(
  decision: Decision,
  parent: DecisionId | null,
  parentOption: OptionId | null,
  chosen: ReadonlyMap<DecisionId, OptionId>,
  byParent: Map<string, Decision[]>,
  visible: Set<DecisionId>,
  mode: TreeMode,
): TreeDecision {
  const variant = variantOnBranch(decision, parent, parentOption, chosen);
  const active = decision.variants.some((item) => holds(item.when, chosen));
  const pick = chosen.get(decision.id);
  const options = [
    { ...variant.default, isDefault: true },
    ...variant.alternatives.map((alternative) => ({
      id: alternative.id,
      label: alternative.label,
      summary: alternative.summary,
      example: alternative.example,
      isDefault: false,
    })),
  ];
  const citation = variant.citations[0];
  return {
    id: decision.id,
    title: decision.title,
    nmstate: decision.nmstate,
    prompt: variant.prompt,
    rationale: variant.defaultRationale,
    locator: citation.locator,
    url: citation.url,
    active,
    answered: pick !== undefined && active,
    options: options.map((option) => ({
      id: option.id,
      label: option.label,
      summary: option.summary,
      example: option.example,
      selected: active && pick === option.id,
      isDefault: option.isDefault,
      muted: active && pick !== undefined && pick !== option.id,
      enabled: active,
      children: (byParent.get(`${decision.id}\0${option.id}`) ?? [])
        .filter((child) => visible.has(child.id))
        .map((child) =>
          build(child, decision.id, option.id, chosen, byParent, visible, mode),
        ),
    })),
  };
}

export function decisionTree(
  catalog: Catalog,
  answers: Answers,
  mode: TreeMode,
): DecisionTree {
  const chosen = pruneAnswers(catalog, answers);
  const byParent = new Map<string, Decision[]>();
  const roots: Decision[] = [];
  for (const decision of catalog.decisions) {
    const parent = parentOf(decision);
    if (!parent) {
      roots.push(decision);
      continue;
    }
    for (const option of parent.options) {
      const key = `${parent.parent}\0${option}`;
      const list = byParent.get(key) ?? [];
      list.push(decision);
      byParent.set(key, list);
    }
  }
  const visible = visibleDecisions(catalog, chosen, mode, byParent);
  return {
    roots: roots
      .filter((decision) => visible.has(decision.id))
      .map((decision) =>
        build(decision, null, null, chosen, byParent, visible, mode),
      ),
  };
}
