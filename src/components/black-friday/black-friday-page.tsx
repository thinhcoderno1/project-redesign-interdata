"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CircleHelp,
  Cloud,
  Gift,
  RefreshCw,
  Server,
  Ticket,
  TicketPercent,
  TicketPlus,
} from "lucide-react";
import { ConsultationCta } from "@/components/home/consultation-cta";
import {
  blackFridayCouponConditions,
  blackFridayFaqs,
  blackFridayRenewal,
  type BlackFridayCouponGroup,
} from "@/data/black-friday";
import { contactDetails } from "@/data/contact";
import type { BestPlansCatalog } from "@/lib/black-friday-best-plans";
import {
  BestPlansCircuit,
  BlackFridayBestPlans,
} from "./black-friday-best-plans";
import { CouponCopyButton } from "./coupon-copy-button";
import { EyebrowBadge } from "./eyebrow-badge";
import { FlashSaleOffers } from "./flash-sale-offers";
import { PromotionGroupsCta } from "./promotion-groups-cta";
import { useFlashSaleVisibility } from "./use-flash-sale-visibility";
import styles from "./black-friday.module.css";

const marqueeMessages = [
  "Black Friday 2026",
  "Tiết Kiệm Đến 99%",
  "Deal Đậm Giảm Sâu",
  "Ưu Đãi Ngập Tràn",
  "Nâng Cấp Hạ Tầng",
];

export function BlackFridayPage({
  children,
  amdBestPlans,
  bestPlans,
  coupons,
}: {
  children: ReactNode;
  amdBestPlans: BestPlansCatalog;
  bestPlans: BestPlansCatalog;
  coupons: BlackFridayCouponGroup[];
}) {
  const flashSaleVisible = useFlashSaleVisibility();
  const [activeSection, setActiveSection] = useState("best-plans");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -40% 0px", threshold: [0, 0.2, 0.5] },
    );
    ["best-plans", "gia-han", "flash-sale", "ma-giam-gia"].forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [flashSaleVisible]);

  return (
    <main id="main-content" className={`${styles.page} dark`}>
      <section className={styles.hero} aria-labelledby="black-friday-title">
        <div className={styles.facets} aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <EyebrowBadge icon={Gift} className={styles.eyebrow}>
              ƯU ĐÃI ĐẶC BIỆT
            </EyebrowBadge>
            <h1 id="black-friday-title">
              Nâng cấp hạ tầng.
              <br />
              Tối ưu chi phí.
            </h1>
            <p>Ưu đãi dành cho VPS &amp; Cloud Server</p>
            <a className={`button ${styles.heroButton}`} href="#best-plans">
              <span className={styles.heroButtonIcon} aria-hidden="true">
                <ArrowUpRight size={22} strokeWidth={1.6} />
              </span>
              <span className={styles.heroButtonLabel}>Khám phá ưu đãi</span>
            </a>
          </div>
          <div
            className={styles.heroArtwork}
            role="img"
            aria-label="Black Friday Sale"
          >
            <div className={styles.heroServices}>
              VPS
              <br />
              CLOUD SERVER
              <br />
              DEDICATED SERVER
            </div>
            <div className={styles.bigType} aria-hidden="true">
              <span>BLACK</span>
              <span>FRIDAY</span>
            </div>
            <span className={styles.saleSticker} aria-hidden="true">
              SALE
            </span>
          </div>
        </div>
      </section>

      <div className={styles.ticker} aria-hidden="true">
        <div className={styles.tickerTrack}>
          {[0, 1].map((copy) => (
            <div className={styles.tickerGroup} key={copy}>
              {marqueeMessages.map((message) => (
                <span key={message}>
                  <b>{message}</b>
                  <i>/</i>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <nav className={styles.sectionNav} aria-label="Nội dung Black Friday">
        <div className={`container ${styles.navInner}`}>
          {[
            { id: "best-plans", title: "Best Plans" },
            { id: "gia-han", title: "Gia hạn" },
            { id: "flash-sale", title: "Flash Sale" },
            { id: "ma-giam-gia", title: "Mã giảm giá" },
          ]
            .filter(({ id }) => id !== "flash-sale" || flashSaleVisible)
            .map(({ id, title }, index) => (
              <a
                key={id}
                href={`#${id}`}
                aria-current={activeSection === id ? "location" : undefined}
                onClick={() => setActiveSection(id)}
              >
                <span>0{index + 1}</span>
                {title}
              </a>
            ))}
        </div>
      </nav>

      <div className={styles.bestPlansGroup}>
        <BestPlansCircuit />
        <BlackFridayBestPlans bestPlans={amdBestPlans} grouped />
        <BlackFridayBestPlans
          bestPlans={bestPlans}
          id="best-plans-clone"
          grouped
        />
      </div>

      <section
        id="gia-han"
        className={styles.renewal}
        aria-labelledby="renewal-title"
      >
        <div
          className={`container ${styles.renewalGrid} ${blackFridayRenewal.showExtraDiscount ? styles.renewalGridWithExtra : ""}`}
        >
          <div className={styles.renewalIntro}>
            <RefreshCw className={styles.renewalIcon} aria-hidden="true" />
            <EyebrowBadge icon={RefreshCw} className={styles.renewalEyebrow}>
              ƯU ĐÃI GIA HẠN
            </EyebrowBadge>
            <h2 id="renewal-title">
              <span>Gia hạn.</span>
              <span>Thêm lợi ích.</span>
            </h2>
            {blackFridayRenewal.showDescriptions && (
              <p>
                Tiếp tục sử dụng dịch vụ với ưu đãi dành riêng cho khách hàng
                hiện tại.
              </p>
            )}
            <a className={styles.renewalAction} href={contactDetails.facebook}>
              Gia hạn ngay <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
          <article className={styles.renewalCard}>
            <TicketPercent className={styles.renewalIcon} aria-hidden="true" />
            <h3>GIA HẠN GIẢM ĐẾN</h3>
            <div className={styles.renewalOffer}>
              <strong>
                50<span>%</span>
              </strong>
            </div>
            {blackFridayRenewal.showDescriptions && (
              <p>
                Áp dụng cho các gói đại trà, chưa từng được ưu đãi, khuyến mãi
                hoặc giảm giá.
              </p>
            )}
          </article>
          <article className={styles.renewalCard}>
            <Gift className={styles.renewalIcon} aria-hidden="true" />
            <h3>GIA HẠN TẶNG ĐẾN</h3>
            <div className={`${styles.renewalOffer} ${styles.renewalMonths}`}>
              <strong>6</strong>
              <span>THÁNG</span>
            </div>
            {blackFridayRenewal.showDescriptions && (
              <p>
                Áp dụng cho các dịch vụ đăng ký trước ngày{" "}
                <strong>
                  <time dateTime="2026-08-31">31/08/2026.</time>
                </strong>
              </p>
            )}
          </article>
          {blackFridayRenewal.showExtraDiscount && (
            <article className={styles.renewalCard}>
              <TicketPlus className={styles.renewalIcon} aria-hidden="true" />
              <h3>GIA HẠN GIẢM THÊM</h3>
              <div className={styles.renewalOffer}>
                <strong>
                  10<span>%</span>
                </strong>
              </div>
              {blackFridayRenewal.showDescriptions && (
                <p>Áp dụng cho các gói được mua tại trang Canh Me.</p>
              )}
            </article>
          )}
        </div>
      </section>

      <div className={styles.offersArea}>
        {flashSaleVisible && <FlashSaleOffers />}

        <PromotionGroupsCta />

        <section
          id="ma-giam-gia"
          className={styles.coupons}
          aria-labelledby="coupons-title"
        >
          <div className="container">
            <div className={styles.couponHeading}>
              <div>
                <EyebrowBadge
                  icon={TicketPercent}
                  className={styles.sectionEyebrow}
                >
                  MÃ ƯU ĐÃI
                </EyebrowBadge>
                <h2 id="coupons-title">
                  Mã giảm giá<span>.</span>
                </h2>
                <p>Chọn chu kỳ phù hợp cho VPS &amp; Cloud Server.</p>
              </div>
              <span className={styles.couponAside}>BLACK FRIDAY</span>
            </div>
            <div className={styles.couponColumns}>
              {coupons.map((group) => (
                <div key={group.service} className={styles.couponGroup}>
                  <h3>
                    {group.service === "VPS" ? (
                      <Server aria-hidden="true" />
                    ) : (
                      <Cloud aria-hidden="true" />
                    )}
                    {group.service}
                  </h3>
                  {group.offers.map(({ discount, months, code }, index) => (
                    <article
                      className={`${styles.ticket} ${index === 0 ? styles.ticketFeatured : ""}`}
                      key={months}
                    >
                      <div className={styles.ticketOffer}>
                        <div className={styles.ticketTop}>
                          <span>Chu kỳ {months / 12} năm</span>
                          {index === 0 && <b>Ưu đãi cao nhất</b>}
                        </div>
                        <h4>
                          <span>Giảm</span>
                          <strong>{discount}%</strong>
                        </h4>
                      </div>
                      <div className={styles.couponAction}>
                        <span className={styles.couponLabel}>MÃ ƯU ĐÃI</span>
                        <CouponCopyButton
                          className={styles.couponCode}
                          code={code}
                          label={`${group.service} chu kỳ ${months / 12} năm`}
                        />
                        <a
                          href={group.href}
                          aria-label={`Áp mã ngay ${group.service} chu kỳ ${months / 12} năm`}
                        >
                          <Ticket size={20} aria-hidden="true" /> Áp mã ngay
                        </a>
                      </div>
                    </article>
                  ))}
                  <details className={styles.terms}>
                    <summary>Điều kiện áp dụng</summary>
                    <ul>
                      {blackFridayCouponConditions.map((condition) => (
                        <li key={condition}>{condition}</li>
                      ))}
                    </ul>
                  </details>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <div className={styles.consultationArea}>
        <ConsultationCta
          id="black-friday-consultation"
          headingId="black-friday-cta-title"
          className={styles.consultationCta}
          eyebrow=""
          title="Chọn đúng gói. Tối ưu chi phí."
          description="Chia sẻ nhu cầu sử dụng VPS hoặc Cloud Server. InterData sẽ giúp bạn chọn cấu hình, chu kỳ và ưu đãi Black Friday phù hợp."
          image="/images/cta/consultation-woman-upper-body.webp"
          primaryAction={{
            label: "Nhận tư vấn ưu đãi",
            href: contactDetails.facebook,
          }}
          secondaryAction={{ label: "Xem lại Best Plans", href: "#best-plans" }}
        />
      </div>
      <section
        id="black-friday-faq"
        className={styles.faqSection}
        aria-labelledby="black-friday-faq-title"
      >
        <div className="container">
          <div className={styles.faqPanel}>
            <div className={`${styles.sectionHeading} ${styles.faqHeading}`}>
              <EyebrowBadge icon={CircleHelp} className={styles.sectionEyebrow}>
                HỖ TRỢ KHÁCH HÀNG
              </EyebrowBadge>
              <h2 id="black-friday-faq-title">
                Câu hỏi thường gặp<span className={styles.faqTitleDot}>.</span>
              </h2>
              <p>Giải đáp về ưu đãi Black Friday và gia hạn dịch vụ.</p>
            </div>
            <div className={styles.faqList}>
              {[blackFridayFaqs.slice(0, 4), blackFridayFaqs.slice(4)].map(
                (column, index) => (
                  <div className={styles.faqColumn} key={index}>
                    {column.map((item) => (
                      <details className={styles.faqItem} key={item.question}>
                        <summary>
                          <h3>{item.question}</h3>
                          <span
                            className={styles.faqToggle}
                            aria-hidden="true"
                          />
                        </summary>
                        <div className={styles.faqAnswer}>
                          <p>{item.answer}</p>
                          {item.action && (
                            <a href={item.action.href}>
                              {item.action.label}
                              <ArrowRight size={16} aria-hidden="true" />
                            </a>
                          )}
                        </div>
                      </details>
                    ))}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>
      {children}
    </main>
  );
}
