# Footer assets

- Bộ Công Thương badge: https://dichvucong.online.gov.vn/Content/EndUser/LogoCCDVSaleNoti/logoSaleNoti.png
- Social SVGs: https://github.com/simple-icons/simple-icons/tree/develop/icons (CC0; brand marks remain the property of their owners).

Assets are stored locally under `public/images/footer` and do not require third-party image requests or badge scripts at runtime.

The three-column footer section below “Chính sách & Điều khoản” contains website certificates, supported payments and the existing social profiles. It uses the shared InterData color tokens and stacks on small screens, reserving space for the floating contact controls.

Additional local assets:

- DMCA: owner-supplied green `dmca-badge-w250-2x1-01.png`, copied unchanged to `public/images/footer/dmca.png` (250 × 125), displayed at 88 × 44.
- VNPAY logo (from https://vnpay.vn): https://1889324617.cloud.edgevnpay.vn/assets/images/logo-icon/logo-primary.svg
- MoMo logo (from https://www.momo.vn): https://homepage.momocdn.net/fileuploads/svg/momo-file-240411162904.svg
- Mastercard logo: https://www.mastercard.com/content/dam/public/mastercardcom/na/global-site/logos/mc-logo-52.svg
- Visa: Simple Icons (same source and license as the social icons), displayed in its brand color.
- Trustpilot: owner-supplied `trustpilot-logo.png`, copied unchanged to `public/images/footer/trustpilot.png` (1048 × 453), including the five-star artwork supplied by the owner.
- PayPal: official full-color horizontal logo, including the symbol and wordmark, from https://www.paypalobjects.com/digitalassets/c/website/logo/full-text/pp_fc_hl.svg. Stored locally as `paypal.svg` without recoloring.
- HostAdvice: owner-supplied `logo-fox2x (1).webp`, copied unchanged to `public/images/footer/hostadvice.webp` (440 × 88).
- Bank transfer and cash: Lucide icons, with accessible Vietnamese labels and hover titles; no visible captions.

Bộ Công Thương and HostAdvice are linked. HostAdvice points to https://vi.hostadvice.com/hosting-company/inter-group-joint-stock-company-reviews/ with `target="_blank"` and `rel="nofollow noopener noreferrer"`. DMCA and Trustpilot use the owner's supplied badge artwork without links. No additional scores or awards are added. Update `src/components/layout/footer-assurances.tsx` when those links arrive.

Certificate logos appear directly on the blue footer without white cards or borders. CSS masks display the dark HostAdvice and Trustpilot wordmarks in white while preserving the colored fox and green stars. The DMCA badge uses its supplied colors without a mask. The source images remain unchanged. Payment logos use compact 56 × 36 white cards, separated by 12px gaps, that wrap to fit the available width.

The certificate group is capped at 280px with two columns and 44px-high rows: Bộ Công Thương is 108px wide, DMCA 88px, HostAdvice 128px, and Trustpilot 100px. Logos scale down to fit smaller screens.

Payment sources:

- https://interdata.vn/thue-vps/ — FAQ lists bank transfer, Visa/Mastercard, MoMo, VNPAY and PayPal (also recorded in `src/data/vps-content.json`).
- https://interdata.vn/blog/huong-dan-dang-ky-ten-mien-tai-interdata/ — VNPAY, MoMo, Visa/Master and company bank transfer.
- https://interdata.vn/hinh-thuc-thanh-toan — cash, bank transfer and VNPAY (also recorded in `content/legal/hinh-thuc-thanh-toan.md`).
