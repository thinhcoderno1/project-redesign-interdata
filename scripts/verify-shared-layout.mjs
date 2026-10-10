import { chromium, expect } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

// Dev-only fixture: exercise a real child route, then remove it even on failure.
const base = process.env.TEST_BASE_URL || "http://localhost:3100";
const directory = path.resolve("src/app/(website)/layout-check-fixture");
const file = path.join(directory, "page.tsx");
if (!directory.startsWith(path.resolve("src/app") + path.sep))
  throw new Error("Fixture must stay inside src/app");
if (await fs.stat(directory).catch(() => null))
  throw new Error(
    "Fixture path already exists; no existing files will be replaced",
  );
await fs.mkdir(directory);
let browser;
try {
  await fs.writeFile(
    file,
    `import Link from "next/link";
import styles from "@/components/home/home.module.css";
export const metadata = {title: "Layout verification"};
export default function Page() { return <>
  <span className={styles.home} hidden aria-hidden="true" />
  <main id="noi-dung" className="section"><div className="container">
    <h1>Layout verification</h1>
    <div className="hero" data-style-probe>Child page content</div>
    <Link href="/" data-home-link>Homepage</Link>
  </div></main>
</>; }
`,
  );
  browser = await chromium.launch();
  for (const width of [390, 1440]) {
    const page = await browser.newPage({
      viewport: { width, height: 960 },
      reducedMotion: "reduce",
    });
    await page.goto(`${base}/layout-check-fixture`, {
      waitUntil: "domcontentloaded",
    });
    await expect(page).toHaveTitle("Layout verification");
    await expect
      .poll(() =>
        page.evaluate(() =>
          document.documentElement.style.getPropertyValue(
            "--site-header-height",
          ),
        ),
      )
      .not.toBe("");
    await expect(page.locator("header.site-header")).toHaveCount(1);
    await expect(page.locator("footer")).toHaveCount(1);
    await expect(page.locator("main#noi-dung")).toHaveCount(1);
    await expect(
      page.getByRole("navigation", { name: "Liên hệ nhanh và tiện ích" }),
    ).toHaveCount(1);
    expect(
      await page
        .locator('[aria-label="Trang chủ"]')
        .getAttribute("aria-current"),
    ).toBeNull();
    expect(
      await page.locator("[data-style-probe]").evaluate((element) => {
        const css = getComputedStyle(element);
        return { position: css.position, minHeight: css.minHeight };
      }),
    ).toEqual({ position: "static", minHeight: "0px" });
    await expect(
      page.locator('footer a[href="/#private-network"]'),
    ).toHaveCount(1);
    if (width < 1100) {
      await page
        .getByRole("button", { name: "Mở điều hướng", exact: true })
        .click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await page
        .locator("dialog details")
        .filter({ has: page.locator("summary", { hasText: "Giải Pháp" }) })
        .locator("summary")
        .click();
      await expect(
        page.locator('dialog a[href="/#private-network"]'),
      ).toBeVisible();
      await page
        .getByRole("button", { name: "Đóng điều hướng", exact: true })
        .click();
    } else {
      await expect(
        page.locator('#solution-navigation a[href="/#private-network"]'),
      ).toHaveCount(1);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
    ).toBe(false);
    // Client navigation keeps the shared layout and updates section destinations.
    await page.locator("[data-home-link]").click();
    await expect(page.locator("#giai-phap")).toHaveCount(1);
    await expect(page.locator('footer a[href="#private-network"]')).toHaveCount(
      1,
    );
    await expect(page.locator('[aria-label="Trang chủ"]')).toHaveAttribute(
      "aria-current",
      "page",
    );
    await page.goBack({ waitUntil: "domcontentloaded" });
    await expect(
      page.locator('footer a[href="/#private-network"]'),
    ).toHaveCount(1);
    await page.locator('footer a[href="/#private-network"]').click();
    await expect(page).toHaveURL(new RegExp("/#private-network$"));
    await expect(
      page
        .locator('#giai-phap [role="tab"]')
        .filter({ hasText: "Private Network" }),
    ).toHaveAttribute("aria-selected", "true");
    console.log(
      `PASS ${width}px: shared layout, child-page links, client navigation and isolated homepage CSS`,
    );
    await page.close();
  }
} finally {
  await browser?.close();
  await fs.unlink(file).catch((error) => {
    if (error.code !== "ENOENT") throw error;
  });
  await fs.rmdir(directory);
}
