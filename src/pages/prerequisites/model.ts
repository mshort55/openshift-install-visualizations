import { z } from "zod";

const targetSchema = z.enum([
  "overview",
  "addressing",
  "dns",
  "management",
  "tickets",
  "tickets/ipam",
  "tickets/dhcp",
  "tickets/network",
  "tickets/security",
  "tickets/services",
  "tickets/content",
  "tickets/bmc",
  "tickets/admin",
  "firewall",
  "sources",
  "reference",
  "inventory",
  "configuration",
  "ports",
  "dns-access",
]);

export type PrerequisitesTarget = z.infer<typeof targetSchema>;
export type PrerequisitesView = {
  target: PrerequisitesTarget;
  addressing: "dhcp" | "static";
  dns: "pending" | "published";
};

export const prerequisitesHome: PrerequisitesView = {
  target: "overview",
  addressing: "dhcp",
  dns: "published",
};

export const sections = [
  { target: "overview", label: "Network map" },
  { target: "tickets", label: "Site handoff" },
  { target: "reference", label: "Technical reference" },
] satisfies { target: PrerequisitesTarget; label: string }[];

export const referenceDisclosures: ReadonlySet<PrerequisitesTarget> = new Set([
  "inventory",
  "configuration",
  "ports",
  "dns-access",
  "sources",
]);

/** Keeps existing shared handoff links attached to their consolidated content. */
const handoffAnchors: ReadonlyMap<PrerequisitesTarget, string> = new Map([
  ["tickets/ipam", "addressing"],
  ["tickets/dhcp", "addressing"],
  ["tickets/network", "addressing"],
  ["tickets/services", "dns"],
  ["tickets/security", "firewall"],
  ["tickets/admin", "firewall"],
]);

export function prerequisitesSection(target: PrerequisitesTarget) {
  if (target === "overview" || target === "management") return "overview";
  if (target === "reference" || referenceDisclosures.has(target))
    return "reference";
  return "tickets";
}

/** Reads only the supported example scenarios; unknown values use the baseline. */
export function parsePrerequisites(
  path: string,
  query: string,
): PrerequisitesView {
  const target = targetSchema.safeParse(path.replace(/\/$/, ""));
  const params = new URLSearchParams(query);
  return {
    target: target.success ? target.data : "overview",
    addressing: params.get("addressing") === "static" ? "static" : "dhcp",
    dns: params.get("dns") === "pending" ? "pending" : "published",
  };
}

export function prerequisitesHref(view: PrerequisitesView): string {
  const path = view.target === "overview" ? "" : `/${view.target}`;
  const query = new URLSearchParams();
  if (view.addressing !== "dhcp") query.set("addressing", view.addressing);
  if (view.dns !== "published") query.set("dns", view.dns);
  return `#/prerequisites${path}${query.size ? `?${query}` : ""}`;
}

/** Route targets map to visible handoff headings or expandable reference summaries. */
export function prerequisitesTarget(view: PrerequisitesView): string {
  return view.target === "overview"
    ? "prerequisites-title"
    : `prerequisites-${(handoffAnchors.get(view.target) ?? view.target).replaceAll("/", "-")}`;
}

/** Contextual entry points stay explicit because the page illustrates one design. */
export const journeyPrerequisites: ReadonlyMap<string, PrerequisitesTarget> =
  new Map([
    ["networking", "overview"],
    ["addressing", "addressing"],
    ["dns", "dns"],
    ["service-access", "firewall"],
    ["management", "management"],
  ]);
