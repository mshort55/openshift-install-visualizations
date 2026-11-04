import type { Topic } from "../model";

export const topics: Topic[] = [
  {
    id: "journey",
    parent: null,
    phase: null,
    title: "The installation journey",
    summary:
      "Follow a customer from planning physical servers through installation, useful workloads, and operational handover.",
    question: "What does it take to make OpenShift useful?",
    outcome:
      "The intended workload is usable and its operating requirements are demonstrated.",
    owners: "Platform, infrastructure, security and application teams",
    scope:
      "OpenShift Container Platform 4.22 on bare metal, from preparation through workload readiness. Detailed steps explain the applicable installation method and supported variations.",
    flow: [
      {
        title: "Prepare the deployment",
        detail:
          "Agree the workload, prepare infrastructure and configuration, and arrange how the hosts will boot.",
      },
      {
        title: "Install the cluster",
        detail:
          "Boot the hosts, resolve installation checks, and bring up the cluster using the selected installation method.",
      },
      {
        title: "Enable workloads and hand over",
        detail:
          "Configure workload dependencies, demonstrate readiness, and transfer operational ownership.",
      },
    ],
  },
  {
    id: "pre-installation",
    parent: "journey",
    phase: "pre-installation",
    title: "Pre-installation",
    summary:
      "Make the existing environment ready for the cluster and its intended workloads.",
    question: "Can we prepare this environment to install successfully?",
    outcome:
      "Inputs, infrastructure and boot access are prepared; checks that require running hosts have named owners.",
    owners: "Platform team + network, storage, security and hardware owners",
    scope:
      "Settle design choices before generating media. Prepare site services in parallel, then verify the actual host environment after boot.",
    flow: [
      {
        title: "Plan the deployment",
        detail:
          "Choose the release, architecture and layout. Confirm workload, availability and security requirements before committing hardware or requesting site services.",
      },
      {
        title: "Prepare infrastructure and inputs",
        detail:
          "Assign owners for network services, image access, host configuration and media. Conditional choices can add prerequisites across several teams.",
      },
      {
        title: "Confirm readiness before booting",
        detail:
          "Distinguish reviewed settings from prepared services and verified connections. Record the checks still needed from the booted hosts.",
      },
    ],
  },
  {
    id: "installation",
    parent: "journey",
    phase: "installation",
    title: "Installation",
    summary:
      "Boot the hosts, install the cluster, and verify node readiness and cluster health.",
    question: "Is installation progressing, blocked, or waiting for us?",
    outcome:
      "Base cluster installed, with expected nodes, services and access checked.",
    owners: "Installation owner + infrastructure owners when dependencies fail",
    scope:
      "Boot and validate hosts, install the operating system, establish the control plane, and verify the cluster. Detailed steps identify method-specific behavior.",
    flow: [
      {
        title: "Boot and validate hosts",
        detail:
          "Start the hosts through the selected boot mechanism. Verify their identities, configuration and access to required services, and resolve checks that block installation.",
      },
      {
        title: "Establish the control plane",
        detail:
          "Monitor bootstrap until the control plane becomes operational, then follow the selected method’s transition from temporary bootstrap services.",
      },
      {
        title: "Verify completion",
        detail:
          "Confirm installation completes, expected nodes are Ready, cluster Operators are healthy, and API and console access work.",
      },
    ],
  },
  {
    id: "post-installation",
    parent: "journey",
    phase: "post-installation",
    title: "Post-installation",
    summary:
      "Configure the remaining platform services, test the intended workload requirements, and hand over to application teams.",
    question:
      "Can application teams deploy and operate their workloads using the prepared platform?",
    outcome:
      "Required platform services pass agreed tests. Application teams have access, configuration guidance, and support contacts.",
    owners:
      "Platform team, infrastructure service owners, and receiving application teams.",
    scope:
      "Begins after successful cluster installation. Covers platform Operators, storage, networking, image access, security, monitoring, and recovery preparation. Representative workloads verify the required capabilities before handover.",
    flow: [
      {
        title: "Configure platform services",
        detail:
          "Install and configure the components required for the intended workloads.",
      },
      {
        title: "Prove workload readiness",
        detail:
          "Test deployment, storage, networking, access, and required maintenance behavior with representative workloads.",
      },
      {
        title: "Hand over to application teams",
        detail:
          "Review test results, provide access and usage guidance, and confirm operational responsibilities.",
      },
    ],
  },
  {
    id: "approach",
    parent: "pre-installation",
    phase: "pre-installation",
    title: "Plan the deployment",
    summary:
      "Agree the intended outcome, select the release and installation path, and identify the decisions that shape preparation.",
    question: "What must this site prepare for installation?",
    outcome:
      "A release, architecture and installation path are selected, with requirements and owners for the detailed planning steps.",
    owners:
      "Platform architect and installation owner, with input from application owners and hardware, networking, storage, and security teams.",
    scope:
      "The main journey follows the local Agent CLI workflow. The method comparison explains alternative responsibilities; it does not switch the installation timeline.",
    flow: [
      {
        title: "Establish the intended outcome",
        detail:
          "Agree workloads, availability, maintenance capacity, connectivity restrictions and access to the physical site. Identify the teams supplying hardware, network, storage and security services.",
      },
      {
        title: "Select the release and installation path",
        detail:
          "Choose the OCP release and target CPU architecture. Check support for the intended workload components and distinguish supported features from Technology Preview options. Compare installation methods if the path is still undecided.",
      },
      {
        title: "Settle the design before creating media",
        detail:
          "Use the layout, hardware and security steps below to confirm feasibility. Assign who prepares configuration, supplies dependencies and boots the hosts; record decisions that would require new media or a different design.",
      },
    ],
  },
  {
    id: "assisted",
    parent: "approach",
    phase: "pre-installation",
    title: "Hosted Assisted Installer",
    summary:
      "Configure the cluster through Red Hat’s hosted web interface or API, then boot the hosts with discovery media.",
    question: "How does this installation path divide the work?",
    outcome:
      "The customer can explain what the installer does and what the site must supply.",
    owners: "Installation owner + site infrastructure team",
    scope: "Bare-metal installation · OCP 4.22",
    flow: [
      {
        title: "What the customer must supply",
        detail:
          "Provide a Red Hat account, access to the hosted service and image endpoints, and prepared site networking. Check the service’s supported versions, architectures, optional Operators and custom-manifest options for this deployment.",
      },
      {
        title: "Configure the cluster and boot hosts",
        detail:
          "Prepare site networking and enter the cluster settings. Generate a discovery ISO or iPXE script, then boot the hosts with access to the hosted service and required image registries.",
      },
      {
        title: "Review settings and start installation",
        detail:
          "Confirm host roles, installation disks, and network settings. Resolve blocking validation issues, then start installation through the web interface or API.",
      },
      {
        title: "Monitor installation and access the cluster",
        detail:
          "Bootstrapping runs on a cluster host, so no separate bootstrap machine is needed. Monitor progress in the hosted service and retrieve the cluster access details when installation finishes.",
      },
    ],
  },
  {
    id: "agent-based",
    parent: "approach",
    phase: "pre-installation",
    title: "Local Agent-based Installer",
    summary:
      "Create boot media locally and boot the hosts yourself. A service on one control-plane host coordinates installation, including in disconnected environments.",
    question: "How does this installation path divide the work?",
    outcome:
      "The customer can explain what the installer does and what the site must supply.",
    owners: "Installation owner + site infrastructure team",
    scope: "Bare-metal installation · OCP 4.22",
    flow: [
      {
        title: "What the customer must supply",
        detail:
          "Provide a suitable workstation, reviewed configuration, reachable release images and a way to boot every host. Supply site services for the selected network model. No separate provisioner or bootstrap server is required.",
      },
      {
        title: "Prepare cluster settings and images",
        detail:
          "Provide cluster and host settings, typically in install-config.yaml and agent-config.yaml. For disconnected sites, make the required installation images available locally.",
      },
      {
        title: "Generate boot media and start hosts",
        detail:
          "Use the local installer to create an ISO or network boot (PXE) files. Boot the hosts and ensure they can reach one another and the required installation images.",
      },
      {
        title: "Let the local service validate and install",
        detail:
          "One control-plane machine, called the rendezvous host, runs the local installation service and bootstraps the cluster. Installation starts once the required hosts pass validation.",
      },
    ],
  },
  {
    id: "ipi",
    parent: "approach",
    phase: "pre-installation",
    title: "Installer-provisioned infrastructure (IPI)",
    summary:
      "Prepare the physical servers and site infrastructure. The installer uses each server’s baseboard management controller (BMC) to automate booting and installation.",
    question: "How does this installation path divide the work?",
    outcome:
      "The customer can explain what the installer does and what the site must supply.",
    owners: "Installation owner + hardware and network teams",
    scope: "Bare-metal installation · OCP 4.22",
    flow: [
      {
        title: "What the customer must supply",
        detail:
          "Prepare a RHEL provisioner and its bootstrap VM resources, compatible BMCs with credentials, and management-network reachability. Choose PXE with a provisioning network or supported virtual media without one; prepare the corresponding NICs and services.",
      },
      {
        title: "Prepare infrastructure and management access",
        detail:
          "Prepare the servers, site networking, DNS, and access to each server’s management controller. Set up a provisioner machine to run the installer and host its temporary bootstrap virtual machine.",
      },
      {
        title: "Run the installer to provision hosts",
        detail:
          "Supply cluster and host settings. The installer uses the management controllers to boot hosts and install the operating system, then brings up OpenShift.",
      },
      {
        title: "Complete installation and transfer host management",
        detail:
          "Monitor installation through completion. The installer removes the temporary bootstrap virtual machine, and the running cluster takes over host provisioning through its bare-metal management components.",
      },
    ],
  },
  {
    id: "upi",
    parent: "approach",
    phase: "pre-installation",
    title: "User-provisioned infrastructure (UPI)",
    summary:
      "Prepare the infrastructure and install the hosts using configuration files generated by the OpenShift installer. Your team controls provisioning and booting.",
    question: "How does this installation path divide the work?",
    outcome:
      "The customer can explain what the installer does and what the site must supply.",
    owners: "Customer provisioning and platform teams",
    scope: "Bare-metal installation · OCP 4.22",
    flow: [
      {
        title: "What the customer must supply",
        detail:
          "Provide the bootstrap machine, cluster hosts, DNS, load balancers and delivery of the generated Ignition files, such as through HTTP(S). Schedule generation near boot: use Ignition within 12 hours because its initial certificates expire after 24 hours.",
      },
      {
        title: "Prepare the infrastructure",
        detail:
          "Provide servers, networking, DNS, and load balancing for the cluster API and applications. Prepare a temporary bootstrap machine and a way to boot and configure each host.",
      },
      {
        title: "Generate configuration and install hosts",
        detail:
          "Use the installer to generate Ignition files, which configure machines at first boot. Install Red Hat Enterprise Linux CoreOS on the bootstrap and cluster hosts with the matching files.",
      },
      {
        title: "Finish bootstrap and verify installation",
        detail:
          "After bootstrap completes, remove the bootstrap machine from the load balancer and retire it. Review and approve node certificate requests as required, then verify that installation completes.",
      },
    ],
  },
  {
    id: "topology",
    parent: "pre-installation",
    phase: "pre-installation",
    title: "Cluster layout and availability",
    summary:
      "Choose where control-plane and application work will run, and what happens when a node is unavailable.",
    question:
      "Which layout meets the site’s availability and capacity requirements?",
    outcome:
      "A supported node layout, role allocation and failure/maintenance capacity plan are agreed before hardware allocation.",
    owners: "Platform architect, application owners and infrastructure team.",
    scope:
      "Required before hardware and network planning. Validate the chosen topology against the release, architecture and intended Operators; examples are not a universal support matrix.",
    flow: [
      {
        title: "Choose a standard layout",
        detail:
          "Single-node OpenShift combines control-plane and application work on one host. A compact cluster shares that work across three control-plane hosts. A larger layout separates control-plane and worker capacity. Account for platform overhead and maintenance headroom.",
      },
      {
        title: "Evaluate two-node alternatives when needed",
        detail:
          "A two-node design with arbiter adds a separate arbiter host with its own sizing and placement. A two-node design with fencing adds BMC fencing credentials, connectivity and recovery requirements. Confirm support and degraded-operation limits before selecting either.",
      },
      {
        title: "Check the required workload behavior",
        detail:
          "Match node count and placement to failure tolerance and workload needs. Single-node OpenShift does not provide virtualization HA or live migration. Confirm the selected topology supports the required Operators and maintenance behavior.",
      },
    ],
  },
  {
    id: "hardware",
    parent: "pre-installation",
    phase: "pre-installation",
    title: "Hardware and storage feasibility",
    summary:
      "Confirm that the available servers and storage can support the planned cluster and its applications.",
    question: "Can the deployment actually fit the hardware and budget?",
    outcome:
      "A supported host inventory and capacity plan distinguish installation requirements, workload needs and any purchases or design changes.",
    owners:
      "Platform architect, hardware and storage teams, and application owners. Involve networking and procurement teams when connectivity or purchases are needed.",
    scope:
      "Check requirements for the selected release, architecture, topology and installation method, plus the capacity and integrations required by workloads.",
    flow: [
      {
        title: "Check hardware and firmware support",
        detail:
          "Inventory CPU architecture and features, RAM, disks, NICs and firmware. Verify support for the selected release and boot path, including UEFI or Secure Boot settings where required.",
      },
      {
        title: "Size for the topology and workload",
        detail:
          "Separate installation minimums from recommended capacity. Use installation requirements for the chosen topology and method, then add platform services, optional Operators, application demand and maintenance headroom. Check control-plane disk latency and throughput as well as capacity.",
      },
      {
        title: "Confirm storage and physical connectivity",
        detail:
          "Review installation disks and workload storage separately. Check storage integration, NIC capabilities and cabling, and resolve purchases or design changes before committing to installation.",
      },
    ],
  },
  {
    id: "installation-storage",
    parent: "hardware",
    phase: "pre-installation",
    title: "Installation disks and remote boot storage",
    summary:
      "Choose the installation disks and prepare any storage dependencies needed to boot.",
    question:
      "Which device will hold the operating system, and how will the host reach it?",
    outcome:
      "Each host has an identified installation disk and any required remote-storage access.",
    owners: "Hardware and storage teams, with the installation owner.",
    scope:
      "Decide before host configuration and boot. Installation storage is separate from the persistent volumes applications will use.",
    flow: [
      {
        title: "Identify target disks",
        detail:
          "Record the identity of the intended installation disk for each host.",
      },
      {
        title: "Choose local or remote installation storage",
        detail:
          "Check supported disk types, controllers and multipathing for the selected architecture. Remote root storage adds storage-service and network dependencies that must remain available after installation.",
      },
      {
        title: "Prepare iSCSI boot only when selected",
        detail:
          "The documented Agent iSCSI boot path requires DHCP, does not support static networking, and uses an iSCSI network separate from the machine network. Coordinate the target, firmware and network preparation with storage owners.",
      },
    ],
  },
  {
    id: "workload-plan",
    condition: "Plan now, configure later",
    parent: "hardware",
    phase: "pre-installation",
    title: "Workload requirements that affect preparation",
    summary:
      "Identify what must be reserved or supplied now, even when workload components will be configured after installation.",
    question:
      "Which workload requirements can change the hardware, network or image plan?",
    outcome:
      "Required components, physical dependencies and acceptance checks are recorded before sizing and content selection.",
    owners:
      "Application owners, platform architect, storage and network teams.",
    scope:
      "Plan now; configure workload services after installation unless the chosen workflow installs them earlier. Extra components are conditional on the intended workload.",
    flow: [
      {
        title: "Confirm hardware-dependent features",
        detail:
          "For virtualization, check CPU virtualization features and CPU compatibility for required migration behavior. For SR-IOV, GPUs or other accelerators, verify supported hardware, firmware and Operator combinations.",
      },
      {
        title: "Reserve storage and physical networks",
        detail:
          "Specify required storage access modes, performance and migration behavior. Arrange any storage backends, spare disks, workload VLANs, uplinks or additional NICs. A later StorageClass or network attachment cannot supply missing physical infrastructure.",
      },
      {
        title: "Carry requirements into content and handover",
        detail:
          "List the Operators and images to acquire or mirror, and define representative workload tests. Decide any CPU partitioning or hyperthreading changes before installation; these affect sizing and configuration.",
      },
    ],
  },
  {
    id: "security",
    parent: "pre-installation",
    phase: "pre-installation",
    title: "Security requirements",
    summary:
      "Decide whether security policy adds installation-time tools, hardware, services or configuration.",
    question:
      "Which security requirements must be implemented before generating media?",
    outcome:
      "Applicable security settings and dependencies are agreed, with owners and inputs ready before media generation.",
    owners:
      "Security owner, installation owner and hardware team; include the team operating any Tang service.",
    scope:
      "Review for every deployment; apply the branches required by policy. Disk encryption, FIPS and later etcd encryption are separate decisions.",
    flow: [
      {
        title: "Decide whether FIPS is required",
        detail:
          "If FIPS is required, use a FIPS-capable installer on a RHEL workstation booted in FIPS mode. Confirm the architecture and cryptographic validation scope, and set the installation configuration accordingly.",
      },
      {
        title: "Choose disk encryption and key access",
        detail:
          "If encrypting installation disks, choose the supported TPM v2 or Tang workflow and the nodes to encrypt. Confirm TPM readiness; stale keys may require a reset. For Tang, arrange server details, trust and ongoing network access.",
      },
      {
        title: "Prepare policy inputs and access",
        detail:
          "Agree firmware/Secure Boot settings where required, trusted CA bundles and protection of pull secrets, configuration and media. Decide how administrators will collect diagnostics, including a recommended SSH key for recovery, before booting.",
      },
    ],
  },
  {
    id: "networking",
    kind: "group",
    parent: "pre-installation",
    phase: "pre-installation",
    title: "Networking and shared services",
    summary:
      "Choose network ownership, then prepare addresses, shared services and boot access. Teams can work in parallel; validation from installation hosts follows boot.",
    question: "Which connections and services must already work?",
    outcome:
      "Network settings, service requirements, and boot access are prepared, with remaining work assigned to owners.",
    owners:
      "Network, DNS, IP address management, and security teams, together with the installation owner.",
    scope:
      "Preparation can run in parallel across teams. Checks from the installation hosts happen after they boot.",
    flow: [],
  },
  {
    id: "network-management",
    parent: "networking",
    phase: "pre-installation",
    title: "Network management and load balancing",
    summary:
      "With cluster-managed networking, OpenShift provides API and ingress load balancing. Providing your own external load balancer is optional and depends on the network model you choose.",
    question:
      "Who supplies API and application endpoints, DNS and load balancing?",
    outcome:
      "The network model, endpoint addresses and service owners are agreed before DNS and firewall requests.",
    owners:
      "Platform architect, network/IPAM team, DNS team and load-balancer owner if using an external load balancer.",
    scope:
      "Required before address allocation and configuration. Choose cluster-managed networking or a supported externally managed model for the selected installation method. Single-node and multi-node deployments have different requirements.",
    flow: [
      {
        title: "Use OpenShift-managed load balancing",
        detail:
          "With cluster-managed networking on a multi-node cluster, OpenShift manages API and ingress virtual IPs and load balancing. Reserve unused endpoint addresses outside dynamic DHCP allocation and confirm the supported subnet arrangement and network behavior needed for VIP movement.",
      },
      {
        title:
          "Provide your own load balancer if choosing multi-node platform: none",
        detail:
          "If you choose multi-node platform: none, the site must supply DNS plus API and application load balancers before installation. Arrange layer-4 forwarding, API health checks, and backends appropriate to the node layout. API traffic uses 6443; machine configuration uses internal 22623; ingress uses 80/443. Do not add the Agent rendezvous host as a separate bootstrap machine.",
      },
      {
        title: "Handle single-node and method-specific cases",
        detail:
          "Single-node OpenShift does not require external API/ingress load balancers; plan access to the node’s endpoints. Hosted Assisted also documents managed networking with an external load balancer through its API. Treat that as a method-specific option, not an assumed Agent setting.",
      },
    ],
  },
  {
    id: "addressing",
    parent: "networking",
    phase: "pre-installation",
    title: "Addresses, VLANs and routes",
    summary:
      "Choose the IP families, network ranges and physical interfaces, then prepare stable host identities and routes.",
    question: "How will the nodes reach one another and required services?",
    outcome:
      "Address allocations and host/switch settings are prepared for installation.",
    owners:
      "IP address management and network teams, with the installation owner.",
    scope:
      "Settle the network design before generating media. Machine and service ranges have restrictions on later changes; check each setting rather than assuming every network setting can be edited freely.",
    flow: [
      {
        title: "Choose IP families and size network ranges",
        detail:
          "Choose a supported IPv4, IPv6 or dual-stack configuration for the cluster. Plan machine, pod and service ranges, per-node pod subnets and growth. For dual stack, keep address-family order consistent and satisfy both families’ default-route/interface requirements.",
      },
      {
        title: "Check overlap and reserve addresses",
        detail:
          "Compare site, pod, service and OVN internal ranges. Review the default OVN IPv4 join subnet, 100.64.0.0/16, and avoid the installer’s Podman range, 10.88.0.0/16, in the machine network. Reserve the endpoints required by the selected network model.",
      },
      {
        title: "Choose stable host addressing and names",
        detail:
          "Arrange persistent DHCP addresses and the required options, or allocate static addresses for host configuration. Give every host a unique hostname through explicit configuration, DHCP or the applicable DNS setup. DHCP remains a dependency while hosts use it.",
      },
      {
        title: "Match host and switch configuration",
        detail:
          "Agree NICs, VLAN access/trunk settings, bonds, gateways, DNS and MTU with the network team. Prepare switch configuration and host NMState settings as separate deliverables, then verify the actual paths after boot.",
      },
    ],
  },
  {
    id: "advanced-network",
    condition: "For custom host networking",
    parent: "addressing",
    phase: "pre-installation",
    title: "Advanced network configuration",
    summary:
      "Review additional network customization before the installation media fixes the initial host configuration.",
    question:
      "Does the site need more than the standard interface and network configuration?",
    outcome:
      "Any custom network manifests and physical-network changes are reviewed before media generation.",
    owners:
      "Network team and installation owner, with workload and security owners.",
    scope:
      "Conditional on advanced networking requirements. Use the default bridge behavior for standard environments; custom manifests require separate review.",
    flow: [
      {
        title: "Plan dependent interfaces together",
        detail:
          "For multi-NIC, bonded or VLAN networks, identify the default route and dependent interfaces. Review supported SR-IOV or other specialized configurations against the selected hardware and install method.",
      },
      {
        title: "Review bridge and MTU requirements",
        detail:
          "Decide whether the documented custom br-ex MachineConfig path is needed. Check end-to-end MTU and overlay overhead. If later IPsec is planned, allow its extra headroom now to avoid a disruptive MTU migration.",
      },
      {
        title: "Review custom manifests before generation",
        detail:
          "Prepare additional manifests for the chosen customization and keep them with the reviewed configuration. Installer validation does not establish that arbitrary additional manifests will produce a working cluster.",
      },
    ],
  },
  {
    id: "dns",
    parent: "networking",
    phase: "pre-installation",
    title: "DNS and cluster access",
    summary:
      "Prepare required name resolution now; external cluster records can wait where the installation method and network model permit.",
    question:
      "Which DNS settings are needed before installation, and which can be completed later?",
    outcome:
      "Required installation name resolution is prepared, and any deferred external records have an owner and a deadline before shared access.",
    owners: "DNS team, installation owner, and cluster administrator.",
    scope:
      "Red Hat explicitly permits external-record deferral for Assisted installations with cluster-managed networking or single-node OpenShift. Multi-node user-managed networking, including Agent platform: none, requires cluster DNS before installation. Hosts still need name resolution for installation dependencies.",
    flow: [
      {
        title: "Define names and prepare host DNS",
        detail:
          "Agree the permanent cluster name, base domain and endpoint addresses. Supply reachable resolvers for registry, proxy and other infrastructure names. Assign unique hostnames and check their resolution requirements for the chosen network model.",
      },
      {
        title: "Decide whether external records can wait",
        detail:
          "Plan api.<cluster>.<domain>, api-int.<cluster>.<domain>, *.apps.<cluster>.<domain>, and required node and reverse records. Where the selected method supports deferral, external record publication can wait until after installation. With multi-node user-managed networking, prepare the required records before installation. Managed internal resolution does not publish records for external clients.",
      },
      {
        title: "Complete deferred DNS before shared access",
        detail:
          "Complete deferred external DNS before normal shared API, console, OAuth and application access. Until then, clients without their own name-resolution setup cannot use those endpoints by name. Assign an owner and verify resolution and access from the intended client networks.",
      },
    ],
  },
  {
    id: "routing",
    parent: "networking",
    phase: "pre-installation",
    title: "Firewall, proxy, and time",
    summary:
      "Prepare service reachability, any required proxy and certificate settings, and consistent time before booting hosts.",
    question: "Which source needs to reach which destination?",
    outcome:
      "Service paths and time sources are prepared, with owner-specific checks scheduled from the booted hosts.",
    owners:
      "Network and security teams, the installation owner, and the team responsible for time services.",
    scope:
      "Existing services and firewall rules may already meet requirements. Service access below groups the main dependencies; the current release’s full flow matrix governs the actual firewall policy.",
    flow: [
      {
        title: "Agree service paths with their owners",
        detail:
          "List each traffic source, destination and required phase. Review the Service access detail below with network and security teams, including internal node traffic and access from nodes to ingress endpoints.",
      },
      {
        title: "Choose direct, proxied or mirrored image access",
        detail:
          "Match firewall allowances and certificate trust to the selected image strategy. If outbound traffic uses a proxy, prepare its authentication, bypass rules and CA settings before creating media.",
      },
      {
        title: "Configure time sources",
        detail:
          "Provide reachable NTP sources through the chosen host configuration, using DHCP or additionalNTPSources where appropriate. Permit time traffic and verify synchronization after boot; a server address alone does not establish synchronized clocks.",
      },
    ],
  },
  {
    id: "service-access",
    parent: "routing",
    phase: "pre-installation",
    title: "Service access and firewall review",
    summary:
      "Map who connects to each service and which choice makes the connection necessary.",
    question: "Which paths must the network and security teams permit?",
    outcome:
      "A reviewed service-flow request identifies owners, applicability and checks from each actual consumer.",
    owners: "Network/security teams, service owners and installation owner.",
    scope:
      "Prepare before boot; validate from nodes afterward. This is a dependency overview, not an exhaustive firewall allowlist. Use the OCP 4.22 role-specific communication matrix for exact rules.",
    flow: [
      {
        title: "Review the selected paths",
        detail:
          "Use the table to identify cross-team requests. Include return routing, internal ingress access, registry redirects and the chosen boot-media path. Apply only the conditional services used by this deployment.",
      },
      {
        title: "Verify from the actual consumer",
        detail:
          "A successful workstation check does not prove node or BMC reachability. Record what is already tested and what must be checked after hosts boot; keep installation-only access separate from ongoing dependencies.",
      },
    ],
    serviceFlows: [
      {
        source: "All installation hosts",
        destination: "Rendezvous host",
        protocol: "TCP 8090",
        purpose: "Local Assisted Service during discovery and bootstrap.",
        owner: "Network + installation",
        applies: "Standard Agent installation only",
      },
      {
        source: "Cluster nodes",
        destination: "Other nodes and control plane",
        protocol: "Role-specific TCP/UDP; ICMP",
        purpose:
          "API, etcd, machine configuration, OVN overlay and node services. Use the full release matrix.",
        owner: "Network + platform",
        applies: "Required; exact paths depend on node roles",
      },
      {
        source: "Nodes",
        destination: "DNS resolvers and time sources",
        protocol: "DNS TCP/UDP 53; NTP UDP 123",
        purpose: "Resolve dependencies and synchronize clocks.",
        owner: "DNS/time + network",
        applies: "Configured DNS and NTP services",
      },
      {
        source: "DHCP clients and relays",
        destination: "DHCP service",
        protocol: "DHCP and relay paths for the selected IP families",
        purpose: "Stable addressing and configured network options.",
        owner: "IPAM + network",
        applies: "When using DHCP",
      },
      {
        source: "Nodes",
        destination: "Registry/CDN, mirror or proxy",
        protocol: "HTTPS or configured service port",
        purpose:
          "Pull images, including redirected downloads. Review required trust and authentication.",
        owner: "Registry/proxy + security",
        applies: "Chosen content path; self-contained media differs",
      },
      {
        source: "Nodes and administrator clients",
        destination: "API and ingress endpoints",
        protocol: "API TCP 6443; ingress TCP 80/443",
        purpose:
          "Cluster access, console/OAuth and internal Operator health checks.",
        owner: "Network + endpoint owner",
        applies: "Selected endpoint model",
      },
      {
        source: "Eligible VIP hosts",
        destination: "Peers and physical network",
        protocol: "VIP failover traffic for the selected network",
        purpose: "Allow managed endpoint addresses to move between hosts.",
        owner: "Network",
        applies: "Cluster-managed VIPs",
      },
      {
        source: "Administrator, BMC or booting node",
        destination: "BMC, media server or boot services",
        protocol: "Hardware/boot-method-specific",
        purpose: "Remote control and delivery of ISO, rootfs or PXE assets.",
        owner: "Hardware + boot-service owner",
        applies: "Selected boot method",
      },
      {
        source: "Selected nodes",
        destination: "Tang or remote storage service",
        protocol: "Configured service protocols",
        purpose: "Unlock encrypted disks or reach remote installation storage.",
        owner: "Security/storage + network",
        applies: "When Tang or remote root storage is selected",
      },
    ],
  },
  {
    id: "proxy",
    condition: "If site policy requires a proxy",
    parent: "routing",
    phase: "pre-installation",
    title: "Proxy and certificate trust",
    summary:
      "Supply the proxy configuration and trust needed by platform components.",
    question: "Which requests use the proxy and which must bypass it?",
    outcome:
      "Proxy endpoints, authentication, bypasses and CA inputs are reviewed before media generation.",
    owners: "Proxy administrator, security team and installation owner.",
    scope:
      "Conditional on site egress policy. Cluster-wide proxy settings apply to system components; workload proxy requirements are planned separately.",
    flow: [
      {
        title: "Specify endpoints and authentication",
        detail:
          "Record HTTP/HTTPS proxy addresses and any credentials. Confirm the installer workstation and cluster nodes can use their required paths.",
      },
      {
        title: "Review bypass destinations",
        detail:
          "Set noProxy for the destinations that must be reached directly. Review internal endpoints, registries and any node addresses outside the configured machine network; verify rather than assuming all internal traffic is covered.",
      },
      {
        title: "Supply and verify certificate trust",
        detail:
          "Include required CA certificates in the installation trust configuration. Check proxy and registry certificate chains from the relevant consumers, including the boot environment.",
      },
    ],
  },
  {
    id: "management",
    parent: "networking",
    phase: "pre-installation",
    title: "Host management and boot access",
    summary:
      "Arrange how the customer will boot physical servers with the prepared installation media.",
    question: "How will the prepared image reach each physical server?",
    outcome:
      "The installation team can use the selected boot mechanism, with working credentials, permissions, and access to the required media.",
    owners:
      "Hardware team and installation owner, with networking and security teams where access crosses controlled boundaries.",
    scope:
      "The customer arranges booting through supported physical media, BMC virtual media, or PXE. The standard Agent workflow does not require a separate provisioner or bootstrap machine.",
    flow: [
      {
        title: "Choose the boot mechanism",
        detail:
          "Choose physical or virtual ISO media, or a supported PXE workflow. Check firmware and architecture compatibility and whether BMC features require additional access or licensing.",
      },
      {
        title: "Prepare management and media access",
        detail:
          "Verify console/power permissions and BMC credentials where used. For URL-mounted media, the BMC needs its own addressing, routing, DNS and trust to reach the media source; node network configuration does not configure the BMC.",
      },
      {
        title: "Verify the physical handoff",
        detail:
          "Confirm who mounts media, starts each host and observes its console. Arrange subsequent boot from the installation disk and removal or detachment of installation media when appropriate. Test delivery through the chosen consumer’s path.",
      },
    ],
  },
  {
    id: "content",
    kind: "group",
    parent: "pre-installation",
    phase: "pre-installation",
    title: "Content, configuration and media",
    summary:
      "Choose the image source, prepare tools and configuration, then generate media and review readiness. Restricted sites and self-contained installation have different dependencies.",
    question: "Can every required artifact reach the place it will be used?",
    outcome:
      "Reviewed configuration, matching tools, credentials, and images are ready to generate and deliver the boot media.",
    owners: "Installation owner, registry administrator, and security team.",
    scope:
      "Prepare the configuration and installation assets required by the selected method. Disconnected image mirroring and installation without an external registry are explained as separate variations.",
    flow: [],
  },
  {
    id: "image-strategy",
    parent: "content",
    phase: "pre-installation",
    title: "Image access and content strategy",
    summary:
      "Choose how tools, release images and workload content reach the site.",
    question:
      "Which content is needed, and which source can each consumer reach?",
    outcome:
      "A release/architecture and content inventory are matched to an approved delivery path before media generation.",
    owners:
      "Installation owner, registry administrator, security team and workload owners.",
    scope:
      "Required for every installation. Content acquisition and transfer happen before boot; some workload images are used only after installation.",
    flow: [
      {
        title: "Choose the delivery path",
        detail:
          "Choose approved public registry access, an outbound proxy or a populated mirror when installation requires external image access. The full Agent ISO includes the boot environment but still needs release-image access. The separate self-contained workflow bundles release content.",
      },
      {
        title: "Inventory the required artifacts",
        detail:
          "Record the selected release payload and architecture, installer/CLI tools, boot assets and needed Operator/application images. Include dependencies of the planned workloads, even when they will be configured later.",
      },
      {
        title: "Assign ongoing content ownership",
        detail:
          "Confirm who supplies credentials and trust, tests image pulls and refreshes content for updates. For disconnected sites, open Disconnected preparation; for bundled media, verify its included content and remaining workload needs.",
      },
    ],
  },
  {
    id: "configuration",
    parent: "content",
    phase: "pre-installation",
    title: "Prepare cluster and host configuration",
    summary:
      "Gather the tools and credentials, then describe the cluster and identify how each physical host will participate.",
    question:
      "Does the configuration identify the right hosts, roles, networks, and installation disks?",
    outcome:
      "Reviewed configuration identifies the intended cluster, hosts, network settings, and target disks, with copies retained before media generation.",
    owners:
      "Installation owner, platform architect, hardware team, and network team.",
    scope:
      "Prepare and review inputs before generating installation assets. The Agent-based examples below use install-config.yaml and agent-config.yaml; additional manifests and optional settings are explained below.",
    flow: [
      {
        title: "Prepare tools and credentials",
        detail:
          "Obtain account/download access and a pull secret. Choose openshift-install and oc builds for the workstation OS/architecture, and verify the target release payload and cluster architecture separately. Arrange a recommended SSH public key for diagnostics and recovery.",
      },
      {
        title: "Describe the cluster",
        detail:
          "In install-config.yaml, record identity, layout, platform, network ranges, pull secret and image-access settings. Include applicable security, proxy and trust choices. Review optional capabilities and workload settings before accepting defaults.",
      },
      {
        title: "Identify hosts and installation disks",
        detail:
          "In agent-config.yaml, supply host interface MAC mappings, unique hostnames, roles and network settings where required. Use rootDeviceHints for intended disks when needed. Hints select the first matching device, so confirm the selection is unambiguous. Explicit roles avoid automatic assignment; review any values deliberately left to the installer.",
      },
      {
        title: "Confirm rendezvous and retain inputs",
        detail:
          "The rendezvous address belongs to a control-plane host. Specify it for DHCP; static host configuration can allow selection. Review the host inventory and keep protected copies of inputs before generation consumes them.",
      },
    ],
  },
  {
    id: "customizations",
    condition: "If defaults do not meet requirements",
    parent: "configuration",
    phase: "pre-installation",
    title: "Optional capabilities and custom manifests",
    summary:
      "Decide which optional platform components and advanced installation settings are needed.",
    question:
      "Which defaults should change before generating installation assets?",
    outcome:
      "Selected options and any extra manifests have owners, review results and retained source copies.",
    owners:
      "Platform architect, installation owner and the relevant workload, network or security specialists.",
    scope:
      "Conditional; settle before media generation. Later change costs differ: enabled capabilities cannot simply be disabled, and CPU partitioning is an installation-time choice.",
    flow: [
      {
        title: "Choose core capabilities and CPU settings",
        detail:
          "Keep the default capability set unless requirements call for a different footprint. Review capability dependencies separately from add-on Operators. Decide CPU partitioning and hyperthreading settings against the workload and hardware plan.",
      },
      {
        title: "Prepare the required advanced inputs",
        detail:
          "Use the documented cluster-manifest/additional-manifest workflow for selected disk encryption, partitioning or network customization. GitOps ZTP inputs are another supported route where the chosen topology permits them.",
      },
      {
        title: "Review support and validation limits",
        detail:
          "Check release and topology compatibility, including any Technology Preview status. Additional manifests are not validated or guaranteed to work by the installer. Review and test their intended behavior, and retain inputs so a correction can regenerate the assets.",
      },
    ],
  },
  {
    id: "disconnected",
    parent: "content",
    phase: "pre-installation",
    title: "Disconnected preparation",
    condition: "For disconnected environments",
    summary:
      "Prepare a local image registry so installation can obtain its images without accessing public registries. The self-contained installation alternative uses bundled media instead.",
    question: "What must be available without online access?",
    outcome:
      "A content inventory, accessible mirror, pull credentials and trust are ready; host-side pulls remain part of boot-time validation.",
    owners:
      "Registry administrator, installation owner, and security or transfer-approval team.",
    scope:
      "This is the mirror-registry installation path. Assign an owner to refresh images for future updates and new workloads.",
    flow: [
      {
        title: "Plan the mirror and transfer workflow",
        detail:
          "Assign registry capacity, availability, certificates and ongoing ownership. Choose direct mirroring or archive transfer, with the required connected/disconnected workstations, storage and an approved transfer path.",
      },
      {
        title: "Copy the selected content",
        detail:
          "Use oc-mirror v2 to mirror the chosen release and architecture, plus required Operator versions and application images. Check the inventory against intended workloads and allow capacity for transfers and future refreshes.",
      },
      {
        title: "Configure pull access and verify readiness",
        detail:
          "Set mirror locations, pull credentials and certificate trust before generating media. Keep upload credentials separate from the cluster pull secret. Test available pull paths now, then verify from booted nodes; the mirror remains an ongoing dependency.",
      },
    ],
  },
  {
    id: "media",
    parent: "content",
    phase: "pre-installation",
    title: "Prepare and deliver boot media",
    summary:
      "Create boot assets from reviewed configuration and arrange delivery to the intended hosts.",
    question:
      "Are the correct boot assets ready for each host, and who will start it?",
    outcome:
      "Reviewed assets are tied to the intended hosts and disks, with delivery owners and a clear list of checks to complete after boot.",
    owners: "Installation owner and hardware owner.",
    scope:
      "These steps use a full Agent ISO. Minimal ISO and PXE options add boot-file hosting requirements. A full Agent ISO still needs access to the release images; the separate self-contained workflow packages them differently.",
    flow: [
      {
        title: "Preserve the reviewed inputs",
        detail:
          "Keep protected copies of configuration, extra manifests and release details. Protect credentials and media containing sensitive settings; retain the installation directory for monitoring. If embedded inputs change, regenerate and replace the affected assets.",
      },
      {
        title: "Create the installation image",
        detail:
          "Generate media for the selected release and architecture. Resolve generation errors, then identify the exact assets to distribute. Generation checks configuration; it does not prove that site services or physical host connections work.",
        command:
          "openshift-install --dir <installation-directory> agent create image",
      },
      {
        title: "Confirm readiness to start",
        detail:
          "Verify the intended hosts, configuration and installation assets, and resolve outstanding prerequisites before booting.",
      },
    ],
  },
  {
    id: "boot-options",
    parent: "media",
    phase: "pre-installation",
    title: "Boot options: full ISO, minimal ISO, and PXE",
    summary:
      "Choose how hosts receive the installation environment and any additional boot files.",
    question: "Which boot files must be delivered or hosted at this site?",
    outcome:
      "The chosen boot mechanism has the files and reachable services needed to start each host.",
    owners:
      "Installation owner, hardware team, and network or boot-service administrator.",
    scope:
      "These options change delivery of the standard Agent boot environment. Release-image access is still required; self-contained installation is a separate variation.",
    flow: [
      {
        title: "Boot from a full ISO",
        detail:
          "Generate the standard Agent ISO and deliver it through supported physical or virtual media. The root filesystem is included in the ISO.",
      },
      {
        title: "Host the root filesystem for a minimal ISO",
        detail:
          "Set minimalISO to generate media that retrieves its root filesystem from a URL. Without bootArtifactsBaseURL, the installer uses a public source. Restricted sites must provide an appropriate reachable source and arrange any required trust.",
      },
      {
        title: "Serve network boot files for PXE",
        detail:
          "Prepare the required workstation tools, including nmstatectl for the documented PXE workflow. Generate kernel, initramfs, rootfs and applicable boot-script assets, configure the boot service and asset hosting, and check retrieval from the booting hosts. Use bootArtifactsBaseURL where required.",
        command:
          "openshift-install --dir <installation-directory> agent create pxe-files",
      },
    ],
  },
  {
    id: "self-contained",
    parent: "content",
    phase: "pre-installation",
    title: "Variation: install without an external registry",
    condition: "Optional alternative",
    summary:
      "Install through a local web interface using self-contained media tailored for virtualization deployments. General OpenShift clusters are also supported, but additional Operators and storage must be arranged separately. Works in connected or disconnected environments. Generally available from OCP 4.22.18; Technology Preview in OCP 4.21.",
    question:
      "Does the bundled media and its supported configuration fit this site?",
    outcome:
      "The cluster is installed, access credentials are saved, and the team has a plan for storage, additional Operators, and updates.",
    owners:
      "Installation owner, hardware team, and platform or virtualization team.",
    scope:
      "The bundled Operators focus on virtualization and include no storage Operators. Configure storage separately and obtain other Operators as needed. After installation, you can configure an external registry and use it for cluster updates.",
    flow: [
      {
        title: "Obtain the media and check included content",
        detail:
          "Download the ISO through Hybrid Cloud Console’s Assisted Installer flow using the disconnected-environment option. Confirm its release and bundled content. If useful, preconfigure rendezvous, SSH and time settings before distributing the media.",
      },
      {
        title: "Start the rendezvous host and local interface",
        detail:
          "Boot the ISO and designate exactly one rendezvous host. Open its installation-console URL; boot remaining hosts with its IP address. Virtual media can take hours; physical media can reduce installation time.",
      },
      {
        title: "Configure the cluster and review hosts",
        detail:
          "Enter identity and pull secret, then choose the virtualization bundle or supported individual Operators. Review details before advancing: the UI does not allow those cluster details to be edited on the next page. Check host roles, disks and networking, and provide any selected encryption, Tang or custom-manifest inputs.",
      },
      {
        title: "Save credentials and start installation",
        detail:
          "Download and securely save credentials before selecting Install cluster. The rendezvous host reboots and its installation console becomes unavailable; credentials can no longer be retrieved there. Use the cluster console after installation completes.",
      },
    ],
  },
  {
    id: "hosts",
    notes: [
      {
        title: "Research coverage: physical execution",
        detail:
          "Reported accounts cover physical preparation, management connectivity and failed-run cleanup. Direct observation of firmware, boot delivery, bootstrap transitions and recovery decisions is still needed on current workflows. This research gap is not a customer incident.",
      },
    ],
    parent: "installation",
    phase: "installation",
    title: "Boot and install the hosts",
    summary:
      "Boot the prepared media and follow host discovery, validation, and operating-system installation.",
    question: "Are the expected hosts installing onto the intended disks?",
    outcome:
      "Hosts boot from their selected installation disks and join the cluster.",
    owners: "Installation owner and hardware team.",
    scope:
      "Standard Agent CLI workflow. Hosts register with the local Assisted Service on the rendezvous host; installation starts after required hosts and validations are ready.",
    flow: [
      {
        title: "Confirm targets and boot the hosts",
        detail:
          "Check host identities, roles, and installation disks against the prepared configuration before booting the installation media.",
      },
      {
        title: "Register and validate",
        detail:
          "Each host contacts the Assisted Service at the rendezvous IP on TCP port 8090. The service validates installation requirements, including connectivity, clock synchronization and image access, and starts deployment when they are met. Investigate failed checks with the responsible infrastructure owners.",
      },
      {
        title: "Install and reboot",
        detail:
          "The installer writes the operating system and configuration to the selected disks. Ensure subsequent boots use those disks. The rendezvous host reboots later as part of bootstrap.",
      },
    ],
  },
  {
    id: "bootstrap",
    parent: "installation",
    phase: "installation",
    title: "Bootstrap and control-plane handoff",
    summary:
      "Follow the transition from temporary bootstrap services to an operational cluster control plane.",
    question: "What is running now, and what should take over next?",
    outcome:
      "The Kubernetes API reports bootstrap complete; installation continues until the cluster is fully initialized.",
    owners: "Installation owner and platform team.",
    scope:
      "In the Agent-based workflow, one control-plane host runs the local installation service and temporarily provides bootstrap. It later reboots and joins the cluster; there is no separate bootstrap machine to retire.",
    flow: [
      {
        title: "The rendezvous host runs the local service",
        detail:
          "The rendezvous host runs the Assisted Service and coordinates the other installation hosts.",
      },
      {
        title: "Establish the control plane",
        detail:
          "In a multi-node cluster, the other hosts reboot into their installed systems while the rendezvous host provides bootstrap services.",
      },
      {
        title: "Follow the rendezvous host’s transition",
        detail:
          "The rendezvous host reboots and joins the cluster. Bootstrap completion is an intermediate milestone. Continue with agent wait-for install-complete.",
      },
    ],
  },
  {
    id: "progress",
    parent: "installation",
    phase: "installation",
    title: "Progress and diagnosis",
    summary:
      "Monitor bootstrap and installation completion; collect logs when progress stops.",
    question: "Should we wait, investigate, or intervene?",
    outcome:
      "The operator understands the current phase, affected host and available evidence.",
    owners: "Installation owner + support when needed",
    scope:
      "Run monitoring commands with the directory used to generate the boot media. The monitoring machine must resolve and reach the cluster API.",
    flow: [
      {
        title: "Check bootstrap progress",
        detail:
          "Monitor the control-plane transition. The command below applies to the Agent-based workflow. A monitoring timeout needs investigation of the actual host and cluster state.",
        command:
          "openshift-install --dir <installation-directory> agent wait-for bootstrap-complete --log-level=info",
      },
      {
        title: "Follow installation completion",
        detail:
          "Continue monitoring through cluster initialization. Check the reported failure or missing prerequisite if installation does not complete.",
        command:
          "openshift-install --dir <installation-directory> agent wait-for install-complete --log-level=info",
      },
      {
        title: "Collect diagnostics before bootstrap completes",
        detail:
          "Collect agent-gather from the rendezvous host. Also collect it from hosts that fail to register. Connect using the SSH key configured for installation. Save each host’s archive separately.",
        command: "ssh core@<host-ip> agent-gather -O > agent-gather.tar.xz",
      },
      {
        title: "Collect diagnostics after bootstrap and node reboot",
        detail:
          "For installation failures, use the generated kubeconfig to collect cluster diagnostics.",
        command:
          'export KUBECONFIG="<installation-directory>/auth/kubeconfig"\noc adm must-gather',
      },
    ],
  },
  {
    id: "recovery",
    parent: "installation",
    phase: "installation",
    title: "Correct and retry",
    summary:
      "Preserve failure logs, correct the cause, and determine whether installation can continue.",
    question: "What can be corrected, and what must be repeated?",
    outcome:
      "The next action follows the failure and preserves relevant inputs and diagnostics.",
    owners: "Installation owner + affected infrastructure owner",
    scope:
      "Recovery depends on the failed phase. A connectivity correction, a repeated monitoring command, and a new installation attempt have different effects.",
    flow: [
      {
        title: "Preserve the failure details",
        detail:
          "Record the host, phase, error, and configuration. Gather diagnostics before rebooting or overwriting installation assets.",
      },
      {
        title: "Correct host networking",
        detail:
          "If the release-image pull check fails, read Check Errors and use Configure network to edit and reactivate the connection. When the pull check succeeds, quit the Agent console to continue. If you interact with the console, you must explicitly quit it even when checks pass.",
      },
      {
        title: "Decide whether to continue or regenerate",
        detail:
          "After correcting the cause, check whether the current installation resumes. Re-running a wait command observes progress; it does not restart installation. Changes to configuration embedded in the media require regenerated assets. Preserve diagnostics before starting another installation attempt.",
      },
    ],
  },
  {
    id: "completion",
    parent: "installation",
    phase: "installation",
    title: "Verify the base cluster",
    summary:
      "Confirm the base cluster is installed and healthy, then carry remaining Operator installation, service configuration and workload checks into post-installation.",
    question: "What does “installed” establish?",
    outcome:
      "Installation completion, expected hosts, core services and access are checked.",
    owners: "Installation owner + receiving platform team",
    scope:
      "Cluster installation establishes the base platform. Next, install any missing Operators, configure their services, and verify readiness with representative workloads.",
    flow: [
      {
        title: "Confirm installation completion",
        detail:
          "Confirm that the installer reports completion and investigate any reported errors. For the Agent-based workflow, use agent wait-for install-complete from the retained installation directory.",
      },
      {
        title: "Verify the expected cluster",
        detail:
          "Load the generated kubeconfig. Confirm the expected nodes and roles, all nodes Ready, and the intended OpenShift version. ClusterOperators should show Available=True, Progressing=False, and Degraded=False. Verify console login once client-side name resolution is ready; if external DNS was deferred, record console access as a remaining check.",
        command:
          'export KUBECONFIG="<installation-directory>/auth/kubeconfig"\noc get nodes\noc get clusterversion\noc get clusteroperators',
      },
      {
        title: "Hand over credentials and remaining tasks",
        detail:
          "Securely transfer access from the generated auth files. Record remaining Operator installation and configuration, deferred external DNS and client-access checks, and storage, network, identity, workload and acceptance work.",
      },
    ],
  },
  {
    id: "platform-operators",
    notes: [
      {
        title: "Carry the remaining configuration forward",
        detail:
          "Record the required identity, certificates, platform services and workload settings, with an owner and a verification step for each. Reuse the team's automation where it already supplies these settings. A healthy base cluster, a configured platform and an accepted workload are separate milestones.",
      },
    ],
    parent: "post-installation",
    phase: "post-installation",
    title: "Install and configure required Operators",
    summary:
      "Build on the installed cluster with the Operators and services your workloads need. Install missing components, configure their services, and verify readiness.",
    question: "Which additional components does the intended workload require?",
    outcome:
      "Required Operators and their managed services report ready, with versions and update policies recorded.",
    owners:
      "Platform team and storage, network, virtualization, or other component owners.",
    scope:
      "Check the actual cluster before installing components; some installation methods already supply selected add-ons. Choose additional Operators according to workload and site requirements, including the selected storage provider.",
    operatorExamples: [
      {
        need: "Persistent storage",
        operators:
          "OpenShift Data Foundation; Local Storage for a local-disk deployment",
        configuration:
          "Select disks, configure the storage system and storage classes, and verify volume provisioning. Components depend on your storage provider.",
      },
      {
        need: "Host networking and service exposure",
        operators: "Kubernetes NMState; MetalLB",
        configuration:
          "Use NMState to configure node interfaces, or MetalLB to configure address pools and advertisements for LoadBalancer services on bare metal.",
      },
      {
        need: "Virtual machines",
        operators: "OpenShift Virtualization",
        configuration:
          "Create the HyperConverged resource, verify readiness, and prepare VM storage and networking.",
      },
      {
        need: "Centralized logging",
        operators: "OpenShift Logging; optionally Loki",
        configuration:
          "Configure log collection and forwarding to an external destination or a LokiStack, with retention and reader access.",
      },
      {
        need: "Application backup and restore",
        operators: "OpenShift API for Data Protection (OADP)",
        configuration:
          "Configure backup storage, credentials and schedules, then verify application restoration. Prepare cluster-state recovery separately.",
      },
      {
        need: "Application delivery",
        operators: "OpenShift GitOps; OpenShift Pipelines",
        configuration:
          "Connect repositories and configure deployments with GitOps or build and delivery workflows with Pipelines, as required.",
      },
      {
        need: "Compliance checks",
        operators: "Compliance Operator",
        configuration:
          "Select profiles, configure scans, and review findings and remediation for the site's requirements.",
      },
    ],
    flow: [
      {
        title: "Identify missing components",
        detail:
          "Compare workload requirements with installed components. Check supported OpenShift versions, hardware requirements, dependencies, and installation scope.",
      },
      {
        title: "Install and configure",
        detail:
          "Install the required Operators and create or adjust their configuration resources. Record selected versions and update policies. For OpenShift Virtualization, install the Operator and create its HyperConverged resource.",
      },
      {
        title: "Verify the managed service",
        detail:
          "Check both Operator installation status and the readiness of the service it manages. For OpenShift Virtualization, verify the HyperConverged version and readiness conditions before creating test VMs.",
      },
    ],
  },
  {
    id: "storage",
    kind: "group",
    parent: "post-installation",
    phase: "post-installation",
    title: "Enable workload storage",
    summary:
      "Configure persistent storage and verify that workloads can provision, use, and retain their data.",
    question:
      "Can workloads obtain storage with the required capacity and behavior?",
    outcome:
      "A representative workload provisions storage, retains data after restart, and passes the required storage tests.",
    owners:
      "Storage owner, platform team, and application or virtualization team.",
    scope:
      "Configure the selected storage solution after cluster installation. Provisioning, persistence, and recovery tests depend on the workload and storage provider.",
    flow: [],
  },
  {
    id: "physical-storage",
    parent: "storage",
    phase: "post-installation",
    title: "Confirm devices and connectivity",
    summary:
      "Verify that the selected nodes can access the devices or storage services they will use.",
    question: "Can the intended nodes access the selected storage?",
    outcome:
      "Required devices, network paths, array mappings, and credentials are verified for the selected storage integration.",
    owners: "Storage, network, and hardware owners with the platform team.",
    scope:
      "Use the requirements for the selected storage solution, driver, and OpenShift release. Local devices and external storage require different checks.",
    flow: [
      {
        title: "Identify nodes and devices",
        detail:
          "Identify the nodes, local devices, or external storage services used by the selected solution.",
      },
      {
        title: "Verify access",
        detail:
          "Check required adapters, network paths, array mappings, and credentials from the nodes that will use the storage.",
      },
      {
        title: "Check compatibility",
        detail:
          "Verify that the storage system and required host components are supported with the selected storage driver and OpenShift release.",
      },
    ],
  },
  {
    id: "storage-drivers",
    parent: "storage",
    phase: "post-installation",
    title: "Configure and validate workload storage",
    summary:
      "Configure storage provisioning and verify persistence and the operations required by the workload.",
    question:
      "Can workloads obtain, use and retain storage with the required behavior?",
    outcome:
      "A representative workload obtains a volume, reads and writes data, retains it after restart, and passes the required storage tests. Results and restrictions are recorded.",
    owners:
      "Storage owner and platform administrator, with the application or virtualization team.",
    scope:
      "Use dynamic provisioning through StorageClasses or static persistent volumes. StorageProfiles apply to OpenShift Virtualization. Test additional operations only where required and supported; VM migration also depends on CPU, network and other virtualization requirements.",
    flow: [
      {
        title: "Configure the storage integration",
        detail:
          "Install and configure the supported storage integration, including its required credentials and backend settings.",
      },
      {
        title: "Define provisioning and workload settings",
        detail:
          "Define StorageClasses or static persistent volumes and select a reclaim policy. Configure volume claims with the required access and volume modes. Designate a default StorageClass where appropriate. For OpenShift Virtualization, verify the associated StorageProfile, including access mode, volume mode and supported cloning behavior.",
      },
      {
        title: "Verify provisioning and persistence",
        detail:
          "Create a test persistent volume claim and a representative workload that uses it. Verify that the claim binds and the workload can read and write data. Restart the workload and confirm the data remains.",
      },
      {
        title: "Test required storage operations",
        detail:
          "Identify any required expansion, snapshot, restore or migration behavior and confirm support for the selected storage and workload configuration. Exercise those operations with the representative workload. Record results, restrictions and any failed or untested requirements.",
      },
    ],
  },
  {
    id: "workload-network",
    parent: "post-installation",
    phase: "post-installation",
    title: "Connect workload networks",
    summary:
      "Configure and test application connectivity, ingress, and network isolation.",
    question:
      "Do required connections succeed and prohibited connections fail?",
    outcome:
      "DNS, ingress, outbound access, and required network isolation pass tests from the intended workload and project.",
    owners:
      "Network owner, platform team, and application or virtualization team.",
    scope:
      "Some host-network changes are supported after installation. Follow the documented procedure for the selected configuration; the primary IP address of a customized br-ex bridge cannot be changed through the Agent postinstallation procedure.",
    flow: [
      {
        title: "Configure application connectivity",
        detail:
          "Complete any deferred external cluster DNS before shared access. Verify API, console, OAuth and application-route resolution and reachability from the intended administrator and application networks. Confirm workload DNS, Services, required ingress or Routes, TLS, and outbound access to dependencies.",
      },
      {
        title: "Add specialized networking where required",
        detail:
          "Configure the applicable host interfaces, VLANs, bridges, and workload attachments. Install Kubernetes NMState or SR-IOV components only when the design requires them.",
      },
      {
        title: "Test connectivity and isolation",
        detail:
          "From the intended project and workload, verify required connections succeed and prohibited connections fail. Use policy enforcement supported by each network type; check secondary attachments separately from the default network.",
      },
    ],
  },
  {
    id: "image-access",
    parent: "post-installation",
    phase: "post-installation",
    title: "Verify workload image access",
    summary:
      "Reuse prepared image access and configure only what is missing for Operators and workloads.",
    question: "Can the intended workload pull images from the approved source?",
    outcome:
      "A workload starts using the approved image source and service account.",
    owners:
      "Registry and content owners, platform team, and application delivery team.",
    scope:
      "If image sources, credentials, trust and mirrors already meet workload requirements, only verification remains. The integrated OpenShift registry is separate from the registry supplying installation images; enable it only if the deployment needs it.",
    flow: [
      {
        title: "Check existing image access",
        detail:
          "Reuse the registries, credentials, certificate trust and mirror settings prepared for installation. Check that they cover the required Operator and workload images, and configure only missing requirements. At disconnected sites, verify that the required images are mirrored and the applicable mirror and catalog resources are configured in the cluster.",
      },
      {
        title: "Enable the integrated registry if needed",
        detail:
          "If the deployment will store images in OpenShift’s integrated registry, check its current configuration. Bare-metal installation can finish with this registry in Removed state; change it to Managed and configure supported persistent storage before production use. Skip this setup if the deployment uses external registries instead.",
      },
      {
        title: "Verify workload image access",
        detail:
          "Pull an image using the application’s service account and start a representative workload. If the deployment includes image builds or publishing, verify that the build or delivery identity can push to the chosen registry.",
      },
    ],
  },
  {
    id: "access",
    parent: "post-installation",
    phase: "post-installation",
    title: "Identity, access and security",
    summary:
      "Configure team login, project permissions, resource limits and workload security, then verify access with a team account.",
    question:
      "Can the receiving team perform required tasks within its assigned permissions?",
    outcome:
      "Team accounts can deploy the test workload and inspect its logs; actions outside their assigned permissions are denied.",
    owners: "Identity and security owners with platform and application teams.",
    scope:
      "Retain cluster administration with designated platform administrators. Apply project permissions, quotas and workload security controls according to team and application requirements.",
    flow: [
      {
        title: "Configure login and administrator access",
        detail:
          "Connect the chosen identity provider, such as LDAP or OpenID Connect. Verify a named administrator has working cluster-admin access before removing kubeadmin.",
      },
      {
        title: "Assign project permissions",
        detail:
          "Create application projects and bind team groups to appropriate roles: view for reading, edit for managing workloads, or admin for project administration. Use project-scoped bindings unless cluster-wide access is required.",
      },
      {
        title: "Set resource and workload security controls",
        detail:
          "Set project quotas and container defaults or limits where required. Assign workload service accounts and their permissions. Check that workloads run under the applicable security context constraints (SCCs); grant additional SCC access only where needed.",
      },
      {
        title: "Verify access as the receiving team",
        detail:
          "Log in with a representative team account. Deploy the test workload, inspect its logs, and confirm that actions outside the assigned permissions are denied.",
      },
    ],
  },
  {
    id: "observability",
    parent: "post-installation",
    phase: "post-installation",
    title: "Configure monitoring, alerts and logs",
    summary:
      "Make platform and workload health visible to the teams responsible for responding.",
    question:
      "Can the responsible team receive an alert and find the logs needed to investigate it?",
    outcome:
      "A controlled test alert reaches its recipient, and the responsible team can retrieve the test workload’s logs.",
    owners:
      "Platform operations, monitoring and logging owners, and application teams.",
    scope:
      "Platform metrics and alert rules are available by default; external notifications require receiver configuration. Enable user-workload monitoring and centralized logging where required.",
    flow: [
      {
        title: "Configure monitoring storage and retention",
        detail:
          "Verify platform metrics are available. Set retention and persistent storage for metrics and alert state; persistent storage preserves this data across restarts.",
      },
      {
        title: "Enable application monitoring where required",
        detail:
          "Enable user-workload monitoring and configure application metrics collection using ServiceMonitor or PodMonitor resources. Add application-specific alert rules.",
      },
      {
        title: "Route alert notifications",
        detail:
          "Configure Alertmanager receivers, such as email, Slack or PagerDuty, and route alerts to the responsible teams. Platform alert rules already exist; notification delivery needs configuration.",
      },
      {
        title: "Configure centralized logging where required",
        detail:
          "Select application, infrastructure and audit logs to collect. Configure the Logging Operator and forwarding to an external log store or LokiStack, with appropriate collection permissions, retention and reader access. LokiStack is optional when using an external destination.",
      },
      {
        title: "Verify notifications and investigation access",
        detail:
          "Send a controlled test alert. Confirm the responsible team receives it and can view relevant metrics and retrieve a known log message using its own account.",
      },
    ],
  },
  {
    id: "workloads",
    parent: "post-installation",
    phase: "post-installation",
    title: "Validate the platform with representative workloads",
    summary:
      "Use a representative container application or VM to test the platform capabilities the application teams require.",
    question:
      "Does the prepared platform pass the intended workload requirements?",
    outcome:
      "Representative workloads pass the agreed deployment, data, connectivity, access, and operational tests.",
    owners: "Platform team and receiving application or virtualization team.",
    scope:
      "Agree acceptance criteria before testing. Run representative workloads with the receiving team’s permissions, policies, and resource allocation.",
    flow: [
      {
        title: "Define the test",
        detail:
          "Select a workload that exercises the required image access, scheduling, storage, networking, and permissions.",
      },
      {
        title: "Run it under application-team conditions",
        detail:
          "Use the intended project, service account, policies, and resource allocation.",
      },
      {
        title: "Record acceptance results",
        detail:
          "Verify startup, connectivity, data persistence, and monitoring. Test agreed capacity and maintenance behavior where applicable. Record failed or untested requirements.",
      },
    ],
  },
  {
    id: "operations",
    kind: "group",
    parent: "post-installation",
    phase: "post-installation",
    title: "Prepare platform operations",
    summary:
      "Establish update, backup, recovery, and support procedures before application teams depend on the platform.",
    question:
      "Who updates the platform, restores services, and handles incidents?",
    outcome:
      "Platform owners have update and cluster recovery procedures, application restore results, and a support escalation path.",
    owners:
      "Platform operations and component owners, with application teams defining workload requirements.",
    scope:
      "Prepare operational procedures and ownership before handover. Ongoing updates and incident response continue after application teams begin using the platform.",
    flow: [],
  },
  {
    id: "upgrades",
    notes: [
      {
        title: "Reported lifecycle context",
        detail:
          "Accounts describe additional migration, compatibility checks or revalidation around storage, networking and third-party Operators. Other accounts describe smooth core upgrades. These are later-operation experiences unless a dependency blocks the agreed initial platform configuration; they are not counted as installation problems here.",
      },
    ],
    parent: "operations",
    phase: "post-installation",
    title: "Plan platform and Operator updates",
    summary:
      "Plan compatibility checks, workload disruption, and content delivery for platform and Operator updates.",
    question: "Who owns updates, compatibility checks, and image availability?",
    outcome:
      "An update plan records supported versions, compatibility checks, content sources, approvals, and maintenance owners.",
    owners:
      "Platform team, storage and network integration owners, Operator owners, and content owners.",
    scope:
      "Prepare the update process before handover. An OpenShift upgrade is not required solely to complete the handover.",
    flow: [
      {
        title: "Check update requirements",
        detail:
          "Record installed OpenShift and Operator versions, supported update paths, and integration compatibility. Identify API removals that require application changes before updating.",
      },
      {
        title: "Plan maintenance",
        detail:
          "Assign the update owner and agree workload disruption with application teams. Check that pod disruption budgets permit node maintenance. Identify required backups and post-update health and workload checks.",
      },
      {
        title: "Prepare update content",
        detail:
          "Identify the sources of required release and Operator images. For disconnected sites, assign responsibility for mirroring and delivering the required releases, Operator catalogs, and images before updates.",
      },
    ],
  },
  {
    id: "backups",
    notes: [
      {
        title: "Acceptance requirement: recover credentials and secrets",
        detail:
          "A configuration repository alone does not establish that the environment can be recovered. Agree how required secrets, keys and external credentials will be retained or restored, who can access them and how the chosen recovery scenario will verify them. An unresolved recovery requirement is not evidence of an observed failed restore.",
      },
    ],
    parent: "operations",
    phase: "post-installation",
    title: "Configure backups and verify recovery",
    summary:
      "Configure separate protection for cluster state and workload data, then test recovery.",
    question:
      "Can the required service be restored within the agreed data-loss and recovery-time limits?",
    outcome:
      "Backup schedules and failure checks have owners. Application restore results record recovery time and restrictions, and a separate cluster recovery procedure is available.",
    owners:
      "Platform operations, application owners, storage owners, and security owners.",
    scope:
      "Retain configuration and required credentials securely. An etcd backup protects cluster state; OADP can protect application resources and persistent data. An application restore does not validate cluster disaster recovery, and handover does not require disrupting the new cluster to test it.",
    flow: [
      {
        title: "Define recovery requirements",
        detail:
          "Define acceptable data loss and recovery time. Identify cluster state, workload data, external dependencies, and credentials to recover. For both cluster and application backups, record the schedule, retention, destination, and owner responsible for checking failures.",
      },
      {
        title: "Configure cluster-state protection",
        detail:
          "Follow the documented etcd backup procedure and store backups securely outside the cluster. Wait for the first certificate rotation before the initial backup, and take a backup before cluster updates. Keep the cluster recovery procedure available; etcd restore requires a backup from the same OpenShift z-stream release.",
      },
      {
        title: "Configure workload-data protection",
        detail:
          "Configure a supported backup method for the workload and storage provider, such as OADP where appropriate. Apply the agreed schedule and retention, and verify access to the backup destination.",
      },
      {
        title: "Test a representative restore",
        detail:
          "Restore a representative workload and verify its data, required credentials and connections. Measure recovery time and record results and restrictions. Record separately which cluster-reconstruction or external-service recovery steps remain untested.",
      },
    ],
  },
  {
    id: "support",
    parent: "operations",
    phase: "post-installation",
    title: "Prepare incident response and support",
    summary:
      "Identify incident contacts, escalation routes, and the people responsible for collecting diagnostics and opening support cases.",
    question:
      "Can the responsible team investigate an incident and obtain support?",
    outcome:
      "Teams know how to report incidents, escalate platform failures, collect diagnostics, and open Red Hat support cases.",
    owners:
      "Platform operations, application owners, and support account owners.",
    scope:
      "Platform operations handles cluster incidents and coordinates with application and infrastructure owners. Application teams receive the reporting and escalation instructions.",
    flow: [
      {
        title: "Assign incident contacts and escalation routes",
        detail:
          "Record how to contact application, platform, storage, and network owners. Identify who coordinates incidents and when to escalate to infrastructure providers or Red Hat Support.",
      },
      {
        title: "Prepare diagnostics and support access",
        detail:
          "Identify who can open Red Hat support cases and verify their support account access. Record the cluster ID and instructions for collecting oc adm must-gather data, including component-specific diagnostics where needed. Assign collection to an operator with the required cluster permissions.",
      },
      {
        title: "Rehearse a diagnostic task with the responsible operator",
        detail:
          "Use a representative workload problem to check whether the operator can find relevant evidence, collect it with their own access and identify the next escalation. Record any missing skills, infrastructure visibility or instructions, and assign an owner to close the gap.",
      },
    ],
  },
  {
    id: "acceptance",
    notes: [
      {
        title: "Acceptance requirement: demonstrate the agreed behavior",
        detail:
          "A running first workload proves only the checks performed. Agree which maintenance, migration, failure, offline-continuity and recovery scenarios matter for this deployment. Record each result, limitation and owner. Existing rehearsals, planned tests and unresolved requirements must remain distinct; none alone establishes an outage.",
      },
      {
        title: "Operating knowledge and the receiving team's responsibilities",
        detail:
          "Reported accounts describe wider infrastructure and support teams still learning OpenShift, with difficult work returning to experienced staff. Check the responsible operators' skills and instructions separately from application-team onboarding. A reported learning transition does not establish a failed formal handover; use a representative diagnostic task to identify the remaining gap.",
      },
    ],
    parent: "post-installation",
    phase: "post-installation",
    title: "Review readiness and hand over to application teams",
    summary:
      "Review workload test results and give application teams the access instructions, service details, and support procedures they need.",
    question:
      "Can the receiving team use its projects, understand the limits, and obtain help?",
    outcome:
      "Application-team deployment is verified. Teams have operating instructions, known restrictions, and procedures for requesting changes and reporting incidents.",
    owners:
      "Receiving application teams, platform operations, and infrastructure service owners.",
    scope:
      "Complete the agreed platform tests and operational preparation before handover. The platform team retains cluster operations; application teams receive access and guidance for their workloads.",
    flow: [
      {
        title: "Review results and restrictions",
        detail:
          "Link the earlier workload validation and agreed maintenance or recovery results. Identify failed or untested requirements, their impact on the intended workloads, and the owners responsible for resolving them. Include secret restoration and offline continuity where the agreed recovery scenario requires them. When security-policy rollout is part of acceptance, review enforcement, workload validation and agreement with application teams separately from installing the tooling.",
      },
      {
        title: "Provide the team's operating information",
        detail:
          "Confirm deferred DNS is complete and teams can reach the required endpoints. Supply console and API addresses, login instructions, assigned projects and roles, registry locations, storage classes, network restrictions, quotas, deployment examples, and metrics and log access instructions.",
      },
      {
        title: "Confirm project and support procedures",
        detail:
          "State whether teams create projects themselves or request them, and how to request additional access or capacity. Identify who handles application and platform incidents, application configuration, and backups. Share the incident contacts and escalation instructions.",
      },
      {
        title: "Confirm the team can use the platform",
        detail:
          "Use the receiving team's deployment result from the earlier workload validation to confirm it can deploy using its own access and the supplied instructions. Repeat the deployment only if access or instructions changed.",
      },
    ],
  },
];
