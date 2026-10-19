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
import { faqs } from "./data";
import type { VibePlan } from "@/data/vps-vibe-coding";
import styles from "./vibe.module.css";

export function VibePage({ plans }: { plans: VibePlan[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: "VPS Vibe Coding",
        serviceType: "Dịch vụ VPS cài sẵn nền tảng Vibe Coding",
        url: "https://interdata.vn/vps-vibe-coding/",
        provider: {
          "@type": "Organization",
          name: "InterData",
          url: "https://interdata.vn/",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Trang chủ",
            item: "https://interdata.vn/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "VPS Vibe Coding",
            item: "https://interdata.vn/vps-vibe-coding/",
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((item: { question: string; answer: string }) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };
  return (
    <main id="noi-dung" data-vibe-page className={styles.page}>
      <noscript>
        <style>{`[data-vibe-page] .info-content.is-collapsed{max-height:none;overflow:visible}[data-vibe-page] .info-fade,[data-vibe-page] .info-toggle-wrap,[data-vibe-page] .hero-vibe-widget,[data-vibe-page] .proof-controls{display:none}[data-vibe-page] .feedback-rail,[data-vibe-page] .press-rail{overflow-x:auto}[data-vibe-page] .feedback-track,[data-vibe-page] .press-track{animation:none}`}</style>
      </noscript>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
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
