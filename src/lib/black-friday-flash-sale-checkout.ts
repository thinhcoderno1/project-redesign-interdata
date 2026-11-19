import "server-only";

import { blackFridayFlashSale } from "@/data/black-friday";
import type {
  FlashSaleCheckoutLinks,
  FlashSaleOfferId,
} from "@/data/black-friday-flash-sale";
import { checkoutUrl } from "@/data/vps-pricing";
import { getPlatinumCloudProducts } from "./platinum-cloud-server-pricing";
import { getPlatinumProducts } from "./vps-platinum-pricing";

const viettelGid = 101;
const checkoutCycle = "quarterly";
const vps2230 = {
  service: "vps",
  pid: 533,
  slug: "plan-2-2c-2g-30g-platinum-vt",
} as const;

const checkoutProducts = {
  free: vps2230,
  vps81: vps2230,
  vps71: { service: "vps", pid: 534, slug: "plan-3-2c-4g-50g-platinum-vt" },
  vps61: { service: "vps", pid: 536, slug: "plan-5-4c-8g-80g-platinum-vt" },
  cloud61: { service: "cloud", pid: 250, slug: "plan-3-hcm" },
  cloud51: { service: "cloud", pid: 251, slug: "plan-4-hcm" },
  cloud41: { service: "cloud", pid: 253, slug: "platinum-g2-cloud-plan-6" },
} satisfies Record<
  FlashSaleOfferId,
  { service: "vps" | "cloud"; pid: number; slug: string }
>;

const storefronts = {
  vps: "vps-platinum-viettel-hcm",
  cloud: "platinum-g2-cloud",
};

export async function getBlackFridayFlashSaleCheckoutLinks(): Promise<FlashSaleCheckoutLinks> {
  if (blackFridayFlashSale.mode === "hidden") return {};

  const [vps, cloud] = await Promise.allSettled([
    getPlatinumProducts(viettelGid),
    getPlatinumCloudProducts(),
  ]);
  const catalogs = {
    vps: vps.status === "fulfilled" ? vps.value : [],
    cloud: cloud.status === "fulfilled" ? cloud.value : [],
  };

  const links: FlashSaleCheckoutLinks = {};
  for (const [id, { service, pid, slug }] of Object.entries(checkoutProducts)) {
    const matches = catalogs[service].filter((product) => product.pid === pid);
    const [product] = matches;
    if (
      matches.length !== 1 ||
      product.slug !== slug ||
      product.pricing.VND[checkoutCycle] === undefined
    )
      continue;

    const url = new URL(product.product_url);
    if (
      url.origin !== "https://support.interdata.vn" ||
      url.pathname !== "/index.php" ||
      url.searchParams.get("rp") !== `/store/${storefronts[service]}/${slug}` ||
      url.searchParams.has("billingcycle") ||
      url.hash
    )
      continue;

    links[id as FlashSaleOfferId] = checkoutUrl(product, checkoutCycle);
  }
  return links;
}
