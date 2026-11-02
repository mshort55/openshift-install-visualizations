import {
  type MouseEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ancestorsOf,
  childrenOf,
  descendantsOf,
  lenses,
  opportunities,
  opportunitiesFor,
  phaseIds,
  problems,
  problemsFor,
  routeHref,
  searchJourney,
  stageForTopic,
  stages,
  topicById,
  topics,
} from "./catalog";
import type { JourneyStage } from "./data/stages";
import { Icon } from "./icons";
import type { Opportunity, Problem, Route, Topic } from "./model";
import { useNavigation } from "./navigation";

type Navigate = (route: Route, preserve?: boolean) => void;
// Keep expanded lists available when browser Back restores a previously opened record.
const recordLimits = new Map<string, number>();
const phaseNames = ["Pre-installation", "Installation", "Post-installation"];
const phaseOutcomes = [
  "Ready to begin",
  "Base cluster installed",
  "Platform tested & team access verified",
];
const methodIds = new Set(childrenOf("approach").map((topic) => topic.id));

function visibleTopics(ids: Set<string>): string[] {
  return [...ids].filter((id) => !methodIds.has(id));
}

function stageTopics(stage: JourneyStage): string[] {
  return stage.topics.flatMap((id) => visibleTopics(descendantsOf(id)));
}

function hasContext(id: string): boolean {
  return topicById.get(id)?.kind !== "group";
}

function useTimelineExpansion(route: Route) {
  const [opened, setOpened] = useState<Set<string>>(() => new Set());
  const selectedStage = stageForTopic(route.topic)?.id ?? route.stage;
  const selectedTopics = new Set(
    ancestorsOf(route.topic).map((topic) => topic.id),
  );
  const stageOpen = (id: string) =>
    selectedStage === id || opened.has(`stage:${id}`);
  const topicOpen = (id: string) =>
    selectedTopics.has(id) || opened.has(`topic:${id}`);
  const detailOpen = (id: string) => opened.has(`detail:${id}`);
  const recordOpen = (id: string) => opened.has(`records:${id}`);
  const methodOpen = (id: string) => opened.has(`methods:${id}`);
  const comparisonOpen = () =>
    methodIds.has(route.topic) || opened.has("comparison:approach");
  const setKeys = (keys: string[], expand: boolean) => {
    setOpened((current) => {
      const next = new Set(current);
      for (const key of keys) {
        if (expand) next.add(key);
        else next.delete(key);
      }
      return next.size === current.size ? current : next;
    });
  };
  const scopeKeys = (stageIds: string[], topicIds: string[]) => [
    ...stageIds.map((id) => `stage:${id}`),
    ...topicIds.flatMap((id) => [
      `topic:${id}`,
      ...(hasContext(id) ? [`detail:${id}`] : []),
      `records:${id}`,
      ...(id === "approach" ? [`methods:${id}`, "comparison:approach"] : []),
    ]),
  ];
  const scopeOpen = (stageIds: string[], topicIds: string[]) =>
    stageIds.every(stageOpen) &&
    topicIds.every(
      (id) =>
        topicOpen(id) &&
        (!hasContext(id) || detailOpen(id)) &&
        recordOpen(id) &&
        (id !== "approach" || (methodOpen(id) && comparisonOpen())),
    );
  const setScope = (stageIds: string[], topicIds: string[], expand: boolean) =>
    setKeys(scopeKeys(stageIds, topicIds), expand);
  return {
    stageOpen,
    topicOpen,
    detailOpen,
    recordOpen,
    methodOpen,
    comparisonOpen,
    scopeOpen,
    setScope,
    setKeys,
  };
}

type TimelineExpansion = ReturnType<typeof useTimelineExpansion>;

function ExpandAllButton({
  expanded,
  label,
  onClick,
}: {
  expanded: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="expand-all-button"
      onClick={onClick}
      aria-label={`${expanded ? "Collapse" : "Expand"} all in ${label}`}
    >
      <Icon name={expanded ? "close" : "layers"} size={15} />
      {expanded ? "Collapse all" : "Expand all"}
    </button>
  );
}
function JourneyLink({
  to,
  navigate,
  children,
  className,
  label,
  focusId,
  preserve = false,
}: {
  to: Route;
  navigate: Navigate;
  children: ReactNode;
  className?: string;
  label?: string;
  focusId?: string;
  preserve?: boolean;
}) {
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.button ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    event.preventDefault();
    navigate(to, preserve);
  };
  return (
    <a
      href={routeHref(to)}
      onClick={onClick}
      className={className}
      aria-label={label}
      data-focus={focusId ?? `${to.topic}-${to.lens}-${to.item ?? "topic"}`}
    >
      {children}
    </a>
  );
}

function Modal({
  title,
  onClose,
  children,
  className = "",
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = overflow;
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className={`modal ${className}`}
      aria-labelledby="modal-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className="modal-heading">
        <h2 id="modal-title">{title}</h2>
        <button
          type="button"
          className="icon-button"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <Icon name="close" />
        </button>
      </div>
      {children}
    </dialog>
  );
}

function Search({
  navigate,
  onClose,
}: {
  navigate: Navigate;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const results = searchJourney(query);
  const searchNavigate: Navigate = (route) => {
    onClose();
    navigate(route);
  };
  useEffect(() => {
    input.current?.focus();
  }, []);
  return (
    <Modal
      title="Find your way through the journey"
      onClose={onClose}
      className="search-modal"
    >
      <div className="search-input-wrap">
        <Icon name="search" />
        <input
          ref={input}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try DNS, storage, retries or disconnected sites…"
          aria-label="Search topics, customer problems and opportunities"
        />
      </div>
      <p className="search-count" role="status">
        {query.trim()
          ? `${results.length} ${results.length === 1 ? "result" : "results"}${results.length > 20 ? " · showing the first 20" : ""}`
          : "Search across explanations, customer evidence and improvement ideas."}
      </p>
      <div className="search-results">
        {!query.trim() && (
          <div className="suggestions">
            <span>Start with a topic</span>
            {["Networking", "Storage", "Progress", "Disconnected"].map(
              (label) => (
                <button
                  type="button"
                  key={label}
                  onClick={() => {
                    setQuery(label);
                    input.current?.focus();
                  }}
                >
                  {label}
                  <Icon name="arrow" size={16} />
                </button>
              ),
            )}
          </div>
        )}
        {query.trim() && !results.length && (
          <div className="empty-state">
            <Icon name="search" size={28} />
            <h3>No matching topics yet</h3>
            <p>Try a broader term such as network, access or recovery.</p>
          </div>
        )}
        {results.slice(0, 20).map((result) => (
          <JourneyLink
            key={result.id}
            to={result.route}
            navigate={searchNavigate}
            className="search-result"
          >
            <span className="eyebrow">{result.context}</span>
            <strong>{result.title}</strong>
            <span>{result.summary}</span>
            <Icon name="arrow" size={18} />
          </JourneyLink>
        ))}
      </div>
    </Modal>
  );
}

function About({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="About this journey" onClose={onClose} className="about-modal">
      <div className="about-body">
        <span className="eyebrow">An explorer for Red Hat engineers</span>
        <h3>See the work through the customer’s eyes.</h3>
        <p>
          Explore the shared decisions and tasks involved in installing OCP 4.22
          on bare metal. Detailed installation examples follow the local
          Agent-based Installer CLI workflow, with method-specific behavior
          identified where it matters. Open variations for other boot options
          and installation without an external registry. Follow the timeline,
          then open a stage and step to reveal more detail. Switch perspectives
          to explore the same step’s problems and possible improvements.
        </p>
        <div className="about-lenses">
          {lenses.map((lens, i) => (
            <div key={lens.id}>
              <Icon name={i === 0 ? "book" : i === 1 ? "warning" : "bulb"} />
              <span>
                <strong>{lens.label}</strong>
                <p>{lens.description}</p>
              </span>
            </div>
          ))}
        </div>
        <h4>How to read the evidence</h4>
        <p>
          The research snapshot covers September–October 2026 and uses the OCP
          4.22 technical baseline. This is a learning and investigation map. It
          does not track a live cluster or certify a configuration.
        </p>
        <p>
          Customer problems and improvement opportunities include reports from
          other installation methods. Their original scopes and historical
          labels remain visible; they do not all describe Agent-based installs.
          The corpus is particularly rich in virtualization readiness; it does
          not establish the needs of every workload. A research gap does not
          mean the workflow has no problems.
        </p>
        <p>
          Ideas are candidates to investigate. Existing capabilities, unresolved
          questions and useful observations accompany each one.
        </p>
        <p className="about-note">
          Internal use · This app opens independently from the installation
          decision tree.
        </p>
      </div>
    </Modal>
  );
}

function LensTabs({ route, navigate }: { route: Route; navigate: Navigate }) {
  const { item: _item, ...selection } = route;
  return (
    <div className="perspectives">
      <div className="tabs" role="tablist" aria-label="Journey perspective">
        {lenses.map((lens, index) => (
          <button
            key={lens.id}
            id={`tab-${lens.id}`}
            type="button"
            role="tab"
            aria-selected={route.lens === lens.id}
            aria-controls="perspective-content"
            tabIndex={route.lens === lens.id ? 0 : -1}
            data-focus={`tab-${lens.id}`}
            onClick={() =>
              navigate(
                {
                  ...selection,
                  lens: lens.id,
                },
                true,
              )
            }
            onKeyDown={(event) => {
              const next =
                event.key === "ArrowRight"
                  ? (index + 1) % lenses.length
                  : event.key === "ArrowLeft"
                    ? (index + lenses.length - 1) % lenses.length
                    : event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? lenses.length - 1
                        : -1;
              const target = lenses[next];
              if (!target) return;
              event.preventDefault();
              navigate(
                {
                  ...selection,
                  lens: target.id,
                },
                true,
              );
              document.getElementById(`tab-${target.id}`)?.focus();
            }}
          >
            <Icon
              name={index === 0 ? "book" : index === 1 ? "warning" : "bulb"}
              size={17}
            />
            <span>{lens.label}</span>
          </button>
        ))}
      </div>
      <span className="perspective-hint">
        {route.lens === "process"
          ? "From preparation to operational handover."
          : "Reports retain their original method and context."}
      </span>
    </div>
  );
}

function MethodComparison({
  route,
  navigate,
  showAll,
}: {
  route: Route;
  navigate: Navigate;
  showAll: boolean;
}) {
  const methods = childrenOf("approach");
  const selected = methods.find((method) => method.id === route.topic);
  const visible = showAll ? methods : selected ? [selected] : [];
  return (
    <section
      className="method-comparison"
      aria-labelledby="method-comparison-title"
    >
      <div className="subheading">
        <h2 id="method-comparison-title">
          Compare bare-metal installation methods
        </h2>
        <span>Compare responsibilities and workflows</span>
      </div>
      <div className="method-options">
        {methods.map((method) => (
          <button
            key={method.id}
            type="button"
            id={`method-${method.id}`}
            data-focus={`method-${method.id}`}
            aria-pressed={selected?.id === method.id}
            className="method-option"
            onClick={() => navigate({ topic: method.id, lens: "process" })}
          >
            <strong>{method.title}</strong>
            {method.id === "agent-based" && (
              <span className="eyebrow">The path used in this journey</span>
            )}
            <span>{method.summary}</span>
            <span className="method-option-action">
              {selected?.id === method.id ? "Selected" : "View steps"}
              <Icon name="arrow" size={15} />
            </span>
          </button>
        ))}
      </div>
      {visible.map((method) => (
        <div key={method.id} className="method-process">
          <h3>{method.title}</h3>
          <p>{method.summary}</p>
          <ol className="process-flow">
            {method.flow.map((step, index) => (
              <li key={step.title}>
                <span className="flow-number">{index + 1}</span>
                <div>
                  <h4>{step.title}</h4>
                  <p>{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </section>
  );
}

function TimelineStep({
  topic,
  route,
  navigate,
  stage,
  number,
  expansion,
}: {
  topic: Topic;
  route: Route;
  navigate: Navigate;
  stage: JourneyStage;
  number: string;
  expansion: TimelineExpansion;
}) {
  const open = expansion.topicOpen(topic.id);
  const selected =
    route.topic === topic.id ||
    (topic.id === "approach" &&
      methodIds.has(route.topic) &&
      route.lens !== "process");
  const children = childrenOf(topic.id);
  const isGroup = topic.kind === "group";
  const topicIds = visibleTopics(descendantsOf(topic.id));
  const allOpen = expansion.scopeOpen([], topicIds);
  const records =
    route.lens === "problems"
      ? problemsFor(topic.id)
      : opportunitiesFor(topic.id);
  const problem =
    selected && route.lens === "problems"
      ? problems.find((item) => item.id === route.item)
      : undefined;
  const opportunity =
    selected && route.lens === "opportunities"
      ? opportunities.find((item) => item.id === route.item)
      : undefined;
  const closeRoute: Route = stage.topics.includes(topic.id)
    ? { topic: stage.phase, stage: stage.id, lens: route.lens }
    : { topic: topic.parent ?? stage.phase, lens: route.lens };
  const selectedWithin = ancestorsOf(route.topic).some(
    (ancestor) => ancestor.id === topic.id,
  );
  const context = hasContext(topic.id) && (
    <details
      className="step-context"
      open={expansion.detailOpen(topic.id)}
      onToggle={(event) =>
        expansion.setKeys([`detail:${topic.id}`], event.currentTarget.open)
      }
    >
      <summary>Outcome, people and context</summary>
      <Context topic={topic} />
    </details>
  );
  const nestedSteps = children.length > 0 && topic.id !== "approach" && (
    <div className="nested-steps">
      <p className="eyebrow">
        {isGroup ? "Explore the steps in this area" : "Details and variations"}
      </p>
      <ol>
        {children.map((child, index) => (
          <TimelineStep
            key={child.id}
            topic={child}
            route={route}
            navigate={navigate}
            stage={stage}
            number={`${number}.${index + 1}`}
            expansion={expansion}
          />
        ))}
      </ol>
    </div>
  );
  return (
    <li className={`timeline-step ${open ? "step-open" : ""}`}>
      <div className="step-heading">
        <h4>
          <button
            type="button"
            id={`step-${topic.id}`}
            data-focus={`step-${topic.id}`}
            aria-expanded={open}
            aria-controls={`step-body-${topic.id}`}
            className="step-toggle"
            onClick={() => {
              expansion.setKeys([`topic:${topic.id}`], !open);
              if (open && selectedWithin) navigate(closeRoute, true);
              else if (!open) navigate({ topic: topic.id, lens: route.lens });
            }}
          >
            <span className="step-number">{number}</span>
            <span className="step-title">
              {topic.title}
              {topic.condition && (
                <span className="step-condition">{topic.condition}</span>
              )}
            </span>
            {route.lens !== "process" && (
              <span className="step-count">
                {records.length}{" "}
                {route.lens === "problems" ? "problems" : "ideas"}
              </span>
            )}
            <Icon name="chevron" size={17} />
          </button>
        </h4>
        <ExpandAllButton
          expanded={allOpen}
          label={topic.title}
          onClick={() => {
            expansion.setScope([], topicIds, !allOpen);
            if (allOpen && selectedWithin) navigate(closeRoute, true);
          }}
        />
      </div>
      <div id={`step-body-${topic.id}`} hidden={!open}>
        {open && (
          <div className="step-body">
            <p className="step-summary">{topic.summary}</p>
            {isGroup && nestedSteps}
            {(!isGroup || route.lens !== "process") && (
              <div className="step-detail">
                {problem || opportunity ? (
                  <>
                    {expansion.recordOpen(topic.id) && (
                      <RecordList
                        key={`${topic.id}-${route.lens}`}
                        topic={topic}
                        route={route}
                        navigate={navigate}
                        showAll
                      />
                    )}
                    <section
                      id={`record-${route.item}`}
                      tabIndex={-1}
                      className="inline-record"
                    >
                      <JourneyLink
                        to={{ topic: topic.id, lens: route.lens }}
                        navigate={navigate}
                        className="text-action"
                      >
                        <Icon name="back" size={16} />
                        Back to{" "}
                        {route.lens === "problems"
                          ? "problems"
                          : "opportunities"}{" "}
                        in this step
                      </JourneyLink>
                      <h5>{problem?.title ?? opportunity?.title}</h5>
                      {problem ? (
                        <ProblemDetail
                          problem={problem}
                          topic={topic}
                          navigate={navigate}
                        />
                      ) : opportunity ? (
                        <OpportunityDetail
                          opportunity={opportunity}
                          topic={topic}
                          navigate={navigate}
                        />
                      ) : null}
                    </section>
                  </>
                ) : route.lens === "process" ? (
                  <>
                    <Process topic={topic} navigate={navigate} />
                    {topic.id === "approach" && (
                      <details
                        className="step-context method-orientation"
                        open={expansion.comparisonOpen()}
                        onToggle={(event) => {
                          const open = event.currentTarget.open;
                          expansion.setKeys(["comparison:approach"], open);
                          if (!open) {
                            expansion.setKeys(["methods:approach"], false);
                            if (methodIds.has(route.topic))
                              navigate(
                                { topic: "approach", lens: "process" },
                                true,
                              );
                          }
                        }}
                      >
                        <summary>
                          Optional: compare bare-metal installation methods
                        </summary>
                        <ExpandAllButton
                          expanded={expansion.methodOpen(topic.id)}
                          label="installation-method comparison"
                          onClick={() => {
                            const wasOpen = expansion.methodOpen(topic.id);
                            expansion.setKeys(["methods:approach"], !wasOpen);
                            if (wasOpen && methodIds.has(route.topic))
                              navigate(
                                { topic: "approach", lens: "process" },
                                true,
                              );
                          }}
                        />
                        <MethodComparison
                          route={route}
                          navigate={navigate}
                          showAll={expansion.methodOpen(topic.id)}
                        />
                      </details>
                    )}
                  </>
                ) : (
                  <RecordList
                    key={`${topic.id}-${route.lens}`}
                    topic={topic}
                    route={route}
                    navigate={navigate}
                    showAll={expansion.recordOpen(topic.id)}
                  />
                )}
                {!isGroup && nestedSteps}
                {context}
              </div>
            )}
          </div>
        )}
      </div>
    </li>
  );
}

function Timeline({
  route,
  navigate,
  expansion,
}: {
  route: Route;
  navigate: Navigate;
  expansion: TimelineExpansion;
}) {
  const allStageIds = stages.map((stage) => stage.id);
  const allTopicIds = topics
    .filter(
      (topic) =>
        topic.parent && topic.parent !== "journey" && !methodIds.has(topic.id),
    )
    .map((topic) => topic.id);
  const allOpen = expansion.scopeOpen(allStageIds, allTopicIds);
  return (
    <div className="journey-timeline">
      <div className="timeline-intro">
        <div className="timeline-intro-heading">
          <span className="eyebrow">
            From preparation to an operating platform
          </span>
          <ExpandAllButton
            expanded={allOpen}
            label="the journey"
            onClick={() => {
              expansion.setScope(allStageIds, allTopicIds, !allOpen);
              if (allOpen)
                navigate({ topic: "journey", lens: route.lens }, true);
            }}
          />
        </div>
        <p>
          Open a stage, then a step. Switch perspectives to see the same work
          through a different lens.
        </p>
        <span className="timeline-order-note">
          <Icon name="info" size={15} />
          Typical progression · work can overlap and retries can return to an
          earlier stage.
        </span>
      </div>
      <ol className="timeline-phases">
        {phaseIds.map((phaseId, phaseIndex) => (
          <li key={phaseId} className={`timeline-phase phase-${phaseIndex}`}>
            <section aria-labelledby={`phase-${phaseId}`}>
              <div className="timeline-phase-heading">
                <span className="timeline-phase-marker">0{phaseIndex + 1}</span>
                <div>
                  <span className="eyebrow">
                    {phaseIndex === 0
                      ? "Prepare"
                      : phaseIndex === 1
                        ? "Create"
                        : "Validate & hand over"}
                  </span>
                  <h2 id={`phase-${phaseId}`} tabIndex={-1}>
                    {phaseNames[phaseIndex]}
                  </h2>
                </div>
                <span className="phase-outcome">
                  <Icon name="flag" size={15} />
                  {phaseOutcomes[phaseIndex]}
                </span>
                <ExpandAllButton
                  expanded={expansion.scopeOpen(
                    stages
                      .filter((stage) => stage.phase === phaseId)
                      .map((stage) => stage.id),
                    stages
                      .filter((stage) => stage.phase === phaseId)
                      .flatMap(stageTopics),
                  )}
                  label={phaseNames[phaseIndex] ?? phaseId}
                  onClick={() => {
                    const phaseStages = stages.filter(
                      (stage) => stage.phase === phaseId,
                    );
                    const stageIds = phaseStages.map((stage) => stage.id);
                    const topicIds = phaseStages.flatMap(stageTopics);
                    const fullyOpen = expansion.scopeOpen(stageIds, topicIds);
                    expansion.setScope(stageIds, topicIds, !fullyOpen);
                    if (
                      fullyOpen &&
                      topicById.get(route.topic)?.phase === phaseId
                    )
                      navigate({ topic: phaseId, lens: route.lens }, true);
                  }}
                />
              </div>
              <ol className="timeline-stages">
                {stages
                  .filter((stage) => stage.phase === phaseId)
                  .map((stage, index) => {
                    const open = expansion.stageOpen(stage.id);
                    const topicIds = stageTopics(stage);
                    const fullyOpen = expansion.scopeOpen([stage.id], topicIds);
                    return (
                      <li
                        key={stage.id}
                        className={`timeline-stage ${open ? "stage-open" : ""}`}
                      >
                        <span className="stage-node" aria-hidden="true" />
                        <div className="stage-card">
                          <div className="stage-heading">
                            <h3>
                              <button
                                type="button"
                                className="stage-toggle"
                                id={`stage-${stage.id}`}
                                data-focus={`stage-${stage.id}`}
                                aria-expanded={open}
                                aria-controls={`stage-body-${stage.id}`}
                                onClick={() => {
                                  expansion.setKeys(
                                    [`stage:${stage.id}`],
                                    !open,
                                  );
                                  if (
                                    open &&
                                    (stageForTopic(route.topic)?.id ??
                                      route.stage) === stage.id
                                  )
                                    navigate(
                                      { topic: phaseId, lens: route.lens },
                                      true,
                                    );
                                  else if (!open)
                                    navigate({
                                      topic: phaseId,
                                      lens: route.lens,
                                      stage: stage.id,
                                    });
                                }}
                              >
                                <span className="stage-ordinal">
                                  {phaseIndex + 1}.{index + 1}
                                </span>
                                <span className="stage-copy">
                                  <span className="stage-title">
                                    {stage.title}
                                  </span>
                                  <span className="stage-summary">
                                    {stage.summaries[route.lens]}
                                  </span>
                                </span>
                                <span className="stage-disclosure">
                                  <span>{open ? "Close" : "Explore"}</span>
                                  <Icon name="chevron" size={18} />
                                </span>
                              </button>
                            </h3>
                            <ExpandAllButton
                              expanded={fullyOpen}
                              label={stage.title}
                              onClick={() => {
                                expansion.setScope(
                                  [stage.id],
                                  topicIds,
                                  !fullyOpen,
                                );
                                if (
                                  fullyOpen &&
                                  (stageForTopic(route.topic)?.id ??
                                    route.stage) === stage.id
                                )
                                  navigate(
                                    { topic: phaseId, lens: route.lens },
                                    true,
                                  );
                              }}
                            />
                          </div>
                          <div id={`stage-body-${stage.id}`} hidden={!open}>
                            {open && (
                              <div className="stage-body">
                                {stage.note && (
                                  <p className="stage-note">
                                    <Icon name="info" size={16} />
                                    {stage.note}
                                  </p>
                                )}
                                <p className="eyebrow">Steps to explore</p>
                                <ol className="timeline-steps">
                                  {stage.topics.map((id, stepIndex) => {
                                    const topic = topicById.get(id);
                                    return topic ? (
                                      <TimelineStep
                                        key={id}
                                        topic={topic}
                                        route={route}
                                        navigate={navigate}
                                        stage={stage}
                                        number={String(stepIndex + 1).padStart(
                                          2,
                                          "0",
                                        )}
                                        expansion={expansion}
                                      />
                                    ) : null;
                                  })}
                                </ol>
                              </div>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
              </ol>
            </section>
          </li>
        ))}
      </ol>
      <p className="timeline-finish">
        <Icon name="flag" size={18} />A usable workload, demonstrated readiness
        and a team ready to operate it.
      </p>
    </div>
  );
}

function Context({ topic }: { topic: Topic }) {
  return (
    <aside className="context-column">
      <div className="context-card">
        <span className="eyebrow">The customer’s finish line</span>
        <div className="outcome-icon">
          <Icon name="flag" size={20} />
        </div>
        <p className="outcome-text">{topic.outcome}</p>
        <div className="context-divider" />
        <span className="eyebrow">People involved</span>
        <p>{topic.owners}</p>
        <span className="eyebrow">Context</span>
        <p className="scope-text">{topic.scope}</p>
      </div>
    </aside>
  );
}

function Process({ topic, navigate }: { topic: Topic; navigate: Navigate }) {
  return (
    <div className="process-content">
      {topic.operatorExamples && (
        <section className="operator-examples">
          <div className="subheading">
            <h2>Examples by customer need</h2>
          </div>
          <p>
            Select additions for your workload and site requirements. Core
            Cluster Operators already provide basic networking and platform
            monitoring. Check which add-ons your installer supplied.
          </p>
          <section
            className="operator-examples-table"
            aria-label="Example Operators and configuration"
            // biome-ignore lint/a11y/noNoninteractiveTabindex: Keyboard users must be able to scroll the wide Operator table.
            tabIndex={0}
          >
            <table>
              <caption>Representative customer-installed Operators</caption>
              <thead>
                <tr>
                  <th scope="col">Customer need</th>
                  <th scope="col">Example Operators</th>
                  <th scope="col">Configuration still needed</th>
                </tr>
              </thead>
              <tbody>
                {topic.operatorExamples.map((example) => (
                  <tr key={example.need}>
                    <th scope="row">{example.need}</th>
                    <td>{example.operators}</td>
                    <td>{example.configuration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </section>
      )}
      <section className="flow-section">
        <div className="subheading">
          <h2>
            {topic.id === "approach"
              ? "Plan the deployment"
              : "Understand the process"}
          </h2>
          <span>
            {topic.id === "approach"
              ? "Three decisions before installation"
              : "The essential sequence"}
          </span>
        </div>
        <ol className="process-flow">
          {topic.flow.map((step, index) => (
            <li key={step.title}>
              <span className="flow-number">{index + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.detail}</p>
                {step.command && (
                  <pre className="process-command">
                    <code>{step.command}</code>
                  </pre>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>
      {topic.serviceFlows && (
        <section
          className="service-flow-table"
          aria-label="Service access dependencies"
          // biome-ignore lint/a11y/noNoninteractiveTabindex: Keyboard users must be able to scroll the wide dependency table.
          tabIndex={0}
        >
          <table>
            <caption>Service paths to review with their owners</caption>
            <thead>
              <tr>
                <th scope="col">Source → destination</th>
                <th scope="col">Connection and purpose</th>
                <th scope="col">Applies when · owner</th>
              </tr>
            </thead>
            <tbody>
              {topic.serviceFlows.map((flow) => (
                <tr key={`${flow.source}-${flow.destination}`}>
                  <th scope="row">
                    {flow.source} → {flow.destination}
                  </th>
                  <td>
                    <strong>{flow.protocol}</strong>
                    <p>{flow.purpose}</p>
                  </td>
                  <td>
                    {flow.applies}
                    <p>Owner: {flow.owner}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
      <div className="next-perspective">
        <div>
          <Icon name="warning" size={18} />
          <span>What makes this difficult for customers?</span>
        </div>
        <JourneyLink
          to={{
            topic: topic.id,
            lens: "problems",
          }}
          navigate={navigate}
          className="text-action"
        >
          Explore customer problems
          <Icon name="arrow" size={16} />
        </JourneyLink>
      </div>
    </div>
  );
}

function RecordList({
  topic,
  route,
  navigate,
  showAll,
}: {
  topic: Topic;
  route: Route;
  navigate: Navigate;
  showAll: boolean;
}) {
  const records =
    route.lens === "problems"
      ? problemsFor(topic.id)
      : opportunitiesFor(topic.id);
  const listKey = `${topic.id}-${route.lens}`;
  const [visible, setVisible] = useState(recordLimits.get(listKey) ?? 6);
  const limit = showAll ? records.length : visible;
  return (
    <section className="record-section">
      <div className="subheading">
        <h2>
          {route.lens === "problems"
            ? "Where customers encounter difficulty"
            : "Where engineering could help"}
        </h2>
        <span>
          {records.length}{" "}
          {route.lens === "problems" ? "mapped problems" : "candidate ideas"}
        </span>
      </div>
      <p className="section-description">
        {route.lens === "problems"
          ? "Open an account to see what happened, its consequence and what the evidence establishes."
          : "Ideas to investigate, grounded in customer problems. Open one to see existing capabilities and a proposed test."}
      </p>
      {records.length === 0 ? (
        <div className="empty-state">
          <Icon name="book" size={28} />
          <h3>
            No specific{" "}
            {route.lens === "problems" ? "customer account" : "intervention"}{" "}
            mapped at this level
          </h3>
          <p>
            This is a coverage boundary, not evidence that the workflow has no
            difficulty. Explore the parent area for related findings.
          </p>
          {topic.parent && (
            <JourneyLink
              to={{ topic: topic.parent, lens: route.lens }}
              navigate={navigate}
              className="secondary-button"
            >
              Explore {topicById.get(topic.parent)?.title}
              <Icon name="arrow" size={16} />
            </JourneyLink>
          )}
        </div>
      ) : (
        <div className="record-list">
          {records.slice(0, limit).map((record) => (
            <JourneyLink
              key={record.id}
              to={{ topic: topic.id, lens: route.lens, item: record.id }}
              navigate={navigate}
              className={`record-card ${route.lens}`}
            >
              <div className="record-meta">
                <span
                  className={`evidence-badge ${"kind" in record && record.kind === "Research gap" ? "gap" : ""}`}
                >
                  {"kind" in record ? record.kind : "Idea to investigate"}
                </span>
              </div>
              <h3>{record.title}</h3>
              <p>{record.summary}</p>
              <span className="record-action">
                {route.lens === "problems"
                  ? "Understand this problem"
                  : "Explore this opportunity"}
                <Icon name="arrow" size={16} />
              </span>
            </JourneyLink>
          ))}
        </div>
      )}
      {records.length > limit && (
        <button
          type="button"
          className="secondary-button show-more"
          onClick={() => {
            recordLimits.set(listKey, visible + 6);
            setVisible(visible + 6);
          }}
        >
          Show {Math.min(6, records.length - visible)} more
          <Icon name="chevron" size={16} />
        </button>
      )}
    </section>
  );
}

function ProblemDetail({
  problem,
  topic,
  navigate,
}: {
  problem: Problem;
  topic: Topic;
  navigate: Navigate;
}) {
  const connected = opportunities.filter((opportunity) =>
    opportunity.problems.includes(problem.id),
  );
  return (
    <div className="detail-layout">
      <article className="evidence-detail">
        <div className="evidence-context">
          <span className="evidence-badge">{problem.kind}</span>
        </div>
        <p className="detail-context">{problem.context}</p>
        <div className="detail-section">
          <h2>What the research records</h2>
          <p>{problem.evidence}</p>
        </div>
        <div className="detail-section">
          <h2>Why it matters to the customer</h2>
          <p>{problem.impact}</p>
        </div>
        <div className="evidence-limit">
          <Icon name="info" size={20} />
          <div>
            <h2>What this evidence does—and does not—establish</h2>
            <p>{problem.limit}</p>
          </div>
        </div>
      </article>
      <aside className="record-aside">
        <div className="context-card">
          <span className="eyebrow">Understand the work</span>
          <h3>{topic.title}</h3>
          <p>{topic.summary}</p>
          <JourneyLink
            to={{ topic: topic.id, lens: "process" }}
            navigate={navigate}
            className="text-action"
          >
            How it works
            <Icon name="arrow" size={16} />
          </JourneyLink>
        </div>
        <div className="related">
          <span className="eyebrow">Connected opportunities</span>
          {connected.map((opportunity) => (
            <JourneyLink
              key={opportunity.id}
              to={{
                topic:
                  opportunity.topics.find((id) => id === topic.id) ??
                  opportunity.topics[0] ??
                  "journey",
                lens: "opportunities",
                item: opportunity.id,
              }}
              navigate={navigate}
            >
              <span>
                <small>Idea to investigate</small>
                {opportunity.title}
              </span>
              <Icon name="arrow" size={16} />
            </JourneyLink>
          ))}
        </div>
        <JourneyLink
          to={{
            topic: topic.id,
            lens: "problems",
          }}
          navigate={navigate}
          className="text-action"
        >
          <Icon name="back" size={16} />
          All problems in this area
        </JourneyLink>
      </aside>
    </div>
  );
}

function OpportunityDetail({
  opportunity,
  topic,
  navigate,
}: {
  opportunity: Opportunity;
  topic: Topic;
  navigate: Navigate;
}) {
  return (
    <div className="detail-layout">
      <article className="evidence-detail">
        <div className="proposal-label">
          <Icon name="bulb" size={18} />
          <span>
            Candidate intervention · needs investigation and validation
          </span>
        </div>
        {[
          {
            title: "Shape the smallest useful intervention",
            text: opportunity.intervention,
          },
          { title: "Build on what already exists", text: opportunity.existing },
          {
            title: "Investigate before committing",
            text: opportunity.investigate,
          },
          { title: "What we would observe", text: opportunity.measure },
        ].map((section) => (
          <div className="detail-section" key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.text}</p>
          </div>
        ))}
      </article>
      <aside className="record-aside">
        <div className="context-card">
          <span className="eyebrow">The customer’s task</span>
          <h3>{topic.title}</h3>
          <p>{topic.question}</p>
          <JourneyLink
            to={{ topic: topic.id, lens: "process" }}
            navigate={navigate}
            className="text-action"
          >
            Understand the process
            <Icon name="arrow" size={16} />
          </JourneyLink>
        </div>
        <div className="related">
          <span className="eyebrow">Grounded in these problems</span>
          {opportunity.problems.map((id) => {
            const problem = problems.find((item) => item.id === id);
            return problem ? (
              <JourneyLink
                key={id}
                to={{
                  topic: problem.topics[0] ?? "journey",
                  lens: "problems",
                  item: id,
                }}
                navigate={navigate}
              >
                <span>
                  <small>{problem.kind}</small>
                  {problem.title}
                </span>
                <Icon name="arrow" size={16} />
              </JourneyLink>
            ) : null;
          })}
        </div>
        <JourneyLink
          to={{
            topic: topic.id,
            lens: "opportunities",
          }}
          navigate={navigate}
          className="text-action"
        >
          <Icon name="back" size={16} />
          All opportunities in this area
        </JourneyLink>
      </aside>
    </div>
  );
}

export function App() {
  const { route: savedRoute, navigate } = useNavigation();
  const record = savedRoute.item
    ? (savedRoute.lens === "problems" ? problems : opportunities).find(
        (item) => item.id === savedRoute.item,
      )
    : undefined;
  const recordTopic =
    record && !stageForTopic(savedRoute.topic)
      ? record.topics.find(
          (id) =>
            savedRoute.topic === "journey" ||
            topicById.get(id)?.phase === savedRoute.topic,
        )
      : undefined;
  const route: Route =
    recordTopic && record
      ? { topic: recordTopic, lens: savedRoute.lens, item: record.id }
      : savedRoute;
  const expansion = useTimelineExpansion(route);
  const [searchOpen, setSearchOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [shareStatus, setShareStatus] = useState("");
  const [shareFallback, setShareFallback] = useState(false);
  const shareInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const searchShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (!aboutOpen && !shareFallback) setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", searchShortcut);
    return () => window.removeEventListener("keydown", searchShortcut);
  }, [aboutOpen, shareFallback]);
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
      await navigator.clipboard.writeText(
        `${window.location.href.split("#")[0]}${routeHref(route)}`,
      );
      setShareStatus("Link copied");
    } catch {
      setShareFallback(true);
    }
  };
  return (
    <div className="app timeline-app">
      <button
        type="button"
        className="skip-link"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
      >
        Skip to journey content
      </button>
      <header className="site-header">
        <div className="header-inner">
          <JourneyLink
            to={{ topic: "journey", lens: "process" }}
            navigate={navigate}
            className="brand"
          >
            <span className="brand-mark">
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
              <span className="brand-divider">/</span>
              <span className="brand-name">Installation journey</span>
            </span>
          </JourneyLink>
          <nav className="header-actions" aria-label="Explorer tools">
            <button
              type="button"
              className="search-trigger"
              aria-label="Search the journey"
              onClick={() => setSearchOpen(true)}
            >
              <Icon name="search" size={17} />
              <span>Search the journey</span>
              <kbd>⌘ / Ctrl K</kbd>
            </button>
            <button
              type="button"
              className="icon-button about-trigger"
              onClick={() => setAboutOpen(true)}
              aria-label="About this journey"
            >
              <Icon name="info" size={20} />
            </button>
            <button
              type="button"
              className="share-button"
              aria-label="Share this view"
              onClick={copyLink}
            >
              <Icon name="link" size={17} />
              <span>Share view</span>
            </button>
          </nav>
        </div>
      </header>
      <main id="main-content" className="main-shell" tabIndex={-1}>
        <section className="timeline-hero">
          <span className="eyebrow hero-eyebrow">
            <span />
            The customer experience
          </span>
          <h1 id="page-title" tabIndex={-1}>
            OpenShift on bare metal.
            <br />
            <span>The installation journey.</span>
          </h1>
          <p>
            Follow a customer from planning to useful workloads and operational
            handover on bare metal. Expand a step for decisions, prerequisites,
            and details for the applicable installation method.
          </p>
        </section>
        <div className="timeline-controls">
          <LensTabs route={route} navigate={navigate} />
        </div>
        <div
          id="perspective-content"
          role="tabpanel"
          aria-labelledby={`tab-${route.lens}`}
          className="perspective-panel"
        >
          <Timeline route={route} navigate={navigate} expansion={expansion} />
        </div>
      </main>
      <footer className="site-footer">
        <div>
          <span className="footer-mark">OpenShift installation journey</span>
          <span>Research snapshot · Sep–Oct 2026</span>
        </div>
        <div>
          <span className="internal-label">Internal use</span>
        </div>
      </footer>
      <div
        className={`toast ${shareStatus ? "visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        {shareStatus && (
          <>
            <Icon name="check" size={17} />
            {shareStatus}
          </>
        )}
      </div>
      {searchOpen && (
        <Search navigate={navigate} onClose={() => setSearchOpen(false)} />
      )}
      {aboutOpen && <About onClose={() => setAboutOpen(false)} />}
      {shareFallback && (
        <Modal title="Share this view" onClose={() => setShareFallback(false)}>
          <div className="share-fallback">
            <p>Copy this link to open the same topic and perspective.</p>
            <input
              ref={shareInput}
              aria-label="Link to this view"
              value={`${window.location.href.split("#")[0]}${routeHref(route)}`}
              readOnly
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
