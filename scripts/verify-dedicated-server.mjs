import { readSchemaNodes } from "./schema-helpers.mjs";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";
import ts from "typescript";
import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.TEST_BASE_URL || "http://localhost:3100";
const directory = "artifacts/dedicated-server";
const fixture = "src/app/(website)/dedicated-qa-fixture/page.tsx";
const cycles = [
  ["monthly", "msetupfee", "1 tháng"],
  ["quarterly", "qsetupfee", "3 tháng"],
  ["semiannually", "ssetupfee", "6 tháng"],
  ["annually", "asetupfee", "12 tháng"],
  ["biennially", "bsetupfee", "24 tháng"],
  ["triennially", "tsetupfee", "36 tháng"],
];
await fs.mkdir(directory, { recursive: true });
const source = await fetch(
  "https://support.interdata.vn/packages.php?gid=96&module",
  { signal: AbortSignal.timeout(20000) },
).then((r) => {
  assert.equal(r.status, 200);
  return r.json();
});
assert.equal(source.success, true);
await fs.writeFile(
  `${directory}/live-pricing.json`,
  JSON.stringify(source, null, 2),
);
const library = ts.transpileModule(
  await fs.readFile("src/lib/dedicated-server-pricing.ts", "utf8"),
  { compilerOptions: { module: ts.ModuleKind.CommonJS } },
).outputText;
const pricingData = {};
vm.runInNewContext(
  ts.transpileModule(
    await fs.readFile("src/data/dedicated-server.ts", "utf8"),
    { compilerOptions: { module: ts.ModuleKind.CommonJS } },
  ).outputText,
  { exports: pricingData },
);
async function normalize(data, ok = true) {
  const exports = {};
  vm.runInNewContext(library, {
    exports,
    URL,
    AbortSignal,
    require: () => ({
      dedicatedPricingGid: 96,
      dedicatedBillingCycles: cycles.map(([key, setupKey]) => ({
        key,
        setupKey,
      })),
    }),
    fetch: async (url, options) => {
      assert.equal(
        url,
        "https://support.interdata.vn/packages.php?gid=96&module",
      );
      assert.equal(options.next.revalidate, 60);
      return { ok, status: ok ? 200 : 503, json: async () => data };
    },
  });
  return JSON.parse(JSON.stringify(await exports.getDedicatedProducts()));
}
const products = await normalize(source);
for (const [i, p] of products.entries()) {
  const raw = source.products[i];
  for (const key of [
    "pid",
    "gid",
    "name",
    "slug",
    "description",
    "product_url",
  ])
    assert.equal(p[key], raw[key]);
  for (const [key, setupKey] of cycles) {
    assert.equal(p.pricing.VND[key], raw.pricing.VND[key]);
    assert.equal(p.setupFees[key], raw.pricing.VND[setupKey]);
  }
  assert.equal(
    p.available,
    !(
      [true, "true", "on"].includes(raw.stockcontrol) &&
      Number(raw.stocklevel ?? 0) <= 0
    ),
  );
}
for (const patch of [
  { gid: 41 },
  { product_url: "http://support.interdata.vn/" },
  { product_url: "https://example.com/" },
  { product_url: "https://user:pass@support.interdata.vn/" },
  { pricing: { VND: { monthly: "-1" } } },
]) {
  await assert.rejects(() =>
    normalize({
      success: true,
      products: [{ ...source.products[0], ...patch }],
    }),
  );
}
await assert.rejects(() => normalize(source, false));
const redirect = await fetch(`${base}/vietnam-dedicated-server/?ref=qa`, {
  redirect: "manual",
});
assert.equal(redirect.status, 308);
assert.equal(
  new URL(redirect.headers.get("location"), base).pathname,
  "/thue-may-chu-vat-ly/",
);
assert.equal(
  new URL(redirect.headers.get("location"), base).searchParams.get("ref"),
  "qa",
);
const api = await fetch(`${base}/api/dedicated-server-pricing/`).then((r) =>
  r.json(),
);
assert.deepEqual(api.products, products);

const browser = await chromium.launch();
const errors = [];
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  assert.equal((await page.goto(`${base}/thue-may-chu-vat-ly/`)).status(), 200);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://interdata.vn/thue-may-chu-vat-ly/",
  );
  const schemas = (await readSchemaNodes(page)).map((node) =>
    JSON.stringify(node),
  );
  assert(
    schemas.some((s) => {
      const d = JSON.parse(s);
      return (
        d["@type"] === "Service" &&
        d.url === "https://interdata.vn/thue-may-chu-vat-ly/"
      );
    }),
  );
  await expect(page.locator("#dedicated-cycle-biennially")).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.locator("#dedicated-plans article")).toHaveCount(
    products.filter((p) => p.available).length,
  );
  const toggle = page.getByRole("button", {
    name: "Xem thêm cấu hình tạm hết hàng",
  });
  if (products.some((p) => !p.available)) await toggle.click();
  await expect(page.locator("#dedicated-plans article")).toHaveCount(
    products.length,
  );
  assert.deepEqual(
    await page
      .locator("#dedicated-plans article")
      .evaluateAll((els) => els.map((e) => Number(e.dataset.pid))),
    products.map((p) => p.pid),
  );
  const money = (v) => new Intl.NumberFormat("vi-VN").format(Number(v)) + "đ";
  for (const [index, [cycle, , label]] of cycles.entries()) {
    const months = [1, 3, 6, 12, 24, 36][index];
    await page.getByRole("tab", { name: label, exact: true }).click();
    for (const p of products) {
      const card = page.locator(`[data-pid="${p.pid}"]`);
      await expect(card.locator("h3")).toHaveText(p.name);
      const priceBlock = card.locator('[class*="planPrice"]');
      await expect(priceBlock.locator("strong")).toHaveText(
        money(Math.round(Number(p.pricing.VND[cycle]) / months)),
      );
      await expect(priceBlock).toContainText("/tháng");
      await expect(priceBlock.locator("del")).toContainText(
        money(
          Math.round(
            pricingData.dedicatedOriginalPrices[p.pid][cycle] / months,
          ),
        ),
      );
      assert.equal(
        await priceBlock
          .locator("del")
          .evaluate((el) => getComputedStyle(el).textDecorationLine),
        "line-through",
      );
      await expect(card).not.toContainText("Thanh toán");
      await expect(card).not.toContainText("Phí khởi tạo");
      await expect(card).not.toContainText("Tổng kỳ đầu");
      const href = await card.locator("a").getAttribute("href");
      if (p.available) {
        const url = new URL(href);
        assert.equal(url.searchParams.get("billingcycle"), cycle);
        assert.equal(href, `${p.product_url}&billingcycle=${cycle}`);
      } else assert.equal(href, "/lien-he/");
    }
  }
  await page.locator("#dedicated-cycle-triennially").focus();
  await page.keyboard.press("Home");
  await expect(page.locator("#dedicated-cycle-monthly")).toBeFocused();
  await expect(page.locator("#dedicated-cycle-monthly")).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#dedicated-cycle-quarterly")).toBeFocused();
  await expect(page.locator("#cau-hoi details")).toHaveCount(16);
  await page.locator("#cau-hoi summary").first().click();
  await expect(page.locator("#cau-hoi details").first()).toHaveAttribute(
    "open",
    "",
  );
  const badAnchors = await page
    .locator('main a[href^="#"]')
    .evaluateAll((as) =>
      as
        .map((a) => a.getAttribute("href"))
        .filter((h) => !document.getElementById(h.slice(1))),
    );
  assert.deepEqual(badAnchors, []);
  const report = [];
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(`${base}/thue-may-chu-vat-ly/`, {
      waitUntil: "networkidle",
    });
    if (products.some((p) => !p.available))
      await page
        .getByRole("button", { name: "Xem thêm cấu hình tạm hết hàng" })
        .click();
    await page.getByRole("tab", { name: "36 tháng", exact: true }).click();
    await page.evaluate(async () => {
      for (const img of document.querySelectorAll("main img"))
        img.loading = "eager";
      await document.fonts.ready;
      await Promise.all(
        [...document.querySelectorAll("main img")].map((img) =>
          img.decode().catch(() => {}),
        ),
      );
      window.scrollTo(0, 0);
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
                    (!i.complete || !i.naturalWidth),
                ).length,
            ),
        { timeout: 30000 },
      )
      .toBe(0);
    const layout = await page.evaluate(() => ({
      viewport: innerWidth,
      width: document.documentElement.scrollWidth,
      broken: [...document.querySelectorAll("main img")]
        .filter(
          (i) =>
            i.getBoundingClientRect().width && (!i.complete || !i.naturalWidth),
        )
        .map((i) => i.src),
    }));
    assert(layout.width <= width + 1, `Overflow at ${width}: ${layout.width}`);
    assert.deepEqual(layout.broken, []);
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
    report.push({
      width,
      overflow: false,
      axeViolations: axe.violations.length,
    });
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${base}/platinum-cloud-server/`);
  await page.screenshot({
    path: `${directory}/reference-platinum.png`,
    fullPage: true,
  });
  const nojs = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 900 },
  });
  const staticPage = await nojs.newPage();
  await staticPage.goto(`${base}/thue-may-chu-vat-ly/`);
  await expect(staticPage.locator("#dedicated-plans article")).toHaveCount(
    products.filter((p) => p.available).length,
  );
  await expect(staticPage.locator("noscript a")).toHaveAttribute(
    "href",
    "https://support.interdata.vn/index.php?rp=/store/inter-dedi-power-series",
  );
  await staticPage.locator("#cau-hoi summary").first().click();
  await expect(staticPage.locator("#cau-hoi details").first()).toHaveAttribute(
    "open",
    "",
  );
  await nojs.close();
  if (!process.env.SKIP_RETRY_FIXTURE) {
    await fs.mkdir(fixture.slice(0, fixture.lastIndexOf("/")), {
      recursive: true,
    });
    const fixtureSource = `${directory}/fixture-page.tsx`;
    await fs.writeFile(
      fixtureSource,
      `import { DedicatedServerPage } from "@/components/dedicated-server/dedicated-page";
export default function Page() {
  return <DedicatedServerPage products={null} />;
}
`,
    );
    await fs.rename(fixtureSource, fixture);
    await expect
      .poll(async () => (await fetch(`${base}/dedicated-qa-fixture/`)).status, {
        timeout: 30000,
      })
      .toBe(200);
    const recoveryPage = await context.newPage();
    recoveryPage.on("pageerror", (e) => errors.push(e.message));
    await recoveryPage.goto(`${base}/dedicated-qa-fixture/`);
    await expect(
      recoveryPage.getByRole("heading", {
        name: "Chưa tải được bảng giá Thuê Máy Chủ",
      }),
    ).toBeVisible();
    await recoveryPage.route("**/api/dedicated-server-pricing/", (route) =>
      route.fulfill({ status: 503, json: { error: "unavailable" } }),
    );
    await recoveryPage.getByRole("button", { name: "Thử lại" }).click();
    await expect(
      recoveryPage.getByRole("button", { name: "Thử lại" }),
    ).toBeEnabled();
    await expect(recoveryPage.getByRole("status")).toContainText(
      "Kết nối chưa thành công",
    );
    await recoveryPage.unroute("**/api/dedicated-server-pricing/");
    await recoveryPage.getByRole("button", { name: "Thử lại" }).click();
    await expect(recoveryPage.locator("#dedicated-plans article")).toHaveCount(
      products.filter((p) => p.available).length,
    );
  }
  assert.deepEqual(errors, []);
  await fs.writeFile(
    `${directory}/qa-report.json`,
    JSON.stringify(
      {
        products: products.length,
        cycles: cycles.length,
        report,
        runtimeErrors: errors,
      },
      null,
      2,
    ),
  );
  console.log(
    "PASS: source prices/setup fees/stock/checkout, six billing cycles, redirects, metadata, 16 FAQs, no-JS, retry, six responsive viewports and WCAG A/AA.",
  );
} finally {
  await browser.close();
  await fs.rm(fixture, { force: true });
  await fs.rmdir(fixture.slice(0, fixture.lastIndexOf("/"))).catch(() => {});
}
