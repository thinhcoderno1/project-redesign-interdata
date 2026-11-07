import { Building2 } from "lucide-react";
import { claims, reviewMode } from "@/data/content";
import { ClaimNote } from "@/components/home/claim-note";
import { CapacityStats } from "./capacity-stats";
import { CapacityNetworkMap } from "./capacity-network-map";
import styles from "./capacity-section.module.css";

/** Shared capacity presentation for the homepage and all service pages. */
export function CapacitySection() {
  const visibleClaims = claims.filter(
    (claim) => reviewMode || claim.status === "approved",
  );
  const capacityClaim = visibleClaims.find((claim) => claim.id === "business");
  const headingParts = capacityClaim?.text.match(/^(.*?Doanh Nghiệp)\s+(.+)$/);
  const stats = visibleClaims
    .filter((claim) => ["years", "customers", "servers"].includes(claim.id))
    .map((claim) => {
      const [value, ...label] = claim.text.split(" ");
      return { id: claim.id, value, label: label.join(" ") };
    });

  return (
    <section
      id="nang-luc"
      className={`capacity ${styles.section}`}
      aria-labelledby="capacity-heading"
    >
      <CapacityNetworkMap />
      <div className={`container capacity-content ${styles.content}`}>
        <span className={styles.eyebrow}>
          <Building2 size={16} aria-hidden="true" />
          NĂNG LỰC INTERDATA
        </span>
        <h2 id="capacity-heading" className={styles.heading}>
          {headingParts ? (
            <>
              <span className={styles.highlight}>{headingParts[1]}</span>
              <br />
              {headingParts[2]}
            </>
          ) : (
            capacityClaim?.text || "Hạ tầng cho doanh nghiệp và người dùng"
          )}
        </h2>
        <p className={styles.description}>
          InterData cung cấp dịch vụ máy chủ và giải pháp triển khai cho
          website, ứng dụng và hệ thống doanh nghiệp. Mỗi nhu cầu được xem xét
          theo tài nguyên và yêu cầu vận hành thực tế.
        </p>
        <CapacityStats items={stats} />
        <ClaimNote />
      </div>
    </section>
  );
}
