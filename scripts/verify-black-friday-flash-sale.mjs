import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.TEST_BASE_URL || "http://localhost:3000";
const startsAt = "2026-11-27T11:00:00+07:00";
const previousStartsAt = "2026-11-25T11:00:00+07:00";
const start = Date.parse(startsAt);
const offers = {
  freeAmd: { code: "FREEAMD-TESTFLASH", quantity: 5 },
  freePlatinum: { code: "FREEVPS27-TESTFLASH", quantity: 5 },
  free: { code: "FREEDOMAIN-TESTFLASH", quantity: 5 },
  vps99: { code: "VPS99-TESTFLASH", quantity: 5 },
  vps70: { code: "VPS70-TESTFLASH", quantity: 5 },
  vps60: { code: "VPS60-TESTFLASH", quantity: 10 },
};
const offerCount = Object.keys(offers).length;
const codePattern = /-(?:BF26FLASH(?:27)?|FLASHBF27)\b/;
const vpsStore =
  "https://support.interdata.vn/index.php?rp=/store/vps-platinum-viettel-hcm";
const checkouts = {
  freeAmd: "https://support.interdata.vn/index.php?rp=/store/amd-g3-vps",
  freePlatinum: vpsStore,
  free: "https://support.interdata.vn/cart.php?a=add&domain=register",
  vps99: vpsStore,
  vps70: vpsStore,
  vps60: vpsStore,
};
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
  if (actualRelease.status === "live") {
    assert.deepEqual(Object.keys(actualRelease.offers), [
      "freeAmd",
      "freePlatinum",
      "free",
    ]);
    for (const [id, { code, quantity }] of Object.entries(
      actualRelease.offers,
    )) {
      assert(codePattern.test(code));
      assert.equal(quantity, offers[id].quantity);
    }
  } else {
    assert.deepEqual(actualRelease.offers, {});
  }
  page.on("pageerror", (error) => errors.push(error.message));
  let serverNow = start - 86400000;
  let requests = 0;
  let failure = false;
  let codesReady = false;
  let roundStartsAt = startsAt;
  await page.route("**/api/black-friday-flash-sale/", async (route) => {
    requests++;
    if (failure) return route.fulfill({ status: 503, body: "Unavailable" });
    const live = serverNow >= Date.parse(roundStartsAt);
    await route.fulfill({
      json: {
        serverNow,
        startsAt: roundStartsAt,
        status: live ? "live" : "upcoming",
        offers: live && codesReady ? offers : {},
      },
    });
  });
  // An advanced device clock must not reveal codes before the server opens.
  await page.clock.setFixedTime(new Date(start + 86400000));
  assert.equal((await page.goto(`${base}/blackfriday/`)).status(), 200);
  assert(!codePattern.test(await page.content()));
  const section = page.locator("#flash-sale");
  await expect(section).toBeVisible();
  await expect(section.locator(`time[datetime="${startsAt}"]`)).toHaveText(
    "11:00AM · Thứ Sáu, 27/11/2026",
  );
  await expect(section.locator("time")).toHaveCount(1);
  await expect(
    section.getByText("Flash Sale tiếp theo", { exact: true }),
  ).toBeVisible();
  await expect(
    section.getByText("Đếm ngược đến giờ mở sale", { exact: true }),
  ).toHaveCount(0);
  await expect(
    section.getByText("Mã và số lượng sẽ hiện lúc 11:00 (giờ Việt Nam).", {
      exact: true,
    }),
  ).toHaveCount(0);
  await expect(page.locator('nav a[href="#flash-sale"]')).toBeVisible();
  await expect(section.locator("article")).toHaveCount(offerCount);
  await expect(section.locator('[data-service="cloud"]')).toHaveCount(0);
  await expect(section.locator("h3")).toHaveText([
    "Quà tặng đặc biệt",
    "Flash Sale VPS Platinum Giảm Đến 99%",
  ]);
  const specs = section.locator('[class*="specs"]');
  await expect(specs).toHaveText([
    "2 vCPU - 2GB RAM - 30GB SSD",
    "Tối đa 4 vCPU - 8GB RAM - 80GB SSD",
    "Tối đa 4 vCPU - 8GB RAM - 80GB SSD",
  ]);
  await expect(section.locator('[data-service="vps"] strong')).toHaveText([
    "99%",
    "70%",
    "60%",
  ]);
  for (const [id, name] of [
    ["freeAmd", "VPS AMD"],
    ["freePlatinum", "VPS Platinum"],
    ["free", "tên miền .COM"],
  ]) {
    const card = section.locator(`[data-offer="${id}"]`);
    await expect(card.getByRole("heading")).toHaveText(`Tặng miễn phí ${name}`);
    await expect(card.getByText("0đ", { exact: true })).toBeVisible();
  }
  await expect(section.locator('[data-offer="free"] h4 + p')).toHaveText(
    "Săn Tên Miền Đẹp Cho Thương Hiệu Của Bạn",
  );
  const freeCycles = section
    .getByRole("region", { name: "Quà tặng đặc biệt" })
    .getByText(/^Chu kỳ /);
  await expect(freeCycles).toHaveCount(0);
  await expect(
    section.getByText("2 vCore - 2GB RAM - 30GB SSD NVMe", { exact: true }),
  ).toHaveCount(2);
  const discountCycles = section.locator('[data-service] [class*="cycle"]');
  await expect(discountCycles).toHaveText(Array(3).fill("Chu kỳ 3–12 tháng"));
  await expect(discountCycles.first()).toHaveCSS("color", "rgb(75, 89, 112)");
  const locked = section.getByText("Mã đang cập nhật", { exact: true });
  const quantities = section.getByText(/^Chỉ \d{2} mã$/i);
  await expect(locked).toHaveCount(offerCount);
  await expect(section.getByRole("timer").locator("strong").first()).toHaveText(
    "01",
  );
  await expect(section.getByRole("button")).toHaveCount(0);
  const registerLinks = section.getByRole("link", { name: /^Đăng ký ngay/ });
  await expect(registerLinks).toHaveCount(offerCount);
  for (const [id, href] of Object.entries(checkouts)) {
    const card = section.locator(`[data-offer="${id}"]`);
    const register = card.getByRole("link", { name: /^Đăng ký ngay/ });
    await expect(register).toBeVisible();
    await expect(register).toHaveAttribute("href", href);
  }
  await expect(quantities).toHaveCount(0);
  assert(!codePattern.test(await section.innerHTML()));
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
          return Array.from(text.getClientRects()).some(
            (rect) => rect.left < box.left - 1 || rect.right > box.right + 1,
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
  await expect(registerLinks).toHaveCount(offerCount);
  await expect(quantities).toHaveCount(0);
  failure = false;
  serverNow = start;
  await expect(section.getByRole("timer")).toHaveCount(0, { timeout: 5000 });
  await expect(locked).toHaveCount(offerCount);
  await expect(section.getByRole("button")).toHaveCount(0);
  await expect(quantities).toHaveCount(0);
  await expect(
    section.getByText("Flash Sale đã mở", { exact: true }),
  ).toHaveCount(0);
  await expect(
    section.getByText("Mã ưu đãi đang cập nhật.", { exact: true }),
  ).toBeVisible();
  await expect(freeCycles).toHaveText([
    "Chu kỳ 3–12 tháng",
    "Chu kỳ 3–12 tháng",
    "Chu kỳ 1 năm",
  ]);

  codesReady = true;
  await page.evaluate(() => window.dispatchEvent(new Event("pageshow")));
  await expect(section.getByRole("button")).toHaveCount(offerCount, {
    timeout: 5000,
  });
  await expect(registerLinks).toHaveCount(offerCount);
  await expect(section.getByRole("timer")).toHaveCount(0);
  await expect(section.locator('[class*="countdown"] strong')).toHaveText(
    Array(4).fill("00"),
  );
  await expect(
    section.getByText("Flash Sale đã mở", { exact: true }),
  ).toBeVisible();
  await expect(quantities).toHaveCount(offerCount);
  await expect(quantities.first()).toHaveCSS("color", "rgb(0, 66, 166)");
  for (const [id, { code, quantity }] of Object.entries(offers)) {
    const card = section.locator(`[data-offer="${id}"]`);
    const copy = card.getByRole("button");
    await expect(copy).toHaveText(code);
    await expect(
      card.getByText(`Chỉ ${String(quantity).padStart(2, "0")} mã`, {
        exact: true,
      }),
    ).toBeVisible();
    const register = card.getByRole("link", { name: /^Đăng ký ngay/ });
    await expect(register).toHaveAttribute("href", checkouts[id]);
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
  await expect(section.getByRole("button")).toHaveCount(offerCount);
  await expect(quantities).toHaveCount(offerCount);
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
  await expect(
    section.getByText(/^Mã ONE TIME: Chỉ áp dụng cho lần thanh toán đầu tiên/),
  ).toBeVisible();
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
  await expect(section.getByRole("button")).toHaveCount(offerCount);
  // An already-open page also picks up the release at the boundary without a visibility event.
  serverNow = start - 2000;
  await page.reload();
  await expect(locked).toHaveCount(offerCount);
  await expect(quantities).toHaveCount(0);
  serverNow = start;
  await expect(quantities).toHaveCount(offerCount);
  await expect(section.getByRole("button")).toHaveCount(offerCount);
  // A live page must retire its published offers when the server advances the round.
  roundStartsAt = previousStartsAt;
  serverNow = Date.parse(previousStartsAt) + 3600000;
  await page.evaluate(() => window.dispatchEvent(new Event("pageshow")));
  await expect(
    section.locator(`time[datetime="${previousStartsAt}"]`),
  ).toBeVisible();
  await expect(section.getByRole("button")).toHaveCount(offerCount);
  roundStartsAt = startsAt;
  await page.evaluate(() => window.dispatchEvent(new Event("pageshow")));
  await expect(section.getByRole("button")).toHaveCount(0);
  await expect(quantities).toHaveCount(0);
  await expect(section.getByRole("timer")).toHaveCount(1);
  await expect(locked).toHaveCount(offerCount);
  await expect(freeCycles).toHaveCount(0);
  await expect(section.locator(`time[datetime="${startsAt}"]`)).toHaveText(
    "11:00AM · Thứ Sáu, 27/11/2026",
  );
  await page.goto(`${base}/`);
  await expect(page.locator("#flash-sale time")).toHaveAttribute(
    "datetime",
    startsAt,
  );
  await expect(page.locator("#flash-sale").getByRole("timer")).toHaveCount(1);
  await expect(page.locator("#flash-sale").getByRole("button")).toHaveCount(0);
  assert.deepEqual(errors, []);
  console.log(
    "Flash Sale UI: November 27 countdown at / and /blackfriday/, retired offers, simulated code release, clock skew, retries, clipboard, responsive layouts and accessibility passed.",
  );
} finally {
  await browser.close();
}
