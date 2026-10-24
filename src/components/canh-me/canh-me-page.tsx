import Hero from "./Hero";
import HotDeals from "./HotDeals";
import InfoSection from "./InfoSection";
import ZaloHotDealsSection from "./ZaloHotDealsSection";
import { CanhMeProof } from "./canh-me-proof";
import { deals, faqs, GID_ORDER } from "./data";
import type { ApiProduct } from "@/lib/canh-me-pricing";
import styles from "./canh-me.module.css";
import theme from "./canh-me-theme.module.css";

export function CanhMePage({
  pricingByGid,
}: {
  pricingByGid: Record<number, ApiProduct[]>;
}) {
  const orderedDeals = GID_ORDER.flatMap((gid) =>
    deals.filter((deal) => deal.gid === gid && !deal.hidden),
  );
  return (
    <main id="main-content" className={`${styles.page} ${theme.theme} cm-page`}>
      <Hero />
      <HotDeals deals={orderedDeals} pricingByGid={pricingByGid} />
      <ZaloHotDealsSection />
      <CanhMeProof />
      <section className="cm-section cm-faq" aria-labelledby="canhme-faq-title">
        <div className="cm-section-heading">
          <span className="cm-pill">FAQs</span>
          <h2 id="canhme-faq-title">Một số câu hỏi thường gặp</h2>
        </div>
        <div className="cm-faq-grid">
          {faqs.map(([question, answer]) => (
            <details className="cm-faq-item" key={question}>
              <summary>
                {question}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
      <InfoSection />
    </main>
  );
}
