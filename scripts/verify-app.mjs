import assert from "node:assert/strict";
import fs from "node:fs/promises";
import {
  cleanup,
  evaluate,
  launch,
  readMeta,
  withPage,
} from "../.agents/skills/verify-openshift-install-visualizations/scripts/verify-decisions.mjs";

import { verifyPrerequisites } from "./verify-prerequisites.mjs";

const ownsRun = !process.env.VERIFY_RUN_DIR;
const evidence = new URL("../artifacts/verify/combined-app/", import.meta.url);
await fs.mkdir(evidence, { recursive: true });
if (ownsRun) await launch();
try {
  const meta = await readMeta();
  await withPage(meta, async (cdp) => {
    const run = (source) => evaluate(cdp, source);
    const settle = () =>
      run(
        "new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))",
      );
    const wait = async (source) => {
      for (let i = 0; i < 100; i++) {
        if (await run(source).catch(() => false)) return;
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      throw new Error(`Timed out: ${source}`);
    };
    const click = async (selector) => {
      await run(
        `(() => { const el = document.querySelector(${JSON.stringify(selector)}); if (!el) throw new Error("Missing control: " + ${JSON.stringify(selector)}); el.click(); })()`,
      );
      await settle();
    };
    const go = async (suffix, reload = false) => {
      await run("window.__verificationDocument = true");
      const navigation = await cdp.send("Page.navigate", {
        url: `${meta.url}${suffix}`,
      });
      if (reload && !navigation.loaderId) {
        await settle();
        await cdp.send("Page.reload");
      }
      if (reload || navigation.loaderId)
        await wait("!window.__verificationDocument");
      await wait(
        'document.querySelector("main") && !document.querySelector("vite-error-overlay")',
      );
      await settle();
    };
    const shot = async (name) => {
      const { data } = await cdp.send("Page.captureScreenshot", {
        format: "png",
      });
      await fs.writeFile(
        new URL(`${name}.png`, evidence),
        Buffer.from(data, "base64"),
      );
    };
    const check = async (source, message) =>
      assert.equal(await run(source), true, message);
    await cdp.send("Page.enable");
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width: 1440,
      height: 1000,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await go("");
    await check(
      '!!document.getElementById("page-title") && document.querySelectorAll("main").length === 1',
      "Journey is the sole default page",
    );
    await check(
      'document.querySelector("[data-focus=nav-journey]").getAttribute("aria-current") === "page"',
      "Journey navigation is active",
    );
    await shot("journey-desktop");

    // A purely local expansion must survive a visit to the other page.
    await click('[data-focus="show-all-steps"]');
    await run("window.scrollTo(0, 900)");
    await settle();
    const journeyPosition = await run("window.scrollY");
    const expanded = await run(
      'document.querySelectorAll("button[aria-expanded=true]").length',
    );
    assert.ok(expanded > 0);
    await click('[data-focus="nav-choices"]');
    await check(
      '!!document.getElementById("choices-title") && !document.querySelector(".journey-page")',
      "Choices has its own page",
    );
    await click('button[aria-label="x86_64"]');
    await check(
      'location.hash.includes("architecture=amd64") && document.querySelector("button[aria-label=x86_64]").getAttribute("aria-pressed") === "true"',
      "An answer is visible and shareable",
    );
    await click('[data-focus="return-journey"]');
    assert.equal(
      await run(
        'document.querySelectorAll("button[aria-expanded=true]").length',
      ),
      expanded,
      "Journey expansion survives page switches",
    );
    assert.ok(
      Math.abs((await run("window.scrollY")) - journeyPosition) < 3,
      "Journey position survives page switches",
    );
    await click('[data-focus="nav-choices"]');
    await check(
      'document.querySelector("button[aria-label=x86_64]").getAttribute("aria-pressed") === "true"',
      "Choices answers survive page switches",
    );
    await run("history.back()");
    await wait('!!document.getElementById("page-title")');
    await settle();
    assert.ok(
      Math.abs((await run("window.scrollY")) - journeyPosition) < 3,
      "Back restores the previous page position",
    );
    await run("history.forward()");
    await wait('!!document.getElementById("choices-title")');
    await check(
      'document.querySelector("button[aria-label=x86_64]").getAttribute("aria-pressed") === "true"',
      "Forward restores Choices answers",
    );

    // Enter Choices from the relevant Journey explanation, then resume that step.
    await go("#/journey/approach");
    await click(".choices-callout a");
    await check(
      '!!document.getElementById("choices-title")',
      "Contextual link opens Choices",
    );
    await click('[data-focus="return-journey"]');
    await check(
      'location.hash === "#/journey/approach" && !!document.querySelector(".choices-callout")',
      "Contextual return restores the step",
    );

    // Full loads exercise both old standalone URL formats and their canonical forms.
    await go("?view=map#host-addressing=static");
    await wait('!!document.getElementById("choices-title")');
    await check(
      'document.querySelector(".tree").dataset.view === "map" && document.querySelector("button[data-decision=host-addressing][data-option=static]").getAttribute("aria-pressed") === "true"',
      "Legacy Choices link retains mode and answers",
    );
    await check(
      '!location.search.includes("view=") && location.hash.startsWith("#/choices?mode=map")',
      "Legacy mode is canonicalized once",
    );
    await click('button[aria-label="DHCP"]');
    await check(
      '!location.hash.includes("host-addressing=static") && document.querySelector("button[aria-label=DHCP]").getAttribute("aria-pressed") === "true"',
      "Changing an answer updates the current page",
    );
    await run("history.back()");
    await wait(
      'document.querySelector("button[data-decision=host-addressing][data-option=static]")?.getAttribute("aria-pressed") === "true"',
    );
    const savedChoices = await run("location.href");
    await run("window.__verificationDocument = true");
    await cdp.send("Page.reload");
    await wait("!window.__verificationDocument");
    await wait(
      'document.querySelector("button[data-decision=host-addressing][data-option=static]")?.getAttribute("aria-pressed") === "true"',
    );
    await check(
      'document.querySelector(".tree").dataset.view === "map"',
      "Refresh retains Choices mode",
    );
    assert.equal(await run("location.href"), savedChoices);
    // The same Share control must describe the active page when clipboard access fails.
    await run(
      'Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: () => Promise.reject(new Error("unavailable")) } })',
    );
    await click('button[aria-label="Share this view"]');
    await wait('!!document.querySelector("dialog[open]")');
    assert.equal(
      await run('document.querySelector("input[readonly]").value'),
      savedChoices,
    );
    await click('button[aria-label="Close dialog"]');

    await go("#/dns?view=problems&item=owner-wait");
    await wait('!!document.getElementById("page-title")');
    await check(
      'document.getElementById("tab-problems").getAttribute("aria-selected") === "true" && !!document.getElementById("record-owner-wait")',
      "Legacy Journey record link remains usable",
    );
    await click('button[aria-label="Search the journey"]');
    await check(
      '!!document.querySelector("dialog[open]")',
      "Journey search opens",
    );
    await click('button[aria-label="Close dialog"]');

    await click('button[aria-label="Share this view"]');
    await wait('!!document.querySelector("dialog[open]")');
    await cdp.send("Input.dispatchKeyEvent", {
      type: "keyDown",
      key: "k",
      code: "KeyK",
      modifiers: 2,
      windowsVirtualKeyCode: 75,
    });
    await cdp.send("Input.dispatchKeyEvent", {
      type: "keyUp",
      key: "k",
      code: "KeyK",
      modifiers: 2,
      windowsVirtualKeyCode: 75,
    });
    await settle();
    await check(
      'document.querySelectorAll("dialog[open]").length === 1',
      "Search shortcut respects the shared dialog",
    );
    await click('button[aria-label="Close dialog"]');

    // Problems and opportunities share the same independent inline disclosures.
    for (const [lens, count, showLabel, expandLabel, first, second] of [
      [
        "problems",
        22,
        "Show All Problems",
        "Expand all details",
        "owner-wait",
        "network-layers",
      ],
      [
        "opportunities",
        10,
        "Show all opportunities",
        "Expand all opportunities",
        "fewer-prerequisites",
        "precise-handoffs",
      ],
    ]) {
      await go(`#/journey?view=${lens}`);
      assert.equal(
        await run(
          'document.querySelector("[data-focus=show-all-steps]").textContent.trim()',
        ),
        showLabel,
      );
      assert.equal(
        await run(
          'document.querySelector("[data-focus=expand-all-details]").textContent.trim()',
        ),
        expandLabel,
      );
      await click('[data-focus="show-all-steps"]');
      assert.equal(
        await run('document.querySelectorAll("details.record-card").length'),
        count,
      );
      assert.equal(
        await run(
          'new Set([...document.querySelectorAll("details.record-card > summary")].map(el => el.id)).size',
        ),
        count,
      );
      await check(
        'document.querySelectorAll("details.record-card[open]").length === 0 && [...document.querySelectorAll(".step-toggle[aria-expanded=true]")].every(el => el.closest(".timeline-step").querySelector("details.record-card"))',
        `${showLabel} reveals summaries only at assigned steps`,
      );
      await click(`#record-${first}`);
      await click(`#record-${second}`);
      await check(
        'document.querySelectorAll("details.record-card[open]").length === 2',
        `${lens}: multiple disclosures stay open`,
      );
      await click(`#record-${first}`);
      await check(
        `!document.getElementById("record-${first}").parentElement.open && document.getElementById("record-${second}").parentElement.open && location.hash.includes("item=${second}")`,
        `${lens}: closing one disclosure preserves the other`,
      );
      await run(`document.getElementById("record-${second}").focus()`);
      for (const type of ["keyDown", "keyUp"]) {
        await cdp.send("Input.dispatchKeyEvent", {
          type,
          key: " ",
          code: "Space",
          windowsVirtualKeyCode: 32,
        });
      }
      await settle();
      await check(
        `!document.getElementById("record-${second}").parentElement.open && !location.hash.includes("item=") && document.getElementById("record-${second}").closest(".timeline-step").querySelector(".step-toggle").getAttribute("aria-expanded") === "true"`,
        `${lens}: Space closes the selected disclosure and keeps the step open`,
      );
      await run(`document.getElementById("record-${second}").focus()`);
      await cdp.send("Input.dispatchKeyEvent", {
        type: "keyDown",
        key: "Enter",
        code: "Enter",
        windowsVirtualKeyCode: 13,
        text: "\r",
      });
      await cdp.send("Input.dispatchKeyEvent", {
        type: "keyUp",
        key: "Enter",
        code: "Enter",
        windowsVirtualKeyCode: 13,
      });
      await settle();
      await check(
        `document.getElementById("record-${second}").parentElement.open && location.hash.includes("item=${second}")`,
        `${lens}: Enter opens a shareable disclosure`,
      );
      await click("#tab-process");
      await click(`#tab-${lens}`);
      await check(
        `document.getElementById("record-${second}").parentElement.open`,
        `${lens}: perspective switches preserve disclosure state`,
      );
      await click('[data-focus="expand-all-details"]');
      assert.equal(
        await run(
          'document.querySelectorAll("details.record-card[open]").length',
        ),
        count,
      );
      await click('[data-focus="show-all-steps"]');
      assert.equal(
        await run('document.querySelectorAll("details.record-card").length'),
        count,
      );
      await check(
        'document.querySelectorAll("details.record-card[open]").length === 0',
        `${lens}: Show all resets expanded details`,
      );
      await click('[data-focus="collapse-all"]');
      await check(
        'document.querySelectorAll(".journey-timeline button[aria-expanded=true]").length === 0 && document.querySelectorAll("details.record-card").length === 0',
        `${lens}: Collapse all returns to the overview`,
      );
    }

    await go("#/storage?view=opportunities&item=storage-outcome");
    await check(
      'document.getElementById("record-first-workload").parentElement.open && document.getElementById("step-workloads").getAttribute("aria-expanded") === "true"',
      "Legacy opportunity links open the disclosure at its assigned step",
    );
    await run("window.__verificationDocument = true");
    await cdp.send("Page.reload");
    await wait(
      '!window.__verificationDocument && document.getElementById("record-first-workload")?.parentElement.open',
    );
    await settle();
    await click("#record-first-workload");
    await run("history.back()");
    await wait(
      'document.getElementById("record-first-workload")?.parentElement.open',
    );
    await check(
      'location.hash.includes("item=first-workload")',
      "Back restores the shared opportunity disclosure",
    );

    // Recommendations must open the full card with keyboard and browser-history support.
    for (const id of [
      "precise-handoffs",
      "first-workload",
      "supported-recovery",
    ]) {
      await go("#/journey?view=opportunities");
      await check(
        'document.querySelectorAll(".opportunity-overview a").length === 3 && document.querySelectorAll("details.record-card").length === 0',
        "The overview links to three investigations without duplicating full cards",
      );
      await run(
        `document.querySelector('[data-focus="recommended-${id}"]').focus()`,
      );
      for (const type of ["keyDown", "keyUp"]) {
        await cdp.send("Input.dispatchKeyEvent", {
          type,
          key: "Enter",
          code: "Enter",
          windowsVirtualKeyCode: 13,
          ...(type === "keyDown" ? { text: "\r" } : {}),
        });
      }
      await wait(`document.getElementById("record-${id}")?.parentElement.open`);
      await settle();
      await check(
        `document.activeElement.id === "record-${id}" && !!document.getElementById("record-${id}").querySelector(".priority-badge") && !!document.getElementById("record-${id}").querySelector(".record-applicability")`,
        "Recommendation opens and focuses the card with independent priority and applicability",
      );
      await check(
        `document.getElementById("record-${id}").parentElement.textContent.includes("A smaller alternative") && document.getElementById("record-${id}").parentElement.textContent.includes("When to stop or narrow the idea") && document.getElementById("record-${id}").parentElement.textContent.includes("Who should investigate")`,
        "Expanded recommendations include alternatives, decision rules and owners",
      );
      await run("history.back()");
      await wait('location.hash === "#/journey?view=opportunities"');
      await settle();
      await check(
        `document.activeElement.dataset.focus === "recommended-${id}"`,
        "Back restores focus to the recommendation link",
      );
    }
    await go("#/journey?view=opportunities");
    await click('[data-focus="show-all-steps"]');
    await check(
      'document.querySelectorAll("details.record-card .record-applicability").length === 10 && document.querySelectorAll("details.record-card .priority-badge").length === 3',
      "Every opportunity has applicability and only the recommended investigations have priority badges",
    );
    await go("#/media?view=opportunities&item=clear-boot-handoff", true);
    await check(
      'location.hash === "#/journey/media?view=problems&item=boot-handoff" && document.getElementById("record-boot-handoff").parentElement.open && !!document.querySelector(".research-question") && !document.querySelector(".opportunity-overview")',
      "Retired boot opportunity opens retained evidence and its research question",
    );
    for (const [old, topic] of [
      ["confidence-rehearsal", "acceptance"],
      ["dependency-aware-change", "upgrades"],
    ]) {
      await go(`#/journey?view=opportunities&item=${old}`, true);
      await check(
        `location.hash === "#/journey/${topic}" && document.getElementById("step-${topic}").getAttribute("aria-expanded") === "true"`,
        "Retired acceptance and lifecycle opportunities reach retained process guidance",
      );
    }
    await go("#/journey/observability?view=problems&item=misleading-health");
    await check(
      'document.getElementById("record-misleading-health").parentElement.open && document.querySelectorAll(".evidence-example").length === 2 && document.querySelector(".record-body").textContent.includes("alert-rule records closed with fixes recorded") && document.querySelector(".record-body").textContent.includes("current behavior remains unverified")',
      "The new monitoring account preserves separate examples and fix-verification limits",
    );
    await go("#/journey/workloads?view=problems&item=first-vm-blocked");
    await check(
      'document.querySelectorAll(".evidence-example").length === 3 && document.querySelector(".record-body").textContent.includes("separate study") && document.querySelector(".record-body").textContent.includes("reservation blocker")',
      "The new project-context study remains distinct from the pilot reservation error",
    );

    await verifyPrerequisites({
      cdp,
      run,
      settle,
      wait,
      click,
      go,
      shot,
      check,
    });

    // Real content in all three layouts must fit a phone, tablet, and desktop.
    for (const width of [320, 390, 768, 1440]) {
      await cdp.send("Emulation.setDeviceMetricsOverride", {
        width,
        height: 1000,
        deviceScaleFactor: 1,
        mobile: false,
      });
      for (const [page, hash] of [
        ["journey", "#/journey"],
        ["opportunity-overview", "#/journey?view=opportunities"],
        [
          "new-evidence",
          "#/journey/observability?view=problems&item=misleading-health",
        ],
        [
          "opportunities",
          "#/journey/networking?view=opportunities&item=network-translation",
        ],
        ["choices", "#/choices?mode=map&host-addressing=static"],
        ["prerequisites", "#/prerequisites?addressing=static&dns=published"],
        ["prerequisites-handoff", "#/prerequisites/tickets/network"],
      ]) {
        await go(hash);
        await run(
          page === "opportunities"
            ? 'document.getElementById("record-first-workload").scrollIntoView()'
            : page === "new-evidence"
              ? 'document.getElementById("record-misleading-health").scrollIntoView()'
              : page === "opportunity-overview"
                ? 'document.querySelector(".opportunity-overview").scrollIntoView()'
                : page === "prerequisites-handoff"
                  ? 'document.getElementById("prerequisites-tickets-network").scrollIntoView()'
                  : "window.scrollTo(0, 0)",
        );
        await settle();
        await check(
          "document.documentElement.scrollWidth <= document.documentElement.clientWidth",
          `${page} fits ${width}px`,
        );
        await check(
          'document.querySelectorAll("main").length === 1 && document.querySelectorAll(".app-navigation [aria-current=page]").length === 1',
          "One main landmark and one current page",
        );
        await shot(`${page}-${width}`);
      }
    }
    await go("");
    await run("window.__verificationDocument = true");
    await cdp.send("Page.reload");
    await wait(
      '!window.__verificationDocument && !!document.getElementById("page-title")',
    );
    await settle();
    await cdp.send("Input.dispatchKeyEvent", {
      type: "keyDown",
      key: "Tab",
      code: "Tab",
      windowsVirtualKeyCode: 9,
    });
    await cdp.send("Input.dispatchKeyEvent", {
      type: "keyUp",
      key: "Tab",
      code: "Tab",
      windowsVirtualKeyCode: 9,
    });
    await check(
      'document.activeElement?.classList.contains("app-skip-link")',
      "Keyboard navigation starts with the skip link",
    );
    await cdp.send("Input.dispatchKeyEvent", {
      type: "keyDown",
      key: "Enter",
      code: "Enter",
      windowsVirtualKeyCode: 13,
      text: "\r",
      unmodifiedText: "\r",
    });
    await cdp.send("Input.dispatchKeyEvent", {
      type: "keyUp",
      key: "Enter",
      code: "Enter",
      windowsVirtualKeyCode: 13,
    });
    await check(
      'document.activeElement?.id === "main-content"',
      "Skip link focuses active page content",
    );
    console.log(
      "PASS: prerequisite scenarios and handoffs, page navigation, retained state, history, contextual return, legacy links, refresh, sharing, search, problem/opportunity disclosures and bulk controls, keyboard access, and 320/390/768/1440px layouts.",
    );
  });
} finally {
  if (ownsRun) await cleanup();
}
