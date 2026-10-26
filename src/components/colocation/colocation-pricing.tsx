import { MobilePricingSlider } from "@/components/shared/mobile-pricing-slider";
import {
  ArrowDownUp,
  ArrowRight,
  Building2,
  Crown,
  Headphones,
  Network,
  PlugZap,
  ReceiptText,
  Server,
} from "lucide-react";
import { colocationPlans } from "@/data/colocation";
import { formatVnd } from "@/data/vps-pricing";
import styles from "@/components/platinum-cloud-server/platinum-cloud.module.css";
import local from "./colocation.module.css";

const benefits = [
  {
    icon: Server,
    title: "Thiết bị của bạn",
    text: "Chủ động quản lý phần cứng và dữ liệu",
  },
  {
    icon: PlugZap,
    title: "Điện & làm mát",
    text: "Hạ tầng vận hành tại datacenter",
  },
  {
    icon: Network,
    title: "Kết nối theo nhu cầu",
    text: "Xác nhận cổng và tuyến mạng",
  },
  {
    icon: Headphones,
    title: "Hỗ trợ 24/7",
    text: "Tiếp nhận yêu cầu qua hệ thống ticket",
  },
];

export function ColocationPricing() {
  return (
    <section
      id="bang-gia"
      className={`${styles.section} ${styles.pricingSection}`}
      aria-labelledby="colocation-pricing-title"
    >
      <div className={`container ${styles.pricingLayout}`}>
        <div className={styles.pricingIntro}>
          <span className={styles.lightEyebrow}>
            <ReceiptText size={16} aria-hidden="true" />
            BẢNG GIÁ CHỖ ĐẶT MÁY CHỦ
          </span>
          <h2 id="colocation-pricing-title">
            Chọn không gian phù hợp với máy chủ của bạn
          </h2>
          <p>
            Từ một máy chủ đến tủ rack riêng. Chọn kích thước và công suất theo
            thiết bị thực tế; các mức giá dưới đây tính theo tháng.
          </p>
          <a className="text-link" href="#support">
            Tư vấn phương án chỗ đặt <ArrowRight size={17} aria-hidden="true" />
          </a>
        </div>
        <div className={styles.pricingBody}>
          <MobilePricingSlider className={styles.planGrid}>
            {colocationPlans.map((plan) => (
              <article
                key={plan.id}
                data-plan={plan.id}
                data-popular={plan.highlighted || undefined}
                className={`${styles.plan} ${local.pricingCard} ${plan.highlighted ? styles.accentPlan : ""}`}
              >
                {plan.highlighted && (
                  <span className={styles.popularTag}>
                    <Crown size={16} aria-hidden="true" />
                    Gợi ý chỗ đặt
                  </span>
                )}
                <h3>{plan.name}</h3>
                <p className={local.rackLabel}>
                  <Building2 size={16} aria-hidden="true" />
                  {plan.rack} ·{" "}
                  {plan.id === "42u" ? "Tủ rack riêng" : "Chỗ đặt máy chủ"}
                </p>
                <div className={`${styles.planPrice} ${local.planPrice}`}>
                  <strong>{formatVnd(plan.monthlyPrice)}</strong>
                  <span>/tháng</span>
                </div>
                <ul>
                  {plan.specs.map((spec, index) => {
                    const Icon = [Server, PlugZap, ArrowDownUp, Network][index];
                    return (
                      <li key={spec}>
                        <Icon size={20} aria-hidden="true" />
                        <span>{spec}</span>
                      </li>
                    );
                  })}
                </ul>
                <a
                  href={plan.href}
                  className={`button ${styles.planButton} ${plan.highlighted ? "primary" : styles.outlineButton}`}
                  aria-label={`Liên hệ về ${plan.name} ${plan.rack}`}
                >
                  Liên hệ <ArrowRight size={15} aria-hidden="true" />
                </a>
              </article>
            ))}
          </MobilePricingSlider>
        </div>
        <ul
          className={styles.pricingBenefits}
          aria-label="Tiện ích chỗ đặt máy chủ"
        >
          {benefits.map(({ icon: Icon, title, text }) => (
            <li key={title}>
              <span className={styles.benefitIcon}>
                <Icon size={27} aria-hidden="true" />
              </span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
