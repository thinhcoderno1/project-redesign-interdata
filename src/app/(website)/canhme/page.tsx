import { defaultSocialImage } from "@/lib/social-image";
import { withPageSchema } from "@/components/seo/page-schema";
import type { Metadata } from "next";
import { CanhMePage } from "@/components/canh-me/canh-me-page";
import { deals, GID_ORDER } from "@/components/canh-me/data";
import { fetchAllGroupPricing } from "@/lib/canh-me-pricing";
import {
  getBlackFridayAmdProducts,
  getBlackFridayProducts,
} from "@/lib/black-friday-pricing";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Canh Me - Khuyến Mãi, Siêu Ưu Đãi VPS & Cloud Server",
  description:
    "Canh Me tổng hợp các chương trình khuyến mãi VPS, Cloud Server và Dedicated Server của InterData. So sánh cấu hình, bảng giá và chu kỳ thanh toán.",
  alternates: { canonical: "https://interdata.vn/canhme/" },
  openGraph: {
    images: [defaultSocialImage],
    title: "Canh Me - Khuyến Mãi, Siêu Ưu Đãi VPS & Cloud Server",
    url: "https://interdata.vn/canhme/",
    locale: "vi_VN",
    type: "website",
  },
};

async function Page() {
  const gids = GID_ORDER.filter((gid) =>
    deals.some((deal) => deal.gid === gid && !deal.hidden),
  );
  const [pricingByGid, amdProducts, platinumProducts] = await Promise.all([
    fetchAllGroupPricing(gids),
    getBlackFridayAmdProducts().catch(() => []),
    getBlackFridayProducts().catch(() => []),
  ]);
  return (
    <CanhMePage
      pricingByGid={pricingByGid}
      amdProducts={amdProducts}
      platinumProducts={platinumProducts}
    />
  );
}

export default withPageSchema(Page, { path: "/canhme/", metadata });
