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
import content from "@/data/vps-content.json";
import styles from "./infrastructure.module.css";

const visuals: {
  name: string;
  alt: string;
  accent: string;
  benefits: { icon: LucideIcon; text: string }[];
}[] = [
  {
    name: "cpu",
    alt: "Minh họa hệ thống CPU, tản nhiệt và RAM bên trong máy chủ rack",
    accent: "máy chủ đời mới",
    benefits: [
      { icon: Cpu, text: "AMD EPYC" },
      { icon: Server, text: "Intel Xeon" },
      { icon: Workflow, text: "Đa dạng workload" },
    ],
  },
  {
    name: "storage",
    alt: "Minh họa ổ SSD U.2 và khay lưu trữ máy chủ theo phong cách nhiếp ảnh",
    accent: "U.2 Gen 4",
    benefits: [
      { icon: HardDrive, text: "NVMe U.2 Gen 4" },
      { icon: Layers3, text: "Lưu trữ doanh nghiệp" },
      { icon: Database, text: "Website & database" },
    ],
  },
  {
    name: "network",
    alt: "Minh họa switch và cáp Ethernet được bố trí gọn gàng trong tủ mạng",
    accent: "đến 1 Gbps",
    benefits: [
      { icon: Gauge, text: "Kết nối đến 1 Gbps" },
      { icon: Network, text: "Chọn Network Port" },
      { icon: Workflow, text: "Theo tải ứng dụng" },
    ],
  },
  {
    name: "datacenter",
    alt: "Minh họa lối đi giữa các tủ máy chủ theo phong cách nhiếp ảnh",
    accent: "Việt Nam",
    benefits: [
      { icon: MapPin, text: "Hạ tầng trong nước" },
      { icon: Globe2, text: "Người dùng Việt Nam" },
      { icon: Network, text: "Đường truyền ngắn hơn" },
    ],
  },
];

export function Infrastructure() {
  const header = content.landing.headers.Infrastructure;
  const headingSplit = header.title.indexOf("Cho");
  return (
    <section className={styles.section} aria-labelledby={header.id}>
      <div className={styles.container}>
        <div className={styles.heading}>
          <span className={styles.eyebrow}>
            <Building2 size={16} aria-hidden="true" />
            {header.eyebrow}
          </span>
          <h2 id={header.id}>
            {header.title.slice(0, headingSplit)}
            <span className={styles.accent}>
              {header.title.slice(headingSplit)}
            </span>
          </h2>
          <p>{header.text}</p>
        </div>
        <div className={styles.rows}>
          {content.landing.infrastructure.map((item, index) => (
            <article
              className={styles.row}
              key={item.title}
              aria-labelledby={`vps-infrastructure-${visuals[index].name}`}
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
                  <h3 id={`vps-infrastructure-${visuals[index].name}`}>
                    {item.title.slice(0, -visuals[index].accent.length)}
                    <span className={styles.accent}>
                      {visuals[index].accent}
                    </span>
                  </h3>
                  <p>{item.text}</p>
                  <ul className={styles.benefits}>
                    {visuals[index].benefits.map(({ icon: Icon, text }) => (
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
                  src={`/images/vps/infrastructure-v4/${visuals[index].name}.webp`}
                  alt={visuals[index].alt}
                  fill
                  sizes="(min-width: 1384px) 722px, (min-width: 1000px) 56vw, (min-width: 640px) 720px, calc(100vw - 40px)"
                />
              </figure>
            </article>
          ))}
        </div>
        <div className={styles.footer}>
          <a className={styles.aboutLink} href="/gioi-thieu/">
            Tìm hiểu InterData <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
