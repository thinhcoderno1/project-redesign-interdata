export const vibeBillingCycles = [
  { key: "monthly", label: "1 tháng", discount: "" },
  { key: "quarterly", label: "3 tháng", discount: "-10%" },
  { key: "annually", label: "1 năm", discount: "-70%" },
  { key: "biennially", label: "2 năm", discount: "-73%" },
  { key: "triennially", label: "3 năm", discount: "-76%" },
] as const;
export type VibeCycle = (typeof vibeBillingCycles)[number]["key"];
export interface VibePlan {
  id: string;
  name: string;
  prices: Partial<Record<VibeCycle, string>>;
  specs: string[];
  productUrl: string;
}
export function vibeOrderUrl(productUrl: string, cycle: VibeCycle) {
  return `${productUrl}${productUrl.includes("?") ? "&" : "?"}billingcycle=${cycle}`;
}
