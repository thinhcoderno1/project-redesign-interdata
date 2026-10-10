import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";

const base = process.env.TEST_BASE_URL || "http://localhost:3100";
const directory = process.env.CONTACT_QA_DIRECTORY || "artifacts/contact/qa";
await fs.mkdir(directory, { recursive: true });
const browser = await chromium.launch();
const results = [];

async function auditPage(page) {
  // Google's third-party frame is audited separately for loading, URL and title.
  const audit = await new AxeBuilder({ page })
    .exclude("#office-map iframe")
    .analyze();
  expect(
    audit.violations.map(({ id, nodes }) => ({
      id,
      targets: nodes.map(({ target }) => target),
    })),
  ).toEqual([]);
}

try {
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    const context = await browser.newContext({
      viewport: { width, height: 960 },
      reducedMotion: "reduce",
      permissions: ["clipboard-read", "clipboard-write"],
    });
    const page = await context.newPage();
    const errors = [];
    const submissions = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("request", (request) => {
      if (request.method() === "POST") submissions.push(request.url());
    });
    const response = await page.goto(`${base}/lien-he/`, {
      waitUntil: "domcontentloaded",
    });
    expect(response.status()).toBe(200);
    await page.evaluate(() => document.fonts.ready);
    await expect(
      page.getByRole("button", { name: "Soạn email yêu cầu", exact: true }),
    ).toBeEnabled();
    await expect(page.locator("main#noi-dung")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("header.site-header")).toHaveCount(1);
    await expect(page.locator("footer")).toHaveCount(1);
    await expect(page).toHaveTitle(
      "Liên hệ InterData — Tư vấn dịch vụ & hỗ trợ",
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://interdata.vn/lien-he/",
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, nofollow",
    );
    await expect(page.locator('footer a[href="/lien-he/"]')).toHaveCount(1);
    await expect(page.locator('footer a[href="/#proxmox"]')).toHaveCount(1);
    await expect(
      page.locator('main a[href="https://zalo.me/2009180325727970604"]'),
    ).toHaveCount(1);
    await expect(
      page.locator('main a[href="https://www.facebook.com/interdata.com.vn"]'),
    ).toHaveCount(1);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    expect(
      await page
        .locator('a[href^="#"]')
        .evaluateAll((links) =>
          links
            .map((link) => link.getAttribute("href"))
            .filter((href) => !document.getElementById(href.slice(1))),
        ),
    ).toEqual([]);
    await auditPage(page);
    await page.screenshot({
      path: `${directory}/contact-${width}.png`,
      fullPage: true,
    });
    await page
      .getByRole("link", { name: "Trao đổi nhu cầu", exact: true })
      .click();
    await expect(page).toHaveURL(/#gui-yeu-cau$/);
    await expect
      .poll(() =>
        page
          .locator("#gui-yeu-cau")
          .evaluate((section) =>
            Math.round(section.getBoundingClientRect().top),
          ),
      )
      .toBeGreaterThan(0);
    const header = await page.locator("header.site-header").boundingBox();
    expect(
      (await page.locator("#gui-yeu-cau").boundingBox()).y,
    ).toBeGreaterThanOrEqual(header.height);

    const form = page.getByRole("form", {
      name: "Soạn yêu cầu tư vấn InterData",
    });
    const compose = form.getByRole("button", {
      name: "Soạn email yêu cầu",
      exact: true,
    });
    await compose.click();
    expect(await form.evaluate((element) => element.checkValidity())).toBe(
      false,
    );
    await expect(
      page.getByRole("link", { name: "Mở ứng dụng email", exact: true }),
    ).toHaveCount(0);
    await form.locator('[name="name"]').fill("Nguyễn An & Bình");
    await form.locator('[name="email"]').fill("khong-hop-le");
    await form.locator('[name="service"]').selectOption("Cloud Server");
    await form
      .locator('[name="message"]')
      .fill("Cần cấu hình cho API & website.\nThời điểm: tháng 11.");
    await compose.click();
    await expect(
      page.getByRole("link", { name: "Mở ứng dụng email", exact: true }),
    ).toHaveCount(0);
    await form.locator('[name="email"]').fill("demo@example.com");
    await form.locator('[name="name"]').fill("   ");
    await compose.click();
    expect(
      await form
        .locator('[name="name"]')
        .evaluate((input) => input.validity.customError),
    ).toBe(true);
    await form.locator('[name="name"]').fill("Nguyễn An & Bình");
    await compose.click();
    const emailLink = page.getByRole("link", {
      name: "Mở ứng dụng email",
      exact: true,
    });
    await expect(emailLink).toBeVisible();
    const mailto = new URL(await emailLink.getAttribute("href"));
    expect(mailto.protocol).toBe("mailto:");
    expect(mailto.pathname).toBe("info@interdata.vn");
    expect(mailto.searchParams.get("subject")).toBe(
      "Yêu cầu tư vấn Cloud Server — Nguyễn An & Bình",
    );
    expect(mailto.searchParams.get("body")).toContain(
      "Cần cấu hình cho API & website.\nThời điểm: tháng 11.",
    );
    const draftText = await page.getByLabel("Nội dung để xem lại").inputValue();
    expect(mailto.searchParams.get("body").replaceAll("\r\n", "\n")).toBe(
      draftText.replaceAll("\r\n", "\n"),
    );
    await page
      .getByRole("button", { name: "Sao chép nội dung", exact: true })
      .click();
    await expect(
      page
        .getByRole("status")
        .filter({ hasText: "Đã sao chép nội dung email." }),
    ).toBeVisible();
    expect(
      (await page.evaluate(() => navigator.clipboard.readText())).replaceAll(
        "\r\n",
        "\n",
      ),
    ).toBe(draftText.replaceAll("\r\n", "\n"));
    if (width === 1440) {
      await auditPage(page);
      await page.evaluate(() => {
        Object.defineProperty(navigator, "clipboard", {
          configurable: true,
          value: { writeText: () => Promise.reject(new Error("denied")) },
        });
      });
      await page
        .getByRole("button", { name: "Sao chép nội dung", exact: true })
        .click();
      await expect(
        page.getByRole("status").filter({ hasText: "Chưa sao chép được." }),
      ).toBeVisible();
    }
    await form.locator('[name="message"]').fill("Nhu cầu đã thay đổi.");
    await expect(emailLink).toHaveCount(0);
    expect(submissions).toEqual([]);

    const officeGroup = page.getByRole("group", {
      name: "Chọn văn phòng trên bản đồ",
    });
    const representative = officeGroup.getByRole("button", {
      name: /Văn phòng đại diện/,
    });
    await representative.focus();
    await page.keyboard.press("Enter");
    await expect(representative).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("#van-phong address")).toContainText(
      "240 Nguyễn Đình Chính",
    );
    await expect(page.locator("#office-map iframe")).toHaveAttribute(
      "src",
      /q=10\.795176,106\.674237/,
    );
    await expect(
      page.getByRole("link", {
        name: "Chỉ đường trên Google Maps",
        exact: true,
      }),
    ).toHaveAttribute("href", "https://maps.app.goo.gl/ZxSPDiAQerFgVw5RA");
    await officeGroup
      .getByRole("button", { name: /Văn phòng giao dịch/ })
      .click();
    await expect(page.locator("#van-phong address")).toContainText(
      "Số 211 Đường số 5",
    );
    await expect(page.locator("#office-map iframe")).toHaveAttribute(
      "src",
      /q=10\.7952477,106\.778797/,
    );
    await expect(page.locator("#office-map iframe")).toHaveAttribute(
      "title",
      "Google Maps — InterData văn phòng giao dịch",
    );
    if (width === 1440) {
      await page.locator("#office-map").scrollIntoViewIfNeeded();
      await expect(
        page.frameLocator("#office-map iframe").locator("body"),
      ).toContainText(/Terms|Điều khoản|Map data/, { timeout: 30000 });
      await page.screenshot({ path: `${directory}/map-1440.png` });
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    await page.locator("footer .footer-logo").click();
    await expect(page.locator(".hero")).toHaveCount(1);
    await expect(page.locator('footer a[href="#proxmox"]')).toHaveCount(1);
    await page.locator('footer a[href="/lien-he/"]').click();
    await expect(page.locator("#contact-title")).toBeVisible();
    await page.locator('footer a[href="/gioi-thieu/"]').click();
    await expect(page.locator("#about-title")).toBeVisible();
    await page.locator('footer a[href="/lien-he/"]').click();
    await expect(page.locator("#contact-title")).toBeVisible();
    await expect(page).toHaveURL(`${base}/lien-he/`);
    await expect
      .poll(() =>
        page
          .locator("#contact-title")
          .evaluate((title) => getComputedStyle(title).fontFamily),
      )
      .toContain("Be Vietnam Pro");
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    expect(errors).toEqual([]);
    results.push({
      width,
      accessibility: "passed (owned UI)",
      mapSwitch: "passed",
      emailDraft: "passed",
      copy: "passed",
      navigation: "passed",
    });
    console.log(
      `PASS ${width}px: layout, accessibility, map switching, email draft, clipboard and navigation`,
    );
    await context.close();
  }
  for (const path of ["/contact", "/contact/", "/lien-he"]) {
    const page = await browser.newPage();
    await page.goto(`${base}${path}?from=qa`, {
      waitUntil: "domcontentloaded",
    });
    await expect(page).toHaveURL(`${base}/lien-he/?from=qa`);
    await page.close();
  }
  const page = await browser.newPage({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 960 },
  });
  await page.goto(`${base}/lien-he/`, { waitUntil: "domcontentloaded" });
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(
    page.getByRole("button", { name: "Soạn email yêu cầu", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole("link", {
      name: "gửi email trực tiếp đến InterData",
      exact: true,
    }),
  ).toHaveAttribute("href", "mailto:info@interdata.vn");
  await expect(
    page.locator(
      '#van-phong a[href="https://maps.app.goo.gl/JdnrU5N9xWYKShqt5"]',
    ),
  ).toHaveCount(2);
  await expect(
    page.locator(
      '#van-phong a[href="https://maps.app.goo.gl/ZxSPDiAQerFgVw5RA"]',
    ),
  ).toHaveCount(1);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
  await page.close();
  results.push({
    redirects: "passed",
    noJavaScript: "passed",
    googleMap: "loaded",
  });
} finally {
  await fs.writeFile(
    `${directory}/results.json`,
    JSON.stringify(results, null, 2),
  );
  await browser.close();
}
