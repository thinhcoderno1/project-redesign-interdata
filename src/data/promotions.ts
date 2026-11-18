export const blackFriday2026Banner = {
  title: "Black Friday 2026",
  image: "/images/promotion/black-friday-2026-gift-vouchers-5x1-v2.webp",
  alt: "Black Friday 2026 — hộp quà mở ra 3 voucher: VPS / Cloud Server giảm đến 71%; VPS Platinum chỉ từ 83K và tặng thêm 1 năm; giảm 50% phí gia hạn.",
  href: "/blackfriday/",
} as const;

/** Starting distribution; compare view_promotion/select_promotion by creative_slot. */
export const blogPromotionWeights = { early: 60, middle: 30, end: 10 } as const;
export type BlogPromotionPlacement = keyof typeof blogPromotionWeights;
export type BlogPromotionPageType = "listing" | "article";
