import type { Metadata } from "next";
import { ContactPage } from "@/components/contact/contact-page";

export const metadata: Metadata = {
  title: "Liên hệ InterData — Tư vấn dịch vụ & hỗ trợ",
  description:
    "Kết nối InterData qua hotline, email, Zalo hoặc Facebook. Xem địa chỉ văn phòng, Google Maps và soạn yêu cầu tư vấn dịch vụ hạ tầng.",
  alternates: { canonical: "https://interdata.vn/lien-he/" },
  openGraph: {
    title: "Liên hệ InterData — Tư vấn dịch vụ & hỗ trợ",
    description:
      "Trao đổi nhu cầu hạ tầng, kết nối đội ngũ InterData và tìm đường đến văn phòng.",
    url: "https://interdata.vn/lien-he/",
    siteName: "InterData",
    locale: "vi_VN",
    type: "website",
  },
};

export default function Page() {
  return <ContactPage />;
}
