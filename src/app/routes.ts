import {
  type Answers,
  decodeAnswers,
  encodeSelection,
  pruneAnswers,
} from "../pages/choices/catalog";
import { choicesCatalog } from "../pages/choices/data";
import type { TreeMode } from "../pages/choices/tree";
import { parseRoute, routeHref } from "../pages/journey/catalog";
import type { Route } from "../pages/journey/model";
import {
  type PrerequisitesView,
  parsePrerequisites,
  prerequisitesHome,
  prerequisitesHref,
} from "../pages/prerequisites/model";

export type AppRoute =
  | { page: "journey"; view: Route }
  | { page: "choices"; answers: Answers; mode: TreeMode }
  | { page: "prerequisites"; view: PrerequisitesView };

export const defaultPrerequisites: AppRoute & { page: "prerequisites" } = {
  page: "prerequisites",
  view: prerequisitesHome,
};

export const journeyHome: AppRoute & { page: "journey" } = {
  page: "journey",
  view: { topic: "journey", lens: "process" },
};

export const emptyChoices: AppRoute & { page: "choices" } = {
  page: "choices",
  answers: new Map(),
  mode: "path",
};

/** Accepts both former apps' links and the unified page routes. */
export function parseLocation(hash: string, search = ""): AppRoute {
  const fragment = hash.replace(/^#/, "");
  const [path, query = ""] = fragment.split("?");
  const legacyMode = new URLSearchParams(search).get("view");
  if (path === "/prerequisites" || path?.startsWith("/prerequisites/")) {
    return {
      page: "prerequisites",
      view: parsePrerequisites(
        path.slice("/prerequisites".length).replace(/^\//, ""),
        query,
      ),
    };
  }
  if (path === "/choices" || path === "/choices/") {
    const params = new URLSearchParams(query);
    return {
      page: "choices",
      answers: pruneAnswers(
        choicesCatalog,
        decodeAnswers(choicesCatalog, query),
      ),
      mode: params.get("mode") === "map" ? "map" : "path",
    };
  }
  if (
    (!fragment.startsWith("/") && fragment.includes("=")) ||
    (!fragment && legacyMode === "map")
  ) {
    return {
      page: "choices",
      answers: pruneAnswers(
        choicesCatalog,
        decodeAnswers(choicesCatalog, fragment),
      ),
      mode: legacyMode === "map" ? "map" : "path",
    };
  }
  return { page: "journey", view: parseRoute(hash) };
}

/** Serializes page state without mixing Journey perspectives and Choices modes. */
export function appHref(route: AppRoute): string {
  if (route.page === "journey") return routeHref(route.view);
  if (route.page === "prerequisites") return prerequisitesHref(route.view);
  const selection = encodeSelection(choicesCatalog, route.answers);
  const query = [route.mode === "map" ? "mode=map" : "", selection]
    .filter(Boolean)
    .join("&");
  return `#/choices${query ? `?${query}` : ""}`;
}
