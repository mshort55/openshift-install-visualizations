import { type MouseEvent, useEffect, useRef, useState } from "react";
import { choicesCatalog } from "../pages/choices/data";
import { ChoicesPage } from "../pages/choices/ui";
import { JourneyPage, useJourneySession } from "../pages/journey/ui";
import { usePrerequisitesSession } from "../pages/prerequisites/interactions";
import { journeyPrerequisites } from "../pages/prerequisites/model";
import { PrerequisitesPage } from "../pages/prerequisites/ui";
import { Icon } from "./Icon";
import { Modal } from "./Modal";
import { useAppNavigation } from "./navigation";
import { appHref, journeyHome } from "./routes";

/** Leaves modified clicks to the browser so every destination works in a new tab. */
function follow(event: MouseEvent<HTMLAnchorElement>, navigate: () => void) {
  if (
    event.button ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  )
    return;
  event.preventDefault();
  navigate();
}

/** Shared identity and navigation; each page owns its content layout. */
export function App() {
  const { route, navigate, openPage, journey, choices, prerequisites } =
    useAppNavigation();
  const session = useJourneySession();
  const prerequisitesSession = usePrerequisitesSession();
  const [shareStatus, setShareStatus] = useState("");
  const [shareFallback, setShareFallback] = useState(false);
  const shareInput = useRef<HTMLInputElement>(null);
  const shareUrl = new URL(appHref(route), window.location.href).href;

  useEffect(() => {
    if (!shareStatus) return;
    const timer = window.setTimeout(() => setShareStatus(""), 3000);
    return () => clearTimeout(timer);
  }, [shareStatus]);
  useEffect(() => {
    if (shareFallback) {
      shareInput.current?.focus();
      shareInput.current?.select();
    }
  }, [shareFallback]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareStatus("Link copied");
    } catch {
      setShareFallback(true);
    }
  };

  return (
    <div className="application">
      <button
        type="button"
        className="app-skip-link"
        onClick={() => document.getElementById("main-content")?.focus()}
      >
        Skip to content
      </button>
      <header className="app-header">
        <a
          className="app-brand"
          href={appHref(journeyHome)}
          onClick={(event) => follow(event, () => navigate(journeyHome))}
        >
          <span className="app-mark" aria-hidden="true">
            <svg
              width="26"
              height="26"
              viewBox="0 0 40 40"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M7 26V14h12v12h14V14"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <circle cx="7" cy="26" r="3" fill="currentColor" />
              <circle cx="33" cy="14" r="3" fill="currentColor" />
            </svg>
          </span>
          <span>
            <strong>OpenShift</strong>
            <span className="app-brand-name">Installation journey</span>
          </span>
        </a>
        <nav className="app-navigation" aria-label="Main navigation">
          <a
            href={appHref(journey)}
            aria-current={route.page === "journey" ? "page" : undefined}
            data-focus="nav-journey"
            onClick={(event) => follow(event, () => openPage("journey"))}
          >
            Journey
          </a>
          <a
            href={appHref(choices)}
            aria-current={route.page === "choices" ? "page" : undefined}
            data-focus="nav-choices"
            onClick={(event) => follow(event, () => openPage("choices"))}
          >
            Choices
          </a>
          <a
            href={appHref(prerequisites)}
            aria-current={route.page === "prerequisites" ? "page" : undefined}
            data-focus="nav-prerequisites"
            onClick={(event) => follow(event, () => openPage("prerequisites"))}
          >
            Prerequisites
          </a>
        </nav>
        <button
          type="button"
          className="app-share"
          onClick={copyLink}
          aria-label="Share this view"
        >
          <Icon name="link" size={17} />
          <span>Share view</span>
        </button>
      </header>

      {route.page === "journey" ? (
        <JourneyPage
          route={route.view}
          navigate={(view, preserve) =>
            navigate({ page: "journey", view }, preserve ? "preserve" : "new")
          }
          session={session}
          prerequisitesLinks={
            new Map(
              [...journeyPrerequisites].map(([topic, target]) => {
                const next = {
                  ...prerequisites,
                  view: { ...prerequisites.view, target },
                };
                return [
                  topic,
                  <a
                    key={topic}
                    className="text-action"
                    href={appHref(next)}
                    data-focus={`explore-prerequisites-${topic}`}
                    onClick={(event) => follow(event, () => navigate(next))}
                  >
                    Explore the five-node prerequisite example{" "}
                    <Icon name="arrow" size={16} />
                  </a>,
                ];
              }),
            )
          }
          choicesLink={
            <a
              className="text-action"
              href={appHref(choices)}
              data-focus="explore-choices"
              onClick={(event) => follow(event, () => openPage("choices"))}
            >
              Explore Agent-based choices <Icon name="arrow" size={16} />
            </a>
          }
        />
      ) : (
        <>
          <div
            className={`app-return${route.page === "prerequisites" ? " app-return-wide" : ""}`}
          >
            <a
              href={appHref(journey)}
              data-focus="return-journey"
              onClick={(event) => follow(event, () => openPage("journey"))}
            >
              <Icon name="back" size={16} /> Return to journey
            </a>
          </div>
          {route.page === "choices" ? (
            <ChoicesPage
              catalog={choicesCatalog}
              answers={route.answers}
              mode={route.mode}
              onChange={(answers, mode) =>
                navigate({ page: "choices", answers, mode }, "retain")
              }
            />
          ) : (
            <PrerequisitesPage
              view={route.view}
              session={prerequisitesSession}
              onChange={(view, behavior) =>
                navigate({ page: "prerequisites", view }, behavior)
              }
            />
          )}
        </>
      )}

      <footer className="app-footer">
        <span>OpenShift installation journey</span>
        <span>Evidence reviewed · Nov 2026</span>
        <span>Internal use</span>
      </footer>
      <div className="app-toast" role="status" aria-live="polite">
        {shareStatus}
      </div>
      {shareFallback && (
        <Modal title="Share this view" onClose={() => setShareFallback(false)}>
          <div className="app-share-fallback">
            <p>
              Copy this link to open the same{" "}
              {route.page === "journey"
                ? "topic and perspective"
                : route.page === "choices"
                  ? "choices and display mode"
                  : "prerequisite section and example scenarios"}
              .
            </p>
            <input
              ref={shareInput}
              aria-label="Link to this view"
              value={shareUrl}
              readOnly
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
