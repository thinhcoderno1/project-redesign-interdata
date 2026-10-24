import TestimonialsSection from "./TestimonialsSection";
import PressSection from "./PressSection";
import styles from "./canh-me-proof.module.css";

export function CanhMeProof() {
  return (
    <div className={styles.proof}>
      <TestimonialsSection />
      <PressSection />
    </div>
  );
}
