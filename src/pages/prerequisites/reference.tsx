import { exampleNodes } from "./data";
import { Disclosure } from "./interactions";

const installConfig =
  "baseDomain: dc.example.com\nmetadata:\n  name: ocp5\ncontrolPlane:\n  name: master\n  replicas: 3\ncompute:\n  - name: worker\n    replicas: 2\nnetworking:\n  machineNetwork:\n    - cidr: 10.20.30.0/24\nplatform:\n  baremetal:\n    apiVIPs: [10.20.30.10]\n    ingressVIPs: [10.20.30.11]";
const dhcpConfig =
  "rendezvousIP: 10.20.30.21\nadditionalNTPSources:\n  - 10.20.10.123\nhosts:\n  - hostname: cp-0.ocp5.dc.example.com\n    role: master\n    interfaces:\n      - name: eno1\n        macAddress: 02:00:00:00:30:21\n    # networkConfig omitted for simple DHCP\n    # Add cp-1/cp-2 as master; worker-0/worker-1 as worker.";
const staticConfig =
  "rendezvousIP: 10.20.30.21\nadditionalNTPSources:\n  - 10.20.10.123\nhosts:\n  - hostname: cp-0.ocp5.dc.example.com\n    role: master\n    interfaces:\n      - name: eno1\n        macAddress: 02:00:00:00:30:21\n    networkConfig:\n      interfaces:\n        - name: eno1\n          type: ethernet\n          state: up\n          mtu: 1500\n          ipv4:\n            enabled: true\n            dhcp: false\n            address:\n              - ip: 10.20.30.21\n                prefix-length: 24\n          ipv6:\n            enabled: false\n      dns-resolver:\n        config:\n          server: [10.20.10.53, 10.20.10.54]\n      routes:\n        config:\n          - destination: 0.0.0.0/0\n            next-hop-address: 10.20.30.1\n            next-hop-interface: eno1\n            table-id: 254";

const agentDocs =
  "https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/installing_an_on-premise_cluster_with_the_agent-based_installer/";
const firewallDocs =
  "https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/installation_configuration/configuring-firewall";
const sources = [
  {
    label: "Agent networking, rendezvous and host configuration",
    href: `${agentDocs}preparing-to-install-with-agent-based-installer`,
  },
  {
    label: "Agent configuration parameters",
    href: `${agentDocs}installation-config-parameters-agent`,
  },
  {
    label: "Installation monitoring and MTU",
    href: `${agentDocs}installing-with-agent-based-installer`,
  },
  {
    label: "Firewall flow matrix and content endpoint allowlist",
    href: firewallDocs,
  },
  {
    label: "Bare-metal node connectivity and routing",
    href: "https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/installing_on_bare_metal/user-provisioned-infrastructure#installation-network-connectivity-user-infra_installing-bare-metal",
  },
  {
    label: "Disconnected mirroring",
    href: `${agentDocs}understanding-disconnected-installation-mirroring`,
  },
  {
    label: "Assisted guidance: external DNS and wildcard scope",
    href: "https://docs.redhat.com/en/documentation/assisted_installer_for_openshift_container_platform/2026/html/installing_openshift_container_platform_with_the_assisted_installer/prerequisites#external-dns-requirements_prerequisites",
  },
  {
    label: "Bare-metal internal node DNS and managed load balancing",
    href: "https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/config_apis/infrastructure-config-openshift-io-v1",
  },
  {
    label: "Assisted guidance: Redfish virtual-media boot",
    href: "https://docs.redhat.com/en/documentation/assisted_installer_for_openshift_container_platform/2026/html/installing_openshift_container_platform_with_the_assisted_installer/assembly_booting-hosts-with-the-discovery-image",
  },
];

const flows = [
  {
    from: "All nodes → cp-0 (10.20.30.21)",
    ports: "TCP 8090",
    purpose: "Agent discovery/bootstrap; installation only.",
  },
  {
    from: "Nodes → resolvers; admin/BMC → their resolvers",
    ports: "UDP + TCP 53",
    purpose: "Resolution for the names each client uses.",
  },
  {
    from: "All nodes → approved NTP sources",
    ports: "UDP 123",
    purpose: "Time synchronization.",
  },
  {
    from: "DHCP clients ↔ server / relay",
    ports: "UDP 68 ↔ 67",
    purpose: "DHCP mode only. Confirm relay policy; BMC DHCP is independent.",
  },
  {
    from: "Nodes + building workstation → content endpoints",
    ports: "TCP 443 or configured proxy/mirror port",
    purpose:
      "Release images, authentication and CDN redirects. Use the full endpoint allowlist.",
  },
  {
    from: "Cluster → Telemetry / Red Hat Lightspeed",
    ports: "TCP 443 or configured proxy port",
    purpose: "Required endpoints unless Telemetry is disabled.",
  },
  {
    from: "Nodes ↔ peer nodes",
    ports: "ICMP; TCP 1936, 9000–9999, 10250–10259; UDP 6081, 9000–9999",
    purpose:
      "Documented peer groups, metrics and OVN Geneve; apply the role-specific matrix.",
  },
  {
    from: "Nodes → API endpoints; admin → API VIP .10",
    ports: "TCP 6443",
    purpose: "Cluster API, CLI and installation monitoring.",
  },
  {
    from: "Nodes → machine-config-server endpoints",
    ports: "TCP 22623, 22624",
    purpose:
      "Internal configuration traffic. Identify destinations; 22624 is not assumed exposed on the API VIP.",
  },
  {
    from: "Control-plane nodes ↔ each other",
    ports: "TCP 2379–2380",
    purpose: "etcd communication.",
  },
  {
    from: "Eligible VIP hosts ↔ peers / local L2",
    ports: "Site-specific failover policy",
    purpose:
      "Resolve exact VIP failover ACLs before applying a filtered network policy.",
  },
  {
    from: "Nodes + intended clients → ingress VIP .11 / routers",
    ports: "TCP 80, 443",
    purpose: "Routes, console, OAuth and cluster health checks.",
  },
  {
    from: "Admin → nodes",
    ports: "TCP 22",
    purpose: "Optional SSH diagnostics; provide an SSH public key.",
  },
  {
    from: "Admin → BMCs; BMCs → ISO host 10.20.50.20",
    ports: "TCP 443 in this example",
    purpose:
      "Management API and URL-mounted media. Confirm hardware-specific ports and TLS support.",
  },
  {
    from: "Intended NodePort clients → selected nodes",
    ports: "Selected TCP/UDP ports within 30000–32767",
    purpose:
      "Only when NodePort services are used. This range can be blocked when unused.",
  },
];

function Inventory() {
  return (
    <Disclosure id="inventory" summary="Address and NIC inventory">
      <div className="detail-body">
        <p>
          Example addresses and MACs. Collect the real NIC inventory before
          generating media; each hostname uses the suffix{" "}
          <code>.ocp5.dc.example.com</code>.
        </p>
        <section
          className="table-wrap"
          aria-label="Address inventory"
          // biome-ignore lint/a11y/noNoninteractiveTabindex: Keyboard users need to scroll the reference table.
          tabIndex={0}
        >
          <table>
            <thead>
              <tr>
                <th scope="col">Host / role</th>
                <th scope="col">Machine IP /24</th>
                <th scope="col">NIC / switch port</th>
                <th scope="col">MAC</th>
                <th scope="col">BMC IP /24</th>
              </tr>
            </thead>
            <tbody>
              {exampleNodes.map((node) => (
                <tr key={node.name}>
                  <th scope="row">
                    {node.name}
                    <br />
                    {node.role}
                    {node.rendezvous ? " · rendezvous" : ""}
                  </th>
                  <td>{node.address}</td>
                  <td>eno1 / {node.port}</td>
                  <td>
                    <code>{node.mac}</code>
                  </td>
                  <td>{node.bmc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <p className="caption">
          API VIP: <code>10.20.30.10</code>. Ingress VIP:{" "}
          <code>10.20.30.11</code>. Reserve both without DHCP leases or manual
          NIC assignment. Admin, ISO-host and shared-service IPs are additional
          site infrastructure.
        </p>
        <p>
          For VLAN tagging or bonds, match NMState to the switch configuration.
          Review port isolation, anti-spoofing and static bindings where DHCP
          snooping or source guard is enabled. The selected bond mode determines
          whether switch aggregation is needed.
        </p>
      </div>
    </Disclosure>
  );
}

function Configuration() {
  return (
    <Disclosure id="configuration" summary="Installer configuration excerpts">
      <div className="detail-body">
        <p>
          These excerpts show the network handoff. Add the remaining required
          installation fields and one host entry per server: three{" "}
          <code>master</code> roles and two <code>worker</code> roles.
        </p>
        <div className="two-col">
          <div>
            <h3>install-config.yaml</h3>
            <pre>
              <code>{installConfig}</code>
            </pre>
          </div>
          <div className="dhcp-only">
            <h3>agent-config.yaml · DHCP</h3>
            <pre>
              <code>{dhcpConfig}</code>
            </pre>
          </div>
          <div className="static-only">
            <h3>agent-config.yaml · static</h3>
            <pre>
              <code>{staticConfig}</code>
            </pre>
          </div>
        </div>
        <p className="spaced">
          Simple DHCP can omit <code>networkConfig</code>; VLANs and bonds can
          still need NMState. Explicit hostnames override DHCP or reverse-lookup
          discovery. Review node DNS records for the chosen workflow and site
          policy.
        </p>
        <p>
          <code>additionalNTPSources</code> adds to other configured time
          sources. Keep a default route for the node network even when
          disconnected. Allow at least 100 bytes for OVN overhead; additional
          encapsulation needs more MTU headroom.
        </p>
        <p className="source">
          <a
            href={`${agentDocs}installation-config-parameters-agent`}
            target="_blank"
            rel="noopener"
          >
            Agent configuration reference ↗
          </a>
        </p>
      </div>
    </Disclosure>
  );
}

function DnsAccess() {
  return (
    <Disclosure
      id="dns-access"
      summary="Internal DNS and temporary workstation access"
    >
      <div className="detail-body">
        <p>
          With <code>platform: baremetal</code>, explicit VIPs and managed
          internal DNS, nodes receive cluster-name resolution internally. Site
          publication serves external clients. This conclusion does not cover{" "}
          <code>platform: none</code> or externally managed cluster DNS.
        </p>
        <p className="published-only spaced">
          Client DNS supplies the API and application records shown in the
          handoff. Clients also need routes and firewall access to their VIPs.
        </p>
        <div className="apps-pending-only spaced">
          <p>
            For the monitoring workstation only, an example{" "}
            <code>/etc/hosts</code> entry is:
          </p>
          <pre>
            <code>{"10.20.30.10 api.ocp5.dc.example.com"}</code>
          </pre>
          <p className="spaced">
            This is an implementation-based workaround. The Agent guide
            specifies an API DNS record. A hosts file cannot supply the{" "}
            <code>*.apps</code> wildcard; publish application DNS for general
            browser access.
          </p>
        </div>
        <p className="spaced">
          Red Hat documents internal node DNS for bare metal and permits
          deferred external DNS in Assisted cluster-managed installations. The
          Agent guide requires API DNS for monitoring. The precise Agent
          bootstrap behavior is also supported by the linked release-4.22
          implementation.
        </p>
        <p className="source">
          <a
            href={`${agentDocs}installing-with-agent-based-installer`}
            target="_blank"
            rel="noopener"
          >
            Agent monitoring prerequisite ↗
          </a>
          {" · "}
          <a
            href="https://docs.redhat.com/en/documentation/assisted_installer_for_openshift_container_platform/2026/html/installing_openshift_container_platform_with_the_assisted_installer/prerequisites#external-dns-requirements_prerequisites"
            target="_blank"
            rel="noopener"
          >
            Assisted DNS guidance ↗
          </a>
          {" · "}
          <a
            href="https://github.com/openshift/installer/blob/0b8b4f3205a7a7d0101e7e41595363f2ab2730f4/pkg/asset/ignition/machine/node.go#L26-L60"
            target="_blank"
            rel="noopener"
          >
            Ignition implementation ↗
          </a>
          {" · "}
          <a
            href="https://github.com/openshift/machine-config-operator/blob/6ee7ec8468a63d46e5fecb4a60244357b1b2a6ad/templates/common/on-prem/files/coredns-corefile.yaml#L14-L44"
            target="_blank"
            rel="noopener"
          >
            Node DNS implementation ↗
          </a>
        </p>
      </div>
    </Disclosure>
  );
}

function Ports() {
  return (
    <Disclosure id="ports" summary="Detailed firewall planning table">
      <div className="detail-body">
        <p>
          This is a planning summary. For filtered node networks, use the
          release-specific role matrix and resolve exact VIP failover ACLs
          before implementing rules. Permit return traffic.
        </p>
        <section
          className="table-wrap"
          aria-label="Firewall planning table"
          // biome-ignore lint/a11y/noNoninteractiveTabindex: Keyboard users need to scroll the reference table.
          tabIndex={0}
        >
          <table>
            <thead>
              <tr>
                <th scope="col">Initiator → destination</th>
                <th scope="col">Protocol / destination port</th>
                <th scope="col">Purpose / condition</th>
              </tr>
            </thead>
            <tbody>
              {flows.map((flow) => (
                <tr key={flow.from}>
                  <th scope="row">{flow.from}</th>
                  <td>{flow.ports}</td>
                  <td>{flow.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <p className="spaced">
          The role matrix also lists TCP 6080, 8798, 17697, 18080, internal DNS
          53 and HAProxy 9444/9445/9454. Determine which listeners need remote
          access and their actual source/destination hosts.
        </p>
        <p className="source">
          <a
            href={`${firewallDocs}#network-flow-matrix_configuring-firewall`}
            target="_blank"
            rel="noopener"
          >
            Red Hat role-specific flows and conditional NodePort range ↗
          </a>
          {" · "}
          <a
            href={`${agentDocs}preparing-to-install-with-agent-based-installer#agent-install-networking-ports_preparing-to-install-with-agent-based-installer`}
            target="_blank"
            rel="noopener"
          >
            Agent TCP 8090 requirement ↗
          </a>
        </p>
      </div>
    </Disclosure>
  );
}

export function TechnicalReference() {
  return (
    <section className="section" data-section="reference">
      <h2 id="prerequisites-reference" tabIndex={-1}>
        Technical reference
      </h2>
      <p>
        Use the inventory, configuration examples and flow details to prepare
        the site handoff.
      </p>
      <Inventory />
      <Configuration />
      <Ports />
      <DnsAccess />
      <Disclosure
        id="sources"
        summary="Red Hat documentation and example scope"
      >
        <div className="detail-body">
          <p>
            OCP 4.22 · reviewed 4 November 2026. Three control-plane nodes, two
            workers, IPv4, <code>platform: baremetal</code>, managed VIPs,
            OVN-Kubernetes and full-ISO BMC boot. Addresses, VLANs, MACs and
            owners are illustrative. This is a documentation review, not a lab
            installation.
          </p>
          <ul className="source-list">
            {sources.map((source) => (
              <li key={source.href}>
                <a href={source.href} target="_blank" rel="noopener">
                  {source.label} ↗
                </a>
              </li>
            ))}
          </ul>
          <p>
            Other installation choices:{" "}
            <a
              href={`${agentDocs}prepare-pxe-assets-agent`}
              target="_blank"
              rel="noopener"
            >
              PXE ↗
            </a>
            {" · "}
            <a
              href={`${agentDocs}installing-ove`}
              target="_blank"
              rel="noopener"
            >
              self-contained media ↗
            </a>
            . Review the selected workflow for IPv6 or optional install-time
            integrations.
          </p>
        </div>
      </Disclosure>
    </section>
  );
}
