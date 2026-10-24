import { withPageSchema } from "@/components/seo/page-schema";
import type { Metadata } from "next";
import { AmdCloudPage } from "@/components/amd-cloud-server/amd-cloud-page";
import { getAmdCloudProducts } from "@/lib/amd-cloud-server-pricing";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "AMD Cloud Server EPYC Gen 3, NVMe U.2 | InterData",
  description:
    "Thuê AMD Cloud Server với AMD EPYC Gen 3, NVMe U.2 và cổng mạng 10 Gbps. Chọn cấu hình và chu kỳ thanh toán phù hợp tại InterData.",
  alternates: { canonical: "https://interdata.vn/amd-cloud-server/" },
  openGraph: {
    title: "AMD Cloud Server EPYC Gen 3, NVMe U.2 | InterData",
    description:
      "Cloud Server trên nền tảng AMD EPYC thế hệ 3. Xem cấu hình vCPU, RAM, NVMe U.2 và bảng giá theo chu kỳ tại InterData.",
    url: "https://interdata.vn/amd-cloud-server/",
    siteName: "InterData",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "https://interdata.vn/images/amd-cloud-server/hero-epyc-cloud-v1.webp",
        width: 1930,
        height: 815,
        alt: "Ảnh minh họa chip AMD EPYC trước cụm máy chủ Cloud",
      },
    ],
  },
};

async function Page() {
  const products = await getAmdCloudProducts().catch(() => null);
  return <AmdCloudPage products={products} />;
}

export default withPageSchema(Page, { path: "/amd-cloud-server/", metadata });
