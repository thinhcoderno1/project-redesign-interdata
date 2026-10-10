import { ArrowUp, PhoneCall } from "lucide-react";
import styles from "./floating-contact.module.css";

export function FloatingContact() {
  return (
    <nav className={styles.contacts} aria-label="Liên hệ nhanh và tiện ích">
      <a
        className={`${styles.action} ${styles.zalo}`}
        href="https://zalo.me/2009180325727970604"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Liên hệ qua Zalo"
      >
        <svg
          viewBox="0 0 40 40"
          className={styles.brandIcon}
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M20 5C10.6 5 4 10.8 4 18.7c0 4.2 2 7.9 5.4 10.3l-1.2 5.6 6.6-3.3c1.7.5 3.4.8 5.2.8 9.4 0 16-5.7 16-13.4S29.4 5 20 5Z"
          />
          <text
            x="20"
            y="23"
            textAnchor="middle"
            fill="#0068ff"
            fontFamily="Arial, sans-serif"
            fontSize="12"
            fontWeight="700"
          >
            Zalo
          </text>
        </svg>
        <span className={styles.label} aria-hidden="true">
          Zalo
        </span>
      </a>
      <a
        className={`${styles.action} ${styles.facebook}`}
        href="https://www.facebook.com/interdata.com.vn"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Theo dõi InterData trên Facebook"
      >
        <svg
          viewBox="0 0 24 24"
          className={styles.facebookIcon}
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M13.7 22v-9.1h3.1l.5-3.6h-3.6V7c0-1 .3-1.8 1.8-1.8h1.9V2c-.3 0-1.5-.1-2.8-.1-2.8 0-4.7 1.7-4.7 4.9v2.5H6.8v3.6h3.1V22h3.8Z" />
        </svg>
        <span className={styles.label} aria-hidden="true">
          Facebook
        </span>
      </a>
      <a
        className={`${styles.action} ${styles.hotline}`}
        href="tel:1900636822"
        aria-label="Gọi hotline 1900 636 822"
      >
        <PhoneCall
          className={styles.lineIcon}
          size={28}
          strokeWidth={1.8}
          aria-hidden="true"
        />
        <span className={styles.label} aria-hidden="true">
          Hotline: 1900 636 822
        </span>
      </a>
      <a
        className={`${styles.action} ${styles.backToTop}`}
        href="#dau-trang"
        aria-label="Lên đầu trang"
      >
        <ArrowUp
          className={styles.lineIcon}
          size={28}
          strokeWidth={1.8}
          aria-hidden="true"
        />
        <span className={styles.label} aria-hidden="true">
          Lên đầu trang
        </span>
      </a>
    </nav>
  );
}
