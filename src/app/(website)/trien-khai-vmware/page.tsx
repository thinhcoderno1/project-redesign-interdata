import { withPageSchema } from "@/components/seo/page-schema";
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
        url: "https://interdata.vn/images/vmware/hero-vmware-solution-v5.webp",
        width: 1920,
        height: 800,
        alt: "Minh họa vCenter quản trị cụm ESXi chạy máy ảo và lớp lưu trữ vSAN",
      },
    ],
  },
};
function Page() {
  return <VmwarePage />;
}

export default withPageSchema(Page, { path: "/trien-khai-vmware/", metadata });
