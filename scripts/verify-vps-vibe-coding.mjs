import assert from "node:assert/strict";
import fs from "node:fs/promises";
import crypto from "node:crypto";
import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { decodeHTML } from "entities";

const base = process.env.TEST_BASE_URL || "http://localhost:3100";
const dir = "artifacts/vps-vibe-coding";
await fs.mkdir(dir, { recursive: true });
const cycles = [
  "monthly",
  "quarterly",
  "annually",
  "biennially",
  "triennially",
];
const source = await (
  await fetch("https://support.interdata.vn/packages.php?gid=98&module")
).json();
const response = await fetch(`${base}/api/vps-vibe-coding-pricing/`);
assert.equal(response.status, 200);
const { plans } = await response.json();
assert.equal(plans.length, source.products.length);
for (const [i, plan] of plans.entries()) {
  const raw = source.products[i];
  assert.equal(plan.id, String(raw.pid));
  assert.equal(plan.name, raw.name);
  assert.equal(plan.productUrl, raw.product_url);
  assert.deepEqual(
    plan.specs,
    decodeHTML(
      raw.description.replace(/<br\s*\/?\s*>/gi, "\n").replace(/<[^>]+>/g, ""),
    )
      .split(/\r?\n/)
      .map((s) => s.replace(/\s+/g, " ").trim())
      .filter((s) => s && !/gia hạn/i.test(s)),
  );
  for (const cycle of cycles)
    assert.equal(
      plan.prices[cycle],
      `${new Intl.NumberFormat("vi-VN").format(Number(raw.pricing.VND[cycle]))} đ`,
    );
}
const manifest = JSON.parse(
  await fs.readFile("docs/vps-vibe-coding-assets.json", "utf8"),
);
for (const item of manifest)
  assert.equal(
    crypto
      .createHash("sha256")
      .update(await fs.readFile(item.target))
      .digest("hex"),
    item.sha256,
  );

const browser = await chromium.launch();
const results = [];
try {
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    const context = await browser.newContext({
      viewport: { width, height: 1000 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(`${base}/vps-vibe-coding/`, {
      waitUntil: "domcontentloaded",
    });
    await expect(page.locator("h1")).toHaveText("VPS Vibe Coding");
    await expect(page.locator("main")).toHaveAttribute("id", "noi-dung");
    await expect(page.locator("main > section")).toHaveCount(12);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://interdata.vn/vps-vibe-coding/",
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
    await expect(page.locator(".hero-vibe-proof-typed")).toContainText(
      "Cafe Robusta kết hợp cùng Arabica",
    );
    await page
      .getByRole("button", { name: "Đóng câu chuyện vibe code" })
      .click();
    await expect(page.locator(".hero-vibe-proof")).toBeHidden();
    await page
      .getByRole("button", {
        name: "Xem câu chuyện vibe code của landing page",
      })
      .click();
    await expect(page.locator(".hero-vibe-proof")).toBeVisible();
    await page
      .getByRole("button", { name: "Đóng câu chuyện vibe code" })
      .click();

    const tabs = page.locator("#gia [role=tab]");
    await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
    for (const [index, cycle] of cycles.entries()) {
      await tabs.nth(index).click();
      for (const plan of plans) {
        const card = page.locator(`[data-pid="${plan.id}"]`);
        await expect(card.locator("[data-vibe-price] strong")).toHaveText(
          plan.prices[cycle],
        );
        const url = new URL(
          await card.locator("a.button").getAttribute("href"),
        );
        assert.equal(url.searchParams.get("billingcycle"), cycle);
        assert.equal(
          url.origin + url.pathname,
          new URL(plan.productUrl).origin + new URL(plan.productUrl).pathname,
        );
        assert.deepEqual(
          [...url.searchParams].filter(([key]) => key !== "billingcycle"),
          [...new URL(plan.productUrl).searchParams],
        );
        await expect(card.locator("[data-annual-offer]")).toHaveCount(
          index < 2 ? 1 : 0,
        );
      }
      await expect(page.locator("#gia [data-popular] h3")).toHaveText(
        "Vibe Standard",
      );
    }
    await tabs.last().press("Home");
    await expect(tabs.first()).toBeFocused();
    await tabs.first().press("ArrowRight");
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await tabs.first().click();
    const useTabs = page.locator("#lamduoc [role=tab]");
    for (const [i, count] of [4, 3].entries()) {
      await useTabs.nth(i).click();
      const options = page.locator(".uc-option");
      await expect(options).toHaveCount(count);
      for (let k = 0; k < count; k++) {
        await options.nth(k).click();
        await expect(options.nth(k)).toHaveAttribute("aria-pressed", "true");
        await expect
          .poll(() =>
            page
              .locator(".uc-stage img")
              .evaluate((img) => img.complete && img.naturalWidth > 0),
          )
          .toBe(true);
      }
    }
    await useTabs.last().press("Home");
    await expect(useTabs.first()).toBeFocused();
    await expect(page.locator(".ps-step details")).toHaveCount(4);
    for (const detail of await page.locator(".ps-step details").all()) {
      await detail.locator("summary").click();
      await expect(detail).toHaveAttribute("open", "");
    }
    const faqs = page.locator(".faq-item");
    await expect(faqs).toHaveCount(16);
    await faqs.first().locator("summary").click();
    await faqs.last().locator("summary").click();
    await expect(faqs.first()).not.toHaveAttribute("open", "");
    await expect(faqs.last()).toHaveAttribute("open", "");
    await page.getByRole("button", { name: "Xem nội dung chi tiết" }).click();
    await expect(page.locator(".info-toggle")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await page.getByRole("button", { name: "Tạm dừng chuyển động" }).click();
    await expect(page.locator(".proof-controls button")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    for (const image of await page.locator("main img").all()) {
      if (await image.evaluate((img) => Boolean(img.closest("[inert]"))))
        continue;
      await image.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          image.evaluate((img) => img.complete && img.naturalWidth > 0),
        )
        .toBe(true);
    }
    await page.evaluate(() =>
      document
        .querySelectorAll(".feedback-rail,.press-rail")
        .forEach((el) => (el.scrollLeft = 0)),
    );
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      )
      .toBe(true);
    const axe = await new AxeBuilder({ page })
      .include("main")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    await fs.writeFile(
      `${dir}/axe-${width}.json`,
      JSON.stringify(axe.violations, null, 2),
    );
    assert.equal(
      axe.violations.length,
      0,
      `${width}: ${axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join()}`).join("\n")}`,
    );
    assert.deepEqual(errors, []);
    await page.getByRole("button", { name: "Thu gọn nội dung" }).click();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `${dir}/page-${width}.png`, fullPage: true });
    console.log(`PASS ${width}px`);
    await page.locator("#top").screenshot({ path: `${dir}/hero-${width}.png` });
    await page
      .locator("#gia")
      .screenshot({ path: `${dir}/pricing-${width}.png` });
    results.push({
      width,
      plans: plans.length,
      cycles: cycles.length,
      images: manifest.length,
      axe: 0,
      overflow: false,
      runtimeErrors: errors,
    });
    await context.close();
  }
  const noJs = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  const page = await noJs.newPage();
  await page.goto(`${base}/vps-vibe-coding/`, {
    waitUntil: "domcontentloaded",
  });
  await expect(page.locator("#gia article[data-pid]")).toHaveCount(
    plans.length,
  );
  await expect(page.locator(".hero-vibe-widget")).toBeHidden();
  await page.locator(".faq-item summary").first().click();
  await expect(page.locator(".faq-answer").first()).toBeVisible();
  assert.equal(
    await page
      .locator(".info-content")
      .evaluate((el) => getComputedStyle(el).maxHeight),
    "none",
  );
  await noJs.close();
  await fs.writeFile(
    `${dir}/qa-results.json`,
    JSON.stringify(
      {
        passed: true,
        checks: results,
        noJavaScript: true,
        verifiedAt: new Date().toISOString(),
      },
      null,
      2,
    ),
  );
  console.log(
    `PASS: ${plans.length} plans × ${cycles.length} cycles × 6 viewports; 38 asset hashes; interactions, no-JS, axe and overflow.`,
  );
} finally {
  await browser.close();
}
