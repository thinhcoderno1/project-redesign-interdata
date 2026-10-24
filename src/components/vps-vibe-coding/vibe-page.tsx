import Hero from "./Hero";
import PricingSection from "./PricingSection";
import VibeIntro from "./VibeIntro";
import EzyPlatformSection from "./EzyPlatformSection";
import InfraSection from "./InfraSection";
import WhyInterDataSection from "./WhyInterDataSection";
import UseCasesSection from "./UseCasesSection";
import ProcessSection from "./ProcessSection";
import RolesSection from "./RolesSection";
import SocialProofSection from "./SocialProofSection";
import FAQSection from "./FAQSection";
import InfoSection from "./InfoSection";
import MobileCTA from "./MobileCTA";
import type { VibePlan } from "@/data/vps-vibe-coding";
import styles from "./vibe.module.css";

export function VibePage({ plans }: { plans: VibePlan[] }) {
  return (
    <main id="noi-dung" data-vibe-page className={styles.page}>
      <noscript>
        <style>{`[data-vibe-page] .info-content.is-collapsed{max-height:none;overflow:visible}[data-vibe-page] .info-fade,[data-vibe-page] .info-toggle-wrap,[data-vibe-page] .hero-vibe-widget,[data-vibe-page] .proof-controls{display:none}[data-vibe-page] .feedback-rail,[data-vibe-page] .press-rail{overflow-x:auto}[data-vibe-page] .feedback-track,[data-vibe-page] .press-track{animation:none}`}</style>
      </noscript>

      <Hero />
      <PricingSection initialPlans={plans} />
      <VibeIntro />
      <EzyPlatformSection />
      <InfraSection />
      <WhyInterDataSection />
      <UseCasesSection />
      <ProcessSection />
      <RolesSection />
      <SocialProofSection />
      <FAQSection />
      <InfoSection />
      <MobileCTA />
    </main>
  );
}
