import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { decodeHTML } from "entities";

const base = process.env.TEST_BASE_URL || "http://localhost:3100";
const devBase = process.env.PLATINUM_QA_DEV_BASE_URL || "http://localhost:3100";
const directory = "artifacts/vps-platinum";
await fs.mkdir(directory, { recursive: true });
const cycles = [
  "monthly",
  "quarterly",
  "semiannually",
  "annually",
  "biennially",
  "triennially",
];
const sources = {};
for (const gid of [29, 101, 100]) {
  const response = await fetch(
    `https://support.interdata.vn/packages.php?gid=${gid}&module`,
    { signal: AbortSignal.timeout(20000) },
  );
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.success, true);
  sources[gid] = data.products.map((p) => ({
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
            (key) =>
              typeof p.pricing.VND[key] === "string" &&
              p.pricing.VND[key].trim() &&
              Number.isFinite(Number(p.pricing.VND[key])) &&
              Number(p.pricing.VND[key]) >= 0,
          )
          .map((key) => [key, p.pricing.VND[key]]),
      ),
    },
  }));
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
  const response = await page.goto(`${base}/vps-platinum/`, {
    waitUntil: "networkidle",
  });
  expect(response.status()).toBe(200);
  await expect(page.locator("h1")).toHaveText("VPS PLATINUM");
  await expect(page.locator("header.site-header")).toHaveCount(1);
  await expect(page.locator("footer.footer")).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://interdata.vn/vps-platinum/",
  );
  expect(await page.locator("#nen-tang").innerText()).not.toMatch(
    /AMD|EPYC|7763/,
  );
  const schema = JSON.parse(
    await page.locator('main script[type="application/ld+json"]').innerText(),
  );
  expect(schema.url).toBe("https://interdata.vn/vps-platinum/");
  for (const old of ["/platinum/?utm_source=qa", "/platinum?utm_source=qa"]) {
    const redirect = await page.request.get(`${base}${old}`, {
      maxRedirects: 0,
    });
    expect(redirect.status()).toBe(308);
    const location = new URL(redirect.headers().location, base);
    expect(["/platinum/", "/vps-platinum/"]).toContain(location.pathname);
    expect(location.searchParams.get("utm_source")).toBe("qa");
    const final = await page.request.get(`${base}${old}`);
    expect(new URL(final.url()).pathname).toBe("/vps-platinum/");
  }
  const invalid = await page.request.get(
    `${base}/api/vps-platinum-pricing/?gid=67`,
  );
  expect(invalid.status()).toBe(400);
  await expect(page.locator("#platinum-group")).toHaveValue("101");
  for (const gid of [101, 29, 100]) {
    const api = await page.request.get(
      `${base}/api/vps-platinum-pricing/?gid=${gid}`,
    );
    expect(api.status()).toBe(200);
    expect((await api.json()).products).toEqual(sources[gid]);
    const products = sources[gid].filter(
      (p) => !/HN|custom/i.test(p.name) && !p.slug.startsWith("custom"),
    );
    await page.locator("#platinum-group").selectOption(String(gid));
    await expect(page.locator("[data-pid]")).toHaveCount(
      Math.min(4, products.length),
    );
    if (products.length > 4)
      await page.locator("#bang-gia button[aria-expanded]").click();
    await expect(page.locator("[data-pid]")).toHaveCount(products.length);
    expect(
      await page
        .locator("[data-pid]")
        .evaluateAll((nodes) => nodes.map((n) => Number(n.dataset.pid))),
    ).toEqual(products.map((p) => p.pid));
    const available = cycles.filter((key) =>
      products.some((p) => p.pricing.VND[key] !== undefined),
    );
    await expect(page.getByRole("tab")).toHaveCount(available.length);
    for (const cycle of available) {
      await page.locator(`#platinum-cycle-${cycle}`).click();
      await expect(page.locator(`#platinum-cycle-${cycle}`)).toHaveAttribute(
        "aria-selected",
        "true",
      );
      for (const product of products) {
        const card = page.locator(`[data-pid="${product.pid}"]`);
        await expect(card.locator("h3")).toHaveText(product.name);
        const price = product.pricing.VND[cycle];
        await expect(card.locator("strong")).toHaveText(
          price === undefined
            ? "Liên hệ"
            : `${Number(price).toLocaleString("vi-VN")}đ`,
        );
        await expect(card.locator("a")).toHaveAttribute(
          "href",
          price === undefined
            ? "/lien-he/"
            : `${product.product_url}&billingcycle=${cycle}`,
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
      }
    }
    results.push({
      gid,
      products: products.length,
      cycles: available.length,
      pricesAndCheckout: "passed",
    });
  }
  await page.locator("#platinum-group").selectOption("101");
  await page.locator("#platinum-cycle-monthly").focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#platinum-cycle-quarterly")).toBeFocused();
  await page.keyboard.press("End");
  await expect(page.locator("#platinum-cycle-triennially")).toBeFocused();
  await page.keyboard.press("Home");
  await expect(page.locator("#platinum-cycle-monthly")).toBeFocused();
  const faq = page.locator("#cau-hoi details").first();
  await faq.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(faq).toHaveAttribute("open", "");
  await page.keyboard.press("Enter");
  expect(
    await page
      .locator("main a[href^='#']")
      .evaluateAll((nodes) =>
        nodes
          .map((n) => n.getAttribute("href"))
          .filter((href) => !document.getElementById(href.slice(1))),
      ),
  ).toEqual([]);
  await page.locator(".hero-content a[href='#bang-gia']").click();
  await expect(page.locator("#platinum-pricing-title")).toBeInViewport();
  const shared = async (p) => ({
    quotes: await p.locator("#khach-hang .testimonial-full").allTextContents(),
    press: await p.locator("#bao-chi h3").allTextContents(),
  });
  const proof = await shared(page);
  expect(proof.quotes.length).toBe(8);
  const amd = await context.newPage();
  await amd.goto(`${base}/vps-amd/`, { waitUntil: "networkidle" });
  expect(await shared(amd)).toEqual(proof);
  await amd.close();
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.evaluate(async () => {
      await document.fonts.ready;
      for (let y = 0; y < document.body.scrollHeight; y += 800) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 80));
      }
    });
    await page.waitForTimeout(400);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    const buttons = await page
      .locator(".hero-content .button")
      .evaluateAll((nodes) =>
        nodes.map((node) => ({
          width: node.getBoundingClientRect().width,
          height: node.getBoundingClientRect().height,
        })),
      );
    expect(buttons).toHaveLength(2);
    expect(Math.abs(buttons[0].width - buttons[1].width)).toBeLessThan(1);
    expect(Math.abs(buttons[0].height - buttons[1].height)).toBeLessThan(1);
    for (const tab of await page.getByRole("tab").all()) {
      const rect = await tab.boundingBox();
      expect(rect.x).toBeGreaterThanOrEqual(0);
      expect(rect.x + rect.width).toBeLessThanOrEqual(width);
      expect(rect.height).toBeGreaterThanOrEqual(44);
    }
    expect(
      await page.locator("main img").evaluateAll((nodes) =>
        nodes
          .filter((img) => {
            const r = img.getBoundingClientRect();
            return (
              r.width > 0 &&
              r.right > 0 &&
              r.left < innerWidth &&
              (!img.complete || img.naturalWidth === 0)
            );
          })
          .map((img) => img.getAttribute("src")),
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
    await page.screenshot({ path: `${directory}/hero-${width}.png` });
    results.push({
      width,
      overflow: false,
      images: "passed",
      accessibility: "passed",
      heroButtons: buttons,
    });
    console.log(`Viewport ${width}: passed`);
  }
  expect(errors).toEqual([]);
  const noJs = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 1000 },
  });
  const fallback = await noJs.newPage();
  await fallback.goto(`${base}/vps-platinum/`);
  await expect(fallback.locator("[data-pid]")).toHaveCount(4);
  await expect(fallback.locator("noscript a")).toHaveCount(3);
  await fallback.locator("#cau-hoi summary").first().click();
  await expect(fallback.locator("#cau-hoi details").first()).toHaveAttribute(
    "open",
    "",
  );
  await noJs.close();
  // A temporary dev-only route exercises genuine client outage and retry states.
  const fixture = path.resolve(
    "src/app/(website)/platinum-pricing-qa/page.tsx",
  );
  assert.equal(await fs.stat(path.dirname(fixture)).catch(() => null), null);
  await fs.mkdir(path.dirname(fixture));
  try {
    await fs.writeFile(
      fixture,
      'import { PlatinumPricing } from "@/components/vps-platinum/platinum-pricing"; export default function Page(){ return <main id="noi-dung"><PlatinumPricing initialPrices={{29:null,101:null,100:null}} /></main>; }',
    );
    const retry = await context.newPage();
    let recover = false;
    await retry.route("**/api/vps-platinum-pricing/?gid=*", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const gid = new URL(route.request().url()).searchParams.get("gid");
      await route.fulfill({
        status: recover ? 200 : 502,
        contentType: "application/json",
        body: JSON.stringify(
          recover ? { products: sources[gid] } : { error: "Unavailable" },
        ),
      });
    });
    await retry.goto(`${devBase}/platinum-pricing-qa/`, {
      waitUntil: "networkidle",
    });
    await retry.getByRole("button", { name: "Thử lại" }).click();
    await expect(
      retry.getByRole("button", { name: "Đang tải bảng giá…" }),
    ).toBeDisabled();
    await expect(retry.getByText(/Kết nối chưa thành công/)).toBeVisible();
    recover = true;
    await retry.getByRole("button", { name: "Thử lại" }).click();
    await expect(retry.locator("[data-pid]")).toHaveCount(4);
    await retry.locator("#platinum-group").selectOption("100");
    await retry.getByRole("button", { name: "Thử lại" }).click();
    await expect(retry.locator("[data-pid]")).toHaveCount(3);
    await expect(retry.getByRole("tab")).toHaveCount(3);
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
        base,
        groups: results.filter((r) => r.gid),
        viewports: results.filter((r) => r.width),
        redirect: true,
        sharedProof: true,
        noJavaScript: true,
        retryRecovery: true,
        pageErrors: errors,
      },
      null,
      2,
    ),
  );
  console.log(
    JSON.stringify({
      passed: true,
      groups: 3,
      viewports: 6,
      noJavaScript: true,
      retryRecovery: true,
      redirect: true,
    }),
  );
} finally {
  await browser.close();
}
