// Public offer details only. Codes stay in the server-only module.
const specs = {
  "2-2-30": "2 vCPU - 2GB RAM - 30GB SSD",
  "2-4-50": "2 vCPU - 4GB RAM - 50GB SSD",
  "4-8-80": "4 vCPU - 8GB RAM - 80GB SSD",
};

export const blackFridayFlashSaleFreeOffer = {
  id: "free",
  plan: "tên miền .COM",
} as const;

export const blackFridayFlashSaleGroups = [
  {
    id: "vps",
    title: "Flash Sale VPS",
    offers: [
      {
        id: "vps81",
        plan: "VPS Platinum",
        specs: specs["2-2-30"],
        discount: 81,
      },
      {
        id: "vps71",
        plan: "VPS Platinum",
        specs: specs["2-4-50"],
        discount: 71,
      },
      {
        id: "vps61",
        plan: "VPS Platinum",
        specs: specs["4-8-80"],
        discount: 61,
      },
    ],
  },
  {
    id: "cloud",
    title: "Flash Sale Cloud Server",
    offers: [
      {
        id: "cloud61",
        plan: "Cloud Platinum",
        specs: specs["2-2-30"],
        discount: 61,
      },
      {
        id: "cloud51",
        plan: "Cloud Platinum",
        specs: specs["2-4-50"],
        discount: 51,
      },
      {
        id: "cloud41",
        plan: "Cloud Platinum",
        specs: specs["4-8-80"],
        discount: 41,
      },
    ],
  },
] as const;

export type FlashSaleOfferId =
  | typeof blackFridayFlashSaleFreeOffer.id
  | (typeof blackFridayFlashSaleGroups)[number]["offers"][number]["id"];

export type FlashSaleCheckoutLinks = Partial<Record<FlashSaleOfferId, string>>;

export type PublishedFlashSaleOffer = { code: string };

export type FlashSaleRelease = {
  serverNow: number;
  startsAt: string;
  status: "upcoming" | "live";
  offers: Partial<Record<FlashSaleOfferId, PublishedFlashSaleOffer>>;
};
