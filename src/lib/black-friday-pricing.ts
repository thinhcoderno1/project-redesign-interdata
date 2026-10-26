import { blackFridayGid, blackFridayPlans } from "@/data/black-friday";
import type { VpsProduct } from "@/data/vps-pricing";

const cycles = ["annually", "biennially", "triennially"] as const;

/** Official BF26 products; preserve API prices and checkout destinations. */
export async function getBlackFridayProducts(): Promise<VpsProduct[]> {
  const response = await fetch(
    `https://support.interdata.vn/packages.php?gid=${blackFridayGid}&module`,
    { next: { revalidate: 60 }, signal: AbortSignal.timeout(15000) },
  );
  if (!response.ok)
    throw new Error(`Black Friday pricing HTTP ${response.status}`);
  const data = await response.json();
  if (data.success !== true || !Array.isArray(data.products))
    throw new Error("Black Friday pricing unavailable");

  return blackFridayPlans.map(({ pid, slug }) => {
    const matches = data.products.filter(
      (item: VpsProduct) => item?.pid === pid,
    );
    const item: VpsProduct | undefined = matches[0];
    if (
      matches.length !== 1 ||
      !item ||
      item.gid !== blackFridayGid ||
      item.slug !== slug ||
      ![item.name, item.description, item.product_url].every(
        (value) => typeof value === "string" && value.trim(),
      ) ||
      !item.pricing?.VND
    )
      throw new Error("Invalid Black Friday product");

    const url = new URL(item.product_url);
    if (
      url.origin !== "https://support.interdata.vn" ||
      url.username ||
      url.password ||
      url.pathname !== "/index.php" ||
      url.searchParams.get("rp") !== `/store/black-friday-2026/${slug}`
    )
      throw new Error("Invalid Black Friday checkout URL");

    const pricing = Object.fromEntries(
      cycles.flatMap((cycle) => {
        const value = item.pricing.VND[cycle];
        return typeof value === "string" &&
          value.trim() &&
          Number.isFinite(Number(value)) &&
          Number(value) >= 0
          ? [[cycle, value]]
          : [];
      }),
    );
    if (!Object.keys(pricing).length)
      throw new Error("Missing Black Friday prices");
    return {
      pid,
      gid: blackFridayGid,
      slug,
      name: item.name,
      description: item.description,
      product_url: item.product_url,
      pricing: { VND: pricing },
    };
  });
}
