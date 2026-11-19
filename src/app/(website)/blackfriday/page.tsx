import { withPageSchema } from "@/components/seo/page-schema";
import type { Metadata } from "next";
import { BlackFridayPage } from "@/components/black-friday/black-friday-page";
import { getBlackFridayProducts } from "@/lib/black-friday-pricing";
import { getBlackFridayCoupons } from "@/lib/black-friday-coupons";

export const revalidate = 60;

const title = "Black Friday VPS & Cloud Server 2026 - Tiết Kiệm Đến 75%";
const description =
  "VPS giảm đến 55%, Cloud Server giảm đến 40% - VPS Platinum Từ 62K/Tháng - Flash Sale 0đ - Tặng S3 Storage 200GB. Săn Deals Ngay!";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "https://interdata.vn/blackfriday/" },
  openGraph: {
    title,
    description,
    url: "https://interdata.vn/blackfriday/",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "/images/black-friday/og-image.png",
        width: 1733,
        height: 908,
        alt: title,
      },
    ],
  },
};

async function Page() {
  const [vps] = await Promise.allSettled([getBlackFridayProducts()]);
  return (
    <BlackFridayPage
      vps={vps.status === "fulfilled" ? vps.value : []}
      coupons={getBlackFridayCoupons()}
    />
  );
}

export default withPageSchema(Page, { path: "/blackfriday/", metadata });
