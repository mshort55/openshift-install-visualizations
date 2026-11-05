import { type ReactNode, useEffect, useState } from "react";
import type { AppRoute } from "../../../app/routes";
import {
  type BootRoute,
  bootSteps,
  type Chapter,
  chapters,
  type Entry,
  emptyWest,
  exampleWest,
  handoffText,
  hosts,
  postSteps,
  type Template,
  type WestInputs,
  westLabels,
} from "./complete-model";
import {
  checkState,
  initialPreparation,
  preparationStatus,
} from "./prerequisite-model";
import { PrerequisiteStory } from "./prerequisite-story";
import "./styles.css";
import "./complete-story.css";

type Props = {
  active: boolean;
  chapter: Chapter;
  moment: number;
  onRead: (chapter: Chapter, moment?: number) => void;
  link: (route: AppRoute, label: string, id: string) => ReactNode;
};
function download(text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/markdown" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "edge-east-illustrative-infrastructure-handoff.md";
  anchor.click();
  URL.revokeObjectURL(url);
}
const catalog = (
  topic: string,
  lens: "process" | "problems" | "opportunities" = "process",
  item?: string,
): AppRoute => ({
  page: "journey",
  view: { topic, lens, ...(item ? { item } : {}) },
});

/** One disposable story, kept mounted during in-app excursions. Reload starts afresh. */
export default function CompleteStory({
  active,
  chapter,
  moment,
  onRead: navigateChapter,
  link,
}: Props) {
  const [lastPreparationMoment, setLastPreparationMoment] = useState(moment);
  useEffect(() => {
    if (chapter === "preparation") setLastPreparationMoment(moment);
  }, [chapter, moment]);
  const onRead = (next: Chapter, nextMoment = lastPreparationMoment) =>
    navigateChapter(next, nextMoment);
  const [preparation, setPreparation] = useState(initialPreparation);
  const [route, setRoute] = useState<BootRoute>("automated");
  const [boot, setBoot] = useState(0);
  const [post, setPost] = useState(0);
  const [history, setHistory] = useState<Entry[]>([]);
  const [paused, setPaused] = useState(false);
  const [handoff, setHandoff] = useState("");
  const [template, setTemplate] = useState<Template | null>(null);
  const [west, setWest] = useState<WestInputs | null>(null);
  const [westDefaults, setWestDefaults] = useState<Template | null>(null);
  const [westConfirmed, setWestConfirmed] = useState(false);
  const [westRequest, setWestRequest] = useState("");
  const [resetPrompt, setResetPrompt] = useState<BootRoute | null>(null);
  const [epoch, setEpoch] = useState(0);
  const a = preparation.answers;
  const dnsReady =
    checkState(preparation, "client") === "Passed" &&
    preparation.observation.kind === "idle";
  const installed = boot === bootSteps.length;
  const hookFailed = post >= 6 && post < 9;
  const status = handoff
    ? {
        label: "Complete",
        detail:
          "Selected infrastructure checks and cleanup passed. Infrastructure handoff saved.",
        tone: "success",
      }
    : hookFailed
      ? {
          label: "Failed",
          detail:
            post === 8
              ? "Customer vm-network-validation retry is running; the failed outcome remains visible until new evidence passes."
              : "Customer vm-network-validation failed. Network team owns the repair; cluster installation remains successful.",
          tone: "failed",
        }
      : installed
        ? {
            label: post === 5 || post === 10 ? "Running" : "Ready to run",
            detail:
              post === 5
                ? "Customer vm-network-validation job launched; acceptance evidence pending."
                : post === 10
                  ? "Running the bounded smoke tests."
                  : post === 12
                    ? "Technical checks and cleanup passed. Generate the required handoff."
                    : "Continue the required infrastructure work.",
            tone: "active",
          }
        : boot === 5
          ? {
              label: "Running",
              detail: "Agent installation observed on rendezvous host cp-0.",
              tone: "active",
            }
          : boot > 0
            ? {
                label:
                  route === "local-bmc" && boot < 4
                    ? "Waiting"
                    : boot === 3
                      ? "Running"
                      : "Ready to run",
                detail:
                  route === "local-bmc" && boot < 4
                    ? "Waiting on Site operations — approved local mount and boot, then observed host evidence."
                    : "Prepared inputs retained. Media, host boot and installation need separate evidence.",
                tone: "active",
              }
            : preparationStatus(preparation);
  const clusterOutcome = installed
    ? "Cluster installed successfully"
    : boot === 5
      ? "Installation running"
      : "Not started";
  const record = (source: string, result: string) =>
    setHistory((previous) => [
      ...previous,
      {
        id: previous.length + 1,
        at: `04 Nov 2026 · 11:${String(previous.length).padStart(2, "0")} UTC (example)`,
        source,
        result,
        inputs: `edge-east · API ${a.api} · ingress ${a.ingress} · resolver ${a.resolver} · input revision r${preparation.evidence.length + 1}`,
      },
    ]);
  const reset = (next: BootRoute) => {
    setPreparation(initialPreparation());
    setEpoch((value) => value + 1);
    setRoute(next);
    setBoot(0);
    setPost(0);
    setHistory([]);
    setPaused(false);
    setHandoff("");
    setTemplate(null);
    setWest(null);
    setWestDefaults(null);
    setWestConfirmed(false);
    setWestRequest("");
    setResetPrompt(null);
    onRead("introduction", 0);
  };
  const chooseRoute = (next: BootRoute) => {
    if (next !== route) setResetPrompt(next);
  };
  const runBoot = () => {
    if (paused || (boot === 0 && !dnsReady) || boot >= bootSteps.length) return;
    const results = [
      `Configuration syntax validated separately from live evidence. Hardware inventory confirms identities, roles, eno1 NICs and intended disks; capacity evidence reviewed for OCP 4.22 / five-host topology and the planned virtualization workload; worker CPU virtualization support and enabled firmware, existing supported CSI backend access, VM image access and approved guest-test credentials confirmed. Backend compatibility and capacity remain explicit site prerequisites. site-validation job 880 succeeded: reservations, VLAN and firewall checks passed from site-admin-01; routing, NTP and registry authentication/trust probes passed on tested site paths. ${a.addressing === "static" ? "Per-host static address/NIC/gateway configuration captured and validated." : "DHCP reservations matched five MACs."} ${a.changeApproval ? "Change manager approval CHG-INSTALL-42 recorded for the installation window." : "Standard approved installation window retained."} Host-only connectivity checks remain installation-time validations. Hub prepares configuration r${preparation.evidence.length + 1}, original install directory and Agent ISO; it does not run the on-node service.`,
      route === "automated"
        ? "BMC readback confirms expected ISO attached on 5/5 hosts; no boot observed."
        : "Site operations reports expected ISO attached on 5/5 BMCs from site-admin-01; human report retained, not a hub readback.",
      route === "automated"
        ? "One-time virtual CD/DVD boot commands accepted on 5/5 hosts. Acknowledgements do not establish host boot."
        : "Site operations reports one-time boot on five hosts with console evidence and time. Independent host observation still required.",
      "Fresh Agent activity matches cp-0, cp-1, cp-2, worker-0 and worker-1. Host validations passed for target-host connectivity, DNS, time and content access. Host boot established separately from installation completion.",
      "On-node installation service on cp-0 observed running. Hub observes the retained original inputs.",
      "agent wait-for install-complete exited 0 for the original edge-east install directory. Cluster installation successful. Required infrastructure work remains.",
    ];
    record(
      boot === 0
        ? "Proposed preflight / customer AAP / hub preparation"
        : route === "local-bmc" && (boot === 1 || boot === 2)
          ? "Customer report · Site operations"
          : boot < 3
            ? "Boot integration · BMC result"
            : "Installation observer · hub-install-01",
      results[boot] ?? "",
    );
    setBoot(boot + 1);
  };
  const runPost = () => {
    if (!installed || paused || post >= postSteps.length) return;
    const results = [
      "5/5 nodes Ready; core Cluster Operators available and not degraded. Worker CPU virtualization enabled, RHCOS workers, allocatable capacity and hardware eligibility match the selected virtualization release. Base networking already supplied by the cluster.",
      "Storage team configured the existing supported CSI connection and vm-storage class/profile (RWX/Block, Delete reclaim for test PVCs). Driver healthy; disposable PVCs provisioned and attached. Capacity and access evidence retained; this does not yet prove guest I/O.",
      "OpenShift Virtualization Operator installed in openshift-cnv; HyperConverged configuration observed Available, Progressing=False, Degraded=False. Required components healthy. A running VM has not yet been demonstrated.",
      "Linux image fixture linux-smoke-v1 imported into root DataVolume; separate test data PVC attached. virt-smoke VMI observed Running on worker-0, with 2 vCPU / 4 GiB and default pod network / masquerade. Cloud-init public SSH key and guest access reference prepared. Running alone does not establish guest responsiveness or workload readiness.",
      "Customer vm-network-validation job 881 accepted by the existing automation controller. Inventory edge-east; target virt-smoke, accessed with approved SSH through the cluster API. Launch only; declared guest-network result pending.",
      "demo://aap/vm-network-validation/881 failed: guest DNS resolved app-probe-01.dc.example.com to 10.20.60.20, but guest HTTPS to port 443 timed out. Expected HTTP 200 and body edge-east-smoke-ok. Run output retained. Network team owns the egress firewall correction.",
      "Network team reports firewall rule corrected for the observed worker egress source → 10.20.60.20 TCP/443, reference NET-208. Report recorded; required hook remains failed until verified.",
      "Customer vm-network-validation job 882 launched against the same VM and declared guest-network checks. Retrying this hook only; base cluster, virtualization configuration, VM and storage retained.",
      "demo://aap/vm-network-validation/882 succeeded. From virt-smoke guest, app-probe-01.dc.example.com resolved to 10.20.60.20 and HTTPS /health returned 200 / edge-east-smoke-ok. Job execution and declared checks passed; failed attempt 881 retained.",
      "Proposed Red Hat checks start guest responsiveness, PVC-backed data-disk write/read and bounded platform smoke tests. Retain fixture linux-smoke-v1, VM sizing, target disk and probe configuration. No application workloads are validated.",
      `Guest SSH command returned expected hostname virt-smoke and exit 0. On its separate data disk, write edge-east-smoke-ok, flush, close and reopen: read matched. Image pulled and test pods scheduled on both workers; pod service DNS and cross-node response matched. From app-probe-01, smoke.apps.edge-east.${a.baseDomain} resolved via ${a.resolver} to ${a.ingress}; HTTPS Route returned 200 / edge-east-smoke-ok. Guest-network acceptance is established by job 882. Every selected check passed.`,
      "Observer verified virt-smoke VM/VMI, root/data DataVolumes and PVCs, their temporary backend volumes, namespace journey-smoke, pods, Route, Service and temporary access resources removed. OpenShift Virtualization and vm-storage remain configured. Evidence artifacts retained. No cleanup failure remains.",
    ];
    record(
      post >= 4 && post <= 8
        ? "Customer hook · Network team"
        : "Proposed Red Hat action · Platform / Storage teams",
      results[post] ?? "",
    );
    setPost(post + 1);
  };
  const saveTemplate = () =>
    setTemplate({
      name: "Five-host virtualization-ready deployment",
      addressing: a.addressing,
      changeApproval: a.changeApproval,
      release: "OpenShift 4.22",
    });
  const westComplete =
    west &&
    Object.values(west).every((value) => value.trim()) &&
    !!westDefaults?.release.trim() &&
    westConfirmed;
  const showWest = chapter === "reuse" && west !== null;
  const displayedStatus = showWest
    ? {
        label: westComplete ? "Ready to run" : "Needs input",
        detail:
          "New edge-west deployment. All verification is Not run; no east progress or evidence was copied.",
        tone: "waiting",
      }
    : status;
  const sourceLinks: Record<Chapter, ReactNode> = {
    introduction: (
      <>
        {link(
          catalog("agent-based"),
          "How it works: Local Agent-based Installer",
          "foundation",
        )}
        {link(
          catalog("management", "problems", "boot-handoff"),
          "Customer problem: unclear boot handoff",
          "boot-problem",
        )}
      </>
    ),
    preparation: (
      <>
        {link(catalog("dns"), "How it works: DNS and cluster access", "dns")}
        {link(
          catalog("networking", "problems", "owner-wait"),
          "Customer problem: infrastructure handoffs",
          "owner",
        )}
        {link(
          catalog("hosts", "opportunities", "precise-handoffs"),
          "Related opportunity: actionable owner requests",
          "request-opportunity",
        )}
      </>
    ),
    installation: (
      <>
        {link(catalog("hosts"), "How it works: Boot and install hosts", "boot")}
        {link(
          catalog("management"),
          "How it works: Management access",
          "management",
        )}
      </>
    ),
    readiness: (
      <>
        {link(
          catalog("workloads", "problems", "first-vm-blocked"),
          "Customer problem: the first VM can remain blocked",
          "first-vm",
        )}

        {link(
          catalog("platform-operators"),
          "How it works: Required Operators",
          "operators",
        )}
        {link(
          catalog("recovery", "opportunities", "supported-recovery"),
          "Related opportunity: supported repair",
          "recovery",
        )}
      </>
    ),
    handoff: (
      <>
        {link(
          catalog("acceptance"),
          "How it works: Readiness and handoff",
          "handoff",
        )}
        {link(
          catalog("support", "opportunities", "diagnostic-handover"),
          "Related opportunity: evidence collection",
          "evidence",
        )}
      </>
    ),
    reuse: (
      <>
        {link(
          catalog(
            "configuration",
            "opportunities",
            "reusable-deployment-configuration",
          ),
          "Related opportunity: next-site configuration",
          "reuse",
        )}
      </>
    ),
  };
  return (
    <div
      className="solution-prototype complete-story"
      role={active ? "main" : undefined}
      id={active ? "main-content" : undefined}
      tabIndex={-1}
      hidden={!active}
    >
      <div className="sp-review-banner">
        <span>
          <strong>Illustrative prototype</strong> · Proposed installation
          journey · All results are simulated
        </span>
        <button type="button" onClick={() => setResetPrompt(route)}>
          Restart example
        </button>
      </div>
      <header className="sp-page-intro">
        <div>
          <span className="sp-label">Solution example</span>
          <h1 id="solution-prototype-title" tabIndex={-1}>
            One plan, from missing inputs to a usable foundation.
          </h1>
          <p>
            Follow edge-east through preparation, installation and a verified
            infrastructure handoff. Then reuse its plan for edge-west.
          </p>
        </div>
        <div className="sp-variant-note">
          <strong>Review the complete journey</strong>
          <p>
            Does each next action make sense, and is the boundary between
            reported work and verified outcomes clear?
          </p>
        </div>
      </header>
      <div className="cs-sticky-state">
        <section className="sp-cluster-strip" aria-label="Shared example state">
          <div>
            <span className="sp-label">
              {showWest
                ? "New installation journey · J-043"
                : "Installation journey · J-042"}
            </span>
            <strong>
              {showWest ? "edge-west" : "edge-east"}
              <span className="sp-cluster-domain">
                .{showWest ? west?.domain || "domain needed" : a.baseDomain}
              </span>
            </strong>
            <span data-installation-outcome>
              <b>Cluster installation:</b>{" "}
              {showWest ? "Not started" : clusterOutcome}
            </span>
          </div>
          <div className="sp-overall" aria-live="polite">
            <span className="sp-label">Journey status</span>
            <span
              className={`sp-status sp-${displayedStatus.tone}`}
              data-journey-status
            >
              {displayedStatus.label}
            </span>
            <p>{displayedStatus.detail}</p>
          </div>
        </section>
        <nav className="cs-phase-tabs" aria-label="Story phases">
          {["Pre-installation", "Installation", "Post-installation"].map(
            (phase, index) => (
              <button
                type="button"
                key={phase}
                aria-current={
                  chapters.find((c) => c.id === chapter)?.phase === phase
                    ? "step"
                    : undefined
                }
                onClick={() =>
                  onRead(
                    index === 0
                      ? "preparation"
                      : index === 1
                        ? "installation"
                        : "readiness",
                  )
                }
              >
                {phase}
              </button>
            ),
          )}
        </nav>
      </div>
      <div className="sp-phase-state">
        <span>
          <strong>Reading ≠ execution</strong> Chapters preserve progress.
        </span>
        <span>
          The address links to this chapter only. Reload starts fresh.
        </span>
        <span>
          No cluster, BMC, external ticket or automation controller is
          contacted.
        </span>
      </div>
      {resetPrompt && (
        <div className="sp-action-panel" role="alert">
          <strong>Restart this illustrative journey?</strong>
          <p>
            This clears preview answers, evidence and edge-west.{" "}
            {resetPrompt !== route
              ? "The alternate route starts at the same unfinished plan; it is a separate replay, not a change to a running installation."
              : "The next run starts with an API address missing."}
          </p>
          <div className="sp-actions">
            <button type="button" onClick={() => reset(resetPrompt)}>
              Restart {resetPrompt === "automated" ? "automated" : "local BMC"}{" "}
              example
            </button>
            <button type="button" onClick={() => setResetPrompt(null)}>
              Keep current example
            </button>
          </div>
        </div>
      )}
      <div className="sp-story">
        <aside className="sp-rail">
          <span className="sp-label">Read one connected story</span>
          <nav aria-label="Story chapters">
            {chapters.map((c, index) => (
              <button
                type="button"
                key={c.id}
                aria-current={chapter === c.id ? "step" : undefined}
                data-focus={`chapter-${c.id}`}
                onClick={() => onRead(c.id)}
              >
                <span className="sp-phase-number">0{index + 1}</span>
                <span>
                  <strong>{c.label}</strong>
                  <small>{c.phase}</small>
                </span>
              </button>
            ))}
          </nav>
          <div className="sp-rail-note">
            <p>Recommended: follow each action, then read the next chapter.</p>
            <p>
              The alternate local-BMC route changes who boots the hosts. The
              installation foundation stays the same.
            </p>
            {link(
              catalog("journey", "opportunities"),
              "All improvement opportunities",
              "all-opportunities",
            )}
          </div>
        </aside>
        <article className="sp-story-chapter">
          <section
            id="solution-chapter-introduction"
            tabIndex={-1}
            hidden={chapter !== "introduction"}
            className="cs-section"
          >
            <span className="sp-label">01 · Foundation</span>
            <h2>Why build on Agent-based installation?</h2>
            <p className="sp-lead">
              Declarative cluster and host inputs become boot media. The hosts
              validate and install using a local installation service. That
              gives this proposed journey a repeatable foundation, including
              sites that prepare mirrored content.
            </p>
            <div className="sp-install-flow">
              <div>
                <strong>Hub prepares and coordinates</strong>
                <p>
                  Retain the plan, requests, media, owners and results
                  centrally, so continuity does not depend on one customer
                  laptop.
                </p>
              </div>
              <span aria-hidden="true">→</span>
              <div>
                <strong>Agent installs on the hosts</strong>
                <p>
                  The service runs on rendezvous host cp-0. The hub coordinates
                  boot and observes results; it does not replace that service.
                </p>
              </div>
            </div>
            <div className="pg-benefit">
              <strong>The proposed improvement</strong>
              <p>
                Connect guided prerequisites, installation and infrastructure
                checks in one saved journey. A successful installation is one
                outcome inside that journey.
              </p>
            </div>
            <details className="sp-disclosure">
              <summary>Documented foundations and proposed composition</summary>
              <p>
                Agent configuration, ISO boot and completion commands are
                documented foundations. Redfish virtual media and Metal3
                live-ISO mechanisms inform the boot proposal; this combination
                and its hardware compatibility have not been exercised. AAP job
                launch/results inform customer hooks. Saved journeys,
                coordination, generic hooks, aggregate readiness and templates
                are proposed behavior, not native Agent features.
              </p>
              <p>
                <a
                  href="https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/installing_an_on-premise_cluster_with_the_agent-based_installer/installing-with-agent-based-installer"
                  target="_blank"
                  rel="noreferrer"
                >
                  OCP 4.22 Agent installation
                </a>{" "}
                ·{" "}
                <a
                  href="https://book.metal3.io/bmo/live-iso.html"
                  target="_blank"
                  rel="noreferrer"
                >
                  Metal3 live ISO
                </a>{" "}
                ·{" "}
                <a
                  href="https://docs.openstack.org/ironic/latest/admin/drivers/redfish.html"
                  target="_blank"
                  rel="noreferrer"
                >
                  Ironic Redfish
                </a>
              </p>
            </details>
            <button
              type="button"
              className="sp-primary"
              onClick={() => onRead("preparation", 0)}
            >
              Start with prerequisites →
            </button>
          </section>
          <section
            id="solution-chapter-preparation"
            tabIndex={-1}
            hidden={chapter !== "preparation"}
          >
            {boot > 0 && (
              <p className="pg-benefit">
                Installation inputs are retained with the prepared media. This
                bounded story demonstrates input edits before preparation;
                restart to explore a different plan.
              </p>
            )}
            <div className="cs-fieldset">
              <legend className="cs-sr-only">Prerequisite demonstration</legend>
              <PrerequisiteStory
                key={epoch}
                embedded
                readOnly={boot > 0 || paused}
                onState={setPreparation}
                onContinue={() => onRead("installation")}
                selectedStep={
                  chapter === "preparation" ? moment : lastPreparationMoment
                }
                onStep={(step) => onRead("preparation", step)}
                detailLink={link(
                  {
                    page: "prerequisites",
                    view: { target: "dns", addressing: "dhcp", dns: "pending" },
                  },
                  "Explore the DNS prerequisite detail",
                  "prerequisite-detail",
                )}
              />
            </div>
            <div className="cs-next">
              <strong>
                Next: complete the remaining preflight and customer pre-hook.
              </strong>
              <p>
                {dnsReady
                  ? "The current client DNS answers are verified. Preparation will validate the remaining scoped evidence before installation media is used."
                  : "Follow the owned DNS request through verification. Demonstrate an API edit and the affected recheck before continuing."}
              </p>
              <button
                type="button"
                className="sp-primary"
                onClick={() => onRead("installation")}
              >
                Read installation →
              </button>
            </div>
          </section>
          <section
            id="solution-chapter-installation"
            tabIndex={-1}
            hidden={chapter !== "installation"}
            className="cs-section"
          >
            <span className="sp-label">02 · Installation</span>
            <h2>One prepared plan. Two ways to boot.</h2>
            <p>
              The required access determines the route. Both continue the same
              on-node Agent installation and available hub observation.
            </p>
            <div
              className="sp-actions"
              role="tablist"
              aria-label="Installation scenario"
            >
              <button
                type="button"
                role="tab"
                aria-selected={route === "automated"}
                onClick={() => chooseRoute("automated")}
              >
                Access available · automated
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={route === "local-bmc"}
                onClick={() => chooseRoute("local-bmc")}
              >
                Hub-to-BMC blocked · local BMC
              </button>
            </div>
            <p className="pg-caption">
              Scenario replay controls. Switching after preparation asks to
              restart the illustrative example; reading a chapter never restarts
              it.
            </p>
            {!dnsReady && boot === 0 && (
              <div className="sp-result sp-waiting">
                <strong>Preparation is still unfinished.</strong>
                <p>
                  A chapter link does not fill missing answers or fabricate
                  verification. Complete the DNS story first.
                </p>
                <button type="button" onClick={() => onRead("preparation", 1)}>
                  Return to missing inputs
                </button>
              </div>
            )}
            <details className="sp-disclosure">
              <summary>
                Preflight, customer pre-hook and access assumptions
              </summary>
              <p>
                Proposed Red Hat preflight validates configuration and reviews
                hardware identities, roles, NIC/disk mapping and capacity
                evidence. Configuration validation is separate from live
                verification. Existing customer AAP template{" "}
                <code>site-validation</code> runs against inventory edge-east
                from site-admin-01, owned by Network team. Reservations, VLAN
                and firewall outcomes must pass with evidence; an accepted
                launch cannot gate boot.
              </p>
              <p>
                Named site probes cover routing/firewall paths, NTP and registry
                access/authentication/trust. Coverage is limited to those paths.
                Checks requiring boot remain explicit host validations. Ordinary
                Agent media installs the cluster; it is not a harmless
                preflight-only image.
              </p>
              <ul>
                <li>
                  Hub → BMC:{" "}
                  {route === "automated"
                    ? "credentials, TLS trust and supported virtual-media/boot capability assumed checked for all five hosts."
                    : "prohibited by site policy. No automated mount or boot is attempted."}
                </li>
                <li>
                  BMC → media: each BMC can retrieve the prepared ISO over the
                  approved path.
                </li>
                <li>
                  site-admin-01 → BMC: approved local access for Site
                  operations.
                </li>
                <li>
                  Hub → rendezvous/API observation: available in both routes,
                  separate from BMC access.
                </li>
              </ul>
              <p>
                These are explicit illustrative assumptions, not a hardware
                compatibility claim.
              </p>
            </details>
            {route === "local-bmc" && (
              <details className="sp-disclosure" open>
                <summary>
                  Site operations: exact local boot instructions
                </summary>
                <ol>
                  <li>
                    From approved station <code>site-admin-01</code>, use the
                    assigned hardware-admin access reference. Match each host,
                    intended installation disk and approved window to the saved
                    plan below.
                  </li>
                  <li>
                    In each BMC's equivalent of Virtual media → CD/DVD → Image
                    URL, attach{" "}
                    <code>
                      https://media.example.invalid/edge-east/r
                      {preparation.evidence.length + 1}/agent.x86_64.iso
                    </code>
                    . Confirm the matching revision. Labels depend on hardware;
                    each BMC retrieves the ISO.
                  </li>
                  <li>
                    Select one-time virtual CD/DVD boot with the planned UEFI
                    setting. Power on cp-0 (rendezvous), then cp-1, cp-2,
                    worker-0 and worker-1. Preserve the persistent disk boot
                    order.
                  </li>
                  <li>
                    Check Agent startup and connectivity on each console. Return
                    host names, media revision, times and console output. The
                    customer report does not prove installation running or
                    complete.
                  </li>
                </ol>
                <div className="cs-table">
                  <table>
                    <caption>Saved host plan · illustrative addresses</caption>
                    <thead>
                      <tr>
                        <th>Host / role</th>
                        <th>Host IP</th>
                        <th>BMC IP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hosts.map(([name, ip, bmc, roleName]) => (
                        <tr key={name}>
                          <td>
                            edge-east-{name}
                            <small>{roleName}</small>
                          </td>
                          <td>{ip}</td>
                          <td>{bmc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            )}
            <div className="cs-milestones">
              <div>
                <strong>Media attachment</strong>
                <span>
                  {boot < 2
                    ? "Not established"
                    : route === "automated"
                      ? "5/5 · BMC readback"
                      : "5/5 · customer report"}
                </span>
              </div>
              <div>
                <strong>Host boot</strong>
                <span>
                  {boot >= 4
                    ? "5/5 · observed Agent activity"
                    : boot === 3
                      ? "Reported / acknowledged; observation pending"
                      : "Not observed"}
                </span>
              </div>
              <div>
                <strong>Installation completion</strong>
                <span>{clusterOutcome}</span>
              </div>
            </div>
            <ol className="cs-steps">
              {bootSteps.map((step, index) => (
                <li key={step} data-done={boot > index}>
                  <span>{boot > index ? "✓" : index + 1}</span>
                  {index === 1 && route === "local-bmc"
                    ? "Report media attached"
                    : index === 2 && route === "local-bmc"
                      ? "Report hosts booted"
                      : step}
                </li>
              ))}
            </ol>
            {!installed ? (
              <button
                type="button"
                className="sp-primary"
                disabled={paused || (boot === 0 && !dnsReady)}
                onClick={runBoot}
              >
                Simulate:{" "}
                {boot === 1 && route === "local-bmc"
                  ? "report media attached"
                  : boot === 2 && route === "local-bmc"
                    ? "report hosts booted"
                    : bootSteps[boot]}
              </button>
            ) : (
              <div className="sp-result sp-success">
                <strong>Cluster installed successfully.</strong>
                <p>
                  The journey is Ready to run its required post-installation
                  work. Infrastructure readiness has not been established.
                </p>
                <button type="button" onClick={() => onRead("readiness")}>
                  Continue to infrastructure checks →
                </button>
              </div>
            )}
          </section>
          <section
            id="solution-chapter-readiness"
            tabIndex={-1}
            hidden={chapter !== "readiness"}
            className="cs-section"
          >
            <span className="sp-label">03 · Post-installation</span>
            <h2>A cluster can be installed while its journey has failed.</h2>
            <p>
              This site wants a foundation for virtual machines. Configure
              OpenShift Virtualization and the selected storage, boot a
              disposable VM, and verify the guest can use its disk and reach an
              external dependency. VM Running alone is not the finish line.
            </p>
            <details className="sp-disclosure">
              <summary>
                Selected scope: one VM, its storage and its network
              </summary>
              <p>
                The two bare-metal workers support the selected virtualization
                release, have hardware virtualization enabled and sufficient
                capacity. An existing supported CSI backend supplies{" "}
                <code>vm-storage</code>: an explicitly selected RWX/Block class
                and profile with capacity and access confirmed. This is a site
                prerequisite, not a claim that base installation supplies VM
                storage or that a generic driver fits every backend.
              </p>
              <p>
                The disposable Linux VM <code>virt-smoke</code> uses one root
                disk, one data disk and the default pod network with masquerade.
                Existing customer automation accesses the guest using approved
                SSH through the cluster API. No extra inbound VM IP or physical
                secondary network is needed for this selected test.
              </p>
              <p>
                <code>admin-probe-01</code> checks prerequisite DNS. The guest
                checks its own DNS and HTTPS egress to existing fixture{" "}
                <code>app-probe-01.dc.example.com</code> /{" "}
                <code>10.20.60.20</code> on the application network. The fixture
                hostname already exists and is separate from cluster wildcard
                DNS. The customer hook fails on that egress path, then retries
                after the Network team repairs it.
              </p>
              <p>
                The baseline Route check runs from <code>app-probe-01</code> to{" "}
                <code>smoke.apps.edge-east.{a.baseDomain}</code> through
                resolver <code>{a.resolver}</code> and ingress{" "}
                <code>{a.ingress}</code>. Earlier admin-network DNS evidence
                cannot prove these guest and application-network paths.
              </p>
            </details>
            <details className="sp-disclosure">
              <summary>Operators, hooks and the limit of the claim</summary>
              <p>
                Observe core health, configure the site's existing CSI
                integration and storage class, install OpenShift Virtualization
                and create its HyperConverged configuration. Verify configured
                components; an installed Operator alone is insufficient. NMState
                would be needed only for a selected node-network policy; none is
                selected here.
              </p>
              <p>
                Customer pre-hook <code>site-validation</code> and post-hook{" "}
                <code>vm-network-validation</code> use existing customer job
                templates, with deployment-specific owners, controller
                connections, inputs, inventory, access and declared outcomes.
                Successful launch or aggregate workflow success is insufficient
                without the required check evidence.
              </p>
              <p>
                Proposed Red Hat actions supply scoped preflight, Operator
                configuration, VM/platform checks, cleanup and handoff. They can
                be check containers, Kubernetes resources with an observer, or
                Ansible. This example proves neither live migration nor HA,
                performance, application migration or general application
                readiness.
              </p>
              <p>
                <a
                  href="https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/virtualization/installing"
                  target="_blank"
                  rel="noreferrer"
                >
                  Virtualization requirements and installation
                </a>{" "}
                ·{" "}
                <a
                  href="https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/virtualization/networking"
                  target="_blank"
                  rel="noreferrer"
                >
                  Default VM networking and SSH access
                </a>
              </p>
            </details>
            {!installed && (
              <div className="sp-result sp-waiting">
                <strong>Cluster installation is not complete.</strong>
                <p>
                  Read the scoped plan here; execute the installation sequence
                  before its dependent checks.
                </p>
                <button type="button" onClick={() => onRead("installation")}>
                  Return to installation
                </button>
              </div>
            )}
            <ol className="cs-steps">
              {postSteps.map((step, index) => (
                <li
                  key={step}
                  data-done={post > index}
                  className={
                    index === 5 && post >= 6 ? "cs-failed-attempt" : ""
                  }
                >
                  <span>
                    {post > index ? (index === 5 ? "!" : "✓") : index + 1}
                  </span>
                  {step}
                  {index === 5 && post >= 9 ? " · retained failed attempt" : ""}
                </li>
              ))}
            </ol>
            {hookFailed && (
              <div className="sp-result sp-failed" data-hook-failure>
                <strong>Job 881: connection timed out</strong>
                <p>
                  virt-smoke guest → app-probe-01.dc.example.com:443. DNS
                  resolved correctly; HTTPS timed out. Expected HTTP 200 and
                  edge-east-smoke-ok. Network team owns the firewall repair.
                  Output and the failed attempt remain in history.
                </p>
                <p>
                  <b>Cluster installed successfully.</b> Retry targets the
                  vm-network-validation hook; it does not reinstall the cluster
                  or rerun unaffected checks.
                </p>
              </div>
            )}
            {post >= 9 && (
              <div className="sp-result sp-success">
                <strong>Job 882: required checks passed</strong>
                <p>
                  Successful execution plus the expected HTTPS response received
                  inside the VM from app-probe-01. Job 881 remains in history.
                  Base installation, virtualization, VM and storage evidence are
                  preserved.
                </p>
              </div>
            )}
            {post < postSteps.length ? (
              <button
                type="button"
                className="sp-primary"
                disabled={!installed || paused}
                onClick={runPost}
              >
                Simulate: {postSteps[post]}
              </button>
            ) : (
              <button
                type="button"
                className="sp-primary"
                onClick={() => onRead("handoff")}
              >
                Technical checks and cleanup passed → handoff
              </button>
            )}
            <p className="pg-caption">
              Any selected action or cleanup failure prevents Complete. Skipping
              work cannot establish readiness. This preview demonstrates one
              post-hook failure; it does not simulate every failure mode.
            </p>
          </section>
          <section
            id="solution-chapter-handoff"
            tabIndex={-1}
            hidden={chapter !== "handoff"}
            className="cs-section"
          >
            <span className="sp-label">04 · Infrastructure handoff</span>
            <h2>Give the application team the verified scope.</h2>
            <p>
              Generate and save the handoff after technical evidence and cleanup
              pass. The infrastructure owner keeps infrastructure
              responsibility; the application team starts its own validation. No
              acknowledgement gate is added.
            </p>
            <div className="sp-action-panel">
              <strong>
                {post === 12
                  ? "Technical prerequisites satisfied"
                  : "Technical checks and cleanup still required"}
              </strong>
              <p>
                The handoff includes cluster and owner, endpoints and access
                guidance, selected capabilities, dated evidence and probe
                context, customer hook runs, exclusions and next steps. No
                secrets.
              </p>
              <button
                type="button"
                className="sp-primary"
                disabled={post !== 12 || paused || !!handoff}
                onClick={() => {
                  setHandoff(handoffText(preparation, history, route));
                  record(
                    "Infrastructure handoff",
                    "Generated and saved handoff H-042 in this illustrative journey. All selected outcomes and cleanup passed.",
                  );
                }}
              >
                Generate and save illustrative handoff
              </button>
            </div>
            {handoff && (
              <>
                <div className="sp-result sp-success">
                  <strong>H-042 saved · Journey Complete</strong>
                  <p>
                    This dated, scoped result does not certify every application
                    or ongoing availability.
                  </p>
                </div>
                <details className="sp-disclosure" open>
                  <summary>Read the generated handoff</summary>
                  <pre data-handoff>{handoff}</pre>
                </details>
                <button type="button" onClick={() => download(handoff)}>
                  Download illustrative handoff
                </button>
                <button
                  type="button"
                  className="sp-primary"
                  onClick={() => onRead("reuse")}
                >
                  Save the plan as a template →
                </button>
              </>
            )}
          </section>
          <section
            id="solution-chapter-reuse"
            tabIndex={-1}
            hidden={chapter !== "reuse"}
            className="cs-section"
          >
            <span className="sp-label">05 · Reuse</span>
            <h2>Carry the plan forward. Supply a new deployment.</h2>
            <p>
              The main story saves completed edge-east as a template. An
              incomplete or failed journey can also supply its definition: that
              does not certify the template or copy its outcomes.
            </p>
            <div className="cs-milestones">
              <div>
                <strong>Reusable plan</strong>
                <p>
                  Checklist, dependencies, editable defaults, roles,
                  pre/post-hook definitions, declared inputs, verification
                  criteria, cleanup and handoff requirement.
                </p>
              </div>
              <div>
                <strong>Supply for each deployment</strong>
                <p>
                  Site/host/network inputs, concrete owners, receiving team,
                  probe locations, authorized controller/job/target bindings and
                  access references.
                </p>
              </div>
              <div>
                <strong>Excluded history</strong>
                <p>
                  Progress, approvals, tickets, reports, timestamps, logs,
                  artifacts, successful or failed checks, hook runs and handoff.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="sp-primary"
              onClick={saveTemplate}
              disabled={paused}
            >
              Save as template
            </button>
            {template && (
              <div className="sp-action-panel">
                <strong>Saved: {template.name}</strong>
                <p>
                  Definition v1 · {template.release} · five hosts ·{" "}
                  {template.addressing === "dhcp"
                    ? "DHCP reservations"
                    : "static addressing"}{" "}
                  · managed VIPs · OpenShift Virtualization · default pod
                  network ·{" "}
                  {template.changeApproval
                    ? "site approval required"
                    : "standard install window"}
                  .
                </p>
                <p>
                  Missing site information remains required input. Editing this
                  template would affect journeys created afterward; existing
                  journeys retain the definition they started from.
                </p>
                <button
                  type="button"
                  disabled={!!west || paused}
                  onClick={() => {
                    setWest(emptyWest());
                    setWestDefaults({ ...template });
                    setWestConfirmed(false);
                  }}
                >
                  Create edge-west from this template
                </button>
              </div>
            )}
            {west && (
              <section className="cs-west" aria-label="New edge-west journey">
                <h3>edge-west · J-043</h3>
                <p>
                  Source edge-east: {clusterOutcome}; journey {status.label}.
                  Its own history stays with J-042.
                </p>
                <div className="sp-result sp-waiting">
                  <strong data-west-status>
                    {westComplete
                      ? "Ready to run — new work has not run"
                      : "Needs input — west-site details and assignments"}
                  </strong>
                  <p>
                    Cluster installation: Not started · DNS / preflight / hooks
                    / Operators / smoke tests / cleanup: Not run
                  </p>
                  <p>
                    Ticket: None · Reports: None · Attempts: 0 · Verification
                    evidence: 0 · ISO: Not generated · Handoff: Not generated
                  </p>
                </div>
                {westDefaults && (
                  <details className="sp-disclosure">
                    <summary>Review editable defaults for edge-west</summary>
                    <div className="pg-fields">
                      <label>
                        Selected release
                        <input
                          value={westDefaults.release}
                          onChange={(event) => {
                            setWestDefaults({
                              ...westDefaults,
                              release: event.target.value,
                            });
                            setWestConfirmed(false);
                            setWestRequest("");
                          }}
                        />
                      </label>
                      <label>
                        Host addressing
                        <select
                          value={westDefaults.addressing}
                          onChange={(event) => {
                            setWestDefaults({
                              ...westDefaults,
                              addressing: event.target.value,
                            });
                            setWestConfirmed(false);
                            setWestRequest("");
                          }}
                        >
                          <option value="dhcp">DHCP reservations</option>
                          <option value="static">
                            Static host configuration
                          </option>
                        </select>
                      </label>
                    </div>
                    <p>
                      Five-host topology and the virtualization verification
                      plan are retained. These west-site choices do not edit the
                      saved template or edge-east. Confirm compatibility for the
                      chosen release before its new checks run.
                    </p>
                  </details>
                )}
                <div className="pg-fields">
                  {Object.entries(westLabels).map(([key, label]) => (
                    <label key={key}>
                      {label}
                      <textarea
                        rows={2}
                        value={
                          Object.entries(west).find(
                            ([field]) => field === key,
                          )?.[1] ?? ""
                        }
                        onChange={(event) => {
                          setWest({ ...west, [key]: event.target.value });
                          setWestConfirmed(false);
                          setWestRequest("");
                        }}
                      />
                    </label>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setWest({ ...exampleWest });
                    setWestConfirmed(false);
                    setWestRequest("");
                  }}
                >
                  Supply illustrative west-site inputs
                </button>
                <label className="pg-checkbox">
                  <input
                    type="checkbox"
                    checked={westConfirmed}
                    onChange={(event) => {
                      setWestConfirmed(event.target.checked);
                      setWestRequest("");
                    }}
                  />
                  Confirm west-site defaults, owner assignments, access
                  references and hook bindings
                </label>
                <p>
                  These are fresh inputs for J-043. Confirming them does not
                  verify DNS, access or hook execution. East's completed journey
                  and failed/passed hook history stay with J-042.
                </p>
                <button
                  type="button"
                  disabled={!westComplete}
                  onClick={() =>
                    setWestRequest(
                      `DRAFT · edge-west / J-043\nTo: ${west.owners}\napi.edge-west.${west.domain} A ${west.api}\n*.apps.edge-west.${west.domain} A ${west.ingress}\nResolver: ${west.resolver}\nProbe context: ${west.probes}\nAcceptance: expected API and wildcard answers over UDP and TCP, with source, time and output.\nNo ticket has been created or work completed.\n\nFresh configuration plan: ${westDefaults?.release}; five hosts; ${westDefaults?.addressing}; VM storage ${west.storage}.\nHosts: ${west.hosts}\nSite: ${west.network}\nBindings: ${west.bindings}\nAccess references: ${west.access}\nGenerate installation media only after the new preflight and approvals pass.\nAll verification: NOT RUN. No east artifacts or run references included.`,
                    )
                  }
                >
                  Generate west request and configuration draft
                </button>
                {westRequest && <pre data-west-request>{westRequest}</pre>}
              </section>
            )}
          </section>
          {history.at(-1) && (
            <div className="cs-latest" aria-live="polite">
              <strong>Latest recorded result · {history.at(-1)?.source}</strong>
              <p>{history.at(-1)?.result}</p>
              <small>{history.at(-1)?.at}</small>
            </div>
          )}
          <aside className="cs-related">
            <strong>Supporting context</strong>
            {sourceLinks[chapter]}
            {link(
              catalog("journey", "opportunities"),
              "All improvement opportunities",
              "catalog",
            )}
          </aside>
          <nav className="sp-chapter-nav" aria-label="Read the story">
            {chapters.findIndex((c) => c.id === chapter) > 0 && (
              <button
                type="button"
                onClick={() =>
                  onRead(
                    chapters[chapters.findIndex((c) => c.id === chapter) - 1]
                      ?.id ?? "introduction",
                  )
                }
              >
                ← Previous chapter
              </button>
            )}
            {chapter !== "reuse" && (
              <button
                type="button"
                onClick={() =>
                  onRead(
                    chapters[chapters.findIndex((c) => c.id === chapter) + 1]
                      ?.id ?? "reuse",
                  )
                }
              >
                Read next chapter →
              </button>
            )}
          </nav>
        </article>
      </div>
      <section className="cs-session">
        <div>
          <strong>
            {paused
              ? "Illustrative journey saved"
              : "Keep your place in any phase"}
          </strong>
          <p>
            {paused
              ? "Inputs, owners, reports, results and attempts are retained in this open preview. Resume the same journey."
              : "Save and resume demonstrates the proposed record. Reading supporting pages preserves it automatically; reload clears this preview."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setPaused(!paused);
            if (!paused)
              record(
                "Saved journey",
                "Partial plan and evidence saved for resume in the open preview.",
              );
          }}
        >
          {paused ? "Resume this journey" : "Save journey and pause"}
        </button>
      </section>
      <details className="sp-disclosure cs-history">
        <summary>
          Inspect retained action evidence and attempt history ({history.length}
          )
        </summary>
        <p>
          Illustrative sources and UTC times. Every entry retains its input
          snapshot. Prerequisite requests and DNS attempts remain in the
          prerequisite chapter.
        </p>
        {history.length === 0 ? (
          <p>No execution has occurred.</p>
        ) : (
          <ol>
            {history.map((entry) => (
              <li key={entry.id}>
                <strong>{entry.source}</strong>
                <small>
                  {entry.at} · {entry.inputs}
                </small>
                <p>{entry.result}</p>
              </li>
            ))}
          </ol>
        )}
      </details>
      <p className="sp-prototype-footnote">
        Illustrative prototype for design review, excluded from production
        builds. The opportunity catalog remains the broader task-based view.
        Production storage, execution, supported integrations and compatibility
        are outside this prototype.
      </p>
    </div>
  );
}
