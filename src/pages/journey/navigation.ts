import { topicById } from "./catalog";
import type { Route } from "./model";

/** Stable targets keep a selected stage or step in place when the perspective changes. */
export function selectionTarget(route: Route) {
  return route.stage
    ? `stage-${route.stage}`
    : topicById.get(route.topic)?.parent === "approach"
      ? `method-${route.topic}`
      : route.topic === "journey"
        ? "page-title"
        : ["pre-installation", "installation", "post-installation"].includes(
              route.topic,
            )
          ? `phase-${route.topic}`
          : `step-${route.topic}`;
}
