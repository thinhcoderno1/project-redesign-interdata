import type { Metadata } from "next";
import { connection } from "next/server";
import { siteIdentity } from "@/data/site-identity";
import {
  getAmdBestPlansCatalog,
  getBestPlansCatalog,
} from "@/lib/black-friday-best-plans";
import { getBlackFridayCoupons } from "@/lib/black-friday-coupons";
import { BlackFridayPage } from "./black-friday-page";
import { InfoSection } from "./info-section";

export function getBlackFridayMetadata(path: "/" | "/blackfriday/"): Metadata {
  const url = `${siteIdentity.origin}${path}`;
  const title = "Black Friday VPS & Cloud Server 2026 - Tiết Kiệm Đến 75%";
  const description =
    "Best Offers VPS Platinum Tiết Kiệm Đến 80% - AntiDDoS 120Gbps - Tặng S3 Storage, Nón Sơn & Ly Sứ.";

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
  const [amdBestPlans, bestPlans] = await Promise.all([
    getAmdBestPlansCatalog(),
    getBestPlansCatalog(),
  ]);
  return (
    <BlackFridayPage
      amdBestPlans={amdBestPlans}
      bestPlans={bestPlans}
      coupons={getBlackFridayCoupons()}
    >
      <InfoSection />
    </BlackFridayPage>
  );
}
