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
  proxmoxCephComparison,
  proxmoxCephFaq,
  proxmoxCephInfrastructure,
  proxmoxCephOptions,
  proxmoxCephReasons,
  proxmoxCephSteps,
  proxmoxCephUseCases,
} from "@/data/proxmox-ceph";
import styles from "@/components/vps/vps.module.css";
import hero from "@/components/vps/hero.module.css";
import advantages from "@/components/vps/advantages.module.css";
import useCases from "@/components/vps/use-cases.module.css";
import pricing from "@/components/vps/pricing.module.css";
import infrastructure from "@/components/vps/infrastructure.module.css";
import comparison from "@/components/vps/comparison.module.css";
import environments from "@/components/vps/environments.module.css";
import homeStyles from "@/components/home/home.module.css";
import { ProxmoxArchitectures } from "./proxmox-ceph-architectures";
import local from "./proxmox-ceph.module.css";

function ProxmoxHero() {
  return (
    <section className={hero.hero} aria-labelledby="proxmox-ceph-title">
      <div className={`${hero.stage} dark`}>
        <Image
          src="/images/proxmox-ceph/hero-proxmox-ceph-v1.webp"
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
            <span aria-current="page">Proxmox / Ceph</span>
          </nav>
          <div className={hero.copy}>
            <span className={hero.badge}>
              <Network size={16} aria-hidden="true" />
              ẢO HÓA KVM / LXC · LƯU TRỮ PHÂN TÁN
            </span>
            <h1 id="proxmox-ceph-title">
              TRIỂN KHAI ẢO HÓA <span>PROXMOX / CEPH</span>
            </h1>
            <p className={hero.description}>
              Xây dựng nền tảng máy ảo và lưu trữ theo nhu cầu doanh nghiệp. Từ
              Proxmox VE độc lập đến Cluster HA và hạ tầng hội tụ Proxmox +
              Ceph, với phương án triển khai và bàn giao rõ ràng.
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

function ProxmoxAdvantages() {
  const benefitItems = [
    { icon: Network, title: "Quản trị tập trung" },
    { icon: Layers3, title: "Máy ảo & Container" },
    { icon: ShieldCheck, title: "Lưu trữ linh hoạt" },
    { icon: Workflow, title: "Sẵn sàng mở rộng" },
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
    { icon: Network, value: "Cluster", label: "Quản trị theo cụm" },
    { icon: Layers3, value: "KVM / LXC", label: "Máy ảo & Container" },
    {
      icon: ShieldCheck,
      value: "Ceph RBD",
      label: "Lưu trữ phân tán",
    },
    { icon: Route, value: "Backup", label: "Kiểm tra khôi phục" },
  ];
  return (
    <section
      className={advantages.advantages}
      aria-labelledby="proxmox-ceph-benefits-title"
    >
      <div
        className={hero.benefitBar}
        role="group"
        aria-label="Lợi ích của Proxmox / Ceph"
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
              HẠ TẦNG ẢO HÓA THEO ỨNG DỤNG
            </span>
            <h2 id="proxmox-ceph-benefits-title">
              Gom tài nguyên. <span>Chủ động hạ tầng.</span>
            </h2>
            <p>
              Thiết kế compute, storage và network cùng một phương án. Lựa chọn
              kiến trúc theo tải ứng dụng, mục tiêu phục hồi và khả năng vận
              hành của đội ngũ.
            </p>
          </div>
          <div className={advantages.layout}>
            <div className={advantages.visual}>
              <Image
                src="/images/proxmox-ceph/advantages-cluster-v1.webp"
                alt="Minh họa 3D cụm máy chủ ảo hóa kết nối với hệ thống lưu trữ phân tán"
                width={1000}
                height={1000}
                sizes="(min-width: 1200px) 410px, (min-width: 900px) 30vw, (min-width: 640px) 300px, 250px"
              />
            </div>
            {proxmoxCephReasons.map((reason, index) => {
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
            aria-label="Các thành phần của nền tảng ảo hóa"
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

function ProxmoxUseCases() {
  return (
    <section
      id="ung-dung"
      className={useCases.useCases}
      aria-labelledby="proxmox-ceph-use-cases-title"
    >
      <div className={useCases.container}>
        <div className={useCases.heading}>
          <span className={useCases.eyebrow}>ỨNG DỤNG THỰC TẾ</span>
          <h2 id="proxmox-ceph-use-cases-title">
            <span>Proxmox / Ceph</span> cho nhu cầu nào?
          </h2>
          <p>
            Từ môi trường phát triển đến hệ thống nghiệp vụ nhiều máy ảo. Chọn
            cách tổ chức tài nguyên phù hợp với ứng dụng đang vận hành.
          </p>
        </div>
        <div className={useCases.grid}>
          {proxmoxCephUseCases.map((item) => (
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

function ProxmoxOptions() {
  return (
    <section
      id="phuong-an"
      className={`${pricing.pricingSection} ${local.options}`}
      aria-labelledby="proxmox-ceph-options-title"
    >
      <div className={`container ${pricing.pricingLayout}`}>
        <div className={pricing.pricingIntro}>
          <span className={pricing.eyebrow}>
            <ListChecks size={16} aria-hidden="true" />
            PHƯƠNG ÁN TRIỂN KHAI
          </span>
          <h2 id="proxmox-ceph-options-title">Chọn mô hình ảo hóa phù hợp</h2>
          <p>
            Bắt đầu từ số lượng workload, nhu cầu lưu trữ và mục tiêu phục hồi.
            Trao đổi để xác định hạ tầng và phạm vi công việc cho từng phương
            án.
          </p>
        </div>
        <MobilePricingSlider
          className={`${pricing.planGrid} ${local.optionGrid}`}
        >
          {proxmoxCephOptions.map((option) => (
            <article
              id={`proxmox-ceph-option-${option.id}`}
              key={option.id}
              data-option={option.id}
              className={`${pricing.plan} ${option.featured ? pricing.accentPlan : ""}`}
            >
              {option.featured && (
                <span className={pricing.popularTag}>
                  <Layers3 size={16} aria-hidden="true" />
                  ẢO HÓA + LƯU TRỮ
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

function ProxmoxInfrastructure() {
  const icons = [Network, Layers3, ShieldCheck, FileCheck2];
  return (
    <section
      id="thanh-phan"
      className={infrastructure.section}
      aria-labelledby="proxmox-ceph-infrastructure-title"
    >
      <div className={infrastructure.container}>
        <div className={infrastructure.heading}>
          <span className={infrastructure.eyebrow}>
            <Network size={16} aria-hidden="true" />
            THIẾT KẾ ĐỒNG BỘ CÁC THÀNH PHẦN
          </span>
          <h2 id="proxmox-ceph-infrastructure-title">
            Nền tảng{" "}
            <span className={infrastructure.accent}>
              cho cụm ảo hóa của bạn
            </span>
          </h2>
          <p>
            Compute, storage, network và phục hồi cần được thiết kế cùng nhau,
            từ khảo sát tải đến kiểm thử trước khi bàn giao.
          </p>
        </div>
        <div className={infrastructure.rows}>
          {proxmoxCephInfrastructure.map((item, index) => {
            const Icon = icons[index];
            return (
              <article
                className={infrastructure.row}
                key={item.id}
                aria-labelledby={`proxmox-ceph-infrastructure-${item.id}`}
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
                    <h3 id={`proxmox-ceph-infrastructure-${item.id}`}>
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
            Trao đổi kiến trúc hạ tầng của bạn{" "}
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

function ProxmoxComparison() {
  const columns = [
    {
      key: "standalone",
      label: "Proxmox VE độc lập",
      text: "Khởi đầu trên một máy chủ",
    },
    {
      key: "cluster",
      label: "Proxmox Cluster HA",
      text: "Quản trị cụm và dự phòng dịch vụ",
    },
    {
      key: "ceph",
      label: "Proxmox + Ceph HCI",
      text: "Ảo hóa cùng lưu trữ phân tán",
    },
  ] as const;
  return (
    <section
      id="so-sanh"
      className={comparison.section}
      aria-labelledby="proxmox-ceph-comparison-title"
    >
      <div className="container">
        <div className={comparison.heading}>
          <div>
            <span className={comparison.eyebrow}>
              CHỌN KIẾN TRÚC THEO NHU CẦU
            </span>
            <h2 id="proxmox-ceph-comparison-title">
              Một node, Cluster HA <span>hay HCI?</span>
            </h2>
            <p>
              So sánh phạm vi của ba mô hình để cân đối nhu cầu ứng dụng, lưu
              trữ và công việc vận hành.
            </p>
          </div>
          <a className={comparison.consult} href={links.contact}>
            <MessagesSquare size={18} aria-hidden="true" />
            Liên hệ tư vấn <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
        <p id="proxmox-ceph-comparison-hint" className={comparison.hint}>
          Vuốt ngang để xem đủ các cột trên màn hình nhỏ.
        </p>
        <div
          className={comparison.frame}
          style={{ "--service-count": 3 } as CSSProperties}
        >
          <div
            className={comparison.rail}
            role="region"
            aria-label="Bảng so sánh Proxmox VE độc lập, Cluster HA và HCI"
            aria-describedby="proxmox-ceph-comparison-hint"
            tabIndex={0}
          >
            <table className={comparison.table}>
              <caption className="sr-only">
                So sánh Proxmox VE độc lập, Cluster HA và HCI
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
                      data-featured={c.key === "ceph" || undefined}
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
                {proxmoxCephComparison.map((row) => (
                  <tr key={row.criterion}>
                    <th scope="row">{row.criterion}</th>
                    {columns.map((c) => (
                      <td
                        key={c.key}
                        data-featured={c.key === "ceph" || undefined}
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
            HA và nhân bản dữ liệu không thay thế backup. Cần kiểm thử khả năng
            khôi phục theo mục tiêu RPO / RTO của ứng dụng.
          </span>
        </p>
      </div>
    </section>
  );
}

function ProxmoxProcess() {
  const icons = [ClipboardList, GitBranch, Settings2, FileCheck2];
  return (
    <section
      id="quy-trinh"
      className={environments.section}
      aria-labelledby="proxmox-ceph-process-title"
    >
      <div className="container">
        <div className={environments.heading}>
          <span className={environments.eyebrow}>TỪ KHẢO SÁT ĐẾN BÀN GIAO</span>
          <h2 id="proxmox-ceph-process-title">
            Rõ yêu cầu trước. Rõ kết quả khi bàn giao.
          </h2>
          <p>
            Thống nhất kiến trúc, kế hoạch chuyển đổi và tiêu chí nghiệm thu
            trước khi đưa workload vào vận hành.
          </p>
        </div>
        <div className={environments.appGrid}>
          {proxmoxCephSteps.map((step, index) => {
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

function ProxmoxFaqItem({ item }: { item: (typeof proxmoxCephFaq)[number] }) {
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

export function ProxmoxCephPage() {
  return (
    <main
      id="noi-dung"
      className={`${styles.page} ${styles.sectionSpacing} ${local.page}`}
    >
      <ProxmoxHero />
      <ProxmoxAdvantages />
      <ProxmoxArchitectures />
      <ProxmoxUseCases />
      <ProxmoxOptions />
      <ProxmoxInfrastructure />
      <div className={styles.technicalDetails}>
        <ProxmoxComparison />
        <ProxmoxProcess />
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
        aria-labelledby="proxmox-ceph-faq-title"
      >
        <div className={`container ${styles.faqLayout}`}>
          <div className={styles.sectionHeading}>
            <span className="eyebrow">CÂU HỎI THƯỜNG GẶP</span>
            <h2 id="proxmox-ceph-faq-title">
              Hiểu rõ trước khi triển khai Proxmox / Ceph
            </h2>
            <p>
              Node, lưu trữ, HA, backup và những điều cần đối chiếu trước khi
              lựa chọn kiến trúc.
            </p>
          </div>
          <div className={styles.faqs}>
            {proxmoxCephFaq.slice(0, 5).map((item) => (
              <ProxmoxFaqItem key={item.question} item={item} />
            ))}
            <details className={styles.moreFaqs}>
              <summary>
                Xem tất cả {proxmoxCephFaq.length} câu hỏi
                <span className={styles.chevron} aria-hidden="true">
                  +
                </span>
              </summary>
              <div>
                {proxmoxCephFaq.slice(5).map((item) => (
                  <ProxmoxFaqItem key={item.question} item={item} />
                ))}
              </div>
            </details>
          </div>
        </div>
      </section>
      <ConsultationCta
        id="proxmox-ceph-consultation"
        headingId="proxmox-ceph-cta-title"
        className={styles.consultationCta}
        eyebrow="TRAO ĐỔI CÙNG INTERDATA"
        title="Bắt đầu từ hạ tầng và ứng dụng của bạn."
        description="Chia sẻ cấu hình máy chủ, danh sách workload và mục tiêu phục hồi. InterData sẽ cùng bạn xác định mô hình Proxmox / Ceph và phạm vi triển khai phù hợp."
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
