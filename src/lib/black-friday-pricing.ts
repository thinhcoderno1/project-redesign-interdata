import { productSpecs, type VpsProduct } from "@/data/vps-pricing";
import {
  blackFridayGid,
  blackFridayPlans,
} from "@/data/black-friday-legacy-plans";
import { getPlatinumProducts } from "./vps-platinum-pricing";
import { getAmdProducts } from "./vps-amd-pricing";

const groupId = 105;
const storefront = "/store/black-friday-26-vps-intel-platinum-gen2";
const planIds = [570, 571, 572, 573, 574, 575, 576, 577];
const amdGroupId = 107;
const amdStorefront = "/store/black-friday-26-vps-amd-epyc-gen2";
const amdPlanIds = [586, 587, 588, 589, 590, 591, 592, 593];
const cycles = ["annually", "biennially", "triennially"] as const;
const referenceTerms = {
  annually: { months: 12, discount: 10 },
  biennially: { months: 24, discount: 15 },
  triennially: { months: 36, discount: 20 },
};

export type BlackFridayCycle = (typeof cycles)[number];
type Resources = { cpu: number; ram: number; nvme: number };
type ReferencePrice = { amount: number; source: "portal" | "estimate" };

export type BlackFridayProduct = Omit<VpsProduct, "description"> & {
  resources: Resources | null;
  ipv4?: string;
  port?: string;
  bandwidth?: string;
  firewall?: string;
  gifts: string[];
  referencePrices: Partial<Record<BlackFridayCycle, ReferencePrice>>;
};

function readResources(specs: string): Resources | null {
  const cpu = specs.match(/^(\d+(?:\.\d+)?)\s+v(?:Core|CPU)\b/im);
  const ram = specs.match(/^(\d+(?:\.\d+)?)\s+GB\s+RAM\b/im);
  const nvme = specs.match(/^(\d+(?:\.\d+)?)\s+GB\s+(?:SSD\s+)?NVMe\b/im);
  return cpu && ram && nvme
    ? { cpu: Number(cpu[1]), ram: Number(ram[1]), nvme: Number(nvme[1]) }
    : null;
}

function readPresentation(product: VpsProduct) {
  const specs = productSpecs(product, true).join("\n");
  const ipv4 = specs.match(/^(\d+)\s+IPv4 Public\b/im)?.[1];
  const port = specs.match(/^\d+(?:\.\d+)?\s*[GM]bps Network Port$/im)?.[0];
  const bandwidth = specs.match(/^Unlimited Bandwidth\b[^\n]*/im)?.[0];
  const firewall = specs.match(/^Firewall\s+(\d+(?:\.\d+)?)\s*Gbps$/im)?.[1];
  const giftOffer = specs.match(
    /^Tặng\s+(.+?)\s+khi đăng ký chu kỳ 3 năm$/im,
  )?.[1];
  return {
    resources: readResources(specs),
    ipv4: ipv4 && `${ipv4.padStart(2, "0")} IPv4 Public`,
    port,
    bandwidth,
    firewall: firewall && `Firewall Anti DDoS ${firewall}Gbps`,
    gifts: giftOffer
      ? giftOffer
          .split(/\s*\+\s*/)
          .filter(Boolean)
          .map((gift) => (gift === "Ly sứ" ? "Ly sứ InterData" : gift))
          .sort(
            (a, b) =>
              Number(b.startsWith("Nón bảo hiểm")) -
              Number(a.startsWith("Nón bảo hiểm")),
          )
      : [],
  };
}

function estimateViettelPrice(
  { cpu, ram, nvme }: Resources,
  cycle: BlackFridayCycle,
) {
  const { months, discount } = referenceTerms[cycle];
  const monthlyResources = cpu * 50_000 + ram * 50_000 + nvme * 4_000;
  return Math.round(
    (monthlyResources * (100 - discount) * months) / 100 +
      ram * 10_000 * months,
  );
}

function getReferencePrices(
  product: BlackFridayProduct,
  viettelPlans: { product: VpsProduct; resources: Resources | null }[],
) {
  const { resources } = product;
  const prices: BlackFridayProduct["referencePrices"] = {};
  if (!resources) return prices;

  const matches = viettelPlans.filter(
    ({ resources: plan }) =>
      plan &&
      plan.cpu === resources.cpu &&
      plan.ram === resources.ram &&
      plan.nvme === resources.nvme,
  );
  for (const cycle of cycles) {
    const checkoutPrice = product.pricing.VND[cycle];
    if (checkoutPrice === undefined) continue;
    const portalPrice = Number(
      matches.length === 1 ? matches[0].product.pricing.VND[cycle] : undefined,
    );
    if (Number.isFinite(portalPrice) && portalPrice > 0) {
      if (portalPrice > Number(checkoutPrice))
        prices[cycle] = { amount: portalPrice, source: "portal" };
    } else if (product.pid !== planIds[0]) {
      const estimate = estimateViettelPrice(resources, cycle);
      if (estimate > Number(checkoutPrice))
        prices[cycle] = { amount: estimate, source: "estimate" };
    }
  }
  return prices;
}

function getAmdReferencePrices(
  product: BlackFridayProduct,
  amdPlans: { product: VpsProduct; resources: Resources | null }[],
) {
  const prices: BlackFridayProduct["referencePrices"] = {};
  const target = product.resources;
  if (!target) return prices;

  // Monthly upgrade rates supplied for this campaign. Never subtract resources.
  const candidates = amdPlans.flatMap(({ product: plan, resources }) => {
    if (
      !resources ||
      resources.cpu > target.cpu ||
      resources.ram > target.ram ||
      resources.nvme > target.nvme
    )
      return [];
    const upgrade =
      (target.cpu - resources.cpu) * 60_000 +
      (target.ram - resources.ram) * 50_000 +
      (target.nvme - resources.nvme) * 4_000;
    return [{ plan, upgrade }];
  });
  // Prefer an exact Portal configuration, otherwise the smallest resource uplift.
  candidates.sort((a, b) => a.upgrade - b.upgrade || a.plan.pid - b.plan.pid);
  for (const cycle of cycles) {
    const checkoutPrice = product.pricing.VND[cycle];
    if (checkoutPrice === undefined) continue;
    const reference = candidates.find(({ plan }) => {
      const value = Number(plan.pricing.VND[cycle]);
      return Number.isFinite(value) && value > 0;
    });
    if (!reference) continue;
    const amount = Math.round(
      Number(reference.plan.pricing.VND[cycle]) +
        reference.upgrade * referenceTerms[cycle].months,
    );
    if (amount > Number(checkoutPrice))
      prices[cycle] = {
        amount,
        source: reference.upgrade === 0 ? "portal" : "estimate",
      };
  }
  return prices;
}

async function loadCampaignProducts(
  gid: number,
  storefront: string,
  plans: readonly { pid: number; slug: string }[],
): Promise<VpsProduct[]> {
  const response = await fetch(
    `https://support.interdata.vn/packages.php?gid=${gid}&module`,
    {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(15000),
    },
  );
  if (!response.ok)
    throw new Error(`Black Friday pricing HTTP ${response.status}`);
  const data = await response.json();
  if (data.success !== true || !Array.isArray(data.products))
    throw new Error("Black Friday pricing unavailable");

  return plans.map(({ pid, slug }) => {
    const matches = data.products.filter(
      (item: VpsProduct) => item?.pid === pid,
    );
    const item: VpsProduct | undefined = matches[0];
    if (
      matches.length !== 1 ||
      !item ||
      item.gid !== gid ||
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
      url.searchParams.get("rp") !== `${storefront}/${slug}` ||
      url.searchParams.has("billingcycle") ||
      url.hash
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
      gid,
      slug,
      name: item.name,
      description: item.description,
      product_url: item.product_url,
      pricing: { VND: pricing },
    };
  });
}

export function getPreviousBlackFridayProducts(): Promise<VpsProduct[]> {
  return loadCampaignProducts(
    blackFridayGid,
    "/store/black-friday-2026",
    blackFridayPlans,
  );
}

function presentCampaignProduct(item: VpsProduct): BlackFridayProduct {
  const { pid, gid, slug, name, product_url, pricing } = item;
  return {
    pid,
    gid,
    slug,
    name: name.replace(/^BF26-\s*/i, "BF26 ").toUpperCase(),
    product_url,
    pricing,
    ...readPresentation(item),
    referencePrices: {},
  };
}

export async function getBlackFridayAmdProducts(): Promise<
  BlackFridayProduct[]
> {
  const plans = amdPlanIds.map((pid, index) => ({
    pid,
    slug: `bf26-amd-e${index + 1}`,
  }));
  const [products, amd] = await Promise.all([
    loadCampaignProducts(amdGroupId, amdStorefront, plans),
    getAmdProducts().catch(() => []),
  ]);
  const amdPlans = amd.map((product) => ({
    product,
    resources: readResources(productSpecs(product).join("\n")),
  }));
  return products.map((item) => {
    const product = presentCampaignProduct(item);
    product.referencePrices = getAmdReferencePrices(product, amdPlans);
    return product;
  });
}

/** Best Plans checkout uses the campaign catalog. Viettel is a separate price reference. */
export async function getBlackFridayProducts(): Promise<BlackFridayProduct[]> {
  const plans = planIds.map((pid, index) => ({
    pid,
    slug: `bf26-platinum-p${index + 1}`,
  }));
  const [products, viettel] = await Promise.all([
    loadCampaignProducts(groupId, storefront, plans),
    getPlatinumProducts(101).catch(() => []),
  ]);
  const viettelPlans = viettel.map((product) => ({
    product,
    resources: readResources(productSpecs(product).join("\n")),
  }));
  return products.map((item) => {
    const product = presentCampaignProduct(item);
    product.referencePrices = getReferencePrices(product, viettelPlans);
    return product;
  });
}
