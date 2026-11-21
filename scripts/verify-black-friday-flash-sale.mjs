import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.TEST_BASE_URL || "http://localhost:3000";
const startsAt = "2026-11-23T11:00:00+07:00";
const start = Date.parse(startsAt);
const offers = {
  free: { code: "TEST-FREE" },
  vps81: { code: "TEST-VPS81" },
  vps71: { code: "TEST-VPS71" },
  vps61: { code: "TEST-VPS61" },
  cloud61: { code: "TEST-CLOUD61" },
  cloud51: { code: "TEST-CLOUD51" },
  cloud41: { code: "TEST-CLOUD41" },
};
const checkoutPaths = {
  vps81: "/store/vps-platinum-viettel-hcm/plan-2-2c-2g-30g-platinum-vt",
  vps71: "/store/vps-platinum-viettel-hcm/plan-3-2c-4g-50g-platinum-vt",
  vps61: "/store/vps-platinum-viettel-hcm/plan-5-4c-8g-80g-platinum-vt",
  cloud61: "/store/platinum-g2-cloud/plan-3-hcm",
  cloud51: "/store/platinum-g2-cloud/plan-4-hcm",
  cloud41: "/store/platinum-g2-cloud/platinum-g2-cloud-plan-6",
};
const checkouts = new Map(
  Object.entries(checkoutPaths).map(([id, path]) => [
    id,
    `https://support.interdata.vn/index.php?rp=${path}&billingcycle=quarterly`,
  ]),
);
checkouts.set("free", "https://support.interdata.vn/cart.php?a=add&domain=register");
const directory = "artifacts/black-friday";
await fs.mkdir(directory, { recursive: true });
const browser = await chromium.launch({
  channel: process.env.TEST_BROWSER_CHANNEL || undefined,
});
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    permissions: ["clipboard-read", "clipboard-write"],
  });
  const page = await context.newPage();
  const errors = [];
  const actualResponse = await page.request.get(
    `${base}/api/black-friday-flash-sale/?now=9999999999999`,
  );
  assert.equal(actualResponse.status(), 200);
  assert(actualResponse.headers()["cache-control"].includes("no-store"));
  const actualRelease = await actualResponse.json();
  assert.equal(actualRelease.startsAt, startsAt);
  assert.equal(
    actualRelease.status,
    actualRelease.serverNow < start ? "upcoming" : "live",
  );
  assert.deepEqual(actualRelease.offers, {});
  page.on("pageerror", (error) => errors.push(error.message));
  let serverNow = start - 86400000;
  let requests = 0;
  let failure = false;
  let codesReady = false;
  await page.route("**/api/black-friday-flash-sale/", async (route) => {
    requests++;
    if (failure) return route.fulfill({ status: 503, body: "Unavailable" });
    const live = serverNow >= start;
    await route.fulfill({
      json: {
        serverNow,
        startsAt,
        status: live ? "live" : "upcoming",
        offers: live && codesReady ? offers : {},
      },
    });
  });
  // An advanced device clock must not reveal codes before the server opens.
  await page.clock.setFixedTime(new Date(start + 86400000));
  assert.equal((await page.goto(`${base}/blackfriday/`)).status(), 200);
  assert(!(await page.content()).includes("BF26FLASH20"));
  const section = page.locator("#flash-sale");
  await expect(section).toBeVisible();
  await expect(section.locator(`time[datetime="${startsAt}"]`)).toHaveText(
    "11:00AM · Thứ Hai, 23/11/2026",
  );
  await expect(section.locator('time[datetime="2026-11-25"]')).toHaveText(
    "25/11/2026",
  );
  await expect(section.locator('time[datetime="2026-11-27"]')).toHaveText(
    "27/11/2026",
  );
  await expect(
    section.getByText("Đếm ngược đến giờ mở sale", { exact: true }),
  ).toHaveCount(0);
  await expect(
    section.getByText("Mã và số lượng sẽ hiện lúc 11:00 (giờ Việt Nam).", {
      exact: true,
    }),
  ).toHaveCount(0);
  await expect(page.locator('nav a[href="#flash-sale"]')).toBeVisible();
  await expect(section.locator("article")).toHaveCount(7);
  await expect(section.locator("h3")).toHaveText([
    "TẶNG MIỄN PHÍ TÊN MIỀN .COM",
    "Flash Sale VPS",
    "Flash Sale Cloud Server",
  ]);
  const specs = section.locator('[class*="specs"]');
  await expect(specs).toHaveText([
    "2 vCPU - 2GB RAM - 30GB SSD",
    "2 vCPU - 4GB RAM - 50GB SSD",
    "4 vCPU - 8GB RAM - 80GB SSD",
    "2 vCPU - 2GB RAM - 30GB SSD",
    "2 vCPU - 4GB RAM - 50GB SSD",
    "4 vCPU - 8GB RAM - 80GB SSD",
  ]);
  const freeOffer = section.locator('[data-offer="free"]');
  await expect(
    freeOffer.getByText("Săn tên miền đẹp cho thương hiệu của bạn", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(freeOffer).not.toContainText("Chu kỳ");
  const discountCycles = section.locator('[data-service] [class*="cycle"]');
  await expect(discountCycles).toHaveText(
    Array(6).fill("Chu kỳ 3 tháng – 1 năm"),
  );
  await expect(discountCycles.first()).toHaveCSS("color", "rgb(75, 89, 112)");
  const locked = section.getByText("Mã tiếp theo 23/11/2026", { exact: true });
  const quantities = section.getByText(/^Số lượng:/);
  await expect(locked).toHaveCount(7);
  await expect(section.getByRole("timer").locator("strong").first()).toHaveText(
    "01",
  );
  await expect(section.getByRole("button")).toHaveCount(0);
  const registerLinks = section.getByRole("link", { name: /^Đăng ký ngay/ });
  await expect(registerLinks).toHaveCount(7);
  await expect(
    freeOffer.getByRole("link", {
      name: "Đăng ký ngay tên miền .COM miễn phí",
      exact: true,
    }),
  ).toBeVisible();
  for (const [id, href] of checkouts) {
    const card = section.locator(`[data-offer="${id}"]`);
    const register = card.getByRole("link", { name: /^Đăng ký ngay/ });
    await expect(register).toBeVisible();
    await expect(register).toHaveAttribute("href", href);
  }
  await expect(quantities).toHaveCount(0);
  assert(!(await section.innerHTML()).includes("BF26FLASH20"));
  for (const width of [
    320, 360, 385, 386, 390, 540, 640, 651, 741, 768, 800, 1024, 1440, 1920,
  ]) {
    await page.setViewportSize({ width, height: 1000 });
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
      `Upcoming overflow at ${width}`,
    );
    const brokenSpecs = await specs.evaluateAll((lines) =>
      lines
        .filter((line) => {
          const text = document.createRange();
          text.selectNodeContents(line);
          const box = line.getBoundingClientRect();
          return (
            text.getClientRects().length !== 1 ||
            text.getBoundingClientRect().right > box.right + 1
          );
        })
        .map((line) => line.textContent),
    );
    assert.deepEqual(
      brokenSpecs,
      [],
      `Configuration line does not fit at ${width}px`,
    );
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  let axe = await new AxeBuilder({ page }).include("#flash-sale").analyze();
  assert.deepEqual(
    axe.violations.map(({ id, nodes }) => ({
      id,
      targets: nodes.map(({ target }) => target),
    })),
    [],
  );
  await section.screenshot({
    path: `${directory}/flash-sale-upcoming-1440.png`,
    style:
      ".site-header, [class*='floating-contact'] { visibility: hidden !important; }",
  });
  await page.setViewportSize({ width: 390, height: 1000 });
  await section.screenshot({
    path: `${directory}/flash-sale-upcoming-390.png`,
    style:
      ".site-header, [class*='floating-contact'] { visibility: hidden !important; }",
  });

  // An open page crosses the boundary and fetches codes without a reload.
  serverNow = start - 2000;
  await page.reload();
  await expect(section.getByRole("timer").locator("strong").last()).toHaveText(
    "02",
  );
  const countBefore = requests;
  failure = true;
  await expect
    .poll(() => requests, { timeout: 5000 })
    .toBeGreaterThan(countBefore);
  await expect(section.getByRole("button")).toHaveCount(0);
  await expect(registerLinks).toHaveCount(7);
  await expect(quantities).toHaveCount(0);
  failure = false;
  serverNow = start;
  await expect(section.getByRole("timer")).toHaveCount(0, { timeout: 5000 });
  await expect(locked).toHaveCount(7);
  await expect(section.getByRole("button")).toHaveCount(0);
  await expect(
    section.getByText("Flash Sale đã mở", { exact: true }),
  ).toHaveCount(0);

  codesReady = true;
  await page.evaluate(() => window.dispatchEvent(new Event("pageshow")));
  await expect(section.getByRole("button")).toHaveCount(7, { timeout: 5000 });
  await expect(registerLinks).toHaveCount(7);
  await expect(section.getByRole("timer")).toHaveCount(0);
  await expect(section.locator('[class*="countdown"] strong')).toHaveText(
    Array(4).fill("00"),
  );
  await expect(
    section.getByText("Flash Sale đã mở", { exact: true }),
  ).toBeVisible();
  await expect(freeOffer).not.toContainText("Chu kỳ");
  await expect(quantities).toHaveCount(0);
  for (const [id, { code }] of Object.entries(offers)) {
    const card = section.locator(`[data-offer="${id}"]`);
    const copy = card.getByRole("button");
    await expect(copy).toHaveText(code);
    const register = card.getByRole("link", { name: /^Đăng ký ngay/ });
    await expect(register).toHaveAttribute("href", checkouts.get(id));
    const [copyBox, registerBox] = await Promise.all([
      copy.boundingBox(),
      register.boundingBox(),
    ]);
    assert(
      registerBox && copyBox && registerBox.y >= copyBox.y + copyBox.height,
    );
    await copy.click();
    assert.equal(
      await page.evaluate(() => navigator.clipboard.readText()),
      code,
    );
  }
  await expect(page.locator('#ma-giam-gia [class*="couponCode"]')).toHaveText([
    "BF26-VPS55",
    "BF26-VPS50",
    "BF26-VPS45",
    "BF26-CLOUD40",
    "BF26-CLOUD35",
    "BF26-CLOUD30",
  ]);
  await page.reload();
  await expect(section.getByRole("button")).toHaveCount(7);
  for (const width of [320, 390, 640, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
      `Live overflow at ${width}`,
    );
    for (const button of await section.getByRole("button").all()) {
      assert(
        await button.evaluate((el) => {
          const box = el.getBoundingClientRect();
          const text = el.querySelector("span").getBoundingClientRect();
          const icon = el.querySelector("svg").getBoundingClientRect();
          return (
            text.left >= box.left &&
            text.right <= icon.left + 1 &&
            icon.right <= box.right + 1
          );
        }),
        `Code overflow at ${width}`,
      );
    }
    if ([390, 1440].includes(width))
      await section.screenshot({
        path: `${directory}/flash-sale-live-${width}.png`,
        style:
          ".site-header, [class*='floating-contact'] { visibility: hidden !important; }",
      });
  }
  await section.locator("summary").click();
  await expect(section.locator("details li:visible")).toHaveCount(5);
  axe = await new AxeBuilder({ page }).include("#flash-sale").analyze();
  assert.deepEqual(
    axe.violations.map(({ id, nodes }) => ({
      id,
      targets: nodes.map(({ target }) => target),
    })),
    [],
  );
  // A slow device clock must not delay codes once the server has opened.
  await page.clock.setFixedTime(new Date(start - 86400000));
  await page.reload();
  await expect(section.getByRole("button")).toHaveCount(7);
  assert.deepEqual(errors, []);
  console.log(
    "Flash Sale UI: seven locked offers, November 23 countdown, hidden quantities and free cycle, delayed code release, device clock skew, retries, clipboard, responsive layouts and accessibility passed.",
  );
} finally {
  await browser.close();
}
