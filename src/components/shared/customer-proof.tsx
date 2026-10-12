import { TestimonialCarousel } from "@/components/home/testimonial-carousel";
import { PressCarousel } from "@/components/home/press-carousel";
import { testimonials, press } from "@/data/content";
import styles from "@/components/home/home.module.css";

/** Shared homepage content and presentation for service landing pages. */
export function CustomerProof() {
  return (
    <div className={styles.home}>
      <section
        id="khach-hang"
        className="feedback section"
        aria-labelledby="customer-proof-title"
      >
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">GÓC NHÌN TỪ KHÁCH HÀNG</span>
              <h2 id="customer-proof-title">
                Câu Chuyện Thành Công Cùng InterData
              </h2>
              <p>
                Những chia sẻ về trải nghiệm sử dụng dịch vụ và làm việc với đội
                ngũ hỗ trợ.
              </p>
            </div>
          </div>
          <TestimonialCarousel items={testimonials} />
        </div>
      </section>
      <section
        id="bao-chi"
        className="press section"
        aria-labelledby="press-proof-title"
      >
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">INTERDATA TRÊN BÁO CHÍ</span>
              <h2 id="press-proof-title">Báo Chí Nói Gì Về InterData?</h2>
              <p>
                Các bài viết về hoạt động, công nghệ và hợp tác của InterData.
                Nội dung do từng cơ quan báo chí xuất bản.
              </p>
            </div>
          </div>
          <PressCarousel items={press} />
        </div>
      </section>
    </div>
  );
}
