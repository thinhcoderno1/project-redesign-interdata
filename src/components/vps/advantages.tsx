import Image from "next/image";
import {
  Crown,
  Gauge,
  ShieldCheck,
  KeyRound,
  Headphones,
  CloudCog,
  Layers3,
  HardDrive,
  Globe2,
  Zap,
} from "lucide-react";
import content from "@/data/vps-content.json";
import styles from "./advantages.module.css";
import { VpsHeroBenefits } from "./hero";

const reasonIcons = [
  Gauge,
  ShieldCheck,
  KeyRound,
  Headphones,
  CloudCog,
  Layers3,
];
const highlights = [
  { icon: HardDrive, value: "NVMe U.2", label: "Lưu trữ Gen 4" },
  { icon: Globe2, value: "99,9%", label: "SLA uptime" },
  { icon: Zap, value: "1–3 phút", label: "Khởi tạo sau thanh toán thành công" },
  { icon: Headphones, value: "24/7", label: "Hỗ trợ kỹ thuật" },
];

export function VpsAdvantages() {
  const header = content.landing.headers.WhyInterData;

  return (
    <section className={styles.advantages} aria-labelledby={header.id}>
      <VpsHeroBenefits />
      <div className={styles.content}>
        <div className={styles.container}>
          <div className={styles.heading}>
            <span className={styles.eyebrow}>
              <Crown size={16} fill="currentColor" aria-hidden="true" />
              LỢI THẾ VƯỢT TRỘI
            </span>
            <h2 id={header.id}>
              Vì Sao Nên Thuê VPS Tại <span>InterData?</span>
            </h2>
            <p>{header.text}</p>
          </div>
          <div className={styles.layout}>
            <div className={styles.visual}>
              <Image
                src="/images/vps/advantages-server-v1.webp"
                alt="Minh họa cụm máy chủ InterData, đám mây và biểu tượng bảo vệ hạ tầng VPS"
                width={1000}
                height={1000}
                sizes="(min-width: 1200px) 410px, (min-width: 900px) 30vw, (min-width: 640px) 300px, 250px"
              />
            </div>
            {content.landing.reasons.map((reason, index) => {
              const Icon = reasonIcons[index];
              return (
                <article className={styles.card} key={reason.title}>
                  <span className={styles.icon}>
                    <Icon size={29} strokeWidth={1.9} aria-hidden="true" />
                  </span>
                  <div>
                    <h3>{reason.title}</h3>
                    <p>{reason.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
          <ul
            className={styles.highlights}
            aria-label="Thông tin nổi bật về VPS InterData"
          >
            {highlights.map(({ icon: Icon, value, label }) => (
              <li key={value}>
                <span className={styles.highlightIcon}>
                  <Icon size={29} strokeWidth={2} aria-hidden="true" />
                </span>
                <div>
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
