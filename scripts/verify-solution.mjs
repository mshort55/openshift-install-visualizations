import assert from "node:assert/strict";

/** Drive one saved journey through actual UI actions, including both boot routes. */
export async function verifySolution({
  cdp,
  run,
  settle,
  wait,
  click,
  go,
  shot,
  check,
}) {
  const selector = (id) => `[data-focus="${id}"]`;
  const use = (id) => click(selector(id));
  const inspect = (chapter) => use(`chapter-${chapter}`);
  const text = (query) =>
    run(`document.querySelector(${JSON.stringify(query)}).textContent`);
  const journeyStatus = () => text('[data-testid="journey-status"]');
  const installationStatus = () => text('[data-testid="installation-status"]');
  const press = async (
    key,
    keyCode = key === "Tab" ? 9 : key === "Escape" ? 27 : 13,
  ) => {
    await cdp.send("Input.dispatchKeyEvent", {
      type: "keyDown",
      key,
      code: key,
      windowsVirtualKeyCode: keyCode,
      ...(key === "Enter" ? { text: "\r" } : {}),
    });
    await cdp.send("Input.dispatchKeyEvent", {
      type: "keyUp",
      key,
      code: key,
      windowsVirtualKeyCode: keyCode,
    });
    await settle();
  };
  const focus = async (id) => {
    await run(
      `document.querySelector(${JSON.stringify(selector(id))}).focus(); document.querySelector(${JSON.stringify(selector(id))}).scrollIntoView({block:'center'})`,
    );
    await settle();
  };
  const fill = async (id, value) => {
    await focus(id);
    await run("document.activeElement.select()");
    await cdp.send("Input.insertText", { text: value });
    if (!value) {
      await cdp.send("Input.dispatchKeyEvent", {
        type: "keyDown",
        key: "Backspace",
        code: "Backspace",
        windowsVirtualKeyCode: 8,
      });
      await cdp.send("Input.dispatchKeyEvent", {
        type: "keyUp",
        key: "Backspace",
        code: "Backspace",
        windowsVirtualKeyCode: 8,
      });
    }
    await settle();
  };
  const open = async (id) => {
    if (
      !(await run(
        `document.querySelector(${JSON.stringify(selector(`solution-detail-${id}`))}).parentElement.open`,
      ))
    )
      await use(`solution-detail-${id}`);
  };
  const saved = () =>
    wait(`!!document.querySelector('[data-save-state="saved"]')`);
  const reading = () =>
    run(
      `({ hash: location.hash, scroll: scrollY, focus: document.activeElement?.getAttribute('data-focus'), opened: [...document.querySelectorAll('main details[open] > summary')].map(el => el.getAttribute('data-focus')).sort() })`,
    );
  const restored = async (expected, message) => {
    const actual = await reading();
    assert.ok(
      Math.abs(actual.scroll - expected.scroll) < 3,
      `${message}: scroll ${actual.scroll} vs ${expected.scroll}`,
    );
    assert.deepEqual(
      { ...actual, scroll: 0 },
      { ...expected, scroll: 0 },
      message,
    );
  };
  const assertFits = async (name) =>
    check(
      "document.documentElement.scrollWidth <= document.documentElement.clientWidth",
      name,
    );
  const screenshotAt = async (name, target) => {
    await run(
      `document.querySelector(${JSON.stringify(target)}).scrollIntoView({block:'start'})`,
    );
    await settle();
    await assertFits(name);
    await shot(name);
  };
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await go("#/solution-example", true);
  await use("solution-reset");
  await check(
    `document.querySelector('h1').textContent.includes('From prerequisites to infrastructure readiness') && document.body.textContent.includes('Start from template') && document.body.textContent.includes('rendezvous host')`,
    "Opening explains the foundation and both entry choices",
  );
  await shot("solution-opening-1440");
  await focus("solution-new-deployment");
  await press("Enter");
  assert.equal(await journeyStatus(), "Needs input");
  assert.equal(await installationStatus(), "Not started");
  await check(
    `document.activeElement.id === 'solution-chapter-preparation'`,
    "Keyboard entry focuses the selected action heading",
  );
  await press("Tab");
  await check(
    `document.activeElement.getAttribute('data-focus') === 'solution-cluster' && document.activeElement.matches(':focus-visible')`,
    "Tab reaches the editable cluster field with visible focus",
  );
  await fill("solution-cluster", "edge-demo");
  await fill("solution-prerequisite-name", "Approve site access");
  await fill("solution-prerequisite-owner", "Security team");
  await saved();
  await go("#/solution-example?chapter=preparation", true);
  await check(
    `document.querySelector('[data-focus=solution-api]').value === '' && document.querySelector('[data-focus=solution-cluster]').value === 'edge-demo' && document.querySelector('[data-focus=solution-prerequisite-name]').value === 'Approve site access'`,
    "Incomplete inputs and unsubmitted prerequisite draft survive refresh",
  );
  await use("solution-add-prerequisite");
  await saved();
  await inspect("readiness");
  assert.equal(await journeyStatus(), "Needs input");
  assert.equal(await installationStatus(), "Not started");
  await check(
    `document.querySelector('[data-focus=solution-verify-readiness]').disabled`,
    "Inspecting a future phase cannot run dependent work",
  );
  for (const chapter of [
    "introduction",
    "preparation",
    "installation",
    "readiness",
    "handoff",
    "reuse",
  ]) {
    await go(
      `#/solution-example?chapter=${chapter}&moment=5&recovered=true`,
      true,
    );
    await check(
      `location.hash === '#/solution-example?chapter=${chapter}' && !!document.getElementById('solution-chapter-${chapter}')`,
      `Legacy ${chapter} is an intelligible entry without execution parameters`,
    );
    assert.equal(await installationStatus(), "Not started");
  }
  await go("#/solution-example?chapter=invalid", true);
  await check(
    `location.hash.endsWith('chapter=introduction')`,
    "Unknown reading location recovers to opening",
  );
  await inspect("preparation");
  await check(
    `document.querySelector('.solution-checklist').textContent.includes('Approve site access')`,
    "Customized prerequisite survives refresh and inspection",
  );

  // Real nested contextual navigation must restore reading state, not execution.
  await focus("solution-link-to-preparation-dns");
  const story = await reading();
  await press("Enter");
  await focus("explore-prerequisites-dns");
  const support = await reading();
  await press("Enter");
  await check(
    `location.hash === '#/prerequisites/dns' && document.querySelector('[data-focus=context-return]').textContent.includes('DNS and cluster access')`,
    "Nested Network prep entry names its origin",
  );
  await run("history.back()");
  await wait(`location.hash === '#/journey/dns'`);
  await settle();
  await restored(support, "Back restores the supporting task");
  await run("history.forward()");
  await wait(`location.hash === '#/prerequisites/dns'`);
  await settle();
  await use("context-return");
  await restored(
    support,
    "Nested return restores supporting selection, focus and scroll",
  );
  await use("context-return");
  await restored(story, "Contextual return restores Solution reading position");
  await use("nav-choices");
  await use("nav-solution-example");
  await restored(story, "General page navigation retains Solution context");

  await focus("solution-sample-address");
  await press("Enter");
  await check(
    `document.querySelector('[data-focus=solution-api]').value === '10.20.30.12'`,
    "Keyboard supplies the sample IPAM answer",
  );
  await check(
    `document.querySelector('[data-action-status=dns]').textContent === 'Planned'`,
    "Sample address alone does not establish DNS",
  );
  await click('[data-focus^="solution-fulfill-"]');
  await inspect("operators");
  await focus("solution-detail-operator-group");
  await press("Enter");
  await check(
    `document.querySelectorAll('[data-capability]').length === 5`,
    "Operator group exposes all five conditional examples",
  );
  await use("solution-select-storage");
  await check(
    `!document.querySelector('[data-focus=solution-select-virtualization]').checked`,
    "Removing storage removes its dependent Virtualization choice",
  );
  await use("solution-select-virtualization");
  await check(
    `document.querySelector('[data-focus=solution-select-storage]').checked && !document.querySelector('[data-focus=solution-select-sriov]').checked`,
    "Virtualization selects storage; SR-IOV remains conditional",
  );
  await inspect("dns");
  await use("solution-request-dns");
  assert.equal(await journeyStatus(), "Waiting for Network team");
  await check(
    `document.querySelector('.solution-request').textContent.includes('api.edge-demo.dc.example.com') && document.querySelector('.solution-request').textContent.includes('10.20.30.12')`,
    "Generated request uses edited inputs",
  );
  await go("#/solution-example?chapter=dns", true);
  assert.equal(await journeyStatus(), "Waiting for Network team");
  await use("solution-fulfill-dns");
  await check(
    `document.querySelector('[data-action-status=dns]').textContent === 'Unverified'`,
    "Fulfillment and closed ticket do not verify DNS",
  );
  await use("solution-verify-dns");
  await open("dns-evidence");
  await check(
    `document.querySelector('.solution-evidence').textContent.includes('admin-probe-01') && document.querySelector('.solution-evidence').textContent.includes('UDP and TCP')`,
    "DNS evidence identifies scope, probe and protocols",
  );
  await inspect("pre-hooks");
  await open("pre-hook-failure");
  await use("solution-fail-pre-hook");
  assert.equal(await journeyStatus(), "Failed");
  await use("solution-run-pre-hook");
  await check(
    `document.querySelectorAll('.solution-evidence li').length === 2`,
    "Pre-hook retry retains failure evidence",
  );
  await inspect("preflight");
  await use("solution-preflight");
  await inspect("installation");
  await check(
    `document.querySelector('[data-focus=solution-boot-automated]').getAttribute('aria-pressed') === 'true'`,
    "Automated route is default",
  );
  await use("solution-start-installation");
  await wait(
    `document.querySelector('[data-testid=installation-status]').textContent === 'Cluster installed successfully'`,
  );
  assert.notEqual(await journeyStatus(), "Complete");
  await inspect("preparation");
  await check(
    `document.querySelector('[data-focus=solution-cluster]').readOnly`,
    "Execution inputs lock once installation begins",
  );
  await inspect("operators");
  await open("operator-group");
  await open("operator-failure");
  await use("solution-fail-operator");
  assert.equal(await journeyStatus(), "Failed");
  assert.equal(await installationStatus(), "Cluster installed successfully");
  await inspect("reuse");
  assert.equal(await journeyStatus(), "Failed");
  await inspect("operators");
  await use("solution-install-components");
  await check(
    `document.querySelector('[data-capability=nmstate]').textContent.includes('Awaiting customer post-installation hook')`,
    "Installed does not mean configured or Ready",
  );
  await use("solution-fail-configuration");
  assert.equal(await journeyStatus(), "Failed");
  await use("solution-configure-components");
  await open("operator-nmstate-evidence");
  await check(
    `document.querySelector('[data-capability=nmstate]').textContent.includes('Failed') && document.querySelector('[data-capability=storage]').textContent.includes('Awaiting readiness verification')`,
    "Operator retries retain history while successful components wait for checks",
  );
  await inspect("post-hooks");
  await open("post-hook-failure");
  await use("solution-fail-post-hook");
  assert.equal(await journeyStatus(), "Failed");
  await inspect("readiness");
  await check(
    `document.querySelector('[data-focus=solution-verify-readiness]').disabled`,
    "Readiness cannot bypass a failed customer configuration job",
  );
  await inspect("post-hooks");
  await use("solution-run-post-hook");
  await check(
    `document.querySelector('.solution-evidence').textContent.includes('applied selected site network attachments')`,
    "Customer configuration job has an outcome separate from smoke tests",
  );
  await inspect("readiness");
  await open("readiness-failure");
  await use("solution-fail-readiness");
  assert.equal(await journeyStatus(), "Failed");
  assert.equal(await installationStatus(), "Cluster installed successfully");
  await open("readiness-evidence");
  await check(
    `document.querySelector('.solution-evidence').textContent.includes('cleanup verified') && document.querySelector('.solution-failure').textContent.includes('egress ACL')`,
    "VM failure has diagnosis, retained work and cleanup evidence",
  );
  await saved();
  await go("#/solution-example?chapter=readiness", true);
  assert.equal(await journeyStatus(), "Failed");
  await open("readiness-evidence");

  // Failure evidence, operator details, hooks and manual instructions at every requested width.
  for (const width of [320, 390, 768, 1440]) {
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width,
      height: 1000,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await screenshotAt(`solution-failure-${width}`, ".solution-failure");
    await screenshotAt(
      `solution-evidence-${width}`,
      ".solution-evidence li[data-result=failed]",
    );
    await inspect("operators");
    await open("operator-group");
    await screenshotAt(
      `solution-operators-${width}`,
      '[data-capability="nmstate"]',
    );
    await screenshotAt(
      `solution-storage-${width}`,
      '[data-capability="storage"]',
    );
    await inspect("post-hooks");
    await screenshotAt(`solution-post-hooks-${width}`, ".solution-request");
    await inspect("pre-hooks");
    await screenshotAt(`solution-pre-hooks-${width}`, ".solution-request");
    await inspect("installation");
    await open("manual-boot");
    await screenshotAt(
      `solution-manual-${width}`,
      '[data-focus="solution-detail-manual-boot"]',
    );
    await run("document.documentElement.style.fontSize = '28px'");
    await focus("chapter-readiness");
    await check(
      `(() => { const rect = document.activeElement.getBoundingClientRect(); return rect.top >= 0 && rect.bottom <= innerHeight; })()`,
      "Enlarged-text phase navigation remains reachable in the viewport",
    );
    await screenshotAt(
      `solution-manual-enlarged-${width}`,
      '[data-focus="solution-detail-manual-boot"]',
    );
    await inspect("operators");
    await open("operator-group");
    await screenshotAt(
      `solution-operators-enlarged-${width}`,
      '[data-capability="storage"]',
    );
    await inspect("post-hooks");
    await screenshotAt(`solution-hooks-enlarged-${width}`, ".solution-request");
    await inspect("readiness");
    await open("readiness-evidence");
    await screenshotAt(
      `solution-evidence-enlarged-${width}`,
      '.solution-evidence li[data-result="failed"]',
    );
    await run("document.documentElement.style.fontSize = ''");
  }
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await focus("solution-correct-network");
  await press("Enter");
  assert.equal(await journeyStatus(), "Failed");
  await focus("solution-verify-readiness");
  await press("Enter");
  assert.equal(await journeyStatus(), "Complete");
  await check(
    `document.querySelector('.solution-evidence').textContent.includes('timed out') && document.querySelector('.solution-evidence').textContent.includes('returned 200') && document.querySelectorAll('.solution-evidence li').length === 8`,
    "Targeted recovery retains failure and correction and does not rerun successful checks",
  );
  const { nodes } = await cdp.send("Accessibility.getFullAXTree");
  assert.ok(
    nodes.some(
      (node) =>
        node.role?.value === "status" &&
        node.properties?.some(
          (property) =>
            property.name === "atomic" && property.value.value === true,
        ),
    ),
    "Execution status changes use an atomic live region",
  );
  await shot("solution-complete-1440");
  await inspect("reuse");
  await fill("solution-template-name", "Branch virtualization plan");

  // Storage errors are injected at the browser boundary; no external service is mocked.
  await run(
    `window.__originalSetItem = Storage.prototype.setItem; Storage.prototype.setItem = function() { throw new DOMException('quota', 'QuotaExceededError'); }`,
  );
  await use("solution-save-template");
  await wait(`!!document.querySelector('[data-save-state=error]')`);
  await check(
    `document.querySelector('.solution-template-result').textContent.includes('in this tab only') && !document.querySelector('.solution-template-result').textContent.includes('saved in this browser')`,
    "Failed storage write never claims the template is saved",
  );
  assert.equal(await journeyStatus(), "Complete");
  await run("Storage.prototype.setItem = window.__originalSetItem");
  await use("solution-retry-save");
  await saved();
  await check(
    `document.querySelector('.solution-template-result').textContent.includes('Template “Branch virtualization plan” saved in this browser')`,
    "Template success is confirmed only after persistence succeeds",
  );
  const stored = await run(
    `JSON.parse(localStorage.getItem('openshift.solution-journey.v1'))`,
  );
  assert.equal(stored.template.name, "Branch virtualization plan");
  const templateText = JSON.stringify(stored.template);
  for (const excluded of [
    "edge-demo",
    "dc.example.com",
    "10.20.30.12",
    '"attempts"',
    '"fulfilled"',
  ])
    assert.ok(
      !templateText.includes(excluded),
      `Reusable template excludes ${excluded}`,
    );
  assert.ok(
    templateText.includes("Approve site access") &&
      templateText.includes("Security team"),
  );
  await go("#/solution-example?chapter=reuse", true);
  assert.equal(await journeyStatus(), "Complete");
  await check(
    `document.querySelector('.solution-template-result').textContent.includes('Branch virtualization plan')`,
    "Saved template survives refresh",
  );

  // Share only the location, including the existing selectable clipboard fallback.
  await run(
    `Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async value => { window.__copied = value; } } })`,
  );
  await use("share-view");
  assert.equal(
    new URL(await run("window.__copied")).hash,
    "#/solution-example?chapter=reuse",
  );
  await run(
    `navigator.clipboard.writeText = async () => { throw new Error('denied'); }`,
  );
  await focus("share-view");
  await press("Enter");
  await check(
    `document.activeElement.id === 'share-url' && document.activeElement.selectionEnd === document.activeElement.value.length`,
    "Denied clipboard opens a selected manual-copy field",
  );
  await press("Escape");
  await check(
    `document.activeElement.getAttribute('data-focus') === 'share-view'`,
    "Closing share dialog restores keyboard focus",
  );

  // Reset only this example, then run the local route and a smaller capability plan.
  await run(`localStorage.setItem('unrelated-verification-marker', 'keep')`);
  await use("solution-reset");
  await saved();
  await check(
    `localStorage.getItem('unrelated-verification-marker') === 'keep'`,
    "Reset preserves unrelated browser state",
  );
  await use("solution-new-deployment");
  await use("solution-sample-address");
  await inspect("operators");
  await open("operator-group");
  await use("solution-select-storage");
  await inspect("dns");
  await use("solution-request-dns");
  await use("solution-fulfill-dns");
  await use("solution-verify-dns");
  await inspect("pre-hooks");
  await use("solution-run-pre-hook");
  await inspect("preflight");
  await use("solution-preflight");
  await inspect("installation");
  await focus("solution-boot-local");
  await press("Enter");
  await check(
    `document.querySelector('[data-focus=solution-boot-local]').getAttribute('aria-pressed') === 'true'`,
    "Keyboard selects the local route",
  );
  await use("solution-start-installation");
  await wait(
    `document.querySelector('[data-testid=installation-status]').textContent === 'Waiting for local boot'`,
  );
  await open("manual-boot");
  await check(
    `document.querySelector('.solution-scene').textContent.includes('site-admin-01') && document.querySelector('.solution-scene').textContent.includes('10.20.40.31')`,
    "Manual instructions identify the access station and target BMCs",
  );
  await go("#/solution-example?chapter=installation", true);
  assert.equal(await journeyStatus(), "Waiting for Site operations");
  await inspect("readiness");
  assert.equal(await installationStatus(), "Waiting for local boot");
  await inspect("installation");
  await use("solution-observe-local-boot");
  await wait(
    `document.querySelector('[data-testid=installation-status]').textContent === 'Cluster installed successfully'`,
  );
  await inspect("operators");
  await use("solution-install-components");
  await use("solution-configure-components");
  await inspect("post-hooks");
  await use("solution-run-post-hook");
  await inspect("readiness");
  await use("solution-verify-readiness");
  assert.equal(await journeyStatus(), "Complete");
  await check(
    `!document.querySelector('.solution-checklist').textContent.includes('OpenShift Virtualization') && !document.querySelector('.solution-checklist').textContent.includes('Persistent storage')`,
    "Unselected capabilities are outside readiness requirements",
  );
  await cdp.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  await assertFits("Reduced-motion layout remains usable");
  await shot("solution-local-complete-1440");
  await cdp.send("Emulation.setEmulatedMedia", { features: [] });
  await run(`localStorage.removeItem('unrelated-verification-marker')`);
}
