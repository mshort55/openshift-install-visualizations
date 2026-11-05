import { z } from "zod";

const chapterSchema = z.enum([
  "introduction",
  "preparation",
  "dns",
  "pre-hooks",
  "preflight",
  "installation",
  "operators",
  "post-hooks",
  "readiness",
  "handoff",
  "reuse",
]);
export type Chapter = z.infer<typeof chapterSchema>;
export function parseChapter(value: string | null): Chapter {
  const parsed = chapterSchema.safeParse(value);
  return parsed.success ? parsed.data : "introduction";
}

export const capabilitySchema = z.enum([
  "nmstate",
  "metallb",
  "sriov",
  "storage",
  "virtualization",
]);
export type Capability = z.infer<typeof capabilitySchema>;
export const capabilities = {
  nmstate: {
    name: "Kubernetes NMState",
    purpose: "Host networking",
    owner: "Network team",
    configuration:
      "Customer hook applies the approved bridge and VLAN policy to both workers.",
    evidence:
      "NodeNetworkConfigurationEnactments Available on worker-0 and worker-1; bridge and VLAN match the policy.",
    dependency:
      "Cluster installed → operator installed → customer network hook → node policy checks",
  },
  metallb: {
    name: "MetalLB",
    purpose: "Service load balancing",
    owner: "Network team",
    configuration:
      "Create the MetalLB instance, an approved address pool and L2 advertisements.",
    evidence:
      "Controller and speakers healthy; test LoadBalancer address allocated and reachable from the client probe.",
    dependency:
      "Cluster installed → approved address pool → instance and advertisements → service path check",
  },
  sriov: {
    name: "SR-IOV Network",
    purpose: "High-performance networking",
    owner: "Network team",
    configuration:
      "Apply device policies and network attachments on eligible NICs.",
    evidence:
      "Selected hardware supports SR-IOV; device policy synchronized and a test VF attachment succeeded.",
    dependency:
      "Eligible hardware and firmware → device policy → network attachment check",
  },
  storage: {
    name: "Customer-selected storage operator or supported CSI integration",
    purpose: "Persistent storage",
    owner: "Storage team",
    configuration:
      "Use the existing external backend; configure access and the vm-storage StorageClass.",
    evidence:
      "External CSI driver healthy; PVC provisioned and attached; write, flush, reopen and read matched. Test volume deleted.",
    dependency:
      "External backend access → CSI integration → StorageClass → provisioning and I/O",
  },
  virtualization: {
    name: "OpenShift Virtualization",
    purpose: "Virtual machines",
    owner: "Platform team",
    configuration:
      "Configure HyperConverged components, placement and the selected storage profile.",
    evidence:
      "HyperConverged Available, Progressing=False, Degraded=False; disposable VM boot, storage and guest network checks passed.",
    dependency:
      "Hardware virtualization → external storage configured → customer hook → VM smoke tests",
  },
} satisfies Record<
  Capability,
  {
    name: string;
    purpose: string;
    owner: string;
    configuration: string;
    evidence: string;
    dependency: string;
  }
>;

const planSchema = z.object({
  cluster: z.string(),
  domain: z.string(),
  api: z.string(),
  selected: z.array(capabilitySchema),
  preJob: z.string(),
  postJob: z.string(),
  prerequisites: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      owner: z.string(),
      fulfilled: z.boolean(),
    }),
  ),
  draftPrerequisite: z.object({ name: z.string(), owner: z.string() }),
});
const attemptSchema = z.object({
  action: z.string(),
  kind: z.enum(["passed", "failed"]),
  evidence: z.string(),
  at: z.string(),
});
const templateSchema = z.object({
  name: z.string(),
  defaults: z.object({
    boot: z.enum(["automated", "local"]),
    topology: z.literal("3 control-plane + 2 workers"),
    storage: z.literal("External supported CSI backend"),
  }),
  capabilities: z.array(capabilitySchema),
  prerequisites: z.array(z.object({ name: z.string(), owner: z.string() })),
  hooks: z.array(
    z.object({
      name: z.string(),
      owner: z.string(),
      placement: z.enum(["pre-installation", "post-installation"]),
      dependsOn: z.array(z.string()),
    }),
  ),
  actions: z.array(
    z.object({
      name: z.string(),
      owner: z.string(),
      dependsOn: z.array(z.string()),
      criterion: z.string(),
    }),
  ),
});
export type SavedTemplate = z.infer<typeof templateSchema>;
export const journeySchema = z.object({
  version: z.literal(1),
  started: z.boolean(),
  plan: planSchema,
  dns: z.enum(["draft", "requested", "fulfilled"]),
  boot: z.enum(["automated", "local"]),
  installation: z.enum([
    "not-started",
    "preparing-media",
    "booting",
    "awaiting-local-boot",
    "observing",
    "installed",
  ]),
  attempts: z.array(attemptSchema),
  correction: z.enum(["not-needed", "needed", "applied"]),
  templateName: z.string(),
  template: templateSchema.nullable(),
});
export type Journey = z.infer<typeof journeySchema>;
export type Attempt = z.infer<typeof attemptSchema>;
export const storageKey = "openshift.solution-journey.v1";
export function newJourney(): Journey {
  return {
    version: 1,
    started: false,
    plan: {
      cluster: "edge-east",
      domain: "dc.example.com",
      api: "",
      selected: ["nmstate", "metallb", "storage", "virtualization"],
      preJob: "site-validation",
      postJob: "configure-site-network",
      prerequisites: [],
      draftPrerequisite: { name: "", owner: "" },
    },
    dns: "draft",
    boot: "automated",
    installation: "not-started",
    attempts: [],
    correction: "not-needed",
    templateName: "",
    template: null,
  };
}
export const latest = (state: Journey, action: string) =>
  state.attempts
    .slice()
    .reverse()
    .find((attempt) => attempt.action === action);
export const passed = (state: Journey, action: string) =>
  latest(state, action)?.kind === "passed";
export const locked = (state: Journey) => state.installation !== "not-started";
export function planErrors(state: Journey): string[] {
  const { cluster, domain, api, preJob, postJob } = state.plan;
  const errors: string[] = [];
  if (!/^[a-z][a-z0-9-]{0,61}[a-z0-9]$/.test(cluster))
    errors.push(
      "Enter a cluster name using lowercase letters, numbers and hyphens (2–63 characters).",
    );
  if (!z.hostname().safeParse(domain).success || !domain.includes("."))
    errors.push("Enter a base domain, such as dc.example.com.");
  if (!z.ipv4().safeParse(api).success)
    errors.push("Supply a valid IPv4 API address from the Network team.");
  if (!preJob.trim() || !postJob.trim())
    errors.push("Name both customer Ansible jobs.");
  return errors;
}
export function preparationReady(state: Journey) {
  return (
    planErrors(state).length === 0 &&
    state.plan.prerequisites.every((item) => item.fulfilled) &&
    ["dns", "pre-hook", "preflight"].every((id) => passed(state, id))
  );
}
export function installedComponents(state: Journey) {
  return (
    state.installation === "installed" &&
    state.plan.selected.every((id) => passed(state, `${id}:install`))
  );
}
export function configuredComponents(state: Journey) {
  return (
    installedComponents(state) &&
    state.plan.selected
      .filter((id) => id !== "nmstate")
      .every((id) => passed(state, `${id}:configure`))
  );
}
export function readinessActions(state: Journey) {
  return [
    ...state.plan.selected.map((id) => `${id}:ready`),
    "platform-check",
    ...(state.plan.selected.includes("virtualization") ? ["vm-check"] : []),
  ];
}
export function complete(state: Journey) {
  return (
    preparationReady(state) &&
    configuredComponents(state) &&
    passed(state, "post-hook") &&
    state.plan.selected.every((id) => passed(state, `${id}:configure`)) &&
    readinessActions(state).every((id) => passed(state, id))
  );
}
export function failures(state: Journey) {
  return state.attempts.filter(
    (attempt) =>
      attempt.kind === "failed" && latest(state, attempt.action) === attempt,
  );
}
export function status(state: Journey) {
  if (failures(state).length) return "Failed";
  if (complete(state)) return "Complete";
  if (!state.started) return "Not started";
  if (planErrors(state).length) return "Needs input";
  if (state.dns === "requested") return "Waiting for Network team";
  if (state.installation === "awaiting-local-boot")
    return "Waiting for Site operations";
  return "In progress";
}
export function nextAction(state: Journey): {
  chapter: Chapter;
  label: string;
  owner: string;
} {
  const failed = failures(state)[0];
  if (failed)
    return {
      chapter:
        failed.action === "dns"
          ? "dns"
          : failed.action === "pre-hook"
            ? "pre-hooks"
            : failed.action === "post-hook"
              ? "post-hooks"
              : failed.action.endsWith(":install") ||
                  failed.action.endsWith(":configure")
                ? "operators"
                : "readiness",
      label: `Recover ${actionName(failed.action)}`,
      owner: actionOwner(failed.action),
    };
  if (
    planErrors(state).length ||
    state.plan.prerequisites.some((item) => !item.fulfilled)
  )
    return {
      chapter: "preparation",
      label: "Complete cluster information and prerequisites",
      owner: "Platform / prerequisite owners",
    };
  if (!passed(state, "dns"))
    return {
      chapter: "dns",
      label:
        state.dns === "requested"
          ? "Wait for DNS publication, then verify"
          : "Coordinate and verify DNS",
      owner: "Network team",
    };
  if (!passed(state, "pre-hook"))
    return {
      chapter: "pre-hooks",
      label: "Run customer pre-installation automation",
      owner: "Customer infrastructure team",
    };
  if (!passed(state, "preflight"))
    return {
      chapter: "preflight",
      label: "Run scoped preflight checks",
      owner: "Platform team",
    };
  if (state.installation !== "installed")
    return {
      chapter: "installation",
      label:
        state.installation === "awaiting-local-boot"
          ? "Boot the five hosts from prepared media"
          : "Prepare, boot and observe installation",
      owner: state.boot === "local" ? "Site operations" : "Platform team",
    };
  if (!configuredComponents(state))
    return {
      chapter: "operators",
      label: "Install and configure selected capabilities",
      owner: "Platform / Network / Storage teams",
    };
  if (!passed(state, "post-hook"))
    return {
      chapter: "post-hooks",
      label: "Apply customer infrastructure configuration",
      owner: "Customer network team",
    };
  if (!complete(state))
    return {
      chapter: "readiness",
      label: "Verify the selected infrastructure scope",
      owner: "Platform / Network / Storage teams",
    };
  return {
    chapter: "reuse",
    label: "Optionally save the reusable plan",
    owner: "Platform team",
  };
}
export function actionName(action: string) {
  const [id, step] = action.split(":");
  const parsed = capabilitySchema.safeParse(id);
  if (parsed.success) return `${capabilities[parsed.data].name} · ${step}`;
  const names: Record<string, string> = {
    dns: "DNS verification",
    "pre-hook": "Customer pre-installation hook",
    preflight: "Proposed Red Hat preflight checks",
    media: "Prepared Agent ISO r3",
    boot: "Server boot",
    installation: "Cluster installation",
    "post-hook": "Customer post-installation hook",
    "platform-check": "Platform and network smoke tests",
    "vm-check": "VM networking smoke test",
    correction: "Network correction",
  };
  return names[action] ?? action;
}
export function actionOwner(action: string) {
  const parsed = capabilitySchema.safeParse(action.split(":")[0]);
  return parsed.success
    ? capabilities[parsed.data].owner
    : action.includes("hook")
      ? "Customer automation owner"
      : action === "vm-check" || action === "dns"
        ? "Network team"
        : "Platform team";
}

export type Event =
  | { kind: "start" }
  | {
      kind: "field";
      field: "cluster" | "domain" | "api" | "preJob" | "postJob";
      value: string;
    }
  | { kind: "draft-prerequisite"; field: "name" | "owner"; value: string }
  | { kind: "add-prerequisite" }
  | { kind: "fulfill-prerequisite"; id: string }
  | { kind: "select-capability"; id: Capability }
  | { kind: "request-dns" }
  | { kind: "fulfill-dns" }
  | { kind: "verify-dns"; fail: boolean }
  | { kind: "pre-hook"; fail: boolean }
  | { kind: "preflight" }
  | { kind: "boot-route"; route: Journey["boot"] }
  | { kind: "install" }
  | { kind: "tick-installation" }
  | { kind: "observe-local-boot" }
  | { kind: "install-components"; fail: boolean }
  | { kind: "configure-components"; fail: boolean }
  | { kind: "post-hook"; fail: boolean }
  | { kind: "verify-readiness"; fail: boolean }
  | { kind: "correct" }
  | { kind: "template-name"; value: string }
  | { kind: "save-template" };

/** All execution transitions and dependency gates live here; reading selection never enters the model. */
export function updateJourney(state: Journey, event: Event): Journey {
  const next = structuredClone(state);
  const record = (action: string, evidence: string, fail = false) => {
    if (passed(next, action)) return;
    next.attempts.push({
      action,
      kind: fail ? "failed" : "passed",
      evidence,
      at: new Date().toISOString(),
    });
  };
  switch (event.kind) {
    case "start":
      next.started = true;
      break;
    case "field":
      if (locked(state)) return state;
      next.plan[event.field] = event.value;
      // A changed execution input invalidates dependent evidence; drafts remain freely editable.
      next.dns = "draft";
      next.attempts = [];
      break;
    case "draft-prerequisite":
      if (locked(state)) return state;
      next.plan.draftPrerequisite[event.field] = event.value;
      break;
    case "add-prerequisite": {
      const { name, owner } = state.plan.draftPrerequisite;
      if (locked(state) || !name.trim() || !owner.trim()) return state;
      next.plan.prerequisites.push({
        id: crypto.randomUUID(),
        name: name.trim(),
        owner: owner.trim(),
        fulfilled: false,
      });
      next.plan.draftPrerequisite = { name: "", owner: "" };
      next.attempts = next.attempts.filter(
        (attempt) =>
          attempt.action !== "pre-hook" && attempt.action !== "preflight",
      );
      break;
    }
    case "fulfill-prerequisite":
      if (locked(state)) return state;
      next.plan.prerequisites = next.plan.prerequisites.map((item) =>
        item.id === event.id ? { ...item, fulfilled: true } : item,
      );
      break;
    case "select-capability": {
      if (locked(state)) return state;
      const selected = new Set(state.plan.selected);
      if (selected.has(event.id)) {
        selected.delete(event.id);
        if (event.id === "storage") selected.delete("virtualization");
      } else {
        selected.add(event.id);
        if (event.id === "virtualization") selected.add("storage");
      }
      next.plan.selected = [...selected];
      break;
    }
    case "request-dns":
      if (planErrors(state).length || state.dns !== "draft") return state;
      next.dns = "requested";
      break;
    case "fulfill-dns":
      if (state.dns !== "requested") return state;
      next.dns = "fulfilled";
      break;
    case "verify-dns":
      if (state.dns !== "fulfilled") return state;
      record(
        "dns",
        event.fail
          ? "admin-probe-01: API A record does not match the requested address. Network team must correct publication."
          : `admin-probe-01 → 10.20.10.53: UDP and TCP lookups matched api.${state.plan.cluster}.${state.plan.domain} = ${state.plan.api}; api-int.${state.plan.cluster}.${state.plan.domain} = ${state.plan.api}; wildcard application lookup = 10.20.30.11. Client DNS scope only.`,
        event.fail,
      );
      break;
    case "pre-hook":
      if (
        !passed(state, "dns") ||
        state.plan.prerequisites.some((item) => !item.fulfilled)
      )
        return state;
      record(
        "pre-hook",
        event.fail
          ? "Customer controller: site-validation failed an approved NTP source check. Earlier DNS evidence retained."
          : `Customer controller job ${state.plan.preJob}: site-admin-01 verified reservations, VLAN, routing, firewall, NTP and registry access. Exit 0.`,
        event.fail,
      );
      break;
    case "preflight":
      if (!passed(state, "dns") || planErrors(state).length) return state;
      record(
        "preflight",
        "Proposed Red Hat checks: declarative configuration, host inventory and media inputs validated before boot. No host disks changed.",
      );
      break;
    case "boot-route":
      if (locked(state)) return state;
      next.boot = event.route;
      break;
    case "install":
      if (!preparationReady(state) || locked(state)) return state;
      next.installation = "preparing-media";
      break;
    case "tick-installation":
      if (state.installation === "preparing-media") {
        record(
          "media",
          "Hub prepared Agent ISO r3 from this frozen plan; same media for either boot route.",
        );
        next.installation =
          state.boot === "local" ? "awaiting-local-boot" : "booting";
      } else if (state.installation === "booting") {
        record(
          "boot",
          "Simulated Redfish: ISO mounted, one-time CD/DVD boot target read back, five servers powered on; Agent activity separately observed at rendezvous host cp-0.",
        );
        next.installation = "observing";
      } else if (state.installation === "observing") {
        record(
          "installation",
          "Rendezvous host installer reports completion; API observed, five nodes Ready, core Cluster Operators Available and not Degraded.",
        );
        next.installation = "installed";
      } else return state;
      break;
    case "observe-local-boot":
      if (state.installation !== "awaiting-local-boot") return state;
      record(
        "boot",
        "Site operations reported ISO r3 attachment and one-time boot. Separate sample observation: all five Agents seen at cp-0 through the retained observation path.",
      );
      next.installation = "observing";
      break;
    case "install-components": {
      if (state.installation !== "installed") return state;
      const target = state.plan.selected.find(
        (id) => !passed(state, `${id}:install`),
      );
      for (const id of state.plan.selected)
        record(
          `${id}:install`,
          event.fail && id === target
            ? "Sample catalog resolution failed; Platform team corrects catalog access before targeted retry."
            : id === "storage"
              ? "Existing external CSI integration detected; installation reused, configuration and verification still required."
              : "Operator subscription resolved and controller deployed. Configuration and verification still required.",
          event.fail && id === target,
        );
      break;
    }
    case "configure-components": {
      if (!installedComponents(state)) return state;
      const configurable = state.plan.selected.filter((id) => id !== "nmstate");
      const target = configurable.find(
        (id) => !passed(state, `${id}:configure`),
      );
      for (const id of configurable.filter((id) => id !== "virtualization"))
        record(
          `${id}:configure`,
          event.fail && id === target
            ? "Sample configuration rejected; owner corrects the resource before targeted retry."
            : capabilities[id].configuration,
          event.fail && id === target,
        );
      if (
        configurable.includes("virtualization") &&
        passed(next, "storage:configure")
      )
        record(
          "virtualization:configure",
          event.fail && target === "virtualization"
            ? "Sample HyperConverged configuration rejected; correct before retry."
            : capabilities.virtualization.configuration,
          event.fail && target === "virtualization",
        );
      break;
    }
    case "post-hook":
      if (!configuredComponents(state)) return state;
      record(
        "post-hook",
        event.fail
          ? "Customer Ansible job failed: approved network attachment mapping missing. Correct the mapping and rerun this job."
          : `Customer controller job ${state.plan.postJob}: applied selected site network attachments and infrastructure settings through approved cluster API access. Exit 0.`,
        event.fail,
      );
      if (!event.fail && state.plan.selected.includes("nmstate"))
        record("nmstate:configure", capabilities.nmstate.configuration);
      break;
    case "verify-readiness": {
      if (
        !configuredComponents(state) ||
        !passed(state, "post-hook") ||
        state.correction === "needed"
      )
        return state;
      const vmFailed =
        event.fail && state.plan.selected.includes("virtualization");
      record(
        "platform-check",
        "Proposed Red Hat checks: five nodes Ready, core operators healthy; cross-node pod and service DNS checks passed. Client probe resolved the application wildcard and received HTTP 200. Temporary namespace, pods, Route and Service removed.",
      );
      for (const id of state.plan.selected.filter(
        (id) => id !== "virtualization",
      ))
        record(`${id}:ready`, capabilities[id].evidence);
      if (state.plan.selected.includes("virtualization")) {
        record(
          "vm-check",
          vmFailed
            ? "virt-smoke guest → 10.20.60.20:443 timed out. Diagnosis: site egress ACL omits the guest subnet. VM boot and data disk I/O passed. VM/VMI, DataVolumes, test PVCs and backend volumes removed; cleanup verified."
            : "virt-smoke guest: boot and API-mediated SSH passed; data PVC write/flush/reopen/read matched; guest → 10.20.60.20:443 returned 200. VM/VMI, DataVolumes, test PVCs and backend volumes removed; cleanup verified.",
          vmFailed,
        );
        if (!vmFailed)
          record("virtualization:ready", capabilities.virtualization.evidence);
      }
      if (vmFailed) next.correction = "needed";
      break;
    }
    case "correct":
      if (state.correction !== "needed") return state;
      record(
        "correction",
        "Network team applied the example egress ACL correction for the guest subnet. The failed test remains unresolved until a new observation passes.",
      );
      next.correction = "applied";
      break;
    case "template-name":
      next.templateName = event.value;
      break;
    case "save-template":
      if (!complete(state) || !state.templateName.trim()) return state;
      next.template = reusablePlan(state);
      break;
    default: {
      const exhaustive: never = event;
      return exhaustive;
    }
  }
  return next;
}

/** Explicit allowlist: no cluster identity, addresses, host bindings, outcomes or attempt history. */
export function reusablePlan(state: Journey): SavedTemplate {
  return {
    name: state.templateName.trim(),
    defaults: {
      boot: state.boot,
      topology: "3 control-plane + 2 workers",
      storage: "External supported CSI backend",
    },
    capabilities: [...state.plan.selected],
    prerequisites: state.plan.prerequisites.map(({ name, owner }) => ({
      name,
      owner,
    })),
    hooks: [
      {
        name: state.plan.preJob,
        owner: "Customer infrastructure team",
        placement: "pre-installation",
        dependsOn: ["DNS verified", "Customer prerequisites fulfilled"],
      },
      {
        name: state.plan.postJob,
        owner: "Customer network team",
        placement: "post-installation",
        dependsOn: [
          "Selected operators installed",
          "Base infrastructure configured",
        ],
      },
    ],
    actions: [
      {
        name: "Coordinate and verify DNS",
        owner: "Network team",
        dependsOn: ["Deployment addresses"],
        criterion: "Client lookups match requested records",
      },
      {
        name: "Preflight checks",
        owner: "Platform team",
        dependsOn: ["Cluster inputs", "DNS verified"],
        criterion: "Configuration and inventory checks pass",
      },
      {
        name: "Agent-based installation",
        owner: "Platform / Site operations",
        dependsOn: ["All preparation passed"],
        criterion: "Installation observed successful",
      },
      ...state.plan.selected.map((id) => ({
        name: capabilities[id].name,
        owner: capabilities[id].owner,
        dependsOn: [capabilities[id].dependency],
        criterion: capabilities[id].evidence,
      })),
      {
        name: "Infrastructure readiness checks",
        owner: "Platform / Network / Storage teams",
        dependsOn: [
          "Selected capabilities configured",
          "Customer post-installation hook passed",
        ],
        criterion: "Selected checks and temporary resource cleanup succeed",
      },
    ],
  };
}
