import {
  pricingGids,
  standardPricingGids,
  type BillingCycle,
  type VpsProduct,
  type VpsPrices,
} from "@/data/vps-pricing";

const cycles: BillingCycle[] = [
  "monthly",
  "quarterly",
  "semiannually",
  "annually",
  "biennially",
  "triennially",
];

export async function getVpsProducts(gid: number): Promise<VpsProduct[]> {
  if (!pricingGids.includes(gid)) throw new Error("Unknown VPS pricing group");
  // Same public endpoint, group IDs and 60-second revalidation as the source app.
  const response = await fetch(
    `https://support.interdata.vn/packages.php?gid=${gid}`,
    {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(15000),
    },
  );
  if (!response.ok)
    throw new Error(`VPS pricing returned HTTP ${response.status}`);
  const data = await response.json();
  if (
    data.success !== true ||
    !Array.isArray(data.products) ||
    data.products.length === 0
  )
    throw new Error("VPS pricing is unavailable");
  return data.products.map((item: VpsProduct) => {
    if (
      !Number.isInteger(item.pid) ||
      !["name", "slug", "description", "product_url"].every(
        (field) => typeof item[field as keyof VpsProduct] === "string",
      ) ||
      !item.pricing?.VND
    )
      throw new Error("Invalid VPS product data");
    const url = new URL(item.product_url);
    if (url.protocol !== "https:" || url.hostname !== "support.interdata.vn")
      throw new Error("Invalid VPS checkout URL");
    return {
      pid: item.pid,
      gid,
      name: item.name,
      slug: item.slug,
      description: item.description,
      product_url: item.product_url,
      pricing: {
        VND: Object.fromEntries(
          cycles.flatMap((cycle) => {
            const value = item.pricing.VND[cycle];
            return value !== undefined && Number.isFinite(Number(value))
              ? [[cycle, String(value)]]
              : [];
          }),
        ),
      },
    };
  });
}

export async function getAllVpsPrices(): Promise<VpsPrices> {
  const results = await Promise.allSettled(
    standardPricingGids.map(getVpsProducts),
  );
  return Object.fromEntries(
    results.map((result, index) => [
      standardPricingGids[index],
      result.status === "fulfilled" ? result.value : null,
    ]),
  );
}
