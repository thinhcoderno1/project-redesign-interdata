import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.TEST_BASE_URL || "http://localhost:3100";
const directory = "artifacts/black-friday";
await fs.mkdir(directory, { recursive: true });
const browser = await chromium.launch({
  channel: process.env.TEST_BROWSER_CHANNEL || undefined,
});
const errors = [];
const results = [];
const originalPrices = JSON.parse(
  await fs.readFile("src/data/vps-content.json", "utf8"),
).hotDeals.originalPrices;
const api = await fetch(
  "https://support.interdata.vn/packages.php?gid=103&module",
);
assert(api.ok, `Black Friday API HTTP ${api.status}`);
const catalog = await api.json();
assert.equal(catalog.success, true);
const plans = [567, 568, 569].map((pid) =>
  catalog.products.find((p) => p.pid === pid),
);
assert(plans.every((p) => p?.gid === 103));
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  await page.emulateMedia({ reducedMotion: "reduce" });
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
    "BF26 - Start",
    "BF26 - Core",
    "BF26 - Plus",
  ]);
  await expect(page.locator("#best-plans-title")).toHaveText(
    "BEST PLANS VPS BLACK FRIDAY",
  );
  const recommendation = page.locator(
    '#best-plans [class*="recommendationTag"]',
  );
  await expect(recommendation).toHaveCount(1);
  await expect(
    page
      .locator("#best-plans article")
      .nth(1)
      .locator('[class*="recommendationTag"]'),
  ).toHaveText("Phù hợp nhất");
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
  await expect(renewal.locator("article")).toHaveCount(2);
  await expect(renewal.locator("article h3")).toHaveText([
    "GIA HẠN GIẢM ĐẾN",
    "GIA HẠN TẶNG ĐẾN",
  ]);
  await expect(renewal.locator('[class*="renewalOffer"] > strong')).toHaveText([
    "50%",
    "6",
  ]);
  await expect(renewal.locator("time, p")).toHaveCount(0);
  await expect(renewal).not.toContainText("10%");
  await expect(renewal.locator("a")).toHaveCount(1);
  await expect(renewal.locator('[class*="renewalIntro"] a')).toHaveText(
    "Gia hạn ngay",
  );
  await expect(renewal.locator("a")).toHaveAttribute(
    "href",
    "https://www.facebook.com/interdata.com.vn",
  );
  await expect(renewal.locator("article a")).toHaveCount(0);
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
  await expect(tabs).toHaveText(["1 năm", "2 năm", /3 năm\s*Miễn phí 1 năm/]);
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
    for (const [planIndex, card] of (
      await page.locator("#best-plans article").all()
    ).entries()) {
      const product = plans[planIndex];
      await expect(card).toHaveAttribute("data-pid", String(product.pid));
      const original =
        originalPrices[`INTER PLATINUM ${planIndex + 1}`].annually *
        (index + 1);
      const current = Number(
        (await card.locator('[class*="price"] > strong').innerText()).replace(
          /\D/g,
          "",
        ),
      );
      assert.equal(current, Number(product.pricing.VND[cycle]));
      assert.equal(current, Number(product.pricing.VND.annually) * (index + 1));
      await expect(card.locator('[class*="price"] > span')).toHaveText(
        `/ ${["12 tháng", "24 tháng", "48 tháng"][index]}`,
      );
      await expect(card.locator('[class*="specs"]')).not.toContainText(
        "Tặng 1 Năm HSD",
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
      await expect(card.locator('[class*="savingsBadge"]')).toHaveCount(0);
      await expect(card.locator("a")).toHaveAttribute(
        "href",
        `${product.product_url}&billingcycle=${cycle}`,
      );
    }
    const cards = page.locator("#best-plans article");
    await expect(cards.last().locator('[class*="planUpgrade"]')).toHaveCount(0);
    for (const cardIndex of [0, 1]) {
      const upgrade = cards.nth(cardIndex).locator('[class*="planUpgrade"]');
      const readPrice = async (i) =>
        Number(
          (
            await cards.nth(i).locator('[class*="price"] > strong').innerText()
          ).replace(/\D/g, ""),
        );
      const difference =
        (await readPrice(cardIndex + 1)) - (await readPrice(cardIndex));
      const months = [12, 24, 36][index];
      await expect(upgrade.locator('[class*="upgradeTitle"]')).toHaveText(
        "Chỉ thêm",
      );
      await expect(upgrade.locator('[class*="upgradeLabel"]')).toHaveText(
        "Nhận thêm:",
      );
      await expect(upgrade.locator("strong")).toHaveText(
        `${new Intl.NumberFormat("vi-VN").format(Math.ceil(difference / months))}đ`,
      );
      await expect(upgrade.locator('[class*="upgradeMonthly"]')).toHaveText(
        `${new Intl.NumberFormat("vi-VN").format(Math.ceil(difference / months))}đ /tháng`,
      );
      await expect(upgrade.locator('[class*="upgradeTotal"]')).toHaveCount(0);
      await expect(upgrade.locator("li")).toHaveText(
        cardIndex === 0
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
    await expect(configuration.locator("summary")).toHaveText("Xem thêm", {
      useInnerText: true,
    });
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
    const collapseBox = await configuration.locator("summary").boundingBox();
    const bandwidthBox = await specs.locator("li").nth(5).boundingBox();
    assert(collapseBox.y >= bandwidthBox.y + bandwidthBox.height);
    await expect(card.locator("a")).toHaveText("Đăng ký ngay");
    await configuration.locator("summary").press("Enter");
    await expect(specs.locator("li:visible")).toHaveCount(3);
  }
  await tabs.last().click();
  const countdown = page.locator('#flash-sale [role="timer"]');
  await expect(countdown).toHaveCount(1);
  await expect(countdown.locator("strong")).toHaveText([
    "00",
    "00",
    "00",
    "00",
  ]);
  await expect(countdown.locator("span")).toHaveText([
    "Ngày",
    "Giờ",
    "Phút",
    "Giây",
  ]);
  await expect(page.locator('#flash-sale [class*="slotSwitch"]')).toHaveCount(
    0,
  );
  await page.waitForTimeout(1100);
  await expect(countdown.locator("strong")).toHaveText([
    "00",
    "00",
    "00",
    "00",
  ]);
  await expect(page.locator('#flash-sale [class*="flashCode"]')).toHaveText([
    "BF-XXXX",
    "BF-XXXX",
  ]);
  await expect(page.locator("#flash-sale article a")).toHaveText([
    "Áp mã ngay",
    "Áp mã ngay",
  ]);
  await expect(page.locator("#flash-sale article a").nth(0)).toHaveAttribute(
    "href",
    "/thue-vps/",
  );
  await expect(page.locator("#flash-sale article a").nth(1)).toHaveAttribute(
    "href",
    "/cloud-server/",
  );
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
  await expect(page.locator('#ma-giam-gia [class*="couponCode"]')).toHaveText(
    Array(6).fill("BF26-XXXXX"),
  );
  for (const [index, action] of (
    await page.locator("#ma-giam-gia article a").all()
  ).entries()) {
    await expect(action).toHaveText("Áp mã ngay");
    await expect(action).toHaveAttribute(
      "href",
      index < 3 ? "/thue-vps/" : "/cloud-server/",
    );
  }
  await expect(
    page.locator(
      '#flash-sale a[href="/lien-he/"], #ma-giam-gia a[href="/lien-he/"]',
    ),
  ).toHaveCount(0);
  await expect(page.locator("#ma-giam-gia details > ul")).toHaveCount(2);
  for (const conditions of await page
    .locator("#ma-giam-gia details > ul")
    .all()) {
    await expect(conditions.locator("li")).toHaveText([
      "Mã ONE TIME: Chỉ áp dụng cho lần thanh toán đầu tiên. Để hưởng ưu đãi dài hạn, Quý Khách nên cân nhắc đăng ký chu kỳ phù hợp.",
      "Mã không áp dụng đồng thời / cộng dồn với các chương trình khuyến mãi khác.",
      "Chương trình không áp dụng cho thanh toán qua tài khoản credit tại InterData.",
    ]);
  }
  await expect(page.locator("#ma-giam-gia details a")).toHaveCount(0);
  const flashTerms = page.locator('#flash-sale [class*="flashTerms"]');
  await expect(flashTerms).not.toHaveAttribute("open", "");
  await flashTerms.locator("summary").click();
  await expect(flashTerms.locator("li")).toHaveText([
    "Mã ONE TIME: Chỉ áp dụng cho lần thanh toán đầu tiên. Để hưởng ưu đãi dài hạn, Quý Khách nên cân nhắc đăng ký chu kỳ phù hợp.",
    "Ưu tiên những khách hàng thanh toán nhanh và sớm nhất.",
    "Các hóa đơn không được thanh toán sau 15 phút kể từ khi khởi tạo sẽ bị xóa.",
    "Mã không áp dụng đồng thời / cộng dồn với các chương trình khuyến mãi khác.",
    "Chương trình không áp dụng cho thanh toán qua tài khoản credit tại InterData.",
  ]);
  await expect(flashTerms.locator("li:visible")).toHaveCount(5);
  await expect(flashTerms.locator("a")).toHaveCount(0);
  await flashTerms.locator("summary").press("Enter");
  await expect(flashTerms).not.toHaveAttribute("open", "");
  await expect(page.locator("#ma-giam-gia button")).toHaveCount(6);
  const terms = page.locator("#ma-giam-gia details").first();
  await terms.locator("summary").click();
  await expect(terms).toHaveAttribute("open", "");
  await expect(terms.locator("li:visible")).toHaveCount(3);
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
          ? Math.abs(renewalBoxes[1].y - renewalBoxes[2].y) < 1 &&
            renewalBoxes[1].y >= renewalBoxes[0].y + renewalBoxes[0].height
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
  ).toHaveText(["50%", "6"]);
  await expect(staticPage.locator("#gia-han time, #gia-han p")).toHaveCount(0);
  await expect(staticPage.locator("#gia-han a")).toHaveCount(1);
  await expect(
    staticPage.locator('#gia-han [class*="renewalIntro"] a'),
  ).toHaveAttribute("href", "https://www.facebook.com/interdata.com.vn");
  await expect(staticPage.locator("#best-plans article")).toHaveCount(3);
  await expect(
    staticPage.locator('#ma-giam-gia [class*="couponCode"]'),
  ).toHaveText(Array(6).fill("BF26-XXXXX"));
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
  await expect(staticCard.locator('[class*="specs"] li:visible')).toHaveCount(
    3,
  );
  await staticCard.locator("details summary").click();
  await expect(staticCard.locator('[class*="specs"] li:visible')).toHaveCount(
    6,
  );
  await staticCard.locator("details summary").press("Enter");
  await expect(staticCard.locator("details")).not.toHaveAttribute("open", "");
  await staticPage.locator("#ma-giam-gia details summary").first().click();
  await expect(
    staticPage.locator("#ma-giam-gia details").first(),
  ).toHaveAttribute("open", "");
  await expect(staticPage.locator("#black-friday-faq details")).toHaveCount(8);
  await expect(
    staticPage.locator('#flash-sale [role="timer"] strong'),
  ).toHaveText(["00", "00", "00", "00"]);
  const staticFlashTerms = staticPage.locator(
    '#flash-sale [class*="flashTerms"]',
  );
  await staticFlashTerms.locator("summary").click();
  await expect(staticFlashTerms.locator("li:visible")).toHaveCount(5);
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
    "Black Friday: pricing across cycles, keyboard support, checkout URLs, layout, static countdown preview, terms, anchors, consultation CTA, 8 FAQs, 7 viewport widths, axe with expanded answers and no-JavaScript checks passed.",
  );
} finally {
  await browser.close();
}
