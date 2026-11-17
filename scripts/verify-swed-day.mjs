import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.TEST_BASE_URL || "http://localhost:3000";
const directory = "artifacts/swed-day";
await fs.mkdir(directory, { recursive: true });
const browser = await chromium.launch({
  channel: process.env.TEST_BROWSER_CHANNEL || "msedge",
});
const errors = [];
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    permissions: ["clipboard-read", "clipboard-write"],
  });
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.equal((await page.goto(`${base}/swed-day/`)).status(), 200);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator(".site-header")).toHaveCount(1);
  await expect(page.locator("footer")).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://interdata.vn/swed-day/",
  );
  await expect(page.locator("[data-pid]")).toHaveCount(4);
  assert(
    await page
      .locator("#hot-deals")
      .evaluate(
        (el) =>
          el.compareDocumentPosition(document.querySelector("#flash-sale")) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ),
  );
  const feed = await (
    await fetch("https://support.interdata.vn/packages.php?gid=94&module")
  ).json();
  for (const [index, cycle] of [
    "annually",
    "biennially",
    "triennially",
  ].entries()) {
    await page
      .getByRole("group", { name: "Chọn chu kỳ thanh toán" })
      .getByRole("button")
      .nth(index)
      .click();
    for (const source of feed.products) {
      const card = page.locator(`[data-pid="${source.pid}"]`);
      await expect(card).toContainText(
        `${Number(source.pricing.VND[cycle]).toLocaleString("vi-VN")}đ`,
      );
      if (source.quantity_available > 0)
        await expect(
          card.getByRole("link", { name: /^Đăng ký/ }),
        ).toHaveAttribute(
          "href",
          `${source.product_url}&billingcycle=${cycle}`,
        );
      else
        await expect(
          card.getByRole("button", { name: "Tạm hết hàng" }),
        ).toBeDisabled();
    }
  }
  await page.locator('[data-pid="508"] summary').click();
  await expect(page.locator('[data-pid="508"] details')).toContainText("IPv4");
  for (const [index, code] of [
    "SWED-VPS12T",
    "SWED-VPS24T",
    "SWED-VPS36T",
  ].entries()) {
    await page
      .getByRole("button", { name: `Sao chép mã ${code}`, exact: true })
      .click();
    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toBe(code);
    await expect(
      page.locator("#flash-sale article").nth(index).getByRole("status"),
    ).toHaveText("Đã sao chép mã!");
    await page
      .getByRole("link", { name: `Chọn gói ${index + 1} năm`, exact: true })
      .click();
    await expect(
      page
        .getByRole("group", { name: "Chọn chu kỳ thanh toán" })
        .getByRole("button")
        .nth(index),
    ).toHaveAttribute("aria-pressed", "true");
  }
  await page.evaluate(() => {
    navigator.clipboard.writeText = async () => {
      throw new Error("Clipboard denied");
    };
  });
  await page
    .getByRole("button", { name: "Sao chép mã SWED-VPS12T", exact: true })
    .click();
  await expect(
    page.locator("#flash-sale article").first().getByRole("status"),
  ).toContainText("Chưa sao chép được");
  // Real timer boundaries in a device timezone unrelated to Vietnam.
  await page.clock.install({ time: new Date("2026-11-18T09:59:59+07:00") });
  await page.reload();
  await page.clock.runFor(500);
  await expect(page.locator('[role="timer"]')).toContainText("--");
  await page.clock.runFor(500);
  await expect(
    page.getByText("Đang diễn ra · Kết thúc sau", { exact: true }),
  ).toBeVisible();
  await expect(page.locator('[role="timer"]')).toContainText("03");
  await page.clock.setSystemTime(new Date("2026-11-18T13:00:00+07:00"));
  await page.clock.runFor(1000);
  await expect(
    page.getByText("Phiên ưu đãi tiếp theo bắt đầu sau", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Thứ Tư, 25/11/2026", { exact: false }),
  ).toBeVisible();
  await page.clock.resume();
  await page.evaluate(() => window.scrollTo(0, 0));
  for (const width of [320, 375, 390, 640, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `Page overflow at ${width}px`,
    );
    if (width < 640) {
      const slider = page.locator("[data-pricing-slider]");
      await slider.scrollIntoViewIfNeeded();
      assert(await slider.evaluate((el) => el.scrollWidth > el.clientWidth));
      await slider.evaluate((el) => (el.scrollLeft = el.scrollWidth));
      await expect(page.locator('[data-pid="511"]')).toBeInViewport();
      await slider.evaluate((el) => (el.scrollLeft = 0));
    }
    const a11y = await new AxeBuilder({ page })
      .include("#main-content")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    await fs.writeFile(
      `${directory}/axe-${width}.json`,
      JSON.stringify(a11y.violations, null, 2),
    );
    assert.deepEqual(
      a11y.violations.map(({ id, nodes }) => ({
        id,
        targets: nodes.map((n) => n.target),
      })),
      [],
      `Accessibility at ${width}px`,
    );
    if ([390, 768, 1440].includes(width)) {
      await page.evaluate(() => {
        if (document.activeElement instanceof HTMLElement)
          document.activeElement.blur();
        window.scrollTo(0, 0);
      });
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
      await page.screenshot({
        path: `${directory}/${width}.png`,
        fullPage: true,
      });
    }
  }
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await noJs.newPage();
  await staticPage.goto(`${base}/swed-day/`);
  await expect(staticPage.locator("[data-pid]")).toHaveCount(4);
  await expect(staticPage.locator("#flash-sale")).toContainText("SWED-VPS36T");
  await expect(staticPage.locator("#dieu-kien")).toContainText("Mã ONE TIME");
  assert.deepEqual(errors, []);
  console.log(
    "SWED DAY: live API prices/stock, billing links, coupon clipboard, timer rollover, no-JS content, 8 viewport widths and WCAG A/AA passed.",
  );
} finally {
  await browser.close();
}
