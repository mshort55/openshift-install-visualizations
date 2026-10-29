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
      "An approach fits the available hardware, connectivity and ownership model.",
    owners: "Platform architect + installation owner",
    scope: "Bare-metal journey · method and workload dependent",
    flow: [
      {
        title: "Start with constraints",
        detail:
          "Identify connectivity, host control, availability and workload requirements.",
      },
      {
        title: "Choose the cluster shape",
        detail:
          "Single-node, compact, standard and hosted control planes change the design.",
      },
      {
        title: "Choose provisioning ownership",
        detail:
          "Separate the installer family from automation layers such as CIM or GitOps.",
      },
    ],
    related: ["hardware", "content"],
  },
  {
    id: "assisted",
    parent: "approach",
    phase: "pre-installation",
    title: "Hosted Assisted Installer",
    summary:
      "A hosted UI or API coordinates discovery, validation and host installation.",
    question: "How does this installation path divide the work?",
    outcome:
      "The customer can explain what the installer does and what the site must supply.",
    owners: "Installation owner + hosted Assisted service",
    scope: "Technical reference · supplied OCP 4.22 baseline",
    flow: [
      {
        title: "Prepare and discover",
        detail:
          "Configure the cluster, generate media, and boot hosts so they can reach the hosted service.",
      },
      {
        title: "Validate and start",
        detail:
          "Resolve host and cluster validations, assign roles and disks, then start installation.",
      },
      {
        title: "Follow completion",
        detail:
          "One control-plane host provides bootstrap; the service tracks the installation.",
      },
    ],
    related: ["hosts", "bootstrap"],
  },
  {
    id: "agent-based",
    parent: "approach",
    phase: "pre-installation",
    title: "Local Agent-based Installer",
    summary:
      "Generate boot media locally; installation coordination runs on a rendezvous host.",
    question: "How does this installation path divide the work?",
    outcome:
      "The customer can explain what the installer does and what the site must supply.",
    owners: "Installation owner + local rendezvous host",
    scope: "Technical reference · supplied OCP 4.22 baseline",
    flow: [
      {
        title: "Describe the site",
        detail:
          "Prepare install-config and agent-config with the selected release and site inputs.",
      },
      {
        title: "Generate and boot media",
        detail:
          "Deliver the ISO or PXE artifacts and boot the required hosts, including rendezvous.",
      },
      {
        title: "Validate and install",
        detail:
          "The local service starts installation when required hosts and validations are ready.",
      },
    ],
    related: ["hosts", "bootstrap"],
  },
  {
    id: "ipi",
    parent: "approach",
    phase: "pre-installation",
    title: "Installer-provisioned infrastructure",
    summary:
      "The installer automates host provisioning through supported management interfaces.",
    question: "How does this installation path divide the work?",
    outcome:
      "The customer can explain what the installer does and what the site must supply.",
    owners: "Installation owner + installer / Metal3 / Ironic",
    scope: "Technical reference · supplied OCP 4.22 baseline",
    flow: [
      {
        title: "Provide the foundation",
        detail:
          "Prepare hosts, BMC access, site networking and a place for bootstrap infrastructure.",
      },
      {
        title: "Provision through the installer",
        detail:
          "The installer coordinates the temporary bootstrap environment and physical host installation.",
      },
      {
        title: "Continue host management",
        detail:
          "The running cluster can manage hosts through its bare-metal and Machine API integration.",
      },
    ],
    related: ["hosts", "bootstrap"],
  },
  {
    id: "upi",
    parent: "approach",
    phase: "pre-installation",
    title: "User-provisioned infrastructure",
    summary:
      "The customer owns host provisioning and supplies the infrastructure the cluster needs.",
    question: "How does this installation path divide the work?",
    outcome:
      "The customer can explain what the installer does and what the site must supply.",
    owners: "Customer provisioning and platform teams",
    scope: "Technical reference · supplied OCP 4.22 baseline",
    flow: [
      {
        title: "Supply infrastructure",
        detail:
          "Prepare hosts, boot delivery, DNS, API/ingress load balancing and a temporary bootstrap machine.",
      },
      {
        title: "Deliver installer assets",
        detail:
          "Generate and deliver the configuration as hosts boot and install.",
      },
      {
        title: "Complete the handoff",
        detail:
          "Monitor bootstrap, retire temporary resources as documented, and verify completion.",
      },
    ],
    related: ["hosts", "bootstrap"],
  },
  {
    id: "hardware",
    parent: "pre-installation",
    phase: "pre-installation",
    title: "Hardware and storage feasibility",
    summary:
      "Check whether available servers, capacity and storage can support the intended outcome.",
    question: "Can the deployment actually fit the hardware and budget?",
    outcome:
      "A feasible host and storage plan includes workload and platform overhead.",
    owners: "Hardware owner + storage team + platform architect",
    scope: "Bare-metal journey · method and workload dependent",
    flow: [
      {
        title: "Inventory what exists",
        detail:
          "Record servers, disks, interfaces, firmware and physical storage connections.",
      },
      {
        title: "Size the whole outcome",
        detail:
          "Account for platform, management, storage and intended workloads.",
      },
      {
        title: "Resolve gaps early",
        detail:
          "Separate missing components, unsupported combinations, procurement and funding.",
      },
    ],
    related: ["physical-storage", "workloads"],
  },
  {
    id: "networking",
    parent: "pre-installation",
    phase: "pre-installation",
    title: "Networking and shared services",
    summary:
      "Translate the existing site network into clear cluster prerequisites.",
    question: "Which connections and services must already work?",
    outcome:
      "Addresses, paths and shared services are usable for the chosen method.",
    owners: "Network, DNS/IPAM and security owners + installation owner",
    scope: "Bare-metal journey · method and workload dependent",
    flow: [
      {
        title: "Describe the site",
        detail:
          "Agree machine addresses, networks, identity and required service endpoints.",
      },
      {
        title: "Assign the work",
        detail:
          "Separate physical network changes from cluster-managed configuration.",
      },
      {
        title: "Verify the paths",
        detail:
          "Check reachability, name resolution, trust and time from the relevant hosts.",
      },
    ],
    related: ["workload-network", "progress", "handoffs"],
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
      "The selected addresses, VLANs, MTU and routes work together without conflicts.",
    owners: "IPAM + network team + installation owner",
    scope: "Example baseline · Agent-based managed bare metal, OCP 4.22",
    flow: [
      {
        title: "Allocate addresses",
        detail:
          "Reserve node IPs and any required virtual IPs; review overlapping address ranges.",
      },
      {
        title: "Choose DHCP or static",
        detail:
          "Stable DHCP configuration and embedded static configuration have different dependencies.",
      },
      {
        title: "Match the physical network",
        detail:
          "Align host settings with switch ports, VLANs, MTU and return routes.",
      },
    ],
    related: ["workload-network", "handoffs"],
  },
  {
    id: "dns",
    parent: "networking",
    phase: "pre-installation",
    title: "DNS and cluster access",
    summary:
      "Distinguish node resolution, external service names and client access to the cluster.",
    question: "Who needs to resolve which name, and when?",
    outcome:
      "Each consumer resolves the names it needs and can reach the returned address.",
    owners: "DNS owner + installation owner + administrator",
    scope: "Bare-metal journey · method and workload dependent",
    flow: [
      {
        title: "Resolve dependencies",
        detail:
          "Hosts need usable resolution for the registry, mirror and site services they use.",
      },
      {
        title: "Resolve cluster endpoints",
        detail:
          "Internal and external consumers can have different DNS arrangements.",
      },
      {
        title: "Verify client access",
        detail:
          "API and browser access require resolution and reachability from the actual client.",
      },
    ],
    related: ["handoffs", "completion"],
  },
  {
    id: "managed-dns",
    parent: "dns",
    phase: "pre-installation",
    title: "Example: managed DNS and client access",
    summary:
      "Follow a five-node Agent-based example where external cluster records can be published later.",
    question: "What can proceed while the corporate DNS ticket is pending?",
    outcome:
      "The nodes can install; external API and browser access are separately arranged.",
    owners: "Installation owner + DNS team",
    scope:
      "Scoped example · OCP 4.22 Agent, platform: baremetal, managed networking; source-reviewed, not deployment-tested",
    flow: [
      {
        title: "Set the permanent identity",
        detail:
          "Provide the cluster domain, explicit node hostnames, API/ingress VIPs and rendezvous IP.",
      },
      {
        title: "Keep upstream resolution working",
        detail:
          "Managed host resolution covers this cluster’s internal needs; registry and site-service resolution still matters.",
      },
      {
        title: "Arrange client resolution",
        detail:
          "A local API hosts entry can help one workstation. Console/OAuth routes need appropriate DNS or exact mappings; hosts files have no wildcard support.",
      },
    ],
    related: ["addressing", "completion"],
  },
  {
    id: "dns-consumers",
    parent: "dns",
    phase: "pre-installation",
    title: "The three DNS consumers",
    summary:
      "The node, installation workstation and eventual user may use different resolvers and paths.",
    question: "Where should a DNS check run?",
    outcome:
      "Checks identify the consumer, requested name, resolver and destination.",
    owners: "DNS owner + platform team",
    scope: "Bare-metal journey · method and workload dependent",
    flow: [
      {
        title: "Node → dependencies",
        detail:
          "Check the names and paths used for content and shared services.",
      },
      {
        title: "Installer → API",
        detail:
          "Ensure the monitoring workstation resolves and reaches the cluster API.",
      },
      {
        title: "User → applications",
        detail:
          "Check API, ingress and authentication route resolution from the intended access network.",
      },
    ],
    related: ["completion", "access"],
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
      "Required flows, certificate trust and time sources are available.",
    owners: "Network and security teams",
    scope: "Bare-metal journey · method and workload dependent",
    flow: [
      {
        title: "Identify both ends",
        detail:
          "Describe source, destination, protocol, port, purpose and installation versus ongoing use.",
      },
      {
        title: "Account for intermediaries",
        detail:
          "Include proxy settings, no-proxy rules, certificate trust and any registry redirects.",
      },
      {
        title: "Check at the consumer",
        detail:
          "A reachable service from an admin laptop does not prove the nodes can reach it.",
      },
    ],
    related: ["content", "progress"],
  },
  {
    id: "management",
    parent: "networking",
    phase: "pre-installation",
    title: "Host management and boot access",
    summary:
      "Separate out-of-band management from the node’s operating network.",
    question: "How will the prepared image reach each physical server?",
    outcome:
      "The selected boot path works and its credentials and ownership are clear.",
    owners: "Hardware team + installation owner",
    scope: "Bare-metal journey · method and workload dependent",
    flow: [
      {
        title: "Choose the boot path",
        detail:
          "Use a supported local, virtual-media or network-boot mechanism for the selected workflow.",
      },
      {
        title: "Prepare management access",
        detail:
          "BMC virtual media needs independent addressing, permissions and access to its media source.",
      },
      {
        title: "Verify actual media delivery",
        detail:
          "Reaching the BMC login alone does not establish that it can fetch and boot the image.",
      },
    ],
    related: ["media", "hosts"],
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
      "The release, configuration, boot assets and required access paths are ready.",
    owners: "Installation owner + content and security teams",
    scope: "Bare-metal journey · method and workload dependent",
    flow: [
      {
        title: "Select a compatible set",
        detail:
          "Align release, architecture, installation inputs and required content.",
      },
      {
        title: "Make artifacts available",
        detail:
          "Use permitted direct access, proxies, mirrors or a documented self-contained path.",
      },
      {
        title: "Prepare the boot handoff",
        detail:
          "Generate the right media and confirm delivery, trust and boot instructions.",
      },
    ],
    related: ["upgrades", "management"],
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
      "Approved content and usable local tools cover the selected installation outcome.",
    owners: "Content owner + security team + local installation operator",
    scope:
      "Connectivity variant · standard mirror and documented self-contained paths differ",
    flow: [
      {
        title: "Map the boundaries",
        detail:
          "Describe isolated zones, permitted transfers, approval steps and local endpoints.",
      },
      {
        title: "Prepare complete content",
        detail:
          "Distinguish base release content from Operators, workload images and supporting tools.",
      },
      {
        title: "Plan continuity",
        detail:
          "Retain usable instructions and define how future updates will reach the site.",
      },
    ],
    related: ["upgrades", "handoffs"],
  },
  {
    id: "media",
    parent: "content",
    phase: "pre-installation",
    title: "Generate, deliver and boot media",
    summary:
      "Turn reviewed installation inputs into artifacts the physical hosts can actually boot.",
    question: "What must happen after the image is generated?",
    outcome:
      "The intended hosts boot the correct media and are identifiable during discovery.",
    owners: "Installation owner + hardware owner",
    scope: "Bare-metal journey · method and workload dependent",
    flow: [
      {
        title: "Preserve the inputs",
        detail:
          "Retain reviewed site configuration and protect generated credentials.",
      },
      {
        title: "Generate one boot path",
        detail:
          "Use the selected ISO or PXE workflow and address generation errors.",
      },
      {
        title: "Deliver and discover",
        detail:
          "Mount or serve the artifacts, boot the hosts, and verify their identities and disks.",
      },
    ],
    related: ["management", "hosts"],
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
    related: ["progress", "acceptance"],
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
    related: ["media", "bootstrap"],
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
    related: ["progress", "completion"],
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
    related: ["handoffs", "recovery", "routing"],
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
    related: ["progress", "media"],
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
    related: ["workloads", "dns-consumers", "acceptance"],
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
    related: ["hardware", "acceptance"],
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
    related: ["hardware", "storage-drivers"],
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
    related: ["storage-behavior", "workloads"],
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
    related: ["acceptance", "backups"],
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
    related: ["networking", "access", "upgrades"],
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
    related: ["workloads", "acceptance"],
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
    related: ["storage", "workload-network", "access"],
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
    related: ["backups", "operations", "handoffs"],
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
    related: ["acceptance", "content"],
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
    related: ["disconnected", "workload-network", "storage"],
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
    related: ["acceptance", "storage-behavior"],
  },
];
