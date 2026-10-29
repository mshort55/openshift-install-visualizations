import { useLayoutEffect, useRef, useState } from "react";
import { parseRoute, routeHref, topicById } from "./catalog";
import type { Route } from "./model";

interface Anchor {
  id: string;
  top: number;
}

/** Stable targets keep a selected stage or step in place when the perspective changes. */
function selectionTarget(route: Route) {
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

interface Position {
  scroll: number;
  focus: string | null;
}

/** Keeps native history meaningful and restores the place the reader left, including keyboard focus. */
export function useNavigation() {
  const [route, setRoute] = useState(() => parseRoute(window.location.hash));
  const mode = useRef<"initial" | "new" | Position | Anchor>("initial");
  useLayoutEffect(() => {
    const handleHistory = () => {
      const state: unknown = window.history.state;
      mode.current =
        typeof state === "object" &&
        state !== null &&
        "scroll" in state &&
        typeof state.scroll === "number"
          ? {
              scroll: state.scroll,
              focus:
                "focus" in state && typeof state.focus === "string"
                  ? state.focus
                  : null,
            }
          : "new";
      setRoute(parseRoute(window.location.hash));
    };
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.addEventListener("popstate", handleHistory);
    window.addEventListener("hashchange", handleHistory);
    return () => {
      window.history.scrollRestoration = previous;
      window.removeEventListener("popstate", handleHistory);
      window.removeEventListener("hashchange", handleHistory);
    };
  }, []);
  useLayoutEffect(() => {
    const topic = topicById.get(route.topic);
    document.title = `${topic?.title ?? "Journey"} · OpenShift Bare-metal Installation Journey`;
    const action = mode.current;
    if (action === "initial" && route.topic === "journey" && !route.item)
      return;
    const frame = requestAnimationFrame(() => {
      if (typeof action === "object" && "id" in action) {
        const target = document.getElementById(action.id);
        if (target)
          window.scrollBy({
            top: target.getBoundingClientRect().top - action.top,
            behavior: "instant",
          });
      } else if (typeof action === "object") {
        document
          .querySelector<HTMLElement>(
            `[data-focus="${CSS.escape(action.focus ?? "")}"]`,
          )
          ?.focus({ preventScroll: true });
        window.scrollTo({ top: action.scroll, behavior: "instant" });
      } else {
        const target = document.getElementById(
          route.item ? `record-${route.item}` : selectionTarget(route),
        );
        target?.focus({ preventScroll: true });
        if (route.topic === "journey" && !route.item)
          window.scrollTo({ top: 0, behavior: "instant" });
        else target?.scrollIntoView({ block: "start", behavior: "instant" });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [route]);
  const navigate = (next: Route, preserve = false) => {
    const normalized = parseRoute(routeHref(next));
    if (routeHref(normalized) === routeHref(route)) return;
    window.history.replaceState(
      {
        scroll: window.scrollY,
        focus: document.activeElement?.getAttribute("data-focus") ?? null,
      },
      "",
    );
    window.history.pushState(null, "", routeHref(normalized));
    const anchor = document.getElementById(selectionTarget(normalized));
    mode.current =
      preserve && anchor
        ? { id: anchor.id, top: anchor.getBoundingClientRect().top }
        : "new";
    setRoute(normalized);
  };
  return { route, navigate };
}
