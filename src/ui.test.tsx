import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import rawCatalog from "../data/bare-metal-4.22.json";
import { parseCatalog } from "./catalog";
import { App } from "./ui";

test("the default page shows the Assisted path and omits the ingress load balancer", () => {
  const parsed = parseCatalog(rawCatalog);
  if (!parsed.ok) throw new Error("catalog did not parse");
  const html = renderToStaticMarkup(<App catalog={parsed.value} />);
  expect(html).toContain("Can the hosts reach the internet?");
  expect(html).toContain("Assisted Installer");
  expect(html).toContain("Leave FIPS off");
  expect(html).not.toContain("Ingress load balancer");
  expect(html).toContain("1.1. The OpenShift Container Platform installation");
});
