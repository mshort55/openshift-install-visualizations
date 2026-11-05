import { type ReactNode, useRef, useState } from "react";
import { follow } from "../../app/links";
import { type AppRoute, appHref, defaultPrerequisites } from "../../app/routes";
import { ShareView } from "../../app/ShareView";
import { contextRoute, storyContexts } from "./links";
import { type Chapter, chapters, scenes } from "./model";
import {
  initialPreparation,
  type PreparationState,
  preparationView,
  updatePreparation,
} from "./preparation";
import {
  completedScope,
  initialReadiness,
  type ReadinessState,
  readinessView,
  recoverReadiness,
} from "./readiness";
import "./styles.css";

export function useSolutionSession() {
  const [opened, setOpened] = useState<Set<string>>(() => new Set());
  const [preparation, setPreparation] =
    useState<PreparationState>(initialPreparation);
  const [bootRoute, setBootRoute] = useState<"automated" | "local">(
    "automated",
  );
  const [readiness, setReadiness] = useState<ReadinessState>(initialReadiness);
  return {
    opened,
    setOpened,
    preparation,
    setPreparation,
    bootRoute,
    setBootRoute,
    readiness,
    setReadiness,
  };
}

type Session = ReturnType<typeof useSolutionSession>;
type DetailProps = { id: string; title: string; children: ReactNode };

function Detail({
  id,
  title,
  children,
  session,
}: DetailProps & { session: Session }) {
  return (
    <details
      open={session.opened.has(id)}
      onToggle={(event) => {
        const open = event.currentTarget.open;
        session.setOpened((current) => {
          if (current.has(id) === open) return current;
          const next = new Set(current);
          if (open) next.add(id);
          else next.delete(id);
          return next;
        });
      }}
    >
      <summary data-focus={`solution-detail-${id}`}>{title}</summary>
      <div className="solution-detail">{children}</div>
    </details>
  );
}

function Assumptions() {
  return (
    <>
      <p>
        The recorded baseline is OCP 4.22 and the matching OpenShift
        Virtualization example accepted in the November 2026 research. These are
        illustrative assumptions, not a new compatibility certification.
      </p>
      <p>
        Eligible bare-metal workers have hardware virtualization enabled and
        confirmed capacity. The existing supported CSI backend supplies the
        deployment-specific <code>vm-storage</code> class/profile with RWX/Block
        and Delete reclaim for test PVCs. Capacity and access require site
        evidence; this is not a universal storage prescription.
      </p>
      <p>
        One disposable Linux VM uses image fixture <code>linux-smoke-v1</code>,
        2 vCPU / 4 GiB, separate root and data PVCs, and the default pod network
        with masquerade. This illustrates a check, not production sizing.
        Customer automation uses approved cluster API/SSH access for guest
        checks. No extra inbound VM load balancer, physical secondary network or
        NMState policy is selected.
      </p>
    </>
  );
}

function VerifiedScope() {
  const { preservedResults } = readinessView({ state: initialReadiness });
  return (
    <ul>
      {[
        ...preservedResults,
        ...completedScope.checks,
        completedScope.cleanup,
      ].map((result) => (
        <li key={result}>{result}</li>
      ))}
    </ul>
  );
}

function HookAttempts({ state }: { state: ReadinessState }) {
  return (
    <>
      <p>
        Illustrative attempts · 4 November 2026. Customer Ansible automation
        controller → approved cluster API/SSH access → <code>virt-smoke</code>{" "}
        guest → existing fixture <code>10.20.60.20:443</code>. References below
        are sample artifacts, not live links.
      </p>
      <ol aria-label="Customer hook attempts">
        {readinessView({ state }).attempts.map((attempt) => (
          <li key={attempt.reference}>
            <strong>{attempt.time}</strong> · <code>{attempt.reference}</code>
            <p>{attempt.result}</p>
          </li>
        ))}
      </ol>
    </>
  );
}

function CompletionEvidence() {
  return (
    <>
      <p>
        Illustrative evidence · 4 November 2026. Customer pre-hook{" "}
        <code>site-validation</code> job 880 passed reservation, VLAN, firewall,
        routing, NTP and registry checks from <code>site-admin-01</code> before
        boot. Sample reference: <code>demo://aap/site-validation/880</code>.
        Core health checks found five nodes Ready and Cluster Operators
        available and not degraded. HyperConverged configuration was Available,
        Progressing=False, Degraded=False; CSI test volumes provisioned and
        attached.
      </p>
      <p>
        At 11:18 UTC, proposed Red Hat checks used approved API-mediated SSH:
        the guest returned hostname <code>virt-smoke</code> and exit 0. On the
        separate PVC-backed data disk, write <code>edge-east-smoke-ok</code>,
        flush, close, reopen and read matched. Test pods pulled the image and
        scheduled on both workers; pod service DNS and cross-node responses
        matched. From <code>app-probe-01</code>, resolver{" "}
        <code>10.20.10.53</code> resolved{" "}
        <code>smoke.apps.edge-east.dc.example.com</code> through the existing
        application wildcard to <code>10.20.30.11</code>; HTTPS returned 200 /{" "}
        <code>edge-east-smoke-ok</code>. Guest-network acceptance came from
        customer job 882.
      </p>
      <p>
        At 11:19 UTC, Platform / Storage observation verified removal of the
        VM/VMI, root/data DataVolumes, test PVCs and temporary backend volumes,
        namespace <code>journey-smoke</code>, pods, Route, Service and temporary
        access resources. Configured Virtualization and <code>vm-storage</code>{" "}
        remain; result artifacts are retained. No cleanup failure remains.
      </p>
    </>
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
  const preparation = preparationView({ state: session.preparation });
  const readiness = readinessView({ state: session.readiness });
  const scene =
    chapter === "preparation"
      ? preparation
      : chapter === "readiness"
        ? readiness
        : scenes[chapter];
  const apiInput = useRef<HTMLInputElement>(null);
  const recoveryHeading = useRef<HTMLHeadingElement>(null);
  const saved = session.preparation.kind === "saved";
  const localBoot = session.bootRoute === "local";
  const detail = (props: DetailProps) => (
    <Detail {...props} session={session} />
  );
  const chapterLink = ({
    next,
    label = scenes[next].label,
    focusId = `chapter-${next}`,
  }: {
    next: Chapter;
    label?: string;
    focusId?: string;
  }) => (
    <a
      href={appHref({ page: "solution-example", chapter: next })}
      data-focus={focusId}
      aria-current={next === chapter ? "step" : undefined}
      onClick={(event) => follow(event, () => onRead(next))}
    >
      {label}
    </a>
  );
  return (
    <main id="main-content" tabIndex={-1} className="solution-page">
      <header className="solution-heading">
        <div>
          <p className="solution-eyebrow">Proposed installation journey</p>
          <h1>Solution example</h1>
          <p>
            Six moments in one illustrative journey. Read any chapter
            independently; later samples assume their stated earlier work and do
            not resolve another scene.
          </p>
        </div>
        <ShareView route={{ page: "solution-example", chapter }} />
      </header>
      <div className="solution-layout">
        <nav className="solution-chapters" aria-label="Solution chapters">
          {["Pre-installation", "Installation", "Post-installation"].map(
            (phase) => (
              <div
                key={phase}
                aria-current={scene.phase === phase ? "step" : undefined}
              >
                <p>
                  {phase}
                  {scene.phase === phase && <span> · Current phase</span>}
                </p>
                <ol>
                  {chapters
                    .filter((item) => scenes[item].phase === phase)
                    .map((item) => (
                      <li key={item}>{chapterLink({ next: item })}</li>
                    ))}
                </ol>
              </div>
            ),
          )}
        </nav>
        <article
          className="solution-scene"
          aria-labelledby={`solution-chapter-${chapter}`}
        >
          <p className="solution-eyebrow">
            {scene.phase} · Illustrative example
          </p>
          <h2
            id={`solution-chapter-${chapter}`}
            data-focus={`solution-chapter-${chapter}`}
            tabIndex={-1}
          >
            {scene.title}
          </h2>
          <section className="solution-outcomes" aria-label="Scene outcomes">
            <h3>
              {chapter === "reuse"
                ? "Completed source · edge-east"
                : chapter === "preparation"
                  ? preparation.identity
                  : "edge-east"}
            </h3>
            <dl>
              <div>
                <dt>Journey status</dt>
                <dd>{scene.status}</dd>
              </div>
              <div>
                <dt>Cluster installation</dt>
                <dd>{scene.installation}</dd>
              </div>
            </dl>
          </section>
          {chapter === "introduction" && (
            <>
              <p>
                A planned cluster with three control-plane hosts and two workers
                needs more than an installer. The proposed installation journey
                keeps the plan, owner requests, customer automation and scoped
                readiness evidence together.
              </p>
              <h3>Agent installation, coordinated from a hub</h3>
              <p>
                Declarative configuration, prepared Agent boot media and local
                installation services provide the foundation. A proposed hub
                prepares configuration and artifacts, coordinates external work
                and observes progress, so continuity need not depend on a
                customer's laptop. The installation service runs on rendezvous
                host <code>cp-0</code>; the hub coordinates it.
              </p>
              <h3>Customer hooks and proposed Red Hat content</h3>
              <p>
                The existing customer <code>site-validation</code> Ansible job
                supplies named site checks before boot. After Virtualization
                configuration, their <code>vm-network-validation</code> job
                tests the guest network. Proposed Red Hat content supplies
                contextual preflight, capability configuration, smoke checks,
                cleanup and the infrastructure handoff. Content provider and
                execution mechanism are separate; not all content needs Ansible.
              </p>
              <p>
                Follow incomplete preparation, automated Agent ISO boot and a
                failed customer hook after installation. The concluding samples
                show a scoped handoff and reusable plan.
              </p>
              <p className="solution-note">
                All behavior and results are simulated. No infrastructure or
                external service is contacted. The saved journey is a product
                concept; this explainer retains reading context and
                demonstration state only while this document is open.
              </p>
              {detail({
                id: "foundation",
                title: "Technical baseline and integration limits",
                children: (
                  <>
                    <p>
                      Agent capabilities are documented. Metal3/Ironic and
                      Redfish virtual media are foundations for a proposed
                      integration, not a certified drop-in combination. Generic
                      journey hooks are proposed orchestration, not native Agent
                      hook APIs.
                    </p>
                    <p>
                      Hub-to-BMC, BMC-to-media and
                      hub-to-installation-observation are distinct paths.
                      Ordinary Agent media is installation media, not a promised
                      non-destructive preflight-only environment.
                    </p>
                    <Assumptions />
                  </>
                ),
              })}
            </>
          )}
          {chapter === "preparation" && (
            <>
              <p>
                <strong>{preparation.owner}</strong> owns the API allocation and
                client DNS publication.{" "}
                {preparation.apiAddress
                  ? "Next: confirm publication and run the prerequisite checks; owners must still confirm the checklist."
                  : "Next: obtain the missing API address from IPAM. You can save preparation with this gap."}
              </p>
              <dl className="solution-facts">
                <div>
                  <dt>Base domain</dt>
                  <dd>{preparation.baseDomain}</dd>
                </div>
                <div>
                  <dt>
                    <label htmlFor="solution-api-address">API address</label>
                  </dt>
                  <dd>
                    <input
                      id="solution-api-address"
                      data-focus="solution-preparation-api"
                      ref={apiInput}
                      value={preparation.apiAddress}
                      readOnly
                      aria-describedby="solution-api-help"
                    />
                    <p id="solution-api-help" className="solution-api-help">
                      {preparation.apiAddress
                        ? "Sample IPAM allocation — verification still required."
                        : saved
                          ? "Missing — awaiting IPAM. Resume to use the sample answer."
                          : "Missing — awaiting IPAM. Use the sample answer to fill this example."}
                    </p>
                  </dd>
                </div>
                <div>
                  <dt>Ingress address</dt>
                  <dd>{preparation.ingressAddress}</dd>
                </div>
                <div>
                  <dt>Resolver</dt>
                  <dd>{preparation.resolver}</dd>
                </div>
              </dl>
              <div className="solution-preparation-actions">
                <button
                  type="button"
                  data-focus="solution-preparation-save-resume"
                  onClick={() =>
                    session.setPreparation((state) =>
                      updatePreparation({
                        state,
                        action: saved ? "resume" : "save",
                      }),
                    )
                  }
                >
                  {saved ? "Resume preparation" : "Save preparation"}
                </button>
                {!saved && !preparation.apiAddress && (
                  <button
                    type="button"
                    data-focus="solution-preparation-sample"
                    onClick={() => {
                      session.setPreparation((state) =>
                        updatePreparation({ state, action: "supply-sample" }),
                      );
                      apiInput.current?.focus();
                    }}
                  >
                    Use sample IPAM answer: 10.20.30.12
                  </button>
                )}
              </div>
              <p
                role="status"
                aria-atomic="true"
                id="solution-preparation-status"
              >
                {preparation.message}
              </p>
              <p className="solution-note">
                DNS checks: <strong>{preparation.dns}</strong>. Infrastructure
                readiness: <strong>{preparation.readiness}</strong>. Saving or
                supplying an address does not run checks or install the cluster.
                This session-only demonstration resets on reload.
              </p>
              <h3>A representative checklist</h3>
              <p>
                Suggested defaults are starting points, not passed checks. The
                proposed checklist can be customized for static addressing or
                site change approval.
              </p>
              <ul className="solution-checklist">
                <li>
                  <strong>
                    Hosts and topology · Platform / Site operations
                  </strong>
                  <br />
                  Three control-plane hosts and two workers. Confirm identities,
                  NICs and installation disks.
                </li>
                <li>
                  <strong>Addresses and client DNS · Network team</strong>
                  <br />
                  DHCP reservations, managed API/ingress VIPs and site DNS.{" "}
                  {preparation.apiAddress
                    ? "Sample API allocation supplied; DNS verification outstanding."
                    : "API address missing."}
                </li>
                <li>
                  <strong>Boot and management access · Site operations</strong>
                  <br />
                  Prepared Agent ISO and known BMC/media paths. Approved access
                  determines the boot route.
                </li>
                <li>
                  <strong>Site preflight · Network team</strong>
                  <br />
                  Existing customer <code>site-validation</code> automation.
                  Name the checks and execution context.
                </li>
                <li>
                  <strong>
                    Virtualization prerequisites · Platform / Storage teams
                  </strong>
                  <br />
                  Eligible workers and existing supported CSI storage. Confirm
                  capacity, access and selected profile.
                </li>
              </ul>
              <h3>Sample DNS request</h3>
              <p>
                <strong>
                  Later sample — assumes IPAM supplied 10.20.30.12.
                </strong>{" "}
                This ready-written request is independent of the demonstration
                above. Network team: publish these records for{" "}
                <code>edge-east</code> before the planned installation and
                client access, through resolver <code>10.20.10.53</code> for the
                admin/client network.
              </p>
              <dl className="solution-facts">
                <div>
                  <dt>
                    <code>api.edge-east.dc.example.com</code>
                  </dt>
                  <dd>10.20.30.12</dd>
                </div>
                <div>
                  <dt>
                    <code>*.apps.edge-east.dc.example.com</code>
                  </dt>
                  <dd>10.20.30.11</dd>
                </div>
              </dl>
              <p>
                Acceptance: from <code>admin-probe-01</code> on the admin/client
                network, query the API name and{" "}
                <code>smoke.apps.edge-east.dc.example.com</code> through
                resolver <code>10.20.10.53</code> over UDP and TCP. Both must
                return the expected addresses.
              </p>
              <ol>
                <li>
                  <strong>Owned wait:</strong> Network team publishes the
                  records.
                </li>
                <li>
                  <strong>Reported:</strong> Network team reports publication
                  and closes the request. This permits verification.
                </li>
                <li>
                  <strong>Checked separately:</strong> the sample client DNS
                  probes return the expected answers. Closure alone does not
                  prove readiness.
                </li>
              </ol>
              <p>
                The sample result establishes client DNS publication from that
                context, not target-host DNS, API connectivity or application
                readiness.
              </p>
              {detail({
                id: "dns-evidence",
                title: "Sample DNS commands, results and affected rechecks",
                children: (
                  <>
                    <p>
                      Illustrative result · 4 November 2026, 10:21 UTC ·
                      admin-probe-01
                    </p>
                    <section aria-label="Sample DNS commands and output">
                      <pre>{`dig @10.20.10.53 api.edge-east.dc.example.com A +short\n# UDP: 10.20.30.12\ndig @10.20.10.53 api.edge-east.dc.example.com A +tcp +short\n# TCP: 10.20.30.12\ndig @10.20.10.53 smoke.apps.edge-east.dc.example.com A +short\n# UDP: 10.20.30.11\ndig @10.20.10.53 smoke.apps.edge-east.dc.example.com A +tcp +short\n# TCP: 10.20.30.11`}</pre>
                    </section>
                    <p>
                      Changing an API value requires its lookup and dependent
                      readiness to be checked again. Historical evidence and
                      unaffected checks remain usable. Changing only an owner
                      does not invalidate technical evidence.
                    </p>
                  </>
                ),
              })}
            </>
          )}
          {chapter === "installation" && (
            <>
              <p className="solution-note">
                <strong>Later in this journey:</strong> preparation and
                applicable pre-hooks are assumed satisfied. This scene begins
                with the same five hosts and prepared Agent ISO.
              </p>
              <h3 id="solution-boot-comparison">Compare boot routes</h3>
              <fieldset
                className="solution-boot-options"
                aria-labelledby="solution-boot-comparison"
              >
                <button
                  type="button"
                  aria-pressed={!localBoot}
                  data-focus="solution-boot-automated"
                  onClick={() => session.setBootRoute("automated")}
                >
                  Automated boot
                </button>
                <button
                  type="button"
                  aria-pressed={localBoot}
                  data-focus="solution-boot-local"
                  onClick={() => session.setBootRoute("local")}
                >
                  Guided local-BMC boot
                </button>
              </fieldset>
              <p>
                Same <code>edge-east</code> configuration r3 · three
                control-plane hosts and two workers · prepared Agent ISO{" "}
                <code>agent.x86_64.iso</code>, media revision r3.
              </p>
              {localBoot ? (
                <p>
                  Hub-to-BMC access is blocked. Site operations has approved
                  local BMC access from <code>site-admin-01</code>; each BMC can
                  retrieve the same ISO. Hub installation observation remains
                  available. The wait and continuation below belong to the same
                  journey; installation has not failed or restarted.
                </p>
              ) : (
                <p>
                  Site operations has established hub-to-BMC access,
                  authentication and hardware capability for virtual media and
                  one-time boot; each BMC can retrieve the ISO. The proposed hub
                  integration coordinates attachment and boot.
                </p>
              )}
              <h3>Illustrative progression</h3>
              <ol
                className="solution-checklist"
                aria-label="Boot and installation progression"
              >
                <li>
                  <strong>Prepare:</strong> configuration and customer{" "}
                  <code>site-validation</code> checks accepted.
                </li>
                <li>
                  <strong>Generate:</strong> Agent ISO prepared for{" "}
                  <code>edge-east</code>, media revision r3. Prepared media is
                  not yet attached to a host.
                </li>
                {localBoot && (
                  <li>
                    <strong>
                      Waiting on Site operations — mount media and boot hosts.
                    </strong>{" "}
                    Use approved local BMC access and the retained instructions.
                    The following observations illustrate continuation after
                    this work.
                  </li>
                )}
                <li>
                  <strong>Media attachment and boot request:</strong>{" "}
                  {localBoot ? (
                    <>
                      Site operations reports ISO r3 attached and one-time boot
                      performed on all five hosts, with local BMC readback and
                      console evidence. This human report is separate from hub
                      observation and does not establish observed boot.
                    </>
                  ) : (
                    <>
                      BMC readback confirms ISO r3 attached on all five hosts;
                      one-time boot requests are acknowledged. Attachment and
                      command acknowledgements do not establish observed boot.
                    </>
                  )}
                </li>
                <li>
                  <strong>Observed Agent activity:</strong> the hub observer
                  sees fresh activity matching <code>cp-0</code>,{" "}
                  <code>cp-1</code>, <code>cp-2</code>, <code>worker-0</code>{" "}
                  and <code>worker-1</code>. This establishes host boot, not
                  installation completion.
                </li>
                <li>
                  <strong>Observed installation completion:</strong> a separate
                  result establishes cluster installation completed successfully
                  for the retained inputs. Journey status remains Ready to run —
                  required post-installation work.
                </li>
              </ol>
              <p>
                <strong>Next action · Platform team:</strong> configure
                Virtualization and verify the agreed infrastructure scope,
                including the required customer hook.
              </p>
              {localBoot &&
                detail({
                  id: "local-boot-instructions",
                  title: "Local boot instructions for Site operations",
                  children: (
                    <>
                      <p>
                        Owner: Site operations. Use approved local BMC access
                        from <code>site-admin-01</code>. These example addresses
                        and console labels illustrate the handoff; use the
                        equivalent controls on the approved hardware.
                      </p>
                      <h4>Five-host BMC mapping</h4>
                      <dl
                        className="solution-facts"
                        aria-label="Example host to BMC mapping"
                      >
                        <div>
                          <dt>cp-0 · Control plane / rendezvous</dt>
                          <dd>
                            <code>10.20.40.20</code>
                          </dd>
                        </div>
                        <div>
                          <dt>cp-1 · Control plane</dt>
                          <dd>
                            <code>10.20.40.21</code>
                          </dd>
                        </div>
                        <div>
                          <dt>cp-2 · Control plane</dt>
                          <dd>
                            <code>10.20.40.22</code>
                          </dd>
                        </div>
                        <div>
                          <dt>worker-0 · Worker</dt>
                          <dd>
                            <code>10.20.40.30</code>
                          </dd>
                        </div>
                        <div>
                          <dt>worker-1 · Worker</dt>
                          <dd>
                            <code>10.20.40.31</code>
                          </dd>
                        </div>
                      </dl>
                      <ol
                        className="solution-checklist"
                        aria-label="Local boot instructions"
                      >
                        <li>
                          Match the hosts and installation disks to the retained{" "}
                          <code>edge-east</code> plan and approved installation
                          window. Ordinary Agent media starts installation; it
                          is not a non-destructive preflight-only environment.
                        </li>
                        <li>
                          On each BMC, use Virtual media → CD/DVD → Image URL to
                          attach the same prepared <code>agent.x86_64.iso</code>
                          , revision r3. Example media address (not a live
                          link):{" "}
                          <code>
                            https://media.example.invalid/edge-east/r3/agent.x86_64.iso
                          </code>
                          . Confirm the expected r3 image identity and attached
                          state in BMC readback. Each BMC retrieves this ISO.
                        </li>
                        <li>
                          Select one-time boot from virtual CD/DVD using the
                          saved UEFI setting. Boot rendezvous host{" "}
                          <code>cp-0</code>, then <code>cp-1</code>,{" "}
                          <code>cp-2</code>, <code>worker-0</code> and{" "}
                          <code>worker-1</code>. Keep the persistent disk boot
                          order unchanged.
                        </li>
                        <li>
                          Check each console for the Agent environment. Return a
                          Site operations report with cluster and host
                          identities, configuration/media revision r3, BMC
                          attachment readback, boot times, console results and
                          source location <code>site-admin-01</code>. Retain
                          that local evidence; available hub observation
                          separately establishes Agent activity and installation
                          completion.
                        </li>
                      </ol>
                    </>
                  ),
                })}
              {detail({
                id: "boot-evidence",
                title: "Access paths and sample observations",
                children: (
                  <>
                    <p>
                      Illustrative evidence · 4 November 2026:{" "}
                      {localBoot
                        ? "Site operations report at 11:02 UTC from site-admin-01, including local BMC readback at 11:01 UTC."
                        : "BMC readback at 11:01 UTC collected by the proposed hub integration."}{" "}
                      Separately observed fresh host Agent activity at 11:03 UTC
                      and installation completion at 11:05 UTC come from{" "}
                      <code>hub-install-01</code> using the retained original
                      install directory <code>/journeys/edge-east/r3</code>. The
                      installation service remains on rendezvous host{" "}
                      <code>cp-0</code>; the hub coordinates and observes it.
                    </p>
                    <ul>
                      <li>
                        <strong>Hub → BMC:</strong> management access for media
                        attachment and boot; blocked in the local route.
                      </li>
                      <li>
                        <strong>BMC → media:</strong> each BMC retrieves the
                        ISO; required in both routes, including local boot.
                      </li>
                      <li>
                        <strong>Hub → installation observation:</strong>{" "}
                        available in both routes, separately from management
                        access.
                      </li>
                    </ul>
                    <p>
                      Agent configuration, ISO generation, on-node installation
                      and completion commands are documented capabilities.
                      Metal3/Ironic and Redfish virtual media are foundations
                      for the proposed hub integration, not a certified drop-in
                      combination. Ordinary Agent media is installation media,
                      not a promised non-destructive preflight environment.
                    </p>
                  </>
                ),
              })}
            </>
          )}
          {chapter === "readiness" && (
            <>
              <p className="solution-note">
                <strong>Later in this journey:</strong> cluster installation and
                Virtualization configuration succeeded. Disposable Linux VM{" "}
                <code>virt-smoke</code> was created; the required customer hook
                failed.{" "}
                {readiness.completion &&
                  "The recovery below continues from that failure."}
              </p>
              <h3>
                Configure Virtualization → run customer smoke test → failure
              </h3>
              <p>
                The existing customer Ansible job{" "}
                <code>vm-network-validation</code> resolved{" "}
                <code>app-probe-01.dc.example.com</code> to{" "}
                <code>10.20.60.20</code> from the guest, but HTTPS to{" "}
                <code>/health</code> timed out.
              </p>
              <dl className="solution-facts">
                <div>
                  <dt>Expected result</dt>
                  <dd>
                    HTTP 200 · <code>edge-east-smoke-ok</code>
                  </dd>
                </div>
                <div>
                  <dt>Recovery owner</dt>
                  <dd>Network team</dd>
                </div>
                <div>
                  <dt>
                    {readiness.completion ? "Next action" : "Required repair"}
                  </dt>
                  <dd>
                    {readiness.completion
                      ? "Application team requests access and validates its workloads."
                      : "Correct the egress firewall rule, then retry this customer hook and verify its declared checks."}
                  </dd>
                </div>
              </dl>
              <h3
                ref={recoveryHeading}
                tabIndex={-1}
                data-focus="solution-recovery-result"
              >
                {readiness.completion
                  ? "Recovery and verification results"
                  : "Recover the customer hook"}
              </h3>
              <p>
                A repair report alone leaves the hook failed and unverified.
                Retry targets this hook, preserving successful cluster
                installation, Virtualization configuration and unrelated passing
                evidence. It never reinstalls the cluster. Required work cannot
                be skipped or waived to clear the failure.
              </p>
              {!readiness.completion && (
                <div className="solution-recovery-actions">
                  <button
                    type="button"
                    data-focus="solution-recover"
                    onClick={() => {
                      session.setReadiness(recoverReadiness());
                      recoveryHeading.current?.focus();
                    }}
                  >
                    Show recovery and retry
                  </button>
                </div>
              )}
              <p role="status" aria-atomic="true" id="solution-recovery-status">
                {readiness.completion &&
                  "Recovery shown. Customer hook passed; agreed checks and cleanup verified. Journey complete within the sample scope. Cluster installation remains successful."}
              </p>
              {readiness.completion ? (
                <>
                  <ol aria-label="Illustrative recovery">
                    <li>
                      <strong>Repair reported.</strong> Network team corrects
                      the firewall rule for the observed worker egress source to{" "}
                      <code>10.20.60.20</code> TCP/443 (sample NET-208). The
                      report permits retry; it does not pass the hook.
                    </li>
                    <li>
                      <strong>Targeted retry passed.</strong> Existing customer
                      Ansible job 882 runs against the same{" "}
                      <code>virt-smoke</code> guest. Job execution succeeds and
                      declared checks pass: DNS returns <code>10.20.60.20</code>
                      ; HTTPS <code>/health</code> returns HTTP 200 /{" "}
                      <code>edge-east-smoke-ok</code>. Failed attempt 881 is
                      retained below.
                    </li>
                    <li>
                      <strong>Remaining scope verified.</strong> Proposed Red
                      Hat content supplies the guest, storage and platform smoke
                      checks, cleanup and sample handoff. Content provider is
                      separate from execution mechanism; it need not all be
                      Ansible.
                    </li>
                  </ol>
                  <h3>Verified scope and cleanup</h3>
                  <VerifiedScope />
                  <p>{readiness.completion.handoff}</p>
                  <p>
                    Infrastructure readiness is limited to these dated checks.
                    Live migration, HA, performance, application migration and
                    general application readiness were not tested. Completion is
                    not an ongoing availability guarantee.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Completion also requires the remaining guest, storage and
                    platform checks, verified cleanup and a scoped handoff.
                    These results are not yet verified in this failed scene.
                  </p>
                  <h3>Earlier passing evidence retained</h3>
                  <ul>
                    {readiness.preservedResults.map((result) => (
                      <li key={result}>{result}</li>
                    ))}
                  </ul>
                </>
              )}
              <p>
                A job launch, Running VM or aggregate workflow-success badge
                alone cannot establish the declared checks or Complete. Generic
                journey hooks are proposed orchestration, not native Agent hook
                APIs. All results here are illustrative.
              </p>
              {detail({
                id: "hook-evidence",
                title: "Hook attempt history and execution context",
                children: <HookAttempts state={session.readiness} />,
              })}
              {readiness.completion &&
                detail({
                  id: "readiness-verification",
                  title: "Verification and cleanup evidence",
                  children: <CompletionEvidence />,
                })}
              {detail({
                id: "readiness-assumptions",
                title: "Storage, network and readiness assumptions",
                children: <Assumptions />,
              })}
              <p>
                {chapterLink({
                  next: "handoff",
                  label: "View sample handoff",
                  focusId: "solution-sample-handoff",
                })}{" "}
                reads the concluding scene; it does not generate a document,
                perform cleanup or resolve a failed hook here.
              </p>
            </>
          )}
          {chapter === "handoff" && (
            <>
              <p className="solution-note">
                <strong>After successful recovery and verification:</strong>{" "}
                this completed sample assumes required checks and cleanup were
                verified. Reading it does not clear the failed hook in the
                readiness scene.
              </p>
              <p>
                OCP 4.22 / matching OpenShift Virtualization · three
                control-plane hosts and two workers · infrastructure ready
                within the agreed scope.
              </p>
              <dl className="solution-facts">
                <div>
                  <dt>Infrastructure owner</dt>
                  <dd>Platform team</dd>
                </div>
                <div>
                  <dt>Application recipient</dt>
                  <dd>Application team</dd>
                </div>
              </dl>
              <h3>Verified scope and cleanup</h3>
              <VerifiedScope />
              <h3>Access and ownership</h3>
              <p>
                Request namespace RBAC, approved access references, capacity and
                incident contacts from Platform team. For VM access, request an
                approved SSH credential reference and connect through the
                cluster API using <code>virtctl</code>. The test VM has been
                deleted; no secrets are included.
              </p>
              <dl className="solution-facts">
                <div>
                  <dt>Sample API</dt>
                  <dd>
                    <code>https://api.edge-east.dc.example.com:6443</code>
                  </dd>
                </div>
                <div>
                  <dt>Sample console</dt>
                  <dd>
                    <code>
                      https://console-openshift-console.apps.edge-east.dc.example.com
                    </code>
                  </dd>
                </div>
              </dl>
              <h3>Evidence context</h3>
              <p>
                Illustrative evidence · 4 November 2026, 10:21–11:19 UTC. Client
                DNS was checked from <code>admin-probe-01</code>;{" "}
                <code>hub-install-01</code> observed installation. Customer
                automation checked the VM guest; Platform / Storage checks
                established guest data I/O, platform smoke results and cleanup.
              </p>
              {detail({
                id: "handoff-evidence",
                title: "Hook attempts and scoped result details",
                children: (
                  <>
                    <HookAttempts state={{ kind: "recovered" }} />
                    <CompletionEvidence />
                  </>
                ),
              })}
              {detail({
                id: "handoff-assumptions",
                title: "Selected capability and test assumptions",
                children: <Assumptions />,
              })}
              <h3>Application team: validate your workloads next</h3>
              <p>
                Platform team retains infrastructure responsibility. Application
                team requests access and validates its own images, data,
                policies and application behavior. Live migration, HA,
                performance, application migration and general application
                readiness were not tested. This dated evidence is not an ongoing
                availability guarantee. No acknowledgement gate is required.
              </p>
            </>
          )}
          {chapter === "reuse" && (
            <>
              <p className="solution-note">
                <strong>Later sample:</strong> completed <code>edge-east</code>{" "}
                supplies a reusable definition. A fresh <code>edge-west</code>{" "}
                has no inherited execution or evidence.
              </p>
              <h3>Five-host virtualization-ready deployment</h3>
              <section
                className="solution-outcomes"
                aria-label="Fresh west outcomes"
              >
                <h3>New plan · edge-west</h3>
                <dl>
                  <div>
                    <dt>Journey status</dt>
                    <dd>Needs input</dd>
                  </div>
                  <div>
                    <dt>Cluster installation</dt>
                    <dd>Not started</dd>
                  </div>
                  <div>
                    <dt>Checks</dt>
                    <dd>Not run</dd>
                  </div>
                </dl>
              </section>
              <div className="solution-comparison">
                <section>
                  <h3>Carries into the reusable plan</h3>
                  <ul>
                    <li>
                      Checklist, action order/dependencies and request wording
                      patterns.
                    </li>
                    <li>
                      Reviewed editable defaults: five-host topology and
                      selected capability intent.
                    </li>
                    <li>
                      Owner roles, customer/proposed Red Hat hook definitions
                      and declared success criteria.
                    </li>
                    <li>Readiness scope, cleanup and handoff requirements.</li>
                  </ul>
                </section>
                <section>
                  <h3>Fresh inputs for edge-west</h3>
                  <ul>
                    <li>
                      Cluster/site identity, DNS names, IPs, host/BMC
                      identities, NICs/disks and network reservations.
                    </li>
                    <li>
                      Site storage/backend/class, network services, fixtures and
                      probe locations.
                    </li>
                    <li>
                      Actual owners, recipient, authorized controller/access
                      references, concrete job bindings and targets.
                    </li>
                    <li>Applicability of defaults and required inputs.</li>
                  </ul>
                </section>
                <section>
                  <h3>Remains with edge-east</h3>
                  <ul>
                    <li>
                      Progress, completed checks and waiting/running/failed
                      states.
                    </li>
                    <li>
                      Requests/ticket references, reports, approvals and
                      history.
                    </li>
                    <li>
                      Attempts, timestamps, logs, outputs and verification
                      evidence.
                    </li>
                    <li>
                      Generated media/configuration artifacts and infrastructure
                      handoff.
                    </li>
                  </ul>
                </section>
              </div>
              <p>
                Shared services or teams may be selected again but require
                confirmation; defaults are not verified facts. An incomplete or
                failed journey can also supply a reusable definition without
                certifying the plan. Template changes affect subsequently
                created journeys, not east or an already-created west.
              </p>
            </>
          )}
          <nav
            className="solution-related"
            aria-label="Related installation material"
          >
            <h3>Connect this example to the catalog</h3>
            <ul>
              {storyContexts
                .filter(
                  (context) =>
                    context.chapter === chapter ||
                    (chapter === "installation" &&
                      context.item === "boot-handoff"),
                )
                .map((context) => (
                  <li key={context.item ?? context.topic}>
                    {link(
                      contextRoute(context),
                      context.label,
                      `to-${chapter}-${context.item ?? context.topic}`,
                    )}
                  </li>
                ))}
              {chapter === "preparation" && (
                <li>
                  {link(
                    {
                      ...defaultPrerequisites,
                      view: { ...defaultPrerequisites.view, target: "dns" },
                    },
                    "Five-node Prerequisites: DNS detail",
                    "to-prerequisites-dns",
                  )}
                </li>
              )}
              <li>
                {link(
                  {
                    page: "journey",
                    view: { topic: "journey", lens: "opportunities" },
                  },
                  "All improvement opportunities",
                  `all-opportunities-${chapter}`,
                )}
              </li>
            </ul>
            <p>Supporting proposals may cover more than this example.</p>
          </nav>
        </article>
      </div>
    </main>
  );
}
