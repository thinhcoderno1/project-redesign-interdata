import { withPageSchema } from "@/components/seo/page-schema";
import type { Metadata } from "next";
import { CanhMePage } from "@/components/canh-me/canh-me-page";
import { deals, GID_ORDER } from "@/components/canh-me/data";
import { fetchAllGroupPricing } from "@/lib/canh-me-pricing";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Canh Me — Khuyến mãi VPS & Cloud Server | InterData",
  description:
    "Canh Me tổng hợp các chương trình khuyến mãi VPS, Cloud Server và Dedicated Server của InterData. So sánh cấu hình, bảng giá và chu kỳ thanh toán.",
  alternates: { canonical: "https://interdata.vn/canhme/" },
  openGraph: {
    title: "Canh Me — Khuyến mãi VPS & Cloud Server",
    url: "https://interdata.vn/canhme/",
    locale: "vi_VN",
    type: "website",
  },
};

async function Page() {
  const gids = GID_ORDER.filter((gid) =>
    deals.some((deal) => deal.gid === gid && !deal.hidden),
  );
  return <CanhMePage pricingByGid={await fetchAllGroupPricing(gids)} />;
}

export default withPageSchema(Page, { path: "/canhme/", metadata });
