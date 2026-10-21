import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Database,
  Globe2,
  HelpCircle,
  HardDrive,
  Headphones,
  MapPin,
  Network,
  PlugZap,
  Server,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { CompanyProofSections } from "@/components/shared/company-proof-sections";
import { ConsultationCta } from "@/components/home/consultation-cta";
import { ColocationProcess } from "./colocation-process";
import { CapacitySection } from "@/components/home/company-sections";
import { TechnologyPartners } from "@/components/home/technology-partners";
import homeStyles from "@/components/home/home.module.css";
import { ParallaxBackground } from "@/components/ui/parallax-background";
import { colocationFaq } from "@/data/colocation";
import { links } from "@/data/content";
import { ColocationPricing } from "./colocation-pricing";
import { ColocationInfrastructure } from "./colocation-infrastructure";
import styles from "@/components/platinum-cloud-server/platinum-cloud.module.css";
import local from "./colocation.module.css";

const applications: {
  icon: LucideIcon;
  title: string;
  text: string;
  tone: string;
}[] = [
  {
    icon: Server,
    title: "Máy chủ doanh nghiệp",
    text: "Đưa thiết bị đã đầu tư vào datacenter. Chủ động lựa chọn CPU, RAM và ổ đĩa theo hệ thống đang vận hành.",
    tone: "blue",
  },
  {
    icon: Workflow,
    title: "ERP, CRM & Ứng dụng nội bộ",
    text: "Vận hành phần mềm nghiệp vụ trên máy chủ của bạn. Thống nhất kết nối và lịch bảo trì theo hoạt động doanh nghiệp.",
    tone: "green",
  },
  {
    icon: Network,
    title: "Hệ thống nhiều máy chủ",
    text: "Bố trí nhiều thiết bị trong cùng phương án chỗ đặt. Xác nhận không gian rack, nguồn điện và sơ đồ kết nối trước khi triển khai.",
    tone: "red",
  },
  {
    icon: Database,
    title: "Cơ sở dữ liệu riêng",
    text: "Giữ quyền kiểm soát thiết bị và dữ liệu. Tự cấu hình database, phân quyền và giám sát theo nhu cầu ứng dụng.",
    tone: "purple",
  },
  {
    icon: HardDrive,
    title: "Lưu trữ & Sao lưu",
    text: "Đặt thiết bị lưu trữ hoặc máy chủ backup tại datacenter. Chủ động thiết lập lịch sao lưu và kiểm tra khả năng phục hồi.",
    tone: "amber",
  },
  {
    icon: Building2,
    title: "Mở rộng hạ tầng hiện có",
    text: "Chọn chỗ đặt từ Single Server đến tủ rack riêng. Tính trước số thiết bị, công suất và kế hoạch mở rộng.",
    tone: "cyan",
  },
];

export function ColocationPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Thuê Chỗ Đặt Máy Chủ InterData",
    serviceType: "Colocation tại Việt Nam",
    url: "https://interdata.vn/vietnam-colocation/",
    provider: {
      "@type": "Organization",
      name: "InterData",
      url: "https://interdata.vn/",
    },
  };
  return (
    <main id="noi-dung" className={`${styles.page} ${local.page}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <section
        className={`hero-shell ${styles.hero} dark`}
        aria-labelledby="colocation-title"
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
            <span aria-current="page">Thuê Chỗ Đặt Máy Chủ</span>
          </nav>
          <div className={styles.heroGrid}>
            <div className={`hero-content ${styles.heroCopy}`}>
              <span className={styles.darkEyebrow}>
                <Building2 size={16} aria-hidden="true" />
                COLOCATION · HẠ TẦNG CHO MÁY CHỦ CỦA BẠN
              </span>
              <h1 id="colocation-title">
                Thuê Chỗ Đặt <span>Máy Chủ</span>
              </h1>
              <p className={styles.heroSubheadline}>Colocation tại Việt Nam</p>
              <p className={styles.heroDescription}>
                Đặt máy chủ của bạn tại datacenter ở Hà Nội hoặc TP. Hồ Chí
                Minh. Chọn không gian từ 1U đến tủ rack 42U, cùng hạ tầng điện,
                làm mát và kết nối mạng phù hợp với thiết bị.
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
                  Tư vấn chỗ đặt
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
        aria-label="Nền tảng dịch vụ Thuê Chỗ Đặt Máy Chủ"
      >
        <div className={`container ${styles.factGrid}`}>
          {[
            [Server, "1U – 42U", "Không gian theo gói"],
            [PlugZap, "750W / 7200W", "Power theo gói"],
            [MapPin, "Hà Nội · TP.HCM", "Địa điểm cần xác nhận"],
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
      <ColocationPricing />

      <ColocationInfrastructure />

      <section
        id="ung-dung"
        className={`${styles.section} ${styles.applicationsSection}`}
        aria-labelledby="colocation-uses-title"
      >
        <div className="container">
          <div
            className={`${styles.sectionHeading} ${styles.applicationHeading}`}
          >
            <span className={styles.lightEyebrow}>
              <Globe2 size={16} aria-hidden="true" />
              PHÙ HỢP VỚI NHIỀU NHU CẦU
            </span>
            <h2 id="colocation-uses-title">
              <span>Colocation</span> cho hạ tầng của bạn
            </h2>
            <p>
              Bạn sở hữu và quản lý máy chủ. InterData cung cấp chỗ đặt cùng hạ
              tầng datacenter để bạn triển khai hệ thống theo nhu cầu.
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
                  src="/images/services-3d/colocation.webp"
                  alt=""
                  className={local.applicationImage}
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
                    aria-label={`Xem bảng giá Thuê Chỗ Đặt Máy Chủ cho ${title}`}
                  >
                    <ArrowRight size={18} aria-hidden="true" />
                  </a>
                </div>
              </article>
            ))}
          </div>
          <p className={styles.applicationNote}>
            Chưa có thiết bị để đưa vào datacenter?{" "}
            <Link href={links.dedicated}>
              Tham khảo dịch vụ Thuê Máy Chủ{" "}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </p>
        </div>
      </section>

      <ColocationProcess />

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
        aria-labelledby="colocation-faq-title"
      >
        <div className="container">
          <div className={styles.faqHeading}>
            <div className={styles.sectionHeading}>
              <span className={styles.lightEyebrow}>
                <HelpCircle size={16} aria-hidden="true" />
                CÂU HỎI THƯỜNG GẶP
              </span>
              <h2 id="colocation-faq-title">
                Giải đáp thắc mắc về Thuê Chỗ Đặt Máy Chủ
              </h2>
              <p>
                Không gian rack, điện, kết nối và những việc cần chuẩn bị trước
                khi bàn giao thiết bị.
              </p>
            </div>
            <a className="text-link" href={links.ticket}>
              Gửi yêu cầu hỗ trợ <ArrowRight size={17} aria-hidden="true" />
            </a>
          </div>
          <div className={styles.faqList}>
            {colocationFaq.map((item) => (
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
        id="support"
        headingId="colocation-cta-title"
        className={styles.consultationCta}
        eyebrow="KHỞI ĐẦU CÙNG INTERDATA"
        title="Chỗ đặt phù hợp cho máy chủ của bạn."
        description="Gửi số lượng máy chủ, kích thước rack, công suất và địa điểm mong muốn. InterData sẽ cùng bạn xác nhận không gian, kết nối và phương án bàn giao thiết bị."
        image="/images/cta/consultation-woman-upper-body.webp"
        primaryAction={{ label: "Liên hệ tư vấn", href: links.contact }}
        secondaryAction={{
          label: "Hotline 1900 636 822",
          href: "tel:+841900636822",
        }}
      />
    </main>
  );
}
