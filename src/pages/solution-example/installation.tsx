import { Action, Detail, History, Notice } from "./components";
import { locked, preparationReady } from "./model";
import type { Session } from "./session";

export function Installation({ session }: { session: Session }) {
  const { journey: state, dispatch } = session;
  const local = state.boot === "local";
  const stages = {
    "not-started": "Not started",
    "preparing-media": "Preparing Agent installation media",
    booting: "Mounting ISO and booting through Redfish",
    "awaiting-local-boot": "Waiting for Site operations",
    observing: "Observing Agent installation on the target hosts",
    installed: "Cluster installed successfully",
  };
  return (
    <>
      <p>
        The hub coordinates media preparation and server boot. The Agent-based
        installation service runs on rendezvous host <strong>cp-0</strong>, on
        the target infrastructure.
      </p>
      <fieldset className="solution-route-options" aria-label="Boot route">
        <button
          type="button"
          data-focus="solution-boot-automated"
          aria-pressed={!local}
          disabled={locked(state)}
          onClick={() => dispatch({ kind: "boot-route", route: "automated" })}
        >
          <strong>Automated boot</strong>
          <span>Hub can reach the BMCs</span>
        </button>
        <button
          type="button"
          data-focus="solution-boot-local"
          aria-pressed={local}
          disabled={locked(state)}
          onClick={() => dispatch({ kind: "boot-route", route: "local" })}
        >
          <strong>Hub cannot reach BMC</strong>
          <span>Guided local boot by Site operations</span>
        </button>
      </fieldset>
      <p>
        {locked(state)
          ? "The executed route is retained. Inspect either route below; Reset example is the explicit way to replay from a fresh plan."
          : "Choose the route before starting. Both use this cluster plan, the same five hosts and the same prepared ISO."}
      </p>
      <div className="solution-connectivity">
        <p>
          <strong>01 · BMC access</strong>
          <br />
          {local
            ? "site-admin-01 → BMCs. Hub access unavailable."
            : "Hub → BMC Redfish APIs."}
        </p>
        <p>
          <strong>02 · Media access</strong>
          <br />
          BMCs → approved ISO endpoint. Must remain reachable.
        </p>
        <p>
          <strong>03 · Observation</strong>
          <br />
          Approved monitoring path → rendezvous host / cluster API. Assumed
          available on both routes.
        </p>
      </div>
      <Notice>
        Starting this simulation represents real installation-media boot, which
        can deploy OpenShift and write target disks. This page only produces
        simulated results.
      </Notice>
      {!preparationReady(state) && (
        <p className="solution-wait">
          Waiting for complete cluster inputs, prerequisite fulfillment, DNS
          verification, the customer pre-installation hook and preflight checks.
        </p>
      )}
      <Action
        id="start-installation"
        disabled={!preparationReady(state) || locked(state)}
        onClick={() => dispatch({ kind: "install" })}
      >
        Start installation demonstration
      </Action>
      <h3 id="solution-installation-progress">{stages[state.installation]}</h3>
      <ol className="solution-timeline">
        <li>
          <strong>Prepare media</strong>
          <span>
            Hub generates Agent ISO r3 from the frozen declarative inputs.
          </span>
        </li>
        <li>
          <strong>
            {local ? "Wait for local boot" : "Mount and boot automatically"}
          </strong>
          <span>
            {local
              ? "Site operations uses the approved local access station. Acknowledging instructions is not boot evidence."
              : "Mount ISO, read back the one-time CD/DVD target and power on supported servers."}
          </span>
        </li>
        <li>
          <strong>Observe installation</strong>
          <span>
            Separate Agent activity, installer completion and cluster API
            observations establish progress.
          </span>
        </li>
      </ol>
      {local && (
        <div className="solution-request">
          <p className="solution-eyebrow">Manual task · Site operations</p>
          <h3>Boot five hosts from Agent ISO r3</h3>
          <p>
            Use approved station <code>site-admin-01</code> to reach the BMCs.
            The hub-to-BMC path is unavailable; BMC-to-media and installation
            observation paths remain available in this example.
          </p>
          <p>
            Open the instructions below, perform the local task, and report
            media attachment and boot details. A separate sample Agent
            observation resumes the demonstration.
          </p>
          <Action
            id="observe-local-boot"
            disabled={state.installation !== "awaiting-local-boot"}
            onClick={() => dispatch({ kind: "observe-local-boot" })}
          >
            Simulate observed Agent boot
          </Action>
        </div>
      )}
      <Detail
        session={session}
        id="manual-boot"
        title="Manual boot instructions and host mapping"
      >
        <p>
          <strong>Owner: Site operations.</strong> Approved access station:{" "}
          <code>site-admin-01</code>. Use existing approved BMC credentials
          outside this demonstration.
        </p>
        <ul className="solution-hosts">
          {[
            ["cp-0", "10.20.40.20"],
            ["cp-1", "10.20.40.21"],
            ["cp-2", "10.20.40.22"],
            ["worker-0", "10.20.40.30"],
            ["worker-1", "10.20.40.31"],
          ].map(([name, address]) => (
            <li key={name}>
              <strong>{name}</strong>
              <code>{address}</code>
            </li>
          ))}
        </ul>
        <ol>
          <li>
            Confirm each server matches the approved inventory and target disk
            plan.
          </li>
          <li>
            Attach the hub-prepared{" "}
            <code>{state.plan.cluster}-agent-r3.iso</code> through each BMC’s
            virtual media interface. Sample endpoint:{" "}
            <code>https://media.site.example/agent-r3.iso</code>. Use the same
            media revision as automated boot.
          </li>
          <li>
            Check that the controller can fetch the ISO and verify the
            attachment readback.
          </li>
          <li>
            Select a one-time CD/DVD boot target, then power on or restart the
            approved server. Installation may write target disks.
          </li>
          <li>
            Report host identity, media revision, attachment readback, boot
            target and time to the journey owner. This report alone does not
            prove Agent activity.
          </li>
          <li>
            The retained observation path must see all five Agents at cp-0. Use
            “Simulate observed Agent boot” to supply that separate observation
            in this example.
          </li>
        </ol>
      </Detail>
      <Detail
        session={session}
        id="automated-boot"
        title="Automated boot mechanism and constraints"
      >
        <p>
          The proposal coordinates Redfish virtual media, boot target selection
          and power control. Validate each vendor’s hardware and firmware
          support. Metal3/Ironic is a candidate integration mechanism; this is
          not a selected dependency or a supported turnkey Agent integration.
        </p>
        <p>
          Neither an ISO attachment report nor a BMC power state establishes
          installation completion. Separate observations from the rendezvous
          host and cluster API establish that result.
        </p>
      </Detail>
      <History journey={state} actions={["media", "boot", "installation"]} />
    </>
  );
}
