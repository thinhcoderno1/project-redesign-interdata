# Homepage Hero image optimization

Verified locally on 2026-11-06. Original artwork remains at
`public/images/home/hero-globe-racks.webp` (1902 × 827, 292,064 bytes).

The Hero uses `<picture>` with pre-encoded AVIF assets. Mobile below 640px
receives a centered 827 × 827 crop, retaining the original vertical detail
instead of enlarging a downsampled landscape image to fill the tall section.
Desktop receives either a 1400px or 1902px AVIF. Its `sizes` accounts for the
1288px image width needed to cover a 560px-tall Hero on narrow tablets.

WebP remains available on mobile and through Next Image on desktop, with
quality 82 explicitly allowed in `next.config.ts`. Other images retain their
default quality. The image loads eagerly at high priority; there is no separate
fallback preload that would download a second image alongside the selected
`picture` source. AVIF is encoded ahead of time, avoiding request-time encoding.

Regenerate the four delivery assets with:

```powershell
node scripts/optimize-home-hero.mjs
```

No asset is upscaled. Resolution on high-density displays is still limited by
the original artwork. Against the decoded original, the 1902px AVIF has RGB
PSNR 36.74dB versus 35.00dB for the previous quality-75 WebP. This measures
encoding fidelity, rather than new detail or a universal perceptual score.

Local production comparison (`next build` and `next start`, Chromium, disabled
browser cache, 80ms simulated latency, 200,000 bytes/s download, CPU slowdown
4×). LCP is the median of three runs after a discarded warm-up run per viewport.

| Viewport / pixel ratio | Hero bytes before → after | LCP before → after |
| --- | --- | --- |
| 390px / 3× | 72,922 → 33,511 (−54.0%) | 2268 → 1392ms |
| 1440px / 1× | 154,570 → 143,814 (−7.0%) | 5072 → 4716ms |

These are local simulated measurements, not deployed field data or a PageSpeed
score. Raw measurements and screenshots are in `artifacts/hero-image/`.

Validation passed: production build, TypeScript, scoped ESLint, Hero checks
from 320–1920px, AVIF selection and WebP fallbacks, exactly one Hero image
request per initial load, and rendering with JavaScript disabled. The existing
Hero verification also covers heading rotation, reduced motion, layout,
accessibility, and CTA behavior.
