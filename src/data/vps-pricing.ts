import { decodeHTML } from "entities";
import content from "./vps-content.json";

export type BillingCycle =
  | "monthly"
  | "quarterly"
  | "semiannually"
  | "annually"
  | "biennially"
  | "triennially";
export type VpsProduct = {
  pid: number;
  gid: number;
  name: string;
  slug: string;
  description: string;
  product_url: string;
  pricing: { VND: Partial<Record<BillingCycle, string>> };
};
export type VpsPrices = Record<number, VpsProduct[] | null>;
export const pricingGids = [
  100,
  ...content.pricing.services.map((service) => service.gid),
];
export const visibleProducts = (products: VpsProduct[]) =>
  products.filter((product) => !product.name.toLowerCase().includes("custom"));
export const formatVnd = (value: string | number | undefined) => {
  const number = value === undefined ? NaN : Number(value);
  return Number.isFinite(number) && number >= 0
    ? `${new Intl.NumberFormat("vi-VN").format(number)}đ`
    : "Liên hệ";
};
export function standardPrice(product: VpsProduct) {
  const monthly = Number(product.pricing.VND.monthly);
  return monthly > 0
    ? { value: product.pricing.VND.monthly, period: "tháng" }
    : { value: product.pricing.VND.quarterly, period: "3 tháng" };
}
export function productSpecs(product: VpsProduct, hotDeal = false) {
  return decodeHTML(
    product.description
      .replace(/<br\s*\/?\s*>/gi, "\n")
      .replace(/<[^>]*>/g, ""),
  )
    .split(hotDeal ? /\r?\n/ : /\r?\n|\?/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !hotDeal || !line.toUpperCase().includes("GIA HẠN"));
}
export function checkoutUrl(product: VpsProduct, cycle?: BillingCycle) {
  if (!cycle) return product.product_url;
  const separator = product.product_url.includes("?") ? "&" : "?";
  return `${product.product_url}${separator}billingcycle=${cycle}`;
}
