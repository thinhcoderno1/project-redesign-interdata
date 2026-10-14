import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { testimonials } from "@/data/content";
import content from "@/data/vps-content.json";
import styles from "./vps.module.css";

export function CustomerLogos() {
  return (
    <section className={styles.trustStrip} aria-label="Khách hàng InterData">
      <div className="container">
        <p>ĐỒNG HÀNH CÙNG KHÁCH HÀNG INTERDATA</p>
        <ul className={styles.customerLogos}>
          {testimonials.map((item) => (
            <li key={item.company}>
              <Image
                src={item.logo}
                alt={item.company}
                width={item.logoWidth}
                height={item.logoHeight}
                sizes="(min-width: 768px) 130px, 100px"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export { ServiceRange } from "./service-range";

export { UseCases } from "./use-cases";

export function Infrastructure() {
  const header = content.landing.headers.Infrastructure;
  return (
    <section
      className={`${styles.section} ${styles.infrastructure}`}
      aria-labelledby={header.id}
    >
      <Image
        src="/images/solutions/datacenter-aisle.webp"
        alt=""
        fill
        sizes="100vw"
        className={styles.infrastructurePhoto}
      />
      <div className={`container ${styles.infrastructureLayout}`}>
        <div className={styles.infrastructureCopy}>
          <span className="eyebrow">{header.eyebrow}</span>
          <h2 id={header.id}>{header.title}</h2>
          <p>{header.text}</p>
          <a className="button primary" href="/gioi-thieu/">
            Tìm hiểu InterData <ArrowRight size={17} aria-hidden="true" />
          </a>
        </div>
        <div className={styles.infrastructureCards}>
          {content.landing.infrastructure.map((item, index) => (
            <article key={item.title}>
              <span className={styles.infraNumber}>0{index + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
