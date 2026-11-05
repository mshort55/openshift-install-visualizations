import { Action, Detail, History, Notice } from "./components";
import {
  capabilities,
  capabilitySchema,
  complete,
  configuredComponents,
  installedComponents,
  latest,
  locked,
  passed,
  readinessActions,
  reusablePlan,
} from "./model";
import type { Session } from "./session";

export function Operators({ session }: { session: Session }) {
  const { journey: state, dispatch } = session;
  const allInstalled = installedComponents(state);
  const allConfigured = configuredComponents(state);
  return (
    <>
      <p>
        Select the infrastructure capabilities this cluster needs. These five
        examples are conditional choices, not a required bundle. Installation
        success alone does not make a capability Ready.
      </p>
      <Notice>
        {locked(state)
          ? "The plan is frozen for this execution. Selected outcomes determine journey completion."
          : "Customize the plan before starting installation. Selecting Virtualization also selects external storage; removing storage removes Virtualization."}
      </Notice>
      <Detail
        session={session}
        id="operator-group"
        title="Install and configure infrastructure operators"
      >
        <div className="solution-operators">
          {capabilitySchema.options.map((id) => {
            const item = capabilities[id];
            const selected = state.plan.selected.includes(id);
            const failure = ["install", "configure", "ready"].find(
              (step) => latest(state, `${id}:${step}`)?.kind === "failed",
            );
            return (
              <section
                key={id}
                className="solution-operator"
                data-capability={id}
              >
                <label className="solution-capability">
                  <input
                    type="checkbox"
                    data-focus={`solution-select-${id}`}
                    checked={selected}
                    disabled={locked(state)}
                    onChange={() => dispatch({ kind: "select-capability", id })}
                  />
                  <span>
                    <small>{item.purpose}</small>
                    <strong>{item.name}</strong>
                  </span>
                </label>
                <p>
                  <strong>
                    {selected
                      ? "Selected · Required for this plan"
                      : "Not selected · Outside this plan"}
                  </strong>{" "}
                  · {item.owner}
                </p>
                <div className="solution-step-strip">
                  {["install", "configure", "ready"].map((step, index) => (
                    <span
                      key={step}
                      data-done={selected && passed(state, `${id}:${step}`)}
                    >
                      {passed(state, `${id}:${step}`) ? "✓ " : ""}
                      {["Installed", "Configured", "Ready"][index]}
                    </span>
                  ))}
                </div>
                <p>{item.configuration}</p>
                <p>
                  <strong>Depends on:</strong> {item.dependency}.
                </p>
                {id === "sriov" && (
                  <p>
                    Only for selected workloads and verified eligible NICs,
                    firmware and node capacity. No hardware configuration is
                    requested here.
                  </p>
                )}
                {id === "storage" && (
                  <p>
                    This two-worker example uses a suitable external backend.
                    CSI is an integration interface, not one universal Operator
                    package. Local ODF is not substituted: the documented
                    bare-metal local-storage configuration requires at least
                    three worker or infrastructure nodes.
                  </p>
                )}
                <p className={failure ? "solution-wait" : "solution-muted"}>
                  <strong>Current action:</strong>{" "}
                  {!selected
                    ? "Not required"
                    : failure
                      ? `Failed ${failure} — correct and retry affected work`
                      : passed(state, `${id}:ready`)
                        ? "Ready — verification passed"
                        : passed(state, `${id}:configure`)
                          ? "Awaiting readiness verification"
                          : passed(state, `${id}:install`)
                            ? id === "nmstate"
                              ? "Awaiting customer post-installation hook configuration"
                              : "Awaiting configuration"
                            : "Awaiting component installation"}
                </p>
                <Detail
                  session={session}
                  id={`operator-${id}-evidence`}
                  title={`${item.name}: criteria and evidence`}
                >
                  <p>
                    <strong>Ready when:</strong> {item.evidence}
                  </p>
                  <History
                    journey={state}
                    actions={[
                      `${id}:install`,
                      `${id}:configure`,
                      `${id}:ready`,
                    ]}
                  />
                </Detail>
              </section>
            );
          })}
        </div>
      </Detail>
      {!state.plan.selected.length && (
        <p>
          No additional operators selected. Required customer automation and
          core readiness checks still apply.
        </p>
      )}
      <p>
        Independent components can install in parallel. An already-present CSI
        integration is detected and reused. Base configuration follows
        installation; Virtualization configuration waits for storage. NMState’s
        site configuration comes from the customer hook.
      </p>
      <div className="solution-controls">
        <Action
          id="install-components"
          disabled={state.installation !== "installed" || allInstalled}
          onClick={() => dispatch({ kind: "install-components", fail: false })}
        >
          {state.attempts.some(
            (attempt) =>
              attempt.kind === "failed" && attempt.action.endsWith(":install"),
          )
            ? "Correct catalog access and retry failed installation"
            : "Install selected components"}
        </Action>
        <Action
          id="configure-components"
          disabled={!allInstalled || allConfigured}
          onClick={() =>
            dispatch({ kind: "configure-components", fail: false })
          }
        >
          {state.attempts.some(
            (attempt) =>
              attempt.kind === "failed" &&
              attempt.action.endsWith(":configure"),
          )
            ? "Correct configuration and retry affected work"
            : "Configure selected components"}
        </Action>
      </div>
      {state.installation !== "installed" && (
        <p className="solution-wait">
          Waiting for successful cluster installation. This is planned
          post-installation work.
        </p>
      )}
      <Detail
        session={session}
        id="operator-failure"
        title="Explore an operator action failure"
      >
        <p>
          A failed required install or configuration action fails the journey.
          Other successful component actions remain recorded. The normal action
          above applies a sample correction and retries only unfinished work.
        </p>
        <div className="solution-controls">
          <Action
            id="fail-operator"
            secondary
            disabled={state.installation !== "installed" || allInstalled}
            onClick={() => dispatch({ kind: "install-components", fail: true })}
          >
            Simulate operator installation failure
          </Action>
          <Action
            id="fail-configuration"
            secondary
            disabled={!allInstalled || allConfigured}
            onClick={() =>
              dispatch({ kind: "configure-components", fail: true })
            }
          >
            Simulate operator configuration failure
          </Action>
        </div>
      </Detail>
    </>
  );
}

export function Readiness({ session }: { session: Session }) {
  const { journey: state, dispatch } = session;
  const permitted = configuredComponents(state) && passed(state, "post-hook");
  const done = complete(state);
  const vmSelected = state.plan.selected.includes("virtualization");
  const failed = latest(state, "vm-check")?.kind === "failed";
  return (
    <>
      <p>
        <strong>Owner: Platform, Network and Storage teams.</strong> Proposed
        Red Hat checks and scoped smoke tests observe the selected
        infrastructure after customer configuration. They are separate from the
        customer Ansible jobs and need not use Ansible.
      </p>
      <ul className="solution-checklist">
        <li>
          <strong>Platform and cluster networking</strong>
          <span>
            {passed(state, "platform-check") ? "Passed" : "Not verified"}
          </span>
          <p>
            Core operator health, nodes, cross-node pods, service DNS and client
            Route access.
          </p>
        </li>
        {state.plan.selected.map((id) => (
          <li key={id}>
            <strong>{capabilities[id].name}</strong>
            <span>
              {passed(state, `${id}:ready`) ? "Ready" : "Not verified"}
            </span>
            <p>{capabilities[id].evidence}</p>
          </li>
        ))}
      </ul>
      {!permitted && (
        <Notice>
          Waiting for selected components to be installed and configured, and
          the required customer post-installation hook to pass.
        </Notice>
      )}
      <Action
        id="verify-readiness"
        disabled={!permitted || done || state.correction === "needed"}
        onClick={() => dispatch({ kind: "verify-readiness", fail: false })}
      >
        {failed ? "Rerun affected VM checks" : "Run sample readiness checks"}
      </Action>
      <Detail
        session={session}
        id="readiness-failure"
        title="Explore a VM networking failure"
      >
        <p>
          The disposable VM boots and its storage works, but guest HTTPS cannot
          reach the agreed fixture. Use this branch before the first successful
          readiness run.
        </p>
        <Action
          id="fail-readiness"
          secondary
          disabled={!permitted || done || failed || !vmSelected}
          onClick={() => dispatch({ kind: "verify-readiness", fail: true })}
        >
          Simulate VM networking failure
        </Action>
        {!vmSelected && (
          <p>This scenario applies only when Virtualization is selected.</p>
        )}
      </Detail>
      {failed && (
        <div className="solution-failure">
          <p className="solution-eyebrow">
            Failed required check · Network team
          </p>
          <h3>Guest network path is blocked</h3>
          <p>
            The sample egress ACL omits the guest subnet. The VM could not reach{" "}
            <code>10.20.60.20:443</code>. Cluster installation, configured
            operators, customer jobs and other successful checks remain
            successful.
          </p>
          <p>
            {state.correction === "applied"
              ? "Example correction recorded. The journey remains Failed until the affected VM check passes."
              : "Correct the network rule, then rerun the affected VM checks. A correction report alone is not verification."}
          </p>
          <Action
            id="correct-network"
            disabled={state.correction !== "needed"}
            onClick={() => dispatch({ kind: "correct" })}
          >
            Apply example network correction
          </Action>
        </div>
      )}
      {done && (
        <div className="solution-complete">
          <p className="solution-eyebrow">
            Infrastructure readiness established
          </p>
          <h3>Journey complete</h3>
          <p>
            The selected capabilities, required customer automation and scoped
            checks succeeded. Evidence stays here in this journey. This does not
            establish readiness for every application.
          </p>
        </div>
      )}
      <Detail
        session={session}
        id="readiness-evidence"
        title="Readiness evidence, attempts and cleanup"
      >
        <History
          journey={state}
          actions={[...readinessActions(state), "correction"]}
        />
      </Detail>
      <Detail
        session={session}
        id="readiness-assumptions"
        title="Test scope and infrastructure assumptions"
      >
        <p>
          OCP 4.22 example with three control-plane hosts and two eligible
          workers. Capacity, hardware virtualization and support for the chosen
          external CSI backend must be established for a real deployment.
        </p>
        <p>
          For Virtualization: disposable Linux fixture{" "}
          <code>linux-smoke-v1</code>, 2 vCPU / 4 GiB, separate root and data
          PVCs, the selected site network and approved API-mediated SSH. The
          chosen external <code>vm-storage</code> profile supports this test’s
          volume mode and access requirements; those are provider-specific. No
          production application acceptance or live migration claim is made.
        </p>
        <p>
          Sample checks remove VM/VMI, DataVolumes, test PVCs, temporary backend
          volumes, test namespace, pods, Route, Service and temporary access
          resources, then verify removal. Configured infrastructure remains.
          Both failed and passing VM attempts record cleanup.
        </p>
      </Detail>
    </>
  );
}

export function Template({ session }: { session: Session }) {
  const { journey: state, dispatch, persistence } = session;
  const done = complete(state);
  const plan = reusablePlan(state);
  return (
    <>
      <p>
        Save the customized plan for a future deployment. Each deployment must
        supply its own bindings and earn its own verification results. Starting
        from a template is outside this demonstration.
      </p>
      {!done && (
        <Notice>
          Complete the required journey work before saving a template.
          Inspecting this page does not complete any action.
        </Notice>
      )}
      <div className="solution-request">
        <h3>Reusable plan preview</h3>
        <dl>
          <dt>Editable defaults</dt>
          <dd>
            {plan.defaults.topology}; {plan.defaults.storage};{" "}
            {plan.defaults.boot === "local"
              ? "guided local boot"
              : "automated boot"}
            .
          </dd>
          <dt>Selected capabilities</dt>
          <dd>
            {plan.capabilities.map((id) => capabilities[id].name).join(", ") ||
              "Core cluster only"}
          </dd>
          <dt>Customer prerequisites</dt>
          <dd>
            {plan.prerequisites
              .map((item) => `${item.name} (${item.owner})`)
              .join("; ") || "No additional prerequisites"}
          </dd>
          <dt>Customer hooks</dt>
          <dd>
            {plan.hooks
              .map((hook) => `${hook.name} · ${hook.placement} · ${hook.owner}`)
              .join("; ")}
          </dd>
          <dt>Actions, owners and readiness criteria</dt>
          <dd>
            <ul>
              {plan.actions.map((action) => (
                <li key={action.name}>
                  <strong>{action.name}</strong> · {action.owner}
                  <br />
                  Depends on: {action.dependsOn.join(", ")}.<br />
                  Ready when: {action.criterion}.
                </li>
              ))}
            </ul>
          </dd>
        </dl>
      </div>
      <p>
        Excluded: cluster name, domain, addresses, host and credential bindings,
        prerequisite fulfillment, progress, timestamps and execution evidence.
        Review customer-written names to avoid embedding site-specific values in
        the reusable plan.
      </p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          dispatch({ kind: "save-template" });
        }}
      >
        <label className="solution-job-label">
          Template name
          <input
            data-focus="solution-template-name"
            value={state.templateName}
            onChange={(event) =>
              dispatch({ kind: "template-name", value: event.target.value })
            }
            placeholder="For example, Branch virtualization plan"
          />
        </label>
        <button
          type="submit"
          data-focus="solution-save-template"
          className="solution-button"
          disabled={!done || !state.templateName.trim()}
        >
          Save as template
        </button>
      </form>
      {state.template && (
        <p role="status" className="solution-template-result">
          {persistence.kind === "saved"
            ? `Template “${state.template.name}” saved in this browser.`
            : `Template “${state.template.name}” is in this tab only; browser saving has not succeeded.`}
        </p>
      )}
      <p>
        Saving is optional. Journey completion depends on infrastructure
        readiness, not on creating a template.
      </p>
    </>
  );
}
