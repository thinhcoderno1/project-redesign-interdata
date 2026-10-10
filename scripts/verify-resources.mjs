import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const baseUrl = process.env.QA_BASE_URL || "http://localhost:3100";
const apiUrl = "https://interdata.vn/blog/wp-json/wp/v2/";
const names = ["Tin Tức - Sự Kiện", "Blog", "Khuyến Mãi", "Tuyển Dụng"];
const topics = ["news", "blog", "promotion", "careers"];
const slugs = ["su-kien", "khuyen-mai", "tuyen-dung"];
await fs.mkdir("artifacts/resources", { recursive: true });
async function getJson(path) {
  const response = await fetch(`${apiUrl}${path}`, {
    signal: AbortSignal.timeout(15000),
  });
  assert.ok(response.ok, `API ${path}: ${response.status}`);
  return response.json();
}
const categories = await getJson(
  "categories?per_page=100&_fields=id,slug,parent",
);
const ids = slugs.map(
  (slug) => categories.find((category) => category.slug === slug)?.id,
);
assert.ok(ids.every(Boolean));
const filters = [
  { categories: ids[0] },
  { categories_exclude: ids.join(",") },
  { categories: ids[1] },
  { categories: ids[2] },
];
const posts = await Promise.all(
  filters.map((filter) =>
    getJson(
      `posts?${new URLSearchParams({
        per_page: "4",
        order: "desc",
        orderby: "date",
        status: "publish",
        _fields: "id,link,date_gmt,categories",
        ...filter,
      })}`,
    ),
  ),
);

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
const results = [];
const screenshotStyle =
  ".site-header, body > nav, .skip-link, nextjs-portal {visibility:hidden!important;}";
try {
  for (const width of [320, 390, 640, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1100 });
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const section = page.locator("#tai-nguyen");
    await section.scrollIntoViewIfNeeded();
    const tabs = section.getByRole("tab");
    await expect(tabs).toHaveText(names);
    const counts = [];
    for (let i = 0; i < 4; i++) {
      await tabs.nth(i).click();
      await expect(tabs.nth(i)).toHaveAttribute("aria-selected", "true");
      await expect(section.getByRole("tabpanel")).toHaveCount(1);
      const panel = section.getByRole("tabpanel");
      await expect(panel).toHaveAttribute("id", `resource-panel-${topics[i]}`);
      await expect(panel).toHaveAttribute(
        "aria-labelledby",
        `resource-tab-${topics[i]}`,
      );
      const cards = panel.locator("article");
      const actual = await cards.evaluateAll((cards) =>
        cards.map((card) => ({
          id: Number(card.dataset.postId),
          href: card.querySelector("a").href,
        })),
      );
      assert.deepEqual(
        actual,
        posts[i].map((post) => ({ id: post.id, href: post.link })),
        `Latest API posts at ${width}px/${topics[i]}`,
      );
      const dates = await panel
        .locator("time")
        .evaluateAll((dates) => dates.map((date) => Date.parse(date.dateTime)));
      assert.ok(
        dates.every((date, index) => index === 0 || date <= dates[index - 1]),
      );
      for (const image of await panel.locator("img").all()) {
        await image.scrollIntoViewIfNeeded();
        await image.evaluate((image) => image.decode());
        assert.ok(
          await image.evaluate(
            (image) => image.complete && image.naturalWidth > 0,
          ),
        );
      }
      for (const link of await panel.getByRole("link").all())
        await link.click({ trial: true });
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
      );
      counts.push(actual.length);
      if ([390, 768, 1440].includes(width)) {
        const height = await section.evaluate((el) =>
          Math.ceil(el.getBoundingClientRect().height),
        );
        await page.setViewportSize({
          width,
          height: Math.max(1100, height + 300),
        });
        await section.scrollIntoViewIfNeeded();
        await page.mouse.move(0, 0);
        await section.screenshot({
          path: `artifacts/resources/${topics[i]}-${width}.png`,
          style: screenshotStyle,
        });
        await page.setViewportSize({ width, height: 1100 });
      }
      if ([390, 1440].includes(width)) {
        const axe = await new AxeBuilder({ page })
          .include("#tai-nguyen")
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
          .analyze();
        assert.deepEqual(
          axe.violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => n.target),
          })),
          [],
        );
      }
    }
    await tabs.first().focus();
    await page.keyboard.press("End");
    await expect(tabs.last()).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect(tabs.first()).toBeFocused();
    await page.keyboard.press("ArrowLeft");
    await expect(tabs.last()).toBeFocused();
    await page.keyboard.press("Home");
    await expect(tabs.first()).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    results.push({
      width,
      counts,
      latestApiMatches: true,
      keyboard: true,
      noOverflow: true,
    });
  }
  const nojsContext = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 1100 },
  });
  const nojs = await nojsContext.newPage();
  await nojs.goto(baseUrl, { waitUntil: "networkidle" });
  await expect(nojs.locator("#tai-nguyen").getByRole("tab")).toHaveCount(0);
  await expect(nojs.locator("#tai-nguyen").getByRole("tabpanel")).toHaveCount(
    4,
  );
  for (let i = 0; i < 4; i++) {
    const panel = nojs.locator(`#resource-panel-${topics[i]}`);
    await expect(panel).toBeVisible();
    await expect(panel.locator("article")).toHaveCount(posts[i].length);
    assert.deepEqual(
      await panel
        .locator("article > a")
        .evaluateAll((links) => links.map((link) => link.href)),
      posts[i].map((post) => post.link),
    );
  }
  const imageSource = await page
    .locator('#resource-panel-news article [data-topic="news"] img')
    .first()
    .getAttribute("src");
  const targetImage = new URL(imageSource, baseUrl).searchParams.get("url");
  const brokenContext = await browser.newContext({
    viewport: { width: 1440, height: 1100 },
  });
  await brokenContext.route("**/_next/image?**", (route) =>
    new URL(route.request().url()).searchParams.get("url") === targetImage
      ? route.abort()
      : route.continue(),
  );
  const broken = await brokenContext.newPage();
  await broken.goto(baseUrl, { waitUntil: "networkidle" });
  const firstCard = broken.locator("#resource-panel-news article").first();
  await firstCard.scrollIntoViewIfNeeded();
  await expect(firstCard.locator('[data-topic="news"]')).toHaveText(
    "InterData",
  );
  await expect(firstCard.getByRole("link")).toHaveAttribute(
    "href",
    posts[0][0].link,
  );
  await expect(broken.locator("#resource-panel-news article")).toHaveCount(
    posts[0].length,
  );
  assert.deepEqual(errors, []);
  const report = {
    results,
    axeWidths: [390, 1440],
    noJavaScript: true,
    imageFailure: true,
    pageErrors: errors,
  };
  await fs.writeFile(
    "artifacts/resources/qa-results.json",
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report));
} finally {
  await browser.close();
}
