import { readSchemaNodes } from "./schema-helpers.mjs";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.TEST_BASE_URL || "http://localhost:3100";
const directory = "artifacts/vps-n8n";
const cycles = [
  "monthly",
  "quarterly",
  "semiannually",
  "annually",
  "biennially",
  "triennially",
];
const gids = [20, 67, 29, 101, 3];
await fs.mkdir(directory, { recursive: true });
const expected = {};
for (const gid of gids) {
  const raw = await (
    await fetch(`https://support.interdata.vn/packages.php?gid=${gid}&module`)
  ).json();
  let products = raw.products;
  if (gid === 3)
    products = products.filter(
      (p) => /^plan-\d+-/i.test(p.slug) && p.slug.split("-").length >= 5,
    );
  if (gid === 29 || gid === 101)
    products = products.filter(
      (p) => !/HN|custom/i.test(p.name) && !p.slug.startsWith("custom"),
    );
  expected[gid] = products.map((p) => ({
    pid: p.pid,
    gid,
    name: p.name,
    slug: p.slug,
    description: p.description,
    product_url: p.product_url,
    pricing: {
      VND: Object.fromEntries(
        cycles
          .filter(
            (c) =>
              typeof p.pricing.VND[c] === "string" &&
              p.pricing.VND[c].trim() &&
              Number.isFinite(Number(p.pricing.VND[c])) &&
              Number(p.pricing.VND[c]) >= 0,
          )
          .map((c) => [c, p.pricing.VND[c]]),
      ),
    },
  }));
  const response = await fetch(`${base}/api/vps-n8n-pricing/?gid=${gid}`);
  assert.equal(response.status, 200);
  assert.deepEqual((await response.json()).products, expected[gid]);
}
for (const gid of ["", "100", "-1", "invalid", "20.5"])
  assert.equal(
    (await fetch(`${base}/api/vps-n8n-pricing/?gid=${gid}`)).status,
    400,
  );

const browser = await chromium.launch();
const results = [];
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  assert.equal(
    (
      await page.goto(`${base}/vps-n8n/`, { waitUntil: "networkidle" })
    ).status(),
    200,
  );
  await expect(page.locator("h1")).toHaveText("VPS n8n");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://interdata.vn/vps-n8n/",
  );
  const schema = (await readSchemaNodes(page)).find(
    (node) => node["@type"] === "Service",
  );
  assert(schema.serviceType.includes("Template"));
  await expect(page.locator("#n8n-service-3")).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.locator("#n8n-service-3")).toContainText("Phổ biến nhất");
  await expect(page.locator("#n8n-service-20 span")).toHaveCount(0);
  await expect(page.locator("#n8n-service-3 span")).toHaveCSS(
    "background-color",
    "rgb(220, 38, 38)",
  );
  await expect(page.locator("#n8n-cycle-monthly")).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(
    page.locator('#bang-gia [role="tab"][id^="n8n-cycle-"]'),
  ).toHaveCount(6);
  await expect(page.locator("#bang-gia")).toContainText(
    "Tất cả dịch vụ VPS InterData đều hỗ trợ template hệ điều hành cài sẵn n8n",
  );
  for (const gid of gids) {
    await page.locator(`#n8n-service-${gid}`).click();
    await expect(page.locator("#n8n-plans article")).toHaveCount(4);
    await expect(
      page.locator('#n8n-plans article[data-featured="true"]'),
    ).toHaveCount(1);
    await page.locator("#bang-gia button[aria-expanded]").click();
    await expect(page.locator("#n8n-plans article")).toHaveCount(
      expected[gid].length,
    );
    const available = cycles.filter((c) =>
      expected[gid].some((p) => p.pricing.VND[c] !== undefined),
    );
    assert.deepEqual(
      await page
        .locator('#bang-gia [role="tab"][id^="n8n-cycle-"]')
        .evaluateAll((nodes) =>
          nodes.map((e) => e.id.replace("n8n-cycle-", "")),
        ),
      available,
    );
    for (const cycle of available) {
      await page.locator(`#n8n-cycle-${cycle}`).click();
      const rendered = await page
        .locator("#n8n-plans article")
        .evaluateAll((nodes) =>
          nodes.map((e) => ({
            pid: Number(e.dataset.pid),
            name: e.querySelector("h3").textContent,
            price: e.querySelector("strong").textContent,
            href: e.querySelector("a").href,
            featured: e.dataset.featured === "true",
            tag:
              e.querySelector('[class*="popularTag"]')?.textContent.trim() ||
              null,
          })),
        );
      assert.deepEqual(
        rendered,
        expected[gid].map((p) => {
          const url = `${p.product_url}&billingcycle=${cycle}`;
          return {
            pid: p.pid,
            name: p.name,
            price:
              new Intl.NumberFormat("vi-VN").format(
                Number(p.pricing.VND[cycle]),
              ) + "đ",
            href: url,
            featured: /\bplan\s+3\b/i.test(p.name),
            tag: /\bplan\s+3\b/i.test(p.name) ? "Mua nhiều" : null,
          };
        }),
      );
    }
    results.push({ gid, products: expected[gid].length, cycles: available });
  }
  await page.locator("#n8n-service-20").click();
  await page.locator("#n8n-service-20").press("ArrowRight");
  await expect(page.locator("#n8n-service-67")).toBeFocused();
  await expect(page.locator("#n8n-service-67")).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page.locator("#n8n-service-67").press("End");
  await expect(page.locator("#n8n-service-3")).toBeFocused();
  await page.locator("#n8n-service-3").press("Home");
  await expect(page.locator("#n8n-service-20")).toBeFocused();
  await page.locator("#n8n-cycle-quarterly").press("End");
  await expect(page.locator("#n8n-cycle-triennially")).toBeFocused();
  await page.locator("#n8n-cycle-triennially").press("Home");
  await expect(page.locator("#n8n-cycle-quarterly")).toBeFocused();
  await page.locator("#cau-hoi summary").first().click();
  await expect(page.locator("#cau-hoi details").first()).toHaveAttribute(
    "open",
    "",
  );
  await expect(page.locator("#n8n-process-title")).toHaveText(
    "Quy Trình Triển Khai n8n Trên VPS",
  );
  await expect(page.locator("#quy-trinh ol > li")).toHaveCount(4);
  await expect(page.locator("#quy-trinh h3")).toHaveText([
    "Chọn dịch vụ VPS",
    "Chọn template n8n",
    "Hoàn tất đăng ký",
    "Bắt đầu với n8n",
  ]);
  await expect(page.locator("#quy-trinh [role='tablist']")).toHaveCount(0);
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(`${base}/vps-n8n/`, { waitUntil: "networkidle" });
    await page.locator("main img").evaluateAll(async (imgs) => {
      for (const image of imgs) {
        if (
          !image.getBoundingClientRect().width ||
          !image.getBoundingClientRect().height
        )
          continue;
        image.scrollIntoView({ block: "center" });
        await new Promise(requestAnimationFrame);
        await new Promise(requestAnimationFrame);
        await image.decode().catch(() => {});
      }
    });
    await expect
      .poll(
        () =>
          page
            .locator("main img")
            .evaluateAll(
              (imgs) =>
                imgs.filter(
                  (i) =>
                    i.getBoundingClientRect().width &&
                    i.getBoundingClientRect().height &&
                    (!i.complete || !i.naturalWidth),
                ).length,
            ),
        { timeout: 30000 },
      )
      .toBe(0);
    const metrics = await page.locator("main").evaluate((main) => {
      const rect = (selector) =>
        main.querySelector(selector).getBoundingClientRect();
      const buttons = [
        ...main.querySelectorAll(
          'section[aria-labelledby="n8n-title"] .button',
        ),
      ].map((e) => ({
        width: e.getBoundingClientRect().width,
        height: e.getBoundingClientRect().height,
      }));
      const environment = main.querySelector("#quy-trinh");
      return {
        overflow: document.documentElement.scrollWidth - innerWidth,
        buttons,
        applicationsEnd: rect("#ung-dung").bottom,
        environmentStart: environment.getBoundingClientRect().top,
        comparisonGap:
          rect("#so-sanh").top - environment.getBoundingClientRect().bottom,
        comparisonPadding: parseFloat(
          getComputedStyle(main.querySelector("#so-sanh")).paddingTop,
        ),
        sectionPadding: parseFloat(
          getComputedStyle(main.querySelector("#ung-dung")).paddingTop,
        ),
        statsFit: [...main.querySelectorAll("#nen-tang dl > div")].every(
          (item) => item.scrollWidth <= item.clientWidth + 1,
        ),
        processColumns: getComputedStyle(
          main.querySelector("#quy-trinh ol"),
        ).gridTemplateColumns.split(" ").length,
        processCardsFit: [
          ...main.querySelectorAll("#quy-trinh li h3, #quy-trinh li p"),
        ].every((item) => item.scrollWidth <= item.clientWidth + 1),
        processPadding: parseFloat(getComputedStyle(environment).paddingTop),
        allSections: [...main.querySelectorAll("section")]
          .filter((e) => !e.closest("section") || e.closest("section") === e)
          .map((e) => ({ id: e.id, padding: getComputedStyle(e).paddingTop })),
      };
    });
    assert(metrics.overflow <= 1, `overflow at ${width}`);
    assert(
      Math.abs(metrics.buttons[0].width - metrics.buttons[1].width) <= 1,
      `CTA widths at ${width}`,
    );
    assert.equal(metrics.buttons[0].height, metrics.buttons[1].height);
    assert.equal(metrics.applicationsEnd, metrics.environmentStart);
    assert.equal(metrics.comparisonGap, 0);
    assert.equal(
      metrics.comparisonPadding,
      width < 640 ? 48 : width < 960 ? 64 : 80,
    );
    assert.equal(metrics.sectionPadding, metrics.comparisonPadding);
    assert(metrics.statsFit, `platform labels fit at ${width}`);
    assert(metrics.processCardsFit, `process cards fit at ${width}`);
    assert.equal(
      metrics.processColumns,
      width < 640 ? 1 : width < 1100 ? 2 : 4,
    );
    assert.equal(metrics.processPadding, metrics.comparisonPadding);
    const axe = await new AxeBuilder({ page })
      .include("main")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    await fs.writeFile(
      `${directory}/axe-${width}.json`,
      JSON.stringify(axe.violations, null, 2),
    );
    assert.deepEqual(axe.violations, [], `accessibility at ${width}`);
    if ([390, 1440].includes(width)) {
      await page.screenshot({
        path: `${directory}/page-${width}.png`,
        fullPage: true,
      });
      await page
        .locator("#bang-gia")
        .screenshot({ path: `${directory}/pricing-${width}.png` });
    }
    results.push({ width, ...metrics, axeViolations: axe.violations.length });
    console.log(`Responsive ${width}: passed`);
  }
  assert.deepEqual(errors, []);
  const noJs = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const staticPage = await noJs.newPage();
  await staticPage.goto(`${base}/vps-n8n/`);
  await expect(staticPage.locator("#n8n-plans article")).toHaveCount(4);
  await expect(
    staticPage.locator('#n8n-plans article[data-featured="true"]'),
  ).toHaveCount(1);
  await expect(
    staticPage.locator('#n8n-plans article[data-featured="true"]'),
  ).toContainText("Mua nhiều");
  await expect(staticPage.locator("#quy-trinh ol > li")).toHaveCount(4);
  await expect(
    staticPage.locator('#bang-gia noscript a[href*="/store/cloud-vps"]'),
  ).toBeVisible();
  await staticPage.locator("#cau-hoi summary").first().click();
  await expect(staticPage.locator("#cau-hoi details").first()).toHaveAttribute(
    "open",
    "",
  );
  await noJs.close();
  await context.close();
  // A failed service must not hide healthy services or overwrite a different tab.
  const fixtureDirectory = "src/app/(website)/n8n-pricing-qa";
  const fixture = `${fixtureDirectory}/page.tsx`;
  await fs.mkdir(fixtureDirectory, { recursive: true });
  try {
    await fs.writeFile(
      fixture,
      `import { N8nPricing } from "@/components/vps-n8n/n8n-pricing";
import styles from "@/components/vps-n8n/n8n.module.css";
export default function Page(){return <main className={styles.page}><N8nPricing initialPrices={${JSON.stringify({ ...expected, 3: null })}} /></main>}`,
    );
    const failureContext = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
    });
    try {
      const failurePage = await failureContext.newPage();
      await failurePage.goto(`${base}/n8n-pricing-qa/`, {
        waitUntil: "networkidle",
      });
      await expect(
        failurePage.locator('#n8n-service-panel [role="status"]'),
      ).toBeVisible();
      await failurePage.route("**/api/vps-n8n-pricing/**", (route) =>
        route.fulfill({
          status: 502,
          contentType: "application/json",
          body: '{"error":"Unavailable"}',
        }),
      );
      await failurePage.locator("#n8n-service-panel button").click();
      await expect(failurePage.locator("#n8n-service-panel")).toContainText(
        "Kết nối chưa thành công",
      );
      await failurePage.locator("#n8n-service-67").click();
      await expect(failurePage.locator("#n8n-plans article")).toHaveCount(4);
      await failurePage.locator("#n8n-service-3").click();
      await failurePage.unroute("**/api/vps-n8n-pricing/**");
      let release;
      const gate = new Promise((resolve) => {
        release = resolve;
      });
      await failurePage.route("**/api/vps-n8n-pricing/**", async (route) => {
        await gate;
        await route
          .fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({ gid: 3, products: expected[3] }),
          })
          .catch(() => {});
      });
      const requested = failurePage.waitForRequest("**/api/vps-n8n-pricing/**");
      await failurePage.locator("#n8n-service-panel button").click();
      await requested;
      await expect(
        failurePage.locator("#n8n-service-panel button"),
      ).toBeDisabled();
      await failurePage.locator("#n8n-service-67").click();
      release();
      await expect(failurePage.locator("#n8n-plans article")).toHaveCount(4);
      await failurePage.locator("#n8n-service-3").click();
      await expect(
        failurePage.locator('#n8n-service-panel [role="status"]'),
      ).toBeVisible();
      await expect(
        failurePage.locator("#n8n-service-panel button"),
      ).toBeEnabled();
      await failurePage.unroute("**/api/vps-n8n-pricing/**");
      await failurePage.route("**/api/vps-n8n-pricing/**", (route) =>
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ gid: 3, products: expected[3] }),
        }),
      );
      await failurePage.locator("#n8n-service-panel button").click();
      await expect(failurePage.locator("#n8n-plans article")).toHaveCount(4);
      await expect(failurePage.locator("#n8n-cycle-monthly")).toHaveAttribute(
        "aria-selected",
        "true",
      );
      results.push({
        partialFailure: true,
        retryRecovery: true,
        cancelStaleRequest: true,
      });
    } finally {
      await failureContext.close();
    }
  } finally {
    await fs.unlink(fixture);
    await fs.rmdir(fixtureDirectory);
  }
  console.log(
    "Pricing, keyboard, responsive, accessibility, no-JS and retry checks passed.",
  );
} finally {
  await browser.close();
  await fs.writeFile(
    `${directory}/qa-results.json`,
    JSON.stringify(results, null, 2),
  );
}
