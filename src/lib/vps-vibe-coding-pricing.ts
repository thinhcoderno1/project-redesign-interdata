import { decodeHTML } from "entities";
import { vibeBillingCycles, type VibePlan } from "@/data/vps-vibe-coding";

export const vibePricingSource =
  "https://support.interdata.vn/packages.php?gid=98&module";

/** Preserve the supplied storefront's plan order, five cycles and total VND prices. */
export async function getVibePlans(): Promise<VibePlan[]> {
  const response = await fetch(vibePricingSource, {
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(15000),
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`Vibe pricing HTTP ${response.status}`);
  const result = await response.json();
  if (
    result.success !== true ||
    !Array.isArray(result.products) ||
    !result.products.length
  )
    throw new Error("Vibe pricing unavailable");
  return result.products.map((product: Record<string, unknown>) => {
    if (
      product.gid !== 98 ||
      !Number.isInteger(product.pid) ||
      typeof product.name !== "string" ||
      !product.name.trim() ||
      typeof product.description !== "string" ||
      typeof product.product_url !== "string"
    )
      throw new Error("Invalid Vibe product");
    const url = new URL(product.product_url);
    if (
      url.protocol !== "https:" ||
      url.hostname !== "support.interdata.vn" ||
      url.username ||
      url.password
    )
      throw new Error("Invalid Vibe checkout URL");
    const raw = (product.pricing as { VND?: Record<string, unknown> })?.VND;
    const prices = Object.fromEntries(
      vibeBillingCycles.flatMap(({ key }) => {
        const value = raw?.[key];
        return typeof value === "string" &&
          value.trim() &&
          Number.isFinite(Number(value)) &&
          Number(value) >= 0
          ? [[key, `${new Intl.NumberFormat("vi-VN").format(Number(value))} đ`]]
          : [];
      }),
    );
    const specs = decodeHTML(
      product.description
        .replace(/<br\s*\/?\s*>/gi, "\n")
        .replace(/<[^>]+>/g, ""),
    )
      .split(/\r?\n/)
      .map((line) => line.replace(/\s+/g, " ").trim())
      .filter((line) => line && !/gia hạn/i.test(line));
    if (!prices.monthly || !specs.length)
      throw new Error("Incomplete Vibe plan");
    return {
      id: String(product.pid),
      name: product.name.trim(),
      prices,
      specs,
      productUrl: product.product_url,
    };
  });
}
