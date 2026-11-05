import { useEffect, useState } from "react";
import { exampleNodes } from "../prerequisites/data";
import { DnsHandoff } from "./dns";
import {
  type DnsAttempt,
  type DnsRequest,
  dnsStatus,
  journeyStatus,
  type Phase,
  phaseFor,
  phaseStatus,
  phases,
  type Snapshot,
  sampleVerifiedDns,
} from "./model";
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
              ? "Saved in this preview. Read another chapter, then return here to continue. Leaving this page or refreshing resets the demo."
              : "Simulation only. Saving retains progress between story chapters; leaving this page or refreshing resets the demo."}
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
              onClick={() =>
                move({ ...snapshot, kind: "observing", boot: "automated" })
              }
            >
              Simulate automated boot →
            </button>
            <button
              type="button"
              onClick={() => move({ ...snapshot, kind: "manual" })}
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

export default function GuidedStoryPrototype({
  phase,
  onPhase,
}: {
  phase: Phase;
  onPhase: (phase: Phase) => void;
}) {
  const [snapshot, setSnapshot] = useState<Snapshot>({
    kind: "draft",
    dns: { kind: "needed" },
  });
  useEffect(() => {
    const dns = snapshot.dns;
    if (dns.kind !== "generating" && dns.kind !== "verifying") return;
    // Brief simulated work makes the request and verification transitions visible.
    const timer = window.setTimeout(
      () => {
        setSnapshot((current) => {
          if (
            current.dns !== dns ||
            (current.kind !== "draft" && current.kind !== "saved")
          )
            return current;
          if (dns.kind === "generating")
            return { ...current, dns: { kind: "requested" } };
          const attempts: DnsAttempt[] = [
            ...dns.attempts,
            dns.mismatch ? "failed" : "passed",
          ];
          return {
            ...current,
            dns: { kind: dns.mismatch ? "failed" : "verified", attempts },
          };
        });
      },
      dns.kind === "generating" ? 600 : 1000,
    );
    return () => window.clearTimeout(timer);
  }, [snapshot.dns]);
  const updateDns = (dns: DnsRequest) => {
    setSnapshot((current) =>
      current.kind === "draft" || current.kind === "saved"
        ? { ...current, dns }
        : current,
    );
  };
  const move = (next: Snapshot) => {
    setSnapshot(next);
    onPhase(next.kind === "ready" ? "install" : phaseFor(next));
  };
  const demo: Demo = { snapshot, phase, setPhase: onPhase, move, updateDns };
  const status = journeyStatus(snapshot);
  return (
    <main id="main-content" className="guided-story-prototype" tabIndex={-1}>
      <div className="sp-review-banner">
        <span>
          <strong>Guided story A</strong> · Restored prototype for Red Hat
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
          <h1 id="guided-story-title" tabIndex={-1}>
            From a saved plan to infrastructure ready.
          </h1>
          <p>
            Follow one planned cluster through preparation, Agent-based
            installation and required post-installation work.
          </p>
        </div>
        <div className="sp-variant-note">
          <span className="sp-label">Earlier layout · Guided story A</span>
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
            upstream Metal3/Ironic documentation. This prototype does not
            establish a supported version or hardware combination.
          </p>
        </details>
      </div>
      <section className="sp-cluster-strip" aria-label="Shared example state">
        <div>
          <span className="sp-label">
            Illustrative cluster · Original example
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
        {phases.map((item) => (
          <span key={item.key}>
            <strong>{item.short}</strong> {phaseStatus(item.key, snapshot)}
          </span>
        ))}
      </section>
      <GuidedStory demo={demo} />
      <p className="sp-prototype-footnote">
        Guided story A with an unfolding DNS handoff, for comparison with the
        current Solution example. All results are simulated. State lasts while
        this page is open; leaving or reloading resets it. This page does not
        read or change the saved Solution example.
      </p>
    </main>
  );
}
