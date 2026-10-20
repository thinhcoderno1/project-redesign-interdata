import {
  ArrowRight,
  GitCompareArrows,
  Info,
  MessagesSquare,
} from "lucide-react";
import {
  cloudComparisonColumns,
  cloudComparisonRows,
  cloudComparisonTitle,
  cloudComparisonNote,
} from "@/data/cloud-server-comparison";
import { CloudComparisonRail } from "./comparison-rail";
import styles from "./comparison.module.css";

export function CloudComparison() {
  return (
    <section
      className={styles.section}
      aria-labelledby="cloud-comparison-title"
    >
      <div className="container">
        <div className={styles.heading}>
          <div>
            <span className={styles.eyebrow}>
              <GitCompareArrows size={16} aria-hidden="true" />
              CHỌN NỀN TẢNG PHÙ HỢP
            </span>
            <h2 id="cloud-comparison-title">
              So Sánh Các Dòng Cloud Server Tại <span>InterData</span>
            </h2>
            <p>
              So sánh nhanh nền tảng phần cứng, đường truyền và chính sách tài
              nguyên trước khi chọn gói Cloud Server.
            </p>
          </div>
          <a className={styles.consult} href="/lien-he/">
            <MessagesSquare size={18} aria-hidden="true" />
            Liên hệ tư vấn
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
        <CloudComparisonRail
          columns={cloudComparisonColumns}
          rows={cloudComparisonRows}
          label={cloudComparisonTitle}
        />
        <p className={styles.note}>
          <Info size={19} aria-hidden="true" />
          <span>{cloudComparisonNote}</span>
        </p>
      </div>
    </section>
  );
}
