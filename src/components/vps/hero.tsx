import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChartNoAxesColumnIncreasing,
  Cpu,
  Database,
  Globe2,
  Headphones,
  Layers3,
  MessageCircle,
  Rocket,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import content from "@/data/vps-content.json";
import styles from "./hero.module.css";

const heroText = (tag: string, index = 0) =>
  content.hero.blocks.filter((block) => block.tag === tag)[index].text;

const signals = [
  { icon: Cpu, title: content.hero.ticks[0], text: "AMD EPYC, Intel Xeon" },
  { icon: ShieldCheck, title: content.hero.ticks[2], text: "Vận hành ổn định" },
  {
    icon: Headphones,
    title: content.hero.ticks[3],
    text: "Đồng hành kỹ thuật",
  },
  { icon: Layers3, title: "Dễ dàng nâng cấp", text: "Theo nhu cầu sử dụng" },
];

const visualCards = [
  { icon: Cpu, title: "CPU", text: "AMD EPYC / Intel Xeon", position: "cpu" },
  {
    icon: Database,
    title: "NVMe U.2",
    text: "Lưu trữ tốc độ cao",
    position: "storage",
  },
  {
    icon: Globe2,
    title: "Kết nối ổn định",
    text: "Hạ tầng tại Việt Nam",
    position: "network",
  },
  {
    icon: ShieldCheck,
    title: "Bảo vệ hạ tầng",
    text: "Firewall cơ bản",
    position: "security",
  },
  {
    icon: ChartNoAxesColumnIncreasing,
    title: "Dễ dàng mở rộng",
    text: "Linh hoạt theo nhu cầu",
    position: "scale",
  },
];

const benefits = [
  {
    icon: Rocket,
    title: "Hiệu năng mạnh mẽ",
    text: "CPU đời mới, NVMe U.2 cho website và ứng dụng.",
  },
  {
    icon: ShieldCheck,
    title: "Bảo vệ hạ tầng",
    text: "Firewall cơ bản, sao lưu định kỳ theo gói dịch vụ.",
  },
  {
    icon: Settings,
    title: "Dễ dàng quản trị",
    text: "Toàn quyền root, chủ động cài đặt và cấu hình.",
  },
  {
    icon: Users,
    title: "Phù hợp nhiều nhu cầu",
    text: "Từ website, ứng dụng, bot đến hệ thống doanh nghiệp.",
  },
];

export function VpsHero() {
  return (
    <section className={styles.hero} aria-labelledby="vps-title">
      <div className={`${styles.stage} dark`}>
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
          <div className={styles.visual}>
            <Image
              src="/images/vps/hero-vps-cloud-v2.webp"
              alt="Minh họa máy chủ VPS với đám mây xanh và bệ máy chủ phát sáng"
              width={1536}
              height={1024}
              sizes="(min-width: 1600px) 1040px, (min-width: 1100px) 65vw, (min-width: 768px) 70vw, 100vw"
              loading="eager"
              fetchPriority="high"
              className={styles.serverImage}
            />
            <span className={styles.vpsPanel} aria-hidden="true">
              VPS
            </span>
            {visualCards.map(({ icon: Icon, title, text, position }) => (
              <div
                key={position}
                className={`${styles.visualCard} ${styles[position]}`}
              >
                <Icon size={30} strokeWidth={1.8} aria-hidden="true" />
                <span>
                  <strong>{title}</strong>
                  <small>{text}</small>
                </span>
              </div>
            ))}
          </div>
          <ul className={styles.signals}>
            {signals.map(({ icon: Icon, title, text }) => (
              <li key={title}>
                <Icon size={29} strokeWidth={1.8} aria-hidden="true" />
                <span>
                  <strong>{title}</strong>
                  <small>{text}</small>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.benefitBar}>
        {benefits.map(({ icon: Icon, title, text }) => (
          <div className={styles.benefit} key={title}>
            <span className={styles.benefitIcon}>
              <Icon size={34} strokeWidth={2} aria-hidden="true" />
            </span>
            <div>
              <h2>{title}</h2>
              <p>{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
