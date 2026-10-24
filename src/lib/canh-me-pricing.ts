import { decodeHTML } from "entities";
import type { BillingCycle, VpsProduct } from "@/data/vps-pricing";

export type PricingPeriod = BillingCycle;
export type ApiProduct = VpsProduct;
export const PERIOD_SUFFIX: Record<PricingPeriod, string> = {
  monthly: "/tháng",
  quarterly: "/3 tháng",
  semiannually: "/6 tháng",
  annually: "/năm",
  biennially: "/2 năm",
  triennially: "/3 năm",
};
export const PERIOD_LABEL: Record<PricingPeriod, string> = {
  monthly: "1 tháng",
  quarterly: "3 tháng",
  semiannually: "6 tháng",
  annually: "1 năm",
  biennially: "2 năm",
  triennially: "3 năm",
};
export function parseDescriptionSpecs(html: string) {
  return decodeHTML(
    html.replace(/<br\s*\/?\s*>/gi, "\n").replace(/<[^>]+>/g, ""),
  )
    .split(/\r?\n/)
    .map((value) => value.trim())
    .filter(Boolean);
}
export function formatVNDPrice(value: string) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0
    ? `${number.toLocaleString("vi-VN")}đ`
    : "";
}
export async function fetchAllGroupPricing(
  gids: readonly number[],
): Promise<Record<number, ApiProduct[]>> {
  const allowed = [100, 87, 97, 95, 93, 89, 96, 92];
  const entries = await Promise.all(
    gids.map(async (gid) => {
      if (!allowed.includes(gid)) return [gid, []] as const;
      try {
        const response = await fetch(
          `https://support.interdata.vn/packages.php?gid=${gid}&module`,
          {
            next: { revalidate: 60 },
            signal: AbortSignal.timeout(15000),
          },
        );
        if (!response.ok) return [gid, []] as const;
        const data = await response.json();
        const products: ApiProduct[] = Array.isArray(data?.products)
          ? data.products
              .filter(
                (product: ApiProduct) =>
                  Number.isInteger(product.pid) &&
                  typeof product.name === "string" &&
                  typeof product.description === "string" &&
                  product.pricing?.VND,
              )
              .map((product: ApiProduct) => ({ ...product, gid }))
          : [];
        return [gid, products] as const;
      } catch {
        return [gid, []] as const;
      }
    }),
  );
  return Object.fromEntries(entries);
}
