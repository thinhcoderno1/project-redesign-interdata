import "server-only";

import { blackFridayFlashSale } from "@/data/black-friday";
import type {
  FlashSaleOfferId,
  FlashSaleRelease,
  PublishedFlashSaleOffer,
} from "@/data/black-friday-flash-sale";
import { getFlashSaleState } from "./flash-sale";

const offers: Partial<Record<FlashSaleOfferId, PublishedFlashSaleOffer>> = {
  vps81: { code: "FLASHBF26-VPS81", quantity: 3 },
  vps71: { code: "FLASHBF26-VPS71", quantity: 3 },
  vps61: { code: "FLASHBF26-VPS61", quantity: 10 },
  cloud61: { code: "FLASHBF26-CLOUD61", quantity: 3 },
  cloud51: { code: "FLASHBF26-CLOUD51", quantity: 3 },
  cloud41: { code: "FLASHBF26-CLOUD41", quantity: 10 },
};

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
