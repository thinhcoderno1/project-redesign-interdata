import type { Metadata } from "next";
import { S3ObjectStoragePage } from "@/components/s3-object-storage/s3-object-storage-page";

const title = "S3 Object Storage – Lưu Trữ Đối Tượng | InterData";
const description =
  "Giải pháp S3 Object Storage cho tệp ứng dụng, hình ảnh, video và bản sao lưu. Chọn phương án theo nhu cầu lưu trữ, tích hợp API và phục hồi cùng InterData.";
const url = "https://interdata.vn/s3-object-storage/";

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
        url: "https://interdata.vn/images/s3-object-storage/hero-object-storage-v1.webp",
        width: 2172,
        height: 724,
        alt: "Minh họa bucket lưu trữ đối tượng kết nối tệp ảnh, video, tài liệu và bản sao lưu",
      },
    ],
  },
};

export default function Page() {
  return <S3ObjectStoragePage />;
}
