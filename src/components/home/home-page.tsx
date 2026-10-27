import homeStyles from "./home.module.css";
import companyJourneyStyles from "./company-journey.module.css";
import Image from "next/image";
import { Consultation } from "@/components/home/consultation";
import { ConsultationCta } from "@/components/home/consultation-cta";
import { Icon } from "@/components/ui/icon";
import { CapacitySection } from "./company-sections";
import { ClaimNote } from "./claim-note";
import { CompanyProofSections } from "@/components/shared/company-proof-sections";
import { ParallaxBackground } from "@/components/ui/parallax-background";
import { HeroHeading } from "@/components/home/hero-heading";
import { InfrastructureServices } from "@/components/home/infrastructure-services";
import { HomeInfrastructure } from "@/components/home/infrastructure-section";
import solutionStyles from "@/components/home/solutions.module.css";
import { SolutionsCarousel } from "@/components/home/solutions-carousel";
import { TechnologyPartners } from "@/components/home/technology-partners";
import { PromotionCarousel } from "@/components/home/promotion-carousel";
import { KnowledgeResources } from "@/components/home/knowledge-resources";
import { claims, links, reviewMode, showEditorialNotes } from "@/data/content";

export function HomePage() {
  const visibleClaims = claims.filter(
    (c) => reviewMode || c.status === "approved",
  );
  const featureClaims = visibleClaims.filter((c) =>
    ["uptime", "support", "bandwidth"].includes(c.id),
  );
  return (
    <>
      <main id="noi-dung" className={homeStyles.home}>
        <section className="hero-shell" aria-labelledby="hero-title">
          <div className="hero">
            <ParallaxBackground className="hero-background">
              <Image
                src="/images/solutions/datacenter-aisle.webp"
                alt=""
                fill
                priority
                sizes="100vw"
                className="hero-photo"
              />
            </ParallaxBackground>
            <div className="hero-overlay" />
            <div className="hero-content">
              <span className="hero-badge">
                <Icon name="network" />
                HẠ TẦNG CHO HỆ THỐNG CỦA BẠN
              </span>
              <HeroHeading />
              <p>
                Từ một website đến hệ thống doanh nghiệp.
                <br className="desktop-break" /> Chọn tài nguyên và cách triển
                khai phù hợp cùng InterData.
              </p>
              <div className="hero-actions">
                <a href={links.trial} className="button hero-trial">
                  <span className="hero-trial-icon" aria-hidden="true">
                    <Icon name="external" />
                  </span>
                  <span className="hero-trial-label">Dùng thử miễn phí</span>
                </a>
              </div>
              <ClaimNote />
            </div>
            {showEditorialNotes && (
              <span className="photo-credit">
                Ảnh minh họa datacenter · Tệp người dùng cung cấp
              </span>
            )}
          </div>
        </section>
        <div className={homeStyles.serviceJourney}>
          <section
            id="uu-dai"
            className={`promotions container${featureClaims.length > 0 ? " promotions-with-features" : ""}`}
            aria-label="Chương trình ưu đãi"
          >
            {featureClaims.length > 0 && (
              <ul className="hero-features">
                {featureClaims.map((c, i) => (
                  <li key={c.id}>
                    <Icon name={["shield", "headphones", "network"][i]} />
                    <span>{c.text}</span>
                  </li>
                ))}
              </ul>
            )}
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
          <CapacitySection withBadgeIcons animateNumbers emphasizeHeading />
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
      </main>
    </>
  );
}
