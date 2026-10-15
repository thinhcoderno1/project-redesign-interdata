import fs from "node:fs/promises";
import assert from "node:assert/strict";
import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.TEST_BASE_URL || "http://localhost:3101";
const directory =
  process.env.VPS_RANGE_QA_DIRECTORY || "artifacts/vps-range-slider/qa";
await fs.mkdir(directory, { recursive: true });
const data = JSON.parse(await fs.readFile("src/data/vps-content.json", "utf8"));
const names = ["AMD", "Platinum", "Gold", "Linux", "n8n", "Vibe Coding"];
const ids = ["amd", "platinum", "gold", "linux", "n8n", "vibe"];
const images = [
  "vps-amd.jpg",
  "vps-platinum.jpg",
  "vps-gold.jpg",
  "vps-linux.jpg",
  "vps-n8n.jpg",
  "vps-vibe-coding.jpg",
];
const hrefs = [67, 29, 20, 3].map(
  (gid) => data.pricing.services.find((s) => s.gid === gid).href,
);
hrefs.push(
  "https://interdata.vn/vps-n8n/",
  "https://interdata.vn/vps-vibe-coding/",
);
const browser = await chromium.launch();
const results = [];
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1100 },
    reducedMotion: "reduce",
    hasTouch: true,
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  expect(
    (
      await page.goto(`${base}/thue-vps/`, { waitUntil: "networkidle" })
    ).status(),
  ).toBe(200);
  await page.evaluate(() => document.fonts.ready);
  const section = page.locator('section[aria-labelledby="vps-range-title"]');
  const tabs = section.getByRole("tab");
  const active = () => section.getByRole("tabpanel");
  await expect(tabs).toHaveText(names.map((n) => `VPS ${n}`));
  await expect(section.locator("article")).toHaveCount(6);
  assert.deepEqual(
    await section
      .locator("article")
      .evaluateAll((nodes) => nodes.map((n) => n.dataset.vpsService)),
    ids,
  );
  async function selected(index) {
    await expect(tabs.nth(index)).toHaveAttribute("aria-selected", "true");
    await expect(active()).toHaveCount(1);
    await expect(active()).toHaveAttribute(
      "id",
      `vps-range-panel-${ids[index]}`,
    );
    await expect(active().locator("h3")).toHaveText(`VPS ${names[index]}`);
    await expect(active().locator("ul,li")).toHaveCount(0);
    await expect(active().locator("p")).toHaveCount(1);
    await expect(active().locator("a")).toHaveAttribute("href", hrefs[index]);
    await expect(section.getByRole("link")).toHaveCount(1);
    const src = new URL(
      await active().locator("img").getAttribute("src"),
      base,
    );
    expect(src.searchParams.get("url") || src.pathname).toBe(
      `/images/vps/range-slider-v1/${images[index]}`,
    );
    await expect
      .poll(() =>
        active()
          .locator("img")
          .evaluate((img) => img.complete && img.naturalWidth > 0),
      )
      .toBe(true);
  }
  await selected(0);
  for (let i = 0; i < ids.length; i++) {
    expect(
      (
        await page.request.get(
          `${base}/images/vps/range-slider-v1/${images[i]}`,
        )
      ).status(),
    ).toBe(200);
    await tabs.nth(i).click();
    await selected(i);
    await expect(tabs.nth(i)).toHaveAttribute(
      "aria-controls",
      await active().getAttribute("id"),
    );
    await expect(active()).toHaveAttribute(
      "aria-labelledby",
      await tabs.nth(i).getAttribute("id"),
    );
  }
  await expect(active()).toContainText("Chỉ hỗ trợ mã nguồn EzyPlatform");
  await section
    .getByRole("button", { name: "Dòng VPS tiếp theo", exact: true })
    .click();
  await selected(0);
  await section
    .getByRole("button", { name: "Dòng VPS trước", exact: true })
    .click();
  await selected(5);
  await tabs.nth(5).focus();
  await page.keyboard.press("ArrowRight");
  await selected(0);
  await expect(tabs.nth(0)).toBeFocused();
  await page.keyboard.press("End");
  await selected(5);
  await expect(tabs.nth(5)).toBeFocused();
  await page.keyboard.press("Home");
  await selected(0);
  await page.keyboard.press("ArrowLeft");
  await selected(5);
  await page.keyboard.press("Tab");
  await expect(
    section.getByRole("button", { name: "Dòng VPS tiếp theo", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(active().locator("a")).toBeFocused();
  await tabs.nth(0).click();
  const previous = await tabs.nth(0).getAttribute("aria-selected");
  await page.waitForTimeout(1200);
  expect(await tabs.nth(0).getAttribute("aria-selected")).toBe(previous);
  console.log(
    "PASS six services, exact links, tab/panel semantics, arrows, wraparound, keyboard, focus, no autoplay",
  );

  for (const width of [
    320, 390, 639, 640, 768, 899, 900, 1024, 1199, 1200, 1440, 1920,
  ]) {
    await page.setViewportSize({ width, height: 1100 });
    let height;
    for (let i = 0; i < ids.length; i++) {
      await tabs.nth(i).click();
      await selected(i);
      const geometry = await active().evaluate((panel) => {
        const r = (n) => {
          const b = n.getBoundingClientRect();
          return {
            x: b.x,
            y: b.y,
            right: b.right,
            bottom: b.bottom,
            width: b.width,
            height: b.height,
          };
        };
        return {
          panel: r(panel),
          children: [...panel.querySelectorAll("h3,p,a")].map(r),
          scrollWidth: document.documentElement.scrollWidth,
          transition: getComputedStyle(panel).transitionDuration,
        };
      });
      expect(geometry.scrollWidth).toBeLessThanOrEqual(width);
      expect(geometry.panel.x).toBeGreaterThanOrEqual(0);
      expect(geometry.panel.right).toBeLessThanOrEqual(width + 1);
      for (const child of geometry.children) {
        expect(child.x).toBeGreaterThanOrEqual(geometry.panel.x);
        expect(child.right).toBeLessThanOrEqual(geometry.panel.right);
        expect(child.bottom).toBeLessThanOrEqual(geometry.panel.bottom);
      }
      if (height === undefined) height = geometry.panel.height;
      expect(geometry.panel.height).toBeCloseTo(height, 1);
      expect(geometry.transition).toBe("0s");
      expect(
        (await active().locator("a").boundingBox()).height,
      ).toBeGreaterThanOrEqual(44);
      const selectedTab = await tabs.nth(i).boundingBox();
      const list = await section.getByRole("tablist").boundingBox();
      expect(selectedTab.x).toBeGreaterThanOrEqual(list.x - 1);
      expect(selectedTab.x + selectedTab.width).toBeLessThanOrEqual(
        list.x + list.width + 1,
      );
    }
    if ([320, 390, 768, 1024, 1440, 1920].includes(width)) {
      const audit = await new AxeBuilder({ page }).analyze();
      expect(
        audit.violations.map((v) => ({
          id: v.id,
          targets: v.nodes.map((n) => n.target),
        })),
      ).toEqual([]);
      await section.screenshot({ path: `${directory}/vibe-${width}.png` });
      await tabs.nth(0).click();
      await section.screenshot({ path: `${directory}/amd-${width}.png` });
    }
    results.push({
      width,
      stableSlideHeight: height,
      servicesChecked: ids.length,
    });
    console.log(
      `PASS ${width}: all six slides, fixed height, readable content, tabs in view, no overflow`,
    );
  }
  await page.setViewportSize({ width: 390, height: 1100 });
  await tabs.nth(0).click();
  await active().scrollIntoViewIfNeeded();
  const touch = await context.newCDPSession(page);
  async function swipe(direction, vertical = false) {
    const bounds = await active().boundingBox();
    const y = Math.max(190, bounds.y + 100);
    const x = direction < 0 ? 300 : 90;
    await touch.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x, y }],
    });
    for (let n = 1; n <= 5; n++) {
      await touch.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [
          {
            x: vertical ? x : x + direction * n * 30,
            y: vertical ? y - n * 20 : y,
          },
        ],
      });
    }
    await touch.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
  }
  await swipe(-1);
  await selected(1);
  await swipe(1);
  await selected(0);
  await swipe(-1, true);
  await selected(0);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  expect(
    await active().evaluate((n) => getComputedStyle(n).transitionDuration),
  ).toContain("0.4s");
  await page.emulateMedia({ reducedMotion: "reduce" });
  console.log(
    "PASS real touch swipe in both directions, vertical scrolling, reduced motion",
  );

  const noJs = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 1000 },
  });
  const staticPage = await noJs.newPage();
  await staticPage.goto(`${base}/thue-vps/`);
  const staticSection = staticPage.locator(
    'section[aria-labelledby="vps-range-title"]',
  );
  await expect(staticSection.locator("article")).toHaveCount(6);
  await expect(staticSection.getByRole("tablist")).toHaveCount(0);
  await expect(staticSection.getByRole("link")).toHaveCount(6);
  await expect(staticSection.locator("ul,li")).toHaveCount(0);
  await expect(
    staticSection.locator('article[data-vps-service="vibe"] p'),
  ).toContainText("Chỉ hỗ trợ mã nguồn EzyPlatform");
  for (let i = 0; i < 6; i++) {
    const card = staticSection.locator("article").nth(i);
    await card.scrollIntoViewIfNeeded();
    await expect(card).toBeVisible();
    await expect(card.locator("h3")).toHaveText(`VPS ${names[i]}`);
    await expect(card.locator("a")).toHaveAttribute("href", hrefs[i]);
    await expect
      .poll(() =>
        card
          .locator("..")
          .locator("img")
          .evaluate((n) => n.complete && n.naturalWidth > 0),
      )
      .toBe(true);
  }
  expect(
    await staticPage.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
  expect(errors).toEqual([]);
  await fs.writeFile(
    `${directory}/results.json`,
    JSON.stringify(
      {
        base,
        results,
        allServiceLinks: hrefs,
        tabKeyboardAndFocus: true,
        touchSwipe: true,
        noAutoplay: true,
        noJavaScript: true,
        reducedMotion: true,
        pageErrors: errors,
      },
      null,
      2,
    ),
  );
  console.log(
    "PASS no-JavaScript: all six services and links accessible, all images loaded",
  );
} finally {
  await browser.close();
}
