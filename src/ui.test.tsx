import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import rawCatalog from "../data/bare-metal-4.22.json";
import { parseCatalog } from "./catalog";
import { App } from "./ui";

function page(view?: "path" | "map") {
  const parsed = parseCatalog(rawCatalog);
  if (!parsed.ok) throw new Error("catalog did not parse");
  return renderToStaticMarkup(
    view ? (
      <App catalog={parsed.value} initialView={view} />
    ) : (
      <App catalog={parsed.value} />
    ),
  );
}

test("step through starts with no selection and only the first decision", () => {
  const html = page();
  expect(html).toContain("Agent-based bare metal decisions");
  expect(html).toContain('data-view="path"');
  expect(html).toContain('class="mode" aria-pressed="true"');
  expect(html).not.toContain('class="option" aria-pressed="true"');
  expect(html).toContain("CPU architecture");
  expect(html).not.toContain('data-decision="nmstate-ethernet"');
  expect(html).not.toContain("Assisted Installer");
  expect(html).not.toContain("Installer-provisioned");
  expect(html).not.toContain("User-provisioned");
});

test("a selected question offers clear selection, and an open question does not", () => {
  const parsed = parseCatalog(rawCatalog);
  if (!parsed.ok) throw new Error("catalog did not parse");
  const html = renderToStaticMarkup(
    <App
      catalog={parsed.value}
      initialView="map"
      initialHash="network-access=connected"
    />,
  );
  expect(html).toContain('aria-label="Clear Network reachability selection"');
  expect(html).toContain("Clear selection");
  expect(html).toContain('aria-pressed="true"');
  expect(html).toContain('aria-label="Connected"');
  const open = page();
  expect(open).not.toContain("Clear selection");
  expect(open).not.toContain('class="example"');
});

test("a selected option shows its documented example and the others do not", () => {
  const parsed = parseCatalog(rawCatalog);
  if (!parsed.ok) throw new Error("catalog did not parse");
  const html = renderToStaticMarkup(
    <App
      catalog={parsed.value}
      initialView="path"
      initialHash="architecture=amd64"
    />,
  );
  expect(html).toContain("compute.architecture: amd64");
  expect(html).not.toContain("compute.architecture: arm64");
  expect(html).toContain('class="example"');
});

test("see every option shows later branches before anything is selected", () => {
  const html = page("map");
  expect(html).toContain('data-view="map"');
  expect(html).toContain('data-decision="nmstate-ethernet"');
  expect(html).toContain('data-decision="nmstate-bond"');
  expect(html).toContain('data-decision="nmstate-vlan"');
  expect(html).toContain('data-decision="nmstate-linux-bridge"');
  expect(html).toContain('data-decision="nmstate-vrf"');
  expect(html).toContain('data-decision="nmstate-infiniband"');
  expect(html).toContain("NIC bond");
  expect(html).toContain("SR-IOV");
  expect(html).toContain("Written in the host networkConfig.");
  expect(html).toContain(
    "Written in a NodeNetworkConfigurationPolicy after installation.",
  );
  expect(html).not.toContain("option-muted");
  const article = (id: string) => {
    const start = html.indexOf(`data-decision="${id}"`);
    const next = html.indexOf("data-decision=", start + 1);
    return html.slice(start, next === -1 ? undefined : next);
  };
  expect(article("nmstate-ethernet")).toContain("nmstate-mark");
  expect(article("architecture")).not.toContain("nmstate-mark");
  expect(article("ip-family")).not.toContain("nmstate-mark");
  expect(article("cluster-network")).not.toContain("nmstate-mark");
  expect(html).not.toContain('class="option" aria-pressed="true"');
  expect(html).toContain("Day-2 storage class");
  expect(html).not.toContain("lvms-vg1");
});

test("a selected storage class shows its class name, and the self-contained ISO shows the operator bundle", () => {
  const parsed = parseCatalog(rawCatalog);
  if (!parsed.ok) throw new Error("catalog did not parse");
  const storage = renderToStaticMarkup(
    <App
      catalog={parsed.value}
      initialView="map"
      initialHash="storage-class=odf"
    />,
  );
  expect(storage).toContain("ocs-storagecluster-ceph-rbd");
  expect(storage).not.toContain("lvms-vg1");
  const operators = renderToStaticMarkup(
    <App
      catalog={parsed.value}
      initialView="map"
      initialHash="network-access=connected&release-source=no-external-registry&install-operators=virtualization-bundle"
    />,
  );
  expect(operators).toContain("Virtualization bundle");
  expect(operators).toContain(">Virtualization</code>");
});

test("selecting custom manifests shows the documented examples", () => {
  const parsed = parseCatalog(rawCatalog);
  if (!parsed.ok) throw new Error("catalog did not parse");
  const html = renderToStaticMarkup(
    <App
      catalog={parsed.value}
      initialView="map"
      initialHash="custom-manifests=add"
    />,
  );
  expect(html).toContain("kind: MachineConfig");
  expect(html).toContain("name: 10-br-ex-worker");
  expect(html).toContain("name: multicluster-engine");
  expect(html).toContain("name: local-storage-operator");
  expect(html).not.toContain("The openshift directory is omitted.");
});

test("SAN and SMB storage classes both show when both are included", () => {
  const parsed = parseCatalog(rawCatalog);
  if (!parsed.ok) throw new Error("catalog did not parse");
  const html = renderToStaticMarkup(
    <App
      catalog={parsed.value}
      initialView="map"
      initialHash="array-storage=include&array-san=include&array-smb=include"
    />,
  );
  expect(html).toContain("name: filesystem1");
  expect(html).toContain("provisioner: spectrumscale.csi.ibm.com");
  expect(html).toContain("name: samba");
  expect(html).toContain("provisioner: smb.csi.k8s.io");
  expect(html).not.toContain("kind: PersistentVolume");
});

test("day-2 consumers show their documented examples when selected", () => {
  const parsed = parseCatalog(rawCatalog);
  if (!parsed.ok) throw new Error("catalog did not parse");
  const html = renderToStaticMarkup(
    <App
      catalog={parsed.value}
      initialView="map"
      initialHash="registry-storage=odf-rgw&monitoring-storage=persist&user-workload-monitoring=enable&user-workload-storage=persist&user-alert-routing=dedicated&logging-store=loki&alert-receiver=external&identity-provider=htpasswd&infra-nodes=label&update-channel=fast&etcd-encryption=aesgcm&worker-latency=medium"
    />,
  );
  expect(html).toContain("ocs-storagecluster-ceph-rgw");
  expect(html).toContain("cluster-monitoring-config");
  expect(html).toContain("enableUserWorkload: true");
  expect(html).toContain("user-workload-monitoring-config");
  expect(html).toContain("logging-loki");
  expect(html).toContain("Microsoft Teams");
  expect(html).toContain("type: HTPasswd");
  expect(html).toContain("node-role.kubernetes.io/infra");
  expect(html).toContain("enableAlertmanagerConfig: true");
  expect(html).toContain("fast-4.22");
  expect(html).toContain("spec.encryption.type: aesgcm");
  expect(html).toContain("MediumUpdateAverageReaction");
  expect(html).not.toContain("No LokiStack");
});
