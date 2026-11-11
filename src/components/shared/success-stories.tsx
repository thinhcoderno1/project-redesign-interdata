import { MessageSquareQuote } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import homeStyles from "@/components/home/home.module.css";
import { TestimonialCarousel } from "./testimonial-carousel";
import styles from "./success-stories.module.css";

/** Shared customer stories: edit this section or its data once for all pages. */
export function SuccessStories({
  controlsOnCards = true,
  centerHeadings = true,
  withBadgeIcons = false,
}: {
  controlsOnCards?: boolean;
  centerHeadings?: boolean;
  withBadgeIcons?: boolean;
}) {
  return (
    <div className={`${homeStyles.home} ${styles.stories}`}>
      <section
        id="khach-hang"
        className={`feedback section ${styles.section}`}
        aria-labelledby="customer-proof-title"
      >
        <div className={`container ${styles.container}`}>
          <div
            className={`section-heading${centerHeadings ? ` ${styles.centeredHeading}` : ""}`}
          >
            <div>
              <span className="eyebrow">
                {withBadgeIcons && (
                  <MessageSquareQuote size={16} aria-hidden="true" />
                )}
                GÓC NHÌN TỪ KHÁCH HÀNG
              </span>
              <h2 id="customer-proof-title" className={styles.customerTitle}>
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
    </div>
  );
}
