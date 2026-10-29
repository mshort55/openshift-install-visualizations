import { useLayoutEffect, useRef, useState } from "react";
import { parseRoute, routeHref, topicById } from "./catalog";
import type { Route } from "./model";

interface Position {
  scroll: number;
  focus: string | null;
}

/** Keeps native history meaningful and restores the place the reader left, including keyboard focus. */
export function useNavigation() {
  const [route, setRoute] = useState(() => parseRoute(window.location.hash));
  const mode = useRef<"initial" | "new" | "preserve" | Position>("initial");
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
          : { scroll: 0, focus: null };
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
    document.title = `${topic?.title ?? "Journey"} · OpenShift Installation Journey`;
    const action = mode.current;
    if (action === "initial" || action === "preserve") return;
    const frame = requestAnimationFrame(() => {
      if (typeof action === "object") {
        document
          .querySelector<HTMLElement>(
            `[data-focus="${CSS.escape(action.focus ?? "")}"]`,
          )
          ?.focus({ preventScroll: true });
        window.scrollTo({ top: action.scroll, behavior: "instant" });
      } else {
        document.getElementById("page-title")?.focus({ preventScroll: true });
        window.scrollTo({ top: 0, behavior: "instant" });
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
    mode.current = preserve ? "preserve" : "new";
    setRoute(normalized);
  };
  return { route, navigate };
}
