import { readSchemaNodes } from "./schema-helpers.mjs";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { decodeHTML } from "entities";
import { readVpsSource } from "./vps-source.mjs";

const sourceRoot = process.argv[2] || "D:/InterData/thue-vps";
const base = process.env.TEST_BASE_URL || "http://localhost:3101";
const directory = process.env.VPS_QA_DIRECTORY || "artifacts/vps/qa";
await fs.mkdir(directory, { recursive: true });
const { data: sourceData } = await readVpsSource(sourceRoot);
const data = JSON.parse(await fs.readFile("src/data/vps-content.json", "utf8"));
expect(data).toEqual(JSON.parse(JSON.stringify(sourceData)));
const manifest = JSON.parse(
  await fs.readFile("docs/vps-source-manifest.json", "utf8"),
);
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
for (const asset of manifest.assets) {
  expect(hash(await fs.readFile(asset.target))).toBe(
    hash(await fs.readFile(path.join(sourceRoot, asset.source))),
  );
  expect(hash(await fs.readFile(asset.target))).toBe(asset.sha256);
}
for (const file of manifest.files)
  expect(hash(await fs.readFile(path.join(sourceRoot, file.file)))).toBe(
    file.sha256,
  );
console.log(
  `PASS source content, visibility flags, ${manifest.assets.length} original assets`,
);

const compact = (text) => decodeHTML(text).replace(/\s/g, "");
const required = [];
function collect(value) {
  if (Array.isArray(value)) {
    value.forEach(collect);
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, item] of Object.entries(value)) {
    if (
      [
        "title",
        "text",
        "content",
        "question",
        "description",
        "term",
        "criteria",
        "criterion",
        "hosting",
        "vps",
        "cloud",
        "dedicated",
        "amd",
        "platinum",
        "gold",
        "linux",
      ].includes(key) &&
      typeof item === "string"
    )
      required.push(item);
    if (typeof item === "object") collect(item);
  }
}
// Use-case cards follow the approved six-category reference, checked below.
// Getting-started and VPS-definition sections were removed by request.
const { GettingStarted: removedGettingStarted, ...visibleLandingHeaders } =
  data.landing.headers;
collect({
  ...data.landing,
  useCases: [],
  process: [],
  headers: visibleLandingHeaders,
  // Environment cards now use logos/names; legacy repeated captions are omitted.
  blocks: data.landing.blocks.filter(
    (block) =>
      !["GettingStarted", "VpsDefinition", "OneClickApps"].includes(
        block.function,
      ),
  ),
});
collect(data.comparison);
// Feedback and press now use shared homepage content, verified in verify-vps-amd.mjs.

collect(data.faq);
// The learning section and its terminal example were removed by request.
// The homepage-style CTA replaces legacy CTA copy by request.
// The reference-led hero replaces the old promotional badge with service copy.
collect(data.hero.blocks.filter((block) => block.tag !== "span"));
collect(data.pricing.blocks);
required.push(...data.landing.benchmarkChecklist);
for (const group of data.landing.benchmarkGroups)
  for (const image of group.images) required.push(...image.metrics);

const browser = await chromium.launch();
const results = [];
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 960 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const errors = [];
  const submissions = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    if (
      request.method() === "POST" &&
      new URL(request.url()).hostname === "support.interdata.vn"
    )
      submissions.push(request.url());
  });
  const response = await page.goto(`${base}/thue-vps/`, {
    waitUntil: "domcontentloaded",
  });
  expect(response.status()).toBe(200);
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator("header.site-header")).toHaveCount(1);
  await expect(page.locator(`#${removedGettingStarted.id}`)).toHaveCount(0);
  await expect(page.locator("footer.footer")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveText(
    "Thuê VPS Hiệu năng cao cho mọi nhu cầu",
  );
  const consultationCta = page.locator("#vps-consultation");
  await expect(consultationCta.locator("#vps-cta-title")).toHaveText(
    "VPS phù hợp cho ứng dụng của bạn.",
  );
  await expect(
    consultationCta.getByRole("link", { name: "Xem bảng giá VPS" }),
  ).toHaveAttribute("href", "#pricing");
  await expect(
    consultationCta.getByRole("link", { name: "Chat với tư vấn viên" }),
  ).toHaveAttribute("href", "https://www.facebook.com/interdata.com.vn/");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://interdata.vn/thue-vps/",
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, nofollow",
  );
  expect(
    await page
      .locator("body")
      .evaluate((node) => getComputedStyle(node).fontFamily),
  ).toContain("Be Vietnam Pro");
  const body = compact(await page.locator("main").textContent());
  for (const text of required) {
    // API description / metadata fields are checked separately below.
    if (!body.includes(compact(text)))
      throw new Error(`Missing source wording: ${text.slice(0, 160)}`);
  }
  const schemas = (await readSchemaNodes(page)).map((node) =>
    JSON.stringify(node),
  );
  const faqSchema = schemas
    .map((text) => JSON.parse(text))
    .find((schema) => schema["@type"] === "FAQPage");
  expect(
    faqSchema.mainEntity.map((item) => ({
      question: item.name,
      answer: item.acceptedAnswer.text,
    })),
  ).toEqual(data.faq.items);
  expect(
    await page
      .locator("main a[href^='#']")
      .evaluateAll((nodes) =>
        nodes
          .map((node) => node.getAttribute("href"))
          .filter((href) => !document.getElementById(href.slice(1))),
      ),
  ).toEqual([]);
  const services = page.locator('section[aria-labelledby="vps-range-title"]');
  await expect(services.locator("article")).toHaveCount(6);
  for (const service of data.pricing.services.filter(
    (item) => item.gid !== 101,
  ))
    await expect(services.locator(`a[href="${service.href}"]`)).toHaveCount(1);
  for (const href of [
    "https://interdata.vn/vps-n8n/",
    "https://interdata.vn/vps-vibe-coding/",
  ])
    await expect(services.locator(`a[href="${href}"]`)).toHaveCount(1);

  const applications = page.locator(
    'section[aria-labelledby="use-cases-title"]',
  );
  await expect(applications.locator("h3")).toHaveText([
    "Lưu trữ Website & Ứng dụng",
    "Phát triển & Kiểm thử phần mềm",
    "Chạy cơ sở dữ liệu",
    "Triển khai hệ thống doanh nghiệp",
    "Làm việc và quản trị từ xa",
    "Triển khai dịch vụ và công cụ khác",
  ]);
  await expect(applications.locator("article a")).toHaveCount(6);
  for (const link of await applications.locator("article a").all())
    expect(await link.getAttribute("href")).toMatch(
      /^(https:\/\/interdata\.vn\/blog\/|\/lien-he\/)/,
    );

  for (const asset of manifest.assets)
    expect(
      (
        await page.request.get(
          `${base}/${asset.target.replace(/^public\//, "")}`,
        )
      ).status(),
    ).toBe(200);
  const api = {};
  for (const gid of [
    100,
    ...data.pricing.services.map((service) => service.gid),
  ]) {
    const live = await fetch(
      `https://support.interdata.vn/packages.php?gid=${gid}`,
      { signal: AbortSignal.timeout(20000) },
    ).then((response) => response.json());
    const localResponse = await page.request.get(
      `${base}/api/vps-pricing/?gid=${gid}`,
    );
    expect(localResponse.status()).toBe(200);
    const local = await localResponse.json();
    expect(
      local.products.map((product) => [
        product.pid,
        product.name,
        product.product_url,
        product.description,
      ]),
    ).toEqual(
      live.products.map((product) => [
        product.pid,
        product.name,
        product.product_url,
        product.description,
      ]),
    );
    for (const product of local.products)
      for (const cycle of [
        "monthly",
        "quarterly",
        "semiannually",
        "annually",
        "biennially",
        "triennially",
      ])
        expect(product.pricing.VND[cycle]).toBe(
          live.products.find((item) => item.pid === product.pid).pricing.VND[
            cycle
          ],
        );
    api[gid] = local.products;
    console.log(
      `PASS live API gid=${gid}: ${local.products.length} products, prices and checkout URLs`,
    );
  }
  expect(
    (await page.request.get(`${base}/api/vps-pricing/?gid=99999`)).status(),
  ).toBe(400);

  for (const service of data.pricing.services) {
    await page.locator(`#vps-tab-${service.gid}`).click();
    const panel = page.locator(`#vps-panel-${service.gid}`);
    const products = api[service.gid].filter(
      (product) => !product.name.toLowerCase().includes("custom"),
    );
    await expect(panel.locator("article[data-pid]")).toHaveCount(
      Math.min(4, products.length),
    );
    if (products.length > 4)
      await panel
        .getByRole("button", { name: "Xem thêm", exact: true })
        .click();
    await expect(panel.locator("article[data-pid]")).toHaveCount(
      products.length,
    );
    expect(
      await panel
        .locator("article[data-pid]")
        .evaluateAll((nodes) => nodes.map((node) => Number(node.dataset.pid))),
    ).toEqual(products.map((product) => product.pid));
    for (const product of products) {
      const card = panel.locator(`article[data-pid="${product.pid}"]`);
      const description = compact(
        decodeHTML(
          product.description.replace(/<[^>]*>/g, "").replace(/\?/g, "\n"),
        ),
      );
      expect(compact(await card.locator("ul").textContent())).toBe(description);
    }
    const standardCycles = [
      ["monthly", "1 tháng"],
      ["quarterly", "3 tháng"],
      ["semiannually", "6 tháng"],
      ["annually", "12 tháng"],
      ["biennially", "24 tháng"],
      ["triennially", "36 tháng"],
    ];
    for (const [cycle, label] of standardCycles) {
      const offered = products.some(
        (product) => Number(product.pricing.VND[cycle]) > 0,
      );
      const tab = page.locator(`#vps-cycle-${service.gid}-tab-${cycle}`);
      await expect(tab).toHaveCount(offered ? 1 : 0);
      if (!offered) continue;
      await tab.click();
      await expect(panel.locator(`#vps-plans-${service.gid}`)).toHaveAttribute(
        "aria-labelledby",
        `vps-cycle-${service.gid}-tab-${cycle}`,
      );
      for (const product of products) {
        const card = panel.locator(`article[data-pid="${product.pid}"]`);
        const price = product.pricing.VND[cycle];
        const available = Number(price) > 0;
        await expect(card.locator("strong").first()).toHaveText(
          available
            ? `${new Intl.NumberFormat("vi-VN").format(Number(price))}đ`
            : "Liên hệ",
        );
        await expect(card.locator("a")).toHaveAttribute(
          "href",
          available
            ? `${product.product_url}${product.product_url.includes("?") ? "&" : "?"}billingcycle=${cycle}`
            : "/lien-he/",
        );
        expect(await card.textContent()).toContain(`/ ${label}`);
      }
    }
    if (products.length > 4)
      await panel.getByRole("button", { name: "Thu gọn", exact: true }).click();
  }
  await page.locator("#vps-tab-3").click();
  await page.locator("#vps-tab-3").focus();
  await page.keyboard.press("Home");
  await expect(page.locator("#vps-tab-67")).toBeFocused();
  await expect(page.locator("#vps-tab-67")).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page.keyboard.press("End");
  await expect(page.locator("#vps-tab-3")).toBeFocused();

  await expect(
    page.locator(
      '#hot-deals, #hot-deals-title, [id^="hot-tab-"], [id^="hot-panel-"]',
    ),
  ).toHaveCount(0);
  await expect(page.locator("#vps-technical-details > summary")).toHaveCount(0);
  await expect(page.locator("#vps-definition-title")).toHaveCount(0);
  await expect(
    page.getByText("Nền tảng cần biết trước khi triển khai", { exact: true }),
  ).toHaveCount(0);
  for (const id of ["vps-comparison-title", "one-click-title"])
    await expect(page.locator(`#${id}`)).toBeVisible();
  await expect(page.locator("#performance-title")).toBeHidden();
  await page.locator("#environment-tab-1").click();
  await expect(page.locator("#environment-panel-1 article")).toHaveCount(4);
  await expect(page.locator("#environment-panel-0")).toBeHidden();
  await page.locator("#environment-tab-0").click();
  await expect(page.locator("#environment-panel-0 article")).toHaveCount(5);
  const environment = page.locator(
    'section[aria-labelledby="one-click-title"]',
  );
  await expect(environment.getByRole("tab")).toHaveText([
    "Linux OS",
    "1-Click Applications",
  ]);
  await expect(
    environment.getByRole("heading", {
      name: /Windows|Webuzo|aaPanel|Control Panel/i,
    }),
  ).toHaveCount(0);
  const faq = page.locator("details").filter({
    has: page.getByRole("heading", {
      name: data.faq.items[0].question,
      exact: true,
    }),
  });
  await faq.locator("summary").click();
  await expect(faq).toHaveAttribute("open", "");
  await faq.locator("summary").click();
  const moreFaqs = page.getByText(
    `Xem tất cả ${data.faq.items.length} câu hỏi`,
    { exact: false },
  );
  await moreFaqs.click();
  const lastFaq = page
    .locator("details")
    .filter({
      has: page.getByRole("heading", {
        name: data.faq.items.at(-1).question,
        exact: true,
      }),
    })
    .last();
  await lastFaq.locator("summary").click();
  await expect(lastFaq.locator("div")).toBeVisible();
  await lastFaq.locator("summary").click();
  await moreFaqs.click();
  await expect(
    page.locator("#vps-learning-title, #vps-learning-content"),
  ).toHaveCount(0);
  await expect(
    page.getByText("Kiến thức nền tảng", { exact: true }),
  ).toHaveCount(0);

  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 960 });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    const image = page.locator("main section").first().locator("img").first();
    await expect
      .poll(() =>
        image.evaluate((node) => node.complete && node.naturalWidth > 0),
      )
      .toBe(true);
    const bounds = await page.locator("main section").first().boundingBox();
    expect(bounds.x).toBe(0);
    expect(Math.round(bounds.width)).toBe(width);
    // The photographic hero replaces the floating cards and duplicate features.
    await expect(
      page
        .locator("main section")
        .first()
        .locator(
          '[class*="visualCard"], [class*="signals"], [class*="vpsPanel"]',
        ),
    ).toHaveCount(0);
    const audit = await new AxeBuilder({ page }).analyze();
    expect(
      audit.violations.map(({ id, nodes }) => ({
        id,
        targets: nodes.map(({ target }) => target),
      })),
    ).toEqual([]);
    if ([390, 1440].includes(width)) {
      await page.screenshot({ path: `${directory}/hero-${width}.png` });
      await page.locator("#pricing").scrollIntoViewIfNeeded();
      await page.screenshot({ path: `${directory}/pricing-${width}.png` });
      await page.locator("#one-click-title").scrollIntoViewIfNeeded();
      await page.screenshot({ path: `${directory}/one-click-${width}.png` });
    }
    if (width < 768) {
      const useCases = page.locator(
        'section[aria-labelledby="use-cases-title"]',
      );
      await expect(useCases.locator("article")).toHaveCount(6);
      const useCaseLinks = useCases.locator("article a");
      await useCaseLinks.first().focus();
      for (let index = 1; index < 6; index++) {
        await page.keyboard.press("Tab");
        await expect(useCaseLinks.nth(index)).toBeFocused();
      }
      // Pricing follows the AMD stacked mobile grid, with every card visible.
      const planColumns = await page
        .locator("#vps-plans-3 article")
        .evaluateAll(
          (nodes) =>
            new Set(
              nodes.map((node) => Math.round(node.getBoundingClientRect().x)),
            ).size,
        );
      expect(planColumns).toBe(1);
    }
    results.push({ width, overflow: false, accessibilityViolations: 0 });
    console.log(`PASS viewport ${width}: layout, hero, accessibility`);
  }
  await page.setViewportSize({ width: 1440, height: 960 });
  for (const [section, nextLabel] of [
    ["#khach-hang", "Slide phản hồi tiếp theo"],
    ["#bao-chi", "Slide báo chí tiếp theo"],
  ]) {
    const root = page.locator(section);
    await root.locator('button[aria-label^="Xem slide"]').last().click();
    await expect(
      root.getByRole("button", { name: nextLabel, exact: true }),
    ).toBeDisabled();
  }
  expect(errors).toEqual([]);
  expect(submissions).toEqual([]);
  await page.goto(`${base}/`);
  await expect(page.locator('footer a[href="/thue-vps/"]')).toHaveCount(1);
  await page.locator('footer a[href="/thue-vps/"]').click();
  await expect(page).toHaveURL(`${base}/thue-vps/`);
  await context.close();

  const plainContext = await browser.newContext({ javaScriptEnabled: false });
  const plain = await plainContext.newPage();
  await plain.goto(`${base}/thue-vps/`);
  await expect(plain.locator("#hot-deals, #hot-deals-title")).toHaveCount(0);
  await expect(plain.locator("#vps-technical-details > summary")).toHaveCount(
    0,
  );
  await expect(plain.locator("#vps-definition-title")).toHaveCount(0);
  await expect(
    plain.getByText("Nền tảng cần biết trước khi triển khai", { exact: true }),
  ).toHaveCount(0);
  for (const id of ["vps-comparison-title", "one-click-title"])
    await expect(plain.locator(`#${id}`)).toBeVisible();
  await expect(plain.locator("#performance-title")).toBeHidden();
  await expect(plain.locator(`#${removedGettingStarted.id}`)).toHaveCount(0);
  await expect(plain.locator("#vps-panel-3")).toBeVisible();
  await expect(plain.locator("#vps-panel-3 article[data-pid]")).toHaveCount(4);
  await expect(
    plain.getByText(data.faq.items[0].question, { exact: true }),
  ).toBeVisible();
  await expect(
    plain.locator("#vps-learning-title, #vps-learning-content"),
  ).toHaveCount(0);
  await expect(
    plain.getByText("Kiến thức nền tảng", { exact: true }),
  ).toHaveCount(0);
  await plainContext.close();
  await fs.writeFile(
    `${directory}/results.json`,
    JSON.stringify(
      {
        sourceContent: "passed",
        sourceAssets: manifest.assets.length,
        liveApiGroups: Object.keys(api),
        pricingContracts: "passed",
        viewports: results,
        keyboard: "passed",
        noJavaScript:
          "default pricing, FAQ and removed learning section passed",
        errors,
        submissions,
      },
      null,
      2,
    ),
  );
  console.log(
    "PASS VPS content, API contracts, interactions, no-JavaScript rendering",
  );
} finally {
  await browser.close();
}
