import { withPageSchema } from "@/components/seo/page-schema";
import type { Metadata } from "next";
import { connection } from "next/server";
import { BlackFridayPage } from "@/components/black-friday/black-friday-page";
import { getBestPlansCatalog } from "@/lib/black-friday-best-plans";
import { getBlackFridayCoupons } from "@/lib/black-friday-coupons";
import { getBlackFridayFlashSaleCheckoutLinks } from "@/lib/black-friday-flash-sale-checkout";

const title = "Black Friday VPS & Cloud Server 2026 - Tiết Kiệm Đến 75%";
const description =
  "VPS giảm đến 55%, Cloud Server giảm đến 40% - Ưu đãi VPS Platinum Black Friday - Flash Sale 0đ. Săn Deals Ngay!";

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
  await connection();
  const [bestPlans, flashSaleCheckoutLinks] = await Promise.all([
    getBestPlansCatalog(),
    getBlackFridayFlashSaleCheckoutLinks(),
  ]);
  return (
    <BlackFridayPage
      bestPlans={bestPlans}
      coupons={getBlackFridayCoupons()}
      flashSaleCheckoutLinks={flashSaleCheckoutLinks}
    />
  );
}

export default withPageSchema(Page, { path: "/blackfriday/", metadata });
