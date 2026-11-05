import type { Route } from "../journey/model";
import type { Phase } from "./model";

/** Each catalog record keeps its canonical destination through the shared parser. */
export const storyContexts = [
  {
    phase: "install",
    topic: "agent-based",
    lens: "process",
  },
  {
    phase: "install",
    topic: "media",
    lens: "problems",
    item: "boot-handoff",
  },
  {
    phase: "pre",
    topic: "dns",
    lens: "process",
  },
  {
    phase: "pre",
    topic: "networking",
    lens: "problems",
    item: "owner-wait",
  },
  {
    phase: "pre",
    topic: "hosts",
    lens: "opportunities",
    item: "precise-handoffs",
  },
  {
    phase: "install",
    topic: "hosts",
    lens: "process",
  },
  {
    phase: "install",
    topic: "management",
    lens: "process",
  },
  {
    phase: "post",
    topic: "platform-operators",
    lens: "process",
  },
  {
    phase: "post",
    topic: "workloads",
    lens: "problems",
    item: "first-vm-blocked",
  },
  {
    phase: "post",
    topic: "recovery",
    lens: "opportunities",
    item: "supported-recovery",
  },
  {
    phase: "post",
    topic: "acceptance",
    lens: "process",
  },
  {
    phase: "post",
    topic: "support",
    lens: "opportunities",
    item: "diagnostic-handover",
  },
  {
    phase: "post",
    topic: "configuration",
    lens: "opportunities",
    item: "reusable-deployment-configuration",
  },
] satisfies (Route & { phase: Phase })[];
