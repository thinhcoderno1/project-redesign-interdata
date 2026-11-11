import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { FloatingContact } from "@/components/layout/floating-contact";
import { defaultSocialImage } from "@/lib/social-image";
import "./fonts.css";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://interdata.vn"),
  title: "InterData — VPS, Cloud Server & Hạ tầng máy chủ",
  description:
    "Tìm hiểu dịch vụ VPS, Cloud Server, thuê máy chủ, chỗ đặt máy chủ và các giải pháp Proxmox, Kubernetes, S3 Storage của InterData.",
  openGraph: { images: [defaultSocialImage] },
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};
export const viewport: Viewport = { themeColor: "#0043EC" };
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body id="dau-trang">
        {children}
        <FloatingContact />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
