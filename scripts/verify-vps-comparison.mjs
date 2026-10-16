import fs from "node:fs/promises";
import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.TEST_BASE_URL || "http://localhost:3100";
const directory =
  process.env.VPS_COMPARISON_QA_DIRECTORY || "artifacts/vps-comparison";
const data = JSON.parse(await fs.readFile("src/data/vps-content.json", "utf8"));
await fs.mkdir(directory, { recursive: true });
const browser = await chromium.launch();
const results = [];
const errors = [];
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1100 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  expect((await page.goto(`${base}/thue-vps/`)).status()).toBe(200);
  await expect(page.locator("#vps-technical-details > summary")).toHaveCount(0);
  await page.evaluate(() => document.fonts.ready);
  const section = page.locator(
    'section[aria-labelledby="vps-comparison-title"]',
  );
  const rail = page.locator("#vps-comparison-scroll");
  const next = section.getByRole("button", { name: "Xem dòng VPS tiếp theo" });
  const previous = section.getByRole("button", { name: "Xem dòng VPS trước" });
  await expect(next).toBeVisible();
  await expect(section.locator("img")).toHaveCount(0);
  await expect(section.locator("thead th[data-service]")).toHaveText(
    data.comparison.columns.map((column) => new RegExp(column.label)),
  );
  for (let index = 0; index < data.comparison.rows.length; index++) {
    const source = data.comparison.rows[index];
    const row = section.locator("tbody tr").nth(index);
    await expect(row.locator("th")).toHaveText(source.criteria);
    await expect(row.locator("td")).toHaveText(
      data.comparison.columns.map((column) => source[column.key]),
    );
  }
  for (const column of data.comparison.columns) {
    const source = data.pricing.services.find(
      (item) => item.name === column.label || item.title === column.label,
    );
    const gid = { amd: 67, platinum: 29, gold: 20, linux: 3 }[column.key];
    const href = (
      source || data.pricing.services.find((item) => item.gid === gid)
    ).href;
    const links = section.getByRole("link", {
      name: `Xem chi tiết ${column.label}`,
      exact: true,
    });
    await expect(links).toHaveCount(2);
    for (const link of await links.all())
      await expect(link).toHaveAttribute("href", href);
  }

  for (const width of [320, 390, 639, 640, 768, 899, 900, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1100 });
    await rail.evaluate((node) => {
      node.scrollLeft = 0;
    });
    await expect(previous).toBeDisabled();
    await section.scrollIntoViewIfNeeded();
    const metrics = await rail.evaluate((node) => {
      const bounds = node.getBoundingClientRect();
      const cells = [...node.querySelectorAll("thead th")].map((cell) => {
        const rect = cell.getBoundingClientRect();
        return { left: rect.left, right: rect.right, width: rect.width };
      });
      return {
        viewport: window.innerWidth,
        pageWidth: document.documentElement.scrollWidth,
        railWidth: node.clientWidth,
        scrollWidth: node.scrollWidth,
        stickyLeft: cells[0].left,
        visible: cells
          .slice(1)
          .filter(
            (cell) =>
              cell.left >= cells[0].right - 1 &&
              cell.right <= bounds.left + node.clientWidth + 1,
          ).length,
        columns: cells,
      };
    });
    expect(metrics.pageWidth).toBeLessThanOrEqual(width);
    expect(metrics.visible).toBe(width < 640 ? 1 : width < 900 ? 2 : 3);
    expect(metrics.scrollWidth).toBeGreaterThan(metrics.railWidth);
    const headerLinks = await section.locator("thead a").evaluateAll((nodes) =>
      nodes.map((node) => {
        const rect = node.getBoundingClientRect();
        return { width: rect.width, height: rect.height, top: rect.top };
      }),
    );
    expect(
      Math.max(...headerLinks.map((link) => link.width)) -
        Math.min(...headerLinks.map((link) => link.width)),
    ).toBeLessThan(1);
    expect(
      Math.max(...headerLinks.map((link) => link.top)) -
        Math.min(...headerLinks.map((link) => link.top)),
    ).toBeLessThan(1);
    for (const link of headerLinks)
      expect(link.height).toBeGreaterThanOrEqual(44);
    await next.click();
    await expect
      .poll(() => rail.evaluate((node) => node.scrollLeft))
      .toBeGreaterThan(10);
    const stickyAfter = await section
      .locator("thead th")
      .first()
      .evaluate((node) => node.getBoundingClientRect().left);
    expect(Math.abs(stickyAfter - metrics.stickyLeft)).toBeLessThan(1);
    await rail.focus();
    await page.keyboard.press("End");
    await expect(next).toBeDisabled();
    await expect(section.getByText(new RegExp(`4 / 4 dòng VPS`))).toBeVisible();
    await page.keyboard.press("Home");
    await expect(previous).toBeDisabled();
    await page.keyboard.press("ArrowRight");
    await expect(previous).toBeEnabled();
    await page.keyboard.press("ArrowLeft");
    await expect(previous).toBeDisabled();
    for (const link of await section.locator("thead a").all()) {
      await link.focus();
      const visibleFocus = await link.evaluate((node) => {
        const viewport = node.closest('[role="region"]');
        const bounds = viewport.getBoundingClientRect();
        const sticky = viewport
          .querySelector("thead th")
          .getBoundingClientRect();
        const rect = node.getBoundingClientRect();
        return (
          rect.left >= sticky.right - 1 &&
          rect.right <= bounds.left + viewport.clientWidth + 1
        );
      });
      expect(visibleFocus).toBe(true);
    }
    await rail.focus();
    await page.keyboard.press("Home");
    if ([320, 390, 768, 1024, 1440, 1920].includes(width)) {
      const axe = await new AxeBuilder({ page })
        .include('section[aria-labelledby="vps-comparison-title"]')
        .analyze();
      expect(axe.violations).toEqual([]);
      // Hide floating site chrome only in evidence screenshots.
      await page.addStyleTag({
        content:
          'header.site-header, nav[aria-label="Liên hệ nhanh và tiện ích"] { visibility: hidden !important; }',
      });
      await rail.evaluate((node) => node.blur());
      await section.screenshot({ path: `${directory}/section-${width}.png` });
    }
    results.push({ width, metrics, headerLinks });
  }

  await page.setViewportSize({ width: 1440, height: 1100 });
  await rail.focus();
  await page.keyboard.press("Home");
  await section.scrollIntoViewIfNeeded();
  const box = await section.locator("tbody td").first().boundingBox();
  await page.mouse.move(box.x + box.width - 25, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + 15, box.y + box.height / 2, { steps: 12 });
  await page.mouse.up();
  expect(await rail.evaluate((node) => node.scrollLeft)).toBeGreaterThan(100);
  // A subsequent ordinary click still follows its link after dragging.
  await page.keyboard.press("Home");
  let requested = false;
  await context.route("https://interdata.vn/vps-amd/", async (route) => {
    requested = true;
    await route.fulfill({
      status: 200,
      contentType: "text/html",
      body: "<title>Link verified</title>",
    });
  });
  await section
    .getByRole("link", { name: "Xem chi tiết VPS AMD", exact: true })
    .first()
    .click();
  await expect.poll(() => requested).toBe(true);
  await context.close();

  const mobile = await browser.newContext({
    viewport: { width: 390, height: 960 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: "reduce",
  });
  const touchPage = await mobile.newPage();
  await touchPage.goto(`${base}/thue-vps/`);
  await expect(
    touchPage.locator("#vps-technical-details > summary"),
  ).toHaveCount(0);
  const touchRail = touchPage.locator("#vps-comparison-scroll");
  const touchCell = touchRail.locator("tbody td").first();
  await touchCell.scrollIntoViewIfNeeded();
  const touchBox = await touchCell.boundingBox();
  const session = await mobile.newCDPSession(touchPage);
  async function swipe(from, to) {
    await session.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [from],
    });
    for (let step = 1; step <= 12; step++) {
      await session.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [
          {
            x: from.x + ((to.x - from.x) * step) / 12,
            y: from.y + ((to.y - from.y) * step) / 12,
          },
        ],
      });
      await new Promise((resolve) => setTimeout(resolve, 16));
    }
    await session.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
  }
  await swipe(
    { x: touchBox.x + touchBox.width - 20, y: touchBox.y + 20 },
    { x: touchBox.x + 20, y: touchBox.y + 20 },
  );
  await expect
    .poll(() => touchRail.evaluate((node) => node.scrollLeft))
    .toBeGreaterThan(80);
  const verticalBefore = await touchPage.evaluate(() => window.scrollY);
  await swipe({ x: 230, y: 720 }, { x: 230, y: 420 });
  await expect
    .poll(() => touchPage.evaluate(() => window.scrollY))
    .toBeGreaterThan(verticalBefore + 30);
  await mobile.close();

  const noJs = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 960 },
  });
  const fallback = await noJs.newPage();
  await fallback.goto(`${base}/thue-vps/`);
  await expect(
    fallback.locator("#vps-technical-details > summary"),
  ).toHaveCount(0);
  const nativeRail = fallback.locator("#vps-comparison-scroll");
  await expect(nativeRail).toBeVisible();
  await expect(
    fallback.getByRole("button", { name: "Xem dòng VPS tiếp theo" }),
  ).toBeHidden();
  await nativeRail.evaluate((node) => {
    node.scrollLeft = node.scrollWidth;
  });
  expect(await nativeRail.evaluate((node) => node.scrollLeft)).toBeGreaterThan(
    0,
  );
  await expect(
    fallback.locator('#vps-comparison-scroll thead th[data-service="linux"]'),
  ).toBeVisible();
  await noJs.close();
  expect(errors).toEqual([]);
  await fs.writeFile(
    `${directory}/results.json`,
    JSON.stringify(
      {
        results,
        errors,
        mouseDrag: true,
        touchSwipe: true,
        verticalTouchScroll: true,
        links: true,
        noJavaScript: true,
      },
      null,
      2,
    ),
  );
  console.log(
    `PASS comparison: ${results.length} widths, source cells/links, mouse drag, keyboard, accessibility, no JavaScript`,
  );
} finally {
  await browser.close();
}
