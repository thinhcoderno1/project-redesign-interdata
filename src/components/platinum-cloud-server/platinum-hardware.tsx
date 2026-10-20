import Image from "next/image";
import {
  ArrowRight,
  Building2,
  Cpu,
  Database,
  Gauge,
  Globe2,
  HardDrive,
  Layers3,
  MapPin,
  Network,
  Server,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import styles from "@/components/vps/infrastructure.module.css";
import typography from "./platinum-hardware.module.css";

const features: {
  id: string;
  title: string;
  accent: string;
  text: string;
  image: string;
  alt: string;
  benefits: { icon: LucideIcon; text: string }[];
}[] = [
  {
    id: "cpu",
    title: "CPU ",
    accent: "Intel Xeon Platinum Gen 2",
    text: "Tùy chọn vCPU và RAM theo nhu cầu website, API hoặc ứng dụng.",
    image: "/images/vps-platinum/platform.webp",
    alt: "Minh họa chip Intel Xeon Platinum và linh kiện máy chủ",
    benefits: [
      { icon: Cpu, text: "Platinum Gen 2" },
      { icon: Server, text: "vCPU & RAM" },
      { icon: Workflow, text: "Theo tải ứng dụng" },
    ],
  },
  {
    id: "storage",
    title: "Lưu trữ ",
    accent: "NVMe U.2",
    text: "NVMe U.2 cho mã nguồn và dữ liệu, dung lượng theo gói đăng ký.",
    image: "/images/vps/infrastructure-v4/storage.webp",
    alt: "Minh họa ổ SSD U.2 và khay lưu trữ máy chủ",
    benefits: [
      { icon: HardDrive, text: "NVMe U.2" },
      { icon: Database, text: "Website & database" },
      { icon: Layers3, text: "Chủ động sao lưu" },
    ],
  },
  {
    id: "network",
    title: "Kết nối ",
    accent: "Network Port 10 Gbps",
    text: "Cổng mạng 10 Gbps, lưu lượng theo gói. Tốc độ thực tế tùy tuyến kết nối và tải hệ thống.",
    image: "/images/vps/infrastructure-v4/network.webp",
    alt: "Minh họa switch và cáp mạng trong tủ thiết bị",
    benefits: [
      { icon: Gauge, text: "Cổng mạng 10 Gbps" },
      { icon: Network, text: "Lưu lượng theo gói" },
      { icon: Workflow, text: "Kiểm tra tuyến mạng" },
    ],
  },
  {
    id: "location",
    title: "Triển khai tại ",
    accent: "Việt Nam",
    text: "Gói HN đặt tại Hà Nội. Xác nhận địa điểm, IPv4 và tài nguyên khi đăng ký.",
    image: "/images/vps/infrastructure-v4/datacenter.webp",
    alt: "Minh họa lối đi giữa các tủ máy chủ trong datacenter",
    benefits: [
      { icon: MapPin, text: "Địa điểm theo gói" },
      { icon: Globe2, text: "Kiểm tra IPv4" },
      { icon: Network, text: "Tài nguyên theo gói" },
    ],
  },
];

export function PlatinumHardware() {
  return (
    <section
      id="nen-tang"
      className={`${styles.section} ${typography.hardware}`}
      aria-labelledby="platinum-cloud-hardware-title"
    >
      <div className={styles.container}>
        <div className={styles.heading}>
          <span className={styles.eyebrow}>
            <Building2 size={16} aria-hidden="true" />
            Phần cứng và kết nối
          </span>
          <h2 id="platinum-cloud-hardware-title">
            Hạ Tầng Platinum Cloud Server{" "}
            <span className={styles.accent}>Cho Website Và Ứng Dụng</span>
          </h2>
          <p>Intel Xeon Platinum Gen 2, NVMe U.2 và cổng mạng 10 Gbps.</p>
        </div>
        <div className={styles.rows}>
          {features.map((item, index) => (
            <article
              className={styles.row}
              key={item.id}
              aria-labelledby={`platinum-hardware-${item.id}`}
            >
              <div className={styles.copy}>
                <svg
                  className={styles.panel}
                  viewBox="0 0 720 216"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M90 1H703Q719 1 719 17V199Q719 215 703 215H90Q80 215 74 207L8 118Q1 108 8 98L74 9Q80 1 90 1Z"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
                <span className={styles.number} aria-hidden="true">
                  0{index + 1}
                </span>
                <div className={styles.details}>
                  <h3 id={`platinum-hardware-${item.id}`}>
                    {item.title}
                    <span className={styles.accent}>{item.accent}</span>
                  </h3>
                  <p>{item.text}</p>
                  <ul className={styles.benefits}>
                    {item.benefits.map(({ icon: Icon, text }) => (
                      <li key={text}>
                        <span className={styles.benefitIcon}>
                          <Icon
                            size={23}
                            strokeWidth={1.8}
                            aria-hidden="true"
                          />
                        </span>
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <figure className={styles.imageFrame}>
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1384px) 722px, (min-width: 1000px) 56vw, (min-width: 640px) 720px, calc(100vw - 40px)"
                />
              </figure>
            </article>
          ))}
        </div>
        <div className={styles.footer}>
          <a
            className={styles.aboutLink}
            href="https://www.intel.com/content/www/us/en/ark/products/series/192283/2nd-gen-intel-xeon-scalable-processors.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Tìm hiểu Intel Xeon Scalable thế hệ 2
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
