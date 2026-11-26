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
  { gid: 105, periods: ["annually", "biennially", "triennially"], selected: 0 },
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
    const products = (await response.json()).products;
    if (group.gid === 105) {
      return products
        .filter(({ pid }) => pid >= 570 && pid <= 577)
        .sort((a, b) => a.pid - b.pid);
    }
    return products.filter(
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
  const programs = page.locator(".cm-deal-program");
  await expect(programs).toHaveCount(4);
  const platinum = programs.nth(0);
  const premium = programs.nth(1);
  await expect(platinum.locator(".cm-program-eyebrow")).toHaveText(
    "VPS Platinum Black Friday 2026",
  );
  await expect(premium.locator(".cm-program-eyebrow")).toHaveText(
    "VPS Hiệu Năng Cao Cho Developer & Business",
  );
  await expect(platinum.locator(".cm-deal-grid")).toHaveAttribute(
    "id",
    "canhme-pricing-105",
  );
  await expect(
    platinum.locator(".cm-program-pricing-toggle, .cm-deal-toggle"),
  ).toHaveCount(0);
  await expect(platinum.locator(".cm-deal-card")).toHaveCount(8);
  const platinumCpuSpecs = platinum.getByText(
    /\d+(?:\.\d+)? vCore Intel Platinum Gen 2$/,
  );
  await expect(platinumCpuSpecs).toHaveCount(8);
  await expect(platinum.locator(".cm-deal-card.is-featured h3")).toHaveText(
    "BF26 PLATINUM P3",
  );
  await expect(platinum.locator(".cm-featured-label")).toHaveText(
    "Bán chạy nhất",
  );
  await expect(platinum.locator(".cm-period-tabs button")).toHaveText([
    "1 năm",
    "2 năm",
    "3 năm",
  ]);
  await platinum.getByRole("button", { name: "2 năm", exact: true }).click();
  await expect(
    premium.getByRole("button", { name: "1 năm", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await platinum.getByRole("button", { name: "1 năm", exact: true }).click();
  const giftPlan = platinum.locator(".cm-deal-card").filter({
    has: page.getByRole("heading", { name: "BF26 PLATINUM P4", exact: true }),
  });
  const giftList = giftPlan.getByRole("list", {
    name: "Quà tặng chu kỳ 3 năm",
  });
  await expect(giftList).toBeVisible();
  const gifts = await giftList.getByRole("listitem").all();
  assert(gifts.length > 1);
  for (const gift of gifts) {
    await expect(gift.locator("svg.lucide-gift")).toBeVisible();
  }
  await expect(giftPlan.getByText(/Firewall Anti DDoS 120Gbps/)).toBeVisible();
  await expect(giftPlan.locator(".cm-original-price")).toHaveAttribute(
    "title",
    /Giá tham chiếu.*VPS Platinum Viettel/,
  );
  await expect(
    page.getByRole("heading", {
      name: "INTER PLATINUM SERIES 2026",
      exact: true,
    }),
  ).toHaveCount(0);
  await expect(
    page.locator("#flash-sale, #renewal-bonus, .cm-service-coupons"),
  ).toHaveCount(0);
  for (const [index, group] of groups.entries()) {
    const groupPricing = pricing[index];
    const program = programs.nth(index);
    const isPlatinum = group.gid === 105;
    await expect(program.locator(".cm-deal-card")).toHaveCount(
      groupPricing.length,
    );
    if (group.periods.length > 1)
      await expect(
        program.locator(".cm-period-tabs button").nth(group.selected),
      ).toHaveAttribute("aria-pressed", "true");
    for (const [cycleIndex, cycle] of group.periods.entries()) {
      if (group.periods.length > 1)
        await program.locator(".cm-period-tabs button").nth(cycleIndex).click();
      for (const [productIndex, product] of groupPricing.entries()) {
        const card = program.locator(".cm-deal-card").nth(productIndex);
        const name = isPlatinum
          ? product.name.replace(/^BF26-\s*/i, "BF26 ").toUpperCase()
          : product.name;
        await expect(card.locator("h3")).toHaveText(name);
        const value = product.pricing.VND[cycle];
        const total = Number(value);
        if (
          isPlatinum &&
          (!value?.trim() || !Number.isFinite(total) || total < 0)
        ) {
          await expect(card.locator("a")).toHaveAttribute("href", "/lien-he/");
          continue;
        }
        const shown =
          group.gid === 96 ? Math.round(total / months[cycle]) : total;
        await expect(card.locator(".cm-price")).toContainText(
          `${shown.toLocaleString("vi-VN")}đ`,
        );
        const checkout = new URL(await card.locator("a").getAttribute("href"));
        assert.equal(checkout.hostname, "support.interdata.vn");
        if (isPlatinum) {
          const portal = new URL(product.product_url);
          assert.equal(checkout.pathname, portal.pathname);
          assert.equal(
            checkout.searchParams.get("rp"),
            portal.searchParams.get("rp"),
          );
        } else {
          assert.equal(checkout.searchParams.get("pid"), String(product.pid));
        }
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
    if (!isPlatinum) {
      await program.locator(".cm-program-pricing-toggle").click();
      await expect(program.locator(".cm-deal-grid")).toHaveCount(0);
      await expect(platinum.locator(".cm-deal-grid")).toBeVisible();
      await program.locator(".cm-program-pricing-toggle").click();
      await expect(program.locator(".cm-deal-grid")).toHaveCount(1);
    }
  }
  await expect(page.locator(".cm-faq-item")).toHaveCount(16);
  await page.locator(".cm-faq-item summary").first().click();
  await expect(page.locator(".cm-faq-item").first()).toHaveAttribute(
    "open",
    "",
  );
  await page.locator(".cm-info-toggle").click();
  await expect(page.locator(".cm-info-body")).toBeVisible();
  await page.locator(".testimonial-details summary").first().click();
  await expect(page.locator(".testimonial-details").first()).toHaveAttribute(
    "open",
    "",
  );
  await page
    .getByRole("button", { name: "Slide phản hồi tiếp theo", exact: true })
    .click();
  await expect(
    page.locator(".testimonial-pagination .testimonial-dot").nth(1),
  ).toHaveAttribute("data-active", "true");
  await page
    .getByRole("button", { name: "Slide phản hồi trước", exact: true })
    .click();
  await expect(
    page.locator(".testimonial-pagination .testimonial-dot").first(),
  ).toHaveAttribute("data-active", "true");
  await expect(page.locator(".testimonial-card")).toHaveCount(8);
  assert.equal(
    await page.locator(".testimonial-stars").first().locator("svg").count(),
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
    const cardSizes = await platinum
      .locator(".cm-deal-card")
      .evaluateAll((cards) =>
        cards.map((card) => {
          const box = card.getBoundingClientRect();
          const checkout = card.querySelector("a").getBoundingClientRect();
          return {
            width: box.width,
            height: box.height,
            bottom: box.bottom - checkout.bottom,
          };
        }),
      );
    for (const dimension of ["width", "height", "bottom"]) {
      const sizes = cardSizes.map((card) => card[dimension]);
      assert(
        Math.max(...sizes) - Math.min(...sizes) <= 1,
        `Platinum card ${dimension} differs at ${width}`,
      );
    }
    const wrappedCpuSpecs = await platinumCpuSpecs.evaluateAll((rows) => {
      const range = document.createRange();
      return rows
        .filter((row) => {
          range.selectNodeContents(row.lastChild);
          return range.getClientRects().length !== 1;
        })
        .map((row) => row.textContent);
    });
    assert.deepEqual(
      wrappedCpuSpecs,
      [],
      `Platinum CPU specs wrap at ${width}`,
    );
    const platinumTabRows = await platinum
      .locator(".cm-period-tabs button")
      .evaluateAll(
        (buttons) => new Set(buttons.map((button) => button.offsetTop)).size,
      );
    assert.equal(platinumTabRows, 1, `Platinum billing tabs wrap at ${width}`);
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
  await expect(
    staticPage
      .locator("#canhme-pricing-105")
      .getByRole("list", {
        name: "Quà tặng chu kỳ 3 năm",
      })
      .first(),
  ).toBeVisible();
  await staticPage.locator(".cm-faq-item summary").first().click();
  await expect(staticPage.locator(".cm-faq-item").first()).toHaveAttribute(
    "open",
    "",
  );
  assert.deepEqual(errors, []);
  console.log(
    "Canh Me: 4 visible programs with Black Friday Platinum first, hidden Inter Platinum, live prices and checkout for all billing cycles, disclosures, images, 7 viewport widths, Axe and no-JavaScript pricing/FAQ passed.",
  );
} finally {
  await browser.close();
}
