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
  kubernetesComparison,
  kubernetesFaq,
  kubernetesInfrastructure,
  kubernetesOptions,
  kubernetesReasons,
  kubernetesSteps,
  kubernetesUseCases,
} from "@/data/kubernetes";
import styles from "@/components/vps/vps.module.css";
import hero from "@/components/vps/hero.module.css";
import advantages from "@/components/vps/advantages.module.css";
import useCases from "@/components/vps/use-cases.module.css";
import pricing from "@/components/vps/pricing.module.css";
import infrastructure from "@/components/vps/infrastructure.module.css";
import comparison from "@/components/vps/comparison.module.css";
import environments from "@/components/vps/environments.module.css";
import homeStyles from "@/components/home/home.module.css";
import { KubernetesArchitectures } from "./kubernetes-architectures";
import local from "./kubernetes.module.css";

function KubernetesHero() {
  return (
    <section className={hero.hero} aria-labelledby="kubernetes-title">
      <div className={`${hero.stage} dark`}>
        <Image
          src="/images/kubernetes/hero-kubernetes-v1.webp"
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
            <span aria-current="page">Kubernetes (K8s)</span>
          </nav>
          <div className={hero.copy}>
            <span className={hero.badge}>
              <Network size={16} aria-hidden="true" />
              ĐIỀU PHỐI CONTAINER · TRIỂN KHAI THEO CỤM
            </span>
            <h1 id="kubernetes-title">
              TRIỂN KHAI <span>KUBERNETES (K8S)</span>
            </h1>
            <p className={hero.description}>
              Xây dựng nền tảng triển khai ứng dụng container theo nhu cầu doanh
              nghiệp. Từ dev / staging đến production và cluster HA, với kiến
              trúc, quy trình triển khai và bàn giao vận hành rõ ràng.
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

function KubernetesAdvantages() {
  const benefitItems = [
    { icon: Network, title: "Điều phối container" },
    { icon: Layers3, title: "Phân tách môi trường" },
    { icon: ShieldCheck, title: "Kiểm soát truy cập" },
    { icon: Workflow, title: "Mở rộng theo nhu cầu" },
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
    { icon: Network, value: "Cluster", label: "Điều phối workload" },
    { icon: Layers3, value: "Namespace", label: "Tổ chức tài nguyên" },
    {
      icon: ShieldCheck,
      value: "CNI / CSI",
      label: "Mạng & Lưu trữ",
    },
    { icon: Route, value: "Backup", label: "Kiểm tra khôi phục" },
  ];
  return (
    <section
      className={advantages.advantages}
      aria-labelledby="kubernetes-benefits-title"
    >
      <div
        className={hero.benefitBar}
        role="group"
        aria-label="Lợi ích của Kubernetes (K8s)"
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
              NỀN TẢNG CONTAINER THEO ỨNG DỤNG
            </span>
            <h2 id="kubernetes-benefits-title">
              Chuẩn hóa triển khai. <span>Chủ động mở rộng.</span>
            </h2>
            <p>
              Kết nối ứng dụng, tài nguyên và quy trình vận hành trong một
              phương án. Chọn kiến trúc cluster theo workload, dữ liệu và mục
              tiêu phục hồi của hệ thống.
            </p>
          </div>
          <div className={advantages.layout}>
            <div className={advantages.visual}>
              <Image
                src="/images/kubernetes/advantages-containers-v1.webp"
                alt="Minh họa 3D các node chạy container kết nối qua thành phần điều phối trung tâm"
                width={1000}
                height={1000}
                sizes="(min-width: 1200px) 410px, (min-width: 900px) 30vw, (min-width: 640px) 300px, 250px"
              />
            </div>
            {kubernetesReasons.map((reason, index) => {
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
            aria-label="Các thành phần của nền tảng Kubernetes"
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

function KubernetesUseCases() {
  return (
    <section
      id="ung-dung"
      className={useCases.useCases}
      aria-labelledby="kubernetes-use-cases-title"
    >
      <div className={useCases.container}>
        <div className={useCases.heading}>
          <span className={useCases.eyebrow}>ỨNG DỤNG THỰC TẾ</span>
          <h2 id="kubernetes-use-cases-title">
            <span>Kubernetes (K8s)</span> cho nhu cầu nào?
          </h2>
          <p>
            Từ môi trường thử nghiệm đến dịch vụ nhiều thành phần. Đánh giá ứng
            dụng và cách vận hành trước khi lựa chọn Kubernetes.
          </p>
        </div>
        <div className={useCases.grid}>
          {kubernetesUseCases.map((item) => (
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

function KubernetesOptions() {
  return (
    <section
      id="phuong-an"
      className={`${pricing.pricingSection} ${local.options}`}
      aria-labelledby="kubernetes-options-title"
    >
      <div className={`container ${pricing.pricingLayout}`}>
        <div className={pricing.pricingIntro}>
          <span className={pricing.eyebrow}>
            <ListChecks size={16} aria-hidden="true" />
            PHƯƠNG ÁN TRIỂN KHAI
          </span>
          <h2 id="kubernetes-options-title">
            Chọn phương án theo môi trường triển khai
          </h2>
          <p>
            Bắt đầu từ ứng dụng, dữ liệu và mức độ sẵn sàng cần thiết. Trao đổi
            để xác định kiến trúc cluster và phạm vi triển khai phù hợp.
          </p>
        </div>
        <div className={`${pricing.planGrid} ${local.optionGrid}`}>
          {kubernetesOptions.map((option) => (
            <article
              id={`kubernetes-option-${option.id}`}
              key={option.id}
              data-option={option.id}
              className={`${pricing.plan} ${option.featured ? pricing.accentPlan : ""}`}
            >
              {option.featured && (
                <span className={pricing.popularTag}>
                  <Layers3 size={16} aria-hidden="true" />
                  DỰ PHÒNG THEO KIẾN TRÚC
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
        </div>
      </div>
    </section>
  );
}

function KubernetesInfrastructure() {
  const icons = [Network, Layers3, ShieldCheck, FileCheck2];
  return (
    <section
      id="thanh-phan"
      className={infrastructure.section}
      aria-labelledby="kubernetes-infrastructure-title"
    >
      <div className={infrastructure.container}>
        <div className={infrastructure.heading}>
          <span className={infrastructure.eyebrow}>
            <Network size={16} aria-hidden="true" />
            THIẾT KẾ ĐỒNG BỘ CÁC THÀNH PHẦN
          </span>
          <h2 id="kubernetes-infrastructure-title">
            Nền tảng{" "}
            <span className={infrastructure.accent}>cho cluster của bạn</span>
          </h2>
          <p>
            Control plane, worker, network và storage cần được thiết kế cùng
            nhau, từ khảo sát ứng dụng đến kiểm thử trước bàn giao.
          </p>
        </div>
        <div className={infrastructure.rows}>
          {kubernetesInfrastructure.map((item, index) => {
            const Icon = icons[index];
            return (
              <article
                className={infrastructure.row}
                key={item.id}
                aria-labelledby={`kubernetes-infrastructure-${item.id}`}
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
                    <h3 id={`kubernetes-infrastructure-${item.id}`}>
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

function KubernetesComparison() {
  const columns = [
    {
      key: "development",
      label: "Dev / Staging",
      text: "Chuẩn bị ứng dụng và quy trình",
    },
    {
      key: "production",
      label: "Production Cluster",
      text: "Vận hành theo phạm vi thiết kế",
    },
    {
      key: "ha",
      label: "Production HA",
      text: "Dự phòng và phục hồi theo hệ thống",
    },
  ] as const;
  return (
    <section
      id="so-sanh"
      className={comparison.section}
      aria-labelledby="kubernetes-comparison-title"
    >
      <div className="container">
        <div className={comparison.heading}>
          <div>
            <span className={comparison.eyebrow}>
              CHỌN KIẾN TRÚC THEO NHU CẦU
            </span>
            <h2 id="kubernetes-comparison-title">
              Dev / Staging, Production <span>hay HA?</span>
            </h2>
            <p>
              So sánh mục tiêu và phạm vi của từng phương án để chọn mức đầu tư
              phù hợp với ứng dụng và đội ngũ.
            </p>
          </div>
          <a className={comparison.consult} href={links.contact}>
            <MessagesSquare size={18} aria-hidden="true" />
            Liên hệ tư vấn <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
        <p id="kubernetes-comparison-hint" className={comparison.hint}>
          Vuốt ngang để xem đủ các cột trên màn hình nhỏ.
        </p>
        <div
          className={comparison.frame}
          style={{ "--service-count": 3 } as CSSProperties}
        >
          <div
            className={comparison.rail}
            role="region"
            aria-label="Bảng so sánh Dev / Staging, Production Cluster và Production HA"
            aria-describedby="kubernetes-comparison-hint"
            tabIndex={0}
          >
            <table className={comparison.table}>
              <caption className="sr-only">
                So sánh Dev / Staging, Production Cluster và Production HA
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
                      data-featured={c.key === "ha" || undefined}
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
                {kubernetesComparison.map((row) => (
                  <tr key={row.criterion}>
                    <th scope="row">{row.criterion}</th>
                    {columns.map((c) => (
                      <td
                        key={c.key}
                        data-featured={c.key === "ha" || undefined}
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
            HA của cluster không tự bảo đảm ứng dụng luôn sẵn sàng. Cần đánh giá
            replica, đường truy cập, lưu trữ và backup cùng nhau.
          </span>
        </p>
      </div>
    </section>
  );
}

function KubernetesProcess() {
  const icons = [ClipboardList, GitBranch, Settings2, FileCheck2];
  return (
    <section
      id="quy-trinh"
      className={environments.section}
      aria-labelledby="kubernetes-process-title"
    >
      <div className="container">
        <div className={environments.heading}>
          <span className={environments.eyebrow}>TỪ KHẢO SÁT ĐẾN BÀN GIAO</span>
          <h2 id="kubernetes-process-title">
            Rõ yêu cầu trước. Rõ kết quả khi bàn giao.
          </h2>
          <p>
            Thống nhất kiến trúc, cách triển khai ứng dụng và tiêu chí nghiệm
            thu trước khi đưa cluster vào vận hành.
          </p>
        </div>
        <div className={environments.appGrid}>
          {kubernetesSteps.map((step, index) => {
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

function KubernetesFaqItem({ item }: { item: (typeof kubernetesFaq)[number] }) {
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

export function KubernetesPage() {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Triển Khai Kubernetes (K8s)",
      serviceType: "Thiết kế và triển khai nền tảng Kubernetes",
      url: "https://interdata.vn/trien-khai-Kubernetes-k8s/",
      provider: {
        "@type": "Organization",
        name: "InterData",
        url: "https://interdata.vn/",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: kubernetesFaq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ];
  return (
    <main
      id="noi-dung"
      className={`${styles.page} ${styles.sectionSpacing} ${local.page}`}
    >
      {schemas.map((schema) => (
        <script
          key={schema["@type"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
          }}
        />
      ))}
      <KubernetesHero />
      <KubernetesAdvantages />
      <KubernetesArchitectures />
      <KubernetesUseCases />
      <KubernetesOptions />
      <KubernetesInfrastructure />
      <div className={styles.technicalDetails}>
        <KubernetesComparison />
        <KubernetesProcess />
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
        aria-labelledby="kubernetes-faq-title"
      >
        <div className={`container ${styles.faqLayout}`}>
          <div className={styles.sectionHeading}>
            <span className="eyebrow">CÂU HỎI THƯỜNG GẶP</span>
            <h2 id="kubernetes-faq-title">
              Hiểu rõ trước khi triển khai Kubernetes (K8s)
            </h2>
            <p>
              Ứng dụng, control plane, network, storage và những điều cần đối
              chiếu trước khi lựa chọn kiến trúc.
            </p>
          </div>
          <div className={styles.faqs}>
            {kubernetesFaq.slice(0, 5).map((item) => (
              <KubernetesFaqItem key={item.question} item={item} />
            ))}
            <details className={styles.moreFaqs}>
              <summary>
                Xem tất cả {kubernetesFaq.length} câu hỏi
                <span className={styles.chevron} aria-hidden="true">
                  +
                </span>
              </summary>
              <div>
                {kubernetesFaq.slice(5).map((item) => (
                  <KubernetesFaqItem key={item.question} item={item} />
                ))}
              </div>
            </details>
          </div>
        </div>
      </section>
      <ConsultationCta
        id="kubernetes-consultation"
        headingId="kubernetes-cta-title"
        className={styles.consultationCta}
        eyebrow="TRAO ĐỔI CÙNG INTERDATA"
        title="Bắt đầu từ hạ tầng và ứng dụng của bạn."
        description="Chia sẻ ứng dụng, hạ tầng và quy trình triển khai hiện tại. InterData sẽ cùng bạn xác định kiến trúc Kubernetes và phạm vi công việc phù hợp."
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
