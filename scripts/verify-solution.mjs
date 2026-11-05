import assert from "node:assert/strict";

/** Drive the guided Solution example through its real phases and dependencies. */
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
  const use = (id) => click(`[data-focus="${id}"]`);
  const press = async (key) => {
    await cdp.send("Input.dispatchKeyEvent", {
      type: "keyDown",
      key,
      code: key,
      windowsVirtualKeyCode: key === "Tab" ? 9 : 13,
      ...(key === "Enter" ? { text: "\r" } : {}),
    });
    await cdp.send("Input.dispatchKeyEvent", {
      type: "keyUp",
      key,
      code: key,
      windowsVirtualKeyCode: key === "Tab" ? 9 : 13,
    });
    await settle();
  };
  const action = async (name) => {
    await run(`(() => {
      const el = [...document.querySelectorAll('button, summary')].find(el => el.textContent.trim() === ${JSON.stringify(name)} && el.checkVisibility());
      if (!el || el.disabled) throw new Error('Missing or disabled: ' + ${JSON.stringify(name)});
      el.scrollIntoView({block:'center',behavior:'instant'}); el.focus();
    })()`);
    await press("Enter");
  };
  const inspect = async (phase) => {
    await run(`document.querySelector('[data-phase=${phase}]').focus()`);
    await press("Enter");
  };
  const dns = (state) =>
    wait(
      `document.querySelector('.sp-dns')?.dataset.state === ${JSON.stringify(state)}`,
    );
  const phases = async (expected, viewing) => {
    assert.deepEqual(
      await run(
        `([...document.querySelectorAll('.sp-rail [data-phase]')].map(el => el.dataset.progress))`,
      ),
      expected,
    );
    await check(
      `document.querySelector('.sp-rail [data-viewing=true]').dataset.phase === ${JSON.stringify(viewing)}`,
      "Reading location is distinct from journey progress",
    );
    assert.equal(
      await run(
        "document.querySelectorAll('.sp-rail [aria-current=step]').length",
      ),
      expected.includes("current") ? 1 : 0,
    );
  };
  const viewport = async (width) => {
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width,
      height: 1100,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await settle();
    await check(
      "document.documentElement.scrollWidth <= innerWidth",
      `Solution fits ${width}px`,
    );
  };
  const screenshot = async (name, selector = ".sp-story") => {
    await run(
      `document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'start',behavior:'instant'})`,
    );
    await settle();
    await shot(name);
  };

  await viewport(1440);
  await go("#/solution-example", true);
  await check(
    `location.hash === '#/solution-example?phase=pre' && document.querySelector('h1').textContent.includes('From a saved plan') && document.querySelectorAll('main').length === 1`,
    "The main solution entry is the guided story",
  );
  await check(
    `!document.querySelector('.app-prototype-navigation') && !document.querySelector('.solution-scene') && !document.body.textContent.includes('New deployment') && !document.body.textContent.includes('Restored prototype')`,
    "The old solution and separate prototype entry are removed",
  );
  await check(
    `document.querySelector('[data-focus=nav-solution-example]').getAttribute('aria-current') === 'page' && document.title.startsWith('Solution example')`,
    "Solution is the active production page",
  );
  await run("window.scrollTo(0, 0)");
  await settle();
  await shot("solution-opening-1440");

  for (const [hash, phase] of [
    ["#/solution-example?phase=pre", "pre"],
    ["#/solution-example?phase=install", "install"],
    ["#/solution-example?phase=post", "post"],
    ["#/solution-example?chapter=dns", "pre"],
    ["#/solution-example?chapter=installation", "install"],
    ["#/solution-example?chapter=readiness", "post"],
    ["#/guided-story-prototype?phase=post", "post"],
    ["#/solution-example?phase=unknown", "pre"],
  ]) {
    await go(`${hash}&moment=5&recovered=true`, true);
    await check(
      `location.hash === '#/solution-example?phase=${phase}'`,
      "Old links normalize to the sole solution page",
    );
    await phases(["current", "blocked", "blocked"], phase);
  }

  await go("#/journey/dns");
  await use("solution-link-from-dns");
  await check(
    `location.hash === '#/solution-example?phase=pre'`,
    "Journey context opens the matching phase",
  );
  await use("solution-link-opportunities");
  await check(
    `location.hash === '#/journey?view=opportunities'`,
    "The catalog link uses shared navigation",
  );
  await use("context-return");
  await check(
    `location.hash === '#/solution-example?phase=pre'`,
    "Nested return restores Solution",
  );
  await use("context-return");
  await check(
    `location.hash === '#/journey/dns'`,
    "Nested return restores the original Journey topic",
  );
  await go("#/prerequisites/dns?addressing=static&dns=pending");
  await use("solution-link-from-prerequisites-dns");
  await use("context-return");
  await check(
    `location.hash === '#/prerequisites/dns?addressing=static&dns=pending'`,
    "Network prep context returns with both selections",
  );

  await go("#/solution-example", true);
  await run(
    `localStorage.setItem('unrelated-example', 'keep'); localStorage.setItem('openshift.solution-journey.v1', '{"obsolete":"keep"}')`,
  );
  const storage = await run("JSON.stringify({...localStorage})");
  await inspect("install");
  await phases(["current", "blocked", "blocked"], "install");
  await check(
    `document.querySelector('.sp-chapter-status').textContent.includes('Complete pre-installation') && [...document.querySelectorAll('.sp-action-panel button')].every(el => el.disabled)`,
    "Both boot paths are blocked during preparation",
  );
  await screenshot("solution-preview-1440");
  await inspect("post");
  await check(
    `document.querySelector('.sp-action-panel button').disabled`,
    "Post-installation cannot start early",
  );
  await action("Return to current phase");
  await action("Generate sample DNS request");
  await dns("generating");
  await dns("requested");
  await check(
    `document.querySelector('.sp-dns-artifact').open && document.querySelector('.sp-dns pre').textContent.includes('api-int.ocp5.dc.example.com')`,
    "Generation reveals the full request artifact",
  );
  await cdp.send("Browser.grantPermissions", {
    origin: await run("location.origin"),
    permissions: ["clipboardReadWrite", "clipboardSanitizedWrite"],
  });
  await action("Copy request");
  await wait(
    `document.querySelector('.sp-dns').textContent.includes('Request copied.')`,
  );
  assert.ok((await run("navigator.clipboard.readText()")).includes("DNS-1042"));
  await action("Save incomplete journey");
  await use("nav-choices");
  await use("nav-solution-example");
  await dns("requested");
  await check(
    `document.querySelector('.sp-overall').textContent.includes('Saved for later')`,
    "Saved incomplete work survives page navigation",
  );
  await screenshot("solution-dns-request-1440", ".sp-dns");
  await action("Simulate team fulfillment");
  await dns("fulfilled");
  await check(
    `document.querySelector('[data-phase=pre]').textContent.includes('3 of 5 complete')`,
    "Fulfillment does not complete the prerequisite",
  );
  await run(`document.querySelector('.sp-dns input').click()`);
  await settle();
  await action("Run sample DNS verification");
  await dns("verifying");
  await dns("failed");
  await check(
    `document.querySelector('.sp-overall').textContent.includes('Needs attention') && document.querySelector('[data-phase=pre]').dataset.attention === 'true'`,
    "Failed DNS affects overall and current-phase status",
  );
  for (const width of [320, 390, 768, 1440]) {
    await viewport(width);
    await screenshot(`solution-dns-failure-${width}`, ".sp-dns");
  }
  await action("Simulate DNS correction");
  await action("Run sample verification again");
  await dns("verified");
  await action("Verification history · 2 attempts");
  await check(
    `document.querySelectorAll('.sp-dns-attempt').length === 2 && document.querySelector('.sp-dns-attempt').textContent.includes('10.20.30.99')`,
    "Retry retains failed evidence",
  );
  await phases(["current", "blocked", "blocked"], "pre");
  await check(
    `document.querySelector('[data-phase=pre]').textContent.includes('4 of 5 complete')`,
    "DNS success alone cannot finish preparation",
  );
  await action("Resolve boot access & run sample pre-hook →");
  await phases(["complete", "current", "blocked"], "install");

  const layout = () =>
    run(`([...document.querySelectorAll('.sp-rail [data-phase]')].map(el => {
    const box=el.getBoundingClientRect(), label=el.querySelector('.sp-phase-progress').getBoundingClientRect();
    return {text:el.innerText,width:box.width,height:box.height,top:label.top-box.top,left:label.left-box.left};
  }))`);
  for (const width of [320, 390, 768, 1440]) {
    await viewport(width);
    const before = await layout();
    assert.ok(before.every((item) => !item.text.includes("Viewing")));
    for (const phase of ["pre", "post", "install"]) {
      await inspect(phase);
      assert.deepEqual(
        await layout(),
        before,
        "Reading another chapter leaves status labels and positions unchanged",
      );
    }
    await screenshot(`solution-phases-${width}`);
  }
  await action("Simulate automated boot →");
  await phases(["complete", "current", "blocked"], "install");
  await inspect("post");
  await check(
    `document.querySelector('.sp-action-panel button').disabled`,
    "Boot is not installation completion",
  );
  await action("Return to current phase");
  await action("Show successful installation result →");
  await phases(["complete", "complete", "current"], "post");
  await action("Run example post-installation →");
  await check(
    `document.querySelector('.sp-overall').textContent.includes('Needs attention') && document.querySelector('.sp-phase-state').textContent.includes('Base cluster installed')`,
    "A post failure preserves base installation but affects journey status",
  );
  for (const width of [320, 390, 768, 1440]) {
    await viewport(width);
    await screenshot(`solution-failure-${width}`);
  }
  await action("Simulate network repair & retry");
  await phases(["complete", "complete", "complete"], "post");
  await screenshot("solution-complete-1440");
  await inspect("pre");
  await dns("verified");
  await action("Verification history · 2 attempts");
  await check(
    `document.querySelectorAll('.sp-dns-attempt').length === 2`,
    "Earlier evidence survives all later phases",
  );

  await action("2 · Manual boot");
  await phases(["complete", "current", "blocked"], "install");
  await check(
    `document.querySelector('.sp-manual .sp-primary').disabled`,
    "Manual boot requires an explicit operator report",
  );
  for (const width of [320, 390, 768, 1440]) {
    await viewport(width);
    await screenshot(`solution-manual-${width}`);
  }
  await run(`document.querySelector('.sp-manual input').click()`);
  await settle();
  await action("Record boot report →");
  await phases(["complete", "current", "blocked"], "install");
  await action("Show successful installation result →");
  await phases(["complete", "complete", "current"], "post");
  await action("Reset example");
  await action("Generate sample DNS request");
  await dns("generating");
  await action("Reset example");
  await run("new Promise(resolve=>setTimeout(resolve,750))");
  await dns("needed");
  assert.equal(
    await run("JSON.stringify({...localStorage})"),
    storage,
    "Replacement never reads, migrates or overwrites old saved data",
  );

  await action("1 · Saved prerequisites");
  await inspect("install");
  await run("history.back()");
  await wait(
    `document.querySelector('[data-phase=pre]').dataset.viewing === 'true'`,
  );
  await dns("requested");
  await run("history.forward()");
  await wait(
    `document.querySelector('[data-phase=install]').dataset.viewing === 'true'`,
  );
  await phases(["current", "blocked", "blocked"], "install");
  await run("document.documentElement.style.fontSize='200%'");
  await check(
    "document.documentElement.scrollWidth<=innerWidth",
    "Enlarged text remains contained",
  );
  await screenshot("solution-preview-enlarged-1440");
  await run("document.documentElement.style.removeProperty('font-size')");
  await go("#/solution-example?phase=post", true);
  await phases(["current", "blocked", "blocked"], "post");
  await check(
    `document.querySelector('.sp-overall').textContent.includes('Prerequisites incomplete')`,
    "Reload resets the illustrative journey and keeps only the reading phase",
  );
}
