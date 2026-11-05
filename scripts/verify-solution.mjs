import assert from "node:assert/strict";

/** The three demonstrations, independent samples, navigation and sharing. */
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
  const defaults = [
    ["introduction", "Needs input", "Not started"],
    ["preparation", "Needs input", "Not started"],
    ["installation", "Ready to run", "Cluster installed successfully"],
    ["readiness", "Failed — customer hook", "Cluster installed successfully"],
    ["handoff", "Complete", "Cluster installed successfully"],
    ["reuse", "Complete", "Cluster installed successfully"],
  ];
  const press = async (
    key,
    code = key,
    keyCode = key === "Tab" ? 9 : key === "Escape" ? 27 : 13,
  ) => {
    await cdp.send("Input.dispatchKeyEvent", {
      type: "keyDown",
      key,
      code,
      windowsVirtualKeyCode: keyCode,
      ...(key === "Enter" ? { text: "\r" } : {}),
    });
    await cdp.send("Input.dispatchKeyEvent", {
      type: "keyUp",
      key,
      code,
      windowsVirtualKeyCode: keyCode,
    });
    await settle();
  };
  const focus = async (selector) => {
    await run(
      `document.querySelector(${JSON.stringify(selector)}).focus(); document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:"center"})`,
    );
    await settle();
  };
  const reading = () =>
    run(
      `({ hash: location.hash, scroll: scrollY, focus: document.activeElement?.getAttribute("data-focus"), opened: [...document.querySelectorAll('main details[open] > summary, main [aria-expanded=true]')].map(el => el.id || el.getAttribute('data-focus')).sort() })`,
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
  const preparationPlan = () =>
    run(`({
      identity: document.querySelector('.solution-outcomes h3').textContent,
      fields: [...document.querySelector('.solution-facts').children].map(field => ({
        label: field.querySelector('dt').textContent,
        value: field.querySelector('input')?.value ?? field.querySelector('dd').textContent
      })),
      owner: document.querySelector('.solution-scene > p:not(.solution-eyebrow) strong').textContent,
      checklist: [...document.querySelectorAll('.solution-checklist li')].map(el => el.textContent)
    })`);
  for (const [chapter, journey, installation] of defaults) {
    await go(
      `#/solution-example?chapter=${chapter}&moment=5&recovered=true`,
      true,
    );
    await check(
      `location.hash === '#/solution-example?chapter=${chapter}' && document.querySelectorAll('main').length === 1 && !!document.getElementById('solution-chapter-${chapter}')`,
      `Direct ${chapter} opens in production route shape`,
    );
    await check(
      `document.querySelector('.solution-outcomes').textContent.includes(${JSON.stringify(journey)}) && document.querySelector('.solution-outcomes').textContent.includes(${JSON.stringify(installation)})`,
      `${chapter} has independent outcomes`,
    );
    await check(
      `!document.querySelector('main details[open]') && !document.querySelector('[data-focus=context-return]') && document.querySelector('.app-return').textContent.includes('Explore how installation works')`,
      "Fresh documents have closed disclosures and no invented origin",
    );
    await check(
      `document.querySelector('.solution-chapters [aria-current=step] a[aria-current=step]').getAttribute('href').endsWith('chapter=${chapter}')`,
      "Chapter and phase selection are exposed",
    );
    if (chapter === "installation") {
      await check(
        `document.querySelector('[data-focus="solution-boot-automated"]')?.getAttribute('aria-pressed') === 'true' && document.querySelector('[data-focus="solution-boot-local"]')?.getAttribute('aria-pressed') === 'false'`,
        "Automated boot is selected by default in the two-route comparison",
      );
    }
  }
  await go("#/solution-example?chapter=invalid&moment=5", true);
  await check(
    'location.hash === "#/solution-example?chapter=introduction"',
    "Invalid chapter recovers",
  );
  await go("#/solution-example", true);
  await check(
    'location.hash.endsWith("chapter=introduction")',
    "Missing chapter recovers",
  );
  await focus('[data-focus="chapter-readiness"]');
  await press("Enter");
  await check(
    'document.activeElement.id === "solution-chapter-readiness"',
    "Keyboard chapter navigation focuses the chapter heading",
  );
  await focus('[data-focus="solution-detail-hook-evidence"]');
  await press("Enter");
  await check(
    'document.querySelector("[data-focus=solution-detail-hook-evidence]").parentElement.open',
    "Keyboard opens evidence",
  );
  await focus('[data-focus="solution-link-to-readiness-platform-operators"]');
  const general = await reading();
  await click('[data-focus="nav-choices"]');
  await click('[data-focus="nav-solution-example"]');
  await restored(
    general,
    "General entry restores the last same-document chapter, disclosure and reading position",
  );

  // Disclosure changes immediately before browser navigation must remain current.
  await go("#/solution-example?chapter=introduction", true);
  await click('[data-focus="chapter-preparation"]');
  await run(
    'document.querySelector("[data-focus=solution-detail-dns-evidence]").focus({preventScroll:true})',
  );
  await press("Enter");
  await check(
    'document.querySelector("[data-focus=solution-detail-dns-evidence]").parentElement.open',
    "DNS evidence opened before history traversal",
  );
  await run("history.back()");
  await wait('location.hash.endsWith("chapter=introduction")');
  await settle();
  await run("history.forward()");
  await wait('location.hash.endsWith("chapter=preparation")');
  await settle();
  await check(
    'document.querySelector("[data-focus=solution-detail-dns-evidence]").parentElement.open',
    "Back/Forward retains a disclosure without an intervening focus or scroll event",
  );

  await go("#/solution-example?chapter=readiness", true);
  await focus('[data-focus="solution-sample-handoff"]');
  const handoffSource = await reading();
  await press("Enter");
  await run("history.back()");
  await wait('location.hash.endsWith("chapter=readiness")');
  await settle();
  await restored(handoffSource, "History restores the body handoff link");
  await check(
    'document.activeElement.closest(".solution-scene") !== null',
    "Body handoff link focus is not confused with the chapter menu",
  );

  await check(
    `document.querySelector('.solution-outcomes').textContent.includes('Failed — customer hook') && !!document.querySelector('[data-focus=solution-recover]') && !document.querySelector('[data-focus=solution-detail-readiness-verification]')`,
    "Reading the handoff cannot resolve failure or perform cleanup",
  );

  // Journey record → story → catalog task → Prerequisites, then unwind every origin.
  await go("#/journey/dns?view=problems&item=owner-wait", true);
  await focus('[data-focus="solution-link-from-owner-wait"]');
  const original = await reading();
  await press("Enter");
  await check(
    'location.hash.endsWith("chapter=preparation") && document.querySelector("[data-focus=context-return]").textContent.includes("Networking and shared services")',
    "Contextual record entry names its origin",
  );
  const partialPlan = await preparationPlan();
  assert.deepEqual(partialPlan.fields, [
    { label: "Base domain", value: "dc.example.com" },
    { label: "API address", value: "" },
    { label: "Ingress address", value: "10.20.30.11" },
    { label: "Resolver", value: "10.20.10.53" },
  ]);
  assert.equal(partialPlan.identity, "edge-east");
  assert.equal(partialPlan.owner, "Network team");
  assert.equal(partialPlan.checklist.length, 5);
  await check(
    `document.querySelector('.solution-outcomes').textContent.includes('Needs input') && document.getElementById('solution-api-help').textContent.includes('Missing — awaiting IPAM') && document.querySelector('[data-focus=solution-preparation-save-resume]').textContent === 'Save preparation'`,
    "Preparation starts with a labelled missing API address and allows saving",
  );
  const { nodes } = await cdp.send("Accessibility.getFullAXTree");
  const apiField = nodes.find(
    (node) =>
      node.role?.value === "textbox" && node.name?.value === "API address",
  );
  assert.ok(
    apiField?.description?.value.includes("Missing — awaiting IPAM"),
    "API gap is exposed to assistive technology",
  );
  assert.ok(
    apiField.properties.some(
      (property) =>
        property.name === "readonly" && property.value.value === true,
    ),
    "The bounded sample is not a general editor",
  );
  await focus('[data-focus="solution-preparation-save-resume"]');
  await press("Enter");
  assert.deepEqual(
    await preparationPlan(),
    partialPlan,
    "Saving keeps the supplied answers, checklist and API gap",
  );
  await check(
    `document.getElementById('solution-preparation-status').textContent.includes('Preparation saved') && document.getElementById('solution-preparation-status').textContent.includes('session-only demonstration; reload restores defaults') && document.getElementById('solution-preparation-status').textContent.includes('API address missing') && document.activeElement.textContent === 'Resume preparation' && !document.querySelector('[data-focus=solution-preparation-sample]')`,
    "Save with a gap announces its session limit and keeps focus on Resume",
  );
  const savedAccessibility = await cdp.send("Accessibility.getFullAXTree");
  assert.ok(
    savedAccessibility.nodes.some(
      (node) =>
        node.role?.value === "status" &&
        node.properties?.some(
          (property) =>
            property.name === "live" && property.value.value === "polite",
        ) &&
        node.properties.some(
          (property) =>
            property.name === "atomic" && property.value.value === true,
        ),
    ),
    "Saved updates use an atomic polite status region",
  );
  await shot("solution-preparation-saved");
  await focus('[data-focus="solution-detail-dns-evidence"]');
  await press("Enter");
  await check(
    `document.querySelector('.solution-scene').textContent.includes('ready-written request is independent') && document.querySelector('.solution-scene').textContent.includes('before the planned installation and client access') && document.querySelector('.solution-scene').textContent.includes('admin/client network') && document.querySelector('.solution-scene').textContent.includes('*.apps.edge-east.dc.example.com') && document.querySelector('.solution-scene').textContent.includes('Owned wait:') && document.querySelector('.solution-scene').textContent.includes('Reported:') && document.querySelector('.solution-scene').textContent.includes('Checked separately:') && document.querySelector('.solution-scene').textContent.includes('not target-host DNS, API connectivity or application readiness') && document.querySelector('[data-focus=solution-link-to-prerequisites-dns]').getAttribute('href') === '#/prerequisites/dns'`,
    "Later DNS request keeps timing, ownership, report/check separation, scope and broader DNS link",
  );
  const dnsEvidence = await run(
    `document.querySelector('[aria-label="Sample DNS commands and output"]').parentElement.textContent`,
  );
  for (const expected of [
    "4 November 2026, 10:21 UTC",
    "admin-probe-01",
    "dig @10.20.10.53 api.edge-east.dc.example.com A +short",
    "dig @10.20.10.53 api.edge-east.dc.example.com A +tcp +short",
    "dig @10.20.10.53 smoke.apps.edge-east.dc.example.com A +short",
    "dig @10.20.10.53 smoke.apps.edge-east.dc.example.com A +tcp +short",
    "# UDP: 10.20.30.12",
    "# TCP: 10.20.30.12",
    "# UDP: 10.20.30.11",
    "# TCP: 10.20.30.11",
  ])
    assert.ok(
      dnsEvidence.includes(expected),
      `DNS disclosure includes ${expected}`,
    );
  await focus('[data-focus="solution-link-to-preparation-dns"]');
  const story = await reading();
  await press("Enter");
  await focus('[data-focus="explore-prerequisites-dns"]');
  const support = await reading();
  await press("Enter");
  await check(
    'location.hash === "#/prerequisites/dns" && document.querySelector("[data-focus=context-return]").textContent.includes("DNS and cluster access")',
    "Nested supporting page keeps its immediate origin",
  );
  await run("history.back()");
  await wait('location.hash === "#/journey/dns"');
  await settle();
  await restored(support, "Back restores the supporting task");
  await run("history.forward()");
  await wait('location.hash === "#/prerequisites/dns"');
  await settle();
  await click('[data-focus="context-return"]');
  await restored(support, "Nested return restores the supporting task exactly");
  await click('[data-focus="context-return"]');
  await restored(
    story,
    "Return restores story disclosure, selection, scroll and invoking focus",
  );
  assert.deepEqual(
    await preparationPlan(),
    partialPlan,
    "Nested returns preserve the saved partial plan",
  );
  await check(
    `document.getElementById('solution-preparation-status').textContent.includes('Preparation saved')`,
    "Leaving and returning retains the saved state",
  );
  await focus('[data-focus="solution-preparation-save-resume"]');
  await press("Enter");
  assert.deepEqual(
    await preparationPlan(),
    partialPlan,
    "Resume keeps every supplied answer, checklist and gap",
  );
  await check(
    `document.getElementById('solution-preparation-status').textContent.includes('Preparation resumed') && document.querySelector('.solution-outcomes').textContent.includes('Needs input') && document.querySelector('.solution-outcomes').textContent.includes('Not started') && document.querySelector('.solution-note').textContent.includes('DNS checks: Not run') && document.querySelector('.solution-note').textContent.includes('readiness: Not established') && document.activeElement.textContent === 'Save preparation'`,
    "Resume announces the gap and preserves focus without inventing success",
  );
  await shot("solution-preparation-resumed");
  await click('[data-focus="chapter-handoff"]');
  await check(
    `document.querySelector('.solution-outcomes').textContent.includes('Complete')`,
    "An incomplete plan does not gate later chapters",
  );
  await run("history.back()");
  await wait('location.hash.endsWith("chapter=preparation")');
  await settle();
  assert.deepEqual(
    await preparationPlan(),
    partialPlan,
    "Chapter/history returns retain the resumed plan",
  );
  await check(
    `document.getElementById('solution-preparation-status').textContent.includes('Preparation resumed')`,
    "History does not rewind Resume",
  );
  await focus('[data-focus="solution-preparation-save-resume"]');
  await press("Tab");
  await check(
    `document.activeElement.getAttribute('data-focus') === 'solution-preparation-sample'`,
    "Sample answer follows Save in keyboard order",
  );
  await press("Enter");
  await check(
    `document.activeElement.id === 'solution-api-address' && document.activeElement.value === '10.20.30.12' && document.getElementById('solution-preparation-status').textContent.includes('Sample IPAM answer applied') && document.querySelector('.solution-outcomes').textContent.includes('Ready to run — prerequisite checks') && document.querySelector('.solution-outcomes').textContent.includes('Not started') && document.querySelector('.solution-note').textContent.includes('DNS checks: Not run') && document.querySelector('.solution-note').textContent.includes('readiness: Not established')`,
    "Applying the sample moves focus to its value, announces the change and leaves checks unrun",
  );
  const answeredPlan = await preparationPlan();
  assert.deepEqual(
    answeredPlan.fields,
    partialPlan.fields.map((field) =>
      field.label === "API address"
        ? { ...field, value: "10.20.30.12" }
        : field,
    ),
  );
  assert.ok(answeredPlan.checklist[1].includes("DNS verification outstanding"));
  assert.deepEqual(
    answeredPlan.checklist.filter((_, i) => i !== 1),
    partialPlan.checklist.filter((_, i) => i !== 1),
  );
  await run("history.forward()");
  await wait('location.hash.endsWith("chapter=handoff")');
  await run("history.back()");
  await wait('location.hash.endsWith("chapter=preparation")');
  await settle();
  assert.deepEqual(
    await preparationPlan(),
    answeredPlan,
    "Back/Forward cannot rewind the sample answer",
  );
  await click('[data-focus="nav-choices"]');
  await click('[data-focus="nav-solution-example"]');
  assert.deepEqual(
    await preparationPlan(),
    answeredPlan,
    "General page switches keep the updated plan",
  );
  // General navigation clears the contextual origin; history restores it.
  await run("history.back()");
  await wait('location.hash.startsWith("#/choices")');
  await run("history.back()");
  await wait('location.hash.endsWith("chapter=preparation")');
  await settle();
  await click('[data-focus="context-return"]');
  await restored(
    original,
    "Original record and disclosures survive nested excursions",
  );

  // Modified clicks retain real browser link behavior without changing this document.
  await run(
    `document.querySelector('[data-focus="solution-link-from-owner-wait"]').addEventListener('click', event => { window.__modifiedLinkPreserved = !event.defaultPrevented; event.preventDefault(); }, { once: true }); document.querySelector('[data-focus="solution-link-from-owner-wait"]').dispatchEvent(new MouseEvent('click', {bubbles:true, cancelable:true, ctrlKey:true}));`,
  );
  await check(
    'window.__modifiedLinkPreserved && location.hash.includes("owner-wait")',
    "Modified contextual click preserves browser behavior",
  );

  await go("#/solution-example?chapter=readiness");
  await click('[data-focus="solution-detail-hook-evidence"]');
  const readinessBeforeBoot = await run(
    'document.querySelector(".solution-scene").textContent',
  );
  await click('[data-focus="chapter-installation"]');
  const bootOutcomes = await run(
    'document.querySelector(".solution-outcomes").textContent',
  );
  const progression = '[aria-label="Boot and installation progression"]';
  const bootIdentity = () =>
    run('document.querySelector(".solution-boot-options + p").textContent');
  const preparedIdentity = await bootIdentity();
  assert.match(
    preparedIdentity,
    /edge-east.*configuration r3.*three control-plane hosts and two workers.*agent.x86_64.iso.*media revision r3/,
  );
  await check(
    `document.querySelector('[data-focus="solution-boot-automated"]').getAttribute('aria-pressed') === 'true' && document.querySelector('main').textContent.includes('authentication and hardware capability') && document.querySelector('main').textContent.includes('each BMC can retrieve the ISO')`,
    "Automated route states its access, authentication, hardware and media assumptions",
  );
  assert.deepEqual(
    await run(
      `[...document.querySelectorAll('${progression} > li > strong')].map(el => el.textContent)`,
    ),
    [
      "Prepare:",
      "Generate:",
      "Media attachment and boot request:",
      "Observed Agent activity:",
      "Observed installation completion:",
    ],
  );
  await check(
    `document.querySelector('${progression}').textContent.includes('BMC readback confirms ISO r3 attached') && document.querySelector('${progression}').textContent.includes('command acknowledgements do not establish observed boot') && !document.querySelector('${progression} button') && document.querySelectorAll('.solution-boot-options button').length === 2`,
    "Automated progression separates readback, acknowledgements, observed hosts and completion without step controls",
  );
  await focus('[data-focus="solution-boot-automated"]');
  await press("Tab");
  await check(
    `document.activeElement.getAttribute('data-focus') === 'solution-boot-local' && document.activeElement.matches(':focus-visible') && getComputedStyle(document.activeElement).outlineStyle !== 'none'`,
    "Local route follows automated boot in keyboard order with visible focus",
  );
  await press("Enter");
  await check(
    `document.activeElement.getAttribute('data-focus') === 'solution-boot-local' && document.activeElement.getAttribute('aria-pressed') === 'true' && document.querySelector('[data-focus="solution-boot-automated"]').getAttribute('aria-pressed') === 'false'`,
    "Keyboard selection exposes the local route without moving focus",
  );
  assert.equal(
    await bootIdentity(),
    preparedIdentity,
    "Both routes retain the same plan, hosts and media",
  );
  assert.equal(
    await run('document.querySelector(".solution-outcomes").textContent'),
    bootOutcomes,
    "Local continuation preserves installation success and required post-installation work",
  );
  for (const text of [
    "Hub-to-BMC access is blocked",
    "site-admin-01",
    "Hub installation observation remains available",
    "Waiting on Site operations — mount media and boot hosts",
    "Site operations reports ISO r3 attached",
    "This human report is separate from hub observation",
    "cp-0",
    "cp-1",
    "cp-2",
    "worker-0",
    "worker-1",
    "installation has not failed or restarted",
  ]) {
    await check(
      `document.querySelector('.solution-scene').textContent.includes(${JSON.stringify(text)})`,
      `Local comparison includes ${text}`,
    );
  }
  assert.deepEqual(
    await run(
      `[...document.querySelectorAll('${progression} > li > strong')].map(el => el.textContent)`,
    ),
    [
      "Prepare:",
      "Generate:",
      "Waiting on Site operations — mount media and boot hosts.",
      "Media attachment and boot request:",
      "Observed Agent activity:",
      "Observed installation completion:",
    ],
  );
  await press("Tab");
  await check(
    `document.activeElement.getAttribute('data-focus') === 'solution-detail-local-boot-instructions' && !document.activeElement.parentElement.open`,
    "Optional instructions follow the two choices and start closed",
  );
  await press("Enter");
  await check(
    `document.activeElement.parentElement.open && document.activeElement.matches(':focus-visible') && getComputedStyle(document.activeElement).outlineStyle !== 'none'`,
    "Instructions open by keyboard with visible focus",
  );
  assert.deepEqual(
    await run(
      `[...document.querySelectorAll('[aria-label="Example host to BMC mapping"] > div')].map(el => [el.querySelector('dt').textContent, el.querySelector('dd').textContent])`,
    ),
    [
      ["cp-0 · Control plane / rendezvous", "10.20.40.20"],
      ["cp-1 · Control plane", "10.20.40.21"],
      ["cp-2 · Control plane", "10.20.40.22"],
      ["worker-0 · Worker", "10.20.40.30"],
      ["worker-1 · Worker", "10.20.40.31"],
    ],
  );
  for (const text of [
    "Owner: Site operations",
    "site-admin-01",
    "installation disks",
    "https://media.example.invalid/edge-east/r3/agent.x86_64.iso",
    "Example media address",
    "expected r3 image identity",
    "one-time boot from virtual CD/DVD",
    "Boot rendezvous host cp-0",
    "persistent disk boot order unchanged",
    "boot times, console results",
    "configuration/media revision r3",
    "non-destructive preflight-only",
  ]) {
    await check(
      `document.querySelector('[data-focus="solution-detail-local-boot-instructions"]').parentElement.textContent.includes(${JSON.stringify(text)})`,
      `Local instructions include ${text}`,
    );
  }
  await check(
    `!document.querySelector('[data-focus="solution-detail-local-boot-instructions"]').parentElement.querySelector('a, button, input')`,
    "Instructions contain no live management links, credentials or confirmation controls",
  );
  await press("Tab");
  await check(
    `document.activeElement.getAttribute('data-focus') === 'solution-detail-boot-evidence'`,
    "Keyboard leaves instructions for supporting evidence without a trap",
  );
  await press("Enter");
  for (const text of [
    "Site operations report at 11:02 UTC",
    "local BMC readback at 11:01 UTC",
    "Agent activity at 11:03 UTC",
    "installation completion at 11:05 UTC",
    "hub-install-01",
    "/journeys/edge-east/r3",
    "rendezvous host cp-0",
    "Hub → BMC:",
    "BMC → media:",
    "Hub → installation observation:",
    "documented capabilities",
    "Metal3/Ironic and Redfish virtual media",
    "not a certified drop-in combination",
  ]) {
    await check(
      `document.querySelector('[data-focus="solution-detail-boot-evidence"]').parentElement.textContent.includes(${JSON.stringify(text)})`,
      `Boot evidence distinguishes ${text}`,
    );
  }
  await focus('[data-focus="solution-link-to-installation-hosts"]');
  const bootReading = await reading();
  await press("Enter");
  await click('[data-focus="context-return"]');
  await restored(
    bootReading,
    "Boot context return restores disclosures, scroll and focus",
  );
  await click('[data-focus="nav-choices"]');
  await click('[data-focus="nav-solution-example"]');
  await restored(
    bootReading,
    "General page return retains the boot reading context",
  );
  await click('[data-focus="chapter-readiness"]');
  assert.equal(
    await run('document.querySelector(".solution-scene").textContent'),
    readinessBeforeBoot,
    "Boot comparison preserves the existing readiness scene",
  );
  await check(
    `document.querySelector('[data-focus="solution-detail-hook-evidence"]').parentElement.open`,
    "Boot comparison leaves other chapter disclosures intact",
  );
  await run("history.back()");
  await wait('location.hash.endsWith("chapter=installation")');
  await settle();
  await restored(
    bootReading,
    "Chapter history restores boot disclosures and position",
  );
  await check(
    `document.querySelector('[data-focus="solution-boot-local"]').getAttribute('aria-pressed') === 'true'`,
    "Page and chapter returns retain the local selection",
  );
  await focus('[data-focus="solution-boot-automated"]');
  await press("Enter");
  await run("history.forward()");
  await wait('location.hash.endsWith("chapter=readiness")');
  await run("history.back()");
  await wait('location.hash.endsWith("chapter=installation")');
  await settle();
  await check(
    `document.querySelector('[data-focus="solution-boot-automated"]').getAttribute('aria-pressed') === 'true'`,
    "Back/Forward cannot rewind a changed boot choice",
  );
  await click('[data-focus="solution-boot-local"]');
  await check(
    `document.querySelector('[data-focus="solution-detail-local-boot-instructions"]').parentElement.open && location.hash === '#/solution-example?chapter=installation'`,
    "Returning to local boot retains instructions without serializing the route choice",
  );
  await run(
    `Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async value => { window.__copiedBootChapter = value; } } });`,
  );
  await click('[data-focus="share-view"]');
  await wait("!!window.__copiedBootChapter");
  await check(
    `new URL(window.__copiedBootChapter).hash === '#/solution-example?chapter=installation' && new URL(window.__copiedBootChapter).search === ''`,
    "Sharing local boot includes only the installation chapter",
  );

  await go("#/solution-example?chapter=introduction");
  await focus('[data-focus="chapter-readiness"]');
  await press("Enter");
  const sceneContains = async (text) =>
    check(
      `document.querySelector('.solution-scene').textContent.includes(${JSON.stringify(text)})`,
      `Readiness includes ${text}`,
    );
  for (const text of [
    "Failed — customer hook",
    "Cluster installed successfully",
    "Virtualization configuration succeeded",
    "virt-smoke",
    "vm-network-validation",
    "app-probe-01.dc.example.com",
    "10.20.60.20",
    "timed out",
    "HTTP 200",
    "edge-east-smoke-ok",
    "Network team",
    "Correct the egress firewall rule",
    "repair report alone leaves the hook failed",
  ])
    await sceneContains(text);
  await check(
    `document.querySelector('[data-focus=solution-detail-hook-evidence]').parentElement.querySelectorAll('li').length === 1 && !document.querySelector('[data-focus=solution-detail-readiness-verification]')`,
    "The failed scene has one failed attempt and no successful cleanup result",
  );
  await press("Tab");
  await check(
    `document.activeElement.getAttribute('data-focus') === 'solution-recover' && document.activeElement.matches(':focus-visible') && getComputedStyle(document.activeElement).outlineStyle !== 'none'`,
    "The single recovery action is keyboard reachable with visible focus",
  );
  await shot("solution-hook-failure");
  await press("Enter");
  await check(
    `document.activeElement.getAttribute('data-focus') === 'solution-recovery-result' && document.activeElement.matches(':focus-visible') && getComputedStyle(document.activeElement).outlineStyle !== 'none' && !document.querySelector('[data-focus=solution-recover]') && document.querySelector('.solution-outcomes').textContent.includes('Complete') && document.querySelector('.solution-outcomes').textContent.includes('Cluster installed successfully')`,
    "Recovery focuses its result and preserves installation success",
  );
  await check(
    `document.getElementById('solution-recovery-status').getAttribute('role') === 'status' && document.getElementById('solution-recovery-status').getAttribute('aria-atomic') === 'true' && document.getElementById('solution-recovery-status').textContent.includes('agreed checks and cleanup verified')`,
    "Recovery has a concise atomic status announcement",
  );
  for (const text of [
    "Repair reported.",
    "NET-208",
    "Targeted retry passed.",
    "Job execution succeeds",
    "Remaining scope verified.",
    "site-validation",
    "PVC-backed data-disk write/read",
    "scheduling on both workers, pod DNS, cross-node traffic and baseline Route",
    "Cleanup verified",
    "VM/VMI, DataVolumes, test PVCs and backend volumes",
    "temporary access resources removed",
    "Configured Virtualization and storage remain",
    "result artifacts are retained",
    "Platform team → Application team",
    "not an ongoing availability guarantee",
    "native Agent hook APIs",
  ])
    await sceneContains(text);
  await shot("solution-hook-recovered");
  await run("history.back()");
  await wait('location.hash.endsWith("chapter=introduction")');
  await run("history.forward()");
  await wait('location.hash.endsWith("chapter=readiness")');
  await settle();
  await check(
    `document.querySelector('.solution-outcomes').textContent.includes('Complete') && !document.querySelector('[data-focus=solution-recover]')`,
    "Back/Forward across a pre-recovery history entry cannot rewind recovery",
  );
  if (
    !(await run(
      'document.querySelector("[data-focus=solution-detail-hook-evidence]").parentElement.open',
    ))
  ) {
    await focus('[data-focus="solution-detail-hook-evidence"]');
    await press("Enter");
  }
  await check(
    `document.querySelector('[aria-label="Customer hook attempts"]').children.length === 2 && document.querySelector('[aria-label="Customer hook attempts"]').textContent.includes('11:12 UTC') && document.querySelector('[aria-label="Customer hook attempts"]').textContent.includes('HTTPS /health timed out') && document.querySelector('[aria-label="Customer hook attempts"]').textContent.includes('11:16 UTC') && document.querySelector('[aria-label="Customer hook attempts"]').textContent.includes('Job execution succeeded')`,
    "Optional history retains failed 881 beside passing 882 with dated check results",
  );
  await focus('[data-focus="solution-detail-readiness-verification"]');
  await press("Enter");
  await press("Tab");
  await check(
    `document.activeElement.getAttribute('data-focus') === 'solution-detail-readiness-assumptions'`,
    "Verification detail and assumptions are adjacent keyboard stops",
  );
  await press("Enter");
  for (const text of [
    "RWX/Block",
    "Delete reclaim",
    "linux-smoke-v1",
    "2 vCPU / 4 GiB",
    "default pod network with masquerade",
    "not a new compatibility certification",
    "HyperConverged",
    "Progressing=False",
    "flush, close, reopen and read matched",
    "smoke.apps.edge-east.dc.example.com",
    "10.20.10.53",
    "10.20.30.11",
    "11:19 UTC",
    "journey-smoke",
    "sample artifacts, not live links",
  ])
    await sceneContains(text);
  await focus('[data-focus="solution-link-to-readiness-platform-operators"]');
  const recoveredReading = await reading();
  const recoveredContent = await run(
    'document.querySelector(".solution-scene").textContent',
  );
  await press("Enter");
  await click('[data-focus="context-return"]');
  await restored(
    recoveredReading,
    "Supporting content restores recovered results, disclosures, scroll and focus",
  );
  await click('[data-focus="nav-choices"]');
  await click('[data-focus="nav-solution-example"]');
  await restored(recoveredReading, "Page return retains the recovered scene");
  await click('[data-focus="solution-sample-handoff"]');
  await check(
    `document.querySelector('.solution-outcomes').textContent.includes('Complete') && document.querySelector('.solution-note').textContent.includes('assumes required checks and cleanup were verified')`,
    "View sample handoff reads the independent completed outcome",
  );
  await click('[data-focus="chapter-installation"]');
  await check(
    `document.querySelector('[data-focus=solution-boot-local]').getAttribute('aria-pressed') === 'true'`,
    "Recovery preserves the local boot selection",
  );
  await click('[data-focus="solution-boot-automated"]');
  await click('[data-focus="chapter-readiness"]');
  assert.equal(
    await run('document.querySelector(".solution-scene").textContent'),
    recoveredContent,
    "Handoff and boot comparison leave recovery and evidence unchanged",
  );
  await run(
    `Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async value => { window.__copiedRecoveryChapter = value; } } });`,
  );
  await click('[data-focus="share-view"]');
  await wait("!!window.__copiedRecoveryChapter");
  await check(
    `new URL(window.__copiedRecoveryChapter).hash === '#/solution-example?chapter=readiness' && new URL(window.__copiedRecoveryChapter).search === ''`,
    "Sharing a recovered scene excludes recovery and evidence",
  );

  await go("#/solution-example?chapter=preparation");
  assert.deepEqual(
    await preparationPlan(),
    answeredPlan,
    "Boot switches preserve preparation answers and checklist before sharing",
  );
  await check(
    `document.getElementById('solution-preparation-status').textContent.includes('Sample IPAM answer applied')`,
    "Boot comparison preserves preparation demonstration state",
  );
  await run(
    `Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async value => { window.__copiedChapter = value; } } });`,
  );
  await click('[data-focus="share-view"]');
  await wait("!!window.__copiedChapter");
  await check(
    'new URL(window.__copiedChapter).hash === "#/solution-example?chapter=preparation" && new URL(window.__copiedChapter).search === "" && document.querySelector("[role=status]").textContent.includes("copied")',
    "Share copies chapter location only",
  );
  await run(
    `navigator.clipboard.writeText = async () => { throw new Error('clipboard denied'); };`,
  );
  await focus('[data-focus="share-view"]');
  await press("Enter");
  await wait('!!document.querySelector("dialog[open]")');
  await check(
    'document.activeElement.id === "share-url" && new URL(document.getElementById("share-url").value).hash === "#/solution-example?chapter=preparation" && document.activeElement.selectionStart === 0 && document.activeElement.selectionEnd === document.activeElement.value.length',
    "Denied clipboard opens selected manual-copy URL",
  );
  await press("Tab");
  await check(
    'document.activeElement.textContent === "Close"',
    "Fallback Close is reachable by keyboard",
  );
  await press("Escape");
  await check(
    '!document.querySelector("dialog[open]") && document.activeElement.getAttribute("data-focus") === "share-view"',
    "Escape closes fallback and restores focus",
  );
  await go("#/solution-example?chapter=readiness", true);
  await check(
    `document.querySelector('.solution-outcomes').textContent.includes('Failed — customer hook') && !!document.querySelector('[data-focus=solution-recover]') && !document.querySelector('main details[open]') && document.getElementById('solution-recovery-status').textContent === '' && document.querySelector('[aria-label="Customer hook attempts"]').children.length === 1`,
    "Reload restores the useful failure default with no recovery, passing attempt or open disclosures",
  );
  await go("#/solution-example?chapter=preparation", true);
  await check(
    '!document.querySelector("main details[open]") && document.querySelector("main").textContent.includes("Missing — awaiting IPAM") && document.getElementById("solution-api-address").value === "" && document.querySelector("[data-focus=solution-preparation-save-resume]").textContent === "Save preparation" && document.getElementById("solution-preparation-status").textContent === ""',
    "Reload resets the answer, saved/resumed state and disclosures to the named default scene",
  );
  await click('[data-focus="chapter-installation"]');
  await click('[data-focus="solution-boot-local"]');
  await click('[data-focus="solution-detail-local-boot-instructions"]');
  await go("#/solution-example?chapter=installation", true);
  await check(
    `document.querySelector('[data-focus="solution-boot-automated"]').getAttribute('aria-pressed') === 'true' && !document.querySelector('main details[open]')`,
    "Reloading installation resets the local comparison and instructions to automated defaults",
  );

  await go("#/solution-example?chapter=handoff", true);
  for (const text of [
    "Platform team",
    "Application team",
    "Cleanup verified",
    "backend volumes",
    "RBAC",
    "Sample API",
    "Sample console",
    "4 November 2026",
    "admin-probe-01",
    "Live migration, HA, performance",
    "not an ongoing availability guarantee",
  ]) {
    await check(
      `document.querySelector('main').textContent.includes(${JSON.stringify(text)})`,
      `Handoff includes ${text}`,
    );
  }
  await check(
    'document.querySelectorAll("main button").length === 2',
    "Handoff requires no generation/save/acknowledgement workflow",
  );
  await go("#/solution-example?chapter=reuse", true);
  await check(
    `document.querySelector('[aria-label="Fresh west outcomes"]').textContent.includes('Needs input') && document.querySelector('[aria-label="Fresh west outcomes"]').textContent.includes('Not started') && document.querySelector('[aria-label="Fresh west outcomes"]').textContent.includes('Not run') && document.querySelector('.solution-comparison').textContent.includes('Remains with edge-east')`,
    "West starts without east results",
  );

  await cdp.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  for (const width of [320, 390, 768, 1440]) {
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width,
      height: 1000,
      deviceScaleFactor: 1,
      mobile: false,
    });
    for (const [chapter] of defaults) {
      await go(`#/solution-example?chapter=${chapter}`);
      await run(
        `document.getElementById("solution-chapter-${chapter}").scrollIntoView({block:"start"})`,
      );
      await settle();
      await check(
        "document.documentElement.scrollWidth <= document.documentElement.clientWidth",
        `${chapter} fits ${width}px`,
      );
      await shot(`solution-${chapter}-${width}`);
      if (chapter === "preparation") {
        await run(
          'document.querySelector(".solution-preparation-actions").scrollIntoView({block:"center"})',
        );
        await settle();
        await shot(`solution-preparation-controls-${width}`);
      }
      if (chapter === "installation") {
        await click('[data-focus="solution-boot-local"]');
        await focus('[data-focus="solution-boot-local"]');
        await shot(`solution-boot-local-${width}`);
        if (
          !(await run(
            'document.querySelector("[data-focus=solution-detail-local-boot-instructions]").parentElement.open',
          ))
        ) {
          await click('[data-focus="solution-detail-local-boot-instructions"]');
        }
        await focus('[data-focus="solution-detail-local-boot-instructions"]');
        await check(
          "document.documentElement.scrollWidth <= document.documentElement.clientWidth",
          `Expanded local instructions fit ${width}px`,
        );
        await shot(`solution-boot-instructions-${width}`);
        await run(
          "document.querySelectorAll('[aria-label=\"Local boot instructions\"] > li')[1].scrollIntoView()",
        );
        await settle();
        await shot(`solution-boot-media-${width}`);
        await run('document.documentElement.style.fontSize = "28px"');
        await focus('[data-focus="solution-boot-local"]');
        await check(
          `document.documentElement.scrollWidth <= document.documentElement.clientWidth && [...document.querySelectorAll('.solution-boot-options button')].every(button => button.clientHeight >= 44 && button.scrollWidth <= button.clientWidth) && matchMedia('(prefers-reduced-motion: reduce)').matches`,
          `Enlarged boot options remain readable at ${width}px with reduced motion`,
        );
        await shot(`solution-boot-enlarged-${width}`);
        await run(
          "document.querySelectorAll('[aria-label=\"Local boot instructions\"] > li')[1].scrollIntoView()",
        );
        await settle();
        await check(
          "document.documentElement.scrollWidth <= document.documentElement.clientWidth",
          `Enlarged instructions and media address fit ${width}px`,
        );
        await shot(`solution-boot-instructions-enlarged-${width}`);
        await run('document.documentElement.style.fontSize = ""');
        await click('[data-focus="solution-boot-automated"]');
      }
      if (chapter === "readiness") {
        await go("#/solution-example?chapter=readiness", true);
        await focus('[data-focus="solution-recover"]');
        await shot(`solution-hook-failure-${width}`);
        await run('document.documentElement.style.fontSize = "28px"');
        await focus('[data-focus="solution-recover"]');
        await check(
          `document.documentElement.scrollWidth <= document.documentElement.clientWidth && document.querySelector('[data-focus=solution-recover]').clientHeight >= 44 && document.querySelector('[data-focus=solution-recover]').scrollWidth <= document.querySelector('[data-focus=solution-recover]').clientWidth`,
          `Enlarged recovery control fits ${width}px`,
        );
        await shot(`solution-hook-control-enlarged-${width}`);
        await press("Enter");
        await check(
          `document.documentElement.scrollWidth <= document.documentElement.clientWidth && document.activeElement.getAttribute('data-focus') === 'solution-recovery-result' && matchMedia('(prefers-reduced-motion: reduce)').matches`,
          `Recovery works with enlarged text and reduced motion at ${width}px`,
        );
        await shot(`solution-hook-result-enlarged-${width}`);
        await run('document.documentElement.style.fontSize = ""');
        await focus('[data-focus="solution-recovery-result"]');
        await shot(`solution-hook-results-${width}`);
        await run(
          `document.querySelector('.solution-scene > ul').lastElementChild.scrollIntoView({block:'center'})`,
        );
        await settle();
        await shot(`solution-hook-cleanup-${width}`);
        for (const detail of [
          "hook-evidence",
          "readiness-verification",
          "readiness-assumptions",
        ]) {
          await focus(`[data-focus="solution-detail-${detail}"]`);
          await press("Enter");
          await check(
            "document.documentElement.scrollWidth <= document.documentElement.clientWidth",
            `Open ${detail} fits ${width}px`,
          );
          await shot(`solution-${detail}-${width}`);
        }
        await run('document.documentElement.style.fontSize = "28px"');
        await focus('[data-focus="solution-detail-hook-evidence"]');
        await check(
          "document.documentElement.scrollWidth <= document.documentElement.clientWidth",
          `Enlarged attempt references fit ${width}px`,
        );
        await shot(`solution-hook-history-enlarged-${width}`);
        await run('document.documentElement.style.fontSize = ""');
      }
      if (chapter === "handoff" || chapter === "reuse") {
        await run(
          chapter === "reuse"
            ? "document.querySelector('.solution-comparison').scrollIntoView()"
            : "document.querySelector('.solution-scene h3 + ul').scrollIntoView()",
        );
        await settle();
        await shot(`solution-${chapter}-content-${width}`);
      }
      if (chapter === "handoff") {
        await focus('[data-focus="solution-detail-handoff-evidence"]');
        await press("Enter");
        await run('document.documentElement.style.fontSize = "28px"');
        await focus('[data-focus="solution-detail-handoff-evidence"]');
        await check(
          "document.documentElement.scrollWidth <= document.documentElement.clientWidth",
          `Enlarged independent handoff evidence fits ${width}px`,
        );
        await shot(`solution-handoff-evidence-enlarged-${width}`);
        await run('document.documentElement.style.fontSize = ""');
      }
    }
    await go("#/solution-example?chapter=preparation");
    if (
      !(await run(
        'document.querySelector("[data-focus=solution-detail-dns-evidence]").parentElement.open',
      ))
    ) {
      await click('[data-focus="solution-detail-dns-evidence"]');
    }
    await run('document.documentElement.style.fontSize = "28px"');
    await focus('[data-focus="solution-preparation-save-resume"]');
    await check(
      `document.documentElement.scrollWidth <= document.documentElement.clientWidth && [...document.querySelectorAll('.solution-preparation-actions button')].every(button => button.clientHeight >= 44 && button.scrollWidth <= button.clientWidth)`,
      `Enlarged preparation controls remain readable at ${width}px with reduced motion`,
    );
    await shot(`solution-preparation-enlarged-${width}`);
    await run(
      'document.documentElement.style.fontSize = "28px"; document.querySelector("[data-focus=solution-detail-dns-evidence]").scrollIntoView()',
    );
    await settle();
    await check(
      "document.documentElement.scrollWidth <= document.documentElement.clientWidth",
      `Enlarged text and open commands fit ${width}px`,
    );
    await shot(`solution-enlarged-${width}`);
    await run('document.documentElement.style.fontSize = ""');
  }
  await cdp.send("Emulation.setEmulatedMedia", { features: [] });
}
