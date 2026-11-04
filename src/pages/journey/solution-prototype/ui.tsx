import { useEffect, useState } from "react";
import { PrototypeSwitcher } from "../../../app/PrototypeSwitcher";
import { exampleNodes } from "../../prerequisites/data";
import {
  journeyStatus,
  type Phase,
  type PrototypeVariant,
  phaseFor,
  phaseStatus,
  phases,
  type Snapshot,
  variants,
} from "./model";
import { PrerequisiteStory } from "./prerequisite-story";
import "./styles.css";

type Demo = {
  snapshot: Snapshot;
  phase: Phase;
  setPhase: (phase: Phase) => void;
  move: (snapshot: Snapshot) => void;
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

function Preparation({ snapshot, move }: Demo) {
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
      result: incomplete
        ? "Requested · API and application records still missing"
        : "Example answers received · admin-network lookup passed",
      done: !incomplete,
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
      <details className="sp-disclosure">
        <summary>Inspect the saved DNS request and check scope</summary>
        <p>
          <strong>To: DNS team.</strong> Publish API and application records for{" "}
          <code>ocp5.dc.example.com</code>; owner and expected answers stay with
          this journey.
        </p>
        <pre>
          {
            "api.ocp5.dc.example.com        → 10.20.30.10\napi-int.ocp5.dc.example.com    → 10.20.30.10\n*.apps.ocp5.dc.example.com     → 10.20.30.11"
          }
        </pre>
        <p>
          Illustrative check: from <code>admin-probe-01</code> on the admin
          network, using resolver <code>10.20.10.53</code>. Test the API name
          and a sample <code>smoke.apps</code> name against the expected
          addresses. This does not establish target-host DNS reachability.
        </p>
        <p className="sp-muted">
          A drafted request and an owner’s completion report are separate from a
          technical check. No external ticket is created by this prototype.
        </p>
      </details>
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
            {snapshot.kind === "saved"
              ? "The cluster does not exist yet. Its journey does."
              : "Missing answers can wait. The work does not disappear."}
          </strong>
          <p>
            Keep the three completed items, two requests, their owners and the
            five-host plan together.
          </p>
          <div className="sp-actions">
            {snapshot.kind === "draft" ? (
              <button
                type="button"
                className="sp-primary"
                onClick={() => move({ kind: "saved" })}
              >
                Save incomplete journey
              </button>
            ) : (
              <button
                type="button"
                className="sp-primary"
                onClick={() => move({ kind: "ready" })}
              >
                Resume with example answers →
              </button>
            )}
          </div>
          <small>
            {snapshot.kind === "saved"
              ? "Continue the story: DNS answers arrive, a boot route is agreed, and the example pre-hook passes."
              : "Simulation only. Nothing is written to storage; refreshing resets this demo."}
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
          combination has not been exercised by the prototype.
        </p>
      </details>
      {blocked ? (
        <div className="sp-result sp-waiting">
          <strong>Waiting on preparation</strong>
          <p>
            Save and resume the missing prerequisites, or use the review
            controls above to jump to the manual-boot moment.
          </p>
        </div>
      ) : snapshot.kind === "ready" ? (
        <div className="sp-action-panel">
          <strong>Agent media is prepared by the proposed hub.</strong>
          <p>
            Explore a site that permits automated boot, or one that requires a
            person at the console.
          </p>
          <div className="sp-actions">
            <button
              type="button"
              className="sp-primary"
              onClick={() => move({ kind: "observing", boot: "automated" })}
            >
              Simulate automated boot →
            </button>
            <button type="button" onClick={() => move({ kind: "manual" })}>
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
            onClick={() => move({ kind: "observing", boot: "manual" })}
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
            onClick={() => move({ kind: "installed", boot: snapshot.boot })}
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
          <button type="button" onClick={() => move({ kind: "manual" })}>
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
            onClick={() => move({ kind: "complete", boot: snapshot.boot })}
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
            onClick={() => move({ kind: "failed", boot: snapshot.boot })}
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
                move({ kind: "failed", boot: snapshot.boot });
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

export function VariantA({ demo }: { demo: Demo }) {
  const selected =
    phases.find((phase) => phase.key === demo.phase) ?? phases[0];
  return (
    <div className="sp-story">
      <aside className="sp-rail">
        <span className="sp-label">One journey · Three chapters</span>
        <nav aria-label="Story phases">
          {phases.map((phase, index) => (
            <button
              type="button"
              key={phase.key}
              aria-current={demo.phase === phase.key ? "step" : undefined}
              onClick={() => demo.setPhase(phase.key)}
            >
              <span className="sp-phase-number">0{index + 1}</span>
              <span>
                <strong>{phase.name}</strong>
                <small>{phaseStatus(phase.key, demo.snapshot)}</small>
              </span>
              <span aria-hidden="true">→</span>
            </button>
          ))}
        </nav>
        <div className="sp-rail-note">
          <strong>The thread to follow</strong>
          <p>
            Saved intent → coordinated work → evidence of infrastructure
            readiness.
          </p>
          <p>Reading another chapter does not advance the example’s state.</p>
        </div>
      </aside>
      <article className="sp-story-chapter">
        <span className="sp-label">{selected?.name}</span>
        <h2>{selected?.title}</h2>
        <p className="sp-lead">{selected?.idea}</p>
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

export function VariantB({ demo }: { demo: Demo }) {
  const [expanded, setExpanded] = useState<Set<Phase>>(
    () => new Set([demo.phase]),
  );
  useEffect(() => {
    setExpanded((current) => new Set([...current, demo.phase]));
  }, [demo.phase]);
  return (
    <div className="sp-overview">
      <div className="sp-record">
        <div>
          <span className="sp-label">Saved journey · J-042</span>
          <h2>One record, from plan to readiness.</h2>
          <p>
            The plan, requests and results remain connected even when the work
            pauses or changes hands.
          </p>
        </div>
        <dl>
          <div>
            <dt>Journey owner</dt>
            <dd>Platform team</dd>
          </div>
          <div>
            <dt>Base cluster</dt>
            <dd>{phaseStatus("install", demo.snapshot)}</dd>
          </div>
          <div>
            <dt>Next responsibility</dt>
            <dd>
              {demo.snapshot.kind === "failed"
                ? "Network team · inspect failed hook"
                : demo.snapshot.kind === "manual"
                  ? "Infrastructure team · local boot"
                  : demo.snapshot.kind === "saved" ||
                      demo.snapshot.kind === "draft"
                    ? "DNS + Infrastructure teams"
                    : demo.snapshot.kind === "complete"
                      ? "Platform team · agreed handoff"
                      : "Platform team · continue example"}
            </dd>
          </div>
        </dl>
      </div>
      <div className="sp-overview-body">
        <div className="sp-accordions">
          {phases.map((phase, index) => (
            <section
              key={phase.key}
              className={`sp-phase-section ${phase.key === "post" && demo.snapshot.kind === "failed" ? "sp-phase-failed" : ""}`}
            >
              <h3>
                <button
                  type="button"
                  aria-expanded={expanded.has(phase.key)}
                  aria-controls={`sp-detail-${phase.key}`}
                  onClick={() =>
                    setExpanded((current) => {
                      const next = new Set(current);
                      if (next.has(phase.key)) next.delete(phase.key);
                      else next.add(phase.key);
                      return next;
                    })
                  }
                >
                  <span className="sp-phase-number">0{index + 1}</span>
                  <span>
                    <strong>{phase.name}</strong>
                    <small>{phase.idea}</small>
                  </span>
                  <span className="sp-phase-outcome">
                    {phaseStatus(phase.key, demo.snapshot)}
                  </span>
                  <span aria-hidden="true">
                    {expanded.has(phase.key) ? "−" : "+"}
                  </span>
                </button>
              </h3>
              {expanded.has(phase.key) && (
                <div id={`sp-detail-${phase.key}`} className="sp-expanded">
                  <PhaseContent phase={phase.key} demo={demo} />
                </div>
              )}
            </section>
          ))}
        </div>
        <aside className="sp-history">
          <span className="sp-label">Continuity in the example</span>
          <h3>What stays with the journey</h3>
          <ol>
            <li>
              <strong>Plan captured</strong>
              <p>Five hosts, the cluster identity and the intended outcome.</p>
            </li>
            <li>
              <strong>Incomplete work saved</strong>
              <p>
                DNS and boot access have owners; the completed answers stay.
              </p>
            </li>
            <li>
              <strong>Execution evidence added</strong>
              <p>
                Boot reports, installation results and hook runs remain
                distinct.
              </p>
            </li>
            <li>
              <strong>Failure retained</strong>
              <p>
                A retry adds a result without erasing the earlier failed run.
              </p>
            </li>
          </ol>
          <small>This is a story outline, not a live activity feed.</small>
        </aside>
      </div>
    </div>
  );
}

export function VariantC({ demo }: { demo: Demo }) {
  const inspect = (phase: Phase) => {
    demo.setPhase(phase);
    requestAnimationFrame(() => {
      document
        .getElementById("sp-timeline-detail")
        ?.scrollIntoView({ block: "start", behavior: "smooth" });
    });
  };
  return (
    <div className="sp-timeline">
      <div className="sp-timeline-heading">
        <div>
          <span className="sp-label">Coordination view</span>
          <h2>Follow the handoffs, not just the steps.</h2>
        </div>
        <p>
          Read downward through the phases and across the responsible parties.
          Select an event to inspect or continue that part of the example.
        </p>
      </div>
      <section
        className="sp-lane-scroll"
        aria-label="Coordinated journey timeline"
        // biome-ignore lint/a11y/noNoninteractiveTabindex: horizontal scroll container needs keyboard access
        tabIndex={0}
      >
        <div className="sp-lanes">
          <div className="sp-lane-head">
            <span>Phase</span>
            <strong>
              <span className="sp-lane-dot sp-customer-dot" /> Customer tasks
            </strong>
            <strong>
              <span className="sp-lane-dot sp-automation-dot" /> Automation
            </strong>
            <strong>
              <span className="sp-lane-dot sp-hook-dot" /> Hooks & results
            </strong>
          </div>
          {phases.map((phase, index) => (
            <div
              className={`sp-lane-row ${demo.phase === phase.key ? "sp-row-selected" : ""}`}
              key={phase.key}
            >
              <div className="sp-row-label">
                <span className="sp-phase-number">0{index + 1}</span>
                <strong>{phase.name}</strong>
                <small>{phaseStatus(phase.key, demo.snapshot)}</small>
              </div>
              {phase.key === "pre" ? (
                <>
                  <button
                    className="sp-event sp-customer"
                    type="button"
                    onClick={() => inspect("pre")}
                  >
                    <span className="sp-label">Platform + DNS teams</span>
                    <strong>Save the plan. Request missing answers.</strong>
                    <p>3 of 5 prerequisites captured → save → resume.</p>
                    <span className="sp-event-link">Inspect saved work ↗</span>
                  </button>
                  <button
                    className="sp-event sp-automation"
                    type="button"
                    onClick={() => inspect("pre")}
                  >
                    <span className="sp-label">Proposed hub</span>
                    <strong>Keep intent, owners and checks together.</strong>
                    <p>Scope the DNS check and establish the boot route.</p>
                    <span className="sp-event-link">Inputs ready →</span>
                  </button>
                  <button
                    className="sp-event sp-hook"
                    type="button"
                    onClick={() => inspect("pre")}
                  >
                    <span className="sp-label">Customer AAP</span>
                    <strong>site-readiness</strong>
                    <p>Required pre-hook gates the start of installation.</p>
                    <span className="sp-event-link">Inspect pre-hook ↗</span>
                  </button>
                </>
              ) : phase.key === "install" ? (
                <>
                  <button
                    className="sp-event sp-customer"
                    type="button"
                    onClick={() => inspect("install")}
                  >
                    <span className="sp-label">
                      Infrastructure team · if needed
                    </span>
                    <strong>Boot locally when BMC access is blocked.</strong>
                    <p>
                      Use the same Agent ISO. Report boot; preserve the journey.
                    </p>
                    <span className="sp-event-link">Manual handoff →</span>
                  </button>
                  <button
                    className="sp-event sp-automation"
                    type="button"
                    onClick={() => inspect("install")}
                  >
                    <span className="sp-label">Hub → BMC → hosts</span>
                    <strong>
                      Prepare media. Automate boot. Observe Agent.
                    </strong>
                    <p>Installation runs on target hosts, starting at cp-0.</p>
                    <span className="sp-event-link">
                      Inspect boot alternatives ↗
                    </span>
                  </button>
                  <button
                    className="sp-event sp-hook"
                    type="button"
                    onClick={() => inspect("install")}
                  >
                    <span className="sp-label">Installation evidence</span>
                    <strong>Base cluster installed</strong>
                    <p>
                      Separate from media attached, boot reported and journey
                      ready.
                    </p>
                    <span className="sp-event-link">Installation result →</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="sp-event sp-customer"
                    type="button"
                    onClick={() => inspect("post")}
                  >
                    <span className="sp-label">Network team · on failure</span>
                    <strong>Inspect the failed check. Repair and retry.</strong>
                    <p>
                      Continue from the required hook; keep the successful
                      installation.
                    </p>
                    <span className="sp-event-link">
                      Inspect owner action ↗
                    </span>
                  </button>
                  <button
                    className="sp-event sp-automation"
                    type="button"
                    onClick={() => inspect("post")}
                  >
                    <span className="sp-label">Proposed hub</span>
                    <strong>
                      Configure infrastructure. Aggregate results.
                    </strong>
                    <p>A required failure makes the journey need attention.</p>
                    <span className="sp-event-link">
                      Update journey status ←
                    </span>
                  </button>
                  <button
                    className={`sp-event sp-hook ${demo.snapshot.kind === "failed" ? "sp-event-failed" : ""}`}
                    type="button"
                    onClick={() => inspect("post")}
                  >
                    <span className="sp-label">Customer AAP · required</span>
                    <strong>workload-network-smoke</strong>
                    <p>
                      {demo.snapshot.kind === "failed"
                        ? "Failed: gateway timeout. Infrastructure is not ready."
                        : demo.snapshot.kind === "complete"
                          ? "Retry passed. The failed run remains in history."
                          : "Example outcome: a gateway timeout blocks readiness."}
                    </p>
                    <span className="sp-event-link">Inspect result ↗</span>
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </section>
      <p className="sp-timeline-key">
        Proposed sequence and handoffs, not a duration chart. Unreached events
        describe the story; the phase labels show the current example state.
      </p>
      <section id="sp-timeline-detail" className="sp-timeline-detail">
        <div className="sp-detail-heading">
          <span className="sp-label">Selected phase</span>
          <h3>{phases.find((phase) => phase.key === demo.phase)?.name}</h3>
          <p>{phaseStatus(demo.phase, demo.snapshot)}</p>
        </div>
        <PhaseContent phase={demo.phase} demo={demo} />
      </section>
    </div>
  );
}

export default function SolutionPrototype({
  variant,
  onVariant,
}: {
  variant: PrototypeVariant;
  onVariant: (variant: PrototypeVariant) => void;
}) {
  const [snapshot, setSnapshot] = useState<Snapshot>({ kind: "saved" });
  const [phase, setPhase] = useState<Phase>("pre");
  const move = (next: Snapshot) => {
    setSnapshot(next);
    setPhase(next.kind === "ready" ? "install" : phaseFor(next));
  };
  const demo: Demo = { snapshot, phase, setPhase, move };
  const currentVariant = variants.find((item) => item.key === variant);
  const status = journeyStatus(snapshot);
  if (variant === "A") return <PrerequisiteStory />;
  return (
    <main id="main-content" className="solution-prototype" tabIndex={-1}>
      <div className="sp-review-banner">
        <span>
          <strong>Layout lab</strong> · Throwaway prototype for Red Hat
          engineers
        </span>
        <a href="#/journey?view=opportunities">
          Open the opportunity catalog ↗
        </a>
      </div>
      <header className="sp-page-intro">
        <div>
          <span className="sp-label">
            Proposed solution · One installation journey
          </span>
          <h1 id="solution-prototype-title" tabIndex={-1}>
            From a saved plan to infrastructure ready.
          </h1>
          <p>
            Follow one planned cluster through preparation, Agent-based
            installation and required post-installation work.
          </p>
        </div>
        <div className="sp-variant-note">
          <span className="sp-label">
            Alternative {variant} · {currentVariant?.name}
          </span>
          <p>{currentVariant?.question}</p>
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
            upstream Metal3/Ironic documentation. This prototype does not
            establish a supported version or hardware combination.
          </p>
        </details>
      </div>
      <section className="sp-cluster-strip" aria-label="Shared example state">
        <div>
          <span className="sp-label">
            Same illustrative cluster in every layout
          </span>
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
          <span>Same state across A / B / C</span>
        </div>
        <div className="sp-actions">
          <button
            type="button"
            aria-pressed={
              snapshot.kind === "saved" || snapshot.kind === "draft"
            }
            onClick={() => move({ kind: "saved" })}
          >
            1 · Saved prerequisites
          </button>
          <button
            type="button"
            aria-pressed={snapshot.kind === "manual"}
            onClick={() => move({ kind: "manual" })}
          >
            2 · Manual boot
          </button>
          <button
            type="button"
            aria-pressed={snapshot.kind === "failed"}
            onClick={() => move({ kind: "failed", boot: "manual" })}
          >
            3 · Post-install failure
          </button>
          <button
            type="button"
            className="sp-reset"
            onClick={() => move({ kind: "draft" })}
          >
            Reset example
          </button>
        </div>
      </section>
      <section className="sp-phase-state" aria-label="Current phase results">
        {phases.map((item) => (
          <span key={item.key}>
            <strong>{item.short}</strong> {phaseStatus(item.key, snapshot)}
          </span>
        ))}
      </section>
      {variant === "B" ? <VariantB demo={demo} /> : <VariantC demo={demo} />}
      <p className="sp-prototype-footnote">
        Guided story (A) is the selected layout. The temporary Solution lab
        entry remains available for comparison; placement and the opportunity
        catalog’s future remain undecided. State lasts while this preview is
        open; leaving or reloading resets it. Final-page implementation is still
        pending.
      </p>
      <PrototypeSwitcher variant={variant} onVariant={onVariant} />
    </main>
  );
}
