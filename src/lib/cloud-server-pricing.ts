import {
  cloudCycles,
  cloudGids,
  type CloudPrices,
  type CloudProduct,
} from "@/data/cloud-server";

export async function getCloudProducts(gid: number): Promise<CloudProduct[]> {
  if (!cloudGids.includes(gid)) throw new Error("Unknown Cloud Server group");
  const response = await fetch(
    `https://support.interdata.vn/packages.php?gid=${gid}`,
    {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(15000),
    },
  );
  if (!response.ok) throw new Error(`Cloud pricing HTTP ${response.status}`);
  const data = await response.json();
  if (
    data.success !== true ||
    !Array.isArray(data.products) ||
    !data.products.length
  )
    throw new Error("Cloud pricing unavailable");
  return data.products.map(
    (
      item: CloudProduct & {
        stockcontrol?: boolean | string;
        stocklevel?: number | string;
      },
    ) => {
      if (
        !Number.isInteger(item.pid) ||
        Number(item.gid) !== gid ||
        ![item.name, item.slug, item.description, item.product_url].every(
          (v) => typeof v === "string",
        ) ||
        !item.pricing?.VND
      )
        throw new Error("Invalid Cloud product");
      const url = new URL(item.product_url);
      if (url.protocol !== "https:" || url.hostname !== "support.interdata.vn")
        throw new Error("Invalid Cloud checkout URL");
      return {
        pid: item.pid,
        gid,
        name: item.name,
        slug: item.slug,
        description: item.description,
        product_url: item.product_url,
        available: !(
          (item.stockcontrol === true ||
            item.stockcontrol === "true" ||
            item.stockcontrol === "on") &&
          Number(item.stocklevel ?? 0) <= 0
        ),
        pricing: {
          VND: Object.fromEntries(
            cloudCycles.flatMap(({ key }) => {
              const value = item.pricing.VND[key];
              return value !== undefined && Number.isFinite(Number(value))
                ? [[key, String(value)]]
                : [];
            }),
          ),
        },
      };
    },
  );
}

export async function getCloudPrices(): Promise<CloudPrices> {
  const results = await Promise.allSettled(cloudGids.map(getCloudProducts));
  return Object.fromEntries(
    results.map((r, i) => [
      cloudGids[i],
      r.status === "fulfilled" ? r.value : null,
    ]),
  );
}
