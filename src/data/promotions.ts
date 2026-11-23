export const blackFriday2026Banner = {
  title: "Black Friday 2026",
  image: "/images/promotion/black-friday-2026-studio-flash-sale-no-tagline.webp",
  alt: "Black Friday 2026 — Tiết kiệm 99%. Flash Sale 0đ. Voucher VPS, Cloud Server, Hosting và Domain. Quà tặng gồm nón bảo hiểm, ly sứ trắng và S3 Storage.",
  href: "/blackfriday/",
  creativeName: "studio-flash-sale-no-tagline",
} as const;

export const homepageBlackFriday2026Banner = blackFriday2026Banner;

/** Starting distribution; compare view_promotion/select_promotion by creative_slot. */
export const blogPromotionWeights = { early: 60, middle: 30, end: 10 } as const;
export type BlogPromotionPlacement = keyof typeof blogPromotionWeights;
export type BlogPromotionPageType = "listing" | "article";
