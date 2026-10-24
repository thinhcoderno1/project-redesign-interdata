import { withPageSchema } from "@/components/seo/page-schema";
import type { Metadata } from "next";
import { PlatinumPage } from "@/components/vps-platinum/platinum-page";
import { getPlatinumPrices } from "@/lib/vps-platinum-pricing";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "VPS PLATINUM Intel Xeon, SSD NVMe | InterData",
  description:
    "Thuê VPS PLATINUM Intel Xeon, SSD NVMe U.2 Gen 4 và quyền root. So sánh cấu hình FPT, Viettel, Hot Deals và giá theo chu kỳ tại InterData.",
  alternates: { canonical: "https://interdata.vn/vps-platinum/" },
  openGraph: {
    title: "VPS PLATINUM Intel Xeon, SSD NVMe | InterData",
    description:
      "Nền tảng Intel Xeon Platinum cho website và ứng dụng. Xem cấu hình FPT, Viettel và bảng giá VPS PLATINUM tại InterData.",
    url: "https://interdata.vn/vps-platinum/",
    siteName: "InterData",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "https://interdata.vn/images/vps-platinum/hero.webp",
        width: 1672,
        height: 941,
        alt: "Ảnh minh họa hạ tầng máy chủ VPS PLATINUM",
      },
    ],
  },
};

async function Page() {
  const prices = await getPlatinumPrices();
  return <PlatinumPage prices={prices} />;
}

export default withPageSchema(Page, { path: "/vps-platinum/", metadata });
