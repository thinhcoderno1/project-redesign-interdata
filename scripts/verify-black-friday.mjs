import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.TEST_BASE_URL || "http://localhost:3100";
const directory = "artifacts/black-friday";
await fs.mkdir(directory, { recursive: true });
const browser = await chromium.launch();
const errors = [];
const results = [];
const originalPrices = JSON.parse(
  await fs.readFile("src/data/vps-content.json", "utf8"),
).hotDeals.originalPrices;
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  const response = await page.goto(`${base}/black-friday/`);
  assert.equal(response.status(), 200);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator(".site-header")).toHaveCount(1);
  await expect(page.locator("footer")).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://interdata.vn/black-friday/",
  );
  await expect(page.locator("#best-plans article")).toHaveCount(3);
  await expect(page.locator('#best-plans [class*="planHeader"] p')).toHaveCount(
    0,
  );
  await expect(
    page.locator("#best-plans").getByText(/^Quy đổi từ/),
  ).toHaveCount(0);
  await expect(page.locator("#best-plans article h3")).toHaveText([
    "INTER PLATINUM 1",
    "INTER PLATINUM 2",
    "INTER PLATINUM 3",
  ]);
  const recommendation = page.locator(
    '#best-plans [class*="recommendationTag"]',
  );
  await expect(recommendation).toHaveCount(1);
  await expect(
    page
      .locator("#best-plans article")
      .nth(1)
      .locator('[class*="recommendationTag"]'),
  ).toHaveText("Gợi ý cho bạn");
  await expect(recommendation.locator("svg")).toHaveCount(1);
  const highlighted = await page
    .locator("#best-plans article")
    .nth(1)
    .evaluate((el) => {
      const style = getComputedStyle(el);
      return { outline: style.outlineWidth, color: style.outlineColor };
    });
  assert.equal(highlighted.outline, "2px");
  assert.equal(highlighted.color, "rgb(0, 96, 255)");
  const renewal = page.locator("#gia-han");
  await expect(renewal.locator("h2")).toHaveText(/Gia hạn\.\s*Thêm lợi ích\./);
  await expect(renewal.locator("article")).toHaveCount(3);
  await expect(renewal.locator('[class*="renewalOffer"] > strong')).toHaveText([
    "6",
    "50%",
    "10%",
  ]);
  await expect(renewal.locator("time")).toHaveAttribute(
    "datetime",
    "2026-08-31",
  );
  await expect(renewal.locator("time")).toHaveText("31/08/2026.");
  await expect(renewal.locator("article p").nth(1)).toContainText(
    "gói đại trà, chưa từng được ưu đãi",
  );
  await expect(renewal.locator("article p").nth(2)).toContainText(
    "mua tại trang Canh Me",
  );
  await expect(renewal.locator("article a")).toHaveText([
    "Gia hạn ngay",
    "Gia hạn ngay",
    "Gia hạn ngay",
  ]);
  for (const link of await renewal.locator("article a").all())
    await expect(link).toHaveAttribute(
      "href",
      "https://support.interdata.vn/index.php?rp=/login",
    );
  assert(
    await renewal.evaluate(
      (el) =>
        el.previousElementSibling.id === "best-plans" &&
        el.nextElementSibling.id === "flash-sale",
    ),
  );
  assert(
    !/demo|minh họa|đang tính toán/i.test(
      await page.locator("main").innerText(),
    ),
  );
  const tabs = page.locator('#best-plans [role="tab"]');
  await expect(tabs).toHaveText(["1 năm", "2 năm", /3 năm\s*Tiết kiệm nhất/]);
  await expect(tabs.last()).toHaveAttribute("aria-selected", "true");
  const gifts = page
    .locator("#best-plans article")
    .getByText("TẶNG THÊM 1 NĂM", { exact: true });
  await expect(gifts).toHaveCount(3);
  await expect(page.locator("#best-plans article a").first()).toHaveAttribute(
    "href",
    /billingcycle=triennially$/,
  );
  await expect(
    page.locator('#best-plans select, #best-plans [aria-label="Chọn dịch vụ"]'),
  ).toHaveCount(0);
  assert(
    !/Cloud Server|Platinum G2 Cloud/.test(
      await page.locator("#best-plans").innerText(),
    ),
  );
  let previousPrices;
  for (const [index, cycle] of [
    "annually",
    "biennially",
    "triennially",
  ].entries()) {
    await tabs.nth(index).click();
    await expect(gifts).toHaveCount(cycle === "triennially" ? 3 : 0);
    if (cycle === "triennially") {
      for (const gift of await gifts.all()) {
        await expect(gift.locator("..").locator("svg")).toHaveCount(1);
        assert(
          await gift
            .locator("..")
            .evaluate((el) =>
              Boolean(el.previousElementSibling.querySelector("h3")),
            ),
        );
      }
    }
    await expect(tabs.nth(index)).toHaveAttribute("aria-selected", "true");
    await expect(page.locator("#bf-plans")).toHaveAttribute(
      "aria-labelledby",
      `bf-cycle-${cycle}`,
    );
    const prices = await page
      .locator('#best-plans article [class*="price"] > strong')
      .allTextContents();
    if (previousPrices) assert.notDeepEqual(prices, previousPrices);
    previousPrices = prices;
    for (const card of await page.locator("#best-plans article").all()) {
      const name = await card.locator("h3").innerText();
      const original = originalPrices[name][cycle];
      const current = Number(
        (await card.locator('[class*="price"] > strong').innerText()).replace(
          /\D/g,
          "",
        ),
      );
      await expect(card.locator("del")).toHaveText(
        `${new Intl.NumberFormat("vi-VN").format(original)}đ / ${["12 tháng", "24 tháng", "36 tháng"][index]}`,
      );
      assert(
        (
          await card
            .locator("del")
            .evaluate((el) => getComputedStyle(el).textDecorationLine)
        ).includes("line-through"),
      );
      await expect(card.locator("del + span")).toHaveText(
        `-${Math.floor(((original - current) / original) * 100)}%`,
      );
      assert(
        !(
          await card
            .locator("del + span")
            .evaluate((el) => getComputedStyle(el).textDecorationLine)
        ).includes("line-through"),
      );
      await expect(card.locator("a")).toHaveAttribute(
        "href",
        new RegExp(`/inter-platinum-\\d&billingcycle=${cycle}$`),
      );
    }
    const cards = page.locator("#best-plans article");
    await expect(cards.first().locator('[class*="planUpgrade"]')).toHaveCount(
      0,
    );
    for (const cardIndex of [1, 2]) {
      const upgrade = cards.nth(cardIndex).locator('[class*="planUpgrade"]');
      const readPrice = async (i) =>
        Number(
          (
            await cards.nth(i).locator('[class*="price"] > strong').innerText()
          ).replace(/\D/g, ""),
        );
      const difference =
        (await readPrice(cardIndex)) - (await readPrice(cardIndex - 1));
      const months = [12, 24, 36][index];
      await expect(upgrade.locator('[class*="upgradeTitle"]')).toHaveText(
        `Nâng cấp từ Plan ${cardIndex}`,
      );
      await expect(upgrade.locator("strong")).toHaveText(
        `+${new Intl.NumberFormat("vi-VN").format(Math.ceil(difference / months))}đ`,
      );
      await expect(upgrade.locator('[class*="upgradeTotal"]')).toHaveCount(0);
      await expect(upgrade.locator("li")).toHaveText(
        cardIndex === 1
          ? ["+3 vCore", "+5 GB RAM", "+40 GB NVMe"]
          : ["+4 vCore", "+8 GB RAM", "+70 GB NVMe"],
      );
    }
  }
  await tabs.last().press("Home");
  await expect(tabs.first()).toBeFocused();
  await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
  await tabs.first().press("ArrowRight");
  await expect(tabs.nth(1)).toBeFocused();
  await tabs.nth(1).press("End");
  await expect(tabs.last()).toBeFocused();
  await tabs.last().press("ArrowLeft");
  await expect(tabs.nth(1)).toBeFocused();
  await tabs.nth(1).press("Home");
  for (const card of await page.locator("#best-plans article").all()) {
    const url = new URL(await card.locator("a").getAttribute("href"));
    assert.equal(url.protocol, "https:");
    assert.equal(url.hostname, "support.interdata.vn");
    const specs = card.locator('[class*="specs"]');
    await expect(specs.locator("li")).toHaveCount(6);
    await expect(specs.locator("li:visible")).toHaveCount(3);
    const configuration = card.locator("details");
    await expect(configuration).not.toHaveAttribute("open", "");
    await expect(configuration.locator("summary")).toHaveText(
      "Xem thêm cấu hình",
      { useInnerText: true },
    );
    await configuration.locator("summary").click();
    await expect(configuration).toHaveAttribute("open", "");
    await expect(configuration.locator("summary")).toHaveText("Thu gọn", {
      useInnerText: true,
    });
    await expect(specs.locator("li:visible")).toHaveCount(6);
    await expect(page.locator("#best-plans details[open]")).toHaveCount(1);
    await expect(specs.locator("li").nth(3)).toHaveText("1 IPv4 Public Global");
    await expect(specs.locator("li").nth(4)).toHaveText("300Mbps Network Port");
    await expect(specs.locator("li").nth(5)).toHaveText("Unlimited Bandwidth");
    await configuration.locator("summary").press("Enter");
    await expect(specs.locator("li:visible")).toHaveCount(3);
  }
  await tabs.last().click();
  const slots = page.locator("#flash-sale button");
  for (let index = 0; index < 3; index++) {
    await slots.nth(index).click();
    await expect(slots.nth(index)).toHaveAttribute("aria-pressed", "true");
    await expect(
      page.locator("#flash-sale a[aria-label]").first(),
    ).toHaveAttribute(
      "aria-label",
      new RegExp(["10:00", "14:00", "20:00"][index]),
    );
  }
  await slots.first().click();
  await expect(page.locator("#ma-giam-gia article")).toHaveCount(6);
  await expect(page.locator("#ma-giam-gia details")).toHaveCount(2);
  await expect(page.locator("#ma-giam-gia article h4 strong")).toHaveText([
    "71%",
    "61%",
    "51%",
    "61%",
    "51%",
    "41%",
  ]);
  await expect(page.locator("#ma-giam-gia article a")).toHaveCount(6);
  for (const action of await page.locator("#ma-giam-gia article a").all())
    await expect(action).toHaveAttribute("href", "/lien-he/");
  await expect(page.locator("#ma-giam-gia button")).toHaveCount(0);
  const terms = page.locator("#ma-giam-gia details").first();
  await terms.locator("summary").click();
  await expect(terms).toHaveAttribute("open", "");
  await expect(terms.locator("p")).toBeVisible();
  await terms.locator("summary").click();
  const consultation = page.locator("#black-friday-consultation");
  await expect(consultation).toHaveCount(1);
  await expect(consultation).toHaveAttribute(
    "aria-labelledby",
    "black-friday-cta-title",
  );
  assert(
    await consultation.evaluate(
      (el) => el.parentElement.previousElementSibling.id === "ma-giam-gia",
    ),
  );
  await expect(consultation.locator("h2")).toHaveText(
    "Chọn đúng gói. Tối ưu chi phí.",
  );
  await expect(consultation.locator("a")).toHaveCount(2);
  await expect(consultation.locator('a[href="/lien-he/"]')).toHaveText(
    "Nhận tư vấn ưu đãi",
  );
  await expect(consultation.locator('a[href="#best-plans"]')).toHaveText(
    "Xem lại Best Plans",
  );
  await consultation.scrollIntoViewIfNeeded();
  assert(
    await consultation.locator("img").evaluate(async (img) => {
      await img.decode();
      return (
        img.naturalWidth > 0 &&
        img.getAttribute("src").includes("consultation-woman-upper-body.webp")
      );
    }),
  );
  await consultation.locator('a[href="#best-plans"]').click();
  await expect(page).toHaveURL(/#best-plans$/);
  const faq = page.locator("#black-friday-faq");
  const faqItems = faq.locator("details");
  await expect(faq).toHaveAttribute(
    "aria-labelledby",
    "black-friday-faq-title",
  );
  assert(
    await faq.evaluate((el) =>
      Boolean(
        el.previousElementSibling.querySelector("#black-friday-consultation"),
      ),
    ),
  );
  await expect(faqItems).toHaveCount(8);
  await expect(faq.locator('[class*="faqSupport"]')).toHaveCount(0);
  for (const item of await faqItems.all()) {
    await expect(item).not.toHaveAttribute("open", "");
    const summary = item.locator("summary");
    await summary.focus();
    await summary.press("Enter");
    await expect(item).toHaveAttribute("open", "");
    await expect(item.locator("p")).toBeVisible();
    await expect(item.locator('[class*="faqToggle"]')).toHaveCSS(
      "color",
      "rgb(198, 74, 10)",
    );
    assert.equal(
      await item
        .locator('[class*="faqToggle"]')
        .evaluate((el) => getComputedStyle(el, "::after").opacity),
      "0",
    );
    assert(
      await summary.evaluate(
        (el) => getComputedStyle(el).outlineStyle !== "none",
      ),
    );
    await summary.press("Space");
    await expect(item).not.toHaveAttribute("open", "");
    await expect(item.locator('[class*="faqToggle"]')).toHaveCSS(
      "color",
      "rgb(0, 67, 236)",
    );
    assert.equal(
      await item
        .locator('[class*="faqToggle"]')
        .evaluate((el) => getComputedStyle(el, "::after").opacity),
      "1",
    );
  }
  for (const link of await faq.locator("a").all()) {
    const href = await link.getAttribute("href");
    if (href.startsWith("#")) await expect(page.locator(href)).toHaveCount(1);
    else assert.equal(href, "/lien-he/");
  }
  await page
    .locator('nav[aria-label="Nội dung Black Friday"] a[href="#ma-giam-gia"]')
    .click();
  await expect(page).toHaveURL(/#ma-giam-gia$/);
  await expect(
    page.locator(
      'nav[aria-label="Nội dung Black Friday"] a[href="#ma-giam-gia"]',
    ),
  ).toHaveAttribute("aria-current", "location");
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 375, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.evaluate(() => document.fonts.ready);
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1,
      ),
      `Overflow at ${width}px`,
    );
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("#best-plans article").first()).toBeVisible();
    const renewalBoxes = await renewal
      .locator('[class*="renewalGrid"] > *')
      .evaluateAll((cards) =>
        cards.map((card) => {
          const { x, y, width, height } = card.getBoundingClientRect();
          return { x, y, width, height };
        }),
      );
    assert(
      width > 1000
        ? renewalBoxes.every((box) => Math.abs(box.y - renewalBoxes[0].y) < 1)
        : width > 600
          ? Math.abs(renewalBoxes[0].y - renewalBoxes[1].y) < 1 &&
            Math.abs(renewalBoxes[2].y - renewalBoxes[3].y) < 1 &&
            renewalBoxes[2].y >= renewalBoxes[0].y + renewalBoxes[0].height
          : renewalBoxes
              .slice(1)
              .every(
                (box, index) =>
                  box.y >= renewalBoxes[index].y + renewalBoxes[index].height,
              ),
    );
    const couponGroups = await page
      .locator("#ma-giam-gia h3")
      .evaluateAll((headings) =>
        headings.map((el) => ({
          x: el.getBoundingClientRect().x,
          y: el.getBoundingClientRect().y,
        })),
      );
    assert(
      width > 900
        ? Math.abs(couponGroups[0].y - couponGroups[1].y) < 1
        : couponGroups[1].y > couponGroups[0].y,
    );
    for (const locator of [
      page.locator("#best-plans-title"),
      page.locator('#best-plans [role="tablist"]'),
    ]) {
      const box = await locator.boundingBox();
      assert(
        box && Math.abs(box.x + box.width / 2 - width / 2) < 2,
        `Best Plans alignment at ${width}px`,
      );
    }
    await page.screenshot({
      path: `${directory}/${width}.png`,
      fullPage: true,
    });
    results.push({ width, overflow: false });
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await faqItems.evaluateAll((items) =>
    items.forEach((item) => {
      item.open = true;
    }),
  );
  const axe = await new AxeBuilder({ page })
    .include("main")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  await fs.writeFile(
    `${directory}/axe.json`,
    JSON.stringify(axe.violations, null, 2),
  );
  assert.equal(
    axe.violations.length,
    0,
    JSON.stringify(
      axe.violations.map(({ id, nodes }) => ({
        id,
        targets: nodes.map((node) => node.target),
      })),
    ),
  );
  const noJs = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const staticPage = await noJs.newPage();
  await staticPage.goto(`${base}/black-friday/`);
  await expect(
    staticPage.locator('#gia-han [class*="renewalOffer"] > strong'),
  ).toHaveText(["6", "50%", "10%"]);
  await expect(staticPage.locator("#gia-han time")).toHaveAttribute(
    "datetime",
    "2026-08-31",
  );
  await expect(staticPage.locator("#gia-han article a")).toHaveCount(3);
  await expect(staticPage.locator("#best-plans article")).toHaveCount(3);
  await expect(
    staticPage.locator("#best-plans article").first().locator("a"),
  ).toHaveAttribute("href", /billingcycle=triennially$/);
  await expect(staticPage.locator("#bf-cycle-triennially")).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(staticPage.locator("#best-plans article del")).toHaveCount(3);
  await expect(
    staticPage
      .locator("#best-plans article")
      .getByText("TẶNG THÊM 1 NĂM", { exact: true }),
  ).toHaveCount(3);
  const staticCard = staticPage.locator("#best-plans article").first();
  await expect(staticCard.locator("li:visible")).toHaveCount(3);
  await staticCard.locator("details summary").click();
  await expect(staticCard.locator("li:visible")).toHaveCount(6);
  await staticPage.locator("#ma-giam-gia details summary").first().click();
  await expect(
    staticPage.locator("#ma-giam-gia details").first(),
  ).toHaveAttribute("open", "");
  await expect(staticPage.locator("#black-friday-faq details")).toHaveCount(8);
  const staticFaq = staticPage.locator("#black-friday-faq details").first();
  await expect(staticFaq).not.toHaveAttribute("open", "");
  await staticFaq.locator("summary").click();
  await expect(staticFaq).toHaveAttribute("open", "");
  await expect(staticFaq.locator("p")).toBeVisible();
  assert.deepEqual(errors, []);
  await fs.writeFile(
    `${directory}/results.json`,
    JSON.stringify(
      { results, axeViolations: 0, pageErrors: errors, noJavaScript: "passed" },
      null,
      2,
    ),
  );
  console.log(
    "Black Friday: pricing across cycles, keyboard support, checkout URLs, layout, time slots, terms, anchors, consultation CTA, 8 FAQs, 7 viewport widths, axe with expanded answers and no-JavaScript checks passed.",
  );
} finally {
  await browser.close();
}
