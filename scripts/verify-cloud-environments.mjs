import assert from "node:assert/strict";
import fs from "node:fs/promises";
import crypto from "node:crypto";
import path from "node:path";
import ts from "typescript";
import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.TEST_BASE_URL || "http://localhost:3100";
const directory =
  process.env.CLOUD_ENVIRONMENTS_QA_DIR ||
  "artifacts/cloud-server/environments/qa";
await fs.mkdir(directory, { recursive: true });
async function loadData(file, imports) {
  const result = {};
  new Function(
    "exports",
    "require",
    ts.transpileModule(await fs.readFile(file, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        esModuleInterop: true,
      },
    }).outputText,
  )(result, (name) => imports[name]);
  return result;
}
const source = await loadData("src/data/vps-environments.ts", {
  "./vps-content.json": JSON.parse(
    await fs.readFile("src/data/vps-content.json", "utf8"),
  ),
});
const data = await loadData("src/data/cloud-environments.ts", {
  "./vps-environments": source,
});
assert.deepEqual(data.cloudEnvironmentHeader, source.vpsEnvironmentHeader);
for (const [actual, expected] of [
  [data.cloudOperatingSystems, source.vpsLinuxSystems],
  [data.cloudOneClickApps, source.vpsOneClickApps],
]) {
  assert.deepEqual(
    actual.map(({ logo, ...item }) => ({ ...item, logo: path.basename(logo) })),
    expected.map(({ logo, ...item }) => ({
      ...item,
      logo: path.basename(logo),
    })),
  );
  for (let index = 0; index < actual.length; index++) {
    assert.deepEqual(
      await fs.readFile(`public${actual[index].logo}`),
      await fs.readFile(`public${expected[index].logo}`),
    );
  }
}
const assets = JSON.parse(
  await fs.readFile("docs/cloud-environments-assets.json", "utf8"),
);
for (const asset of assets.brandAssets)
  assert.equal(
    crypto
      .createHash("sha256")
      .update(await fs.readFile(asset.target))
      .digest("hex"),
    asset.sha256,
  );
assert.notEqual(
  await fs.readFile(assets.background.target, "utf8"),
  await fs.readFile("public/images/vps/environments-globe.svg", "utf8"),
);

const browser = await chromium.launch();
const results = [];
try {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${base}/cloud-server/`);
  const section = page.locator("#cloud-deployment");
  const tabs = [
    page.locator("#cloud-environment-tab-0"),
    page.locator("#cloud-environment-tab-1"),
  ];
  const panels = [
    page.locator("#cloud-environment-panel-0"),
    page.locator("#cloud-environment-panel-1"),
  ];
  await expect(tabs[0]).toBeVisible();
  await expect(section.getByRole("tab")).toHaveText([
    "Linux OS",
    "1-Click Applications",
  ]);
  await expect(section.locator("h2")).toHaveText(
    source.vpsEnvironmentHeader.title,
  );
  await expect(panels[0].locator("article h3")).toHaveText(
    data.cloudOperatingSystems.map((s) => s.name),
  );
  await expect(section.locator("h2 + p")).toHaveText(
    source.vpsEnvironmentHeader.text,
  );
  await expect(section.locator("h2").locator("..").locator(":scope > span")).toHaveText(
    source.vpsEnvironmentHeader.eyebrow,
  );
  await expect(panels[1].locator("article h3")).toHaveText(
    source.vpsOneClickApps.map((s) => s.name),
  );
  await expect(panels[1].locator("article p")).toHaveText(
    source.vpsOneClickApps.map((s) => s.text),
  );
  await expect(panels[1].locator("article small")).toHaveText(
    source.vpsOneClickApps.map((s) => s.label),
  );

  for (const width of [
    320, 359, 360, 390, 639, 640, 768, 899, 900, 1024, 1199, 1200, 1440, 1920,
  ]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.evaluate(() => document.fonts.ready);
    for (const index of [0, 1]) {
      await tabs[index].click();
      await expect(tabs[index]).toHaveAttribute("aria-selected", "true");
      await expect(panels[index]).toBeVisible();
      await expect(panels[1 - index]).toBeHidden();
      await panels[index]
        .locator("img")
        .evaluateAll((images) => Promise.all(images.map((i) => i.decode())));
      const metrics = await panels[index].evaluate((node) => {
        const cards = [...node.querySelectorAll("article,li")].map((card) => {
          const r = card.getBoundingClientRect(),
            surface = card.firstElementChild;
          return {
            x: r.x,
            height: r.height,
            width: r.width,
            clipped:
              surface.scrollWidth > surface.clientWidth + 1 ||
              surface.scrollHeight > surface.clientHeight + 1,
            shape: getComputedStyle(surface).clipPath,
          };
        });
        return {
          pageWidth: document.documentElement.scrollWidth,
          columns: new Set(cards.map((c) => Math.round(c.x))).size,
          cards,
          images: [...node.querySelectorAll("img")].map((i) => ({
            src: i.getAttribute("src"),
            loaded: i.complete && i.naturalWidth > 0,
          })),
        };
      });
      assert.ok(metrics.pageWidth <= width);
      assert.equal(metrics.cards.length, index === 0 ? 5 : 4);
      assert.equal(
        metrics.columns,
        index === 0
          ? width < 640
            ? 2
            : width < 900
              ? 3
              : 5
          : width < 360
            ? 1
            : width < 900
              ? 2
              : 4,
      );
      assert.ok(
        metrics.cards.every((c) => !c.clipped && c.shape.startsWith("polygon")),
      );
      assert.ok(
        Math.max(...metrics.cards.map((c) => c.height)) -
          Math.min(...metrics.cards.map((c) => c.height)) <
          1,
      );
      assert.ok(
        metrics.images.every(
          (i) =>
            i.loaded &&
            i.src.startsWith(
              index === 0
                ? "/images/cloud-server/operating-systems/"
                : "/images/cloud-server/one-click/",
            ),
        ),
      );
      assert.ok((await tabs[index].boundingBox()).height >= 44);
      if ([320, 390, 768, 1024, 1440, 1920].includes(width)) {
        const axe = await new AxeBuilder({ page })
          .include("#cloud-deployment")
          .analyze();
        assert.deepEqual(
          axe.violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => n.target),
          })),
          [],
        );
        await page.addStyleTag({
          content:
            'header.site-header, nav[aria-label="Liên hệ nhanh và tiện ích"] { visibility: hidden !important; }',
        });
        await tabs[index].evaluate((node) => node.blur());
        await page.mouse.move(0, 0);
        await section.screenshot({
          path: `${directory}/${index === 0 ? "linux" : "applications"}-${width}.png`,
        });
      }
      const padding = await section.evaluate((node) => ({
        top: getComputedStyle(node).paddingTop,
        bottom: getComputedStyle(node).paddingBottom,
      }));
      const expectedPadding =
        width < 640 ? "40px" : width < 1200 ? "48px" : "64px";
      assert.deepEqual(padding, {
        top: expectedPadding,
        bottom: expectedPadding,
      });
      results.push({
        width,
        panel: index === 0 ? "linux" : "applications",
        metrics,
        padding,
      });
    }
  }
  await tabs[0].focus();
  for (const [key, index] of [
    ["ArrowRight", 1],
    ["ArrowRight", 0],
    ["End", 1],
    ["Home", 0],
    ["ArrowLeft", 1],
  ]) {
    await page.keyboard.press(key);
    await expect(tabs[index]).toBeFocused();
    await expect(panels[index]).toBeVisible();
  }
  assert.deepEqual(errors, []);
  await context.close();

  const touch = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const mobile = await touch.newPage();
  await mobile.goto(`${base}/cloud-server/`);
  await mobile.locator("#cloud-environment-tab-1").tap();
  await expect(mobile.locator("#cloud-environment-panel-1")).toBeVisible();
  await touch.close();

  const noJs = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 960 },
  });
  const fallback = await noJs.newPage();
  await fallback.goto(`${base}/cloud-server/`);
  await expect(
    fallback.locator("#cloud-deployment [role=tablist]"),
  ).toBeHidden();
  await expect(fallback.locator("#cloud-environment-panel-0")).toBeVisible();
  await expect(fallback.locator("#cloud-environment-panel-1")).toBeVisible();
  await expect(
    fallback.locator("#cloud-environment-panel-0 article"),
  ).toHaveCount(5);
  await expect(
    fallback.locator("#cloud-environment-panel-1 article"),
  ).toHaveCount(4);
  assert.equal(
    await fallback.evaluate(
      () => document.documentElement.scrollWidth > innerWidth + 1,
    ),
    false,
  );
  await noJs.close();
  await fs.writeFile(
    `${directory}/results.json`,
    JSON.stringify(
      {
        base,
        results,
        keyboard: true,
        touch: true,
        noJavaScript: true,
        errors,
      },
      null,
      2,
    ),
  );
  console.log(
    "PASS Cloud environments: 14 widths, 2 tabs, exact VPS content and logos, keyboard/touch, no-JS, uniform cards, spacing and axe",
  );
} finally {
  await browser.close();
}
