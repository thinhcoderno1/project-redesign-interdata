import type { Metadata } from "next";
import {
  BlackFridayCampaign,
  getBlackFridayMetadata,
} from "@/components/black-friday/black-friday-campaign";
import { HomePage } from "@/components/home/home-page";
import { withPageSchema } from "@/components/seo/page-schema";
import { homepageCampaignPath } from "@/data/page-availability";

export const revalidate = 300;

export const metadata: Metadata = {
  alternates: { canonical: "https://interdata.vn/" },
  title: "InterData - VPS, Cloud Server, Domain & Giải Pháp Hạ Tầng",
  description:
    "Tìm hiểu dịch vụ VPS, Cloud Server, thuê máy chủ, chỗ đặt máy chủ và các giải pháp Proxmox, Kubernetes, S3 Storage của InterData.",
  ...(homepageCampaignPath
    ? { openGraph: getBlackFridayMetadata("/").openGraph }
    : {}),
};

const Homepage = homepageCampaignPath ? BlackFridayCampaign : HomePage;

export default withPageSchema(Homepage, { path: "/", metadata });
