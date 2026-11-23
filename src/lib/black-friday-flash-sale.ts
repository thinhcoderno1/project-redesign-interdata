import "server-only";

import { blackFridayFlashSale } from "@/data/black-friday";
import type {
  FlashSaleOfferId,
  FlashSaleRelease,
  PublishedFlashSaleOffer,
} from "@/data/black-friday-flash-sale";
import { getFlashSaleState } from "./flash-sale";

const offers = {
  free: { code: "BF26FLASH23-DOMAIN", quantity: 5 },
  vps81: { code: "BF26FLASH23-VPS81", quantity: 3 },
  vps71: { code: "BF26FLASH23-VPS71", quantity: 3 },
  vps61: { code: "BF26FLASH23-VPS61", quantity: 10 },
  cloud61: { code: "BF26FLASH23-CLOUD61", quantity: 3 },
  cloud51: { code: "BF26FLASH23-CLOUD51", quantity: 3 },
  cloud41: { code: "BF26FLASH23-CLOUD41", quantity: 10 },
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
