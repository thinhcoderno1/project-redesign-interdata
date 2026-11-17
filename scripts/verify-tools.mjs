import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
import { loadProjectModule } from "./load-project-typescript.mjs";

const { toolsPageApproved } = loadProjectModule(
  "src/data/page-availability.ts",
);

const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3100";
await fs.mkdir("artifacts/tools", { recursive: true });
const browser = await chromium.launch();
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1050 },
    permissions: ["clipboard-read", "clipboard-write"],
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const response = await page.goto(`${base}/cong-cu/`);
  if (!toolsPageApproved) {
    expect(response.status()).toBe(404);
    await expect(page.getByRole("tab")).toHaveCount(0);
    await expect(page.locator("#page-structured-data")).toHaveCount(0);
    expect(
      await page
        .locator('meta[name="robots"]')
        .evaluateAll((elements) =>
          elements.some((element) =>
            (element.getAttribute("content") || "")
              .split(/[,\s]+/)
              .includes("noindex"),
          ),
        ),
    ).toBe(true);
    expect(
      (await page.request.get(`${base}/cong-cu/?preview=1`)).status(),
    ).toBe(404);
    await page.goto(base);
    await expect(page.locator('a[href="/cong-cu/"]')).toHaveCount(0);
    await page.setViewportSize({ width: 390, height: 900 });
    await page
      .getByRole("button", { name: "Mở điều hướng", exact: true })
      .click();
    await expect(page.locator('dialog[open] a[href="/cong-cu/"]')).toHaveCount(
      0,
    );
    const sitemap = await page.request.get(`${base}/sitemap.xml`);
    expect(sitemap.status()).toBe(200);
    expect(await sitemap.text()).not.toContain("/cong-cu/");
    expect(errors).toEqual([]);
    await context.close();
    console.log(
      "Hidden tools page passed: direct/preview URL 404, noindex, no page schema, no desktop/mobile/footer links and no sitemap entry.",
    );
  } else {
    const cron = page.getByRole("tabpanel", { name: "Cron Job Generator" });
    const nginx = page.getByRole("tabpanel", {
      name: "Nginx Config Generator",
    });
    const vps = page.getByRole("tabpanel", { name: "Tính toán cấu hình VPS" });
    await expect(page.getByRole("tab")).toHaveCount(3);
    await expect(cron.locator("time")).toHaveCount(5);
    await expect(cron.locator("pre")).toContainText("*/5 * * * *");
    const library = page.locator("#cron-command-library");
    await cron.locator('button[aria-controls="cron-command-library"]').click();
    await expect(library).toBeFocused();
    await expect(library.locator(":scope > ul > li")).toHaveCount(8);
    await library
      .getByRole("button", { name: "Website & API", exact: true })
      .click();
    await expect(library.locator(":scope > ul > li")).toHaveCount(2);
    const laravelCard = library.getByRole("listitem").filter({
      has: page.getByRole("heading", {
        name: "Laravel Scheduler",
        exact: true,
      }),
    });
    const laravelCommand = await laravelCard
      .locator("code")
      .first()
      .textContent();
    await laravelCard
      .getByRole("button", { name: "Sao chép lệnh", exact: true })
      .click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      laravelCommand,
    );
    await expect(cron.getByLabel("Lệnh cần chạy")).toHaveValue("");
    await laravelCard
      .getByRole("button", { name: "Dùng lệnh này", exact: true })
      .click();
    await expect(cron.getByLabel("Lệnh cần chạy")).toHaveValue(laravelCommand);
    await expect(cron.getByLabel("Lệnh cần chạy")).toBeFocused();
    await expect(
      cron.getByLabel("Biểu thức cron", { exact: true }),
    ).toHaveValue("*/5 * * * *");
    await expect(cron.locator("pre")).toContainText(
      `*/5 * * * * ${laravelCommand}`,
    );
    await library.getByRole("button", { name: "Sao lưu", exact: true }).click();
    const mysqlCard = library.getByRole("listitem").filter({
      has: page.getByRole("heading", {
        name: "Sao lưu cơ sở dữ liệu MySQL",
        exact: true,
      }),
    });
    await mysqlCard.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(mysqlCard.locator("details")).toHaveAttribute("open", "");
    await expect(
      mysqlCard.getByText("--defaults-extra-file phải là tùy chọn đầu tiên.", {
        exact: false,
      }),
    ).toBeVisible();
    await mysqlCard
      .getByRole("button", { name: "Dùng lệnh này", exact: true })
      .click();
    await expect(
      cron.getByRole("button", { name: "Sao chép", exact: true }),
    ).toBeEnabled();
    await expect(cron.locator("pre")).toContainText(
      "umask 077 && /usr/bin/mysqldump",
    );
    await expect(cron.locator("pre")).toContainText("\\%Y");
    await library.getByRole("button", { name: "Tất cả", exact: true }).click();
    await cron.getByRole("button", { name: "Mỗi ngày", exact: true }).click();
    await cron
      .getByLabel("Lệnh cần chạy")
      .fill("/usr/bin/php /var/www/cron.php");
    await cron.getByRole("button", { name: "Sao chép", exact: true }).click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      "0 0 * * * /usr/bin/php /var/www/cron.php",
    );
    await cron.getByLabel("Biểu thức cron", { exact: true }).fill("60 * * * *");
    await expect(
      cron.getByRole("button", { name: "Sao chép", exact: true }),
    ).toBeDisabled();
    await expect(
      cron.getByText("Phút: giá trị", { exact: false }),
    ).toBeVisible();
    await cron.getByRole("button", { name: "Đặt lại" }).click();
    await cron.getByLabel("Biểu thức cron", { exact: true }).fill("0 0 30 2 *");
    await expect(
      cron.getByText("Không có lần chạy trong 32 năm tới.", { exact: false }),
    ).toBeVisible();
    await cron.getByRole("button", { name: "Mỗi giờ", exact: true }).click();
    await page.getByRole("tab", { name: "Nginx Config Generator" }).click();
    await expect(nginx).toBeVisible();
    await nginx
      .getByLabel("Tên miền", { exact: true })
      .fill("app.interdata.vn");
    await nginx.getByLabel("Hỗ trợ WebSocket", { exact: false }).check();
    await nginx.getByLabel("Bật HTTPS", { exact: false }).check();
    await nginx
      .getByLabel("Đường dẫn chứng chỉ SSL", { exact: true })
      .fill("/etc/letsencrypt/live/app.interdata.vn/fullchain.pem");
    await nginx
      .getByLabel("Đường dẫn khóa riêng SSL", { exact: true })
      .fill("/etc/letsencrypt/live/app.interdata.vn/privkey.pem");
    await expect(nginx.locator("pre")).toContainText("listen 443 ssl;");
    await expect(nginx.locator("pre")).toContainText(
      "proxy_set_header Upgrade $http_upgrade;",
    );
    await nginx.getByRole("button", { name: "Sao chép", exact: true }).click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
      "server_name app.interdata.vn;",
    );
    const downloadEvent = page.waitForEvent("download");
    await nginx.getByRole("button", { name: "Tải xuống" }).click();
    const download = await downloadEvent;
    expect(download.suggestedFilename()).toBe("interdata-site.conf");
    await download.saveAs("artifacts/tools/interdata-site.conf");
    expect(
      await fs.readFile("artifacts/tools/interdata-site.conf", "utf8"),
    ).toContain("server_name app.interdata.vn;");
    await nginx
      .getByLabel("Tên miền", { exact: true })
      .fill("example.com; include /tmp/evil");
    await expect(
      nginx.getByRole("button", { name: "Sao chép", exact: true }),
    ).toBeDisabled();
    await nginx
      .getByLabel("Tên miền", { exact: true })
      .fill("app.interdata.vn");
    await page.getByRole("tab", { name: "Cron Job Generator" }).click();
    await expect(
      cron.getByLabel("Biểu thức cron", { exact: true }),
    ).toHaveValue("0 * * * *");
    await page.getByRole("tab", { name: "Cron Job Generator" }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(
      page.getByRole("tab", { name: "Nginx Config Generator" }),
    ).toBeFocused();
    await expect(nginx.getByLabel("Tên miền", { exact: true })).toHaveValue(
      "app.interdata.vn",
    );

    await page.keyboard.press("ArrowRight");
    await expect(
      page.getByRole("tab", { name: "Tính toán cấu hình VPS" }),
    ).toBeFocused();
    await expect(vps).toBeVisible();
    expect(
      await vps
        .locator('input[type="number"]')
        .evaluateAll((inputs) => inputs.every((input) => input.validity.valid)),
    ).toBe(true);
    await expect(vps.locator('[data-vps-resource="vCPU"]')).toHaveText(
      /2\s*vCPU/,
    );
    await expect(vps.locator('[data-vps-resource="RAM"]')).toHaveText(/4\s*GB/);
    await expect(vps.locator('[data-vps-resource="SSD"]')).toHaveText(
      /60\s*GB/,
    );
    await vps
      .getByLabel("Người dùng hoạt động đồng thời", { exact: true })
      .fill("1000");
    await expect(vps.locator('[data-vps-resource="vCPU"]')).toHaveText(
      /12\s*vCPU/,
    );
    await vps
      .getByLabel("Người dùng hoạt động đồng thời", { exact: true })
      .fill("");
    await expect(
      vps.getByRole("button", { name: "Sao chép kết quả", exact: true }),
    ).toBeDisabled();
    await expect(vps.locator("[data-vps-resource]")).toHaveCount(0);
    await expect(
      vps.getByLabel("Người dùng hoạt động đồng thời", { exact: true }),
    ).toHaveAttribute("aria-invalid", "true");
    await vps.getByRole("button", { name: "Đặt lại", exact: true }).click();
    await vps
      .getByLabel("Loại ứng dụng", { exact: true })
      .selectOption("static");
    expect(
      await vps
        .locator('input[type="number"]')
        .evaluateAll((inputs) => inputs.every((input) => input.validity.valid)),
    ).toBe(true);
    await expect(vps.getByRole("checkbox")).not.toBeChecked();
    await expect(vps.locator('[data-vps-resource="RAM"]')).toHaveText(/2\s*GB/);
    await vps.getByRole("checkbox").check();
    await expect(vps.locator('[data-vps-resource="RAM"]')).toHaveText(/4\s*GB/);
    await vps
      .getByText("Giả định tính toán · có thể điều chỉnh", { exact: true })
      .click();
    await vps
      .getByLabel("Thời gian CPU / yêu cầu (ms)", { exact: true })
      .fill("1000");
    await expect(vps.locator('[data-vps-resource="vCPU"]')).toHaveText(
      /10\s*vCPU/,
    );
    await vps.getByRole("button", { name: "Đặt lại", exact: true }).click();
    await vps
      .getByLabel("Người dùng hoạt động đồng thời", { exact: true })
      .fill("100000");
    await expect(
      vps.getByText("Nhu cầu tài nguyên tổng", { exact: true }),
    ).toBeVisible();
    await expect(
      vps.getByRole("link", { name: "Trao đổi phương án hạ tầng" }),
    ).toHaveAttribute("href", "/lien-he/");
    await vps.getByRole("button", { name: "Đặt lại", exact: true }).click();
    await vps
      .getByRole("button", { name: "Sao chép kết quả", exact: true })
      .click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
      "2 vCPU | 4 GB RAM | 60 GB SSD",
    );
    expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
      "CPU 120 ms",
    );
    const vpsDownloadEvent = page.waitForEvent("download");
    await vps.getByRole("button", { name: "Tải xuống", exact: true }).click();
    const vpsDownload = await vpsDownloadEvent;
    expect(vpsDownload.suggestedFilename()).toBe("interdata-vps-estimate.txt");
    await vpsDownload.saveAs("artifacts/tools/interdata-vps-estimate.txt");
    expect(
      await fs.readFile("artifacts/tools/interdata-vps-estimate.txt", "utf8"),
    ).toContain("2 vCPU | 4 GB RAM | 60 GB SSD");
    await vps.getByRole("button", { name: "Hướng dẫn", exact: true }).click();
    await expect(page.locator("#vps-guide")).toBeFocused();
    await vps
      .getByLabel("Dữ liệu tăng thêm / tháng (GB)", { exact: true })
      .fill("5");
    await page.getByRole("tab", { name: "Cron Job Generator" }).click();
    await page.getByRole("tab", { name: "Tính toán cấu hình VPS" }).click();
    await expect(
      vps.getByLabel("Dữ liệu tăng thêm / tháng (GB)", { exact: true }),
    ).toHaveValue("5");
    await vps.getByRole("button", { name: "Đặt lại", exact: true }).click();

    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1050 });
      for (const tool of [
        "Cron Job Generator",
        "Nginx Config Generator",
        "Tính toán cấu hình VPS",
      ]) {
        await page.getByRole("tab", { name: tool }).click();
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth),
        ).toBeLessThanOrEqual(width);
        const audit = await new AxeBuilder({ page }).include("main").analyze();
        expect(
          audit.violations.map(({ id, nodes }) => ({
            id,
            targets: nodes.map(({ target }) => target),
          })),
        ).toEqual([]);
        await page.evaluate(() => {
          if (document.activeElement instanceof HTMLElement)
            document.activeElement.blur();
          window.scrollTo({ top: 0, behavior: "instant" });
        });
        await page.screenshot({
          path: `artifacts/tools/${tool.startsWith("Cron") ? "cron" : tool.startsWith("Nginx") ? "nginx" : "vps"}-${width}.png`,
          fullPage: true,
        });
      }
    }
    await page.getByRole("tab", { name: "Nginx Config Generator" }).click();
    await nginx
      .getByRole("button", { name: "Website tĩnh", exact: false })
      .click();
    await nginx.getByLabel("Ứng dụng SPA", { exact: false }).check();
    await expect(nginx.locator("pre")).toContainText(
      "try_files $uri $uri/ /index.html;",
    );
    await expect(nginx.locator("pre")).not.toContainText("proxy_pass");
    await page.reload();
    await expect(
      page.getByRole("tab", { name: "Nginx Config Generator" }),
    ).toHaveAttribute("aria-selected", "true");
    await page
      .getByRole("link", { name: "Lên đầu trang", exact: true })
      .click();
    await expect(
      page.getByRole("tab", { name: "Nginx Config Generator" }),
    ).toHaveAttribute("aria-selected", "true");
    await page.getByRole("tab", { name: "Cron Job Generator" }).click();
    await page.evaluate(() => {
      navigator.clipboard.writeText = async () => {
        throw new Error("Clipboard denied for fallback check");
      };
    });
    const phpCard = library.getByRole("listitem").filter({
      has: page.getByRole("heading", { name: "Chạy script PHP", exact: true }),
    });
    await phpCard
      .getByRole("button", { name: "Sao chép lệnh", exact: true })
      .click();
    expect(await page.evaluate(() => window.getSelection()?.toString())).toBe(
      await phpCard.locator("code").first().textContent(),
    );
    await expect(phpCard.getByRole("status")).toContainText("Ctrl+C");
    await page.getByRole("tab", { name: "Tính toán cấu hình VPS" }).click();
    await vps
      .getByRole("button", { name: "Sao chép kết quả", exact: true })
      .click();
    await expect(
      vps.getByLabel("Bản tóm tắt cấu hình VPS", { exact: true }),
    ).toBeFocused();
    expect(
      await vps
        .getByLabel("Bản tóm tắt cấu hình VPS", { exact: true })
        .evaluate((element) => element.selectionEnd - element.selectionStart),
    ).toBeGreaterThan(0);
    await page.reload();
    await expect(
      page.getByRole("tab", { name: "Tính toán cấu hình VPS" }),
    ).toHaveAttribute("aria-selected", "true");
    expect(errors).toEqual([]);
    await context.close();
    console.log(
      "Tools UI passed: VPS sizing/validation/profiles/exports, command library, three tabs, state, keyboard, clipboard fallback, five widths and accessibility.",
    );
  }
} finally {
  await browser.close();
}
