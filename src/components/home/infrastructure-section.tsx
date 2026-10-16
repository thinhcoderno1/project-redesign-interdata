import Image from "next/image";
import {
  infrastructure,
  links,
  reviewMode,
  showEditorialNotes,
} from "@/data/content";
import { Icon } from "@/components/ui/icon";
import { ClaimNote } from "./claim-note";
import layout from "@/components/vps/infrastructure.module.css";
import styles from "./infrastructure-section.module.css";

const visuals: Record<string, { src: string; alt: string }> = {
  building: {
    src: "/images/vps/infrastructure-v4/datacenter.webp",
    alt: "Minh họa lối đi giữa các tủ máy chủ trong datacenter",
  },
  cpu: {
    src: "/images/vps/infrastructure-v4/cpu.webp",
    alt: "Minh họa CPU, tản nhiệt và RAM bên trong máy chủ rack",
  },
  network: {
    src: "/images/vps/infrastructure-v4/network.webp",
    alt: "Minh họa switch và cáp Ethernet trong tủ mạng",
  },
  shield: {
    src: "/images/home/infrastructure/protection-monitoring.webp",
    alt: "Minh họa thiết bị bảo mật mạng và màn hình giám sát trong tủ máy chủ",
  },
};

export function HomeInfrastructure() {
  const items = infrastructure.filter(
    (item) => reviewMode || item.status === "approved",
  );

  return (
    <section
      id="ha-tang"
      className={`${layout.section} ${styles.section} dark`}
      aria-labelledby="home-infrastructure-title"
    >
      <div className={layout.container}>
        <div className={layout.heading}>
          <span className={`${layout.eyebrow} ${styles.eyebrow}`}>
            <Icon name="building" /> NỀN TẢNG PHÍA SAU DỊCH VỤ
          </span>
          <h2 id="home-infrastructure-title">
            Hạ tầng được lựa chọn
            <br />
            <span className={layout.accent}>cho từng hệ thống</span>
          </h2>
        </div>
        <div className={layout.rows}>
          {items.map((item, index) => (
            <article
              key={item.name}
              className={layout.row}
              aria-labelledby={`home-infrastructure-${item.icon}`}
            >
              <div className={layout.copy}>
                <svg
                  className={layout.panel}
                  viewBox="0 0 720 216"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M90 1H703Q719 1 719 17V199Q719 215 703 215H90Q80 215 74 207L8 118Q1 108 8 98L74 9Q80 1 90 1Z"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
                <span className={layout.number} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className={layout.details}>
                  <div className={styles.itemHeading}>
                    <span className={layout.benefitIcon} aria-hidden="true">
                      <Icon name={item.icon} />
                    </span>
                    <h3 id={`home-infrastructure-${item.icon}`}>{item.name}</h3>
                  </div>
                  <p>{item.detail}</p>
                </div>
              </div>
              <figure className={layout.imageFrame}>
                <Image
                  src={visuals[item.icon].src}
                  alt={visuals[item.icon].alt}
                  fill
                  sizes="(min-width: 1384px) 722px, (min-width: 1000px) 56vw, (min-width: 640px) 720px, calc(100vw - 40px)"
                />
              </figure>
            </article>
          ))}
        </div>
        <div className={`${layout.footer} ${styles.footer}`}>
          <ClaimNote />
          <a className={layout.aboutLink} href={links.contact}>
            Trao đổi yêu cầu kỹ thuật <Icon name="arrow" />
          </a>
        </div>
        {showEditorialNotes && (
          <p className={styles.photoCredit}>
            Ảnh minh họa hạ tầng được tạo bằng AI.
          </p>
        )}
      </div>
    </section>
  );
}
