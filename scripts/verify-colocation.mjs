import { readSchemaNodes } from "./schema-helpers.mjs";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";
import ts from "typescript";
import { decodeHTML } from "entities";
import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.TEST_BASE_URL || "http://localhost:3100";
const directory = "artifacts/colocation";
await fs.mkdir(directory, { recursive: true });
const sourceResponse = await fetch("https://interdata.vn/vietnam-co-location", {
  signal: AbortSignal.timeout(20000),
});
assert.equal(sourceResponse.status, 200);
const sourceHtml = await sourceResponse.text();
const sourcePlans = [
  ...sourceHtml.matchAll(/<div class="price-card[^\"]*">([\s\S]*?)<\/a>/g),
].map(([, card]) => ({
  name: decodeHTML(
    card.match(/<h3>([\s\S]*?)<\/h3>/)[1].replace(/<[^>]*>/g, ""),
  ),
  monthlyPrice: Number(card.match(/<\/h3>([\d.]+)/)[1].replaceAll(".", "")),
  specs: [...card.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map((m) =>
    decodeHTML(m[1].replace(/<[^>]*>/g, "")).trim(),
  ),
  href: [...card.matchAll(/<a[^>]*href="([^\"]+)"/g)].at(-1)[1],
}));
assert.equal(sourcePlans.length, 4);
await fs.writeFile(
  `${directory}/verified-source-plans.json`,
  JSON.stringify(sourcePlans, null, 2),
);
const data = {};
vm.runInNewContext(
  ts.transpileModule(await fs.readFile("src/data/colocation.ts", "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText,
  { exports: data },
);
const plans = JSON.parse(JSON.stringify(data.colocationPlans));
assert.deepEqual(
  plans.map(({ name, monthlyPrice, specs, href }) => ({
    name,
    monthlyPrice,
    specs,
    href,
  })),
  sourcePlans,
);
assert.deepEqual(
  plans.map((p) => p.highlighted),
  [false, true, false, false],
);
assert.equal(data.colocationFaq.length, 16);
const redirect = await fetch(`${base}/vietnam-co-location/?ref=legacy`, {
  redirect: "manual",
});
assert.equal(redirect.status, 308);
const destination = new URL(redirect.headers.get("location"), base);
assert.equal(destination.pathname, "/vietnam-colocation/");
assert.equal(destination.searchParams.get("ref"), "legacy");

const browser = await chromium.launch();
const errors = [];
const results = [];
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  const response = await page.goto(`${base}/vietnam-colocation/`);
  assert.equal(response.status(), 200);
  await expect(page.locator("h1")).toHaveText("Thuê Chỗ Đặt Máy Chủ");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://interdata.vn/vietnam-colocation/",
  );
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    "https://interdata.vn/vietnam-colocation/",
  );
  assert(
    (
      await page.locator('meta[name="robots"]').getAttribute("content")
    ).includes("noindex"),
  );
  const schemas = (await readSchemaNodes(page)).map((node) =>
    JSON.stringify(node),
  );
  assert(
    schemas.some((s) => {
      const v = JSON.parse(s);
      return (
        v["@type"] === "Service" &&
        v.url === "https://interdata.vn/vietnam-colocation/"
      );
    }),
  );
  assert(
    (await page.locator('header a[href="/vietnam-colocation/"]').count()) > 0,
  );
  await expect(page.locator("#bang-gia article")).toHaveCount(4);
  await expect(page.locator('#bang-gia [role="tab"]')).toHaveCount(0);
  for (const plan of plans) {
    const card = page.locator(`[data-plan="${plan.id}"]`);
    await expect(card.locator("h3")).toHaveText(plan.name);
    await expect(card.locator("strong")).toHaveText(
      new Intl.NumberFormat("vi-VN").format(plan.monthlyPrice) + "đ",
    );
    await expect(card.locator("li")).toHaveText(plan.specs);
    await expect(card.locator("a")).toHaveAttribute("href", plan.href);
  }
  await page.locator('[data-plan="1u"] a').click();
  await expect(page).toHaveURL(/#support$/);
  await expect(page.locator("#support")).toBeInViewport();
  await expect(page.locator('#support a[href="/lien-he/"]')).toHaveCount(1);
  await expect(
    page.locator('#support a[href="tel:+841900636822"]'),
  ).toHaveCount(1);
  await expect(page.locator("#quy-trinh article")).toHaveCount(4);
  await expect(page.locator("#ung-dung article")).toHaveCount(6);
  await expect(page.locator("#cau-hoi details")).toHaveCount(16);
  await page.locator("#cau-hoi summary").first().click();
  await expect(page.locator("#cau-hoi details").first()).toHaveAttribute(
    "open",
    "",
  );
  assert.deepEqual(
    await page
      .locator('main a[href^="#"]')
      .evaluateAll((as) =>
        as
          .map((a) => a.getAttribute("href"))
          .filter((h) => !document.getElementById(h.slice(1))),
      ),
    [],
  );
  const ids = await page
    .locator("[id]")
    .evaluateAll((els) => els.map((el) => el.id));
  assert.equal(ids.length, new Set(ids).size);
  assert(
    !/Platinum Cloud|vCPU|NVMe U\.2|1-Click Applications/.test(
      await page.locator("main").innerText(),
    ),
  );

  for (const width of [320, 390, 768, 1024, 1200, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(`${base}/vietnam-colocation/`, {
      waitUntil: "networkidle",
    });
    await page.evaluate(async () => {
      document
        .querySelectorAll("main img")
        .forEach((i) => (i.loading = "eager"));
      await document.fonts.ready;
      await Promise.all(
        [...document.querySelectorAll("main img")].map((i) =>
          i.decode().catch(() => {}),
        ),
      );
      window.scrollTo(0, 0);
    });
    const layout = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      broken: [...document.querySelectorAll("main img")]
        .filter(
          (i) =>
            i.getBoundingClientRect().width && (!i.complete || !i.naturalWidth),
        )
        .map((i) => i.src),
      prices: [
        ...document.querySelectorAll('#bang-gia article [class*="planPrice"]'),
      ].map((el) => ({ width: el.clientWidth, scroll: el.scrollWidth })),
      heroButtons: [
        ...document.querySelectorAll("main > section:first-of-type .button"),
      ].map((el) => ({
        width: el.getBoundingClientRect().width,
        height: el.getBoundingClientRect().height,
      })),
    }));
    assert.equal(layout.overflow, false, `Overflow at ${width}`);
    assert.deepEqual(layout.broken, []);
    assert(layout.prices.every((p) => p.scroll <= p.width + 1));
    assert(layout.heroButtons.every((b) => b.width > 0 && b.height >= 44));
    const axe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    assert.deepEqual(
      axe.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
      [],
      `axe at ${width}`,
    );
    await page.screenshot({
      path: `${directory}/${width}.png`,
      fullPage: true,
    });
    if ([390, 1440].includes(width)) {
      await page
        .locator("#bang-gia")
        .screenshot({ path: `${directory}/pricing-${width}.png` });
      await page
        .locator("#quy-trinh")
        .screenshot({ path: `${directory}/process-${width}.png` });
    }
    results.push({
      width,
      overflow: false,
      axeViolations: 0,
      imagesLoaded: true,
    });
  }
  const nojs = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 900 },
  });
  const staticPage = await nojs.newPage();
  await staticPage.goto(`${base}/vietnam-colocation/`);
  await expect(staticPage.locator("#bang-gia article")).toHaveCount(4);
  await staticPage.locator("#cau-hoi summary").first().click();
  await expect(staticPage.locator("#cau-hoi details").first()).toHaveAttribute(
    "open",
    "",
  );
  await staticPage.locator('[data-plan="1u"] a').click();
  await expect(staticPage).toHaveURL(/#support$/);
  await nojs.close();
  assert.deepEqual(errors, []);
  await fs.writeFile(
    `${directory}/results.json`,
    JSON.stringify(
      {
        passed: true,
        plans: plans.length,
        redirect: 308,
        noJavaScript: true,
        results,
        runtimeErrors: errors,
      },
      null,
      2,
    ),
  );
  console.log(
    "PASS: source pricing/specs/contact links, metadata/schema, redirect 308, anchors, 16 FAQs, no-JS, seven viewports, WCAG A/AA and no runtime errors.",
  );
} finally {
  await browser.close();
}
