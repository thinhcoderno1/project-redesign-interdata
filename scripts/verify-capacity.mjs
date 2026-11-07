import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";

const base = process.env.TEST_BASE_URL || "http://localhost:3100";
const routes = [
  "/",
  "/thue-vps/",
  "/cloud-server/",
  "/amd-cloud-server/",
  "/platinum-cloud-server/",
  "/thue-may-chu-vat-ly/",
  "/vietnam-colocation/",
  "/vps-platinum/",
  "/vps-linux/",
  "/vps-gold/",
  "/vps-n8n/",
  "/trien-khai-private-network/",
  "/trien-khai-proxmox-ceph/",
  "/trien-khai-Kubernetes-k8s/",
  "/trien-khai-vmware/",
  "/s3-object-storage/",
];

await fs.mkdir("artifacts/capacity", { recursive: true });
const browser = await chromium.launch();
try {
  for (const width of [320, 390, 768, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: 1000 },
      reducedMotion: "reduce",
    });
    let reference;
    for (const route of routes) {
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      const response = await page.goto(`${base}${route}`, {
        waitUntil: "domcontentloaded",
      });
      expect(response.status(), route).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      const section = page.locator("#nang-luc");
      await expect(section).toHaveCount(1);
      await section.scrollIntoViewIfNeeded();
      await expect(
        section.locator("svg[viewBox='60 15 900 450']"),
      ).toBeVisible();
      await expect(section.locator(".stat-grid > div")).toHaveCount(3);
      // Host-page CSS must not change the shared presentation or its layout.
      const presentation = await section.evaluate((element) => {
        const selectors = [
          null,
          ".capacity-content",
          ".capacity-content > span",
          "h2",
          ".capacity-content > p",
          ".stat-grid",
          ".stat-grid strong",
          ".stat-grid [class*='label']",
        ];
        return selectors.map((selector) => {
          const node = selector ? element.querySelector(selector) : element;
          const css = getComputedStyle(node);
          const box = node.getBoundingClientRect();
          return {
            selector,
            width: Math.round(box.width),
            height: Math.round(box.height),
            style: Object.fromEntries(
              [
                "fontSize",
                "fontWeight",
                "lineHeight",
                "letterSpacing",
                "color",
                "textTransform",
                "paddingTop",
                "paddingBottom",
                "gap",
              ].map((property) => [property, css[property]]),
            ),
          };
        });
      });
      reference ??= presentation;
      expect(presentation, `${route} at ${width}px`).toEqual(reference);
      expect(
        await section.evaluate((el) => el.scrollWidth),
        route,
      ).toBeLessThanOrEqual(width);
      expect(
        await section
          .locator("[class*='signals']")
          .evaluate((el) => getComputedStyle(el).animationName),
      ).toBe("none");
      if (
        route === "/" ||
        route === "/cloud-server/" ||
        route === "/vps-platinum/"
      ) {
        const audit = await new AxeBuilder({ page })
          .include("#nang-luc")
          .analyze();
        expect(audit.violations, route).toEqual([]);
        await section.screenshot({
          path: `artifacts/capacity/${route.replaceAll("/", "") || "home"}-${width}.png`,
        });
      }
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await expect
        .poll(() =>
          section
            .locator("[class*='signals']")
            .evaluate((el) => getComputedStyle(el).animationName),
        )
        .not.toBe("none");
      await expect
        .poll(() =>
          section
            .locator("[data-count-value]")
            .evaluateAll((nodes) =>
              nodes.every(
                (node) =>
                  node.textContent ===
                  node.closest("strong").dataset.finalValue,
              ),
            ),
        )
        .toBe(true);
      expect(errors, route).toEqual([]);
      await page.close();
    }
    await context.close();
    console.log(
      `Capacity section matches across ${routes.length} pages at ${width}px; motion preferences and counters passed.`,
    );
  }

  // Enter with motion enabled to exercise the actual counter lifecycle.
  const animated = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "no-preference",
  });
  for (const route of ["/", "/cloud-server/"]) {
    const page = await animated.newPage();
    await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded" });
    const grid = page.locator("#nang-luc .stat-grid");
    await grid.scrollIntoViewIfNeeded();
    const counter = grid.locator("[data-count-value]").first();
    await expect
      .poll(
        () =>
          counter.evaluate((node) => {
            const value = node.textContent;
            return (
              parseInt(value, 10) > 0 &&
              value !== node.closest("strong").dataset.finalValue
            );
          }),
        { intervals: [50] },
      )
      .toBe(true);
    await expect
      .poll(() =>
        grid
          .locator("[data-count-value]")
          .evaluateAll((nodes) =>
            nodes.every(
              (node) =>
                node.textContent === node.closest("strong").dataset.finalValue,
            ),
          ),
      )
      .toBe(true);
    await page.close();
  }
  await animated.close();
  console.log(
    "Animated counters reach their final values on homepage and Cloud Server.",
  );
} finally {
  await browser.close();
}
