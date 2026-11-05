import { Handoffs } from "./content";
import { exampleNodes } from "./data";
import {
  PrerequisiteLink,
  type PrerequisitesProps,
  PrerequisitesProvider,
} from "./interactions";
import { prerequisitesSection, sections } from "./model";
import { TechnicalReference } from "./reference";
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
          <h2>Five-node network map</h2>
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
          URL-mounted media needs both paths: admin → BMC and BMC → ISO host.
          Confirm ports and media support for the chosen hardware.
        </p>
        <PrerequisiteLink target="tickets/bmc">
          Server-management handoff →
        </PrerequisiteLink>
      </div>
    </section>
  );
}

/** A fixed learning example; its scenario controls do not assess a real site's readiness. */
export function PrerequisitesPage(props: PrerequisitesProps) {
  const { view, onChange } = props;
  const activeSection = prerequisitesSection(view.target);
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
              Prepare addresses, shared services and access before booting the
              servers. This example uses managed VIPs, OVN-Kubernetes and a full
              agent ISO delivered through BMC virtual media.
            </p>
          </div>
        </header>
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
            <legend>Node addressing</legend>
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
          <fieldset aria-describedby="site-dns-timing">
            <legend>Site DNS publication</legend>
            <div className="choices">
              {(
                [
                  "published",
                  "pending",
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
                  {dns === "published"
                    ? "Before installation"
                    : "Defer until after installation"}
                </label>
              ))}
            </div>
            <p id="site-dns-timing" className="control-hint">
              API and application records can wait in this managed bare-metal
              example. Installation still needs upstream DNS and API name
              resolution on the monitoring workstation.
            </p>
          </fieldset>
        </div>
        <NetworkMap />
        <Handoffs />
        <TechnicalReference />
      </main>
    </PrerequisitesProvider>
  );
}
