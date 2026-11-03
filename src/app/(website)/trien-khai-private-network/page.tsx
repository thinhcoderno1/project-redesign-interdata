import { withPageSchema } from "@/components/seo/page-schema";
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
        url: "https://interdata.vn/images/private-network/hero-private-network-v2.webp",
        width: 1920,
        height: 800,
        alt: "Minh họa switch mạng riêng kết nối máy chủ trong các phân vùng VLAN",
      },
    ],
  },
};
function Page() {
  return <PrivateNetworkPage />;
}

export default withPageSchema(Page, {
  path: "/trien-khai-private-network/",
  metadata,
});
