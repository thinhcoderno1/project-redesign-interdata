import { amdBillingCycles } from "@/data/vps-amd";
import type { VpsProduct } from "@/data/vps-pricing";

export const AMD_PRICING_URL =
  "https://support.interdata.vn/packages.php?gid=67&module";

/** Preserve the old AMD app's endpoint, prices, product order and checkout URLs. */
export async function getAmdProducts(): Promise<VpsProduct[]> {
  const response = await fetch(AMD_PRICING_URL, {
    next: { revalidate: 60 },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`AMD pricing HTTP ${response.status}`);
  const data = await response.json();
  if (
    data.success !== true ||
    !Array.isArray(data.products) ||
    !data.products.length
  )
    throw new Error("AMD pricing unavailable");
  return data.products.map((item: VpsProduct) => {
    if (
      !item ||
      !Number.isInteger(item.pid) ||
      item.gid !== 67 ||
      !["name", "slug", "description", "product_url"].every(
        (key) => typeof item[key as keyof VpsProduct] === "string",
      ) ||
      !item.pricing?.VND
    )
      throw new Error("Invalid AMD product");
    const url = new URL(item.product_url);
    if (
      url.protocol !== "https:" ||
      url.hostname !== "support.interdata.vn" ||
      url.username ||
      url.password
    )
      throw new Error("Invalid AMD checkout URL");
    const pricing = Object.fromEntries(
      amdBillingCycles.flatMap(({ key }) => {
        const value = item.pricing.VND[key];
        return typeof value === "string" &&
          value.trim() &&
          Number.isFinite(Number(value)) &&
          Number(value) >= 0
          ? [[key, value]]
          : [];
      }),
    );
    if (!Object.keys(pricing).length) throw new Error("Missing AMD prices");
    return {
      pid: item.pid,
      gid: 67,
      name: item.name,
      slug: item.slug,
      description: item.description,
      product_url: item.product_url,
      pricing: { VND: pricing },
    };
  });
}
