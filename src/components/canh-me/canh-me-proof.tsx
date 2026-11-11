import { SuccessStories } from "@/components/shared/success-stories";
import PressSection from "./PressSection";
import styles from "./canh-me-proof.module.css";

export function CanhMeProof() {
  return (
    <>
      <SuccessStories withBadgeIcons />
      <div className={styles.proof}>
        <PressSection />
      </div>
    </>
  );
}
