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
    ],
    title: "Remove avoidable infrastructure prerequisites",
    summary:
      "Compare supported deployment paths by the total work each requires, including the first workload and later operation.",
    priority: "candidate",
    applicability: "Deployment planning",
    basis: [
      { kind: "problem", id: "method-choice" },
      { kind: "problem", id: "owner-wait" },
      { kind: "problem", id: "feasibility" },
      { kind: "problem", id: "offline-content" },
    ],
    intervention:
      "For one constrained site, identify which external requests, services or content-hosting arrangements each supported path removes, retains or moves to another owner. Include available hardware, storage connections and the intended workload. Distinguish unsupported, insufficient and unverified conditions, including what a small pilot cannot prove.",
    existing:
      "Installer alternatives and feasibility guidance already exist. Self-contained installation is generally available from OCP 4.22.18 and removes the initial external-registry requirement for its supplied content. Storage Operators are excluded, and later content still needs delivery. DNS timing depends on the method and networking mode; do not assume the same deferral on every path.",
    alternative:
      "Use a short comparison of supported paths and their owner responsibilities before building another selection interface.",
    investigate:
      "Compare two applicable paths with the infrastructure owners for one actual customer goal. Check the complete preparation, first-use and operating work, including funding, approvals and planned purchases. Confirm the exact release and support boundaries.",
    measure:
      "External requests actually removed, new work introduced, consequential fit gaps found early and whether the intended workload remains achievable.",
    stopWhen:
      "Reject a path that shifts a larger burden into storage, access or ongoing operation, or violates a fixed site requirement. Keep existing guidance if it resolves the decision.",
    owners:
      "Installer architecture, field engineering and the customer's infrastructure owners.",
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
    title: "Verify prerequisites in the actual environment",
    summary:
      "Give each owner a precise request and a check from the host or component that needs the dependency.",
    priority: "recommended",
    applicability: "Infrastructure preparation",
    basis: [
      { kind: "problem", id: "owner-wait" },
      { kind: "problem", id: "late-dependency" },
      { kind: "problem", id: "network-layers" },
    ],
    intervention:
      "Connect a request to its consumer, destination, responsible owner and completion condition. Return the expected and observed result with the check's location, time and configuration. Keep waiting, approval, declared completion, verified behavior and unknown conditions distinct. Preliminary checks can help work proceed while physical preparation continues, but do not prove the final host or workload path.",
    existing:
      "Assisted and Agent workflows already provide configuration and prerequisite checks. First establish their coverage for the selected method. Machine-local commissioning and environment-checking tools elsewhere demonstrate useful evidence patterns; they do not prove a missing OpenShift validator.",
    alternative:
      "Compare a clearer request template and a scheduled session with the infrastructure owners before adding tooling to the customer's existing ticket or inventory system.",
    investigate:
      "Observe one real prerequisite request and its correction loop. Compare current guidance with an owner-specific request and an applicable check. Test from the relevant environment; a successful laptop request does not establish target-host connectivity. Identify whether delay comes from ambiguity, incorrect delivery, capacity or approval.",
    measure:
      "Clarification cycles, active rework, false assurances and time from a detectable failure to useful owner action. Record external queue time separately.",
    stopWhen:
      "Ship a request or documentation correction if that solves the task. Do not expand a validator when staffing, procurement or approval accounts for the remaining wait.",
    owners:
      "Installer validation, infrastructure enablement and the team responsible for each dependency.",
  },
  {
    id: "first-workload",
    topics: [
      "workloads",
      "platform-operators",
      "completion",
      "storage",
      "storage-drivers",
      "physical-storage",
      "workload-network",
      "networking",
      "addressing",
      "configuration",
      "access",
    ],
    title: "Complete the intended first workload",
    summary:
      "Follow one customer's workload through the remaining configuration and actual use, keeping its project and unproven requirements visible.",
    priority: "recommended",
    applicability: "First workload; strongest evidence is virtualization",
    basis: [
      { kind: "problem", id: "missing-dependencies" },
      { kind: "problem", id: "storage-not-usable" },
      { kind: "problem", id: "workload-network-gap" },
      { kind: "problem", id: "first-vm-blocked" },
      { kind: "problem", id: "feasibility" },
      { kind: "problem", id: "network-layers" },
      { kind: "task", id: "acceptance" },
      { kind: "task", id: "backups" },
    ],
    intervention:
      "Start with the operation the customer needs. Connect its actual storage, network, image, capacity and user dependencies in a small, inspectable sequence. Keep project context visible and mark unobserved physical segments. Distinguish installed components, configured services, a running workload and accepted application behavior. Add maintenance or recovery checks only where the agreed outcome requires them.",
    existing:
      "VM creation, Operator setup, storage profiles and storage checkups already address parts of this task. The general Virtualization cluster-checkup framework is Technology Preview; verify the exact check's support status before making it a production acceptance dependency. Newer research reports project-selector changes, but their effect on the applicable build must be tested. Existing hints and automation have already helped customers succeed.",
    alternative:
      "Compare targeted wording or project-context corrections and a short supported task recipe with a guided sequence. Preserve the customer's existing configuration tools.",
    investigate:
      "Observe one real customer's unresolved first-workload path before constructing a test. Reproduce a demonstrated boundary, such as an incomplete storage profile, in a lab. Test other boundaries separately. Verify reported fixes before redesigning the flow. Investigate the reservation error independently; clearer configuration choices do not establish its cause or remedy.",
    measure:
      "Successful intended tasks, wrong-project or wrong-layer actions, missed dependencies, specialist help and accurate understanding of what remains untested. A bootable sample does not prove application readiness or availability.",
    stopWhen:
      "Keep the smallest current-flow correction that resolves the observed task. Do not impose a universal Operator bundle or extend one successful sample into a production-readiness claim.",
    owners:
      "A shared onboarding lead with virtualization, storage, networking and workload owners.",
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
    title: "Diagnose a failed attempt and continue safely",
    summary:
      "Connect the failed task to its responsible resource, actual inputs, diagnostic evidence and next supported action.",
    priority: "recommended",
    applicability: "Failed provisioning or configuration",
    basis: [
      { kind: "problem", id: "unclear-progress" },
      { kind: "problem", id: "retry-work" },
      { kind: "problem", id: "late-dependency" },
      { kind: "problem", id: "image-distribution-timeout" },
      { kind: "problem", id: "first-vm-blocked" },
      { kind: "problem", id: "misleading-health" },
    ],
    intervention:
      "Preserve the path from the requested task to a resource or external job, its inputs, relevant events and owner. Show what changed before the next action. Distinguish an observed condition, a suspected cause and an unresolved investigation. Keep continued monitoring, supported repair and a planned new installation separate.",
    existing:
      "Agent diagnostics, provisioning errors and AAP job output and relaunch already exist. AAP relaunch reapplies prompts and can use current template defaults; it is not necessarily an identical replay. Recorded alert defects have fix follow-up, so verify the relevant build before adding explanations around a faulty status. There is no universal safe resume.",
    alternative:
      "Try a contextual link to the failing job and a maintained recovery recipe before building another diagnostic console or attempt-history view.",
    investigate:
      "Begin with the reported vSphere ACM-to-AAP configuration failure and a controlled invalid input in a lab. Find the job, inspect the failure, review the input change and use the supported rerun. Then test the actual bare-metal route before generalizing. Separately investigate the VM reservation blocker using the exact error, release, VM specification, events and resources. Retain an explicit unknown if that evidence is unavailable.",
    measure:
      "Time to the correct component, supported action selection, unnecessary repeated work and useful escalation. Keep the Nutanix image-staging account separate from bare-metal image pulling and mirroring.",
    stopWhen:
      "Keep a link or error-message correction if it resolves the burden. Do not infer Agent recovery behavior from an AAP experiment or turn reported finalizer removal and disk cleanup into general instructions.",
    owners:
      "Provisioning, ACM, AAP and support owners; Virtualization engineering for the reservation blocker and health-status follow-up.",
  },
  {
    id: "reusable-deployment-configuration",
    topics: ["configuration"],
    title: "Reuse a working deployment configuration",
    summary:
      "Prepare another site or bounded release change with reviewable differences and maintained examples that fit the team's automation.",
    priority: "candidate",
    applicability: "Repeated deployments or release adaptation",
    basis: [
      { kind: "problem", id: "repeatable-configuration" },
      { kind: "problem", id: "method-choice" },
      { kind: "problem", id: "missing-dependencies" },
    ],
    intervention:
      "Start from a working recipe. Separate reusable choices from site values and secret references, show where each value comes from and produce the inputs its actual consumer needs. Maintain a tested example for a specific route and release pair, with a named maintainer and explicit unresolved compatibility questions.",
    existing:
      "Customers already use working playbooks, installation files, ACM templates and Git-managed configuration. Current template and automation tools can produce reviewable output. Some teams require inspection or internal approval before applying configuration, and field connectivity can make continuous GitOps unsuitable.",
    alternative:
      "A precise variable reference and maintained integration example may solve the task without a recipe generator.",
    investigate:
      "Compare the current recipe, clearer documentation and a small generator on one next-site deployment and one bounded release change. Use the customer's actual review process, source of truth and connectivity. Do not promise automatic conversion or compatibility beyond the exercised case.",
    measure:
      "Correct site substitutions, preserved customization, identified release-dependent changes, usable reviewed output and maintenance effort for the example itself.",
    stopWhen:
      "Prefer the maintained example when automation adds little value to a low-frequency workflow. Stop expanding release coverage when it cannot be maintained and verified.",
    owners:
      "Configuration tooling, integration documentation and a named maintainer of each supported example.",
  },
  {
    id: "offline-outcome-kit",
    topics: ["content", "disconnected", "image-access"],
    title: "Prepare offline content through first use",
    summary:
      "Check that the destination can supply the selected workload's content and the tools needed to investigate a failure.",
    priority: "candidate",
    applicability: "Disconnected or restricted environments",
    basis: [
      { kind: "problem", id: "offline-content" },
      { kind: "task", id: "support" },
    ],
    intervention:
      "Define the release, applicable Operators, workload or guest images, diagnostic collector images and local instructions needed for one outcome. Check completeness before dispatch and at the destination. Keep downloaded, transferred, imported and consumable content distinct, with artifact identity visible.",
    existing:
      "oc-mirror v2 provides inventory and failure information, and some customers already have working distribution across permitted hops. A mirror-to-disk dry run checks the local cache; some Operator-image failures are logged while processing continues. Neither proves destination usability. Self-contained installation removes only the initial registry requirement for its supplied content.",
    alternative:
      "Add a completeness explanation around existing mirroring and transfer tools. Test a manifest or receipt at a real boundary before requiring another bundle or transfer system.",
    investigate:
      "Rehearse one selected offline workload with a required artifact missing and online documentation unavailable. Include the applicable support collector and local instructions. Compare with the customer's current workflow and identify the exact content that must be requested through an approved path.",
    measure:
      "Missing content at destination, repeated transfers, successful local tasks and preparation or maintenance effort. Keep content approval and management reachability separate.",
    stopWhen:
      "Retain the current system if it already completes the task reliably. Do not use a successful archive transfer or mirror command as a readiness guarantee.",
    owners:
      "Disconnected installation, content distribution and support enablement for the selected workload.",
  },
  {
    id: "rehearse-access",
    topics: ["access"],
    title: "Verify delegated access through a real task",
    summary:
      "Follow a user's identity, groups, permissions and project context through the action they need to perform.",
    priority: "candidate",
    applicability: "Delegated administration or team access",
    basis: [
      { kind: "problem", id: "identity-group-integration" },
      { kind: "problem", id: "effective-access" },
    ],
    intervention:
      "Explain the first known failing boundary from identity-provider recognition and group synchronization through bindings, namespace, authorization and the console action. Identify who owns the correction and prepare a reviewable change in the team's source of truth.",
    existing:
      "LDAP synchronization supports previews and automation. Role bindings and authorization checks already exist. A scoped authorization answer does not prove admission, quota or runtime success. Impersonation requires authority and explicit group context; a username alone does not reproduce a complete login.",
    alternative:
      "Use existing authorization tools with a task-specific explanation before adding another role or permissions view.",
    investigate:
      "Observe an ordinary user performing a defined task in the intended project. Distinguish identity synchronization, missing permissions, navigation and workload dependencies. Test with the user's actual privileges and respect Git-owned configuration where applicable.",
    measure:
      "Task completion at intended privilege, correct explanation of a denial and fewer unnecessary role changes.",
    stopWhen:
      "Keep a focused explanation or navigation correction if it resolves the problem. Do not grant broad administrator access to compensate for an unexplained failure.",
    owners:
      "Identity, RBAC and console teams with the customer's access administrator.",
  },
  {
    id: "diagnostic-handover",
    topics: ["support", "acceptance", "operations"],
    title: "Enable the operating team to collect evidence and escalate",
    summary:
      "Use a representative diagnostic task to identify missing knowledge, access, collector content or support arrangements.",
    priority: "candidate",
    applicability: "Operations and support preparation",
    basis: [
      { kind: "problem", id: "support-evidence-gap" },
      { kind: "problem", id: "operating-knowledge-gap" },
      { kind: "problem", id: "misleading-health" },
      { kind: "task", id: "operations" },
    ],
    intervention:
      "Guide the receiving operator through collecting and reviewing applicable evidence, recording attempted corrections and requesting inaccessible infrastructure information from its owner. Confirm the support route and entitlement. Include a case where accurate escalation is the useful outcome.",
    existing:
      "Agent logs, must-gather, feature-specific collector images and support processes already exist. Some infrastructure is outside the operator's access. Restricted environments need the relevant collector content and local instructions prepared in advance. Expert escalation can be appropriate.",
    alternative:
      "Compare existing instructions alone with the same instructions plus one observed support exercise before building a new collection interface.",
    investigate:
      "Have someone other than the original builder perform a realistic diagnostic task with their actual access. Separate unfamiliar tools, unavailable permissions, missing collector images and support-entitlement barriers. Verify applicable status fixes rather than teaching a workaround around a corrected defect.",
    measure:
      "Useful evidence collected, accurate ownership and escalation, and tasks completed without the original builders guiding each step. Separate collection work from support queue time.",
    stopWhen:
      "Keep a runbook or training exercise if it resolves the task. Do not treat every escalation as failed handover or assume a collector can obtain inaccessible infrastructure evidence.",
    owners:
      "Support enablement, the receiving operations team and external infrastructure owners.",
  },
  {
    id: "migration-preparation",
    topics: ["workloads"],
    title: "Prepare an existing workload for migration",
    summary:
      "Check the source, guest, mappings and application preparation before treating a healthy target cluster as sufficient.",
    priority: "candidate",
    applicability: "Migration is the intended first workload",
    basis: [
      { kind: "problem", id: "migration-workload-readiness" },
      { kind: "problem", id: "workload-network-gap" },
    ],
    intervention:
      "Make migration a distinct goal at intake. Connect source and target compatibility, guest devices, disk conversion, storage and network mappings, and application pre/post actions. Separate unsupported, unverified and ready-to-test conditions.",
    existing:
      "MTV already provides mappings and inspection. Deep Inspection in MTV 2.12 is Technology Preview; neither inspection nor a healthy target proves that the application will start and function after a move.",
    alternative:
      "Use the existing migration assessment with a supported preparation example before creating another assessment tool.",
    investigate:
      "Select one real migration task on a supported path and rehearse it in a lab. Verify application startup and connectivity after the move. Keep the source and guest-specific findings separate from installing OpenShift on a hypervisor.",
    measure:
      "Consequential blockers found before migration effort, correct mappings and successful intended application behavior.",
    stopWhen:
      "Stop at the supported evidence boundary when a source or guest is incompatible. Do not expand first-workload preparation into a general fleet-migration program.",
    owners: "Migration tooling, Virtualization and the application owner.",
  },
  {
    id: "security-agreement",
    topics: ["acceptance", "security", "access"],
    title: "Agree and validate the initial security baseline",
    summary:
      "Help security and application teams test policy effects and agree enforcement when it is part of initial acceptance.",
    priority: "candidate",
    applicability: "Security-policy rollout is required for acceptance",
    basis: [
      { kind: "problem", id: "security-policy-rollout" },
      { kind: "task", id: "acceptance" },
    ],
    intervention:
      "Agree policy intent, affected applications, exception ownership and the enforcement decision. Use a scoped trial with representative workloads to prepare a reviewable change and the product's supported reversal procedure.",
    existing:
      "RHACS already provides policy dry runs and enforcement choices. Kubernetes admission controls have separate behavior and are not interchangeable. Deploying a security component does not settle policy agreement or prove workload compatibility.",
    alternative:
      "Use current policy tools with a joint application-team working session before adding a guided rollout interface.",
    investigate:
      "Compare current tooling and a facilitated policy trial on one required baseline. Identify whether the remaining work is technical configuration, missing guidance or agreement among the responsible teams.",
    measure:
      "Unresolved policy disagreements, avoidable configuration rework and completion of the agreed rollout task.",
    stopWhen:
      "Keep the working session or documentation correction if it is sufficient. Do not make policy rollout a prerequisite for customers whose initial acceptance does not require it, or imply that software can decide risk acceptance.",
    owners:
      "Security adoption and application-team representatives with the platform administrator.",
  },
];
