import Image from "next/image";
import {
  ArrowRight,
  Building2,
  ClipboardList,
  Gauge,
  Globe2,
  Headphones,
  MapPin,
  Network,
  PlugZap,
  Server,
  ShieldCheck,
  Thermometer,
  type LucideIcon,
} from "lucide-react";
import styles from "@/components/vps/infrastructure.module.css";
import typography from "./colocation.module.css";

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
    id: "rack",
    title: "Không gian ",
    accent: "1U đến 42U",
    text: "Single Server 1U, 2U, 3U hoặc tủ 42U. Đối chiếu kích thước, độ sâu và số lượng thiết bị trước khi bố trí.",
    image: "/images/solutions/server-racks.webp",
    alt: "Minh họa tủ rack và máy chủ",
    benefits: [
      { icon: Server, text: "Theo kích thước rack" },
      { icon: Building2, text: "Tùy chọn tủ riêng" },
      { icon: ClipboardList, text: "Kiểm tra thiết bị" },
    ],
  },
  {
    id: "power",
    title: "Nguồn điện ",
    accent: "& làm mát",
    text: "Single Server công bố Power 750W, tủ 42U là 7200W. Xác nhận công suất thực tế, đầu cấp điện và phương án dự phòng khi đăng ký.",
    image: "/images/vps/infrastructure-v4/datacenter.webp",
    alt: "Minh họa hạ tầng trong datacenter",
    benefits: [
      { icon: PlugZap, text: "Điện theo gói" },
      { icon: Thermometer, text: "Kiểm soát môi trường" },
      { icon: ShieldCheck, text: "Phương án dự phòng" },
    ],
  },
  {
    id: "network",
    title: "Kết nối ",
    accent: "Up to 40 Gbps",
    text: "Các gói công bố không giới hạn băng thông. Tốc độ thực tế tùy cổng, tuyến mạng và tải; xác nhận kết nối và phạm vi Anti DDoS theo phương án.",
    image: "/images/vps/infrastructure-v4/network.webp",
    alt: "Minh họa switch và cáp mạng trong tủ thiết bị",
    benefits: [
      { icon: Gauge, text: "Tốc độ theo phương án" },
      { icon: Network, text: "Kết nối mạng" },
      { icon: Globe2, text: "Đối chiếu tuyến truyền" },
    ],
  },
  {
    id: "location",
    title: "Địa điểm ",
    accent: "Hà Nội & TP.HCM",
    text: "Chọn địa điểm và xác nhận chỗ trống phù hợp với thiết bị. Đặt lịch bàn giao, đăng ký người thao tác và thống nhất phạm vi hỗ trợ kỹ thuật.",
    image: "/images/solutions/datacenter-aisle.webp",
    alt: "Minh họa lối đi giữa các tủ máy chủ",
    benefits: [
      { icon: MapPin, text: "Datacenter Việt Nam" },
      { icon: Headphones, text: "Hỗ trợ 24/7" },
      { icon: ClipboardList, text: "Lịch bàn giao rõ ràng" },
    ],
  },
];

export function ColocationInfrastructure() {
  return (
    <section
      id="nen-tang"
      className={`${styles.section} ${typography.hardware}`}
      aria-labelledby="colocation-infrastructure-title"
    >
      <div className={styles.container}>
        <div className={styles.heading}>
          <span className={styles.eyebrow}>
            <Building2 size={16} aria-hidden="true" />
            Phần cứng và kết nối
          </span>
          <h2 id="colocation-infrastructure-title">
            Hạ Tầng Colocation{" "}
            <span className={styles.accent}>Cho Máy Chủ Của Bạn</span>
          </h2>
          <p>Không gian rack, nguồn điện, làm mát và kết nối tại Việt Nam.</p>
        </div>
        <div className={styles.rows}>
          {features.map((item, index) => (
            <article
              className={styles.row}
              key={item.id}
              aria-labelledby={`colocation-infrastructure-${item.id}`}
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
                  <h3 id={`colocation-infrastructure-${item.id}`}>
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
          <a className={styles.aboutLink} href="#support">
            Tư vấn phương án chỗ đặt
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
