import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";

const base = process.env.TEST_BASE_URL || "http://localhost:3100";
const browser = await chromium.launch();
const results = [];
const menus = [
  {
    name: "Về chúng tôi",
    id: "about-topbar-navigation",
    items: [
      ["Giới thiệu", "https://interdata.vn/about-us"],
      ["Liên hệ", "https://interdata.vn/contact"],
    ],
  },
  {
    name: "Tài khoản",
    id: "account-topbar-navigation",
    items: [
      ["Đăng ký", "https://support.interdata.vn/register.php"],
      ["Đăng nhập", "https://support.interdata.vn/index.php?rp=/login"],
    ],
  },
];

await fs.mkdir("artifacts/topbar-navigation", { recursive: true });
try {
  for (const width of [320, 390, 768, 960, 1024, 1440]) {
    const touch = width < 960;
    const context = await browser.newContext({
      viewport: { width, height: 960 },
      hasTouch: touch,
      isMobile: touch,
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(base, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const utility = page.locator(".utility");
    const left = utility.getByRole("navigation", {
      name: "Thông tin InterData",
    });
    const right = utility.getByRole("navigation", {
      name: "Tài khoản và hỗ trợ",
    });
    expect(
      await left.locator(":scope > a, :scope > div > button").allTextContents(),
    ).toEqual(["Về chúng tôi ", "Tuyển Dụng", "Hợp tác"]);
    expect(
      await right
        .locator(":scope > a, :scope > div > button")
        .allTextContents(),
    ).toEqual(["Tài khoản ", "Gửi yêu cầu hỗ trợ"]);
    await expect(
      left.getByRole("link", { name: "Tuyển Dụng", exact: true }),
    ).toHaveAttribute("href", "https://interdata.vn/blog/tuyen-dung/");
    await expect(
      left.getByRole("link", { name: "Hợp tác", exact: true }),
    ).toHaveAttribute("href", "https://interdata.vn/contact");
    await expect(
      right.getByRole("link", { name: "Gửi yêu cầu hỗ trợ", exact: true }),
    ).toHaveAttribute("href", "https://support.interdata.vn/submitticket.php");
    await expect(utility).not.toContainText(
      "Hạ tầng máy chủ cho doanh nghiệp Việt",
    );
    expect(
      await utility.evaluate(
        (element) => getComputedStyle(element).backgroundColor,
      ),
    ).toBe("rgb(0, 67, 236)");

    for (const menu of menus) {
      const toggle = utility.getByRole("button", {
        name: menu.name,
        exact: true,
      });
      const popup = page.locator(`#${menu.id}`);
      await expect(popup).toBeHidden();
      await toggle.focus();
      await page.keyboard.press("Enter");
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
      await expect(popup).toBeVisible();
      await page.keyboard.press("Tab");
      await expect(popup.getByRole("link").first()).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(popup).toBeHidden();
      await expect(toggle).toBeFocused();
      await page.locator(".logo").focus();

      if (touch) {
        await toggle.tap();
      } else {
        await toggle.hover();
        await expect(popup).toBeVisible();
        const box = await toggle.boundingBox();
        await page.mouse.move(box.x + 15, box.y + box.height + 4);
        await page.waitForTimeout(200);
        await expect(popup).toBeVisible();
        await popup.getByRole("link").first().hover();
        await page.waitForTimeout(200);
      }
      await expect(popup).toBeVisible();
      await expect(popup.getByRole("link")).toHaveCount(2);
      for (const [name, href] of menu.items) {
        await expect(
          popup.getByRole("link", { name, exact: true }),
        ).toHaveAttribute("href", href);
      }
      const box = await popup.boundingBox();
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
      expect(
        (await new AxeBuilder({ page }).include(".utility").analyze())
          .violations,
      ).toEqual([]);
      if (width === 320 || width === 1440) {
        await page.screenshot({
          path: `artifacts/topbar-navigation/${width}-${menu.id}.png`,
        });
      }
      await page.locator("h1").click();
      await expect(popup).toBeHidden();
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      if (!touch) {
        await toggle.hover();
        await expect(popup).toBeVisible();
        await page.mouse.move(width / 2, 250);
        await expect(popup).toBeHidden();
      }
    }
    const layout = await page.evaluate(() => ({
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      header: document.querySelector(".site-header").getBoundingClientRect()
        .height,
      reservedHeader: parseFloat(
        document.documentElement.style.getPropertyValue("--site-header-height"),
      ),
      targets: [
        ...document.querySelectorAll(
          ".utility-links > a, .utility-menu > button",
        ),
      ].map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          text: element.textContent.trim(),
          x: rect.x,
          right: rect.right,
          height: rect.height,
        };
      }),
    }));
    expect(layout.scrollWidth).toBeLessThanOrEqual(width);
    expect(layout.reservedHeader).toBe(Math.ceil(layout.header));
    for (const target of layout.targets) {
      expect(target.x).toBeGreaterThanOrEqual(0);
      expect(target.right).toBeLessThanOrEqual(width);
      expect(target.height).toBeGreaterThanOrEqual(40);
    }
    expect(errors).toEqual([]);
    results.push({ width, touch, layout, errors });
    await context.close();
  }
  await fs.writeFile(
    "artifacts/topbar-navigation/results.json",
    JSON.stringify(results, null, 2),
  );
  console.log(
    "Top bar: links, hover, touch, keyboard, overflow and accessibility passed at 320–1440px.",
  );
} finally {
  await browser.close();
}
