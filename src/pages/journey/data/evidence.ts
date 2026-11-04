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
    researchQuestion:
      "Observe a current supported media-to-host workflow before choosing a product change. Identify the actual boot path, host identification and next-action difficulty; historical usability findings do not establish a present BMC, firmware or PXE defect.",
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
      "2025–2026 on-premises pilot reports · separate 2026 CNV 4.22 study",
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
          "Logical versus bootable volumes, instance types, ISO handling and retaining project context impeded first-VM work. The same call also mentioned memory-reservation alerts; their cause and impact were not independently established.",
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
      {
        title: "Missing project context in a newer VM flow",
        platform: "CNV 4.22 live-cluster usability study",
        reported: {
          kind: "study",
          date: "2026",
        },
        occurred: {
          kind: "unknown",
          detail:
            "individual session dates were not supplied in the study finding.",
        },
        basis: "Research report",
        finding:
          "Two participants missed the project selector on their first pass and corrected the selection after it was pointed out. The report describes a later presentation change as fixed in 4.23 and 5.",
        limitation:
          "This is a separate study, not a follow-up to the pilot or evidence of its reservation-error cause. The mixed study included three usability sessions, two demos and two internal pilots; it does not establish prevalence. Release inclusion and the effect of the reported fix were not independently tested.",
      },
    ],
    impact: "The intended VMs and their availability tests could not proceed.",
    outcome:
      "Training helped the pilot. In a later 2026 report, volume-selection improvements were reported in progress and newer namespace navigation was shown; resolution of the pilot's difficulties or reservation error is unconfirmed. Separately, the 2026 study reports a project-selector change in later releases. Verify the applicable build and actual task before proposing another creation-flow change.",
    limit:
      "The first two examples are reports from one pilot. Similar alerts were reported in 2025 and 2026; continuous failure is unproven. Hardware capacity and unconnected storage are not established as the error's cause; blocked HA testing is not proof that HA failed. The separate study concerns project selection and cannot explain or resolve the reservation blocker.",
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
          "The team was building CLI Ansible playbooks for site-specific OpenShift deployments and described release-dependent changes, difficulty preserving configuration and unclear upgrade deltas.",
        limitation:
          "GitOps was planned for the lab but did not suit field connectivity. The mobility requirement is not an installation-duration target; individual release-change episodes were not dated.",
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
  {
    id: "misleading-health",
    topic: "observability",
    relatedTopics: [],
    title:
      "Health and alert displays can send diagnosis in the wrong direction",
    summary:
      "A misleading health state or a lost alert filter can lead an operator to investigate unrelated evidence.",
    context: "2026 CNV 4.22 study · issue follow-up checked in 2026",
    examples: [
      {
        title: "A degraded state without a matching explanation",
        platform:
          "CNV 4.22 study; linked defect reproduction used a CNV nightly",
        reported: { kind: "study", date: "2026" },
        occurred: {
          kind: "unknown",
          detail: "the finding does not separately date each study session.",
        },
        basis: "Research report",
        finding:
          "The study reports a false Degraded state without corresponding alerts. Participants searched other visible alerts for an explanation. Linked engineering records describe distinct alert-rule defects, including a false operator-health signal and an incorrectly divided alert threshold.",
        limitation:
          "The linked reproduction names OCP 4.22.0 with a CNV 4.99 nightly; it does not establish a defect in every generally available 4.22 deployment. The two alert defects have different mechanisms and are not independent observations of the same symptom.",
      },
      {
        title: "Losing the selected alert category",
        platform: "Virtualization overview and alert-list navigation",
        reported: { kind: "study", date: "2026" },
        occurred: {
          kind: "unknown",
          detail:
            "the report does not separately date this navigation observation.",
        },
        basis: "Research report",
        finding:
          "Selecting an alert category reportedly opened an unfiltered list. The operator lost the severity context of the selection. Later issue discussion distinguishes this behavior from filtering by project.",
        limitation:
          "The issue has conflicting resolution and fix-build information. Project filtering and severity filtering must be tested separately on the target release; current behavior remains unverified.",
      },
    ],
    impact:
      "Operators can spend time on unrelated alerts or infer a connection that the health display does not establish.",
    outcome:
      "The later issue check found both alert-rule records closed with fixes recorded. The alert-category record was closed with a non-implementation resolution while also listing fix versions and builds. These records update the study's follow-up status but do not verify behavior in a running product.",
    limit:
      "This small study combines usability sessions, demos and internal pilots. It establishes bounded diagnostic difficulties, not prevalence, an initial-install failure or a generic Agent progress defect. Verify applicable fixes and reproduce remaining behavior before adding new product work.",
    kind: "Reported experience",
  },
];

export const opportunities: Opportunity[] = [
  {
    id: "fewer-prerequisites",
    topics: [
      "approach",
      "hardware",
      "physical-storage",
      "topology",
      "assisted",
      "agent-based",
      "ipi",
      "upi",
      "workloads",
      "platform-operators",
      "completion",
      "storage",
      "storage-drivers",
      "workload-network",
      "networking",
      "addressing",
      "configuration",
      "access",
    ],
    title: "Install a defined first-VM environment from self-contained media",
    summary:
      "Carry a selected storage integration, network and guest image from installation through a working VM in the intended project.",
    priority: "candidate",
    applicability:
      "Virtualization setup using a supported self-contained profile",
    basis: [
      {
        kind: "problem",
        id: "method-choice",
      },
      {
        kind: "problem",
        id: "owner-wait",
      },
      {
        kind: "problem",
        id: "feasibility",
      },
      {
        kind: "problem",
        id: "offline-content",
      },
      {
        kind: "problem",
        id: "missing-dependencies",
      },
      {
        kind: "problem",
        id: "first-vm-blocked",
      },
      {
        kind: "task",
        id: "acceptance",
      },
    ],
    situation:
      "A virtualization team completes base installation but still has to connect storage, prepare a guest image and configure the VM network. The intended first VM remains unfinished.",
    intervention:
      "Offer a first-VM profile that asks for the storage provider, VM network, guest image, project and required maintenance behavior. Show the content supplied and remaining external requests before preparing media. Continue the saved plan after installation through the selected storage and network setup into existing VM creation.",
    example:
      "Cluster installed. Test volume provisioned. Guest image imported into payments. VM booted and its endpoint responded. Live migration and host-failure recovery have not been tested.",
    existing:
      "Self-contained installation is generally available from OCP 4.22.18. Its media already supplies a Virtualization-oriented Operator bundle, but excludes storage Operators. VM creation and configuration tools already exist.",
    increment:
      "Maintain one supported path across installation, storage and first use, with the customer's choices preserved. A new profile selector alone does not remove the remaining setup work.",
    firstDelivery:
      "Connect the current self-contained flow to one certified storage combination, one network configuration and one supported Linux guest. Produce reviewable configuration and explicit actions for unresolved physical work.",
    extension:
      "Publish release-pinned first-VM content profiles with the selected storage integration, local instructions and diagnostic collectors. Keep a small lab profile distinct from a design that supports the requested availability behavior.",
    validation:
      "Compare the profile with today's setup on the same lab hardware. Omit one required storage artifact and verify that preparation identifies it. Then allocate a volume, import the guest and boot the VM. Record missed dependencies, specialist help and external services actually removed.",
    limits:
      "Content redistribution, exact release support and joint maintenance need agreement. A sample VM does not establish application readiness or recovery. Verify reported project-selector fixes on the applicable build. The pilot's reservation-error cause remains unknown; this profile does not claim to resolve it. Funding and approval queues remain separate.",
    owner: "Virtualization onboarding product lead",
    contributors:
      "Installer, storage, networking, content distribution and field engineering.",
    sources: [
      {
        kind: "Existing capability",
        title: "OpenShift self-contained installation",
        url: "https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/installing_an_on-premise_cluster_with_the_agent-based_installer/installing-ove",
        note: "Documents the supplied content and the exclusion of storage Operators.",
      },
      {
        kind: "Existing capability",
        title: "OpenShift 4.22 release notes",
        url: "https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/release_notes/ocp-4-22-release-notes",
        note: "The 4.22.18 update establishes general availability of installation without an external registry.",
      },
      {
        kind: "Product precedent",
        title: "Harvester ISO installation",
        url: "https://docs.harvesterhci.io/v1.7/install/index/",
        note: "Connects appliance setup to installation and VM-data disk choices.",
      },
    ],
  },
  {
    id: "precise-handoffs",
    topics: [
      "networking",
      "dns",
      "routing",
      "addressing",
      "hosts",
      "media",
      "progress",
      "recovery",
    ],
    title: "Turn a failed host check into an actionable owner request",
    summary:
      "Export the actual host, network path, expected response and observed failure, then rerun the same check after correction.",
    priority: "recommended",
    applicability: "Infrastructure preparation and host validation",
    basis: [
      {
        kind: "problem",
        id: "owner-wait",
      },
      {
        kind: "problem",
        id: "late-dependency",
      },
      {
        kind: "problem",
        id: "network-layers",
      },
    ],
    situation:
      "A dependency is declared ready, but the component that needs it cannot use it. The platform engineer must translate the failure into another request to the responsible team.",
    intervention:
      "Add Export failed check to the selected installation flow. Include the source host and interface, destination and port, resolver and proxy context, expected and observed response, timestamp and configuration. Let the user assign the owner and copy the request into the existing ticket system. Offer a focused retest after correction.",
    example:
      "worker-02 resolves the mirror name, but its configured proxy rejects the HTTPS request. Export this observed failure for the proxy team. Registry access beyond the proxy is still untested.",
    existing:
      "Assisted Installer already performs host-based validations and exposes results through its API. Agent workflows also provide prerequisite checks. The exact coverage and available fields depend on the chosen method.",
    increment:
      "Make existing validation evidence usable by another team without the installer engineer reconstructing the execution context. Keep approval, declared completion and observed behavior distinct.",
    firstDelivery:
      "Export one existing failed image-access validation with its real evidence and a retest action. Preserve the customer's ticket process.",
    extension:
      "Add a separate check-only boot mode for intended hosts before the installation window. Reuse approved validators and enforce a boundary against installation, destructive tests and disk cleanup.",
    validation:
      "Block one lab endpoint and give the resulting request to an infrastructure engineer who did not create the fault. Check whether they identify the correct path, correct it and return a passing retest without a clarification round. Record active work separately from queue time.",
    limits:
      "A timeout alone does not identify a firewall root cause. A successful host check does not prove a BMC, hypervisor or workload path that was not tested. The regional proxy account is Nutanix context, not proof of an Agent defect. Procurement and approvals may still dominate the wait.",
    owner: "Installer validation",
    contributors:
      "Infrastructure enablement and the customer team responsible for the tested dependency.",
    sources: [
      {
        kind: "Existing capability",
        title: "Assisted Installer validations",
        url: "https://docs.redhat.com/en/documentation/assisted_installer_for_openshift_container_platform/2026/html/installing_openshift_container_platform_with_the_assisted_installer/assembly_preinstallation-validations",
        note: "Documents real-host validation and available checks.",
      },
      {
        kind: "Product precedent",
        title: "MAAS hardware test scripts",
        url: "https://canonical.com/maas/docs/latest/reference/configuration-guides/hardware-test-scripts/",
        note: "Named tests and inspectable output support a focused correction and retest loop.",
      },
    ],
  },
  {
    id: "storage-outcome",
    topics: ["storage-drivers", "storage", "physical-storage", "workloads"],
    title: "Choose VM storage by the operation it must support",
    summary:
      "Explain which disk configurations can support migration, snapshots or cloning before the customer allocates the real workload's disks.",
    priority: "recommended",
    applicability:
      "Virtualization storage selection and maintenance requirements",
    basis: [
      {
        kind: "problem",
        id: "storage-not-usable",
      },
      {
        kind: "problem",
        id: "feasibility",
      },
      {
        kind: "task",
        id: "workloads",
      },
    ],
    situation:
      "A VM boots, but its storage configuration does not support the maintenance operation the customer needs. Another customer has virtualization installed without usable default storage.",
    intervention:
      "Add required operations to storage selection: boot, clone, snapshot, restore or live migration. Show each class and disk configuration as documented compatible, observed working, incompatible or unverified, with the reason. Offer an applicable disposable check and retain the tested VM configuration, nodes and timestamp.",
    example:
      "This VM boots on the selected class. Live migration has not been demonstrated for this disk and device configuration. Run the applicable check or review another configuration.",
    existing:
      "Storage profiles, console hints, storage checkups and self-validation already exist. The general Virtualization cluster-checkup framework is Technology Preview; the support status of each selected test needs verification.",
    increment:
      "Translate an operational requirement into an early storage choice and explain what the current evidence establishes. A storage-class name or access-mode label cannot establish every VM operation.",
    firstDelivery:
      "Explain one consequential missing profile setting in the current picker and link to the relevant existing check. Start with one supported backend and a specific requested operation.",
    extension:
      "Maintain a compatibility view for selected operations and run disposable tests on the intended configuration. Mark affected results for rechecking when the configuration changes.",
    validation:
      "Compare the current picker with a prototype using a suitable configuration, an unsuitable configuration and an unknown provider. Check whether users understand the consequence before allocating disks, then exercise the selected operation. Observe avoidable reconfiguration and specialist help.",
    limits:
      "A profile cannot create a backend capability. Keep unknown providers visible as unverified. A successful migration does not prove host-failure recovery or production load behavior. Physical storage connections remain an external dependency. Preserve the reported case where a console hint already helped.",
    owner: "Virtualization storage",
    contributors:
      "Storage providers, checkup maintainers and Virtualization onboarding.",
    sources: [
      {
        kind: "Existing capability",
        title: "OpenShift Virtualization storage",
        url: "https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/virtualization/storage",
        note: "Documents storage profiles and provider-dependent configuration.",
      },
      {
        kind: "Existing capability",
        title: "OpenShift Virtualization checkups",
        url: "https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/virtualization/monitoring",
        note: "Documents storage checks and the Technology Preview cluster-checkup framework.",
      },
      {
        kind: "Product precedent",
        title: "vSAN compatible storage policies",
        url: "https://knowledge.broadcom.com/external/article/430243/change-the-default-storage-policy-for-vs.html",
        note: "Makes infrastructure compatibility part of selecting a storage policy.",
      },
    ],
  },
  {
    id: "network-translation",
    topics: ["workload-network", "networking", "addressing", "workloads"],
    title: "Map a source VM network to a verified target connection",
    summary:
      "Carry a familiar port group or VLAN into the existing network flow, showing eligible nodes, project scope and the observed endpoint result.",
    priority: "candidate",
    applicability: "Virtualization network setup or migration mapping",
    basis: [
      {
        kind: "problem",
        id: "workload-network-gap",
      },
      {
        kind: "problem",
        id: "network-layers",
      },
    ],
    situation:
      "Virtualization administrators must translate familiar bridges, VLANs and source networks into host configuration and project-scoped VM connections.",
    intervention:
      "Accept a reviewed source-network table and map each entry to an existing target physical and VM network, or continue into the current creation wizard. Show eligible nodes, permitted projects and outstanding switch or IPAM work. Offer a temporary endpoint test using the intended attachment and addressing mode.",
    example:
      "App-East maps to VLAN 120 in payments. The connection is configured on worker-01 and worker-02; worker-03 lacks the selected uplink. The application endpoint has not passed its probe.",
    existing:
      "OCP 4.22 documents physical-network and VM-network configuration flows, including node and project selection. Configuration enactment and actual endpoint reachability are different results.",
    increment:
      "Connect the customer's source-network concept to the target's node and project scope, then show the path actually tested. Reuse the current configuration interfaces.",
    firstDelivery:
      "Add a source-to-target review row and eligible-node explanation to the existing wizard. Export proposed configuration for the customer's permitted console, API or Git workflow.",
    extension:
      "Import source inventory and run bounded test VMs on selected eligible nodes. Retain the observed endpoint result and identify checks affected by a later mapping change.",
    validation:
      "Use a three-node lab with one missing connection and two projects with different access. Ask an administrator to map one familiar network, identify where the VM can run and test its endpoint. Compare wrong-layer changes and specialist interventions.",
    limits:
      "Equal names or VLAN numbers do not prove equivalent networks across sites. A namespace alone does not isolate traffic. Keep transfer networking separate from the guest's final network and leave inaccessible physical segments unverified.",
    owner: "Virtualization networking",
    contributors:
      "Console, NMState, migration tooling and the customer's network owners.",
    sources: [
      {
        kind: "Existing capability",
        title: "OpenShift Virtualization networking",
        url: "https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/virtualization/networking",
        note: "Documents the physical-network and VM-network configuration flows to extend.",
      },
      {
        kind: "Product precedent",
        title: "Harvester cluster networks",
        url: "https://docs.harvesterhci.io/v1.6/networking/index/",
        note: "Connects VM network availability with eligible host placement.",
      },
    ],
  },
  {
    id: "supported-recovery",
    topics: [
      "progress",
      "bootstrap",
      "hosts",
      "recovery",
      "media",
      "platform-operators",
      "observability",
      "workloads",
    ],
    title: "Open the failed stage and preview its supported repair",
    summary:
      "Link the failed request to its job and evidence, then show changed inputs and the work a supported rerun will actually perform.",
    priority: "candidate",
    applicability: "Start with ACM-to-AAP configuration recovery",
    basis: [
      {
        kind: "problem",
        id: "unclear-progress",
      },
      {
        kind: "problem",
        id: "retry-work",
      },
      {
        kind: "problem",
        id: "late-dependency",
      },
      {
        kind: "problem",
        id: "image-distribution-timeout",
      },
      {
        kind: "problem",
        id: "first-vm-blocked",
      },
      {
        kind: "problem",
        id: "misleading-health",
      },
    ],
    situation:
      "In the reported vSphere workflow, a configuration failure required following ACM references into AAP, repairing inputs and indirectly rerunning the post-install job.",
    intervention:
      "Add Open failed configuration stage to the initiating workflow. Show the owning job, observed failure, previous attempt and input sources. Preview the next supported action with current template defaults, revision changes, credential references and the stages that will run. Keep secrets out of the preview.",
    example:
      "Base cluster creation completed. The configuration job failed. The credential reference and a template default changed. Review the displayed job and inputs before rerunning configuration; this planned action does not recreate the cluster.",
    existing:
      "AAP already exposes job output and relaunch. Relaunch reapplies prompts and can use current template defaults, so it is not necessarily an identical replay. Agent diagnostics and backend-specific recovery routes also exist.",
    increment:
      "Preserve the identity of a task across tools and make a retry's actual inputs and effects inspectable before execution.",
    firstDelivery:
      "Add the direct ACM-to-AAP job link and effective-input comparison for the evidenced post-hook route. Use the supported AAP execution path.",
    extension:
      "Extend attempt traces to supported provisioning backends with state-specific actions and explicit cleanup scope. A separate VM trace can connect admission, data volume, launcher pod and scheduling events to the first evidenced failing stage.",
    validation:
      "Reproduce an invalid input in the ACM-to-AAP lab route, then change a template default. Verify that the user finds the job, sees both changes and understands which task will run. Validate any bare-metal or VM extension separately.",
    limits:
      "There is no universal safe resume. Never infer finalizer deletion or disk cleanup from a failure alone. Nutanix image staging is a separate integration lead. The reservation-error cause remains unknown. Verify recorded health-rule fixes and alert-filter behavior on the target build before adding diagnostic work around them.",
    owner: "ACM provisioning integration",
    contributors:
      "AAP and support; provisioning and Virtualization teams for separately validated extensions.",
    sources: [
      {
        kind: "Existing capability",
        title: "AAP job launch and relaunch",
        url: "https://docs.redhat.com/en/documentation/red_hat_ansible_automation_platform/2.6/develop-proc_controller_launch_job_template",
        note: "Documents why effective inputs can differ when a job is relaunched.",
      },
      {
        kind: "Product precedent",
        title: "Tinkerbell workflows",
        url: "https://tinkerbell.org/docs/v0.22/concepts/workflows/",
        note: "Task-level states and timing provide a model for tracing an attempt.",
      },
    ],
  },
  {
    id: "reusable-deployment-configuration",
    topics: ["configuration"],
    title: "Preview the next site's configuration and release changes",
    summary:
      "Render the working recipe with new site values, explain each change and preserve customizations that need explicit review.",
    priority: "candidate",
    applicability: "Repeated deployments or bounded release adaptation",
    basis: [
      {
        kind: "problem",
        id: "repeatable-configuration",
      },
      {
        kind: "problem",
        id: "method-choice",
      },
      {
        kind: "problem",
        id: "missing-dependencies",
      },
    ],
    situation:
      "Teams maintain working playbooks and installation files, but adapting them to another site or release requires finding stale values and preserving local changes.",
    intervention:
      "Start from the customer's recipe, next-site values and target release. Produce the actual consumer files and a semantic diff of reused settings, site substitutions, secret references, release-dependent fields and unrecognized customizations. Show the source of each generated value and support local rendering for disconnected workflows.",
    example:
      "Site B supplies the node addresses and resolver. The custom post-install hook is preserved but unvalidated. This field needs review for the selected release. The credential remains a destination-supplied reference.",
    existing:
      "Customer playbooks, plain files and ACM templates already produce configuration. OpenShift documents ClusterInstance-based templated deployment; examples must use the current API for their release.",
    increment:
      "Add a reviewable next-site and release comparison with value provenance. Generating YAML alone does not explain compatibility or preserve customization.",
    firstDelivery:
      "Maintain one recipe for one supported route and release pair, with a precise variable reference, local rendering and a semantic diff.",
    extension:
      "Package the versioned recipe, schemas, release content and checks for execution through the customer's runner. Flag conversions and conflicts that require review.",
    validation:
      "Prepare a second lab site with a stale site value and a customization that must survive. Compare the generated files with the existing copy-and-edit workflow, then exercise the target deployment. Record incorrect substitutions, lost settings and maintenance effort.",
    limits:
      "Schema-valid output does not prove runtime compatibility. Preserve the actual source of truth; continuous GitOps may not fit a field site. Do not promise automatic conversion of arbitrary playbooks or untested release pairs.",
    owner: "Deployment configuration tooling",
    contributors:
      "ACM, integration documentation, installer tooling and the maintainer of the selected recipe.",
    sources: [
      {
        kind: "Existing capability",
        title: "ClusterInstance-based deployment",
        url: "https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/edge_computing/ztp-deploying-far-edge-sites",
        note: "Documents an existing templated deployment route.",
      },
      {
        kind: "Product precedent",
        title: "Cluster API topology plan",
        url: "https://release-1-10.cluster-api.sigs.k8s.io/clusterctl/commands/alpha-topology-plan",
        note: "The versioned alpha command produces original and proposed objects with diffs, including offline planning and explicit limits.",
      },
    ],
  },
  {
    id: "offline-outcome-kit",
    topics: ["content", "disconnected", "image-access"],
    title: "Request exactly what the offline workload still needs",
    summary:
      "Build a task-specific content manifest, verify it at the destination and export a request for the missing artifacts.",
    priority: "recommended",
    applicability: "Disconnected or restricted environments",
    basis: [
      {
        kind: "problem",
        id: "offline-content",
      },
      {
        kind: "task",
        id: "support",
      },
    ],
    situation:
      "Content crosses approved security-zone hops, but the destination still lacks an image or diagnostic tool needed for its first task. Another broad transfer repeats work without identifying the gap.",
    intervention:
      "Generate a manifest for a selected release and workload: declared Operators, guest images, collectors and local instructions. Explain each artifact's purpose and immutable identity. Compare the manifest with the destination registry and applicable pull checks. Export a missing-content request through the existing permitted transfer path.",
    example:
      "Release and Virtualization content are present. The guest image is missing. The collector image exists, but the target does not trust the registry CA. Request the guest artifact and send the trust failure to the configuration owner.",
    existing:
      "oc-mirror v2 already provides incremental mirroring, cache and error information. Customers have working transfer systems. Cache checks or completed imports alone do not establish that a target workload can consume the content.",
    increment:
      "Connect declared content to a named task and reconcile it with destination observations. Distinguish missing bytes from credentials, trust and network failures.",
    firstDelivery:
      "Add one workload manifest, an import receipt and a missing-content report around the current mirror and transfer tools. Include the applicable collector and local instructions.",
    extension:
      "Prepare a delta package from the returned request and record inventory identity at each approved hop. Reconcile overlapping deliveries without requesting already-present content.",
    validation:
      "Omit one declared image at the destination, disable online documentation and return the request. Verify that the next transfer supplies the missing artifact, while a separate CA failure produces a configuration action. Then complete the selected VM task and evidence collection.",
    limits:
      "Arbitrary guest downloads and images selected dynamically by Operators may remain undeclared. Mark those dependencies unknown. Digest identity is not a signature or a usability guarantee. Preserve successful oc-mirror improvements and existing security-zone processes.",
    owner: "Disconnected-content tooling",
    contributors:
      "Mirroring, workload-profile maintainers, content distribution and support enablement.",
    sources: [
      {
        kind: "Existing capability",
        title: "OpenShift oc-mirror v2",
        url: "https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/pdf/disconnected_environments/updating-a-cluster-in-a-disconnected-environment",
        note: "Chapter 5 covers incremental mirroring, cache checks and incomplete results.",
      },
      {
        kind: "Product precedent",
        title: "Carvel air-gapped bundles",
        url: "https://carvel.dev/imgpkg/docs/v0.49.x/air-gapped-workflow/",
        note: "Keeps configuration and declared image dependencies together through relocation.",
      },
      {
        kind: "Product precedent",
        title: "Zarf differential packages",
        url: "https://docs.zarf.dev/ref/create/",
        note: "Reuses reference-package content when creating a differential package; destination reconciliation is the proposed addition.",
      },
    ],
  },
  {
    id: "rehearse-access",
    topics: ["access"],
    title: "Explain why this user can or cannot perform this task",
    summary:
      "Trace the selected task through identity, groups, bindings and project scope, separating authorization from other blockers.",
    priority: "candidate",
    applicability: "Delegated administration or team access",
    basis: [
      {
        kind: "problem",
        id: "identity-group-integration",
      },
      {
        kind: "problem",
        id: "effective-access",
      },
    ],
    situation:
      "Administrators manually trace directory groups and bindings to explain what a user can do. Role names alone do not establish whether the user's intended VM task will work.",
    intervention:
      "Add Check task access to a project or blocked action. Select the user, project and a bounded task. Show relevant API actions, their authorization results and visible group and binding provenance. Distinguish missing identity information from a missing grant, and separate quota or admission failures. Prepare a reviewable correction in the customer's source of truth.",
    example:
      "This user can create a VM in payments but cannot create the required data volume there. The observed group binding grants the displayed VM permissions. Request review of the missing permission; runtime behavior has not been tested.",
    existing:
      "OpenShift supports LDAP sync previews and scheduled synchronization. Authorization checks and role bindings already exist. Kubernetes RBAC grants are additive, without explicit deny rules.",
    increment:
      "Translate a customer task into the maintained set of relevant permission checks and explain the first known failure at the point of use.",
    firstDelivery:
      "Check one VM creation path for the signed-in user, with project context and a scoped explanation of a denial.",
    extension:
      "Add authorized inspection of another user's complete identity context, synchronization status and a proposed configuration diff. Extend to other tasks only with maintained request mappings.",
    validation:
      "Exercise separate missing-group, missing-binding and quota cases. Verify that the user identifies the right boundary and completes the intended task after a scoped correction, without a broad administrator grant.",
    limits:
      "An authorization result does not prove admission or runtime success. Inspection of another user requires authority and accurate group context. Azure and AWS are interaction precedents with different authorization semantics.",
    owner: "Console identity and access",
    contributors:
      "Identity integration, RBAC, Virtualization and the customer's access administrator.",
    sources: [
      {
        kind: "Existing capability",
        title: "OpenShift LDAP synchronization",
        url: "https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/authentication_and_authorization/ldap-syncing",
        note: "Documents preview and automated group synchronization.",
      },
      {
        kind: "Existing capability",
        title: "Kubernetes authorization",
        url: "https://kubernetes.io/docs/reference/access-authn-authz/authorization/",
        note: "Documents access-review APIs for scoped authorization checks.",
      },
      {
        kind: "Product precedent",
        title: "Azure Check access",
        url: "https://learn.microsoft.com/en-us/azure/role-based-access-control/check-access",
        note: "Shows assignments at the selected scope, including inherited access.",
      },
    ],
  },
  {
    id: "diagnostic-handover",
    topics: ["support", "acceptance", "operations"],
    title: "Collect the right evidence from the failed task",
    summary:
      "Choose a diagnostic recipe from the failed operation, preview its local package and identify evidence another owner must supply.",
    priority: "candidate",
    applicability: "Operations, VM-import diagnosis and support escalation",
    basis: [
      {
        kind: "problem",
        id: "support-evidence-gap",
      },
      {
        kind: "problem",
        id: "operating-knowledge-gap",
      },
      {
        kind: "problem",
        id: "misleading-health",
      },
      {
        kind: "task",
        id: "operations",
      },
    ],
    situation:
      "An operator unfamiliar with Linux and container tooling struggles to collect useful evidence. External infrastructure logs may also be outside that operator's access.",
    intervention:
      "Put Collect evidence for this failure on a VM import or configuration error. Carry the resource, project, timeframe, versions and attempted corrections into a maintained collection recipe. Show required privileges and offline collector availability, then preview the local package and configured redaction. List included, omitted and inaccessible evidence.",
    example:
      "VM import events and selected cluster logs were collected. Source-hypervisor logs need its administrator. Save the local case package and export that evidence request. No root cause has been confirmed.",
    existing:
      "must-gather and feature collectors already exist. OCP 4.22 also documents Support Log Gather for automated packaging and optional upload, currently Technology Preview.",
    increment:
      "Add task context, recipe selection and an understandable completeness report to existing collection. Keep upload optional and explain where support must ask another owner for evidence.",
    firstDelivery:
      "Provide one VM-import recipe through a supported collection route. Check collector content and download a small local package before the site disconnects. Confirm the support route and entitlement.",
    extension:
      "Maintain versioned recipes for other failed tasks and carry prior collection results and attempted corrections into escalation. Allow the receiving team to inspect scope and omissions without the original builder.",
    validation:
      "Give a receiving operator a seeded import failure, a missing collector image and inaccessible external logs. Have support review the resulting package. Observe useful evidence, clear omissions, manual commands and follow-up collection rounds.",
    limits:
      "Collection is not diagnosis, and redaction cannot guarantee removal of every sensitive value. A collector cannot obtain inaccessible infrastructure evidence. Production use needs a supported route. Verify health-display fixes rather than teaching around a corrected defect; expert escalation can remain appropriate.",
    owner: "Support tooling",
    contributors:
      "Virtualization, collector maintainers, the receiving operations team and external infrastructure owners.",
    sources: [
      {
        kind: "Existing capability",
        title: "OpenShift cluster data collection",
        url: "https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/support/gathering-cluster-data",
        note: "Documents must-gather and the Technology Preview Support Log Gather Operator.",
      },
      {
        kind: "Product precedent",
        title: "Replicated Troubleshoot support bundles",
        url: "https://troubleshoot.sh/docs/support-bundle/collecting/",
        note: "Declarative collectors and local specifications provide a diagnostic-recipe pattern.",
      },
      {
        kind: "Product precedent",
        title: "Troubleshoot redaction",
        url: "https://troubleshoot.sh/docs/redact/",
        note: "Documents configurable redaction for collected evidence.",
      },
    ],
  },
  {
    id: "migration-preparation",
    topics: ["workloads"],
    title: "Rehearse the application migration before cutover",
    summary:
      "Test a supported copy on an isolated target, record guest and application results, then clean up before the production move.",
    priority: "candidate",
    applicability: "Migration is the intended first workload",
    basis: [
      {
        kind: "problem",
        id: "migration-workload-readiness",
      },
      {
        kind: "problem",
        id: "workload-network-gap",
      },
    ],
    situation:
      "A healthy target cluster does not resolve legacy guest devices, disk conversion, network mappings or application startup actions before a migration window.",
    intervention:
      "Attach an application acceptance recipe to the migration plan. Through a verified source-copy mechanism, create an isolated test target, apply reviewed mappings and run the customer's post-boot checks. Retain per-VM and application results, differences from the intended cutover and cleanup status.",
    example:
      "Guest boot passed. The application service failed after conversion. The target stayed on the reviewed test network. Review the service error before cutover; production endpoint connectivity remains untested.",
    existing:
      "MTV already provides mappings, inspection, custom validation and pre/post hooks. The reviewed documentation did not verify an equivalent complete source-preserving test-copy lifecycle; engineering must establish the supported route.",
    increment:
      "Add an isolated rehearsal and application decision around the existing migration plan, with evidence tied to the tested configuration.",
    firstDelivery:
      "Prove source preservation, isolation and cleanup with a disposable source VM on one supported provider. Attach application checks and results to that reviewed lab-copy workflow.",
    extension:
      "Offer a supported Test migration action that retains the rehearsal's evidence and flags relevant mapping or configuration changes before a separately reviewed cutover.",
    validation:
      "Use a guest with a deliberately missing application dependency. Demonstrate source continuity, test isolation, meaningful application checks and complete cleanup. Confirm that users distinguish conversion, guest boot and application success.",
    limits:
      "A separate namespace does not establish network isolation or prevent external side effects. Do not run a normal migration and assume the source stays untouched. MTV 2.12 Deep Inspection is Technology Preview. Unsupported guests and untested dependencies remain explicit; the existing historical accounts do not establish universal compatibility.",
    owner: "Migration Toolkit for Virtualization",
    contributors:
      "Virtualization, source-provider engineering, networking and the application owner.",
    sources: [
      {
        kind: "Existing capability",
        title: "MTV advanced migration options",
        url: "https://docs.redhat.com/en/documentation/migration_toolkit_for_virtualization/2.12/html/migrating_your_virtual_machines_to_red_hat_openshift_virtualization/assembly_advanced-migration-options_mtv",
        note: "Documents existing hooks and custom validation to build on.",
      },
      {
        kind: "Product precedent",
        title: "Azure Migrate test migration",
        url: "https://learn.microsoft.com/en-us/azure/migrate/tutorial-migrate-hyper-v?view=migrate",
        note: "Documents testing a replicated target while the source continues operating.",
      },
      {
        kind: "Product precedent",
        title: "Azure migration test environments",
        url: "https://learn.microsoft.com/en-us/azure/migrate/how-to-test-replicating-virtual-machines?view=migrate",
        note: "Describes isolation and cleanup considerations for a test copy.",
      },
    ],
  },
  {
    id: "security-agreement",
    topics: ["acceptance", "security", "access"],
    title: "Preview policy impact and track application decisions",
    summary:
      "Tie observed violations, owners, exceptions and scoped enforcement decisions to the exact policy revision reviewed.",
    priority: "candidate",
    applicability: "Security-policy rollout is required for acceptance",
    basis: [
      {
        kind: "problem",
        id: "security-policy-rollout",
      },
      {
        kind: "task",
        id: "acceptance",
      },
    ],
    situation:
      "Installing ACS leaves security and application teams with unresolved enforcement choices, developer agreement and policy-as-code integration work.",
    intervention:
      "For a selected policy revision and application scope, show observed violations, affected owners, proposed fixes and exceptions. Record each application's enforcement decision. Keep a trial scoped to the approved applications and mark reviews stale when the relevant policy changes. Give each exception an owner and a review or expiry decision.",
    example:
      "This policy revision matched the listed deployments. Some application owners have reviewed the proposed fixes; one decision remains open. Enforcement stays within the approved scope.",
    existing:
      "RHACS already provides policy dry runs, scope selection, enforcement choices and policy-as-code integration. These mechanisms evaluate policy; they do not settle application-owner agreement.",
    increment:
      "Connect evaluation results to a revision-specific rollout record that security and application owners can review together.",
    firstDelivery:
      "Export current policy results into a reviewable application table with owners, proposed corrections and outstanding decisions.",
    extension:
      "Integrate owner decisions, scoped enforcement and exception review into the policy workflow. Show what happens when an exception expires and which review must be repeated after a change.",
    validation:
      "Use one required baseline, representative applications and an unresolved exception. Check whether owners identify the affected change and make an informed enforcement decision. Record unresolved decisions and avoidable rework rather than treating policy deployment as acceptance.",
    limits:
      "Software cannot decide risk acceptance. Restoring a policy revision does not restore an application already stopped by enforcement. RHACS and Kubernetes admission controls have different behavior. Apply this opportunity only when the initial security baseline requires policy rollout.",
    owner: "RHACS policy management",
    contributors:
      "Application owners, security adoption, ACM and the platform administrator.",
    sources: [
      {
        kind: "Existing capability",
        title: "RHACS policy management",
        url: "https://docs.redhat.com/en/documentation/red_hat_advanced_cluster_security_for_kubernetes/4.11/html/operating/using-policies-to-provide-security",
        note: "Documents policy dry runs, scope and policy-as-code capabilities.",
      },
      {
        kind: "Product precedent",
        title: "Kyverno policy reports",
        url: "https://kyverno.io/docs/guides/reports/",
        note: "Shows resource-level policy results and audit-mode feedback.",
      },
      {
        kind: "Product precedent",
        title: "Kyverno exception expiration",
        url: "https://kyverno.io/policies/other/expiration-for-policyexceptions/expiration-for-policyexceptions/",
        note: "Provides an example lifecycle for temporary exceptions, with different enforcement semantics.",
      },
    ],
  },
];
