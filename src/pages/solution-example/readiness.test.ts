import { expect, test } from "vitest";
import { initialReadiness, readinessView, recoverReadiness } from "./readiness";

test("a fresh readiness scene preserves installation but fails the required guest hook", () => {
  const view = readinessView({ state: initialReadiness });
  expect(view.status).toBe("Failed — customer hook");
  expect(view.installation).toBe("Cluster installed successfully");
  expect(view.attempts).toHaveLength(1);
  expect(view.attempts[0]?.result).toContain("HTTPS /health timed out");
  expect(view.completion).toBeNull();
});

test("targeted recovery preserves earlier successes and the failed attempt", () => {
  const before = readinessView({ state: initialReadiness });
  const after = readinessView({ state: recoverReadiness() });
  expect(after.installation).toBe(before.installation);
  expect(after.preservedResults).toEqual(before.preservedResults);
  expect(after.preservedResults.join(" ")).toContain(
    "Virtualization configured",
  );
  expect(after.preservedResults.join(" ")).toContain("site-validation");
  expect(after.attempts[0]).toEqual(before.attempts[0]);
  expect(after.attempts).toHaveLength(2);
  expect(after.attempts[1]?.result).toContain("Job execution succeeded");
  expect(after.attempts[1]?.result).toContain("HTTP 200 / edge-east-smoke-ok");
  expect(readinessView({ state: initialReadiness }).status).toBe(before.status);
});

test("the completed scene includes declared verification, cleanup and a handoff", () => {
  const view = readinessView({ state: recoverReadiness() });
  expect(view.status).toBe("Complete");
  expect(view.completion?.checks.join(" ")).toContain("Guest responsiveness");
  expect(view.completion?.checks.join(" ")).toContain(
    "PVC-backed data-disk write/read",
  );
  expect(view.completion?.checks.join(" ")).toContain(
    "scheduling on both workers, pod DNS, cross-node traffic and baseline Route",
  );
  expect(view.completion?.cleanup).toContain(
    "VM/VMI, DataVolumes, test PVCs and backend volumes",
  );
  expect(view.completion?.cleanup).toContain(
    "temporary access resources removed",
  );
  expect(view.completion?.cleanup).toContain("result artifacts are retained");
  expect(view.completion?.handoff).toContain(
    "Platform team → Application team",
  );
});
