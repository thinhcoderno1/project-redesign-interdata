import { cloudServices } from "./cloud-server";

export const cloudComparisonColumns = cloudServices.map((service) => ({
  key: service.id,
  label: service.name,
  href: service.href,
  description: service.description,
  featured: service.id === "amd",
}));

// Same criteria and order as the VPS comparison. Values are Cloud-specific.
// Sources: official Cloud product pages and packages.php groups 40 / 41.
// No Cloud Ioping result or backup schedule was established by these sources.
export const cloudComparisonRows = [
  { criteria: "Ổ cứng", amd: "NVMe U.2", platinum: "NVMe U.2" },
  {
    criteria: "CPU",
    amd: "AMD EPYC Gen 3",
    platinum: "Intel Xeon Platinum Gen 2",
  },
  {
    criteria: "Ioping Latency",
    amd: "Cần đo trên cấu hình thực tế",
    platinum: "Cần đo trên cấu hình thực tế",
  },
  {
    criteria: "Tốc độ truyền tải",
    amd: "10 Gbps Network Port",
    platinum: "10 Gbps Network Port",
  },
  {
    criteria: "Băng thông hàng tháng",
    amd: "1.000 – 22.000 GB tùy gói",
    platinum: "1.000 – 22.000 GB tùy gói",
  },
  {
    criteria: "IPv4 riêng",
    amd: "01 IPv4 theo cấu hình gói",
    platinum: "01 IPv4 theo gói; kiểm tra riêng gói HN",
  },
  {
    criteria: "Backup định kỳ",
    amd: "Xác nhận lịch và số bản lưu theo gói",
    platinum: "Xác nhận lịch và số bản lưu theo gói",
  },
];

export const cloudComparisonTitle =
  "So Sánh Các Dòng Cloud Server Tại InterData";
export const cloudComparisonNote =
  "Network Port là tốc độ cổng mạng, không phải tốc độ truyền được bảo đảm. Ioping Latency cần đo trên cấu hình thực tế; lịch backup, số bản lưu và IPv4 của gói Platinum HN cần xác nhận theo gói trước khi đăng ký.";
