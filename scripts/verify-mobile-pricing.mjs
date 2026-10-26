import { chromium, expect } from "@playwright/test";
import fs from "node:fs/promises";

const base = process.env.TEST_BASE_URL || "http://localhost:3100";
const routes = [
  "/thue-vps/",
  "/cloud-server/",
  "/vps-amd/",
  "/vps-platinum/",
  "/vps-linux/",
  "/vps-gold/",
  "/vps-n8n/",
  "/vps-vibe-coding/",
  "/amd-cloud-server/",
  "/platinum-cloud-server/",
  "/thue-may-chu-vat-ly/",
  "/vietnam-colocation/",
  "/trien-khai-private-network/",
  "/trien-khai-proxmox-ceph/",
  "/trien-khai-Kubernetes-k8s/",
  "/trien-khai-vmware/",
  "/s3-object-storage/",
  "/canhme/",
  "/black-friday/",
];
const directory = "artifacts/pricing-mobile";
await fs.mkdir(directory, { recursive: true });
const browser = await chromium.launch();
const results = [];

async function geometry(track) {
  return track.evaluate((el) => ({
    id: el.id,
    display: getComputedStyle(el).display,
    snap: getComputedStyle(el).scrollSnapType,
    width: el.clientWidth,
    scrollWidth: el.scrollWidth,
    height: el.getBoundingClientRect().height,
    pageWidth: document.documentElement.scrollWidth,
    cards: [...el.children].map((card) => ({
      width: card.getBoundingClientRect().width,
      height: card.getBoundingClientRect().height,
      top: card.getBoundingClientRect().top,
      text: card.textContent.replace(/\s+/g, " ").trim(),
    })),
  }));
}

async function revealLastLink(track) {
  const link = track.locator(":scope > article").last().locator("a").last();
  await expect(link).toHaveAttribute("href", /\S+/);
  await link.focus();
  await expect
    .poll(() =>
      link.evaluate((el) => {
        const box = el.getBoundingClientRect();
        const viewport = el
          .closest("[data-pricing-slider]")
          .getBoundingClientRect();
        return box.left >= viewport.left - 1 && box.right <= viewport.right + 1;
      }),
    )
    .toBe(true);
}

try {
  for (const width of [320, 390, 639, 640, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: 1000 },
      reducedMotion: "reduce",
      hasTouch: width < 640,
    });
    const page = await context.newPage();
    for (const route of routes) {
      const errors = [];
      const onError = (error) => errors.push(error.message);
      page.on("pageerror", onError);
      await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      const tracks = page
        .locator("[data-pricing-slider]")
        .filter({ visible: true });
      await expect(tracks).toHaveCount(route === "/canhme/" ? 4 : 1);
      const grids = [];
      for (const track of await tracks.all()) {
        const layout = await geometry(track);
        expect(layout.cards.length).toBeGreaterThan(1);
        expect(layout.pageWidth).toBeLessThanOrEqual(width);
        if (width < 640) {
          expect(layout.display).toBe("flex");
          expect(layout.snap).toBe("x mandatory");
          expect(layout.scrollWidth).toBeGreaterThan(layout.width);
          expect(
            Math.max(...layout.cards.map((c) => c.top)) -
              Math.min(...layout.cards.map((c) => c.top)),
          ).toBeLessThan(1);
          for (const card of layout.cards) {
            expect(card.width).toBeGreaterThan(layout.width * 0.8);
            expect(card.width).toBeLessThan(layout.width);
          }
          await revealLastLink(track);
          expect(await track.evaluate((el) => el.scrollLeft)).toBeGreaterThan(
            0,
          );
          await track.evaluate((el) =>
            el.scrollTo({ left: 0, behavior: "instant" }),
          );
        } else {
          expect(layout.display).toBe("grid");
          expect(layout.scrollWidth).toBeLessThanOrEqual(layout.width + 1);
        }
        grids.push(layout);
      }

      if (width === 390) {
        const track = tracks.first();
        const id = await track.getAttribute("id");
        if (id) {
          const cycles = page.locator(
            `button[role="tab"][aria-controls="${id}"]`,
          );
          if ((await cycles.count()) > 1) {
            const originalId = await page
              .locator(
                `button[role="tab"][aria-controls="${id}"][aria-selected="true"]`,
              )
              .getAttribute("id");
            for (const cycle of await cycles.all()) {
              if ((await cycle.getAttribute("aria-selected")) === "true")
                continue;
              const href = await track
                .locator("article a")
                .first()
                .getAttribute("href");
              await cycle.click();
              await expect(cycle).toHaveAttribute("aria-selected", "true");
              await expect(
                track.locator("article a").first(),
              ).not.toHaveAttribute("href", href);
              await page.locator(`[id="${originalId}"]`).click();
              break;
            }
          }
          const more = page.locator(
            `button[aria-controls="${id}"][aria-expanded="false"]`,
          );
          if (await more.count()) {
            const count = await track.locator(":scope > article").count();
            await more.first().click();
            await expect
              .poll(() => track.locator(":scope > article").count())
              .toBeGreaterThan(count);
            await revealLastLink(track);
            await page
              .locator(`button[aria-controls="${id}"][aria-expanded="true"]`)
              .first()
              .click();
            await expect(track.locator(":scope > article")).toHaveCount(count);
          }
        }
        if (route === "/canhme/") {
          for (const program of await page.locator(".cm-deal-program").all()) {
            const periods = program.locator(".cm-period-tabs button");
            if ((await periods.count()) < 2) continue;
            const original = await periods.evaluateAll((buttons) =>
              buttons.findIndex((button) =>
                button.classList.contains("is-active"),
              ),
            );
            const href = await program
              .locator("article a")
              .first()
              .getAttribute("href");
            await periods.nth(original === 0 ? 1 : 0).click();
            await expect(
              program.locator("article a").first(),
            ).not.toHaveAttribute("href", href);
            await periods.nth(original).click();
          }
        }
        await track.evaluate((el) =>
          el.scrollTo({ left: 0, behavior: "instant" }),
        );
        await track.evaluate((el) =>
          el.scrollIntoView({ block: "start", behavior: "instant" }),
        );
        const box = await track.boundingBox();
        const session = await context.newCDPSession(page);
        const x = box.x + box.width - 12;
        const y = Math.max(180, box.y + 100);
        await session.send("Input.dispatchTouchEvent", {
          type: "touchStart",
          touchPoints: [{ x, y }],
        });
        for (let step = 1; step <= 8; step++) {
          await session.send("Input.dispatchTouchEvent", {
            type: "touchMove",
            touchPoints: [{ x: x - (box.width * 0.7 * step) / 8, y }],
          });
          await page.waitForTimeout(20);
        }
        await session.send("Input.dispatchTouchEvent", {
          type: "touchEnd",
          touchPoints: [],
        });
        await expect
          .poll(() => track.evaluate((el) => el.scrollLeft))
          .toBeGreaterThan(0);
        await session.detach();
        await track.evaluate((el) =>
          el.scrollTo({ left: 0, behavior: "instant" }),
        );
        await track.screenshot({
          path: `${directory}/${route.split("/").filter(Boolean).join("-")}-390.png`,
        });
      }
      expect(errors).toEqual([]);
      results.push({ route, width, grids });
      page.off("pageerror", onError);
      console.log(`PASS ${width}px ${route}`);
    }
    await context.close();
  }
  await fs.writeFile(
    `${directory}/results.json`,
    JSON.stringify(results, null, 2),
  );
} finally {
  await browser.close();
}
