import Image from "next/image";
import {
  ArrowRight,
  Box,
  ChartNoAxesColumnIncreasing,
  Code2,
  Cpu,
  Database,
  Gem,
  LayoutGrid,
  Server,
  Settings,
  ShieldCheck,
  Terminal,
  Zap,
} from "lucide-react";
import { vpsRangeServices } from "@/data/vps-service-range";
import styles from "./service-range.module.css";

const featureIcons = {
  zap: Zap,
  chart: ChartNoAxesColumnIncreasing,
  settings: Settings,
  gem: Gem,
  server: Server,
  shield: ShieldCheck,
  cpu: Cpu,
  database: Database,
  grid: LayoutGrid,
  terminal: Terminal,
  code: Code2,
  box: Box,
};

export function ServiceRange() {
  return (
    <section className={styles.range} aria-labelledby="vps-range-title">
      <div className={styles.container}>
        <div className={styles.heading}>
          <div className={styles.eyebrow}>
            <span>ĐA DẠNG LỰA CHỌN</span>
          </div>
          <h2 id="vps-range-title">
            CÁC DÒNG VPS TẠI <span>INTERDATA</span>
          </h2>
          <p>
            <span>
              Đa dạng cấu hình, phù hợp nhu cầu từ cá nhân, doanh nghiệp đến các
              dự án chuyên biệt.
            </span>
            <span>
              Chọn nền tảng phần cứng và môi trường triển khai theo ứng dụng bạn
              cần.
            </span>
          </p>
        </div>
        <div className={styles.grid}>
          {vpsRangeServices.map((service) => (
            <article
              className={`${styles.card} ${styles[service.id]}`}
              key={service.id}
              data-vps-service={service.id}
            >
              <div className={styles.illustration}>
                <Image
                  src={`/images/vps/range-v3/${service.id}.webp`}
                  alt={`Minh họa VPS ${service.name}`}
                  width={768}
                  height={768}
                  sizes="(min-width: 1200px) 210px, (min-width: 900px) 180px, (min-width: 600px) 150px, 150px"
                />
              </div>
              <div className={styles.cardLead}>
                <span className={styles.label}>{service.label}</span>
                <h3>
                  VPS <span>{service.name}</span>
                </h3>
                <p className={styles.description}>{service.description}</p>
              </div>
              <ul>
                {service.features.map((feature) => {
                  const Icon = featureIcons[feature.icon];
                  return (
                    <li key={feature.text}>
                      <Icon size={19} strokeWidth={2.2} aria-hidden="true" />
                      <span>{feature.text}</span>
                    </li>
                  );
                })}
              </ul>
              <a className={styles.detailLink} href={service.href}>
                Xem chi tiết
                <ArrowRight size={17} aria-hidden="true" />
                <span className={styles.srOnly}> VPS {service.name}</span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
