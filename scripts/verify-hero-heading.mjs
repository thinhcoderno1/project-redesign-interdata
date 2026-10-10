import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
import sharp from "sharp";

const base = process.env.TEST_BASE_URL || "http://localhost:3100";
const applications = [
  "Lưu Trữ Web",
  "Hạ Tầng Self-Host",
  "Triển Khai Ứng Dụng",
  "Ảo Hóa Máy Chủ",
];
const browser = await chromium.launch();
const results = [];
await fs.mkdir("artifacts/hero-heading", { recursive: true });
async function checkSingleLine(page) {
  const layout = await page.evaluate(() => {
    const row = document.querySelector("h1 .hero-heading-row");
    const parts = [...row.children].map((part) =>
      part.getBoundingClientRect().toJSON(),
    );
    return {
      parts,
      fontSize: getComputedStyle(document.querySelector("h1")).fontSize,
      gap: parseFloat(getComputedStyle(row).gap),
      width: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    };
  });
  expect(layout.parts).toHaveLength(3);
  expect(layout.scrollWidth).toBeLessThanOrEqual(layout.width);
  expect(layout.parts[0].left).toBeGreaterThanOrEqual(0);
  expect(layout.parts[2].right).toBeLessThanOrEqual(layout.width);
  for (const part of layout.parts) {
    expect(part.top).toBeCloseTo(layout.parts[0].top, 1);
    expect(part.height).toBeCloseTo(layout.parts[0].height, 1);
  }
  expect(layout.parts[1].left - layout.parts[0].right).toBeCloseTo(
    layout.gap,
    1,
  );
  expect(layout.parts[2].left - layout.parts[1].right).toBeCloseTo(
    layout.gap,
    1,
  );
  return layout;
}
async function checkRoll(page) {
  const roll = await page.evaluate(() => {
    const viewport = document.querySelector(".hero-applications");
    const incoming = viewport.querySelector("[data-active]");
    const outgoing = viewport.querySelector("[data-outgoing]");
    const animations = viewport.getAnimations({ subtree: true });
    if (!outgoing || animations.length !== 3) return null;
    animations.forEach((animation) => animation.pause());
    const duration = animations[0].effect.getTiming().duration;
    const from = outgoing.getBoundingClientRect().width;
    const to = incoming.getBoundingClientRect().width;
    const samples = [0, 0.25, 0.5, 0.75, 1].map((progress) => {
      animations.forEach((animation) => {
        animation.currentTime = duration * progress;
      });
      const y = (element) =>
        new DOMMatrixReadOnly(getComputedStyle(element).transform).m42;
      const whites = [
        document.querySelector(".hero-heading-prefix"),
        document.querySelector(".hero-heading-suffix"),
      ];
      const parts = [
        ...document.querySelector("h1 .hero-heading-row").children,
      ].map((element) => element.getBoundingClientRect().toJSON());
      return {
        progress,
        width: viewport.getBoundingClientRect().width,
        incomingY: y(incoming),
        outgoingY: y(outgoing),
        opacity: [incoming, outgoing, ...whites].map((element) =>
          Number(getComputedStyle(element).opacity),
        ),
        parts,
        gap: parseFloat(
          getComputedStyle(document.querySelector("h1 .hero-heading-row")).gap,
        ),
        whiteAnimations: whites.map(
          (element) => element.getAnimations().length,
        ),
        sameNodes: whites.every(
          (element, index) => element === window.headingWhiteNodes[index],
        ),
        viewportWidth: document.documentElement.clientWidth,
      };
    });
    animations.forEach((animation) => animation.play());
    return { duration, from, to, samples };
  });
  expect(roll).not.toBeNull();
  expect(roll.duration).toBeGreaterThanOrEqual(500);
  expect(roll.duration).toBeLessThanOrEqual(1000);
  expect(roll.samples[0].width).toBeCloseTo(roll.from, 1);
  expect(roll.samples[4].width).toBeCloseTo(roll.to, 1);
  expect(roll.samples[0].incomingY).toBeGreaterThan(0);
  expect(roll.samples[0].outgoingY).toBe(0);
  expect(roll.samples[2].incomingY).toBeGreaterThan(0);
  expect(roll.samples[2].incomingY).toBeLessThan(roll.samples[0].incomingY);
  expect(roll.samples[2].outgoingY).toBeLessThan(0);
  expect(roll.samples[4].incomingY).toBe(0);
  expect(roll.samples[4].outgoingY).toBeLessThan(roll.samples[2].outgoingY);
  for (const [index, sample] of roll.samples.entries()) {
    expect(sample.opacity).toEqual([1, 1, 1, 1]);
    expect(sample.sameNodes).toBe(true);
    expect(sample.whiteAnimations).toEqual([0, 0]);
    expect(sample.parts[0].left).toBeGreaterThanOrEqual(0);
    expect(sample.parts[2].right).toBeLessThanOrEqual(sample.viewportWidth);
    expect(
      sample.parts.every(
        (part) => Math.abs(part.top - sample.parts[0].top) < 0.1,
      ),
    ).toBe(true);
    expect(sample.parts[1].left - sample.parts[0].right).toBeCloseTo(
      sample.gap,
      1,
    );
    expect(sample.parts[2].left - sample.parts[1].right).toBeCloseTo(
      sample.gap,
      1,
    );
    if (index > 0) {
      const previous = roll.samples[index - 1].width;
      expect(
        (sample.width - previous) * Math.sign(roll.to - roll.from),
      ).toBeGreaterThanOrEqual(-0.1);
    }
  }
  return roll;
}
async function checkDiacritics(page, width) {
  await expect(page.locator(".hero-application[data-outgoing]")).toHaveCount(0);
  const box = await page
    .locator(".hero-application[data-active]")
    .boundingBox();
  const clip = {
    x: Math.floor(box.x - 12),
    y: Math.floor(box.y - 12),
    width: Math.ceil(box.width + 24),
    height: Math.ceil(box.height + 24),
  };
  const rendered = await page.screenshot({ clip });
  const override = await page.addStyleTag({
    content:
      ".hero-applications { overflow: visible !important; clip-path: none !important; }",
  });
  const reference = await page.screenshot({ clip });
  await override.evaluate((element) => element.remove());
  const actualPixels = await sharp(rendered).removeAlpha().raw().toBuffer();
  const referencePixels = await sharp(reference).removeAlpha().raw().toBuffer();
  let lostPixels = 0;
  for (let index = 0; index < actualPixels.length; index += 3) {
    if (
      Math.max(
        ...[0, 1, 2].map((channel) =>
          Math.abs(
            actualPixels[index + channel] - referencePixels[index + channel],
          ),
        ),
      ) > 8
    )
      lostPixels++;
  }
  expect(
    lostPixels,
    "Vietnamese marks must match the same text with clipping completely removed",
  ).toBe(0);
  await fs.writeFile(
    `artifacts/hero-heading/diacritics-${width}.png`,
    rendered,
  );
  return {
    width,
    deviceScaleFactor: await page.evaluate(() => devicePixelRatio),
    lostPixels,
  };
}
try {
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    const context = await browser.newContext({
      viewport: { width, height: 960 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(base, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator(".hero-application[data-active]")).toHaveText(
      applications[0],
    );
    await expect(page.locator(".hero-application")).toHaveText(applications);
    await expect(page.locator(".hero-heading button")).toHaveCount(0);
    const singleLine = await checkSingleLine(page);
    const layout = await page.evaluate(() => {
      const suffix = document.querySelector(".hero-heading-suffix");
      const range = document.createRange();
      range.selectNodeContents(suffix);
      return {
        width: innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        heading: document.querySelector("h1").getBoundingClientRect().toJSON(),
        words: document
          .querySelector(".hero-applications")
          .getBoundingClientRect()
          .toJSON(),
        suffix: range.getBoundingClientRect().toJSON(),
        color: getComputedStyle(document.querySelector(".hero-applications"))
          .color,
        animation: getComputedStyle(
          document.querySelector(".hero-application[data-active]"),
        ).animationName,
        cta: document
          .querySelector(".hero-trial")
          .getBoundingClientRect()
          .toJSON(),
        features: document
          .querySelector(".hero-features")
          .getBoundingClientRect()
          .toJSON(),
      };
    });
    expect(layout.scrollWidth).toBeLessThanOrEqual(width);
    expect(layout.words.x).toBeGreaterThanOrEqual(0);
    expect(layout.words.right).toBeLessThanOrEqual(width);
    expect(layout.color).toBe("rgb(143, 197, 255)");
    expect(layout.animation).toBe("none");
    expect(layout.cta.bottom).toBeLessThan(layout.features.top);
    expect(
      (await new AxeBuilder({ page }).include(".hero-shell").analyze())
        .violations,
    ).toEqual([]);
    await page.screenshot({
      path: `artifacts/hero-heading/static-${width}.png`,
    });
    expect(errors).toEqual([]);
    results.push({ width, layout, singleLine, errors });
    await context.close();
  }

  for (const width of [320, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: 960 },
      reducedMotion: "no-preference",
      deviceScaleFactor: width === 1440 ? 1.25 : 1,
    });
    const page = await context.newPage();
    await page.clock.install();
    await page.goto(base, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => document.fonts.ready);
    const heading = page.locator(".hero-heading");
    const active = page.locator(".hero-application[data-active]");
    await expect(heading).toHaveAttribute("data-running", "true");
    const start = applications.indexOf(await active.textContent());
    const originalBox = await page.locator("h1").boundingBox();
    const originalLine = await checkSingleLine(page);
    await page.evaluate(() => {
      window.headingWhiteNodes = [
        document.querySelector(".hero-heading-prefix"),
        document.querySelector(".hero-heading-suffix"),
      ];
    });
    for (let step = 1; step <= applications.length; step++) {
      await page.clock.fastForward(3200);
      await expect(active).toHaveText(
        applications[(start + step) % applications.length],
      );
      const roll = await checkRoll(page);
      results.push({ width, application: await active.textContent(), roll });
      if ((await active.textContent()) === applications[3]) {
        results.push({ diacritics: await checkDiacritics(page, width) });
      }
      expect(await page.locator("h1").boundingBox()).toEqual(originalBox);
      const line = await checkSingleLine(page);
      expect(line.fontSize).toBe(originalLine.fontSize);
      expect(line.gap).toBe(originalLine.gap);
      await expect(heading.locator("button")).toHaveCount(0);
    }
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(heading).toHaveAttribute("data-running", "false");
    await expect(heading.locator("button")).toHaveCount(0);
    expect(
      await active.evaluate(
        (element) => getComputedStyle(element).animationName,
      ),
    ).toBe("none");
    expect(
      await active.evaluate((element) => getComputedStyle(element).transform),
    ).toBe("none");
    await expect(page.locator(".hero-application[data-outgoing]")).toHaveCount(
      0,
    );
    const reduced = await active.textContent();
    await page.clock.fastForward(12800);
    await expect(active).toHaveText(reduced);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect(heading).toHaveAttribute("data-running", "true");

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(heading).toHaveAttribute("data-running", "false");
    const offscreen = await active.textContent();
    await page.clock.fastForward(12800);
    await expect(active).toHaveText(offscreen);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.clock.runFor(500);
    await expect(heading).toHaveAttribute("data-running", "true");
    await expect(heading.locator("button")).toHaveCount(0);
    expect(
      (await new AxeBuilder({ page }).include(".hero-shell").analyze())
        .violations,
    ).toEqual([]);
    await page.screenshot({
      path: `artifacts/hero-heading/rotating-${width}.png`,
      animations: "disabled",
    });
    await page.setViewportSize({
      width: width === 320 ? 1440 : 320,
      height: 960,
    });
    await page.clock.runFor(500);
    await checkSingleLine(page);
    await page.setViewportSize({ width, height: 960 });
    await page.clock.runFor(500);
    await checkSingleLine(page);
    await context.close();
  }

  for (const width of [320, 1440]) {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width, height: 960 },
    });
    const page = await context.newPage();
    await page.goto(base, { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator(".hero-application[data-active]")).toHaveText(
      applications[0],
    );
    await expect(page.locator(".hero-heading button")).toHaveCount(0);
    await checkSingleLine(page);
    await context.close();
  }
  await fs.writeFile(
    "artifacts/hero-heading/results.json",
    JSON.stringify(results, null, 2),
  );
  console.log(
    "Hero heading passed: complete Vietnamese diacritics compared against unclipped text at mobile/desktop and 125% pixel scale; upward roll, smooth width changes, no white-text fading, single line at 320–1920px, reduced motion and no-JavaScript fallback.",
  );
} finally {
  await browser.close();
}
