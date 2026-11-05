import { PrerequisiteLink } from "./interactions";

export function Handoffs() {
  return (
    <section className="section" data-section="tickets">
      <h2 id="prerequisites-tickets" tabIndex={-1}>
        Site handoff
      </h2>
      <p>
        Confirm these five outcomes with the responsible teams. Existing
        services can satisfy them.
      </p>
      <div className="handoffs">
        <article className="panel">
          <h3 id="prerequisites-addressing" tabIndex={-1}>
            Addresses and network
          </h3>
          <p className="owner-line">Network + IPAM / DHCP owners</p>
          <ul>
            <li>
              Allocate five stable node IPs and two unused VIPs on{" "}
              <code>10.20.30.0/24</code>. Keep the VIPs outside DHCP leases;
              OpenShift manages their assignment.
            </li>
            <li>
              Prepare VLAN 130, gateway <code>10.20.30.1</code>, routes and
              return paths. Permit peer traffic and VIP movement. Check
              pod/service CIDRs and the Agent's <code>10.88.0.0/16</code> range
              for conflicts.
            </li>
            <li className="dhcp-only">
              <strong>DHCP:</strong> reserve node IPs against the actual
              NIC/client identities. Supply the /24 mask, gateway and resolvers;
              configure a relay if needed. Keep reservations stable through
              installation and reboot.
            </li>
            <li className="static-only">
              <strong>Static:</strong> exclude node IPs from DHCP pools. Supply
              each NIC MAC, /24 prefix, gateway, resolvers and routes for
              per-host NMState in <code>agent-config.yaml</code>.
            </li>
            <li>
              Keep cp-0 at <code>10.20.30.21</code> as rendezvous. Agree MTU end
              to end: this example uses 1500 on the machine network and 1400 for
              the OVN overlay.
            </li>
          </ul>
          <p className="handoff-check">
            <strong>Confirm:</strong> approved addresses, working switch ports
            and reachable site services.
          </p>
          <PrerequisiteLink target="inventory">
            Address inventory →
          </PrerequisiteLink>
          {" · "}
          <PrerequisiteLink target="configuration">
            Configuration examples →
          </PrerequisiteLink>
        </article>
        <article className="panel">
          <h3 id="prerequisites-dns" tabIndex={-1}>
            DNS and time
          </h3>
          <p className="owner-line">DNS / DDI + shared-services owners</p>
          <p>
            This managed bare-metal example provides internal node DNS. Supply
            reachable upstream resolvers for registries and site services, plus
            an accurate NTP source.
          </p>
          <dl className="record-list">
            <div>
              <dt>
                <code>api.ocp5.dc.example.com</code>
              </dt>
              <dd>
                <code>10.20.30.10</code> · CLI and installation monitoring
              </dd>
            </div>
            <div>
              <dt>
                <code>*.apps.ocp5.dc.example.com</code>
              </dt>
              <dd>
                <code>10.20.30.11</code> · console, OAuth and applications
              </dd>
            </div>
          </dl>
          <p>
            Publish these records for clients that need access. Nodes receive{" "}
            <code>api-int</code> internally here. Scope the wildcard to{" "}
            <code>*.apps</code>.
          </p>
          <p className="published-only handoff-check">
            <strong>Confirm:</strong> API resolution from the monitoring
            workstation, application resolution from browser clients, and NTP
            reachability from every node.
          </p>
          <p className="apps-pending-only handoff-check">
            <strong>Site DNS deferred:</strong> publish API and application
            records after cluster installation. Use a temporary API mapping on
            the monitoring workstation until then.
          </p>
          <PrerequisiteLink target="dns-access">
            Internal DNS and temporary access →
          </PrerequisiteLink>
        </article>
        <article className="panel">
          <h3 id="prerequisites-tickets-content" tabIndex={-1}>
            Image access
          </h3>
          <p className="owner-line">Registry / proxy + security / PKI owners</p>
          <ul>
            <li>
              <strong>Connected:</strong> allow the building workstation and
              nodes to reach the required registries, authentication and
              content-delivery endpoints.
            </li>
            <li>
              <strong>Proxy:</strong> supply its URL, port, credentials, CA
              trust and internal bypasses. DNS, NTP and peer traffic still need
              their own access.
            </li>
            <li>
              <strong>Disconnected:</strong> provide a reachable mirror
              containing the release images, with credentials and CA trust. The
              full agent ISO still requires release-image access.
            </li>
          </ul>
          <p className="handoff-check">
            <strong>Confirm:</strong> the workstation and nodes can retrieve
            release content using the chosen path.
          </p>
          <PrerequisiteLink target="sources">
            Red Hat endpoint allowlist and mirroring guidance →
          </PrerequisiteLink>
        </article>
        <article className="panel">
          <h3 id="prerequisites-firewall" tabIndex={-1}>
            Network access
          </h3>
          <p className="owner-line">Network security + admin-access owners</p>
          <ul>
            <li>
              <strong>Nodes:</strong> reach rendezvous on TCP 8090 during
              installation, peer nodes, API and ingress endpoints.
            </li>
            <li>
              <strong>Services:</strong> reach DNS on TCP/UDP 53, NTP on UDP
              123, and the selected registry, mirror or proxy.
            </li>
            <li>
              <strong>Clients:</strong> reach the API VIP on TCP 6443 and
              ingress VIP on TCP 80/443. Allow SSH only where diagnostics
              require it.
            </li>
            <li>
              <strong>Management:</strong> permit both admin-to-BMC and
              BMC-to-ISO paths, including return traffic.
            </li>
          </ul>
          <p className="handoff-check">
            <strong>Confirm:</strong> source/destination rules and return paths.
            For filtered node networks, resolve VIP failover ACLs and the full
            role-specific port matrix with the network team.
          </p>
          <PrerequisiteLink target="ports">
            Detailed firewall planning table →
          </PrerequisiteLink>
        </article>
        <article className="panel">
          <h3 id="prerequisites-tickets-bmc" tabIndex={-1}>
            Server management
          </h3>
          <p className="owner-line">
            Server operations + management-network owners
          </p>
          <ul>
            <li>
              Configure five BMC addresses on VLAN 140 with gateway{" "}
              <code>10.20.40.1</code>. Supply credentials for virtual media,
              boot selection and power control.
            </li>
            <li>
              Make the full agent ISO reachable from every BMC. Check URL
              resolution, TLS trust, firmware and any virtual-media license.
            </li>
            <li>
              Confirm the intended install disk, boot mode and one-time media
              boot. Collect real NIC MACs and unique hostnames for the
              installer.
            </li>
          </ul>
          <p className="handoff-check">
            <strong>Confirm:</strong> an authorized admin can mount the ISO and
            boot each server. BMC addressing is independent of node DHCP/static
            mode.
          </p>
        </article>
      </div>
    </section>
  );
}
