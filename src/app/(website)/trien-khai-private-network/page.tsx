import { defaultSocialImage } from "@/lib/social-image";
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
    images: [defaultSocialImage],
  },
};
function Page() {
  return <PrivateNetworkPage />;
}

export default withPageSchema(Page, {
  path: "/trien-khai-private-network/",
  metadata,
});
