import { MobilePricingSlider } from "@/components/shared/mobile-pricing-slider";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import {
  ArrowRight,
  Check,
  ClipboardList,
  Cloud,
  Code2,
  Database,
  FileCheck2,
  Files,
  FolderKey,
  HardDrive,
  Info,
  KeyRound,
  ListChecks,
  MessagesSquare,
  Network,
  RefreshCw,
  Settings2,
  ShieldCheck,
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
  s3Comparison,
  s3Faq,
  s3Infrastructure,
  s3Options,
  s3Reasons,
  s3Steps,
  s3UseCases,
} from "@/data/s3-object-storage";
import styles from "@/components/vps/vps.module.css";
import hero from "@/components/vps/hero.module.css";
import advantages from "@/components/vps/advantages.module.css";
import useCases from "@/components/vps/use-cases.module.css";
import pricing from "@/components/vps/pricing.module.css";
import infrastructure from "@/components/vps/infrastructure.module.css";
import comparison from "@/components/vps/comparison.module.css";
import environments from "@/components/vps/environments.module.css";
import homeStyles from "@/components/home/home.module.css";
import { S3Scenarios } from "./s3-scenarios";
import local from "./s3-object-storage.module.css";

function S3Hero() {
  return (
    <section className={hero.hero} aria-labelledby="s3-title">
      <div className={`${hero.stage} dark`}>
        <Image
          src="/images/s3-object-storage/hero-object-storage-v1.webp"
          alt=""
          fill
          sizes="(max-width: 899px) 300vw, (max-width: 1199px) 150vw, 100vw"
          loading="eager"
          fetchPriority="high"
          className={`${hero.backgroundImage} ${local.heroImage}`}
        />
        <div className={hero.container}>
          <nav className={hero.breadcrumb} aria-label="Đường dẫn trang">
            <Link href="/">Trang chủ</Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">S3 Object Storage</span>
          </nav>
          <div className={hero.copy}>
            <span className={hero.badge}>
              <Cloud size={16} aria-hidden="true" />
              LƯU TRỮ ĐỐI TƯỢNG · KẾT NỐI QUA API
            </span>
            <h1 id="s3-title" className={local.heroTitle}>
              S3 <span>OBJECT STORAGE</span>
            </h1>
            <p className={hero.description}>
              Lưu trữ hình ảnh, video, tài liệu và bản sao lưu theo mô hình
              object. Tách dữ liệu khỏi máy chủ ứng dụng, tích hợp qua S3 API và
              chọn phương án theo dung lượng, truy cập và nhu cầu phục hồi.
            </p>
            <div className={hero.actions}>
              <a href="#phuong-an" className={`button ${hero.primary}`}>
                Xem phương án <ArrowRight size={20} aria-hidden="true" />
              </a>
              <a href={links.contact} className={`button ${hero.secondary}`}>
                <MessagesSquare size={18} aria-hidden="true" /> Liên hệ tư vấn
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function S3Advantages() {
  const benefits = [
    { icon: Files, title: "Tách lớp dữ liệu" },
    { icon: Code2, title: "Kết nối S3 API" },
    { icon: FolderKey, title: "Phân quyền truy cập" },
    { icon: RefreshCw, title: "Mở rộng theo nhu cầu" },
  ];
  const icons = [Files, Code2, FolderKey, HardDrive, RefreshCw, ShieldCheck];
  const highlights = [
    { icon: Cloud, value: "Bucket", label: "Tổ chức dữ liệu" },
    { icon: Files, value: "Object", label: "Tệp & metadata" },
    { icon: Code2, value: "S3 API", label: "Tích hợp ứng dụng" },
    { icon: KeyRound, value: "Policy", label: "Kiểm soát truy cập" },
  ];
  return (
    <section
      className={advantages.advantages}
      aria-labelledby="s3-benefits-title"
    >
      <div
        className={`${hero.benefitBar} ${local.benefitsBar}`}
        role="group"
        aria-label="Lợi ích của S3 Object Storage"
      >
        {benefits.map(({ icon: Icon, title }) => (
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
              <Cloud size={16} aria-hidden="true" /> LƯU TRỮ THEO CÁCH ỨNG DỤNG
              CẦN
            </span>
            <h2 id="s3-benefits-title">
              Dữ liệu một nơi. <span>Ứng dụng dễ kết nối.</span>
            </h2>
            <p>
              Mỗi object gồm dữ liệu, metadata và một key trong bucket. Truy cập
              qua API để tổ chức tệp, tách quyền và quản lý vòng đời dữ liệu
              theo từng ứng dụng.
            </p>
          </div>
          <div className={advantages.layout}>
            <div className={advantages.visual}>
              <Image
                src="/images/s3-object-storage/object-storage.svg"
                alt="Minh họa bucket lưu trữ đối tượng kết nối hình ảnh, tài liệu và bản sao lưu"
                width={1000}
                height={1000}
                sizes="(min-width: 1200px) 410px, (min-width: 900px) 30vw, (min-width: 640px) 300px, 250px"
              />
            </div>
            {s3Reasons.map((reason, index) => {
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
            aria-label="Các thành phần của object storage"
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

function S3UseCases() {
  return (
    <section
      id="ung-dung"
      className={useCases.useCases}
      aria-labelledby="s3-use-cases-title"
    >
      <div className={useCases.container}>
        <div className={useCases.heading}>
          <span className={useCases.eyebrow}>ỨNG DỤNG THỰC TẾ</span>
          <h2 id="s3-use-cases-title">
            <span>S3 Object Storage</span> cho dữ liệu nào?
          </h2>
          <p>
            Từ tệp trên website đến bản backup của hệ thống. Chọn cách lưu trữ
            theo luồng truy cập và thời gian cần giữ dữ liệu.
          </p>
        </div>
        <div className={useCases.grid}>
          {s3UseCases.map((item) => (
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

function S3Options() {
  return (
    <section
      id="phuong-an"
      className={`${pricing.pricingSection} ${local.options}`}
      aria-labelledby="s3-options-title"
    >
      <div className={`container ${pricing.pricingLayout}`}>
        <div className={pricing.pricingIntro}>
          <span className={pricing.eyebrow}>
            <ListChecks size={16} aria-hidden="true" /> LỰA CHỌN THEO NHU CẦU
          </span>
          <h2 id="s3-options-title">Phương án S3 cho dữ liệu của bạn</h2>
          <p>
            Chọn theo cách bạn sử dụng dữ liệu. InterData cùng bạn xác định dung
            lượng, lưu lượng truy cập, chính sách lưu giữ và phạm vi triển khai
            phù hợp.
          </p>
        </div>
        <MobilePricingSlider
          className={`${pricing.planGrid} ${local.optionGrid}`}
        >
          {s3Options.map((option) => (
            <article
              id={`s3-option-${option.id}`}
              key={option.id}
              data-option={option.id}
              className={`${pricing.plan} ${option.featured ? pricing.accentPlan : ""}`}
            >
              {option.featured && (
                <span className={pricing.popularTag}>
                  <ShieldCheck size={16} aria-hidden="true" /> LƯU GIỮ & PHỤC
                  HỒI
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

function S3Infrastructure() {
  const icons = [HardDrive, KeyRound, Code2, ShieldCheck];
  return (
    <section
      id="tinh-nang"
      className={infrastructure.section}
      aria-labelledby="s3-infrastructure-title"
    >
      <div className={infrastructure.container}>
        <div className={infrastructure.heading}>
          <span className={infrastructure.eyebrow}>
            <Database size={16} aria-hidden="true" /> TỪ DỮ LIỆU ĐẾN VẬN HÀNH
          </span>
          <h2 id="s3-infrastructure-title">
            Thiết kế lưu trữ{" "}
            <span className={infrastructure.accent}>theo ứng dụng thực tế</span>
          </h2>
          <p>
            Dung lượng là điểm bắt đầu. Quyền truy cập, cách tích hợp và khả
            năng phục hồi quyết định dữ liệu được sử dụng thế nào.
          </p>
        </div>
        <div className={infrastructure.rows}>
          {s3Infrastructure.map((item, index) => {
            const Icon = icons[index];
            return (
              <article
                className={infrastructure.row}
                key={item.id}
                aria-labelledby={`s3-infrastructure-${item.id}`}
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
                    <h3 id={`s3-infrastructure-${item.id}`}>
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
            Trao đổi nhu cầu lưu trữ của bạn{" "}
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

function S3Comparison() {
  const columns = [
    {
      key: "object",
      label: "Object Storage",
      text: "Dữ liệu dạng đối tượng qua API",
    },
    {
      key: "block",
      label: "Block Storage",
      text: "Volume cho máy chủ & database",
    },
    { key: "file", label: "File Storage", text: "Tệp & thư mục dùng chung" },
  ] as const;
  return (
    <section
      id="so-sanh"
      className={comparison.section}
      aria-labelledby="s3-comparison-title"
    >
      <div className="container">
        <div className={comparison.heading}>
          <div>
            <span className={comparison.eyebrow}>CHỌN ĐÚNG LỚP LƯU TRỮ</span>
            <h2 id="s3-comparison-title">
              Object, Block <span>hay File Storage?</span>
            </h2>
            <p>
              Mỗi mô hình giải quyết một kiểu truy cập dữ liệu. S3 phù hợp với
              tệp qua API; ứng dụng cần ổ đĩa hoặc filesystem có yêu cầu khác.
            </p>
          </div>
          <a className={comparison.consult} href={links.contact}>
            <MessagesSquare size={18} aria-hidden="true" /> Liên hệ tư vấn{" "}
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
        <p id="s3-comparison-hint" className={comparison.hint}>
          Vuốt ngang để xem đủ các cột trên màn hình nhỏ.
        </p>
        <div
          className={comparison.frame}
          style={{ "--service-count": 3 } as CSSProperties}
        >
          <div
            className={comparison.rail}
            role="region"
            aria-label="Bảng so sánh Object, Block và File Storage"
            aria-describedby="s3-comparison-hint"
            tabIndex={0}
          >
            <table className={comparison.table}>
              <caption className="sr-only">
                So sánh Object Storage, Block Storage và File Storage theo nhu
                cầu ứng dụng
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
                      data-featured={c.key === "object" || undefined}
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
                {s3Comparison.map((row) => (
                  <tr key={row.criterion}>
                    <th scope="row">{row.criterion}</th>
                    {columns.map((c) => (
                      <td
                        key={c.key}
                        data-featured={c.key === "object" || undefined}
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
            S3-compatible không đồng nghĩa đầy đủ mọi tính năng Amazon S3. Cần
            đối chiếu API, versioning và chính sách bảo vệ dữ liệu theo nền tảng
            được chọn.
          </span>
        </p>
      </div>
    </section>
  );
}

function S3Process() {
  const icons = [ClipboardList, Network, Settings2, FileCheck2];
  return (
    <section
      id="quy-trinh"
      className={environments.section}
      aria-labelledby="s3-process-title"
    >
      <div className="container">
        <div className={environments.heading}>
          <span className={environments.eyebrow}>TỪ KHẢO SÁT ĐẾN BÀN GIAO</span>
          <h2 id="s3-process-title">
            Kết nối đúng. Kiểm thử trước khi chuyển.
          </h2>
          <p>
            Làm rõ dữ liệu đầu vào, yêu cầu tích hợp và tiêu chí nghiệm thu
            trước khi chuyển ứng dụng sang lớp lưu trữ mới.
          </p>
        </div>
        <div className={environments.appGrid}>
          {s3Steps.map((step, index) => {
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

function S3FaqItem({ item }: { item: (typeof s3Faq)[number] }) {
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

export function S3ObjectStoragePage() {
  return (
    <main
      id="noi-dung"
      className={`${styles.page} ${styles.sectionSpacing} ${local.page}`}
    >
      <S3Hero />
      <S3Advantages />
      <S3Scenarios />
      <S3UseCases />
      <S3Options />
      <S3Infrastructure />
      <div className={styles.technicalDetails}>
        <S3Comparison />
        <S3Process />
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
        aria-labelledby="s3-faq-title"
      >
        <div className={`container ${styles.faqLayout}`}>
          <div className={styles.sectionHeading}>
            <span className="eyebrow">CÂU HỎI THƯỜNG GẶP</span>
            <h2 id="s3-faq-title">Hiểu rõ trước khi chọn S3 Object Storage</h2>
            <p>
              Khả năng tương thích, cách bảo vệ dữ liệu và những thông tin nên
              chuẩn bị khi tư vấn.
            </p>
          </div>
          <div className={styles.faqs}>
            {s3Faq.slice(0, 5).map((item) => (
              <S3FaqItem key={item.question} item={item} />
            ))}
            <details className={styles.moreFaqs}>
              <summary>
                Xem tất cả {s3Faq.length} câu hỏi
                <span className={styles.chevron} aria-hidden="true">
                  +
                </span>
              </summary>
              <div>
                {s3Faq.slice(5).map((item) => (
                  <S3FaqItem key={item.question} item={item} />
                ))}
              </div>
            </details>
          </div>
        </div>
      </section>
      <ConsultationCta
        id="s3-consultation"
        headingId="s3-cta-title"
        className={styles.consultationCta}
        eyebrow="TRAO ĐỔI CÙNG INTERDATA"
        title="Bắt đầu từ dữ liệu bạn cần lưu."
        description="Chia sẻ dung lượng, loại tệp và cách ứng dụng đang truy cập dữ liệu. InterData sẽ cùng bạn lựa chọn phương án S3 Object Storage, chính sách lưu giữ và cách tích hợp phù hợp."
        image="/images/cta/consultation-woman-upper-body.webp"
        primaryAction={{ label: "Liên hệ", href: links.contact }}
        secondaryAction={{ label: "Xem phương án lưu trữ", href: "#phuong-an" }}
      />
    </main>
  );
}
