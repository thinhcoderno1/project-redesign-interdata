import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
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
import { DedicatedEnvironments } from "./dedicated-environments";
import { CapacitySection } from "@/components/home/company-sections";
import { TechnologyPartners } from "@/components/home/technology-partners";
import homeStyles from "@/components/home/home.module.css";
import { ParallaxBackground } from "@/components/ui/parallax-background";
import { dedicatedFaq, type DedicatedProduct } from "@/data/dedicated-server";
import { links } from "@/data/content";
import { DedicatedPricing } from "./dedicated-pricing";
import { DedicatedHardware } from "./dedicated-hardware";
import styles from "@/components/platinum-cloud-server/platinum-cloud.module.css";
import dedicatedStyles from "./dedicated.module.css";

const applications: {
  icon: LucideIcon;
  title: string;
  text: string;
  tone: string;
}[] = [
  {
    icon: Globe2,
    title: "Website & Thương mại điện tử",
    text: "Vận hành website traffic lớn và cửa hàng trực tuyến. Chọn CPU, RAM theo lượng truy cập và số phiên đồng thời.",
    tone: "blue",
  },
  {
    icon: Code2,
    title: "API & Hệ thống ứng dụng",
    text: "Triển khai API, backend và container trên phần cứng riêng. Chủ động phân bổ tài nguyên cho từng dịch vụ.",
    tone: "green",
  },
  {
    icon: KeyRound,
    title: "ERP, CRM & Cổng nội bộ",
    text: "Tập trung ứng dụng nghiệp vụ trên máy chủ riêng. Thiết lập phân quyền truy cập và lịch bảo trì theo hoạt động doanh nghiệp.",
    tone: "red",
  },
  {
    icon: Database,
    title: "Cơ sở dữ liệu",
    text: "Dành RAM cho bộ nhớ đệm và SSD cho dữ liệu. Chọn cấu hình theo dung lượng, số truy vấn và mức đọc ghi thực tế.",
    tone: "purple",
  },
  {
    icon: Cpu,
    title: "Xử lý dữ liệu & Tác vụ nền",
    text: "Chạy báo cáo, tác vụ hàng đợi và xử lý theo lô. Đối chiếu số nhân CPU với phần mềm và thời gian xử lý yêu cầu.",
    tone: "amber",
  },
  {
    icon: HardDrive,
    title: "Lưu trữ dữ liệu nghiệp vụ",
    text: "Lưu trữ file và dữ liệu nội bộ theo dung lượng đã chọn. RAID hỗ trợ dự phòng ổ đĩa; vẫn cần bản sao lưu độc lập.",
    tone: "cyan",
  },
];

export function DedicatedServerPage({
  products,
}: {
  products: DedicatedProduct[] | null;
}) {
  return (
    <main id="noi-dung" className={`${styles.page} ${dedicatedStyles.page}`}>
      <section
        className={`hero-shell ${styles.hero} dark`}
        aria-labelledby="dedicated-title"
      >
        <ParallaxBackground
          className={`hero-background ${styles.heroBackground}`}
        >
          <Image
            src="/images/vps/hero-datacenter-photo-v3.webp"
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
            <span aria-current="page">Thuê Máy Chủ</span>
          </nav>
          <div className={styles.heroGrid}>
            <div className={`hero-content ${styles.heroCopy}`}>
              <span className={styles.darkEyebrow}>
                <Cpu size={16} aria-hidden="true" />
                DEDICATED SERVER · PHẦN CỨNG RIÊNG
              </span>
              <h1 id="dedicated-title">
                Thuê <span>Máy Chủ</span>
              </h1>
              <p className={styles.heroSubheadline}>
                Máy chủ vật lý riêng tại Việt Nam
              </p>
              <p className={styles.heroDescription}>
                Toàn bộ CPU, RAM và ổ cứng dành riêng cho hệ thống của bạn.
                Triển khai website traffic lớn, database, ERP và CRM với máy chủ
                Intel Xeon, SSD RAID 1, IPv4 riêng và toàn quyền quản trị.
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
                src="/images/vps/hero-datacenter-photo-v3.webp"
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
        aria-label="Nền tảng dịch vụ Thuê Máy Chủ"
      >
        <div className={`container ${styles.factGrid}`}>
          {[
            [Cpu, "Intel Xeon", "CPU vật lý riêng"],
            [HardDrive, "SSD · RAID 1", "Dung lượng theo gói"],
            [Network, "500 Mbps", "Mở rộng theo yêu cầu"],
            [Headphones, "Hỗ trợ 24/7", "Kênh ticket kỹ thuật"],
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
      <DedicatedPricing initialProducts={products} />

      <DedicatedHardware />

      <section
        id="ung-dung"
        className={`${styles.section} ${styles.applicationsSection}`}
        aria-labelledby="dedicated-uses-title"
      >
        <div className="container">
          <div
            className={`${styles.sectionHeading} ${styles.applicationHeading}`}
          >
            <span className={styles.lightEyebrow}>
              <Globe2 size={16} aria-hidden="true" />
              PHÙ HỢP VỚI NHIỀU NHU CẦU
            </span>
            <h2 id="dedicated-uses-title">
              <span>Máy chủ riêng</span> cho hệ thống của bạn
            </h2>
            <p>
              Dành cho hệ thống cần tài nguyên vật lý riêng, quyền quản trị sâu
              và cấu hình theo nhu cầu vận hành thực tế.
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
                  src="/images/services-3d/dedicated.webp"
                  alt=""
                  className={dedicatedStyles.applicationImage}
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
                    aria-label={`Xem bảng giá Thuê Máy Chủ cho ${title}`}
                  >
                    <ArrowRight size={18} aria-hidden="true" />
                  </a>
                </div>
              </article>
            ))}
          </div>
          <p className={styles.applicationNote}>
            Cần thêm RAM, ổ cứng, IPv4 hoặc băng thông?{" "}
            <Link href={links.contact}>
              Trao đổi yêu cầu trước khi chọn gói{" "}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </p>
        </div>
      </section>

      <DedicatedEnvironments />

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
        aria-labelledby="dedicated-faq-title"
      >
        <div className="container">
          <div className={styles.faqHeading}>
            <div className={styles.sectionHeading}>
              <span className={styles.lightEyebrow}>
                <HelpCircle size={16} aria-hidden="true" />
                CÂU HỎI THƯỜNG GẶP
              </span>
              <h2 id="dedicated-faq-title">
                Giải đáp thắc mắc về Thuê Máy Chủ
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
            {dedicatedFaq.map((item) => (
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
        id="dedicated-consultation"
        headingId="dedicated-cta-title"
        className={styles.consultationCta}
        eyebrow="KHỞI ĐẦU CÙNG INTERDATA"
        title="Chọn máy chủ riêng cho hệ thống của bạn."
        description="Chia sẻ nhu cầu về website, ứng dụng hoặc hệ thống bạn muốn triển khai. InterData sẽ cùng bạn lựa chọn cấu hình máy chủ vật lý phù hợp với mức tải và ngân sách."
        image="/images/cta/consultation-woman-upper-body.webp"
        primaryAction={{ label: "Xem bảng giá", href: "#bang-gia" }}
        secondaryAction={{ label: "Liên hệ tư vấn", href: links.contact }}
      />
    </main>
  );
}
