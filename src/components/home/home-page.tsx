import homeStyles from "./home.module.css";
import companyJourneyStyles from "./company-journey.module.css";
import { Consultation } from "@/components/home/consultation";
import { ConsultationCta } from "@/components/home/consultation-cta";
import { Icon } from "@/components/ui/icon";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { CapacitySection } from "@/components/shared/capacity-section";
import { CompanyProofSections } from "@/components/shared/company-proof-sections";
import { HomeHero } from "@/components/home/hero";
import { InfrastructureServices } from "@/components/home/infrastructure-services";
import { HomeInfrastructure } from "@/components/home/infrastructure-section";
import solutionStyles from "@/components/home/solutions.module.css";
import { SolutionsCarousel } from "@/components/home/solutions-carousel";
import { TechnologyPartners } from "@/components/home/technology-partners";
import { PromotionCarousel } from "@/components/home/promotion-carousel";
import { KnowledgeResources } from "@/components/home/knowledge-resources";
import { links } from "@/data/content";

export function HomePage() {
  return (
    <>
      <main id="noi-dung" className={homeStyles.home}>
        <HomeHero />
        <div className={homeStyles.serviceJourney}>
          <section
            id="uu-dai"
            className="promotions container"
            aria-label="Chương trình ưu đãi"
          >
            <PromotionCarousel href={links.promotion} />
          </section>
          <InfrastructureServices />
        </div>
        <section
          id="giai-phap"
          className={`solutions dark section ${solutionStyles.section}`}
        >
          <div className={`container ${solutionStyles.layout}`}>
            <div className={solutionStyles.intro}>
              <div>
                <span className="eyebrow">
                  <Icon name="layers" />
                  GIẢI PHÁP TRIỂN KHAI
                </span>
                <h2>Từ tài nguyên đến môi trường chạy ứng dụng</h2>
              </div>
              <div className={solutionStyles.introDetail}>
                <p>
                  Đã xác định bài toán? Trao đổi cách tổ chức mạng riêng, máy
                  ảo, container và lưu trữ trên nền hạ tầng phù hợp.
                </p>
                <a href="#nhu-cau" className="text-link">
                  Tìm hướng triển khai <Icon name="arrow" />
                </a>
              </div>
            </div>
            <SolutionsCarousel />
          </div>
        </section>
        <div className={companyJourneyStyles.journey}>
          <CapacitySection />
          <CompanyProofSections withBadgeIcons />
          <TechnologyPartners withBadgeIcons />
        </div>
        <HomeInfrastructure />
        <Consultation />
        <ConsultationCta
          withBadgeIcons
          image="/images/cta/consultation-woman-upper-body.webp"
        />
        <KnowledgeResources />
        <ScrollReveal rootId="noi-dung" />
      </main>
    </>
  );
}
