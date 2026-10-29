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
      "OCP 4.22 Agent-based installation on bare metal. The main path uses the local CLI and generated boot media; supported variations open within the relevant step.",
    flow: [
      {
        title: "Prepare the deployment",
        detail:
          "Agree the workload, prepare infrastructure and configuration, and arrange how the hosts will boot.",
      },
      {
        title: "Install with the local service",
        detail:
          "Boot the Agent media. A service on one control-plane host validates the hosts and coordinates installation.",
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
      "Ready to begin: inputs, infrastructure, access and owners are established.",
    owners: "Platform team + network, storage, security and hardware owners",
    scope:
      "Prepare infrastructure, configuration, images, and boot access. Host discovery begins after the machines boot.",
    flow: [
      {
        title: "Plan the deployment",
        detail:
          "Choose a supported cluster layout and confirm the hardware and storage fit the intended workload.",
      },
      {
        title: "Prepare infrastructure and inputs",
        detail:
          "Configure site services, make images accessible, and prepare cluster and host configuration.",
      },
      {
        title: "Confirm readiness before booting",
        detail:
          "Review host identities, installation disks, access, and ownership before starting the hosts.",
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
    scope:
      "Standard Agent CLI workflow: boot media, local validation and installation, bootstrap, and cluster verification.",
    flow: [
      {
        title: "Boot and validate hosts",
        detail:
          "Hosts boot the Agent media and register with the local installation service. Installation starts once the required hosts pass validation.",
      },
      {
        title: "Establish the control plane",
        detail:
          "The rendezvous host temporarily provides bootstrap services, then reboots and joins the cluster.",
      },
      {
        title: "Verify completion",
        detail:
          "Check installation completion, expected nodes, cluster health, and access.",
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
    scope:
      "Workload enablement and operations after installation. Storage, networking, identity, and application requirements determine the remaining work.",
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
    title: "Plan the deployment",
    summary:
      "Match the cluster layout, site preparation, and boot process to the customer’s requirements.",
    question: "What must this site prepare for installation?",
    outcome:
      "A supported deployment with a suitable cluster layout, accessible installation content, and clear ownership of configuration and host booting.",
    owners:
      "Platform architect and installation owner, with input from application owners and hardware, networking, storage, and security teams.",
    scope:
      "The main journey follows the standard local Agent CLI workflow on bare metal. Installation-method comparisons provide optional orientation; they do not change the timeline’s installation path.",
    flow: [
      {
        title: "Identify requirements and limits",
        detail:
          "Establish application needs, availability requirements, connectivity, and access to the physical servers.",
      },
      {
        title: "Choose a supported cluster layout",
        detail:
          "Examples include a single node running everything, three nodes sharing control-plane and application work, or separate control-plane and worker nodes. Match a supported layout to available hardware, availability needs, and workload capacity.",
      },
      {
        title: "Plan configuration and host booting",
        detail:
          "Agree who prepares the cluster and host settings, makes images accessible, and boots the servers. Choose a supported ISO or network-boot workflow.",
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
      "Check OCP 4.22 Agent-based requirements for the selected architecture and cluster layout, plus the capacity and integrations required by workloads.",
    flow: [
      {
        title: "Check hardware compatibility",
        detail:
          "Inventory servers, processors, memory, disks, network adapters, and firmware. Check support for the selected release and identify the interfaces and disks that installation will use.",
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
      "Prepare the network paths and shared services needed for installation.",
    question: "Which connections and services must already work?",
    outcome:
      "Hosts can reach one another, the rendezvous service, required images, DNS, and time servers, with cluster endpoint networking planned.",
    owners:
      "Network, DNS, IP address management, and security teams, together with the installation owner.",
    scope:
      "Agent installations using platform: baremetal can use managed cluster endpoints. With platform: none, the customer provides DNS and load balancing.",
    flow: [
      {
        title: "Define the network paths",
        detail:
          "Identify host networks, the rendezvous host, image sources, DNS, time servers, and access from the installation workstation.",
      },
      {
        title: "Prepare site services and endpoint networking",
        detail:
          "Assign switch, route, DNS, firewall, and address changes to their owners. Record the API and application endpoint settings for the chosen platform configuration.",
      },
      {
        title: "Verify access before booting",
        detail:
          "Check the available paths, name resolution, trust, and time services. Verify rendezvous-service connectivity when hosts boot.",
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
      "Pod and service ranges are internal to OpenShift. Check all network ranges for overlap. Hosts can use DHCP or static addresses.",
    flow: [
      {
        title: "Agree the network plan",
        detail:
          "Work with the network/IPAM team to confirm host subnets, VLANs, gateways, DNS, and routing. Reserve required cluster virtual IPs and check that host and cluster network ranges don’t overlap.",
      },
      {
        title: "Choose how nodes get IP addresses",
        detail:
          "Arrange DHCP reservations for stable addresses, or allocate static addresses to configure in agent-config.yaml.",
      },
      {
        title: "Prepare the network and configure hosts",
        detail:
          "The network team prepares switches and upstream connectivity. The installation owner supplies host settings that match, including interfaces, VLANs, gateways, and DNS.",
      },
    ],
  },
  {
    id: "dns",
    parent: "networking",
    phase: "pre-installation",
    title: "DNS and cluster access",
    summary:
      "Prepare name resolution for installation and access to the finished cluster.",
    question:
      "Which DNS settings are needed before installation, and which can be completed later?",
    outcome:
      "Installation dependencies resolve, and cluster access works before handover.",
    owners: "DNS team, installation owner, and cluster administrator.",
    scope:
      "External DNS deferral applies to cluster-managed networking. With platform: none, prepare the required external records before installation. External access typically uses api.<cluster>.<domain> and *.apps.<cluster>.<domain>.",
    flow: [
      {
        title: "Define names and prepare host DNS",
        detail:
          "Agree the cluster name, base domain, and endpoint addresses. Configure the DNS servers hosts will use to resolve installation dependencies.",
      },
      {
        title: "Plan external DNS timing",
        detail:
          "With cluster-managed networking, prepare external API and application records before installation or complete them afterward. Assign an owner for deferred work so it is ready before user access is needed.",
      },
      {
        title: "Verify access as services become available",
        detail:
          "The monitoring workstation must resolve and reach the cluster API. Before handover, verify API, console, and application access from the user network.",
      },
    ],
  },
  {
    id: "routing",
    parent: "networking",
    phase: "pre-installation",
    title: "Firewall, proxy, and time",
    summary:
      "Prepare network access, any required proxy settings, and time services before booting hosts.",
    question: "Which source needs to reach which destination?",
    outcome:
      "Network access, proxy and certificate settings where needed, and time sources are prepared.",
    owners:
      "Network and security teams, the installation owner, and the team responsible for time services.",
    scope:
      "Existing network rules may already permit the required traffic. Agent installation also needs TCP 8090 from installation hosts to the rendezvous host during discovery and bootstrap.",
    flow: [
      {
        title: "Confirm firewall access",
        detail:
          "If firewalls restrict traffic, ask the network team to allow communication between cluster hosts, access to DNS and time servers, image downloads from registries and their download endpoints, and administrator access to the cluster API and console.",
      },
      {
        title: "Configure a proxy, if the site requires one",
        detail:
          "Some sites require outbound HTTP/HTTPS traffic—such as image downloads, update checks, and access to Red Hat services—to pass through a corporate proxy. Provide its address and identify destinations that should bypass it, such as internal registries and cluster endpoints. Add CA certificates where required services use certificates the hosts don’t already trust.",
      },
      {
        title: "Prepare time synchronization",
        detail:
          "Confirm which time servers the hosts will use and ensure the network allows access to them.",
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
          "Choose physical or virtual media for an ISO, or prepare a network-boot service for PXE. Confirm support on the intended hardware.",
      },
      {
        title: "Prepare boot access",
        detail:
          "Verify operator access, permissions, firmware settings, and media-source connectivity. For BMC virtual media, confirm controller credentials and supported options.",
      },
      {
        title: "Verify media delivery",
        detail:
          "Confirm that each server can receive the intended boot image and that the team knows how to start it and observe the host console.",
      },
    ],
  },
  {
    id: "content",
    parent: "pre-installation",
    phase: "pre-installation",
    title: "Content, configuration and media",
    summary:
      "Prepare the installer, cluster and host settings, and required images.",
    question: "Can every required artifact reach the place it will be used?",
    outcome:
      "Reviewed configuration, matching tools, credentials, and images are ready to generate and deliver the boot media.",
    owners: "Installation owner, registry administrator, and security team.",
    scope:
      "The main path uses install-config.yaml and agent-config.yaml with locally generated media. Disconnected image mirroring and installation without an external registry are explained as separate variations.",
    flow: [
      {
        title: "Obtain matching tools and credentials",
        detail:
          "Prepare the Agent-capable openshift-install binary, oc CLI, target release and architecture, pull secret, and SSH public key.",
      },
      {
        title: "Prepare configuration and image access",
        detail:
          "Describe the cluster in install-config.yaml and host settings in agent-config.yaml. Check image access, mirror mappings where needed, registry credentials, and certificate trust.",
      },
      {
        title: "Generate and hand over boot assets",
        detail:
          "Keep reviewed inputs and the installation directory. Generate the selected media and agree how it will reach the hosts.",
      },
    ],
  },
  {
    id: "configuration",
    parent: "content",
    phase: "pre-installation",
    title: "Prepare cluster and host configuration",
    summary:
      "Describe the cluster and identify how each physical host will participate.",
    question:
      "Does the configuration identify the right hosts, roles, networks, and installation disks?",
    outcome:
      "Reviewed configuration identifies the intended cluster, hosts, network settings, and target disks, with copies retained before media generation.",
    owners:
      "Installation owner, platform architect, hardware team, and network team.",
    scope:
      "The main workflow uses install-config.yaml and agent-config.yaml. Advanced manifest-based inputs are an optional supported variation.",
    flow: [
      {
        title: "Describe the cluster",
        detail:
          "In install-config.yaml, set the cluster identity, layout, platform, network ranges, pull secret, SSH key, and image-access configuration.",
      },
      {
        title: "Identify hosts and their settings",
        detail:
          "In agent-config.yaml, identify hosts by interface MAC addresses and set hostnames, roles, network configuration, and rootDeviceHints for target disks where needed. Match VLANs, bonds, and MTU settings to the physical network.",
      },
      {
        title: "Confirm rendezvous and retain inputs",
        detail:
          "Ensure the rendezvous address identifies a control-plane host. Specify it when using DHCP; static configuration can let the installer select it. Review the inputs with infrastructure owners and keep protected copies before generating media.",
      },
    ],
  },
  {
    id: "disconnected",
    parent: "content",
    phase: "pre-installation",
    title: "Disconnected preparation",
    summary:
      "Mirror required images and make installation tools and instructions usable inside the restricted site.",
    question: "What must be available without online access?",
    outcome:
      "The site can obtain all required installation content locally, with a defined process for adding workloads and receiving updates.",
    owners:
      "Registry or content administrator, security team, and local installation operator.",
    scope:
      "The standard disconnected Agent workflow uses a reachable mirror registry. The expandable installation-without-an-external-registry variation has different media and configuration steps.",
    flow: [
      {
        title: "Plan transfers and local services",
        detail:
          "Identify the connected preparation environment, approved transfer process, local registry, DNS, time services, and responsible teams.",
      },
      {
        title: "Mirror and configure required images",
        detail:
          "Mirror the release and required Operator and workload images. Configure mirror mappings, credentials, and certificate trust, then verify access from the site.",
      },
      {
        title: "Prepare for ongoing use",
        detail:
          "Retain local tools and offline instructions. Agree how additional images and future updates will be approved, transferred, and published.",
      },
    ],
  },
  {
    id: "self-contained",
    parent: "disconnected",
    phase: "pre-installation",
    title: "Variation: install without an external registry",
    summary:
      "Use the documented self-contained media and local web interface when that workflow fits the deployment.",
    question:
      "Does the bundled media and its supported configuration fit this site?",
    outcome:
      "The team understands the bundled content, local configuration steps, credential handoff, and remaining workload dependencies.",
    owners:
      "Installation owner, hardware team, and platform or virtualization team.",
    scope:
      "This variation uses downloaded media and an interactive local web interface. Its bundled Operators focus on virtualization; additional Operators and a storage solution may still be needed.",
    flow: [
      {
        title: "Check coverage and obtain media",
        detail:
          "Confirm the supported release and configuration, included images and Operators, and remaining workload needs. Download the installation ISO.",
      },
      {
        title: "Boot rendezvous and configure locally",
        detail:
          "Boot the designated rendezvous host, use its local web interface to configure the cluster, and boot the remaining hosts with the media.",
      },
      {
        title: "Save credentials and start installation",
        detail:
          "Review hosts and network settings, download the cluster credentials, and explicitly start installation. Follow the transition to the installed cluster’s console.",
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
      "The correct boot assets and configuration are ready for the intended hosts, with clear instructions and responsibility for starting them.",
    owners: "Installation owner and hardware owner.",
    scope:
      "These steps use a full Agent ISO. Minimal ISO and PXE options add boot-file hosting requirements. A full Agent ISO still needs access to the release images; the separate self-contained workflow packages them differently.",
    flow: [
      {
        title: "Preserve the reviewed inputs",
        detail:
          "Keep copies of the configuration and protect pull secrets, generated credentials, and media containing sensitive settings. Retain the installation directory for monitoring.",
      },
      {
        title: "Create the Agent image",
        detail:
          "Generate the ISO for the selected release and architecture. Check generation errors before distributing it. Expand Boot options for minimal ISO and PXE differences.",
        command:
          "openshift-install --dir <installation-directory> agent create image",
      },
      {
        title: "Confirm the boot handoff",
        detail:
          "Identify the hosts and installation disks, arrange media delivery, and assign who will boot the servers and observe validation.",
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
          "A minimal ISO retrieves its root filesystem from a URL. Make that source reachable from the booting hosts, particularly at restricted sites.",
      },
      {
        title: "Serve network boot files for PXE",
        detail:
          "Generate Agent PXE assets, configure the boot-file service, and confirm the hosts can retrieve the files over the site network.",
        command:
          "openshift-install --dir <installation-directory> agent create pxe-files",
      },
    ],
  },
  {
    id: "handoffs",
    parent: "pre-installation",
    phase: "pre-installation",
    title: "Owners and prerequisite readiness",
    summary:
      "Confirm configuration, site services, and ownership before booting the installation media.",
    question:
      "Who can complete each dependency, and how will we know it is ready?",
    outcome:
      "The team has reviewed the configuration, identified the hosts and disks, verified image access, and agreed who will boot and monitor the installation.",
    owners: "Installation owner + infrastructure and security owners",
    scope:
      "In the standard Agent workflow, the local service can start installation once the required hosts pass validation. Complete preparation and approval before booting installation media.",
    flow: [
      {
        title: "Confirm people and access",
        detail:
          "Assign configuration, network, registry, hardware, and installation owners. Confirm access to host consoles and the monitoring workstation.",
      },
      {
        title: "Review the installation inputs",
        detail:
          "Check host identities, roles, target disks, rendezvous address, network settings, image access, and retained configuration.",
      },
      {
        title: "Agree readiness to boot",
        detail:
          "Resolve missing prerequisites and approvals. Confirm who will start the hosts, follow progress, and respond if validation fails.",
      },
    ],
  },
  {
    id: "hosts",
    parent: "installation",
    phase: "installation",
    title: "Boot and install the hosts",
    summary:
      "Boot the prepared media and follow host discovery, validation, and operating-system installation.",
    question: "Are the expected hosts installing onto the intended disks?",
    outcome:
      "Expected hosts are installed and reboot into the intended system.",
    owners: "Installation owner and hardware team.",
    scope:
      "Standard Agent CLI workflow. Hosts register with the local Assisted Service on the rendezvous host; installation starts after required hosts and validations are ready.",
    flow: [
      {
        title: "Boot the media and check host readiness",
        detail:
          "Start the intended hosts from the Agent media. Check host identity, connectivity, roles, and target disks against the reviewed configuration.",
      },
      {
        title: "Follow validation and installation",
        detail:
          "The local service checks readiness and coordinates writing the operating system and configuration. Investigate failed checks through the host console and installation logs.",
      },
      {
        title: "Follow host reboots",
        detail:
          "Check that hosts boot from their installed disks and continue joining the cluster. Adjust boot overrides or mounted media if they would restart the installation environment.",
      },
    ],
  },
  {
    id: "bootstrap",
    parent: "installation",
    phase: "installation",
    title: "Bootstrap and control-plane handoff",
    summary:
      "Follow the rendezvous host’s temporary bootstrap role as the cluster control plane becomes operational.",
    question: "What is running now, and what should take over next?",
    outcome: "The permanent control plane can sustain the running cluster.",
    owners: "Installation owner and platform team.",
    scope:
      "One control-plane host runs the local installation service and temporarily provides bootstrap. It later reboots and joins the cluster; there is no separate bootstrap machine to retire.",
    flow: [
      {
        title: "Start the local service",
        detail:
          "The rendezvous host runs the Assisted Service and coordinates the other installation hosts.",
      },
      {
        title: "Establish the control plane",
        detail:
          "The hosts install and start the services needed for the cluster to manage itself. Track bootstrap progress from the installation workstation.",
      },
      {
        title: "Follow the rendezvous host’s transition",
        detail:
          "The rendezvous host reboots and joins the cluster. Continue monitoring until the whole installation completes.",
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
    scope:
      "Agent monitoring uses the retained installation directory and access to the cluster API. Host-console checks and installation logs help explain failures before the cluster is available.",
    flow: [
      {
        title: "Check bootstrap progress",
        detail:
          "Use the Agent bootstrap wait command to observe the control-plane transition. A monitoring timeout needs investigation of the actual host and cluster state.",
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
        title: "Collect diagnostics for the current phase",
        detail:
          "Before bootstrap completes, collect agent-gather logs from the rendezvous host and affected hosts as needed. Once the API is available, use the generated kubeconfig and oc adm must-gather for cluster diagnostics.",
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
      "Recovery depends on the failed phase. A connectivity correction, a repeated monitoring command, and a new installation attempt have different effects.",
    flow: [
      {
        title: "Preserve the failure details",
        detail:
          "Record the host, phase, error, and configuration. Gather diagnostics before rebooting or overwriting installation assets.",
      },
      {
        title: "Correct a live dependency where supported",
        detail:
          "For a release-image connectivity failure, the Agent console can help correct network settings and repeat checks. Re-running a wait command observes progress; it does not restart installation.",
      },
      {
        title: "Decide whether to continue or regenerate",
        detail:
          "Check whether the corrected attempt can proceed. If configuration embedded in the media must change, regenerate the affected assets and plan the next attempt for the failed phase.",
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
    scope:
      "Installation completion establishes the base-cluster milestone. Application storage, identity integration, workload setup, and acceptance checks may still remain.",
    flow: [
      {
        title: "Confirm installation completion",
        detail:
          "Use agent wait-for install-complete from the retained installation directory. Investigate reported errors before accepting completion.",
      },
      {
        title: "Verify the expected cluster",
        detail:
          "Check node readiness, cluster version, Operator health, and API and console access against the planned layout.",
      },
      {
        title: "Hand over credentials and remaining tasks",
        detail:
          "Securely transfer access from the generated auth files. Identify remaining storage, network, identity, workload, and acceptance work.",
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
    scope:
      "After installation, configure the chosen application-storage solution and validate it with a workload.",
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
    scope:
      "Physical storage requirements follow the selected storage system and workloads. Confirm the planned connections again from the installed hosts.",
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
    scope:
      "Driver, storage class, and profile requirements depend on the storage provider and workload. Cluster installation does not establish application-storage readiness.",
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
    scope:
      "Validate the required workload operations against the selected storage configuration after cluster installation.",
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
    scope:
      "Host networking establishes installation connectivity. Workload attachments and advanced network requirements need their own supported configuration.",
    flow: [
      {
        title: "Describe the connection",
        detail:
          "Begin with the existing network and the reachability the application or VM needs.",
      },
      {
        title: "Map the layers",
        detail:
          "Relate physical interfaces and VLANs to supported cluster configuration and workload attachments. Confirm any advanced host-network requirements during installation preparation.",
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
    scope:
      "Begin with securely retained installation credentials, then establish the receiving team’s identity integration and permissions.",
    flow: [
      {
        title: "Connect identity",
        detail:
          "Use the generated cluster credentials to establish the chosen identity provider and group-to-role mapping. Securely transfer ongoing access to the receiving team.",
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
    scope:
      "The installed components depend on the installation workflow and configuration. Verify the actual cluster before adding workload dependencies.",
    flow: [
      {
        title: "Identify dependencies",
        detail:
          "Check which components are already installed, then identify the storage, networking, Operators, and application configuration needed for the intended task.",
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
    scope:
      "Handover follows installation and workload enablement. Acceptance conditions belong to the customer’s intended operations.",
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
          "Hand over reviewed installation configuration, diagnostics, operating procedures, access, support routes, and responsibilities.",
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
    scope:
      "Ongoing operations include cluster changes, image availability, diagnostics, and recovery.",
    flow: [
      {
        title: "Retain the deployment knowledge",
        detail:
          "Retain reviewed installation inputs, configuration, and ownership records, with secure access to required credentials.",
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
    scope:
      "Cluster updates use supported OpenShift update procedures. Maintain compatible Operators, integrations, and mirrored content where required.",
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
    scope:
      "Retained installation inputs can support reconstruction. Cluster-state restoration and workload-data recovery require their own tested procedures.",
    flow: [
      {
        title: "Define what must recover",
        detail:
          "Agree the service, data, configuration and continuity requirements.",
      },
      {
        title: "Include the dependencies",
        detail:
          "Account for cluster state, workload data, external storage, credentials, and access. Retain installation configuration for reconstruction without treating installation media as a data backup.",
      },
      {
        title: "Exercise the plan",
        detail:
          "Demonstrate the selected restore or reconstruction scenario and record limits.",
      },
    ],
  },
];
