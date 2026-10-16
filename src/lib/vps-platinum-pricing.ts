import {
  platinumBillingCycles,
  platinumGroups,
  type PlatinumGid,
  type PlatinumPrices,
} from "@/data/vps-platinum";
import type { VpsProduct } from "@/data/vps-pricing";

/** Original Platinum groups, product order, billing totals and checkout URLs. */
export async function getPlatinumProducts(
  gid: PlatinumGid,
): Promise<VpsProduct[]> {
  if (!platinumGroups.some((group) => group.gid === gid))
    throw new Error("Unknown Platinum group");
  const response = await fetch(
    `https://support.interdata.vn/packages.php?gid=${gid}&module`,
    {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(15000),
    },
  );
  if (!response.ok) throw new Error(`Platinum pricing HTTP ${response.status}`);
  const data = await response.json();
  if (
    data.success !== true ||
    !Array.isArray(data.products) ||
    !data.products.length
  )
    throw new Error("Platinum pricing unavailable");
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
      throw new Error("Invalid Platinum product");
    const url = new URL(item.product_url);
    if (
      url.protocol !== "https:" ||
      url.hostname !== "support.interdata.vn" ||
      url.username ||
      url.password
    )
      throw new Error("Invalid Platinum checkout URL");
    const pricing = Object.fromEntries(
      platinumBillingCycles.flatMap(({ key }) => {
        const value = item.pricing.VND[key];
        return typeof value === "string" &&
          value.trim() &&
          Number.isFinite(Number(value)) &&
          Number(value) >= 0
          ? [[key, value]]
          : [];
      }),
    );
    if (!Object.keys(pricing).length)
      throw new Error("Missing Platinum prices");
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

export async function getPlatinumPrices(): Promise<PlatinumPrices> {
  const results = await Promise.allSettled(
    platinumGroups.map(({ gid }) => getPlatinumProducts(gid)),
  );
  return Object.fromEntries(
    results.map((result, index) => [
      platinumGroups[index].gid,
      result.status === "fulfilled" ? result.value : null,
    ]),
  ) as PlatinumPrices;
}
