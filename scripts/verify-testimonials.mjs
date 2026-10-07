import { chromium, expect } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import ts from "typescript";

const base = process.env.TEST_BASE_URL || "http://localhost:3100";
await fs.mkdir("artifacts", { recursive: true });
const source = await fs.readFile("src/data/content.ts", "utf8");
const literal = source.match(
  /export const testimonials = (\[[\s\S]*?\n\]);/,
)[1];
const { outputText } = ts.transpileModule(`export default ${literal}`, {
  compilerOptions: { module: ts.ModuleKind.ESNext },
});
const { default: expected } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);
expect(expected).toHaveLength(8);

// When the supplied checkout is available, verify full copy and byte-identical logos.
const sourceRoot =
  process.env.TESTIMONIAL_SOURCE_ROOT || "D:/InterData/thue-vps";
let sourceVerified = false;
if (
  await fs
    .stat(path.join(sourceRoot, "components/testimonials-2.jsx"))
    .catch(() => null)
) {
  const original = await fs.readFile(
    path.join(sourceRoot, "components/testimonials-2.jsx"),
    "utf8",
  );
  const records = [
    ...original
      .match(/const testimonials = (\[[\s\S]*?\n\]);/)[1]
      .matchAll(
        /name: "([^"]+)",[\s\S]*?company: "([^"]+)",[\s\S]*?logo: "([^"]+)",[\s\S]*?content: `([^`]+)`/g,
      ),
  ];
  expect(records).toHaveLength(expected.length);
  for (const [index, match] of records.entries()) {
    expect(expected[index].name).toBe(match[1]);
    expect(expected[index].company).toBe(match[2]);
    expect(expected[index].quote).toBe(match[4]);
    expect(await fs.readFile(`public${expected[index].logo}`)).toEqual(
      await fs.readFile(`${sourceRoot}/public${match[3]}`),
    );
  }
  sourceVerified = true;
}

const browser = await chromium.launch({ headless: true });
const results = [];
try {
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    const context = await browser.newContext({
      viewport: { width, height: 1100 },
      reducedMotion: width === 1440 ? "no-preference" : "reduce",
      hasTouch: width < 640,
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(base, { waitUntil: "networkidle" });
    const track = page.locator(".testimonial-track");
    const slides = track.locator(".testimonial-slide");
    const dots = page.locator(".testimonial-pagination button");
    const arrows = page.locator(".testimonial-arrows button");
    await expect(page.locator(".testimonial-carousel")).toHaveAttribute(
      "data-enhanced",
      "true",
    );
    await expect(slides).toHaveCount(expected.length);
    const rendered = await slides.evaluateAll((elements) =>
      elements.map((slide) => ({
        name: slide.querySelector(".testimonial-author strong").textContent,
        company: slide.querySelector(".testimonial-author span").textContent,
        quote: slide.querySelector("blockquote").textContent,
      })),
    );
    expect(rendered).toEqual(
      expected.map(({ name, company, quote }) => ({ name, company, quote })),
    );

    async function selected(index) {
      await expect(dots.nth(index)).toHaveAttribute("aria-current", "true");
      await expect
        .poll(() =>
          track.evaluate((element) => {
            const step =
              element.children[1].getBoundingClientRect().left -
              element.children[0].getBoundingClientRect().left;
            return Math.abs(
              element.scrollLeft - Math.round(element.scrollLeft / step) * step,
            );
          }),
        )
        .toBeLessThan(2);
    }
    await selected(0);
    await expect(arrows.first()).toBeDisabled();
    await arrows.last().click();
    await selected(1);
    await arrows.first().click();
    await selected(0);
    for (let index = 0; index < expected.length; index++) {
      await dots.nth(index).click();
      await selected(index);
      await expect
        .poll(() =>
          slides
            .nth(index)
            .locator("img")
            .evaluate((image) => image.complete && image.naturalWidth > 0),
        )
        .toBe(true);
      expect(
        await slides
          .nth(index)
          .evaluate((slide) =>
            [
              ...slide.querySelectorAll("blockquote, .testimonial-author"),
            ].every(
              (element) => element.scrollHeight <= element.clientHeight + 1,
            ),
          ),
      ).toBe(true);
    }
    await expect(arrows.last()).toBeDisabled();
    await track.focus();
    await page.keyboard.press("Home");
    await selected(0);
    await page.keyboard.press("ArrowRight");
    await selected(1);
    await page.keyboard.press("ArrowLeft");
    await selected(0);
    await page.keyboard.press("End");
    await selected(7);
    await page.keyboard.press("Home");
    await selected(0);
    await track.scrollIntoViewIfNeeded();
    const box = await track.boundingBox();
    await page.mouse.move(box.x + box.width * 0.88, box.y + 60);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.12, box.y + 60, { steps: 12 });
    await page.mouse.up();
    await selected(1);
    if (width === 390) {
      const session = await context.newCDPSession(page);
      await track.scrollIntoViewIfNeeded();
      const touchBox = await track.boundingBox();
      const x = touchBox.x + touchBox.width * 0.88;
      const y = touchBox.y + 60;
      await session.send("Input.dispatchTouchEvent", {
        type: "touchStart",
        touchPoints: [{ x, y }],
      });
      for (let step = 1; step <= 12; step++) {
        await session.send("Input.dispatchTouchEvent", {
          type: "touchMove",
          touchPoints: [{ x: x - (touchBox.width * 0.76 * step) / 12, y }],
        });
        await page.waitForTimeout(20);
      }
      await session.send("Input.dispatchTouchEvent", {
        type: "touchEnd",
        touchPoints: [],
      });
      await selected(2);
      await session.detach();
    }
    if (width === 1440 || width === 390) {
      const position = await track.evaluate((element) => element.scrollLeft);
      await page.waitForTimeout(3000);
      expect(await track.evaluate((element) => element.scrollLeft)).toBeCloseTo(
        position,
        1,
      );
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    await dots.first().click();
    await selected(0);
    await page
      .locator("#khach-hang")
      .screenshot({ path: `artifacts/testimonials-${width}.png` });
    if (width === 1440) {
      await dots.nth(4).click();
      await selected(4);
      await page.setViewportSize({ width: 390, height: 1100 });
      await selected(4);
      await page.setViewportSize({ width: 1440, height: 1100 });
      await selected(4);
    }
    expect(errors).toEqual([]);
    results.push({
      width,
      sourceContentMatches: true,
      controls: true,
      keyboard: true,
      mouseDrag: true,
      touchSwipe: width === 390 ? true : "not tested",
      overflow: false,
      errors,
    });
    await context.close();
  }

  const staticContext = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 1100 },
    reducedMotion: "reduce",
  });
  const staticPage = await staticContext.newPage();
  await staticPage.goto(base, { waitUntil: "networkidle" });
  await expect(staticPage.locator(".testimonial-slide")).toHaveCount(8);
  await expect(staticPage.locator(".testimonial-controls")).not.toBeVisible();
  expect(
    await staticPage
      .locator(".testimonial-track")
      .evaluate(
        (element) =>
          element.scrollWidth > element.clientWidth &&
          getComputedStyle(element).overflowX === "auto",
      ),
  ).toBe(true);
  await staticContext.close();
  await fs.writeFile(
    "artifacts/testimonials-results.json",
    JSON.stringify(
      {
        base,
        sourceVerified,
        noJavaScript: true,
        responsiveResize: true,
        results,
      },
      null,
      2,
    ),
  );
  console.log(
    JSON.stringify({
      sourceVerified,
      noJavaScript: true,
      responsiveResize: true,
      viewports: results.length,
      passed: true,
    }),
  );
} finally {
  await browser.close();
}
