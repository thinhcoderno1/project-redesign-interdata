import { readSchemaNodes } from "./schema-helpers.mjs";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import crypto from "node:crypto";
import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { decodeHTML } from "entities";

const base = process.env.TEST_BASE_URL || "http://localhost:3100";
const dir = process.env.CLOUD_QA_DIR || "artifacts/cloud-server/qa";
await fs.mkdir(dir, { recursive: true });
const source = {};
for (const gid of [40, 41]) {
  const upstream = await fetch(
    `https://support.interdata.vn/packages.php?gid=${gid}`,
  );
  assert.equal(upstream.status, 200);
  const raw = await upstream.json();
  assert.equal(raw.success, true);
  source[gid] = raw.products;
  const api = await fetch(`${base}/api/cloud-server-pricing/?gid=${gid}`);
  assert.equal(api.status, 200);
  const { products } = await api.json();
  assert.equal(products.length, raw.products.length);
  for (const [i, product] of products.entries()) {
    const original = raw.products[i];
    for (const field of ["pid", "name", "description", "product_url", "slug"])
      assert.equal(product[field], original[field]);
    for (const cycle of [
      "monthly",
      "quarterly",
      "semiannually",
      "annually",
      "biennially",
      "triennially",
    ])
      assert.equal(product.pricing.VND[cycle], original.pricing.VND[cycle]);
    assert.equal(
      product.available,
      !(
        String(original.stockcontrol) === "true" &&
        Number(original.stocklevel ?? 0) <= 0
      ),
    );
  }
}
for (const gid of ["", "67", "0", "40.5", "bad"])
  assert.equal(
    (await fetch(`${base}/api/cloud-server-pricing/?gid=${gid}`)).status,
    400,
  );

const manifest = JSON.parse(
  await fs.readFile("docs/cloud-server-images.json", "utf8"),
);
const businessImages = JSON.parse(
  await fs.readFile("docs/cloud-service-business-images.json", "utf8"),
);
const digest = (buffer) =>
  crypto.createHash("sha256").update(buffer).digest("hex");
assert.equal(manifest.images.length, 9);
assert.equal(businessImages.images.length, 2);
const oldHashes = new Set();
for (const directory of ["public/images/vps", "public/images/cta"]) {
  for (const path of await fs.readdir(directory, { recursive: true })) {
    const full = `${directory}/${path}`;
    if ((await fs.stat(full)).isFile())
      oldHashes.add(digest(await fs.readFile(full)));
  }
}
for (const image of [...manifest.images, ...businessImages.images]) {
  const hash = digest(await fs.readFile(image.target));
  assert.equal(hash, image.sha256);
  assert.ok(!oldHashes.has(hash), `Reused VPS image: ${image.target}`);
}

const browser = await chromium.launch();
const results = [];
const money = (value) =>
  `${new Intl.NumberFormat("vi-VN").format(Number(value))}đ`;
const cycles = [
  "monthly",
  "quarterly",
  "semiannually",
  "annually",
  "biennially",
  "triennially",
];
try {
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    const context = await browser.newContext({
      viewport: { width, height: 1000 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    assert.equal((await page.goto(`${base}/cloud-server/`)).status(), 200);
    const range = page.locator('section[aria-labelledby="cloud-range-title"]');
    const serviceCards = range.locator("article[data-cloud-service]");
    await expect(serviceCards).toHaveCount(2);
    for (const card of await serviceCards.all())
      await expect(card).toBeVisible();
    await expect(
      range.locator(
        '[role="tab"], [role="tablist"], [role="tabpanel"], button, [inert], [aria-hidden="true"]:not(svg)',
      ),
    ).toHaveCount(0);
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(page.locator("main h1")).toContainText("Cloud Server");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://interdata.vn/cloud-server/",
    );
    // Wait for shared carousels to finish their responsive render before decoding images.
    await expect(page.locator("#bao-chi [data-enhanced=true]")).toBeVisible();
    await expect(
      page.locator("#bao-chi [data-carousel-pagination] button"),
    ).toHaveCount(
      Math.ceil(
        (await page.locator("#bao-chi article").count()) /
          (width < 640 ? 1 : width < 960 ? 2 : 3),
      ),
    );
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(
        [...document.querySelectorAll("main img")].map((image) => {
          image.loading = "eager";
          return image.decode().catch(() => {});
        }),
      );
    });
    const broken = await page
      .locator("main img")
      .evaluateAll((images) =>
        images.filter((i) => !i.complete || !i.naturalWidth).map((i) => i.src),
      );
    assert.deepEqual(broken, []);
    const clonedSectionIds = [
      "nang-luc",
      "khach-hang",
      "bao-chi",
      "doi-tac",
      "doi-tac-cong-nghe",
    ];
    const pictures = await page.locator("main img").evaluateAll((images) =>
      images.map((i) => ({
        src: i.getAttribute("src"),
        section: i.closest("section")?.id,
      })),
    );
    for (const { src: picture, section } of pictures) {
      const path = decodeURIComponent(picture);
      // Shared company sections intentionally reuse the approved VPS imagery.
      if (clonedSectionIds.includes(section)) continue;
      assert.ok(
        path.includes("/images/cloud-server/") ||
          path.includes("/images/technology-partners/"),
        path,
      );
      assert.ok(!path.includes("globe.svg"));
    }
    const order = await page
      .locator("main section")
      .evaluateAll((sections) =>
        sections.map((section) => section.id).filter(Boolean),
      );
    assert.deepEqual(
      order.slice(
        order.indexOf("cloud-deployment") + 1,
        order.indexOf("cloud-deployment") + 6,
      ),
      clonedSectionIds,
    );
    await expect(
      page.locator("#cloud-stories-title, #cloud-press-title"),
    ).toHaveCount(0);
    const reference = await context.newPage();
    assert.equal((await reference.goto(`${base}/thue-vps/`)).status(), 200);
    const snapshot = (node) => ({
      text: node.textContent.replace(/\s+/g, " ").trim(),
      images: [...node.querySelectorAll("img")].map((img) => {
        const src = img.getAttribute("src");
        const url = new URL(src, location.origin);
        return {
          src: url.searchParams.get("url") || url.pathname,
          alt: img.alt,
        };
      }),
      links: [...node.querySelectorAll("a")].map((a) => ({
        href: a.getAttribute("href"),
        target: a.getAttribute("target"),
        rel: a.getAttribute("rel"),
      })),
    });
    for (const current of [page, reference]) {
      await expect(
        current.locator("#khach-hang [data-enhanced=true]"),
      ).toBeVisible();
      await expect(
        current.locator("#bao-chi [data-carousel-pagination] button"),
      ).toHaveCount(
        Math.ceil(
          (await current.locator("#bao-chi article").count()) /
            (width < 640 ? 1 : width < 960 ? 2 : 3),
        ),
      );
    }
    for (const id of clonedSectionIds) {
      const section = page.locator(`#${id}`);
      await expect(section).toHaveCount(1);
      assert.deepEqual(
        await section.evaluate(snapshot),
        await reference.locator(`#${id}`).evaluate(snapshot),
        `VPS clone mismatch: ${id}`,
      );
      await expect(section.locator(".eyebrow > svg")).toHaveCount(1);
      assert.deepEqual(
        await section.evaluate((node) => ({
          top: getComputedStyle(node).paddingTop,
          bottom: getComputedStyle(node).paddingBottom,
        })),
        {
          top: width < 640 ? "40px" : width < 1200 ? "48px" : "64px",
          bottom: width < 640 ? "40px" : width < 1200 ? "48px" : "64px",
        },
      );
    }
    await reference.close();
    for (const [id, nextLabel] of [
      ["khach-hang", "Slide phản hồi tiếp theo"],
      ["bao-chi", "Slide báo chí tiếp theo"],
    ]) {
      const section = page.locator(`#${id}`);
      const track = section.locator("[data-carousel-track]");
      const dots = section.locator("[data-carousel-pagination] button");
      await track.focus();
      await page.keyboard.press("End");
      await expect(dots.last()).toHaveAttribute("aria-current", "true");
      await page.keyboard.press("Home");
      await expect(dots.first()).toHaveAttribute("aria-current", "true");
      await section
        .getByRole("button", { name: nextLabel, exact: true })
        .click();
      await expect(dots.nth(1)).toHaveAttribute("aria-current", "true");
      await track.focus();
      await page.keyboard.press("Home");
      await expect(dots.first()).toHaveAttribute("aria-current", "true");
    }
    const story = page.locator("#khach-hang .testimonial-details").first();
    await story.locator("summary").click();
    await expect(story).toHaveAttribute("open", "");
    await story.locator("summary").click();
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth + 1,
      ),
      false,
    );
    const anchors = await page
      .locator('main a[href^="#"]')
      .evaluateAll((links) => links.map((a) => a.getAttribute("href")));
    for (const anchor of anchors)
      assert.ok(await page.locator(anchor).count(), `Missing anchor ${anchor}`);
    const layout = await serviceCards.evaluateAll((cards) =>
      cards.map((card) => {
        const r = card.getBoundingClientRect();
        return {
          x: r.x,
          y: r.y,
          width: r.width,
          height: r.height,
          transform: getComputedStyle(card).transform,
        };
      }),
    );
    assert.equal(
      new Set(layout.map((r) => Math.round(r.x))).size,
      width < 900 ? 1 : 2,
    );
    assert.ok(layout.every((r) => r.transform === "none" && r.width > 0));
    const serviceLinks = serviceCards.locator("a");
    await serviceLinks.first().focus();
    await page.keyboard.press("Tab");
    await expect(serviceLinks.last()).toBeFocused();
    for (const gid of [40, 41]) {
      await page.locator(`#cloud-tab-${gid}`).click();
      const panel = page.locator(`#cloud-panel-${gid}`);
      const rows = source[gid].filter(
        (p) => !p.name.toLowerCase().includes("custom"),
      );
      await expect(panel.locator("article[data-pid]")).toHaveCount(4);
      for (const [index, cycle] of cycles.entries()) {
        await panel.locator(`#cloud-cycle-${gid}-tab-${cycle}`).click();
        for (const product of rows.slice(0, 4)) {
          const card = panel.locator(`article[data-pid="${product.pid}"]`);
          await expect(card.locator("h3")).toHaveText(product.name.trim());
          await expect(card.locator("strong")).toHaveText(
            money(product.pricing.VND[cycle]),
          );
          const specs = decodeHTML(
            product.description
              .replace(/<br\s*\/?\s*>/gi, "\n")
              .replace(/<[^>]*>/g, ""),
          )
            .split(/\r?\n|\?/)
            .map((s) => s.trim())
            .filter(Boolean);
          assert.deepEqual(
            await card.locator("li span").allTextContents(),
            specs,
          );
          const available = !(
            String(product.stockcontrol) === "true" &&
            Number(product.stocklevel ?? 0) <= 0
          );
          const link = card.locator("a");
          if (available) {
            const url = new URL(await link.getAttribute("href"));
            assert.equal(url.searchParams.get("billingcycle"), cycle);
            const original = new URL(product.product_url);
            assert.equal(
              url.origin + url.pathname,
              original.origin + original.pathname,
            );
            for (const [key, value] of original.searchParams)
              assert.equal(url.searchParams.get(key), value);
          } else await expect(link).toHaveAttribute("href", "/lien-he/");
        }
        if (index === 0) {
          await panel
            .getByRole("tab", { name: "1 tháng", exact: true })
            .focus();
          await page.keyboard.press("ArrowRight");
          await expect(
            panel.locator(`#cloud-cycle-${gid}-tab-quarterly`),
          ).toBeFocused();
        }
      }
      await panel.getByRole("button", { name: "Xem thêm" }).click();
      await expect(panel.locator("article[data-pid]")).toHaveCount(rows.length);
      for (const product of rows)
        await expect(
          panel.locator(`article[data-pid="${product.pid}"] strong`),
        ).toHaveText(money(product.pricing.VND.triennially));
      await panel.getByRole("button", { name: "Thu gọn" }).click();
      await panel.locator(`#cloud-cycle-${gid}-tab-monthly`).click();
    }
    await page.locator("#cloud-tab-40").click();
    const faq = page.locator("section[aria-labelledby='cloud-faq-title']");
    await faq.locator("details > summary").first().click();
    await expect(faq.locator("details").first()).toHaveAttribute("open", "");
    await faq.locator("summary").filter({ hasText: "Xem tất cả" }).click();
    await expect(faq.locator("details[open]")).toHaveCount(2);
    await faq.locator("summary").filter({ hasText: "Xem tất cả" }).click();
    await faq.locator("details > summary").first().click();
    const schema = JSON.stringify(
      (await readSchemaNodes(page)).find((node) => node["@type"] === "FAQPage"),
    );
    const json = JSON.parse(schema);
    assert.equal(json.mainEntity.length, await faq.locator("h3").count());
    const axe = await new AxeBuilder({ page })
      .include("main")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    await fs.writeFile(
      `${dir}/axe-${width}.json`,
      JSON.stringify(axe.violations, null, 2),
    );
    assert.deepEqual(
      axe.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
      [],
    );
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: `${dir}/page-${width}.png`, fullPage: true });
    if (width === 1440 || width === 390)
      await page.screenshot({
        path: `${dir}/top-${width}.png`,
        fullPage: false,
      });
    assert.deepEqual(errors, []);
    results.push({
      width,
      overflow: false,
      images: "pass",
      pricing: "2 groups × 6 cycles",
      keyboard: "pass",
      faq: "pass",
      accessibility: "pass",
      pageErrors: errors,
    });
    await context.close();
  }
  const touch = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const mobile = await touch.newPage();
  await mobile.goto(`${base}/cloud-server/`);
  await expect(mobile.locator("#cloud-range-panel-amd")).toBeVisible();
  await expect(mobile.locator("#cloud-range-panel-platinum")).toBeVisible();
  const dots = mobile.locator("#khach-hang [data-carousel-pagination] button");
  await dots.nth(1).tap();
  await expect(dots.nth(1)).toHaveAttribute("aria-current", "true");
  await touch.close();
  const noJs = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const fallback = await noJs.newPage();
  await fallback.goto(`${base}/cloud-server/`);
  await expect(fallback.locator("h1")).toContainText("Cloud Server");
  await expect(fallback.locator("#cloud-range-panel-amd")).toBeVisible();
  await expect(fallback.locator("#cloud-range-panel-platinum")).toBeVisible();
  await expect(
    fallback.locator('#pricing noscript a[href*="intel-platinum-gen2-cloud"]'),
  ).toBeVisible();
  const firstFaq = fallback
    .locator("section[aria-labelledby='cloud-faq-title'] details")
    .first();
  await firstFaq.locator("summary").click();
  await expect(firstFaq).toHaveAttribute("open", "");
  assert.equal(
    await fallback.evaluate(
      () => document.documentElement.scrollWidth > innerWidth + 1,
    ),
    false,
  );
  await noJs.close();
  await fs.writeFile(
    `${dir}/results.json`,
    JSON.stringify(
      {
        base,
        upstreamCounts: Object.fromEntries(
          Object.entries(source).map(([k, v]) => [k, v.length]),
        ),
        generatedAssets: manifest.images.length + businessImages.images.length,
        touch: "pass",
        noJavaScript: "pass",
        results,
      },
      null,
      2,
    ),
  );
  console.log(
    `PASS Cloud Server: 6 widths, live pricing, 6 billing cycles, checkout, keyboard/touch, FAQ, images, axe and no-JS (${dir})`,
  );
} finally {
  await browser.close();
}
