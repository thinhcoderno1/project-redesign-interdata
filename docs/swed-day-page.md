# SWED DAY

- Route: `/swed-day/`, with the shared InterData navigation, footer, Be Vietnam Pro font, container, buttons, icons and mobile pricing slider. Campaign colors are scoped in `swed-day.module.css`: pink `#ce0759`, bright pink `#f52683`, pale pink `#fff2f7`, navy `#101e58`, white. Hero artwork uses CSS and decorative HTML.
- Typography uses the shared InterData scale: 17–18px descriptions and terms, 16px specifications/actions, 14px secondary copy, 28px plan titles, 32px prices and 18px coupon codes. Mobile preserves these readable sizes and wraps labels instead of shrinking them. Pricing switches to two columns at 1200px; Flash Sale's heading/countdown stack at 800px to give the larger text room.
- Official API: `https://support.interdata.vn/packages.php?gid=94&module`, fetched on the server with 60-second revalidation and a 15-second timeout. Only SWED 1–4 (PID 508–511) are accepted. Product group, identity, destination and yearly prices are validated; negative/unavailable cycles are removed. API failure shows a direct link to the official store without invented prices. Errors are logged on the server.
- Pricing defaults to 1 year and supports 2/3 years. Displayed values are full-cycle API totals before coupons. Registration preserves each official product URL and adds `billingcycle`. Stock-controlled products with zero inventory have disabled registration. Availability is a cached snapshot; checkout confirms current inventory and final totals.
- Flash Sale follows pricing. Countdown uses Wednesday 10:00–13:00 Vietnam time (UTC+7), independent of browser/server timezone. During the session it counts down to 13:00; after 13:00 it targets the following Wednesday at 10:00. Initial server-rendered placeholders avoid hydration mismatch; the client updates every second and when tab visibility changes. Without JavaScript, the recurring schedule and all offer content remain visible.
- Coupon definitions: 1 year / 10% / `SWED-VPS12T`; 2 years / 15% / `SWED-VPS24T`; 3 years / 20% / `SWED-VPS36T`. Copy feedback handles success and clipboard denial. Each coupon's selection link chooses its matching billing cycle and scrolls to pricing. The store enforces coupon timing and eligibility; coupons are not automatically applied to displayed API prices.
- All user-supplied conditions are visible: campaign store scope, Wednesday hours, ONE TIME/first-payment-only and long-term cycle guidance, no InterData credit-account payment. Canonical metadata, CollectionPage/breadcrumb schema and sitemap entry are included.

Verification:

```powershell
npm run typecheck
npm run build
node scripts/verify-swed-day-data.mjs
node scripts/verify-swed-day.mjs
```

The browser script defaults to `http://localhost:3000`; set `TEST_BASE_URL` to test another server. Screenshots and accessibility results are written to the Git-ignored `artifacts/swed-day/` folder.
