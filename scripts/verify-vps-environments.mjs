import fs from "node:fs/promises";
import crypto from "node:crypto";
import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.TEST_BASE_URL || "http://localhost:3100";
const directory =
  process.env.VPS_ENVIRONMENTS_QA_DIRECTORY || "artifacts/vps-environments";
await fs.mkdir(directory, { recursive: true });
const source = JSON.parse(
  await fs.readFile("src/data/vps-content.json", "utf8"),
);
const linuxNames = ["Ubuntu", "CentOS", "Debian", "AlmaLinux", "Fedora"];
const browser = await chromium.launch();
const errors = [];
const results = [];
try {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  expect((await page.goto(`${base}/thue-vps/`)).status()).toBe(200);
  await page.evaluate(() => document.fonts.ready);
  const section = page.locator('section[aria-labelledby="one-click-title"]');
  const linux = page.locator("#environment-tab-0");
  const apps = page.locator("#environment-tab-1");
  const linuxPanel = page.locator("#environment-panel-0");
  const appPanel = page.locator("#environment-panel-1");
  await expect(section.getByRole("tab")).toHaveText([
    "Linux OS",
    "1-Click Applications",
  ]);
  await expect(linuxPanel.locator("h3")).toHaveText(linuxNames);
  await expect(appPanel.locator("h3")).toHaveText(
    source.landing.apps.map((item) => item.name),
  );
  await expect(appPanel.locator("article p")).toHaveText(
    source.landing.apps.map((item) => item.text),
  );
  await expect(
    section.getByRole("heading", {
      name: /Windows|Webuzo|aaPanel|Control Panel/i,
    }),
  ).toHaveCount(0);
  await expect(section).not.toContainText(
    "InterData không cung cấp control panel cài sẵn.",
  );
  await expect(section).not.toContainText(
    "InterData có thể hỗ trợ cài đặt từ xa theo yêu cầu.",
  );
  expect(
    (
      await page.request.get(`${base}/images/vps/environments-globe.svg`)
    ).status(),
  ).toBe(200);

  for (const width of [
    320, 390, 639, 640, 768, 899, 900, 1024, 1099, 1100, 1440, 1536, 1920,
  ]) {
    await page.setViewportSize({ width, height: 960 });
    for (const tab of [linux, apps]) {
      await tab.click();
      const isLinux = (await tab.getAttribute("id")) === "environment-tab-0";
      const panel = isLinux ? linuxPanel : appPanel;
      await expect(tab).toHaveAttribute("aria-selected", "true");
      await expect(panel).toBeVisible();
      await expect(isLinux ? appPanel : linuxPanel).toBeHidden();
      await section.scrollIntoViewIfNeeded();
      const geometry = await panel.evaluate((node) => {
        const cards = [...node.querySelectorAll("article")].map((card) => {
          const rect = card.getBoundingClientRect();
          const surface = card.firstElementChild;
          return {
            x: rect.x,
            width: rect.width,
            height: rect.height,
            clipped:
              surface.scrollWidth > surface.clientWidth + 1 ||
              surface.scrollHeight > surface.clientHeight + 1,
          };
        });
        const images = [...node.querySelectorAll("img")].map((image) => ({
          loaded: image.complete && image.naturalWidth > 0,
          src: image.getAttribute("src"),
        }));
        return {
          cards,
          images,
          columns: new Set(cards.map((card) => Math.round(card.x))).size,
        };
      });
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
      expect(geometry.columns).toBe(
        isLinux
          ? width < 640
            ? 2
            : width < 900
              ? 3
              : 5
          : width < 360
            ? 1
            : width < 900
              ? 2
              : 4,
      );
      for (const card of geometry.cards) expect(card.clipped).toBe(false);
      for (const image of geometry.images) expect(image.loaded).toBe(true);
      expect(
        Math.max(...geometry.cards.map((card) => card.height)) -
          Math.min(...geometry.cards.map((card) => card.height)),
      ).toBeLessThan(1);
      expect((await tab.boundingBox()).height).toBeGreaterThanOrEqual(44);
      if ([320, 390, 768, 1024, 1440, 1920].includes(width)) {
        const audit = await new AxeBuilder({ page })
          .include('section[aria-labelledby="one-click-title"]')
          .analyze();
        expect(
          audit.violations.map(({ id, nodes }) => ({
            id,
            targets: nodes.map((node) => node.target),
          })),
        ).toEqual([]);
      }
      if ([320, 390, 768, 1440, 1536].includes(width)) {
        await page.addStyleTag({
          content:
            'header.site-header, nav[aria-label="Liên hệ nhanh và tiện ích"] { visibility: hidden !important; }',
        });
        await tab.evaluate((node) => node.blur());
        await page.mouse.move(0, 0);
        const screenshotHeight = Math.max(
          960,
          Math.ceil((await section.boundingBox()).height) + 64,
        );
        await page.setViewportSize({ width, height: screenshotHeight });
        await section.evaluate((node) =>
          window.scrollTo({
            top: scrollY + node.getBoundingClientRect().top,
            behavior: "instant",
          }),
        );
        await page.evaluate(
          () =>
            new Promise((resolve) =>
              requestAnimationFrame(() => requestAnimationFrame(resolve)),
            ),
        );
        await page.screenshot({
          path: `${directory}/${isLinux ? "linux" : "apps"}-${width}.png`,
        });
        await page.setViewportSize({ width, height: 960 });
      }
      results.push({ width, tab: isLinux ? "linux" : "apps", geometry });
    }
  }
  await linux.click();
  await page.keyboard.press("ArrowRight");
  await expect(apps).toBeFocused();
  await expect(appPanel).toBeVisible();
  await page.keyboard.press("Home");
  await expect(linux).toBeFocused();
  await expect(linuxPanel).toBeVisible();
  await page.keyboard.press("End");
  await expect(apps).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(linux).toBeFocused();
  await page.keyboard.press("ArrowLeft");
  await expect(apps).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(appPanel).toBeFocused();
  await context.close();

  const plain = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 960 },
  });
  const fallback = await plain.newPage();
  await fallback.goto(`${base}/thue-vps/`);
  await expect(fallback.locator("#environment-panel-0")).toBeVisible();
  await expect(fallback.locator("#environment-panel-0 h3")).toHaveText(
    linuxNames,
  );
  await expect(fallback.locator("#environment-panel-1")).toBeHidden();
  await plain.close();
  expect(errors).toEqual([]);
  const baseline = JSON.parse(
    await fs
      .readFile(
        process.env.VPS_ENVIRONMENTS_BASELINE ||
          "artifacts/vps-environments/source-before.json",
        "utf8",
      )
      .catch((error) => {
        if (error.code === "ENOENT") return "{}";
        throw error;
      }),
  );
  for (const [file, hash] of Object.entries(baseline))
    expect(
      crypto
        .createHash("sha256")
        .update(await fs.readFile(file))
        .digest("hex"),
      file,
    ).toBe(hash);
  await fs.writeFile(
    `${directory}/results.json`,
    JSON.stringify(
      {
        results,
        errors,
        keyboard: true,
        noJavaScript: true,
        unchangedSourceFiles: Object.keys(baseline).length,
      },
      null,
      2,
    ),
  );
  console.log(
    `PASS environments: 13 widths, both tabs, supported content, images, keyboard, accessibility, no-JavaScript, ${Object.keys(baseline).length} unchanged source files`,
  );
} finally {
  await browser.close();
}
