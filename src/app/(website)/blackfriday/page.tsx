import { withPageSchema } from "@/components/seo/page-schema";
import type { Metadata } from "next";
import { BlackFridayPage } from "@/components/black-friday/black-friday-page";
import { getBlackFridayProducts } from "@/lib/black-friday-pricing";
import { getBlackFridayCoupons } from "@/lib/black-friday-coupons";

export const revalidate = 60;

const title = "Black Friday VPS & Cloud Server 2026 - Tiết Kiệm Đến 75%";
const description =
  "Săn ưu đãi Black Friday 2026 tại InterData: VPS giảm đến 71%, Cloud Server đến 61%. Best Plans đăng ký 3 năm, nhận 4 năm sử dụng. Chọn gói, lấy mã ngay!";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "https://interdata.vn/blackfriday/" },
  openGraph: {
    title,
    description,
    url: "https://interdata.vn/blackfriday/",
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

async function Page() {
  const [vps] = await Promise.allSettled([getBlackFridayProducts()]);
  return (
    <BlackFridayPage
      vps={vps.status === "fulfilled" ? vps.value : []}
      coupons={getBlackFridayCoupons()}
    />
  );
}

export default withPageSchema(Page, { path: "/blackfriday/", metadata });
