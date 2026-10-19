import { goldBillingCycles, goldPricingGid } from "@/data/vps-gold";
import type { VpsProduct } from "@/data/vps-pricing";

/** Original Gold groups, product order, billing totals and checkout URLs. */
export async function getGoldProducts(): Promise<VpsProduct[]> {
  const gid = goldPricingGid;
  const response = await fetch(
    `https://support.interdata.vn/packages.php?gid=${gid}&module`,
    {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(15000),
    },
  );
  if (!response.ok) throw new Error(`Gold pricing HTTP ${response.status}`);
  const data = await response.json();
  if (
    data.success !== true ||
    !Array.isArray(data.products) ||
    !data.products.length
  )
    throw new Error("Gold pricing unavailable");
  return data.products.map((item: VpsProduct) => {
    if (
      !item ||
      !Number.isInteger(item.pid) ||
      item.gid !== gid ||
      !["name", "slug", "description", "product_url"].every(
        (key) => typeof item[key as keyof VpsProduct] === "string",
      ) ||
      !item.pricing?.VND
    )
      throw new Error("Invalid Gold product");
    const url = new URL(item.product_url);
    if (
      url.protocol !== "https:" ||
      url.hostname !== "support.interdata.vn" ||
      url.username ||
      url.password
    )
      throw new Error("Invalid Gold checkout URL");
    const pricing = Object.fromEntries(
      goldBillingCycles.flatMap(({ key }) => {
        const value = item.pricing.VND[key];
        return typeof value === "string" &&
          value.trim() &&
          Number.isFinite(Number(value)) &&
          Number(value) >= 0
          ? [[key, value]]
          : [];
      }),
    );
    if (!Object.keys(pricing).length) throw new Error("Missing Gold prices");
    return {
      pid: item.pid,
      gid,
      name: item.name,
      slug: item.slug,
      description: item.description,
      product_url: item.product_url,
      pricing: { VND: pricing },
    };
  });
}
