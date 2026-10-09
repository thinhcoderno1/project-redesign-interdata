import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
import ts from "typescript";

const base = process.env.TEST_BASE_URL || "http://localhost:3100";
const content = await fs.readFile("src/data/content.ts", "utf8");
const literal = content.match(/export const press = (\[[\s\S]*?\n\]);/)[1];
const { outputText } = ts.transpileModule(`export default ${literal}`, {
  compilerOptions: { module: ts.ModuleKind.ESNext },
});
const { default: expected } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);
await fs.mkdir("artifacts/press-slide", { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
try {
  for (const width of [320, 390, 640, 768, 1024, 1440, 1920]) {
    const perSlide = width < 640 ? 1 : width < 960 ? 2 : 3;
    const pageCount = Math.ceil(expected.length / perSlide);
    const context = await browser.newContext({
      viewport: { width, height: 1100 },
      reducedMotion: width === 1440 ? "no-preference" : "reduce",
      hasTouch: width < 640,
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("response", (response) => {
      if (response.url().startsWith(base) && response.status() >= 400)
        errors.push(`${response.status()} ${response.url()}`);
    });
    await page.goto(base, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const section = page.locator("#bao-chi");
    const track = section.locator("#press-track");
    const slides = track.locator(':scope > [aria-roledescription="slide"]');
    const cards = track.locator("article");
    const dots = section
      .getByRole("group", { name: "Chọn slide báo chí" })
      .locator("button");
    const previous = section.getByRole("button", {
      name: "Slide báo chí trước",
      exact: true,
    });
    const next = section.getByRole("button", {
      name: "Slide báo chí tiếp theo",
      exact: true,
    });
    await expect(dots).toHaveCount(pageCount);
    await expect(slides).toHaveCount(pageCount);
    await expect(cards).toHaveCount(expected.length);
    expect(await cards.locator("h3").allTextContents()).toEqual(
      expected.map((item) => item.title),
    );
    expect(
      await cards
        .locator("a")
        .evaluateAll((links) => links.map((link) => link.getAttribute("href"))),
    ).toEqual(expected.map((item) => item.href));

    async function selected(index) {
      await expect(dots.nth(index)).toHaveAttribute("aria-current", "true");
      await expect
        .poll(() =>
          track.evaluate((viewport) => {
            const current = viewport.parentElement.querySelector(
              'button[aria-current="true"]',
            );
            const buttons = [...current.parentElement.children];
            const slide = viewport.children[buttons.indexOf(current)];
            return Math.abs(
              slide.getBoundingClientRect().left -
                viewport.getBoundingClientRect().left,
            );
          }),
        )
        .toBeLessThan(2);
    }
    await selected(0);
    await expect(previous).toBeDisabled();
    await next.click();
    await selected(1);
    await previous.click();
    await selected(0);
    for (let index = 0; index < pageCount; index++) {
      await dots.nth(index).click();
      await selected(index);
      await expect(slides.nth(index).locator("article")).toHaveCount(
        Math.min(perSlide, expected.length - index * perSlide),
      );
      for (const image of await slides.nth(index).locator("img").all()) {
        await image.scrollIntoViewIfNeeded();
        await expect
          .poll(() =>
            image.evaluate((img) => img.complete && img.naturalWidth > 0),
          )
          .toBe(true);
      }
      const clipped = await slides
        .nth(index)
        .locator("h3")
        .evaluateAll((headings) =>
          headings
            .filter(
              (h) =>
                h.scrollWidth > h.clientWidth ||
                h.scrollHeight > h.clientHeight,
            )
            .map((h) => h.textContent),
        );
      expect(clipped).toEqual([]);
    }
    await expect(next).toBeDisabled();
    await track.focus();
    await page.keyboard.press("Home");
    await selected(0);
    await page.keyboard.press("ArrowRight");
    await selected(1);
    await page.keyboard.press("ArrowLeft");
    await selected(0);
    await page.keyboard.press("End");
    await selected(pageCount - 1);
    await page.keyboard.press("Home");
    await selected(0);
    await track.evaluate((viewport) =>
      window.scrollTo(
        0,
        viewport.getBoundingClientRect().top + window.scrollY - 170,
      ),
    );
    const box = await track.boundingBox();
    const url = page.url();
    // Drag starts on a linked image; it must move the slide without opening the article.
    await page.mouse.move(box.x + box.width * 0.88, box.y + 60);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.12, box.y + 60, { steps: 14 });
    await page.mouse.up();
    await selected(1);
    expect(page.url()).toBe(url);
    if (width === 390) {
      const session = await context.newCDPSession(page);
      const touchBox = await track.boundingBox();
      const x = touchBox.x + touchBox.width * 0.88;
      const y = touchBox.y + 60;
      await session.send("Input.dispatchTouchEvent", {
        type: "touchStart",
        touchPoints: [{ x, y }],
      });
      for (let step = 1; step <= 16; step++) {
        await session.send("Input.dispatchTouchEvent", {
          type: "touchMove",
          touchPoints: [{ x: x - (touchBox.width * 0.76 * step) / 16, y }],
        });
        await page.waitForTimeout(20);
      }
      await session.send("Input.dispatchTouchEvent", {
        type: "touchEnd",
        touchPoints: [],
      });
      await selected(2);
      expect(page.url()).toBe(url);
      await session.detach();
    }
    if (width === 1440) {
      await dots.nth(3).click();
      await selected(3);
      await page.setViewportSize({ width: 390, height: 1100 });
      await expect(dots).toHaveCount(expected.length);
      await selected(9);
      await page.setViewportSize({ width: 768, height: 1100 });
      await expect(dots).toHaveCount(Math.ceil(expected.length / 2));
      await selected(4);
      await page.setViewportSize({ width, height: 1100 });
      await expect(dots).toHaveCount(pageCount);
      await selected(2);
    }
    await dots.first().click();
    await selected(0);
    await track.focus();
    await page.keyboard.press("Tab");
    await expect(cards.first().locator("a")).toBeFocused();
    await expect
      .poll(() =>
        cards.first().evaluate((card) => getComputedStyle(card).borderTopColor),
      )
      .toBe("rgb(0, 67, 236)");
    const colors = await cards.first().evaluate((card) => ({
      focus: getComputedStyle(card.querySelector("a")).outlineColor,
      cta: getComputedStyle(card.querySelector("h3 + span")).color,
      border: getComputedStyle(card).borderTopColor,
    }));
    expect(colors.focus).toBe("rgb(0, 67, 236)");
    expect(colors.cta).toBe("rgb(0, 67, 236)");
    expect(colors.border).toBe("rgb(0, 67, 236)");
    const audit = await new AxeBuilder({ page })
      .include("#bao-chi")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(audit.violations).toEqual([]);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    const smallTargets = await section
      .locator("button")
      .evaluateAll((buttons) =>
        buttons
          .filter((b) => {
            const r = b.getBoundingClientRect();
            return r.width < 24 || r.height < 24;
          })
          .map((b) => b.getAttribute("aria-label")),
      );
    expect(smallTargets).toEqual([]);
    const initialScroll = await track.evaluate(
      (viewport) => viewport.scrollLeft,
    );
    await page.waitForTimeout(600);
    expect(await track.evaluate((viewport) => viewport.scrollLeft)).toBe(
      initialScroll,
    );
    if (width === 390 || width === 1440) {
      await cards
        .first()
        .locator("a")
        .evaluate((link) => link.blur());
      await section.evaluate((s) => window.scrollTo(0, s.offsetTop - 145));
      await page.screenshot({
        path: `artifacts/press-slide/section-${width}.png`,
      });
    }
    expect(errors).toEqual([]);
    results.push({
      width,
      perSlide,
      pageCount,
      cards: expected.length,
      errors,
      accessibilityViolations: audit.violations.length,
      interactions: "passed",
    });
    await context.close();
  }

  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 1100 },
  });
  const page = await context.newPage();
  await page.goto(base, { waitUntil: "networkidle" });
  const track = page.locator("#press-track");
  await expect(track.locator("article")).toHaveCount(expected.length);
  await track.evaluate((viewport) => {
    viewport.scrollLeft = viewport.scrollWidth;
  });
  expect(
    await track.evaluate((viewport) => viewport.scrollLeft),
  ).toBeGreaterThan(0);
  const last = track.locator("article").last().locator("a");
  await expect(last).toHaveAttribute("href", expected.at(-1).href);
  await expect(
    page.getByRole("button", { name: "Slide báo chí tiếp theo", exact: true }),
  ).not.toBeVisible();
  await context.close();

  const linkPage = await browser.newPage();
  await linkPage.route(expected[0].href, (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<title>Article link verified</title>",
    }),
  );
  await linkPage.goto(base, { waitUntil: "networkidle" });
  await linkPage.locator("#bao-chi article a").first().click();
  await expect(linkPage).toHaveURL(expected[0].href);
  await linkPage.close();
} finally {
  await browser.close();
  await fs.writeFile(
    "artifacts/press-slide/qa-results.json",
    JSON.stringify(results, null, 2),
  );
}
console.log(
  JSON.stringify(
    { results, noJavaScript: "passed", normalArticleClick: "passed" },
    null,
    2,
  ),
);
