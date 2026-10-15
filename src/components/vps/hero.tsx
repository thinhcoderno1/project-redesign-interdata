import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Activity,
  MessageCircle,
  Rocket,
  Settings,
  Users,
} from "lucide-react";
import content from "@/data/vps-content.json";
import styles from "./hero.module.css";

const heroText = (tag: string, index = 0) =>
  content.hero.blocks.filter((block) => block.tag === tag)[index].text;

const benefits = [
  {
    icon: Rocket,
    title: "Hiệu năng mạnh mẽ",
  },
  {
    icon: Activity,
    title: "Uptime 99.9%",
  },
  {
    icon: Settings,
    title: "Dễ dàng quản trị",
  },
  {
    icon: Users,
    title: "Phù hợp nhiều nhu cầu",
  },
];

export function VpsHero() {
  return (
    <section className={styles.hero} aria-labelledby="vps-title">
      <div className={`${styles.stage} dark`}>
        <Image
          src="/images/vps/hero-datacenter-photo-v3.webp"
          alt=""
          fill
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          className={styles.backgroundImage}
        />
        <div className={styles.container}>
          <nav className={styles.breadcrumb} aria-label="Đường dẫn trang">
            <Link href="/">Trang chủ</Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">{heroText("h1")}</span>
          </nav>
          <div className={styles.copy}>
            <span className={styles.badge}>
              <Rocket size={16} aria-hidden="true" />
              {heroText("p")}
            </span>
            <h1 id="vps-title">
              Thuê VPS{" "}
              <span>
                Hiệu năng cao
                <br /> cho mọi nhu cầu
              </span>
            </h1>
            <p className={styles.description}>{heroText("p", 1)}</p>
            <div className={styles.actions}>
              <a href="#pricing" className={`button ${styles.primary}`}>
                {heroText("a")}
                <ArrowRight size={20} aria-hidden="true" />
              </a>
              <a
                href="https://www.facebook.com/interdata.com.vn/"
                target="_blank"
                rel="noopener noreferrer"
                className={`button ${styles.secondary}`}
              >
                <MessageCircle size={18} aria-hidden="true" />
                {heroText("a", 1)}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function VpsHeroBenefits() {
  return (
    <div
      className={styles.benefitBar}
      role="group"
      aria-label="Lợi ích khi thuê VPS tại InterData"
    >
      {benefits.map(({ icon: Icon, title }) => (
        <div className={styles.benefit} key={title}>
          <span className={styles.benefitIcon}>
            <Icon size={34} strokeWidth={2} aria-hidden="true" />
          </span>
          <h2>{title}</h2>
        </div>
      ))}
    </div>
  );
}
