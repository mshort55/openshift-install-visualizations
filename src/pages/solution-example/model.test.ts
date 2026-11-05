import { describe, expect, test } from "vitest";
import {
  complete,
  type Event,
  failures,
  type Journey,
  journeySchema,
  newJourney,
  passed,
  reusablePlan,
  status,
  updateJourney,
} from "./model";

function apply(state: Journey, ...events: Event[]) {
  return events.reduce(updateJourney, state);
}
function prepared() {
  return apply(
    newJourney(),
    { kind: "start" },
    { kind: "field", field: "api", value: "10.20.30.12" },
    { kind: "request-dns" },
    { kind: "fulfill-dns" },
    { kind: "verify-dns", fail: false },
    { kind: "pre-hook", fail: false },
    { kind: "preflight" },
  );
}
function installed() {
  return apply(
    prepared(),
    { kind: "install" },
    { kind: "tick-installation" },
    { kind: "tick-installation" },
    { kind: "tick-installation" },
  );
}
function configured() {
  return apply(
    installed(),
    { kind: "install-components", fail: false },
    { kind: "configure-components", fail: false },
    { kind: "post-hook", fail: false },
  );
}

describe("one installation journey", () => {
  test("dependent actions cannot bypass missing inputs or owner fulfillment", () => {
    const initial = newJourney();
    expect(
      apply(
        initial,
        { kind: "request-dns" },
        { kind: "install" },
        { kind: "verify-readiness", fail: false },
      ),
    ).toEqual(initial);
    const withRequest = apply(
      prepared(),
      { kind: "draft-prerequisite", field: "name", value: "Site access" },
      { kind: "draft-prerequisite", field: "owner", value: "Security" },
      { kind: "add-prerequisite" },
    );
    expect(updateJourney(withRequest, { kind: "install" }).installation).toBe(
      "not-started",
    );
  });
  test("request fulfillment cannot establish DNS verification", () => {
    const state = apply(
      newJourney(),
      { kind: "field", field: "api", value: "10.20.30.12" },
      { kind: "request-dns" },
      { kind: "fulfill-dns" },
    );
    expect(passed(state, "dns")).toBe(false);
    expect(updateJourney(state, { kind: "install" }).installation).toBe(
      "not-started",
    );
  });
  test("manual route pauses until a separate boot observation, then uses the same installation", () => {
    const waiting = apply(
      prepared(),
      { kind: "boot-route", route: "local" },
      { kind: "install" },
      { kind: "tick-installation" },
    );
    expect(waiting.installation).toBe("awaiting-local-boot");
    expect(updateJourney(waiting, { kind: "tick-installation" })).toEqual(
      waiting,
    );
    const result = apply(
      waiting,
      { kind: "observe-local-boot" },
      { kind: "tick-installation" },
    );
    expect(result.installation).toBe("installed");
    expect(complete(result)).toBe(false);
    expect(
      updateJourney(result, { kind: "boot-route", route: "automated" }),
    ).toEqual(result);
  });
  test("package installation and base configuration cannot bypass the customer hook", () => {
    const state = apply(
      installed(),
      { kind: "install-components", fail: false },
      { kind: "configure-components", fail: false },
    );
    expect(passed(state, "nmstate:configure")).toBe(false);
    expect(
      updateJourney(state, { kind: "verify-readiness", fail: false }),
    ).toEqual(state);
    expect(
      complete(updateJourney(state, { kind: "post-hook", fail: false })),
    ).toBe(false);
  });
  test.each([
    "install-components",
    "configure-components",
    "post-hook",
  ] satisfies Event["kind"][])(
    "%s failure preserves successful installation and unrelated results",
    (kind) => {
      const base =
        kind === "install-components"
          ? installed()
          : kind === "configure-components"
            ? apply(installed(), { kind: "install-components", fail: false })
            : apply(
                installed(),
                { kind: "install-components", fail: false },
                { kind: "configure-components", fail: false },
              );
      const failed = updateJourney(base, { kind, fail: true });
      expect(status(failed)).toBe("Failed");
      expect(failed.installation).toBe("installed");
      const retry = updateJourney(failed, { kind, fail: false });
      expect(failures(retry)).toHaveLength(0);
      expect(retry.attempts.slice(0, failed.attempts.length)).toEqual(
        failed.attempts,
      );
      expect(
        retry.attempts.filter((item) => item.action === "installation"),
      ).toHaveLength(1);
    },
  );
  test("VM correction requires a new observation; recovery retains failed history and successful checks", () => {
    const failed = updateJourney(configured(), {
      kind: "verify-readiness",
      fail: true,
    });
    expect(status(failed)).toBe("Failed");
    const corrected = updateJourney(failed, { kind: "correct" });
    expect(status(corrected)).toBe("Failed");
    const recovered = updateJourney(corrected, {
      kind: "verify-readiness",
      fail: false,
    });
    expect(complete(recovered)).toBe(true);
    expect(
      recovered.attempts
        .filter((item) => item.action === "vm-check")
        .map((item) => item.kind),
    ).toEqual(["failed", "passed"]);
    expect(
      recovered.attempts.filter((item) => item.action === "platform-check"),
    ).toHaveLength(1);
    expect(
      journeySchema.safeParse(JSON.parse(JSON.stringify(recovered))).success,
    ).toBe(true);
  });
  test("capability choices maintain storage dependency and exclude unselected requirements", () => {
    let state = updateJourney(prepared(), {
      kind: "select-capability",
      id: "storage",
    });
    expect(state.plan.selected).not.toContain("virtualization");
    state = apply(
      state,
      { kind: "install" },
      { kind: "tick-installation" },
      { kind: "tick-installation" },
      { kind: "tick-installation" },
      { kind: "install-components", fail: false },
      { kind: "configure-components", fail: false },
      { kind: "post-hook", fail: false },
      { kind: "verify-readiness", fail: false },
    );
    expect(complete(state)).toBe(true);
    expect(
      state.attempts.some(
        (attempt) =>
          attempt.action === "vm-check" ||
          attempt.action.startsWith("storage:"),
      ),
    ).toBe(false);
  });
  test("template is an explicit plan projection and cannot affect completion", () => {
    const state = apply(
      configured(),
      { kind: "verify-readiness", fail: false },
      { kind: "template-name", value: "Branch plan" },
    );
    const template = reusablePlan(state);
    expect(template.name).toBe("Branch plan");
    const serialized = JSON.stringify(template);
    for (const excluded of [
      state.plan.cluster,
      state.plan.domain,
      state.plan.api,
      '"attempts"',
      '"fulfilled"',
      '"installation"',
    ])
      expect(serialized).not.toContain(excluded);
    expect(complete(state)).toBe(true);
    expect(state.template).toBeNull();
    expect(updateJourney(state, { kind: "save-template" }).template).toEqual(
      template,
    );
  });
});
