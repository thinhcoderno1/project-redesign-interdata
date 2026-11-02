import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";

const base = process.env.TEST_BASE_URL || "http://localhost:3100";
const output = "artifacts/hero-heading";
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch();
const results = [];
const overlap = (a, b) =>
  Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 &&
  Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1;

try {
  for (const width of [320, 360, 390, 640, 768, 959, 1024, 1199, 1440, 1920]) {
    const context = await browser.newContext({
      viewport: { width, height: 1100 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(base, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const hero = page.locator("[data-home-hero]");
    const title = hero.locator("h1");
    const benefits = hero.getByRole("list", {
      name: "Lợi ích hạ tầng InterData",
    });
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(title).toHaveText("Hạ tầng vững mạnh. Bứt phá mọi giới hạn.");
    await expect(benefits.locator(":scope > li")).toHaveCount(4);
    await expect(benefits).toContainText("240Gbps+");
    await expect(benefits).toContainText("L3-L4-L7-WAF");
    await expect(
      hero.getByRole("link", { name: "Dùng thử miễn phí" }),
    ).toHaveAttribute("href", "/thue-vps/#pricing");
    const layout = await hero.evaluate((root) => {
      const rect = (element) => element.getBoundingClientRect().toJSON();
      const heading = root.querySelector("h1");
      const list = root.querySelector(
        'ul[aria-label="Lợi ích hạ tầng InterData"]',
      );
      const panels = root.querySelector('ul[aria-label="Nền tảng hạ tầng"]')
        .parentElement.parentElement;
      const image = root.querySelector("img");
      const visual = image.parentElement;
      return {
        font: getComputedStyle(heading).fontFamily,
        fontSize: parseFloat(getComputedStyle(heading).fontSize),
        columns: getComputedStyle(list).gridTemplateColumns.split(" ").length,
        heading: rect(heading),
        accent: rect(heading.querySelector("span")),
        description: rect(heading.nextElementSibling),
        actions: [...root.querySelectorAll("a")].map(rect),
        panels: [...panels.children].map(rect),
        benefits: rect(list),
        visual: rect(visual),
        imageLoaded: image.complete && image.naturalWidth > 0,
        imageSrc: image.currentSrc,
        scrollWidth: document.documentElement.scrollWidth,
        textOverflow: [...list.querySelectorAll("p")].flatMap((element) => {
          const range = document.createRange();
          range.selectNodeContents(element);
          const cell = element.closest("li").getBoundingClientRect();
          return [...range.getClientRects()]
            .filter(
              (box) => box.right > cell.right + 1 || box.left < cell.left - 1,
            )
            .map(() => element.textContent);
        }),
      };
    });
    expect(layout.font).toContain("Be Vietnam Pro");
    expect(layout.fontSize).toBeGreaterThanOrEqual(28);
    expect(layout.fontSize).toBeLessThanOrEqual(54);
    expect(layout.columns).toBe(width <= 959 ? 2 : 4);
    expect(layout.accent.bottom).toBeLessThan(layout.description.top);
    expect(layout.scrollWidth).toBeLessThanOrEqual(width);
    expect(layout.textOverflow).toEqual([]);
    expect(layout.imageLoaded).toBe(true);
    expect(layout.imageSrc).toContain("hero-globe-racks");
    expect(layout.benefits.top).toBeLessThan(layout.visual.bottom);
    expect(layout.benefits.bottom).toBeGreaterThan(layout.visual.bottom);
    for (const panel of layout.panels) {
      for (const action of layout.actions)
        expect(overlap(panel, action), `Panel overlaps CTA at ${width}px`).toBe(
          false,
        );
      expect(panel.bottom).toBeLessThan(layout.benefits.top);
    }
    expect(errors).toEqual([]);
    if ([390, 1440].includes(width)) {
      const accessibility = await new AxeBuilder({ page })
        .include("[data-home-hero]")
        .analyze();
      expect(accessibility.violations).toEqual([]);
      await page.screenshot({ path: `${output}/reference-${width}.png` });
      const explore = hero.getByRole("link", { name: "Khám phá hạ tầng" });
      await explore.focus();
      await expect(explore).toBeFocused();
      await explore.press("Enter");
      await expect(page).toHaveURL(/#ha-tang$/);
      await expect(page.locator("#ha-tang")).toBeInViewport();
    }
    results.push({
      width,
      fontSize: layout.fontSize,
      columns: layout.columns,
      errors,
    });
    await context.close();
  }
  for (const width of [320, 1440]) {
    const page = await browser.newPage({
      javaScriptEnabled: false,
      viewport: { width, height: 1100 },
    });
    await page.goto(base, { waitUntil: "networkidle" });
    await expect(page.locator("#hero-title")).toBeVisible();
    await expect(
      page.getByRole("list", { name: "Lợi ích hạ tầng InterData" }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    await page.close();
  }
  await fs.writeFile(
    `${output}/results.json`,
    JSON.stringify(results, null, 2),
  );
  console.log(
    "Hero passed: 320–1920px, site typography, two-line Vietnamese heading, four benefits, no overlap or overflow, background loading, CTA/anchor, keyboard focus, accessibility and no-JavaScript rendering.",
  );
} finally {
  await browser.close();
}
