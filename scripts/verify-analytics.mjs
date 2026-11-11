import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium, expect } from "@playwright/test";

const base = process.env.QA_BASE_URL || "http://localhost:3100";
const measurementId = "G-BHY0XZSXPX";
const browser = await chromium.launch();
try {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const pageViews = [];
  // Load the real Google tag, but intercept every collection request so QA
  // never adds visits or events to the site's Analytics reports.
  await context.route(
    (url) =>
      /\/(?:g\/|ccm\/)?collect\/?$/.test(url.pathname) &&
      /(?:google-analytics\.com|analytics\.google\.com|google\.com|doubleclick\.net)$/.test(
        url.hostname,
      ),
    async (route) => {
      const request = route.request();
      const url = new URL(request.url());
      for (const line of (request.postData() || "").split("\n")) {
        const params = new URLSearchParams(url.search);
        for (const [key, value] of new URLSearchParams(line))
          params.set(key, value);
        if (
          params.get("tid") === measurementId &&
          params.get("en") === "page_view"
        )
          pageViews.push({
            location: params.get("dl"),
            title: params.get("dt"),
          });
      }
      await route.fulfill({ status: 204 });
    },
  );
  const page = await context.newPage();
  let scriptLoads = 0;
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (
      url.hostname === "www.googletagmanager.com" &&
      url.pathname === "/gtag/js" &&
      url.searchParams.get("id") === measurementId
    )
      scriptLoads++;
  });
  const checkPageViews = async (count, path) => {
    await expect.poll(() => pageViews.length, { timeout: 20000 }).toBe(count);
    await page.waitForTimeout(1500);
    assert.equal(
      pageViews.length,
      count,
      "Each navigation sends one page_view",
    );
    assert.equal(
      new URL(pageViews.at(-1).location).pathname +
        new URL(pageViews.at(-1).location).search,
      path,
    );
    await expect(page.locator("script#ga4-init")).toHaveCount(1);
    await expect(page.locator("script#ga4-loader")).toHaveCount(1);
  };

  await page.goto(base, { waitUntil: "domcontentloaded" });
  await checkPageViews(1, "/");
  await page.evaluate(() => {
    window.__ga4DocumentMarker = "same-document";
  });
  await Promise.all([
    page.waitForURL("**/gioi-thieu/"),
    page.locator('footer a[href="/gioi-thieu/"]').click(),
  ]);
  assert.equal(
    await page.evaluate(() => window.__ga4DocumentMarker),
    "same-document",
    "Next Link navigates without a document reload",
  );
  await checkPageViews(2, "/gioi-thieu/");
  await page.evaluate(() => history.pushState(null, "", "?ga4_qa=1"));
  await checkPageViews(3, "/gioi-thieu/?ga4_qa=1");
  await page.goBack();
  await checkPageViews(4, "/gioi-thieu/");
  assert.equal(
    scriptLoads,
    1,
    "Google tag loads once across client navigations",
  );
  await page.reload({ waitUntil: "domcontentloaded" });
  await checkPageViews(5, "/gioi-thieu/");
  assert.equal(scriptLoads, 2, "A fresh document initializes Google tag once");
  await fs.mkdir("artifacts/analytics", { recursive: true });
  await fs.writeFile(
    "artifacts/analytics/verification.json",
    JSON.stringify(
      {
        measurementId,
        scriptLoads,
        pageViews,
        collectionRequestsIntercepted: true,
      },
      null,
      2,
    ),
  );
  console.log(
    "GA4: initial load, Next.js navigation, query changes, back and reload send one page_view each; QA collection requests intercepted.",
  );
} finally {
  await browser.close();
}
