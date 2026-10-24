import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

expect.configure({ timeout: 20000 });

const baseUrl = process.env.QA_BASE_URL || "http://localhost:3100";
const apiUrl = "https://interdata.vn/blog/wp-json/wp/v2/";
async function api(path) {
  const response = await fetch(`${apiUrl}${path}`, {
    signal: AbortSignal.timeout(15000),
  });
  assert.ok(response.ok);
  return response.json();
}
const [careerCategory] = await api("categories?slug=tuyen-dung&_fields=id");
const careerPosts = await api(
  `posts?categories=${careerCategory.id}&per_page=12&_fields=id`,
);
await fs.mkdir("artifacts/blog", { recursive: true });
const browser = await chromium.launch({
  ...(process.platform === "win32" ? { channel: "msedge" } : {}),
});
const context = await browser.newContext();
const page = await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
const overflow = () =>
  page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
const results = [];
try {
  await page.setViewportSize({ width: 1440, height: 1000 });
  assert.equal(
    (
      await page.goto(`${baseUrl}/blog/`, { waitUntil: "domcontentloaded" })
    ).status(),
    200,
  );
  await expect(page.locator("main h1")).toHaveCount(1);
  for (const id of [
    "latest-title",
    "popular-title",
    "news-title",
    "promotions-title",
    "careers-title",
  ])
    await expect(page.locator(`#${id}`)).toBeVisible();
  await expect(page.locator("#careers article")).toHaveCount(
    Math.min(3, careerPosts.length),
  );
  await expect(
    page.locator("main article").first().locator("a").first(),
  ).toHaveAttribute("href", /^\/blog\/[^/]+\/$/);
  const postHref = "/blog/cach-va-php-tren-aapanel-directadmin-cloudpanel/";
  await page.locator("main details summary").click();
  assert.ok(
    (await page
      .locator("main nav[aria-label='Chuyên mục bài viết'] a")
      .count()) > 20,
  );
  const indexAxe = await new AxeBuilder({ page })
    .include("main")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  assert.deepEqual(
    indexAxe.violations.map(({ id, nodes }) => ({
      id,
      elements: nodes.map((node) => node.target),
    })),
    [],
  );
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    assert.equal(await overflow(), false, `Index overflow ${width}`);
    results.push({ route: "index", width, overflow: false });
    if ([390, 1440].includes(width)) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: `artifacts/blog/index-${width}.png` });
    }
  }
  await page.getByLabel("Tìm kiếm bài viết", { exact: true }).fill("VPS");
  await Promise.all([
    page.waitForURL(/q=VPS/),
    page.getByRole("button", { name: "Tìm kiếm" }).click(),
  ]);
  await expect(page.locator("#results-title")).toContainText("VPS");
  await expect(page.locator("main article")).toHaveCount(12);
  await page
    .locator(
      "main nav[aria-label='Chuyên mục bài viết'] a[href*='category=vps']",
    )
    .click();
  await expect(page).toHaveURL(/q=VPS&category=vps/);
  await expect(page.locator("#results-title")).toContainText("VPS");
  const firstIds = await page
    .locator("main article")
    .evaluateAll((nodes) => nodes.map((node) => node.dataset.postId));
  await page
    .getByRole("link", { name: "Trang tiếp theo", exact: true })
    .click();
  await expect(page).toHaveURL(/page=2/);
  const secondIds = await page
    .locator("main article")
    .evaluateAll((nodes) => nodes.map((node) => node.dataset.postId));
  assert.ok(
    !secondIds.some((id) => firstIds.includes(id)),
    "Pagination must load different API posts",
  );
  await page.goto(`${baseUrl}/blog/?q=zzq-no-result-9927`, {
    waitUntil: "domcontentloaded",
  });
  await expect(page.locator("main h3")).toHaveText("Chưa có bài viết phù hợp");
  await page.goto(`${baseUrl}/blog/?category=tuyen-dung`, {
    waitUntil: "domcontentloaded",
  });
  await expect(page.locator("main article")).toHaveCount(careerPosts.length);
  assert.deepEqual(
    await page
      .locator("main article")
      .evaluateAll((nodes) => nodes.map((node) => Number(node.dataset.postId))),
    careerPosts.map((post) => post.id),
  );
  await page.goto(`${baseUrl}/blog/tuyen-dung/`, {
    waitUntil: "domcontentloaded",
  });
  await expect(page).toHaveURL(/\/blog\/\?category=tuyen-dung/);
  await page.setViewportSize({ width: 1440, height: 1000 });
  assert.equal(
    (
      await page.goto(`${baseUrl}${postHref}`, {
        waitUntil: "domcontentloaded",
      })
    ).status(),
    200,
  );
  await expect(page.locator("main h1")).toHaveCount(1);
  assert.ok((await page.locator("article h2").count()) > 2);
  const toc = page.locator('aside nav[aria-label="Mục lục"] a');
  assert.ok((await toc.count()) > 2);
  assert.equal(
    await toc.count(),
    await page.locator("article [data-article-body] h2").count(),
  );
  await expect(page.locator('aside nav[aria-label="Mục lục"]')).toHaveCount(1);
  await expect(page.locator('article nav[aria-label="Mục lục"]')).toHaveCount(
    0,
  );
  await expect(page.locator("main > header img")).toHaveCount(0);
  await expect(page.locator("aside > :first-child")).toHaveAttribute(
    "aria-label",
    "Mục lục",
  );
  await expect(page.locator('article [data-article-cta="vps"]')).toHaveCount(1);
  await expect(page.locator('article [data-article-cta="cloud"]')).toHaveCount(
    1,
  );
  await expect(page.locator('article [data-article-cta="deals"]')).toHaveCount(
    1,
  );
  await expect(
    page.locator('article [data-article-section="faq"]'),
  ).toHaveCount(1);
  const sourceArticle = await api(
    `posts?slug=${postHref.split("/").filter(Boolean).at(-1)}&_fields=content`,
  );
  const { parseDocument, DomUtils } = await import("htmlparser2");
  const original = parseDocument(sourceArticle[0].content.rendered);
  for (const element of DomUtils.findAll(
    (node) =>
      node.attribs.id === "ez-toc-container" ||
      node.name === "script" ||
      node.name === "style",
    original.children,
  ))
    DomUtils.removeElement(element);
  const originalParagraphs = DomUtils.findAll(
    (node) => node.name === "p",
    original.children,
  )
    .map((node) => DomUtils.textContent(node).replace(/\s+/g, " ").trim())
    .filter((text) => text && text !== "NỘI DUNG BÀI VIẾT");
  const renderedParagraphs = await page
    .locator('article[aria-label="Nội dung bài viết"] p')
    .allTextContents();
  for (const paragraph of originalParagraphs)
    assert.ok(
      renderedParagraphs.some(
        (text) => text.replace(/\s+/g, " ").trim() === paragraph,
      ),
      `Original paragraph retained: ${paragraph.slice(0, 70)}`,
    );
  const sourceHtml = await page.locator("[data-article-body]").innerHTML();
  assert.ok(!sourceHtml.includes("<!--"));
  for (const href of await toc.evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute("href")),
  ))
    assert.ok(
      (await page.locator(`[id=${JSON.stringify(href.slice(1))}]`).count()) > 0,
    );
  JSON.parse(
    await page.locator('main script[type="application/ld+json"]').textContent(),
  );
  assert.equal(
    await page
      .locator("article script, article [onclick], article [onerror]")
      .count(),
    0,
  );
  const postAxe = await new AxeBuilder({ page })
    .include("main")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  assert.deepEqual(
    postAxe.violations.map(({ id, nodes }) => ({
      id,
      elements: nodes.map((node) => node.target),
    })),
    [],
  );
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.evaluate(() => window.scrollTo(0, 0));
    const sidebar = await page.locator("main aside").boundingBox();
    const article = await page
      .locator('article[aria-label="Nội dung bài viết"]')
      .boundingBox();
    if (width >= 960)
      assert.ok(
        sidebar.x + sidebar.width <= article.x,
        `Left sidebar at ${width}px`,
      );
    else
      assert.ok(
        sidebar.y + sidebar.height <= article.y,
        `Sidebar above article at ${width}px`,
      );
    assert.equal(await overflow(), false, `Post overflow ${width}`);
    results.push({ route: "post", width, overflow: false });
    if ([390, 1440].includes(width))
      await page.screenshot({ path: `artifacts/blog/post-${width}.png` });
  }
  const missing = await page.goto(`${baseUrl}/blog/no-such-post-9927/`, {
    waitUntil: "domcontentloaded",
  });
  // Next.js can send a 200 shell before notFound() resolves during streaming.
  assert.ok([200, 404].includes(missing.status()));
  await expect(page.locator("main h1")).toHaveText("Không tìm thấy bài viết");
  await expect(
    page.locator('meta[name="robots"][content*="noindex"]').first(),
  ).toBeAttached();
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await noJs.newPage();
  await staticPage.goto(`${baseUrl}/blog/?category=tuyen-dung`, {
    waitUntil: "domcontentloaded",
  });
  await expect(staticPage.locator("main article")).toHaveCount(
    careerPosts.length,
  );
  await noJs.close();
  assert.deepEqual(errors, []);
  await fs.writeFile(
    "artifacts/blog/verification.json",
    JSON.stringify({ results, accessibility: "passed", errors }, null, 2),
  );
  console.log(
    "Blog UI: live posts, search, categories, pagination, legacy links, TOC, JSON-LD, 404, no-JS, responsive layout and accessibility passed.",
  );
} finally {
  await context.close();
  await browser.close();
}
