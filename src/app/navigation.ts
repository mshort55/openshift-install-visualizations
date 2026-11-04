import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { z } from "zod";
import { topicById } from "../pages/journey/catalog";
import { selectionTarget } from "../pages/journey/navigation";
import { prerequisitesTarget } from "../pages/prerequisites/model";
import {
  type AppRoute,
  appHref,
  defaultPrerequisites,
  emptyChoices,
  journeyHome,
  parseLocation,
} from "./routes";

const positionSchema = z.object({
  scroll: z.number(),
  focus: z.string().nullable(),
});
type Position = z.infer<typeof positionSchema>;
export type NavigationReturn = { route: AppRoute; position: Position };
type ScrollAction =
  | "initial"
  | "new"
  | "retain"
  | Position
  | { id: string; top: number };
export type NavigationBehavior = "new" | "preserve" | "retain";

function pageTitle(route: AppRoute): string {
  switch (route.page) {
    case "solution-prototype":
      return "Solution example · Illustrative prototype";
    case "journey":
      return topicById.get(route.view.topic)?.title ?? "Journey";
    case "choices":
      return "Agent-based choices";
    case "prerequisites":
      return "Network prerequisites";
  }
}

function pageTarget(route: AppRoute): string {
  switch (route.page) {
    case "solution-prototype":
      return route.chapter === "preparation"
        ? "pg-moment-title"
        : `solution-chapter-${route.chapter}`;
    case "journey":
      return route.view.item
        ? `record-${route.view.item}`
        : selectionTarget(route.view);
    case "choices":
      return "choices-title";
    case "prerequisites":
      return prerequisitesTarget(route.view);
  }
}

function position(): Position {
  return {
    scroll: window.scrollY,
    focus: document.activeElement?.getAttribute("data-focus") ?? null,
  };
}

/** Owns browser history and restores each page's last reading position. */
export function useAppNavigation() {
  const [route, setRoute] = useState(() =>
    parseLocation(window.location.hash, window.location.search),
  );
  const current = useRef(route);
  const action = useRef<ScrollAction>("initial");
  const visits = useRef({
    "solution-prototype":
      route.page === "solution-prototype"
        ? route
        : ({
            page: "solution-prototype",
            chapter: "introduction",
            moment: 0,
          } satisfies AppRoute),
    journey: route.page === "journey" ? route : journeyHome,
    choices: route.page === "choices" ? route : emptyChoices,
    prerequisites:
      route.page === "prerequisites" ? route : defaultPrerequisites,
  });
  const positions = useRef<Partial<Record<AppRoute["page"], Position>>>({});

  const remember = useCallback(() => {
    const saved = position();
    positions.current[current.current.page] = saved;
    window.history.replaceState(saved, "");
  }, []);

  const select = (next: AppRoute) => {
    current.current = next;
    if (next.page === "journey") visits.current.journey = next;
    else if (next.page === "solution-prototype")
      visits.current["solution-prototype"] = next;
    else if (next.page === "choices") visits.current.choices = next;
    else visits.current.prerequisites = next;
    setRoute(next);
  };

  useLayoutEffect(() => {
    // Normalize old links once, including Choices' former document-level ?view.
    const initial = current.current;
    const url = new URL(window.location.href);
    if (initial.page === "choices") url.searchParams.delete("view");
    url.hash = appHref(initial);
    window.history.replaceState(window.history.state, "", url);
    const sync = () => {
      const next = parseLocation(window.location.hash, window.location.search);
      if (appHref(next) === appHref(current.current)) return;
      const saved = positionSchema.safeParse(window.history.state);
      action.current = saved.success ? saved.data : "new";
      current.current = next;
      if (next.page === "journey") visits.current.journey = next;
      else if (next.page === "solution-prototype")
        visits.current["solution-prototype"] = next;
      else if (next.page === "choices") visits.current.choices = next;
      else visits.current.prerequisites = next;
      setRoute(next);
    };
    let scrollTimer: number | undefined;
    const save = () => {
      const saved = position();
      positions.current[current.current.page] = saved;
      window.history.replaceState(saved, "");
    };
    const saveAfterScroll = () => {
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(save, 150);
    };
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.addEventListener("popstate", sync);
    window.addEventListener("hashchange", sync);
    window.addEventListener("scroll", saveAfterScroll, { passive: true });
    window.addEventListener("focusin", save);
    return () => {
      window.history.scrollRestoration = previous;
      window.removeEventListener("popstate", sync);
      window.removeEventListener("hashchange", sync);
      window.clearTimeout(scrollTimer);
      window.removeEventListener("scroll", saveAfterScroll);
      window.removeEventListener("focusin", save);
    };
  }, []);

  useLayoutEffect(() => {
    document.title = `${pageTitle(route)} · OpenShift Installation Journey`;
    const pending = action.current;
    if (pending === "retain") {
      remember();
      return;
    }
    const frame = requestAnimationFrame(() => {
      if (typeof pending === "object" && "id" in pending) {
        const target = document.getElementById(pending.id);
        if (target)
          window.scrollBy({
            top: target.getBoundingClientRect().top - pending.top,
            behavior: "instant",
          });
      } else if (typeof pending === "object") {
        document
          .querySelector<HTMLElement>(
            `[data-focus="${CSS.escape(pending.focus ?? "")}"]`,
          )
          ?.focus({ preventScroll: true });
        window.scrollTo({ top: pending.scroll, behavior: "instant" });
      } else {
        const id = pageTarget(route);
        const target = document.getElementById(id);
        if (pending !== "initial" || id !== "page-title")
          target?.focus({ preventScroll: true });
        if (
          id === "page-title" ||
          id === "choices-title" ||
          id === "prerequisites-title" ||
          id === "solution-chapter-introduction"
        )
          window.scrollTo({ top: 0, behavior: "instant" });
        else target?.scrollIntoView({ block: "start", behavior: "instant" });
      }
      // Focus events run before scroll restoration; save the completed position
      // now so an immediate Back/Forward cannot reuse that intermediate value.
      remember();
    });
    return () => cancelAnimationFrame(frame);
  }, [route, remember]);

  const navigate = (next: AppRoute, behavior: NavigationBehavior = "new") => {
    const normalized = parseLocation(appHref(next));
    if (appHref(normalized) === appHref(current.current)) return;
    remember();
    const anchor =
      normalized.page === "journey"
        ? document.getElementById(selectionTarget(normalized.view))
        : null;
    action.current =
      behavior === "preserve" && anchor
        ? { id: anchor.id, top: anchor.getBoundingClientRect().top }
        : behavior === "retain"
          ? "retain"
          : "new";
    window.history.pushState(null, "", appHref(normalized));
    select(normalized);
  };

  const openPage = (page: AppRoute["page"]) => {
    if (page === current.current.page) return;
    remember();
    const next = visits.current[page];
    action.current = positions.current[page] ?? "new";
    window.history.pushState(null, "", appHref(next));
    select(next);
  };

  const captureReturn = (): NavigationReturn => ({
    route: current.current,
    position: position(),
  });
  const restoreReturn = (saved: NavigationReturn) => {
    remember();
    action.current = saved.position;
    window.history.pushState(null, "", appHref(saved.route));
    select(saved.route);
  };

  return {
    captureReturn,
    restoreReturn,
    route,
    navigate,
    openPage,
    solution: visits.current["solution-prototype"],
    journey: visits.current.journey,
    choices: visits.current.choices,
    prerequisites: visits.current.prerequisites,
  };
}
