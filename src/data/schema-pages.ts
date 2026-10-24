import { services, solutions } from "./content";
import { cloudCatalog, vpsCatalog } from "./service-catalog";
import { legalDocuments } from "./legal-documents";
import vpsContent from "./vps-content.json";
import { cloudServerFaqs } from "./cloud-server-faq";
import { amdFaq } from "./vps-amd";
import { platinumFaq } from "./vps-platinum";
import { linuxFaq } from "./vps-linux";
import { goldFaq } from "./vps-gold";
import { n8nFaq } from "./vps-n8n";
import { amdCloudFaq } from "./amd-cloud-server";
import { platinumCloudFaq } from "./platinum-cloud-server";
import { dedicatedFaq } from "./dedicated-server";
import { colocationFaq } from "./colocation";
import { privateNetworkFaq } from "./private-network";
import { proxmoxCephFaq } from "./proxmox-ceph";
import { kubernetesFaq } from "./kubernetes";
import { vmwareFaq } from "./vmware";
import { s3Faq } from "./s3-object-storage";
import { blackFridayFaqs } from "./black-friday";
import { faqs as vibeFaq } from "../components/vps-vibe-coding/data";
import { faqs as canhMeFaq } from "../components/canh-me/data";
import type { FaqItem, PageProfile } from "../lib/structured-data";

// Use the same collections that render the visible service cards and FAQ.
export const schemaServices = [
  ...services.map((item) => ({ ...item, parent: undefined })),
  ...vpsCatalog.map((item) => ({ ...item, parent: "/thue-vps/" })),
  ...cloudCatalog.map((item) => ({ ...item, parent: "/cloud-server/" })),
  ...solutions.map((item) => ({ ...item, parent: undefined })),
];
const faqByPath: Record<string, readonly FaqItem[]> = {
  "/thue-vps/": vpsContent.faq.items,
  "/cloud-server/": cloudServerFaqs,
  "/vps-amd/": amdFaq,
  "/vps-platinum/": platinumFaq,
  "/vps-linux/": linuxFaq,
  "/vps-gold/": goldFaq,
  "/vps-n8n/": n8nFaq,
  "/vps-vibe-coding/": vibeFaq,
  "/amd-cloud-server/": amdCloudFaq,
  "/platinum-cloud-server/": platinumCloudFaq,
  "/thue-may-chu-vat-ly/": dedicatedFaq,
  "/vietnam-colocation/": colocationFaq,
  "/trien-khai-private-network/": privateNetworkFaq,
  "/trien-khai-proxmox-ceph/": proxmoxCephFaq,
  "/trien-khai-Kubernetes-k8s/": kubernetesFaq,
  "/trien-khai-vmware/": vmwareFaq,
  "/s3-object-storage/": s3Faq,
  "/black-friday/": blackFridayFaqs,
  "/canhme/": canhMeFaq.map(([question, answer]) => ({ question, answer })),
};
const serviceNames: Record<string, string> = {
  "/vps-amd/": "VPS AMD InterData",
  "/vps-platinum/": "VPS PLATINUM InterData",
  "/vps-linux/": "VPS Linux InterData",
  "/vps-gold/": "VPS GOLD InterData",
  "/vps-n8n/": "VPS n8n InterData",
  "/amd-cloud-server/": "AMD Cloud Server InterData",
  "/platinum-cloud-server/": "Platinum Cloud Server InterData",
  "/thue-may-chu-vat-ly/": "Thuê Máy Chủ InterData",
  "/vietnam-colocation/": "Thuê Chỗ Đặt Máy Chủ InterData",
  "/trien-khai-private-network/": "Triển Khai Private Network",
  "/trien-khai-proxmox-ceph/": "Triển Khai Ảo Hóa Proxmox / Ceph",
  "/trien-khai-Kubernetes-k8s/": "Triển Khai Kubernetes (K8s)",
  "/trien-khai-vmware/": "Triển Khai VMware",
  "/s3-object-storage/": "S3 Object Storage",
};
const serviceTypes: Record<string, string> = {
  "/thue-vps/": "Máy chủ ảo VPS",
  "/cloud-server/": "Máy chủ đám mây Cloud Server",
  "/vps-amd/": "Máy chủ ảo VPS AMD",
  "/vps-platinum/": "Máy chủ ảo VPS PLATINUM",
  "/vps-linux/": "Máy chủ ảo VPS Linux",
  "/vps-gold/": "Máy chủ ảo VPS GOLD",
  "/vps-n8n/": "Template hệ điều hành cài sẵn n8n trên VPS",
  "/vps-vibe-coding/": "Dịch vụ VPS cài sẵn nền tảng Vibe Coding",
  "/amd-cloud-server/": "Cloud Server AMD EPYC Gen 3",
  "/platinum-cloud-server/": "Cloud Server Intel Xeon Platinum Gen 2",
  "/thue-may-chu-vat-ly/": "Thuê máy chủ vật lý Dedicated Server",
  "/vietnam-colocation/": "Colocation tại Việt Nam",
  "/trien-khai-private-network/": "Thiết kế và triển khai mạng riêng",
  "/trien-khai-proxmox-ceph/": "Triển khai ảo hóa Proxmox VE và lưu trữ Ceph",
  "/trien-khai-Kubernetes-k8s/": "Thiết kế và triển khai nền tảng Kubernetes",
  "/trien-khai-vmware/": "Thiết kế và triển khai hạ tầng ảo hóa VMware",
  "/s3-object-storage/": "Giải pháp lưu trữ đối tượng tương thích S3 API",
};

export function pageProfile(path: string): PageProfile {
  const item = schemaServices.find((service) => service.href === path);
  if (item)
    return {
      name: item.name,
      service: {
        name: serviceNames[path] || item.name,
        description: item.description,
        serviceType: serviceTypes[path] || item.name,
        parent: item.parent,
      },
      faqs: faqByPath[path],
    };
  const legal = legalDocuments.find(
    (document) => `/${document.slug}/` === path,
  );
  if (legal) return { name: legal.label };
  if (path === "/gioi-thieu/") return { type: "AboutPage", name: "Giới thiệu" };
  if (path === "/lien-he/") return { type: "ContactPage", name: "Liên hệ" };
  if (path === "/chinh-sach-bao-mat/") return { name: "Chính sách bảo mật" };
  if (path === "/canhme/" || path === "/black-friday/")
    return {
      type: "CollectionPage",
      name: path === "/canhme/" ? "Canh Me" : "Black Friday",
      faqs: faqByPath[path],
    };
  return {};
}
