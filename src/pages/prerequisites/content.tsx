import { exampleNodes } from "./data";

import { Disclosure } from "./interactions";

export function Addressing() {
  return (
    <section className="section" data-section="addressing">
      <h2 id="prerequisites-addressing" tabIndex={-1}>
        DHCP vs static: the address plan stays the same
      </h2>
      <p>
        DHCP does not remove IP allocation work. Static addressing removes the
        node DHCP dependency, while retaining IPAM, gateway, route, resolver and
        switching prerequisites.
      </p>
      <div className="two-col">
        <article className="panel">
          <h3>DHCP reservation path</h3>
          <div className="flow">
            <span>IT reservation + options</span>
            <b>→</b>
            <span>Node NIC</span>
            <b>→</b>
            <span>Stable IP after reboot</span>
          </div>
          <ol>
            <li>
              Reserve all five node addresses against the actual NIC MACs below.
              Confirm the DHCP client identity matches across discovery and
              installed RHCOS.
            </li>
            <li>
              Supply subnet mask <code>255.255.255.0</code>, router{" "}
              <code>10.20.30.1</code>, and resolver IPs <code>10.20.10.53</code>{" "}
              / <code>.54</code>.
            </li>
            <li>
              Use explicit agent hostnames. If DHCP also provides names, keep
              them consistent. DDNS updates are a separate DNS integration.
            </li>
            <li>
              Set rendezvous to <code>10.20.30.21</code> before generating the
              ISO. Ensure it always reaches cp-0.
            </li>
          </ol>
          <p>
            <b>IT dependency:</b> functioning DHCP scope, stable reservations,
            any relay/IP-helper, and permitted DHCP responses. Two VIPs remain
            reserved and unleased. Keep DHCP available after installation while
            nodes retain DHCP configuration.
          </p>
        </article>
        <article className="panel">
          <h3>Static IP path</h3>
          <div className="flow">
            <span>IT-approved address plan</span>
            <b>→</b>
            <span>NMState in agent ISO</span>
            <b>→</b>
            <span>Configured node NIC</span>
          </div>
          <ol>
            <li>
              Allocate all five node addresses and exclude them from any DHCP
              allocation. Exclude the two VIPs as well.
            </li>
            <li>
              Give the installer owner each NIC MAC, prefix, gateway, resolvers
              and any additional routes.
            </li>
            <li>
              Put per-node NMState networking and explicit hostnames into{" "}
              <code>agent-config.yaml</code>. Disable DHCP on the selected NIC.
            </li>
            <li>
              Use <code>10.20.30.21</code> as rendezvous. For this example,
              default route via <code>10.20.30.1</code> reaches services outside
              VLAN 130.
            </li>
          </ol>
          <p>
            <b>IT dependency:</b> the address allocation and network must
            already work. A static address in YAML does not create a VLAN,
            authorize an IP, or install a route on a site router.
          </p>
        </article>
      </div>
      <section
        className="table-wrap"
        aria-label="Addressing reference table"
        // biome-ignore lint/a11y/noNoninteractiveTabindex: Keyboard users need to scroll the reference table.
        tabIndex={0}
      >
        <table>
          <thead>
            <tr>
              <th scope="col">Server / hostname prefix</th>
              <th scope="col">Role</th>
              <th scope="col">Machine address</th>
              <th scope="col">Example data NIC MAC</th>
              <th scope="col">Separate BMC address</th>
              <th scope="col">Rendezvous</th>
            </tr>
          </thead>
          <tbody>
            {exampleNodes.map((node) => (
              <tr key={node.name}>
                <th scope="row">{node.name}</th>
                <td>{node.role}</td>
                <td>
                  <code>{node.address}/24</code>
                </td>
                <td>
                  <code>{node.mac}</code>
                </td>
                <td>
                  <code>{node.bmc}/24</code>
                </td>
                <td>{node.rendezvous ? "Yes · .21" : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <p className="caption">
        Hostname suffix: <code>.ocp5.dc.example.com</code>. Sample MACs are
        placeholders; collect the real NIC inventory. The seven machine
        addresses need not be contiguous. BMC addressing is configured
        independently of node DHCP/static mode.
      </p>
      <Disclosure
        id="configuration"
        summary={
          <>
            <span className="ticket-id">Handoff</span>How the approved values
            enter the agent ISO
          </>
        }
      >
        <div className="detail-body">
          <p>
            These are excerpts showing the external-network handoff, not
            complete installation files. Add an entry for each of the five hosts
            with its own hostname, address and MAC. Set{" "}
            <code>role: master</code> for cp-0 through cp-2 and{" "}
            <code>role: worker</code> for worker-0 and worker-1.
          </p>
          <div className="two-col">
            <div>
              <strong>Common values · installation config excerpt</strong>
              <pre>
                <code>
                  {
                    "baseDomain: dc.example.com\nmetadata:\n  name: ocp5\ncontrolPlane:\n  name: master\n  replicas: 3\ncompute:\n  - name: worker\n    replicas: 2\nnetworking:\n  machineNetwork:\n    - cidr: 10.20.30.0/24\nplatform:\n  baremetal:\n    apiVIPs: [10.20.30.10]\n    ingressVIPs: [10.20.30.11]"
                  }
                </code>
              </pre>
              <p>
                Set both VIPs explicitly and agree the permanent domain before
                building media. Node bootstrap uses these explicit addresses and
                managed internal DNS. Prepare API name resolution separately on
                the monitoring workstation.
              </p>
            </div>
            <div className="dhcp-only">
              <strong>DHCP · agent configuration excerpt</strong>
              <pre>
                <code>
                  {
                    "rendezvousIP: 10.20.30.21\nadditionalNTPSources:\n  - 10.20.10.123\nhosts:\n  - hostname: cp-0.ocp5.dc.example.com\n    role: master\n    interfaces:\n      - name: eno1\n        macAddress: 02:00:00:00:30:21\n    # networkConfig omitted for simple DHCP\n    # Add cp-1/cp-2 as master; worker-0/worker-1 as worker."
                  }
                </code>
              </pre>
              <p>
                DHCP supplies the node's IP, mask, gateway and resolver
                settings. VLANs or bonds may still require NMState even when
                address assignment uses DHCP.
              </p>
            </div>
            <div className="static-only">
              <strong>Static · agent configuration excerpt</strong>
              <pre>
                <code>
                  {
                    "rendezvousIP: 10.20.30.21\nadditionalNTPSources:\n  - 10.20.10.123\nhosts:\n  - hostname: cp-0.ocp5.dc.example.com\n    role: master\n    interfaces:\n      - name: eno1\n        macAddress: 02:00:00:00:30:21\n    networkConfig:\n      interfaces:\n        - name: eno1\n          type: ethernet\n          state: up\n          mtu: 1500\n          ipv4:\n            enabled: true\n            dhcp: false\n            address:\n              - ip: 10.20.30.21\n                prefix-length: 24\n          ipv6:\n            enabled: false\n      dns-resolver:\n        config:\n          server: [10.20.10.53, 10.20.10.54]\n      routes:\n        config:\n          - destination: 0.0.0.0/0\n            next-hop-address: 10.20.30.1\n            next-hop-interface: eno1\n            table-id: 254"
                  }
                </code>
              </pre>
            </div>
          </div>
          <p className="source">
            <a
              href="https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/installing_an_on-premise_cluster_with_the_agent-based_installer/preparing-to-install-with-agent-based-installer"
              target="_blank"
              rel="noopener"
            >
              Agent DHCP/static networking ↗
            </a>{" "}
            ·{" "}
            <a
              href="https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/installing_an_on-premise_cluster_with_the_agent-based_installer/installation-config-parameters-agent"
              target="_blank"
              rel="noopener"
            >
              Agent configuration parameters ↗
            </a>
          </p>
        </div>
      </Disclosure>
    </section>
  );
}

export function Dns() {
  return (
    <section className="section" data-section="dns">
      <h2 id="prerequisites-dns" tabIndex={-1}>
        DNS: internal resolution and client access
      </h2>
      <div className="dns-banner">
        <h3>
          Site API DNS publication can wait for this managed bare-metal design.
        </h3>
        <p>
          Nodes do need internal API name resolution during installation, but
          you do not need to pre-create the API record in site DNS. Initial
          bare-metal Ignition uses the API VIP directly; bootstrap and installed
          nodes receive local DNS for <code>api</code> and <code>api-int</code>.
          This behavior is verified in the <code>release-4.22</code> source and
          agrees with Red Hat’s Assisted Installer guidance. The Agent guide’s
          API DNS prerequisite belongs to workstation monitoring. Multi-node{" "}
          <code>platform: none</code> and configurations that use external DNS
          require a separate review.
        </p>
      </div>
      <div className="two-col">
        <article className="panel">
          <span className="chip">Node and workstation resolution</span>
          <h3 className="spaced">Prepare names and resolver access</h3>
          <ol>
            <li>
              Choose <code>ocp5.dc.example.com</code> as the permanent cluster
              identity.
            </li>
            <li>
              Supply API <code>.10</code>, ingress <code>.11</code>, and
              rendezvous <code>.21</code> directly.
            </li>
            <li>
              Set each node's hostname in the agent configuration. This avoids
              relying on reverse lookup to discover the hostname.
            </li>
            <li>
              Give nodes reachable upstream resolvers through DHCP or static
              NMState for registry, mirror, proxy and site-service names.
            </li>
            <li>
              Make <code>api.ocp5.dc.example.com</code> resolve to{" "}
              <code>10.20.30.10</code> on the workstation running monitoring
              commands. Site DNS or a local <code>/etc/hosts</code> entry can
              supply that mapping.
            </li>
            <li>
              Prepare application-route DNS and network access for console,
              OAuth and other browser clients.
            </li>
          </ol>
          <p>
            Example workstation <code>/etc/hosts</code> entry:
          </p>
          <pre>
            <code>{"10.20.30.10 api.ocp5.dc.example.com"}</code>
          </pre>
          <p>
            This local mapping serves that workstation only. Node resolution is
            supplied by the managed installation. The Agent guide specifies a
            DNS record; the hosts-file alternative here is an
            implementation-based client workaround.
          </p>
        </article>
        <article className="panel">
          <span className="chip optional">Example DNS publication plan</span>
          <h3 className="spaced">Records and visibility</h3>
          <p>
            Publish records for clients that need them. Site publication is
            separate from the local DNS that the managed cluster provides to its
            nodes.
          </p>
          <pre>
            <code>
              {
                "api.ocp5.dc.example.com.      A  10.20.30.10\napi-int.ocp5.dc.example.com.  A  10.20.30.10\n*.apps.ocp5.dc.example.com.   A  10.20.30.11"
              }
            </code>
          </pre>
          <p>
            External API clients use <code>api</code>; application clients use{" "}
            <code>*.apps</code>. Nodes receive <code>api-int</code> resolution
            internally. Publishing <code>api-int</code> in site DNS is not
            needed to bootstrap this managed design; include it if your external
            consumers need it.
          </p>
          <p>
            <b>
              Do not publish <code>*.ocp5.dc.example.com</code>.
            </b>{" "}
            The Assisted Installer documentation prohibits a wildcard at the
            cluster-domain level. Scope the wildcard to <code>*.apps</code>.
          </p>
          <p>
            Explicit hostnames configure node identity; they do not establish a
            blanket exemption from forward/reverse DNS requirements. Review node
            records for the selected workflow and site policy.
          </p>
          <p>
            Configure clients to use the resolver serving these records. A hosts
            file does not support the <code>*.apps</code> wildcard; prepare
            application DNS for general browser access. Permit DNS over UDP and
            TCP 53 and routed access to the VIPs.
          </p>
        </article>
      </div>
      <p className="source">
        <a
          href="https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/installing_an_on-premise_cluster_with_the_agent-based_installer/installing-with-agent-based-installer"
          target="_blank"
          rel="noopener"
        >
          Agent API DNS prerequisite for monitoring ↗
        </a>{" "}
        ·{" "}
        <a
          href="https://docs.redhat.com/en/documentation/assisted_installer_for_openshift_container_platform/2026/html/installing_openshift_container_platform_with_the_assisted_installer/prerequisites#external-dns-requirements_prerequisites"
          target="_blank"
          rel="noopener"
        >
          Assisted external DNS and wildcard restrictions ↗
        </a>{" "}
        ·{" "}
        <a
          href="https://docs.redhat.com/en/documentation/assisted_installer_for_openshift_container_platform/2026/html/installing_openshift_container_platform_with_the_assisted_installer/assembly_network-configuration#network-management-types-cluster_network-configuration"
          target="_blank"
          rel="noopener"
        >
          Assisted cluster-managed networking ↗
        </a>{" "}
        ·{" "}
        <a
          href="https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/installing_an_on-premise_cluster_with_the_agent-based_installer/installation-config-parameters-agent#agent-configuration-parameters-optional_installation-config-parameters-agent"
          target="_blank"
          rel="noopener"
        >
          Agent hostname inputs ↗
        </a>
        .{" "}
        <a
          href="https://github.com/openshift/installer/blob/0b8b4f3205a7a7d0101e7e41595363f2ab2730f4/pkg/asset/ignition/machine/node.go#L26-L60"
          target="_blank"
          rel="noopener"
        >
          Bare-metal Ignition source ↗
        </a>{" "}
        ·{" "}
        <a
          href="https://github.com/openshift/machine-config-operator/blob/6ee7ec8468a63d46e5fecb4a60244357b1b2a6ad/templates/common/on-prem/files/coredns-corefile.yaml#L14-L44"
          target="_blank"
          rel="noopener"
        >
          Managed CoreDNS source ↗
        </a>
        . Source review establishes the implementation path; no five-node
        deployment was performed for this diagram.
      </p>
    </section>
  );
}

export function Handoffs() {
  return (
    <section className="section" data-section="tickets">
      <h2 id="prerequisites-tickets" tabIndex={-1}>
        IT handoffs: what each team supplies
      </h2>
      <p>
        Open each item for the requested settings, the responsible team and the
        condition that makes it necessary.
      </p>
      <Disclosure
        id="tickets/ipam"
        summary={
          <>
            <span className="ticket-id">T1</span>IPAM, permanent identity and
            conflict review <span className="chip">Required</span>
          </>
        }
      >
        <div className="detail-body">
          <div className="owner-line">IPAM / DDI + network architecture</div>
          <ul>
            <li>
              Allocate five stable node addresses <code>10.20.30.21–25</code>{" "}
              and two unused VIPs <code>.10 / .11</code> on the machine LAN.
              Supply prefix, subnet, VLAN, gateway and routing ownership.
              Reserve VIPs in both DHCP and static modes; do not attach them to
              a physical NIC or give them DHCP leases.
            </li>
            <li>
              For BMC mounting, allocate the five management addresses{" "}
              <code>10.20.40.21–25</code> separately, plus their prefix, gateway
              and management VLAN. Existing admin, ISO-host and shared-service
              addresses are additional infrastructure, not part of the
              seven-address machine allocation.
            </li>
            <li>
              Agree cluster name, base domain and five unique node names before
              building media. Prepare API resolution on the monitoring
              workstation; site DNS publication can be scheduled separately for
              this managed design.
            </li>
            <li>
              Review overlap with existing LAN, WAN, VPN, mirror and service
              networks. Coordinate the installer's pod/service address choices
              with network architecture, but do not route pod/service CIDRs on
              the physical routers for this baseline.
            </li>
            <li>
              Agent uses Podman's <code>10.88.0.0/16</code> by default: the
              machine subnet must not include it. Also check the selected
              release's OVN internal ranges when corporate networks use
              overlapping space.
            </li>
          </ul>
          <p className="source">
            <a
              href="https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/installing_an_on-premise_cluster_with_the_agent-based_installer/preparing-to-install-with-agent-based-installer"
              target="_blank"
              rel="noopener"
            >
              Agent network prerequisites ↗
            </a>
          </p>
        </div>
      </Disclosure>
      <Disclosure
        id="tickets/dhcp"
        summary={
          <>
            <span className="ticket-id">T2</span>DHCP scope or static address
            exclusions <span className="chip condition">Choose one</span>
          </>
        }
      >
        <div className="detail-body">
          <div className="owner-line">DHCP / DDI team + IPAM</div>
          <ul>
            <li>
              <strong>DHCP path:</strong> persistent MAC/client-identity
              reservations for all five nodes; correct subnet mask, router and
              resolver options; consistent hostnames if supplied. Confirm leases
              and addresses persist across discovery, installation and reboot.
            </li>
            <li>
              <strong>If DHCP is remote:</strong> add the VLAN's relay/IP-helper
              and return path. DHCP broadcasts do not cross routers without
              relay. Check DHCP snooping trust and relay ACLs.
            </li>
            <li>
              <strong>Static path:</strong> exclude allocated node IPs from DHCP
              and approve their use on the intended switch ports. If IP source
              guard or dynamic ARP inspection depends on DHCP snooping, supply
              the necessary static bindings or equivalent policy.
            </li>
            <li>
              <strong>Both:</strong> exclude the two manually assigned VIPs and
              permit their movement between eligible nodes. Keep DNS updates and
              DHCP reservations coordinated if DDNS is enabled; DDNS is not
              assumed here.
            </li>
          </ul>
          <p className="source">
            <a
              href="https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/installing_an_on-premise_cluster_with_the_agent-based_installer/preparing-to-install-with-agent-based-installer"
              target="_blank"
              rel="noopener"
            >
              Agent DHCP/static requirements ↗
            </a>{" "}
            · DHCP-snooping/source-guard items are conditional site-policy
            checks.
          </p>
        </div>
      </Disclosure>
      <Disclosure
        id="tickets/network"
        summary={
          <>
            <span className="ticket-id">T3</span>Switch ports, gateway, routes,
            MTU and VIP movement <span className="chip">Required</span>
          </>
        }
      >
        <div className="detail-body">
          <div className="owner-line">Data-center network team</div>
          <ul>
            <li>
              Provide active cabling, correct port-to-NIC/MAC inventory and VLAN
              130 access ports for the illustrated untagged NICs. If a
              trunk/tagged VLAN is used, agree allowed tags and match the
              NMState interface configuration.
            </li>
            <li>
              Keep the five node NICs and both VIPs on the same L2 segment in
              this design. Ensure the site network permits VIP reachability and
              failover. Review port isolation, anti-spoofing and IP/MAC
              restrictions. The exact Agent failover ACLs are not established by
              the installer sources cited here.
            </li>
            <li>
              Provide the node default gateway <code>10.20.30.1</code> and
              routes/return routes to resolver, NTP, registry/mirror/proxy,
              admin and required site networks. A disconnected installation does
              not require Internet reachability; keep the node default route.
            </li>
            <li>
              Provide the BMC gateway <code>10.20.40.1</code>, routing from the
              admin network, and routing from BMCs to the selected ISO source.
              Node-LAN routes do not establish BMC reachability.
            </li>
            <li>
              Agree physical MTU end to end; the example uses 1500. Allow 100
              bytes for OVN overhead: a 1400 cluster-network MTU with a 1500
              underlay in this example without IPsec. Additional encapsulation
              requires additional allowance. Jumbo frames require every
              switch/link on the path to support them.
            </li>
            <li>
              If bonding is used, match switch configuration to the selected
              bond mode and collect every participating NIC MAC. Configure
              aggregation only when that mode requires it; the Agent guide
              includes an <code>active-backup</code> example. Confirm
              NIC/firmware link operation, consistent boot NIC selection, and
              any network-access-control authorization.
            </li>
          </ul>
          <p className="source">
            <a
              href="https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/installing_an_on-premise_cluster_with_the_agent-based_installer/preparing-to-install-with-agent-based-installer"
              target="_blank"
              rel="noopener"
            >
              VLAN / bond configuration ↗
            </a>{" "}
            ·{" "}
            <a
              href="https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/installing_an_on-premise_cluster_with_the_agent-based_installer/installing-with-agent-based-installer#installing-ocp-agent-cluster-network-mtu_installing-with-agent-based-installer"
              target="_blank"
              rel="noopener"
            >
              Agent installer MTU guidance ↗
            </a>{" "}
            ·{" "}
            <a
              href="https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/installing_on_bare_metal/user-provisioned-infrastructure#configuring-default-gateway-route_installing-restricted-networks-bare-metal"
              target="_blank"
              rel="noopener"
            >
              Default gateway and routes ↗
            </a>{" "}
            · Switch-policy checks are site-specific design implications.
          </p>
        </div>
      </Disclosure>
      <Disclosure
        id="tickets/security"
        summary={
          <>
            <span className="ticket-id">T4</span>Firewall and routed access
            approvals{" "}
            <span className="chip">Required where filtering exists</span>
          </>
        }
      >
        <div className="detail-body">
          <div className="owner-line">Network security / firewall team</div>
          <p>
            Use the flow summary below with the OCP 4.22 documentation to
            prepare exact source CIDRs, destination IPs/FQDNs, protocols,
            destination ports, directions, owners and expiry dates. Resolve the
            noted VIP failover details before issuing a complete ACL request.
            Permit stateful return traffic. Include temporary <code>8090</code>{" "}
            access during install, peer-node communication, VIP movement,
            registry content delivery, DNS, time, admin access and the separate
            BMC-to-media path.
          </p>
          <p>
            Site firewalls can filter traffic even within one VLAN through
            switch ACLs or segmentation controls. A permitted Internet egress
            rule does not establish peer-node connectivity. Restrict management
            and node-internal rules to their intended networks.
          </p>
          <p className="source">
            <a
              href="https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/installing_on_bare_metal/user-provisioned-infrastructure"
              target="_blank"
              rel="noopener"
            >
              Standard OCP node communication requirements ↗
            </a>{" "}
            ·{" "}
            <a
              href="https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/installing_an_on-premise_cluster_with_the_agent-based_installer/preparing-to-install-with-agent-based-installer"
              target="_blank"
              rel="noopener"
            >
              Agent rendezvous requirement ↗
            </a>
          </p>
        </div>
      </Disclosure>
      <Disclosure
        id="tickets/services"
        summary={
          <>
            <span className="ticket-id">T5</span>Resolver service, time sources
            and client DNS <span className="chip">Services required</span>
          </>
        }
      >
        <div className="detail-body">
          <div className="owner-line">
            DNS / DDI + shared infrastructure services
          </div>
          <ul>
            <li>
              Supply reachable recursive/forwarding resolvers for registry,
              mirror, proxy and site endpoints. Both listed resolvers must serve
              the required names consistently.
            </li>
            <li>
              Supply reachable, accurate time sources and permit UDP 123 from
              all nodes. Add the example <code>10.20.10.123</code> through{" "}
              <code>additionalNTPSources</code>. This adds to sources configured
              through other means; it does not replace them.
            </li>
            <li>
              Provide API name resolution on the monitoring workstation through
              site DNS or a local hosts entry. Publish API and application-route
              records for broader client access. Node-side <code>api</code> and{" "}
              <code>api-int</code> resolution is managed internally in this
              design, so site publication is not a node-installation gate.
            </li>
            <li>
              Set unique hostnames explicitly to avoid relying on PTR lookup for
              hostname discovery. Review forward/reverse records for the
              selected workflow and site policy; explicit hostnames do not waive
              all DNS requirements.
            </li>
          </ul>
          <p className="source">
            <a
              href="https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/installing_an_on-premise_cluster_with_the_agent-based_installer/installation-config-parameters-agent"
              target="_blank"
              rel="noopener"
            >
              Hostnames and NTP configuration ↗
            </a>{" "}
            ·{" "}
            <a
              href="https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/installing_an_on-premise_cluster_with_the_agent-based_installer/installing-with-agent-based-installer"
              target="_blank"
              rel="noopener"
            >
              Agent API DNS prerequisite ↗
            </a>{" "}
            ·{" "}
            <a
              href="https://docs.redhat.com/en/documentation/assisted_installer_for_openshift_container_platform/2026/html/installing_openshift_container_platform_with_the_assisted_installer/prerequisites#external-dns-requirements_prerequisites"
              target="_blank"
              rel="noopener"
            >
              Assisted external-DNS scope ↗
            </a>
          </p>
        </div>
      </Disclosure>
      <Disclosure
        id="tickets/content"
        summary={
          <>
            <span className="ticket-id">T6</span>Image access, proxy or mirror,
            and trust material{" "}
            <span className="chip condition">Choose a content path</span>
          </>
        }
      >
        <div className="detail-body">
          <div className="owner-line">
            Security / proxy + registry / PKI owners
          </div>
          <ul>
            <li>
              <strong>Connected:</strong> permit the image-building workstation
              and nodes to reach the release and required image endpoints. Use
              the complete OCP 4.22 allowlist, including applicable registry,
              CDN, authentication and signature endpoints. <code>quay.io</code>{" "}
              and <code>registry.redhat.io</code> are examples, not the complete
              list. Follow redirects; allowing only the initial registry
              hostname can fail image pulls.
            </li>
            <li>
              <strong>Proxy:</strong> supply supported proxy URLs/ports,
              credentials when required, and the enterprise CA bundle for TLS
              inspection. Agree bypasses for local node, VIP and internal
              service destinations. A proxy does not carry all peer-node, DHCP,
              DNS or NTP traffic.
            </li>
            <li>
              <strong>Disconnected with mirror:</strong> supply a reachable
              mirror endpoint and port, mirrored release content, authentication
              and its CA chain. A standard agent ISO still needs release
              content; an ISO file alone is not an offline registry.
            </li>
            <li>
              <strong>Self-contained media:</strong> OCP 4.22 documents a
              separate workflow without an external registry. Its media supports
              general clusters and includes an Operator bundle curated for
              Virtualization Engine; additional Operators may require separate
              retrieval. This workflow is not assumed in the diagram.
            </li>
            <li>
              Give the installation operator the required pull credentials and
              permission to fetch content/build media. If access is controlled
              by another team, include that handoff. Include the documented
              Telemetry and Red Hat Lightspeed endpoints unless Telemetry is
              explicitly disabled. Add destinations for selected Operators and
              workloads separately.
            </li>
          </ul>
          <p className="source">
            <a
              href="https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/installation_configuration/configuring-firewall"
              target="_blank"
              rel="noopener"
            >
              OCP 4.22 content and Telemetry allowlist ↗
            </a>{" "}
            ·{" "}
            <a
              href="https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/installing_an_on-premise_cluster_with_the_agent-based_installer/understanding-disconnected-installation-mirroring"
              target="_blank"
              rel="noopener"
            >
              Disconnected mirroring ↗
            </a>{" "}
            ·{" "}
            <a
              href="https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/installing_an_on-premise_cluster_with_the_agent-based_installer/installing-ove"
              target="_blank"
              rel="noopener"
            >
              Self-contained workflow ↗
            </a>{" "}
            ·{" "}
            <a
              href="https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/installing_on_bare_metal/user-provisioned-infrastructure"
              target="_blank"
              rel="noopener"
            >
              Installer proxy configuration ↗
            </a>
          </p>
        </div>
      </Disclosure>
      <Disclosure
        id="tickets/bmc"
        summary={
          <>
            <span className="ticket-id">T7</span>BMC addresses, credentials and
            usable virtual media{" "}
            <span className="chip condition">Required for BMC boot</span>
          </>
        }
      >
        <div className="detail-body">
          <div className="owner-line">
            Server operations + management-network + security teams
          </div>
          <ul>
            <li>
              Configure and record all five BMC IPs, prefixes, gateways,
              management NIC/VLAN connections and any BMC DNS settings before
              installation. BMCs may use their own static assignments or DHCP
              reservations.
            </li>
            <li>
              Provide credentials with virtual-media, boot-device and
              power-control permissions. Confirm the vendor's remote-media
              feature/license and compatible firmware are available.
            </li>
            <li>
              Permit admin/automation host <code>10.20.50.10</code> → BMC{" "}
              <code>10.20.40.21–25</code> on HTTPS/Redfish TCP 443 (or
              configured port). If vendor remote-console streaming uses extra
              ports, identify them from that hardware's documentation.
            </li>
            <li>
              For URL-based insertion, host the full agent ISO at a URL such as{" "}
              <code>https://iso.dc.example.com/agent.iso</code> on{" "}
              <code>10.20.50.20</code>. BMCs must resolve the URL hostname,
              route to the server, accept its TLS chain and retrieve the file.
              Confirm authentication/protocol support for the actual BMC.
            </li>
            <li>
              USB/local media can remove the BMC dependency. Client-streamed
              media may instead need a continuous workstation-to-BMC connection.
              Minimal ISO/PXE variants can add node-to-image-server traffic;
              this baseline uses a full ISO.
            </li>
            <li>
              Server team confirms boot mode, one-time media boot and the
              intended install disk are usable. Disk capacity, RAID presentation
              and firmware readiness are conditional external server-preparation
              work, not OCP cluster configuration.
            </li>
          </ul>
          <p className="source">
            <a
              href="https://docs.redhat.com/en/documentation/assisted_installer_for_openshift_container_platform/2026/html/installing_openshift_container_platform_with_the_assisted_installer/assembly_booting-hosts-with-the-discovery-image"
              target="_blank"
              rel="noopener"
            >
              Red Hat Redfish virtual-media example ↗
            </a>{" "}
            · Ports, licensing, firmware, TLS behavior and the exact
            media-retrieval path depend on the hardware. They are site
            prerequisites to confirm, not facts validated by this
            documentation-only review.
          </p>
        </div>
      </Disclosure>
      <Disclosure
        id="tickets/admin"
        summary={
          <>
            <span className="ticket-id">T8</span>Operator access and
            site-specific branches{" "}
            <span className="chip condition">Depends on environment</span>
          </>
        }
      >
        <div className="detail-body">
          <div className="owner-line">
            Workstation / VPN / access team + relevant infrastructure owners
          </div>
          <ul>
            <li>
              Provide a usable admin workstation or bastion, routes/VPN to the
              machine and management networks, API-name resolution, and
              permission to reach required endpoints. The workstation that
              generates media needs the installer assets and release metadata.
            </li>
            <li>
              Permit SSH TCP 22 to nodes if remote diagnostics are required;
              provision the operator's SSH public key in the install inputs. SSH
              is useful for troubleshooting, not a substitute for node-to-node
              install traffic.
            </li>
            <li>
              <strong>PXE chosen instead of virtual media:</strong> add a boot
              server, architecture/firmware-appropriate DHCP boot settings or
              proxy-DHCP, and TFTP/HTTP(S) paths for the selected boot chain.
              Select only the protocols needed by that boot chain; these are
              excluded from the illustrated full-ISO path.
            </li>
            <li>
              <strong>Dual stack / IPv6:</strong> add IPv6 addressing, prefixes,
              routes, RA/DHCPv6 choice, AAAA records, NDP and appropriate
              ICMPv6/firewall policy. Apply the selected release's IP-family
              ordering and default-gateway rules. This IPv4 flow summary is not
              an IPv6 configuration recipe.
            </li>
            <li>
              <strong>
                Optional IPsec, external storage, enterprise KMS/Tang or other
                install-time integrations:
              </strong>{" "}
              add their endpoints, certificates, credentials and firewall rules
              only when selected. Workload ingress and post-install
              storage/Operators are outside this base scope.
            </li>
            <li>
              No external HAProxy/F5, separate bootstrap server, Ironic
              provisioning services, or separate provisioning DHCP is requested
              for this managed-network full-ISO example.
            </li>
          </ul>
          <p className="source">
            <a
              href="https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/installing_an_on-premise_cluster_with_the_agent-based_installer/prepare-pxe-assets-agent"
              target="_blank"
              rel="noopener"
            >
              Agent PXE preparation ↗
            </a>{" "}
            ·{" "}
            <a
              href="https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/installing_an_on-premise_cluster_with_the_agent-based_installer/installation-config-parameters-agent"
              target="_blank"
              rel="noopener"
            >
              Agent network parameters ↗
            </a>
          </p>
        </div>
      </Disclosure>
    </section>
  );
}

export function Firewall() {
  return (
    <section className="section" data-section="firewall">
      <h2 id="prerequisites-firewall" tabIndex={-1}>
        Firewall planning: identify both ends of every flow
      </h2>
      <p>
        This summary supports the external ACL handoff for the illustrated
        topology. Peer-node rules enable OCP traffic; they do not ask IT to
        configure OCP components.
      </p>
      <div className="assumption spaced">
        <strong>Internal fabric approval:</strong> an approved, unfiltered node
        segment can satisfy peer connectivity. Where east–west filtering exists,
        use the OCP 4.22 role-specific flow tables and identify the actual
        initiating hosts and destination addresses. Those tables list listeners;
        they do not by themselves define every source-to-destination ACL.
        Additional listeners include TCP <b>6080, 8798, 17697, 18080</b>,
        internal DNS <b>53</b>, and HAProxy ports <b>9444 / 9445 / 9454</b>.
        Determine which require remote reachability. Exact Agent VIP failover
        ACLs remain outside the evidence established here, so this is not a
        complete deployable firewall policy.
      </div>
      <section
        className="table-wrap"
        aria-label="Firewall reference table"
        // biome-ignore lint/a11y/noNoninteractiveTabindex: Keyboard users need to scroll the reference table.
        tabIndex={0}
      >
        <table>
          <thead>
            <tr>
              <th scope="col">Initiator → destination</th>
              <th scope="col">Protocol / destination</th>
              <th scope="col">Why / when</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">
                Five nodes → cp-0 <code>10.20.30.21</code>
              </th>
              <td>
                TCP <b>8090</b>
              </td>
              <td>
                Agent Assisted Service API during discovery/bootstrap.
                <small>
                  Required only during installation; no hosted Assisted-service
                  endpoint is implied.
                </small>
              </td>
            </tr>
            <tr>
              <th scope="row">
                Five nodes → configured resolvers
                <br />
                BMCs / admin → their resolvers when using names
              </th>
              <td>
                UDP + TCP <b>53</b>
              </td>
              <td>
                Resolve content and service endpoints. The monitoring
                workstation needs API name resolution; a local hosts entry can
                supply it. Application DNS enables browser access.
              </td>
            </tr>
            <tr>
              <th scope="row">
                Five nodes → <code>10.20.10.123</code>
              </th>
              <td>
                UDP <b>123</b>
              </td>
              <td>
                Time synchronization. Use the actual approved source addresses.
              </td>
            </tr>
            <tr>
              <th scope="row">Node DHCP clients ↔ server / relay</th>
              <td>
                UDP <b>68 ↔ 67</b>
              </td>
              <td>
                DHCP mode only; confirm the exact client/relay/server policy
                with the DHCP owner.
                <small>
                  These are site DHCP policy details. Apply corresponding policy
                  independently if BMCs use DHCP.
                </small>
              </td>
            </tr>
            <tr>
              <th scope="row">
                Nodes + image-building workstation → registry/CDN, proxy or
                mirror
              </th>
              <td>
                TCP <b>443</b> direct; configured proxy/mirror port otherwise
              </td>
              <td>
                Content path depends on connected/proxy/mirror choice. Use the
                complete OCP 4.22 allowlist, including applicable CDN redirects.
              </td>
            </tr>
            <tr>
              <th scope="row">
                Cluster components → documented Telemetry / Red Hat Lightspeed
                endpoints
              </th>
              <td>
                TCP <b>443</b> direct; configured proxy port otherwise
              </td>
              <td>
                Include these destinations unless Telemetry is explicitly
                disabled.
                <small>
                  Use the endpoint list in the OCP 4.22 firewall guide.
                </small>
              </td>
            </tr>
            <tr>
              <th scope="row">Five nodes ↔ five nodes</th>
              <td>
                ICMP; TCP <b>1936, 9000–9999, 10250–10259</b>; UDP{" "}
                <b>6081, 9000–9999</b>
              </td>
              <td>
                Standard peer connectivity, metrics, Kubernetes services and OVN
                Geneve.
                <small>
                  Use these documented groups with the OCP 4.22 role-specific
                  matrix.
                </small>
              </td>
            </tr>
            <tr>
              <th scope="row">Five nodes ↔ five nodes</th>
              <td>
                NodePort TCP/UDP <b>30000–32767</b>
              </td>
              <td>
                Included in the documented inter-machine connectivity
                requirements.
                <small>
                  External-client exposure is a separate, conditional rule
                  below.
                </small>
              </td>
            </tr>
            <tr>
              <th scope="row">Five nodes → control-plane/API endpoints</th>
              <td>
                TCP <b>6443</b>
              </td>
              <td>
                Kubernetes API traffic. Permit applicable API VIP and
                control-plane paths.
              </td>
            </tr>
            <tr>
              <th scope="row">Five nodes → machine-config-server endpoints</th>
              <td>
                TCP <b>22623, 22624</b>
              </td>
              <td>
                Internal machine-configuration traffic; no general
                external-client exposure.
                <small>
                  Identify actual destination addresses. A documented
                  control-plane listener does not establish that 22624 is
                  exposed on the API VIP.
                </small>
              </td>
            </tr>
            <tr>
              <th scope="row">cp-0 / cp-1 / cp-2 ↔ each other</th>
              <td>
                TCP <b>2379–2380</b>
              </td>
              <td>Control-plane etcd communication.</td>
            </tr>
            <tr>
              <th scope="row">Eligible VIP hosts ↔ peers / local L2</th>
              <td>
                Site VIP failover policy
                <br />
                <b>Exact ACLs unresolved here</b>
              </td>
              <td>
                Ensure managed VIP reachability and failover.
                <small>
                  The cited installer sources do not establish a complete Agent
                  failover protocol/ACL recipe. Resolve this before implementing
                  filtered node networking.
                </small>
              </td>
            </tr>
            <tr>
              <th scope="row">
                Admin / authorized API clients → API VIP{" "}
                <code>10.20.30.10</code>
              </th>
              <td>
                TCP <b>6443</b>
              </td>
              <td>
                CLI access and installation verification. Resolve the API name
                on the client through DNS or a local hosts entry.
              </td>
            </tr>
            <tr>
              <th scope="row">Five nodes → ingress VIP / router nodes</th>
              <td>
                TCP <b>80, 443</b>
              </td>
              <td>
                Cluster-originated ingress/OAuth access and installation health
                checks.
                <small>
                  Both router ports appear in the default bare-metal flow
                  matrix. Client-only rules do not satisfy this internal path.
                </small>
              </td>
            </tr>
            <tr>
              <th scope="row">
                Admin / intended users → ingress VIP <code>10.20.30.11</code>
              </th>
              <td>
                TCP <b>80, 443</b>
              </td>
              <td>
                Console/OAuth and route access. Client DNS and return routes
                required.
                <small>
                  Any departure from the default router ports needs its own
                  documented configuration.
                </small>
              </td>
            </tr>
            <tr>
              <th scope="row">Admin → all five nodes</th>
              <td>
                TCP <b>22</b>
              </td>
              <td>Conditional remote SSH troubleshooting access.</td>
            </tr>
            <tr>
              <th scope="row">
                Admin → five BMCs
                <br />
                Five BMCs → ISO host <code>10.20.50.20</code>
              </th>
              <td>
                TCP <b>443</b> in this example
              </td>
              <td>
                Two separate site approvals: management API and media retrieval.
                <small>
                  Confirm actual ports and retrieval behavior for the chosen
                  hardware and media mechanism.
                </small>
              </td>
            </tr>
            <tr>
              <th scope="row">Intended NodePort clients → selected nodes</th>
              <td>
                Selected TCP/UDP ports within <b>30000–32767</b>
              </td>
              <td>
                Conditional external service exposure. Scope to intended clients
                and services; this does not replace the peer-connectivity row.
              </td>
            </tr>
            <tr>
              <th scope="row">IPsec peers ↔ IPsec peers</th>
              <td>
                UDP <b>500/4500</b> + ESP as applicable
              </td>
              <td>
                Conditional on enabling IPsec. Apply the selected feature's
                network and MTU requirements.
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <p className="caption">
        All flows require a working forward and return route. External firewall
        rules cannot repair a wrong node mask, missing VLAN or unreachable
        gateway. Addresses, relay behavior and BMC paths are site-design inputs.
      </p>
      <p className="source">
        <a
          href="https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/installing_on_bare_metal/user-provisioned-infrastructure#installation-network-connectivity-user-infra_installing-bare-metal"
          target="_blank"
          rel="noopener"
        >
          OCP 4.22 node communication requirements ↗
        </a>{" "}
        ·{" "}
        <a
          href="https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/installation_configuration/configuring-firewall"
          target="_blank"
          rel="noopener"
        >
          OCP 4.22 role-specific flows and egress allowlist ↗
        </a>{" "}
        ·{" "}
        <a
          href="https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/installing_an_on-premise_cluster_with_the_agent-based_installer/preparing-to-install-with-agent-based-installer#agent-install-networking-ports_preparing-to-install-with-agent-based-installer"
          target="_blank"
          rel="noopener"
        >
          Agent-specific 8090 ↗
        </a>
      </p>
    </section>
  );
}

export function Sources() {
  return (
    <section className="section" data-section="sources">
      <h2 id="prerequisites-sources" tabIndex={-1}>
        Evidence and completeness boundaries
      </h2>
      <div className="two-col">
        <div className="panel">
          <h3>OCP 4.22 documentation and API DNS source review</h3>
          <p>
            Documentation checked 4 November 2026. Agent preparation,
            installation, configuration and firewall documentation establish the
            requirements cited here. Assisted Installer documentation supplies
            explicitly labeled context for cluster-managed networking, external
            DNS and Redfish media delivery. API DNS behavior was also checked
            against release-4.22 installer and runtime source. The DNS section
            links directly to the relevant Ignition and CoreDNS implementation.
          </p>
          <ul>
            <li>
              Documented requirements: Agent inputs, rendezvous, network ports,
              MTU, content access and monitoring prerequisites
            </li>
            <li>
              Example site design: addresses, VLANs, ownership, routes and BMC
              delivery paths
            </li>
            <li>
              Remaining site checks: exact VIP failover ACLs, switch policies
              and hardware-specific behavior
            </li>
          </ul>
          <p>
            “Required” means needed by this topology; an existing site service
            may satisfy it. These documentation and source reviews are not a lab
            installation or a certification of the site's network.
          </p>
        </div>
        <div className="panel">
          <h3>Workflow and environment limits</h3>
          <p>
            The selected design uses a full agent ISO, one machine LAN and
            managed VIPs. Application workloads and post-install operations are
            outside its scope. Internal components appear as destinations where
            a site firewall must allow their traffic.
          </p>
          <p>
            The source-verified DNS conclusion applies to the managed bare-metal
            design with explicit VIPs and default internal DNS. Workstation name
            resolution remains necessary for monitoring. It does not extend to
            multi-node user-managed networking or external-DNS configurations.
            Hardware-specific remote-console ports, TLS behavior, proxy policy
            and site NAC rules need environment-specific confirmation.
          </p>
          <p>
            Standard node connectivity and RHCOS default-route guidance are
            drawn from the bare-metal installer documentation. Its separate UPI
            DNS, bootstrap-server and external-load-balancer designs are not
            imported into this managed-network example.
          </p>
        </div>
      </div>
      <Disclosure
        id="references"
        summary={<>Official installer documentation</>}
      >
        <div className="detail-body">
          <div className="evidence">
            <ul>
              <li>
                <a
                  href="https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/installing_an_on-premise_cluster_with_the_agent-based_installer/preparing-to-install-with-agent-based-installer"
                  target="_blank"
                  rel="noopener"
                >
                  Agent-based preparation and networking ↗
                </a>
              </li>
              <li>
                <a
                  href="https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/installing_an_on-premise_cluster_with_the_agent-based_installer/installation-config-parameters-agent"
                  target="_blank"
                  rel="noopener"
                >
                  Agent installation configuration parameters ↗
                </a>
              </li>
              <li>
                <a
                  href="https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/installing_an_on-premise_cluster_with_the_agent-based_installer/installing-with-agent-based-installer"
                  target="_blank"
                  rel="noopener"
                >
                  Agent installation and monitoring ↗
                </a>
              </li>
              <li>
                <a
                  href="https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/installing_on_bare_metal/user-provisioned-infrastructure"
                  target="_blank"
                  rel="noopener"
                >
                  Bare-metal node connectivity, routing and proxy configuration
                  ↗
                </a>
              </li>
              <li>
                <a
                  href="https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/installation_configuration/configuring-firewall"
                  target="_blank"
                  rel="noopener"
                >
                  OCP 4.22 firewall flows and endpoint allowlist ↗
                </a>
              </li>
              <li>
                <a
                  href="https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/installing_an_on-premise_cluster_with_the_agent-based_installer/installing-with-agent-based-installer#installing-ocp-agent-cluster-network-mtu_installing-with-agent-based-installer"
                  target="_blank"
                  rel="noopener"
                >
                  Agent installer MTU guidance ↗
                </a>
              </li>
            </ul>
            <ul>
              <li>
                <a
                  href="https://docs.redhat.com/en/documentation/assisted_installer_for_openshift_container_platform/2026/html/installing_openshift_container_platform_with_the_assisted_installer/assembly_network-configuration#network-management-types-cluster_network-configuration"
                  target="_blank"
                  rel="noopener"
                >
                  Assisted cluster-managed networking ↗
                </a>
              </li>
              <li>
                <a
                  href="https://docs.redhat.com/en/documentation/assisted_installer_for_openshift_container_platform/2026/html/installing_openshift_container_platform_with_the_assisted_installer/prerequisites#external-dns-requirements_prerequisites"
                  target="_blank"
                  rel="noopener"
                >
                  Assisted external DNS and wildcard restrictions ↗
                </a>
              </li>
              <li>
                <a
                  href="https://docs.redhat.com/en/documentation/assisted_installer_for_openshift_container_platform/2026/html/installing_openshift_container_platform_with_the_assisted_installer/assembly_booting-hosts-with-the-discovery-image"
                  target="_blank"
                  rel="noopener"
                >
                  Redfish and USB media examples ↗
                </a>
              </li>
              <li>
                <a
                  href="https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/installing_an_on-premise_cluster_with_the_agent-based_installer/understanding-disconnected-installation-mirroring"
                  target="_blank"
                  rel="noopener"
                >
                  Disconnected image mirroring ↗
                </a>
              </li>
              <li>
                <a
                  href="https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/installing_an_on-premise_cluster_with_the_agent-based_installer/installing-ove"
                  target="_blank"
                  rel="noopener"
                >
                  OCP 4.22 installation without an external registry ↗
                </a>
              </li>
              <li>
                <a
                  href="https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/installing_an_on-premise_cluster_with_the_agent-based_installer/prepare-pxe-assets-agent"
                  target="_blank"
                  rel="noopener"
                >
                  Agent PXE preparation ↗
                </a>
              </li>
            </ul>
          </div>
        </div>
      </Disclosure>
    </section>
  );
}
