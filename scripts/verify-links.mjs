import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
await fs.mkdir("artifacts", { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto("http://localhost:3100", { waitUntil: "networkidle" });
const urls = await page
  .locator('a[href^="http"]')
  .evaluateAll((links) => [...new Set(links.map((a) => a.href))]);
await browser.close();
const results = [];
for (let offset = 0; offset < urls.length; offset += 4) {
  const group = await Promise.all(
    urls.slice(offset, offset + 4).map(async (url) => {
      try {
        const response = await fetch(url, {
          signal: AbortSignal.timeout(25000),
          headers: { "User-Agent": "Mozilla/5.0" },
        });
        return {
          url,
          status: response.status,
          final: response.url,
          verified: response.ok,
        };
      } catch (e) {
        return { url, error: e.message, verified: false };
      }
    }),
  );
  results.push(...group);
}
await fs.writeFile(
  "artifacts/link-check.json",
  JSON.stringify(results, null, 2),
);
console.log(JSON.stringify(results, null, 2));
