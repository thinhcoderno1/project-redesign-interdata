import type { Metadata, Viewport } from "next";
import "./fonts.css";
import "./globals.css";
export const metadata: Metadata = {
  title: "InterData — VPS, Cloud Server & Hạ tầng máy chủ",
  description:
    "Tìm hiểu dịch vụ VPS, Cloud Server, thuê máy chủ, chỗ đặt máy chủ và các giải pháp Proxmox, Kubernetes, S3 Storage của InterData.",
  robots: { index: false, follow: false },
};
export const viewport: Viewport = { themeColor: "#0043EC" };
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
