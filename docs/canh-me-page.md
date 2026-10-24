# Canh Me

The existing public destination `/canhme/` is implemented inside the shared `(website)` layout. `links.promotion` now points to this internal route, so the header, footer and homepage promotion links use the same page. No second `/canh-me/` page, separate navigation or footer is introduced.

Source: `D:/InterData-Website-news/canh-me`, specifically `app/page.tsx`, its active Hero/HotDeals/Zalo/feedback/press/FAQ/information sections, `app/components/data.ts`, `app/globals.css` and `app/lib/packages.ts`. Campaign copy, original prices, testimonials, press links and artwork originate from that project. The current page temporarily uses the source project's original palette: navy backgrounds, cyan accents, warm yellow/orange badges and blue/orange/red pricing cards and buttons. Feedback, press and FAQs follow that source palette as well. Imported styles remain isolated under a CSS Module; this project's font assets, container widths, responsive typography and layout fixes are retained. Shared Header/Footer and global color tokens are unchanged.

## Source behavior retained

- Visible pricing groups remain 100 (Inter Platinum), 87 (Premium), 89 (Best Value), and 96 (Dedicated), in source order. Hidden programs and the source's disabled Flash Sale, all-service coupons and renewal sections remain absent.
- Prices come from the same public `packages.php?gid=…&module` endpoint, with 60-second revalidation. Original prices remain sourced by PID. Program-specific billing choices, default periods, featured products and the hidden Dedicated PID 518 follow the source.
- Dedicated prices display their monthly equivalent, rounded as in the source. An additional line makes the selected cycle's total payment explicit. Checkout URLs always include the actual product PID and selected billing cycle.
- Program countdowns retain the source's end-of-month behavior, using Vietnam time explicitly. The separate Black Friday countdown configuration is unaffected.
- Programs and configuration details can be expanded/collapsed; price controls expose their selected state. Missing API prices show a contact state instead of a blank amount or an invalid registration price.
- Zalo QR/link, eight customer testimonials, review-platform links, source press articles, sixteen FAQs and all information-section copy are retained. Feedback and press use the original source components and CSS (isolated in `canh-me-proof.module.css`), replacing the earlier simplified carousels. Feedback retains 460px desktop cards, a 38% profile column, quote treatment, expandable text, side arrows, pagination dots, five-star platform ratings and 4.5-second automatic progression. Mobile cards retain the source's stacked profile/body layout. Press retains 330px desktop / 290px mobile cards, 215px image areas, publisher logo pills, and the continuous 70-second marquee; hover/focus pauses it. Reduced-motion preferences disable automatic movement, cloned slides are excluded from keyboard and screen-reader navigation, and FAQs remain native disclosures. Source assets are namespaced under `/images/canh-me/`, including in production; the old standalone app's asset-prefix switch is not used.

## Verification

```powershell
node scripts/verify-canh-me.mjs
npm run typecheck
npm run build
```

The browser check compares live prices for every exposed billing cycle, checks checkout PIDs/cycles, source program visibility, disclosures, carousel controls, all local images, layout at 320/375/390/768/1024/1440/1920px, Axe WCAG A/AA, and pricing/FAQ rendering without JavaScript. Screenshots and Axe results are in the Git-ignored `artifacts/canh-me/` directory. Set `TEST_BASE_URL` and `TEST_BROWSER_CHANNEL` to select another server or installed browser.
