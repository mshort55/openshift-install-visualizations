import { type ReactNode, useEffect, useState } from "react";
import { exampleNodes } from "../prerequisites/data";
import { DnsHandoff } from "./dns";
import {
  type DnsRequest,
  dnsStatus,
  journeyStatus,
  type Phase,
  type PhaseProgress,
  phaseFor,
  phaseProgress,
  phaseProgressLabel,
  phaseStatus,
  phases,
  type Snapshot,
  sampleVerifiedDns,
} from "./model";
import type { SolutionSession } from "./session";
import "./styles.css";

type Demo = {
  snapshot: Snapshot;
  phase: Phase;
  setPhase: (phase: Phase) => void;
  move: (snapshot: Snapshot) => void;
  updateDns: (dns: DnsRequest) => void;
};

function Status({ snapshot }: { snapshot: Snapshot }) {
  const status = journeyStatus(snapshot);
  return (
    <span className={`sp-status sp-${status.tone}`}>
      <span aria-hidden="true">
        {status.tone === "failed" ? "!" : status.tone === "success" ? "✓" : "●"}
      </span>
      {status.label}
    </span>
  );
}

function PhaseMark({ progress }: { progress: PhaseProgress }) {
  return (
    <span className="sp-phase-mark" aria-hidden="true">
      <svg
        aria-hidden="true"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {progress.kind === "complete" ? (
          <path d="m5 12 4 4L19 6" />
        ) : progress.kind === "blocked" ? (
          <>
            <rect x="5" y="10" width="14" height="11" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2" />
          </>
        ) : progress.needsAttention ? (
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v6m0 4h.01" />
          </>
        ) : (
          <>
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
          </>
        )}
      </svg>
    </span>
  );
}

function Preparation({ snapshot, move, updateDns }: Demo) {
  const incomplete = snapshot.kind === "draft" || snapshot.kind === "saved";
  const items = [
    {
      title: "Release & topology",
      owner: "Platform team",
      result: "OpenShift 4.22 · 3 control plane + 2 workers",
      done: true,
    },
    {
      title: "Host plan",
      owner: "Infrastructure team",
      result: "Five hosts · managed networking · DHCP reservations",
      done: true,
    },
    {
      title: "Content & credentials plan",
      owner: "Platform team",
      result: "Registry access and installation inputs accounted for",
      done: true,
    },
    {
      title: "External DNS",
      owner: "DNS team",
      result: dnsStatus(snapshot.dns),
      done: snapshot.dns.kind === "verified",
    },
    {
      title: "Boot access",
      owner: "Infrastructure team",
      result: incomplete
        ? "Decision pending · remote BMC access or approved local boot"
        : "Boot route recorded · local boot available if automation is blocked",
      done: !incomplete,
    },
  ];
  return (
    <div className="sp-phase-content">
      <div className="sp-task-list">
        {items.map((item) => (
          <div className="sp-task" key={item.title}>
            <span
              role="img"
              className={`sp-task-icon ${item.done ? "sp-success" : "sp-waiting"}`}
              aria-label={item.done ? "Complete" : "Waiting"}
            >
              {item.done ? "✓" : "…"}
            </span>
            <div>
              <strong>{item.title}</strong>
              <p>{item.result}</p>
            </div>
            <span className="sp-owner">{item.owner}</span>
          </div>
        ))}
      </div>
      <DnsHandoff
        dns={snapshot.dns}
        update={updateDns}
        saved={snapshot.kind === "saved"}
        bootPending={incomplete}
        save={() => move({ kind: "saved", dns: snapshot.dns })}
      />
      <div className="sp-hook-note">
        <span className="sp-label">Pre-installation hook · proposed</span>
        <strong>Customer AAP job: site-readiness</strong>
        <p>
          {incomplete
            ? "Waiting for inputs. The example hook will check the agreed site prerequisites before boot."
            : "Illustrative run #281 passed. Evidence records the check’s execution context; it does not certify every host or BMC."}
        </p>
      </div>
      {incomplete ? (
        <div className="sp-action-panel">
          <strong>
            {snapshot.dns.kind === "verified"
              ? "DNS is complete. Resolve the boot-access decision."
              : snapshot.kind === "saved"
                ? "The cluster does not exist yet. Its journey does."
                : "Missing answers can wait. The work does not disappear."}
          </strong>
          <p>
            {snapshot.dns.kind === "verified"
              ? "In the next sample step, the Infrastructure team agrees to remote boot with an approved local fallback, and the required site-readiness hook passes."
              : "Keep the completed items, DNS request, boot-access decision, owners and five-host plan together. DNS must be verified before installation can begin."}
          </p>
          <div className="sp-actions">
            {snapshot.kind === "draft" && snapshot.dns.kind !== "requested" && (
              <button
                type="button"
                onClick={() => move({ kind: "saved", dns: snapshot.dns })}
              >
                Save incomplete journey
              </button>
            )}
            {snapshot.dns.kind === "verified" && (
              <button
                type="button"
                className="sp-primary"
                onClick={() => {
                  if (snapshot.dns.kind === "verified")
                    move({ kind: "ready", dns: snapshot.dns });
                }}
              >
                Resolve boot access & run sample pre-hook →
              </button>
            )}
          </div>
          <small>
            {snapshot.kind === "saved"
              ? "Saved for this session. Read another chapter or explore the other pages, then return here to continue. Refreshing resets the example."
              : "Simulation only. Progress stays with this browser session as you explore the app; refreshing resets the example."}
          </small>
        </div>
      ) : (
        <div className="sp-result sp-success">
          <strong>Preparation complete</strong>
          <p>
            The earlier incomplete draft remains part of the story. Installation
            can now use the agreed inputs.
          </p>
        </div>
      )}
    </div>
  );
}

function Installation({ snapshot, move }: Demo) {
  const [bootReported, setBootReported] = useState(false);
  useEffect(() => {
    if (snapshot.kind === "manual") setBootReported(false);
  }, [snapshot]);
  const blocked = snapshot.kind === "draft" || snapshot.kind === "saved";
  const installed =
    snapshot.kind === "installed" ||
    snapshot.kind === "failed" ||
    snapshot.kind === "complete";
  return (
    <div className="sp-phase-content">
      <section
        className="sp-install-flow"
        aria-label="Installation responsibilities"
      >
        <div>
          <span className="sp-label">Proposed hub</span>
          <strong>Prepare & coordinate</strong>
          <p>
            Retain inputs, generate Agent media, coordinate boot and observe
            results.
          </p>
        </div>
        <span aria-hidden="true">→</span>
        <div>
          <span className="sp-label">Target hosts</span>
          <strong>Run Agent installation</strong>
          <p>
            The local installation service runs on the rendezvous host,{" "}
            <code>cp-0</code>.
          </p>
        </div>
      </section>
      <section className="sp-hosts" aria-label="Five planned hosts">
        {exampleNodes.map((node) => (
          <div key={node.name}>
            <span aria-hidden="true">▤</span>
            <strong>{node.name}</strong>
            <small>{node.rendezvous ? "Rendezvous" : node.role}</small>
          </div>
        ))}
      </section>
      <details className="sp-disclosure">
        <summary>What must be true for automated boot?</summary>
        <p>
          The hub can authenticate to each BMC; each BMC can retrieve the
          prepared ISO. Virtual media support, firmware, licenses and trust must
          work for the selected hardware.
        </p>
        <p>
          A Metal3/Ironic-based boot integration is proposed here. A successful
          media attachment is not proof of boot or base installation. This
          combination has not been exercised by this example.
        </p>
      </details>
      {blocked || snapshot.kind === "ready" ? (
        <div className="sp-action-panel">
          <strong>
            {blocked
              ? "Waiting on preparation"
              : "Agent media is prepared by the proposed hub."}
          </strong>
          <p>
            {blocked
              ? "Both boot paths become available after the prerequisites and required pre-installation hook pass."
              : "Explore a site that permits automated boot, or one that requires a person at the console."}
          </p>
          <div className="sp-actions">
            <button
              type="button"
              className="sp-primary"
              disabled={blocked}
              onClick={() => {
                if (snapshot.kind === "ready")
                  move({ ...snapshot, kind: "observing", boot: "automated" });
              }}
            >
              Simulate automated boot →
            </button>
            <button
              type="button"
              disabled={blocked}
              onClick={() => {
                if (snapshot.kind === "ready")
                  move({ ...snapshot, kind: "manual" });
              }}
            >
              Explore manual fallback
            </button>
          </div>
        </div>
      ) : snapshot.kind === "manual" ? (
        <div className="sp-manual">
          <span className="sp-label">
            Guided continuation · Infrastructure team
          </span>
          <h3>Remote BMC access is blocked. Continue at the console.</h3>
          <p>
            The prepared configuration and <code>ocp5-agent.x86_64.iso</code>{" "}
            stay with journey <code>J-042</code>. The installation has not
            failed or restarted.
          </p>
          <ol>
            <li>
              Retrieve the prepared Agent ISO from the journey’s media bundle
              using the approved transfer path. Check its supplied checksum.
            </li>
            <li>
              At each host console, attach that ISO through approved local
              virtual media, or use the prepared bootable USB.
            </li>
            <li>
              Use the one-time boot menu on{" "}
              <strong>cp-0, cp-1, cp-2, worker-0 and worker-1</strong> to boot
              the Agent media. The expected rendezvous address is{" "}
              <code>10.20.30.21</code>.
            </li>
            <li>
              Confirm all five hosts reached the Agent environment. Report boot
              completion; the hub still needs separate installation evidence.
            </li>
          </ol>
          <label className="sp-checkbox">
            <input
              type="checkbox"
              checked={bootReported}
              onChange={(event) => setBootReported(event.target.checked)}
            />{" "}
            In this example, the operator reports all five hosts booted.
          </label>
          <button
            type="button"
            className="sp-primary"
            disabled={!bootReported}
            onClick={() =>
              move({ ...snapshot, kind: "observing", boot: "manual" })
            }
          >
            Record boot report →
          </button>
        </div>
      ) : snapshot.kind === "observing" ? (
        <div className="sp-action-panel">
          <strong>
            {snapshot.boot === "manual"
              ? "Manual boot reported. Automatic observation resumes."
              : "Automated boot completed in this example."}
          </strong>
          <p>
            The hub’s installation-observation path is assumed reachable here.
            Boot completion does not yet mean the base cluster installed.
          </p>
          <pre>
            {
              "agent wait-for bootstrap-complete  → illustrative success\nagent wait-for install-complete    → waiting for result"
            }
          </pre>
          <button
            type="button"
            className="sp-primary"
            onClick={() => move({ ...snapshot, kind: "installed" })}
          >
            Show successful installation result →
          </button>
          <p className="sp-muted">
            If observation were unavailable, the result would remain unknown
            until evidence arrived.
          </p>
        </div>
      ) : installed ? (
        <div className="sp-result sp-success">
          <strong>Base cluster installed</strong>
          <p>
            Illustrative <code>install-complete</code> result: success. Boot
            used the{" "}
            {snapshot.boot === "manual" ? "guided manual" : "automated"} path.
            Required post-installation work still determines the journey
            outcome.
          </p>
          <button
            type="button"
            onClick={() => move({ ...snapshot, kind: "manual" })}
          >
            Replay manual fallback
          </button>
        </div>
      ) : null}
    </div>
  );
}

function PostInstallation({ snapshot, move }: Demo) {
  const canRun = snapshot.kind === "installed";
  const failed = snapshot.kind === "failed";
  const complete = snapshot.kind === "complete";
  const ran = failed || complete;
  return (
    <div className="sp-phase-content">
      <div className="sp-task-list">
        <div className="sp-task">
          <span className={`sp-task-icon ${ran ? "sp-success" : "sp-waiting"}`}>
            {ran ? "✓" : "…"}
          </span>
          <div>
            <strong>Install Kubernetes NMState Operator</strong>
            <p>
              {ran
                ? "Available · required network configuration can proceed"
                : "Required for this example’s additional workload network"}
            </p>
          </div>
          <span className="sp-owner">Platform team</span>
        </div>
        <div className="sp-task">
          <span className={`sp-task-icon ${ran ? "sp-success" : "sp-waiting"}`}>
            {ran ? "✓" : "…"}
          </span>
          <div>
            <strong>Configure the worker network</strong>
            <p>
              {ran
                ? "Policy applied to worker-0 and worker-1 · VLAN 260"
                : "Apply the agreed host-network configuration to both workers"}
            </p>
          </div>
          <span className="sp-owner">Automation</span>
        </div>
        <div className="sp-task">
          <span
            className={`sp-task-icon ${failed ? "sp-failed" : complete ? "sp-success" : "sp-waiting"}`}
          >
            {failed ? "!" : complete ? "✓" : "…"}
          </span>
          <div>
            <strong>Required hook: workload-network-smoke</strong>
            <p>
              {failed
                ? "Failed · sample workload cannot reach the VLAN 260 gateway"
                : complete
                  ? "Passed on retry · sample workload reached the expected gateway"
                  : "Run the customer’s existing AAP job and bring its result back"}
            </p>
          </div>
          <span className="sp-owner">Network team</span>
        </div>
      </div>
      {failed ? (
        <div className="sp-failure-detail">
          <span className="sp-label">
            Illustrative customer AAP run #284 · Failed
          </span>
          <h3>The Operator is available. The required network check failed.</h3>
          <pre>
            {
              "check: workload-network-smoke\nsource: sample pod on worker-1 / VLAN 260\nexpected: reach gateway 10.60.0.1\nobserved: timeout\njourney: needs attention"
            }
          </pre>
          <p>
            <strong>Next owner: Network team.</strong> Inspect the switch’s VLAN
            allowance and the host network configuration. Retain the failed run
            while retrying the hook after repair.
          </p>
          <button
            type="button"
            className="sp-primary"
            onClick={() => move({ ...snapshot, kind: "complete" })}
          >
            Simulate network repair & retry
          </button>
          <small>
            This replays the hook; it does not reinstall the cluster.
          </small>
        </div>
      ) : complete ? (
        <div className="sp-result sp-success">
          <strong>Infrastructure ready for the agreed handoff</strong>
          <p>
            Illustrative run #285 passed after repair. Run #284 remains failed
            in the history. The sample network check proves only its stated
            operation; it does not certify every application.
          </p>
          <button
            type="button"
            onClick={() => move({ ...snapshot, kind: "failed" })}
          >
            Replay the failure
          </button>
        </div>
      ) : (
        <div className="sp-action-panel">
          <strong>
            {canRun
              ? "Continue beyond the installer’s finish line."
              : "Post-installation waits for the base cluster."}
          </strong>
          <p>
            In this worked example, configuration succeeds but the required
            customer network hook fails. Its result must affect the overall
            journey.
          </p>
          <button
            type="button"
            className="sp-primary"
            disabled={!canRun}
            onClick={() => {
              if (snapshot.kind === "installed")
                move({ ...snapshot, kind: "failed" });
            }}
          >
            Run example post-installation →
          </button>
        </div>
      )}
    </div>
  );
}

function PhaseContent({ phase, demo }: { phase: Phase; demo: Demo }) {
  if (phase === "pre") return <Preparation {...demo} />;
  if (phase === "install") return <Installation {...demo} />;
  return <PostInstallation {...demo} />;
}

function GuidedStory({ demo }: { demo: Demo }) {
  const selected =
    phases.find((phase) => phase.key === demo.phase) ?? phases[0];
  const selectedProgress = phaseProgress(demo.phase, demo.snapshot);
  const currentPhase = phaseFor(demo.snapshot);
  const currentName = phases.find((phase) => phase.key === currentPhase)?.name;
  return (
    <div className="sp-story">
      <aside className="sp-rail">
        <span className="sp-label">One journey · Three chapters</span>
        <nav aria-label="Story phases">
          {phases.map((phase) => {
            const progress = phaseProgress(phase.key, demo.snapshot);
            const viewing = demo.phase === phase.key;
            return (
              <button
                type="button"
                key={phase.key}
                data-phase={phase.key}
                data-focus={`solution-phase-${phase.key}`}
                data-progress={progress.kind}
                data-attention={
                  progress.kind === "current" && progress.needsAttention
                }
                data-viewing={viewing}
                aria-current={progress.kind === "current" ? "step" : undefined}
                aria-controls="sp-story-chapter"
                onClick={() => demo.setPhase(phase.key)}
              >
                <PhaseMark progress={progress} />
                <span className="sp-phase-copy">
                  <span className="sp-phase-top">
                    <strong>{phase.name}</strong>
                  </span>
                  <span className="sp-phase-progress">
                    {phaseProgressLabel(progress)}
                  </span>
                  {progress.kind !== "blocked" && (
                    <small>
                      {progress.kind === "current" && progress.needsAttention
                        ? "Needs attention · "
                        : ""}
                      {phaseStatus(phase.key, demo.snapshot)}
                    </small>
                  )}
                </span>
              </button>
            );
          })}
        </nav>
        <div className="sp-rail-note">
          <strong>Follow the journey’s progress</strong>
          <p>
            The current-phase marker follows the work. The outline shows the
            chapter you are viewing.
          </p>
          <p>
            You can preview any chapter. Its actions unlock when the previous
            phase is complete.
          </p>
        </div>
      </aside>
      <article className="sp-story-chapter" id="sp-story-chapter">
        <span className="sp-label">{selected?.name}</span>
        <h2 id={`solution-phase-${demo.phase}`} tabIndex={-1}>
          {selected?.title}
        </h2>
        <p className="sp-lead">{selected?.idea}</p>
        <div
          className="sp-chapter-status"
          data-progress={selectedProgress.kind}
          data-attention={
            selectedProgress.kind === "current" &&
            selectedProgress.needsAttention
          }
          role="status"
        >
          <PhaseMark progress={selectedProgress} />
          <div>
            <strong>
              {selectedProgress.kind === "blocked"
                ? "Preview only"
                : selectedProgress.kind === "complete"
                  ? "Phase complete"
                  : selectedProgress.needsAttention
                    ? "Current phase · Needs attention"
                    : "Current phase"}
            </strong>
            <p>
              {selectedProgress.kind === "blocked"
                ? `Complete ${selectedProgress.prerequisite === "pre" ? "pre-installation" : "installation"} to start ${selected?.name.toLowerCase()}.`
                : selectedProgress.kind === "complete"
                  ? demo.snapshot.kind === "complete"
                    ? "All three phases are complete."
                    : `Current phase: ${currentName}.`
                  : phaseStatus(demo.phase, demo.snapshot)}
            </p>
          </div>
          {demo.phase !== currentPhase && demo.snapshot.kind !== "complete" && (
            <button type="button" onClick={() => demo.setPhase(currentPhase)}>
              Return to current phase
            </button>
          )}
        </div>
        <PhaseContent phase={demo.phase} demo={demo} />
        <nav className="sp-chapter-nav" aria-label="Read the next chapter">
          {demo.phase !== "pre" && (
            <button
              type="button"
              onClick={() =>
                demo.setPhase(demo.phase === "post" ? "install" : "pre")
              }
            >
              ← Previous chapter
            </button>
          )}
          {demo.phase !== "post" && (
            <button
              type="button"
              onClick={() =>
                demo.setPhase(demo.phase === "pre" ? "install" : "post")
              }
            >
              Read {demo.phase === "pre" ? "installation" : "post-installation"}{" "}
              →
            </button>
          )}
        </nav>
      </article>
    </div>
  );
}

export function SolutionPage({
  phase,
  onPhase,
  session,
  catalogLink,
}: {
  phase: Phase;
  onPhase: (phase: Phase) => void;
  session: SolutionSession;
  catalogLink: ReactNode;
}) {
  const { snapshot, setSnapshot, updateDns } = session;
  const move = (next: Snapshot) => {
    setSnapshot(next);
    onPhase(phaseFor(next));
  };
  const demo: Demo = { snapshot, phase, setPhase: onPhase, move, updateDns };
  const status = journeyStatus(snapshot);
  return (
    <main id="main-content" className="solution-page" tabIndex={-1}>
      <div className="sp-review-banner">
        <span>
          <strong>Solution example</strong> · A guided journey for Red Hat
          engineers
        </span>
        {catalogLink}
      </div>
      <header className="sp-page-intro">
        <div>
          <span className="sp-label">
            Proposed solution · One installation journey
          </span>
          <h1 id="solution-title" tabIndex={-1}>
            From a saved plan to infrastructure ready.
          </h1>
          <p>
            Follow one planned cluster through preparation, Agent-based
            installation and required post-installation work.
          </p>
        </div>
        <div className="sp-story-note">
          <span className="sp-label">Follow one journey</span>
          <p>One chapter at a time, with all three phases always in reach.</p>
        </div>
      </header>
      <div className="sp-foundation">
        <strong>Why Agent-based?</strong>
        <span>
          Declarative inputs, flexible boot media and an installation service on
          the target hosts provide a foundation for repeatable preparation. The
          proposed hub coordinates the work without depending on a customer
          laptop.
        </span>
        <details>
          <summary>Capability boundaries</summary>
          <p>
            Agent installation and completion commands are documented
            foundations. Saved journeys, hub coordination, boot integration and
            generic pre/post hooks are proposed composition. All results below
            are illustrative; no live cluster, BMC or AAP service is connected.
          </p>
          <p>
            Technical grounding was reviewed against OCP 4.22, AAP 2.6 and
            upstream Metal3/Ironic documentation. This example does not
            establish a supported version or hardware combination.
          </p>
        </details>
      </div>
      <section className="sp-cluster-strip" aria-label="Shared example state">
        <div>
          <span className="sp-label">Illustrative cluster</span>
          <strong>
            ocp5<span className="sp-cluster-domain">.dc.example.com</span>
          </strong>
          <span>
            J-042 · 5 bare-metal hosts · OpenShift 4.22 · Platform team
          </span>
        </div>
        <div className="sp-overall" aria-live="polite">
          <span className="sp-label">Overall journey</span>
          <Status snapshot={snapshot} />
          <p>{status.detail}</p>
        </div>
      </section>
      <section
        className="sp-review-controls"
        aria-label="Example review controls"
      >
        <div>
          <span className="sp-label">Replay a story moment</span>
          <span>Jump to a sample state</span>
        </div>
        <div className="sp-actions">
          <button
            type="button"
            aria-pressed={
              snapshot.kind === "saved" || snapshot.kind === "draft"
            }
            onClick={() => move({ kind: "saved", dns: { kind: "requested" } })}
          >
            1 · Saved prerequisites
          </button>
          <button
            type="button"
            aria-pressed={snapshot.kind === "manual"}
            onClick={() => move({ kind: "manual", dns: sampleVerifiedDns })}
          >
            2 · Manual boot
          </button>
          <button
            type="button"
            aria-pressed={snapshot.kind === "failed"}
            onClick={() =>
              move({ kind: "failed", boot: "manual", dns: sampleVerifiedDns })
            }
          >
            3 · Post-install failure
          </button>
          <button
            type="button"
            className="sp-reset"
            onClick={() => move({ kind: "draft", dns: { kind: "needed" } })}
          >
            Reset example
          </button>
        </div>
      </section>
      <section className="sp-phase-state" aria-label="Current phase results">
        {phases.map((item) => {
          const progress = phaseProgress(item.key, snapshot);
          return (
            <span
              key={item.key}
              data-progress={progress.kind}
              data-attention={
                progress.kind === "current" && progress.needsAttention
              }
            >
              <PhaseMark progress={progress} />
              <span>
                <strong>{item.short}</strong> {phaseProgressLabel(progress)}
                {progress.kind !== "blocked" && (
                  <> · {phaseStatus(item.key, snapshot)}</>
                )}
              </span>
            </span>
          );
        })}
      </section>
      <GuidedStory demo={demo} />
      <p className="sp-example-footnote">
        All results are simulated. Progress is retained while you explore this
        app. Refreshing or resetting the example starts a new journey; no
        external service is changed.
      </p>
    </main>
  );
}
