import {
  type Answers,
  type Catalog,
  type Decision,
  type DecisionId,
  type Guard,
  holds,
  type OptionId,
  type Variant,
  walk,
} from "./catalog";

export interface TreeOption {
  readonly id: OptionId;
  readonly label: string;
  readonly summary: string;
  readonly selected: boolean;
  readonly children: readonly TreeDecision[];
}

export interface TreeDecision {
  readonly id: DecisionId;
  readonly title: string;
  readonly prompt: string;
  readonly rationale: string;
  readonly locator: string;
  readonly url: string;
  readonly active: boolean;
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

function build(
  catalog: Catalog,
  decision: Decision,
  parent: DecisionId | null,
  parentOption: OptionId | null,
  chosen: ReadonlyMap<DecisionId, OptionId>,
  byParent: Map<string, Decision[]>,
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
      isDefault: false,
    })),
  ];
  const citation = variant.citations[0];
  return {
    id: decision.id,
    title: decision.title,
    prompt: variant.prompt,
    rationale: variant.defaultRationale,
    locator: citation.locator,
    url: citation.url,
    active,
    options: options.map((option) => ({
      id: option.id,
      label: option.label,
      summary: option.summary,
      selected: active && pick === option.id,
      children: (byParent.get(`${decision.id}\0${option.id}`) ?? []).map(
        (child) =>
          build(catalog, child, decision.id, option.id, chosen, byParent),
      ),
    })),
  };
}

export function decisionTree(catalog: Catalog, answers: Answers): DecisionTree {
  const chosen = new Map(
    walk(catalog, answers).steps.map((step) => [step.decision.id, step.chosen]),
  );
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
  return {
    roots: roots.map((decision) =>
      build(catalog, decision, null, null, chosen, byParent),
    ),
  };
}
