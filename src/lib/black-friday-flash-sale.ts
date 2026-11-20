import "server-only";

import { blackFridayFlashSale } from "@/data/black-friday";
import type {
  FlashSaleOfferId,
  FlashSaleRelease,
  PublishedFlashSaleOffer,
} from "@/data/black-friday-flash-sale";
import { getFlashSaleState } from "./flash-sale";

// Add approved codes for the November 23 round here.
const offers: Partial<Record<FlashSaleOfferId, PublishedFlashSaleOffer>> = {};

export function getBlackFridayFlashSaleRelease(
  now = Date.now(),
): FlashSaleRelease {
  const startsAt = blackFridayFlashSale.startsAt ?? "";
  const start = Date.parse(startsAt);
  const live =
    blackFridayFlashSale.mode === "preview"
      ? /(?:Z|[+-]\d{2}:\d{2})$/.test(startsAt) && now >= start
      : getFlashSaleState(blackFridayFlashSale, now).phase === "live";
  return {
    serverNow: now,
    startsAt,
    status: live ? "live" : "upcoming",
    offers: live ? offers : {},
  };
}
