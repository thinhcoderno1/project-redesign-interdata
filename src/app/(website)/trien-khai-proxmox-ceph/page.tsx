import { withPageSchema } from "@/components/seo/page-schema";
import type { Metadata } from "next";
import { ProxmoxCephPage } from "@/components/proxmox-ceph/proxmox-ceph-page";

const title = "Triển Khai Ảo Hóa Proxmox / Ceph | InterData";
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
    images: [
      {
        url: "https://interdata.vn/images/proxmox-ceph/hero-proxmox-ceph-v1.webp",
        width: 2160,
        height: 720,
        alt: "Minh họa cụm máy chủ trong trung tâm dữ liệu",
      },
    ],
  },
};
function Page() {
  return <ProxmoxCephPage />;
}

export default withPageSchema(Page, {
  path: "/trien-khai-proxmox-ceph/",
  metadata,
});
