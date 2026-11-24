"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import type { ReactNode } from "react";
import styles from "./info-section.module.css";

export function InfoDisclosure({ children }: { children: ReactNode }) {
  return (
    <details
      className={styles.disclosure}
      ref={(details) => {
        if (details) details.dataset.enhanced = "";
      }}
      onToggle={({ currentTarget: details }) => {
        if (details.open) details.querySelector("h3")?.focus();
      }}
    >
      <summary className={styles.toggle}>
        <span className={styles.showMore}>Xem thêm</span>
        <span className={styles.showLess}>Thu gọn</span>
        <ChevronDown size={18} aria-hidden="true" />
      </summary>
      {children}
      <button
        type="button"
        className={`${styles.toggle} ${styles.closeButton}`}
        onClick={({ currentTarget: button }) => {
          const details = button.closest("details");
          if (!details) return;
          details.open = false;
          const summary = details.querySelector("summary");
          summary?.focus({ preventScroll: true });
          summary?.scrollIntoView({ block: "center", behavior: "instant" });
        }}
      >
        Thu gọn <ChevronUp size={18} aria-hidden="true" />
      </button>
    </details>
  );
}
