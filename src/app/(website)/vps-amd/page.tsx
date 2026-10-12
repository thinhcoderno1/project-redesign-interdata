import type { Metadata } from "next";
import { AmdPage } from "@/components/vps-amd/amd-page";
import { getAmdProducts } from "@/lib/vps-amd-pricing";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "VPS AMD EPYC SSD NVMe Gen 4 | InterData",
  description:
    "Thuê VPS AMD tại InterData với nền tảng AMD EPYC, SSD NVMe Gen 4 và quyền root. Xem cấu hình, bảng giá theo chu kỳ và chọn gói cho website, ứng dụng.",
  alternates: { canonical: "https://interdata.vn/vps-amd/" },
  openGraph: {
    title: "VPS AMD EPYC SSD NVMe Gen 4 | InterData",
    description:
      "Nền tảng AMD EPYC. Tài nguyên cho website và ứng dụng của bạn. Xem cấu hình và bảng giá VPS AMD tại InterData.",
    url: "https://interdata.vn/vps-amd/",
    siteName: "InterData",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "https://interdata.vn/images/vps-amd/epyc.webp",
        width: 1920,
        height: 1280,
        alt: "Minh họa CPU AMD EPYC",
      },
    ],
  },
};

export default async function Page() {
  const products = await getAmdProducts().catch(() => null);
  return <AmdPage products={products} />;
}
