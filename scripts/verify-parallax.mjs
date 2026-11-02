import { chromium, expect } from "@playwright/test";

// The supplied globe reference uses a static background. Keep this entry point
// to check that scrolling and motion preferences never shift the hero artwork.
const base = process.env.TEST_BASE_URL || "http://localhost:3100";
const browser = await chromium.launch();
try {
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    const page = await browser.newPage({ viewport: { width, height: 1100 } });
    await page.goto(base, { waitUntil: "networkidle" });
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = "auto";
    });
    const hero = page.locator("[data-home-hero]");
    const image = hero.locator("img");
    await image.evaluate((element) => element.decode());
    const measure = () =>
      image.evaluate((element) => {
        const photo = element.getBoundingClientRect();
        const section = element.parentElement.getBoundingClientRect();
        return {
          offset: photo.top - section.top,
          width: photo.width,
          height: photo.height,
          sectionWidth: section.width,
          sectionHeight: section.height,
          transform: getComputedStyle(element).transform,
        };
      });
    const original = await measure();
    expect(original.width).toBe(original.sectionWidth);
    expect(original.height).toBe(original.sectionHeight);
    expect(original.offset).toBe(0);
    expect(original.transform).toBe("none");
    for (const reducedMotion of ["reduce", "no-preference"]) {
      await page.emulateMedia({ reducedMotion });
      await page.evaluate(() => window.scrollTo(0, 180));
      expect(await measure()).toEqual(original);
      await expect(hero.locator(".parallax-background")).toHaveCount(0);
      await page.evaluate(() => window.scrollTo(0, 0));
      expect(await measure()).toEqual(original);
    }
    await page.close();
  }
  console.log(
    "Static hero background passed at 320–1920px: full coverage and stable artwork while scrolling with either motion preference.",
  );
} finally {
  await browser.close();
}
