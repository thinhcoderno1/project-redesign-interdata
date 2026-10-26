import { withPageSchema } from "@/components/seo/page-schema";
import type { Metadata } from "next";
import { BlackFridayPage } from "@/components/black-friday/black-friday-page";
import { getBlackFridayProducts } from "@/lib/black-friday-pricing";
import { getBlackFridayCoupons } from "@/lib/black-friday-coupons";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Black Friday | Ưu đãi VPS & Cloud Server InterData",
  description:
    "Khám phá Black Friday tại InterData. Lựa chọn cấu hình VPS, Cloud Server, khung giờ Flash Sale và ưu đãi theo chu kỳ đăng ký.",
  alternates: { canonical: "https://interdata.vn/black-friday/" },
  openGraph: {
    title: "Black Friday | InterData",
    description: "Nâng cấp hạ tầng. Tối ưu chi phí. Ưu đãi VPS & Cloud Server.",
    url: "https://interdata.vn/black-friday/",
    locale: "vi_VN",
    type: "website",
  },
};

async function Page() {
  const [vps] = await Promise.allSettled([getBlackFridayProducts()]);
  return (
    <BlackFridayPage
      vps={vps.status === "fulfilled" ? vps.value : []}
      coupons={getBlackFridayCoupons()}
    />
  );
}

export default withPageSchema(Page, { path: "/black-friday/", metadata });
