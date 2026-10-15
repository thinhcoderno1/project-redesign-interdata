import content from "./vps-content.json";
import { needs } from "./content";

function serviceUrl(gid: number) {
  const service = content.pricing.services.find((item) => item.gid === gid);
  if (!service) throw new Error(`Missing VPS service URL: ${gid}`);
  return service.href;
}
const automation = needs.find((item) => item.id === "app")!;

/** Curated service chooser; independent from the live pricing groups. */
export const vpsRangeServices = [
  {
    id: "amd",
    name: "AMD",
    label: "AMD EPYC",
    href: serviceUrl(67),
    description:
      "Nền tảng AMD EPYC Gen 2/3 kết hợp NVMe U.2, phù hợp cho website, ứng dụng và cơ sở dữ liệu.",
    features: [
      { icon: "zap", text: "CPU AMD EPYC Gen 2/3" },
      { icon: "chart", text: "Lưu trữ NVMe U.2 Gen 4" },
      { icon: "settings", text: "Website, ứng dụng và database" },
    ],
  },
  {
    id: "platinum",
    name: "Platinum",
    label: "INTEL PLATINUM",
    href: serviceUrl(29),
    description:
      "Dòng VPS sử dụng Intel Platinum Gen 2/3, dành cho website và các hệ thống ứng dụng doanh nghiệp.",
    features: [
      { icon: "gem", text: "Intel Platinum Gen 2/3" },
      { icon: "server", text: "Ổ cứng NVMe U.2 Gen 4" },
      { icon: "shield", text: "SLA uptime 99,9%" },
    ],
  },
  {
    id: "gold",
    name: "Gold",
    label: "INTEL XEON GOLD",
    href: serviceUrl(20),
    description:
      "VPS trên nền Intel Xeon Gold với lưu trữ NVMe U.2. Chọn cấu hình theo ứng dụng và nhu cầu kết nối.",
    features: [
      { icon: "cpu", text: "Nền tảng Intel Xeon Gold" },
      { icon: "database", text: "Lưu trữ NVMe U.2 Gen 4" },
      { icon: "grid", text: "Network Port 1 Gbps" },
    ],
  },
  {
    id: "linux",
    name: "Linux",
    label: "LINUX SERVER",
    href: serviceUrl(3),
    description:
      "Môi trường Linux cho website, API và dịch vụ nền. Chủ động cài đặt phần mềm và cấu hình máy chủ.",
    features: [
      { icon: "terminal", text: "Nhiều lựa chọn bản phân phối Linux" },
      { icon: "settings", text: "Toàn quyền root, tùy chỉnh môi trường" },
      { icon: "shield", text: "Tự cài đặt ứng dụng và dịch vụ" },
    ],
  },
  {
    id: "n8n",
    name: "n8n",
    label: "TỰ ĐỘNG HÓA",
    href: automation.href,
    description:
      "Self-host n8n trên VPS với template tích hợp sẵn. Kết nối ứng dụng và tự động hóa quy trình theo nhu cầu.",
    features: [
      { icon: "zap", text: "Chọn template tích hợp sẵn n8n" },
      { icon: "settings", text: "Kết nối ứng dụng, webhook và API" },
      { icon: "database", text: "Nâng cấp tài nguyên theo workload" },
    ],
  },
  {
    id: "vibe",
    name: "Vibe Coding",
    label: "ỨNG DỤNG EZYPLATFORM",
    href: automation.secondaryHref,
    description:
      "Triển khai ứng dụng xây dựng cùng AI trên EzyPlatform. Chỉ hỗ trợ mã nguồn EzyPlatform.",
    features: [
      { icon: "code", text: "Chỉ hỗ trợ mã nguồn EzyPlatform" },
      { icon: "cpu", text: "Chọn template EzyPlatform khi tạo VPS" },
      { icon: "box", text: "Toàn quyền root, tùy chỉnh môi trường" },
    ],
  },
] as const;
