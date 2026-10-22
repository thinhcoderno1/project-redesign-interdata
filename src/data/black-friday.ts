import vpsContent from "./vps-content.json";
import type { BillingCycle, VpsProduct } from "./vps-pricing";

// Reuse the original Inter Platinum prices already retained in the VPS source.
const originalPrices: Partial<
  Record<string, Partial<Record<BillingCycle, number>>>
> = vpsContent.hotDeals.originalPrices;

export function getBlackFridaySavings(
  product: VpsProduct,
  cycle: BillingCycle,
) {
  const originalPrice =
    originalPrices[product.name.trim().toUpperCase()]?.[cycle];
  const price = product.pricing.VND[cycle];
  const currentPrice = Number(price);
  if (
    product.gid !== 100 ||
    typeof originalPrice !== "number" ||
    !Number.isFinite(originalPrice) ||
    originalPrice <= 0 ||
    typeof price !== "string" ||
    !price.trim() ||
    !Number.isFinite(currentPrice) ||
    currentPrice < 0 ||
    currentPrice >= originalPrice
  )
    return null;

  return {
    originalPrice,
    // Round down so the displayed whole percentage never overstates savings.
    percent: Math.floor(((originalPrice - currentPrice) / originalPrice) * 100),
  };
}

// Presentation values supplied in the approved reference. Campaign codes and
// dates must come from Sales before enabling redemption or a live countdown.
export const blackFridaySlots = [
  { start: "10:00", end: "12:00" },
  { start: "14:00", end: "16:00" },
  { start: "20:00", end: "22:00" },
] as const;

export const blackFridayCoupons = [
  { service: "VPS", discounts: [71, 61, 51], href: "/vps-platinum/" },
  {
    service: "Cloud Server",
    discounts: [61, 51, 41],
    href: "/platinum-cloud-server/",
  },
] as const;
