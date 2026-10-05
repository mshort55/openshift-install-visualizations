import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import rawCatalog from "../data/bare-metal-4.22.json";
import { parseCatalog } from "./catalog";
import { App } from "./ui";

test("the default page shows the agent-based tree, including branches that are not selected", () => {
  const parsed = parseCatalog(rawCatalog);
  if (!parsed.ok) throw new Error("catalog did not parse");
  const html = renderToStaticMarkup(<App catalog={parsed.value} />);
  expect(html).toContain("Agent-based bare metal decisions");
  expect(html).toContain('aria-label="Static NMState"');
  expect(html).toContain('data-decision="nic-layout"');
  expect(html).toContain("NIC bond");
  expect(html).toContain("SR-IOV");
  expect(html).toContain("Leads to");
  expect(html).not.toContain("Assisted Installer");
  expect(html).not.toContain("Installer-provisioned");
  expect(html).not.toContain("User-provisioned");
});
