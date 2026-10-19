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
    href: "/vps-amd/",
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
    href: "/vps-platinum/",
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
    href: "/vps-linux/",
    price: 95000,
    period: "tháng",
    priceNote: "Linux · Plan 1 · IPv4 theo cấu hình gói",
  },
  {
    id: "vps-gold",
    name: "VPS Gold",
    platform: "Intel Xeon Gold",
    icon: "cpu",
    description:
      "Máy chủ ảo dùng Intel Xeon Gold cho website và ứng dụng cần môi trường vận hành riêng.",
    href: "/vps-gold/",
    price: 332000,
    period: "3 tháng",
    priceNote: "VPS Gold · Plan 1 · Thanh toán 3 tháng",
  },
  {
    id: "vps-n8n",
    name: "VPS n8n",
    platform: "Template n8n & tự động hóa",
    icon: "network",
    description:
      "Self-host n8n với template cài sẵn trên mọi dịch vụ VPS InterData. Kết nối ứng dụng và xây dựng workflow của bạn.",
    href: "/vps-n8n/",
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
    href: "/vps-vibe-coding/",
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
