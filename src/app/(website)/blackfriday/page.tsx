import { withPageSchema } from "@/components/seo/page-schema";
import type { Metadata } from "next";
import { connection } from "next/server";
import { BlackFridayPage } from "@/components/black-friday/black-friday-page";
import { InfoSection } from "@/components/black-friday/info-section";
import { getBestPlansCatalog } from "@/lib/black-friday-best-plans";
import { getBlackFridayCoupons } from "@/lib/black-friday-coupons";
import { getBlackFridayFlashSaleCheckoutLinks } from "@/lib/black-friday-flash-sale-checkout";

const title = "Black Friday VPS & Cloud Server 2026 - Tiết Kiệm Đến 75%";
const description =
  "Best Offers VPS Platinum Tiết Kiệm Đến 80% - AntiDDoS 120Gbps - Mã Giảm VPS / Cloud Đến 81% - Flash Sale 0Đ - Tặng S3 Storage, Nón Sơn & Ly Sứ.";

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
    >
      <InfoSection />
    </BlackFridayPage>
  );
}

export default withPageSchema(Page, { path: "/blackfriday/", metadata });
