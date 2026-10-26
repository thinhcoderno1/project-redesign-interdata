import assert from "node:assert/strict";
import { chromium, expect } from "@playwright/test";

const base = process.env.TEST_BASE_URL || "http://localhost:3100";
const browser = await chromium.launch({
  channel: process.env.TEST_BROWSER_CHANNEL || undefined,
});
try {
  const context = await browser.newContext({
    permissions: ["clipboard-read", "clipboard-write"],
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${base}/black-friday/`);
  const buttons = page.getByRole("button", { name: /^Sao chép mã/ });
  await expect(buttons).toHaveCount(8);
  const expected = ["BF-XXXX", "BF-XXXX", ...Array(6).fill("BF26-XXXXX")];
  for (const [index, button] of (await buttons.all()).entries()) {
    await expect(button).toHaveText(expected[index]);
    // Exercise both the code text and the icon hit targets.
    await button.locator(index % 2 ? "svg" : "span").click();
    await expect(button.locator("..").getByRole("status")).toHaveText(
      "Đã sao chép",
    );
    assert.equal(
      await page.evaluate(() => navigator.clipboard.readText()),
      expected[index],
    );
    await expect(button).toHaveText(expected[index]);
  }

  await buttons.first().focus();
  await buttons.first().press("Enter");
  assert.equal(
    await page.evaluate(() => navigator.clipboard.readText()),
    expected[0],
  );
  await buttons.nth(2).focus();
  await buttons.nth(2).press("Space");
  assert.equal(
    await page.evaluate(() => navigator.clipboard.readText()),
    expected[2],
  );
  await expect(
    buttons.nth(2).locator("..").getByRole("status", { includeHidden: true }),
  ).toBeEmpty({
    timeout: 4000,
  });

  for (const width of [320, 360, 390, 640, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
      `Page overflow at ${width}px`,
    );
    for (const button of await buttons.all()) {
      assert(
        await button.evaluate((el) => {
          const buttonBox = el.getBoundingClientRect();
          const codeBox = el.querySelector("span").getBoundingClientRect();
          const iconBox = el.querySelector("svg").getBoundingClientRect();
          return (
            codeBox.left >= buttonBox.left &&
            iconBox.right <= buttonBox.right + 1 &&
            iconBox.left >= codeBox.right
          );
        }),
        `Copy content overflow at ${width}px`,
      );
    }
  }

  // Denied writes must report failure, never a copied confirmation.
  await page.evaluate(() =>
    Object.defineProperty(navigator.clipboard, "writeText", {
      configurable: true,
      value: async () => {
        throw new DOMException("Denied", "NotAllowedError");
      },
    }),
  );
  await buttons.first().click();
  await expect(buttons.first().locator("..").getByRole("status")).toHaveText(
    "Không thể sao chép. Vui lòng thử lại.",
  );
  assert.equal(
    await page.evaluate(() => navigator.clipboard.readText()),
    expected[2],
  );

  // Unsupported/insecure browser environments also fail gracefully.
  await page.evaluate(() =>
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: undefined,
    }),
  );
  await buttons.nth(1).click();
  await expect(buttons.nth(1).locator("..").getByRole("status")).toHaveText(
    "Không thể sao chép. Vui lòng thử lại.",
  );
  assert(
    !/BF26-(?:VPS(?:51|61|71)|CLOUD(?:41|51|61))/.test(await page.content()),
  );
  assert.deepEqual(errors, []);
  console.log(
    "Copy: eight displayed codes, text/icon clicks, Enter/Space, clipboard readback, feedback reset, denied/unsupported clipboard, responsive fit and unpublished-code privacy passed.",
  );
} finally {
  await browser.close();
}
