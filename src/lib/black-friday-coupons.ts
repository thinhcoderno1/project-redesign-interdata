import "server-only";

import {
  blackFridayCoupons,
  blackFridayDiscountCouponPlaceholder,
  type BlackFridayCouponGroup,
} from "@/data/black-friday";

// Real coupon codes are published at the user's request.
const publishCouponCodes = true;

const privateCouponCodes = {
  VPS: {
    12: "BF26-VPS45",
    24: "BF26-VPS50",
    36: "BF26-VPS55",
  },
  "Cloud Server": {
    12: "BF26-CLOUD30",
    24: "BF26-CLOUD35",
    36: "BF26-CLOUD40",
  },
} as const;

/** Only this sanitized view may cross the Server/Client Component boundary. */
export function getBlackFridayCoupons(): BlackFridayCouponGroup[] {
  return blackFridayCoupons.map(({ service, href, offers }) => ({
    service,
    href,
    offers: offers.map(({ months, discount }) => ({
      months,
      discount,
      code: publishCouponCodes
        ? privateCouponCodes[service][months]
        : blackFridayDiscountCouponPlaceholder,
    })),
  }));
}
