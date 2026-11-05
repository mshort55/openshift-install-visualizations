import assert from "node:assert/strict";

/** Exercises prerequisite navigation, disclosures and scenarios in the running app. */
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
      `${topic} opens and focuses its prerequisite content`,
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
    "Five nodes and independent BMC addresses render",
  );
  await check(
    'document.querySelectorAll(".handoffs > article").length === 5 && document.querySelectorAll(".topnav a").length === 3',
    "Three sections organize the map, five handoffs and reference",
  );
  await check(
    'document.querySelector("input[value=published]").checked && [...document.querySelectorAll(".controlbar input")].length === 4 && [...document.querySelectorAll(".controlbar input")].every(input => input.checkVisibility()) && document.getElementById("site-dns-timing").checkVisibility() && !document.querySelector("main details[open]")',
    "Addressing and DNS choices are visible above the map with references collapsed",
  );
  await shot("prerequisites-desktop");
  await click('input[name="prerequisite-dns"][value="pending"]');
  await check(
    'location.hash.includes("dns=pending") && document.querySelector(".apps-pending-only").checkVisibility() && !document.querySelector(".published-only").checkVisibility() && document.querySelector(".apps-pending-only").textContent.includes("after cluster installation") && !document.querySelector("main details[open]")',
    "DNS can be deferred from the primary controls without opening a reference",
  );
  await shot("prerequisites-deferred-dns");
  await click('input[name="prerequisite-dns"][value="published"]');
  await check(
    '!location.hash.includes("dns=pending") && document.querySelector(".published-only").checkVisibility() && !document.querySelector(".apps-pending-only").checkVisibility()',
    "Publishing DNS restores the client resolution checks",
  );
  await click('input[name="prerequisite-addressing"][value="static"]');
  await check(
    'location.hash.includes("addressing=static") && getComputedStyle(document.querySelector(".dhcp-only")).display === "none" && getComputedStyle(document.querySelector(".static-only")).display !== "none"',
    "Addressing changes the map and selected handoff instructions",
  );
  await click('[data-focus="prerequisites-link-tickets/network"]');
  await check(
    'location.hash.startsWith("#/prerequisites/tickets/network?") && document.activeElement?.id === "prerequisites-addressing"',
    "Existing handoff links reach consolidated content",
  );
  await click('[data-focus="prerequisites-link-inventory"]');
  await check(
    'document.getElementById("prerequisites-inventory").parentElement.open && document.activeElement?.id === "prerequisites-inventory"',
    "An inventory link opens and focuses its reference",
  );
  await click("#prerequisites-inventory");
  await check(
    '!document.getElementById("prerequisites-inventory").parentElement.open',
    "A linked reference can be closed",
  );
  await click('[data-focus="prerequisites-link-inventory"]');
  await check(
    'document.getElementById("prerequisites-inventory").parentElement.open',
    "Following the same reference link reopens it",
  );
  await click('input[name="prerequisite-dns"][value="pending"]');
  await click('[data-focus="prerequisites-link-dns-access"]');
  await check(
    'location.hash.includes("dns=pending") && document.querySelector("#prerequisites-dns-access + .detail-body .apps-pending-only").checkVisibility()',
    "Deferred DNS exposes the temporary workstation access instructions",
  );
  await run(
    'document.getElementById("prerequisites-dns-access").scrollIntoView({block:"center"})',
  );
  await settle();
  const position = await run("window.scrollY");
  await click('[data-focus="nav-choices"]');
  await click('button[aria-label="x86_64"]');
  await click('[data-focus="nav-prerequisites"]');
  await check(
    'document.getElementById("prerequisites-inventory").parentElement.open && document.getElementById("prerequisites-dns-access").parentElement.open && document.querySelector("input[value=static]").checked && document.querySelector("input[value=pending]").checked',
    "Reference expansion and scenarios survive page switches",
  );
  assert.ok(
    Math.abs((await run("window.scrollY")) - position) < 3,
    "Prerequisite reading position survives",
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
    Math.abs((await run("window.scrollY")) - position) < 3,
    "Forward restores prerequisite reading position",
  );

  await run(
    'Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: () => Promise.reject(new Error("unavailable")) } })',
  );
  await click('button[aria-label="Share this view"]');
  await wait('!!document.querySelector("dialog[open]")');
  await check(
    'document.querySelector("input[readonly]").value === location.href && document.querySelector("dialog").textContent.includes("prerequisite section and example scenarios")',
    "Share fallback retains section and scenarios",
  );
  await click('button[aria-label="Close dialog"]');
  await go("#/prerequisites/dns-access?addressing=static&dns=pending", true);
  await check(
    'document.getElementById("prerequisites-dns-access").parentElement.open && document.querySelector("input[value=static]").checked && document.querySelector("input[value=pending]").checked',
    "Reload restores a linked reference and both scenarios",
  );
  await check(
    '!document.getElementById("prerequisites-inventory").parentElement.open',
    "Unlinked disclosures remain session-only",
  );
  await click('[data-focus="prerequisites-link-section-tickets"]');
  await check(
    'location.hash === "#/prerequisites/tickets?addressing=static&dns=pending" && document.activeElement?.id === "prerequisites-tickets"',
    "Section navigation retains scenarios",
  );
  await shot("prerequisites-linked-handoff");
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
    "Keyboard arrows change node addressing",
  );
  await click('[data-focus="prerequisites-link-ports"]');
  await check(
    'document.getElementById("prerequisites-ports").parentElement.open && document.activeElement?.id === "prerequisites-ports"',
    "Flow details are accessible from the handoff",
  );
  await go("#/prerequisites/sources", true);
  await check(
    'document.getElementById("prerequisites-sources").parentElement.open && document.activeElement?.id === "prerequisites-sources"',
    "Existing sources links open the sources disclosure",
  );
  for (const [path, id] of [
    ["tickets/ipam", "addressing"],
    ["tickets/dhcp", "addressing"],
    ["tickets/admin", "firewall"],
    ["tickets/services", "dns"],
    ["tickets/bmc", "tickets-bmc"],
  ]) {
    await go(`#/prerequisites/${path}`, true);
    await check(
      `document.activeElement?.id === ${JSON.stringify(`prerequisites-${id}`)} && document.activeElement.checkVisibility()`,
      `${path} retains a visible destination`,
    );
  }
  await go("#/prerequisites/unknown?addressing=broken&dns=broken", true);
  await check(
    'location.hash === "#/prerequisites" && document.querySelector("input[value=dhcp]").checked && document.querySelector("input[value=published]").checked',
    "Malformed links recover to the published-DNS baseline",
  );
}
