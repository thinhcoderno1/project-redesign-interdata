import homeStyles from "./home.module.css";
import Image from "next/image";
import Link from "next/link";
import { Consultation } from "@/components/home/consultation";
import { ConsultationCta } from "@/components/home/consultation-cta";
import { Icon } from "@/components/ui/icon";
import { WorldMap } from "@/components/home/world-map";
import { TestimonialCarousel } from "@/components/home/testimonial-carousel";
import { ParallaxBackground } from "@/components/ui/parallax-background";
import { HeroHeading } from "@/components/home/hero-heading";
import { InfrastructureServices } from "@/components/home/infrastructure-services";
import solutionStyles from "@/components/home/solutions.module.css";
import { SolutionsCarousel } from "@/components/home/solutions-carousel";
import { PressCarousel } from "@/components/home/press-carousel";
import { TechnologyPartners } from "@/components/home/technology-partners";
import { PromotionCarousel } from "@/components/home/promotion-carousel";
import { KnowledgeResources } from "@/components/home/knowledge-resources";
import {
  claims,
  infrastructure,
  links,
  partners,
  press,
  reviewMode,
  showEditorialNotes,
  testimonials,
} from "@/data/content";

function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkText,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkText?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {href && (
        <a className="text-link" href={href}>
          {linkText}
          <Icon name="arrow" />
        </a>
      )}
    </div>
  );
}
function ClaimNote() {
  return reviewMode && showEditorialNotes ? (
    <p className="review-note">
      Nội dung theo brief, đang chờ duyệt.{" "}
      <Link href="/content-review">
        Xem trạng thái xác nhận <Icon name="external" />
      </Link>
    </p>
  ) : null;
}
export function HomePage() {
  const visibleClaims = claims.filter(
    (c) => reviewMode || c.status === "approved",
  );
  const featureClaims = visibleClaims.filter((c) =>
    ["uptime", "support", "bandwidth"].includes(c.id),
  );
  const capacityClaim = visibleClaims.find((c) => c.id === "business");
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
        <section
          id="giai-phap"
          className={`solutions dark section ${solutionStyles.section}`}
        >
          <div className={`container ${solutionStyles.layout}`}>
            <div className={solutionStyles.intro}>
              <div>
                <span className="eyebrow">GIẢI PHÁP TRIỂN KHAI</span>
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
        <section id="nang-luc" className="capacity section">
          <WorldMap />
          <div className="container capacity-content">
            <span className="eyebrow">NĂNG LỰC INTERDATA</span>
            <h2>
              {capacityClaim?.text || "Hạ tầng cho doanh nghiệp và người dùng"}
            </h2>
            <p>
              InterData cung cấp dịch vụ máy chủ và giải pháp triển khai cho
              website, ứng dụng và hệ thống doanh nghiệp. Mỗi nhu cầu được xem
              xét theo tài nguyên và yêu cầu vận hành thực tế.
            </p>
            <div className="stat-grid">
              {visibleClaims
                .filter((c) => ["years", "customers", "servers"].includes(c.id))
                .map((c) => {
                  const [number, ...label] = c.text.split(" ");
                  return (
                    <div key={c.id}>
                      <strong>{number}</strong>
                      <span>{label.join(" ")}</span>
                    </div>
                  );
                })}
            </div>
            <ClaimNote />
          </div>
        </section>
        <section id="khach-hang" className="feedback section">
          <div className="container">
            <SectionHeading
              eyebrow="GÓC NHÌN TỪ KHÁCH HÀNG"
              title="Câu Chuyện Thành Công Cùng InterData"
              description="Những chia sẻ về trải nghiệm sử dụng dịch vụ và làm việc với đội ngũ hỗ trợ."
            />
            <TestimonialCarousel items={testimonials} />
          </div>
        </section>
        <section id="bao-chi" className="press section">
          <div className="container">
            <SectionHeading
              eyebrow="INTERDATA TRÊN BÁO CHÍ"
              title="Báo Chí Nói Gì Về InterData?"
              description="Các bài viết về hoạt động, công nghệ và hợp tác của InterData. Nội dung do từng cơ quan báo chí xuất bản."
            />
            <PressCarousel items={press} />
          </div>
        </section>
        <section id="doi-tac" className="education section">
          <div className="container">
            <div className="education-heading">
              <span className="eyebrow">KẾT NỐI CÙNG GIÁO DỤC</span>
              <h2>Cùng các trường đại học, cao đẳng</h2>
              <p>
                Các trường được giới thiệu trong nội dung chương trình Free
                Hosting của InterData.
              </p>
            </div>
            <div className="partner-grid">
              {partners.map((p) => (
                <div key={p.asset} className="partner">
                  <Image
                    src={`/images/${p.asset}.webp`}
                    alt={p.name}
                    width={200}
                    height={96}
                    sizes="(max-width: 640px) 35vw, 160px"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
        <TechnologyPartners />
        <section id="ha-tang" className="infrastructure dark section">
          <ParallaxBackground className="infra-background">
            <Image
              src="/images/viettel-idc.jpg"
              alt=""
              fill
              sizes="100vw"
              className="infra-photo"
            />
            <div className="infra-overlay" />
          </ParallaxBackground>
          <div className="container infrastructure-layout">
            <div className="infra-content">
              <span className="eyebrow">NỀN TẢNG PHÍA SAU DỊCH VỤ</span>
              <h2>
                Hạ tầng được lựa chọn
                <br />
                cho từng hệ thống
              </h2>
              <div className="infra-items">
                {infrastructure
                  .filter((item) => reviewMode || item.status === "approved")
                  .map((item) => (
                    <div key={item.name}>
                      <Icon name={item.icon} />
                      <div>
                        <h3>{item.name}</h3>
                        <p>{item.detail}</p>
                      </div>
                    </div>
                  ))}
              </div>
              <ClaimNote />
              <a href={links.contact} className="text-link">
                Trao đổi yêu cầu kỹ thuật <Icon name="arrow" />
              </a>
              {showEditorialNotes && (
                <p className="photo-credit">
                  Ảnh minh họa datacenter · Viettel-IDC.jpg (tệp người dùng cung
                  cấp)
                </p>
              )}
            </div>
          </div>
        </section>
        <Consultation />
        <ConsultationCta />
        <KnowledgeResources />
      </main>
    </>
  );
}
