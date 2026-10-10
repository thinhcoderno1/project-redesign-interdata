import { chromium, expect } from "@playwright/test";
import fs from "node:fs/promises";

const baseline = process.argv.includes("--baseline");
const base = process.env.TEST_BASE_URL || "http://localhost:3100";
const directory = process.env.STRUCTURE_DIRECTORY || "artifacts/site-structure";
await fs.mkdir(directory, { recursive: true });
const selectors = [
  ".site-header",
  ".nav-row",
  ".logo",
  ".hero",
  ".hero-content",
  ".hero h1",
  ".hero-content > p",
  ".hero-trial",
  ".hero-features",
  "#uu-dai",
  "#dich-vu",
  "[data-catalog-service]",
  "#giai-phap",
  "#solutions-track",
  ".capacity",
  ".capacity-content",
  ".stat-grid",
  ".feedback",
  ".testimonial-card",
  ".testimonial-media",
  ".testimonial-copy",
  ".education",
  ".education-heading",
  ".partner-grid",
  ".infrastructure",
  ".infra-content",
  ".infra-items",
  ".consultation",
  ".need-tabs",
  ".need-panel",
  ".panel-actions",
  ".final-section",
  "#tai-nguyen",
  ".footer",
  ".footer-grid",
  ".footer-company",
  ".footer-bottom",
];
const properties = [
  "display",
  "position",
  "fontFamily",
  "fontSize",
  "fontWeight",
  "lineHeight",
  "letterSpacing",
  "color",
  "backgroundColor",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "marginTop",
  "marginBottom",
  "gap",
  "gridTemplateColumns",
  "borderRadius",
  "overflow",
  "boxShadow",
];
const browser = await chromium.launch();
try {
  for (const width of [320, 768, 1440]) {
    const page = await browser.newPage({
      viewport: { width, height: 960 },
      reducedMotion: "reduce",
    });
    await page.goto(base, { waitUntil: "domcontentloaded" });
    await expect(page.locator("#uu-dai [data-enhanced]")).toHaveCount(1);
    await page.evaluate(() => document.fonts.ready);
    for (const section of await page.locator("main > section").all()) {
      await section.scrollIntoViewIfNeeded();
      // Trigger lazy loading; image health is covered by the section-specific QA.
      // Third-party blog image delivery must not block the CSS/content baseline.
      await page.waitForTimeout(100);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    const snapshot = await page.evaluate(
      ({ selectors, properties }) => {
        const round = (n) => Math.round(n * 100) / 100;
        const elements = selectors.flatMap((selector) =>
          Array.from(document.querySelectorAll(selector)).map((el, index) => {
            const css = getComputedStyle(el),
              rect = el.getBoundingClientRect();
            return {
              selector,
              index,
              style: Object.fromEntries(
                properties.map((property) => [property, css[property]]),
              ),
              box: { width: round(rect.width), height: round(rect.height) },
            };
          }),
        );
        return {
          title: document.title,
          text: Array.from(
            document.querySelectorAll("header.site-header, main, footer"),
          ).map((el) =>
            (() => {
              const copy = el.cloneNode(true);
              copy
                .querySelectorAll("style, script")
                .forEach((node) => node.remove());
              return copy.textContent
                .replace(/<style>[\s\S]*?<\/style>/g, "")
                .replace(/\s+/g, " ")
                .trim();
            })(),
          ),
          links: Array.from(
            document.querySelectorAll("header.site-header a, main a, footer a"),
          ).map((el) => ({
            text: el.textContent.replace(/\s+/g, " ").trim(),
            href: el.getAttribute("href"),
          })),
          sections: Array.from(document.querySelectorAll("main > section")).map(
            (el) => el.id,
          ),
          images: Array.from(
            document.querySelectorAll("main img, footer img"),
          ).map((img) => ({
            src: new URL(img.src, location.origin).searchParams.get("url"),
            alt: img.alt,
          })),
          elements,
          overflow: document.documentElement.scrollWidth > innerWidth,
        };
      },
      { selectors, properties },
    );
    expect(snapshot.overflow).toBe(false);
    const file = `${directory}/baseline-${width}.json`;
    if (baseline) await fs.writeFile(file, JSON.stringify(snapshot, null, 2));
    else {
      const before = JSON.parse(await fs.readFile(file, "utf8"));
      await fs.writeFile(
        `${directory}/after-${width}.json`,
        JSON.stringify(snapshot, null, 2),
      );
      const differences = [];
      function compare(a, b, path = "snapshot") {
        if (JSON.stringify(a) === JSON.stringify(b)) return;
        if (a && b && typeof a === "object" && typeof b === "object") {
          for (const key of new Set([...Object.keys(a), ...Object.keys(b)]))
            compare(a[key], b[key], `${path}.${key}`);
        } else differences.push({ path, before: a, after: b });
      }
      before.text = before.text.map((value) =>
        value.replace(/<style>[\s\S]*?<\/style>/g, "").trim(),
      );
      compare(before, snapshot);
      expect(differences).toEqual([]);
      await expect(page.locator("header.site-header")).toHaveCount(1);
      await expect(page.locator("footer")).toHaveCount(1);
      await expect(page.locator("main")).toHaveCount(1);
    }
    await page.screenshot({
      path: `${directory}/${baseline ? "before" : "after"}-${width}.png`,
      fullPage: true,
    });
    console.log(
      `PASS ${width}px: ${baseline ? "baseline saved" : "content, links and rendered styles preserved"}`,
    );
    await page.close();
  }
} finally {
  await browser.close();
}
