import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.TEST_BASE_URL || "http://localhost:3100";
const timing = await fetch(`${base}/api/black-friday-best-plans/`);
assert(timing.ok);
const platinum = (await timing.json()).delayMs === 0;
const groupId = platinum ? 105 : 103;
const planIds = platinum
  ? [570, 571, 572, 573, 574, 575, 576, 577]
  : [567, 568, 569];
const defaultCycle = platinum ? "annually" : "triennially";
const giftLabel = platinum ? "Quà Tặng Chu Kỳ 3 Năm" : "TẶNG THÊM 1 NĂM";
const giftCount = platinum ? 7 : 3;
const directory = "artifacts/black-friday";
await fs.mkdir(directory, { recursive: true });
const browser = await chromium.launch({
  channel: process.env.TEST_BROWSER_CHANNEL || undefined,
});
const errors = [];
const results = [];
const api = await fetch(
  `https://support.interdata.vn/packages.php?gid=${groupId}&module`,
);
assert(api.ok, `Black Friday API HTTP ${api.status}`);
const catalog = await api.json();
assert.equal(catalog.success, true);
const plans = planIds.map((pid) =>
  catalog.products.find((product) => product.pid === pid),
);
assert(plans.every((p) => p?.gid === groupId));
const amdApi = await fetch(
  "https://support.interdata.vn/packages.php?gid=107&module",
);
assert(amdApi.ok, `AMD Black Friday API HTTP ${amdApi.status}`);
const amdCatalog = await amdApi.json();
assert.equal(amdCatalog.success, true);
const amdPlans = Array.from({ length: 8 }, (_, index) =>
  amdCatalog.products.find((product) => product.pid === 586 + index),
);
assert(amdPlans.every((plan) => plan?.gid === 107));
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  await page.emulateMedia({ reducedMotion: "reduce" });
  page.on("pageerror", (error) => errors.push(error.message));
  const response = await page.goto(`${base}/blackfriday/`);
  assert.equal(response.status(), 200);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator(".site-header")).toHaveCount(1);
  await expect(page.locator("footer")).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://interdata.vn/blackfriday/",
  );
  const amdSection = page.locator("#best-plans");
  const amdCards = amdSection.locator("article");
  await expect(amdSection.locator("h2")).toHaveText("VPS AMD BLACK FRIDAY");
  await expect(amdSection.getByText("AMD EPYC Gen 2")).toBeVisible();
  await expect(
    amdSection.getByText("SSD NVMe U.2 Gen 4", { exact: true }),
  ).toBeVisible();
  await expect(amdCards.locator('img[src*="epyc-chip"]')).toHaveCount(8);
  await expect(amdCards.locator("h3")).toHaveText(
    amdPlans.map((_, index) => `BF26 AMD E${index + 1}`),
  );
  await expect(amdCards.nth(2).getByText("Đăng ký nhiều")).toBeVisible();
  await expect(amdCards.locator("del")).toHaveCount(8);
  await expect(amdSection.getByText("Quà Tặng Chu Kỳ 3 Năm")).toHaveCount(7);

  const platinumSection = page.locator("#best-plans-clone");
  const cards = platinumSection.locator("article");
  await expect(cards).toHaveCount(plans.length);
  const amdTabs = amdSection.getByRole("tab");
  await expect(amdTabs.first()).toHaveAccessibleName("1 năm Giảm 60%");
  await expect(amdTabs.nth(1)).toHaveAccessibleName("2 năm Giảm 65%");
  await expect(amdTabs.last()).toHaveAccessibleName("3 năm Giảm 70%");
  for (const [index, cycle] of [
    "annually",
    "biennially",
    "triennially",
  ].entries()) {
    await amdTabs.nth(index).click();
    await expect(amdTabs.nth(index)).toHaveAttribute("aria-selected", "true");
    await expect(amdSection.getByRole("tabpanel")).toHaveAttribute(
      "aria-labelledby",
      `bf-cycle-${cycle}`,
    );
    const prices = await amdCards
      .locator('[class*="price"] > strong')
      .allTextContents();
    assert.deepEqual(
      prices.map((price) => Number(price.replace(/\D/g, ""))),
      amdPlans.map((product) => Number(product.pricing.VND[cycle])),
    );
    for (const [planIndex, product] of amdPlans.entries()) {
      const card = amdCards.nth(planIndex);
      await expect(card.locator("del")).toHaveAttribute("title", /VPS AMD/);
      await expect(card.locator("del")).toContainText(
        ["/ 1 năm", "/ 2 năm", "/ 3 năm"][index],
      );
      await expect(card).toHaveAttribute("data-pid", String(product.pid));
      await expect(card.getByRole("link")).toHaveAttribute(
        "href",
        `${product.product_url}&billingcycle=${cycle}`,
      );
      if (index === 0) {
        const resources = product.description
          .split("\n")
          .filter((line) => /vCore$|GB RAM$|GB SSD NVMe$/.test(line));
        await expect(card.locator("[data-plan-spec]")).toHaveText([
          ...resources,
          "01 IPv4 Public",
          "1Gbps Network Port",
          "Unlimited Bandwidth",
          /Firewall Anti DDoS 120Gbps/,
        ]);
      }
    }
  }
  await expect(cards.locator("h3")).toHaveText(
    plans.map((plan, index) =>
      platinum ? `BF26 PLATINUM P${index + 1}` : plan.name,
    ),
  );
  await expect(platinumSection.locator("h2")).toHaveText(
    platinum ? "VPS PLATINUM BLACK FRIDAY" : "BEST PLANS VPS BLACK FRIDAY",
  );
  await expect(
    platinumSection.getByText(platinum ? "HOT DEALS" : "ƯU ĐÃI NỔI BẬT"),
  ).toBeVisible();
  await expect(
    cards.locator(
      platinum
        ? 'img[src*="intel-xeon-platinum-8000-angled"]'
        : 'img[src*="3d-server-icon"]',
    ),
  ).toHaveCount(plans.length);
  const recommendation = platinumSection.locator(
    '[class*="recommendationTag"]',
  );
  const featuredCard = platinumSection.locator(
    `article[data-pid="${platinum ? 572 : 568}"]`,
  );
  await expect(recommendation).toHaveCount(1);
  await expect(featuredCard.locator('[class*="recommendationTag"]')).toHaveText(
    platinum ? "Bán chạy nhất" : "Phù hợp nhất",
  );
  await expect(recommendation.locator("svg")).toHaveCount(1);
  const highlighted = await featuredCard.evaluate((el) => {
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
    await renewal.evaluate((el) => {
      const platinum = el.previousElementSibling?.lastElementChild;
      return (
        platinum?.id === "best-plans-clone" &&
        platinum.previousElementSibling?.id === "best-plans" &&
        el.nextElementSibling.firstElementChild.id === "flash-sale"
      );
    }),
  );
  assert(
    !/demo|minh họa|đang tính toán/i.test(
      await page.locator("main").innerText(),
    ),
  );
  const tabs = platinumSection.getByRole("tab");
  const tabNames = platinum
    ? ["1 năm Giảm 60%", "2 năm Giảm 65%", "3 năm Giảm 70%"]
    : ["1 năm", "2 năm", "3 năm Miễn phí 1 năm"];
  for (const [index, name] of tabNames.entries()) {
    await expect(tabs.nth(index)).toHaveAccessibleName(name);
  }
  await expect(
    platinumSection.getByRole("tab", { selected: true }),
  ).toHaveAttribute("id", `best-plans-clone-cycle-${defaultCycle}`);
  await expect(amdTabs.last()).toHaveAttribute("aria-selected", "true");
  const gifts = cards.getByText(giftLabel, { exact: true });
  await expect(gifts).toHaveCount(giftCount);
  await expect(
    platinumSection.locator('select, [aria-label="Chọn dịch vụ"]'),
  ).toHaveCount(0);
  assert(
    !/Cloud Server|Platinum G2 Cloud/.test(await platinumSection.innerText()),
  );
  let previousPrices;
  for (const [index, cycle] of [
    "annually",
    "biennially",
    "triennially",
  ].entries()) {
    if (!platinum || index > 0) await tabs.nth(index).click();
    await expect(gifts).toHaveCount(
      platinum || cycle === "triennially" ? giftCount : 0,
    );
    if (platinum) {
      await expect(cards.first().locator('[class*="giftList"]')).toHaveCount(0);
      await expect(cards.nth(1).locator('[class*="giftList"] li')).toHaveText([
        "Ly sứ InterData",
      ]);
      await expect(cards.last().locator('[class*="giftList"] li')).toHaveText([
        "Nón bảo hiểm InterData",
        "Ly sứ InterData",
        "200GB S3 Storage",
      ]);
    }
    await expect(tabs.nth(index)).toHaveAttribute("aria-selected", "true");
    await expect(platinumSection.getByRole("tabpanel")).toHaveAttribute(
      "aria-labelledby",
      `best-plans-clone-cycle-${cycle}`,
    );
    const prices = await cards
      .locator('[class*="price"] > strong')
      .allTextContents();
    if (previousPrices) assert.notDeepEqual(prices, previousPrices);
    previousPrices = prices;
    for (const [planIndex, card] of (await cards.all()).entries()) {
      const product = plans[planIndex];
      await expect(card).toHaveAttribute("data-pid", String(product.pid));
      const current = Number(
        (await card.locator('[class*="price"] > strong').innerText()).replace(
          /\D/g,
          "",
        ),
      );
      assert.equal(current, Number(product.pricing.VND[cycle]));
      await expect(card.locator('[class*="price"] > span')).toHaveText(
        platinum ? `/ ${index + 1} năm` : `/ ${[12, 24, 48][index]} tháng`,
      );
      const reference = card.locator("del");
      if (platinum)
        await expect(reference).toHaveAttribute(
          "title",
          planIndex === 0
            ? "Giá tham chiếu VPS Platinum Viettel"
            : /Giá tham chiếu ước tính/,
        );
      assert(
        (
          await reference.evaluate(
            (el) => getComputedStyle(el).textDecorationLine,
          )
        ).includes("line-through"),
      );
      await expect(card.locator("a")).toHaveAttribute(
        "href",
        `${product.product_url}&billingcycle=${cycle}`,
      );
    }
  }
  if (!platinum) {
    await expect(cards.locator('[class*="planUpgrade"]')).toHaveCount(2);
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
  for (const [index, card] of (await cards.all()).entries()) {
    const url = new URL(await card.locator("a").getAttribute("href"));
    assert.equal(url.origin, "https://support.interdata.vn");
    const resources = plans[index].description
      .split("\n")
      .filter((line) => /vCore$|GB RAM$|GB SSD NVMe$/.test(line));
    if (platinum) {
      const specs = card.getByRole("list", { name: "Cấu hình" });
      await expect(specs.locator("li")).toHaveText([
        ...resources,
        "01 IPv4 Public",
        "1Gbps Network Port",
        "Unlimited Bandwidth",
        /Firewall Anti DDoS 120Gbps/,
      ]);
      await expect(specs.getByRole("img", { name: "VIP" })).toHaveCount(1);
      await expect(card.locator("details")).toHaveCount(0);
    } else {
      await expect(card.locator('[class*="specs"] li:visible')).toHaveText(
        resources,
      );
      await card.getByText("Xem thêm", { exact: true }).click();
      await expect(card.locator("details")).toHaveAttribute("open", "");
      await expect(
        card.getByText("300Mbps Network Port", { exact: true }),
      ).toBeVisible();
      await card.getByText("Thu gọn", { exact: true }).click();
    }
    await expect(card.locator("a")).toHaveText("Đăng ký ngay");
  }
  await tabs.last().click();
  const release = await fetch(base + "/api/black-friday-flash-sale/").then(
    (response) => response.json(),
  );
  const flash = page.locator("#flash-sale");
  await expect(flash.locator("article")).toHaveCount(6);
  await expect(flash.locator("time").first()).toHaveAttribute(
    "dateTime",
    "2026-11-27T20:00:00+07:00",
  );
  const domainCycle = flash
    .locator('[data-offer="free"]')
    .getByText("Chu kỳ 1 năm", { exact: true });
  if (release.status === "live") {
    await expect(domainCycle).toBeVisible();
    await expect(flash.getByRole("button")).toHaveText(
      Object.values(release.offers).map((offer) => offer.code),
    );
    await expect(flash.getByRole("timer")).toHaveCount(0);
    for (const [id, { quantity }] of Object.entries(release.offers)) {
      await expect(
        flash
          .locator(`[data-offer="${id}"]`)
          .getByText(`Chỉ ${String(quantity).padStart(2, "0")} mã`, {
            exact: true,
          }),
      ).toBeVisible();
    }
  } else {
    await expect(domainCycle).toHaveCount(0);
    await expect(flash.getByRole("timer")).toHaveCount(1);
    await expect(flash.getByRole("button")).toHaveCount(0);
    await expect(flash.getByText(/^Chỉ \d{2} mã$/i)).toHaveCount(0);
  }
  await expect(page.locator("#ma-giam-gia article")).toHaveCount(6);
  await expect(page.locator("#ma-giam-gia details")).toHaveCount(2);
  await expect(page.locator("#ma-giam-gia article h4 strong")).toHaveText([
    "55%",
    "50%",
    "45%",
    "40%",
    "35%",
    "30%",
  ]);
  await expect(page.locator("#ma-giam-gia article a")).toHaveCount(6);
  await expect(page.locator('#ma-giam-gia [class*="couponCode"]')).toHaveText([
    "BF26-VPS55",
    "BF26-VPS50",
    "BF26-VPS45",
    "BF26-CLOUD40",
    "BF26-CLOUD35",
    "BF26-CLOUD30",
  ]);
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
      (el) =>
        el.parentElement.previousElementSibling.lastElementChild.id ===
        "ma-giam-gia",
    ),
  );
  await expect(consultation.locator("h2")).toHaveText(
    "Chọn đúng gói. Tối ưu chi phí.",
  );
  await expect(consultation.locator("a")).toHaveCount(2);
  await expect(
    consultation.locator('a[href="https://www.facebook.com/interdata.com.vn"]'),
  ).toHaveText("Nhận tư vấn ưu đãi");
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
  const info = page.locator("#black-friday-info");
  const infoDetails = info.locator("details");
  const infoToggle = infoDetails.locator("summary");
  const infoClose = infoDetails.getByRole("button", { name: "Thu gọn" });
  const infoPreview = info.locator('[class*="preview"]');
  const infoLastHeading = info.getByText(
    "Cần chuẩn bị gì trước khi chuyển sang máy chủ mới?",
    { exact: true },
  );
  await expect(
    page.locator("#black-friday-faq + #black-friday-info"),
  ).toHaveCount(1);
  await expect(info.locator("h2")).toContainText("Black Friday 2026");
  await expect(info.locator('[class*="intro"]')).toBeVisible();
  await expect(infoDetails).not.toHaveAttribute("open", "");
  await expect(infoToggle).toHaveAccessibleName("Xem thêm");
  await expect(infoPreview).toHaveCSS("mask-image", /linear-gradient/);
  await infoToggle.press("Enter");
  await expect(infoDetails).toHaveAttribute("open", "");
  await expect(infoToggle).toBeHidden();
  await expect(infoDetails.locator("h3").first()).toBeFocused();
  await expect(infoPreview).toHaveCSS("mask-image", "none");
  await expect(infoLastHeading).toBeVisible();
  const infoLastParagraph = infoDetails.locator("p").last();
  const lastParagraphBox = await infoLastParagraph.boundingBox();
  const closeBox = await infoClose.boundingBox();
  assert(closeBox.y >= lastParagraphBox.y + lastParagraphBox.height);
  await infoLastParagraph.locator("a").focus();
  await page.keyboard.press("Tab");
  await expect(infoClose).toBeFocused();
  await page.keyboard.press("Space");
  await expect(infoDetails).not.toHaveAttribute("open", "");
  await expect(infoToggle).toBeFocused();
  await expect(infoToggle).toBeInViewport();
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
  for (const width of [320, 375, 390, 640, 767, 768, 1024, 1440, 1920]) {
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
    await expect(amdCards.first()).toBeVisible();
    const planLayout = await amdSection
      .getByRole("tabpanel")
      .evaluate((track) => {
        const style = getComputedStyle(track);
        const cards = Array.from(track.children);
        const firstTop = cards[0].getBoundingClientRect().top;
        return {
          display: style.display,
          firstRowCount: cards.filter(
            (card) => card.getBoundingClientRect().top === firstTop,
          ).length,
          canScroll: track.scrollWidth > track.clientWidth,
          cardsFit: cards.every(
            (card) => card.scrollWidth <= card.clientWidth + 1,
          ),
        };
      });
    assert.equal(planLayout.display, width < 768 ? "flex" : "grid");
    assert.equal(
      planLayout.firstRowCount,
      width < 768 ? amdPlans.length : width < 1024 ? 2 : 4,
    );
    assert.equal(planLayout.canScroll, width < 768);
    assert(planLayout.cardsFit, `Best Plans card overflow at ${width}px`);
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
  await infoToggle.press("Enter");
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
  await staticPage.goto(`${base}/blackfriday/`);
  await expect(
    staticPage.locator('#gia-han [class*="renewalOffer"] > strong'),
  ).toHaveText(["50%", "6"]);
  await expect(staticPage.locator("#gia-han time, #gia-han p")).toHaveCount(0);
  await expect(staticPage.locator("#gia-han a")).toHaveCount(1);
  await expect(
    staticPage.locator('#gia-han [class*="renewalIntro"] a'),
  ).toHaveAttribute("href", "https://www.facebook.com/interdata.com.vn");
  const staticAmdSection = staticPage.locator("#best-plans");
  await expect(staticAmdSection.locator("article")).toHaveCount(8);
  await expect(
    staticAmdSection.locator("article").first().getByRole("link"),
  ).toHaveAttribute("href", `${amdPlans[0].product_url}&billingcycle=annually`);
  const staticPlatinumSection = staticPage.locator("#best-plans-clone");
  await expect(staticPlatinumSection.locator("article")).toHaveCount(
    plans.length,
  );
  await expect(
    staticPage.locator('#ma-giam-gia [class*="couponCode"]'),
  ).toHaveText([
    "BF26-VPS55",
    "BF26-VPS50",
    "BF26-VPS45",
    "BF26-CLOUD40",
    "BF26-CLOUD35",
    "BF26-CLOUD30",
  ]);
  await expect(
    staticPlatinumSection.locator("article").first().locator("a"),
  ).toHaveAttribute(
    "href",
    `${plans[0].product_url}&billingcycle=${defaultCycle}`,
  );
  await expect(
    staticPage.locator(`#best-plans-clone-cycle-${defaultCycle}`),
  ).toHaveAttribute("aria-selected", "true");
  await expect(staticPlatinumSection.locator("article del")).toHaveCount(
    plans.length,
  );
  await expect(
    staticPlatinumSection.getByText(giftLabel, { exact: true }),
  ).toHaveCount(giftCount);
  await expect(
    staticPlatinumSection
      .locator("article")
      .first()
      .locator('[class*="specs"] li:visible'),
  ).toHaveCount(platinum ? 7 : 3);
  await staticPage.locator("#ma-giam-gia details summary").first().click();
  await expect(
    staticPage.locator("#ma-giam-gia details").first(),
  ).toHaveAttribute("open", "");
  await expect(staticPage.locator("#black-friday-faq details")).toHaveCount(8);
  await expect(staticPage.locator("#flash-sale article")).toHaveCount(6);
  await expect(staticPage.locator("#flash-sale button")).toHaveCount(0);
  await expect(
    staticPage.locator("#flash-sale").getByText(/^Chỉ \d{2} mã$/i),
  ).toHaveCount(0);
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
  const staticInfo = staticPage.locator("#black-friday-info details");
  const staticInfoToggle = staticInfo.locator("summary");
  const staticInfoLastHeading = staticInfo.locator("h3").last();
  await expect(staticInfo).not.toHaveAttribute("open", "");
  await expect(staticInfoLastHeading).toHaveText(
    await infoLastHeading.textContent(),
  );
  await staticInfoToggle.click();
  await expect(staticInfoLastHeading).toBeVisible();
  await expect(staticInfoToggle).toHaveAccessibleName("Thu gọn");
  const staticLastParagraphBox = await staticInfo
    .locator("p")
    .last()
    .boundingBox();
  const staticToggleBox = await staticInfoToggle.boundingBox();
  assert(
    staticToggleBox.y >=
      staticLastParagraphBox.y + staticLastParagraphBox.height,
  );
  await staticInfoToggle.click();
  await expect(staticInfo).not.toHaveAttribute("open", "");
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
    "Black Friday: pricing across cycles, keyboard support, checkout URLs, layout, timed Flash Sale release, terms, anchors, consultation CTA, 8 FAQs, info disclosure, 9 viewport widths, axe and no-JavaScript checks passed.",
  );
} finally {
  await browser.close();
}
