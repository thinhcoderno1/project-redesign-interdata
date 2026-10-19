import { linuxBillingCycles, linuxPricingGid } from "@/data/vps-linux";
import type { VpsProduct } from "@/data/vps-pricing";

/** Keep the existing Linux storefront's standard plans and API order. */
export async function getLinuxProducts(): Promise<VpsProduct[]> {
  const response = await fetch(
    `https://support.interdata.vn/packages.php?gid=${linuxPricingGid}&module`,
    { next: { revalidate: 60 }, signal: AbortSignal.timeout(15000) },
  );
  if (!response.ok) throw new Error(`Linux pricing HTTP ${response.status}`);
  const data = await response.json();
  if (data.success !== true || !Array.isArray(data.products))
    throw new Error("Linux pricing unavailable");

  // The original storefront omits custom slugs and non-plan products.
  // gid=3 also contains custom quotes and a payment-test product.
  const products = data.products.filter(
    (item: VpsProduct) =>
      typeof item?.slug === "string" &&
      /^plan-\d+-/i.test(item.slug) &&
      item.slug.split("-").length >= 5,
  );
  if (!products.length) throw new Error("No Linux plans available");

  return products.map((item: VpsProduct) => {
    if (
      !Number.isInteger(item.pid) ||
      item.gid !== linuxPricingGid ||
      !["name", "slug", "description", "product_url"].every(
        (key) => typeof item[key as keyof VpsProduct] === "string",
      ) ||
      !item.pricing?.VND
    )
      throw new Error("Invalid Linux product");
    const url = new URL(item.product_url);
    if (
      url.protocol !== "https:" ||
      url.hostname !== "support.interdata.vn" ||
      url.username ||
      url.password
    )
      throw new Error("Invalid Linux checkout URL");
    const pricing = Object.fromEntries(
      linuxBillingCycles.flatMap(({ key }) => {
        const value = item.pricing.VND[key];
        return typeof value === "string" &&
          value.trim() &&
          Number.isFinite(Number(value)) &&
          Number(value) >= 0
          ? [[key, value]]
          : [];
      }),
    );
    if (!Object.keys(pricing).length) throw new Error("Missing Linux prices");
    return {
      pid: item.pid,
      gid: linuxPricingGid,
      name: item.name,
      slug: item.slug,
      description: item.description,
      product_url: item.product_url,
      pricing: { VND: pricing },
    };
  });
}
