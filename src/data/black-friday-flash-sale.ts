// Codes and quantities are sent by the release API after opening.
const specs = {
  "2-2-30": "2 vCPU - 2GB RAM - 30GB SSD",
  "2-4-50": "2 vCPU - 4GB RAM - 50GB SSD",
  "4-8-80": "4 vCPU - 8GB RAM - 80GB SSD",
};

const platinumVpsStoreUrl =
  "https://support.interdata.vn/index.php?rp=/store/vps-platinum-viettel-hcm";
const freeVpsSpecs = "2 vCore - 2GB RAM - 30GB SSD NVMe";
const platinumSpecsLimit = "Tối đa 4 vCPU - 8GB RAM - 80GB SSD";
export const blackFridayVpsFlashSaleCycle = "3–12 tháng";

export const blackFridayFlashSaleFreeOffers = [
  {
    id: "freeAmd",
    plan: "VPS AMD",
    specs: freeVpsSpecs,
    cycle: blackFridayVpsFlashSaleCycle,
    checkoutHref: "https://support.interdata.vn/index.php?rp=/store/amd-g3-vps",
  },
  {
    id: "freePlatinum",
    plan: "VPS Platinum",
    specs: freeVpsSpecs,
    cycle: blackFridayVpsFlashSaleCycle,
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

const flashSaleGroups = [
  {
    id: "vps",
    hidden: false,
    title: "Flash Sale VPS Platinum Giảm Đến 99%",
    checkoutHref: platinumVpsStoreUrl,
    offers: [
      {
        id: "vps99",
        plan: "VPS Platinum",
        specs: specs["2-2-30"],
        discount: 99,
      },
      {
        id: "vps70",
        plan: "VPS Platinum",
        specs: platinumSpecsLimit,
        discount: 70,
      },
      {
        id: "vps60",
        plan: "VPS Platinum",
        specs: platinumSpecsLimit,
        discount: 60,
      },
    ],
  },
  {
    id: "cloud",
    hidden: true,
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

export const blackFridayFlashSaleGroups = flashSaleGroups.filter(
  ({ hidden }) => !hidden,
);

export type FlashSaleOfferId =
  | (typeof blackFridayFlashSaleFreeOffers)[number]["id"]
  | (typeof flashSaleGroups)[number]["offers"][number]["id"];

export type PublishedFlashSaleOffer = { code: string; quantity: number };

export type FlashSaleRelease = {
  serverNow: number;
  startsAt: string;
  status: "upcoming" | "live";
  offers: Partial<Record<FlashSaleOfferId, PublishedFlashSaleOffer>>;
};
