import { EducationSection } from "@/components/home/company-sections";
import homeStyles from "@/components/home/home.module.css";
import { CustomerProof } from "./customer-proof";
import styles from "./company-proof-sections.module.css";

/** The three company sections use the approved /thue-vps/ presentation. */
export function CompanyProofSections({
  withBadgeIcons = false,
}: {
  withBadgeIcons?: boolean;
}) {
  return (
    <div className={`${homeStyles.home} ${styles.sections}`}>
      <CustomerProof
        controlsOnCards
        centerHeadings
        withBadgeIcons={withBadgeIcons}
      />
      <div className={styles.education}>
        <EducationSection
          title="Kiến tạo tương lai"
          withBadgeIcons={withBadgeIcons}
        />
      </div>
    </div>
  );
}
