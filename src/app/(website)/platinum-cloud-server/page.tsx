import { defaultSocialImage } from "@/lib/social-image";
import { withPageSchema } from "@/components/seo/page-schema";
import type { Metadata } from "next";
import { PlatinumCloudPage } from "@/components/platinum-cloud-server/platinum-cloud-page";
import { getPlatinumCloudProducts } from "@/lib/platinum-cloud-server-pricing";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Platinum Cloud Server Gen 2, NVMe U.2 | InterData",
  description:
    "Thuê Platinum Cloud Server với Intel Xeon Platinum Gen 2, NVMe U.2 và cổng mạng 10 Gbps. Chọn cấu hình và chu kỳ thanh toán phù hợp tại InterData.",
  alternates: { canonical: "https://interdata.vn/platinum-cloud-server/" },
  openGraph: {
    title: "Platinum Cloud Server Gen 2, NVMe U.2 | InterData",
    description:
      "Cloud Server trên nền tảng Intel Xeon Platinum thế hệ 2. Xem cấu hình vCPU, RAM, NVMe U.2 và bảng giá theo chu kỳ tại InterData.",
    url: "https://interdata.vn/platinum-cloud-server/",
    siteName: "InterData",
    locale: "vi_VN",
    type: "website",
    images: [defaultSocialImage],
  },
};

async function Page() {
  const products = await getPlatinumCloudProducts().catch(() => null);
  return <PlatinumCloudPage products={products} />;
}

export default withPageSchema(Page, {
  path: "/platinum-cloud-server/",
  metadata,
});
