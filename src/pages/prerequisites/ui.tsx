import { Addressing, Dns, Firewall, Handoffs, Sources } from "./content";
import { exampleNodes } from "./data";
import {
  Disclosure,
  PrerequisiteLink,
  type PrerequisitesProps,
  PrerequisitesProvider,
} from "./interactions";
import { sections } from "./model";
import { Services } from "./services";
import "./styles.css";

function NetworkMap() {
  return (
    <section
      className="overview"
      aria-label="Five-node prerequisite network diagram"
    >
      <div className="section-head">
        <div>
          <h2>Five servers. Two networks. One site handoff.</h2>
          <p>
            <strong>7 machine-LAN addresses</strong> = 5 nodes + 2 VIPs ·{" "}
            <strong>5 separate BMC addresses</strong>
          </p>
        </div>
      </div>
      <div className="fabric">
        <div className="fabric-head">
          <div>
            <h3>Machine network · VLAN 130</h3>
            <p>
              One L2 segment, with node communication and VIP movement
              permitted.
            </p>
          </div>
          <span className="chip">MTU 1500 · Gateway .1</span>
        </div>
        <div className="vip-strip">
          <span>
            <b>API VIP</b> <code>10.20.30.10</code>
          </span>
          <span>
            <b>Ingress VIP</b> <code>10.20.30.11</code>
          </span>
          <span className="explain">
            IT reserves unused IPs; OpenShift assigns and moves them.
          </span>
        </div>
        <div className="node-grid">
          {exampleNodes.map((node) => (
            <article
              key={node.name}
              className={`node${node.rendezvous ? " rendezvous" : ""}`}
            >
              <div className="node-role">{node.role}</div>
              <h3>{node.name}</h3>
              <div className="node-ip">
                {node.address}
                <small>/24</small>
              </div>
              <div className="node-mode dhcp-only">DHCP reservation</div>
              <div className="node-mode static-only">Static in agent ISO</div>
              <div className="node-meta">
                NIC <b>eno1</b> · switch port <b>{node.port}</b>
                <br />
                MAC <code>{node.mac}</code>
              </div>
              <div className="node-note">
                {node.rendezvous
                  ? "Rendezvous · TCP 8090"
                  : "Connects to cp-0:8090"}
              </div>
            </article>
          ))}
        </div>
        <div className="fabric-footer">
          <span>
            Subnet <b>10.20.30.0/24</b>
          </span>
          <span>
            Cluster <b>ocp5.dc.example.com</b>
          </span>
        </div>
      </div>
      <div className="connector">
        Site services and permitted routes connect to all five nodes
      </div>
      <Services />
      <div className="bmc-area">
        <div className="bmc-header">
          <h3 id="prerequisites-management" tabIndex={-1}>
            Separate management network · VLAN 140
          </h3>
          <span>
            <code>10.20.40.0/24</code> · gateway <code>10.20.40.1</code>
          </span>
        </div>
        <div className="bmc-grid">
          {exampleNodes.map((node) => (
            <div className="bmc" key={node.name}>
              <span>{node.name} BMC</span>
              <b>{node.bmc}</b>
              <small>Configured before ISO boot</small>
            </div>
          ))}
        </div>
        <div className="bmc-path">
          <span className="path-box">
            Admin <b>10.20.50.10</b>
          </span>
          <b>→ TCP 443 →</b>
          <span className="path-box">Five BMCs · Redfish / web UI</span>
          <b>→ TCP 443 →</b>
          <span className="path-box">
            ISO host <b>10.20.50.20</b>
          </span>
        </div>
        <p className="bmc-caption">
          For URL-mounted virtual media, the BMC fetches the ISO. Reaching a BMC
          does not prove that it can retrieve media. Vendor console streaming
          can use a different path.
        </p>
        <PrerequisiteLink target="tickets/bmc">
          Open the BMC and virtual-media handoff →
        </PrerequisiteLink>
      </div>
      <div className="overview-note">
        <div className="note">
          <strong>Internal DNS and client access are separate</strong>
          <span className="apps-pending-only">
            In this managed example, site API/app records are pending. The
            monitoring workstation still needs API resolution; the example uses
            a local hosts entry. Nodes use managed internal resolution.
          </span>
          <span className="published-only">
            API and application records are published for clients in this
            example. Their routes and firewall access to the VIPs still need
            verification.
          </span>
          <PrerequisiteLink target="dns" focusId="dns-explanation">
            Read the DNS scope and evidence →
          </PrerequisiteLink>
        </div>
        <div className="note neutral">
          <strong>Managed networking still uses site infrastructure</strong>This
          example needs usable addresses, switching, routes and permitted
          traffic. It uses managed VIPs and internal DNS, with no external load
          balancer, separate bootstrap server or PXE provisioning network.
        </div>
      </div>
    </section>
  );
}

/** A fixed learning example; its scenario controls do not assess a real site's readiness. */
export function PrerequisitesPage(props: PrerequisitesProps) {
  const { view, onChange } = props;
  const activeSection = view.target.startsWith("tickets/")
    ? "tickets"
    : view.target === "management"
      ? "overview"
      : view.target;
  return (
    <PrerequisitesProvider {...props}>
      <main
        id="main-content"
        tabIndex={-1}
        className="prerequisites-page"
        data-addressing={view.addressing}
        data-dns={view.dns}
      >
        <header className="hero">
          <div>
            <div className="eyebrow">
              Agent-based installation · OCP 4.22 · IPv4 example
            </div>
            <h1 id="prerequisites-title" tabIndex={-1}>
              Network prerequisites: a five-node example
            </h1>
            <p>
              Explore the addresses, shared services and access paths the data
              center supplies before installation.
            </p>
          </div>
        </header>
        <Disclosure
          id="scope"
          summary={
            <>
              Example scope{" "}
              <span className="scope-summary">
                Managed networking · full ISO · BMC virtual media
              </span>
            </>
          }
        >
          <div className="detail-body">
            <p>
              Three control-plane nodes and two workers share one machine LAN,
              using <code>platform: baremetal</code>, managed VIPs and
              OVN-Kubernetes. The full agent ISO is delivered through BMC
              virtual media on a separate management network.
            </p>
            <p>
              Addresses and MACs are illustrative. This page explains one
              design; it does not validate a site or follow selections made on
              Choices. An existing approved service can satisfy a prerequisite
              without a new ticket.
            </p>
            <p>
              Documentation and source reviewed 4 November 2026. DNS conclusions
              apply to this managed design. Exact VIP failover ACLs and
              hardware-specific media behavior still require site verification.
            </p>
          </div>
        </Disclosure>
        <nav className="topnav" aria-label="Prerequisite sections">
          {sections.map((section) => (
            <span
              key={section.target}
              data-active={activeSection === section.target}
            >
              <PrerequisiteLink
                target={section.target}
                focusId={`section-${section.target}`}
                current={activeSection === section.target}
              >
                {section.label}
              </PrerequisiteLink>
            </span>
          ))}
        </nav>
        <div className="controlbar">
          <fieldset>
            <legend>Example node addressing</legend>
            <div className="choices">
              {(
                [
                  "dhcp",
                  "static",
                ] satisfies PrerequisitesProps["view"]["addressing"][]
              ).map((mode) => (
                <label className="choice" key={mode}>
                  <input
                    type="radio"
                    name="prerequisite-addressing"
                    value={mode}
                    checked={view.addressing === mode}
                    onChange={() =>
                      onChange({ ...view, addressing: mode }, "retain")
                    }
                  />
                  {mode === "dhcp" ? "DHCP reservations" : "Static IPs in ISO"}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>Example external cluster DNS</legend>
            <div className="choices">
              {(
                [
                  "pending",
                  "published",
                ] satisfies PrerequisitesProps["view"]["dns"][]
              ).map((dns) => (
                <label className="choice" key={dns}>
                  <input
                    type="radio"
                    name="prerequisite-dns"
                    value={dns}
                    checked={view.dns === dns}
                    onChange={() => onChange({ ...view, dns }, "retain")}
                  />
                  {dns === "pending"
                    ? "Pending · local API access"
                    : "Published"}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
        <NetworkMap />
        <Addressing />
        <Dns />
        <Handoffs />
        <Firewall />
        <Sources />
      </main>
    </PrerequisitesProvider>
  );
}
