import type { Opportunity, Problem } from "../model";

export const problems: Problem[] = [
  {
    id: "owner-wait",
    topic: "networking",
    relatedTopics: ["dns", "hardware", "security"],
    title: "Infrastructure preparation stalls across team handoffs",
    summary:
      "The platform team waits for equipment, network access, corrected information, funding or approval before it can provision the intended environment.",
    context:
      "2025–2026 reports · physical preparation, vSphere and planned environments",
    impact:
      "Provisioning waits while teams schedule work, clarify requests and correct prerequisites.",
    outcome:
      "One team reported straightforward repeat provisioning once prerequisites aligned. Physical work, approval and team scheduling still remained outside the installer.",
    limit:
      "Elapsed preparation estimates include organizational work and experimentation. They are not installer-runtime benchmarks or evidence that a new tool can remove approval and capacity constraints.",
    kind: "Reported experience",
    examples: [
      {
        title: "Physical preparation across owners",
        platform: "Bare-metal platform preparation",
        reported: {
          kind: "reported",
          date: "2026",
        },
        occurred: {
          kind: "dated",
          period:
            "Servers arrived in 2025; bare-metal installation work began several months later that year, inferred from the interview’s relative dates.",
        },
        basis: "Interview transcript",
        finding:
          "Power, cabling, remote access, firewall rules, IP addresses and DNS required work across teams before repeatable builds became straightforward.",
        limitation:
          "This describes physical preparation and organizational waiting, without diagnosing a BMC or firmware defect.",
      },
      {
        title: "Hosting and network requests",
        platform: "OpenShift on vSphere",
        reported: {
          kind: "reported",
          date: "2026",
        },
        occurred: {
          kind: "unknown",
          detail: "the recent cluster-request dates were not supplied.",
        },
        basis: "Interview transcript",
        finding:
          "Compute, DHCP, storage, DNS, certificates and credentials involved separate requests. The participant reported about two months of preparation for the recent example.",
        limitation:
          "This estimate includes gathering and correcting prerequisites; it is not installer runtime.",
      },
      {
        title: "Network-team capacity",
        platform: "On-premises virtualization pilot",
        reported: {
          kind: "reported",
          date: "2025",
        },
        occurred: {
          kind: "ongoing",
          detail: "start date unknown.",
        },
        basis: "Copied meeting notes",
        finding:
          "Networking work waited while the network team handled other responsibilities.",
        limitation:
          "No queue duration was measured; the linked original transcript was unavailable.",
      },
      {
        title: "Security approval",
        platform: "An additional disconnected environment",
        reported: {
          kind: "reported",
          date: "2026",
        },
        occurred: {
          kind: "ongoing",
          detail: "start date unknown.",
        },
        basis: "Copied meeting notes",
        finding:
          "An additional disconnected environment was awaiting cybersecurity approval.",
        limitation:
          "This environment is separate from a proposed future bare-metal AI deployment. The original transcript was unavailable.",
      },
      {
        title: "Funding before further deployment",
        platform: "Planned OpenShift deployment",
        reported: {
          kind: "reported",
          date: "2026",
        },
        occurred: {
          kind: "ongoing",
          detail: "start date unknown.",
        },
        basis: "Direct research notes",
        finding:
          "A follow-up said deployment was not actively progressing while funding remained pending.",
        limitation:
          "This later funding update does not change the dates of the same organization’s earlier technical accounts.",
      },
    ],
  },
  {
    id: "missing-dependencies",
    topic: "platform-operators",
    relatedTopics: ["completion", "workloads", "access"],
    title:
      "Base installation finishes before the intended environment is ready",
    summary:
      "Identity, certificates, required services and workload configuration can still need work after cluster creation succeeds.",
    context:
      "2025–2026 accounts · several platforms and installation workflows",
    impact:
      "The first workload or team handover waits for the remaining configuration to be completed and checked.",
    outcome:
      "Some teams already automate their configuration baseline. One accepts the platform after its required components are healthy, certificates work and users can log in with normal accounts. Application acceptance remains a separate check.",
    limit:
      "These accounts describe different completion boundaries. They do not establish a false ready indicator, a universal Operator bundle or a current missing-dependency defect in every installer.",
    kind: "Reported experience",
    examples: [
      {
        title: "Accepting the configured platform",
        platform: "OpenShift on vSphere",
        reported: {
          kind: "reported",
          date: "2026",
        },
        occurred: {
          kind: "ongoing",
          detail: "start date unknown.",
        },
        basis: "Interview transcript",
        finding:
          "The team accepted the platform after its components were synced, certificates worked and normal users could log in. Configuration sometimes needed input repair; application-team onboarding followed separately.",
        limitation:
          "This is the team’s completion boundary, not proof the installer reported a false ready state.",
      },
      {
        title: "Required components discovered after setup",
        platform: "Bare-metal virtualization pilot context",
        reported: {
          kind: "reported",
          date: "2025",
        },
        occurred: {
          kind: "unknown",
          detail:
            "the call recalls an earlier pilot, likely in 2025, but does not separately date the missing-component episode.",
        },
        basis: "Copied meeting notes",
        finding:
          "The participant recalled missing required bare-metal or virtualization components and wanted clearer readiness checks.",
        limitation:
          "The exact missing Operator list and installer are not recorded. The original transcript was unavailable.",
      },
      {
        title: "Learning which Operator is needed",
        platform: "OpenShift Virtualization; node substrate unspecified",
        reported: {
          kind: "study",
          date: "2025",
        },
        occurred: {
          kind: "unknown",
          detail: "the experience predates the report.",
        },
        basis: "Research report",
        finding:
          "A training course clarified the role of NMState and Operators for the participant’s intended configuration.",
        limitation:
          "A learning discovery does not establish that the installer silently omitted a required component.",
      },
      {
        title: "Expected health and remediation configuration",
        platform: "Partner’s virtualization setup experience",
        reported: {
          kind: "study",
          date: "2025",
        },
        occurred: {
          kind: "unknown",
          detail: "the experience predates the report.",
        },
        basis: "Research report",
        finding:
          "The participant discovered that expected descheduler and health-check configuration still needed attention, and worried that less experienced customers would overlook it.",
        limitation:
          "The participant’s discovery is reported experience; the predicted downstream-customer consequence is hypothetical.",
      },
    ],
  },
  {
    id: "retry-work",
    topic: "recovery",
    relatedTopics: ["media", "hosts", "platform-operators"],
    title: "Recovering a failed build requires manual cleanup and reruns",
    summary:
      "A failed attempt can leave provisioning resources or configuration jobs that need repair before work can continue.",
    context:
      "Reported 2026 · bare-metal provisioning and vSphere configuration",
    impact:
      "Recovery requires knowledge of resources and tools beyond the initial creation workflow, adding work before the next attempt.",
    outcome:
      "The teams described ways to continue after cleanup or input correction. One found later-stage failures easier to revert. The exact cleanup and rerun procedures were not independently verified.",
    limit:
      "Reported workarounds are not supported recovery instructions. The evidence does not measure retry frequency, prove configuration was lost or establish that every failure requires a fresh installation.",
    kind: "Reported experience",
    examples: [
      {
        title: "Cleaning up a failed provisioning attempt",
        platform: "Bare-metal provisioning",
        reported: {
          kind: "reported",
          date: "2026",
        },
        occurred: {
          kind: "unknown",
          detail: "earlier failed builds were not individually dated.",
        },
        basis: "Interview transcript",
        finding:
          "Cleanup involved provisioning resources, finalizers, namespaces and node disks. The participant found later-stage failures easier to revert.",
        limitation:
          "These are reported practices, not verified or supported recovery instructions. No data loss is established.",
      },
      {
        title: "Repairing and rerunning a configuration job",
        platform: "vSphere creation through ACM and AAP",
        reported: {
          kind: "reported",
          date: "2026",
        },
        occurred: {
          kind: "unknown",
          detail: "individual configuration failures were not dated.",
        },
        basis: "Interview transcript",
        finding:
          "The participant inspected AAP logs, repaired inputs such as stale tokens and used an indirect rerun of the ACM post-hook job.",
        limitation:
          "This is configuration recovery, not another physical disk-cleanup incident.",
      },
    ],
  },
  {
    id: "late-dependency",
    topic: "routing",
    relatedTopics: ["dns", "progress", "recovery", "platform-operators"],
    title: "Unmet prerequisites surface during installation or configuration",
    summary:
      "An attempt exposes connectivity or configuration inputs that must be corrected before it can proceed.",
    context:
      "2026 interviews · Nutanix, vSphere and OpenStack · earlier failures recalled",
    impact:
      "Teams investigate the failure, return work to the responsible owner and repeat the affected steps.",
    outcome:
      "The regional proxy problem reportedly worked after endpoint access was corrected. Another team repaired stale configuration inputs and reran its configuration job.",
    limit:
      "The accounts do not establish a shared root cause, that earlier checks passed or that current prerequisite validation is absent. Event versions and exact corrections are incomplete.",
    kind: "Reported experience",
    examples: [
      {
        title: "Different proxy rules between regions",
        platform: "OpenShift on Nutanix",
        reported: {
          kind: "reported",
          date: "2026",
        },
        occurred: {
          kind: "unknown",
          detail:
            "regional installation failures occurred before the interview.",
        },
        basis: "Interview transcript",
        finding:
          "A workflow that worked in North America failed in EMEA. Support helped identify endpoint access and proxy changes needed for the installer and underlying AHV hosts.",
        limitation:
          "The participant reported successful correction; this is a different mechanism from an image-distribution timeout.",
      },
      {
        title: "Stale configuration inputs",
        platform: "vSphere creation through ACM and AAP",
        reported: {
          kind: "reported",
          date: "2026",
        },
        occurred: {
          kind: "unknown",
          detail: "individual failed builds were not dated.",
        },
        basis: "Interview transcript",
        finding:
          "A configuration job could stop on an old token or other input that needed correction before rerunning.",
        limitation:
          "The account does not establish that an earlier validation passed or that all current checks miss the same inputs.",
      },
      {
        title: "Earlier connectivity and DNS problems",
        platform: "Automated service-provider workflow on OpenStack",
        reported: {
          kind: "reported",
          date: "2026",
        },
        occurred: {
          kind: "unknown",
          detail: "these were recalled earlier issues.",
        },
        basis: "Interview transcript",
        finding:
          "The participant recalled connectivity, proxy and stale-DNS problems, while describing the current setup positively and saying early problems were no longer occurring in the same way.",
        limitation:
          "Do not present the recalled DNS issue as an unresolved defect at the 2026 interview; the described clusters were connected.",
      },
    ],
  },
  {
    id: "unclear-progress",
    topic: "progress",
    relatedTopics: ["bootstrap", "hosts", "recovery", "platform-operators"],
    title:
      "Finding the failed step requires tracing resources and logs across tools",
    summary:
      "A failed-build status can leave the operator following resource relationships and external job logs to decide what to fix.",
    context: "Reported 2026 · provisioning and ACM/AAP configuration",
    impact:
      "The operator must locate the responsible component and relevant evidence before choosing whether to wait, repair or rerun.",
    outcome:
      "The teams described investigation paths and later working builds. The AAP account identifies input correction and reruns; the exact remedy for the Ironic investigation is not established.",
    limit:
      "The recent evidence concerns specific diagnostic workflows, not every progress display or a confirmed local Agent CLI defect. Quiet-interval findings remain historical and do not provide a completion-time benchmark.",
    kind: "Reported experience",
    examples: [
      {
        title: "Understanding the provisioning resources",
        platform: "Bare-metal and hosted-control-plane work",
        reported: {
          kind: "reported",
          date: "2026",
        },
        occurred: {
          kind: "unknown",
          detail:
            "the participant recalled an investigation lasting about three weeks.",
        },
        basis: "Interview transcript",
        finding:
          "The participant investigated Ironic/image/version behavior and tag-versus-digest confusion in a restricted environment. Simple creation controls did not explain all the underlying resources.",
        limitation:
          "The exact cause, compatibility rule and remedy are unconfirmed. Three weeks describes investigation time, not installation runtime.",
      },
      {
        title: "Following a job into another tool",
        platform: "vSphere creation through ACM and AAP",
        reported: {
          kind: "reported",
          date: "2026",
        },
        occurred: {
          kind: "unknown",
          detail: "individual configuration failures were not dated.",
        },
        basis: "Interview transcript",
        finding:
          "Native provisioning errors were understandable, but an external configuration failure required following job references into AAP, reading its logs and repairing inputs.",
        limitation:
          "This supports a specific cross-tool diagnostic burden, not a defect in every progress display.",
      },
    ],
  },
  {
    id: "offline-content",
    topic: "disconnected",
    relatedTopics: ["content", "image-access"],
    title:
      "Preparing and delivering content adds work in restricted environments",
    summary:
      "Teams need the right images and approved ways to deliver them to each environment; preparing a mirror may be only part of the work.",
    context:
      "2026 reports · disconnected workflows and restricted security zones",
    impact:
      "Content preparation adds setup work before deployment and creates a separate maintenance responsibility.",
    outcome:
      "One organization already used a custom artifact-distribution path. Another reported improved mirroring after changing tool versions; the partner’s requested offline bundle remained a proposal.",
    limit:
      "Initial preparation, content updates and management connectivity are distinct tasks. These accounts do not establish that every installation path requires an external registry or that all proxy environments are air-gapped.",
    kind: "Reported experience",
    examples: [
      {
        title: "Preparing a disconnected deployment",
        platform:
          "Partner-reported disconnected workflow; installer unspecified",
        reported: {
          kind: "reported",
          date: "2026",
        },
        occurred: {
          kind: "unknown",
          detail: "individual customer deployments were not dated.",
        },
        basis: "Research report",
        finding:
          "The partner described mirroring as a deployment difficulty and requested a downloadable offline bundle.",
        limitation:
          "The partner continued using the existing mirror-based workflow. The requested bundle is not a demonstrated remedy.",
      },
      {
        title: "Delivering artifacts through security zones",
        platform: "Bare-metal platform and hosted-control-plane context",
        reported: {
          kind: "reported",
          date: "2026",
        },
        occurred: {
          kind: "ongoing",
          detail: "start date unknown.",
        },
        basis: "Interview transcript",
        finding:
          "A custom system pushed or pulled OCI artifacts between permitted hops to distribute content and instructions. Security-zone connectivity also limited centralized management.",
        limitation:
          "The distribution system was already working. Content delivery and management reachability are separate jobs.",
      },
      {
        title: "Maintaining the required image set",
        platform: "Disconnected OpenShift environments",
        reported: {
          kind: "reported",
          date: "2026",
        },
        occurred: {
          kind: "unknown",
          detail:
            "earlier mirroring timeouts and the transition date were not supplied.",
        },
        basis: "Copied meeting notes",
        finding:
          "Dependency and image preparation remained necessary, but the participant reported improved mirroring after moving from oc-mirror v1 to v2.",
        limitation:
          "This is maintenance context, not another initial-install incident. The original transcript was unavailable.",
      },
    ],
  },
  {
    id: "feasibility",
    topic: "hardware",
    relatedTopics: ["physical-storage", "topology", "approach"],
    title:
      "Existing hardware may not fit the planned workload and storage design",
    summary:
      "Unconnected storage, limited lab resources and hardware or budget assumptions can constrain the intended workload before the full design is proven.",
    context:
      "Reported 2024–2026 · hardware evaluation, on-premises pilot and labs",
    impact:
      "Customers can invest in setup before discovering that the intended workload needs different equipment, capacity or a revised design.",
    outcome:
      "Some accounts remained in evaluation or planning. The collection does not establish completed corrections for every hardware or capacity mismatch.",
    limit:
      "These accounts are not sizing benchmarks or universal storage-product requirements. Service-model restrictions, procurement and funding are separate feasibility decisions and should be identified explicitly.",
    kind: "Reported experience",
    examples: [
      {
        title: "Hardware and budget during evaluation",
        platform: "Evaluation of virtualization alternatives",
        reported: {
          kind: "reported",
          date: "2024",
        },
        occurred: {
          kind: "unknown",
          detail: "the hardware had already been purchased by the call.",
        },
        basis: "Direct research notes",
        finding:
          "Budget and hardware lacking the discussed internal Ceph storage complicated the team’s evaluation.",
        limitation:
          "The discussion covered several alternatives. It does not establish a diagnosed OCP/Ceph installation failure.",
      },
      {
        title: "Connecting the available storage",
        platform: "On-premises pilot; OCP node substrate unconfirmed",
        reported: {
          kind: "reported",
          date: "2026",
        },
        occurred: {
          kind: "ongoing",
          detail: "start date unknown.",
        },
        basis: "Copied meeting notes",
        finding:
          "External iSCSI storage still needed connections or adapters, and the team was considering better-equipped hosts.",
        limitation:
          "Hardware changes were plans. Neither the storage path nor the host was established as the cause of a separate VM reservation error; the original transcript was unavailable.",
      },
      {
        title: "Capacity for a useful learning lab",
        platform: "OpenShift Virtualization labs",
        reported: {
          kind: "reported",
          date: "2026",
        },
        occurred: {
          kind: "ongoing",
          detail: "start date unknown.",
        },
        basis: "Copied meeting notes",
        finding:
          "Limited lab resources and storage overhead constrained experimentation with the intended environment.",
        limitation:
          "This supplies no sizing threshold or verified resource-allocation cause. The original transcript was unavailable.",
      },
    ],
  },
  {
    id: "storage-not-usable",
    topic: "storage-drivers",
    relatedTopics: ["storage", "platform-operators", "workloads", "acceptance"],
    title:
      "VM storage still needs configuration after virtualization is installed",
    summary:
      "Storage integration, a default storage class and workload-specific settings can remain unfinished after console access is available.",
    context:
      "2025 study report and 2026 call · bare-metal setup and VM storage",
    impact:
      "A VM can remain blocked on storage setup, or a working VM can fail a required maintenance operation.",
    outcome:
      "The migration account described correcting its storage profile after a console hint identified the mismatch. Completion of the other account’s storage integration was not established.",
    limit:
      "These are conditional examples of remaining workload configuration, not additional independent confirmation of every readiness problem. Migration matters only where required. The accounts establish neither a universal access-mode rule nor a current defect on the reference release.",
    kind: "Reported experience",
    examples: [
      {
        title: "Completing storage after virtualization setup",
        platform: "Bare-metal Assisted installation",
        reported: {
          kind: "study",
          date: "2025",
        },
        occurred: {
          kind: "unknown",
          detail: "the experience predates the report.",
        },
        basis: "Research report",
        finding:
          "After selecting virtualization, the participant still needed a usable default storage class and guidance for integrating existing storage.",
        limitation:
          "The report does not establish when that integration was completed; suggested storage-driver examples are not confirmed hardware inventory.",
      },
      {
        title: "Checking the required live-migration behavior",
        platform:
          "OpenShift Virtualization; specific node substrate unconfirmed",
        reported: {
          kind: "study",
          date: "2025",
        },
        occurred: {
          kind: "unknown",
          detail: "the experience predates the report.",
        },
        basis: "Research report",
        finding:
          "A copied storage-profile example did not support the desired live migration. A console hint led the participant to correct the profile and achieve it.",
        limitation:
          "Preserve the successful correction; this is not a universal access-mode rule for every VM.",
      },
      {
        title: "A physical dependency still outstanding",
        platform: "On-premises virtualization pilot",
        reported: {
          kind: "reported",
          date: "2026",
        },
        occurred: {
          kind: "ongoing",
          detail: "start date unknown.",
        },
        basis: "Copied meeting notes",
        finding:
          "The planned external-storage path was not yet connected. Work remained on links or adapters before software integration could be validated.",
        limitation:
          "The storage issue was not established as the cause of the pilot’s separate memory-reservation error. The original transcript was unavailable.",
      },
    ],
  },
  {
    id: "workload-network-gap",
    topic: "workload-network",
    relatedTopics: ["networking", "workloads"],
    title:
      "Connecting VMs to existing networks requires additional cluster configuration",
    summary:
      "Operators must translate the desired site connection into host settings and workload attachments before a VM can use it.",
    context:
      "2025–2026 accounts · virtualization and shared OpenShift networking",
    impact:
      "Workload connectivity takes additional configuration and specialist help after base installation.",
    outcome:
      "Participants described finding configuration paths and learning through experimentation. The collection does not establish a successful end-to-end result for every reported networking task.",
    limit:
      "The accounts concern different configurations and releases. They do not establish one shared networking defect or imply that every VM requires the same bridge or Operator.",
    kind: "Reported experience",
    examples: [
      {
        title: "A familiar bridge through cluster configuration",
        platform:
          "OpenShift Virtualization; specific node substrate unconfirmed",
        reported: {
          kind: "study",
          date: "2025",
        },
        occurred: {
          kind: "unknown",
          detail: "the experience predates the report.",
        },
        basis: "Research report",
        finding:
          "The participant needed an unfamiliar Operator-managed path to configure a bridge on the immutable worker OS.",
        limitation:
          "The wider estate included physical and test environments; the report does not locate every configuration issue on a physical node.",
      },
      {
        title: "Mapping an existing network to the target",
        platform: "Enterprise virtualization migration",
        reported: {
          kind: "study",
          date: "2025",
        },
        occurred: {
          kind: "unknown",
          detail: "the experience predates the report.",
        },
        basis: "Research report",
        finding:
          "Numerous VLANs and IP requirements complicated source-to-target network mappings during migration preparation.",
        limitation:
          "This concerns the intended workload connection, not an initial installer network failure.",
      },
      {
        title: "Namespace-scoped attachments",
        platform: "Partner observations of virtualization users",
        reported: {
          kind: "reported",
          date: "2026",
        },
        occurred: {
          kind: "unknown",
          detail: "individual customer episodes were not dated.",
        },
        basis: "Copied meeting notes",
        finding:
          "Presales staff described difficulty with NNCP configuration and understanding namespace-scoped network attachment definitions.",
        limitation:
          "Partner-reported patterns do not establish a named deployment failure or a confirmed product defect. The original transcript was unavailable.",
      },
      {
        title: "Using the permitted administration path",
        platform: "Restricted cluster administration",
        reported: {
          kind: "reported",
          date: "2025",
        },
        occurred: {
          kind: "ongoing",
          detail: "start date unknown.",
        },
        basis: "Copied meeting notes",
        finding:
          "The kube API was not exposed for security reasons. The team primarily used console access, while automation used CLI and Ansible.",
        limitation:
          "This access constraint predates the same organization’s 2026 BGP account. CLI was not universally prohibited; the original transcript was unavailable.",
      },
      {
        title: "BGP management in the console",
        platform: "Bare-metal platform networking context",
        reported: {
          kind: "reported",
          date: "2026",
        },
        occurred: {
          kind: "ongoing",
          detail: "start date unknown.",
        },
        basis: "Interview transcript",
        finding:
          "The participant found BGP routes difficult to manage in the console and was evaluating alternatives.",
        limitation:
          "No verified remedy or present-release console capability claim follows from this account.",
      },
    ],
  },
  {
    id: "effective-access",
    topic: "access",
    relatedTopics: ["workloads", "acceptance"],
    title: "Administrators struggle to determine what a user can actually do",
    summary:
      "Permissions inherited through groups and cluster or namespace bindings make access difficult to explain and troubleshoot.",
    context: "2025 interviews and 2026 partner reports · mixed platforms",
    impact:
      "Administrators spend effort tracing permissions and cannot confidently verify delegated tasks from the role names alone.",
    outcome:
      "Participants used manual checks, configuration inspection and existing administration tools. The study does not establish that later design proposals resolved the difficulty.",
    limit:
      "Interview findings are distinct from the study’s prototype tasks. They do not establish a bare-metal installation failure, a faulty authorization engine or that every receiving user lacks required access.",
    kind: "Reported experience",
    examples: [
      {
        title: "Tracing effective permissions",
        platform: "Mixed OpenShift platforms; nine interview participants",
        reported: {
          kind: "reported",
          date: "2025",
        },
        occurred: {
          kind: "ongoing",
          detail: "start date unknown.",
        },
        basis: "Research report",
        finding:
          "Participants manually traced groups and cluster or namespace bindings to understand permissions. Some used Git-managed configuration and the UI for investigation; others relied on broad default roles.",
        limitation:
          "These are operational interview findings, separate from prototype tasks. They do not establish a faulty authorization engine.",
      },
      {
        title: "Finding permissions for a VM task",
        platform: "Partner observations of virtualization users",
        reported: {
          kind: "reported",
          date: "2026",
        },
        occurred: {
          kind: "unknown",
          detail: "individual customer episodes were not dated.",
        },
        basis: "Copied meeting notes",
        finding:
          "Users struggled to configure permissions for actions such as powering VMs on or off through the GUI.",
        limitation:
          "The original transcript was unavailable; no authorization-engine defect was verified.",
      },
      {
        title: "Navigation with namespace access",
        platform: "Partner-reported restricted-user workflow",
        reported: {
          kind: "reported",
          date: "2026",
        },
        occurred: {
          kind: "unknown",
          detail: "individual occurrences were not dated.",
        },
        basis: "Research report",
        finding:
          "The partner reported missing search or VM-console-link behavior despite believing the roles were correctly configured.",
        limitation: "Bindings and root cause were not independently verified.",
      },
    ],
  },
  {
    id: "network-layers",
    topic: "addressing",
    relatedTopics: ["networking"],
    title: "Network setup questions can be interpreted at the wrong layer",
    summary:
      "Customers can mistake cluster-internal address questions for changes to physical switches or firewalls.",
    context:
      "Study report 2025 · partner-relayed example · occurrence date unknown",
    impact:
      "The customer can pursue unnecessary infrastructure changes or need clarification before completing configuration.",
    outcome:
      "The account records the misunderstanding but does not establish a measured delay or a verified final configuration.",
    limit:
      "This is bounded, partner-relayed evidence. Separate firewall coordination and VM attachment problems do not independently corroborate this comprehension issue.",
    kind: "Reported experience",
    examples: [
      {
        title: "Interpreting network questions at the physical layer",
        platform: "Partner-relayed customer example",
        reported: {
          kind: "study",
          date: "2025",
        },
        occurred: {
          kind: "unknown",
          detail: "the experience predates the report.",
        },
        basis: "Research report",
        finding:
          "A partner described a customer interpreting machine, pod and service network questions as three physical networks to configure.",
        limitation:
          "The source alternates agent/assisted terminology. No exact installer version, measured delay or verified final configuration is established.",
      },
    ],
  },
  {
    id: "method-choice",
    topic: "approach",
    relatedTopics: ["topology", "assisted", "agent-based", "ipi", "upi"],
    title:
      "Site constraints make the applicable installation path hard to identify",
    summary:
      "Customers filter installation guidance against their networking and provisioning constraints, then maintain local instructions.",
    context:
      "2026 VMware account; call date disputed · 2022 field context retained",
    impact:
      "Choosing and documenting an applicable workflow adds effort before installation.",
    outcome:
      "The team established a local UPI path. More recent platform-transition accounts describe extra creation and import steps, which are a separate workflow-fragmentation concern.",
    limit:
      "The evidence does not establish that static addressing currently requires UPI. Platform switching is not independent confirmation that users cannot choose among present-day bare-metal installers.",
    kind: "Reported experience",
    examples: [
      {
        title: "Choosing and documenting a local workflow",
        platform: "OpenShift on VMware with no-DHCP server VLANs",
        reported: {
          kind: "reported",
          date: "2026 (exact source date disputed)",
        },
        occurred: {
          kind: "unknown",
          detail: "the VMware deployment preceded the disputed call date.",
        },
        basis: "Copied meeting notes",
        finding:
          "The team selected UPI under its site constraints, filtered complex documentation and maintained local deployment and scaling instructions.",
        limitation:
          "The call heading and linked meeting title disagree; the original was unavailable. This does not prove static addressing currently requires UPI.",
      },
      {
        title: "Explaining installation alternatives",
        platform: "Five internal EMEA field specialists",
        reported: {
          kind: "reported",
          date: "2022",
        },
        occurred: {
          kind: "unknown",
          detail:
            "the focus group recalled earlier customer-support experiences.",
        },
        basis: "Historical field report",
        finding:
          "Specialists described confusion among installation methods and repeated work to establish prerequisites.",
        limitation:
          "Historical field experience, not five independent customer incidents or evidence of current unsupported static-IP behavior.",
      },
    ],
  },
  {
    id: "boot-handoff",
    topic: "media",
    relatedTopics: ["management", "hosts"],
    title: "Historical ISO workflows left the next action unclear",
    summary:
      "Participants were unsure whether copying a URL, downloading an image and hosting it were alternatives or consecutive tasks.",
    context:
      "2021–2022 · internal or mixed Assisted Installer usability studies",
    impact:
      "Participants could not confidently move from the generated artifact to the intended ready hosts.",
    outcome:
      "Later lab accounts described successful Assisted media generation and base installation. Those accounts do not establish whether every earlier usability issue was resolved.",
    limit:
      "These are historical usability findings, not a demonstrated current physical-boot defect. Validate the selected delivery and discovery workflow before proposing a change.",
    kind: "Historical evidence",
    examples: [
      {
        title: "What to do with the Discovery ISO",
        platform: "Assisted Installer; eight internal test participants",
        reported: {
          kind: "study",
          date: "2021",
        },
        occurred: {
          kind: "unknown",
          detail: "individual test dates were not supplied.",
        },
        basis: "Historical usability study",
        finding:
          "Participants were unsure whether ISO generation was required and what to do with the resulting image or URL.",
        limitation:
          "Internal proxy usability, not a current customer firmware, BMC or PXE failure.",
      },
      {
        title: "Understanding host discovery and allocation",
        platform: "ACM 2.6 CIM and hosted-control-plane test",
        reported: {
          kind: "study",
          date: "2022",
        },
        occurred: {
          kind: "unknown",
          detail: "individual test dates were not supplied.",
        },
        basis: "Historical usability study",
        finding:
          "Participants needed clearer host/infrastructure terminology, status and allocation feedback.",
        limitation:
          "One customer and eight internal proxies took part. These findings do not establish current physical-execution defects.",
      },
      {
        title: "A later successful base-install experience",
        platform: "OpenShift Virtualization lab",
        reported: {
          kind: "reported",
          date: "2026",
        },
        occurred: {
          kind: "unknown",
          detail: "the Assisted installations preceded the call.",
        },
        basis: "Copied meeting notes",
        finding:
          "The participant described Assisted media generation and base installation positively.",
        limitation:
          "This later experience does not establish that every earlier usability issue was resolved. The original transcript was unavailable.",
      },
    ],
  },
  {
    id: "first-vm-blocked",
    topic: "workloads",
    relatedTopics: [],
    title: "Creating the first VM can remain blocked after cluster setup",
    summary:
      "An installed cluster can still leave an administrator unable to complete VM configuration or resolve a resource-reservation error.",
    context:
      "Virtualization pilot · reported 2025 and 2026 · on-premises",
    examples: [
      {
        title: "Completing the VM configuration",
        platform: "On-premises pilot; OCP node substrate unconfirmed",
        reported: {
          kind: "reported",
          date: "2025",
        },
        occurred: {
          kind: "ongoing",
          detail: "start date unknown.",
        },
        basis: "Copied meeting notes",
        finding:
          "Logical versus bootable volumes, instance types, ISO handling and retaining project context impeded first-VM work.",
        limitation:
          "The original transcript was unavailable. Confusion alone does not establish a product defect or an actual wrong-project deployment.",
      },
      {
        title: "VM creation blocked on a reservation error",
        platform: "Same on-premises pilot",
        reported: {
          kind: "reported",
          date: "2026",
        },
        occurred: {
          kind: "ongoing",
          detail: "start date unknown.",
        },
        basis: "Copied meeting notes",
        finding:
          "A reported memory-reservation error prevented VM creation and the intended availability tests. A possible configuration change was identified but not confirmed as a fix.",
        limitation:
          "The error was not log-verified and its cause is unknown. A named physical server does not prove OCP nodes ran directly on it.",
      },
    ],
    impact: "The intended VMs and their availability tests could not proceed.",
    outcome:
      "Training helped, but the retained account does not record a verified remedy for the reservation error.",
    limit:
      "These are two reports from one pilot. Hardware capacity and unconnected storage are not established as the error’s cause; blocked HA testing is not proof that HA failed.",
    kind: "Reported experience",
  },
  {
    id: "support-evidence-gap",
    topic: "support",
    relatedTopics: [],
    title:
      "Collecting diagnostic evidence can require additional skills or access",
    summary:
      "Users can struggle to locate and collect useful diagnostic evidence when Linux knowledge, tool familiarity or access to infrastructure is limited.",
    context: "Post-install diagnosis · reports from 2025 and 2026",
    examples: [
      {
        title: "Interpreting a POC alert and gathering evidence",
        platform: "Virtualization evaluation",
        reported: {
          kind: "reported",
          date: "2025",
        },
        occurred: {
          kind: "unknown",
          detail: "the POC episode was reported at Summit.",
        },
        basis: "Direct research notes",
        finding:
          "An error or alert was difficult to interpret, and collecting a support bundle required unfamiliar host/container access.",
        limitation:
          "The exact physical substrate and technical cause of this episode are not established.",
      },
      {
        title: "Support-bundle work for VMware-oriented staff",
        platform: "Same organization; broader bare-metal pilot context",
        reported: {
          kind: "reported",
          date: "2025",
        },
        occurred: {
          kind: "unknown",
          detail: "the participant recalled earlier diagnostic work.",
        },
        basis: "Copied meeting notes",
        finding:
          "The team described difficulty collecting and extracting must-gather evidence with limited Linux familiarity.",
        limitation:
          "The original transcript was unavailable. This follow-up is not a second independent organization.",
      },
      {
        title: "Import troubleshooting and infrastructure visibility",
        platform: "Virtualization lab and customer support contexts",
        reported: {
          kind: "reported",
          date: "2026",
        },
        occurred: {
          kind: "unknown",
          detail:
            "import attempts preceded the call; infrastructure visibility remained a support constraint.",
        },
        basis: "Copied meeting notes",
        finding:
          "Import attempts were abandoned partly because logs and unfamiliarity complicated diagnosis; fresh VM builds provided an alternative. Support also lacked visibility into some customer-owned infrastructure.",
        limitation:
          "Task abandonment does not mean platform abandonment. Tool familiarity and infrastructure access are separate constraints; the original transcript was unavailable.",
      },
    ],
    impact:
      "Collecting useful evidence required additional expertise or access; one import path was abandoned.",
    outcome:
      "Fresh VM builds provided an alternative for one participant. The records do not establish a complete remedy for the support-evidence barriers.",
    limit:
      "This concerns operating and support readiness after setup. It does not establish that logs or support tools are absent, or that a formal handover failed.",
    kind: "Reported experience",
  },
  {
    id: "operating-knowledge-gap",
    topic: "acceptance",
    relatedTopics: [],
    title: "The wider operations team is still learning to support OpenShift",
    summary:
      "A working setup can coexist with infrastructure and support teams still learning OpenShift troubleshooting and operating procedures.",
    context:
      "Operations and support learning · 2026 call and 2025 study report",
    examples: [
      {
        title: "Learning beyond the original builders",
        platform: "Infrastructure and support-team transition",
        reported: {
          kind: "reported",
          date: "2026",
        },
        occurred: {
          kind: "ongoing",
          detail: "start date unknown.",
        },
        basis: "Direct research notes",
        finding:
          "The original builders worked within a wider datacenter/support organization that was still learning OpenShift and Kubernetes troubleshooting.",
        limitation:
          "The linked original was unavailable. The notes do not establish exclusively held knowledge, a failed formal handover or a wholly physical estate.",
      },
      {
        title: "Expert help for difficult problems",
        platform: "Partner-supported virtualization environment",
        reported: {
          kind: "study",
          date: "2025",
        },
        occurred: {
          kind: "unknown",
          detail: "the experience predates the report.",
        },
        basis: "Research report",
        finding:
          "Customers handled everyday VM tasks while harder issues returned to consultants for deeper investigation.",
        limitation:
          "Expert escalation is not proof the customer could not perform routine operations.",
      },
    ],
    impact:
      "More difficult operations and troubleshooting continued to require experienced help.",
    outcome:
      "The wider team was still learning; no measured handover delay or completed corrective intervention is recorded.",
    limit:
      "This is an ongoing learning transition. Platform/support teams and application teams have different responsibilities; the evidence does not establish an unusable platform or failed initial transfer.",
    kind: "Reported experience",
  },
  {
    id: "repeatable-configuration",
    topic: "configuration",
    relatedTopics: [],
    title:
      "Repeating a deployment requires maintaining configuration across tools and releases",
    summary:
      "Teams maintain deployment inputs, playbooks and integrations; platform or release changes create additional adaptation work.",
    context:
      "2025–2026 reports · deployment automation and platform transitions",
    examples: [
      {
        title: "Adapting deployment playbooks",
        platform: "Customized OpenShift deployment; substrate unspecified",
        reported: {
          kind: "reported",
          date: "2026",
        },
        occurred: {
          kind: "unknown",
          detail: "individual release-change episodes were not dated.",
        },
        basis: "Direct research notes",
        finding:
          "Deployment playbooks needed release-dependent changes, and preserving configuration or understanding upgrade deltas was difficult.",
        limitation:
          "The operational mobility requirement in the same account is not an installation-duration target.",
      },
      {
        title: "Finding integration inputs and examples",
        platform: "ACM and Ansible Automation Platform",
        reported: {
          kind: "reported",
          date: "2025",
        },
        occurred: {
          kind: "ongoing",
          detail: "start date unknown.",
        },
        basis: "Interview transcript",
        finding:
          "The participant could not find the built-in variables needed for ACM/AAP integration and wanted working source-control and deployment examples.",
        limitation:
          "The participant acknowledged they might be looking in the wrong place; this does not prove documentation was absent.",
      },
      {
        title: "Changing the deployment workflow",
        platform: "VMware-to-Nutanix platform transition",
        reported: {
          kind: "reported",
          date: "2026",
        },
        occurred: {
          kind: "dated",
          period:
            "Migration began in 2025; manual work spanned roughly 9–10 months. Last new builds were reported in early 2026; individual difficulty dates are unknown.",
        },
        basis: "Interview transcript",
        finding:
          "The team moved from an ACM-based creation flow to bastion-host configuration files and a separate ACM import. Automation was deferred because of time and build frequency.",
        limitation:
          "The same organization supplies the image-timeout account. This is additional workflow work, not evidence every custom integration is defective.",
      },
    ],
    impact:
      "Repeating or adapting a deployment requires maintained customer configuration and coordination between tools.",
    outcome:
      "Several workflows already worked. Participants still wanted clearer integration guidance or more repeatable automation.",
    limit:
      "This concerns deploying the next intended environment, separately from choosing a method or recovering a failed attempt. Platform-specific examples do not establish a universal installer limitation.",
    kind: "Reported experience",
  },
  {
    id: "identity-group-integration",
    topic: "access",
    relatedTopics: [],
    title:
      "Identity and group integration adds work before access can be delegated",
    summary:
      "Connecting directory groups to namespace and product roles can require synchronization, mapping and additional administration work.",
    context: "2025 interviews · mixed platforms · earlier setup recalled",
    examples: [
      {
        title: "Earlier manual group synchronization",
        platform: "Enterprise OpenShift identity integration",
        reported: {
          kind: "reported",
          date: "2025",
        },
        occurred: {
          kind: "unknown",
          detail:
            "the participant recalled early implementations without giving their dates.",
        },
        basis: "Research report",
        finding:
          "An infrastructure engineer recalled painful manual group synchronization during earlier OpenShift implementations.",
        limitation:
          "This recollection does not prove manual sync remained necessary at the interview or on the reference release.",
      },
      {
        title: "Mapping groups and entitlements across tools",
        platform: "Directory integration and delegated access",
        reported: {
          kind: "reported",
          date: "2025",
        },
        occurred: {
          kind: "ongoing",
          detail: "start date unknown.",
        },
        basis: "Research report",
        finding:
          "Participants wanted clearer AD group mappings, less manual group-to-namespace/role linkage and more consistent identity entitlements across tools.",
        limitation:
          "Requests for automation do not establish an absent supported integration or a failed first login.",
      },
    ],
    impact:
      "Administrators perform synchronization and mapping work before intended access can be delegated and verified.",
    outcome:
      "Some teams already automated parts of access setup; the report does not establish that later proposals resolved the remaining concerns.",
    limit:
      "This explains how users and groups reach the permission model. The effective-access account separately concerns understanding the permissions they receive. Operational interviews remain distinct from prototype tests.",
    kind: "Reported experience",
  },
  {
    id: "image-distribution-timeout",
    topic: "progress",
    relatedTopics: [],
    title: "Nutanix image distribution can time out before cluster creation",
    summary:
      "In a reported Nutanix workflow, distributing an image across sites timed out; staging it near the target reduced transfer time.",
    context: "Nutanix only · reported 2026 · earlier OCP 4.17/4.18-era builds",
    examples: [
      {
        title: "Staging an image near the target",
        platform: "OpenShift on Nutanix AHV across sites",
        reported: {
          kind: "reported",
          date: "2026",
        },
        occurred: {
          kind: "unknown",
          detail:
            "the participant recalled OCP 4.17/4.18-era builds; individual incident dates were not supplied.",
        },
        basis: "Interview transcript",
        finding:
          "Image distribution through Prism Central across sites exceeded an approximately five-minute timeout in the reported workflow. Pre-downloading the image locally and specifying its location reduced transfer time.",
        limitation:
          "An earlier 2025 timeout note is from the same organization. It does not independently establish this detailed mechanism or a later-release fix.",
      },
    ],
    impact:
      "The image operation interrupted initial builds before the target cluster was created.",
    outcome:
      "The participant reported local staging as a working workaround. A suggested later-release fix was not verified.",
    limit:
      "This is Nutanix image provisioning before bootstrap, not bare-metal image pulling, disconnected mirroring or a current Agent CLI defect. The reported timeout is not a product-wide constant.",
    kind: "Reported experience",
  },
  {
    id: "security-policy-rollout",
    topic: "acceptance",
    relatedTopics: [],
    title:
      "Security rollout requires policy enforcement and developer agreement",
    summary:
      "Security rollout includes policy enforcement, workload validation and agreement with application teams beyond deploying the component.",
    context:
      "When policy rollout is part of acceptance · 2025 and 2026 reports",
    examples: [
      {
        title: "Moving from tool setup to agreed enforcement",
        platform: "Partner-supported ACS rollout",
        reported: {
          kind: "reported",
          date: "2026",
        },
        occurred: {
          kind: "unknown",
          detail: "individual customer rollout dates were not supplied.",
        },
        basis: "Copied meeting notes",
        finding:
          "The partner reported two to three days for initial ACS setup, with policy enforcement and developer agreement taking substantially longer.",
        limitation:
          "No complete rollout duration or failed handover was recorded; the original transcript was unavailable.",
      },
      {
        title: "Policy guidance and management integration",
        platform: "ACS and ACM workflows",
        reported: {
          kind: "reported",
          date: "2025",
        },
        occurred: {
          kind: "ongoing",
          detail: "start date unknown.",
        },
        basis: "Interview transcript",
        finding:
          "The participant reported difficulty finding policy-as-code API guidance and wanted better integration between security and cluster-management workflows.",
        limitation:
          "A documentation complaint and integration request are not a measured approval delay or an observed policy-admission failure.",
      },
    ],
    impact:
      "Deploying the component does not finish the customer’s policy-rollout work.",
    outcome:
      "The accounts identify remaining enforcement, guidance and agreement work without a verified end-to-end remedy.",
    limit:
      "Use this account when the agreed initial security baseline requires it. ACS is not universal; requested scanning and hypothetical security tasks are requirements, not additional rollout failures.",
    kind: "Reported experience",
  },
  {
    id: "migration-workload-readiness",
    topic: "workloads",
    relatedTopics: [],
    title:
      "Moving existing workloads requires compatibility and guest preparation beyond cluster setup",
    summary:
      "A prepared target does not ensure an existing workload can move and start correctly; source compatibility and guest-specific preparation may remain.",
    context:
      "When migrating existing VMs · 2025 study report · occurrence dates unknown",
    examples: [
      {
        title: "Compatibility and appliance preparation",
        platform: "Partner-led migration to OpenShift Virtualization",
        reported: {
          kind: "study",
          date: "2025",
        },
        occurred: {
          kind: "unknown",
          detail: "the experience predates the report.",
        },
        basis: "Research report",
        finding:
          "A fixed RHEV source complicated choosing compatible migration-tool and target versions. Appliance import also required disk conversion and choosing devices compatible with available guest drivers.",
        limitation:
          "Exact version ownership is ambiguous. Avoiding virtio devices when drivers were absent is not evidence drivers were installed or every guest is unsupported.",
      },
      {
        title: "Legacy guests and application startup",
        platform: "Enterprise virtualization migration",
        reported: {
          kind: "study",
          date: "2025",
        },
        occurred: {
          kind: "unknown",
          detail: "the experience predates the report.",
        },
        basis: "Research report",
        finding:
          "A different participant described legacy guest compatibility, network mappings and application-specific pre/post actions needed for startup.",
        limitation:
          "Keep this account distinct from the partner’s appliance/device example. Resolution was not recorded for every task.",
      },
    ],
    impact:
      "Migration and application startup require preparation beyond creating and configuring the target cluster.",
    outcome:
      "Participants described troubleshooting and preparation work; the report does not establish a universal compatibility recipe or resolution of every task.",
    limit:
      "Conditional on migration being an intended first workload. VMware workload migration is not the same as installing OpenShift on VMware; later migration operations remain outside the core installation sequence.",
    kind: "Reported experience",
  },
];

export const opportunities: Opportunity[] = [
  {
    id: "network-translation",
    topics: ["networking", "addressing", "workload-network"],
    title: "Explain the network from the customer’s starting point",
    summary:
      "Connect the familiar site network to the cluster and workload configuration it requires.",
    intervention:
      "Start with one existing-VLAN workload scenario. Show the physical-to-workload path, the responsible owner at each layer and the applicable configuration.",
    existing:
      "Existing capabilities include network configuration tools and VM networking flows. The proposed increment is explanation and verification across the whole path.",
    investigate:
      "Observe the current supported workflow with a user who knows their site network but is new to OpenShift. Include a missing attachment and an unresolved physical task.",
    measure:
      "Correct mapping, successful connectivity, wrong-layer changes and specialist clarification cycles. Establish a baseline before setting targets.",
    basis: [
      {
        kind: "problem",
        id: "network-layers",
      },
      {
        kind: "problem",
        id: "workload-network-gap",
      },
    ],
  },
  {
    id: "precise-handoffs",
    topics: ["dns", "routing", "networking"],
    title: "Make prerequisite requests precise and testable",
    summary:
      "Give infrastructure owners the exact request and the evidence needed to close it.",
    intervention:
      "For one supported site design, generate addresses, records and source-to-destination flow requests with owners, conditions and verification steps.",
    existing:
      "Installer validations and documented network prerequisites already exist. Required DNS records and their timing depend on the installation configuration; confirm them before treating a pending DNS request as safe to defer.",
    investigate:
      "Test whether complete requests reduce clarification. Keep technical verification separate from change approval and pending owner action.",
    measure:
      "Request rework, unresolved assumptions, correct identification of the responsible team and time to establish technical readiness.",
    basis: [
      {
        kind: "problem",
        id: "owner-wait",
      },
      {
        kind: "problem",
        id: "late-dependency",
      },
    ],
  },
  {
    id: "whole-deployment-fit",
    topics: ["hardware", "physical-storage"],
    title: "Establish feasibility for the intended workload",
    summary:
      "Surface missing capacity, connections and commitments before setup effort accumulates.",
    intervention:
      "Start with one workload and storage path. Separate confirmed inventory from planned purchases, physical prerequisites and platform overhead.",
    existing:
      "Published platform and workload requirements are building blocks. The research does not provide a universal sizing formula or a reliable resource-overhead benchmark.",
    investigate:
      "Compare a complete intended deployment with the customer’s actual inventory. Separate product compatibility from procurement and funding constraints.",
    measure:
      "Earlier discovery of consequential gaps, avoided configuration rework and accuracy of feasibility expectations.",
    basis: [
      {
        kind: "problem",
        id: "feasibility",
      },
    ],
  },
  {
    id: "constraint-led-choice",
    topics: ["approach", "assisted", "agent-based", "ipi", "upi"],
    title: "Explain installer choices through ownership and constraints",
    summary:
      "Help engineers and customers understand what each path automates and still requires.",
    intervention:
      "Begin with host control, connectivity and existing provisioning practices. Explain the compatible choices and the work each owner retains.",
    existing:
      "The four installer families and orchestration layers already address different environments. This proposal improves selection and explanation rather than adding another installer.",
    investigate:
      "Check current selection guidance against representative constrained sites. Keep topology, installer family and orchestration as separate decisions.",
    measure:
      "Correct explanation of responsibilities, applicable-document selection and avoided incompatible starts.",
    basis: [
      {
        kind: "problem",
        id: "method-choice",
      },
    ],
  },
  {
    id: "offline-outcome-kit",
    topics: ["content", "disconnected"],
    title: "Prepare an offline kit around the intended outcome",
    summary:
      "Connect installation content to workload dependencies and usable local guidance.",
    intervention:
      "Start with one disconnected workload scenario. Identify the required content, dependencies and approved transfer paths, including environments that need multiple permitted hops. Test preparation and delivery separately.",
    existing:
      "Mirroring and documented disconnected workflows already exist, and one organization uses a working custom artifact-distribution system. The proposed kit remains an untested intervention; it is not a remedy for every management-connectivity restriction.",
    investigate:
      "Determine which missing artifacts or approval boundaries actually block the selected workload. Test the workflow without online documentation access.",
    measure:
      "Content completeness, successful local task completion and repeated transfers caused by missed dependencies.",
    basis: [
      {
        kind: "problem",
        id: "offline-content",
      },
    ],
  },
  {
    id: "clear-boot-handoff",
    topics: ["media", "management", "hosts"],
    title: "Connect media creation to physical host readiness",
    summary:
      "Make artifact delivery, boot and discovery understandable for the selected method.",
    intervention:
      "Walk through one real supported boot path from generation to the correctly identified hosts and installation disks.",
    existing:
      "ISO/PXE workflows, discovery and validations are existing capabilities. BMC reachability and media-source reachability remain separate checks.",
    investigate:
      "Observe current physical installs and document BMC models, firmware, boot choices and media-fetch behavior before choosing a product change.",
    measure:
      "Correct host identification, first successful boot, handoff clarification and reproducible points of failure.",
    basis: [
      {
        kind: "problem",
        id: "boot-handoff",
      },
    ],
  },
  {
    id: "actionable-progress",
    topics: ["progress", "bootstrap", "hosts"],
    title: "Connect build status to the responsible resource and job",
    summary:
      "Help operators follow the failed stage into the relevant configuration, tool and diagnostic evidence.",
    intervention:
      "Follow one provisioning failure and one external configuration-job failure. Connect the top-level state to the affected resource, job logs and supported next action.",
    existing:
      "Assisted and Agent-based workflows already expose validation, progress and diagnostics. First establish which current explanation or transition is insufficient.",
    investigate:
      "Observe provisioning, external configuration-job and platform-specific image-transfer failures separately. Confirm the component and stage responsible; the Nutanix image account does not establish a defect in the reference Agent workflow.",
    measure:
      "Time to find the failed component, correct wait-versus-repair decisions and successful handoff to the responsible owner.",
    basis: [
      {
        kind: "problem",
        id: "unclear-progress",
      },
      {
        kind: "problem",
        id: "image-distribution-timeout",
      },
    ],
  },
  {
    id: "earlier-dependency-feedback",
    topics: ["routing", "progress", "recovery"],
    title: "Connect dependency failures to their owner and correction",
    summary:
      "Expose the failed endpoint and useful evidence at the earliest demonstrated point.",
    intervention:
      "Reproduce one late dependency failure, identify when it becomes detectable, and connect the check to the responsible team’s correction.",
    existing:
      "Existing prerequisite validations and diagnostic checks may already cover the condition. The gap can be timing, coverage, explanation or handoff.",
    investigate:
      "Check the exact method, host, endpoint, previous validation and failure transition. Move a check earlier only where the reproduction supports it.",
    measure:
      "Delay between detectable failure and actionable explanation, avoided repeated work and successful owner handoff.",
    basis: [
      {
        kind: "problem",
        id: "late-dependency",
      },
    ],
  },
  {
    id: "retry-continuity",
    topics: ["recovery", "media"],
    title: "Guide cleanup, correction and the next supported attempt",
    summary:
      "Help operators identify what failed, what needs repair and which work can safely continue.",
    intervention:
      "Follow one failed attempt through correction. Distinguish continued monitoring, repair and a planned new installation, and retain safe reusable inputs.",
    existing:
      "Wait commands can be rerun for monitoring; generated media and consumed configuration have specific lifecycles. There is no universal safe resume for every failed attempt.",
    investigate:
      "Follow a failed provisioning run and an external configuration-job failure. Identify the supported cleanup or rerun procedure and which inputs must be preserved. Do not assume context was lost or that every attempt must start over.",
    measure:
      "Correct recovery-path selection, time to identify required cleanup and repeated manual setup.",
    basis: [
      {
        kind: "problem",
        id: "retry-work",
      },
    ],
  },
  {
    id: "outcome-plan",
    topics: [
      "platform-operators",
      "completion",
      "workloads",
      "access",
      "configuration",
    ],
    title: "Carry the intended workload across the installation boundary",
    summary:
      "Show the configuration and verification still needed between base installation and the intended platform or workload.",
    intervention:
      "Start with one supported workload scenario and its reusable deployment configuration. Connect identity, certificates, required services, owners and workload verification across creation and post-install workflows. Include migration preparation only when it is the intended first use.",
    existing:
      "Installer validation and workload post-installation guidance already exist. Test continuity and remaining-work visibility against current capabilities.",
    investigate:
      "Compare the actual supported dependency set with what users believe is complete after installation. Avoid assuming every workload needs the same Operators.",
    measure:
      "Representative task completion, missed critical dependencies and perceived readiness compared with observed behavior.",
    basis: [
      {
        kind: "problem",
        id: "missing-dependencies",
      },
      {
        kind: "problem",
        id: "first-vm-blocked",
      },
      {
        kind: "problem",
        id: "migration-workload-readiness",
      },
      {
        kind: "problem",
        id: "repeatable-configuration",
      },
    ],
  },
  {
    id: "storage-outcome",
    topics: ["storage", "storage-drivers", "physical-storage"],
    title: "Guide storage setup by the operation it must support",
    summary:
      "Connect the physical system, driver, configuration and representative workload behavior.",
    intervention:
      "Prototype one supported external-storage path through integration, default class/profile and first workload, with a required maintenance operation where applicable.",
    existing:
      "Storage postconfiguration and workload self-validation already exist. The proposed increment is guidance through the complete selected path and its unresolved physical dependencies.",
    investigate:
      "Use a scenario with an available array but incomplete configuration. Verify provider and release support; do not prescribe one product or access mode universally.",
    measure:
      "Successful first workload, correct identification of the missing layer and demonstrated required behavior.",
    basis: [
      {
        kind: "problem",
        id: "storage-not-usable",
      },
      {
        kind: "problem",
        id: "feasibility",
      },
    ],
  },
  {
    id: "rehearse-access",
    topics: ["access"],
    title: "Rehearse the task as the receiving user",
    summary:
      "Make effective access visible in the context of the workload and project.",
    intervention:
      "Follow one intended user from directory/group mapping through effective permissions to a representative task. Test with the user’s actual privileges and identify which role, scope or identity connection needs attention.",
    existing:
      "Role bindings, identity integration and authorization checks are existing building blocks. The proposal connects them to an actual user task.",
    investigate:
      "Determine whether the obstacle is a missing permission, misunderstood scope, navigation or external identity synchronization.",
    measure:
      "Task success with intended privileges and fewer trial-and-error role changes.",
    basis: [
      {
        kind: "problem",
        id: "effective-access",
      },
      {
        kind: "problem",
        id: "identity-group-integration",
      },
    ],
  },
  {
    id: "confidence-rehearsal",
    topics: ["acceptance", "backups", "storage-drivers"],
    title: "Demonstrate customer-specific readiness",
    summary:
      "Replace assumed readiness with evidence from the customer’s required behavior.",
    intervention:
      "Agree a small acceptance plan for a representative workload and the selected maintenance, recovery or security-policy requirements. Record results, limits and ownership with the responsible teams.",
    existing:
      "Monitoring, backup tools, workload checks and recovery procedures already exist. No single green badge proves every production requirement.",
    investigate:
      "Co-design a bounded rehearsal with the operating team. Include data, secrets and external dependencies where the scenario needs them.",
    measure:
      "Correct understanding of what is proven, successful selected recovery tasks and fewer unresolved handover dependencies.",
    basis: [
      {
        kind: "task",
        id: "acceptance",
      },
      {
        kind: "task",
        id: "backups",
      },
      {
        kind: "problem",
        id: "security-policy-rollout",
      },
    ],
  },
  {
    id: "diagnostic-handover",
    topics: ["acceptance", "operations"],
    title: "Rehearse diagnosis with the team that will operate the environment",
    summary:
      "Test whether the receiving operator can find evidence and identify the next support action.",
    intervention:
      "Use one representative workload failure to rehearse diagnosis, evidence collection and support handoff with the receiving operator.",
    existing:
      "Logs, must-gather and support workflows already exist. The increment is making the applicable path usable to the team’s actual skills and access.",
    investigate:
      "Observe a representative diagnostic task without installation specialists guiding every step. Use the reported skill, evidence-collection and infrastructure-access barriers to distinguish what the receiving operator needs; do not assume a failed formal handover.",
    measure:
      "Independent diagnosis, useful evidence collection and a clear escalation path.",
    basis: [
      {
        kind: "task",
        id: "operations",
      },
      {
        kind: "problem",
        id: "unclear-progress",
      },
      {
        kind: "problem",
        id: "support-evidence-gap",
      },
      {
        kind: "problem",
        id: "operating-knowledge-gap",
      },
    ],
  },
  {
    id: "dependency-aware-change",
    topics: ["upgrades", "operations"],
    title: "Plan updates across the whole deployment",
    summary:
      "Bring integration compatibility and disconnected content into the same change plan.",
    intervention:
      "Choose one dependency-bearing update. Record core release, Operators, storage and network configuration and test the representative workload path.",
    existing:
      "Core cluster updates and mirroring already provide useful capabilities. Preserve successful flows while investigating the specific add-on or content gap.",
    investigate:
      "Reproduce a reported integration problem on a known version pair and distinguish support limits from product behavior.",
    measure:
      "Earlier detection of incompatible dependencies, complete content preparation and successful representative workload checks.",
    basis: [
      {
        kind: "task",
        id: "upgrades",
      },
      {
        kind: "problem",
        id: "offline-content",
      },
    ],
  },
];
