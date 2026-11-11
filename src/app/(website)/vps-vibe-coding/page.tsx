import { defaultSocialImage } from "@/lib/social-image";
import { withPageSchema } from "@/components/seo/page-schema";
import type { Metadata } from "next";
import { VibePage } from "@/components/vps-vibe-coding/vibe-page";
import { getVibePlans } from "@/lib/vps-vibe-coding-pricing";

export const revalidate = 3600;
const title = "VPS Vibe Coding - Tích Hợp EzyPlatform, Deploy 1 Click";
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
    images: [defaultSocialImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [defaultSocialImage.url],
  },
};
async function Page() {
  const plans = await getVibePlans().catch(() => []);
  return <VibePage plans={plans} />;
}

export default withPageSchema(Page, { path: "/vps-vibe-coding/", metadata });
