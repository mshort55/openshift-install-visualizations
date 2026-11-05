import { choicesCatalog } from "../pages/choices/data";
import { ChoicesPage } from "../pages/choices/ui";
import { topicById } from "../pages/journey/catalog";
import { JourneyPage, useJourneySession } from "../pages/journey/ui";
import { usePrerequisitesSession } from "../pages/prerequisites/interactions";
import { journeyPrerequisites } from "../pages/prerequisites/model";
import { PrerequisitesPage } from "../pages/prerequisites/ui";
import { storyContexts } from "../pages/solution-example/links";
import { useSolutionSession } from "../pages/solution-example/session";
import { SolutionPage } from "../pages/solution-example/ui";
import { Icon } from "./Icon";
import { follow } from "./links";
import { useAppNavigation } from "./navigation";
import { type AppRoute, appHref, journeyHome } from "./routes";

/** Shared identity and navigation; each page owns its content layout. */
export function App() {
  const session = useJourneySession();
  const prerequisitesSession = usePrerequisitesSession();
  const solutionSession = useSolutionSession();
  const captureReading = (source: AppRoute) => {
    const sourceSession =
      source.page === "journey"
        ? session
        : source.page === "prerequisites"
          ? prerequisitesSession
          : null;
    const opened = new Set(sourceSession?.opened);
    return () => sourceSession?.setOpened(opened);
  };
  const {
    route,
    navigate,
    openPage,
    origin,
    openContext,
    restoreReturn,
    solution,
    journey,
    choices,
    prerequisites,
  } = useAppNavigation(captureReading);
  const contextLink = (next: AppRoute, label: string, id: string) => (
    <a
      href={appHref(next)}
      data-focus={`solution-link-${id}`}
      onClick={(event) =>
        follow(event, () => {
          openContext({
            next,
            label:
              route.page === "solution-example"
                ? "solution example"
                : route.page === "journey"
                  ? (topicById.get(route.view.topic)?.title ?? "Journey map")
                  : route.page === "prerequisites"
                    ? "Network prep"
                    : "Install options",
          });
        })
      }
    >
      {label}
    </a>
  );
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
            aria-labelledby="nav-journey-title"
            aria-describedby="nav-journey-description"
            aria-current={route.page === "journey" ? "page" : undefined}
            data-focus="nav-journey"
            onClick={(event) => follow(event, () => openPage("journey"))}
          >
            <span className="app-navigation-heading">
              <strong id="nav-journey-title">Journey map</strong>
              <Icon
                name={route.page === "journey" ? "check" : "arrow"}
                size={18}
              />
            </span>
            <span
              className="app-navigation-description"
              id="nav-journey-description"
            >
              Explore installation steps, problems and opportunities.
            </span>
          </a>

          <a
            href={appHref(choices)}
            aria-labelledby="nav-choices-title"
            aria-describedby="nav-choices-description"
            aria-current={route.page === "choices" ? "page" : undefined}
            data-focus="nav-choices"
            onClick={(event) => follow(event, () => openPage("choices"))}
          >
            <span className="app-navigation-heading">
              <strong id="nav-choices-title">Install options</strong>
              <Icon
                name={route.page === "choices" ? "check" : "arrow"}
                size={18}
              />
            </span>
            <span
              className="app-navigation-description"
              id="nav-choices-description"
            >
              Compare Agent-based configuration options.
            </span>
          </a>
          <a
            href={appHref(prerequisites)}
            aria-labelledby="nav-prerequisites-title"
            aria-describedby="nav-prerequisites-description"
            aria-current={route.page === "prerequisites" ? "page" : undefined}
            data-focus="nav-prerequisites"
            onClick={(event) => follow(event, () => openPage("prerequisites"))}
          >
            <span className="app-navigation-heading">
              <strong id="nav-prerequisites-title">Network prep</strong>
              <Icon
                name={route.page === "prerequisites" ? "check" : "arrow"}
                size={18}
              />
            </span>
            <span
              className="app-navigation-description"
              id="nav-prerequisites-description"
            >
              Review addresses, services and access requirements.
            </span>
          </a>
          <a
            href={appHref(solution)}
            aria-labelledby="nav-solution-title"
            aria-describedby="nav-solution-description"
            aria-current={
              route.page === "solution-example" ? "page" : undefined
            }
            data-focus="nav-solution-example"
            onClick={(event) =>
              follow(event, () => openPage("solution-example"))
            }
          >
            <span className="app-navigation-heading">
              <strong id="nav-solution-title">Solution example</strong>
              <Icon
                name={route.page === "solution-example" ? "check" : "arrow"}
                size={18}
              />
            </span>
            <span
              className="app-navigation-description"
              id="nav-solution-description"
            >
              Explore a proposed installation experience.
            </span>
          </a>
        </nav>
      </header>

      {(origin || route.page === "solution-example") && (
        <div className="app-return">
          {origin ? (
            <a
              href={appHref(origin.returnTo.route)}
              data-focus="context-return"
              onClick={(event) => follow(event, restoreReturn)}
            >
              ← Return to {origin.label}
            </a>
          ) : (
            <a
              href={appHref(journeyHome)}
              onClick={(event) => follow(event, () => navigate(journeyHome))}
            >
              Explore how installation works
            </a>
          )}
        </div>
      )}
      {route.page === "solution-example" && (
        <SolutionPage
          phase={route.phase}
          onPhase={(phase) =>
            navigate({ page: "solution-example", phase }, "retain")
          }
          session={solutionSession}
          catalogLink={contextLink(
            {
              page: "journey",
              view: { topic: "journey", lens: "opportunities" },
            },
            "Open the opportunity catalog ↗",
            "opportunities",
          )}
        />
      )}
      {route.page === "journey" ? (
        <JourneyPage
          route={route.view}
          navigate={(view, preserve) =>
            navigate({ page: "journey", view }, preserve ? "preserve" : "new")
          }
          session={session}
          solutionLinks={
            new Map(
              storyContexts.map((context) => [
                context.item ?? context.topic,
                contextLink(
                  { page: "solution-example", phase: context.phase },
                  "See this in the solution example",
                  `from-${context.item ?? context.topic}`,
                ),
              ]),
            )
          }
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
                    onClick={(event) =>
                      follow(event, () =>
                        openContext({
                          next,
                          label: topicById.get(topic)?.title ?? "Journey map",
                        }),
                      )
                    }
                  >
                    Explore Network prep: a five-node example{" "}
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
              Explore Install options <Icon name="arrow" size={16} />
            </a>
          }
        />
      ) : (
        <>
          {!origin && route.page !== "solution-example" && (
            <div className="app-return">
              <a
                href={appHref(journey)}
                data-focus="return-journey"
                onClick={(event) => follow(event, () => openPage("journey"))}
              >
                <Icon name="back" size={16} /> Return to Journey map
              </a>
            </div>
          )}
          {route.page === "choices" ? (
            <ChoicesPage
              catalog={choicesCatalog}
              answers={route.answers}
              mode={route.mode}
              onChange={(answers, mode) =>
                navigate({ page: "choices", answers, mode }, "retain")
              }
            />
          ) : route.page === "prerequisites" ? (
            <>
              <div className="app-return">
                {contextLink(
                  { page: "solution-example", phase: "pre" },
                  "See this in the solution example",
                  "from-prerequisites-dns",
                )}
              </div>
              <PrerequisitesPage
                view={route.view}
                session={prerequisitesSession}
                onChange={(view, behavior) =>
                  navigate({ page: "prerequisites", view }, behavior)
                }
              />
            </>
          ) : null}
        </>
      )}

      <footer className="app-footer">
        <span>OpenShift installation journey</span>
        <span>Evidence reviewed · Nov 2026</span>
        <span>Internal use</span>
      </footer>
    </div>
  );
}
