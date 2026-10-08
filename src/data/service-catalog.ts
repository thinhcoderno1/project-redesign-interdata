export type CatalogService = {
  id: string;
  name: string;
  platform: string;
  description: string;
  icon: string;
  href: string;
  price: number;
  period: string;
  priceNote: string;
};

// Static entry-plan prices checked on the official pages on 2026-10-08.
// Keep the published billing period; do not convert quarterly or annual offers.
export const catalogPriceCheckedAt = "08/10/2026";
export const vpsCatalog: CatalogService[] = [
  {
    id: "vps-amd",
    name: "VPS AMD",
    platform: "AMD EPYC",
    icon: "cpu",
    description:
      "Máy chủ ảo trên nền tảng AMD EPYC để vận hành website, ứng dụng và môi trường riêng.",
    href: "https://interdata.vn/vps-amd/",
    price: 150000,
    period: "tháng",
    priceNote: "VPS AMD · Plan 1",
  },
  {
    id: "vps-platinum",
    name: "VPS Platinum",
    platform: "Intel Xeon Platinum",
    icon: "cpu",
    description:
      "Nền tảng Intel Xeon Platinum cho website, ứng dụng và hệ thống bạn muốn chủ động quản trị.",
    href: "https://interdata.vn/platinum/",
    price: 174000,
    period: "tháng",
    priceNote: "Platinum FPT · Plan 1",
  },
  {
    id: "vps-linux",
    name: "VPS Linux",
    platform: "Hệ điều hành Linux",
    icon: "code",
    description:
      "Môi trường Linux để triển khai website, API và công cụ self-host trên hệ điều hành bạn chọn.",
    href: "https://interdata.vn/vps-linux/",
    price: 95000,
    period: "tháng",
    priceNote: "Linux · Plan 1 · IPv4 Private",
  },
  {
    id: "vps-gold",
    name: "VPS Gold",
    platform: "Intel Xeon Gold",
    icon: "cpu",
    description:
      "Máy chủ ảo dùng Intel Xeon Gold cho website và ứng dụng cần môi trường vận hành riêng.",
    href: "https://interdata.vn/vps-gold-nvme-u2/",
    price: 332000,
    period: "3 tháng",
    priceNote: "VPS Gold · Plan 1 · Thanh toán 3 tháng",
  },
  {
    id: "vps-n8n",
    name: "VPS n8n",
    platform: "Workflow & tự động hóa",
    icon: "network",
    description:
      "Self-host n8n trên VPS để kết nối ứng dụng, xây dựng workflow và quản lý dữ liệu của bạn.",
    href: "https://interdata.vn/vps-n8n/",
    price: 150000,
    period: "tháng",
    priceNote: "Gói tham khảo: VPS AMD · Plan 1",
  },
  {
    id: "vps-vibe-coding",
    name: "VPS Vibe Coding",
    platform: "EzyPlatform & AI",
    icon: "code",
    description:
      "Triển khai ứng dụng phát triển cùng AI trên môi trường VPS tích hợp EzyPlatform.",
    href: "https://interdata.vn/vps-vibe-coding/",
    price: 277000,
    period: "tháng",
    priceNote: "Vibe Basic · Chỉ hỗ trợ mã nguồn EzyPlatform",
  },
];

export const cloudCatalog: CatalogService[] = [
  {
    id: "cloud-amd-gen3",
    name: "AMD Cloud Gen 3",
    platform: "AMD EPYC thế hệ 3",
    icon: "cpu",
    description:
      "Cloud Server trên nền tảng AMD EPYC thế hệ 3, lựa chọn tài nguyên theo nhu cầu website và ứng dụng.",
    href: "https://interdata.vn/amd-epyc-gen3-cloud/",
    price: 165000,
    period: "tháng",
    priceNote: "AMD G3 Cloud · Plan 1",
  },
  {
    id: "cloud-platinum-gen2",
    name: "Intel Platinum Cloud Gen 2",
    platform: "Intel Xeon Platinum thế hệ 2",
    icon: "cpu",
    description:
      "Tài nguyên Cloud Server trên nền tảng Intel Xeon Platinum thế hệ 2 cho ứng dụng và hệ thống doanh nghiệp.",
    href: "https://interdata.vn/intel-platinum-gen2-cloud/",
    price: 150000,
    period: "tháng",
    priceNote: "Platinum G2 Cloud · Plan 1",
  },
];
