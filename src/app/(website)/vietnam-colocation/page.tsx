import type { Metadata } from "next";
import { ColocationPage } from "@/components/colocation/colocation-page";

const title = "Thuê Chỗ Đặt Máy Chủ, Colocation Việt Nam | InterData";
const description =
  "Thuê chỗ đặt máy chủ tại Hà Nội và TP.HCM. Chọn Single Server 1U, 2U, 3U hoặc tủ rack 42U, xem giá và tư vấn điện, kết nối tại InterData.";
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "https://interdata.vn/vietnam-colocation/" },
  openGraph: {
    title,
    description,
    url: "https://interdata.vn/vietnam-colocation/",
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
export default function Page() {
  return <ColocationPage />;
}
