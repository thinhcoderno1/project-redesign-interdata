import { defaultSocialImage } from "@/lib/social-image";
import { withPageSchema } from "@/components/seo/page-schema";
import type { Metadata } from "next";
import { N8nPage } from "@/components/vps-n8n/n8n-page";
import { getN8nPrices } from "@/lib/vps-n8n-pricing";
export const revalidate = 60;
export const metadata: Metadata = {
  title: "VPS n8n Cài Sẵn - Tự Động Hóa Workflow, Chủ Động Dữ Liệu",
  description:
    "Self-host n8n với template hệ điều hành cài sẵn trên tất cả dịch vụ VPS InterData. Chọn VPS GOLD, AMD, PLATINUM hoặc Linux và xem giá theo chu kỳ.",
  alternates: { canonical: "https://interdata.vn/vps-n8n/" },
  openGraph: {
    title: "VPS n8n Cài Sẵn - Tự Động Hóa Workflow, Chủ Động Dữ Liệu",
    description:
      "Chọn dịch vụ VPS phù hợp và triển khai n8n bằng template có sẵn. Chủ động xây dựng workflow trên hạ tầng của bạn.",
    url: "https://interdata.vn/vps-n8n/",
    siteName: "InterData",
    locale: "vi_VN",
    type: "website",
    images: [defaultSocialImage],
  },
};
async function Page() {
  return <N8nPage prices={await getN8nPrices()} />;
}

export default withPageSchema(Page, { path: "/vps-n8n/", metadata });
