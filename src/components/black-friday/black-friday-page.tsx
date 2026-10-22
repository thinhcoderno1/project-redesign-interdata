"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  ArrowDownUp,
  ArrowRight,
  Check,
  ChevronDown,
  Cloud,
  Cpu,
  Gift,
  Globe2,
  HardDrive,
  MemoryStick,
  Network,
  Server,
  Ticket,
  Zap,
} from "lucide-react";
import {
  checkoutUrl,
  formatVnd,
  productSpecs,
  type BillingCycle,
  type VpsProduct,
} from "@/data/vps-pricing";
import {
  blackFridayCoupons,
  blackFridaySlots,
  getBlackFridaySavings,
} from "@/data/black-friday";
import { links } from "@/data/content";
import styles from "./black-friday.module.css";

const cycles: { key: BillingCycle; label: string }[] = [
  { key: "monthly", label: "1 tháng" },
  { key: "quarterly", label: "3 tháng" },
  { key: "semiannually", label: "6 tháng" },
  { key: "annually", label: "12 tháng" },
  { key: "biennially", label: "24 tháng" },
  { key: "triennially", label: "36 tháng" },
];

const bestPlanCycles: { key: BillingCycle; label: string }[] = [
  { key: "annually", label: "1 năm" },
  { key: "biennially", label: "2 năm" },
  { key: "triennially", label: "3 năm" },
];

function Price({
  product,
  cycle,
}: {
  product: VpsProduct;
  cycle: BillingCycle;
}) {
  return (
    <div className={styles.price}>
      <strong>{formatVnd(product.pricing.VND[cycle])}</strong>
      <span>/ {cycles.find((item) => item.key === cycle)?.label}</span>
    </div>
  );
}

function Specs({ product }: { product: VpsProduct }) {
  const specs = productSpecs(product, true);
  const isExtra = (spec: string) =>
    /IPv[46]|Network\s*Port|Unlimited\s*Bandwidth/i.test(spec);
  const primary = specs.filter((spec) => !isExtra(spec));
  const extra = specs.filter(isExtra);
  function specLine(spec: string) {
    const Icon = /vCPU|vCore/i.test(spec)
      ? Cpu
      : /RAM/i.test(spec)
        ? MemoryStick
        : /NVMe|SSD/i.test(spec)
          ? HardDrive
          : /IPv4|IPv6/i.test(spec)
            ? Globe2
            : /Network|Mbps|Gbps/i.test(spec)
              ? Network
              : /Bandwidth|băng thông/i.test(spec)
                ? ArrowDownUp
                : Check;
    return (
      <li key={spec}>
        <Icon size={20} aria-hidden="true" />
        <span>{spec}</span>
      </li>
    );
  }
  return (
    <div className={styles.specs}>
      <ul className={styles.specList}>{primary.map(specLine)}</ul>
      {extra.length > 0 && (
        <details className={styles.specDetails}>
          <summary>
            <span className={styles.showMore}>Xem thêm cấu hình</span>
            <span className={styles.showLess}>Thu gọn</span>
            <ChevronDown size={16} aria-hidden="true" />
          </summary>
          <ul className={styles.specList}>{extra.map(specLine)}</ul>
        </details>
      )}
    </div>
  );
}

export function BlackFridayPage({
  vps,
  cloud,
}: {
  vps: VpsProduct[];
  cloud: VpsProduct[];
}) {
  const [cycle, setCycle] = useState<BillingCycle>("triennially");
  const cycleTabs = useRef<(HTMLButtonElement | null)[]>([]);
  const [slot, setSlot] = useState(0);
  const [activeSection, setActiveSection] = useState("best-plans");
  const products = vps;
  const selectedCycle = cycle;
  const currentSlot = blackFridaySlots[slot];

  function cycleKeyboard(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % bestPlanCycles.length;
    else if (event.key === "ArrowLeft")
      next = (index - 1 + bestPlanCycles.length) % bestPlanCycles.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = bestPlanCycles.length - 1;
    else return;
    event.preventDefault();
    setCycle(bestPlanCycles[next].key);
    cycleTabs.current[next]?.focus();
  }

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
  }, []);

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
            <span className={styles.eyebrow}>ƯU ĐÃI ĐẶC BIỆT</span>
            <h1 id="black-friday-title">
              Nâng cấp hạ tầng.
              <br />
              Tối ưu chi phí.
            </h1>
            <p>Ưu đãi dành cho VPS &amp; Cloud Server</p>
            <a className={`button ${styles.blueButton}`} href="#best-plans">
              Khám phá ưu đãi <ArrowRight size={20} aria-hidden="true" />
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
        <div>
          {Array.from({ length: 6 }, (_, index) => (
            <span key={index}>
              <b>BLACK FRIDAY</b>
              <i>/</i> VPS &amp; CLOUD SERVER <i>/</i>
            </span>
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
          ].map(({ id, title }, index) => (
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

      <section
        id="best-plans"
        className={styles.bestPlans}
        aria-labelledby="best-plans-title"
      >
        <div className="container">
          <div
            className={`${styles.sectionHeading} ${styles.bestPlansHeading}`}
          >
            <div>
              <span className={styles.sectionEyebrow}>
                <b>01</b> / ƯU ĐÃI NỔI BẬT
              </span>
              <h2 id="best-plans-title">Best Plans</h2>
              <p>Chọn cấu hình phù hợp với nhu cầu của bạn.</p>
            </div>
          </div>
          {products.length ? (
            <>
              <div className={styles.billingControl}>
                <span id="bf-cycle-label" className={styles.cycleLabel}>
                  Chu kỳ thanh toán
                </span>
                <div
                  className={styles.billingTabs}
                  role="tablist"
                  aria-labelledby="bf-cycle-label"
                >
                  {bestPlanCycles.map(({ key, label }, index) => (
                    <button
                      key={key}
                      ref={(element) => {
                        cycleTabs.current[index] = element;
                      }}
                      type="button"
                      role="tab"
                      id={`bf-cycle-${key}`}
                      aria-controls="bf-plans"
                      aria-selected={selectedCycle === key}
                      tabIndex={selectedCycle === key ? 0 : -1}
                      onClick={() => setCycle(key)}
                      onKeyDown={(event) => cycleKeyboard(event, index)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div
                id="bf-plans"
                className={styles.planGrid}
                role="tabpanel"
                aria-labelledby={`bf-cycle-${selectedCycle}`}
                tabIndex={0}
                aria-live="polite"
              >
                {products.map((product, index) => {
                  const savings = getBlackFridaySavings(product, selectedCycle);
                  return (
                    <article
                      key={product.pid}
                      data-pid={product.pid}
                      className={`${styles.planCard} ${index === 1 ? styles.featured : ""}`}
                    >
                      {savings && (
                        <span className={styles.cornerBadge}>
                          Tiết Kiệm {savings.percent}%
                        </span>
                      )}
                      <h3>{product.name}</h3>
                      <p className={styles.planDescription}>
                        {
                          [
                            "Cho website và ứng dụng nhỏ.",
                            "Thêm tài nguyên cho dự án phát triển.",
                            "Sẵn sàng cho nhu cầu vận hành lớn hơn.",
                          ][index]
                        }
                      </p>
                      {selectedCycle === "triennially" && (
                        <div className={styles.giftTag}>
                          <Gift size={17} aria-hidden="true" />
                          <span>TẶNG THÊM 1 NĂM</span>
                        </div>
                      )}
                      {savings && (
                        <div className={styles.originalPrice}>
                          <del>
                            {formatVnd(savings.originalPrice)} /{" "}
                            {
                              cycles.find(({ key }) => key === selectedCycle)
                                ?.label
                            }
                          </del>
                        </div>
                      )}
                      <Price product={product} cycle={selectedCycle} />
                      <Specs product={product} />
                      <a
                        className={`button ${styles.blueButton}`}
                        href={
                          product.pricing.VND[selectedCycle] !== undefined
                            ? checkoutUrl(product, selectedCycle)
                            : "/lien-he/"
                        }
                        aria-label={`Chọn gói ${product.name}`}
                      >
                        {product.pricing.VND[selectedCycle] !== undefined
                          ? "Chọn gói"
                          : "Liên hệ tư vấn"}
                        <ArrowRight size={17} aria-hidden="true" />
                      </a>
                    </article>
                  );
                })}
              </div>
            </>
          ) : (
            <div className={styles.unavailable}>
              <p>Liên hệ InterData để chọn cấu hình và nhận báo giá phù hợp.</p>
              <a className={`button ${styles.blueButton}`} href="/lien-he/">
                Tư vấn cấu hình <ArrowRight size={18} aria-hidden="true" />
              </a>
            </div>
          )}
        </div>
      </section>

      <section
        id="gia-han"
        className={styles.renewal}
        aria-labelledby="renewal-title"
      >
        <div className="container">
          <div className={styles.renewalHeader}>
            <div>
              <span className={styles.renewalEyebrow}>02 / ƯU ĐÃI GIA HẠN</span>
              <h2 id="renewal-title">
                Gia hạn dịch vụ<span>.</span>
              </h2>
            </div>
            <p>
              Tiếp tục sử dụng dịch vụ
              <br />
              với chi phí tối ưu hơn.
            </p>
            <span className={styles.renewalCampaign}>BLACK FRIDAY</span>
          </div>
          <div className={styles.renewalGrid}>
            <article
              className={`${styles.renewalCard} ${styles.renewalPrimary}`}
            >
              <svg
                className={styles.renewalWatermark}
                viewBox="0 0 300 300"
                fill="none"
                stroke="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M25 125C40 38 143 2 211 70L242 39V125H156L187 94C145 48 81 64 66 125Z" />
                <path d="M275 175C260 262 157 298 89 230L58 261V175H144L113 206C155 252 219 236 234 175Z" />
              </svg>
              <span className={styles.renewalBadge}>GÓI ĐẠI TRÀ</span>
              <div className={styles.renewalOffer}>
                <span>GIẢM</span>
                <strong>50%</strong>
              </div>
              <h3>Khi gia hạn gói đại trà</h3>
              <p>
                Áp dụng cho các gói chưa từng được ưu đãi, khuyến mãi hoặc giảm
                giá.
              </p>
              <a
                className={`button ${styles.renewalWhiteButton}`}
                href={links.login}
              >
                Gia hạn ngay <ArrowRight size={24} aria-hidden="true" />
              </a>
            </article>
            <article className={styles.renewalCard}>
              <span className={styles.renewalBadge}>GÓI MUA TẠI CANH ME</span>
              <div className={styles.renewalOffer}>
                <span>GIẢM THÊM</span>
                <strong>10%</strong>
              </div>
              <h3>Khi gia hạn gói mua tại Canh Me</h3>
              <p>Áp dụng cho các gói được mua tại trang Canh Me.</p>
              <a className={`button ${styles.blueButton}`} href={links.login}>
                Gia hạn ngay <ArrowRight size={24} aria-hidden="true" />
              </a>
            </article>
          </div>
        </div>
      </section>

      <section
        id="flash-sale"
        className={styles.flashSale}
        aria-labelledby="flash-sale-title"
      >
        <div className={styles.flashFacet} aria-hidden="true" />
        <div className="container">
          <div className={styles.sectionHeading}>
            <div>
              <span className={`${styles.sectionEyebrow} ${styles.orangeText}`}>
                03 / ƯU ĐÃI THEO KHUNG GIỜ
              </span>
              <div className={styles.flashTitle}>
                <Zap aria-hidden="true" />
                <h2 id="flash-sale-title">Flash Sale</h2>
              </div>
              <p>Săn ưu đãi trong khung giờ mở bán.</p>
            </div>
            <div className={styles.schedule} aria-live="polite">
              <span>KHUNG GIỜ SĂN DEAL</span>
              <div>
                <strong>{currentSlot.start}</strong>
                <span>—</span>
                <strong>{currentSlot.end}</strong>
              </div>
            </div>
          </div>
          <div
            className={styles.slotSwitch}
            role="group"
            aria-label="Chọn khung giờ Flash Sale"
          >
            {blackFridaySlots.map((item, index) => (
              <button
                key={item.start}
                type="button"
                aria-pressed={slot === index}
                onClick={() => setSlot(index)}
              >
                {item.start} – {item.end}
              </button>
            ))}
          </div>
          <div className={styles.flashGrid}>
            {[
              {
                label: "VPS Flash Deal",
                product: vps[0],
                href: "/vps-platinum/",
              },
              {
                label: "Cloud Flash Deal",
                product: cloud[0],
                href: "/platinum-cloud-server/",
              },
            ].map(({ label, product, href }) => {
              const flashCycle =
                cycles.find(
                  ({ key }) => product?.pricing.VND[key] !== undefined,
                )?.key ?? "annually";
              return (
                <article key={label} className={styles.flashCard}>
                  <div className={styles.flashCardTitle}>
                    <h3>{label}</h3>
                    <span>BLACK FRIDAY</span>
                  </div>
                  {product ? (
                    <>
                      <Price product={product} cycle={flashCycle} />
                      <p className={styles.flashSpecs}>
                        {productSpecs(product, true)
                          .filter((spec) =>
                            /vCPU|vCore|RAM|NVMe|SSD/i.test(spec),
                          )
                          .slice(0, 3)
                          .join(" · ")}
                      </p>
                    </>
                  ) : (
                    <p>Chọn cấu hình phù hợp với nhu cầu.</p>
                  )}
                  <div className={styles.flashCardBottom}>
                    <a className={styles.detailsLink} href={href}>
                      Khám phá cấu hình{" "}
                      <ArrowRight size={16} aria-hidden="true" />
                    </a>
                    <a
                      className={`button ${styles.orangeButton}`}
                      href="/lien-he/"
                      aria-label={`Nhận tư vấn ${label} khung giờ ${currentSlot.start} đến ${currentSlot.end}`}
                    >
                      Xem ưu đãi <ArrowRight size={16} aria-hidden="true" />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="ma-giam-gia"
        className={styles.coupons}
        aria-labelledby="coupons-title"
      >
        <div className="container">
          <div className={styles.couponHeading}>
            <div>
              <span className={`${styles.sectionEyebrow} ${styles.orangeText}`}>
                04 / MÃ ƯU ĐÃI
              </span>
              <h2 id="coupons-title">
                Mã giảm giá<span>.</span>
              </h2>
              <p>Chọn chu kỳ phù hợp cho VPS &amp; Cloud Server.</p>
            </div>
            <span className={styles.couponAside}>BLACK FRIDAY</span>
          </div>
          <div className={styles.couponColumns}>
            {blackFridayCoupons.map((group) => (
              <div key={group.service} className={styles.couponGroup}>
                <h3>
                  {group.service === "VPS" ? (
                    <Server aria-hidden="true" />
                  ) : (
                    <Cloud aria-hidden="true" />
                  )}
                  {group.service}
                </h3>
                {group.discounts.map((discount, index) => (
                  <article
                    className={`${styles.ticket} ${index === 0 ? styles.ticketFeatured : ""}`}
                    key={discount}
                  >
                    <div className={styles.ticketOffer}>
                      <div className={styles.ticketTop}>
                        <span>Chu kỳ {3 - index} năm</span>
                        {index === 0 && <b>Ưu đãi cao nhất</b>}
                      </div>
                      <h4>
                        <span>Giảm</span>
                        <strong>{discount}%</strong>
                      </h4>
                    </div>
                    <div className={styles.couponAction}>
                      <span className={styles.couponLabel}>MÃ ƯU ĐÃI</span>
                      <span className={styles.couponCode}>Liên hệ nhận mã</span>
                      <a
                        href="/lien-he/"
                        aria-label={`Nhận ưu đãi ${group.service} chu kỳ ${3 - index} năm`}
                      >
                        <Ticket size={20} aria-hidden="true" /> Nhận ưu đãi
                      </a>
                    </div>
                  </article>
                ))}
                <details className={styles.terms}>
                  <summary>Điều kiện áp dụng</summary>
                  <ul>
                    {group.discounts.map((discount, index) => (
                      <li key={discount}>
                        Chu kỳ {3 - index} năm: giảm {discount}% cho{" "}
                        {group.service}.
                      </li>
                    ))}
                  </ul>
                  <p>
                    Liên hệ InterData để xác nhận gói áp dụng, mã ưu đãi, thời
                    gian sử dụng và giá gia hạn trước khi đăng ký.{" "}
                    <a href={group.href}>Xem cấu hình {group.service}</a>.
                  </p>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
