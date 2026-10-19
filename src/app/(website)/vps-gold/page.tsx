import type { Metadata } from "next";
import { GoldPage } from "@/components/vps-gold/gold-page";
import { getGoldProducts } from "@/lib/vps-gold-pricing";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "VPS Gold Intel Xeon, SSD NVMe, Cổng Mạng 1Gbps | InterData",
  description:
    "Thuê VPS Gold Intel Xeon, lưu trữ SSD NVMe và quyền root. Đối chiếu cấu hình HCM, Hà Nội, lưu lượng truyền tải và tổng giá theo chu kỳ tại InterData.",
  alternates: { canonical: "https://interdata.vn/vps-gold/" },
  openGraph: {
    title: "VPS Gold Intel Xeon, SSD NVMe | InterData",
    description:
      "Nền tảng Intel Xeon Gold cho website và ứng dụng. Xem cấu hình HCM, Hà Nội, cổng mạng và bảng giá theo chu kỳ tại InterData.",
    url: "https://interdata.vn/vps-gold/",
    siteName: "InterData",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "https://interdata.vn/images/vps-gold/hero.webp",
        width: 1672,
        height: 941,
        alt: "Ảnh minh họa hạ tầng máy chủ VPS Gold Intel Xeon",
      },
    ],
  },
};

export default async function Page() {
  const products = await getGoldProducts().catch(() => null);
  return <GoldPage products={products} />;
}
