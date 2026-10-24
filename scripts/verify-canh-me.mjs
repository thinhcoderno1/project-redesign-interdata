import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.TEST_BASE_URL || "http://localhost:3100";
const directory = "artifacts/canh-me";
await fs.mkdir(directory, { recursive: true });
const browser = await chromium.launch({
  channel: process.env.TEST_BROWSER_CHANNEL || "msedge",
});
const errors = [];
const months = {
  monthly: 1,
  quarterly: 3,
  semiannually: 6,
  annually: 12,
  biennially: 24,
  triennially: 36,
};
const groups = [
  { gid: 100, periods: ["annually", "biennially", "triennially"], selected: 0 },
  { gid: 87, periods: ["annually", "biennially", "triennially"], selected: 0 },
  { gid: 89, periods: ["quarterly"], selected: 0 },
  { gid: 96, periods: Object.keys(months), selected: 4 },
];
const pricing = await Promise.all(
  groups.map(async (group) => {
    const response = await fetch(
      `https://support.interdata.vn/packages.php?gid=${group.gid}&module`,
      { signal: AbortSignal.timeout(20000) },
    );
    assert(response.ok);
    return (await response.json()).products.filter(
      (product) => group.gid !== 96 || product.pid !== 518,
    );
  }),
);
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.equal((await page.goto(`${base}/canhme/`)).status(), 200);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator(".site-header")).toHaveCount(1);
  await expect(page.locator("footer")).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://interdata.vn/canhme/",
  );
  await expect(page.locator(".nav-promotion")).toHaveAttribute(
    "href",
    "/canhme/",
  );
  await expect(page.locator(".cm-deal-program")).toHaveCount(4);
  await expect(
    page.locator("#flash-sale, #renewal-bonus, .cm-service-coupons"),
  ).toHaveCount(0);
  for (const [index, group] of groups.entries()) {
    const program = page.locator(".cm-deal-program").nth(index);
    await expect(program.locator(".cm-deal-card")).toHaveCount(
      pricing[index].length,
    );
    if (group.periods.length > 1)
      await expect(
        program.locator(".cm-period-tabs button").nth(group.selected),
      ).toHaveAttribute("aria-pressed", "true");
    for (const [cycleIndex, cycle] of group.periods.entries()) {
      if (group.periods.length > 1)
        await program.locator(".cm-period-tabs button").nth(cycleIndex).click();
      for (const [productIndex, product] of pricing[index].entries()) {
        const card = program.locator(".cm-deal-card").nth(productIndex);
        await expect(card.locator("h3")).toHaveText(product.name);
        const total = Number(product.pricing.VND[cycle]);
        const shown =
          group.gid === 96 ? Math.round(total / months[cycle]) : total;
        await expect(card.locator(".cm-price")).toContainText(
          `${shown.toLocaleString("vi-VN")}đ`,
        );
        const checkout = new URL(await card.locator("a").getAttribute("href"));
        assert.equal(checkout.hostname, "support.interdata.vn");
        assert.equal(checkout.searchParams.get("pid"), String(product.pid));
        assert.equal(checkout.searchParams.get("billingcycle"), cycle);
        if (group.gid === 96)
          await expect(card.locator(".cm-price-summary")).toContainText(
            `${total.toLocaleString("vi-VN")}đ`,
          );
      }
    }
    const disclosure = program.locator(".cm-deal-toggle").first();
    if (await disclosure.count()) {
      await disclosure.click();
      await expect(disclosure).toHaveAttribute("aria-expanded", "true");
      await disclosure.click();
      await expect(disclosure).toHaveAttribute("aria-expanded", "false");
    }
    await program.locator(".cm-program-pricing-toggle").click();
    await expect(program.locator(".cm-deal-grid")).toHaveCount(0);
    await program.locator(".cm-program-pricing-toggle").click();
    await expect(program.locator(".cm-deal-grid")).toHaveCount(1);
  }
  await expect(page.locator(".cm-faq-item")).toHaveCount(16);
  await page.locator(".cm-faq-item summary").first().click();
  await expect(page.locator(".cm-faq-item").first()).toHaveAttribute(
    "open",
    "",
  );
  await page.locator(".cm-info-toggle").click();
  await expect(page.locator(".cm-info-body")).toBeVisible();
  await page.locator(".id-testimonial-toggle").first().click();
  await expect(page.locator(".id-testimonial-toggle").first()).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  await page.locator(".id-testimonials-arrow.is-next").click();
  await expect(
    page.locator(".id-testimonials-dots button").nth(1),
  ).toHaveAttribute("aria-current", "true");
  await page.locator(".id-testimonials-dots button").first().click();
  await expect(
    page.locator(".id-testimonials-dots button").first(),
  ).toHaveAttribute("aria-current", "true");
  await expect(page.locator(".id-testimonials-dots button")).toHaveCount(8);
  assert.equal(
    await page.locator(".id-testimonial-stars").first().locator("svg").count(),
    5,
  );
  await expect(page.locator(".press-card")).toHaveCount(22);
  for (const width of [320, 375, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.evaluate(() => document.fonts.ready);
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `Overflow at ${width}`,
    );
    const clipped = await page
      .locator(".cm-program-copy,.cm-program-countdown,.cm-deal-body,.cm-price")
      .evaluateAll((elements) =>
        elements
          .filter((el) => el.scrollWidth > el.clientWidth + 1)
          .map((el) => el.className),
      );
    assert.deepEqual(clipped, [], `Clipped content at ${width}`);
    await page.screenshot({
      path: `${directory}/${width}.png`,
      fullPage: true,
    });
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.evaluate(async () => {
    for (const image of document.querySelectorAll("main img")) {
      image.loading = "eager";
      await image.decode();
    }
    document
      .querySelectorAll(".cm-faq-item")
      .forEach((item) => (item.open = true));
  });
  const axe = await new AxeBuilder({ page })
    .include("main")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  await fs.writeFile(
    `${directory}/axe.json`,
    JSON.stringify(axe.violations, null, 2),
  );
  assert.deepEqual(
    axe.violations.map((v) => ({
      id: v.id,
      targets: v.nodes.map((n) => n.target),
    })),
    [],
  );
  const noJs = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const staticPage = await noJs.newPage();
  await staticPage.goto(`${base}/canhme/`);
  await expect(staticPage.locator(".cm-deal-card")).toHaveCount(
    pricing.flat().length,
  );
  await staticPage.locator(".cm-faq-item summary").first().click();
  await expect(staticPage.locator(".cm-faq-item").first()).toHaveAttribute(
    "open",
    "",
  );
  assert.deepEqual(errors, []);
  console.log(
    "Canh Me: 4 source programs, live prices for all billing cycles, checkout links, interactions, images, 7 viewport widths, Axe and no-JavaScript pricing/FAQ passed.",
  );
} finally {
  await browser.close();
}
