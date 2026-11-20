import Image from "next/image";
import { ArrowUpRight, Users } from "lucide-react";
import blackFridayStyles from "./black-friday.module.css";
import styles from "./promotion-groups-cta.module.css";

const groups = [
  {
    name: "Zalo",
    href: "https://zalo.me/g/ingoza480",
    src: "/images/black-friday/promotion-zalo-qr.jpg",
    width: 1260,
    height: 1920,
    crop: styles.zalo,
  },
  {
    name: "Telegram",
    href: "https://t.me/interdatavn",
    src: "/images/black-friday/promotion-telegram-qr.jpg",
    width: 1170,
    height: 2532,
    crop: styles.telegram,
  },
];

export function PromotionGroupsCta() {
  return (
    <section
      className={`container ${styles.card}`}
      aria-labelledby="promotion-groups-title"
    >
      <div className={styles.perspective} aria-hidden="true" />
      <div>
        <p className={`${blackFridayStyles.eyebrowBadge} ${styles.eyebrow}`}>
          <Users aria-hidden="true" focusable="false" />
          <span>CỘNG ĐỒNG INTERDATA</span>
        </p>
        <h2 id="promotion-groups-title">
          Tham Gia Nhóm Khuyến Mãi <span>Để Nhận Thông Tin Sớm Nhất!</span>
        </h2>
      </div>
      <div className={styles.groups}>
        {groups.map(({ name, href, src, width, height, crop }) => (
          <a
            className={styles.group}
            key={name}
            href={href}
            aria-label={`Nhóm ${name}`}
          >
            <div className={`${styles.code} ${crop}`}>
              <Image
                src={src}
                width={width}
                height={height}
                alt=""
                unoptimized
              />
            </div>
            <span className={styles.label}>
              {name} <ArrowUpRight size={15} aria-hidden="true" />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
