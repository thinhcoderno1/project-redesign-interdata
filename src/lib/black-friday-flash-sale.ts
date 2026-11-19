import "server-only";

import { blackFridayFlashSale } from "@/data/black-friday";
import type {
  FlashSaleOfferId,
  FlashSaleRelease,
  PublishedFlashSaleOffer,
} from "@/data/black-friday-flash-sale";
import { getFlashSaleState } from "./flash-sale";

const offers = {
  free: { code: "BF26FLASH20-FREE", quantity: 3 },
  vps81: { code: "BF26FLASH20-VPS81", quantity: 3 },
  vps71: { code: "BF26FLASH20-VPS71", quantity: 3 },
  vps61: { code: "BF26FLASH20-VPS61", quantity: 10 },
  cloud61: { code: "BF26FLASH20-CLOUD61", quantity: 3 },
  // The sales system limits redemptions to 1. This figure is the public offer.
  cloud51: { code: "BF26FLASH20-CLOUD51", quantity: 3 },
  cloud41: { code: "BF26FLASH20-CLOUD41", quantity: 10 },
} satisfies Record<FlashSaleOfferId, PublishedFlashSaleOffer>;

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
