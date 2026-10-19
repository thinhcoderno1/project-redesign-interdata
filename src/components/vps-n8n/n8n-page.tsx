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
  Terminal,
  type LucideIcon,
} from "lucide-react";
import { CompanyProofSections } from "@/components/shared/company-proof-sections";
import { N8nDeploymentProcess } from "./deployment-process";
import { CapacitySection } from "@/components/home/company-sections";
import { TechnologyPartners } from "@/components/home/technology-partners";
import homeStyles from "@/components/home/home.module.css";
import { ParallaxBackground } from "@/components/ui/parallax-background";
import { n8nFaq, n8nComparison, type N8nPrices } from "@/data/vps-n8n";
import { links } from "@/data/content";
import { N8nPricing } from "./n8n-pricing";
import styles from "./n8n.module.css";

const applications: {
  icon: LucideIcon;
  title: string;
  text: string;
  image: string;
  tone: string;
}[] = [
  {
    icon: Globe2,
    title: "Thu thập lead & CRM",
    text: "Nhận dữ liệu từ biểu mẫu, kiểm tra thông tin và chuyển lead đến CRM qua các kết nối bạn thiết lập.",
    image: "/images/vps/use-cases-v2/website.webp",
    tone: "blue",
  },
  {
    icon: Code2,
    title: "Kết nối API & Webhook",
    text: "Liên kết các ứng dụng, nhận sự kiện qua webhook và xử lý dữ liệu theo logic của bạn.",
    image: "/images/vps/use-cases-v2/development.webp",
    tone: "green",
  },
  {
    icon: Terminal,
    title: "Thông báo & Nhắc việc",
    text: "Gửi thông báo khi có sự kiện, nhắc tác vụ định kỳ và chuyển cảnh báo đến kênh làm việc phù hợp.",
    image: "/images/vps/use-cases-v2/remote.webp",
    tone: "red",
  },
  {
    icon: Database,
    title: "Đồng bộ & Báo cáo",
    text: "Tổng hợp dữ liệu từ nhiều nguồn, đồng bộ theo lịch và gửi báo cáo đến người phụ trách.",
    image: "/images/vps/use-cases-v2/database.webp",
    tone: "purple",
  },
  {
    icon: Bot,
    title: "Workflow AI & Agent",
    text: "Kết nối mô hình AI qua API để phân loại, tóm tắt hoặc xử lý nội dung trong workflow của bạn.",
    image: "/images/vps/use-cases-v2/tools.webp",
    tone: "amber",
  },
  {
    icon: HardDrive,
    title: "Xử lý file & Dữ liệu",
    text: "Tổ chức luồng xử lý tài liệu và dữ liệu. Chọn dung lượng theo kích thước file và lịch sử thực thi.",
    image: "/images/vps/infrastructure-photo-v3/storage.webp",
    tone: "cyan",
  },
];

export function N8nPage({ prices }: { prices: N8nPrices }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "VPS n8n InterData",
    serviceType: "Template hệ điều hành cài sẵn n8n trên VPS",
    url: "https://interdata.vn/vps-n8n/",
    description:
      "Tất cả dịch vụ VPS InterData hỗ trợ template hệ điều hành cài sẵn n8n để tự host workflow.",
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
        aria-labelledby="n8n-title"
      >
        <ParallaxBackground
          className={`hero-background ${styles.heroBackground}`}
        >
          <Image
            src="/images/vps-n8n/hero-v2.webp"
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
            <span aria-current="page">VPS n8n</span>
          </nav>
          <div className={styles.heroGrid}>
            <div className={`hero-content ${styles.heroCopy}`}>
              <span className={styles.darkEyebrow}>
                <Cpu size={16} aria-hidden="true" />
                TEMPLATE N8N · SELF-HOST TRÊN VPS
              </span>
              <h1 id="n8n-title">
                VPS <span>n8n</span>
              </h1>
              <p className={styles.heroSubheadline}>
                Self-host n8n, Khởi Tạo Dễ Dàng
              </p>
              <p className={styles.heroDescription}>
                Chọn template hệ điều hành cài sẵn n8n để bắt đầu xây dựng
                workflow trên VPS. Tất cả dịch vụ VPS InterData đều hỗ trợ
                template này; bạn chủ động chọn cấu hình và quản lý môi trường
                của mình.
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
                src="/images/vps-n8n/hero-v2.webp"
                alt=""
                fill
                sizes="(max-width: 639px) 100vw, 1px"
              />
            </div>
          </div>
        </div>
      </section>
      <div className={styles.factStrip} aria-label="Nền tảng dịch vụ VPS n8n">
        <div className={`container ${styles.factGrid}`}>
          {[
            [Workflow, "n8n", "Template cài sẵn"],
            [Server, "Mọi dòng VPS", "Linh hoạt lựa chọn"],
            [KeyRound, "Self-host", "Chủ động quản lý"],
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
      <N8nPricing initialPrices={prices} />

      <section
        id="nen-tang"
        className={`${styles.performance} dark`}
        aria-labelledby="n8n-hardware-title"
      >
        <div className={styles.performanceArtwork} aria-hidden="true">
          <Image
            src="/images/vps-n8n/platform-v2.webp"
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
              CÀI SẴN ĐỂ BẮT ĐẦU NHANH
            </span>
            <h2 id="n8n-hardware-title">
              Một template n8n
              <br />
              nhiều lựa chọn VPS
            </h2>
            <p>
              Bắt đầu từ dòng VPS phù hợp với ngân sách và tải công việc.
              Template n8n giúp rút ngắn bước cài đặt ban đầu, để bạn tập trung
              kết nối ứng dụng và tạo workflow. Đây là lựa chọn template, không
              phải một dòng VPS riêng.
            </p>
            <dl className={styles.cpuStats}>
              <div>
                <dt>Khởi tạo</dt>
                <dd>Template</dd>
              </div>
              <div>
                <dt>Ứng dụng</dt>
                <dd>n8n</dd>
              </div>
              <div>
                <dt>Quản trị</dt>
                <dd>Self-host</dd>
              </div>
            </dl>
            <p className={styles.performanceNote}>
              Template hỗ trợ bước cài đặt; bạn vẫn quản lý cập nhật, bảo mật,
              sao lưu và workflow. Kiểm tra phiên bản template và phạm vi hỗ trợ
              khi đăng ký.
            </p>
            <a
              className="text-link"
              href="https://docs.n8n.io/hosting/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Tài liệu self-host n8n <ArrowRight size={17} aria-hidden="true" />
            </a>
          </div>
          <div className={styles.performanceScene} aria-hidden="true">
            <Image
              src="/images/vps-n8n/platform-v2.webp"
              alt=""
              fill
              sizes="(max-width: 959px) 100vw, 1px"
            />
          </div>
          <div className={styles.performanceFeatures}>
            {[
              {
                icon: Cpu,
                title: "Template có sẵn",
                text: "Chọn n8n trong danh sách hệ điều hành",
              },
              {
                icon: HardDrive,
                title: "Chọn VPS linh hoạt",
                text: "GOLD, AMD, PLATINUM hoặc Linux",
              },
              {
                icon: Network,
                title: "Kết nối workflow",
                text: "Tự thiết lập API và thông tin xác thực",
              },
              {
                icon: KeyRound,
                title: "Chủ động vận hành",
                text: "Quản lý cập nhật, bảo mật và sao lưu",
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
        aria-labelledby="n8n-uses-title"
      >
        <div className="container">
          <div
            className={`${styles.sectionHeading} ${styles.applicationHeading}`}
          >
            <span className={styles.lightEyebrow}>
              <Globe2 size={16} aria-hidden="true" />
              PHÙ HỢP VỚI NHIỀU NHU CẦU
            </span>
            <h2 id="n8n-uses-title">
              <span>n8n</span> cho công việc mỗi ngày
            </h2>
            <p>
              Tự xây dựng workflow theo quy trình của bạn, từ thao tác lặp lại
              đến luồng xử lý kết nối nhiều ứng dụng.
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
                  src="/images/vps-n8n/center.webp"
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
                      aria-label={`Xem bảng giá VPS n8n cho ${title}`}
                    >
                      <ArrowRight size={18} aria-hidden="true" />
                    </a>
                  </div>
                </article>
              ),
            )}
          </div>
          <p className={styles.applicationNote}>
            Nhiều workflow đồng thời hoặc xử lý file lớn?{" "}
            <Link href={links.contact}>
              Trao đổi yêu cầu trước khi chọn gói{" "}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </p>
        </div>
      </section>

      <N8nDeploymentProcess />

      <section
        id="so-sanh"
        className={`${styles.section} ${styles.comparisonSection}`}
        aria-labelledby="n8n-comparison-title"
      >
        <div className={`container ${styles.comparisonLayout}`}>
          <div className={styles.sectionHeading}>
            <span className={styles.lightEyebrow}>
              <Workflow size={16} aria-hidden="true" />
              CHỌN CÁCH BẮT ĐẦU
            </span>
            <h2 id="n8n-comparison-title">Template n8n hay tự cài đặt?</h2>
            <p>
              Dùng template khi muốn rút ngắn bước cài đặt ban đầu. Tự cài khi
              cần thiết kế môi trường theo yêu cầu riêng. Cả hai cách đều cần
              người quản lý vận hành và bảo vệ dữ liệu.
            </p>
            <Link href={links.vps} className="text-link">
              Tìm hiểu thêm về các dòng VPS{" "}
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <div
            className={styles.tableScroll}
            role="region"
            aria-label="So sánh template n8n và tự cài đặt"
            tabIndex={0}
          >
            <table>
              <caption>Các bước chuẩn bị và trách nhiệm vận hành n8n</caption>
              <thead>
                <tr>
                  <th scope="col">Tiêu chí</th>
                  <th scope="col">Template n8n</th>
                  <th scope="col">Tự cài n8n</th>
                </tr>
              </thead>
              <tbody>
                {n8nComparison.map((row) => (
                  <tr key={row.criterion}>
                    <th scope="row">{row.criterion}</th>
                    <td>{row.template}</td>
                    <td>{row.manual}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section
        id="ha-tang-vps-n8n"
        className={`${styles.infrastructure} dark`}
        aria-labelledby="n8n-infrastructure-title"
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
            <h2 id="n8n-infrastructure-title">
              Hạ tầng máy chủ
              <br />
              tại Việt Nam
            </h2>
            <p>
              Workflow n8n chạy trên cấu hình VPS bạn lựa chọn. Hãy cân đối
              vCPU, RAM, dung lượng và kết nối theo mức chạy đồng thời, dữ liệu
              xử lý và các dịch vụ tích hợp.
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
              BẮT ĐẦU VỚI TEMPLATE N8N
            </span>
            <h3>Từ chọn VPS đến workflow đầu tiên</h3>
            <ol>
              {[
                {
                  title: "Chọn gói & chu kỳ",
                  text: "Chọn dịch vụ VPS, cấu hình và chu kỳ theo nhu cầu workflow.",
                },
                {
                  title: "Chọn template n8n",
                  text: "Chọn template n8n ở bước cấu hình đơn hàng; kiểm tra phiên bản và hóa đơn.",
                },
                {
                  title: "Nhận VPS & tạo workflow",
                  text: "Làm theo thông tin bàn giao, hoàn tất thiết lập n8n và thử workflow đầu tiên.",
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
              Trước khi chạy chính thức: cấu hình HTTPS, bảo vệ tài khoản và
              credentials, kiểm tra webhook và thử khôi phục bản sao lưu.
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
        aria-labelledby="n8n-faq-title"
      >
        <div className="container">
          <div className={styles.faqHeading}>
            <div className={styles.sectionHeading}>
              <span className={styles.lightEyebrow}>
                <HelpCircle size={16} aria-hidden="true" />
                CÂU HỎI THƯỜNG GẶP
              </span>
              <h2 id="n8n-faq-title">Giải đáp thắc mắc về VPS n8n</h2>
              <p>
                Template cài sẵn, cách chọn VPS và trách nhiệm vận hành khi
                self-host n8n.
              </p>
            </div>
            <a className="text-link" href={links.ticket}>
              Gửi yêu cầu hỗ trợ <ArrowRight size={17} aria-hidden="true" />
            </a>
          </div>
          <div className={styles.faqList}>
            {n8nFaq.map((item) => (
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
        aria-labelledby="n8n-cta-title"
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
            <h2 id="n8n-cta-title">
              Chọn VPS phù hợp
              <br />
              khởi tạo n8n của bạn
            </h2>
            <p>
              Bắt đầu với template n8n trên dòng VPS bạn chọn. Trao đổi số
              workflow, mức chạy đồng thời và nhu cầu dữ liệu để được tư vấn cấu
              hình.
            </p>
          </div>
          <div className={styles.actions}>
            <a className="button primary" href="#bang-gia">
              Chọn VPS cho n8n <ArrowRight size={18} aria-hidden="true" />
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
