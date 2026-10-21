import {
  dedicatedBillingCycles,
  dedicatedPricingGid,
  type DedicatedProduct,
} from "@/data/dedicated-server";

export async function getDedicatedProducts(): Promise<DedicatedProduct[]> {
  const response = await fetch(
    `https://support.interdata.vn/packages.php?gid=${dedicatedPricingGid}&module`,
    { next: { revalidate: 60 }, signal: AbortSignal.timeout(15000) },
  );
  if (!response.ok)
    throw new Error(`Dedicated Server pricing HTTP ${response.status}`);
  const data = await response.json();
  if (
    data.success !== true ||
    !Array.isArray(data.products) ||
    !data.products.length
  )
    throw new Error("Dedicated Server pricing unavailable");

  // Preserve source order, specifications, checkout URLs and stock control.
  return data.products.map(
    (
      item: DedicatedProduct & {
        stockcontrol?: boolean | string;
        stocklevel?: number | string;
      },
    ) => {
      if (
        !item ||
        !Number.isInteger(item.pid) ||
        Number(item.gid) !== dedicatedPricingGid ||
        ![item.name, item.slug, item.description, item.product_url].every(
          (v) => typeof v === "string" && v.trim(),
        ) ||
        !item.pricing?.VND
      )
        throw new Error("Invalid Dedicated Server product");
      const url = new URL(item.product_url);
      if (
        url.protocol !== "https:" ||
        url.hostname !== "support.interdata.vn" ||
        url.username ||
        url.password
      )
        throw new Error("Invalid Dedicated Server checkout URL");
      const pricing = Object.fromEntries(
        dedicatedBillingCycles.flatMap(({ key }) => {
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
        throw new Error("Missing Dedicated Server prices");
      const stockControlled =
        item.stockcontrol === true ||
        item.stockcontrol === "true" ||
        item.stockcontrol === "on";
      return {
        pid: item.pid,
        gid: dedicatedPricingGid,
        name: item.name,
        slug: item.slug,
        description: item.description,
        product_url: item.product_url,
        pricing: { VND: pricing },
        setupFees: Object.fromEntries(
          dedicatedBillingCycles.flatMap(({ key, setupKey }) => {
            const value = (item.pricing.VND as Record<string, unknown>)[
              setupKey
            ];
            return typeof value === "string" &&
              value.trim() &&
              Number.isFinite(Number(value)) &&
              Number(value) >= 0
              ? [[key, value]]
              : [];
          }),
        ),
        available: !(stockControlled && Number(item.stocklevel ?? 0) <= 0),
      };
    },
  );
}
