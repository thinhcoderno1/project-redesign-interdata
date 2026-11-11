import { defaultSocialImage } from "@/lib/social-image";
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
    images: [defaultSocialImage],
  },
};
function Page() {
  return <VmwarePage />;
}

export default withPageSchema(Page, { path: "/trien-khai-vmware/", metadata });
