export const blackFriday2026Banner = {
  title: "Black Friday 2026",
  image: "/images/promotion/black-friday-2026-platinum-gift-box-5x1-v4.webp",
  alt: "Black Friday 2026 — ưu đãi lớn nhất năm. Tiết kiệm 99%. Voucher VPS, Cloud Server, Hosting và Domain. Quà tặng gồm nón bảo hiểm, ly sứ và S3 Storage.",
  href: "/blackfriday/",
  creativeName: "platinum-gift-box-5x1-v4",
} as const;

/** Starting distribution; compare view_promotion/select_promotion by creative_slot. */
export const blogPromotionWeights = { early: 60, middle: 30, end: 10 } as const;
export type BlogPromotionPlacement = keyof typeof blogPromotionWeights;
export type BlogPromotionPageType = "listing" | "article";
