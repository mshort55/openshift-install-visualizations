import type { AppRoute } from "../../app/routes";
import type { Route } from "../journey/model";
import type { Chapter } from "./model";

/** Each catalog record keeps its canonical destination through the shared parser. */
export const storyContexts = [
  {
    chapter: "introduction",
    topic: "agent-based",
    lens: "process",
    label: "Local Agent-based Installer",
  },
  {
    chapter: "introduction",
    topic: "media",
    lens: "problems",
    item: "boot-handoff",
    label: "Historical boot-handoff problem",
  },
  {
    chapter: "preparation",
    topic: "dns",
    lens: "process",
    label: "DNS and cluster access",
  },
  {
    chapter: "preparation",
    topic: "networking",
    lens: "problems",
    item: "owner-wait",
    label: "Infrastructure owner waits",
  },
  {
    chapter: "preparation",
    topic: "hosts",
    lens: "opportunities",
    item: "precise-handoffs",
    label: "Actionable owner requests",
  },
  {
    chapter: "installation",
    topic: "hosts",
    lens: "process",
    label: "Boot and install hosts",
  },
  {
    chapter: "installation",
    topic: "management",
    lens: "process",
    label: "Host management and access",
  },
  {
    chapter: "readiness",
    topic: "platform-operators",
    lens: "process",
    label: "Required Operators",
  },
  {
    chapter: "readiness",
    topic: "workloads",
    lens: "problems",
    item: "first-vm-blocked",
    label: "First-VM blockage",
  },
  {
    chapter: "readiness",
    topic: "recovery",
    lens: "opportunities",
    item: "supported-recovery",
    label: "Supported repair",
  },
  {
    chapter: "handoff",
    topic: "acceptance",
    lens: "process",
    label: "Infrastructure readiness context",
  },
  {
    chapter: "handoff",
    topic: "support",
    lens: "opportunities",
    item: "diagnostic-handover",
    label: "Evidence collection",
  },
  {
    chapter: "reuse",
    topic: "configuration",
    lens: "opportunities",
    item: "reusable-deployment-configuration",
    label: "Next-site configuration",
  },
] satisfies (Route & { chapter: Chapter; label: string })[];

export function contextRoute(context: Route): AppRoute {
  return {
    page: "journey",
    view: {
      topic: context.topic,
      lens: context.lens,
      ...(context.item ? { item: context.item } : {}),
    },
  };
}
