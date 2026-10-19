import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";
import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.TEST_BASE_URL || "http://localhost:3100";
const devBase = process.env.LINUX_QA_DEV_BASE_URL || "http://localhost:3100";
const directory = "artifacts/vps-linux";
await fs.mkdir(directory, { recursive: true });
const cycles = [
  "monthly",
  "quarterly",
  "semiannually",
  "annually",
  "biennially",
  "triennially",
];
const response = await fetch(
  "https://support.interdata.vn/packages.php?gid=3&module",
  {
    signal: AbortSignal.timeout(20000),
  },
);
assert.equal(response.status, 200);
const live = await response.json();
assert.equal(live.success, true);
const expected = live.products.filter(
  (p) => /^plan-\d+-/i.test(p.slug) && p.slug.split("-").length >= 5,
);
assert(expected.length > 4);

const library = ts.transpileModule(
  await fs.readFile("src/lib/vps-linux-pricing.ts", "utf8"),
  {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  },
).outputText;
async function normalize(data, ok = true) {
  const exported = {};
  vm.runInNewContext(library, {
    exports: exported,
    require: () => ({
      linuxPricingGid: 3,
      linuxBillingCycles: cycles.map((key) => ({ key })),
    }),
    URL,
    AbortSignal,
    fetch: async (url, options) => {
      assert.equal(
        url,
        "https://support.interdata.vn/packages.php?gid=3&module",
      );
      assert.equal(options.next.revalidate, 60);
      return { ok, status: ok ? 200 : 502, json: async () => data };
    },
  });
  return JSON.parse(JSON.stringify(await exported.getLinuxProducts()));
}
const normalized = await normalize(live);
assert.deepEqual(
  normalized.map((p) => p.pid),
  expected.map((p) => p.pid),
);
for (const [index, product] of normalized.entries()) {
  assert.equal(product.product_url, expected[index].product_url);
  assert.equal(product.description, expected[index].description);
  for (const cycle of cycles) {
    const price = expected[index].pricing.VND[cycle];
    assert.equal(
      product.pricing.VND[cycle],
      Number(price) >= 0 ? price : undefined,
    );
  }
}
await assert.rejects(() => normalize(live, false));
await assert.rejects(() => normalize({ success: false, products: [] }));
await assert.rejects(() => normalize({ success: true, products: [] }));
for (const patch of [
  { gid: 67 },
  { product_url: "https://example.com/checkout" },
  { product_url: "https://user@support.interdata.vn/checkout" },
  { pricing: { VND: { monthly: "-1.00" } } },
]) {
  await assert.rejects(() =>
    normalize({ success: true, products: [{ ...expected[0], ...patch }] }),
  );
}

const browser = await chromium.launch();
const results = [];
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  assert.equal(
    (
      await page.goto(`${base}/vps-linux/`, { waitUntil: "networkidle" })
    ).status(),
    200,
  );
  await expect(page.locator("h1")).toHaveText("VPS Linux");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://interdata.vn/vps-linux/",
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  const schema = JSON.parse(
    await page.locator('main script[type="application/ld+json"]').textContent(),
  );
  assert.equal(schema.url, "https://interdata.vn/vps-linux/");
  assert.equal(schema.name, "VPS Linux InterData");
  await expect(page.locator("[data-pid]")).toHaveCount(4);
  await page.locator("#bang-gia button[aria-expanded]").click();
  await expect(page.locator("[data-pid]")).toHaveCount(expected.length);
  assert.deepEqual(
    await page.locator("[data-pid] h3").allTextContents(),
    expected.map((p) => p.name),
  );
  for (const cycle of cycles) {
    await page.locator(`#linux-cycle-${cycle}`).click();
    for (const product of expected) {
      const card = page.locator(`[data-pid="${product.pid}"]`);
      const value = product.pricing.VND[cycle];
      const price = await card.locator("strong").first().textContent();
      assert.equal(price, `${Number(value).toLocaleString("vi-VN")}đ`);
      const href = await card.locator("a").getAttribute("href");
      const url = new URL(href);
      const original = new URL(product.product_url);
      assert.equal(url.origin, original.origin);
      assert.equal(url.pathname, original.pathname);
      for (const [key, value] of original.searchParams)
        assert.equal(url.searchParams.get(key), value);
      assert.equal(url.searchParams.get("billingcycle"), cycle);
    }
  }
  await page.locator("#linux-cycle-monthly").focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#linux-cycle-quarterly")).toBeFocused();
  await expect(page.locator("#linux-cycle-quarterly")).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page.keyboard.press("Home");
  await expect(page.locator("#linux-cycle-monthly")).toBeFocused();
  await page.locator("#bang-gia button[aria-expanded]").click();
  await expect(page.locator("[data-pid]")).toHaveCount(4);
  assert.equal(
    (await (await page.request.get(`${base}/api/vps-linux-pricing/`)).json())
      .products.length,
    expected.length,
  );
  await page.locator("#cau-hoi summary").first().click();
  await expect(page.locator("#cau-hoi details").first()).toHaveAttribute(
    "open",
    "",
  );
  await page.locator("#cau-hoi summary").first().click();

  const environment = page.locator(
    'section[aria-labelledby="one-click-title"]',
  );
  await expect(page.locator("#ung-dung + section")).toHaveAttribute(
    "aria-labelledby",
    "one-click-title",
  );
  await expect(environment.getByRole("tab")).toHaveText([
    "Linux OS",
    "1-Click Applications",
  ]);
  await expect(environment.locator("#environment-panel-0 article")).toHaveCount(
    5,
  );
  await environment.locator("#environment-tab-0").focus();
  await page.keyboard.press("End");
  await expect(environment.locator("#environment-tab-1")).toBeFocused();
  await expect(environment.locator("#environment-panel-1")).toBeVisible();
  await expect(environment.locator("#environment-panel-1 article")).toHaveCount(
    4,
  );
  await page.keyboard.press("ArrowLeft");
  await expect(environment.locator("#environment-tab-0")).toBeFocused();
  await expect(environment.locator("#environment-panel-0")).toBeVisible();

  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(`${base}/vps-linux/`, { waitUntil: "networkidle" });
    await page.evaluate(async () => {
      document.querySelectorAll("main img").forEach((img) => {
        img.loading = "eager";
      });
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
          page.evaluate(() =>
            [...document.querySelectorAll("main img")]
              .filter((img) => {
                const rect = img.getBoundingClientRect();
                return (
                  rect.width > 0 &&
                  rect.height > 0 &&
                  (!img.complete || !img.naturalWidth)
                );
              })
              .map((img) => img.src),
          ),
        { timeout: 20000 },
      )
      .toEqual([]);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      `${width}: overflow`,
    );
    const layout = await page.evaluate(() => {
      const hero = document.querySelector("main > section");
      const buttons = [...hero.querySelectorAll(".button")].map((e) => {
        const r = e.getBoundingClientRect();
        return [r.width, r.height];
      });
      const badges = [...document.querySelectorAll("main span")].filter(
        (e) =>
          /eyebrow|panelLabel/i.test(e.className) &&
          !e.closest('section[aria-labelledby="one-click-title"]') &&
          e.getBoundingClientRect().height,
      );
      return {
        buttons,
        badges: badges.map((e) => ({
          text: e.textContent,
          icons: e.querySelectorAll("svg").length,
          first: e.firstElementChild?.tagName === "svg",
          clipped: e.scrollWidth > e.clientWidth + 1,
        })),
        broken: [...document.querySelectorAll("main img")]
          .filter((img) => {
            const rect = img.getBoundingClientRect();
            return (
              rect.width > 0 &&
              rect.height > 0 &&
              (!img.complete || !img.naturalWidth)
            );
          })
          .map((img) => img.src),
        images: [...document.querySelectorAll("main img")].map((img) =>
          decodeURIComponent(img.src),
        ),
      };
    });
    assert.equal(layout.buttons.length, 2);
    assert.deepEqual(layout.buttons[0], layout.buttons[1]);
    assert.deepEqual(layout.broken, []);
    assert(
      layout.images.every(
        (src) =>
          !src.includes("/images/vps-platinum/") &&
          !src.includes("/images/vps-amd/"),
      ),
    );
    for (const badge of layout.badges) {
      assert.equal(badge.icons, 1, badge.text);
      assert.equal(badge.first, true, badge.text);
      assert.equal(badge.clipped, false, badge.text);
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
    results.push({
      width,
      badges: layout.badges.length,
      overflow: false,
      images: true,
      accessibility: true,
      heroButtons: layout.buttons,
    });
    console.log(`Linux ${width}px: passed`);
  }
  assert.deepEqual(errors, []);
  await page
    .locator('section[aria-labelledby="linux-title"] .button[href="#bang-gia"]')
    .click();
  await expect(page).toHaveURL(`${base}/vps-linux/#bang-gia`);
  await expect(page.locator("#linux-pricing-title")).toBeInViewport();
  await page.close();

  const fallback = await browser.newPage({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 1000 },
  });
  await fallback.goto(`${base}/vps-linux/`);
  await expect(fallback.locator("[data-pid]")).toHaveCount(4);
  await expect(
    fallback.locator('noscript a[href*="/store/cloud-vps"]'),
  ).toBeVisible();
  await fallback.locator("#cau-hoi summary").first().click();
  await expect(fallback.locator("#cau-hoi details").first()).toHaveAttribute(
    "open",
    "",
  );
  await fallback.close();

  const fixture = path.resolve("src/app/(website)/linux-pricing-qa/page.tsx");
  assert(fixture.startsWith(path.resolve("src/app") + path.sep));
  assert.equal(await fs.stat(path.dirname(fixture)).catch(() => null), null);
  await fs.mkdir(path.dirname(fixture));
  try {
    await fs.writeFile(
      fixture,
      'import { LinuxPricing } from "@/components/vps-linux/linux-pricing"; export default function Page(){return <main id="noi-dung"><LinuxPricing initialProducts={null}/></main>}',
    );
    const retry = await browser.newPage();
    let recover = false;
    await retry.route("**/api/vps-linux-pricing/", async (route) =>
      route.fulfill({
        status: recover ? 200 : 502,
        contentType: "application/json",
        body: JSON.stringify(
          recover ? { products: normalized } : { error: "Unavailable" },
        ),
      }),
    );
    await retry.goto(`${devBase}/linux-pricing-qa/`, {
      waitUntil: "networkidle",
    });
    await expect(
      retry.getByText("Chưa tải được bảng giá VPS Linux"),
    ).toBeVisible();
    await retry.getByRole("button", { name: "Thử lại" }).click();
    await expect(retry.getByText(/Kết nối chưa thành công/)).toBeVisible();
    recover = true;
    await retry.getByRole("button", { name: "Thử lại" }).click();
    await expect(retry.locator("[data-pid]")).toHaveCount(4);
    await retry.close();
  } finally {
    await fs.unlink(fixture);
    await fs.rmdir(path.dirname(fixture));
  }
  await fs.writeFile(
    `${directory}/results.json`,
    JSON.stringify(
      {
        passed: true,
        products: expected.length,
        cycles: 6,
        noJavaScript: true,
        retryRecovery: true,
        viewports: results,
      },
      null,
      2,
    ),
  );
  console.log(
    JSON.stringify({
      passed: true,
      products: expected.length,
      cycles: 6,
      viewports: results.length,
      retryRecovery: true,
      noJavaScript: true,
    }),
  );
} finally {
  await browser.close();
}
