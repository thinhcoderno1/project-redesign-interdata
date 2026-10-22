import type { Metadata } from "next";
import { BlackFridayPage } from "@/components/black-friday/black-friday-page";
import { getPlatinumProducts } from "@/lib/vps-platinum-pricing";
import { getPlatinumCloudProducts } from "@/lib/platinum-cloud-server-pricing";

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

export default async function Page() {
  const [vps, cloud] = await Promise.allSettled([
    getPlatinumProducts(100),
    getPlatinumCloudProducts(),
  ]);
  return (
    <BlackFridayPage
      vps={vps.status === "fulfilled" ? vps.value.slice(0, 3) : []}
      cloud={
        cloud.status === "fulfilled"
          ? cloud.value.filter((p) => p.available).slice(0, 3)
          : []
      }
    />
  );
}
