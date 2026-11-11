import { SuccessStories } from "./success-stories";
import { PressCarousel } from "@/components/home/press-carousel";
import { press } from "@/data/content";
import { Newspaper } from "lucide-react";
import styles from "@/components/home/home.module.css";
import proofStyles from "./customer-proof.module.css";

/** Shared homepage content and presentation for service landing pages. */
export function CustomerProof({
  controlsOnCards = false,
  centerHeadings = false,
  withBadgeIcons = false,
}: {
  controlsOnCards?: boolean;
  centerHeadings?: boolean;
  withBadgeIcons?: boolean;
}) {
  const headingClass = `section-heading${centerHeadings ? ` ${proofStyles.centeredHeading}` : ""}`;
  return (
    <div className={styles.home}>
      <SuccessStories
        controlsOnCards={controlsOnCards}
        centerHeadings={centerHeadings}
        withBadgeIcons={withBadgeIcons}
      />
      <section
        id="bao-chi"
        className="press section"
        aria-labelledby="press-proof-title"
      >
        <div className="container">
          <div className={headingClass}>
            <div>
              <span className="eyebrow">
                {withBadgeIcons && <Newspaper size={16} aria-hidden="true" />}
                INTERDATA TRÊN BÁO CHÍ
              </span>
              <h2 id="press-proof-title">Báo Chí Nói Gì Về InterData?</h2>
              <p>
                Các bài viết về hoạt động, công nghệ và hợp tác của InterData.
                Nội dung do từng cơ quan báo chí xuất bản.
              </p>
            </div>
          </div>
          <PressCarousel items={press} controlsOnCards={controlsOnCards} />
        </div>
      </section>
    </div>
  );
}
