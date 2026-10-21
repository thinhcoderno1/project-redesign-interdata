import type { Metadata } from "next";
import { PrivateNetworkPage } from "@/components/private-network/private-network-page";

const title = "Triển Khai Private Network, Mạng Riêng | InterData";
const description =
  "Thiết kế Private Network cho ứng dụng, dữ liệu và hạ tầng doanh nghiệp. Tham khảo phương án mạng nội bộ, phân vùng và kết nối đa điểm tại InterData.";
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "https://interdata.vn/trien-khai-private-network/" },
  openGraph: {
    title,
    description,
    url: "https://interdata.vn/trien-khai-private-network/",
    siteName: "InterData",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "https://interdata.vn/images/home/infrastructure/protection-monitoring.webp",
        width: 1800,
        height: 600,
        alt: "Minh họa thiết bị mạng và hệ thống theo dõi kết nối",
      },
    ],
  },
};
export default function Page() {
  return <PrivateNetworkPage />;
}
