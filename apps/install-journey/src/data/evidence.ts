import type { Opportunity, Problem } from "../model";

export const problems: Problem[] = [
  {
    id: "network-layers",
    topics: ["networking", "addressing"],
    title: "Physical and cluster networks get confused",
    summary:
      "Customers can apply familiar networking concepts at the wrong layer.",
    context:
      "2025–2026 accounts, including an existing VLAN and static-address environment.",
    evidence:
      "One account describes interpreting machine, pod and service network questions as physical switch/firewall work. Another describes difficulty mapping existing VLANs and static addresses to cluster workloads.",
    impact:
      "Unnecessary infrastructure work and difficulty establishing workload connectivity.",
    limit:
      "Different customer situations motivate a translation problem. They do not establish that static addressing requires one particular installer.",
    kind: "Reported experience",
  },
  {
    id: "owner-wait",
    topics: ["handoffs", "networking", "dns", "dns-consumers", "managed-dns"],
    title: "The installation owner cannot complete every prerequisite",
    summary:
      "Progress depends on specialists and approvals outside the installer.",
    context:
      "2026 accounts covering network-team dependencies and disconnected-environment planning.",
    evidence:
      "One team depended on a busy network team. Another described separate cybersecurity approval and funding gates for proposed environments.",
    impact:
      "Preparation can remain unfinished even when the platform team knows what it needs.",
    limit:
      "Waiting, approval and incorrect technical configuration are separate conditions. The research supplies no measured installation delay for these cases.",
    kind: "Reported experience",
  },
  {
    id: "feasibility",
    topics: ["hardware", "physical-storage"],
    title: "Available infrastructure does not establish workload fit",
    summary:
      "Missing connectivity, capacity or a mismatched storage design can block the intended outcome.",
    context:
      "Mixed physical-pilot, planned-deployment and home-lab contexts, 2025–2026.",
    evidence:
      "Accounts describe missing storage links/cards, purchased hardware that did not match the proposed Ceph-oriented storage assumptions, and demanding virtualization and storage requirements in labs.",
    impact:
      "The first workload or adoption decision remains blocked after substantial planning or setup.",
    limit:
      "These accounts are not a sizing benchmark and do not establish a universal storage product requirement. Procurement and funding cannot be fixed by installer automation alone.",
    kind: "Reported experience",
  },
  {
    id: "method-choice",
    topics: ["approach", "assisted", "agent-based", "ipi", "upi"],
    title: "The installation path is hard to choose under fixed constraints",
    summary:
      "Customers assemble their own interpretation of the applicable workflow.",
    context: "A VMware environment and historical field reports from 2022.",
    evidence:
      "No-DHCP VLAN constraints led one team to a UPI path and custom documentation. Historical field reports described confusion among installation choices.",
    impact:
      "Customers spend effort filtering documentation and maintaining local instructions.",
    limit:
      "The VMware account is adjacent evidence. It does not establish that static addressing currently requires UPI or that a newer method cannot meet the need.",
    kind: "Historical evidence",
  },
  {
    id: "offline-content",
    topics: ["content", "disconnected"],
    title: "Content preparation extends beyond an installation image",
    summary:
      "Restricted sites need compatible artifacts, approved transfers and usable local instructions.",
    context: "Restricted and disconnected environments, 2025–2026.",
    evidence:
      "Accounts describe maintaining OCI distribution across zones, difficulty preparing a mirror registry, and analyzing Operator dependencies when preparing mirrored content.",
    impact:
      "Content completeness and delivery become prerequisites for installation and later operations.",
    limit:
      "Standard Agent media and a documented self-contained workflow have different requirements. These accounts do not establish that every current path needs an external installation registry.",
    kind: "Reported experience",
  },
  {
    id: "boot-handoff",
    topics: ["media", "management"],
    title: "Generating media leaves the physical next step unclear",
    summary:
      "Users need to understand delivery, boot, discovery and host identification.",
    context: "Mostly 2021–2022 internal or mixed usability studies.",
    evidence:
      "Participants struggled to interpret ISO generation and whether URL copying, downloading and hosting were alternatives or consecutive tasks. Host identity and discovery approvals added confusion.",
    impact:
      "The user cannot confidently move from an artifact to ready physical hosts.",
    limit:
      "More recent lab accounts describe successful Assisted media generation and base installation. The old usability findings require current validation.",
    kind: "Historical evidence",
  },
  {
    id: "physical-evidence-gap",
    topics: ["hosts", "bootstrap", "management"],
    title: "Current physical execution needs closer observation",
    summary:
      "The corpus is stronger on preparation and workload readiness than on physical installation execution.",
    context: "Installation synthesis, 6 October 2026.",
    evidence:
      "The qualifying execution accounts establish no customer-specific incident confirmed to combine physical OCP nodes with Assisted or Agent-based Installer. BMC, firmware and boot delivery are particularly thin.",
    impact:
      "Engineering needs direct observation before treating a plausible failure mode as a demonstrated current defect.",
    limit:
      "Absence of a qualifying incident in this collection is not evidence that these installations are trouble-free.",
    kind: "Research gap",
  },
  {
    id: "unclear-progress",
    topics: ["progress", "bootstrap", "hosts"],
    title: "Users cannot confidently interpret installation progress",
    summary: "Quiet intervals and noisy logs obscure whether to wait or act.",
    context:
      "A 2026 Nutanix environment, alongside Assisted and other accounts from 2022.",
    evidence:
      "One team described stressful setup logs. Historical reports describe little useful status during long waits and after reboot, and failure messages without enough explanation.",
    impact:
      "The operator depends on experts or cannot identify an appropriate next action.",
    limit:
      "The recent account is not a confirmed physical Agent installation. Historical findings do not establish the same current defect; reported times are not installation benchmarks.",
    kind: "Reported experience",
  },
  {
    id: "late-dependency",
    topics: ["routing", "progress", "dns", "recovery"],
    title: "A dependency failure appears after time has been invested",
    summary:
      "The running attempt reveals network, DNS or proxy work that must return to another team.",
    context: "2021–2022; exact platform and installer often unspecified.",
    evidence:
      "One account describes hours of cluster creation before a network problem sent work back to infrastructure owners. Other historical reports describe delayed proxy discovery and unmet network/DNS requirements.",
    impact: "Failed attempts create a correction and retry cycle across teams.",
    limit:
      "These reports do not prove current validation is absent, that earlier checks passed, or that all cases share a root cause.",
    kind: "Historical evidence",
  },
  {
    id: "retry-work",
    topics: ["recovery", "media"],
    title: "Another attempt repeats work and loses context between teams",
    summary:
      "Correction, configuration preservation and a subsequent attempt need a clear handoff.",
    context: "2021–2022 reports; exact recovery stages unrecorded.",
    evidence:
      "The research records repetitive creation and infrastructure correction, plus manual backup of installation configuration for reuse.",
    impact:
      "Repeated setup consumes effort and makes investigation harder to carry across attempts.",
    limit:
      "Retry counts, recoverable stages, actual configuration loss and avoidable repetition were not measured.",
    kind: "Historical evidence",
  },
  {
    id: "missing-dependencies",
    topics: ["workloads", "completion"],
    title:
      "The cluster appears ready before workload dependencies are complete",
    summary:
      "Successful base installation can leave the intended workload unfinished.",
    context: "2025 pilot and bare-metal Assisted installation accounts.",
    evidence:
      "One pilot missed required virtualization components whose names were not enumerated. Another team expected working storage after choosing the virtualization add-on, but still had storage configuration to perform.",
    impact:
      "The first intended workload stalls after the user expects to be finished.",
    limit:
      "A successful cluster is a real milestone. The evidence does not establish one universal Operator bundle or a reproduced current missing-dependency defect.",
    kind: "Reported experience",
  },
  {
    id: "storage-not-usable",
    topics: ["storage", "storage-drivers"],
    title: "Virtualization is installed, but storage is not usable",
    summary:
      "The storage integration and default class still require work after the console is available.",
    context: "March 2025 · explicitly bare metal and Assisted Installer.",
    evidence:
      "After choosing the virtualization add-on, the participant still had to configure a default storage class and wanted guidance for the existing storage integration.",
    impact:
      "The user’s expected finish line and the delivered workload readiness do not match.",
    limit:
      "Suggested IBM/Dell provider paths were examples, not confirmed array inventories. This account does not establish that the same gap persists on the reference release.",
    kind: "Reported experience",
  },
  {
    id: "storage-behavior-gap",
    topics: ["storage-behavior", "storage-drivers"],
    title: "A storage example does not support the intended operation",
    summary:
      "A configuration that looks valid can fail the customer’s migration requirement.",
    context:
      "Bare-metal account; exact release and full storage configuration not established.",
    evidence:
      "A copied storage-profile example did not fit live migration. The customer changed the configuration after the UI indicated a mismatch.",
    impact:
      "The workload cannot perform a required maintenance or migration action.",
    limit:
      "This is a scenario-specific account, not a universal access-mode rule or a general guarantee that another setting enables migration.",
    kind: "Reported experience",
  },
  {
    id: "workload-network-gap",
    topics: ["workload-network"],
    title: "Familiar networking requires unfamiliar cluster configuration",
    summary:
      "Bridges, attachments and project scope complicate connecting a workload.",
    context: "Mixed bare-metal and shared OpenShift evidence; versions vary.",
    evidence:
      "Accounts describe translating a Linux bridge task into Operator-managed configuration, working with namespace-scoped attachments, and learning network/storage interactions through disruptive lab experimentation.",
    impact:
      "Customers struggle to connect workloads and may repeatedly seek specialist help.",
    limit:
      "These are related learning and integration problems, not proof of one shared defect. Physical configuration remains partly outside cluster visibility.",
    kind: "Reported experience",
  },
  {
    id: "effective-access",
    topics: ["access"],
    title: "Configured roles do not make effective access obvious",
    summary:
      "The receiving user still cannot identify or perform the intended action.",
    context:
      "Shared OpenShift/virtualization evidence; not all cases establish bare metal.",
    evidence:
      "Participants struggled to identify roles for specific operations and to trace inherited permissions across group, namespace, cluster and management scopes.",
    impact:
      "Delegation and everyday workload tasks remain difficult after access has been configured.",
    limit:
      "Reported bindings were not independently verified. Do not treat these accounts as proof of a single authorization defect.",
    kind: "Reported experience",
  },
  {
    id: "readiness-unproven",
    topics: ["acceptance", "storage-behavior", "backups"],
    title: "A running workload leaves recovery and continuity unproven",
    summary:
      "Customers need evidence of behavior under failure and maintenance before relying on it.",
    context:
      "Acceptance requirements in labs and planned production handovers.",
    evidence:
      "Teams wanted to test host/storage loss, service continuity without Internet access, backups and maintenance migration. A functioning first workload did not settle those requirements.",
    impact: "Production acceptance and operating confidence remain incomplete.",
    limit:
      "These are stated requirements, not documented production outages or failed disaster-recovery exercises. Acceptance criteria vary by customer.",
    kind: "Acceptance requirement",
  },
  {
    id: "handover-knowledge",
    topics: ["acceptance", "operations"],
    title: "The receiving team has not inherited the operating knowledge",
    summary:
      "Installation expertise can remain concentrated in the original builders.",
    context: "Mixed customer, pilot and lab contexts, 2025–2026.",
    evidence:
      "One account describes knowledge concentrated in the original team. Other pilot and lab accounts highlight diagnostic and handover needs for teams learning OpenShift.",
    impact:
      "The environment can be running while its operators still depend on specialists for routine diagnosis.",
    limit:
      "These accounts establish a learning and ownership burden; they do not demonstrate a particular production outage.",
    kind: "Reported experience",
  },
  {
    id: "upgrade-dependencies",
    topics: ["upgrades", "operations"],
    title: "Add-on dependencies complicate otherwise smooth upgrades",
    summary:
      "Networking, storage and third-party Operators change the whole-deployment upgrade task.",
    context: "Reported accounts with incomplete versions and root causes.",
    evidence:
      "Accounts describe a network attachment blocking an upgrade, storage/CSI complications, and third-party Operator removal/reinstallation while core upgrades worked well.",
    impact:
      "Teams must investigate dependencies and coordinate extra change work.",
    limit:
      "Preserve the positive core-upgrade reports. The accounts do not establish a common root cause or a current defect in every integration.",
    kind: "Reported experience",
  },
  {
    id: "secret-recovery",
    topics: ["backups", "operations"],
    title: "Recreating the cluster may leave secret restoration unresolved",
    summary:
      "A reproducible deployment also needs a secure way to recover its credentials.",
    context:
      "Recovery planning requirement; no completed failed recovery recorded.",
    evidence:
      "The team had not settled how secrets would be restored when reconstructing clusters and considered manual setup a possible disaster-recovery blocker.",
    impact:
      "Configuration replay alone does not establish a complete recovery path.",
    limit:
      "This is an unresolved requirement, not evidence of data loss or an observed failed restore.",
    kind: "Acceptance requirement",
  },
];

export const opportunities: Opportunity[] = [
  {
    id: "network-translation",
    topics: ["networking", "addressing", "workload-network"],
    title: "Explain the network from the customer’s starting point",
    summary:
      "Connect the familiar site network to the cluster and workload configuration it requires.",
    problems: ["network-layers", "workload-network-gap"],
    intervention:
      "Start with one existing-VLAN workload scenario. Show the physical-to-workload path, the responsible owner at each layer and the applicable configuration.",
    existing:
      "Existing capabilities include network configuration tools and VM networking flows. The proposed increment is explanation and verification across the whole path.",
    investigate:
      "Observe the current supported workflow with a user who knows their site network but is new to OpenShift. Include a missing attachment and an unresolved physical task.",
    measure:
      "Correct mapping, successful connectivity, wrong-layer changes and specialist clarification cycles. Establish a baseline before setting targets.",
  },
  {
    id: "precise-handoffs",
    topics: [
      "handoffs",
      "dns",
      "managed-dns",
      "dns-consumers",
      "routing",
      "networking",
    ],
    title: "Make prerequisite requests precise and testable",
    summary:
      "Give infrastructure owners the exact request and the evidence needed to close it.",
    problems: ["owner-wait", "late-dependency"],
    intervention:
      "For one supported site design, generate addresses, records and source-to-destination flow requests with owners, conditions and verification steps.",
    existing:
      "Installer validations and documented optional dependencies already exist. Some managed-network paths can defer external cluster DNS; this is path-specific and does not remove upstream resolution or client-access work.",
    investigate:
      "Test whether complete requests reduce clarification. Keep technical verification separate from change approval and pending owner action.",
    measure:
      "Request rework, unresolved assumptions, correct identification of the responsible team and time to establish technical readiness.",
  },
  {
    id: "whole-deployment-fit",
    topics: ["hardware", "physical-storage"],
    title: "Establish feasibility for the intended workload",
    summary:
      "Surface missing capacity, connections and commitments before setup effort accumulates.",
    problems: ["feasibility"],
    intervention:
      "Start with one workload and storage path. Separate confirmed inventory from planned purchases, physical prerequisites and platform overhead.",
    existing:
      "Published platform and workload requirements are building blocks. The research does not provide a universal sizing formula or a reliable resource-overhead benchmark.",
    investigate:
      "Compare a complete intended deployment with the customer’s actual inventory. Separate product compatibility from procurement and funding constraints.",
    measure:
      "Earlier discovery of consequential gaps, avoided configuration rework and accuracy of feasibility expectations.",
  },
  {
    id: "constraint-led-choice",
    topics: ["approach", "assisted", "agent-based", "ipi", "upi"],
    title: "Explain installer choices through ownership and constraints",
    summary:
      "Help engineers and customers understand what each path automates and still requires.",
    problems: ["method-choice"],
    intervention:
      "Begin with host control, connectivity and existing provisioning practices. Explain the compatible choices and the work each owner retains.",
    existing:
      "The four installer families and orchestration layers already address different environments. This proposal improves selection and explanation rather than adding another installer.",
    investigate:
      "Check current selection guidance against representative constrained sites. Keep topology, installer family and orchestration as separate decisions.",
    measure:
      "Correct explanation of responsibilities, applicable-document selection and avoided incompatible starts.",
  },
  {
    id: "offline-outcome-kit",
    topics: ["content", "disconnected"],
    title: "Prepare an offline kit around the intended outcome",
    summary:
      "Connect installation content to workload dependencies and usable local guidance.",
    problems: ["offline-content"],
    intervention:
      "Choose one disconnected scenario and produce an explicit content and transfer plan, including local instructions and a handoff for updates.",
    existing:
      "Mirroring, improved oc-mirror workflows and a documented self-contained-media path already exist. Compare their coverage before proposing new packaging.",
    investigate:
      "Determine which missing artifacts or approval boundaries actually block the selected workload. Test the workflow without online documentation access.",
    measure:
      "Content completeness, successful local task completion and repeated transfers caused by missed dependencies.",
  },
  {
    id: "clear-boot-handoff",
    topics: ["media", "management", "hosts"],
    title: "Connect media creation to physical host readiness",
    summary:
      "Make artifact delivery, boot and discovery understandable for the selected method.",
    problems: ["boot-handoff", "physical-evidence-gap"],
    intervention:
      "Walk through one real supported boot path from generation to the correctly identified hosts and installation disks.",
    existing:
      "ISO/PXE workflows, discovery and validations are existing capabilities. BMC reachability and media-source reachability remain separate checks.",
    investigate:
      "Observe current physical installs and document BMC models, firmware, boot choices and media-fetch behavior before choosing a product change.",
    measure:
      "Correct host identification, first successful boot, handoff clarification and reproducible points of failure.",
  },
  {
    id: "actionable-progress",
    topics: ["progress", "bootstrap", "hosts"],
    title: "Make installation state lead to the right next action",
    summary:
      "Explain the current phase, affected host and relevant diagnostic evidence.",
    problems: ["unclear-progress", "physical-evidence-gap"],
    intervention:
      "Evaluate a phase explanation showing the last observed progress, expected waiting and the next supported action for a real blocked state.",
    existing:
      "Assisted and Agent-based workflows already expose validation, progress and diagnostics. First establish which current explanation or transition is insufficient.",
    investigate:
      "Observe a quiet healthy interval, a reboot and a genuine failure on current physical installations. Avoid inventing an ETA from historical anecdotes.",
    measure:
      "Correct wait-versus-intervene decisions, time to identify the affected stage and unnecessary restarts.",
  },
  {
    id: "earlier-dependency-feedback",
    topics: ["routing", "progress", "recovery"],
    title: "Connect dependency failures to their owner and correction",
    summary:
      "Expose the failed endpoint and useful evidence at the earliest demonstrated point.",
    problems: ["late-dependency"],
    intervention:
      "Reproduce one late dependency failure, identify when it becomes detectable, and connect the check to the responsible team’s correction.",
    existing:
      "Existing prerequisite validations and diagnostic checks may already cover the condition. The gap can be timing, coverage, explanation or handoff.",
    investigate:
      "Check the exact method, host, endpoint, previous validation and failure transition. Move a check earlier only where the reproduction supports it.",
    measure:
      "Delay between detectable failure and actionable explanation, avoided repeated work and successful owner handoff.",
  },
  {
    id: "retry-continuity",
    topics: ["recovery", "media"],
    title: "Preserve context through correction and retry",
    summary:
      "Carry the relevant configuration and diagnostic record into the next supported action.",
    problems: ["retry-work"],
    intervention:
      "Follow one failed attempt through correction. Distinguish continued monitoring, repair and a planned new installation, and retain safe reusable inputs.",
    existing:
      "Wait commands can be rerun for monitoring; generated media and consumed configuration have specific lifecycles. There is no universal safe resume for every failed attempt.",
    investigate:
      "Observe where context is actually lost and which steps must genuinely repeat. Keep secrets out of ordinary exported records.",
    measure:
      "Repeated manual inputs, diagnostic continuity and correct recovery-path selection.",
  },
  {
    id: "outcome-plan",
    topics: ["workloads", "completion"],
    title: "Carry the intended workload across the installation boundary",
    summary:
      "Show the remaining work between the base cluster and the customer’s first useful task.",
    problems: ["missing-dependencies"],
    intervention:
      "Start with one supported workload scenario. Connect its dependencies, configuration, owners and verification across installer and console workflows.",
    existing:
      "Installer validation and workload post-installation guidance already exist. Test continuity and remaining-work visibility against current capabilities.",
    investigate:
      "Compare the actual supported dependency set with what users believe is complete after installation. Avoid assuming every workload needs the same Operators.",
    measure:
      "Representative task completion, missed critical dependencies and perceived readiness compared with observed behavior.",
  },
  {
    id: "storage-outcome",
    topics: [
      "storage",
      "storage-drivers",
      "storage-behavior",
      "physical-storage",
    ],
    title: "Guide storage setup by the operation it must support",
    summary:
      "Connect the physical system, driver, configuration and representative workload behavior.",
    problems: ["storage-not-usable", "storage-behavior-gap", "feasibility"],
    intervention:
      "Prototype one supported external-storage path through integration, default class/profile and first workload, with a required maintenance operation where applicable.",
    existing:
      "Storage postconfiguration and workload self-validation already exist. The proposed increment is guidance through the complete selected path and its unresolved physical dependencies.",
    investigate:
      "Use a scenario with an available array but incomplete configuration. Verify provider and release support; do not prescribe one product or access mode universally.",
    measure:
      "Successful first workload, correct identification of the missing layer and demonstrated required behavior.",
  },
  {
    id: "rehearse-access",
    topics: ["access"],
    title: "Rehearse the task as the receiving user",
    summary:
      "Make effective access visible in the context of the workload and project.",
    problems: ["effective-access"],
    intervention:
      "Choose one delegated VM or workload task. Explain the relevant identity, role and scope, then verify the intended action with the receiving user.",
    existing:
      "Role bindings, identity integration and authorization checks are existing building blocks. The proposal connects them to an actual user task.",
    investigate:
      "Determine whether the obstacle is a missing permission, misunderstood scope, navigation or external identity synchronization.",
    measure:
      "Task success with intended privileges and fewer trial-and-error role changes.",
  },
  {
    id: "confidence-rehearsal",
    topics: ["acceptance", "backups", "storage-behavior"],
    title: "Demonstrate customer-specific readiness",
    summary:
      "Replace assumed readiness with evidence from the customer’s required behavior.",
    problems: ["readiness-unproven", "secret-recovery"],
    intervention:
      "Agree a small acceptance plan for a representative workload and selected maintenance or recovery scenario. Record results, limits and ownership.",
    existing:
      "Monitoring, backup tools, workload checks and recovery procedures already exist. No single green badge proves every production requirement.",
    investigate:
      "Co-design a bounded rehearsal with the operating team. Include data, secrets and external dependencies where the scenario needs them.",
    measure:
      "Correct understanding of what is proven, successful selected recovery tasks and fewer unresolved handover dependencies.",
  },
  {
    id: "diagnostic-handover",
    topics: ["acceptance", "operations"],
    title: "Make operating knowledge part of the handoff",
    summary:
      "Help the receiving team identify a failure and gather the right evidence.",
    problems: ["handover-knowledge"],
    intervention:
      "Use one representative workload failure to rehearse diagnosis, evidence collection and support handoff with the receiving operator.",
    existing:
      "Logs, must-gather and support workflows already exist. The increment is making the applicable path usable to the team’s actual skills and access.",
    investigate:
      "Observe the task without installation specialists guiding every step; account for offline and restricted-access environments.",
    measure:
      "Independent diagnosis, useful evidence collection and a clear escalation path.",
  },
  {
    id: "dependency-aware-change",
    topics: ["upgrades", "operations"],
    title: "Plan updates across the whole deployment",
    summary:
      "Bring integration compatibility and disconnected content into the same change plan.",
    problems: ["upgrade-dependencies", "offline-content"],
    intervention:
      "Choose one dependency-bearing update. Record core release, Operators, storage and network configuration and test the representative workload path.",
    existing:
      "Core cluster updates and mirroring already provide useful capabilities. Preserve successful flows while investigating the specific add-on or content gap.",
    investigate:
      "Reproduce a reported integration problem on a known version pair and distinguish support limits from product behavior.",
    measure:
      "Earlier detection of incompatible dependencies, complete content preparation and successful representative workload checks.",
  },
];
