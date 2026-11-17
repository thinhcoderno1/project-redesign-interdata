import type { Metadata } from "next";
import { SwedDayPage } from "@/components/swed-day/swed-day-page";
import { withPageSchema } from "@/components/seo/page-schema";
import { getSwedDayProducts } from "@/lib/swed-day-pricing";
import { defaultSocialImage } from "@/lib/social-image";

export const revalidate = 60;

const title = "SWED DAY: Deals chồng deals - Tiết kiệm đến 80% | InterData";
const description =
  "Săn Hot Deals VPS vào 10:00–13:00 thứ Tư hằng tuần. Giảm thêm 10%, 15%, 20% cho chu kỳ 1, 2, 3 năm với mã SWED DAY tại InterData. Số lượng có hạn!";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "https://interdata.vn/swed-day/" },
  openGraph: {
    title,
    description,
    url: "https://interdata.vn/swed-day/",
    locale: "vi_VN",
    type: "website",
    images: [defaultSocialImage],
  },
};

async function Page() {
  const [result] = await Promise.allSettled([getSwedDayProducts()]);
  if (result.status === "rejected")
    console.error("SWED DAY pricing:", result.reason);
  return (
    <SwedDayPage products={result.status === "fulfilled" ? result.value : []} />
  );
}

export default withPageSchema(Page, { path: "/swed-day/", metadata });
