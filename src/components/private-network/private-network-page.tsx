import { MobilePricingSlider } from "@/components/shared/mobile-pricing-slider";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import {
  ArrowRight,
  Check,
  ClipboardList,
  FileCheck2,
  GitBranch,
  Info,
  Layers3,
  ListChecks,
  MessagesSquare,
  Network,
  Route,
  Settings2,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { ConsultationCta } from "@/components/home/consultation-cta";
import {
  CapacitySection,
  EducationSection,
} from "@/components/home/company-sections";
import { TechnologyPartners } from "@/components/home/technology-partners";
import { CustomerProof } from "@/components/shared/customer-proof";
import { links } from "@/data/content";
import {
  privateNetworkComparison,
  privateNetworkFaq,
  privateNetworkInfrastructure,
  privateNetworkOptions,
  privateNetworkReasons,
  privateNetworkSteps,
  privateNetworkUseCases,
} from "@/data/private-network";
import styles from "@/components/vps/vps.module.css";
import hero from "@/components/vps/hero.module.css";
import advantages from "@/components/vps/advantages.module.css";
import useCases from "@/components/vps/use-cases.module.css";
import pricing from "@/components/vps/pricing.module.css";
import infrastructure from "@/components/vps/infrastructure.module.css";
import comparison from "@/components/vps/comparison.module.css";
import environments from "@/components/vps/environments.module.css";
import homeStyles from "@/components/home/home.module.css";
import { NetworkArchitectures } from "./private-network-architectures";
import local from "./private-network.module.css";

function NetworkHero() {
  return (
    <section className={hero.hero} aria-labelledby="private-network-title">
      <div className={`${hero.stage} dark`}>
        <Image
          src="/images/home/infrastructure/protection-monitoring.webp"
          alt=""
          fill
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          className={hero.backgroundImage}
        />
        <div className={hero.container}>
          <nav className={hero.breadcrumb} aria-label="Đường dẫn trang">
            <Link href="/">Trang chủ</Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">Private Network</span>
          </nav>
          <div className={hero.copy}>
            <span className={hero.badge}>
              <Network size={16} aria-hidden="true" />
              KẾT NỐI NỘI BỘ · PHÂN VÙNG HỆ THỐNG
            </span>
            <h1 id="private-network-title">
              Triển Khai <span>Private Network</span>
            </h1>
            <p className={hero.description}>
              Kết nối máy chủ, ứng dụng và dữ liệu qua mạng riêng. Tổ chức
              subnet, định tuyến và kiểm soát truy cập theo cách hệ thống của
              bạn vận hành.
            </p>
            <div className={hero.actions}>
              <a href="#phuong-an" className={`button ${hero.primary}`}>
                Xem phương án <ArrowRight size={20} aria-hidden="true" />
              </a>
              <a href={links.contact} className={`button ${hero.secondary}`}>
                <MessagesSquare size={18} aria-hidden="true" />
                Liên hệ tư vấn
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function NetworkAdvantages() {
  const benefitItems = [
    { icon: Network, title: "Giao tiếp nội bộ" },
    { icon: Layers3, title: "Phân vùng hệ thống" },
    { icon: ShieldCheck, title: "Kiểm soát truy cập" },
    { icon: Workflow, title: "Theo nhu cầu vận hành" },
  ];
  const icons = [
    GitBranch,
    Route,
    Layers3,
    ShieldCheck,
    ListChecks,
    ClipboardList,
  ];
  const highlights = [
    { icon: Network, value: "IP Plan", label: "Quy hoạch địa chỉ" },
    { icon: Layers3, value: "Subnet", label: "Tách vùng ứng dụng" },
    {
      icon: ShieldCheck,
      value: "Firewall / ACL",
      label: "Kiểm soát luồng truy cập",
    },
    { icon: Route, value: "Routing", label: "Kết nối theo sơ đồ" },
  ];
  return (
    <section
      className={advantages.advantages}
      aria-labelledby="private-network-benefits-title"
    >
      <div
        className={hero.benefitBar}
        role="group"
        aria-label="Lợi ích của Private Network"
      >
        {benefitItems.map(({ icon: Icon, title }) => (
          <div className={hero.benefit} key={title}>
            <span className={hero.benefitIcon}>
              <Icon size={34} aria-hidden="true" />
            </span>
            <h2>{title}</h2>
          </div>
        ))}
      </div>
      <div className={advantages.content}>
        <div className={advantages.container}>
          <div className={advantages.heading}>
            <span className={advantages.eyebrow}>
              <Network size={16} aria-hidden="true" />
              THIẾT KẾ MẠNG THEO ỨNG DỤNG
            </span>
            <h2 id="private-network-benefits-title">
              Kết nối đúng luồng. <span>Kiểm soát đúng phạm vi.</span>
            </h2>
            <p>
              Không phải mọi thành phần đều cần tiếp xúc trực tiếp với Internet.
              Xác định luồng dữ liệu và cách các máy chủ cần giao tiếp trước khi
              xây dựng mạng.
            </p>
          </div>
          <div className={advantages.layout}>
            <div className={advantages.visual}>
              <Image
                src="/images/private-network/advantages-network-v1.webp"
                alt="Minh họa 3D các máy chủ kết nối qua thiết bị mạng trung tâm và biểu tượng kiểm soát truy cập"
                width={1000}
                height={1000}
                sizes="(min-width: 1200px) 410px, (min-width: 900px) 30vw, (min-width: 640px) 300px, 250px"
              />
            </div>
            {privateNetworkReasons.map((reason, index) => {
              const Icon = icons[index];
              return (
                <article className={advantages.card} key={reason.title}>
                  <span className={advantages.icon}>
                    <Icon size={29} aria-hidden="true" />
                  </span>
                  <div>
                    <h3>{reason.title}</h3>
                    <p>{reason.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
          <ul
            className={advantages.highlights}
            aria-label="Các thành phần trong thiết kế mạng riêng"
          >
            {highlights.map(({ icon: Icon, value, label }) => (
              <li key={value}>
                <span className={advantages.highlightIcon}>
                  <Icon size={29} aria-hidden="true" />
                </span>
                <div>
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function NetworkUseCases() {
  return (
    <section
      id="ung-dung"
      className={useCases.useCases}
      aria-labelledby="private-network-use-cases-title"
    >
      <div className={useCases.container}>
        <div className={useCases.heading}>
          <span className={useCases.eyebrow}>ỨNG DỤNG THỰC TẾ</span>
          <h2 id="private-network-use-cases-title">
            <span>Private Network</span> cho hệ thống nào?
          </h2>
          <p>
            Từ website nhiều tầng đến hạ tầng doanh nghiệp. Bắt đầu từ các thành
            phần cần kết nối và những luồng cần được giới hạn.
          </p>
        </div>
        <div className={useCases.grid}>
          {privateNetworkUseCases.map((item) => (
            <article className={useCases.card} key={item.image}>
              <div className={useCases.illustration}>
                <Image
                  src={`/images/vps/use-cases-v2/${item.image}.webp`}
                  alt=""
                  width={900}
                  height={600}
                  sizes="(min-width: 1100px) 30vw, (min-width: 700px) 44vw, 90vw"
                />
              </div>
              <div className={useCases.body}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <a href="#phuong-an">
                  Xem phương án
                  <span className="sr-only"> cho {item.title}</span>
                  <ArrowRight size={18} aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function NetworkOptions() {
  return (
    <section
      id="phuong-an"
      className={`${pricing.pricingSection} ${local.options}`}
      aria-labelledby="private-network-options-title"
    >
      <div className={`container ${pricing.pricingLayout}`}>
        <div className={pricing.pricingIntro}>
          <span className={pricing.eyebrow}>
            <ListChecks size={16} aria-hidden="true" />
            PHƯƠNG ÁN TRIỂN KHAI
          </span>
          <h2 id="private-network-options-title">
            Chọn theo nhu cầu kết nối của bạn
          </h2>
          <p>
            Xác định mục tiêu trước, sau đó làm rõ nền tảng, phạm vi và cách
            triển khai phù hợp với hệ thống hiện tại.
          </p>
        </div>
        <MobilePricingSlider
          className={`${pricing.planGrid} ${local.optionGrid}`}
        >
          {privateNetworkOptions.map((option) => (
            <article
              id={`private-network-option-${option.id}`}
              key={option.id}
              data-option={option.id}
              className={`${pricing.plan} ${option.featured ? pricing.accentPlan : ""}`}
            >
              {option.featured && (
                <span className={pricing.popularTag}>
                  <Layers3 size={16} aria-hidden="true" />
                  GỢI Ý PHÂN VÙNG
                </span>
              )}
              <h3>{option.name}</h3>
              <p className={local.optionAudience}>{option.audience}</p>
              <ul>
                {option.features.map((feature) => (
                  <li key={feature}>
                    <Check size={20} aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href={links.contact}
                className={`button ${pricing.planButton} ${option.featured ? "primary" : pricing.outlineButton}`}
                aria-label={`Liên hệ về ${option.name}`}
              >
                Liên hệ <ArrowRight size={16} aria-hidden="true" />
              </a>
            </article>
          ))}
        </MobilePricingSlider>
      </div>
    </section>
  );
}

function NetworkInfrastructure() {
  const icons = [Network, Layers3, ShieldCheck, FileCheck2];
  return (
    <section
      id="thanh-phan"
      className={infrastructure.section}
      aria-labelledby="private-network-infrastructure-title"
    >
      <div className={infrastructure.container}>
        <div className={infrastructure.heading}>
          <span className={infrastructure.eyebrow}>
            <Network size={16} aria-hidden="true" />
            TỪ SƠ ĐỒ ĐẾN CẤU HÌNH
          </span>
          <h2 id="private-network-infrastructure-title">
            Các thành phần{" "}
            <span className={infrastructure.accent}>của một mạng riêng</span>
          </h2>
          <p>
            Địa chỉ, phân vùng, chính sách và kiểm thử cần đi cùng nhau trong
            một phương án triển khai.
          </p>
        </div>
        <div className={infrastructure.rows}>
          {privateNetworkInfrastructure.map((item, index) => {
            const Icon = icons[index];
            return (
              <article
                className={infrastructure.row}
                key={item.id}
                aria-labelledby={`private-network-infrastructure-${item.id}`}
              >
                <div className={infrastructure.copy}>
                  <svg
                    className={infrastructure.panel}
                    viewBox="0 0 720 216"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M90 1H703Q719 1 719 17V199Q719 215 703 215H90Q80 215 74 207L8 118Q1 108 8 98L74 9Q80 1 90 1Z"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                  <span className={infrastructure.number} aria-hidden="true">
                    0{index + 1}
                  </span>
                  <div className={infrastructure.details}>
                    <h3 id={`private-network-infrastructure-${item.id}`}>
                      {item.title}
                      <span className={infrastructure.accent}>
                        {item.accent}
                      </span>
                    </h3>
                    <p>{item.text}</p>
                    <ul className={infrastructure.benefits}>
                      {item.benefits.map((text) => (
                        <li key={text}>
                          <span className={infrastructure.benefitIcon}>
                            <Icon size={23} aria-hidden="true" />
                          </span>
                          <span>{text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <figure className={infrastructure.imageFrame}>
                  <Image
                    src={item.image}
                    alt={`Hình ảnh minh họa cho ${item.title}${item.accent}`}
                    fill
                    sizes="(min-width: 1384px) 722px, (min-width: 1000px) 56vw, (min-width: 640px) 720px, calc(100vw - 40px)"
                  />
                </figure>
              </article>
            );
          })}
        </div>
        <div className={infrastructure.footer}>
          <a href={links.contact} className={infrastructure.aboutLink}>
            Trao đổi sơ đồ mạng của bạn{" "}
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

function NetworkComparison() {
  const columns = [
    {
      key: "private",
      label: "Private Network",
      text: "Tổ chức giao tiếp nội bộ",
    },
    {
      key: "public",
      label: "Public Network",
      text: "Phục vụ kết nối qua Internet",
    },
    { key: "vpn", label: "VPN", text: "Kết nối giữa người dùng hoặc các mạng" },
  ] as const;
  return (
    <section
      id="so-sanh"
      className={comparison.section}
      aria-labelledby="private-network-comparison-title"
    >
      <div className="container">
        <div className={comparison.heading}>
          <div>
            <span className={comparison.eyebrow}>CHỌN ĐÚNG CÁCH KẾT NỐI</span>
            <h2 id="private-network-comparison-title">
              Mạng riêng, mạng public <span>và VPN</span>
            </h2>
            <p>
              Ba khái niệm giải quyết các nhu cầu khác nhau và có thể cùng xuất
              hiện trong một hệ thống.
            </p>
          </div>
          <a className={comparison.consult} href={links.contact}>
            <MessagesSquare size={18} aria-hidden="true" />
            Liên hệ tư vấn <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
        <p id="private-network-comparison-hint" className={comparison.hint}>
          Vuốt ngang để xem đủ các cột trên màn hình nhỏ.
        </p>
        <div
          className={comparison.frame}
          style={{ "--service-count": 3 } as CSSProperties}
        >
          <div
            className={comparison.rail}
            role="region"
            aria-label="Bảng so sánh Private Network, Public Network và VPN"
            aria-describedby="private-network-comparison-hint"
            tabIndex={0}
          >
            <table className={comparison.table}>
              <caption className="sr-only">
                So sánh Private Network, Public Network và VPN
              </caption>
              <colgroup>
                <col className={comparison.criterionColumn} />
                {columns.map((c) => (
                  <col key={c.key} />
                ))}
              </colgroup>
              <thead>
                <tr>
                  <th scope="col" className={comparison.corner}>
                    Tiêu chí
                  </th>
                  {columns.map((c) => (
                    <th
                      key={c.key}
                      scope="col"
                      data-featured={c.key === "private" || undefined}
                    >
                      <span className={comparison.serviceHeading}>
                        <span className={comparison.serviceName}>
                          {c.label}
                        </span>
                        <p>{c.text}</p>
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {privateNetworkComparison.map((row) => (
                  <tr key={row.criterion}>
                    <th scope="row">{row.criterion}</th>
                    {columns.map((c) => (
                      <td
                        key={c.key}
                        data-featured={c.key === "private" || undefined}
                      >
                        {row[c.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className={comparison.note}>
          <Info size={19} aria-hidden="true" />
          <span>
            Mạng riêng không tự đồng nghĩa với mã hóa đầu cuối. Cần xác định cơ
            chế bảo vệ cho từng luồng dữ liệu và từng điểm kết nối.
          </span>
        </p>
      </div>
    </section>
  );
}

function NetworkProcess() {
  const icons = [ClipboardList, GitBranch, Settings2, FileCheck2];
  return (
    <section
      id="quy-trinh"
      className={environments.section}
      aria-labelledby="private-network-process-title"
    >
      <div className="container">
        <div className={environments.heading}>
          <span className={environments.eyebrow}>
            TRIỂN KHAI THEO SƠ ĐỒ CỦA BẠN
          </span>
          <h2 id="private-network-process-title">
            Rõ yêu cầu trước. Rõ kết quả khi bàn giao.
          </h2>
          <p>
            Từ khảo sát hệ thống đến cấu hình, kiểm thử và tài liệu vận hành.
          </p>
        </div>
        <div className={environments.appGrid}>
          {privateNetworkSteps.map((step, index) => {
            const Icon = icons[index];
            return (
              <article
                key={step.title}
                className={`${environments.card} ${environments.app}`}
              >
                <div className={environments.cardSurface}>
                  <span className={local.stepIcon}>
                    <Icon size={34} aria-hidden="true" />
                  </span>
                  <small>BƯỚC 0{index + 1}</small>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function NetworkFaqItem({
  item,
}: {
  item: (typeof privateNetworkFaq)[number];
}) {
  return (
    <details className={styles.faq}>
      <summary>
        <h3>{item.question}</h3>
        <span className={styles.chevron} aria-hidden="true">
          +
        </span>
      </summary>
      <div>
        <p>{item.answer}</p>
      </div>
    </details>
  );
}

export function PrivateNetworkPage() {
  return (
    <main
      id="noi-dung"
      className={`${styles.page} ${styles.sectionSpacing} ${local.page}`}
    >
      <NetworkHero />
      <NetworkAdvantages />
      <NetworkArchitectures />
      <NetworkUseCases />
      <NetworkOptions />
      <NetworkInfrastructure />
      <div className={styles.technicalDetails}>
        <NetworkComparison />
        <NetworkProcess />
      </div>
      <div className={`${homeStyles.home} ${styles.homeSections}`}>
        <CapacitySection />
      </div>
      <CustomerProof controlsOnCards centerHeadings />
      <div className={`${homeStyles.home} ${styles.homeSections}`}>
        <EducationSection title="Kiến tạo tương lai" />
        <TechnologyPartners />
      </div>
      <section
        id="cau-hoi"
        className={`${styles.section} ${styles.subtle}`}
        aria-labelledby="private-network-faq-title"
      >
        <div className={`container ${styles.faqLayout}`}>
          <div className={styles.sectionHeading}>
            <span className="eyebrow">CÂU HỎI THƯỜNG GẶP</span>
            <h2 id="private-network-faq-title">
              Hiểu rõ trước khi triển khai Private Network
            </h2>
            <p>
              Kết nối, phân vùng, mã hóa và những thông tin cần chuẩn bị khi
              trao đổi phương án.
            </p>
          </div>
          <div className={styles.faqs}>
            {privateNetworkFaq.slice(0, 5).map((item) => (
              <NetworkFaqItem key={item.question} item={item} />
            ))}
            <details className={styles.moreFaqs}>
              <summary>
                Xem tất cả {privateNetworkFaq.length} câu hỏi
                <span className={styles.chevron} aria-hidden="true">
                  +
                </span>
              </summary>
              <div>
                {privateNetworkFaq.slice(5).map((item) => (
                  <NetworkFaqItem key={item.question} item={item} />
                ))}
              </div>
            </details>
          </div>
        </div>
      </section>
      <ConsultationCta
        id="private-network-consultation"
        headingId="private-network-cta-title"
        className={styles.consultationCta}
        eyebrow="TRAO ĐỔI CÙNG INTERDATA"
        title="Bắt đầu từ sơ đồ mạng của bạn."
        description="Chia sẻ các thành phần cần kết nối, nền tảng đang dùng và yêu cầu truy cập. InterData sẽ cùng bạn xác định mô hình mạng riêng và phạm vi triển khai phù hợp."
        image="/images/cta/consultation-woman-upper-body.webp"
        primaryAction={{ label: "Liên hệ", href: links.contact }}
        secondaryAction={{
          label: "Xem phương án triển khai",
          href: "#phuong-an",
        }}
      />
    </main>
  );
}
