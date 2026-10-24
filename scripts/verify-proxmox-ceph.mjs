import { readSchemaNodes } from "./schema-helpers.mjs";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";
import ts from "typescript";
import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.TEST_BASE_URL || "http://localhost:3100";
const directory = "artifacts/proxmox-ceph";
await fs.mkdir(directory, { recursive: true });
const data = {};
vm.runInNewContext(
  ts.transpileModule(await fs.readFile("src/data/proxmox-ceph.ts", "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText,
  { exports: data },
);
const options = JSON.parse(JSON.stringify(data.proxmoxCephOptions));
assert.equal(options.length, 3);
assert(
  options.every(
    (o) => !("price" in o) && !("pricing" in o) && o.features.length === 4,
  ),
);
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
  const response = await page.goto(`${base}/trien-khai-proxmox-ceph/`);
  assert.equal(response.status(), 200);
  await expect(page.locator("h1")).toHaveText(
    "TRIỂN KHAI ẢO HÓA PROXMOX / CEPH",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://interdata.vn/trien-khai-proxmox-ceph/",
  );
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    "https://interdata.vn/trien-khai-proxmox-ceph/",
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
        s["@type"] === "Service" &&
        s.url === "https://interdata.vn/trien-khai-proxmox-ceph/",
    ),
  );
  assert.equal(
    schemas.find((s) => s["@type"] === "FAQPage").mainEntity.length,
    data.proxmoxCephFaq.length,
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
    !/demo|chờ (duyệt|phê duyệt)|ban lãnh đạo|giá chính thức|\d[\d.,]*\s*(đ|VNĐ)|\/tháng|thanh toán ngay|khởi tạo.*phút/i.test(
      text,
    ),
  );
  assert(
    !/Thuê VPS Hiệu|NVMe U\.2|SLA uptime|AMD EPYC|Intel Xeon|1-Click Applications/.test(
      text,
    ),
  );
  assert(
    (await page
      .locator('header a[href="/trien-khai-proxmox-ceph/"]')
      .count()) >= 2,
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
  const tabs = page
    .getByRole("tablist", { name: "Chọn mô hình Proxmox / Ceph" })
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
    .getByRole("button", { name: "Mô hình tiếp theo", exact: true })
    .click();
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  await page
    .getByRole("button", { name: "Mô hình trước", exact: true })
    .click();
  await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
  const viewport = page.locator(
    'section[aria-labelledby="proxmox-ceph-architecture-title"] [data-enhanced]',
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
  await page.locator("#proxmox-ceph-architecture-panel-cluster-ha a").click();
  await expect(page).toHaveURL(/#proxmox-ceph-option-cluster-ha$/);
  await expect(page.locator('[data-option="cluster-ha"]')).toBeInViewport();
  await expect(page.locator("#cau-hoi summary h3")).toHaveCount(
    data.proxmoxCephFaq.length,
  );
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
    page.getByText(data.proxmoxCephFaq[8].question, { exact: true }),
  ).toBeVisible();

  for (const width of [320, 390, 768, 900, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(`${base}/trien-khai-proxmox-ceph/`, {
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
      buttons: [
        ...document.querySelectorAll("main>section:first-of-type .button"),
      ].map((b) => ({
        w: b.getBoundingClientRect().width,
        h: b.getBoundingClientRect().height,
      })),
      cardOverflow: [...document.querySelectorAll("#phuong-an article")].some(
        (el) => el.scrollWidth > el.clientWidth + 1,
      ),
    }));
    assert.equal(layout.overflow, false, `Overflow at ${width}`);
    assert.equal(layout.cardOverflow, false, `Card overflow at ${width}`);
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
    if ([390, 1440].includes(width))
      await page
        .locator("#phuong-an")
        .screenshot({ path: `${directory}/options-${width}.png` });
    if (width === 320) {
      const rail = page.getByRole("region", {
        name: "Bảng so sánh Proxmox VE độc lập, Cluster HA và HCI",
      });
      await expect(rail).toHaveCount(1);
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
  }
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await expect(page.locator("#proxmox a")).toHaveAttribute(
    "href",
    "/trien-khai-proxmox-ceph/",
  );
  await expect(page.locator("#private-network a")).toHaveAttribute(
    "href",
    "/trien-khai-private-network/",
  );
  const nojs = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 900 },
  });
  const staticPage = await nojs.newPage();
  await staticPage.goto(`${base}/trien-khai-proxmox-ceph/`);
  await expect(staticPage.locator("#phuong-an article")).toHaveCount(3);
  await expect(staticPage.locator("[data-proxmox-model]")).toHaveCount(3);
  await staticPage
    .locator("#cau-hoi summary")
    .filter({ hasText: "Xem tất cả" })
    .click();
  await expect(
    staticPage.getByText(data.proxmoxCephFaq[9].question, { exact: true }),
  ).toBeVisible();
  await nojs.close();
  assert.deepEqual(errors, []);
  await fs.writeFile(
    `${directory}/results.json`,
    JSON.stringify(
      {
        passed: true,
        options: 3,
        pricedOffers: false,
        contactLinks: true,
        carouselKeyboardAndSwipe: true,
        noJavaScript: true,
        results,
        runtimeErrors: errors,
      },
      null,
      2,
    ),
  );
  console.log(
    "PASS: three unpriced options, contact links, no internal notes, carousel keyboard/swipe, navigation/homepage, schemas, FAQ, no-JS, seven viewports, WCAG A/AA, no runtime errors.",
  );
} finally {
  await browser.close();
}
