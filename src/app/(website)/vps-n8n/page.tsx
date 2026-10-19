import type { Metadata } from "next";
import { N8nPage } from "@/components/vps-n8n/n8n-page";
import { getN8nPrices } from "@/lib/vps-n8n-pricing";
export const revalidate = 60;
export const metadata: Metadata = {
  title: "VPS n8n – Template Cài Sẵn, Tự Host Dễ Dàng | InterData",
  description:
    "Self-host n8n với template hệ điều hành cài sẵn trên tất cả dịch vụ VPS InterData. Chọn VPS GOLD, AMD, PLATINUM hoặc Linux và xem giá theo chu kỳ.",
  alternates: { canonical: "https://interdata.vn/vps-n8n/" },
  openGraph: {
    title: "VPS n8n – Template Cài Sẵn | InterData",
    description:
      "Chọn dịch vụ VPS phù hợp và triển khai n8n bằng template có sẵn. Chủ động xây dựng workflow trên hạ tầng của bạn.",
    url: "https://interdata.vn/vps-n8n/",
    siteName: "InterData",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "https://interdata.vn/images/vps-n8n/hero-v2.webp",
        width: 1672,
        height: 941,
        alt: "Minh họa workflow n8n trên hạ tầng VPS",
      },
    ],
  },
};
export default async function Page() {
  return <N8nPage prices={await getN8nPrices()} />;
}
