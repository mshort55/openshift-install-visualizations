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

// History keys distinguish this document's in-memory entries after a reload.
const historySession = `${Date.now()}-${Math.random()}`;
let historySequence = 0;
function nextHistoryEntry() {
  return `${historySession}-${historySequence++}`;
}

const positionSchema = z.object({
  scroll: z.number(),
  focus: z.string().nullable(),
  entry: z.string().optional(),
});
type Position = z.infer<typeof positionSchema>;
type NavigationReturn = {
  route: AppRoute;
  position: Position;
  origin: NavigationOrigin | null;
  restoreReading: () => void;
};
type NavigationOrigin = { label: string; returnTo: NavigationReturn };
type ScrollAction =
  | "initial"
  | "new"
  | "retain"
  | Position
  | { id: string; top: number };
export type NavigationBehavior = "new" | "preserve" | "retain";

function pageTitle(route: AppRoute): string {
  switch (route.page) {
    case "solution-example":
      return "Solution example";
    case "journey":
      return route.view.topic === "journey"
        ? "Journey map"
        : (topicById.get(route.view.topic)?.title ?? "Journey map");
    case "choices":
      return "Install options";
    case "prerequisites":
      return "Network prep";
  }
}

function pageTarget(route: AppRoute): string {
  switch (route.page) {
    case "solution-example":
      return route.phase === "pre"
        ? "solution-title"
        : `solution-phase-${route.phase}`;
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
export function useAppNavigation(
  captureReading: (source: AppRoute) => () => void,
) {
  const reading = useRef(captureReading);
  reading.current = captureReading;
  const [origin, setOrigin] = useState<NavigationOrigin | null>(null);
  const currentOrigin = useRef(origin);
  const entry = useRef<string>(nextHistoryEntry());
  const historyEntries = useRef(
    new Map<
      string,
      { origin: NavigationOrigin | null; restoreReading: () => void }
    >(),
  );
  const selectOrigin = useCallback((next: NavigationOrigin | null) => {
    currentOrigin.current = next;
    setOrigin(next);
  }, []);
  const [route, setRoute] = useState(() =>
    parseLocation(window.location.hash, window.location.search),
  );
  const current = useRef(route);
  const action = useRef<ScrollAction>("initial");
  const visits = useRef({
    "solution-example":
      route.page === "solution-example"
        ? route
        : ({
            page: "solution-example",
            phase: "pre",
          } satisfies AppRoute),
    journey: route.page === "journey" ? route : journeyHome,
    choices: route.page === "choices" ? route : emptyChoices,
    prerequisites:
      route.page === "prerequisites" ? route : defaultPrerequisites,
  });
  const positions = useRef<Partial<Record<AppRoute["page"], Position>>>({});

  // Native disclosures change reading state without navigation, focus or scroll.
  useLayoutEffect(() => {
    historyEntries.current.set(entry.current, {
      origin,
      restoreReading: captureReading(route),
    });
  }, [captureReading, origin, route]);

  const remember = useCallback(() => {
    const saved = position();
    positions.current[current.current.page] = saved;
    window.history.replaceState({ ...saved, entry: entry.current }, "");
  }, []);

  const select = (next: AppRoute) => {
    current.current = next;
    if (next.page === "journey") visits.current.journey = next;
    else if (next.page === "solution-example")
      visits.current["solution-example"] = next;
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
      const saved = positionSchema.safeParse(window.history.state);
      if (
        appHref(next) === appHref(current.current) &&
        saved.success &&
        saved.data.entry === entry.current
      )
        return;
      action.current = saved.success ? saved.data : "new";
      entry.current =
        saved.success && saved.data.entry !== undefined
          ? saved.data.entry
          : nextHistoryEntry();
      const remembered = historyEntries.current.get(entry.current);
      selectOrigin(remembered?.origin ?? null);
      remembered?.restoreReading();
      current.current = next;
      if (next.page === "journey") visits.current.journey = next;
      else if (next.page === "solution-example")
        visits.current["solution-example"] = next;
      else if (next.page === "choices") visits.current.choices = next;
      else visits.current.prerequisites = next;
      setRoute(next);
    };
    let scrollTimer: number | undefined;
    const save = remember;
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
  }, [remember, selectOrigin]);

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
          id === "solution-title"
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
    entry.current = nextHistoryEntry();
    window.history.pushState(null, "", appHref(normalized));
    select(normalized);
  };

  const openPage = (page: AppRoute["page"]) => {
    if (page === current.current.page) return;
    remember();
    const next = visits.current[page];
    action.current = positions.current[page] ?? "new";
    selectOrigin(null);
    entry.current = nextHistoryEntry();
    window.history.pushState(null, "", appHref(next));
    select(next);
  };

  const openContext = ({ next, label }: { next: AppRoute; label: string }) => {
    const returnTo: NavigationReturn = {
      route: current.current,
      position: position(),
      origin: currentOrigin.current,
      restoreReading: reading.current(current.current),
    };
    navigate(next);
    selectOrigin({ label, returnTo });
  };
  const restoreReturn = () => {
    const saved = currentOrigin.current?.returnTo;
    if (!saved) return;
    remember();
    saved.restoreReading();
    selectOrigin(saved.origin);
    action.current = saved.position;
    entry.current = nextHistoryEntry();
    window.history.pushState(null, "", appHref(saved.route));
    select(saved.route);
  };

  return {
    origin,
    openContext,
    restoreReturn,
    route,
    navigate,
    openPage,
    solution: visits.current["solution-example"],
    journey: visits.current.journey,
    choices: visits.current.choices,
    prerequisites: visits.current.prerequisites,
  };
}
