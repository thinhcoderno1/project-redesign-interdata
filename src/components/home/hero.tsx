import Image from "next/image";
import {
  Award,
  Headphones,
  Network,
  ShieldCheck,
  ShipWheel,
  X,
} from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { links } from "@/data/content";
import { HeroHeading } from "./hero-heading";
import styles from "./hero.module.css";

// Copy and figures supplied in the user's hero reference.
const benefits = [
  { label: "Hạ tầng Uplink", value: "240Gbps+", icon: Network },
  { label: "Firewall đa lớp", value: "L3-L4-L7-WAF", icon: ShieldCheck },
  { label: "Kinh nghiệm", value: "15 Năm", icon: Award },
  { label: "Hỗ trợ", value: "24/7", icon: Headphones },
] as const;

export function HomeHero() {
  return (
    <section
      className={styles.shell}
      aria-labelledby="hero-title"
      data-home-hero
    >
      <div className={styles.visual}>
        <picture className={styles.picture}>
          <source
            media="(max-width: 639px)"
            type="image/avif"
            srcSet="/images/home/hero-globe-racks-mobile.avif"
          />
          <source
            media="(max-width: 639px)"
            type="image/webp"
            srcSet="/images/home/hero-globe-racks-mobile.webp"
          />
          <source
            type="image/avif"
            srcSet="/images/home/hero-globe-racks-desktop-1400.avif 1400w, /images/home/hero-globe-racks-desktop-1902.avif 1902w"
            sizes="(max-width: 1287px) 1288px, 100vw"
          />
          <Image
            src="/images/home/hero-globe-racks.webp"
            alt=""
            fill
            loading="eager"
            fetchPriority="high"
            quality={82}
            sizes="(max-width: 1287px) 1288px, 100vw"
            className={styles.background}
          />
        </picture>
        <div className={styles.shade} aria-hidden="true" />
        <div className={`${styles.content} container`}>
          <span className={styles.badge}>HẠ TẦNG MẠNH MẼ · BẢO MẬT ĐA LỚP</span>
          <HeroHeading />
          <p className={styles.description}>
            Cloud, máy chủ và giải pháp hạ tầng cho doanh nghiệp.
          </p>
          <div className={styles.actions}>
            <a href={links.trial} className={styles.trial}>
              Dùng thử miễn phí
              <span className={styles.trialIcon}>
                <Icon name="external" />
              </span>
            </a>
            <a href="#ha-tang" className={styles.explore}>
              Khám phá hạ tầng <Icon name="arrow" />
            </a>
          </div>
        </div>
        <div className={`${styles.panels} container`}>
          <div className={`${styles.panel} ${styles.technology}`}>
            <p className={styles.panelLabel}>CLOUD INFRASTRUCTURE</p>
            <ul className={styles.technologies} aria-label="Nền tảng hạ tầng">
              <li>
                <ShipWheel className={styles.kubernetes} aria-hidden="true" />
                <span>Kubernetes</span>
              </li>
              <li>
                <span className={styles.openstack} aria-hidden="true" />
                <span>OpenStack</span>
              </li>
              <li>
                <X className={styles.proxmox} aria-hidden="true" />
                <span>Proxmox</span>
              </li>
              <li className={styles.vmware}>vmware</li>
            </ul>
          </div>
          <div className={`${styles.panel} ${styles.network}`}>
            <p className={styles.panelLabel}>CORE NETWORK</p>
            <p className={styles.networkTitle}>Kết nối. Dự phòng. Bảo vệ.</p>
            <p className={styles.networkDetail}>
              <span aria-hidden="true" />
              Hạ tầng mạng &amp; bảo mật đa lớp
            </p>
          </div>
        </div>
      </div>
      <ul
        className={`${styles.benefits} container`}
        aria-label="Lợi ích hạ tầng InterData"
      >
        {benefits.map(({ label, value, icon: BenefitIcon }) => (
          <li key={label}>
            <span className={styles.benefitIcon}>
              <BenefitIcon size={34} strokeWidth={1.6} aria-hidden="true" />
            </span>
            <div>
              <p className={styles.benefitLabel}>{label}</p>
              <p className={styles.benefitValue}>{value}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
