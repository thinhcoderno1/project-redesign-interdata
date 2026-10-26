"use client";

import { MobilePricingSlider } from "@/components/shared/mobile-pricing-slider";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import { ConsultationCta } from "@/components/home/consultation-cta";
import { CouponCopyButton } from "./coupon-copy-button";
import {
  FlashSaleCountdown,
  useFlashSaleVisibility,
} from "./flash-sale-countdown";
import {
  ArrowDownUp,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleHelp,
  Cloud,
  Cpu,
  Crown,
  Gift,
  Globe2,
  HardDrive,
  Info,
  MemoryStick,
  Network,
  RefreshCw,
  Server,
  Sparkles,
  Ticket,
  TicketPercent,
  TicketPlus,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  checkoutUrl,
  formatVnd,
  type BillingCycle,
  type VpsProduct,
} from "@/data/vps-pricing";
import {
  blackFridayCouponCondition,
  blackFridayCouponConditions,
  blackFridayCouponPlaceholder,
  blackFridayFaqs,
  blackFridayFlashSaleConditions,
  blackFridayRenewal,
  blackFridaySpecs,
  getBlackFridaySavings,
  getBlackFridayUpgrade,
  showBlackFridaySavingsBadge,
  type BlackFridayCouponGroup,
} from "@/data/black-friday";
import { links } from "@/data/content";
import { contactDetails } from "@/data/contact";
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

function EyebrowBadge({
  icon: Icon,
  children,
  className,
}: {
  icon: LucideIcon;
  children: ReactNode;
  className: string;
}) {
  return (
    <span className={`${styles.eyebrowBadge} ${className}`}>
      <Icon aria-hidden="true" focusable="false" />
      <span>{children}</span>
    </span>
  );
}

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
      <span>
        /{" "}
        {cycle === "triennially"
          ? "48 tháng"
          : cycles.find((item) => item.key === cycle)?.label}
      </span>
    </div>
  );
}

function Specs({ product }: { product: VpsProduct }) {
  const specs = blackFridaySpecs(product);
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
            <span className={styles.showMore}>Xem thêm</span>
            <span className={styles.showLess}>Thu gọn</span>
            <ChevronDown size={16} aria-hidden="true" />
          </summary>
          <ul className={styles.specList}>{extra.map(specLine)}</ul>
        </details>
      )}
    </div>
  );
}

function PlanUpgrade({
  product,
  next,
}: {
  product: VpsProduct;
  next: VpsProduct | undefined;
}) {
  // Promote the 3-year offer (48 months of service) on every billing tab.
  const upgrade = next && getBlackFridayUpgrade(next, product, "triennially");
  if (!next || !upgrade) return null;
  return (
    <div className={styles.planUpgrade}>
      <p className={styles.upgradeTitle}>
        <ArrowUp size={16} aria-hidden="true" />
        Chỉ thêm
      </p>
      <div className={styles.upgradeMonthly}>
        <strong>{formatVnd(upgrade.monthlyEquivalent)}</strong>
        <span> /tháng</span>
      </div>
      <p className={styles.upgradeLabel}>Nhận thêm:</p>
      <ul className={styles.upgradeResources} role="list">
        {upgrade.resources.map(({ key, value, unit }) => {
          const Icon =
            key === "cpu" ? Cpu : key === "ram" ? MemoryStick : HardDrive;
          return (
            <li key={key}>
              <Icon size={14} aria-hidden="true" />
              <span>
                +{new Intl.NumberFormat("vi-VN").format(value)}{" "}
                {key === "storage" ? "GB NVMe" : unit}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function BlackFridayPage({
  vps,
  coupons,
}: {
  vps: VpsProduct[];
  coupons: BlackFridayCouponGroup[];
}) {
  const [cycle, setCycle] = useState<BillingCycle>("triennially");
  const cycleTabs = useRef<(HTMLButtonElement | null)[]>([]);
  const flashSaleVisible = useFlashSaleVisibility();
  const [activeSection, setActiveSection] = useState("best-plans");
  const products = vps;
  const selectedCycle = cycle;

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
              <EyebrowBadge icon={Sparkles} className={styles.sectionEyebrow}>
                ƯU ĐÃI NỔI BẬT
              </EyebrowBadge>
              <h2 id="best-plans-title">BEST PLANS VPS BLACK FRIDAY</h2>
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
                      {key === "triennially" && (
                        <span className={styles.cycleSavingsTag}>
                          Miễn phí 1 năm
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <ul
                className={styles.planHighlights}
                aria-label="Điểm nổi bật của Best Plans"
                role="list"
              >
                {[
                  "Intel Xeon Platinum",
                  "SSD NVMe U.2 Gen 4",
                  "Uptime 99.9%",
                  "Support 24/7",
                ].map((highlight) => (
                  <li key={highlight}>
                    <Check size={17} strokeWidth={2.5} aria-hidden="true" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
              <MobilePricingSlider
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
                      {index === 1 && (
                        <span className={styles.recommendationTag}>
                          <Crown size={16} aria-hidden="true" />
                          Phù hợp nhất
                        </span>
                      )}
                      <div className={styles.planHeader}>
                        <h3>{product.name}</h3>
                        <span
                          className={styles.planIconStage}
                          aria-hidden="true"
                        >
                          <Image
                            className={styles.planServerIcon}
                            src="/images/black-friday/3d-server-icon.png"
                            alt=""
                            width={300}
                            height={300}
                            sizes="(max-width: 360px) 76px, (max-width: 700px) 92px, (max-width: 800px) 52px, (max-width: 900px) 60px, (max-width: 1100px) 80px, 108px"
                          />
                        </span>
                      </div>
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
                          {showBlackFridaySavingsBadge && (
                            <span className={styles.savingsBadge}>
                              -{savings.percent}%
                            </span>
                          )}
                        </div>
                      )}
                      <Price product={product} cycle={selectedCycle} />
                      <PlanUpgrade
                        product={product}
                        next={products[index + 1]}
                      />
                      <Specs product={product} />
                      <a
                        className={`button ${styles.blueButton}`}
                        href={
                          product.pricing.VND[selectedCycle] !== undefined
                            ? checkoutUrl(product, selectedCycle)
                            : "/lien-he/"
                        }
                        aria-label={`${product.pricing.VND[selectedCycle] !== undefined ? "Đăng ký ngay gói" : "Liên hệ tư vấn gói"} ${product.name}`}
                      >
                        {product.pricing.VND[selectedCycle] !== undefined
                          ? "Đăng ký ngay"
                          : "Liên hệ tư vấn"}
                        <ArrowRight size={17} aria-hidden="true" />
                      </a>
                    </article>
                  );
                })}
              </MobilePricingSlider>
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

      {flashSaleVisible && (
        <section
          id="flash-sale"
          className={styles.flashSale}
          aria-labelledby="flash-sale-title"
        >
          <div className={`container ${styles.flashPanel}`}>
            <div className={styles.flashIntro}>
              <div className={styles.flashHeading}>
                <EyebrowBadge icon={Zap} className={styles.sectionEyebrow}>
                  ƯU ĐÃI GIỚI HẠN THỜI GIAN
                </EyebrowBadge>
                <div className={styles.flashTitle}>
                  <h2 id="flash-sale-title">
                    <span>FLASH</span>
                    <span>SALE</span>
                  </h2>
                  <svg
                    viewBox="0 0 70 100"
                    fill="none"
                    stroke="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M30 5H54L42 34H65L16 94L28 54H5Z" />
                  </svg>
                </div>
                <p>Sẵn sàng săn ưu đãi khi Flash Sale mở bán.</p>
              </div>
              <div className={styles.flashArtwork}>
                <Image
                  src="/images/black-friday/flash-sale-3d.webp"
                  alt=""
                  width={1200}
                  height={800}
                  sizes="(max-width: 800px) 100vw, 440px"
                />
              </div>
              <details className={styles.flashTerms}>
                <summary>
                  <Info size={24} aria-hidden="true" />
                  Điều kiện áp dụng
                </summary>
                <ul className={styles.flashConditions}>
                  {blackFridayFlashSaleConditions.map((condition) => (
                    <li key={condition}>{condition}</li>
                  ))}
                </ul>
              </details>
            </div>
            <div className={styles.flashDeals}>
              <FlashSaleCountdown />
              <div className={styles.flashGrid}>
                {[
                  {
                    label: "VPS Flash Deal",
                    service: "VPS",
                    discount: 70,
                    href: links.vps,
                  },
                  {
                    label: "Cloud Flash Deal",
                    service: "Cloud Server",
                    discount: 60,
                    href: links.cloud,
                  },
                ].map(({ label, service, discount, href }) => (
                  <article key={label} className={styles.flashCard}>
                    <div className={styles.flashCardOffer}>
                      <div className={styles.flashCardTitle}>
                        <span className={styles.flashBadge}>{service}</span>
                        <h3>{label}</h3>
                      </div>
                      <div className={styles.flashDiscount}>
                        <span>Giảm</span> <strong>{discount}%</strong>
                      </div>
                    </div>
                    <div className={styles.flashCardBottom}>
                      <CouponCopyButton
                        className={styles.flashCode}
                        code={blackFridayCouponPlaceholder}
                        label={label}
                      />
                      <a
                        className={`button ${styles.orangeButton}`}
                        href={href}
                        aria-label={`Áp mã ngay ${label}`}
                      >
                        <Ticket size={24} aria-hidden="true" /> Áp mã ngay
                      </a>
                    </div>
                  </article>
                ))}
              </div>
              <p className={styles.flashNote}>
                <Info size={19} aria-hidden="true" />
                {blackFridayCouponCondition}
              </p>
            </div>
          </div>
        </section>
      )}

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
      <div className={styles.consultationArea}>
        <ConsultationCta
          id="black-friday-consultation"
          headingId="black-friday-cta-title"
          className={styles.consultationCta}
          eyebrow=""
          title="Chọn đúng gói. Tối ưu chi phí."
          description="Chia sẻ nhu cầu sử dụng VPS hoặc Cloud Server. InterData sẽ giúp bạn chọn cấu hình, chu kỳ và ưu đãi Black Friday phù hợp."
          image="/images/cta/consultation-woman-upper-body.webp"
          primaryAction={{ label: "Nhận tư vấn ưu đãi", href: links.contact }}
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
    </main>
  );
}
