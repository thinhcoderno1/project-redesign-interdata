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
  HardDrive,
  Headphones,
  KeyRound,
  Network,
  Video,
  type LucideIcon,
} from "lucide-react";
import { CustomerProof } from "@/components/shared/customer-proof";
import { ParallaxBackground } from "@/components/ui/parallax-background";
import { amdFaq } from "@/data/vps-amd";
import { links } from "@/data/content";
import vpsContent from "@/data/vps-content.json";
import type { VpsProduct } from "@/data/vps-pricing";
import { AmdPricing } from "./amd-pricing";
import styles from "./amd.module.css";

const applications: {
  icon: LucideIcon;
  title: string;
  text: string;
  image: string;
  tone: string;
}[] = [
  {
    icon: Globe2,
    title: "Website & Landing Page",
    text: "Triển khai website, WordPress và landing page bán hàng. Chọn cấu hình theo lượng truy cập thực tế.",
    image: "/images/vps-amd/usecase-website-v4.webp",
    tone: "blue",
  },
  {
    icon: Code2,
    title: "Lập trình & Phát triển",
    text: "Triển khai API, container hoặc staging; chủ động cấu hình runtime và dịch vụ.",
    image: "/images/vps-amd/usecase-development-v4.webp",
    tone: "green",
  },
  {
    icon: Video,
    title: "Streaming & Media",
    text: "Chạy dịch vụ media và phân phối nội dung. Đối chiếu băng thông, lưu trữ và mức tải trước khi triển khai.",
    image: "/images/vps-amd/usecase-media-v4.webp",
    tone: "red",
  },
  {
    icon: Database,
    title: "Ứng dụng & Cơ sở dữ liệu",
    text: "Vận hành CRM, ERP, API và database. Chọn RAM, vCPU và lưu trữ theo dữ liệu và mức truy vấn.",
    image: "/images/vps-amd/usecase-database-v4.webp",
    tone: "purple",
  },
  {
    icon: Bot,
    title: "AI Agent",
    text: "Chạy AI Agent, workflow và tác vụ nền; kết nối mô hình qua API, quản lý công cụ và lịch thực thi.",
    image: "/images/vps-amd/usecase-agent-v4.webp",
    tone: "amber",
  },
  {
    icon: HardDrive,
    title: "Lưu trữ & Sao lưu dữ liệu",
    text: "Tổ chức kho dữ liệu và tác vụ backup. Lập lịch sao lưu, theo dõi dung lượng và kiểm tra khôi phục.",
    image: "/images/vps-amd/usecase-backup-v4.webp",
    tone: "cyan",
  },
];

export function AmdPage({ products }: { products: VpsProduct[] | null }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "VPS AMD InterData",
    serviceType: "Máy chủ ảo VPS AMD",
    url: "https://interdata.vn/vps-amd/",
    provider: {
      "@type": "Organization",
      name: "InterData",
      url: "https://interdata.vn/",
    },
  };
  return (
    <main id="noi-dung" className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <section
        className={`hero-shell ${styles.hero} dark`}
        aria-labelledby="amd-title"
      >
        <ParallaxBackground
          className={`hero-background ${styles.heroBackground}`}
        >
          <Image
            src="/images/vps-amd/hero-enterprise-epyc-v3.webp"
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
            <Link href="/thue-vps/">Thuê VPS</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">VPS AMD</span>
          </nav>
          <div className={styles.heroGrid}>
            <div className={`hero-content ${styles.heroCopy}`}>
              <span className={styles.darkEyebrow}>
                VPS AMD · NỀN TẢNG EPYC
              </span>
              <h1 id="amd-title">
                VPS <span>AMD EPYC</span>
              </h1>
              <p className={styles.heroSubheadline}>Hiệu Suất Bứt Phá</p>
              <p className={styles.heroDescription}>
                Tài nguyên riêng cho website, ứng dụng và hệ thống của bạn. Chọn
                cấu hình phù hợp, chủ động môi trường triển khai và quản trị
                VPS.
              </p>
              <div className={styles.actions}>
                <a
                  href="#bang-gia"
                  className={`button ${styles.heroTrialButton}`}
                >
                  <span className={styles.heroTrialIcon} aria-hidden="true">
                    <ArrowUpRight size={20} strokeWidth={1.8} />
                  </span>
                  <span>Dùng thử miễn phí</span>
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
                src="/images/vps-amd/hero-enterprise-epyc-v3.webp"
                alt=""
                fill
                sizes="(max-width: 639px) 100vw, 1px"
              />
            </div>
          </div>
        </div>
      </section>
      <div className={styles.factStrip} aria-label="Nền tảng dịch vụ VPS AMD">
        <div className={`container ${styles.factGrid}`}>
          {[
            [Cpu, "AMD EPYC", "Nền tảng xử lý"],
            [HardDrive, "NVMe Gen 4", "Lưu trữ SSD"],
            [KeyRound, "Full root", "Quyền quản trị VPS"],
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
      <AmdPricing initialProducts={products} />

      <section
        id="nen-tang"
        className={`${styles.performance} dark`}
        aria-labelledby="amd-hardware-title"
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
            <span className={styles.darkEyebrow}>NỀN TẢNG XỬ LÝ</span>
            <h2 id="amd-hardware-title">
              CPU AMD EPYC
              <br />
              cho môi trường của bạn
            </h2>
            <p>
              EPYC 7763 là CPU dành cho máy chủ, với 64 nhân, 128 luồng và hỗ
              trợ PCIe 4.0. VPS được cấp số vCPU, RAM và lưu trữ theo từng gói.
            </p>
            <dl className={styles.cpuStats}>
              <div>
                <dt>Nhân vật lý</dt>
                <dd>64</dd>
              </div>
              <div>
                <dt>Luồng xử lý</dt>
                <dd>128</dd>
              </div>
              <div>
                <dt>Boost tối đa</dt>
                <dd>
                  3,5 <span>GHz</span>
                </dd>
              </div>
            </dl>
            <p className={styles.performanceNote}>
              Thông số CPU vật lý EPYC 7763, không phải tài nguyên của mỗi VPS.
              Model CPU thực tế cần được xác nhận theo gói khi đăng ký.
            </p>
            <a
              className="text-link"
              href="https://www.amd.com/en/products/processors/server/epyc/7003-series/amd-epyc-7763.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              Thông số từ AMD <ArrowRight size={17} aria-hidden="true" />
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
                title: "PCIe 4.0",
                text: "Chuẩn kết nối của CPU EPYC 7763",
              },
              {
                icon: HardDrive,
                title: "Lưu trữ NVMe",
                text: "Dung lượng SSD được ghi rõ theo gói",
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
        aria-labelledby="amd-uses-title"
      >
        <div className="container">
          <div
            className={`${styles.sectionHeading} ${styles.applicationHeading}`}
          >
            <span className={styles.lightEyebrow}>
              PHÙ HỢP VỚI NHIỀU NHU CẦU
            </span>
            <h2 id="amd-uses-title">
              <span>VPS AMD</span> phù hợp cho mọi nhu cầu
            </h2>
            <p>
              Từ website, ứng dụng đến AI Agent. Chọn môi trường triển khai và
              tài nguyên phù hợp với dự án của bạn.
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
            {applications.map(
              ({ icon: Icon, title, text, image, tone }, index) => (
                <article
                  className={styles.applicationCard}
                  key={title}
                  data-side={index < 3 ? "left" : "right"}
                  data-row={(index % 3) + 1}
                  data-tone={tone}
                >
                  <div className={styles.applicationImage}>
                    <Image
                      src={image}
                      alt={`Minh họa ${title}`}
                      fill
                      sizes="(max-width: 639px) 120px, (max-width: 959px) 150px, 110px"
                    />
                  </div>
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
                      aria-label={`Xem bảng giá VPS AMD cho ${title}`}
                    >
                      <ArrowRight size={18} aria-hidden="true" />
                    </a>
                  </div>
                </article>
              ),
            )}
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

      <section
        id="so-sanh"
        className={`${styles.section} ${styles.comparisonSection}`}
        aria-labelledby="amd-comparison-title"
      >
        <div className={`container ${styles.comparisonLayout}`}>
          <div className={styles.sectionHeading}>
            <span className={styles.lightEyebrow}>
              CHỌN MÔI TRƯỜNG TRIỂN KHAI
            </span>
            <h2 id="amd-comparison-title">Khi nào nên chọn VPS AMD?</h2>
            <p>
              Khi ứng dụng cần tài nguyên được phân bổ riêng và quyền tùy chỉnh
              hệ điều hành. Nếu chỉ cần website nhỏ với ít yêu cầu cấu hình,
              Shared Hosting cũng là lựa chọn để cân nhắc.
            </p>
            <Link href={links.vps} className="text-link">
              Tìm hiểu thêm về các dòng VPS{" "}
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <div
            className={styles.tableScroll}
            role="region"
            aria-label="So sánh VPS và Shared Hosting"
            tabIndex={0}
          >
            <table>
              <caption>So sánh mô hình VPS và Shared Hosting</caption>
              <thead>
                <tr>
                  <th scope="col">Tiêu chí</th>
                  <th scope="col">VPS AMD</th>
                  <th scope="col">Shared Hosting</th>
                </tr>
              </thead>
              <tbody>
                {vpsContent.learning.comparisonRows.map((row) => (
                  <tr key={row.criterion}>
                    <th scope="row">{row.criterion}</th>
                    <td>{row.vps}</td>
                    <td>{row.hosting}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section
        id="ha-tang-vps-amd"
        className={`${styles.infrastructure} dark`}
        aria-labelledby="amd-infrastructure-title"
      >
        <Image
          src="/images/vps-amd/infrastructure-datacenter-v2.webp"
          alt=""
          fill
          sizes="100vw"
          className={styles.backgroundPhoto}
        />
        <div className={styles.infrastructureOverlay} />
        <div className={`container ${styles.infrastructureGrid}`}>
          <div className={styles.infrastructureCopy}>
            <span className={styles.darkEyebrow}>HẠ TẦNG PHÍA SAU DỊCH VỤ</span>
            <h2 id="amd-infrastructure-title">
              Hạ tầng máy chủ
              <br />
              tại Việt Nam
            </h2>
            <p>
              Vận hành website và ứng dụng trên môi trường VPS riêng. Cùng
              InterData xác định vị trí triển khai, nhu cầu kết nối và kế hoạch
              quản trị phù hợp với hệ thống của bạn.
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
            <span className={styles.panelLabel}>BẮT ĐẦU VỚI VPS AMD</span>
            <h3>Từ cấu hình đến triển khai</h3>
            <ol>
              {[
                {
                  title: "Chọn gói & chu kỳ",
                  text: "Đối chiếu vCPU, RAM, lưu trữ và băng thông với ứng dụng.",
                },
                {
                  title: "Đăng ký & xác nhận",
                  text: "Chọn hệ điều hành, kiểm tra tùy chọn và hóa đơn trước khi thanh toán.",
                },
                {
                  title: "Nhận VPS & triển khai",
                  text: "Nhận thông tin qua email, cấu hình truy cập an toàn và cài đặt ứng dụng.",
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
              Trước khi chạy chính thức: cập nhật hệ điều hành, cấu hình SSH
              key, giới hạn cổng truy cập và kiểm tra bản sao lưu.
            </p>
          </div>
        </div>
        <span className={styles.photoCaption}>Ảnh minh họa datacenter</span>
      </section>
      <CustomerProof />
      <section
        id="cau-hoi"
        className={styles.section}
        aria-labelledby="amd-faq-title"
      >
        <div className="container">
          <div className={styles.faqHeading}>
            <div className={styles.sectionHeading}>
              <span className={styles.lightEyebrow}>CÂU HỎI THƯỜNG GẶP</span>
              <h2 id="amd-faq-title">Giải đáp thắc mắc về VPS AMD</h2>
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
            {amdFaq.map((item) => (
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
      <section
        className={`${styles.finalCta} dark`}
        aria-labelledby="amd-cta-title"
      >
        <Image
          src="/images/vps-amd/cta-server-aisle-v2.webp"
          alt=""
          fill
          sizes="100vw"
          className={styles.backgroundPhoto}
        />
        <div className={styles.ctaOverlay} />
        <div className={`container ${styles.ctaLayout}`}>
          <div>
            <span className={styles.darkEyebrow}>SẴN SÀNG TRIỂN KHAI?</span>
            <h2 id="amd-cta-title">
              Chọn VPS AMD
              <br />
              cho dự án tiếp theo của bạn
            </h2>
            <p>
              Xem cấu hình và bảng giá, hoặc trao đổi yêu cầu cùng đội ngũ
              InterData.
            </p>
          </div>
          <div className={styles.actions}>
            <a className="button primary" href="#bang-gia">
              Chọn gói VPS AMD <ArrowRight size={18} aria-hidden="true" />
            </a>
            <Link
              className={`button ${styles.darkButton}`}
              href={links.contact}
            >
              Liên hệ tư vấn
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
