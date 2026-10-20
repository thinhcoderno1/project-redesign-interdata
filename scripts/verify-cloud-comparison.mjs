import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.TEST_BASE_URL || "http://localhost:3100";
const directory =
  process.env.CLOUD_COMPARISON_QA_DIR || "artifacts/cloud-server/comparison/qa";
await fs.mkdir(directory, { recursive: true });
const vps = JSON.parse(await fs.readFile("src/data/vps-content.json", "utf8"));
const columns = [
  {
    key: "amd",
    label: "AMD Gen 3 Cloud",
    href: "https://interdata.vn/amd-epyc-gen3-cloud/",
  },
  {
    key: "platinum",
    label: "Intel Platinum Gen 2 Cloud",
    href: "https://interdata.vn/intel-platinum-gen2-cloud/",
  },
];
const browser = await chromium.launch();
const results = [];
try {
  const context = await browser.newContext({
    viewport: { width: 390, height: 1100 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`${base}/cloud-server/`);
  const section = page.locator(
    'section[aria-labelledby="cloud-comparison-title"]',
  );
  const rail = section.locator("#cloud-comparison-scroll");
  const next = section.getByRole("button", {
    name: "Xem dòng Cloud Server tiếp theo",
    includeHidden: true,
  });
  const previous = section.getByRole("button", {
    name: "Xem dòng Cloud Server trước",
    includeHidden: true,
  });
  await expect(next).toBeVisible();
  await expect(section.locator("h2")).toHaveText(
    "So Sánh Các Dòng Cloud Server Tại InterData",
  );
  await expect(section.locator("tbody th")).toHaveText(
    vps.comparison.rows.map((r) => r.criteria),
  );
  await expect(section.locator("thead th[data-service]")).toHaveCount(2);
  await expect(section.locator("img")).toHaveCount(0);
  for (const column of columns) {
    await expect(
      section.locator(`thead th[data-service="${column.key}"]`),
    ).toContainText(column.label);
    const links = section.getByRole("link", {
      name: `Xem chi tiết ${column.label}`,
      exact: true,
    });
    await expect(links).toHaveCount(2);
    for (const link of await links.all())
      await expect(link).toHaveAttribute("href", column.href);
  }
  await expect(
    section.getByRole("link", { name: "Liên hệ tư vấn" }),
  ).toHaveAttribute("href", "/lien-he/");
  const latency = section.locator("tbody tr").nth(2);
  await expect(latency.locator("td")).toHaveText([
    "Cần đo trên cấu hình thực tế",
    "Cần đo trên cấu hình thực tế",
  ]);
  await expect(section.locator("tbody tr").nth(6).locator("td")).toHaveText([
    "Xác nhận lịch và số bản lưu theo gói",
    "Xác nhận lịch và số bản lưu theo gói",
  ]);

  // Cross-check the Cloud-specific storage, port, bandwidth range and IPv4 caveat.
  for (const gid of [40, 41]) {
    const source = await (
      await fetch(`https://support.interdata.vn/packages.php?gid=${gid}`)
    ).json();
    assert.equal(source.success, true);
    const products = source.products.filter(
      (p) => !p.name.toLowerCase().includes("custom"),
    );
    assert.ok(
      products.every(
        (p) =>
          /NVMe U\.2/.test(p.description) &&
          /10Gbps Network Port/.test(p.description),
      ),
    );
    const bandwidth = products.map((p) =>
      Number(p.description.match(/(\d+) GB băng thông/)[1]),
    );
    assert.equal(Math.min(...bandwidth), 1000);
    assert.equal(Math.max(...bandwidth), 22000);
    if (gid === 41)
      assert.ok(
        products.some((p) => /HN/.test(p.name) && !/IPv4/.test(p.description)),
      );
  }

  for (const width of [320, 390, 639, 640, 768, 899, 900, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1100 });
    await page.evaluate(() => document.fonts.ready);
    await rail.evaluate((n) => {
      n.scrollLeft = 0;
    });
    await expect(previous).toBeDisabled();
    const metrics = await rail.evaluate((n) => {
      const b = n.getBoundingClientRect();
      const cells = [...n.querySelectorAll("thead th")].map((c) => {
        const r = c.getBoundingClientRect();
        return { left: r.left, right: r.right, width: r.width };
      });
      return {
        pageWidth: document.documentElement.scrollWidth,
        railWidth: n.clientWidth,
        scrollWidth: n.scrollWidth,
        stickyLeft: cells[0].left,
        visible: cells
          .slice(1)
          .filter(
            (c) =>
              c.left >= cells[0].right - 1 &&
              c.right <= b.left + n.clientWidth + 1,
          ).length,
      };
    });
    assert.ok(metrics.pageWidth <= width);
    assert.equal(metrics.visible, width < 640 ? 1 : 2);
    await expect(section.locator("#cloud-comparison-hint")).toBeHidden();
    await expect(section.locator('[aria-live="polite"]')).toBeHidden();
    for (const region of ["thead", "tfoot"]) {
      const sizes = await section.locator(`${region} a`).evaluateAll((links) =>
        links.map((a) => {
          const r = a.getBoundingClientRect();
          return { width: r.width, height: r.height, top: r.top };
        }),
      );
      assert.ok(
        Math.max(...sizes.map((r) => r.width)) -
          Math.min(...sizes.map((r) => r.width)) <
          1,
      );
      assert.ok(
        Math.max(...sizes.map((r) => r.height)) -
          Math.min(...sizes.map((r) => r.height)) <
          1,
      );
      assert.ok(
        Math.max(...sizes.map((r) => r.top)) -
          Math.min(...sizes.map((r) => r.top)) <
          1,
      );
      assert.ok(sizes.every((r) => r.height >= 44));
    }
    if (width < 640) {
      await expect(next).toBeVisible();
      await expect(previous).toBeVisible();
      await expect(next.locator("svg")).toHaveCount(1);
      await expect(previous.locator("svg")).toHaveCount(1);
      await expect(next).toHaveText("");
      await expect(previous).toHaveText("");
      await expect(next).toBeEnabled();
      await next.click();
      await expect
        .poll(() => rail.evaluate((n) => n.scrollLeft))
        .toBeGreaterThan(50);
      await expect(next).toBeDisabled();
      const stickyAfter = await rail
        .locator("thead th")
        .first()
        .evaluate((n) => n.getBoundingClientRect().left);
      assert.ok(Math.abs(stickyAfter - metrics.stickyLeft) < 1);
      await rail.focus();
      await page.keyboard.press("Home");
      await expect(previous).toBeDisabled();
      await page.keyboard.press("ArrowRight");
      await expect(previous).toBeEnabled();
      await page.keyboard.press("ArrowLeft");
      await expect(previous).toBeDisabled();
      await page.keyboard.press("End");
      await expect(next).toBeDisabled();
      for (const link of await rail.locator("thead a").all()) {
        await link.focus();
        assert.ok(
          await link.evaluate((a) => {
            const n = a.closest('[role="region"]'),
              r = a.getBoundingClientRect(),
              b = n.getBoundingClientRect(),
              sticky = n.querySelector("thead th").getBoundingClientRect();
            return (
              r.left >= sticky.right - 1 &&
              r.right <= b.left + n.clientWidth + 1
            );
          }),
        );
      }
    } else {
      await expect(next).toBeHidden();
      await expect(previous).toBeHidden();
      await expect(next).toBeDisabled();
      assert.ok(metrics.scrollWidth <= metrics.railWidth + 1);
    }
    await rail.evaluate((n) => {
      n.scrollLeft = 0;
      n.blur();
    });
    if ([320, 390, 768, 1024, 1440, 1920].includes(width)) {
      const axe = await new AxeBuilder({ page })
        .include('section[aria-labelledby="cloud-comparison-title"]')
        .analyze();
      assert.deepEqual(
        axe.violations.map((v) => v.id),
        [],
      );
      await page.addStyleTag({
        content:
          'header.site-header, nav[aria-label="Liên hệ nhanh và tiện ích"], body > a[href="#noi-dung"] { visibility: hidden !important; }',
      });
      await section.screenshot({ path: `${directory}/section-${width}.png` });
    }
    results.push({
      width,
      metrics,
      controls: "pass",
      keyboard: "pass",
      alignedCtas: "pass",
    });
  }
  await page.setViewportSize({ width: 390, height: 1000 });
  await rail.evaluate((n) => {
    n.scrollLeft = 0;
  });
  const cell = rail.locator("tbody td").first();
  await cell.scrollIntoViewIfNeeded();
  const box = await cell.boundingBox();
  await page.mouse.move(box.x + box.width - 20, box.y + 20);
  await page.mouse.down();
  await page.mouse.move(box.x + 20, box.y + 20, { steps: 12 });
  await page.mouse.up();
  assert.ok((await rail.evaluate((n) => n.scrollLeft)) > 50);
  await rail.evaluate((n) => {
    n.scrollLeft = 0;
  });
  let requested = false;
  await context.route(columns[0].href, async (route) => {
    requested = true;
    await route.fulfill({
      status: 200,
      contentType: "text/html",
      body: "<title>Verified service destination</title>",
    });
  });
  await section
    .getByRole("link", {
      name: `Xem chi tiết ${columns[0].label}`,
      exact: true,
    })
    .first()
    .click();
  await expect.poll(() => requested).toBe(true);
  assert.deepEqual(errors, []);
  await context.close();

  const mobile = await browser.newContext({
    viewport: { width: 390, height: 960 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: "reduce",
  });
  const touchPage = await mobile.newPage();
  await touchPage.goto(`${base}/cloud-server/`);
  const touchRail = touchPage.locator("#cloud-comparison-scroll"),
    touchCell = touchRail.locator("tbody td").first();
  await touchCell.scrollIntoViewIfNeeded();
  const bounds = await touchCell.boundingBox(),
    cdp = await mobile.newCDPSession(touchPage);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: bounds.x + bounds.width - 20, y: bounds.y + 20 }],
  });
  for (let step = 1; step <= 12; step++) {
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [
        {
          x: bounds.x + bounds.width - 20 - ((bounds.width - 40) * step) / 12,
          y: bounds.y + 20,
        },
      ],
    });
    await new Promise((resolve) => setTimeout(resolve, 16));
  }
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect
    .poll(() => touchRail.evaluate((n) => n.scrollLeft))
    .toBeGreaterThan(50);
  await mobile.close();

  const noJs = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 960 },
  });
  const fallback = await noJs.newPage();
  await fallback.goto(`${base}/cloud-server/`);
  const native = fallback.locator("#cloud-comparison-scroll");
  await expect(native.locator("tbody tr")).toHaveCount(7);
  await expect(
    fallback.getByRole("button", { name: "Xem dòng Cloud Server tiếp theo" }),
  ).toBeHidden();
  await native.evaluate((n) => {
    n.scrollLeft = n.scrollWidth;
  });
  assert.ok((await native.evaluate((n) => n.scrollLeft)) > 0);
  await expect(
    native.locator('thead th[data-service="platinum"]'),
  ).toContainText(columns[1].label);
  await noJs.close();
  await fs.writeFile(
    `${directory}/results.json`,
    JSON.stringify(
      {
        base,
        results,
        sourceCriteria: "7 VPS criteria preserved",
        cloudFacts: "verified",
        mouseDrag: true,
        touchSwipe: true,
        noJavaScript: true,
        serviceLinkAfterDrag: true,
        errors,
      },
      null,
      2,
    ),
  );
  console.log(
    `PASS Cloud comparison: ${results.length} widths, sticky criteria, keyboard, drag/swipe, Cloud facts, links, CTA alignment, axe and no-JS`,
  );
} finally {
  await browser.close();
}
