# VPS Vibe Coding

Route: `/vps-vibe-coding/` in the existing website layout.

## Source and scope

Design, copy, curated testimonials/press links, SVG diagrams and raster assets come from the supplied project `D:\InterData-Website\vps-vibe-coding`.

The 12 active sections retain their source order: Hero, Pricing, Vibe Intro, EzyPlatform, Infrastructure, Why InterData, Use Cases, Process, Roles, Social Proof (feedback + press), FAQ, Info. Source-disabled Trial and final CTA sections remain disabled. The source mobile CTA is retained.

The page uses the existing Navigation, Footer, FloatingContact, local Be Vietnam Pro fonts and global robots policy. Source analytics, Google Fonts import, assetPrefix, root layout and indexing policy are not imported.

## InterData adaptation

- CSS is scoped under the page's CSS Module. Blue/strong blue, semantic surfaces, text, border and focus tokens replace the source purple palette. Native artwork remains unchanged.
- Shared container width 1248px; section padding 80/64/48px; font weights limited to available 400–700 faces; button radius 8px and minimum height 52px.
- Source header/footer CSS is removed. The coffee story moves to the left. On this page only, the mobile contact rail sits above the bottom CTA.
- Pricing and use-case tabs support arrow keys, Home/End and roving focus. FAQ uses exclusive native details and remains usable without JavaScript. Collapsed Info becomes fully visible without JavaScript. The moving proof rails have a pause control and respect reduced motion.
- No-JavaScript pricing shows monthly plans and a link to the source storefront for other cycles.

## Linux pricing presentation

The pricing section reuses the existing Linux CSS Module for its background, intro, pill tabs, cards, price-first ordering, specification icons, red featured badge and registration buttons. Linux source files remain unchanged. Vibe Standard remains the featured plan with its original “Gói phổ biến” tag text.

The private pricing.module.css accommodates Vibe's five cycles, discount tags, retained annual offer, section spacing and focus contrast. No Linux-specific copy, additional plan, benefit, checkout destination or billing cycle is transplanted. The section anchor stays #gia.

## Pricing contract

`https://support.interdata.vn/packages.php?gid=98&module` is the source. The page and retry API cache for 3600 seconds, with a 15-second upstream timeout.

Preserve all three plans in API order, the five source billing cycles (monthly, quarterly, annually, biennially, triennially), total VND amounts, source discount labels and annual offer. Monthly is the default; Vibe Standard is highlighted with “Gói phổ biến”. The source `product_url` is retained and the selected `billingcycle` appended.

Descriptions are decoded and split as in the source storefront, omitting the renewal heading while preserving the restriction “Chỉ hỗ trợ mã nguồn EzyPlatform”. Invalid or unavailable pricing is never replaced with invented prices; an error state offers retry.

The source testimonials, technical claims, promotions and seven-day trial copy are transplanted as requested. Their current commercial validity has not been independently re-established; this implementation verifies fidelity to the supplied project and current pricing API.

## Assets

38 assets are copied verbatim into `public/images/vps-vibe-coding/`. Their source paths, destination paths, dimensions and SHA-256 hashes are recorded in [vps-vibe-coding-assets.json](./vps-vibe-coding-assets.json). Images use Next Image with their original dimensions and unoptimized delivery to retain source artwork.

## Validation

```powershell
npm run lint
npm run typecheck
npm run build
npm run test:vps-vibe-coding
```

The browser check defaults to the existing preview at port 3100. Set `TEST_BASE_URL` for a production preview on another port. It verifies 3 plans × 5 cycles × 6 widths (320, 390, 768, 1024, 1440, 1920), checkout destinations, annual offers, default/featured state, use cases, process accordions, FAQ, expanded Info, story widget, proof pause control, images, overflow, JavaScript errors, canonical/noindex, axe WCAG A/AA and a JavaScript-disabled pass.

Artifacts are written to `artifacts/vps-vibe-coding/`, including screenshots, per-width accessibility results, pricing snapshot and copy comparison. These checks are local validation; no deployment is performed.
