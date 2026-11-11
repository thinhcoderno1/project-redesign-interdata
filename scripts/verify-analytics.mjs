import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium, expect } from "@playwright/test";

const base = process.env.QA_BASE_URL || "http://localhost:3100";
const containerId = "GTM-W5ST9ZZQ";
const containerUrl = `https://www.googletagmanager.com/gtm.js?id=${containerId}`;
const fallbackUrl = `https://www.googletagmanager.com/ns.html?id=${containerId}`;
const browser = await chromium.launch();
try {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  // Stub the container so production QA cannot execute tags or send events.
  let scriptLoads = 0;
  await context.route(containerUrl, async (route) => {
    scriptLoads++;
    await route.fulfill({
      contentType: "application/javascript",
      body: "window.__gtmQaLoads = (window.__gtmQaLoads || 0) + 1;",
    });
  });
  await context.addInitScript(() => {
    window.dataLayer = [{ event: "qa-existing" }];
  });

  const page = await context.newPage();
  const checks = [];
  async function checkContainer(expectedLoads, path) {
    await expect.poll(() => scriptLoads).toBe(expectedLoads);
    await expect.poll(() => page.evaluate(() => window.__gtmQaLoads)).toBe(1);
    await expect(page.locator("script#gtm-init")).toHaveCount(1);
    await expect(page.locator("script#gtm-init")).toHaveAttribute(
      "data-nscript",
      "afterInteractive",
    );
    await expect(page.locator(`script[src="${containerUrl}"]`)).toHaveCount(1);
    assert.equal(
      await page
        .locator(`script[src="${containerUrl}"]`)
        .evaluate((el) => el.async),
      true,
    );
    await expect(page.locator("#ga4-init, #ga4-loader")).toHaveCount(0);
    await expect(page.locator('script[src*="/gtag/js"]')).toHaveCount(0);
    const queue = await page.evaluate(() => window.dataLayer);
    assert.equal(
      queue.filter((entry) => entry.event === "qa-existing").length,
      1,
    );
    assert.equal(queue.filter((entry) => entry.event === "gtm.js").length, 1);
    assert.equal(
      queue.filter((entry) => entry.event === "page_view").length,
      0,
    );
    assert.equal(
      new URL(page.url()).pathname + new URL(page.url()).search,
      path,
    );
    checks.push({ path, scriptLoads, bootstrapEvents: 1 });
  }

  await page.goto(base, { waitUntil: "domcontentloaded" });
  await checkContainer(1, "/");
  await page.evaluate(() => {
    window.__gtmDocumentMarker = "same-document";
  });
  await Promise.all([
    page.waitForURL("**/gioi-thieu/"),
    page.locator('footer a[href="/gioi-thieu/"]').click(),
  ]);
  assert.equal(
    await page.evaluate(() => window.__gtmDocumentMarker),
    "same-document",
    "Next Link navigates without a document reload",
  );
  await checkContainer(1, "/gioi-thieu/");
  await page.evaluate(() => history.pushState(null, "", "?gtm_qa=1"));
  await checkContainer(1, "/gioi-thieu/?gtm_qa=1");
  await page.goBack();
  await checkContainer(1, "/gioi-thieu/");
  await page.reload({ waitUntil: "domcontentloaded" });
  await checkContainer(2, "/gioi-thieu/");

  const noJsContext = await browser.newContext({ javaScriptEnabled: false });
  let fallbackLoads = 0;
  await noJsContext.route(fallbackUrl, async (route) => {
    fallbackLoads++;
    await route.fulfill({ contentType: "text/html", body: "<!doctype html>" });
  });
  const noJsPage = await noJsContext.newPage();
  await noJsPage.goto(base, { waitUntil: "load" });
  await expect(noJsPage.locator("body > noscript")).toHaveCount(1);
  // Next.js may prepend a hidden streaming boundary before the layout content.
  assert.equal(
    await noJsPage
      .locator("body > :not([hidden])")
      .first()
      .evaluate((el) => el.tagName),
    "NOSCRIPT",
    "Fallback precedes application content",
  );
  await expect(noJsPage.locator("noscript iframe")).toHaveAttribute(
    "src",
    fallbackUrl,
  );
  await expect.poll(() => fallbackLoads).toBe(1);

  await fs.mkdir("artifacts/analytics", { recursive: true });
  await fs.writeFile(
    "artifacts/analytics/verification.json",
    JSON.stringify(
      {
        containerId,
        scriptLoads,
        fallbackLoads,
        checks,
        containerStubbed: true,
      },
      null,
      2,
    ),
  );
  console.log(
    "GTM: asynchronous load once per document, Next.js/query/back navigation, reload, existing dataLayer, no direct GA4 and no-JS fallback passed. Container stubbed; no tags executed.",
  );
} finally {
  await browser.close();
}
