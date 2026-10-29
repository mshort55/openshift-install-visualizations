import type { Topic } from "../model";

export const topics: Topic[] = [
  {
    id: "journey",
    parent: null,
    phase: null,
    title: "The complete installation journey",
    summary:
      "From the infrastructure a customer has to a platform they can use, demonstrate and hand over.",
    question: "What does it take to make OpenShift useful?",
    outcome:
      "The intended workload is usable and its operating requirements are demonstrated.",
    owners: "Platform, infrastructure, security and application teams",
    scope: "Bare-metal journey · method and workload dependent",
    flow: [
      {
        title: "Prepare the environment",
        detail:
          "Agree the outcome, fit the existing site, and verify prerequisites.",
      },
      {
        title: "Create the cluster",
        detail:
          "Install the hosts, establish the control plane, and understand progress.",
      },
      {
        title: "Make it useful",
        detail:
          "Enable workloads, verify readiness, and transfer operational ownership.",
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
      "Ready to begin: inputs, infrastructure, access and owners are established.",
    owners: "Platform team + network, storage, security and hardware owners",
    scope: "Preparation · includes media and host discovery",
    flow: [
      {
        title: "Agree the intended outcome",
        detail:
          "Choose a workload, deployment approach and feasible infrastructure.",
      },
      {
        title: "Prepare in parallel",
        detail:
          "Network, hardware, content and access work often involve different teams.",
      },
      {
        title: "Verify the handoffs",
        detail:
          "Distinguish tested readiness from approvals, assumptions and pending work.",
      },
    ],
  },
  {
    id: "installation",
    parent: "journey",
    phase: "installation",
    title: "Installation",
    summary:
      "Turn prepared hosts into a running cluster, with understandable progress and recovery.",
    question: "Is installation progressing, blocked, or waiting for us?",
    outcome:
      "Base cluster installed, with expected nodes, services and access checked.",
    owners: "Installation owner + infrastructure owners when dependencies fail",
    scope: "Execution · from installation start to base-cluster handoff",
    flow: [
      {
        title: "Install the hosts",
        detail:
          "The selected method provisions or installs RHCOS and initial configuration.",
      },
      {
        title: "Establish the control plane",
        detail: "Bootstrap services give way to the running cluster.",
      },
      {
        title: "Verify completion",
        detail:
          "Check installation completion, expected node readiness and cluster health.",
      },
    ],
  },
  {
    id: "post-installation",
    parent: "journey",
    phase: "post-installation",
    title: "Post-installation",
    summary:
      "Enable the intended workload and demonstrate that the team can operate it.",
    question: "Can we use this cluster and confidently hand it over?",
    outcome:
      "Workload usable → customer-specific readiness demonstrated → operations owned.",
    owners:
      "Platform + application, virtualization, security and operations teams",
    scope: "Initial workload readiness, acceptance and later operations",
    flow: [
      {
        title: "Enable the workload",
        detail:
          "Connect storage and networks, configure dependencies, and delegate access.",
      },
      {
        title: "Demonstrate readiness",
        detail:
          "Test the required workload, maintenance and recovery behavior.",
      },
      {
        title: "Hand over and operate",
        detail:
          "Transfer knowledge and sustain updates, content and configuration.",
      },
    ],
  },
  {
    id: "approach",
    parent: "pre-installation",
    phase: "pre-installation",
    title: "Choose the deployment approach",
    summary:
      "Match installer ownership and cluster shape to the customer’s constraints.",
    question: "Who will provision the hosts, and where will installation run?",
    outcome:
      "A supported cluster layout and installation method that meet application needs and site constraints, with clear responsibility for preparing infrastructure and booting hosts.",
    owners:
      "Platform architect and installation owner, with input from application owners and hardware, networking, storage, and security teams.",
    scope:
      "This decision covers installing OpenShift on bare metal. Available choices depend on the OpenShift version, cluster layout, connectivity, and access to host management. Each installation method automates different tasks and leaves specific infrastructure preparation to the customer.",
    flow: [
      {
        title: "Identify requirements and limits",
        detail:
          "Establish what the applications need, how much downtime is acceptable, and what hardware and network access the site provides.",
      },
      {
        title: "Choose the cluster layout",
        detail:
          "Decide how many machines the cluster needs and where its control plane and application workloads will run. Match the layout to available hardware, capacity needs, and availability requirements.",
      },
      {
        title: "Choose the installation method",
        detail:
          "Select a method that supports the planned layout and environment. Confirm which setup tasks it automates and which the customer must handle, including preparing infrastructure and booting hosts.",
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
    id: "hardware",
    parent: "pre-installation",
    phase: "pre-installation",
    title: "Hardware and storage feasibility",
    summary:
      "Confirm that the available servers and storage can support the planned cluster and its applications.",
    question: "Can the deployment actually fit the hardware and budget?",
    outcome:
      "A hardware and storage plan that meets OpenShift and application requirements, with any required purchases or design changes identified.",
    owners:
      "Platform architect, hardware and storage teams, and application owners. Involve networking and procurement teams when connectivity or purchases are needed.",
    scope:
      "Requirements depend on the OpenShift version, cluster layout, installation method, and intended workloads. Plan capacity for both OpenShift services and applications, and verify that the storage integration supports the required features.",
    flow: [
      {
        title: "Check hardware compatibility",
        detail:
          "Inventory the servers, processors, memory, disks, and network adapters. Check support for the selected OpenShift release and installation method, including firmware and boot requirements.",
      },
      {
        title: "Size the cluster and workloads",
        detail:
          "Account for OpenShift services, optional components, and application needs. Check CPU, memory, disk capacity, and disk performance, especially for the control plane.",
      },
      {
        title: "Confirm the storage design and address gaps",
        detail:
          "Plan the disks used to install OpenShift and the persistent storage applications need. Check storage integration, connectivity, and required features. Identify hardware purchases or design changes needed before installation.",
      },
    ],
  },
  {
    id: "networking",
    parent: "pre-installation",
    phase: "pre-installation",
    title: "Networking and shared services",
    summary:
      "Prepare the networks and shared services required by the selected installation method.",
    question: "Which connections and services must already work?",
    outcome:
      "The required networks, DNS, time services, and access paths are configured and verified for the selected installation method.",
    owners:
      "Network, DNS, IP address management, and security teams, together with the installation owner.",
    scope:
      "The installation method determines which network services the customer prepares and which the installer manages. Agree this division before configuring the site.",
    flow: [
      {
        title: "Define the network requirements",
        detail:
          "Identify host networks, DNS, time servers, and required service endpoints. Include load balancing where the installation method requires the customer to provide it.",
      },
      {
        title: "Assign the work",
        detail:
          "Agree who configures switches, routes, DNS, and access rules, and which settings belong in the installation configuration.",
      },
      {
        title: "Verify the paths",
        detail:
          "Verify connectivity, name resolution, certificate trust, and time-service access from the hosts and workstations that need them.",
      },
    ],
  },
  {
    id: "addressing",
    parent: "networking",
    phase: "pre-installation",
    title: "Addresses, VLANs and routes",
    summary:
      "Give each host a usable network identity and a path to its dependencies.",
    question: "How will the nodes reach one another and required services?",
    outcome:
      "Hosts have stable addresses and working routes, with compatible VLAN and MTU settings and no conflicting network ranges.",
    owners:
      "IP address management and network teams, with the installation owner.",
    scope:
      "Address allocation and host network configuration depend on the installer and network design. Check machine, pod, and service ranges against the existing site network.",
    flow: [
      {
        title: "Allocate addresses",
        detail:
          "Reserve host addresses and any required API and application virtual IPs. Check machine, pod, and service address ranges for conflicts with one another and the site network.",
      },
      {
        title: "Choose DHCP or static",
        detail:
          "Arrange stable DHCP assignments or static settings supplied through the selected installer. Include the required gateways and DNS servers.",
      },
      {
        title: "Match the physical network",
        detail:
          "Align host settings with switch ports, VLANs, MTU and return routes.",
      },
    ],
  },
  {
    id: "dns",
    parent: "networking",
    phase: "pre-installation",
    title: "DNS and cluster access",
    summary:
      "Prepare name resolution for cluster hosts, required services, and access to the cluster API and applications.",
    question: "Who needs to resolve which name, and when?",
    outcome:
      "Nodes, installation workstations, and users can resolve the required names and reach the corresponding services.",
    owners: "DNS owner, installation owner, and cluster administrator.",
    scope:
      "Required DNS records and when they must exist depend on the installation configuration. Agent-based installations using platform: none require the documented DNS records before installation.",
    flow: [
      {
        title: "Resolve dependencies",
        detail:
          "Hosts need usable resolution for the registry, mirror and site services they use.",
      },
      {
        title: "Resolve cluster endpoints",
        detail:
          "Configure the required records for the cluster API, application routes, and node names. Confirm which records must resolve from hosts and which must resolve from client networks.",
      },
      {
        title: "Verify client access",
        detail:
          "Check name resolution and network access for the API, web console, and authentication routes from the workstations that will use them.",
      },
    ],
  },
  {
    id: "managed-dns",
    parent: "dns",
    phase: "pre-installation",
    title: "Example: DNS for Agent-based bare metal",
    summary:
      "Identify the DNS requirements for a five-node Agent-based cluster and the workstations used to access it.",
    question:
      "Which names must resolve from the hosts and administrator’s workstation?",
    outcome:
      "The example identifies the names and addresses needed by cluster hosts and administrators, with DNS responsibilities agreed.",
    owners: "Installation owner and DNS team.",
    scope:
      "Example configuration: OCP 4.22 Agent-based Installer, platform: baremetal, managed networking, three control-plane nodes, and two workers. Confirm the DNS requirements for this configuration before installation.",
    flow: [
      {
        title: "Establish names and endpoint addresses",
        detail:
          "Record the cluster name, base domain, explicit node hostnames, API and application virtual IPs, and rendezvous address. Agree which DNS records the site team must provide.",
      },
      {
        title: "Check resolution from cluster hosts",
        detail:
          "Verify the names required by the installation configuration, including registries and site services. Check the DNS server and network path each host will use.",
      },
      {
        title: "Check administrator access",
        detail:
          "Verify API, console, and authentication name resolution from the administrator’s workstation. Confirm the corresponding services are reachable when they become available.",
      },
    ],
  },
  {
    id: "dns-consumers",
    parent: "dns",
    phase: "pre-installation",
    title: "Check DNS from each access point",
    summary:
      "The node, installation workstation and eventual user may use different resolvers and paths.",
    question: "Where should a DNS check run?",
    outcome:
      "DNS and connection checks succeed from the nodes, installation workstation, and intended user network.",
    owners: "DNS owner and platform team.",
    scope:
      "These three access points provide a practical troubleshooting model. Record the requested name, DNS server, returned address, and network path for each check.",
    flow: [
      {
        title: "Node → dependencies",
        detail:
          "Check the names and paths used for content and shared services.",
      },
      {
        title: "Installation workstation → API",
        detail:
          "Ensure the monitoring workstation resolves and reaches the cluster API.",
      },
      {
        title: "User → applications",
        detail:
          "Check API, ingress and authentication route resolution from the intended access network.",
      },
    ],
  },
  {
    id: "routing",
    parent: "networking",
    phase: "pre-installation",
    title: "Firewalls, trust and time",
    summary:
      "Make required traffic and shared services work across the actual security boundaries.",
    question: "Which source needs to reach which destination?",
    outcome:
      "Required connections work, hosts trust the certificates they encounter, and their clocks are synchronized.",
    owners:
      "Network and security teams, the installation owner, and the team responsible for time services.",
    scope:
      "Required traffic depends on the installation method and connectivity model. Account for both temporary installation services and connections needed by the running cluster.",
    flow: [
      {
        title: "Identify both ends",
        detail:
          "Describe source, destination, protocol, port, purpose and installation versus ongoing use.",
      },
      {
        title: "Configure proxies and certificate trust",
        detail:
          "Set proxy addresses and exclusions, provide required trusted certificates, and account for registry redirects. Verify access from the hosts that will use these services.",
      },
      {
        title: "Verify connections and clock synchronization",
        detail:
          "Test the required connections from cluster hosts as well as administration workstations. Configure reachable time servers and verify that the hosts’ clocks are synchronized.",
      },
    ],
  },
  {
    id: "management",
    parent: "networking",
    phase: "pre-installation",
    title: "Host management and boot access",
    summary:
      "Prepare the management access and media-delivery path needed to start each physical server.",
    question: "How will the prepared image reach each physical server?",
    outcome:
      "The installation team can use the selected boot mechanism, with working credentials, permissions, and access to the required media.",
    owners:
      "Hardware team and installation owner, with networking and security teams where access crosses controlled boundaries.",
    scope:
      "Installer-provisioned infrastructure requires access to each host’s baseboard management controller (BMC). Other workflows can use alternative boot mechanisms. A dedicated management network is a site-design choice.",
    flow: [
      {
        title: "Choose the boot path",
        detail:
          "Use a supported local, virtual-media or network-boot mechanism for the selected workflow.",
      },
      {
        title: "Prepare management access",
        detail:
          "For BMC-based booting, verify the controller’s address, credentials, permissions, and supported boot options. Check access to the media source required by the selected mechanism.",
      },
      {
        title: "Verify actual media delivery",
        detail:
          "Verify that the selected mechanism can mount or serve the intended image. Confirm media-source reachability and boot settings in addition to management login access.",
      },
    ],
  },
  {
    id: "content",
    parent: "pre-installation",
    phase: "pre-installation",
    title: "Content, configuration and media",
    summary:
      "Prepare the right inputs, images and tools for the customer’s connectivity model.",
    question: "Can every required artifact reach the place it will be used?",
    outcome:
      "Compatible tools, configuration, credentials, and installation images are available wherever the selected workflow needs them.",
    owners: "Installation owner, registry administrator, and security team.",
    scope:
      "Connected, proxied, mirrored, and supported self-contained workflows require different preparation. Confirm how the selected workflow obtains images and authenticates to their source.",
    flow: [
      {
        title: "Match the tools, configuration, and images",
        detail:
          "Match the OpenShift release, CPU architecture, installer tools, configuration, credentials, and required images to the selected installation method.",
      },
      {
        title: "Make images and tools accessible",
        detail:
          "Prepare permitted direct access, a proxy, a mirror registry, or a supported self-contained workflow. Verify registry authentication and certificate trust wherever images will be retrieved.",
      },
      {
        title: "Prepare the boot handoff",
        detail:
          "Prepare the boot assets required by the selected method. Agree where they will be stored, who will deliver them, and how each host will be started.",
      },
    ],
  },
  {
    id: "disconnected",
    parent: "content",
    phase: "pre-installation",
    title: "Disconnected preparation",
    summary:
      "Plan content movement and local usability across restricted environments.",
    question: "What must be available without online access?",
    outcome:
      "The site can obtain all required installation content locally, with a defined process for adding workloads and receiving updates.",
    owners:
      "Registry or content administrator, security team, and local installation operator.",
    scope:
      "An ordinary Agent ISO does not contain all required installation images. Installation without an external registry is a specific documented workflow; confirm its supported configurations and included content before choosing it.",
    flow: [
      {
        title: "Map the boundaries",
        detail:
          "Describe isolated zones, permitted transfers, approval steps and local endpoints.",
      },
      {
        title: "Prepare complete content",
        detail:
          "Prepare the release images, required Operators, workload images, and supporting tools. After transfer, verify local image access, credentials, certificate trust, and tool availability.",
      },
      {
        title: "Plan continuity",
        detail:
          "Keep instructions available offline and agree how additional workloads and future updates will be transferred, approved, and made available at the site.",
      },
    ],
  },
  {
    id: "media",
    parent: "content",
    phase: "pre-installation",
    title: "Prepare and deliver boot media",
    summary:
      "Prepare the boot assets and configuration each host needs, then arrange delivery and boot instructions.",
    question:
      "Are the correct boot assets ready for each host, and who will start it?",
    outcome:
      "The correct boot assets and configuration are ready for the intended hosts, with clear instructions and responsibility for starting them.",
    owners: "Installation owner and hardware owner.",
    scope:
      "Assisted and Agent-based workflows use discovery media. User-provisioned infrastructure uses installation media and Ignition configuration, while installer-provisioned infrastructure automates host provisioning. Actual host booting is covered in the next installation stage.",
    flow: [
      {
        title: "Preserve configuration and protect credentials",
        detail:
          "Retain the reviewed site configuration for troubleshooting or regeneration. Protect pull secrets, access credentials, and boot assets that contain sensitive configuration.",
      },
      {
        title: "Prepare the selected boot assets",
        detail:
          "Generate or obtain the ISO, network boot files, and host configuration required by the selected method. Confirm the release, architecture, and intended hosts, and resolve preparation errors.",
      },
      {
        title: "Confirm delivery and boot instructions",
        detail:
          "Arrange how the assets will be mounted or served to each host. Identify the hosts and intended installation disks, and agree who will start them and check their progress.",
      },
    ],
  },
  {
    id: "handoffs",
    parent: "pre-installation",
    phase: "pre-installation",
    title: "Owners and prerequisite readiness",
    summary: "Make cross-team work visible, specific and verifiable.",
    question:
      "Who can complete each dependency, and how will we know it is ready?",
    outcome:
      "Technical checks, approvals and remaining owner actions are distinguishable.",
    owners: "Installation owner + infrastructure and security owners",
    scope: "Bare-metal journey · method and workload dependent",
    flow: [
      {
        title: "Identify the owner",
        detail:
          "Name who can allocate addresses, change switches, supply storage or approve access.",
      },
      {
        title: "Make a precise request",
        detail:
          "Provide the inputs, purpose, expected result and how it will be checked.",
      },
      {
        title: "Verify and record",
        detail:
          "Record actual check results separately from assurances or pending approvals.",
      },
    ],
  },
  {
    id: "hosts",
    parent: "installation",
    phase: "installation",
    title: "Install the hosts",
    summary:
      "Follow the transition from prepared media to the installed operating system.",
    question: "Are the expected hosts installing onto the intended disks?",
    outcome:
      "Expected hosts are installed and reboot into the intended system.",
    owners: "Installation owner + host provisioning mechanism",
    scope: "Bare-metal journey · method and workload dependent",
    flow: [
      {
        title: "Confirm identity and readiness",
        detail:
          "Discovery and readiness checks precede core installation; exact start behavior varies by method.",
      },
      {
        title: "Write the system",
        detail:
          "The selected path applies the operating system and initial configuration to the intended disks.",
      },
      {
        title: "Reboot into the installed system",
        detail:
          "Check boot overrides and media so hosts do not return to the installation environment.",
      },
    ],
  },
  {
    id: "bootstrap",
    parent: "installation",
    phase: "installation",
    title: "Bootstrap and control-plane handoff",
    summary:
      "Understand how a temporary installation environment brings up the lasting control plane.",
    question: "What is running now, and what should take over next?",
    outcome: "The permanent control plane can sustain the running cluster.",
    owners: "Installer services + installation owner",
    scope:
      "Method-dependent · bootstrap architecture differs across installer families",
    flow: [
      {
        title: "Start the temporary services",
        detail:
          "The location depends on the method: a separate bootstrap machine or an installation host.",
      },
      {
        title: "Bring up the control plane",
        detail:
          "Hosts and services establish the cluster and its core configuration.",
      },
      {
        title: "Complete the transition",
        detail:
          "Retire temporary resources where required, then continue cluster initialization checks.",
      },
    ],
  },
  {
    id: "progress",
    parent: "installation",
    phase: "installation",
    title: "Progress and diagnosis",
    summary: "Connect visible installation state to a useful next action.",
    question: "Should we wait, investigate, or intervene?",
    outcome:
      "The operator understands the current phase, affected host and available evidence.",
    owners: "Installation owner + support when needed",
    scope: "Bare-metal journey · method and workload dependent",
    flow: [
      {
        title: "Locate the phase",
        detail:
          "Identify the current host or cluster stage and last observed progress.",
      },
      {
        title: "Interpret the evidence",
        detail:
          "Separate normal transitions, quiet periods, failed checks and monitoring errors.",
      },
      {
        title: "Choose the next action",
        detail:
          "Use diagnostics appropriate to the live installation environment or the running cluster.",
      },
    ],
  },
  {
    id: "recovery",
    parent: "installation",
    phase: "installation",
    title: "Correct and retry",
    summary:
      "Reduce avoidable repetition while preserving the evidence needed to diagnose the attempt.",
    question: "What can be corrected, and what must be repeated?",
    outcome:
      "The next action follows the failure and preserves relevant inputs and diagnostics.",
    owners: "Installation owner + affected infrastructure owner",
    scope:
      "CLI example · Agent-based 4.22; recovery steps depend on the failure",
    flow: [
      {
        title: "Preserve the evidence",
        detail:
          "Capture the failed stage, logs, configuration context and affected endpoint or host.",
      },
      {
        title: "Distinguish monitoring from installation",
        detail:
          "A wait timeout alone does not establish that installation stopped; inspect the reason.",
      },
      {
        title: "Plan the correction",
        detail:
          "Rerunning a wait differs from a new installation. Changed media inputs need regenerated artifacts and a planned new attempt.",
      },
    ],
  },
  {
    id: "completion",
    parent: "installation",
    phase: "installation",
    title: "Verify the base cluster",
    summary:
      "Establish the installation milestone and a clear handoff to remaining work.",
    question: "What does “installed” establish?",
    outcome:
      "Installation completion, expected hosts, core services and access are checked.",
    owners: "Installation owner + receiving platform team",
    scope: "Bare-metal journey · method and workload dependent",
    flow: [
      {
        title: "Check completion",
        detail:
          "Use the selected installer’s completion signal and inspect failures.",
      },
      {
        title: "Check the expected cluster",
        detail:
          "Verify node readiness, cluster version and Operator health against the intended handoff state.",
      },
      {
        title: "Transfer access and remaining work",
        detail:
          "Securely hand over access and identify the workload configuration and acceptance work still ahead.",
      },
    ],
  },
  {
    id: "storage",
    parent: "post-installation",
    phase: "post-installation",
    title: "Enable workload storage",
    summary:
      "Connect available storage to the behavior the customer needs from a workload.",
    question: "Can the intended workload actually use its storage?",
    outcome:
      "A representative workload demonstrates the required storage behavior.",
    owners: "Storage owner + platform and workload teams",
    scope: "Bare-metal journey · method and workload dependent",
    flow: [
      {
        title: "Connect the storage",
        detail:
          "Verify physical connectivity and the suitability of the selected integration.",
      },
      {
        title: "Configure the integration",
        detail:
          "Set up the applicable driver, storage class and workload-specific configuration.",
      },
      {
        title: "Demonstrate the behavior",
        detail:
          "Test provisioning, persistence and any required migration or maintenance behavior.",
      },
    ],
  },
  {
    id: "physical-storage",
    parent: "storage",
    phase: "post-installation",
    title: "Physical storage connectivity",
    summary:
      "Check the path between the running cluster and the storage it is expected to use.",
    question: "Can the hosts reach the intended storage system?",
    outcome:
      "Physical links and the selected storage integration are available and compatible.",
    owners: "Storage + network + hardware owners",
    scope: "Bare-metal journey · method and workload dependent",
    flow: [
      {
        title: "Identify the storage path",
        detail:
          "Clarify whether the design uses local disks, an existing array or another supported service.",
      },
      {
        title: "Check the physical connection",
        detail:
          "Verify adapters, links and reachability from the appropriate hosts.",
      },
      {
        title: "Verify integration fit",
        detail:
          "Check provider, release and intended workload support before treating availability as readiness.",
      },
    ],
  },
  {
    id: "storage-drivers",
    parent: "storage",
    phase: "post-installation",
    title: "Drivers, classes and profiles",
    summary:
      "Translate the selected storage system into resources that workloads can consume.",
    question: "What configuration is still missing after installation?",
    outcome:
      "The workload can obtain the intended storage using a supported configuration.",
    owners: "Storage owner + platform administrator",
    scope: "Bare-metal journey · method and workload dependent",
    flow: [
      {
        title: "Install the applicable integration",
        detail:
          "Choose the provider-supported driver and prerequisites for the selected release.",
      },
      {
        title: "Configure consumption",
        detail:
          "Provide the applicable storage class, defaults and workload-specific profiles.",
      },
      {
        title: "Try the intended workload",
        detail: "Provision and use a volume from the actual workload context.",
      },
    ],
  },
  {
    id: "storage-behavior",
    parent: "storage",
    phase: "post-installation",
    title: "Validate workload behavior",
    summary:
      "A provisioned volume is one step toward the customer’s required outcome.",
    question:
      "Will the required operation work with this storage configuration?",
    outcome:
      "Required persistence, migration or maintenance behavior is demonstrated.",
    owners: "Workload owner + storage and platform teams",
    scope: "Bare-metal journey · method and workload dependent",
    flow: [
      {
        title: "Name the operation",
        detail:
          "Identify the required behavior: boot, persist, migrate or continue during maintenance.",
      },
      {
        title: "Check the supported combination",
        detail:
          "Match provider, storage mode, profile and workload requirements.",
      },
      {
        title: "Demonstrate and record",
        detail:
          "Use a representative workload and retain results and remaining limits.",
      },
    ],
  },
  {
    id: "workload-network",
    parent: "post-installation",
    phase: "post-installation",
    title: "Connect workload networks",
    summary:
      "Connect the intended workload to existing networks through the appropriate cluster configuration.",
    question: "Can this workload reach the network it needs?",
    outcome: "Connectivity works from the intended workload and project.",
    owners: "Network owner + platform and workload teams",
    scope: "Bare-metal journey · method and workload dependent",
    flow: [
      {
        title: "Describe the connection",
        detail:
          "Begin with the existing network and the reachability the application or VM needs.",
      },
      {
        title: "Map the layers",
        detail:
          "Relate physical interfaces and VLANs to applicable cluster configuration and workload attachments.",
      },
      {
        title: "Check in context",
        detail:
          "Verify the selected attachment, project access and end-to-end traffic.",
      },
    ],
  },
  {
    id: "access",
    parent: "post-installation",
    phase: "post-installation",
    title: "Identity, access and security",
    summary:
      "Make required actions possible for the receiving team within the intended boundaries.",
    question: "Can the actual user perform the intended task?",
    outcome:
      "Identity, permissions and policies work for the intended workload and tenant.",
    owners: "Identity/security owner + platform and application teams",
    scope: "Bare-metal journey · method and workload dependent",
    flow: [
      {
        title: "Connect identity",
        detail:
          "Establish the chosen identity integration and group-to-role mapping.",
      },
      {
        title: "Scope the permissions",
        detail:
          "Match roles and bindings to the required action and namespace or cluster.",
      },
      {
        title: "Rehearse as the user",
        detail:
          "Check the real task, effective access and applicable workload policies.",
      },
    ],
  },
  {
    id: "workloads",
    parent: "post-installation",
    phase: "post-installation",
    title: "Reach the first useful workload",
    summary:
      "Complete the dependencies and configuration needed for the customer’s intended job.",
    question:
      "What still stands between the installed cluster and useful work?",
    outcome:
      "The intended container, VM or other selected workload performs its representative task.",
    owners: "Platform + application or virtualization team",
    scope: "Bare-metal journey · method and workload dependent",
    flow: [
      {
        title: "Identify dependencies",
        detail:
          "Work back from the intended outcome to the necessary components and integrations.",
      },
      {
        title: "Configure the whole path",
        detail:
          "Connect storage, networking, access, capacity and application-specific setup.",
      },
      {
        title: "Use the workload",
        detail:
          "Demonstrate the real task and distinguish component installation from usable behavior.",
      },
    ],
  },
  {
    id: "acceptance",
    parent: "post-installation",
    phase: "post-installation",
    title: "Demonstrate readiness and hand over",
    summary:
      "Turn expectations about operations into customer-specific checks and ownership.",
    question:
      "What must be demonstrated before this team can rely on the platform?",
    outcome:
      "Required behavior is demonstrated, remaining limits are known, and an owner accepts the handoff.",
    owners:
      "Receiving operations team + platform, workload and security owners",
    scope: "Bare-metal journey · method and workload dependent",
    flow: [
      {
        title: "Agree acceptance conditions",
        detail:
          "Define workload behavior, maintenance, recovery, access and continuity requirements.",
      },
      {
        title: "Rehearse representative events",
        detail:
          "Test selected scenarios in an appropriate environment and record what remains unproven.",
      },
      {
        title: "Transfer the operating knowledge",
        detail:
          "Hand over procedures, access, support routes, configuration and responsibilities.",
      },
    ],
  },
  {
    id: "operations",
    parent: "post-installation",
    phase: "post-installation",
    title: "Sustain the environment",
    summary:
      "Keep the delivered platform usable as versions, content, workloads and people change.",
    question: "Can the team maintain and recreate what it now depends on?",
    outcome:
      "Ongoing ownership covers updates, configuration, diagnostics and recovery.",
    owners: "Operations + platform and component owners",
    scope: "Later operations · connected to initial design and handover",
    flow: [
      {
        title: "Retain the deployment knowledge",
        detail:
          "Maintain reviewed configuration, ownership and secure references to required credentials.",
      },
      {
        title: "Manage change as a whole",
        detail:
          "Consider networking, storage, Operators and content alongside core cluster updates.",
      },
      {
        title: "Maintain operational confidence",
        detail:
          "Keep recovery procedures, support access and team knowledge current.",
      },
    ],
  },
  {
    id: "upgrades",
    parent: "operations",
    phase: "post-installation",
    title: "Updates and content continuity",
    summary:
      "Account for add-on compatibility and artifact delivery as the environment changes.",
    question: "Will the whole deployment still work after the next change?",
    outcome:
      "A tested update plan covers core software, integrations and required content.",
    owners: "Platform + storage/network/Operator and content owners",
    scope: "Bare-metal journey · method and workload dependent",
    flow: [
      {
        title: "Identify the dependency set",
        detail:
          "Inventory the core release, additional Operators and site integrations.",
      },
      {
        title: "Prepare and validate changes",
        detail:
          "Check compatibility and test the representative workload path.",
      },
      {
        title: "Deliver through site boundaries",
        detail:
          "Refresh and promote required content through the customer’s permitted channels.",
      },
    ],
  },
  {
    id: "backups",
    parent: "operations",
    phase: "post-installation",
    title: "Recovery and reconstruction",
    summary:
      "Include workload data, configuration and secrets in the recovery plan.",
    question: "What would it take to restore the intended service?",
    outcome:
      "A tested recovery path covers the required service and its dependencies.",
    owners: "Operations + workload, storage and security owners",
    scope: "Bare-metal journey · method and workload dependent",
    flow: [
      {
        title: "Define what must recover",
        detail:
          "Agree the service, data, configuration and continuity requirements.",
      },
      {
        title: "Include the dependencies",
        detail:
          "Account for external storage, credentials, retained configuration and access.",
      },
      {
        title: "Exercise the plan",
        detail:
          "Demonstrate the selected restore or reconstruction scenario and record limits.",
      },
    ],
  },
];
