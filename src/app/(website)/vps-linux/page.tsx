import type { Metadata } from "next";
import { LinuxPage } from "@/components/vps-linux/linux-page";
import { getLinuxProducts } from "@/lib/vps-linux-pricing";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "VPS Linux SSD NVMe, Toàn Quyền Root | InterData",
  description:
    "Thuê VPS Linux cho website, API và công cụ self-host. Quản trị qua SSH, toàn quyền root, lưu trữ SSD NVMe và bảng giá theo chu kỳ tại InterData.",
  alternates: { canonical: "https://interdata.vn/vps-linux/" },
  openGraph: {
    title: "VPS Linux SSD NVMe, Toàn Quyền Root | InterData",
    description:
      "Môi trường Linux riêng cho dự án của bạn. Chọn cấu hình vCPU, RAM, SSD NVMe và chu kỳ thanh toán phù hợp tại InterData.",
    url: "https://interdata.vn/vps-linux/",
    siteName: "InterData",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "https://interdata.vn/images/vps-linux/hero.webp",
        width: 1672,
        height: 941,
        alt: "Ảnh minh họa môi trường quản trị máy chủ Linux",
      },
    ],
  },
};

export default async function Page() {
  const products = await getLinuxProducts().catch(() => null);
  return <LinuxPage products={products} />;
}
