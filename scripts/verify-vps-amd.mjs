import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";
import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { decodeHTML } from "entities";

const base = process.env.TEST_BASE_URL || "http://localhost:3100";
const devBase = process.env.AMD_QA_DEV_BASE_URL || "http://localhost:3100";
const directory = "artifacts/vps-amd";
await fs.mkdir(directory, { recursive: true });
const cycles = [
  "monthly",
  "quarterly",
  "semiannually",
  "annually",
  "biennially",
  "triennially",
];
const liveResponse = await fetch(
  "https://support.interdata.vn/packages.php?gid=67&module",
  { signal: AbortSignal.timeout(20000) },
);
assert.equal(liveResponse.status, 200);
const live = await liveResponse.json();
assert.equal(live.success, true);
const library = ts.transpileModule(
  await fs.readFile("src/lib/vps-amd-pricing.ts", "utf8"),
  { compilerOptions: { module: ts.ModuleKind.CommonJS } },
).outputText;
async function load(fetcher) {
  const exported = {};
  vm.runInNewContext(library, {
    exports: exported,
    require: () => ({ amdBillingCycles: cycles.map((key) => ({ key })) }),
    fetch: fetcher,
    URL,
    AbortSignal,
  });
  return exported.getAmdProducts();
}
const normalized = await load(async (url, options) => {
  assert.equal(url, "https://support.interdata.vn/packages.php?gid=67&module");
  assert.equal(options.next.revalidate, 60);
  return { ok: true, json: async () => live };
});
assert.equal(normalized.length, live.products.length);
await assert.rejects(() => load(async () => ({ ok: false, status: 502 })));
await assert.rejects(() =>
  load(async () => ({
    ok: true,
    json: async () => ({ success: true, products: [] }),
  })),
);
await assert.rejects(() =>
  load(async () => ({
    ok: true,
    json: async () => ({
      success: true,
      products: [
        { ...live.products[0], product_url: "https://example.com/checkout" },
      ],
    }),
  })),
);
await assert.rejects(() =>
  load(async () => ({
    ok: true,
    json: async () => ({
      success: true,
      products: [{ ...live.products[0], gid: 3 }],
    }),
  })),
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
  page.on("pageerror", (error) => errors.push(error.message));
  const response = await page.goto(`${base}/vps-amd/`, {
    waitUntil: "networkidle",
  });
  expect(response.status()).toBe(200);
  await expect(page.locator("header.site-header")).toHaveCount(1);
  await expect(page.locator("footer.footer")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://interdata.vn/vps-amd/",
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, nofollow",
  );
  const localResponse = await page.request.get(`${base}/api/vps-amd-pricing/`);
  expect(localResponse.status()).toBe(200);
  const local = await localResponse.json();
  expect(local.products).toEqual(normalized);
  const allButton = page.getByRole("button", {
    name: /Xem tất cả.*gói VPS AMD/,
  });
  await expect(page.locator("[data-pid]")).toHaveCount(
    Math.min(4, normalized.length),
  );
  await allButton.click();
  await expect(page.locator("[data-pid]")).toHaveCount(normalized.length);
  for (const cycle of cycles) {
    await page
      .getByLabel("Chu kỳ thanh toán", { exact: true })
      .selectOption(cycle);
    for (const product of normalized) {
      const card = page.locator(`[data-pid="${product.pid}"]`);
      await expect(card.locator("h3")).toHaveText(product.name);
      await expect(card.locator("strong")).toHaveText(
        `${Number(product.pricing.VND[cycle]).toLocaleString("vi-VN")}đ`,
      );
      const specs = decodeHTML(
        product.description
          .replace(/<br\s*\/?\s*>/gi, "\n")
          .replace(/<[^>]*>/g, ""),
      )
        .split(/\r?\n|\?/)
        .map((s) => s.trim())
        .filter(Boolean);
      await expect(card.locator("li span")).toHaveText(specs);
      await expect(card.locator("a")).toHaveAttribute(
        "href",
        `${product.product_url}&billingcycle=${cycle}`,
      );
    }
  }
  await page
    .getByLabel("Chu kỳ thanh toán", { exact: true })
    .selectOption("monthly");
  await page.getByRole("button", { name: "Thu gọn bảng giá" }).click();
  for (const [name, minimum, maximum] of [
    ["1–2 vCPU", 1, 2],
    ["3–8 vCPU", 3, 8],
    ["Từ 10 vCPU", 10, Infinity],
  ]) {
    await page.getByRole("tab", { name, exact: true }).click();
    await expect(page.getByRole("tab", { name, exact: true })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    const expected = normalized.filter((product) => {
      const cores = Number(product.description.match(/(\d+)\s*vCPU/i)?.[1]);
      return cores >= minimum && cores <= maximum;
    });
    await expect(page.locator("[data-pid]")).toHaveCount(
      Math.min(4, expected.length),
    );
    expect(
      await page
        .locator("[data-pid]")
        .evaluateAll((nodes) => nodes.map((node) => Number(node.dataset.pid))),
    ).toEqual(expected.slice(0, 4).map((product) => product.pid));
    if (expected.length > 4) {
      await page
        .getByRole("button", { name: /Xem tất cả.*gói VPS AMD/ })
        .click();
      await expect(page.locator("[data-pid]")).toHaveCount(expected.length);
    }
  }
  const firstTab = page.getByRole("tab", {
    name: "Tất cả cấu hình",
    exact: true,
  });
  await firstTab.click();
  await firstTab.focus();
  await page.keyboard.press("End");
  await expect(
    page.getByRole("tab", { name: "Từ 10 vCPU", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Home");
  await expect(firstTab).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "1–2 vCPU", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("ArrowLeft");
  await expect(firstTab).toHaveAttribute("aria-selected", "true");
  await page.getByLabel("Chu kỳ thanh toán", { exact: true }).focus();
  await page.keyboard.press("ArrowDown");
  await expect(
    page.getByLabel("Chu kỳ thanh toán", { exact: true }),
  ).toHaveValue("quarterly");
  await page
    .getByLabel("Chu kỳ thanh toán", { exact: true })
    .selectOption("monthly");
  const faq = page.locator("#cau-hoi details").first();
  await faq.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(faq).toHaveAttribute("open", "");
  await page.keyboard.press("Enter");
  await expect(faq).not.toHaveAttribute("open");
  expect(
    await page
      .locator("main a[href^='#']")
      .evaluateAll((nodes) =>
        nodes
          .map((n) => n.getAttribute("href"))
          .filter((href) => !document.getElementById(href.slice(1))),
      ),
  ).toEqual([]);

  // The shared proof must contain the same full content and outbound links on every route.
  const proofSnapshot = async (p) => ({
    quotes: await p.locator("#khach-hang .testimonial-full").allTextContents(),
    people: await p
      .locator("#khach-hang .testimonial-author")
      .allTextContents(),
    press: await p.locator("#bao-chi h3").allTextContents(),
    urls: await p
      .locator("#bao-chi a")
      .evaluateAll((nodes) => nodes.map((n) => n.getAttribute("href"))),
  });
  const proof = await proofSnapshot(page);
  expect(proof.quotes.length).toBe(8);
  expect(proof.press.length).toBeGreaterThan(0);
  for (const route of ["/", "/thue-vps/"]) {
    const comparison = await context.newPage();
    await comparison.goto(`${base}${route}`, { waitUntil: "networkidle" });
    expect(await proofSnapshot(comparison)).toEqual(proof);
    await comparison.close();
  }
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    const heroLayout = await page.evaluate(() => {
      const hero = document
        .querySelector(".hero-shell")
        .getBoundingClientRect();
      const lists = document.querySelectorAll(".hero-shell ul");
      const ticks = lists[lists.length - 1].getBoundingClientRect();
      const price = document
        .querySelector(".hero-content strong")
        .closest("p")
        .getBoundingClientRect();
      const pricingTitle = document
        .querySelector("#amd-pricing-title")
        .getBoundingClientRect();
      return {
        x: hero.x,
        width: hero.width,
        viewport: innerWidth,
        priceGap: ticks.top - price.bottom,
        pricingGap: pricingTitle.top - hero.bottom,
      };
    });
    expect(heroLayout.x).toBe(0);
    expect(heroLayout.width).toBe(heroLayout.viewport);
    expect(heroLayout.priceGap).toBeGreaterThan(20);
    expect(heroLayout.pricingGap).toBeGreaterThan(20);
    await page.evaluate(async () => {
      await document.fonts.ready;
      for (let y = 0; y < document.body.scrollHeight; y += 700) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 70));
      }
    });
    await page.waitForTimeout(600);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    expect(
      await page.locator("main img").evaluateAll((nodes) =>
        nodes
          .filter((img) => {
            const bounds = img.getBoundingClientRect();
            // Other carousel slides deliberately defer their off-screen images.
            return (
              bounds.width > 0 &&
              bounds.right > 0 &&
              bounds.left < innerWidth &&
              (!img.complete || img.naturalWidth === 0)
            );
          })
          .map((img) => img.src),
      ),
    ).toEqual([]);
    const axe = await new AxeBuilder({ page })
      .include("main")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      axe.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
      path: `${directory}/${width}.png`,
      fullPage: true,
    });
    results.push({
      width,
      fullWidthHero: true,
      heroContentOverlap: false,
      overflow: false,
      images: "passed",
      accessibility: "passed",
    });
  }
  expect(errors).toEqual([]);
  await context.close();
  const motion = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "no-preference",
  });
  const motionPage = await motion.newPage();
  await motionPage.goto(`${base}/vps-amd/`, { waitUntil: "networkidle" });
  await expect(motionPage.locator(".hero-background")).toHaveAttribute(
    "data-parallax-active",
    "true",
  );
  await motionPage.emulateMedia({ reducedMotion: "reduce" });
  await expect(motionPage.locator(".hero-background")).not.toHaveAttribute(
    "data-parallax-active",
  );
  await motionPage
    .getByRole("link", { name: "Xem bảng giá VPS AMD", exact: true })
    .click();
  await expect(motionPage).toHaveURL(`${base}/vps-amd/#bang-gia`);
  await expect(motionPage.locator("#amd-pricing-title")).toBeInViewport();
  await motion.close();
  const noJs = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 1000 },
  });
  const fallback = await noJs.newPage();
  await fallback.goto(`${base}/vps-amd/`);
  await expect(fallback.locator("[data-pid]")).toHaveCount(4);
  await expect(fallback.locator("#khach-hang .testimonial-full")).toHaveCount(
    8,
  );
  await fallback.locator("#cau-hoi summary").first().click();
  await expect(fallback.locator("#cau-hoi details").first()).toHaveAttribute(
    "open",
    "",
  );
  await noJs.close();

  // Dev-only fixture verifies the actual client component's outage and retry states.
  const fixture = path.resolve("src/app/(website)/amd-pricing-qa/page.tsx");
  assert(fixture.startsWith(path.resolve("src/app") + path.sep));
  assert.equal(await fs.stat(path.dirname(fixture)).catch(() => null), null);
  await fs.mkdir(path.dirname(fixture));
  try {
    await fs.writeFile(
      fixture,
      'import { AmdPricing } from "@/components/vps-amd/amd-pricing"; export default function Page(){return <main id="noi-dung"><AmdPricing initialProducts={null}/></main>}',
    );
    const retryPage = await browser.newPage();
    let recover = false;
    await retryPage.route("**/api/vps-amd-pricing/", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      await route.fulfill({
        status: recover ? 200 : 502,
        contentType: "application/json",
        body: JSON.stringify(
          recover ? { products: normalized } : { error: "Unavailable" },
        ),
      });
    });
    await retryPage.goto(`${devBase}/amd-pricing-qa/`, {
      waitUntil: "networkidle",
    });
    await expect(
      retryPage.getByText("Chưa tải được bảng giá VPS AMD"),
    ).toBeVisible();
    await retryPage.getByRole("button", { name: "Thử lại" }).click();
    await expect(
      retryPage.getByRole("button", { name: "Đang tải bảng giá…" }),
    ).toBeDisabled();
    await expect(retryPage.getByText(/Kết nối chưa thành công/)).toBeVisible();
    recover = true;
    await retryPage.getByRole("button", { name: "Thử lại" }).click();
    await expect(retryPage.locator("[data-pid]")).toHaveCount(4);
    await retryPage.close();
  } finally {
    await fs.unlink(fixture);
    await fs.rmdir(path.dirname(fixture));
  }
  await fs.writeFile(
    `${directory}/results.json`,
    JSON.stringify(
      {
        passed: true,
        products: normalized.length,
        billingCycles: 6,
        vcpuFilters: true,
        liveApi: true,
        sharedProof: true,
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
      products: normalized.length,
      cycles: 6,
      vcpuFilters: true,
      viewports: 6,
      sharedProof: true,
      retryRecovery: true,
      noJavaScript: true,
    }),
  );
} finally {
  await browser.close();
}
