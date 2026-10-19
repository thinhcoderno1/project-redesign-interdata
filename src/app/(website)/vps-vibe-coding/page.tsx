import type { Metadata } from "next";
import { VibePage } from "@/components/vps-vibe-coding/vibe-page";
import { getVibePlans } from "@/lib/vps-vibe-coding-pricing";

export const revalidate = 3600;
const title = "Thuê VPS Vibe Coding | Tích Hợp EzyPlatform | 1-Click Deploy";
const description =
  "VPS Vibe Coding tích hợp EzyPlatform với API, MCP, CMS, E-commerce, user và email, giúp AI build, deploy và vận hành trên VPS hiệu năng cao.";
export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "https://interdata.vn/vps-vibe-coding/" },
  openGraph: {
    title,
    description,
    url: "https://interdata.vn/vps-vibe-coding/",
    siteName: "InterData",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "https://interdata.vn/assets/og-images/interdata-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "VPS Vibe Coding tại InterData",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["https://interdata.vn/assets/og-images/interdata-og-image.jpg"],
  },
};
export default async function Page() {
  const plans = await getVibePlans().catch(() => []);
  return <VibePage plans={plans} />;
}
