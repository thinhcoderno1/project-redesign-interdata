import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { parseDocument } from "htmlparser2";
import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { loadProjectModule } from "./load-project-typescript.mjs";

const base = process.env.TEST_BASE_URL || "http://localhost:3100";
const { publicPagePaths } = loadProjectModule("src/lib/seo-sitemap.ts");
const { testimonials } = loadProjectModule("src/data/testimonials.ts");
const storyPaths = [
  "/",
  "/thue-vps/",
  "/vps-amd/",
  "/vps-gold/",
  "/vps-linux/",
  "/vps-platinum/",
  "/vps-n8n/",
  "/cloud-server/",
  "/amd-cloud-server/",
  "/platinum-cloud-server/",
  "/thue-may-chu-vat-ly/",
  "/vietnam-colocation/",
  "/trien-khai-private-network/",
  "/trien-khai-proxmox-ceph/",
  "/trien-khai-vmware/",
  "/trien-khai-Kubernetes-k8s/",
  "/s3-object-storage/",
  "/canhme/",
  "/vps-vibe-coding/",
];
function find(node, predicate) {
  return [
    ...(predicate(node) ? [node] : []),
    ...(node.children || []).flatMap((child) => find(child, predicate)),
  ];
}
const hasClass = (name) => (node) =>
  node.attribs?.class?.split(/\s+/).includes(name);
const text = (node) =>
  node?.type === "text" ? node.data : (node?.children || []).map(text).join("");
const content = (node, className) => text(find(node, hasClass(className))[0]);
const results = [];
for (const path of publicPagePaths) {
  const response = await fetch(`${base}${path}`, {
    signal: AbortSignal.timeout(60000),
  });
  assert.equal(response.status, 200, path);
  const dom = parseDocument(await response.text());
  const sections = find(dom, (node) => node.attribs?.id === "khach-hang");
  assert.equal(sections.length, storyPaths.includes(path) ? 1 : 0, path);
  if (!sections.length) continue;
  const rendered = find(sections[0], hasClass("testimonial-card")).map(
    (card) => ({
      company: text(
        find(
          card,
          (node) =>
            node.name === "span" &&
            node.parent?.attribs?.class === "testimonial-author",
        )[0],
      ),
      name: text(find(card, (node) => node.name === "strong")[0]),
      quote: content(card, "testimonial-full"),
    }),
  );
  assert.deepEqual(
    rendered,
    testimonials.map(({ name, company, quote }) => ({ name, company, quote })),
    path,
  );
  assert.equal(
    find(sections[0], (node) => node.attribs?.id === "customer-proof-title")
      .length,
    1,
  );
  results.push(path);
}
assert.equal(results.length, storyPaths.length);

const browser = await chromium.launch();
try {
  for (const path of ["/", "/thue-vps/", "/canhme/", "/vps-vibe-coding/"]) {
    for (const width of [390, 1440]) {
      const context = await browser.newContext({
        viewport: { width, height: 1100 },
        reducedMotion: "reduce",
      });
      await context.route("**/*", (route) =>
        new URL(route.request().url()).origin === new URL(base).origin
          ? route.continue()
          : route.abort(),
      );
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded" });
      await page.evaluate(() => document.fonts.ready);
      const section = page.locator("#khach-hang");
      const track = section.locator(".testimonial-track");
      await expect(section.locator(".testimonial-carousel")).toHaveAttribute(
        "data-enhanced",
        "true",
      );
      await expect(section.locator(".testimonial-author span")).toHaveText(
        testimonials.map((item) => item.company),
      );
      await section.scrollIntoViewIfNeeded();
      await expect(section.locator(".testimonial-slide")).toHaveCount(
        Math.ceil(testimonials.length / (width >= 960 ? 3 : 1)),
      );
      await section.locator(".testimonial-details summary").first().click();
      await expect(section.locator("details").first()).toHaveAttribute(
        "open",
        "",
      );
      await section.locator(".testimonial-details summary").first().click();
      await track.focus();
      await page.keyboard.press("ArrowRight");
      await expect(section.locator("[data-carousel-count]")).toContainText(
        "02",
      );
      await page.keyboard.press("Home");
      await expect(
        section.locator(".testimonial-arrows button").first(),
      ).toBeDisabled();
      for (const image of await section
        .locator(".testimonial-slide")
        .first()
        .locator("img")
        .all())
        await expect
          .poll(() =>
            image.evaluate((node) => node.complete && node.naturalWidth > 0),
          )
          .toBe(true);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        `${path} ${width}`,
      );
      assert.equal(
        await section
          .locator(".testimonial-card")
          .first()
          .evaluate((card) => card.scrollWidth > card.clientWidth + 1),
        false,
      );
      assert.deepEqual(errors, [], path);
      const accessibility = await new AxeBuilder({ page })
        .include("#khach-hang")
        .analyze();
      assert.deepEqual(
        accessibility.violations,
        [],
        `${path} ${width}: accessible shared stories`,
      );
      await fs.mkdir("artifacts/success-stories", { recursive: true });
      await section.screenshot({
        path: `artifacts/success-stories/${path === "/" ? "home" : path.split("/")[1]}-${width}.png`,
      });
      await context.close();
    }
  }
} finally {
  await browser.close();
}
console.log(
  `Success stories: ${results.length} routes share all ${testimonials.length} ordered testimonials without JavaScript; four page layouts, mobile/desktop, images, disclosure and keyboard navigation passed.`,
);
