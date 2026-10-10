import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";

const base = process.env.TEST_BASE_URL || "http://localhost:3100";
const directory = process.env.ABOUT_QA_DIRECTORY || "artifacts/about/qa";
await fs.mkdir(directory, { recursive: true });
const browser = await chromium.launch();
const results = [];
try {
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    const context = await browser.newContext({
      viewport: { width, height: 960 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const response = await page.goto(`${base}/gioi-thieu/`, {
      waitUntil: "domcontentloaded",
    });
    expect(response.status()).toBe(200);
    await expect(page).toHaveURL(`${base}/gioi-thieu/`);
    await page.evaluate(() => document.fonts.ready);
    await expect
      .poll(() =>
        page.evaluate(() =>
          document.documentElement.style.getPropertyValue(
            "--site-header-height",
          ),
        ),
      )
      .not.toBe("");
    await expect(page.locator("main#noi-dung")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page).toHaveTitle(
      "Giới thiệu InterData — Con người, hạ tầng & kết nối",
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://interdata.vn/gioi-thieu/",
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, nofollow",
    );
    await expect(page.locator("header.site-header")).toHaveCount(1);
    await expect(page.locator("footer")).toHaveCount(1);
    await expect(page.locator("main img")).toHaveCount(9);
    await expect(page.locator('footer a[href="/gioi-thieu/"]')).toHaveCount(1);
    await expect(page.locator('footer a[href="/#proxmox"]')).toHaveCount(1);
    await expect(page.locator("main")).toContainText("0316918910");
    await expect(page.locator('main a[href="tel:1900636822"]')).toHaveCount(1);
    const missingAnchors = await page
      .locator('a[href^="#"]')
      .evaluateAll((links) =>
        links
          .map((link) => link.getAttribute("href"))
          .filter((href) => !document.getElementById(href.slice(1))),
      );
    expect(missingAnchors).toEqual([]);
    for (const image of await page.locator("main img").all()) {
      await image.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          image.evaluate((img) => img.complete && img.naturalWidth > 0),
        )
        .toBe(true);
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
      path: `${directory}/about-${width}.png`,
      fullPage: true,
    });
    const audit = await new AxeBuilder({ page }).analyze();
    expect(
      audit.violations.map(({ id, nodes }) => ({
        id,
        targets: nodes.map((node) => node.target),
      })),
    ).toEqual([]);
    await page
      .locator(
        'nav[aria-label="Nội dung trang Giới thiệu"] a[href="#con-nguoi"]',
      )
      .click();
    await expect(page).toHaveURL(/#con-nguoi$/);
    await expect
      .poll(() =>
        page
          .locator("#con-nguoi")
          .evaluate((section) =>
            Math.round(section.getBoundingClientRect().top),
          ),
      )
      .toBeGreaterThan(0);
    const story = await page.locator("#con-nguoi").boundingBox();
    const header = await page.locator("header.site-header").boundingBox();
    expect(story.y).toBeGreaterThanOrEqual(header.height);
    // Exercise Next client navigation with both stylesheets retained.
    await page.locator("footer .footer-logo").click();
    await expect(page.locator(".hero")).toHaveCount(1);
    await expect(page.locator('footer a[href="#proxmox"]')).toHaveCount(1);
    await expect(page.locator(".testimonial-carousel")).toHaveAttribute(
      "data-enhanced",
      "true",
    );
    await page.locator('footer a[href="/gioi-thieu/"]').click();
    await expect(page.locator("#about-title")).toBeVisible();
    await expect(page.locator("h1")).toHaveCount(1);
    expect(
      await page
        .locator("#about-title")
        .evaluate((title) => getComputedStyle(title).fontFamily),
    ).toContain("Be Vietnam Pro");
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    expect(errors).toEqual([]);
    results.push({
      width,
      images: 9,
      accessibility: "passed",
      clientNavigation: "passed",
      anchors: "passed",
    });
    console.log(
      `PASS ${width}px: photos, anchors, shared navigation, styles and accessibility`,
    );
    await context.close();
  }
  for (const path of ["/about-us", "/about-us/", "/gioi-thieu"]) {
    const page = await browser.newPage();
    await page.goto(`${base}${path}?from=qa`, {
      waitUntil: "domcontentloaded",
    });
    await expect(page).toHaveURL(`${base}/gioi-thieu/?from=qa`);
    await page.close();
  }
  const staticPage = await browser.newPage({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 960 },
  });
  await staticPage.goto(`${base}/gioi-thieu/`, {
    waitUntil: "domcontentloaded",
  });
  await expect(staticPage.locator("h1")).toHaveCount(1);
  await expect(staticPage.locator("main img")).toHaveCount(9);
  await expect(staticPage.locator('footer a[href="/#proxmox"]')).toHaveCount(1);
  await staticPage
    .getByRole("link", { name: "Khám phá InterData", exact: true })
    .click();
  await expect(staticPage).toHaveURL(/#cau-chuyen$/);
  await staticPage.close();
  results.push({ redirects: "passed", noJavaScript: "passed" });
} finally {
  await fs.writeFile(
    `${directory}/results.json`,
    JSON.stringify(results, null, 2),
  );
  await browser.close();
}
