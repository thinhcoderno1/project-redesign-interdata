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
import typography from "./dedicated.module.css";

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
    title: "Phần cứng ",
    accent: "dành riêng cho bạn",
    text: "Intel Xeon E5, Gold hoặc Platinum theo gói. Sử dụng toàn bộ CPU và RAM của máy chủ, chủ động cài đặt phần mềm.",
    image: "/images/solutions/server-racks.webp",
    alt: "Minh họa tủ máy chủ vật lý",
    benefits: [
      { icon: Cpu, text: "CPU Intel Xeon" },
      { icon: Server, text: "RAM DDR4 ECC" },
      { icon: Workflow, text: "Toàn quyền quản trị" },
    ],
  },
  {
    id: "storage",
    title: "Lưu trữ ",
    accent: "SSD & RAID 1",
    text: "Hai ổ SSD chạy RAID 1 theo cấu hình. Gói PLUS dùng SSD NVMe. RAID không thay thế sao lưu dữ liệu độc lập.",
    image: "/images/vps/infrastructure-v4/storage.webp",
    alt: "Minh họa ổ SSD và khay lưu trữ máy chủ",
    benefits: [
      { icon: HardDrive, text: "SSD theo cấu hình" },
      { icon: Database, text: "RAID 1" },
      { icon: Layers3, text: "Chủ động sao lưu" },
    ],
  },
  {
    id: "network",
    title: "Đường truyền ",
    accent: "500 Mbps",
    text: "Các gói công bố đường truyền 500 Mbps và lưu lượng không giới hạn theo tháng. Mở rộng tới 40 Gbps cần xác nhận phương án và chi phí.",
    image: "/images/vps/infrastructure-v4/network.webp",
    alt: "Minh họa switch và cáp mạng",
    benefits: [
      { icon: Gauge, text: "500 Mbps theo gói" },
      { icon: Globe2, text: "IPv4 riêng" },
      { icon: Network, text: "Anti DDoS" },
    ],
  },
  {
    id: "location",
    title: "Datacenter ",
    accent: "FPT / Viettel",
    text: "Chọn địa điểm và xác nhận phần cứng sẵn có trước khi đăng ký. Hỗ trợ Remote KVM và tiếp nhận yêu cầu kỹ thuật 24/7.",
    image: "/images/vps/infrastructure-v4/datacenter.webp",
    alt: "Minh họa lối đi giữa các tủ máy chủ",
    benefits: [
      { icon: MapPin, text: "Tại Việt Nam" },
      { icon: Server, text: "Remote KVM" },
      { icon: Network, text: "Hỗ trợ hạ tầng" },
    ],
  },
];

export function DedicatedHardware() {
  return (
    <section
      id="nen-tang"
      className={`${styles.section} ${typography.hardware}`}
      aria-labelledby="dedicated-hardware-title"
    >
      <div className={styles.container}>
        <div className={styles.heading}>
          <span className={styles.eyebrow}>
            <Building2 size={16} aria-hidden="true" />
            Phần cứng và kết nối
          </span>
          <h2 id="dedicated-hardware-title">
            Hạ Tầng Máy Chủ Vật Lý{" "}
            <span className={styles.accent}>Cho Website Và Ứng Dụng</span>
          </h2>
          <p>
            Phần cứng riêng, lưu trữ SSD và kết nối theo nhu cầu triển khai.
          </p>
        </div>
        <div className={styles.rows}>
          {features.map((item, index) => (
            <article
              className={styles.row}
              key={item.id}
              aria-labelledby={`dedicated-hardware-${item.id}`}
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
                  <h3 id={`dedicated-hardware-${item.id}`}>
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
          <a className={styles.aboutLink} href="/lien-he/">
            Trao đổi cấu hình và địa điểm triển khai
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
