import type { Opportunity, Problem } from "../model";

export const problems: Problem[] = [
  {
    id: "owner-wait",
    topic: "networking",
    relatedTopics: ["dns", "hardware", "security"],
    title: "Infrastructure preparation stalls across team handoffs",
    summary:
      "The platform team waits for hardware, network access and corrected information before it can provision the cluster.",
    context:
      "2026 interviews · bare metal and vSphere · infrastructure preparation",
    evidence:
      "Teams described coordinating hardware, cabling, remote management, firewall rules, IP ranges and DNS with other owners. One account described repeated tickets when delivered network information failed reachability checks. Preparation estimates spanned weeks or months.",
    impact:
      "Provisioning waits while teams schedule work, clarify requests and correct prerequisites.",
    outcome:
      "One team reported straightforward repeat provisioning once prerequisites aligned. Physical work, approval and team scheduling still remained outside the installer.",
    limit:
      "Elapsed preparation estimates include organizational work and experimentation. They are not installer-runtime benchmarks or evidence that a new tool can remove approval and capacity constraints.",
    kind: "Reported experience",
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
    evidence:
      "Teams configured identity, certificates and their selected platform services after base installation. One team repaired stuck configuration and stale inputs before accepting the platform. Virtualization accounts also described remaining storage and workload setup.",
    impact:
      "The first workload or team handover waits for the remaining configuration to be completed and checked.",
    outcome:
      "Some teams already automate their configuration baseline. One accepts the platform after its required components are healthy, certificates work and users can log in with normal accounts. Application acceptance remains a separate check.",
    limit:
      "These accounts describe different completion boundaries. They do not establish a false ready indicator, a universal Operator bundle or a current missing-dependency defect in every installer.",
    kind: "Reported experience",
  },
  {
    id: "retry-work",
    topic: "recovery",
    relatedTopics: ["media", "hosts", "platform-operators"],
    title: "Recovering a failed build requires manual cleanup and reruns",
    summary:
      "A failed attempt can leave provisioning resources or configuration jobs that need repair before work can continue.",
    context:
      "2026 interviews · bare-metal provisioning and vSphere configuration",
    evidence:
      "One team described cleanup of provisioning resources and node disks after failed bare-metal builds. Another traced a failed post-install job from ACM into Ansible Automation Platform, repaired configuration inputs and used an indirect rerun.",
    impact:
      "Recovery requires knowledge of resources and tools beyond the initial creation workflow, adding work before the next attempt.",
    outcome:
      "The teams described ways to continue after cleanup or input correction. One found later-stage failures easier to revert. The exact cleanup and rerun procedures were not independently verified.",
    limit:
      "Reported workarounds are not supported recovery instructions. The evidence does not measure retry frequency, prove configuration was lost or establish that every failure requires a fresh installation.",
    kind: "Reported experience",
  },
  {
    id: "late-dependency",
    topic: "routing",
    relatedTopics: ["dns", "progress", "recovery", "platform-operators"],
    title: "Unmet prerequisites surface during installation or configuration",
    summary:
      "An attempt exposes connectivity or configuration inputs that must be corrected before it can proceed.",
    context:
      "2026 interviews · bare metal, Nutanix and vSphere · earlier reports retained",
    evidence:
      "Accounts described firewall and connectivity conditions affecting provisioning, regional proxy rules that allowed a workflow in one location but blocked it in another, and stale inputs that interrupted post-install configuration.",
    impact:
      "Teams investigate the failure, return work to the responsible owner and repeat the affected steps.",
    outcome:
      "The regional proxy problem reportedly worked after endpoint access was corrected. Another team repaired stale configuration inputs and reran its configuration job.",
    limit:
      "The accounts do not establish a shared root cause, that earlier checks passed or that current prerequisite validation is absent. Event versions and exact corrections are incomplete.",
    kind: "Reported experience",
  },
  {
    id: "unclear-progress",
    topic: "progress",
    relatedTopics: ["bootstrap", "hosts", "recovery", "platform-operators"],
    title:
      "Finding the failed step requires tracing resources and logs across tools",
    summary:
      "A failed-build status can leave the operator following resource relationships and external job logs to decide what to fix.",
    context:
      "2026 interviews · provisioning and ACM/AAP configuration · older status studies",
    evidence:
      "One team needed resource-level knowledge beneath simple creation controls. Another followed post-install job references into a separate automation tool to inspect logs and repair inputs. Older studies also described quiet intervals and unclear reboot transitions.",
    impact:
      "The operator must locate the responsible component and relevant evidence before choosing whether to wait, repair or rerun.",
    outcome:
      "Search and resource views helped one team investigate. Another found native provisioning errors understandable but needed additional investigation for the external configuration job.",
    limit:
      "The recent evidence concerns specific diagnostic workflows, not every progress display or a confirmed local Agent CLI defect. Quiet-interval findings remain historical and do not provide a completion-time benchmark.",
    kind: "Reported experience",
  },
  {
    id: "offline-content",
    topic: "disconnected",
    relatedTopics: ["content", "image-access"],
    title: "Preparing mirrored content adds work to disconnected deployment",
    summary:
      "Teams using a mirror-based workflow must prepare the required images and registry before installing at a restricted site.",
    context:
      "2026 partner call notes · disconnected deployments · installer unspecified",
    evidence:
      "Partner-reported accounts identified mirror-registry setup as a difficulty in disconnected cluster deployment. Separate maintenance accounts described checking Operator dependencies and updating mirrored content for upgrades.",
    impact:
      "Content preparation adds setup work before deployment and creates a separate maintenance responsibility.",
    outcome:
      "The partner requested an offline package and described continued use of its existing mirror-based workflow. A separate maintenance account reported improved mirroring reliability after changing tool versions.",
    limit:
      "The partner notes are copied meeting summaries, not observed installation runs. Initial setup and later updates are separate accounts. They do not establish that every current installation path requires an external registry or that a proposed bundle resolved the difficulty.",
    kind: "Reported experience",
  },
  {
    id: "feasibility",
    topic: "hardware",
    relatedTopics: ["physical-storage", "topology", "approach"],
    title:
      "Existing hardware may not fit the planned workload and storage design",
    summary:
      "Missing connections, limited capacity or storage assumptions can prevent a planned workload from running on the available equipment.",
    context:
      "2025–2026 accounts · physical pilots, planned deployments and labs",
    evidence:
      "Accounts described storage links or adapters still needing work, purchased hardware that did not match the proposed storage design, and virtualization requirements that exceeded comfortable lab capacity.",
    impact:
      "Customers can invest in setup before discovering that the intended workload needs different equipment, capacity or a revised design.",
    outcome:
      "Some accounts remained in evaluation or planning. The collection does not establish completed corrections for every hardware or capacity mismatch.",
    limit:
      "These accounts are not sizing benchmarks or universal storage-product requirements. Service-model restrictions, procurement and funding are separate feasibility decisions and should be identified explicitly.",
    kind: "Reported experience",
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
      "2025 accounts · bare-metal Assisted setup and VM storage configuration",
    evidence:
      "A bare-metal Assisted user still needed a default storage class and guidance for the existing storage integration after selecting virtualization. In a separate account, a copied storage-profile example did not support the required live migration.",
    impact:
      "A VM can remain blocked on storage setup, or a working VM can fail a required maintenance operation.",
    outcome:
      "The migration account described correcting its storage profile after a console hint identified the mismatch. Completion of the other account’s storage integration was not established.",
    limit:
      "These are conditional examples of remaining workload configuration, not additional independent confirmation of every readiness problem. Migration matters only where required. The accounts establish neither a universal access-mode rule nor a current defect on the reference release.",
    kind: "Reported experience",
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
    evidence:
      "Accounts described discovering the Operator-managed configuration needed for a familiar bridge task, understanding namespace-scoped network attachments and learning network/storage interactions through lab experimentation.",
    impact:
      "Workload connectivity takes additional configuration and specialist help after base installation.",
    outcome:
      "Participants described finding configuration paths and learning through experimentation. The collection does not establish a successful end-to-end result for every reported networking task.",
    limit:
      "The accounts concern different configurations and releases. They do not establish one shared networking defect or imply that every VM requires the same bridge or Operator.",
    kind: "Reported experience",
  },
  {
    id: "effective-access",
    topic: "access",
    relatedTopics: ["workloads", "acceptance"],
    title: "Administrators struggle to determine what a user can actually do",
    summary:
      "Permissions inherited through groups and cluster or namespace bindings make access difficult to explain and troubleshoot.",
    context:
      "2025 · nine OpenShift interview participants · mixed platforms",
    evidence:
      "Interview participants described manual auditing of effective permissions and difficulty identifying the roles behind permission-denied responses. Some used Git-managed configuration and the UI for investigation; others fell back on broad default roles.",
    impact:
      "Administrators spend effort tracing permissions and cannot confidently verify delegated tasks from the role names alone.",
    outcome:
      "Participants used manual checks, configuration inspection and existing administration tools. The study does not establish that later design proposals resolved the difficulty.",
    limit:
      "Interview findings are distinct from the study’s prototype tasks. They do not establish a bare-metal installation failure, a faulty authorization engine or that every receiving user lacks required access.",
    kind: "Reported experience",
  },
  {
    id: "network-layers",
    topic: "addressing",
    relatedTopics: ["networking"],
    title: "Network setup questions can be interpreted at the wrong layer",
    summary:
      "Customers can mistake cluster-internal address questions for changes to physical switches or firewalls.",
    context:
      "2025 virtualization onboarding · partner-relayed customer account",
    evidence:
      "A partner described a customer interpreting machine, pod and service network questions as physical infrastructure work. The account illustrates difficulty mapping existing networking knowledge to OpenShift concepts.",
    impact:
      "The customer can pursue unnecessary infrastructure changes or need clarification before completing configuration.",
    outcome:
      "The account records the misunderstanding but does not establish a measured delay or a verified final configuration.",
    limit:
      "This is bounded, partner-relayed evidence. Separate firewall coordination and VM attachment problems do not independently corroborate this comprehension issue.",
    kind: "Reported experience",
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
      "Historical VMware account and 2022 field reports · current validation needed",
    evidence:
      "A team with no-DHCP VLAN constraints selected UPI and maintained custom documentation. Historical field reports also described confusion among installation choices.",
    impact:
      "Choosing and documenting an applicable workflow adds effort before installation.",
    outcome:
      "The team established a local UPI path. More recent platform-transition accounts describe extra creation and import steps, which are a separate workflow-fragmentation concern.",
    limit:
      "The evidence does not establish that static addressing currently requires UPI. Platform switching is not independent confirmation that users cannot choose among present-day bare-metal installers.",
    kind: "Historical evidence",
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
    evidence:
      "Participants struggled to interpret ISO generation and delivery choices. Host identification and discovery approvals also needed explanation in the tested workflows.",
    impact:
      "Participants could not confidently move from the generated artifact to the intended ready hosts.",
    outcome:
      "Later lab accounts described successful Assisted media generation and base installation. Those accounts do not establish whether every earlier usability issue was resolved.",
    limit:
      "These are historical usability findings, not a demonstrated current physical-boot defect. Validate the selected delivery and discovery workflow before proposing a change.",
    kind: "Historical evidence",
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
      "Choose one disconnected scenario and produce an explicit content and transfer plan, including local instructions and a handoff for updates.",
    existing:
      "Mirroring, improved oc-mirror workflows and a documented self-contained-media path already exist. Compare their coverage before proposing new packaging.",
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
      "Observe the current workflow and distinguish a healthy wait from a failed provisioning or configuration step. Preserve existing status explanations that already help operators.",
    measure:
      "Time to find the failed component, correct wait-versus-repair decisions and successful handoff to the responsible owner.",
    basis: [
      {
        kind: "problem",
        id: "unclear-progress",
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
    topics: ["platform-operators", "completion", "workloads", "access"],
    title: "Carry the intended workload across the installation boundary",
    summary:
      "Show the configuration and verification still needed between base installation and the intended platform or workload.",
    intervention:
      "Start with one supported workload scenario. Connect identity, certificates, required services, workload configuration, owners and verification across creation and post-install workflows.",
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
      "Choose one delegated VM or workload task. Explain the relevant identity, role and scope, then verify the intended action with the receiving user.",
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
    ],
  },
  {
    id: "confidence-rehearsal",
    topics: ["acceptance", "backups", "storage-drivers"],
    title: "Demonstrate customer-specific readiness",
    summary:
      "Replace assumed readiness with evidence from the customer’s required behavior.",
    intervention:
      "Agree a small acceptance plan for a representative workload and selected maintenance or recovery scenario. Record results, limits and ownership.",
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
      "Observe a representative diagnostic task without installation specialists guiding every step. Establish whether there is a knowledge, access or tool-navigation gap; do not assume a failed handover.",
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
