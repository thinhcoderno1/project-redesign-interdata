import "server-only";

import {
  blackFridayCoupons,
  blackFridayDiscountCouponPlaceholder,
  type BlackFridayCouponGroup,
} from "@/data/black-friday";

// Enable only after the user explicitly authorizes publishing the real codes.
const publishCouponCodes = false;

const privateCouponCodes = {
  VPS: {
    12: "BF26-VPS51",
    24: "BF26-VPS61",
    36: "BF26-VPS71",
  },
  "Cloud Server": {
    12: "BF26-CLOUD41",
    24: "BF26-CLOUD51",
    36: "BF26-CLOUD61",
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
