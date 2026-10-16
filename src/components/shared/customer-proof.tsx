import { TestimonialCarousel } from "@/components/home/testimonial-carousel";
import { PressCarousel } from "@/components/home/press-carousel";
import { testimonials, press } from "@/data/content";
import { MessageSquareQuote, Newspaper } from "lucide-react";
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
      <section
        id="khach-hang"
        className="feedback section"
        aria-labelledby="customer-proof-title"
      >
        <div className="container">
          <div className={headingClass}>
            <div>
              <span className="eyebrow">
                {withBadgeIcons && (
                  <MessageSquareQuote size={16} aria-hidden="true" />
                )}
                GÓC NHÌN TỪ KHÁCH HÀNG
              </span>
              <h2
                id="customer-proof-title"
                className={proofStyles.customerTitle}
              >
                Câu Chuyện Thành Công Cùng InterData
              </h2>
              <p>
                Những chia sẻ về trải nghiệm sử dụng dịch vụ và làm việc với đội
                ngũ hỗ trợ.
              </p>
            </div>
          </div>
          <TestimonialCarousel
            items={testimonials}
            controlsOnCards={controlsOnCards}
          />
        </div>
      </section>
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
