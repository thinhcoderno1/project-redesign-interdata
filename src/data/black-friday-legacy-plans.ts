import vpsContent from "./vps-content.json";
import {
  productSpecs,
  type BillingCycle,
  type VpsProduct,
} from "./vps-pricing";

export const blackFridayGid = 103;

export const blackFridayPlans = [
  { pid: 567, slug: "bf26-start", platinumName: "INTER PLATINUM 1", plan: 1 },
  { pid: 568, slug: "bf26-core", platinumName: "INTER PLATINUM 2", plan: 2 },
  { pid: 569, slug: "bf26-plus", platinumName: "INTER PLATINUM 3", plan: 3 },
] as const;

export function getBlackFridayPlan(product: VpsProduct) {
  return product.gid === blackFridayGid
    ? blackFridayPlans.find(
        ({ pid, slug }) => product.pid === pid && product.slug === slug,
      )
    : undefined;
}

export function blackFridaySpecs(product: VpsProduct) {
  // The API includes campaign copy above the specs; the 3-year gift has its own tag.
  return productSpecs(product, true).filter(
    (line) => !/^Tặng\s+1\s+Năm\s+HSD\b/i.test(line),
  );
}

// Use the retained Inter Platinum annual ORIGINAL, not its discounted API price.
// Black Friday has no additional discount for longer billing cycles.
const originalPrices: Partial<
  Record<string, Partial<Record<BillingCycle, number>>>
> = vpsContent.hotDeals.originalPrices;

export function getBlackFridaySavings(
  product: VpsProduct,
  cycle: BillingCycle,
) {
  const plan = getBlackFridayPlan(product);
  const years = { annually: 1, biennially: 2, triennially: 3 }[
    cycle as "annually" | "biennially" | "triennially"
  ];
  const annualOriginal = plan && originalPrices[plan.platinumName]?.annually;
  const originalPrice =
    typeof annualOriginal === "number" ? annualOriginal * years : NaN;
  const price = product.pricing.VND[cycle];
  const currentPrice = Number(price);
  if (
    !plan ||
    !years ||
    !Number.isFinite(originalPrice) ||
    originalPrice <= 0 ||
    typeof price !== "string" ||
    !price.trim() ||
    !Number.isFinite(currentPrice) ||
    currentPrice < 0 ||
    currentPrice >= originalPrice
  )
    return null;

  return {
    originalPrice,
    // Round down so the displayed whole percentage never overstates savings.
    percent: Math.floor(((originalPrice - currentPrice) / originalPrice) * 100),
  };
}

export function getBlackFridayUpgrade(
  product: VpsProduct,
  previous: VpsProduct | undefined,
  cycle: BillingCycle,
) {
  // Include the extra year of service offered with the 3-year cycle.
  const months = { annually: 12, biennially: 24, triennially: 48 }[
    cycle as "annually" | "biennially" | "triennially"
  ];
  const plan = getBlackFridayPlan(product);
  const previousPlan = previous && getBlackFridayPlan(previous);
  if (
    !previous ||
    !months ||
    !plan ||
    !previousPlan ||
    plan.plan !== previousPlan.plan + 1
  )
    return null;

  const price = product.pricing.VND[cycle];
  const previousPrice = previous.pricing.VND[cycle];
  if (
    typeof price !== "string" ||
    !price.trim() ||
    typeof previousPrice !== "string" ||
    !previousPrice.trim() ||
    !Number.isFinite(Number(price)) ||
    !Number.isFinite(Number(previousPrice)) ||
    Number(previousPrice) < 0 ||
    Number(price) <= Number(previousPrice)
  )
    return null;

  const specs = productSpecs(product, true);
  const previousSpecs = productSpecs(previous, true);
  const definitions = [
    { key: "cpu", pattern: /^(\d+(?:\.\d+)?)\s+vCore$/i, unit: "vCore" },
    { key: "ram", pattern: /^(\d+(?:\.\d+)?)\s+GB RAM$/i, unit: "GB RAM" },
    {
      key: "storage",
      pattern: /^(\d+(?:\.\d+)?)\s+GB SSD NVMe$/i,
      unit: "GB SSD NVMe",
    },
  ] as const;
  const resources = definitions.map(({ key, pattern, unit }) => {
    const read = (lines: string[]) => {
      const matches = lines.flatMap((line) => {
        const match = line.match(pattern);
        return match ? [Number(match[1])] : [];
      });
      return matches.length === 1 ? matches[0] : NaN;
    };
    const current = read(specs);
    const before = read(previousSpecs);
    return { key, unit, value: current - before, current, before };
  });
  if (
    resources.some(
      ({ current, before, value }) =>
        !Number.isFinite(current) ||
        !Number.isFinite(before) ||
        current <= 0 ||
        before <= 0 ||
        value < 0,
    )
  )
    return null;
  const increases = resources.filter(({ value }) => value > 0);
  if (!increases.length) return null;
  const difference = Number(price) - Number(previousPrice);
  return {
    previousPlan: previousPlan.plan,
    months,
    difference,
    // The comparison is a monthly equivalent, never a monthly checkout price.
    // Round up to avoid understating a fractional-dong monthly difference.
    monthlyEquivalent: Math.ceil(difference / months),
    resources: increases,
  };
}
