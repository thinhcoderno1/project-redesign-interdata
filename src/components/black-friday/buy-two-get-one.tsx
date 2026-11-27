import { ArrowRight, Cloud, Gift, Server } from "lucide-react";
import { EyebrowBadge } from "./eyebrow-badge";
import styles from "./buy-two-get-one.module.css";

const offers = [
  {
    id: "vps",
    service: "VPS",
    purchaseLabel: "02 VPS",
    giftLabel: "01 VPS",
    icon: Server,
  },
  {
    id: "cloud",
    service: "CLOUD SERVER",
    purchaseLabel: "02 CLOUD SERRVER",
    giftLabel: "01 CLOUD SERVER",
    icon: Cloud,
  },
] as const;

export function BuyTwoGetOne() {
  return (
    <div className={styles.root}>
      <section
        id="mua-2-tang-1"
        className={styles.section}
        aria-labelledby="buy-two-get-one-title"
      >
        <div className={styles.layout}>
          <div className={styles.intro}>
            <EyebrowBadge icon={Gift} className={styles.eyebrow}>
              ƯU ĐÃI GẤP BỘI
            </EyebrowBadge>
            <h2 id="buy-two-get-one-title">
              Mua 2 <span>tặng 1</span>
            </h2>
            <p className={styles.description}>
              Áp dụng cho mọi gói VPS và CLOUD SERVER.
            </p>
          </div>

          <div className={styles.offers}>
            {offers.map(
              ({ id, service, purchaseLabel, giftLabel, icon: Icon }) => (
                <article
                  key={id}
                  className={`${styles.offer}${id === "cloud" ? ` ${styles.offerCloud}` : ""}`}
                  aria-labelledby={`buy-two-get-one-${id}`}
                >
                  <header className={styles.offerHeader}>
                    <h3 id={`buy-two-get-one-${id}`}>
                      <span className={styles.serviceIcon}>
                        <Icon aria-hidden="true" />
                      </span>
                      {service}
                    </h3>
                  </header>
                  <div className={styles.equation}>
                    <p className={styles.term}>
                      <span className={styles.label}>Đăng ký</span>{" "}
                      <strong className={styles.amount}>{purchaseLabel}</strong>
                      <span className={styles.cycle}>
                        Chu kỳ <strong>từ 2 năm</strong> / dịch vụ
                      </span>
                    </p>
                    <span className={styles.plus} aria-hidden="true">
                      <ArrowRight />
                    </span>
                    <p className={`${styles.term} ${styles.reward}`}>
                      <span className={styles.label}>Tặng thêm</span>{" "}
                      <strong className={styles.amount}>{giftLabel}</strong>
                      <span className={styles.cycle}>
                        Chu kỳ <strong>1 năm</strong>
                      </span>
                    </p>
                  </div>
                </article>
              ),
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
