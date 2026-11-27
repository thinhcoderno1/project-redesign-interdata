// Codes and quantities are sent by the release API after opening.
const specs = {
  "2-2-30": "2 vCPU - 2GB RAM - 30GB SSD",
  "2-4-50": "2 vCPU - 4GB RAM - 50GB SSD",
  "4-8-80": "4 vCPU - 8GB RAM - 80GB SSD",
};

const platinumVpsStoreUrl =
  "https://support.interdata.vn/index.php?rp=/store/vps-platinum-viettel-hcm";
const freeVpsSpecs = "2 vCore - 2GB RAM - 30GB SSD NVMe";

export const blackFridayFlashSaleFreeOffers = [
  {
    id: "freeAmd",
    plan: "VPS AMD",
    specs: freeVpsSpecs,
    cycle: "6 tháng",
    checkoutHref: "https://support.interdata.vn/index.php?rp=/store/amd-g3-vps",
  },
  {
    id: "freePlatinum",
    plan: "VPS Platinum",
    specs: freeVpsSpecs,
    cycle: "6 tháng",
    checkoutHref: platinumVpsStoreUrl,
  },
  {
    id: "free",
    plan: "tên miền .COM",
    subtitle: "Săn Tên Miền Đẹp Cho Thương Hiệu Của Bạn",
    cycle: "1 năm",
    checkoutHref: "https://support.interdata.vn/cart.php?a=add&domain=register",
  },
] as const;

export const blackFridayFlashSaleGroups = [
  {
    id: "vps",
    title: "Flash Sale VPS Platinum Giảm Đến 81%",
    checkoutHref: platinumVpsStoreUrl,
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
    title: "Flash Sale Cloud Platinum Giảm Đến 61%",
    checkoutHref:
      "https://support.interdata.vn/index.php?rp=/store/platinum-g2-cloud",
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
  | (typeof blackFridayFlashSaleFreeOffers)[number]["id"]
  | (typeof blackFridayFlashSaleGroups)[number]["offers"][number]["id"];

export type PublishedFlashSaleOffer = { code: string; quantity: number };

export type FlashSaleRelease = {
  serverNow: number;
  startsAt: string;
  status: "upcoming" | "live";
  offers: Partial<Record<FlashSaleOfferId, PublishedFlashSaleOffer>>;
};
