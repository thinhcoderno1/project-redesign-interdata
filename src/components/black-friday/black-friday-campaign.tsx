import type { Metadata } from "next";
import { connection } from "next/server";
import { siteIdentity } from "@/data/site-identity";
import { getBestPlansCatalog } from "@/lib/black-friday-best-plans";
import { getBlackFridayCoupons } from "@/lib/black-friday-coupons";
import { getBlackFridayFlashSaleCheckoutLinks } from "@/lib/black-friday-flash-sale-checkout";
import { BlackFridayPage } from "./black-friday-page";
import { InfoSection } from "./info-section";

export function getBlackFridayMetadata(path: "/" | "/blackfriday/"): Metadata {
  const url = `${siteIdentity.origin}${path}`;
  const title = "Black Friday VPS & Cloud Server 2026 - Tiết Kiệm Đến 75%";
  const description =
    "Best Offers VPS Platinum Tiết Kiệm Đến 80% - AntiDDoS 120Gbps - Mã Giảm VPS / Cloud Đến 81% - Flash Sale 0Đ - Tặng S3 Storage, Nón Sơn & Ly Sứ.";

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
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
}

export async function BlackFridayCampaign() {
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
