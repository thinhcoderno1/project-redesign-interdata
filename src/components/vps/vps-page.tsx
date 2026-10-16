import Image from "next/image";
import { CustomerProof } from "@/components/shared/customer-proof";
import {
  CapacitySection,
  EducationSection,
} from "@/components/home/company-sections";
import { TechnologyPartners } from "@/components/home/technology-partners";
import homeStyles from "@/components/home/home.module.css";
import { Check } from "lucide-react";
import { ConsultationCta } from "@/components/home/consultation-cta";
import content from "@/data/vps-content.json";
import type { VpsPrices } from "@/data/vps-pricing";
import { Pricing } from "./pricing";
import { Environments } from "./environments";
import { Infrastructure, ServiceRange, UseCases } from "./showcase";
import styles from "./vps.module.css";
import { VpsHero } from "./hero";
import { VpsAdvantages } from "./advantages";
import { VpsComparison } from "./comparison";

type Block = { tag: string; text: string; function?: string };
function copy(blocks: Block[], tag: string, index = 0) {
  const block = blocks.filter((item) => item.tag === tag)[index];
  if (!block) throw new Error(`Missing VPS source text: ${tag} ${index}`);
  return block.text;
}
function Heading({
  blocks,
  id,
  title,
  eyebrow,
  text,
}: {
  blocks?: Block[];
  id: string;
  title?: string;
  eyebrow?: string;
  text?: string;
}) {
  return (
    <div className={styles.sectionHeading}>
      {(eyebrow || blocks?.some((item) => item.tag === "span")) && (
        <span className="eyebrow">{eyebrow || copy(blocks!, "span")}</span>
      )}
      <h2 id={id}>{title || copy(blocks!, "h2")}</h2>
      {(text || blocks?.some((item) => item.tag === "p")) && (
        <p>{text || copy(blocks!, "p")}</p>
      )}
    </div>
  );
}
export function VpsPage({ prices }: { prices: VpsPrices }) {
  const performance = content.landing.blocks.filter(
    (block) => block.function === "Performance",
  );
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
  return (
    <main id="noi-dung" className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c"),
        }}
      />
      <VpsHero />

      <VpsAdvantages />

      <ServiceRange />
      <UseCases />
      <Pricing initialPrices={prices} />
      <Infrastructure />

      <div className={styles.technicalDetails} id="vps-technical-details">
        <VpsComparison />

        <Environments />

        {/* Temporarily hidden; retain benchmark content for re-enabling. */}
        <section
          hidden
          className={styles.section}
          aria-labelledby="performance-title"
        >
          <div className="container">
            <Heading blocks={performance} id="performance-title" />
            <ul className={styles.benchmarkChecklist}>
              {content.landing.benchmarkChecklist.map((item) => (
                <li key={item}>
                  <Check size={18} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            {content.landing.benchmarkGroups.map((group) => (
              <div key={group.id} className={styles.benchmarkGroup}>
                <h3>{group.title}</h3>
                <div className={styles.benchmarks}>
                  {group.images.map((image) => (
                    <figure key={image.src}>
                      <a
                        href={image.src}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Mở ảnh đầy đủ: ${image.label}`}
                      >
                        <Image
                          src={image.src}
                          alt={image.alt}
                          width={image.width}
                          height={image.height}
                          sizes="(min-width: 1100px) 380px, (min-width: 768px) 44vw, 90vw"
                        />
                      </a>
                      <figcaption>
                        <ul>
                          {image.metrics.map((metric) => (
                            <li key={metric}>
                              <Check size={16} aria-hidden="true" />
                              <span>{metric}</span>
                            </li>
                          ))}
                        </ul>
                      </figcaption>
                    </figure>
                  ))}
                </div>
                <p className={styles.note}>{group.note}</p>
              </div>
            ))}
            <p className={styles.note}>{copy(performance, "p", 1)}</p>
          </div>
        </section>
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
        className={`${styles.section} ${styles.subtle}`}
        aria-labelledby="faq-title"
      >
        <div className={`container ${styles.faqLayout}`}>
          <Heading blocks={content.faq.blocks} id="faq-title" />
          <div className={styles.faqs}>
            {content.faq.items.slice(0, 5).map((item) => (
              <FaqItem key={item.question} item={item} />
            ))}
            <details className={styles.moreFaqs}>
              <summary>
                Xem tất cả {content.faq.items.length} câu hỏi <ChevronMark />
              </summary>
              <div>
                {content.faq.items.slice(5).map((item) => (
                  <FaqItem key={item.question} item={item} />
                ))}
              </div>
            </details>
          </div>
        </div>
      </section>

      <ConsultationCta
        id="vps-consultation"
        headingId="vps-cta-title"
        className={styles.consultationCta}
        eyebrow="KHỞI ĐẦU CÙNG INTERDATA"
        title="VPS phù hợp cho ứng dụng của bạn."
        description="Chia sẻ nhu cầu về website, ứng dụng hoặc hệ thống bạn muốn triển khai. InterData sẽ cùng bạn lựa chọn cấu hình VPS phù hợp với mức tải và ngân sách."
        image="/images/cta/consultation-woman-upper-body.webp"
        primaryAction={{ label: "Xem bảng giá VPS", href: "#pricing" }}
        secondaryAction={{
          label: "Chat với tư vấn viên",
          href: "https://www.facebook.com/interdata.com.vn/",
          newTab: true,
        }}
      />
    </main>
  );
}

function FaqItem({ item }: { item: { question: string; answer: string } }) {
  return (
    <details className={styles.faq}>
      <summary>
        <h3>{item.question}</h3>
        <ChevronMark />
      </summary>
      <div dangerouslySetInnerHTML={{ __html: item.answer }} />
    </details>
  );
}

function ChevronMark() {
  return (
    <span className={styles.chevron} aria-hidden="true">
      +
    </span>
  );
}
