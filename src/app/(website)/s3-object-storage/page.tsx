import { defaultSocialImage } from "@/lib/social-image";
import { withPageSchema } from "@/components/seo/page-schema";
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
    images: [defaultSocialImage],
  },
};

function Page() {
  return <S3ObjectStoragePage />;
}

export default withPageSchema(Page, { path: "/s3-object-storage/", metadata });
