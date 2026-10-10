import type { Metadata } from "next";
import { AboutPage } from "@/components/about/about-page";

export const metadata: Metadata = {
  title: "Giới thiệu InterData — Con người, hạ tầng & kết nối",
  description:
    "Tìm hiểu InterData, thương hiệu thuộc Inter Group: dịch vụ hạ tầng số, con người, văn hóa làm việc và các hoạt động hợp tác, kết nối cộng đồng công nghệ.",
  alternates: { canonical: "https://interdata.vn/gioi-thieu/" },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "InterData",
    title: "Giới thiệu InterData — Con người, hạ tầng & kết nối",
    description:
      "Cùng InterData kết nối công nghệ với nhu cầu thực tế của doanh nghiệp và cộng đồng.",
    url: "https://interdata.vn/gioi-thieu/",
    images: [
      {
        url: "https://interdata.vn/images/about/workshop-group.webp",
        width: 1600,
        height: 1200,
        alt: "Hoạt động kết nối cộng đồng tại InterData",
      },
    ],
  },
};

export default AboutPage;
