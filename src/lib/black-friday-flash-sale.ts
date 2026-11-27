import "server-only";

import { blackFridayFlashSale } from "@/data/black-friday";
import type {
  FlashSaleOfferId,
  FlashSaleRelease,
  PublishedFlashSaleOffer,
} from "@/data/black-friday-flash-sale";
import { getFlashSaleState } from "./flash-sale";

const offers = {
  freeAmd: { code: "FREEAMD-BF26FLASH", quantity: 5 },
  freePlatinum: { code: "FREEVPS27-BF26FLASH", quantity: 5 },
  free: { code: "FREEDOMAIN-BF26FLASH", quantity: 5 },
  vps81: { code: "VPS81-FLASHBF27", quantity: 3 },
  vps71: { code: "VPS71-FLASHBF27", quantity: 3 },
  vps61: { code: "VPS61-FLASHBF27", quantity: 10 },
  cloud61: { code: "CLOUD61-BF26FLASH27", quantity: 3 },
  cloud51: { code: "CLOUD51-BF26FLASH27", quantity: 3 },
  cloud41: { code: "CLOUD41-BF26FLASH27", quantity: 10 },
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
