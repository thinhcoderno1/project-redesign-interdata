import type { BillingCycle, VpsProduct } from "./vps-pricing";

export const swedDayStore =
  "https://support.interdata.vn/index.php?rp=/store/swed-day-2026";
export const swedDayGid = 94;
export const swedDayPlans = [
  { pid: 508, slug: "swed-1" },
  { pid: 509, slug: "swed-2" },
  { pid: 510, slug: "swed-3" },
  { pid: 511, slug: "swed-4" },
] as const;

export const swedDayOffers = [
  { cycle: "annually", years: 1, discount: 10, code: "SWED-VPS12T" },
  { cycle: "biennially", years: 2, discount: 15, code: "SWED-VPS24T" },
  { cycle: "triennially", years: 3, discount: 20, code: "SWED-VPS36T" },
] as const satisfies readonly {
  cycle: BillingCycle;
  years: number;
  discount: number;
  code: string;
}[];

export type SwedDayProduct = VpsProduct & { available: boolean | null };
export type SwedDayCycle = (typeof swedDayOffers)[number]["cycle"];
