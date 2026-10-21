import type { Metadata } from "next";
import { VmwarePage } from "@/components/vmware/vmware-page";

const title = "Triển Khai VMware, vSphere & vSAN | InterData";
const description =
  "Thiết kế và triển khai VMware cho hạ tầng doanh nghiệp. Tham khảo phương án vSphere, Cluster HA / vMotion và HCI với vSAN; liên hệ InterData để tư vấn.";
const url = "https://interdata.vn/trien-khai-vmware/";
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: {
    title,
    description,
    url,
    siteName: "InterData",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "https://interdata.vn/images/vmware/hero-vmware-v1.webp",
        width: 2160,
        height: 720,
        alt: "Minh họa hạ tầng máy chủ cho hệ thống ảo hóa VMware",
      },
    ],
  },
};
export default function Page() {
  return <VmwarePage />;
}
