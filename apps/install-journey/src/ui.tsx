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
  lenses,
  opportunities,
  opportunitiesFor,
  phaseIds,
  problems,
  problemsFor,
  routeHref,
  searchJourney,
  topicById,
} from "./catalog";
import { Icon, PhaseIllustration } from "./icons";
import type { Opportunity, Problem, Route, Topic } from "./model";
import { useNavigation } from "./navigation";

type Navigate = (route: Route, preserve?: boolean) => void;
// Keep expanded lists available when browser Back restores a previously opened record.
const recordLimits = new Map<string, number>();
const phaseNames = ["Pre-installation", "Installation", "Post-installation"];
const phaseOutcomes = [
  "Ready to begin",
  "Base cluster installed",
  "Workload usable & readiness demonstrated",
];
const phasePreview = [
  [
    "Deployment choices & feasibility",
    "Infrastructure, content & media",
    "Owners & verified prerequisites",
  ],
  [
    "Host installation & bootstrap",
    "Progress & diagnostic evidence",
    "Correction, retry & completion",
  ],
  [
    "Storage, networking & access",
    "First workload & readiness",
    "Operational handover & continuity",
  ],
];

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
          This map brings together installation explanations, reported customer
          difficulties and possible improvements. Start with the whole journey,
          then open a phase or topic to reveal more detail.
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
          Historical reports, adjacent platforms, lab accounts and acceptance
          requirements retain their labels. The corpus is particularly rich in
          virtualization readiness; it does not establish the needs of every
          workload. A research gap does not mean the workflow has no problems.
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
                  topic: route.topic,
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
                  topic: route.topic,
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
      <span className="perspective-hint">One journey. Three perspectives.</span>
    </div>
  );
}

function PhaseStrip({
  topic,
  route,
  navigate,
}: {
  topic: Topic;
  route: Route;
  navigate: Navigate;
}) {
  return (
    <nav className="phase-strip" aria-label="Installation phases">
      <JourneyLink
        to={{ topic: "journey", lens: route.lens }}
        navigate={navigate}
        className="all-phases"
        label="Full journey"
      >
        <Icon name="map" size={17} />
        <span>Full journey</span>
      </JourneyLink>
      <div className="strip-phases">
        {phaseIds.map((id, index) => (
          <JourneyLink
            key={id}
            to={{ topic: id, lens: route.lens }}
            navigate={navigate}
            className={`phase-strip-link phase-${index} ${topic.phase === id ? "current-phase" : ""}`}
          >
            <span className="phase-number">0{index + 1}</span>
            <span>{phaseNames[index]}</span>
            {topic.phase === id && (
              <span className="sr-only"> — current phase</span>
            )}
          </JourneyLink>
        ))}
      </div>
    </nav>
  );
}

function Breadcrumbs({
  topic,
  route,
  navigate,
  itemTitle,
}: {
  topic: Topic;
  route: Route;
  navigate: Navigate;
  itemTitle?: string;
}) {
  const ancestors = ancestorsOf(topic.id);
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {ancestors.map((part, index) => (
          <li key={part.id}>
            {index > 0 && <Icon name="chevron" size={12} />}
            {index === ancestors.length - 1 && !itemTitle ? (
              <span aria-current="page">{part.title}</span>
            ) : (
              <JourneyLink
                to={{ topic: part.id, lens: route.lens }}
                navigate={navigate}
              >
                {part.id === "journey" ? "Journey" : part.title}
              </JourneyLink>
            )}
          </li>
        ))}
        {itemTitle && (
          <li>
            <Icon name="chevron" size={12} />
            <span aria-current="page">
              {route.lens === "problems" ? "Customer problem" : "Opportunity"}
            </span>
          </li>
        )}
      </ol>
    </nav>
  );
}

function Overview({ route, navigate }: { route: Route; navigate: Navigate }) {
  return (
    <>
      <div className="section-heading">
        <div>
          <span className="eyebrow">The customer journey</span>
          <h2>Three phases. One experience.</h2>
        </div>
        <p>
          Select a phase to explore
          <Icon name="arrow" size={16} />
        </p>
      </div>
      <div className="journey-timeline">
        {phaseIds.map((id, index) => {
          const topic = topicById.get(id);
          if (!topic) return null;
          const items =
            route.lens === "problems" ? problemsFor(id) : opportunitiesFor(id);
          return (
            <JourneyLink
              key={id}
              to={{ topic: id, lens: route.lens }}
              navigate={navigate}
              className={`phase-card phase-${index}`}
            >
              <div className="phase-card-top">
                <span className="phase-label">
                  <span className="phase-number">0{index + 1}</span>{" "}
                  {index === 0
                    ? "Prepare"
                    : index === 1
                      ? "Create"
                      : "Enable & operate"}
                </span>
                <span className="round-arrow">
                  <Icon name="arrow" size={19} />
                </span>
              </div>
              <PhaseIllustration phase={index} />
              <div className="phase-card-copy">
                <h3>{topic.title}</h3>
                <p>{topic.summary}</p>
                {route.lens === "process" ? (
                  <ul className="phase-preview">
                    {phasePreview[index]?.map((line) => (
                      <li key={line}>
                        <span />
                        {line}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="phase-findings">
                    <span className="eyebrow">
                      {route.lens === "problems"
                        ? "Customer experience"
                        : "Ideas to investigate"}
                    </span>
                    {items.slice(0, 2).map((item) => (
                      <p key={item.id}>
                        <span />
                        {item.title}
                      </p>
                    ))}
                    <small>
                      {items.length}{" "}
                      {route.lens === "problems"
                        ? "mapped problems"
                        : "candidate improvements"}{" "}
                      to explore
                    </small>
                  </div>
                )}
              </div>
              <div className="phase-milestone">
                <span className="milestone-dot" />
                <span>{phaseOutcomes[index]}</span>
              </div>
              <div className="phase-card-action">
                Explore{" "}
                {route.lens === "process"
                  ? "this phase"
                  : route.lens === "problems"
                    ? "customer problems"
                    : "opportunities"}
                <Icon name="arrow" size={17} />
              </div>
            </JourneyLink>
          );
        })}
      </div>
      <div className="timeline-note">
        <Icon name="info" size={14} />
        <span>
          A map of the work, not a duration estimate. Preparation can run in
          parallel; failures can lead back to earlier decisions.
        </span>
      </div>
    </>
  );
}

function Context({
  topic,
  navigate,
  route,
}: {
  topic: Topic;
  navigate: Navigate;
  route: Route;
}) {
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
      {topic.related && (
        <div className="related">
          <span className="eyebrow">Connected across the journey</span>
          {topic.related.map((id) => {
            const target = topicById.get(id);
            return target ? (
              <JourneyLink
                key={id}
                to={{ topic: id, lens: route.lens }}
                navigate={navigate}
              >
                <span>
                  <small>
                    {target.phase
                      ? topicById.get(target.phase)?.title
                      : "Journey"}
                  </small>
                  {target.title}
                </span>
                <Icon name="arrow" size={16} />
              </JourneyLink>
            ) : null;
          })}
        </div>
      )}
    </aside>
  );
}

function Process({
  topic,
  route,
  navigate,
}: {
  topic: Topic;
  route: Route;
  navigate: Navigate;
}) {
  const children = childrenOf(topic.id);
  return (
    <div className="process-content">
      {children.length > 0 && (
        <section>
          <div className="subheading">
            <h2>
              Explore this {topic.parent === "journey" ? "phase" : "area"}
            </h2>
            <span>{children.length} areas to understand</span>
          </div>
          <div className="topic-grid">
            {children.map((child, index) => (
              <JourneyLink
                key={child.id}
                to={{ topic: child.id, lens: route.lens }}
                navigate={navigate}
                className="topic-card"
              >
                <span className="topic-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{child.title}</h3>
                  <p>{child.summary}</p>
                </div>
                <Icon name="arrow" size={18} />
              </JourneyLink>
            ))}
          </div>
        </section>
      )}
      <section className="flow-section">
        <div className="subheading">
          <h2>
            {children.length ? "How the pieces fit" : "Understand the process"}
          </h2>
          <span>The essential sequence</span>
        </div>
        <ol className="process-flow">
          {topic.flow.map((step, index) => (
            <li key={step.title}>
              <span className="flow-number">{index + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      {topic.id === "managed-dns" && (
        <div className="scenario-note">
          <Icon name="network" />
          <div>
            <strong>One concrete network example</strong>
            <p>
              Three control-plane nodes and two workers, one machine LAN,
              managed VIPs and a full Agent ISO.
            </p>
          </div>
        </div>
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
          Explore the evidence
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
}: {
  topic: Topic;
  route: Route;
  navigate: Navigate;
}) {
  const records =
    route.lens === "problems"
      ? problemsFor(topic.id)
      : opportunitiesFor(topic.id);
  const listKey = `${topic.id}-${route.lens}`;
  const [visible, setVisible] = useState(recordLimits.get(listKey) ?? 6);
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
          {records.slice(0, visible).map((record) => (
            <JourneyLink
              key={record.id}
              to={{ ...route, item: record.id }}
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
      {records.length > visible && (
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
  const { route, navigate } = useNavigation();
  const topic = topicById.get(route.topic) ?? topicById.get("journey");
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
  if (!topic) return null;
  const home = topic.id === "journey";
  const problem =
    route.lens === "problems" && route.item
      ? problems.find((record) => record.id === route.item)
      : undefined;
  const opportunity =
    route.lens === "opportunities" && route.item
      ? opportunities.find((record) => record.id === route.item)
      : undefined;
  const record = problem ?? opportunity;
  const phaseIndex = topic.phase ? phaseIds.indexOf(topic.phase) : 0;
  const pageTitle = record?.title ?? topic.title;
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
    <div className={`app phase-${phaseIndex}`}>
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
        {!home && (
          <PhaseStrip topic={topic} route={route} navigate={navigate} />
        )}
        {home && !record ? (
          <section className="hero">
            <div>
              <span className="eyebrow hero-eyebrow">
                <span />
                Bare metal · The complete customer experience
              </span>
              <h1 id="page-title" tabIndex={-1}>
                An installed cluster.
                <br />
                <span>A whole journey behind it.</span>
              </h1>
              <p>
                Explore what customers need to prepare, create and use
                OpenShift.
                <br className="desktop-break" /> Understand the work. Find the
                friction. Discover where we can help.
              </p>
            </div>
          </section>
        ) : (
          <>
            <Breadcrumbs
              topic={topic}
              route={route}
              navigate={navigate}
              {...(record ? { itemTitle: record.title } : {})}
            />
            <section className="topic-hero">
              <div className="topic-kicker">
                <span className="phase-dot" />
                {record
                  ? route.lens === "problems"
                    ? "Customer problem"
                    : "Improvement opportunity"
                  : topic.parent === "journey"
                    ? `Phase 0${phaseIndex + 1} · ${topic.title}`
                    : topic.phase
                      ? topicById.get(topic.phase)?.title
                      : "Full journey"}
                {record && (
                  <span className="kicker-context">Within {topic.title}</span>
                )}
              </div>
              <h1 id="page-title" tabIndex={-1}>
                {pageTitle}
              </h1>
              <p>{record?.summary ?? topic.summary}</p>
              {!record && (
                <div className="customer-question">
                  <Icon name="people" size={17} />
                  <span>{topic.question}</span>
                </div>
              )}
            </section>
          </>
        )}
        <LensTabs route={route} navigate={navigate} />
        <div
          id="perspective-content"
          role="tabpanel"
          aria-labelledby={`tab-${route.lens}`}
          className="perspective-panel"
          key={`${route.topic}-${route.lens}-${route.item ?? ""}`}
        >
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
          ) : home ? (
            <Overview route={route} navigate={navigate} />
          ) : (
            <div className="content-layout">
              {route.lens === "process" ? (
                <Process topic={topic} route={route} navigate={navigate} />
              ) : (
                <RecordList topic={topic} route={route} navigate={navigate} />
              )}
              <Context topic={topic} route={route} navigate={navigate} />
            </div>
          )}
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
