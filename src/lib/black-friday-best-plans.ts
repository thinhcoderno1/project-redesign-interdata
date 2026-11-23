import "server-only";

import type { VpsProduct } from "@/data/vps-pricing";
import {
  getBlackFridayProducts,
  getPreviousBlackFridayProducts,
  type BlackFridayProduct,
} from "./black-friday-pricing";

const platinumStartsAt = Date.parse("2026-11-23T11:30:00+07:00");

export type BestPlansCatalog =
  | { edition: "legacy"; products: VpsProduct[] }
  | { edition: "platinum"; products: BlackFridayProduct[] };

export function getBestPlansRelease(now = Date.now()) {
  return { delayMs: Math.max(0, platinumStartsAt - now) };
}

export async function getBestPlansCatalog(
  now = Date.now(),
): Promise<BestPlansCatalog> {
  if (getBestPlansRelease(now).delayMs > 0) {
    const products = await getPreviousBlackFridayProducts().catch(() => []);
    return { edition: "legacy", products };
  }
  const products = await getBlackFridayProducts().catch(() => []);
  return { edition: "platinum", products };
}
