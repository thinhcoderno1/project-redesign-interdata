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
  Video,
  type LucideIcon,
} from "lucide-react";
import { CompanyProofSections } from "@/components/shared/company-proof-sections";
import { Environments } from "@/components/vps/environments";
import { CapacitySection } from "@/components/home/company-sections";
import { TechnologyPartners } from "@/components/home/technology-partners";
import homeStyles from "@/components/home/home.module.css";
import { ParallaxBackground } from "@/components/ui/parallax-background";
import { goldFaq } from "@/data/vps-gold";
import { links } from "@/data/content";
import vpsContent from "@/data/vps-content.json";
import type { VpsProduct } from "@/data/vps-pricing";
import { GoldPricing } from "./gold-pricing";
import styles from "./gold.module.css";

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
    image: "/images/vps/use-cases-v2/website.webp",
    tone: "blue",
  },
  {
    icon: Code2,
    title: "Lập trình & Phát triển",
    text: "Triển khai API, container hoặc staging; chủ động cấu hình runtime và dịch vụ.",
    image: "/images/vps/use-cases-v2/development.webp",
    tone: "green",
  },
  {
    icon: Video,
    title: "Streaming & Media",
    text: "Chạy dịch vụ media và phân phối nội dung. Đối chiếu băng thông, lưu trữ và mức tải trước khi triển khai.",
    image: "/images/vps/infrastructure-photo-v3/network.webp",
    tone: "red",
  },
  {
    icon: Database,
    title: "Ứng dụng & Cơ sở dữ liệu",
    text: "Vận hành CRM, ERP và database trên môi trường riêng. Chọn RAM theo dữ liệu, vCPU theo mức truy vấn thực tế.",
    image: "/images/vps/use-cases-v2/database.webp",
    tone: "purple",
  },
  {
    icon: Bot,
    title: "Automation & AI Agent",
    text: "Self-host n8n, chạy workflow và AI Agent kết nối mô hình qua API. Chọn RAM theo số tác vụ chạy đồng thời.",
    image: "/images/vps/use-cases-v2/tools.webp",
    tone: "amber",
  },
  {
    icon: HardDrive,
    title: "Lưu trữ & Sao lưu dữ liệu",
    text: "Tổ chức kho dữ liệu và tác vụ backup. Lập lịch sao lưu, theo dõi dung lượng và kiểm tra khôi phục.",
    image: "/images/vps/infrastructure-photo-v3/storage.webp",
    tone: "cyan",
  },
];

export function GoldPage({ products }: { products: VpsProduct[] | null }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "VPS GOLD InterData",
    serviceType: "Máy chủ ảo VPS GOLD",
    url: "https://interdata.vn/vps-gold/",
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
        aria-labelledby="gold-title"
      >
        <ParallaxBackground
          className={`hero-background ${styles.heroBackground}`}
        >
          <Image
            src="/images/vps-gold/hero.webp"
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
            <span aria-current="page">VPS GOLD</span>
          </nav>
          <div className={styles.heroGrid}>
            <div className={`hero-content ${styles.heroCopy}`}>
              <span className={styles.darkEyebrow}>
                <Cpu size={16} aria-hidden="true" />
                VPS GOLD · INTEL XEON
              </span>
              <h1 id="gold-title">
                VPS <span>GOLD</span>
              </h1>
              <p className={styles.heroSubheadline}>Nền Tảng Intel Xeon Gold</p>
              <p className={styles.heroDescription}>
                VPS dùng nền tảng Intel Xeon Gold, lưu trữ SSD NVMe và cổng mạng
                1Gbps. Chọn gói tại HCM hoặc Hà Nội theo tài nguyên, vị trí
                người dùng và nhu cầu triển khai của bạn.
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
                src="/images/vps-gold/hero.webp"
                alt=""
                fill
                sizes="(max-width: 639px) 100vw, 1px"
              />
            </div>
          </div>
        </div>
      </section>
      <div className={styles.factStrip} aria-label="Nền tảng dịch vụ VPS GOLD">
        <div className={`container ${styles.factGrid}`}>
          {[
            [Cpu, "Intel Xeon Gold", "Nền tảng xử lý"],
            [HardDrive, "SSD NVMe", "Lưu trữ theo gói"],
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
      <GoldPricing initialProducts={products} />

      <section
        id="nen-tang"
        className={`${styles.performance} dark`}
        aria-labelledby="gold-hardware-title"
      >
        <div className={styles.performanceArtwork} aria-hidden="true">
          <Image
            src="/images/vps-gold/platform.webp"
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
              NỀN TẢNG XỬ LÝ
            </span>
            <h2 id="gold-hardware-title">
              CPU Intel Xeon Gold
              <br />
              cho môi trường của bạn
            </h2>
            <p>
              Nền tảng Intel Xeon Gold kết hợp lưu trữ NVMe cho website, API và
              cơ sở dữ liệu. Chọn vCPU, RAM, dung lượng và lưu lượng truyền tải
              theo tải thực tế; tài nguyên được ghi rõ trong từng gói.
            </p>
            <dl className={styles.cpuStats}>
              <div>
                <dt>Cổng mạng</dt>
                <dd>1Gbps</dd>
              </div>
              <div>
                <dt>Lưu trữ</dt>
                <dd>NVMe</dd>
              </div>
              <div>
                <dt>IP riêng</dt>
                <dd>IPv4</dd>
              </div>
            </dl>
            <p className={styles.performanceNote}>
              Tên dòng CPU không phải số nhân được cấp cho VPS. Model CPU,
              network port và tài nguyên thực tế được xác nhận theo từng gói.
            </p>
            <a
              className="text-link"
              href="https://www.intel.com/content/www/us/en/products/details/processors/xeon.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              Tìm hiểu nền tảng Intel Xeon{" "}
              <ArrowRight size={17} aria-hidden="true" />
            </a>
          </div>
          <div className={styles.performanceScene} aria-hidden="true">
            <Image
              src="/images/vps-gold/platform.webp"
              alt=""
              fill
              sizes="(max-width: 959px) 100vw, 1px"
            />
          </div>
          <div className={styles.performanceFeatures}>
            {[
              {
                icon: Cpu,
                title: "CPU Intel Xeon Gold",
                text: "Số vCPU được phân bổ theo từng gói",
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
        aria-labelledby="gold-uses-title"
      >
        <div className="container">
          <div
            className={`${styles.sectionHeading} ${styles.applicationHeading}`}
          >
            <span className={styles.lightEyebrow}>
              <Globe2 size={16} aria-hidden="true" />
              PHÙ HỢP VỚI NHIỀU NHU CẦU
            </span>
            <h2 id="gold-uses-title">
              <span>VPS GOLD</span> cho dự án của bạn
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
                  src="/images/vps-gold/center.webp"
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
                      aria-label={`Xem bảng giá VPS GOLD cho ${title}`}
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

      <Environments className={styles.environments} />

      <section
        id="so-sanh"
        className={`${styles.section} ${styles.comparisonSection}`}
        aria-labelledby="gold-comparison-title"
      >
        <div className={`container ${styles.comparisonLayout}`}>
          <div className={styles.sectionHeading}>
            <span className={styles.lightEyebrow}>
              <Workflow size={16} aria-hidden="true" />
              CHỌN MÔI TRƯỜNG TRIỂN KHAI
            </span>
            <h2 id="gold-comparison-title">Khi nào nên chọn VPS GOLD?</h2>
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
                  <th scope="col">VPS GOLD</th>
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
        id="ha-tang-vps-gold"
        className={`${styles.infrastructure} dark`}
        aria-labelledby="gold-infrastructure-title"
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
            <h2 id="gold-infrastructure-title">
              Hạ tầng máy chủ
              <br />
              tại Việt Nam
            </h2>
            <p>
              Chọn gói HCM hoặc Hà Nội theo vị trí người dùng và nhu cầu kết
              nối. Đối chiếu dung lượng lưu trữ, lưu lượng hàng tháng và kế
              hoạch sao lưu của từng gói trước khi triển khai.
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
              BẮT ĐẦU VỚI VPS GOLD
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
        aria-labelledby="gold-faq-title"
      >
        <div className="container">
          <div className={styles.faqHeading}>
            <div className={styles.sectionHeading}>
              <span className={styles.lightEyebrow}>
                <HelpCircle size={16} aria-hidden="true" />
                CÂU HỎI THƯỜNG GẶP
              </span>
              <h2 id="gold-faq-title">Giải đáp thắc mắc về VPS GOLD</h2>
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
            {goldFaq.map((item) => (
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
        aria-labelledby="gold-cta-title"
      >
        <Image
          src="/images/vps/infrastructure-photo-v3/network.webp"
          alt=""
          fill
          sizes="100vw"
          className={styles.backgroundPhoto}
        />
        <div className={styles.ctaOverlay} />
        <div className={`container ${styles.ctaLayout}`}>
          <div>
            <span className={styles.darkEyebrow}>
              <Rocket size={16} aria-hidden="true" />
              SẴN SÀNG TRIỂN KHAI?
            </span>
            <h2 id="gold-cta-title">
              Chọn VPS GOLD
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
              Chọn gói VPS GOLD <ArrowRight size={18} aria-hidden="true" />
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
