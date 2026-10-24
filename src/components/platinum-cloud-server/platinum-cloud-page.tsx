import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Code2,
  Cpu,
  Database,
  Globe2,
  HelpCircle,
  HardDrive,
  Headphones,
  KeyRound,
  Network,
  type LucideIcon,
} from "lucide-react";
import { CompanyProofSections } from "@/components/shared/company-proof-sections";
import { ConsultationCta } from "@/components/home/consultation-cta";
import { Environments } from "@/components/vps/environments";
import { CapacitySection } from "@/components/home/company-sections";
import { TechnologyPartners } from "@/components/home/technology-partners";
import homeStyles from "@/components/home/home.module.css";
import { ParallaxBackground } from "@/components/ui/parallax-background";
import {
  platinumCloudFaq,
  type PlatinumCloudProduct,
} from "@/data/platinum-cloud-server";
import { links } from "@/data/content";
import { PlatinumCloudPricing } from "./platinum-cloud-pricing";
import { PlatinumHardware } from "./platinum-hardware";
import styles from "./platinum-cloud.module.css";

const applications: {
  icon: LucideIcon;
  title: string;
  text: string;
  tone: string;
}[] = [
  {
    icon: Globe2,
    title: "Website & Landing Page",
    text: "Triển khai website, WordPress và landing page bán hàng. Chọn cấu hình theo lượng truy cập thực tế.",
    tone: "blue",
  },
  {
    icon: Code2,
    title: "Lập trình & Phát triển",
    text: "Tách môi trường staging, triển khai API và container. Phân bổ vCPU, RAM theo số tác vụ chạy đồng thời.",
    tone: "green",
  },
  {
    icon: KeyRound,
    title: "Quản trị & Vận hành",
    text: "Chủ động cài đặt dịch vụ, quản lý tài khoản và theo dõi log trên môi trường Cloud riêng của bạn.",
    tone: "red",
  },
  {
    icon: Database,
    title: "Ứng dụng & Cơ sở dữ liệu",
    text: "Vận hành CRM, ERP và database trên môi trường riêng. Chọn RAM theo dữ liệu, vCPU theo mức truy vấn thực tế.",
    tone: "purple",
  },
  {
    icon: Bot,
    title: "Automation & AI Agent",
    text: "Self-host n8n, chạy workflow và AI Agent kết nối mô hình qua API. Chọn RAM theo số tác vụ chạy đồng thời.",
    tone: "amber",
  },
  {
    icon: HardDrive,
    title: "Lưu trữ & Sao lưu dữ liệu",
    text: "Chọn dung lượng NVMe U.2 theo dữ liệu phát sinh. Thiết lập bản sao độc lập và kiểm tra khả năng khôi phục.",
    tone: "cyan",
  },
];

export function PlatinumCloudPage({
  products,
}: {
  products: PlatinumCloudProduct[] | null;
}) {
  return (
    <main id="noi-dung" className={styles.page}>
      <section
        className={`hero-shell ${styles.hero} dark`}
        aria-labelledby="platinum-cloud-title"
      >
        <ParallaxBackground
          className={`hero-background ${styles.heroBackground}`}
        >
          <Image
            src="/images/platinum-cloud-server/hero-xeon-cloud-v1.webp"
            alt=""
            fill
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
            className={styles.backgroundPhoto}
          />
        </ParallaxBackground>
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroContainer}`}>
          <nav className={styles.breadcrumb} aria-label="Đường dẫn trang">
            <Link href="/">Trang chủ</Link>
            <span aria-hidden="true">/</span>
            <Link href="/cloud-server/">Cloud Server</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Platinum Cloud Server</span>
          </nav>
          <div className={styles.heroGrid}>
            <div className={`hero-content ${styles.heroCopy}`}>
              <span className={styles.darkEyebrow}>
                <Cpu size={16} aria-hidden="true" />
                PLATINUM CLOUD SERVER · TOÀN QUYỀN QUẢN TRỊ
              </span>
              <h1 id="platinum-cloud-title">
                Platinum <span>Cloud Server</span>
              </h1>
              <p className={styles.heroSubheadline}>
                Intel Xeon Platinum Gen 2
              </p>
              <p className={styles.heroDescription}>
                Cloud Server sử dụng Intel Xeon Platinum thế hệ 2, NVMe U.2 và
                cổng mạng 10 Gbps. Chủ động chọn vCPU, RAM và dung lượng phù hợp
                để vận hành website, API và ứng dụng doanh nghiệp.
              </p>
              <div className={styles.actions}>
                <a
                  href="#bang-gia"
                  className={`button ${styles.heroTrialButton}`}
                >
                  <span className={styles.heroTrialIcon} aria-hidden="true">
                    <ArrowUpRight size={20} strokeWidth={1.8} />
                  </span>
                  <span>Xem bảng giá</span>
                </a>
                <Link
                  href={links.contact}
                  className={`button ${styles.darkButton}`}
                >
                  Tư vấn cấu hình
                </Link>
              </div>
            </div>
            <div className={styles.heroScene} aria-hidden="true">
              <Image
                src="/images/platinum-cloud-server/hero-xeon-cloud-v1.webp"
                alt=""
                fill
                sizes="(max-width: 639px) 100vw, 1px"
              />
            </div>
          </div>
        </div>
      </section>
      <div
        className={styles.factStrip}
        aria-label="Nền tảng dịch vụ Platinum Cloud Server"
      >
        <div className={`container ${styles.factGrid}`}>
          {[
            [Cpu, "Intel Xeon", "Platinum thế hệ 2"],
            [HardDrive, "NVMe U.2", "Lưu trữ theo cấu hình"],
            [Network, "10 Gbps", "Cổng mạng theo gói"],
            [Headphones, "Ticket", "Kênh hỗ trợ kỹ thuật"],
          ].map(([icon, value, text]) => {
            const Icon = icon as LucideIcon;
            return (
              <div key={String(value)}>
                <Icon size={28} aria-hidden="true" />
                <div>
                  <strong>{String(value)}</strong>
                  <span>{String(text)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <PlatinumCloudPricing initialProducts={products} />

      <PlatinumHardware />

      <section
        id="ung-dung"
        className={`${styles.section} ${styles.applicationsSection}`}
        aria-labelledby="platinum-cloud-uses-title"
      >
        <div className="container">
          <div
            className={`${styles.sectionHeading} ${styles.applicationHeading}`}
          >
            <span className={styles.lightEyebrow}>
              <Globe2 size={16} aria-hidden="true" />
              PHÙ HỢP VỚI NHIỀU NHU CẦU
            </span>
            <h2 id="platinum-cloud-uses-title">
              <span>Platinum Cloud Server</span> cho dự án của bạn
            </h2>
            <p>
              Từ website, ứng dụng doanh nghiệp đến automation. Chọn môi trường
              và tài nguyên phù hợp với dự án của bạn.
            </p>
          </div>
          <div className={styles.applicationGrid}>
            <div className={styles.applicationCenter} aria-hidden="true">
              <svg
                className={styles.applicationConnections}
                viewBox="0 0 280 660"
                preserveAspectRatio="none"
              >
                <path d="M0 110 H28 Q44 110 44 126 V270 Q44 330 140 330 M0 330 H140 M0 550 H28 Q44 550 44 534 V390 Q44 330 140 330 M280 110 H252 Q236 110 236 126 V270 Q236 330 140 330 M280 330 H140 M280 550 H252 Q236 550 236 534 V390 Q236 330 140 330" />
              </svg>
              <div className={styles.applicationCenterImage}>
                <Image
                  src="/images/platinum-cloud-server/usecase-platinum-center-v1.webp"
                  alt=""
                  fill
                  sizes="(max-width: 639px) 260px, (max-width: 1199px) 300px, 480px"
                />
              </div>
            </div>
            {applications.map(({ icon: Icon, title, text, tone }, index) => (
              <article
                className={styles.applicationCard}
                key={title}
                data-side={index < 3 ? "left" : "right"}
                data-row={(index % 3) + 1}
                data-tone={tone}
              >
                <div className={styles.applicationBody}>
                  <div className={styles.applicationTitle}>
                    <span className={styles.applicationIcon}>
                      <Icon size={24} aria-hidden="true" />
                    </span>
                    <h3>{title}</h3>
                  </div>
                  <p>{text}</p>
                  <a
                    href="#bang-gia"
                    className={styles.applicationArrow}
                    aria-label={`Xem bảng giá Platinum Cloud Server cho ${title}`}
                  >
                    <ArrowRight size={18} aria-hidden="true" />
                  </a>
                </div>
              </article>
            ))}
          </div>
          <p className={styles.applicationNote}>
            Cần GPU, phần mềm đặc thù hoặc tài nguyên vật lý riêng?{" "}
            <Link href={links.contact}>
              Trao đổi yêu cầu trước khi chọn gói{" "}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </p>
        </div>
      </section>

      <Environments className={styles.environments} />

      <div className={`${homeStyles.home} ${styles.companySection}`}>
        <CapacitySection withBadgeIcons />
      </div>
      <CompanyProofSections withBadgeIcons />
      <div className={`${homeStyles.home} ${styles.companySection}`}>
        <TechnologyPartners withBadgeIcons />
      </div>
      <section
        id="cau-hoi"
        className={styles.section}
        aria-labelledby="platinum-cloud-faq-title"
      >
        <div className="container">
          <div className={styles.faqHeading}>
            <div className={styles.sectionHeading}>
              <span className={styles.lightEyebrow}>
                <HelpCircle size={16} aria-hidden="true" />
                CÂU HỎI THƯỜNG GẶP
              </span>
              <h2 id="platinum-cloud-faq-title">
                Giải đáp thắc mắc về Platinum Cloud Server
              </h2>
              <p>
                Cấu hình, quyền quản trị và những điều cần kiểm tra trước khi
                triển khai.
              </p>
            </div>
            <a className="text-link" href={links.ticket}>
              Gửi yêu cầu hỗ trợ <ArrowRight size={17} aria-hidden="true" />
            </a>
          </div>
          <div className={styles.faqList}>
            {platinumCloudFaq.map((item) => (
              <details key={item.question}>
                <summary>
                  {item.question}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <ConsultationCta
        id="platinum-cloud-consultation"
        headingId="platinum-cloud-cta-title"
        className={styles.consultationCta}
        eyebrow="KHỞI ĐẦU CÙNG INTERDATA"
        title="Platinum Cloud Server phù hợp cho ứng dụng của bạn."
        description="Chia sẻ nhu cầu về website, ứng dụng hoặc hệ thống bạn muốn triển khai. InterData sẽ cùng bạn lựa chọn cấu hình Platinum Cloud Server phù hợp với mức tải và ngân sách."
        image="/images/cta/consultation-woman-upper-body.webp"
        primaryAction={{ label: "Xem bảng giá", href: "#bang-gia" }}
        secondaryAction={{ label: "Liên hệ tư vấn", href: links.contact }}
      />
    </main>
  );
}
