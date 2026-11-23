import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { createRequire } from "node:module";
import ts from "typescript";
import { parseDocument, DomUtils } from "htmlparser2";
import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const require = createRequire(import.meta.url);
async function load(file, mocks = {}) {
  const exported = {};
  new Function(
    "exports",
    "require",
    ts.transpileModule(await fs.readFile(file, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS },
    }).outputText,
  )(exported, (name) => (name in mocks ? mocks[name] : require(name)));
  return exported;
}
const promotionData = await load("src/data/promotions.ts");
const { chooseBlogPromotionPlacement: choose, splitBlogPromotionBody: split } =
  await load("src/lib/blog-promotion.ts", {
    "server-only": {},
    "next/server": { connection: async () => {} },
    "@/data/promotions": promotionData,
  });
for (const [random, expected] of [
  [0, "early"],
  [0.59999, "early"],
  [0.6, "middle"],
  [0.89999, "middle"],
  [0.9, "end"],
  [1, "end"],
])
  assert.equal(choose(random), expected);
const counts = { early: 0, middle: 0, end: 0 };
for (let index = 0; index < 1000; index++)
  counts[choose((index + 0.5) / 1000)]++;
assert.deepEqual(counts, { early: 600, middle: 300, end: 100 });
for (let index = 0; index < 1000; index++)
  assert.notEqual(choose(index / 1000, false), "middle");
const paragraph = "Source paragraph. ".repeat(35);
const source = `<h2 id="one">One</h2><p>${paragraph}</p><table><tr><td>Cell</td></tr></table><h2 id="two">Two</h2><p>${paragraph}</p><pre><code>keep();</code></pre><section data-article-section="conclusion"><h2 id="end">Conclusion</h2><p>${paragraph}</p></section>`;
const parts = split(source);
assert(parts);
const serialize = (html) => DomUtils.getOuterHTML(parseDocument(html));
assert.equal(parts.before + parts.after, serialize(source));
assert(parts.after.startsWith("<h2") || parts.after.startsWith("<section"));
assert(!/^.*<h[2-6][^>]*>[^<]*<\/h[2-6]>$/.test(parts.before));
for (const value of ["", "<p>Short post</p>", `<div>${source}</div>`])
  assert.equal(split(value), null);
const protectedBlocks = `<p>${paragraph}</p><div data-article-cta="deals"><h2>Offer</h2><p>${paragraph}</p></div>`;
assert.equal(split(protectedBlocks), null);
assert.equal(
  split(
    `<div data-article-cta="deals"><p>${paragraph}</p></div><h2>Section</h2><p>${paragraph}</p>`,
  ),
  null,
);
console.log(
  "Passed weighted boundaries/distribution, short-post fallback, source HTML preservation and safe section splitting.",
);

const base = process.env.QA_BASE_URL || "http://localhost:3100";
const directory = "artifacts/blog-promotions";
await fs.mkdir(directory, { recursive: true });
const browser = await chromium.launch({
  ...(process.platform === "win32" ? { channel: "msedge" } : {}),
});
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  // Stub the configured analytics container; do not send QA events to analytics.
  await context.route("**/*googletagmanager.com/**", (route) =>
    route.fulfill({ status: 200, body: "" }),
  );
  const articlePath = "/blog/cach-va-php-tren-aapanel-directadmin-cloudpanel/";
  for (const path of [
    "/blog/",
    "/blog/?page=2",
    "/blog/?q=VPS",
    "/blog/?category=tuyen-dung",
    articlePath,
  ]) {
    assert.equal((await page.goto(`${base}${path}`)).status(), 200);
    const banner = page.locator("[data-blog-promotion]");
    await expect(banner).toHaveCount(1);
    await expect(banner.locator("a")).toHaveAttribute("href", "/blackfriday/");
    const artwork = banner.locator("img");
    assert.equal(
      new URL(await artwork.getAttribute("src"), base).pathname,
      "/images/promotion/black-friday-2026-studio-flash-sale-no-tagline.webp",
    );
    await expect(artwork).toHaveAttribute("alt", /Tiết kiệm 99%.*ly sứ/);
    await expect(artwork).not.toHaveAttribute("alt", /ƯU ĐÃI LỚN NHẤT NĂM/);
    await expect(
      banner.getByText("ƯU ĐÃI LỚN NHẤT NĂM", { exact: true }),
    ).toHaveCount(0);
    const placement = await banner.getAttribute("data-blog-promotion");
    assert.match(placement, /^(article|listing)-(early|middle|end)$/);
    assert(await banner.evaluate((el) => !!el.closest("main")));
    if (path === articlePath) {
      assert(await banner.evaluate((el) => !!el.closest("article")));
      if (placement === "article-middle")
        assert(
          await banner.evaluate((el) => !!el.closest("[data-article-body]")),
        );
      const headings = await page.locator("[data-article-body] h2").count();
      assert.equal(
        headings,
        await page.locator('aside nav[aria-label="Mục lục"] a').count(),
      );
    }
  }
  // Verify production HTML varies between requests, rather than sharing a cached choice.
  for (const path of ["/blog/?page=1", articlePath]) {
    const placements = new Set();
    for (let index = 0; index < 18; index++) {
      const html = await (await fetch(`${base}${path}`)).text();
      const ads = [
        ...html.matchAll(/<aside[^>]*data-blog-promotion="([^"]+)"/g),
      ];
      assert.equal(ads.length, 1);
      placements.add(ads[0][1]);
    }
    assert(placements.size > 1, `Per-request placement must vary: ${path}`);
    console.log(path, [...placements]);
  }
  const banner = page.locator("[data-blog-promotion]");
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await banner.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        banner
          .locator("img")
          .evaluate((img) => img.complete && img.naturalWidth > 0),
      )
      .toBe(true);
    const image = await banner.locator("img").boundingBox();
    assert(Math.abs(image.width / image.height - 2172 / 464) < 0.05);
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    const a11y = await new AxeBuilder({ page })
      .include("[data-blog-promotion]")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    assert.deepEqual(a11y.violations, []);
    if ([390, 1440].includes(width))
      await page.screenshot({ path: `${directory}/${width}.png` });
  }
  // Impressions require one continuous visible second, and fire only once.
  await page.reload();
  await expect(page.locator("article[aria-label]")).toBeVisible();
  await page.evaluate(() => (window.dataLayer = []));
  const views = () =>
    page.evaluate(() =>
      (window.dataLayer || []).filter(
        (item) => item.event === "view_promotion",
      ),
    );
  assert.equal((await views()).length, 0);
  await banner.scrollIntoViewIfNeeded();
  await expect.poll(async () => (await views()).length).toBe(1);
  await page.evaluate(() => scrollTo(0, 0));
  await banner.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  assert.equal((await views()).length, 1);
  const viewEvent = (await views())[0];
  assert.equal(
    viewEvent.ecommerce.creative_name,
    "studio-flash-sale-no-tagline",
  );
  assert.equal(
    viewEvent.ecommerce.creative_slot,
    `blog_${(await banner.getAttribute("data-blog-promotion")).replace("-", "_")}`,
  );
  assert.equal(viewEvent.page_path, articlePath);
  // Prevent navigation only in QA, to inspect the real native click handler.
  await banner
    .locator("a")
    .evaluate((el) =>
      el.addEventListener("click", (event) => event.preventDefault()),
    );
  await banner.locator("a").click();
  const clicks = await page.evaluate(() =>
    window.dataLayer.filter((item) => item.event === "select_promotion"),
  );
  assert.equal(clicks.length, 1);
  assert.equal(
    clicks[0].ecommerce.creative_name,
    viewEvent.ecommerce.creative_name,
  );
  assert.equal(
    clicks[0].ecommerce.creative_slot,
    viewEvent.ecommerce.creative_slot,
  );
  for (const path of ["/", "/swed-day/", "/lien-he/"]) {
    await page.goto(`${base}${path}`);
    await expect(banner).toHaveCount(0);
  }
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  await noJs.route("**/*googletagmanager.com/**", (route) =>
    route.fulfill({ status: 200, body: "" }),
  );
  const plain = await noJs.newPage();
  await plain.goto(`${base}${articlePath}`);
  await expect(plain.locator("[data-blog-promotion]")).toHaveCount(1);
  await expect(
    plain
      .locator("[data-blog-promotion]")
      .getByText("ƯU ĐÃI LỚN NHẤT NĂM", { exact: true }),
  ).toHaveCount(0);
  await expect(plain.locator("[data-blog-promotion] a")).toHaveAttribute(
    "href",
    "/blackfriday/",
  );
  assert.deepEqual(errors, []);
  console.log(
    "Passed blog-only scope, one banner/page, production randomization, no-JS markup, safe article/TOC, tracking, 6 responsive widths and WCAG A/AA.",
  );
} finally {
  await browser.close();
}
