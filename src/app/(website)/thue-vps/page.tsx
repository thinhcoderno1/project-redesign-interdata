import { withPageSchema } from "@/components/seo/page-schema";
import type { Metadata } from "next";
import content from "@/data/vps-content.json";
import { getAllVpsPrices } from "@/lib/vps-pricing";
import { VpsPage } from "@/components/vps/vps-page";

export const revalidate = 60;
export const metadata: Metadata = {
  title: content.metadata.title,
  description: content.metadata.description,
  alternates: { canonical: "https://interdata.vn/thue-vps/" },
  openGraph: {
    title: content.metadata.title,
    description: content.metadata.description,
    url: "https://interdata.vn/thue-vps/",
    siteName: "InterData",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "https://interdata.vn/images/vps/assets/images/hero-datacenter.jpg",
        alt: "Thuê VPS Việt Nam tại InterData",
      },
    ],
  },
};

async function Page() {
  return <VpsPage prices={await getAllVpsPrices()} />;
}

export default withPageSchema(Page, { path: "/thue-vps/", metadata });
