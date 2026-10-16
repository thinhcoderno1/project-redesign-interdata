import fs from "node:fs/promises";
import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.TEST_BASE_URL || "http://localhost:3100";
const directory =
  process.env.VPS_PROOF_QA_DIRECTORY || "artifacts/vps-proof-controls";
await fs.mkdir(directory, { recursive: true });
const browser = await chromium.launch();
const errors = [];
const results = [];
const sections = ["khach-hang", "bao-chi"];
const snapshot = async (page) => ({
  quotes: await page.locator("#khach-hang .testimonial-full").allTextContents(),
  people: await page
    .locator("#khach-hang .testimonial-author")
    .allTextContents(),
  press: await page.locator("#bao-chi h3").allTextContents(),
  urls: await page
    .locator("#bao-chi article a")
    .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href"))),
});
try {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${base}/thue-vps/`);
  await page.evaluate(() => document.fonts.ready);
  const content = await snapshot(page);
  expect(content.quotes).toHaveLength(8);
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1100 });
    for (const id of sections) {
      const section = page.locator(`#${id}`);
      const track = section.locator("[data-carousel-track]");
      const arrows = section.locator("[data-carousel-arrows] button");
      const dots = section.locator("[data-carousel-pagination] button");
      const counter = section.locator("[data-carousel-count]");
      await expect(arrows.last()).toBeVisible();
      await dots.first().click();
      await expect(dots.first()).toHaveAttribute("aria-current", "true");
      await expect(arrows.first()).toBeDisabled();
      await expect(counter).toHaveClass("sr-only");
      expect((await counter.boundingBox()).width).toBeLessThanOrEqual(1);
      const geometry = await section.evaluate((node) => {
        const viewport = node
          .querySelector("[data-carousel-track]")
          .getBoundingClientRect();
        const buttons = [
          ...node.querySelectorAll("[data-carousel-arrows] button"),
        ].map((button) => button.getBoundingClientRect().toJSON());
        return { viewport: viewport.toJSON(), buttons };
      });
      for (const button of geometry.buttons) {
        expect(button.x).toBeGreaterThanOrEqual(0);
        expect(button.right).toBeLessThanOrEqual(width);
        expect(button.width).toBeGreaterThanOrEqual(44);
        expect(button.height).toBeGreaterThanOrEqual(44);
        expect(
          Math.abs(
            button.y +
              button.height / 2 -
              geometry.viewport.y -
              geometry.viewport.height / 2,
          ),
        ).toBeLessThan(1);
      }
      expect(geometry.buttons[0].x).toBeLessThan(geometry.viewport.x);
      expect(geometry.buttons[1].right).toBeGreaterThan(
        geometry.viewport.right,
      );
      await arrows.last().click();
      await expect(dots.nth(1)).toHaveAttribute("aria-current", "true");
      await arrows.first().click();
      await expect(dots.first()).toHaveAttribute("aria-current", "true");
      await track.focus();
      await page.keyboard.press("End");
      await expect(dots.last()).toHaveAttribute("aria-current", "true");
      await expect(arrows.last()).toBeDisabled();
      await page.keyboard.press("Home");
      await expect(dots.first()).toHaveAttribute("aria-current", "true");
      await page.keyboard.press("ArrowRight");
      await expect(dots.nth(1)).toHaveAttribute("aria-current", "true");
      await page.keyboard.press("ArrowLeft");
      await expect(dots.first()).toHaveAttribute("aria-current", "true");
      await expect(arrows.last()).toBeEnabled();
      if (id === "bao-chi") {
        await track.evaluate((node) =>
          window.scrollTo({
            top: scrollY + node.getBoundingClientRect().top - 150,
            behavior: "instant",
          }),
        );
        const box = await track.boundingBox();
        const url = page.url();
        await page.mouse.move(box.x + box.width * 0.88, box.y + 60);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width * 0.12, box.y + 60, {
          steps: 14,
        });
        await page.mouse.up();
        await expect(dots.nth(1)).toHaveAttribute("aria-current", "true");
        expect(page.url()).toBe(url);
        if (width === 390) {
          const session = await context.newCDPSession(page);
          await session.send("Emulation.setTouchEmulationEnabled", {
            enabled: true,
            maxTouchPoints: 1,
          });
          const x = box.x + box.width * 0.88;
          const y = box.y + 60;
          await session.send("Input.dispatchTouchEvent", {
            type: "touchStart",
            touchPoints: [{ x, y }],
          });
          for (let step = 1; step <= 16; step++) {
            await session.send("Input.dispatchTouchEvent", {
              type: "touchMove",
              touchPoints: [{ x: x - (box.width * 0.76 * step) / 16, y }],
            });
            await new Promise((resolve) => setTimeout(resolve, 20));
          }
          await session.send("Input.dispatchTouchEvent", {
            type: "touchEnd",
            touchPoints: [],
          });
          await expect(dots.nth(2)).toHaveAttribute("aria-current", "true");
          expect(page.url()).toBe(url);
          await session.detach();
        }
        await dots.first().click();
        await expect(dots.first()).toHaveAttribute("aria-current", "true");
      }
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
      const audit = await new AxeBuilder({ page }).include(`#${id}`).analyze();
      expect(
        audit.violations.map(({ id, nodes }) => ({
          id,
          targets: nodes.map((node) => node.target),
        })),
      ).toEqual([]);
      if ([320, 390, 1440].includes(width)) {
        await track.evaluate((node) => node.blur());
        const height = Math.ceil((await section.boundingBox()).height) + 48;
        await page.setViewportSize({ width, height });
        await section.evaluate((node) =>
          window.scrollTo({
            top: scrollY + node.getBoundingClientRect().top,
            behavior: "instant",
          }),
        );
        await page.addStyleTag({
          content:
            'header.site-header, nav[aria-label="Liên hệ nhanh và tiện ích"] {visibility:hidden!important;}',
        });
        for (const img of await track
          .locator('[aria-roledescription="slide"]')
          .first()
          .locator("img")
          .all())
          await expect
            .poll(() =>
              img.evaluate((node) => node.complete && node.naturalWidth > 0),
            )
            .toBe(true);
        await page.mouse.move(0, 0);
        await page.screenshot({ path: `${directory}/${id}-${width}.png` });
        await page.setViewportSize({ width, height: 1100 });
      }
      results.push({ width, section: id, geometry, accessibility: true });
    }
    console.log(`PASS proof controls ${width}px`);
  }
  for (const route of ["/", "/vps-amd/"]) {
    const other = await context.newPage();
    await other.setViewportSize({ width: 1440, height: 1100 });
    await other.goto(`${base}${route}`);
    expect(await snapshot(other)).toEqual(content);
    for (const id of sections) {
      const root = other.locator(`#${id}`);
      await expect(
        root.locator("[data-carousel-arrows] button").last(),
      ).toBeVisible();
      await expect(root.locator("[data-carousel-count]")).toHaveClass(
        "sr-only",
      );
      const centered = await root.evaluate((node) => {
        const track = node
          .querySelector("[data-carousel-track]")
          .getBoundingClientRect();
        return [
          ...node.querySelectorAll("[data-carousel-arrows] button"),
        ].every((button) => {
          const box = button.getBoundingClientRect();
          return (
            Math.abs(box.top + box.height / 2 - track.top - track.height / 2) <
            1
          );
        });
      });
      expect(centered).toBe(true);
    }
    await other.close();
  }
  await context.close();
  const plain = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 1100 },
  });
  const fallback = await plain.newPage();
  await fallback.goto(`${base}/thue-vps/`);
  for (const id of sections) {
    const root = fallback.locator(`#${id}`);
    await expect(
      root.locator("[data-carousel-arrows] button").first(),
    ).toBeHidden();
    const track = root.locator("[data-carousel-track]");
    await track.evaluate((node) => {
      node.scrollLeft = node.scrollWidth;
    });
    expect(await track.evaluate((node) => node.scrollLeft)).toBeGreaterThan(0);
  }
  await plain.close();
  expect(errors).toEqual([]);
  await fs.writeFile(
    `${directory}/results.json`,
    JSON.stringify(
      {
        results,
        errors,
        homepageAndAmdMatchVpsControls: true,
        sourceContentEqual: true,
        noJavaScript: true,
      },
      null,
      2,
    ),
  );
  console.log(
    "PASS proof controls: source/order/links, six widths, arrows/keyboard/dots, accessibility, homepage/AMD parity and no-JavaScript",
  );
} finally {
  await browser.close();
}
