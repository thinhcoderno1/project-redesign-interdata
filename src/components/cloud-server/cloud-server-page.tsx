import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Cloud,
  Cpu,
  HardDrive,
  Headphones,
  KeyRound,
  Layers3,
  MessageCircle,
  Network,
  Check,
  AppWindow,
  CircleHelp,
} from "lucide-react";
import { ConsultationCta } from "@/components/home/consultation-cta";
import {
  CapacitySection,
  EducationSection,
} from "@/components/home/company-sections";
import { CustomerProof } from "@/components/shared/customer-proof";
import { TechnologyPartners } from "@/components/home/technology-partners";
import homeStyles from "@/components/home/home.module.css";
import base from "@/components/vps/vps.module.css";
import hero from "@/components/vps/hero.module.css";
import advantages from "@/components/vps/advantages.module.css";
import useCases from "@/components/vps/use-cases.module.css";
import infra from "@/components/vps/infrastructure.module.css";
import {
  cloudReasons,
  cloudUseCases,
  cloudInfrastructure,
  type CloudPrices,
} from "@/data/cloud-server";
import { cloudServerFaqs } from "@/data/cloud-server-faq";
import { CloudPricing } from "./pricing";
import { CloudServiceRange } from "./service-range";
import { CloudComparison } from "./comparison";
import { CloudDeployment } from "./environments";
import styles from "./cloud-server.module.css";

const reasonIcons = [Cpu, HardDrive, KeyRound, Layers3, Network, Headphones];
const benefits = [
  { icon: Cpu, title: "AMD & Intel Cloud" },
  { icon: HardDrive, title: "Lưu trữ NVMe U.2" },
  { icon: KeyRound, title: "Full Root Access" },
  { icon: Headphones, title: "Hỗ trợ 24/7" },
];

function CloudHero() {
  return (
    <section className={hero.hero} aria-labelledby="cloud-title">
      <div className={`${hero.stage} dark`}>
        <Image
          src="/images/cloud-server/hero.webp"
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
            <span aria-current="page">Cloud Server</span>
          </nav>
          <div className={hero.copy}>
            <span className={hero.badge}>
              <Cloud size={16} aria-hidden="true" />
              HẠ TẦNG CHO BƯỚC TIẾN TIẾP THEO
            </span>
            <h1 id="cloud-title">
              Cloud Server{" "}
              <span>
                Linh hoạt tài nguyên
                <br />
                Chủ động phát triển
              </span>
            </h1>
            <p className={hero.description}>
              Triển khai website, ứng dụng và cơ sở dữ liệu trên nền tảng AMD
              EPYC hoặc Intel Xeon Platinum. Lưu trữ NVMe U.2, toàn quyền quản
              trị và lựa chọn cấu hình theo nhu cầu thực tế.
            </p>
            <div className={hero.actions}>
              <a href="#pricing" className={`button ${hero.primary}`}>
                Xem bảng giá Cloud
                <ArrowRight size={20} aria-hidden="true" />
              </a>
              <a href="/lien-he/" className={`button ${hero.secondary}`}>
                <MessageCircle size={18} aria-hidden="true" />
                Tư vấn cấu hình
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CloudAdvantages() {
  return (
    <section
      className={advantages.advantages}
      aria-labelledby="cloud-advantages-title"
    >
      <div
        className={hero.benefitBar}
        role="group"
        aria-label="Điểm nổi bật Cloud Server InterData"
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
            <span className={`${advantages.eyebrow} ${styles.badgeWithIcon}`}>
              <Cloud size={16} aria-hidden="true" />
              NỀN TẢNG CLOUD CHO DOANH NGHIỆP
            </span>
            <h2 id="cloud-advantages-title">
              Vì sao chọn Cloud Server tại <span>InterData?</span>
            </h2>
            <p>
              Từ tài nguyên tính toán đến kết nối và quản trị, xây dựng môi
              trường phù hợp với ứng dụng hôm nay và kế hoạch mở rộng sau này.
            </p>
          </div>
          <div className={advantages.layout}>
            <div className={advantages.visual}>
              <Image
                src="/images/cloud-server/cluster.webp"
                alt="Minh họa cụm máy chủ kết nối trên nền tảng điện toán đám mây"
                width={1024}
                height={1024}
                sizes="(min-width: 900px) 32vw, 300px"
              />
            </div>
            {cloudReasons.map((reason, i) => {
              const Icon = reasonIcons[i];
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
            aria-label="Thông số nền tảng Cloud Server"
          >
            {[
              {
                icon: Cpu,
                value: "2 nền tảng",
                label: "AMD EPYC / Intel Xeon",
              },
              {
                icon: HardDrive,
                value: "NVMe U.2",
                label: "Lưu trữ theo cấu hình",
              },
              {
                icon: Network,
                value: "10 Gbps",
                label: "Network Port theo gói",
              },
              { icon: Headphones, value: "24/7", label: "Hỗ trợ kỹ thuật" },
            ].map(({ icon: Icon, value, label }) => (
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

function CloudUseCases() {
  return (
    <section
      className={useCases.useCases}
      aria-labelledby="cloud-use-cases-title"
    >
      <div className={useCases.container}>
        <div className={useCases.heading}>
          <span className={`${useCases.eyebrow} ${styles.badgeWithIcon}`}>
            <AppWindow size={16} aria-hidden="true" />
            ỨNG DỤNG THỰC TẾ
          </span>
          <h2 id="cloud-use-cases-title">
            <span>Cloud Server</span> cho dự án của bạn
          </h2>
          <p>
            Chọn môi trường theo bài toán cần giải quyết, từ một website đang
            tăng trưởng đến hệ thống ứng dụng cần cấu hình riêng.
          </p>
        </div>
        <div className={`${useCases.grid} ${styles.useCaseGrid}`}>
          {cloudUseCases.map((item) => (
            <article className={useCases.card} key={item.image}>
              <div className={useCases.illustration}>
                <Image
                  src={`/images/cloud-server/${item.image}.webp`}
                  alt=""
                  width={1536}
                  height={1024}
                  sizes="(min-width: 1100px) 30vw, (min-width: 700px) 44vw, 90vw"
                />
              </div>
              <div className={`${useCases.body} ${styles.useCaseBody}`}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <a href={item.href}>
                  {item.action}
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

function CloudInfrastructure() {
  return (
    <section
      className={infra.section}
      aria-labelledby="cloud-infrastructure-title"
    >
      <div className={infra.container}>
        <div className={infra.heading}>
          <span className={infra.eyebrow}>
            <Network size={16} aria-hidden="true" />
            HẠ TẦNG & KẾT NỐI
          </span>
          <h2 id="cloud-infrastructure-title">
            Nền tảng vận hành <span className={infra.accent}>Cloud Server</span>
          </h2>
          <p>
            CPU, lưu trữ và kết nối là ba yếu tố cần đối chiếu với tải ứng dụng
            khi lựa chọn cấu hình.
          </p>
        </div>
        <div className={infra.rows}>
          {cloudInfrastructure.map((item, i) => (
            <article className={infra.row} key={item.image}>
              <div className={infra.copy}>
                <svg
                  className={infra.panel}
                  viewBox="0 0 720 216"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M90 1H703Q719 1 719 17V199Q719 215 703 215H90Q80 215 74 207L8 118Q1 108 8 98L74 9Q80 1 90 1Z"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
                <span className={infra.number} aria-hidden="true">
                  0{i + 1}
                </span>
                <div className={infra.details}>
                  <h3>
                    {item.title}
                    <br />
                    <span className={infra.accent}>{item.accent}</span>
                  </h3>
                  <p>{item.text}</p>
                  <ul className={infra.benefits}>
                    {item.features.map((text) => (
                      <li key={text}>
                        <span className={infra.benefitIcon}>
                          <Check size={23} aria-hidden="true" />
                        </span>
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <figure className={infra.imageFrame}>
                <Image
                  src={`/images/cloud-server/${item.image}.webp`}
                  alt={`Ảnh minh họa ${item.accent}`}
                  fill
                  sizes="(min-width: 1000px) 56vw, 90vw"
                />
              </figure>
            </article>
          ))}
        </div>
        <div className={infra.footer}>
          <a className={infra.aboutLink} href="/gioi-thieu/">
            Tìm hiểu InterData
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

export function CloudServerPage({ prices }: { prices: CloudPrices }) {
  return (
    <main id="noi-dung" className={`${base.page} ${styles.page}`}>
      <CloudHero />
      <CloudAdvantages />
      <CloudServiceRange />
      <CloudUseCases />
      <CloudPricing initialPrices={prices} />
      <CloudInfrastructure />
      <CloudComparison />
      <CloudDeployment />
      <div className={`${homeStyles.home} ${base.homeSections}`}>
        <CapacitySection withBadgeIcons />
      </div>
      <CustomerProof controlsOnCards centerHeadings withBadgeIcons />
      <div className={`${homeStyles.home} ${base.homeSections}`}>
        <EducationSection title="Kiến tạo tương lai" withBadgeIcons />
        <TechnologyPartners withBadgeIcons />
      </div>
      <section
        className={`${base.section} ${base.subtle}`}
        aria-labelledby="cloud-faq-title"
      >
        <div className={`container ${base.faqLayout}`}>
          <div className={base.sectionHeading}>
            <span className={`eyebrow ${styles.badgeWithIcon}`}>
              <CircleHelp size={16} aria-hidden="true" />
              GIẢI ĐÁP TRƯỚC KHI TRIỂN KHAI
            </span>
            <h2 id="cloud-faq-title">Câu hỏi thường gặp về Cloud Server</h2>
            <p>
              Từ chọn cấu hình đến quyền quản trị, sao lưu và hỗ trợ trong quá
              trình vận hành.
            </p>
          </div>
          <div className={base.faqs}>
            {cloudServerFaqs.slice(0, 5).map((f) => (
              <Faq key={f.question} item={f} />
            ))}
            <details className={base.moreFaqs}>
              <summary>
                Xem tất cả {cloudServerFaqs.length} câu hỏi
                <span className={base.chevron} aria-hidden="true">
                  +
                </span>
              </summary>
              <div>
                {cloudServerFaqs.slice(5).map((f) => (
                  <Faq key={f.question} item={f} />
                ))}
              </div>
            </details>
          </div>
        </div>
      </section>
      <ConsultationCta
        withBadgeIcons
        id="cloud-consultation"
        headingId="cloud-cta-title"
        className={base.consultationCta}
        eyebrow="KHỞI ĐẦU CÙNG INTERDATA"
        title="Cloud Server phù hợp với bước phát triển của bạn."
        description="Chia sẻ ứng dụng, mức tải và kế hoạch mở rộng. InterData cùng bạn lựa chọn nền tảng, cấu hình và phương án triển khai phù hợp với ngân sách."
        image="/images/cloud-server/advisor.webp"
        primaryAction={{ label: "Xem bảng giá Cloud", href: "#pricing" }}
        secondaryAction={{
          label: "Chat với tư vấn viên",
          href: "https://www.facebook.com/interdata.com.vn/",
          newTab: true,
        }}
      />
    </main>
  );
}

function Faq({ item }: { item: { question: string; answer: string } }) {
  return (
    <details className={base.faq}>
      <summary>
        <h3>{item.question}</h3>
        <span className={base.chevron} aria-hidden="true">
          +
        </span>
      </summary>
      <div>{item.answer}</div>
    </details>
  );
}
