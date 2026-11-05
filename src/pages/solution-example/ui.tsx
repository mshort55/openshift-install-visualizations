import type { ReactNode } from "react";
import { follow } from "../../app/links";
import { type AppRoute, appHref, defaultPrerequisites } from "../../app/routes";
import { ShareView } from "../../app/ShareView";
import { Action, Detail } from "./components";
import { Installation } from "./installation";
import { contextRoute, storyContexts } from "./links";
import {
  type Chapter,
  complete,
  configuredComponents,
  failures,
  installedComponents,
  nextAction,
  passed,
  planErrors,
  preparationReady,
  status,
} from "./model";
import { Operators, Readiness, Template } from "./post-installation";
import { DNS, Hook, Preflight, Preparation } from "./preparation";
import { type Session, useSolutionSession } from "./session";
import "./styles.css";

export { useSolutionSession };

const titles: Record<Chapter, string> = {
  introduction: "One cluster. One connected journey.",
  preparation: "Cluster information and prerequisites",
  dns: "Coordinate and verify DNS",
  "pre-hooks": "Customer Ansible pre-installation hooks",
  preflight: "Proposed Red Hat preflight checks",
  installation: "Prepare media, boot and observe",
  operators: "Install and configure infrastructure operators",
  "post-hooks": "Customer Ansible post-installation hooks",
  readiness: "Verify infrastructure readiness",
  handoff: "Infrastructure readiness and evidence",
  reuse: "Save as template",
};
const phases: {
  title: string;
  entry: Chapter;
  actions: { chapter: Chapter; label: string }[];
}[] = [
  {
    title: "Pre-installation",
    entry: "preparation",
    actions: [
      { chapter: "preparation", label: "Cluster information & prerequisites" },
      { chapter: "dns", label: "DNS request & verification" },
      { chapter: "pre-hooks", label: "Customer Ansible hooks" },
      { chapter: "preflight", label: "Red Hat preflight checks" },
    ],
  },
  {
    title: "Installation",
    entry: "installation",
    actions: [{ chapter: "installation", label: "Media, boot & observation" }],
  },
  {
    title: "Post-installation",
    entry: "operators",
    actions: [
      { chapter: "operators", label: "Infrastructure operators" },
      { chapter: "post-hooks", label: "Customer Ansible hooks" },
      { chapter: "readiness", label: "Readiness checks & evidence" },
      { chapter: "reuse", label: "Save as template · Optional" },
    ],
  },
];

function Opening({ session }: { session: Session }) {
  return (
    <section
      className="solution-intro"
      aria-label="Why agent-based installation"
    >
      <div>
        <p className="solution-eyebrow">Why agent-based installation?</p>
        <h2>
          One installation approach.
          <br />
          Two ways to reach the servers.
        </h2>
        <p>
          Declarative inputs and prepared installation media support automated
          boot or guided local boot, including disconnected environments with
          prepared dependencies. The installer runs on the target
          infrastructure; a proposed central hub coordinates the journey.
        </p>
      </div>
      <div
        className="solution-diagram"
        role="img"
        aria-label="Hub coordinates boot and customer jobs; the installer runs on the target infrastructure"
      >
        <div className="solution-hub">
          <strong>Central hub</strong>
          <span>Plan · ownership · evidence · history</span>
        </div>
        <span className="solution-diagram-arrow" aria-hidden="true">
          ↓ coordinates
        </span>
        <div className="solution-diagram-targets">
          <div>
            <strong>Target infrastructure</strong>
            <span>Automated or local media boot</span>
            <span>Agent installer on rendezvous host</span>
          </div>
          <div>
            <strong>Customer automation</strong>
            <span>Existing Ansible infrastructure</span>
            <span>Customer-authored pre / post jobs</span>
          </div>
        </div>
      </div>
      <Detail
        session={session}
        id="technical-foundation"
        title="Technical foundation, connectivity and sources"
      >
        <p>
          The proposed hub could coordinate Redfish virtual-media boot using
          mechanisms such as Metal3/Ironic. Hardware and firmware support,
          controller-to-BMC access, BMC-to-media access and installation
          observation are separate requirements. This does not establish a
          turnkey supported integration or decide the journey record’s backing
          technology.
        </p>
        <p>
          Ordinary installation-media boot can deploy the cluster and write
          disks. Proposed preflight checks happen before that boot. The
          journey’s APIs, storage, authentication and workflow implementation
          remain open.
        </p>
        <ul>
          <li>
            <a href="https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/installing_an_on-premise_cluster_with_the_agent-based_installer/preparing-to-install-with-agent-based-installer">
              Agent-based Installer: inputs, media and rendezvous host
            </a>
          </li>
          <li>
            <a href="https://docs.openstack.org/ironic/latest/admin/drivers/redfish.html">
              Ironic: Redfish and virtual media constraints
            </a>{" "}
            ·{" "}
            <a href="https://book.metal3.io/bmo/live-iso.html">
              Metal3: third-party installer mechanism
            </a>
          </li>
          <li>
            <a href="https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/virtualization/postinstallation-configuration">
              Virtualization: conditional network configuration
            </a>{" "}
            ·{" "}
            <a href="https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/virtualization/installing">
              Virtualization installation and component readiness
            </a>
          </li>
          <li>
            <a href="https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/storage/using-container-storage-interface-csi">
              Provider-specific CSI integration
            </a>{" "}
            ·{" "}
            <a href="https://docs.redhat.com/en/documentation/red_hat_openshift_data_foundation/4.22/html/deploying_openshift_data_foundation_using_bare_metal_infrastructure/deploy-using-local-storage-devices-bm">
              ODF bare-metal local-storage topology
            </a>
          </li>
        </ul>
      </Detail>
    </section>
  );
}

export function SolutionPage({
  chapter,
  onRead,
  session,
  link,
}: {
  chapter: Chapter;
  onRead: (chapter: Chapter) => void;
  session: Session;
  link: (next: AppRoute, label: string, id: string) => ReactNode;
}) {
  const { journey: state, dispatch, persistence } = session;
  const journeyStatus = status(state);
  const next = nextAction(state);
  const activeChapter = chapter === "handoff" ? "readiness" : chapter;
  const failedActions = failures(state);
  const actionStatus = (id: Chapter) => {
    if (id === "preparation")
      return planErrors(state).length
        ? "Needs input"
        : state.plan.prerequisites.some((item) => !item.fulfilled)
          ? "Waiting"
          : "Complete";
    if (id === "dns")
      return passed(state, "dns")
        ? "Verified"
        : failedActions.some((item) => item.action === "dns")
          ? "Failed"
          : state.dns === "requested"
            ? "Waiting"
            : state.dns === "fulfilled"
              ? "Unverified"
              : "Planned";
    if (id === "pre-hooks" || id === "post-hooks" || id === "preflight") {
      const action =
        id === "pre-hooks"
          ? "pre-hook"
          : id === "post-hooks"
            ? "post-hook"
            : "preflight";
      return passed(state, action)
        ? "Passed"
        : failedActions.some((item) => item.action === action)
          ? "Failed"
          : "Planned";
    }
    if (id === "installation")
      return state.installation === "installed"
        ? "Installed"
        : state.installation === "not-started"
          ? "Planned"
          : state.installation === "awaiting-local-boot"
            ? "Manual task"
            : "Running";
    if (id === "operators")
      return failedActions.some((item) => item.action.includes(":"))
        ? "Failed"
        : state.plan.selected.every((id) => passed(state, `${id}:ready`))
          ? state.plan.selected.length
            ? "Ready"
            : "Not selected"
          : configuredComponents(state)
            ? "Verify next"
            : installedComponents(state)
              ? "Configure next"
              : "Planned";
    if (id === "readiness")
      return complete(state)
        ? "Passed"
        : failedActions.some(
              (item) =>
                item.action === "vm-check" || item.action.endsWith(":ready"),
            )
          ? "Failed"
          : "Planned";
    if (id === "reuse")
      return state.template && persistence.kind === "saved"
        ? "Saved"
        : complete(state)
          ? "Available"
          : "Optional";
    return "Planned";
  };
  const phaseStatus = (index: number) => {
    if (index === 0)
      return preparationReady(state)
        ? "Complete"
        : failedActions.some((item) =>
              ["dns", "pre-hook", "preflight"].includes(item.action),
            )
          ? "Failed"
          : state.started
            ? "In progress"
            : "Planned";
    if (index === 1)
      return state.installation === "installed"
        ? "Complete"
        : state.installation === "not-started"
          ? "Planned"
          : "In progress";
    return complete(state)
      ? "Complete"
      : failedActions.some(
            (item) => !["dns", "pre-hook", "preflight"].includes(item.action),
          )
        ? "Failed"
        : state.installation === "installed"
          ? "In progress"
          : "Planned";
  };
  const readLink = (
    target: Chapter,
    label: ReactNode,
    focusId = `chapter-${target}`,
  ) => (
    <a
      href={appHref({ page: "solution-example", chapter: target })}
      data-focus={focusId}
      aria-current={activeChapter === target ? "step" : undefined}
      onClick={(event) => follow(event, () => onRead(target))}
    >
      {label}
    </a>
  );
  const selectedPhase = phases.find((phase) =>
    phase.actions.some((action) => action.chapter === activeChapter),
  );
  return (
    <main id="main-content" tabIndex={-1} className="solution-page">
      <header className="solution-heading">
        <div>
          <p className="solution-eyebrow">
            Solution example · Proposed experience
          </p>
          <h1>From prerequisites to infrastructure readiness</h1>
          <p>
            One saved installation journey coordinates preparation, agent-based
            installation, infrastructure operators, customer Ansible automation
            and readiness checks.
          </p>
        </div>
        <ShareView route={{ page: "solution-example", chapter }} />
      </header>
      {chapter === "introduction" && <Opening session={session} />}
      <div className="solution-demo-label">
        <span className="solution-badge">Interactive demonstration</span>
        <p>
          All external results are simulated. No real BMC, DNS, ServiceNow,
          cluster or Ansible systems are contacted.
        </p>
      </div>
      <div className="solution-workspace">
        <aside
          className="solution-overview"
          aria-label="Persistent journey overview"
        >
          <div className="solution-identity">
            <p className="solution-eyebrow">
              New deployment · No source template
            </p>
            <h2>{state.plan.cluster || "Unnamed cluster"}</h2>
            <p>3 control-plane · 2 workers</p>
            <dl className="solution-statuses">
              <dt>Journey status</dt>
              <dd data-testid="journey-status">
                <span
                  className="solution-badge"
                  data-tone={
                    journeyStatus === "Failed"
                      ? "danger"
                      : journeyStatus === "Complete"
                        ? "success"
                        : "neutral"
                  }
                >
                  {journeyStatus}
                </span>
              </dd>
              <dt>Cluster installation</dt>
              <dd data-testid="installation-status">
                {state.installation === "installed"
                  ? "Cluster installed successfully"
                  : state.installation === "not-started"
                    ? "Not started"
                    : state.installation === "awaiting-local-boot"
                      ? "Waiting for local boot"
                      : "In progress"}
              </dd>
            </dl>
            <p
              className="solution-save"
              data-save-state={persistence.kind}
              role="status"
            >
              {persistence.message}
            </p>
            {persistence.kind === "error" && (
              <Action id="retry-save" secondary onClick={session.retrySave}>
                Retry saving
              </Action>
            )}
            <button
              type="button"
              className="solution-reset"
              data-focus="solution-reset"
              onClick={() => {
                session.reset();
                onRead("introduction");
              }}
            >
              Reset example
            </button>
            <small>Resets this example and its saved template only.</small>
          </div>
          <nav aria-label="Journey phases and actions">
            {phases.map((phase, index) => (
              <section className="solution-phase" key={phase.title}>
                <div className="solution-phase-title">
                  <span className="solution-phase-number">0{index + 1}</span>
                  <div>
                    <strong>{phase.title}</strong>
                    <span data-phase-status={index}>{phaseStatus(index)}</span>
                  </div>
                </div>
                <ul>
                  {phase.actions.map((action) => (
                    <li key={action.chapter}>
                      {readLink(
                        action.chapter,
                        <>
                          <span>{action.label}</span>
                          <small data-action-status={action.chapter}>
                            {actionStatus(action.chapter)}
                          </small>
                        </>,
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </nav>
        </aside>
        <div className="solution-action-column">
          <div className="solution-next">
            <span className="solution-eyebrow">
              {complete(state)
                ? "Ready for what’s next"
                : "Needs attention / next action"}
            </span>
            <p>
              <strong>
                {state.started ? next.label : "Start a new deployment"}
              </strong>
              <br />
              {state.started ? next.owner : "Platform team"}
            </p>
            {state.started &&
              readLink(next.chapter, "Inspect action →", "solution-next-top")}
          </div>
          <article
            className="solution-scene"
            aria-labelledby={`solution-chapter-${chapter}`}
          >
            <p className="solution-eyebrow">
              {selectedPhase?.title ?? "Your installation journey"} · Inspect
              without advancing
            </p>
            <h2
              id={`solution-chapter-${chapter}`}
              data-focus={`solution-chapter-${chapter}`}
              tabIndex={-1}
            >
              {titles[chapter]}
            </h2>
            {(chapter === "introduction" || !state.started) && (
              <div className="solution-entry">
                <p>
                  Begin with an incomplete plan, coordinate the owners and
                  follow the same cluster through verified infrastructure
                  readiness. The proposed product would keep this record
                  centrally; this example saves in your browser.
                </p>
                <div className="solution-controls">
                  <Action
                    id="new-deployment"
                    onClick={() => {
                      dispatch({ kind: "start" });
                      onRead("preparation");
                    }}
                  >
                    {state.started
                      ? "Continue new deployment"
                      : "New deployment"}
                  </Action>
                  <button
                    type="button"
                    className="solution-button secondary"
                    disabled
                    aria-describedby="solution-template-scope"
                  >
                    Start from template
                  </button>
                </div>
                <p id="solution-template-scope">
                  This example follows New deployment. Template selection and
                  import are not demonstrated; Save as template is available
                  when the journey is complete.
                </p>
              </div>
            )}
            {chapter !== "introduction" && (
              <fieldset className="solution-panel" disabled={!state.started}>
                {chapter === "preparation" && (
                  <Preparation
                    session={session}
                    networkLink={link(
                      defaultPrerequisites,
                      "Explore Network prep",
                      "to-prerequisites",
                    )}
                  />
                )}
                {chapter === "dns" && <DNS session={session} />}
                {chapter === "pre-hooks" && (
                  <Hook session={session} placement="pre" />
                )}
                {chapter === "preflight" && <Preflight session={session} />}
                {chapter === "installation" && (
                  <Installation session={session} />
                )}
                {chapter === "operators" && <Operators session={session} />}
                {chapter === "post-hooks" && (
                  <Hook session={session} placement="post" />
                )}
                {(chapter === "readiness" || chapter === "handoff") && (
                  <Readiness session={session} />
                )}
                {chapter === "reuse" && <Template session={session} />}
              </fieldset>
            )}
            {chapter !== "introduction" && state.started && (
              <div className="solution-bottom-next">
                {readLink(
                  next.chapter,
                  <>Next useful action: {next.label} →</>,
                  "solution-next-bottom",
                )}
              </div>
            )}
          </article>
          <div
            className="solution-live"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {journeyStatus}. Cluster installation:{" "}
            {state.installation === "installed"
              ? "successful"
              : state.installation.replaceAll("-", " ")}
            .{" "}
            {state.attempts.length
              ? `Latest simulated result: ${state.attempts.at(-1)?.evidence}`
              : "No execution results yet."}
          </div>
          <section
            className="solution-related"
            aria-label="Related installation guidance"
          >
            <h3>Explore the context</h3>
            {storyContexts
              .filter(
                (context) =>
                  context.chapter === chapter ||
                  (chapter === "dns" && context.chapter === "preparation") ||
                  (chapter === "operators" && context.chapter === "readiness"),
              )
              .map((context) => (
                <span key={context.label}>
                  {link(
                    contextRoute(context),
                    context.label,
                    `to-${context.chapter}-${context.item ?? context.topic}`,
                  )}
                </span>
              ))}
            {readLink(
              "introduction",
              "Why agent-based installation?",
              "solution-foundation",
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
