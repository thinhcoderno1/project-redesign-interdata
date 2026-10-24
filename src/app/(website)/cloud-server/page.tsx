import { withPageSchema } from "@/components/seo/page-schema";
import type { Metadata } from "next";
import { CloudServerPage } from "@/components/cloud-server/cloud-server-page";
import { getCloudPrices } from "@/lib/cloud-server-pricing";

export const revalidate = 60;
const title = "Cloud Server – AMD EPYC Gen 3 & Intel Platinum | InterData";
const description =
  "Thuê Cloud Server InterData với AMD EPYC Gen 3, Intel Xeon Platinum Gen 2, NVMe U.2 và Network Port 10 Gbps. Xem cấu hình, bảng giá và tư vấn triển khai.";
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "https://interdata.vn/cloud-server/" },
  openGraph: {
    title,
    description,
    url: "https://interdata.vn/cloud-server/",
    siteName: "InterData",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "https://interdata.vn/images/cloud-server/hero.webp",
        width: 1672,
        height: 941,
        alt: "Minh họa hạ tầng Cloud Server",
      },
    ],
  },
};
async function Page() {
  return <CloudServerPage prices={await getCloudPrices()} />;
}

export default withPageSchema(Page, { path: "/cloud-server/", metadata });
