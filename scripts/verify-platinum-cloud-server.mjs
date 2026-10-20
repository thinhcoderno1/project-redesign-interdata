import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";
import ts from "typescript";
import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.TEST_BASE_URL || "http://localhost:3100";
const directory = "artifacts/platinum-cloud-server";
await fs.mkdir(directory, { recursive: true });
const cycles = [
  "monthly",
  "quarterly",
  "semiannually",
  "annually",
  "biennially",
  "triennially",
];
const live = await fetch(
  "https://support.interdata.vn/packages.php?gid=41&module",
  { signal: AbortSignal.timeout(20000) },
).then((r) => {
  assert.equal(r.status, 200);
  return r.json();
});
assert.equal(live.success, true);
assert(live.products.length > 4);
await fs.writeFile(
  `${directory}/live-pricing.json`,
  JSON.stringify(live, null, 2),
);

const library = ts.transpileModule(
  await fs.readFile("src/lib/platinum-cloud-server-pricing.ts", "utf8"),
  { compilerOptions: { module: ts.ModuleKind.CommonJS } },
).outputText;
async function normalize(data, ok = true) {
  const exported = {};
  vm.runInNewContext(library, {
    exports: exported,
    require: () => ({
      platinumCloudPricingGid: 41,
      platinumCloudBillingCycles: cycles.map((key) => ({ key })),
    }),
    URL,
    AbortSignal,
    fetch: async (url, options) => {
      assert.equal(
        url,
        "https://support.interdata.vn/packages.php?gid=41&module",
      );
      assert.equal(options.next.revalidate, 60);
      return { ok, status: ok ? 200 : 502, json: async () => data };
    },
  });
  return JSON.parse(JSON.stringify(await exported.getPlatinumCloudProducts()));
}
const normalized = await normalize(live);
for (const [i, p] of normalized.entries()) {
  assert.equal(p.pid, live.products[i].pid);
  assert.equal(p.name, live.products[i].name);
  assert.equal(p.gid, 41);
  assert.equal(p.product_url, live.products[i].product_url);
  assert.equal(p.description, live.products[i].description);
  const raw = live.products[i];
  const controlled =
    raw.stockcontrol === true ||
    raw.stockcontrol === "true" ||
    raw.stockcontrol === "on";
  assert.equal(p.available, !(controlled && Number(raw.stocklevel ?? 0) <= 0));
  for (const key of cycles)
    assert.equal(
      p.pricing.VND[key],
      Number(live.products[i].pricing.VND[key]) >= 0
        ? live.products[i].pricing.VND[key]
        : undefined,
    );
}
for (const data of [
  { success: false },
  { success: true, products: [] },
  ...[
    { gid: 3 },
    { product_url: "http://support.interdata.vn/checkout" },
    { product_url: "https://example.com/" },
    { product_url: "https://user:pass@support.interdata.vn/" },
    { pricing: { VND: { monthly: "-1" } } },
  ].map((p) => ({ success: true, products: [{ ...live.products[0], ...p }] })),
])
  await assert.rejects(() => normalize(data));
await assert.rejects(() => normalize(live, false));
const stocked = await normalize({
  success: true,
  products: [{ ...live.products[0], stockcontrol: true, stocklevel: 0 }],
});
assert.equal(stocked[0].available, false);
const browser = await chromium.launch();
const fixtureDir = "src/app/(website)/platinum-cloud-pricing-qa";
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
      await page.goto(`${base}/platinum-cloud-server/`, {
        waitUntil: "networkidle",
      })
    ).status(),
    200,
  );
  await expect(page.locator("h1")).toHaveText("Platinum Cloud Server");
  await expect(page).toHaveTitle(/Platinum Cloud Server/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://interdata.vn/platinum-cloud-server/",
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  const schema = JSON.parse(
    await page.locator('main script[type="application/ld+json"]').textContent(),
  );
  assert.equal(schema.url, "https://interdata.vn/platinum-cloud-server/");
  assert.equal(schema.name, "Platinum Cloud Server InterData");
  await expect(page.locator("#ung-dung article")).toHaveCount(6);
  await expect(page.locator("#ung-dung article img")).toHaveCount(0);
  await expect(page.locator("#ung-dung img")).toHaveCount(1);
  assert(
    (await page.locator("#ung-dung img").getAttribute("src")).includes(
      "usecase-platinum-center-v1.webp",
    ),
  );
  await expect(
    page.locator("#platinum-cloud-consultation a").first(),
  ).toHaveAttribute("href", "#bang-gia");
  await expect(
    page.locator("#platinum-cloud-consultation a").last(),
  ).toHaveAttribute("href", "/lien-he/");
  const brandImages = await page
    .locator("main img")
    .evaluateAll((imgs) => imgs.map((img) => decodeURIComponent(img.src)));
  assert(
    brandImages.every(
      (src) =>
        !src.includes("/images/vps-amd/") &&
        !src.includes("/images/amd-cloud-server/"),
    ),
  );
  const api = await page.request.get(
    `${base}/api/platinum-cloud-server-pricing/`,
  );
  assert.equal(api.status(), 200);
  assert.deepEqual((await api.json()).products, normalized);
  await expect(page.locator("[data-pid]")).toHaveCount(4);
  await page.locator("#bang-gia button[aria-expanded]").click();
  await expect(page.locator("[data-pid]")).toHaveCount(normalized.length);
  assert.deepEqual(
    await page.locator("[data-pid] h3").allTextContents(),
    normalized.map((p) => p.name),
  );
  for (const cycle of cycles) {
    await page.locator(`#platinum-cloud-cycle-${cycle}`).click();
    for (const p of normalized) {
      const card = page.locator(`[data-pid="${p.pid}"]`);
      const value = p.pricing.VND[cycle];
      await expect(card.locator("strong").first()).toHaveText(
        value === undefined
          ? "Liên hệ"
          : `${Number(value).toLocaleString("vi-VN")}đ`,
      );
      const href = await card.locator("a").getAttribute("href");
      if (value !== undefined && p.available) {
        const actual = new URL(href),
          original = new URL(p.product_url);
        assert.equal(
          actual.origin + actual.pathname,
          original.origin + original.pathname,
        );
        for (const [k, v] of original.searchParams)
          assert.equal(actual.searchParams.get(k), v);
        assert.equal(actual.searchParams.get("billingcycle"), cycle);
      } else assert.equal(href, "/lien-he/");
    }
  }
  await page.locator("#platinum-cloud-cycle-monthly").focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#platinum-cloud-cycle-quarterly")).toBeFocused();
  await page.keyboard.press("End");
  await expect(
    page.locator("#platinum-cloud-cycle-triennially"),
  ).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Home");
  await expect(page.locator("#platinum-cloud-cycle-monthly")).toBeFocused();
  await page.locator("#bang-gia button[aria-expanded]").click();
  await expect(page.locator("[data-pid]")).toHaveCount(4);
  await page.locator("#cau-hoi summary").first().click();
  await expect(page.locator("#cau-hoi details").first()).toHaveAttribute(
    "open",
    "",
  );
  await page.locator("#cau-hoi summary").first().click();
  await expect(page.locator("#ung-dung + section")).toHaveAttribute(
    "aria-labelledby",
    "one-click-title",
  );
  await page.locator("#environment-tab-0").focus();
  await page.keyboard.press("End");
  await expect(page.locator("#environment-panel-1")).toBeVisible();
  await expect(page.locator("#environment-panel-1 article")).toHaveCount(4);
  await page.keyboard.press("Home");
  await expect(page.locator("#environment-panel-0 article")).toHaveCount(5);
  const old = await page.request.get(`${base}/intel-platinum-gen2-cloud/`, {
    maxRedirects: 0,
  });
  assert.equal(old.status(), 308);
  assert.equal(
    new URL(old.headers().location, base).pathname,
    "/platinum-cloud-server/",
  );

  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(`${base}/platinum-cloud-server/`, {
      waitUntil: "networkidle",
    });
    await page.evaluate(async () => {
      document
        .querySelectorAll("main img")
        .forEach((img) => (img.loading = "eager"));
      await document.fonts.ready;
      await Promise.all(
        [...document.querySelectorAll("main img")].map((img) =>
          img.decode().catch(() => {}),
        ),
      );
      window.scrollTo(0, 0);
    });
    const layout = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      broken: [...document.querySelectorAll("main img")]
        .filter(
          (img) =>
            img.getBoundingClientRect().width &&
            (!img.complete || !img.naturalWidth),
        )
        .map((img) => img.src),
      buttons: [
        ...document.querySelectorAll("main > section:first-of-type .button"),
      ].map((e) => {
        const r = e.getBoundingClientRect();
        return [r.width, r.height];
      }),
      padding: [
        ...document.querySelectorAll(
          "main > section:not(:first-of-type), main > div > section",
        ),
      ].map((e) => ({
        id: e.id || e.getAttribute("aria-labelledby"),
        top: getComputedStyle(e).paddingTop,
        bottom: getComputedStyle(e).paddingBottom,
      })),
    }));
    assert.equal(layout.overflow, false, `${width}: page overflow`);
    assert.deepEqual(layout.broken, []);
    assert.deepEqual(layout.buttons[0], layout.buttons[1]);
    const pad = width < 640 ? "48px" : width < 960 ? "64px" : "80px";
    for (const p of layout.padding) {
      const expectedPadding =
        p.id === "platinum-cloud-consultation"
          ? width < 640
            ? "52px"
            : "80px"
          : p.id === "nen-tang"
            ? width < 1000
              ? "40px"
              : "24px"
            : pad;
      assert.equal(p.top, expectedPadding, p.id);
      assert.equal(
        p.bottom,
        p.id === "nen-tang" ? "32px" : expectedPadding,
        p.id,
      );
    }
    const axe = await new AxeBuilder({ page })
      .include("main")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    assert.deepEqual(
      axe.violations.map((v) => ({
        id: v.id,
        targets: v.nodes.map((n) => n.target),
      })),
      [],
    );
    await page.screenshot({
      path: `${directory}/${width}.png`,
      fullPage: true,
    });
    if (width === 390 || width === 1440)
      await page.screenshot({ path: `${directory}/hero-${width}.png` });
    results.push({ width, ...layout, accessibility: true });
    console.log(`Platinum Cloud ${width}px: passed`);
  }
  await page
    .locator('main > section:first-of-type a[href="#bang-gia"]')
    .click();
  await expect(page.locator("#platinum-cloud-pricing-title")).toBeInViewport();
  const anchors = await page
    .locator('main a[href^="#"]')
    .evaluateAll((links) => links.map((a) => a.getAttribute("href")));
  for (const a of new Set(anchors))
    assert(await page.locator(a).count(), `Missing anchor ${a}`);
  assert.deepEqual(errors, []);

  const noJs = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 1000 },
  });
  const fallback = await noJs.newPage();
  await fallback.goto(`${base}/platinum-cloud-server/`);
  await expect(fallback.locator("[data-pid]")).toHaveCount(4);
  await expect(
    fallback.locator('noscript a[href*="/store/platinum-g2-cloud"]'),
  ).toBeVisible();
  await fallback.locator("#cau-hoi summary").first().click();
  await expect(fallback.locator("#cau-hoi details").first()).toHaveAttribute(
    "open",
    "",
  );
  await noJs.close();

  if (!process.env.SKIP_RETRY_FIXTURE) {
    assert.equal(await fs.stat(fixtureDir).catch(() => null), null);
    await fs.mkdir(fixtureDir);
    try {
      await fs.writeFile(
        `${fixtureDir}/page.tsx`,
        'import { PlatinumCloudPricing } from "@/components/platinum-cloud-server/platinum-cloud-pricing"; export default function Page(){return <main><PlatinumCloudPricing initialProducts={null}/></main>}',
      );
      let recover = false;
      const retry = await context.newPage();
      await retry.route("**/api/platinum-cloud-server-pricing/", (route) =>
        route.fulfill({
          status: recover ? 200 : 502,
          contentType: "application/json",
          body: JSON.stringify(
            recover ? { products: normalized } : { error: "Unavailable" },
          ),
        }),
      );
      await retry.goto(`${base}/platinum-cloud-pricing-qa/`, {
        waitUntil: "networkidle",
      });
      await expect(retry.locator("#bang-gia [role=status] h3")).toHaveText(
        "Chưa tải được bảng giá Platinum Cloud Server",
      );
      await retry.getByRole("button", { name: "Thử lại" }).click();
      await expect(retry.getByText(/Kết nối chưa thành công/)).toBeVisible();
      recover = true;
      await retry.getByRole("button", { name: "Thử lại" }).click();
      await expect(retry.locator("[data-pid]")).toHaveCount(4);
      await retry.close();
    } finally {
      await fs.unlink(`${fixtureDir}/page.tsx`);
      await fs.rmdir(fixtureDir);
    }
  }
  for (const route of ["/amd-cloud-server/", "/cloud-server/"]) {
    await page.goto(base + route, { waitUntil: "networkidle" });
    assert.equal(await page.locator("h1").count(), 1);
    if (route === "/amd-cloud-server/")
      await expect(page.locator("h1")).toHaveText("AMD Cloud Server");
    else
      assert(
        await page.locator('main a[href="/platinum-cloud-server/"]').count(),
      );
  }
  await fs.writeFile(
    `${directory}/results.json`,
    JSON.stringify(
      {
        passed: true,
        products: normalized.length,
        cycles: 6,
        viewports: results,
        noJavaScript: true,
        retryRecovery: !process.env.SKIP_RETRY_FIXTURE,
        redirect: 308,
      },
      null,
      2,
    ),
  );
  console.log(
    JSON.stringify({
      passed: true,
      products: normalized.length,
      cycles: 6,
      viewports: results.length,
      noJavaScript: true,
    }),
  );
} finally {
  await browser.close();
}
