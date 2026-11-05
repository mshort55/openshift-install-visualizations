import { expect, test } from "vitest";
import { scenes } from "./model";
import {
  initialPreparation,
  type PreparationAction,
  preparationView,
  updatePreparation,
} from "./preparation";

test("save and resume retain the supplied plan and its missing API address", () => {
  let state = initialPreparation;
  for (const action of ["save", "resume"] satisfies PreparationAction[]) {
    state = updatePreparation({ state, action });
    expect(preparationView({ state })).toMatchObject({
      identity: "edge-east",
      baseDomain: "dc.example.com",
      apiAddress: "",
      ingressAddress: "10.20.30.11",
      resolver: "10.20.10.53",
      owner: "Network team",
      status: "Needs input",
      installation: "Not started",
      dns: "Not run",
      readiness: "Not established",
    });
    expect(preparationView({ state }).message).toContain(
      action === "save" ? "Preparation saved" : "Preparation resumed",
    );
    expect(preparationView({ state }).message).toContain("API address missing");
  }
});

test("the sample answer survives saving without establishing installation or readiness", () => {
  let state = initialPreparation;
  for (const action of [
    "supply-sample",
    "save",
    "resume",
  ] satisfies PreparationAction[]) {
    state = updatePreparation({ state, action });
    expect(preparationView({ state })).toMatchObject({
      apiAddress: "10.20.30.12",
      status: "Ready to run — prerequisite checks",
      installation: "Not started",
      dns: "Not run",
      readiness: "Not established",
    });
    expect(preparationView({ state }).message).not.toContain(
      "API address missing",
    );
  }
  expect(preparationView({ state }).message).toContain("Preparation resumed");
});

test("a saved plan must be resumed before the sample can change it", () => {
  const saved = updatePreparation({
    state: initialPreparation,
    action: "save",
  });
  const attempted = updatePreparation({
    state: saved,
    action: "supply-sample",
  });
  const resumed = updatePreparation({ state: attempted, action: "resume" });
  expect(preparationView({ state: resumed }).apiAddress).toBe("");
  expect(preparationView({ state: resumed }).message).toContain(
    "Preparation resumed",
  );
  const answered = updatePreparation({
    state: resumed,
    action: "supply-sample",
  });
  expect(preparationView({ state: answered }).apiAddress).toBe("10.20.30.12");
  expect(preparationView({ state: answered }).message).toContain(
    "Sample IPAM answer",
  );
});

test("preparation work leaves independent later scenes and fresh defaults intact", () => {
  const defaults = structuredClone(scenes);
  let state = initialPreparation;
  for (const action of [
    "save",
    "resume",
    "supply-sample",
  ] satisfies PreparationAction[]) {
    state = updatePreparation({ state, action });
  }
  expect(scenes).toEqual(defaults);
  expect(preparationView({ state: initialPreparation })).toMatchObject({
    apiAddress: "",
    status: "Needs input",
    installation: "Not started",
    dns: "Not run",
    readiness: "Not established",
  });
});
