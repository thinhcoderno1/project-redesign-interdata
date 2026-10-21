import type { Metadata } from "next";
import { DedicatedServerPage } from "@/components/dedicated-server/dedicated-page";
import { getDedicatedProducts } from "@/lib/dedicated-server-pricing";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Thuê Máy Chủ Vật Lý, Dedicated Server Việt Nam | InterData",
  description:
    "Thuê máy chủ vật lý tại Việt Nam với CPU Intel Xeon, RAM DDR4 ECC, SSD RAID 1 và IPv4 riêng. Xem cấu hình, giá và chu kỳ đăng ký tại InterData.",
  alternates: { canonical: "https://interdata.vn/thue-may-chu-vat-ly/" },
  openGraph: {
    title: "Thuê Máy Chủ Vật Lý, Dedicated Server Việt Nam | InterData",
    description:
      "Phần cứng riêng cho website, database, ERP và CRM. Chọn cấu hình Dedicated Server và chu kỳ thanh toán phù hợp.",
    url: "https://interdata.vn/thue-may-chu-vat-ly/",
    siteName: "InterData",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "https://interdata.vn/images/vps/hero-datacenter-photo-v3.webp",
        width: 1672,
        height: 941,
        alt: "Minh họa tủ máy chủ trong datacenter",
      },
    ],
  },
};
export default async function Page() {
  const products = await getDedicatedProducts().catch(() => null);
  return <DedicatedServerPage products={products} />;
}
