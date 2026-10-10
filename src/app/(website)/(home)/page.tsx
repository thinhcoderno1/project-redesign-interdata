import type { Metadata } from "next";
import { HomePage } from "@/components/home/home-page";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "InterData — VPS, Cloud Server & Hạ tầng máy chủ",
  description:
    "Tìm hiểu dịch vụ VPS, Cloud Server, thuê máy chủ, chỗ đặt máy chủ và các giải pháp Proxmox, Kubernetes, S3 Storage của InterData.",
};

export default HomePage;
