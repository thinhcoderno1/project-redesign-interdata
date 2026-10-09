import Image from "next/image";
import { links } from "@/data/content";
import { Icon } from "./icon";
import styles from "./consultation-cta.module.css";

export function ConsultationCta() {
  return (
    <section
      id="lien-he"
      className="final-section container"
      aria-labelledby="consultation-cta-title"
    >
      <div className={styles.card}>
        <div className={styles.visual} aria-hidden="true">
          <div className={styles.orbit} />
          <Image
            src="/images/cta/consultation-engineer.webp"
            alt=""
            width={1254}
            height={1254}
            sizes="(max-width: 639px) 280px, (max-width: 959px) 300px, 380px"
            className={styles.illustration}
          />
          <span className={`${styles.visualIcon} ${styles.cloud}`}>
            <Icon name="cloud" />
          </span>
          <span className={`${styles.visualIcon} ${styles.support}`}>
            <Icon name="headphones" />
          </span>
          <span className={`${styles.visualIcon} ${styles.network}`}>
            <Icon name="network" />
          </span>
        </div>
        <div className={styles.content}>
          <span className={styles.eyebrow}>TRAO ĐỔI CÙNG INTERDATA</span>
          <h2 id="consultation-cta-title">
            Cấu hình phù hợp bắt đầu từ một bài toán rõ ràng.
          </h2>
          <p>
            Cho chúng tôi biết ứng dụng, mức tải và kế hoạch của bạn. Cùng xác
            định dịch vụ và phương án triển khai tiếp theo.
          </p>
          <a className={styles.button} href={links.contact}>
            Liên hệ tư vấn <Icon name="arrow" />
          </a>
        </div>
      </div>
    </section>
  );
}
