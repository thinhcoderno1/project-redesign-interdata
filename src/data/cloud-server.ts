import type { BillingCycle, VpsProduct } from "./vps-pricing";

export type CloudProduct = VpsProduct & { available: boolean };
export type CloudPrices = Record<number, CloudProduct[] | null>;
export const cloudServices = [
  {
    id: "amd",
    gid: 40,
    name: "AMD Gen 3 Cloud",
    label: "AMD Gen 3 Cloud",
    href: "/amd-cloud-server/",
    image: "amd-business-solutions",
    description:
      "Nền tảng AMD EPYC thế hệ 3 kết hợp lưu trữ NVMe U.2. Lựa chọn cấu hình cho website, API và ứng dụng cần xử lý nhiều tác vụ đồng thời.",
  },
  {
    id: "platinum",
    gid: 41,
    name: "Intel Platinum Gen 2 Cloud",
    label: "Intel Platinum Gen 2 Cloud",
    href: "/platinum-cloud-server/",
    image: "intel-business-operations",
    description:
      "Nền tảng Intel Xeon Platinum thế hệ 2 với nhiều mức CPU, RAM và lưu trữ. Phù hợp để xây dựng môi trường riêng cho ứng dụng và hệ thống doanh nghiệp.",
  },
] as const;
export const cloudGids: number[] = cloudServices.map((s) => s.gid);
export const cloudCycles: { key: BillingCycle; label: string }[] = [
  { key: "monthly", label: "1 tháng" },
  { key: "quarterly", label: "3 tháng" },
  { key: "semiannually", label: "6 tháng" },
  { key: "annually", label: "1 năm" },
  { key: "biennially", label: "2 năm" },
  { key: "triennially", label: "3 năm" },
];

export const cloudReasons = [
  {
    title: "CPU hiệu năng cao",
    text: "AMD EPYC Gen 3 và Intel Xeon Platinum Gen 2. Chọn theo yêu cầu ứng dụng, mức tải và ngân sách của dự án.",
  },
  {
    title: "Lưu trữ NVMe U.2",
    text: "Các gói sử dụng NVMe U.2 cho website, ứng dụng và cơ sở dữ liệu. Dung lượng được ghi rõ trong từng cấu hình.",
  },
  {
    title: "Toàn quyền quản trị",
    text: "Chủ động cài đặt web server, database và phần mềm cần thiết. Bạn kiểm soát phân quyền, firewall và môi trường vận hành.",
  },
  {
    title: "Nâng cấp theo nhu cầu",
    text: "Khi cần thêm CPU, RAM hoặc dung lượng, trao đổi với kỹ thuật về phương án nâng cấp và thời gian thực hiện cho gói đang dùng.",
  },
  {
    title: "Network Port 10 Gbps",
    text: "Thông số cổng mạng được công bố theo gói. Tốc độ truyền thực tế còn phụ thuộc tuyến kết nối, điểm đích và tải hệ thống.",
  },
  {
    title: "Hỗ trợ kỹ thuật 24/7",
    text: "Đội ngũ InterData đồng hành khi khởi tạo và vận hành. Các yêu cầu chuyển dữ liệu hoặc cấu hình riêng được xác nhận phạm vi trước.",
  },
];

export const cloudUseCases = [
  {
    image: "web",
    title: "Website & thương mại điện tử",
    text: "Vận hành WordPress, website doanh nghiệp và cửa hàng trực tuyến trên môi trường riêng. Chọn RAM và lưu trữ theo mã nguồn, plugin và dữ liệu thực tế.",
    href: "#pricing",
    action: "Chọn cấu hình cho website",
  },
  {
    image: "api",
    title: "Ứng dụng, API & dịch vụ nội bộ",
    text: "Tự cài đặt runtime, web server và các dịch vụ nền. Phù hợp cho backend, API và công cụ nội bộ cần chủ động môi trường triển khai.",
    href: "#cloud-deployment",
    action: "Xem cách triển khai",
  },
  {
    image: "data",
    title: "Database & môi trường dev/test",
    text: "Tạo môi trường riêng cho dữ liệu, staging và kiểm thử. Dự trù tài nguyên theo số kết nối, tập dữ liệu và yêu cầu sao lưu của dự án.",
    href: "/lien-he/",
    action: "Trao đổi nhu cầu tài nguyên",
  },
];

export const cloudInfrastructure = [
  {
    image: "amd",
    title: "Tài nguyên tính toán cho ứng dụng",
    accent: "AMD EPYC / Intel Xeon",
    text: "Hai dòng Cloud Server giúp bạn chọn nền tảng CPU và cấu hình phù hợp. Với ứng dụng có tải đặc thù, nên thử nghiệm trên workload thực tế trước khi quyết định.",
    features: ["AMD EPYC Gen 3", "Intel Platinum Gen 2", "CPU & RAM theo gói"],
  },
  {
    image: "data",
    title: "Lưu trữ cho website và database",
    accent: "NVMe U.2",
    text: "Dung lượng lưu trữ được công bố theo từng gói, từ mã nguồn đến dữ liệu ứng dụng. Lập kế hoạch backup riêng và kiểm tra khả năng khôi phục định kỳ.",
    features: [
      "Lưu trữ NVMe U.2",
      "Dung lượng theo cấu hình",
      "Chủ động backup dữ liệu",
    ],
  },
  {
    image: "network",
    title: "Kết nối cho hệ thống Cloud Server",
    accent: "Network Port 10 Gbps",
    text: "Phân biệt tốc độ cổng mạng với dung lượng băng thông và tốc độ tải thực tế. Kiểm tra thông số của gói và tuyến kết nối đến người dùng trước khi triển khai.",
    features: [
      "Cổng mạng theo gói",
      "Băng thông công bố rõ",
      "Kiểm tra tuyến kết nối",
    ],
  },
];
