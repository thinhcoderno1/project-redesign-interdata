import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";

const base = process.env.TEST_BASE_URL || "http://localhost:3100";
const bannerLinks = (root) =>
  root.getByRole("link").and(root.locator("[data-promotion-link]"));
const expectedImages = [
  "/images/promotion/vps-cloud-warm.webp",
  "/images/promotion/vps-platinum-viettel-idc.jpg",
  "/images/promotion/vps-n8n.jpg",
  "/images/promotion/vps-vibe-coding.jpg",
];
await fs.mkdir("artifacts", { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
try {
  for (const width of [320, 390, 768, 1024, 1100, 1440, 1920]) {
    const context = await browser.newContext({
      viewport: { width, height: 960 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(base, { waitUntil: "domcontentloaded" });
    const root = page.locator('#uu-dai [aria-roledescription="slideshow"]');
    await expect(root).toHaveAttribute("data-enhanced", "true");
    await root.scrollIntoViewIfNeeded();
    expect(
      await root.evaluate((element) => {
        const css = getComputedStyle(element);
        return {
          background: css.backgroundColor,
          border: css.borderTopWidth,
          padding: css.paddingTop,
          shadow: css.boxShadow,
        };
      }),
    ).toEqual({
      background: "rgba(0, 0, 0, 0)",
      border: "0px",
      padding: "0px",
      shadow: "none",
    });
    await expect(
      root.getByRole("link", { name: "Xem tất cả ưu đãi" }),
    ).toHaveCount(0);
    await expect(root.locator("article, h2, h3, p")).toHaveCount(0);
    await expect(root.getByText(/^\d{2}\s*\/\s*\d{2}$/)).toHaveCount(0);
    expect(
      await root
        .locator("#promotion-slides")
        .locator("..")
        .evaluate((element) =>
          parseFloat(getComputedStyle(element).borderTopLeftRadius),
        ),
    ).toBe(width < 640 ? 8 : 12);
    const slides = root.locator('[aria-roledescription="slide"]');
    await expect(slides).toHaveCount(4);
    await expect(bannerLinks(root)).toHaveCount(1);
    for (let index = 0; index < 4; index++) {
      const thumbnail = root.getByRole("button", {
        name: new RegExp(`^Xem banner ${index + 1}:`),
      });
      await thumbnail.click();
      await expect(thumbnail).toHaveAttribute("aria-current", "true");
      await expect(root).toHaveAttribute(
        "data-active-slide",
        String(index + 1),
      );
      await expect(bannerLinks(root)).toHaveCount(1);
      const link = bannerLinks(root);
      await expect(link).toHaveAttribute(
        "href",
        "https://interdata.vn/canhme/",
      );
      const image = link.locator("img");
      expect(
        new URL(await image.getAttribute("src"), base).searchParams.get("url"),
      ).toBe(expectedImages[index]);
      await expect
        .poll(() =>
          image.evaluate((img) => img.complete && img.naturalWidth > 0),
        )
        .toBe(true);
      const imageBox = await image.boundingBox();
      expect(imageBox.width / imageBox.height).toBeCloseTo(2048 / 432, 2);
      expect(
        await image.evaluate((img) => getComputedStyle(img).objectFit),
      ).toBe("contain");
      const viewportBox = await root
        .locator("#promotion-slides")
        .locator("..")
        .boundingBox();
      expect(imageBox.x).toBeCloseTo(viewportBox.x, 1);
      expect(imageBox.width).toBeCloseTo(viewportBox.width, 1);
    }
    await root
      .getByRole("button", { name: "Banner tiếp theo", exact: true })
      .click();
    await expect(root).toHaveAttribute("data-active-slide", "1");
    await root
      .getByRole("button", { name: "Banner trước", exact: true })
      .click();
    await expect(root).toHaveAttribute("data-active-slide", "4");
    await bannerLinks(root).first().focus();
    await page.keyboard.press("ArrowRight");
    await expect(root).toHaveAttribute("data-active-slide", "1");
    await expect(bannerLinks(root).first()).toBeFocused();
    await page.keyboard.press("ArrowLeft");
    await expect(root).toHaveAttribute("data-active-slide", "4");
    await expect(root.getByRole("button")).toHaveCount(6);
    await expect(
      root.getByRole("button", { name: /Tạm dừng|Phát tự động/ }),
    ).toHaveCount(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await root.getByRole("button", { name: /^Xem banner 1:/ }).click();
    const visibleBox = await root
      .locator('[data-promotion-page="0"] [data-promotion-link]')
      .first()
      .boundingBox();
    const frameBox = await root
      .locator("#promotion-slides")
      .locator("..")
      .boundingBox();
    expect(visibleBox.x).toBeCloseTo(frameBox.x, 1);
    const previousBox = await root
      .getByRole("button", { name: "Banner trước", exact: true })
      .boundingBox();
    const nextBox = await root
      .getByRole("button", { name: "Banner tiếp theo", exact: true })
      .boundingBox();
    const inset = width < 640 ? 8 : 12;
    expect(previousBox.x - frameBox.x).toBeCloseTo(inset, 1);
    expect(frameBox.x + frameBox.width - nextBox.x - nextBox.width).toBeCloseTo(
      inset,
      1,
    );
    for (const box of [previousBox, nextBox]) {
      expect(box.y + box.height / 2).toBeCloseTo(
        frameBox.y + frameBox.height / 2,
        1,
      );
    }
    await root.screenshot({ path: `artifacts/promotions-${width}.png` });
    const accessibility = await new AxeBuilder({ page })
      .include("#uu-dai")
      .analyze();
    expect(accessibility.violations).toEqual([]);
    expect(errors).toEqual([]);
    results.push({
      width,
      layout: "passed",
      controls: "passed",
      accessibility: "passed",
    });
    console.log(`PASS ${width}px: layout, controls, accessibility`);
    await context.close();
  }

  const page = await browser.newPage({
    viewport: { width: 1440, height: 960 },
  });
  await page.clock.install();
  await page.goto(base, { waitUntil: "domcontentloaded" });
  const root = page.locator('#uu-dai [aria-roledescription="slideshow"]');
  await expect(root).toHaveAttribute("data-enhanced", "true");
  await root.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await expect(root).toHaveAttribute("data-playing", "true");
  for (const slide of [2, 3, 4, 1]) {
    await page.clock.fastForward(6100);
    await expect(root).toHaveAttribute("data-active-slide", String(slide));
    await expect
      .poll(async () => {
        const imageBox = await root
          .locator(
            `[data-promotion-page="${Number(await root.getAttribute("data-active-slide")) - 1}"] [data-promotion-link]`,
          )
          .first()
          .boundingBox();
        const viewportBox = await root
          .locator("#promotion-slides")
          .locator("..")
          .boundingBox();
        return Math.abs(imageBox.x - viewportBox.x);
      })
      .toBeLessThan(1);
  }
  await root.hover();
  await expect(root).not.toHaveAttribute("data-playing", "true");
  await page.clock.fastForward(13000);
  await expect(root).toHaveAttribute("data-active-slide", "1");
  await page.mouse.move(0, 0);
  await bannerLinks(root).first().focus();
  await page.clock.fastForward(13000);
  await expect(root).toHaveAttribute("data-active-slide", "1");
  await page.mouse.move(0, 0);
  await page.evaluate(() => document.activeElement.blur());
  await expect(root).toHaveAttribute("data-playing", "true");
  await page.clock.fastForward(6100);
  await expect(root).toHaveAttribute("data-active-slide", "2");
  await root.getByRole("button", { name: /^Xem banner 1:/ }).click();
  await expect(root).toHaveAttribute("data-active-slide", "1");
  await page.clock.fastForward(13000);
  await expect(root).toHaveAttribute("data-active-slide", "1");
  await page.mouse.move(0, 0);
  await page.evaluate(() => document.activeElement.blur());
  await expect(root).toHaveAttribute("data-playing", "true");
  await page.clock.fastForward(6100);
  await expect(root).toHaveAttribute("data-active-slide", "2");
  await page.locator("footer").scrollIntoViewIfNeeded();
  await expect(root).not.toHaveAttribute("data-playing", "true");
  await page.clock.fastForward(13000);
  await expect(root).toHaveAttribute("data-active-slide", "2");
  await root.scrollIntoViewIfNeeded();
  await expect(root).toHaveAttribute("data-playing", "true");
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(root).not.toHaveAttribute("data-playing", "true");
  await page.clock.fastForward(13000);
  await expect(root).toHaveAttribute("data-active-slide", "2");
  await page.evaluate(() => {
    delete document.hidden;
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(root).toHaveAttribute("data-playing", "true");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(root).not.toHaveAttribute("data-playing", "true");
  await page.clock.fastForward(13000);
  await expect(root).toHaveAttribute("data-active-slide", "2");
  results.push({
    autoplay: "passed",
    wraparound: "passed",
    resumeAfterManualSelection: "passed",
    hoverFocus: "passed",
    visibility: "passed",
    reducedMotion: "passed",
  });
  await page.close();

  const touch = await browser.newPage({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    reducedMotion: "reduce",
  });
  await touch.goto(base, { waitUntil: "domcontentloaded" });
  const touchRoot = touch.locator('#uu-dai [aria-roledescription="slideshow"]');
  await expect(touchRoot).toHaveAttribute("data-enhanced", "true");
  await touchRoot.scrollIntoViewIfNeeded();
  const viewport = touchRoot.locator("#promotion-slides").locator("..");
  const box = await viewport.boundingBox();
  const cdp = await touch.context().newCDPSession(touch);
  const y = box.y + box.height / 2;
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: box.x + box.width * 0.8, y }],
  });
  for (const fraction of [0.65, 0.5, 0.35, 0.2])
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: box.x + box.width * fraction, y }],
    });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect(touchRoot).toHaveAttribute("data-active-slide", "2");
  expect(touch.url()).toBe(`${base}/`);
  results.push({ touchSwipe: "passed", accidentalNavigation: "passed" });
  await touch.close();

  const fallback = await browser.newPage({
    viewport: { width: 390, height: 844 },
    javaScriptEnabled: false,
  });
  await fallback.goto(base, { waitUntil: "domcontentloaded" });
  const fallbackRoot = fallback.locator(
    '#uu-dai [aria-roledescription="slideshow"]',
  );
  await expect(bannerLinks(fallbackRoot)).toHaveCount(4);
  await expect(fallbackRoot.getByRole("button")).toHaveCount(0);
  for (const link of await bannerLinks(fallbackRoot).all()) {
    await link.focus();
    await expect(link).toBeInViewport();
  }
  expect(
    await fallback.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  results.push({ noJavaScript: "passed" });
  await fallback.close();
  await fs.writeFile(
    "artifacts/promotions-qa.json",
    JSON.stringify(results, null, 2),
  );
  console.log(JSON.stringify(results, null, 2));
} finally {
  await browser.close();
}
