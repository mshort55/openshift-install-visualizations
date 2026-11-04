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
  dns: "pending",
};

export const sections = [
  { target: "overview", label: "Network map" },
  { target: "addressing", label: "Addressing" },
  { target: "dns", label: "DNS" },
  { target: "tickets", label: "IT handoffs" },
  { target: "firewall", label: "Firewall flows" },
  { target: "sources", label: "Sources" },
] satisfies { target: PrerequisitesTarget; label: string }[];

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
    dns: params.get("dns") === "published" ? "published" : "pending",
  };
}

export function prerequisitesHref(view: PrerequisitesView): string {
  const path = view.target === "overview" ? "" : `/${view.target}`;
  const query = new URLSearchParams();
  if (view.addressing !== "dhcp") query.set("addressing", view.addressing);
  if (view.dns !== "pending") query.set("dns", view.dns);
  return `#/prerequisites${path}${query.size ? `?${query}` : ""}`;
}

/** Route targets map to focusable headings or handoff summaries. */
export function prerequisitesTarget(view: PrerequisitesView): string {
  return view.target === "overview"
    ? "prerequisites-title"
    : `prerequisites-${view.target.replaceAll("/", "-")}`;
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
