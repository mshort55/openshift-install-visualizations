import { z } from "zod";

/**
 * Brands are applied only after parseCatalog accepts the value.
 * The cast does not check anything. The checks above it do.
 */
function brand<B extends string>(
  value: string,
): string & { readonly __brand: B } {
  return value as string & { readonly __brand: B };
}

const catalogBrand: unique symbol = Symbol("Catalog");

export type DecisionId = string & { readonly __brand: "DecisionId" };
export type OptionId = string & { readonly __brand: "OptionId" };
export type SectionId = string & { readonly __brand: "SectionId" };
export type HttpsUrl = string & { readonly __brand: "HttpsUrl" };

export interface Citation {
  readonly url: HttpsUrl;
  readonly locator: string;
  readonly extraction: "extracted" | "pending";
}

export type Citations = readonly [Citation, ...Citation[]];

export type Guard =
  | { readonly kind: "always" }
  | {
      readonly kind: "answer";
      readonly decision: DecisionId;
      readonly isAnyOf: readonly [OptionId, ...OptionId[]];
    }
  | { readonly kind: "all"; readonly of: readonly Guard[] }
  | { readonly kind: "any"; readonly of: readonly Guard[] }
  | { readonly kind: "not"; readonly of: Guard };

export interface Option {
  readonly id: OptionId;
  readonly label: string;
  readonly summary: string;
}

export interface Alternative extends Option {
  readonly when: Guard;
}

export interface Variant {
  readonly when: Guard;
  readonly prompt: string;
  readonly default: Option;
  readonly defaultRationale: string;
  readonly alternatives: readonly Alternative[];
  readonly citations: Citations;
}

export type Stance = "fact" | "choice";

export interface Decision {
  readonly id: DecisionId;
  readonly section: SectionId;
  readonly stance: Stance;
  readonly title: string;
  readonly variants: readonly [Variant, ...Variant[]];
}

export interface Section {
  readonly id: SectionId;
  readonly title: string;
}

export interface Catalog {
  readonly [catalogBrand]: "Catalog";
  readonly release: string;
  readonly platform: string;
  readonly sections: readonly Section[];
  readonly decisions: readonly Decision[];
}

export type CatalogError =
  | {
      readonly kind: "malformed";
      readonly path: string;
      readonly message: string;
    }
  | {
      readonly kind: "duplicate-decision";
      readonly path: string;
      readonly id: string;
    }
  | {
      readonly kind: "duplicate-section";
      readonly path: string;
      readonly id: string;
    }
  | {
      readonly kind: "unknown-section";
      readonly path: string;
      readonly id: string;
    }
  | {
      readonly kind: "unused-section";
      readonly path: string;
      readonly id: string;
    }
  | {
      readonly kind: "section-order";
      readonly path: string;
      readonly id: string;
    }
  | { readonly kind: "section-gap"; readonly path: string; readonly id: string }
  | {
      readonly kind: "duplicate-option";
      readonly path: string;
      readonly option: string;
    }
  | {
      readonly kind: "forward-guard";
      readonly path: string;
      readonly decision: string;
    }
  | {
      readonly kind: "unknown-decision";
      readonly path: string;
      readonly decision: string;
    }
  | {
      readonly kind: "unknown-option";
      readonly path: string;
      readonly decision: string;
      readonly option: string;
    }
  | {
      readonly kind: "bad-citation";
      readonly path: string;
      readonly message: string;
    };

export type ParseResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly issues: readonly CatalogError[] };

type WireGuard =
  | { readonly kind: "always" }
  | {
      readonly kind: "answer";
      readonly decision: string;
      readonly isAnyOf: readonly [string, ...string[]];
    }
  | { readonly kind: "all"; readonly of: readonly WireGuard[] }
  | { readonly kind: "any"; readonly of: readonly WireGuard[] }
  | { readonly kind: "not"; readonly of: WireGuard };

type WireOption = {
  readonly id: string;
  readonly label: string;
  readonly summary: string;
};

type WireAlternative = WireOption & { readonly when: WireGuard };

type WireVariant = {
  readonly when: WireGuard;
  readonly prompt: string;
  readonly default: WireOption;
  readonly defaultRationale: string;
  readonly alternatives: readonly WireAlternative[];
  readonly citations: readonly [
    {
      readonly url: string;
      readonly locator: string;
      readonly extraction: "extracted" | "pending";
    },
    ...{
      readonly url: string;
      readonly locator: string;
      readonly extraction: "extracted" | "pending";
    }[],
  ];
};

type WireDecision = {
  readonly id: string;
  readonly section: string;
  readonly stance: Stance;
  readonly title: string;
  readonly variants: readonly [WireVariant, ...WireVariant[]];
};

type WireCatalog = {
  readonly release: string;
  readonly platform: string;
  readonly sections: readonly [
    { readonly id: string; readonly title: string },
    ...{ readonly id: string; readonly title: string }[],
  ];
  readonly decisions: readonly [WireDecision, ...WireDecision[]];
};

const text = z.string().min(1);

const guardSchema: z.ZodType<WireGuard> = z.lazy(() =>
  z.discriminatedUnion("kind", [
    z.object({ kind: z.literal("always") }),
    z.object({
      kind: z.literal("answer"),
      decision: text,
      isAnyOf: z.tuple([text]).rest(text),
    }),
    z.object({ kind: z.literal("all"), of: z.array(guardSchema).min(1) }),
    z.object({ kind: z.literal("any"), of: z.array(guardSchema).min(1) }),
    z.object({ kind: z.literal("not"), of: guardSchema }),
  ]),
);

const optionSchema = z.object({ id: text, label: text, summary: text });

const citationSchema = z.object({
  url: text,
  locator: text,
  extraction: z.union([z.literal("extracted"), z.literal("pending")]),
});

const variantSchema = z.object({
  when: guardSchema,
  prompt: text,
  default: optionSchema,
  defaultRationale: text,
  alternatives: z.array(optionSchema.extend({ when: guardSchema })),
  citations: z.tuple([citationSchema]).rest(citationSchema),
});

const decisionSchema = z.object({
  id: text,
  section: text,
  stance: z.union([z.literal("fact"), z.literal("choice")]),
  title: text,
  variants: z.tuple([variantSchema]).rest(variantSchema),
});

const wireSchema = z.object({
  release: text,
  platform: text,
  sections: z
    .tuple([z.object({ id: text, title: text })])
    .rest(z.object({ id: text, title: text })),
  decisions: z.tuple([decisionSchema]).rest(decisionSchema),
});

function pointer(path: ReadonlyArray<PropertyKey>): string {
  if (path.length === 0) return "/";
  return path.map((part) => `/${String(part)}`).join("");
}

function optionSet(decision: WireDecision): Set<string> {
  const ids = new Set<string>();
  for (const variant of decision.variants) {
    ids.add(variant.default.id);
    for (const alternative of variant.alternatives) ids.add(alternative.id);
  }
  return ids;
}

function checkGuard(
  guard: WireGuard,
  decisionIndex: number,
  path: string,
  indexById: ReadonlyMap<string, number>,
  optionsById: ReadonlyMap<string, Set<string>>,
  issues: CatalogError[],
): void {
  switch (guard.kind) {
    case "always":
      return;
    case "answer": {
      const earlier = indexById.get(guard.decision);
      if (earlier === undefined) {
        issues.push({
          kind: "unknown-decision",
          path,
          decision: guard.decision,
        });
        return;
      }
      if (earlier >= decisionIndex) {
        issues.push({ kind: "forward-guard", path, decision: guard.decision });
        return;
      }
      const options = optionsById.get(guard.decision);
      for (const option of guard.isAnyOf) {
        if (options?.has(option)) continue;
        issues.push({
          kind: "unknown-option",
          path,
          decision: guard.decision,
          option,
        });
      }
      return;
    }
    case "not":
      checkGuard(
        guard.of,
        decisionIndex,
        `${path}/of`,
        indexById,
        optionsById,
        issues,
      );
      return;
    case "all":
    case "any":
      guard.of.forEach((child, index) => {
        checkGuard(
          child,
          decisionIndex,
          `${path}/of/${index}`,
          indexById,
          optionsById,
          issues,
        );
      });
      return;
    default: {
      const neverGuard: never = guard;
      throw new Error(`unhandled guard ${String(neverGuard)}`);
    }
  }
}

function semanticIssues(raw: WireCatalog): CatalogError[] {
  const issues: CatalogError[] = [];
  const indexById = new Map<string, number>();
  raw.decisions.forEach((decision, index) => {
    if (indexById.has(decision.id)) {
      issues.push({
        kind: "duplicate-decision",
        path: `/decisions/${index}/id`,
        id: decision.id,
      });
    }
    indexById.set(decision.id, index);
  });

  const sectionIds = new Set<string>();
  raw.sections.forEach((section, index) => {
    if (sectionIds.has(section.id)) {
      issues.push({
        kind: "duplicate-section",
        path: `/sections/${index}/id`,
        id: section.id,
      });
    }
    sectionIds.add(section.id);
  });

  const optionsById = new Map<string, Set<string>>();
  for (const decision of raw.decisions)
    optionsById.set(decision.id, optionSet(decision));

  const firstUse: string[] = [];
  const closed = new Set<string>();
  let current = "";
  raw.decisions.forEach((decision, index) => {
    const path = `/decisions/${index}/section`;
    if (!sectionIds.has(decision.section)) {
      issues.push({ kind: "unknown-section", path, id: decision.section });
    }
    if (decision.section !== current) {
      if (closed.has(decision.section)) {
        issues.push({ kind: "section-gap", path, id: decision.section });
      }
      if (current.length > 0) closed.add(current);
      firstUse.push(decision.section);
      current = decision.section;
    }
    decision.variants.forEach((variant, variantIndex) => {
      const variantPath = `/decisions/${index}/variants/${variantIndex}`;
      const seen = new Set<string>();
      const options = [variant.default, ...variant.alternatives];
      options.forEach((option, optionIndex) => {
        const optionPath =
          optionIndex === 0
            ? `${variantPath}/default/id`
            : `${variantPath}/alternatives/${optionIndex - 1}/id`;
        if (seen.has(option.id)) {
          issues.push({
            kind: "duplicate-option",
            path: optionPath,
            option: option.id,
          });
        }
        seen.add(option.id);
      });
      checkGuard(
        variant.when,
        index,
        `${variantPath}/when`,
        indexById,
        optionsById,
        issues,
      );
      variant.alternatives.forEach((alternative, alternativeIndex) => {
        checkGuard(
          alternative.when,
          index,
          `${variantPath}/alternatives/${alternativeIndex}/when`,
          indexById,
          optionsById,
          issues,
        );
      });
      variant.citations.forEach((citation, citationIndex) => {
        const citationPath = `${variantPath}/citations/${citationIndex}`;
        if (!citation.url.startsWith("https://")) {
          issues.push({
            kind: "bad-citation",
            path: `${citationPath}/url`,
            message: "Citation URL must use https.",
          });
        }
      });
    });
  });

  raw.sections.forEach((section, index) => {
    if (firstUse.includes(section.id)) return;
    issues.push({
      kind: "unused-section",
      path: `/sections/${index}/id`,
      id: section.id,
    });
  });
  const declared = raw.sections
    .map((section) => section.id)
    .filter((id) => firstUse.includes(id));
  const used = firstUse.filter((id) => sectionIds.has(id));
  if (declared.join("\0") !== used.join("\0")) {
    issues.push({
      kind: "section-order",
      path: "/sections",
      id: used.join(","),
    });
  }
  return issues;
}

function mapNonEmpty<T, U>(
  items: readonly [T, ...T[]],
  map: (item: T) => U,
): [U, ...U[]] {
  const [head, ...rest] = items;
  if (head === undefined) {
    throw new Error("non-empty tuple was empty");
  }
  return [map(head), ...rest.map(map)];
}

function toGuard(guard: WireGuard): Guard {
  switch (guard.kind) {
    case "always":
      return { kind: "always" };
    case "answer":
      return {
        kind: "answer",
        decision: brand<"DecisionId">(guard.decision),
        isAnyOf: mapNonEmpty(guard.isAnyOf, (id) => brand<"OptionId">(id)),
      };
    case "all":
      return { kind: "all", of: guard.of.map((child) => toGuard(child)) };
    case "any":
      return { kind: "any", of: guard.of.map((child) => toGuard(child)) };
    case "not":
      return { kind: "not", of: toGuard(guard.of) };
    default: {
      const neverGuard: never = guard;
      return neverGuard;
    }
  }
}

function toCatalog(raw: WireCatalog): Catalog {
  return {
    [catalogBrand]: "Catalog",
    release: raw.release,
    platform: raw.platform,
    sections: raw.sections.map((section) => ({
      id: brand<"SectionId">(section.id),
      title: section.title,
    })),
    decisions: raw.decisions.map((decision) => ({
      id: brand<"DecisionId">(decision.id),
      section: brand<"SectionId">(decision.section),
      stance: decision.stance,
      title: decision.title,
      variants: mapNonEmpty(decision.variants, (variant) => ({
        when: toGuard(variant.when),
        prompt: variant.prompt,
        default: {
          id: brand<"OptionId">(variant.default.id),
          label: variant.default.label,
          summary: variant.default.summary,
        },
        defaultRationale: variant.defaultRationale,
        alternatives: variant.alternatives.map((alternative) => ({
          id: brand<"OptionId">(alternative.id),
          label: alternative.label,
          summary: alternative.summary,
          when: toGuard(alternative.when),
        })),
        citations: mapNonEmpty(variant.citations, (citation) => ({
          url: brand<"HttpsUrl">(citation.url),
          locator: citation.locator,
          extraction: citation.extraction,
        })),
      })),
    })),
  };
}

export function parseCatalog(raw: unknown): ParseResult<Catalog> {
  const parsed = wireSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      issues: parsed.error.issues.map((issue) => ({
        kind: "malformed" as const,
        path: pointer(issue.path),
        message: issue.message,
      })),
    };
  }
  const issues = semanticIssues(parsed.data);
  if (issues.length > 0) return { ok: false, issues };
  return { ok: true, value: toCatalog(parsed.data) };
}

export type Answers = ReadonlyMap<DecisionId, OptionId>;

export const NO_ANSWERS: Answers = new Map();

export function withAnswer(
  answers: Answers,
  decision: DecisionId,
  option: OptionId | null,
): Answers {
  const next = new Map(answers);
  if (option === null) next.delete(decision);
  else next.set(decision, option);
  return next;
}

export interface StepDecision {
  readonly id: DecisionId;
  readonly section: SectionId;
  readonly stance: Stance;
  readonly title: string;
  readonly prompt: string;
  readonly citations: Citations;
  readonly defaultRationale: string;
}

export interface StepOption extends Option {
  readonly isDefault: boolean;
}

export interface WalkStep {
  readonly index: number;
  readonly decision: StepDecision;
  readonly options: readonly [StepOption, ...StepOption[]];
  readonly chosen: OptionId;
  readonly source: "default" | "answered";
  readonly because: readonly DecisionId[];
}

export interface DormantAnswer {
  readonly decision: DecisionId;
  readonly option: OptionId;
  readonly reason:
    | "decision-absent"
    | "option-not-offered"
    | "unknown-decision";
}

export interface Walk {
  readonly steps: readonly WalkStep[];
  readonly sections: readonly Section[];
  readonly dormant: readonly DormantAnswer[];
}

function holds(
  guard: Guard,
  chosen: ReadonlyMap<DecisionId, OptionId>,
): boolean {
  switch (guard.kind) {
    case "always":
      return true;
    case "answer": {
      const picked = chosen.get(guard.decision);
      return picked !== undefined && guard.isAnyOf.includes(picked);
    }
    case "all":
      return guard.of.every((child) => holds(child, chosen));
    case "any":
      return guard.of.some((child) => holds(child, chosen));
    case "not":
      return !holds(guard.of, chosen);
    default: {
      const neverGuard: never = guard;
      return neverGuard;
    }
  }
}

function guardDecisions(guard: Guard): DecisionId[] {
  switch (guard.kind) {
    case "always":
      return [];
    case "answer":
      return [guard.decision];
    case "not":
      return guardDecisions(guard.of);
    case "all":
    case "any":
      return guard.of.flatMap((child) => guardDecisions(child));
    default: {
      const neverGuard: never = guard;
      return neverGuard;
    }
  }
}

function uniqueIds(ids: readonly DecisionId[]): DecisionId[] {
  const seen = new Set<string>();
  const out: DecisionId[] = [];
  for (const id of ids) {
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}

function offered(
  variant: Variant,
  chosen: ReadonlyMap<DecisionId, OptionId>,
): [StepOption, ...StepOption[]] {
  const options: [StepOption, ...StepOption[]] = [
    { ...variant.default, isDefault: true },
  ];
  for (const alternative of variant.alternatives) {
    if (!holds(alternative.when, chosen)) continue;
    options.push({
      id: alternative.id,
      label: alternative.label,
      summary: alternative.summary,
      isDefault: false,
    });
  }
  return options;
}

export function walk(catalog: Catalog, answers: Answers): Walk {
  const known = new Map(
    catalog.decisions.map((decision) => [decision.id, decision]),
  );
  const chosen = new Map<DecisionId, OptionId>();
  const steps: WalkStep[] = [];

  for (const decision of catalog.decisions) {
    const variant = decision.variants.find((item) => holds(item.when, chosen));
    if (!variant) continue;
    const options = offered(variant, chosen);
    const stored = answers.get(decision.id);
    const storedFits =
      stored !== undefined && options.some((option) => option.id === stored);
    const pick = storedFits ? stored : variant.default.id;
    chosen.set(decision.id, pick);
    steps.push({
      index: steps.length,
      decision: {
        id: decision.id,
        section: decision.section,
        stance: decision.stance,
        title: decision.title,
        prompt: variant.prompt,
        citations: variant.citations,
        defaultRationale: variant.defaultRationale,
      },
      options,
      chosen: pick,
      source: pick === variant.default.id ? "default" : "answered",
      because: uniqueIds(guardDecisions(variant.when)),
    });
  }

  const used = new Set(steps.map((step) => step.decision.section));
  const dormant: DormantAnswer[] = [];
  for (const [decision, option] of answers) {
    const defined = known.get(decision);
    if (!defined) {
      dormant.push({ decision, option, reason: "unknown-decision" });
      continue;
    }
    const step = steps.find((item) => item.decision.id === decision);
    if (!step) {
      dormant.push({ decision, option, reason: "decision-absent" });
      continue;
    }
    if (!step.options.some((item) => item.id === option)) {
      dormant.push({ decision, option, reason: "option-not-offered" });
    }
  }

  return {
    steps,
    sections: catalog.sections.filter((section) => used.has(section.id)),
    dormant,
  };
}

export function encodeAnswers(current: Walk): string {
  const parts: string[] = [];
  for (const step of current.steps) {
    if (step.source !== "answered") continue;
    parts.push(
      `${encodeURIComponent(step.decision.id)}=${encodeURIComponent(step.chosen)}`,
    );
  }
  return parts.join("&");
}

export function decodeAnswers(catalog: Catalog, text: string): Answers {
  const decisions = new Map(
    catalog.decisions.map((decision) => [String(decision.id), decision]),
  );
  const answers = new Map<DecisionId, OptionId>();
  for (const pair of text.split("&")) {
    if (pair.length === 0) continue;
    const eq = pair.indexOf("=");
    if (eq <= 0) continue;
    let key = "";
    let value = "";
    try {
      key = decodeURIComponent(pair.slice(0, eq));
      value = decodeURIComponent(pair.slice(eq + 1));
    } catch {
      continue;
    }
    const decision = decisions.get(key);
    if (!decision) continue;
    if (!decisionOptionIds(decision).has(value)) continue;
    answers.set(decision.id, brand<"OptionId">(value));
  }
  return answers;
}

function decisionOptionIds(decision: Decision): Set<string> {
  const ids = new Set<string>();
  for (const variant of decision.variants) {
    ids.add(variant.default.id);
    for (const alternative of variant.alternatives) ids.add(alternative.id);
  }
  return ids;
}

export interface Inventory {
  readonly decisionIds: readonly string[];
  readonly sectionIds: readonly string[];
}

export type AuditFailure =
  | { readonly kind: "missing-required-decision"; readonly decision: string }
  | { readonly kind: "missing-required-section"; readonly section: string }
  | { readonly kind: "empty-default-walk" }
  | { readonly kind: "unreachable-decision"; readonly decision: DecisionId }
  | {
      readonly kind: "unreachable-option";
      readonly decision: DecisionId;
      readonly option: OptionId;
    };

export type AuditWarning =
  | {
      readonly kind: "pending-citation";
      readonly decision: DecisionId;
      readonly citation: Citation;
    }
  | {
      readonly kind: "default-not-simplest";
      readonly decision: DecisionId;
      readonly option: OptionId;
      readonly stepsSaved: number;
    }
  | { readonly kind: "exploration-truncated"; readonly limit: number };

export interface AuditReport {
  readonly failures: readonly AuditFailure[];
  readonly warnings: readonly AuditWarning[];
  readonly walksExplored: number;
}

export interface AuditOptions {
  readonly maxWalks?: number;
}

function optionKey(decision: DecisionId, option: OptionId): string {
  return `${decision}\0${option}`;
}

export function audit(
  catalog: Catalog,
  inventory: Inventory,
  options?: AuditOptions,
): AuditReport {
  const failures: AuditFailure[] = [];
  const warnings: AuditWarning[] = [];
  const decisionIds = new Set(
    catalog.decisions.map((decision) => String(decision.id)),
  );
  for (const id of inventory.decisionIds) {
    if (!decisionIds.has(id))
      failures.push({ kind: "missing-required-decision", decision: id });
  }
  for (const id of inventory.sectionIds) {
    const present = catalog.decisions.some(
      (decision) => decision.section === id,
    );
    if (!present)
      failures.push({ kind: "missing-required-section", section: id });
  }

  const baseline = walk(catalog, NO_ANSWERS);
  if (baseline.steps.length === 0)
    failures.push({ kind: "empty-default-walk" });

  for (const decision of catalog.decisions) {
    for (const variant of decision.variants) {
      for (const citation of variant.citations) {
        if (citation.extraction === "pending") {
          warnings.push({
            kind: "pending-citation",
            decision: decision.id,
            citation,
          });
        }
      }
    }
  }

  const maxWalks = options?.maxWalks ?? 10_000;
  const seen = new Set<string>();
  const queue: Answers[] = [NO_ANSWERS];
  const reachedDecisions = new Set<string>();
  const reachedOptions = new Set<string>();
  let walksExplored = 0;
  let truncated = false;

  while (queue.length > 0) {
    const answers = queue.shift();
    if (answers === undefined) break;
    const current = walk(catalog, answers);
    const key = encodeAnswers(current);
    if (seen.has(key)) continue;
    if (walksExplored >= maxWalks) {
      truncated = true;
      break;
    }
    seen.add(key);
    walksExplored += 1;
    for (const step of current.steps) {
      reachedDecisions.add(step.decision.id);
      for (const option of step.options) {
        reachedOptions.add(optionKey(step.decision.id, option.id));
        if (option.id === step.chosen) continue;
        queue.push(withAnswer(answers, step.decision.id, option.id));
      }
    }
  }
  if (truncated)
    warnings.push({ kind: "exploration-truncated", limit: maxWalks });

  for (const decision of catalog.decisions) {
    if (!reachedDecisions.has(decision.id)) {
      failures.push({ kind: "unreachable-decision", decision: decision.id });
    }
    for (const variant of decision.variants) {
      const ids = [
        variant.default.id,
        ...variant.alternatives.map((alternative) => alternative.id),
      ];
      for (const option of ids) {
        if (reachedOptions.has(optionKey(decision.id, option))) continue;
        failures.push({
          kind: "unreachable-option",
          decision: decision.id,
          option,
        });
      }
    }
  }

  for (const step of baseline.steps) {
    for (const option of step.options) {
      if (option.isDefault) continue;
      const alt = walk(
        catalog,
        withAnswer(NO_ANSWERS, step.decision.id, option.id),
      );
      if (alt.steps.length >= baseline.steps.length) continue;
      warnings.push({
        kind: "default-not-simplest",
        decision: step.decision.id,
        option: option.id,
        stepsSaved: baseline.steps.length - alt.steps.length,
      });
    }
  }

  return { failures, warnings, walksExplored };
}
