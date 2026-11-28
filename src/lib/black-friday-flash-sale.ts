import "server-only";

import { blackFridayFlashSale } from "@/data/black-friday";
import {
  blackFridayFlashSaleFreeOffers,
  blackFridayFlashSaleGroups,
  type FlashSaleOfferId,
  type FlashSaleRelease,
} from "@/data/black-friday-flash-sale";
import { getFlashSaleState } from "./flash-sale";

// Flash Sale currently displays placeholders instead of codes and quantities.
const publishFlashSaleCodes = false;

const offers: Record<
  FlashSaleOfferId,
  { code: string | null; quantity: number }
> = {
  freeAmd: { code: "FLASHBF26-AMDFREE", quantity: 5 },
  freePlatinum: { code: "FLASHBF26-VPSFREE", quantity: 5 },
  free: { code: "FLASHBF26-DOMAINFREE", quantity: 5 },
  vps99: { code: "BF26-HOTDEAL99", quantity: 5 },
  vps70: { code: "BF26-HOTDEAL70", quantity: 5 },
  vps60: { code: "BF26-HOTDEAL60", quantity: 10 },
  cloud61: { code: "CLOUD61-BF26FLASH27", quantity: 3 },
  cloud51: { code: "CLOUD51-BF26FLASH27", quantity: 3 },
  cloud41: { code: "CLOUD41-BF26FLASH27", quantity: 10 },
};

const visibleOfferIds = [
  ...blackFridayFlashSaleFreeOffers.map(({ id }) => id),
  ...blackFridayFlashSaleGroups.flatMap(({ offers }) =>
    offers.map(({ id }) => id),
  ),
];
const visibleOffers = Object.fromEntries(
  visibleOfferIds.flatMap((id) => {
    const { code, quantity } = offers[id];
    return code ? [[id, { code, quantity }] as const] : [];
  }),
);

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
    offers: live && publishFlashSaleCodes ? visibleOffers : {},
  };
}
