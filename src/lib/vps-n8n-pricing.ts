import { n8nServices, type N8nGid, type N8nPrices } from "@/data/vps-n8n";
import { getAmdProducts } from "./vps-amd-pricing";
import { getGoldProducts } from "./vps-gold-pricing";
import { getLinuxProducts } from "./vps-linux-pricing";
import { getPlatinumProducts } from "./vps-platinum-pricing";
export async function getN8nProducts(gid: N8nGid) {
  switch (gid) {
    case 20:
      return getGoldProducts();
    case 67:
      return getAmdProducts();
    case 3:
      return getLinuxProducts();
    case 29:
    case 101: {
      const products = (await getPlatinumProducts(gid)).filter(
        (p) => !/HN|custom/i.test(p.name) && !p.slug.startsWith("custom"),
      );
      if (!products.length) throw new Error("No Platinum plans available");
      return products;
    }
    default:
      throw new Error("Unknown VPS service");
  }
}
export async function getN8nPrices(): Promise<N8nPrices> {
  const results = await Promise.allSettled(
    n8nServices.map(({ gid }) => getN8nProducts(gid)),
  );
  return Object.fromEntries(
    results.map((result, index) => [
      n8nServices[index].gid,
      result.status === "fulfilled" ? result.value : null,
    ]),
  ) as N8nPrices;
}
