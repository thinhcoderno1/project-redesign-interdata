import { defaultSocialImage } from "@/lib/social-image";
import { withPageSchema } from "@/components/seo/page-schema";
import type { Metadata } from "next";
import { AboutPage } from "@/components/about/about-page";

export const metadata: Metadata = {
  title: "Giới Thiệu InterData - Đối Tác Hạ Tầng Số Cho Doanh Nghiệp",
  description:
    "Tìm hiểu InterData, thương hiệu thuộc Inter Group: dịch vụ hạ tầng số, con người, văn hóa làm việc và các hoạt động hợp tác, kết nối cộng đồng công nghệ.",
  alternates: { canonical: "https://interdata.vn/gioi-thieu/" },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "InterData",
    title: "Giới Thiệu InterData - Đối Tác Hạ Tầng Số Cho Doanh Nghiệp",
    description:
      "Cùng InterData kết nối công nghệ với nhu cầu thực tế của doanh nghiệp và cộng đồng.",
    url: "https://interdata.vn/gioi-thieu/",
    images: [defaultSocialImage],
  },
};

export default withPageSchema(AboutPage, { path: "/gioi-thieu/", metadata });
