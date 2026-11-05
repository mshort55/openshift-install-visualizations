import type { ReactNode } from "react";
import { Action, Detail, History, Notice } from "./components";
import { locked, passed, planErrors } from "./model";
import type { Session } from "./session";

export function Preparation({
  session,
  networkLink,
}: {
  session: Session;
  networkLink: ReactNode;
}) {
  const { journey: state, dispatch } = session;
  const readOnly = locked(state);
  return (
    <>
      <p>
        Start with what you know. The Platform team owns this plan; missing
        information and parallel owner requests remain saved as you work.
      </p>
      <Notice>
        {readOnly
          ? "Installation has begun. Execution inputs are now read-only; Reset example starts a fresh run."
          : "Illustrative defaults for a new deployment. Inputs save as you type, including blanks. Changing execution inputs invalidates their preparation results."}
      </Notice>
      <div className="solution-form">
        {(
          [
            { field: "cluster", label: "Cluster name" },
            { field: "domain", label: "Base domain" },
            { field: "api", label: "API address" },
          ] satisfies { field: "cluster" | "domain" | "api"; label: string }[]
        ).map(({ field, label }) => (
          <label key={field}>
            {label}
            <input
              data-focus={`solution-${field}`}
              value={state.plan[field]}
              readOnly={readOnly}
              placeholder={field === "api" ? "Awaiting Network team" : ""}
              onChange={(event) =>
                dispatch({ kind: "field", field, value: event.target.value })
              }
            />
          </label>
        ))}
      </div>
      {!readOnly && (
        <Action
          id="sample-address"
          secondary
          onClick={() =>
            dispatch({ kind: "field", field: "api", value: "10.20.30.12" })
          }
        >
          Use sample IPAM answer
        </Action>
      )}
      {planErrors(state).length > 0 && (
        <ul className="solution-input-gaps" aria-label="Missing information">
          {planErrors(state).map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
      <div className="solution-facts">
        <p>
          <strong>Five hosts</strong>
          <br />3 control-plane · 2 workers
        </p>
        <p>
          <strong>Ingress address</strong>
          <br />
          10.20.30.11
        </p>
        <p>
          <strong>Site resolver</strong>
          <br />
          10.20.10.53
        </p>
      </div>
      <h3>Prerequisites and owners</h3>
      <p>
        These requests can proceed in parallel. Fulfillment records an owner’s
        report; dependent checks still need to pass.
      </p>
      <ul className="solution-checklist">
        <li>
          <strong>Compute and hardware</strong>
          <span>Site operations · Supplied sample evidence</span>
          <p>
            Five hosts inventoried; worker virtualization enabled. SR-IOV
            hardware eligibility is assumed only when that optional capability
            is selected.
          </p>
        </li>
        <li>
          <strong>VLAN, routing, NTP and registry</strong>
          <span>Network team · Supplied sample plan</span>
          <p>
            Approved endpoints and reservations. Customer pre-installation hook
            verifies access before boot.
          </p>
        </li>
        <li>
          <strong>External storage access</strong>
          <span>Storage team · Supplied sample plan</span>
          <p>
            Existing supported CSI backend for two workers. Provisioning and I/O
            are verified after installation if storage is selected.
          </p>
        </li>
        <li>
          <strong>DNS publication</strong>
          <span>
            Network team ·{" "}
            {state.dns === "draft"
              ? "Request not generated"
              : state.dns === "requested"
                ? "Waiting for publication"
                : "Fulfillment reported"}
          </span>
          <p>
            Depends on cluster name, base domain and API address. Verification:{" "}
            {passed(state, "dns") ? "Passed" : "Not established"}. {networkLink}
          </p>
        </li>
        {state.plan.prerequisites.map((item) => (
          <li key={item.id}>
            <strong>{item.name}</strong>
            <span>
              {item.owner} ·{" "}
              {item.fulfilled
                ? "Sample fulfillment recorded"
                : "Waiting for owner"}
            </span>
            <p>
              Required before the customer pre-installation hook and
              installation.
            </p>
            {!item.fulfilled && (
              <Action
                id={`fulfill-${item.id}`}
                secondary
                disabled={readOnly}
                onClick={() =>
                  dispatch({ kind: "fulfill-prerequisite", id: item.id })
                }
              >
                Record sample fulfillment: {item.name}
              </Action>
            )}
          </li>
        ))}
      </ul>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          dispatch({ kind: "add-prerequisite" });
        }}
      >
        <fieldset disabled={readOnly}>
          <legend>Add a customer prerequisite</legend>
          <div className="solution-form">
            <label>
              Prerequisite
              <input
                data-focus="solution-prerequisite-name"
                value={state.plan.draftPrerequisite.name}
                onChange={(event) =>
                  dispatch({
                    kind: "draft-prerequisite",
                    field: "name",
                    value: event.target.value,
                  })
                }
                placeholder="For example, approve site access"
              />
            </label>
            <label>
              Owner team
              <input
                data-focus="solution-prerequisite-owner"
                value={state.plan.draftPrerequisite.owner}
                onChange={(event) =>
                  dispatch({
                    kind: "draft-prerequisite",
                    field: "owner",
                    value: event.target.value,
                  })
                }
                placeholder="For example, Site operations"
              />
            </label>
          </div>
          <button
            type="submit"
            className="solution-button secondary"
            data-focus="solution-add-prerequisite"
            disabled={
              !state.plan.draftPrerequisite.name.trim() ||
              !state.plan.draftPrerequisite.owner.trim()
            }
          >
            Add prerequisite
          </button>
        </fieldset>
      </form>
    </>
  );
}
export function DNS({ session }: { session: Session }) {
  const { journey: state, dispatch } = session;
  const suffix = `${state.plan.cluster}.${state.plan.domain}`;
  return (
    <>
      <p>
        <strong>Owner: Network team.</strong> Generate a request from the plan,
        wait for publication, then verify the result from the client network.
      </p>
      <div className="solution-step-strip">
        <span data-done={state.dns !== "draft"}>1 · Request</span>
        <span data-done={state.dns === "fulfilled"}>2 · Fulfillment</span>
        <span data-done={passed(state, "dns")}>3 · Verification</span>
      </div>
      {planErrors(state).length > 0 && (
        <Notice>
          Complete the cluster name, base domain, API address and hook names in
          Cluster information before generating this request.
        </Notice>
      )}
      <div className="solution-request">
        <p className="solution-eyebrow">
          {state.dns === "draft"
            ? "Request preview"
            : "Sample request DNS-1042"}{" "}
          · Network team
        </p>
        <h3>Publish cluster access records</h3>
        <dl>
          <dt>API</dt>
          <dd>
            <code>api.{suffix}</code> → {state.plan.api || "Awaiting address"}
          </dd>
          <dt>Internal API</dt>
          <dd>
            <code>api-int.{suffix}</code> →{" "}
            {state.plan.api || "Awaiting address"}
          </dd>
          <dt>Applications</dt>
          <dd>
            <code>*.apps.{suffix}</code> → 10.20.30.11
          </dd>
          <dt>Acceptance criteria</dt>
          <dd>
            Requested A records resolve through 10.20.10.53 from admin-probe-01
            on the admin/client network, over UDP and TCP.
          </dd>
          <dt>Request status</dt>
          <dd>
            {state.dns === "draft"
              ? "Not sent"
              : state.dns === "requested"
                ? "Waiting for Network team"
                : "Publication and ticket closure reported — verification is separate"}
          </dd>
        </dl>
      </div>
      <div className="solution-controls">
        <Action
          id="request-dns"
          disabled={!!planErrors(state).length || state.dns !== "draft"}
          onClick={() => dispatch({ kind: "request-dns" })}
        >
          Generate sample DNS request
        </Action>
        <Action
          id="fulfill-dns"
          secondary
          disabled={state.dns !== "requested"}
          onClick={() => dispatch({ kind: "fulfill-dns" })}
        >
          Simulate team fulfillment
        </Action>
        <Action
          id="verify-dns"
          disabled={state.dns !== "fulfilled" || passed(state, "dns")}
          onClick={() => dispatch({ kind: "verify-dns", fail: false })}
        >
          Run sample DNS verification
        </Action>
      </div>
      <p>
        <strong>
          DNS verification:{" "}
          {passed(state, "dns") ? "Passed" : "Not established"}.
        </strong>{" "}
        Closing a ticket does not establish that DNS works. These lookups do not
        prove BMC, host, media, firewall or application readiness.
      </p>
      <Detail
        session={session}
        id="dns-evidence"
        title="DNS commands and scoped evidence"
      >
        <p>
          Illustrative probe: admin-probe-01. Repeat each lookup with{" "}
          <code>+tcp</code> to exercise the same resolver over TCP.
        </p>
        <pre>{`dig @10.20.10.53 api.${suffix} A +short\n# expected: ${state.plan.api || "<API address>"}\ndig @10.20.10.53 api-int.${suffix} A +short\n# expected: ${state.plan.api || "<API address>"}\ndig @10.20.10.53 smoke.apps.${suffix} A +short\n# expected: 10.20.30.11`}</pre>
        <History journey={state} actions={["dns"]} />
      </Detail>
      <Detail
        session={session}
        id="servicenow"
        title="Optional integration: ServiceNow"
      >
        <p>
          A proposed integration could create a request, route it to the Network
          team and track the fulfillment report. Verification remains a separate
          journey action. This demonstration creates no external ticket and
          requests no credentials.
        </p>
      </Detail>
    </>
  );
}
export function Hook({
  session,
  placement,
}: {
  session: Session;
  placement: "pre" | "post";
}) {
  const { journey: state, dispatch } = session;
  const pre = placement === "pre";
  const field = pre ? "preJob" : "postJob";
  const action = pre ? "pre-hook" : "post-hook";
  const permitted = pre
    ? passed(state, "dns") &&
      state.plan.prerequisites.every((item) => item.fulfilled)
    : state.installation === "installed" &&
      state.plan.selected.every(
        (id) =>
          passed(state, `${id}:install`) &&
          (id === "nmstate" || passed(state, `${id}:configure`)),
      );
  const run = (fail: boolean) =>
    dispatch(pre ? { kind: "pre-hook", fail } : { kind: "post-hook", fail });
  return (
    <>
      <p>
        Customer-authored jobs run through the customer’s existing Ansible
        automation infrastructure. The proposed hub coordinates launch and
        records the outcome. These hooks are separate from proposed Red Hat
        checks.
      </p>
      <div className="solution-request">
        <span className="solution-eyebrow">Customer automation</span>
        <h3>
          {pre
            ? "Validate site prerequisites"
            : "Apply site infrastructure configuration"}
        </h3>
        {locked(state) ? (
          <div className="solution-job-label">
            Customer job or workflow
            <code className="solution-job-value">{state.plan[field]}</code>
          </div>
        ) : (
          <label className="solution-job-label">
            Customer job or workflow
            <input
              data-focus={`solution-${field}`}
              value={state.plan[field]}
              onChange={(event) =>
                dispatch({ kind: "field", field, value: event.target.value })
              }
            />
          </label>
        )}
        <dl>
          <dt>Purpose</dt>
          <dd>
            {pre
              ? "Validate approved reservations, VLAN, routing, NTP, firewall and registry access before server boot."
              : "Apply site-specific network attachments and infrastructure settings. When NMState is selected, this job applies the approved bridge/VLAN policy; readiness waits for verification."}
          </dd>
          <dt>Owner</dt>
          <dd>
            {pre ? "Customer infrastructure team" : "Customer network team"}
          </dd>
          <dt>Execution location</dt>
          <dd>
            Existing customer Ansible controller → customer execution
            environment →{" "}
            {pre
              ? "site-admin-01 on the site network"
              : "approved cluster API access"}
          </dd>
          <dt>Inputs</dt>
          <dd>
            {state.plan.cluster}, approved site inventory and{" "}
            {pre
              ? "reservations, endpoint allowlist and resolver"
              : "selected capabilities, network attachment mappings and storage profile"}
            . Credential bindings would be supplied per deployment; none are
            collected here.
          </dd>
          <dt>Dependencies</dt>
          <dd>
            {pre
              ? "Verified DNS and fulfilled customer prerequisites."
              : "Cluster installed; selected operators installed and base configurations applied. NMState configuration is supplied by this hook."}
          </dd>
          <dt>Outcome</dt>
          <dd>
            {passed(state, action)
              ? "Passed — simulated customer job completed"
              : "Required — not yet successful"}
          </dd>
        </dl>
      </div>
      <p>
        Replace or extend this job in the plan before installation. Its job
        name, owner role and placement are retained in a saved template;
        deployment bindings and job results are excluded.
      </p>
      {!permitted && (
        <Notice>
          Waiting for the dependencies listed above. Inspecting this hook does
          not execute it.
        </Notice>
      )}
      <Action
        id={`run-${action}`}
        disabled={!permitted || passed(state, action)}
        onClick={() => run(false)}
      >
        {state.attempts.some(
          (attempt) => attempt.action === action && attempt.kind === "failed",
        )
          ? "Apply sample job correction and retry"
          : "Run sample customer job"}
      </Action>
      <Detail
        session={session}
        id={`${action}-failure`}
        title="Explore a customer job failure"
      >
        <p>
          A failed required hook fails the journey. Earlier successful work
          remains intact; a retry appends a new attempt for this job.
        </p>
        <Action
          id={`fail-${action}`}
          secondary
          disabled={!permitted || passed(state, action)}
          onClick={() => run(true)}
        >
          Simulate customer job failure
        </Action>
      </Detail>
      <History journey={state} actions={[action]} />
    </>
  );
}
export function Preflight({ session }: { session: Session }) {
  const { journey: state, dispatch } = session;
  return (
    <>
      <p>
        <strong>Owner: Platform team.</strong> Proposed Red Hat-provided checks
        validate declarative configuration, host inventory and media inputs
        before boot. They need not use Ansible.
      </p>
      <Notice>
        These checks run before installation media boots. Normal Agent
        installation-media boot can proceed to installation and write disks; it
        is not a checks-only mode.
      </Notice>
      <Action
        id="preflight"
        disabled={
          !passed(state, "dns") ||
          !!planErrors(state).length ||
          passed(state, "preflight")
        }
        onClick={() => dispatch({ kind: "preflight" })}
      >
        Run sample preflight checks
      </Action>
      <p>
        Requires complete cluster information and verified DNS. This can run
        alongside customer preparation once those dependencies are met.
      </p>
      <History journey={state} actions={["preflight"]} />
    </>
  );
}
