import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { toolsPageApproved } from "@/data/page-availability";
import { ToolsWorkspace } from "@/components/tools/tools-workspace";
import { withPageSchema } from "@/components/seo/page-schema";
import { defaultSocialImage } from "@/lib/social-image";

export const metadata: Metadata = {
  title: "Công cụ online: Cron, Nginx & Tính cấu hình VPS | InterData",
  robots: { index: toolsPageApproved, follow: toolsPageApproved },
  description:
    "Tạo lịch cron, cấu hình Nginx và ước tính vCPU, RAM, SSD cho VPS. Công cụ miễn phí, có hướng dẫn, xử lý ngay trong trình duyệt, không cần đăng nhập.",
  alternates: { canonical: "https://interdata.vn/cong-cu/" },
  openGraph: {
    title: "Bộ công cụ online miễn phí | InterData",
    description:
      "Cron Job Generator, Nginx Config Generator và công cụ tính cấu hình VPS với các giả định minh bạch.",
    url: "https://interdata.vn/cong-cu/",
    siteName: "InterData",
    locale: "vi_VN",
    type: "website",
    images: [defaultSocialImage],
  },
};

function Page() {
  return <ToolsWorkspace />;
}

const ApprovedToolsPage = withPageSchema(Page, { path: "/cong-cu/", metadata });

export default function ToolsPage() {
  if (!toolsPageApproved) notFound();
  return <ApprovedToolsPage />;
}
