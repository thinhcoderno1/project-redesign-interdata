import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const documents = [
  ["chinh-sach-xu-ly-khieu-nai", "Chính sách xử lý khiếu nại.md"],
  ["cam-ket-chat-luong-dich-vu", "Cam kết chất lượng dịch vụ.md"],
  ["dieu-khoan-su-dung-dich-vu", "Điều khoản sử dụng dịch vụ.md"],
  ["hinh-thuc-thanh-toan", "Hình thức thanh toán.md"],
  ["huong-dan-thanh-toan-vnpay", "Hướng dẫn thanh toán VNPAY.md"],
  ["quy-dinh-doi-tra-va-hoan-tien", "Quy định đổi trả và hoàn trả tiền.md"],
  ["quy-dinh-su-dung-ten-mien", "Quy định sử dụng tên miền.md"],
];
const sourceDirectory = process.argv[2];
const base = process.env.TEST_BASE_URL || "http://localhost:3101";
const directory = process.env.LEGAL_QA_DIRECTORY || "artifacts/legal-pages/qa";
await fs.mkdir(directory, { recursive: true });
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const compact = (text) => text.replace(/\s/g, "");

// Independent wording check: remove only Markdown presentation syntax from the
// supplied document, then compare every non-whitespace character in reading order.
function sourceText(source) {
  return source
    .replace(/!\[[^\]]*\]\((?:[^()]|\([^()]*\))*\)/g, "")
    .replace(/\[([^\]]+)\]\((?:[^()]|\([^()]*\))*\)/g, "$1")
    .split(/\r?\n/)
    .filter((line) => !/^\|(?:\s*:?-+:?\s*\|)+\s*$/.test(line))
    .map((line) =>
      line
        .replace(/^(?:\s*(?:[-+*]|\d+\.)\s+)+/, "")
        .replace(/^#{1,6}\s+/, "")
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\|/g, ""),
    )
    .join("\n");
}

function assertWording(slug, expected, actual) {
  const left = compact(expected);
  const right = compact(actual);
  if (left === right) return;
  let index = 0;
  while (
    left[index] === right[index] &&
    index < Math.max(left.length, right.length)
  )
    index++;
  throw new Error(
    `${slug}: wording differs at character ${index}\nExpected: ${left.slice(Math.max(0, index - 45), index + 100)}\nRendered: ${right.slice(Math.max(0, index - 45), index + 100)}`,
  );
}

const browser = await chromium.launch();
const results = [];
try {
  for (const [slug, filename] of documents) {
    const bytes = await fs.readFile(`content/legal/${slug}.md`);
    if (sourceDirectory) {
      expect(hash(bytes)).toBe(
        hash(await fs.readFile(path.join(sourceDirectory, filename))),
      );
    }
    const source = bytes.toString("utf8");
    const expected = sourceText(source);
    const context = await browser.newContext({
      viewport: { width: 1440, height: 960 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const response = await page.goto(`${base}/${slug}/`, {
      waitUntil: "domcontentloaded",
    });
    expect(response.status()).toBe(200);
    await page.evaluate(() => document.fonts.ready);
    assertWording(slug, expected, await page.locator("article").textContent());
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://interdata.vn/${slug}/`,
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, nofollow",
    );
    const nav = page.locator("aside nav");
    const links = await nav
      .locator("a")
      .evaluateAll((nodes) =>
        nodes.map((node) => ({
          href: node.getAttribute("href"),
          text: node.textContent,
        })),
      );
    expect(links.length).toBeGreaterThan(0);
    expect(links.map((link) => link.text)).toEqual(
      await page.locator("article h2").allTextContents(),
    );
    const sourceLinks = [
      ...source.matchAll(/(?<!!)\[[^\]]+\]\(((?:[^()]|\([^()]*\))*)\)/g),
    ].map((match) => decodeURI(match[1]));
    const renderedLinks = await page
      .locator("article a")
      .evaluateAll((nodes) =>
        nodes.map((node) => decodeURI(node.getAttribute("href"))),
      );
    expect(renderedLinks).toEqual(sourceLinks);
    for (const link of links) {
      await expect(page.locator(`article h2${link.href}`)).toHaveCount(1);
      await nav.locator(`a[href="${link.href}"]`).click();
      await expect(page).toHaveURL(`${base}/${slug}/${link.href}`);
      const header = await page.locator("header.site-header").boundingBox();
      const target = await page.locator(link.href).boundingBox();
      expect(target.y).toBeGreaterThanOrEqual(header.y + header.height);
      expect(target.y).toBeLessThan(960);
    }
    if (slug === "huong-dan-thanh-toan-vnpay") {
      await expect(page.locator("article img")).toHaveCount(6);
      for (const image of await page.locator("article img").all()) {
        await image.scrollIntoViewIfNeeded();
        await expect
          .poll(() =>
            image.evaluate((node) => node.complete && node.naturalWidth > 0),
          )
          .toBe(true);
      }
    }
    if (slug === "cam-ket-chat-luong-dich-vu")
      await expect(page.locator("article table")).toHaveCount(2);
    if (slug === "hinh-thuc-thanh-toan") {
      await expect(page.locator("article table")).toHaveCount(1);
      await expect(page.locator("article tbody tr")).toHaveCount(2);
      await expect(
        page.locator("article tbody tr").first().locator("td").nth(1),
      ).toContainText("VPGD: 211 Đường số 5");
      await expect(
        page.locator("article tbody tr").first().locator("td").nth(1),
      ).toContainText("09:00 - 18:00");
    }
    const widths = [];
    for (const width of [320, 390, 768, 1024, 1440, 1920]) {
      await page.setViewportSize({ width, height: 960 });
      await page.evaluate(() =>
        window.scrollTo({ top: 0, behavior: "instant" }),
      );
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
      const aside = await page.locator("aside").boundingBox();
      const article = await page.locator("article").boundingBox();
      if (width >= 1024) {
        expect(aside.x + aside.width).toBeLessThan(article.x);
        if (article.height > 1300) {
          await page.evaluate(() =>
            window.scrollTo({ top: 600, behavior: "instant" }),
          );
          const header = await page.locator("header.site-header").boundingBox();
          const sticky = await page.locator("aside").boundingBox();
          expect(
            Math.abs(sticky.y - header.y - header.height - 24),
          ).toBeLessThanOrEqual(2);
        }
      } else {
        expect(aside.y + aside.height).toBeLessThan(article.y);
        expect(
          await page
            .locator("aside")
            .evaluate((node) => getComputedStyle(node).position),
        ).toBe("static");
      }
      const audit = await new AxeBuilder({ page }).analyze();
      expect(
        audit.violations.map(({ id, nodes }) => ({
          id,
          targets: nodes.map(({ target }) => target),
        })),
      ).toEqual([]);
      if ([390, 1440].includes(width)) {
        await page.evaluate(() =>
          window.scrollTo({ top: 0, behavior: "instant" }),
        );
        await page.screenshot({ path: `${directory}/${slug}-${width}.png` });
      }
      widths.push({ width, overflow: false, accessibilityViolations: 0 });
    }
    await page.setViewportSize({ width: 1440, height: 960 });
    const keyboardLink = nav.locator("a").first();
    await keyboardLink.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(`${base}/${slug}/${links[0].href}`);
    await page.locator("aside summary").click();
    await expect(nav).toBeHidden();
    await page.locator("aside summary").click();
    await expect(nav).toBeVisible();
    expect(errors).toEqual([]);
    await context.close();
    const plainContext = await browser.newContext({ javaScriptEnabled: false });
    const plain = await plainContext.newPage();
    await plain.goto(`${base}/${slug}/`);
    assertWording(
      `${slug} without JS`,
      expected,
      await plain.locator("article").textContent(),
    );
    await plain.locator("aside nav a").last().click();
    await expect(plain).toHaveURL(`${base}/${slug}/${links.at(-1).href}`);
    await plainContext.close();
    results.push({
      slug,
      sourceFile: filename,
      sha256: hash(bytes),
      originalBytesVerified: Boolean(sourceDirectory),
      wording: "passed",
      h2TocCount: links.length,
      links: "preserved",
      noJavaScript: "passed",
      widths,
      errors,
    });
    console.log(
      `PASS ${slug}: original source, wording, ${links.length} H2 links, 6 viewport sizes`,
    );
  }

  const context = await browser.newContext({
    viewport: { width: 1440, height: 960 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  for (const route of ["/", "/chinh-sach-bao-mat/", "/lien-he/"]) {
    await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded" });
    const policyNav = page.getByRole("navigation", {
      name: "Chính sách & Điều khoản",
      exact: true,
    });
    await expect(policyNav.locator("a")).toHaveCount(8);
    for (const [slug] of documents)
      await expect(policyNav.locator(`a[href="/${slug}/"]`)).toHaveCount(1);
    await policyNav.locator('a[href="/dieu-khoan-su-dung-dich-vu/"]').click();
    await expect(page).toHaveURL(`${base}/dieu-khoan-su-dung-dich-vu/`);
  }
  const privacy = JSON.parse(
    await fs.readFile("src/data/privacy-policy.json", "utf8"),
  );
  await page.goto(`${base}/chinh-sach-bao-mat/`);
  expect(
    await page
      .locator("article h1, article h2, article h3, article p, article li")
      .evaluateAll((nodes) => nodes.map((node) => node.textContent)),
  ).toEqual(
    [
      privacy.title,
      ...privacy.blocks.flatMap((block) =>
        block.type === "list" ? block.items : [block.text],
      ),
    ].map((text) => text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")),
  );
  await expect(page.locator("aside nav a")).toHaveCount(9);
  for (const [oldPath, newPath] of [
    ["privacy-policy", "chinh-sach-bao-mat"],
    ["terms-and-condition", "dieu-khoan-su-dung-dich-vu"],
    ["service-level-agreement", "cam-ket-chat-luong-dich-vu"],
  ]) {
    const response = await page.request.get(`${base}/${oldPath}/?ref=legal`, {
      maxRedirects: 0,
    });
    expect(response.status()).toBe(308);
    expect(response.headers().location).toBe(`/${newPath}/?ref=legal`);
  }
  for (const asset of JSON.parse(
    await fs.readFile("src/data/legal-images.json", "utf8"),
  )) {
    expect(hash(await fs.readFile(`public${asset.path}`))).toBe(asset.sha256);
    expect((await page.request.get(`${base}${asset.path}`)).status()).toBe(200);
  }
  await context.close();
  await fs.writeFile(
    `${directory}/results.json`,
    JSON.stringify(
      {
        documents: results,
        footer: "passed",
        privacyRegression: "passed",
        redirects: "passed",
        imageHashes: "passed",
      },
      null,
      2,
    ),
  );
  console.log(
    "PASS footer navigation, privacy regression, redirects, VNPAY asset hashes",
  );
} finally {
  await browser.close();
}
