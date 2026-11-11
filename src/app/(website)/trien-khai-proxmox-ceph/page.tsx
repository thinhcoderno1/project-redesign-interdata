import { defaultSocialImage } from "@/lib/social-image";
import { withPageSchema } from "@/components/seo/page-schema";
import type { Metadata } from "next";
import { ProxmoxCephPage } from "@/components/proxmox-ceph/proxmox-ceph-page";

const title = "Triển Khai Proxmox & Ceph - Ảo Hóa, Lưu Trữ Linh Hoạt";
const description =
  "Triển khai Proxmox VE, Cluster HA và lưu trữ Ceph cho hạ tầng doanh nghiệp. Tham khảo mô hình ảo hóa, quy trình và liên hệ tư vấn tại InterData.";
const url = "https://interdata.vn/trien-khai-proxmox-ceph/";
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
  return <ProxmoxCephPage />;
}

export default withPageSchema(Page, {
  path: "/trien-khai-proxmox-ceph/",
  metadata,
});
