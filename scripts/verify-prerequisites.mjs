import assert from "node:assert/strict";

/** Exercises the prerequisite page in the same browser as Journey and Choices. */
export async function verifyPrerequisites({
  cdp,
  run,
  settle,
  wait,
  click,
  go,
  shot,
  check,
}) {
  for (const [topic, path, target] of [
    ["networking", "", "prerequisites-title"],
    ["addressing", "/addressing", "prerequisites-addressing"],
    ["dns", "/dns", "prerequisites-dns"],
    ["service-access", "/firewall", "prerequisites-firewall"],
    ["management", "/management", "prerequisites-management"],
  ]) {
    await go(`#/journey/${topic}`);
    const selector = `[data-focus="explore-prerequisites-${topic}"]`;
    await run(
      `document.querySelector(${JSON.stringify(selector)}).focus(); document.querySelector(${JSON.stringify(selector)}).scrollIntoView({ block: "center" })`,
    );
    await settle();
    const position = await run("window.scrollY");
    const expansion = await run(
      'document.querySelectorAll("button[aria-expanded=true]").length',
    );
    await click(selector);
    await check(
      `location.hash === ${JSON.stringify(`#/prerequisites${path}`)} && document.activeElement?.id === ${JSON.stringify(target)}`,
      `${topic} opens and focuses its prerequisite section`,
    );
    await click('[data-focus="return-journey"]');
    assert.equal(
      await run(
        'document.querySelectorAll("button[aria-expanded=true]").length',
      ),
      expansion,
      `${topic} expansion survives`,
    );
    assert.ok(
      Math.abs((await run("window.scrollY")) - position) < 3,
      `${topic} reading position survives`,
    );
    await check(
      `document.activeElement?.getAttribute("data-focus") === ${JSON.stringify(`explore-prerequisites-${topic}`)}`,
      `${topic} return restores link focus`,
    );
  }

  await go("#/prerequisites", true);
  await check(
    'document.title.startsWith("Network prerequisites") && document.querySelectorAll(".node").length === 5 && document.querySelectorAll(".bmc").length === 5',
    "The example renders five nodes and independent BMC addresses",
  );
  await check(
    'document.querySelectorAll(".prerequisites-page a[href^=\\"#\\"]:not([href^=\\"#/prerequisites\\"])").length === 0',
    "Section links use app routes",
  );
  await shot("prerequisites-desktop");
  await click('input[name="prerequisite-addressing"][value="static"]');
  await click('input[name="prerequisite-dns"][value="published"]');
  await check(
    'location.hash.includes("addressing=static") && location.hash.includes("dns=published") && getComputedStyle(document.querySelector(".dhcp-only")).display === "none" && getComputedStyle(document.querySelector(".static-only")).display !== "none" && getComputedStyle(document.querySelector(".apps-pending-only")).display === "none"',
    "Both example controls change the diagram and shared URL",
  );
  await click('[data-focus="prerequisites-link-tickets/network"]');
  await check(
    'location.hash.startsWith("#/prerequisites/tickets/network?") && document.getElementById("prerequisites-tickets-network").parentElement.open && document.activeElement?.id === "prerequisites-tickets-network"',
    "A diagram link opens and focuses its handoff",
  );
  await click("#prerequisites-tickets-network");
  await check(
    '!document.getElementById("prerequisites-tickets-network").parentElement.open',
    "A linked handoff can still be closed",
  );
  await click('[data-focus="prerequisites-link-tickets/network"]');
  await check(
    'document.getElementById("prerequisites-tickets-network").parentElement.open',
    "Following the same link reopens the handoff",
  );
  await click("#prerequisites-tickets-bmc");
  await settle();
  await run(
    'document.getElementById("prerequisites-tickets-bmc").focus(); document.getElementById("prerequisites-tickets-bmc").scrollIntoView({ block: "center" })',
  );
  await settle();
  const prerequisitePosition = await run("window.scrollY");
  await click('[data-focus="nav-choices"]');
  await click('button[aria-label="x86_64"]');
  await click('[data-focus="nav-prerequisites"]');
  await check(
    'document.getElementById("prerequisites-tickets-network").parentElement.open && document.getElementById("prerequisites-tickets-bmc").parentElement.open && document.querySelector("input[value=static]").checked && document.querySelector("input[value=published]").checked',
    "Scenarios and disclosures survive visiting Choices",
  );
  assert.ok(
    Math.abs((await run("window.scrollY")) - prerequisitePosition) < 3,
    "Prerequisites reading position survives page switches",
  );
  await run("history.back()");
  await wait('!!document.getElementById("choices-title")');
  await check(
    'document.querySelector("button[aria-label=x86_64]").getAttribute("aria-pressed") === "true"',
    "Back preserves Choices answers",
  );
  await run("history.forward()");
  await wait('!!document.getElementById("prerequisites-title")');
  await settle();
  assert.ok(
    Math.abs((await run("window.scrollY")) - prerequisitePosition) < 3,
    "Forward restores prerequisite reading position",
  );

  await run(
    'Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: () => Promise.reject(new Error("unavailable")) } })',
  );
  await click('button[aria-label="Share this view"]');
  await wait('!!document.querySelector("dialog[open]")');
  await check(
    'document.querySelector("input[readonly]").value === location.href && document.querySelector("dialog").textContent.includes("prerequisite section and example scenarios")',
    "Share fallback includes section and both scenarios",
  );
  await click('button[aria-label="Close dialog"]');
  await go(
    "#/prerequisites/tickets/network?addressing=static&dns=published",
    true,
  );
  await check(
    'document.getElementById("prerequisites-tickets-network").parentElement.open && document.querySelector("input[value=static]").checked && document.querySelector("input[value=published]").checked',
    "Reloading a shared handoff opens it with both scenarios",
  );
  await check(
    '!document.getElementById("prerequisites-tickets-bmc").parentElement.open',
    "Unlinked disclosures remain session-only",
  );
  await shot("prerequisites-linked-handoff");
  await click('[data-focus="prerequisites-link-section-dns"]');
  await check(
    'location.hash === "#/prerequisites/dns?addressing=static&dns=published" && document.activeElement?.id === "prerequisites-dns"',
    "Section navigation retains both scenarios",
  );
  await click('[data-focus="prerequisites-link-section-overview"]');
  await run('document.querySelector("input[value=static]").focus()');
  for (const type of ["keyDown", "keyUp"])
    await cdp.send("Input.dispatchKeyEvent", {
      type,
      key: "ArrowLeft",
      code: "ArrowLeft",
      windowsVirtualKeyCode: 37,
    });
  await settle();
  await check(
    'document.querySelector("input[value=dhcp]").checked && !location.hash.includes("addressing=static")',
    "Keyboard arrows change the addressing scenario",
  );
  await click('[data-focus="prerequisites-link-section-sources"]');
  await check(
    'document.getElementById("prerequisites-sources").closest("section").textContent.includes("not a lab installation") && document.querySelector(".prerequisites-page").textContent.includes("Exact ACLs unresolved here")',
    "Evidence and firewall completeness limits remain visible",
  );
  await go("#/prerequisites/unknown?addressing=broken&dns=broken", true);
  await check(
    'location.hash === "#/prerequisites" && document.querySelector("input[value=dhcp]").checked && document.querySelector("input[value=pending]").checked',
    "Malformed shared links recover to the baseline example",
  );
}
