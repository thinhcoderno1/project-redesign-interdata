import Image from "next/image";
import { links } from "@/data/content";
import { Icon } from "@/components/ui/icon";
import styles from "./consultation-cta.module.css";

type CtaAction = {
  label: string;
  href: string;
  newTab?: boolean;
};

export function ConsultationCta({
  id = "lien-he",
  headingId = "consultation-cta-title",
  eyebrow = "TRAO ĐỔI CÙNG INTERDATA",
  title = "Cấu hình phù hợp bắt đầu từ một bài toán rõ ràng.",
  description = "Cho chúng tôi biết ứng dụng, mức tải và kế hoạch của bạn. Cùng xác định dịch vụ và phương án triển khai tiếp theo.",
  image = "/images/cta/consultation-engineer.webp",
  primaryAction = { label: "Liên hệ tư vấn", href: links.contact },
  secondaryAction,
  className,
  withBadgeIcons = false,
}: {
  id?: string;
  headingId?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  image?: string;
  primaryAction?: CtaAction;
  secondaryAction?: CtaAction;
  className?: string;
  withBadgeIcons?: boolean;
}) {
  const primaryButton = (
    <a
      className={styles.button}
      href={primaryAction.href}
      target={primaryAction.newTab ? "_blank" : undefined}
      rel={primaryAction.newTab ? "noopener noreferrer" : undefined}
    >
      {primaryAction.label} <Icon name="arrow" />
    </a>
  );
  return (
    <section
      id={id}
      className={`final-section container${className ? ` ${className}` : ""}`}
      aria-labelledby={headingId}
    >
      <div className={styles.card}>
        <div className={styles.visual} aria-hidden="true">
          <div className={styles.orbit} />
          <Image
            src={image}
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
          {eyebrow && (
            <span className={styles.eyebrow}>
              {withBadgeIcons && <Icon name="headphones" />}
              {eyebrow}
            </span>
          )}
          <h2 id={headingId}>{title}</h2>
          <p>{description}</p>
          {secondaryAction ? (
            <div className={styles.actions}>
              {primaryButton}
              <a
                className={styles.secondaryAction}
                href={secondaryAction.href}
                target={secondaryAction.newTab ? "_blank" : undefined}
                rel={secondaryAction.newTab ? "noopener noreferrer" : undefined}
              >
                {secondaryAction.label} <Icon name="arrow" />
              </a>
            </div>
          ) : (
            primaryButton
          )}
        </div>
      </div>
    </section>
  );
}
