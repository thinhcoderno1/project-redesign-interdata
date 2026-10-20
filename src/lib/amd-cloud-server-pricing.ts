import {
  amdCloudBillingCycles,
  amdCloudPricingGid,
  type AmdCloudProduct,
} from "@/data/amd-cloud-server";

export async function getAmdCloudProducts(): Promise<AmdCloudProduct[]> {
  const response = await fetch(
    `https://support.interdata.vn/packages.php?gid=${amdCloudPricingGid}&module`,
    { next: { revalidate: 60 }, signal: AbortSignal.timeout(15000) },
  );
  if (!response.ok)
    throw new Error(`AMD Cloud pricing HTTP ${response.status}`);
  const data = await response.json();
  if (
    data.success !== true ||
    !Array.isArray(data.products) ||
    !data.products.length
  )
    throw new Error("AMD Cloud pricing unavailable");

  // Preserve all products, their order and checkout URLs from the AMD storefront.
  return data.products.map(
    (
      item: AmdCloudProduct & {
        stockcontrol?: boolean | string;
        stocklevel?: number | string;
      },
    ) => {
      if (
        !item ||
        !Number.isInteger(item.pid) ||
        Number(item.gid) !== amdCloudPricingGid ||
        ![item.name, item.slug, item.description, item.product_url].every(
          (v) => typeof v === "string" && v.trim(),
        ) ||
        !item.pricing?.VND
      )
        throw new Error("Invalid AMD Cloud product");
      const url = new URL(item.product_url);
      if (
        url.protocol !== "https:" ||
        url.hostname !== "support.interdata.vn" ||
        url.username ||
        url.password
      )
        throw new Error("Invalid AMD Cloud checkout URL");
      const pricing = Object.fromEntries(
        amdCloudBillingCycles.flatMap(({ key }) => {
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
        throw new Error("Missing AMD Cloud prices");
      const stockControlled =
        item.stockcontrol === true ||
        item.stockcontrol === "true" ||
        item.stockcontrol === "on";
      return {
        pid: item.pid,
        gid: amdCloudPricingGid,
        name: item.name,
        slug: item.slug,
        description: item.description,
        product_url: item.product_url,
        pricing: { VND: pricing },
        available: !(stockControlled && Number(item.stocklevel ?? 0) <= 0),
      };
    },
  );
}
