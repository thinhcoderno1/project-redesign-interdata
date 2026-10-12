import Image from "next/image";
import { CustomerProof } from "@/components/shared/customer-proof";
import Link from "next/link";
import {
  Check,
  ArrowRight,
  Cpu,
  Database,
  Network,
  Globe2,
  Gauge,
  ShieldCheck,
  KeyRound,
  Headphones,
  CloudCog,
  Layers3,
  Code2,
  ShoppingCart,
  Workflow,
  Wrench,
  Server,
  HardDrive,
  type LucideIcon,
} from "lucide-react";
import content from "@/data/vps-content.json";
import type { VpsPrices } from "@/data/vps-pricing";
import { Pricing } from "./pricing";
import { Environments } from "./environments";
import styles from "./vps.module.css";

type Block = { tag: string; text: string; function?: string };
const icons: Record<string, LucideIcon> = {
  Cpu,
  Database,
  Network,
  Globe2,
  Gauge,
  ShieldCheck,
  KeyRound,
  Headphones,
  CloudCog,
  Layers3,
  Code2,
  ShoppingCart,
  Workflow,
  Wrench,
  Server,
  HardDrive,
};
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
function Cards({
  items,
  four = false,
}: {
  items: { icon?: string; title: string; text: string; number?: string }[];
  four?: boolean;
}) {
  return (
    <div className={four ? styles.fourCards : styles.cards}>
      {items.map((item) => {
        const Icon = icons[item.icon || "Server"] || Server;
        return (
          <article key={item.title} className={styles.card}>
            {item.number ? (
              <span className={styles.step}>{item.number}</span>
            ) : (
              <span className={styles.cardIcon}>
                <Icon size={24} aria-hidden="true" />
              </span>
            )}
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        );
      })}
    </div>
  );
}
function ComparisonTable({
  columns,
  rows,
  criterion,
  label,
}: {
  columns: { key: string; label: string; featured?: boolean }[];
  rows: Record<string, string>[];
  criterion: string;
  label: string;
}) {
  return (
    <div
      className={styles.tableScroll}
      role="region"
      aria-label={`Bảng so sánh: ${label}`}
      tabIndex={0}
    >
      <table>
        <caption className={styles.srOnly}>{label}</caption>
        <thead>
          <tr>
            <th scope="col">Tiêu chí</th>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={column.featured ? styles.featuredColumn : undefined}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[criterion]}>
              <th scope="row">{row[criterion]}</th>
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={column.featured ? styles.featuredCell : undefined}
                >
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function VpsPage({ prices }: { prices: VpsPrices }) {
  const definition = content.landing.blocks.filter(
    (block) => block.function === "VpsDefinition",
  );
  const performance = content.landing.blocks.filter(
    (block) => block.function === "Performance",
  );
  const learning = content.learning.blocks;
  const learningColumns = [
    { key: "hosting", label: "Shared Hosting" },
    { key: "vps", label: "VPS", featured: true },
    { key: "cloud", label: "Cloud Server" },
    { key: "dedicated", label: "Dedicated Server" },
  ];
  const terminal = content.cta.blocks
    .filter((block) => block.tag === "p")
    .slice(0, -1);
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
      <section className={`${styles.hero} dark`} aria-labelledby="vps-title">
        <Image
          src={content.hero.background}
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
        <div className={`container ${styles.heroContent}`}>
          <nav className={styles.breadcrumb} aria-label="Đường dẫn trang">
            <Link href="/">Trang chủ</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Thuê VPS</span>
          </nav>
          <div className={styles.heroCopy}>
            <span className={styles.heroBadge}>
              {copy(content.hero.blocks, "span")}
            </span>
            <h1 id="vps-title">{copy(content.hero.blocks, "h1")}</h1>
            <p className={styles.heroLead}>{copy(content.hero.blocks, "p")}</p>
            <p className={styles.heroDescription}>
              {copy(content.hero.blocks, "p", 1)}
            </p>
            <div className={styles.actions}>
              <a href="#pricing" className="button primary">
                {copy(content.hero.blocks, "a")}
                <ArrowRight size={18} aria-hidden="true" />
              </a>
              <a
                href="https://www.facebook.com/interdata.com.vn/"
                className={`button ${styles.heroSecondary}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {copy(content.hero.blocks, "a", 1)}
              </a>
            </div>
            <ul className={styles.heroTicks}>
              {content.hero.ticks.map((item) => (
                <li key={item}>
                  <Check size={17} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <dl className={styles.proof}>
            {content.hero.proof.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Pricing initialPrices={prices} />

      <section
        className={`${styles.section} ${styles.subtle}`}
        aria-labelledby="vps-comparison-title"
      >
        <div className="container">
          <Heading
            blocks={content.comparison.blocks}
            id="vps-comparison-title"
          />
          <ComparisonTable
            columns={content.comparison.columns}
            rows={content.comparison.rows}
            criterion="criteria"
            label={copy(content.comparison.blocks, "h2")}
          />
          <p className={styles.note}>
            {copy(content.comparison.blocks, "p", 1)}
          </p>
        </div>
      </section>

      <section
        className={styles.section}
        aria-labelledby="vps-definition-title"
      >
        <div className={`container ${styles.definition}`}>
          <div>
            <span className="eyebrow">{copy(definition, "span")}</span>
            <h2 id="vps-definition-title">{copy(definition, "h2")}</h2>
            <p>{copy(definition, "p")}</p>
            <p>{copy(definition, "p", 1)}</p>
          </div>
          <div className={styles.definitionSteps}>
            {content.landing.definitionCards.map(([title, text], index) => (
              <article key={title}>
                <span className={styles.step}>0{index + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className={`${styles.section} ${styles.subtle}`}
        aria-labelledby={content.landing.headers.Infrastructure.id}
      >
        <div className="container">
          <Heading {...content.landing.headers.Infrastructure} />
          <Cards items={content.landing.infrastructure} four />
        </div>
      </section>
      <section
        className={styles.section}
        aria-labelledby={content.landing.headers.WhyInterData.id}
      >
        <div className="container">
          <Heading {...content.landing.headers.WhyInterData} />
          <Cards items={content.landing.reasons} />
        </div>
      </section>

      <Environments />

      <section className={styles.section} aria-labelledby="performance-title">
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

      <section
        className={`${styles.section} ${styles.subtle}`}
        aria-labelledby={content.landing.headers.UseCases.id}
      >
        <div className="container">
          <Heading {...content.landing.headers.UseCases} />
          <Cards items={content.landing.useCases} />
        </div>
      </section>
      <section
        className={styles.section}
        aria-labelledby={content.landing.headers.GettingStarted.id}
      >
        <div className="container">
          <Heading {...content.landing.headers.GettingStarted} />
          <Cards items={content.landing.process} four />
          <div className={styles.center}>
            <a href="#pricing" className="button primary">
              {copy(
                content.landing.blocks.filter(
                  (item) => item.function === "GettingStarted",
                ),
                "a",
              )}
              <ArrowRight size={17} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <CustomerProof />

      <section
        className={`${styles.section} ${styles.subtle}`}
        aria-labelledby="faq-title"
      >
        <div className="container">
          <Heading blocks={content.faq.blocks} id="faq-title" />
          <div className={styles.faqs}>
            {[content.faq.items.slice(0, 10), content.faq.items.slice(10)].map(
              (items, index) => (
                <div key={index}>
                  {items.map((item) => (
                    <details className={styles.faq} key={item.question}>
                      <summary>
                        <h3>{item.question}</h3>
                        <ChevronMark />
                      </summary>
                      <div dangerouslySetInnerHTML={{ __html: item.answer }} />
                    </details>
                  ))}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      <section
        className={`${styles.section} ${styles.cta} dark`}
        aria-labelledby="vps-cta-title"
      >
        <div className={`container ${styles.ctaLayout}`}>
          <div className={styles.terminal}>
            <span className={styles.terminalLabel}>Minh họa</span>
            <div className={styles.terminalDots} aria-hidden="true">
              ● ● ●
            </div>
            <pre>{terminal.map((block) => block.text).join("\n")}</pre>
          </div>
          <div>
            <span className="eyebrow">Bắt đầu với InterData</span>
            <h2 id="vps-cta-title">{copy(content.cta.blocks, "h2")}</h2>
            <p>
              {
                content.cta.blocks.filter((block) => block.tag === "p").at(-1)
                  ?.text
              }
            </p>
            <div className={styles.actions}>
              <a href="#pricing" className={`button ${styles.whiteButton}`}>
                Xem bảng giá
                <ArrowRight size={17} aria-hidden="true" />
              </a>
              <a
                href="https://www.facebook.com/interdata.com.vn/"
                target="_blank"
                rel="noopener noreferrer"
                className={`button ${styles.heroSecondary}`}
              >
                Chat với tư vấn viên
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="vps-learning-title">
        <div className="container">
          <Heading blocks={learning} id="vps-learning-title" />
          <details className={styles.learningDetails}>
            <summary>
              <span className={styles.expandLabel}>Xem thêm nội dung</span>
              <span className={styles.collapseLabel}>Thu gọn nội dung</span>
              <ChevronMark />
            </summary>
            <div className={styles.learningContent} id="vps-learning-content">
              <h3>{copy(learning, "h3")}</h3>
              <p>{copy(learning, "p", 1)}</p>
              <p>{copy(learning, "p", 2)}</p>
              <Cards
                items={content.learning.resources.map((item) => ({
                  icon: item.icon,
                  title: item.term,
                  text: item.description,
                }))}
              />
              <h3>{copy(learning, "h3", 1)}</h3>
              <p>{copy(learning, "p", 3)}</p>
              <ComparisonTable
                columns={learningColumns}
                rows={content.learning.comparisonRows}
                criterion="criterion"
                label="So sánh Shared Hosting, VPS, Cloud Server và Dedicated Server"
              />
              <h3>{copy(learning, "h3", 2)}</h3>
              <p>{copy(learning, "p", 4)}</p>
              <Cards items={content.learning.workloads} />
              <h3>{copy(learning, "h3", 3)}</h3>
              <ul className={styles.checklist}>
                {content.learning.operationsChecklist.map((item) => (
                  <li key={item}>
                    <Check size={17} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <aside className={styles.upgrade}>
                <h3>{copy(learning, "h3", 4)}</h3>
                <p>{copy(learning, "p", 5)}</p>
              </aside>
            </div>
          </details>
        </div>
      </section>
    </main>
  );
}

function ChevronMark() {
  return (
    <span className={styles.chevron} aria-hidden="true">
      +
    </span>
  );
}
