import { type ReactNode, useEffect, useState } from "react";
import { type Phase, phases } from "./model";
import {
  type Answers,
  type CheckId,
  checkNames,
  checkState,
  commands,
  currentRequest,
  initialPreparation,
  missingAnswers,
  type PreparationAction,
  type PreparationState,
  preparationStatus,
  requestText,
  sameInputs,
  updatePreparation,
} from "./prerequisite-model";
import "./prerequisite-story.css";

const moments = [
  {
    title: "Discover",
    heading: "Start with a plan, not a blank checklist.",
    help: "A recommended path brings the work and its owners together. Change only what differs at your site.",
    benefit:
      "The customer gets a starting point and an explanation for every task.",
  },
  {
    title: "Save & resume",
    heading: "Keep what you know. See what is missing.",
    help: "Save the incomplete plan, leave it, then resume where you stopped. You do not need every answer to make progress.",
    benefit:
      "No need to reconstruct the plan or remember which answers are missing.",
  },
  {
    title: "Request DNS",
    heading: "Give IT a request they can act on.",
    help: "The journey turns your answers into record names, expected addresses, scope and acceptance checks.",
    benefit:
      "The customer does not have to translate installation requirements into a DNS ticket.",
  },
  {
    title: "Track the handoff",
    heading: "Make the wait visible and owned.",
    help: "Keep the responsible team and request reference beside the work. A report of completion is the next handoff.",
    benefit:
      "The customer can see who has the next action without piecing together messages.",
  },
  {
    title: "Verify",
    heading: "A completion report starts the check.",
    help: "Verify the expected DNS answers from the network that will use them. Keep the report and the evidence separate.",
    benefit:
      "The journey supplies the check, the right context and a manual path when needed.",
  },
  {
    title: "Change & recheck",
    heading: "Change one input. See the consequences.",
    help: "Earlier results stay in history. Only affected checks and their dependents need to run again.",
    benefit:
      "The customer does not have to work out which results are still trustworthy.",
  },
];
const checks: CheckId[] = ["api", "apps", "client"];

function Results({ state }: { state: PreparationState }) {
  const latest = state.evidence.at(-1);
  const unavailable = state.observation.kind === "unavailable";
  return (
    <section className="pg-results" aria-label="Verification results">
      <h3>What the evidence establishes</h3>
      {checks.map((check) => {
        const result = checkState(state, check);
        return (
          <div className="pg-result-row" key={check} data-check={check}>
            <span>
              <strong>{checkNames[check]}</strong>
              <small>
                {check === "api"
                  ? `api.edge-east.${state.answers.baseDomain} → ${state.answers.api || "address needed"}`
                  : check === "apps"
                    ? `guidance-check.apps.edge-east.${state.answers.baseDomain} → ${state.answers.ingress}`
                    : "Both expected client answers must match the current inputs."}
              </small>
            </span>
            <span
              className={`sp-status ${unavailable ? "sp-waiting" : result === "Passed" ? "sp-success" : result === "Failed" ? "sp-failed" : "sp-waiting"}`}
            >
              {unavailable && latest ? `Last known: ${result}` : result}
            </span>
          </div>
        );
      })}
      <div className="pg-result-row" data-check="inventory">
        <span>
          <strong>Host inventory check</strong>
          <small>
            Five host identities accounted for · earlier illustrative evidence
          </small>
        </span>
        <span className="sp-status sp-success">Passed · unaffected</span>
      </div>
      {latest && (
        <p className="pg-caption">
          Latest attempt #{latest.id} ·{" "}
          {latest.method === "automatic"
            ? "Automatic probe"
            : "Reviewed local command output"}{" "}
          · {latest.at}. Source: <code>admin-probe-01</code>, admin/client
          network, resolver <code>{latest.inputs.resolver}</code>. Recorded API
          address: <code>{latest.inputs.api}</code>.
        </p>
      )}
      {latest && (
        <details className="sp-disclosure">
          <summary>Inspect the latest illustrative output</summary>
          <pre>{`Attempt #${latest.id} · ${latest.at}\nSource: admin-probe-01 · admin/client network\nResolver: ${latest.inputs.resolver}\napi.edge-east.${latest.inputs.baseDomain} A (UDP + TCP): ${latest.outcome === "passed" ? latest.inputs.api : "NXDOMAIN (unexpected)"}\nguidance-check.apps.edge-east.${latest.inputs.baseDomain} A (UDP + TCP): ${latest.outcome === "passed" ? latest.inputs.ingress : "NXDOMAIN (unexpected)"}`}</pre>
          {unavailable && (
            <p>
              Observation is unavailable now. This earlier output is retained as
              last known evidence, not a current observation.
            </p>
          )}
        </details>
      )}
      <p className="pg-caption">
        This scope covers client DNS answers only. It does not prove target-host
        DNS, API connectivity, application availability or infrastructure
        readiness.
      </p>
    </section>
  );
}

/** Development-only guided prerequisite story; all execution is simulated. */
export function PrerequisiteStory({
  embedded = false,
  onState,
  detailLink,
  selectedStep,
  onStep,
  onContinue,
  readOnly = false,
}: {
  embedded?: boolean;
  onState?: (state: PreparationState) => void;
  detailLink?: ReactNode;
  selectedStep?: number;
  onStep?: (step: number) => void;
  onContinue?: () => void;
  readOnly?: boolean;
} = {}) {
  const [state, setState] = useState(initialPreparation);
  const [draft, setDraft] = useState<Answers>(state.answers);
  const [saved, setSaved] = useState<PreparationState | null>(null);
  const [paused, setPaused] = useState(false);
  const [resumed, setResumed] = useState(false);
  const [phase, setPhase] = useState<Phase>("pre");
  const [localStep, setLocalStep] = useState(0);
  const step = selectedStep ?? localStep;
  const setStep = onStep ?? setLocalStep;
  useEffect(() => {
    onState?.(state);
  }, [state, onState]);
  const [reference, setReference] = useState("");
  const [requestDraft, setRequestDraft] = useState<string | null>(null);
  const [manualOutput, setManualOutput] = useState(false);
  const [notice, setNotice] = useState("");
  const dispatch = (action: PreparationAction) =>
    setState((previous) => updatePreparation(previous, action));
  const status = preparationStatus(state);
  const request = currentRequest(state);
  const latestRequest = state.requests.at(-1);
  const missing = missingAnswers(draft);
  const running = state.observation.kind === "running";
  const rechecked =
    checkState(state, "client") === "Passed" &&
    state.evidence.some(
      (evidence) => !sameInputs(evidence.inputs, state.answers),
    );
  const moment = moments[step] ?? moments[0];
  useEffect(() => {
    if (state.observation.kind !== "running") return;
    const timer = window.setTimeout(
      () =>
        setState((previous) =>
          updatePreparation(previous, {
            kind: "finish",
            method: "automatic",
            outcome: "passed",
          }),
        ),
      1100,
    );
    return () => window.clearTimeout(timer);
  }, [state.observation]);
  const moveStep = (next: number) => {
    setStep(next);
    setNotice("");
    requestAnimationFrame(() =>
      document.getElementById("pg-moment-title")?.focus(),
    );
  };
  const saveAnswers = () => {
    const updated = updatePreparation(state, {
      kind: "answers",
      answers: draft,
    });
    setState(updated);
    setRequestDraft(null);
    setManualOutput(false);
    return updated;
  };
  const draftRequest = () => {
    const updated = saveAnswers();
    setRequestDraft(requestText(updated.answers));
    setReference("");
    moveStep(2);
  };
  const fields = (
    <div className="pg-fields">
      <label>
        Base domain
        <input
          value={draft.baseDomain}
          onChange={(event) =>
            setDraft({ ...draft, baseDomain: event.target.value.trim() })
          }
        />
        <small>
          Cluster name stays <strong>edge-east</strong>. We construct the record
          names.
        </small>
      </label>
      <label>
        API virtual IP address
        <input
          value={draft.api}
          placeholder="Still needed · ask IPAM"
          aria-invalid={
            !draft.api || missing.includes("API virtual IP address")
          }
          onChange={(event) =>
            setDraft({ ...draft, api: event.target.value.trim() })
          }
        />
        <small>Use an address reserved by your IPAM team.</small>
      </label>
      <label>
        Ingress virtual IP address
        <input
          value={draft.ingress}
          onChange={(event) =>
            setDraft({ ...draft, ingress: event.target.value.trim() })
          }
        />
        <small>Illustrative reserved address for application clients.</small>
      </label>
      <label>
        DNS resolver address
        <input
          value={draft.resolver}
          onChange={(event) =>
            setDraft({ ...draft, resolver: event.target.value.trim() })
          }
        />
        <small>
          The resolver used by this example’s admin and application clients.
        </small>
      </label>
      <label>
        Responsible IT team
        <input
          value={draft.owner}
          onChange={(event) =>
            setDraft({ ...draft, owner: event.target.value })
          }
        />
        <small>
          Suggested owner. Changing it does not invalidate technical checks.
        </small>
      </label>
    </div>
  );
  const Root = embedded ? "div" : "main";
  return (
    <Root
      id={embedded ? undefined : "main-content"}
      className={
        embedded
          ? "prerequisite-story cs-prerequisites"
          : "solution-prototype prerequisite-story"
      }
      tabIndex={-1}
    >
      {!embedded && (
        <>
          <div className="sp-review-banner">
            <span>
              <strong>Prerequisite story</strong> · Interactive proposal ·
              Illustrative data
            </span>
            <button
              type="button"
              onClick={() => {
                setState(initialPreparation());
                setDraft(initialPreparation().answers);
                setSaved(null);
                setPaused(false);
                setResumed(false);
                setPhase("pre");
                setStep(0);
                setReference("");
                setRequestDraft(null);
                setManualOutput(false);
                setNotice("");
              }}
            >
              Reset example
            </button>
          </div>
          <header className="sp-page-intro">
            <div>
              <span className="sp-label">
                Proposed solution · Installation journey
              </span>
              <h1 id="solution-prototype-title" tabIndex={-1}>
                Less to figure out. A clear next step.
              </h1>
              <p>
                Explore how guided prerequisites carry a customer from missing
                answers to an owned request and scoped evidence.
              </p>
            </div>
            <div className="sp-variant-note">
              <span className="sp-label">Review question</span>
              <p>
                Does this sequence reduce the customer’s work while keeping
                readiness honest?
              </p>
            </div>
          </header>
          <div className="sp-foundation">
            <strong>Agent-based foundation</strong>
            <span>
              A repeatable host plan and installation inputs let the proposed
              hub prepare and coordinate the journey. This chapter focuses on
              the work before installation.
            </span>
          </div>
          <section
            className="sp-cluster-strip"
            aria-label="Shared example state"
          >
            <div>
              <span className="sp-label">Illustrative cluster · J-042</span>
              <strong>
                edge-east
                <span className="sp-cluster-domain">
                  .{state.answers.baseDomain}
                </span>
              </strong>
              <span>
                5 bare-metal hosts · 3 control plane + 2 workers · Platform team
              </span>
              <span>
                <b>Cluster installation:</b> Not started
              </span>
            </div>
            <div className="sp-overall" aria-live="polite">
              <span className="sp-label">Journey status</span>
              <span
                className={`sp-status sp-${status.tone}`}
                data-journey-status
              >
                {status.label}
              </span>
              <p>{status.detail}</p>
            </div>
          </section>
          <div className="sp-phase-state">
            <span>
              <strong>Scope</strong> Managed bare-metal example · client DNS
              publication
            </span>
            <span>
              <strong>Preview</strong> No live DNS checks or external tickets ·
              state resets on reload
            </span>
          </div>
        </>
      )}
      <div className={embedded ? "cs-pre-body" : "sp-story"}>
        {!embedded && (
          <aside className="sp-rail">
            <span className="sp-label">One journey · Three chapters</span>
            <nav aria-label="Story phases">
              {phases.map((item, index) => (
                <button
                  type="button"
                  key={item.key}
                  aria-current={phase === item.key ? "step" : undefined}
                  onClick={() => setPhase(item.key)}
                >
                  <span className="sp-phase-number">0{index + 1}</span>
                  <span>
                    <strong>{item.name}</strong>
                    <small>
                      {item.key === "pre"
                        ? "Focused prerequisite story"
                        : "Not started"}
                    </small>
                  </span>
                  <span aria-hidden="true">→</span>
                </button>
              ))}
            </nav>
            <div className="sp-rail-note">
              <strong>The thread to follow</strong>
              <p>Saved intent → coordinated work → scoped evidence.</p>
              <p>Reading another chapter never advances execution.</p>
              <a href="#/prerequisites/dns" target="_blank" rel="noreferrer">
                Open prerequisite detail ↗
              </a>
            </div>
          </aside>
        )}
        <article className={embedded ? "cs-pre-chapter" : "sp-story-chapter"}>
          {phase !== "pre" ? (
            <div className="sp-phase-content">
              <span className="sp-label">
                {phase === "install" ? "Installation" : "Post-installation"}
              </span>
              <h2>
                {phase === "install"
                  ? "The saved plan continues into installation."
                  : "Infrastructure readiness comes later."}
              </h2>
              <p>
                {phase === "install"
                  ? "Agent media, boot and installer observation use the saved plan. This focused preview stops at prerequisite guidance; no installation has run."
                  : "Required Operators and smoke tests still need to pass after base installation. A DNS pass does not make the installation journey Complete."}
              </p>
              <div className="sp-result sp-waiting">
                <strong>Cluster installation: Not started</strong>
                <p>
                  Your prerequisite answers, requests and evidence are retained
                  as you read.
                </p>
              </div>
              <button type="button" onClick={() => setPhase("pre")}>
                Return to prerequisite story
              </button>
            </div>
          ) : (
            <>
              <span className="sp-label">
                Pre-installation · {step + 1} of 6
              </span>
              <nav
                className="pg-moments"
                aria-label="Prerequisite story moments"
              >
                {moments.map((item, index) => (
                  <button
                    type="button"
                    key={item.title}
                    aria-current={step === index ? "step" : undefined}
                    disabled={paused || running}
                    onClick={() => moveStep(index)}
                  >
                    <span>{index + 1}</span>
                    {item.title}
                  </button>
                ))}
              </nav>
              <h2 id="pg-moment-title" tabIndex={-1}>
                {moment?.heading}
              </h2>
              <p className="sp-lead">{moment?.help}</p>
              <div className="pg-benefit">
                <strong>Work the journey takes on</strong>
                <p>{moment?.benefit}</p>
              </div>
              <fieldset
                className="sp-phase-content pg-step-body"
                disabled={readOnly}
              >
                <legend className="cs-sr-only">Prerequisite actions</legend>
                {step === 0 && (
                  <>
                    <div className="pg-recommended">
                      <span className="sp-label">
                        Recommended starting point
                      </span>
                      <strong>
                        Five hosts · DHCP reservations · managed VIPs · site DNS
                        for clients
                      </strong>
                      <p>
                        The host plan and likely owners are supplied. Confirm
                        the site-specific values instead of designing a
                        checklist from scratch.
                      </p>
                    </div>
                    <div className="sp-task-list">
                      {[
                        [
                          "Cluster identity & host plan",
                          "Platform team",
                          "edge-east · cp-0, cp-1, cp-2, worker-0, worker-1",
                        ],
                        [
                          draft.addressing === "dhcp"
                            ? "Reserve host addresses"
                            : "Supply static host configuration",
                          "Infrastructure / IPAM team",
                          draft.addressing === "dhcp"
                            ? "Match five MAC addresses to stable leases; supply gateway, DNS and time."
                            : "Add an address, prefix, gateway, DNS and NIC mapping for each host.",
                        ],
                        [
                          "Prepare client DNS",
                          draft.owner || "Owner needed",
                          "Generate API and application record requests from your answers.",
                        ],
                        [
                          "Confirm content and host access",
                          "Platform / Infrastructure teams",
                          "Keep registry, credentials and boot-access work with the same journey.",
                        ],
                        ...(draft.changeApproval
                          ? [
                              [
                                "Site change approval",
                                "Change manager",
                                "Added by you · track the approved window before installation.",
                              ],
                            ]
                          : []),
                      ].map(([title, owner, detail]) => (
                        <div className="sp-task" key={title}>
                          <span
                            className="sp-task-icon sp-active"
                            aria-hidden="true"
                          >
                            →
                          </span>
                          <div>
                            <strong>{title}</strong>
                            <p>{detail}</p>
                          </div>
                          <span className="sp-owner">{owner}</span>
                        </div>
                      ))}
                    </div>
                    <details className="sp-disclosure">
                      <summary>Customize for this site</summary>
                      <div className="pg-fields">
                        <label>
                          Host addressing
                          <select
                            value={draft.addressing}
                            onChange={(event) => {
                              const addressing =
                                event.target.value === "static"
                                  ? "static"
                                  : "dhcp";
                              const answers: Answers = { ...draft, addressing };
                              setDraft(answers);
                              dispatch({ kind: "answers", answers });
                            }}
                          >
                            <option value="dhcp">
                              DHCP reservations · recommended for this example
                            </option>
                            <option value="static">
                              Static configuration · supply per-host settings
                            </option>
                          </select>
                        </label>
                        <label className="pg-checkbox">
                          <input
                            type="checkbox"
                            checked={draft.changeApproval}
                            onChange={(event) => {
                              const answers = {
                                ...draft,
                                changeApproval: event.target.checked,
                              };
                              setDraft(answers);
                              dispatch({ kind: "answers", answers });
                            }}
                          />
                          Include a site change approval
                        </label>
                      </div>
                      <p>
                        Required work remains in the plan. Customization changes
                        the instructions and adds the relevant handoff.
                      </p>
                    </details>
                    <button
                      type="button"
                      className="sp-primary"
                      onClick={() => moveStep(1)}
                    >
                      Use this checklist →
                    </button>
                  </>
                )}
                {step === 1 &&
                  (paused ? (
                    <div className="sp-action-panel">
                      <span className="sp-label">Saved in this preview</span>
                      <h3>Come back with the missing answer.</h3>
                      <p>
                        Your cluster, checklist, owner and supplied values are
                        retained.{" "}
                        {missingAnswers(saved?.answers ?? state.answers).join(
                          "; ",
                        ) || "All request inputs captured."}
                      </p>
                      <button
                        type="button"
                        className="sp-primary"
                        onClick={() => {
                          if (saved) {
                            setState(saved);
                            setDraft(saved.answers);
                          }
                          setPaused(false);
                          setResumed(true);
                        }}
                      >
                        Resume saved journey
                      </button>
                      <small>
                        This simulates leaving and returning within the open
                        preview. Reload starts a new example.
                      </small>
                    </div>
                  ) : (
                    <>
                      {resumed && (
                        <div className="sp-result sp-active">
                          <strong>
                            Welcome back. Your answers are still here.
                          </strong>
                          <p>
                            {missing.length
                              ? `Still needed: ${missing.join("; ")}.`
                              : "The inputs for this DNS request are captured."}
                          </p>
                        </div>
                      )}
                      {fields}
                      <div className="pg-missing" aria-live="polite">
                        <strong>
                          {missing.length
                            ? "Still needed"
                            : "Request inputs captured"}
                        </strong>
                        <p>
                          {missing.length
                            ? missing.join(" · ")
                            : "The next action is to prepare a request for the responsible IT team."}
                        </p>
                      </div>
                      <div className="sp-actions">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = updatePreparation(
                              updatePreparation(state, {
                                kind: "answers",
                                answers: draft,
                              }),
                              { kind: "saved" },
                            );
                            setState(updated);
                            setSaved(updated);
                            setPaused(true);
                          }}
                        >
                          Save and leave
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setDraft({ ...draft, api: "10.20.30.10" })
                          }
                        >
                          Use example IPAM answer
                        </button>
                        <button
                          type="button"
                          className="sp-primary"
                          disabled={missing.length > 0}
                          onClick={draftRequest}
                        >
                          Save answers & draft DNS request →
                        </button>
                      </div>
                      <small>
                        “Use example IPAM answer” supplies the illustrative
                        reserved API address, 10.20.30.10. Real addresses come
                        from your site’s IPAM team.
                      </small>
                    </>
                  ))}
                {step === 2 &&
                  (missingAnswers(state.answers).length ? (
                    <div className="sp-action-panel">
                      <strong>
                        A useful request needs the missing values.
                      </strong>
                      <p>{missingAnswers(state.answers).join(" · ")}</p>
                      <button type="button" onClick={() => moveStep(1)}>
                        Return to answers
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="pg-recommended">
                        <strong>Prepared for {state.answers.owner}</strong>
                        <p>
                          Record names, values, client context and acceptance
                          criteria are filled from the saved plan. Share through
                          your existing process.
                        </p>
                      </div>
                      <label className="pg-request-label">
                        Actionable DNS request
                        <textarea
                          id="pg-request"
                          readOnly
                          rows={13}
                          value={requestDraft ?? requestText(state.answers)}
                        />
                      </label>
                      <div className="sp-actions">
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(
                                requestDraft ?? requestText(state.answers),
                              );
                              setNotice("DNS request copied.");
                            } catch {
                              const textarea =
                                document.getElementById("pg-request");
                              if (textarea instanceof HTMLTextAreaElement) {
                                textarea.focus();
                                textarea.select();
                              }
                              setNotice(
                                "Request selected. Use your browser’s Copy command.",
                              );
                            }
                          }}
                        >
                          Copy request
                        </button>
                        <button
                          type="button"
                          className="sp-primary"
                          onClick={() => moveStep(3)}
                        >
                          Track this handoff →
                        </button>
                      </div>
                      <details className="sp-disclosure">
                        <summary>Optional: ServiceNow handoff</summary>
                        <p>
                          A future integration could create the request and
                          retain its reference and completion report. Copying
                          into an existing IT workflow works for this proposal.
                          ServiceNow is not connected in this preview.
                        </p>
                      </details>
                      <details className="sp-disclosure">
                        <summary>Why this request has this scope</summary>
                        <p>
                          This example chooses site DNS for admin and
                          application clients. It does not treat external
                          publication as a universal bootstrap requirement.
                          Managed internal DNS, upstream resolver access and
                          node identity need their own scoped checks.
                        </p>
                        {detailLink ?? (
                          <a
                            href="#/prerequisites/dns"
                            target="_blank"
                            rel="noreferrer"
                          >
                            Read the existing DNS explanation ↗
                          </a>
                        )}
                        <p>
                          <a
                            href="https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/installing_an_on-premise_cluster_with_the_agent-based_installer/installing-with-agent-based-installer"
                            target="_blank"
                            rel="noreferrer"
                          >
                            Agent-based installation and monitoring
                            prerequisites ↗
                          </a>
                        </p>
                      </details>
                    </>
                  ))}
                {step === 3 && (
                  <>
                    <div className="pg-handoff">
                      <span className="sp-label">Responsible IT team</span>
                      <strong>{state.answers.owner || "Owner needed"}</strong>
                      <p>
                        Publish client-visible records and return the request
                        reference and a completion report.
                      </p>
                    </div>
                    {request ? (
                      <>
                        <div
                          className={`sp-result ${request.report ? "sp-active" : "sp-waiting"}`}
                        >
                          <strong>
                            {request.report
                              ? "Completion reported · verification pending"
                              : `Waiting on ${state.answers.owner}`}
                          </strong>
                          <p>
                            Request <b>{request.reference}</b> ·{" "}
                            {request.report
                              ? `${request.report.by} · ${request.report.at}`
                              : "DNS publication requested. No check has passed yet."}
                          </p>
                        </div>
                        {request.report ? (
                          <button
                            type="button"
                            className="sp-primary"
                            onClick={() => moveStep(4)}
                          >
                            Verify reported work →
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="sp-primary"
                            onClick={() => {
                              dispatch({ kind: "reported" });
                              moveStep(4);
                            }}
                          >
                            Receive example completion report →
                          </button>
                        )}
                        <small>
                          The simulated report says the records were published
                          and the external request closed. That alone
                          establishes no technical readiness.
                        </small>
                      </>
                    ) : (
                      <>
                        {latestRequest && (
                          <div className="sp-result sp-waiting">
                            <strong>
                              Earlier request retained:{" "}
                              {latestRequest.reference}
                            </strong>
                            <p>
                              It used different DNS inputs. Record the updated
                              handoff before verifying the changed plan.
                            </p>
                          </div>
                        )}
                        <label className="pg-single-field">
                          Request reference
                          <input
                            value={reference}
                            placeholder="e.g. CHG-1042"
                            onChange={(event) =>
                              setReference(event.target.value)
                            }
                          />
                          <small>
                            Use a ticket, change request or another traceable
                            reference.
                          </small>
                        </label>
                        <div className="sp-actions">
                          <button
                            type="button"
                            onClick={() =>
                              setReference(
                                `CHG-${1042 + state.requests.length}`,
                              )
                            }
                          >
                            Use example reference
                          </button>
                          <button
                            type="button"
                            className="sp-primary"
                            disabled={
                              !reference.trim() ||
                              missingAnswers(state.answers).length > 0
                            }
                            onClick={() =>
                              dispatch({ kind: "requested", reference })
                            }
                          >
                            Simulate handoff & track request
                          </button>
                        </div>
                        <small>
                          This records an illustrative handoff in the preview.
                          No message is sent and no external ticket is created.
                        </small>
                      </>
                    )}
                  </>
                )}
                {step === 4 && (
                  <>
                    <div className="pg-evidence-pair">
                      <div>
                        <span className="sp-label">Reported completion</span>
                        <strong>
                          {request?.report
                            ? `${request.report.by}: records published`
                            : "No current completion report"}
                        </strong>
                        <p>
                          {request?.report
                            ? `${request.reference} · ${request.report.at}`
                            : "First record the request and receive the owner’s report."}
                        </p>
                      </div>
                      <div>
                        <span className="sp-label">Verified readiness</span>
                        <strong>
                          {state.observation.kind === "unavailable"
                            ? "Current status unknown · last evidence retained"
                            : checkState(state, "client") === "Passed"
                              ? "Client DNS checks passed"
                              : "Current client DNS evidence needed"}
                        </strong>
                        <p>
                          Scope, inputs and source are recorded with each
                          attempt.
                        </p>
                      </div>
                    </div>
                    {!request?.report ? (
                      <button type="button" onClick={() => moveStep(3)}>
                        Return to the handoff
                      </button>
                    ) : (
                      <>
                        <div className="pg-recommended">
                          <strong>Recommended check context</strong>
                          <p>
                            <code>admin-probe-01</code> · admin/client network ·
                            resolver <code>{state.answers.resolver}</code>.
                            Check API and a fresh application name over UDP and
                            TCP DNS, against the saved addresses.
                          </p>
                        </div>
                        {state.observation.kind === "unavailable" ? (
                          <div className="sp-action-panel">
                            <strong>
                              Automatic verification is unavailable here.
                            </strong>
                            <p>
                              The hub cannot reach this client network. Ask{" "}
                              {state.answers.owner} to run the commands on the
                              named probe or a host in the same DNS view.
                              Preserve output, source, resolver and time. Keep
                              the status unknown until evidence can be reviewed.
                            </p>
                            <pre>{commands(state.answers)}</pre>
                            <p>
                              Expected API answer:{" "}
                              <code>{state.answers.api}</code>. Expected
                              application answer:{" "}
                              <code>{state.answers.ingress}</code>. Both
                              transports must agree; an empty or different
                              answer needs investigation.
                            </p>
                            <button
                              type="button"
                              onClick={() => setManualOutput(true)}
                            >
                              Load example local check output
                            </button>
                            {manualOutput && (
                              <>
                                <pre>{`Source: admin-probe-01 · admin/client network\nResolver: ${state.answers.resolver} · 04 Nov 10:20 UTC (example)\nAPI A / UDP: ${state.answers.api}\nAPI A / TCP: ${state.answers.api}\nguidance-check.apps A / UDP: ${state.answers.ingress}\nguidance-check.apps A / TCP: ${state.answers.ingress}\nExpected answers matched in all four lookups.`}</pre>
                                <button
                                  type="button"
                                  className="sp-primary"
                                  onClick={() => {
                                    dispatch({
                                      kind: "finish",
                                      method: "manual",
                                      outcome: "passed",
                                    });
                                    setManualOutput(false);
                                  }}
                                >
                                  Record reviewed example evidence
                                </button>
                                <small>
                                  This records the displayed illustrative
                                  command evidence, separately from the IT
                                  completion report.
                                </small>
                              </>
                            )}
                          </div>
                        ) : (
                          <div className="sp-actions">
                            <button
                              type="button"
                              className="sp-primary"
                              disabled={running}
                              onClick={() => dispatch({ kind: "start" })}
                            >
                              {running
                                ? "Checking from client network…"
                                : state.evidence.length
                                  ? "Retry example DNS verification"
                                  : "Run example DNS verification"}
                            </button>
                            <button
                              type="button"
                              disabled={running}
                              onClick={() => dispatch({ kind: "unavailable" })}
                            >
                              Automatic check unavailable
                            </button>
                          </div>
                        )}
                        <details className="sp-disclosure">
                          <summary>Explore an unexpected DNS answer</summary>
                          <p>
                            A mismatch is an observed failure. It names the
                            failed work and preserves previous attempts; the
                            customer can ask the owner to repair it and retry.
                          </p>
                          <button
                            type="button"
                            disabled={running}
                            onClick={() =>
                              dispatch({
                                kind: "finish",
                                method: "automatic",
                                outcome: "failed",
                              })
                            }
                          >
                            Simulate unexpected DNS answers
                          </button>
                        </details>
                      </>
                    )}
                    <Results state={state} />
                    {state.evidence.length > 0 && (
                      <button
                        type="button"
                        className="sp-primary"
                        disabled={running}
                        onClick={() => {
                          if (rechecked && onContinue) onContinue();
                          else {
                            setDraft(state.answers);
                            moveStep(5);
                          }
                        }}
                      >
                        {rechecked && onContinue
                          ? "Continue to installation →"
                          : "Change a DNS input →"}
                      </button>
                    )}
                  </>
                )}
                {step === 5 && (
                  <>
                    {!state.evidence.length && (
                      <div className="sp-result sp-waiting">
                        <strong>
                          Run a check to see evidence become outdated.
                        </strong>
                        <p>
                          Edits are allowed now, but there are no earlier DNS
                          results to invalidate yet.
                        </p>
                        <button type="button" onClick={() => moveStep(4)}>
                          Go to verification
                        </button>
                      </div>
                    )}
                    {fields}
                    <div className="sp-actions">
                      <button
                        type="button"
                        disabled={running}
                        onClick={() =>
                          setDraft({
                            ...draft,
                            api:
                              draft.api === "10.20.30.12"
                                ? "10.20.30.13"
                                : "10.20.30.12",
                          })
                        }
                      >
                        Use changed example API address
                      </button>
                      <button
                        type="button"
                        className="sp-primary"
                        disabled={running || missing.length > 0}
                        onClick={() => {
                          saveAnswers();
                          setNotice(
                            "Changes saved. The results below show which evidence still applies.",
                          );
                        }}
                      >
                        Save changes & show impact
                      </button>
                    </div>
                    {missing.length > 0 && (
                      <p className="pg-missing">
                        Still needed: {missing.join(" · ")}
                      </p>
                    )}
                    <Results state={state} />
                    <p>
                      An API address change affects the API lookup and dependent
                      client DNS readiness. The application lookup and host
                      inventory remain usable. A resolver or domain change
                      affects both DNS lookups. Changing only the owner leaves
                      technical evidence intact.
                    </p>
                    {checkState(state, "client") === "Needs recheck" && (
                      <button
                        type="button"
                        className="sp-primary"
                        onClick={() => {
                          setDraft(state.answers);
                          setRequestDraft(requestText(state.answers));
                          setReference("");
                          moveStep(2);
                        }}
                      >
                        Prepare updated DNS request →
                      </button>
                    )}
                  </>
                )}
              </fieldset>
              <nav
                className="sp-chapter-nav"
                aria-label="Read prerequisite story"
              >
                <button
                  type="button"
                  disabled={step === 0 || paused || running}
                  onClick={() => moveStep(step - 1)}
                >
                  ← Previous moment
                </button>
                <button
                  type="button"
                  disabled={step === 5 || paused || running}
                  onClick={() => moveStep(step + 1)}
                >
                  Read next moment →
                </button>
              </nav>
            </>
          )}
          <p className="pg-notice" role="status">
            {notice}
          </p>
        </article>
      </div>
      <details className="sp-disclosure pg-record">
        <summary>Inspect saved answers, requests & evidence history</summary>
        <dl>
          <div>
            <dt>Journey</dt>
            <dd>J-042 · edge-east · prerequisite record</dd>
          </div>
          <div>
            <dt>Saved plan</dt>
            <dd>
              {state.answers.addressing === "dhcp"
                ? "DHCP reservations"
                : "Static host configuration"}
              {state.answers.changeApproval
                ? " · Site change approval added"
                : " · No extra change approval"}
            </dd>
          </div>
          <div>
            <dt>Saved DNS answers</dt>
            <dd>
              API: {state.answers.api || "Missing"} · Ingress:{" "}
              {state.answers.ingress} · Resolver: {state.answers.resolver}
            </dd>
          </div>
          <div>
            <dt>Owner / request</dt>
            <dd>
              {state.answers.owner || "Missing"} ·{" "}
              {latestRequest?.reference ?? "Not requested"}
            </dd>
          </div>
        </dl>
        {state.requests.map((item, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: Request snapshots are append-only and never reordered.
          <details key={`${item.reference}-${index}`}>
            <summary>
              Request {item.reference} ·{" "}
              {item.report ? "completion reported" : "awaiting report"}
            </summary>
            <pre>{item.body}</pre>
          </details>
        ))}
        {state.evidence.map((item) => (
          <div className="pg-history-entry" key={item.id}>
            <strong>
              Attempt #{item.id} · {item.outcome} · {item.at}
            </strong>
            <p>
              {item.method === "manual"
                ? "Reviewed local output"
                : "Automatic probe"}{" "}
              · admin-probe-01 · resolver {item.inputs.resolver} · API{" "}
              {item.inputs.api} · ingress {item.inputs.ingress} · edge-east.
              {item.inputs.baseDomain}
            </p>
          </div>
        ))}
        <ol>
          {state.history.map((item, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: History is append-only and never reordered.
            <li key={`${index}-${item}`}>{item}</li>
          ))}
        </ol>
      </details>
      {!embedded && (
        <p className="sp-prototype-footnote">
          Throwaway prototype for review in the selected guided-story layout.
          Save/resume is simulated within this open preview; refresh or leaving
          the page resets it. The checklist, requests, reports and execution
          results are illustrative. Final-page placement and production storage
          remain undecided.
        </p>
      )}
    </Root>
  );
}
