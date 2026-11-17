import "server-only";
import {
  swedDayGid,
  swedDayOffers,
  swedDayPlans,
  swedDayStore,
  type SwedDayProduct,
} from "@/data/swed-day";

/** Validate the public campaign feed before exposing prices or checkout links. */
export async function getSwedDayProducts(): Promise<SwedDayProduct[]> {
  const response = await fetch(
    `https://support.interdata.vn/packages.php?gid=${swedDayGid}&module`,
    { next: { revalidate: 60 }, signal: AbortSignal.timeout(15000) },
  );
  if (!response.ok) throw new Error(`SWED DAY pricing HTTP ${response.status}`);
  const data = await response.json();
  if (data?.success !== true || !Array.isArray(data.products))
    throw new Error("SWED DAY pricing unavailable");

  return swedDayPlans.map(({ pid, slug }) => {
    const matches = data.products.filter(
      (item: { pid?: unknown } | null) => item?.pid === pid,
    );
    const item = matches[0];
    if (
      matches.length !== 1 ||
      item.gid !== swedDayGid ||
      item.slug !== slug ||
      ![item.name, item.description, item.product_url].every(
        (value) => typeof value === "string" && value.trim(),
      ) ||
      !item.pricing?.VND
    )
      throw new Error("Invalid SWED DAY product");

    if (item.product_url !== `${swedDayStore}/${slug}`)
      throw new Error("Invalid SWED DAY checkout URL");

    const pricing = Object.fromEntries(
      swedDayOffers.flatMap(({ cycle }) => {
        const price = item.pricing.VND[cycle];
        return typeof price === "string" &&
          price.trim() &&
          Number.isFinite(Number(price)) &&
          Number(price) >= 0
          ? [[cycle, price]]
          : [];
      }),
    );
    if (!Object.keys(pricing).length)
      throw new Error("Missing SWED DAY prices");

    const stockControlled =
      item.stockcontrol === true || item.stockcontrol === "true";
    const stock = item.quantity_available ?? item.stocklevel;
    return {
      pid,
      gid: swedDayGid,
      slug,
      name: item.name,
      description: item.description,
      product_url: item.product_url,
      pricing: { VND: pricing },
      available:
        stockControlled && Number.isFinite(Number(stock)) && stock != null
          ? Number(stock) > 0
          : null,
    };
  });
}
