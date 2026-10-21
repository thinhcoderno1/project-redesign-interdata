import type { Metadata } from "next";
import { KubernetesPage } from "@/components/kubernetes/kubernetes-page";

const title = "Triển Khai Kubernetes (K8s) Cho Doanh Nghiệp | InterData";
const description =
  "Thiết kế và triển khai Kubernetes theo nhu cầu ứng dụng. Tham khảo phương án Dev / Staging, Production Cluster và Production HA; liên hệ InterData để tư vấn.";
const url = "https://interdata.vn/trien-khai-Kubernetes-k8s/";
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
        url: "https://interdata.vn/images/kubernetes/hero-kubernetes-v1.webp",
        width: 2160,
        height: 720,
        alt: "Minh họa hạ tầng máy chủ cho cụm Kubernetes",
      },
    ],
  },
};
export default function Page() {
  return <KubernetesPage />;
}
