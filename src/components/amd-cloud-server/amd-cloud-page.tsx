import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Check,
  Code2,
  Cpu,
  Database,
  Globe2,
  HelpCircle,
  HardDrive,
  Headphones,
  KeyRound,
  Network,
  Rocket,
  Server,
  Workflow,
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
  amdCloudFaq,
  amdCloudComparisonRows,
  type AmdCloudProduct,
} from "@/data/amd-cloud-server";
import { links } from "@/data/content";
import { AmdCloudPricing } from "./amd-cloud-pricing";
import styles from "./amd-cloud.module.css";

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

export function AmdCloudPage({
  products,
}: {
  products: AmdCloudProduct[] | null;
}) {
  return (
    <main id="noi-dung" className={styles.page}>
      <section
        className={`hero-shell ${styles.hero} dark`}
        aria-labelledby="amd-cloud-title"
      >
        <ParallaxBackground
          className={`hero-background ${styles.heroBackground}`}
        >
          <Image
            src="/images/amd-cloud-server/hero-epyc-cloud-v1.webp"
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
            <span aria-current="page">AMD Cloud Server</span>
          </nav>
          <div className={styles.heroGrid}>
            <div className={`hero-content ${styles.heroCopy}`}>
              <span className={styles.darkEyebrow}>
                <Cpu size={16} aria-hidden="true" />
                AMD CLOUD SERVER · TOÀN QUYỀN QUẢN TRỊ
              </span>
              <h1 id="amd-cloud-title">
                AMD <span>Cloud Server</span>
              </h1>
              <p className={styles.heroSubheadline}>Nền Tảng AMD EPYC Gen 3</p>
              <p className={styles.heroDescription}>
                Cloud Server sử dụng AMD EPYC thế hệ 3, lưu trữ NVMe U.2 và cổng
                mạng 10 Gbps. Chủ động chọn vCPU, RAM và dung lượng phù hợp để
                vận hành website, API và ứng dụng doanh nghiệp.
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
                src="/images/amd-cloud-server/hero-epyc-cloud-v1.webp"
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
        aria-label="Nền tảng dịch vụ AMD Cloud Server"
      >
        <div className={`container ${styles.factGrid}`}>
          {[
            [Cpu, "AMD EPYC", "Bộ xử lý thế hệ 3"],
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
      <AmdCloudPricing initialProducts={products} />

      <section
        id="nen-tang"
        className={`${styles.performance} dark`}
        aria-labelledby="amd-cloud-hardware-title"
      >
        <div className={styles.performanceArtwork} aria-hidden="true">
          <Image
            src="/images/vps-amd/platform-epyc-7003-amd.webp"
            alt=""
            fill
            sizes="(max-width: 959px) 1px, 60vw"
          />
        </div>
        <div className={styles.performanceOverlay} />
        <div className={`container ${styles.performanceGrid}`}>
          <div className={styles.performanceCopy}>
            <span className={styles.darkEyebrow}>
              <Cpu size={16} aria-hidden="true" />
              AMD EPYC THẾ HỆ 3
            </span>
            <h2 id="amd-cloud-hardware-title">
              AMD EPYC Gen 3
              <br />
              cho ứng dụng của bạn
            </h2>
            <p>
              Nền tảng AMD EPYC 7003 kết hợp lưu trữ NVMe U.2 cho môi trường máy
              chủ riêng. Phân bổ tài nguyên theo nhu cầu xử lý, số kết nối và
              dung lượng dữ liệu của website, API hoặc hệ thống doanh nghiệp.
            </p>
            <dl className={styles.cpuStats}>
              <div>
                <dt>Nền tảng</dt>
                <dd>Gen 3</dd>
              </div>
              <div>
                <dt>Lưu trữ U.2</dt>
                <dd>NVMe</dd>
              </div>
              <div>
                <dt>Cổng mạng</dt>
                <dd>
                  10 <span>Gbps</span>
                </dd>
              </div>
            </dl>
            <p className={styles.performanceNote}>
              Hiệu năng phụ thuộc cấu hình và tải thực tế của ứng dụng. Network
              Port 10 Gbps là thông số cổng mạng; lưu lượng hàng tháng được công
              bố riêng ở từng gói, không đồng nghĩa tốc độ luôn đạt 10 Gbps.
            </p>
            <a
              className="text-link"
              href="https://www.amd.com/en/products/processors/server/epyc/7003-series.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              Tìm hiểu dòng bộ xử lý AMD EPYC 7003{" "}
              <ArrowRight size={17} aria-hidden="true" />
            </a>
          </div>
          <div className={styles.performanceScene} aria-hidden="true">
            <Image
              src="/images/vps-amd/platform-epyc-7003-amd.webp"
              alt=""
              fill
              sizes="(max-width: 959px) 100vw, 1px"
            />
          </div>
          <div className={styles.performanceFeatures}>
            {[
              {
                icon: Cpu,
                title: "AMD EPYC Gen 3",
                text: "Nền tảng CPU cho môi trường Cloud",
              },
              {
                icon: HardDrive,
                title: "Lưu trữ NVMe U.2",
                text: "Chọn dung lượng theo dữ liệu của bạn",
              },
              {
                icon: Network,
                title: "Kết nối minh bạch",
                text: "Kiểm tra cổng mạng và lưu lượng riêng",
              },
              {
                icon: KeyRound,
                title: "Môi trường riêng",
                text: "Tự cài đặt và cấu hình ứng dụng",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title}>
                <Icon size={25} aria-hidden="true" />
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="ung-dung"
        className={`${styles.section} ${styles.applicationsSection}`}
        aria-labelledby="amd-cloud-uses-title"
      >
        <div className="container">
          <div
            className={`${styles.sectionHeading} ${styles.applicationHeading}`}
          >
            <span className={styles.lightEyebrow}>
              <Globe2 size={16} aria-hidden="true" />
              PHÙ HỢP VỚI NHIỀU NHU CẦU
            </span>
            <h2 id="amd-cloud-uses-title">
              <span>AMD Cloud Server</span> cho dự án của bạn
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
                  src="/images/vps-amd/usecase-amd-center-v5.webp"
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
                    aria-label={`Xem bảng giá AMD Cloud Server cho ${title}`}
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

      <section
        id="so-sanh"
        className={`${styles.section} ${styles.comparisonSection}`}
        aria-labelledby="amd-cloud-comparison-title"
      >
        <div className={`container ${styles.comparisonLayout}`}>
          <div className={styles.sectionHeading}>
            <span className={styles.lightEyebrow}>
              <Workflow size={16} aria-hidden="true" />
              CHỌN MÔI TRƯỜNG TRIỂN KHAI
            </span>
            <h2 id="amd-cloud-comparison-title">
              AMD Cloud phù hợp với nhu cầu nào?
            </h2>
            <p>
              Khi website, API hoặc database cần môi trường quản trị riêng, AMD
              Cloud giúp bạn chọn tài nguyên theo ứng dụng. Với website nhỏ và
              nhu cầu cấu hình đơn giản, hãy cân nhắc thêm Shared Hosting.
            </p>
            <Link href={links.cloud} className="text-link">
              Khám phá các dòng Cloud Server{" "}
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <div
            className={styles.tableScroll}
            role="region"
            aria-label="So sánh AMD Cloud Server và Shared Hosting"
            tabIndex={0}
          >
            <table>
              <caption>Chọn môi trường cho website và ứng dụng</caption>
              <thead>
                <tr>
                  <th scope="col">Tiêu chí</th>
                  <th scope="col">AMD Cloud Server</th>
                  <th scope="col">Shared Hosting</th>
                </tr>
              </thead>
              <tbody>
                {amdCloudComparisonRows.map((row) => (
                  <tr key={row.criterion}>
                    <th scope="row">{row.criterion}</th>
                    <td>{row.cloud}</td>
                    <td>{row.hosting}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section
        id="ha-tang-amd-cloud"
        className={`${styles.infrastructure} dark`}
        aria-labelledby="amd-cloud-infrastructure-title"
      >
        <Image
          src="/images/vps/infrastructure-photo-v3/datacenter.webp"
          alt=""
          fill
          sizes="100vw"
          className={styles.backgroundPhoto}
        />
        <div className={styles.infrastructureOverlay} />
        <div className={`container ${styles.infrastructureGrid}`}>
          <div className={styles.infrastructureCopy}>
            <span className={styles.darkEyebrow}>
              <Server size={16} aria-hidden="true" />
              HẠ TẦNG PHÍA SAU DỊCH VỤ
            </span>
            <h2 id="amd-cloud-infrastructure-title">
              Hạ tầng máy chủ
              <br />
              tại Việt Nam
            </h2>
            <p>
              Vận hành ứng dụng trên nền tảng AMD EPYC Gen 3, NVMe U.2 và tài
              nguyên theo cấu hình đăng ký. Xác nhận vị trí triển khai, chính
              sách sao lưu và phạm vi hỗ trợ trước khi đưa hệ thống vào sử dụng.
            </p>
            <ul>
              {[
                "Cấu hình tài nguyên theo gói",
                "Quyền truy cập quản trị riêng",
                "Kế hoạch sao lưu và khôi phục",
                "Hỗ trợ qua cổng khách hàng",
              ].map((text) => (
                <li key={text}>
                  <Check size={17} aria-hidden="true" />
                  {text}
                </li>
              ))}
            </ul>
            <Link href={links.sla} className="text-link">
              Xem cam kết chất lượng dịch vụ{" "}
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <div className={styles.setupPanel}>
            <span className={styles.panelLabel}>
              <Rocket size={16} aria-hidden="true" />
              BẮT ĐẦU VỚI AMD CLOUD SERVER
            </span>
            <h3>Từ cấu hình đến triển khai</h3>
            <ol>
              {[
                {
                  title: "Chọn gói & chu kỳ",
                  text: "Đối chiếu vCPU, RAM, lưu trữ và băng thông với ứng dụng.",
                },
                {
                  title: "Đăng ký & xác nhận",
                  text: "Xác nhận hệ điều hành, vị trí triển khai và các tùy chọn trong đơn hàng.",
                },
                {
                  title: "Nhận Cloud & triển khai",
                  text: "Thiết lập tài khoản quản trị, cập nhật hệ điều hành và triển khai ứng dụng.",
                },
              ].map((item, index) => (
                <li key={item.title}>
                  <span>0{index + 1}</span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className={styles.setupNote}>
              Trước khi chạy chính thức: cập nhật hệ điều hành, cấu hình
              firewall, kiểm tra bản sao lưu và đo thử tải ứng dụng.
            </p>
          </div>
        </div>
        <span className={styles.photoCaption}>Ảnh minh họa datacenter</span>
      </section>
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
        aria-labelledby="amd-cloud-faq-title"
      >
        <div className="container">
          <div className={styles.faqHeading}>
            <div className={styles.sectionHeading}>
              <span className={styles.lightEyebrow}>
                <HelpCircle size={16} aria-hidden="true" />
                CÂU HỎI THƯỜNG GẶP
              </span>
              <h2 id="amd-cloud-faq-title">
                Giải đáp thắc mắc về AMD Cloud Server
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
            {amdCloudFaq.map((item) => (
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
        id="amd-cloud-consultation"
        headingId="amd-cloud-cta-title"
        className={styles.consultationCta}
        eyebrow="KHỞI ĐẦU CÙNG INTERDATA"
        title="AMD Cloud Server phù hợp cho ứng dụng của bạn."
        description="Chia sẻ nhu cầu về website, ứng dụng hoặc hệ thống bạn muốn triển khai. InterData sẽ cùng bạn lựa chọn cấu hình AMD Cloud Server phù hợp với mức tải và ngân sách."
        image="/images/cta/consultation-woman-upper-body.webp"
        primaryAction={{ label: "Xem bảng giá", href: "#bang-gia" }}
        secondaryAction={{ label: "Liên hệ tư vấn", href: links.contact }}
      />
    </main>
  );
}
