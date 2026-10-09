import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
const base = process.env.TEST_BASE_URL || "http://localhost:3100";
const expectedSolutions = [
  {
    id: "private-network",
    name: "Triển khai Private Network",
    cta: "Private Network",
  },
  {
    id: "proxmox",
    name: "Triển Khai Ảo Hóa Proxmox / CEPH",
    cta: "Proxmox / CEPH",
  },
  { id: "kubernetes", name: "Triển khai Kubernetes (K8s)", cta: "Kubernetes" },
  { id: "vmware", name: "Triển khai VMWare", cta: "VMware" },
  { id: "s3", name: "Triển khai lưu trữ S3 Storage", cta: "S3 Storage" },
];
await fs.mkdir("artifacts", { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
try {
  for (const width of [360, 390, 768, 1024, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: 960 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("response", (r) => {
      if (r.status() >= 400 && r.url().startsWith(base))
        errors.push(`${r.status()} ${r.url()}`);
    });
    await page.goto(base, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("html")).toHaveAttribute("lang", "vi");
    expect(await page.locator("#giai-phap h3").allTextContents()).toEqual(
      expectedSolutions.map((solution) => solution.name),
    );
    await expect(page.locator("#solution-navigation a")).toHaveCount(5);
    for (const solution of expectedSolutions) {
      await expect(page.locator(`#${solution.id} a`)).toHaveAttribute(
        "href",
        "https://interdata.vn/contact",
      );
      await expect(
        page.locator(`#solution-navigation a[href="#${solution.id}"]`),
      ).toHaveAttribute("href", `#${solution.id}`);
      await expect(
        page.locator("footer").getByRole("link", {
          name: solution.name,
          exact: true,
        }),
      ).toHaveAttribute("href", `#${solution.id}`);
      await expect(
        page.locator(`dialog a[href="#${solution.id}"]`),
      ).toHaveAttribute("href", `#${solution.id}`);
    }
    const audit = await page.evaluate(() => ({
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      missingAnchors: [...document.querySelectorAll('a[href^="#"]')]
        .map((a) => a.getAttribute("href"))
        .filter((h) => h === "#" || !document.getElementById(h.slice(1))),
      brokenImages: [...document.images]
        .filter((i) => i.complete && i.naturalWidth === 0)
        .map((i) => i.src),
      sections: [...document.querySelectorAll("main>section")].map(
        (s) => s.id || s.className,
      ),
      fonts: document.fonts.check('16px "Be Vietnam Pro"'),
    }));
    expect(audit.scrollWidth, `Overflow ${width}`).toBeLessThanOrEqual(width);
    expect(audit.missingAnchors).toEqual([]);
    expect(audit.brokenImages).toEqual([]);
    await page.screenshot({ path: `artifacts/home-${width}-hero.png` });
    // Scroll every section to trigger lazy images before full-page evidence.
    for (const section of await page.locator("main>section").all()) {
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(100);
      expect((await page.locator(".site-header").boundingBox()).y).toBeCloseTo(
        0,
        1,
      );
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    await page.screenshot({
      path: `artifacts/home-${width}-full.png`,
      fullPage: true,
    });
    const serviceMenus = await Promise.all(
      [
        { id: "vps", name: "Thuê VPS", group: "dich-vu-vps", count: 6 },
        { id: "cloud", name: "Cloud Server", group: "dich-vu-cloud", count: 2 },
      ].map(async (menu) => ({
        ...menu,
        items: await page
          .locator(`#${menu.group} [data-catalog-service]`)
          .evaluateAll((cards) =>
            cards.map((card) => ({
              name: card.querySelector("h3").textContent.trim(),
              href: card.querySelector("a").getAttribute("href"),
            })),
          ),
      })),
    );
    if (width < 1100) {
      const trigger = page.getByRole("button", { name: "Mở điều hướng" });
      await trigger.click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Đóng điều hướng" }),
      ).toBeFocused();
      await page.keyboard.press("Shift+Tab");
      expect(
        await page.evaluate(() => !!document.activeElement?.closest("dialog")),
      ).toBe(true);
      await page.keyboard.press("Escape");
      await expect(page.getByRole("dialog")).not.toBeVisible();
      await expect(trigger).toBeFocused();
      await trigger.click();
      for (const menu of serviceMenus) {
        const group = page
          .getByRole("dialog")
          .locator(".mobile-service-menu")
          .filter({ has: page.locator("summary", { hasText: menu.name }) });
        const summary = group.locator("summary");
        await summary.focus();
        await page.keyboard.press("Enter");
        await expect(group).toHaveAttribute("open", "");
        await expect(group.getByRole("link")).toHaveCount(menu.count + 1);
        expect(
          await group.locator("a").evaluateAll((anchors) =>
            anchors.slice(1).map((a) => ({
              name: a.textContent.trim(),
              href: a.getAttribute("href"),
            })),
          ),
        ).toEqual(menu.items);
        await page.screenshot({
          path: `artifacts/home-${width}-${menu.id}-drawer.png`,
        });
        const drawerAudit = await new AxeBuilder({ page })
          .include("#mobile-navigation")
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
          .analyze();
        expect(drawerAudit.violations).toEqual([]);
        await group.getByRole("link").last().focus();
        await page.keyboard.press("Tab");
        expect(
          await page.evaluate(
            () => !!document.activeElement?.closest("dialog"),
          ),
        ).toBe(true);
        await summary.click();
        await expect(group).not.toHaveAttribute("open", "");
      }
      await page.screenshot({
        path: `artifacts/home-${width}-service-drawer.png`,
      });
      await page
        .getByRole("dialog")
        .locator("summary", { hasText: "Giải Pháp" })
        .click();
      await page
        .getByRole("dialog")
        .getByRole("link", {
          name: "Triển Khai Ảo Hóa Proxmox / CEPH",
          exact: true,
        })
        .click();
      await expect(page.getByRole("dialog")).not.toBeVisible();
      await expect(page).toHaveURL(/#proxmox$/);
      await expect
        .poll(() =>
          page.locator("#proxmox").evaluate((target) => {
            const gap =
              target.getBoundingClientRect().top -
              document.querySelector(".site-header").getBoundingClientRect()
                .bottom;
            return gap >= 0 && gap <= 64;
          }),
        )
        .toBe(true);
    } else {
      await page.evaluate(() => window.scrollTo(0, 0));
      for (const menu of serviceMenus) {
        const serviceToggle = page.getByRole("button", {
          name: `Mở submenu ${menu.name}`,
          exact: true,
        });
        const submenu = page.locator(`#${menu.id}-service-navigation`);
        await expect(submenu).toBeHidden();
        await serviceToggle.focus();
        await page.keyboard.press("Enter");
        await expect(serviceToggle).toHaveAttribute("aria-expanded", "true");
        await expect(submenu.getByRole("link")).toHaveCount(menu.count);
        expect(
          await submenu.locator("a").evaluateAll((anchors) =>
            anchors.map((a) => ({
              name: a.textContent.trim(),
              href: a.getAttribute("href"),
            })),
          ),
        ).toEqual(menu.items);
        const bounds = await submenu.boundingBox();
        expect(bounds.x).toBeGreaterThanOrEqual(0);
        expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
        await page.keyboard.press("Tab");
        await expect(submenu.getByRole("link").first()).toBeFocused();
        await page.keyboard.press("Escape");
        await expect(serviceToggle).toBeFocused();
        await expect(submenu).toBeHidden();
        await page.locator(".hero").click({ position: { x: 8, y: 180 } });
        const hub = page.locator(".desktop-nav").getByRole("link", {
          name: menu.name,
          exact: true,
        });
        await hub.hover();
        await expect(serviceToggle).toHaveAttribute("aria-expanded", "true");
        const hubBounds = await hub.boundingBox();
        // Cross the visual gap slowly, so a premature close cannot go unnoticed.
        await page.mouse.move(
          hubBounds.x + hubBounds.width / 2,
          hubBounds.y + hubBounds.height + 6,
        );
        await page.waitForTimeout(250);
        await expect(submenu).toBeVisible();
        await submenu.getByRole("link").first().hover();
        await page.waitForTimeout(250);
        await expect(submenu).toBeVisible();
        await page.screenshot({
          path: `artifacts/home-${width}-${menu.id}-submenu.png`,
        });
        const menuAudit = await new AxeBuilder({ page })
          .include(".site-header")
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
          .analyze();
        expect(menuAudit.violations).toEqual([]);
        await page.locator(".hero").hover({ position: { x: 8, y: 180 } });
        await expect(submenu).toBeHidden();
        await hub.hover();
        await expect(submenu).toBeVisible();
        await submenu.getByRole("link").first().focus();
        await page.locator(".hero").hover({ position: { x: 8, y: 180 } });
        await page.waitForTimeout(250);
        await expect(submenu).toBeVisible();
        await submenu.getByRole("link").last().focus();
        await page.keyboard.press("Tab");
        await expect(submenu).toBeHidden();
        await hub.hover();
        await expect(submenu).toBeVisible();
        await page.locator(".hero").click({ position: { x: 8, y: 180 } });
        await expect(submenu).toBeHidden();
      }
      const vpsToggle = page.getByRole("button", {
        name: "Mở submenu Thuê VPS",
        exact: true,
      });
      const cloudToggle = page.getByRole("button", {
        name: "Mở submenu Cloud Server",
        exact: true,
      });
      await page.locator(".desktop-nav .service-parent").first().hover();
      await expect(vpsToggle).toHaveAttribute("aria-expanded", "true");
      await page.locator(".desktop-nav .service-parent").nth(1).hover();
      await expect(vpsToggle).toHaveAttribute("aria-expanded", "false");
      await expect(cloudToggle).toHaveAttribute("aria-expanded", "true");
      await page.keyboard.press("Escape");
      const toggle = page.getByRole("button", {
        name: "Giải Pháp",
        exact: true,
      });
      await toggle.focus();
      await page.keyboard.press("Enter");
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
      await page.keyboard.press("Tab");
      await expect(
        page.locator("#solution-navigation a").first(),
      ).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(toggle).toBeFocused();
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      await page.locator(".hero").click({ position: { x: 8, y: 180 } });
      await toggle.hover();
      const solutionSubmenu = page.locator("#solution-navigation");
      await expect(solutionSubmenu).toBeVisible();
      const solutionHubBounds = await toggle.boundingBox();
      await page.mouse.move(
        solutionHubBounds.x + solutionHubBounds.width / 2,
        solutionHubBounds.y + solutionHubBounds.height + 6,
      );
      await page.waitForTimeout(250);
      await expect(solutionSubmenu).toBeVisible();
      await solutionSubmenu.getByRole("link").first().hover();
      await page.waitForTimeout(250);
      await expect(solutionSubmenu).toBeVisible();
      await page.screenshot({
        path: `artifacts/home-${width}-solutions-submenu.png`,
      });
      await page.locator(".hero").hover({ position: { x: 8, y: 180 } });
      await expect(solutionSubmenu).toBeHidden();
      await toggle.hover();
      await expect(solutionSubmenu).toBeVisible();
      await page.locator(".hero").hover({ position: { x: 8, y: 180 } });
      await page.waitForTimeout(50);
      await toggle.hover();
      await page.waitForTimeout(250);
      await expect(solutionSubmenu).toBeVisible();
      await page
        .locator("#solution-navigation")
        .getByRole("link", {
          name: "Triển khai Kubernetes (K8s)",
          exact: true,
        })
        .click();
      await expect(page).toHaveURL(/#kubernetes$/);
      await expect
        .poll(() =>
          page.locator("#kubernetes").evaluate((target) => {
            const gap =
              target.getBoundingClientRect().top -
              document.querySelector(".site-header").getBoundingClientRect()
                .bottom;
            return gap >= 0 && gap <= 64;
          }),
        )
        .toBe(true);
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      await page.evaluate(() => window.scrollTo(0, 0));
      await toggle.hover();
      await expect(solutionSubmenu).toBeVisible();
      // Click outside the centered dropdown, which can cover the hero title.
      await page.locator(".hero").click({ position: { x: 8, y: 180 } });
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
    }
    const needs = page.locator("#nhu-cau");
    for (const tab of await needs.getByRole("tab").all()) {
      await tab.click();
      await expect(tab).toHaveAttribute("aria-selected", "true");
      const id = await tab.getAttribute("id");
      await expect(needs.getByRole("tabpanel")).toHaveAttribute(
        "aria-labelledby",
        id,
      );
      await expect(
        needs.getByRole("tabpanel").getByRole("link").first(),
      ).toHaveAttribute("href", /^https:\/\/interdata.vn\//);
    }
    await needs.getByRole("tab").first().focus();
    await page.keyboard.press("End");
    await expect(needs.getByRole("tab").last()).toBeFocused();
    await page.keyboard.press("Home");
    await expect(needs.getByRole("tab").first()).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(needs.getByRole("tab").nth(1)).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await needs.getByRole("tab").first().click();
    await page.locator("#nhu-cau").scrollIntoViewIfNeeded();
    await page.screenshot({ path: `artifacts/home-${width}-consultation.png` });
    const a11y = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    const violations = a11y.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      nodes: v.nodes.map((n) => ({
        target: n.target,
        summary: n.failureSummary,
      })),
    }));
    const targets = await page.evaluate(() =>
      [...document.querySelectorAll("button,a")]
        .filter(
          (e) =>
            e.getBoundingClientRect().width > 0 &&
            e.getBoundingClientRect().height > 0,
        )
        .map((e) => ({
          text: e.textContent?.trim() || e.getAttribute("aria-label"),
          w: Math.round(e.getBoundingClientRect().width),
          h: Math.round(e.getBoundingClientRect().height),
        }))
        .filter((e) => e.w < 24 || e.h < 24),
    );
    expect(errors).toEqual([]);
    await page.locator('a[href="#trang-chu"]').click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    results.push({
      width,
      audit,
      errors,
      violations,
      smallTargets: targets,
      interactions: "passed",
    });
    await context.close();
  }
  const page = await browser.newPage();
  await page.goto(`${base}/content-review`);
  await expect(
    page.getByRole("heading", { name: "Nội dung chờ duyệt", exact: true }),
  ).toBeVisible();
  await expect(page.locator("tbody tr")).toHaveCount(7);
  await page.close();
} finally {
  await fs.writeFile(
    "artifacts/qa-results.json",
    JSON.stringify(results, null, 2),
  );
  await browser.close();
}
for (const result of results)
  console.log(
    `${result.width}px: ${result.violations.length} accessibility violations; ${result.smallTargets.length} small targets; interactions passed`,
  );
expect(results.flatMap((r) => r.violations)).toEqual([]);
