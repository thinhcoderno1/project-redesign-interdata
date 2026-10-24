import { readSchemaNodes } from "./schema-helpers.mjs";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";
import ts from "typescript";
import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.TEST_BASE_URL || "http://localhost:3100";
const directory =
  process.env.TEST_ARTIFACT_DIR || "artifacts/s3-object-storage";
const route = "/s3-object-storage/";
await fs.mkdir(directory, { recursive: true });
const data = {};
vm.runInNewContext(
  ts.transpileModule(
    await fs.readFile("src/data/s3-object-storage.ts", "utf8"),
    {
      compilerOptions: { module: ts.ModuleKind.CommonJS },
    },
  ).outputText,
  { exports: data },
);
const options = JSON.parse(JSON.stringify(data.s3Options));
assert.equal(options.length, 3);
assert(options.every((o) => !("price" in o) && !("pricing" in o)));
const browser = await chromium.launch();
const errors = [];
const results = [];
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    hasTouch: true,
  });
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  const response = await page.goto(base + route, {
    waitUntil: "domcontentloaded",
  });
  assert.equal(response.status(), 200);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveText("S3 OBJECT STORAGE");
  await expect(page).toHaveTitle(/S3 Object Storage/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://interdata.vn" + route,
  );
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    "https://interdata.vn" + route,
  );
  assert(
    (
      await page.locator('meta[name="robots"]').getAttribute("content")
    ).includes("noindex"),
  );
  const schemas = await readSchemaNodes(page);
  assert(
    schemas.some(
      (s) =>
        s["@type"] === "Service" && s.url === "https://interdata.vn" + route,
    ),
  );
  assert.equal(
    schemas.find((s) => s["@type"] === "FAQPage").mainEntity.length,
    data.s3Faq.length,
  );
  assert(
    !schemas.some(
      (s) => s["@type"] === "Offer" || s["@type"] === "Product" || s.offers,
    ),
  );
  await expect(page.locator("#phuong-an article")).toHaveCount(3);
  for (const option of options) {
    const card = page.locator(`[data-option="${option.id}"]`);
    await expect(card.locator("h3")).toHaveText(option.name);
    await expect(card.locator("li")).toHaveText(option.features);
    await expect(card.locator("a")).toHaveText("Liên hệ");
    await expect(card.locator("a")).toHaveAttribute("href", "/lien-he/");
  }
  const text = await page.locator("main").innerText();
  assert(
    !/demo|chờ (duyệt|phê duyệt)|ban lãnh đạo|giá chính thức|\d[\d.,]*[ \t\u00a0]*(?:đ|VNĐ)(?=\s|$|[.,;:/])|\/tháng|thanh toán ngay/i.test(
      text,
    ),
  );
  assert(
    !/Thuê VPS Hiệu|NVMe U\.2|SLA uptime|AMD EPYC|Intel Xeon|vSphere|vCenter|vSAN/.test(
      text,
    ),
  );
  assert((await page.locator(`header a[href="${route}"]`).count()) >= 2);
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
  const tabs = page
    .getByRole("tablist", { name: "Chọn nhu cầu S3 Object Storage" })
    .getByRole("tab");
  await expect(tabs).toHaveCount(3);
  await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
  await tabs.nth(0).focus();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.nth(1)).toBeFocused();
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("End");
  await expect(tabs.nth(2)).toBeFocused();
  await page.keyboard.press("Home");
  await expect(tabs.nth(0)).toBeFocused();
  await page
    .getByRole("button", { name: "Phương án tiếp theo", exact: true })
    .click();
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  await page
    .getByRole("button", { name: "Phương án trước", exact: true })
    .click();
  await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
  const viewport = page.locator(
    'section[aria-labelledby="s3-scenario-title"] [data-enhanced]',
  );
  await viewport.scrollIntoViewIfNeeded();
  const box = await viewport.boundingBox();
  const y = Math.min(900, box.y + box.height * 0.5);
  const cdp = await context.newCDPSession(page);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: box.x + box.width * 0.65, y }],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x: box.x + box.width * 0.35, y }],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  await cdp.detach();
  await page.locator("#s3-scenario-panel-backup a").click();
  await expect(page).toHaveURL(/#s3-option-backup$/);
  await expect(page.locator('[data-option="backup"]')).toBeInViewport();
  await page.locator("#cau-hoi summary h3").first().click();
  await expect(page.locator("#cau-hoi details").first()).toHaveAttribute(
    "open",
    "",
  );
  await page
    .locator("#cau-hoi summary")
    .filter({ hasText: "Xem tất cả" })
    .click();
  await expect(
    page.getByText(data.s3Faq[9].question, { exact: true }),
  ).toBeVisible();

  for (const width of [320, 390, 640, 768, 900, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(base + route, { waitUntil: "domcontentloaded" });
    await page.evaluate(async () => {
      document
        .querySelectorAll("main img")
        .forEach((i) => (i.loading = "eager"));
      await document.fonts.ready;
      if (document.activeElement instanceof HTMLElement)
        document.activeElement.blur();
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
      buttons: [
        ...document.querySelectorAll(
          "#phuong-an article a, main>section:first-of-type .button",
        ),
      ].map((b) => ({
        w: b.getBoundingClientRect().width,
        h: b.getBoundingClientRect().height,
      })),
      cardOverflow: [...document.querySelectorAll("#phuong-an article")].some(
        (el) => el.scrollWidth > el.clientWidth + 1,
      ),
      clippedTitle:
        document.querySelector("h1").scrollWidth >
        document.querySelector("h1").clientWidth + 1,
    }));
    assert.equal(layout.overflow, false, `Overflow at ${width}`);
    assert.equal(layout.cardOverflow, false, `Card overflow at ${width}`);
    assert.equal(layout.clippedTitle, false, `Title overflow at ${width}`);
    assert.deepEqual(layout.broken, []);
    assert(layout.buttons.every((b) => b.w > 0 && b.h >= 44));
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
      const sectionStyle =
        "header.site-header { visibility: hidden !important; }";
      await page
        .locator("main>section:first-of-type")
        .screenshot({ path: `${directory}/hero-${width}.png` });
      await page.locator("#phuong-an").screenshot({
        path: `${directory}/options-${width}.png`,
        style: sectionStyle,
      });
      await page
        .locator('section[aria-labelledby="s3-benefits-title"]')
        .screenshot({
          path: `${directory}/benefits-${width}.png`,
          style: sectionStyle,
        });
      await page.locator("#tinh-nang").screenshot({
        path: `${directory}/features-${width}.png`,
        style: sectionStyle,
      });
    }
    if (width === 320) {
      const rail = page.getByRole("region", {
        name: "Bảng so sánh Object, Block và File Storage",
      });
      assert(await rail.evaluate((el) => el.scrollWidth > el.clientWidth));
      await rail.evaluate((el) => (el.scrollLeft = el.scrollWidth));
      assert(await rail.evaluate((el) => el.scrollLeft > 0));
    }
    results.push({
      width,
      overflow: false,
      imagesLoaded: true,
      axeViolations: 0,
    });
    console.log(`PASS: ${width}px, no overflow, images loaded, WCAG A/AA`);
  }
  await page.goto(base + "/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#s3 a")).toHaveAttribute("href", route);
  await expect(page.locator("#vmware a")).toHaveAttribute(
    "href",
    "/trien-khai-vmware/",
  );
  const nojs = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 900 },
  });
  const staticPage = await nojs.newPage();
  await staticPage.goto(base + route, { waitUntil: "domcontentloaded" });
  await expect(staticPage.locator("#phuong-an article")).toHaveCount(3);
  await expect(staticPage.locator("[data-s3-scenario]")).toHaveCount(3);
  for (const panel of await staticPage.locator("[data-s3-scenario]").all())
    await expect(panel).toBeVisible();
  await staticPage
    .locator("#cau-hoi summary")
    .filter({ hasText: "Xem tất cả" })
    .click();
  await expect(
    staticPage.getByText(data.s3Faq[9].question, { exact: true }),
  ).toBeVisible();
  await nojs.close();
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(base + route, { waitUntil: "domcontentloaded" });
    await expect(
      page.locator(
        'section[aria-labelledby="s3-scenario-title"] [data-enhanced="true"]',
      ),
    ).toHaveCount(1);
    if (width === 390) {
      await page
        .getByRole("button", { name: "Mở điều hướng", exact: true })
        .click();
      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible();
      await dialog.locator("summary").filter({ hasText: "Giải Pháp" }).click();
      await expect(dialog.locator(`a[href="${route}"]`)).toBeVisible();
      await dialog.locator(`a[href="${route}"]`).click();
      await expect(dialog).not.toBeVisible();
    } else {
      const trigger = page.getByRole("button", { name: /Giải Pháp/ });
      await trigger.focus();
      await trigger.press("Enter");
      await expect(
        page.locator(`#solution-navigation a[href="${route}"]`),
      ).toBeVisible();
    }
    for (const href of [
      "/trien-khai-private-network/",
      "/trien-khai-proxmox-ceph/",
      "/trien-khai-Kubernetes-k8s/",
      "/trien-khai-vmware/",
      route,
    ]) {
      await expect(
        page.locator(`#solution-navigation a[href="${href}"]`),
      ).toHaveCount(1);
    }
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(base + route, { waitUntil: "domcontentloaded" });
  await expect(
    page.locator(
      'section[aria-labelledby="s3-scenario-title"] [data-enhanced="true"]',
    ),
  ).toHaveCount(1);
  assert.equal(
    await page
      .locator("#s3-scenario-panel-application")
      .evaluate((el) => getComputedStyle(el).transitionDuration),
    "0s",
  );
  assert.deepEqual(errors, []);
  await fs.writeFile(
    `${directory}/results.json`,
    JSON.stringify(
      {
        passed: true,
        route,
        options: 3,
        pricedOffers: false,
        contactLinks: true,
        carouselKeyboardAndSwipe: true,
        noJavaScript: true,
        reducedMotion: true,
        results,
        runtimeErrors: errors,
      },
      null,
      2,
    ),
  );
  console.log(
    "PASS: three unpriced options, contact links, schemas, navigation/homepage, keyboard/swipe, FAQ, no-JS, reduced motion, nine viewports, no runtime errors.",
  );
} finally {
  await browser.close();
}
