import { chromium, expect } from "@playwright/test";
import fs from "node:fs/promises";

const base = process.env.TEST_BASE_URL || "http://localhost:3100";
const browser = await chromium.launch();
const results = [];
await fs.mkdir("artifacts", { recursive: true });

const settle = (page) =>
  page.evaluate(
    () =>
      new Promise((resolve) => {
        let remaining = 5;
        const next = () =>
          --remaining ? requestAnimationFrame(next) : resolve();
        requestAnimationFrame(next);
      }),
  );
const scroll = async (page, y) => {
  await page.evaluate((top) => window.scrollTo(0, Math.max(0, top)), y);
  await settle(page);
};
const measure = (page, selector) =>
  page.locator(selector).evaluate((section) => {
    const rect = (element) => element.getBoundingClientRect().toJSON();
    return {
      scrollY,
      section: rect(section),
      photo: rect(section.querySelector("img")),
      content: rect(section.querySelector(".hero-content, .infra-content")),
    };
  });
const covered = ({ section, photo }) => {
  expect(photo.top).toBeLessThanOrEqual(section.top + 1);
  expect(photo.bottom).toBeGreaterThanOrEqual(section.bottom - 1);
  expect(photo.left).toBeLessThanOrEqual(section.left + 1);
  expect(photo.right).toBeGreaterThanOrEqual(section.right - 1);
};
const content = (page) =>
  page.evaluate(() => ({
    text: document.body.innerText,
    links: [...document.querySelectorAll("a")].map((a) =>
      a.getAttribute("href"),
    ),
    heights: [...document.querySelectorAll("main > section")].map(
      (s) => s.getBoundingClientRect().height,
    ),
  }));

try {
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    const context = await browser.newContext({
      viewport: { width, height: 960 },
      reducedMotion: "no-preference",
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(base, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = "auto";
    });
    const original = await content(page);
    const motions = [];
    for (const selector of [".hero", "#ha-tang"]) {
      const position = await page.locator(selector).evaluate((s) => ({
        top: s.getBoundingClientRect().top + scrollY,
        height: s.getBoundingClientRect().height,
      }));
      const start = selector === ".hero" ? 0 : position.top - 480;
      await scroll(page, start);
      await page.locator(`${selector} img`).evaluate((img) => img.decode());
      const before = await measure(page, selector);
      await scroll(page, start + 180);
      const after = await measure(page, selector);
      covered(before);
      covered(after);
      const sectionDelta = after.section.top - before.section.top;
      const photoDelta = after.photo.top - before.photo.top;
      expect(photoDelta).toBeGreaterThan(sectionDelta + 1);
      expect(photoDelta).toBeLessThan(0);
      expect(after.content.top - before.content.top).toBeCloseTo(
        sectionDelta,
        1,
      );
      motions.push({ selector, sectionDelta, photoDelta });
      for (const y of [
        position.top - 958,
        position.top,
        position.top + position.height - 2,
      ]) {
        await scroll(page, y);
        covered(await measure(page, selector));
      }
    }
    await page.emulateMedia({ reducedMotion: "reduce" });
    await settle(page);
    for (const selector of [".hero", "#ha-tang"]) {
      const value = await measure(page, selector);
      expect(value.photo).toEqual(value.section);
      await expect(page.locator(`${selector} .parallax-background`)).toHaveCSS(
        "transform",
        "none",
      );
    }
    expect(await content(page)).toEqual(original);
    await scroll(page, 0);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await settle(page);
    const before = await measure(page, ".hero");
    await scroll(page, 180);
    const after = await measure(page, ".hero");
    expect(after.photo.top - before.photo.top).toBeGreaterThan(
      after.section.top - before.section.top + 1,
    );
    if (width === 1440) {
      await page.setViewportSize({ width: 390, height: 844 });
      await settle(page);
      covered(await measure(page, ".hero"));
      await page.setViewportSize({ width, height: 960 });
      await settle(page);
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    expect(errors).toEqual([]);
    await scroll(page, 0);
    await page.screenshot({ path: `artifacts/parallax-${width}-hero.png` });
    await page.locator("#ha-tang").scrollIntoViewIfNeeded();
    await settle(page);
    await page
      .locator("#ha-tang")
      .screenshot({ path: `artifacts/parallax-${width}-infrastructure.png` });
    results.push({
      width,
      motions,
      reducedMotion: "passed",
      resumedMotion: "passed",
      errors,
    });
    await context.close();
  }
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(base, { waitUntil: "networkidle" });
  for (const selector of [".hero", "#ha-tang"]) {
    const value = await measure(page, selector);
    expect(value.photo).toEqual(value.section);
    await expect(page.locator(`${selector} .parallax-background`)).toHaveCSS(
      "transform",
      "none",
    );
  }
  results.push({ javaScriptDisabled: "static backgrounds passed" });
  await context.close();
} finally {
  await fs.writeFile(
    "artifacts/parallax-results.json",
    JSON.stringify(results, null, 2),
  );
  await browser.close();
}
console.log(
  "Parallax passed: 320–1920px, photo coverage, static content, reduced motion toggle, resize and no-JavaScript fallback.",
);
