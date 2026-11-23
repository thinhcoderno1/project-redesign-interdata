"use client";

import { MobilePricingSlider } from "@/components/shared/mobile-pricing-slider";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import { ConsultationCta } from "@/components/home/consultation-cta";
import { CouponCopyButton } from "./coupon-copy-button";
import { useFlashSaleVisibility } from "./use-flash-sale-visibility";
import { FlashSaleOffers } from "./flash-sale-offers";
import { PromotionGroupsCta } from "./promotion-groups-cta";
import type { FlashSaleCheckoutLinks } from "@/data/black-friday-flash-sale";
import {
  ArrowDownUp,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Check,
  CircleHelp,
  Cloud,
  Cpu,
  Crown,
  Gift,
  Globe2,
  HardDrive,
  MemoryStick,
  Network,
  RefreshCw,
  Server,
  ShieldCheck,
  Sparkles,
  Ticket,
  TicketPercent,
  TicketPlus,
  type LucideIcon,
} from "lucide-react";
import { checkoutUrl, formatVnd } from "@/data/vps-pricing";
import type {
  BlackFridayCycle,
  BlackFridayProduct,
} from "@/lib/black-friday-pricing";
import {
  blackFridayCouponConditions,
  blackFridayFaqs,
  blackFridayRenewal,
  type BlackFridayCouponGroup,
} from "@/data/black-friday";
import { contactDetails } from "@/data/contact";
import styles from "./black-friday.module.css";

const marqueeMessages = [
  "Black Friday 2026",
  "Tiết Kiệm Đến 99%",
  "Deal Đậm Giảm Sâu",
  "Ưu Đãi Ngập Tràn",
  "Nâng Cấp Hạ Tầng",
];

const bestPlanCycles = [
  { key: "annually", label: "1 năm", badgeDiscount: 60 },
  { key: "biennially", label: "2 năm", badgeDiscount: 65 },
  { key: "triennially", label: "3 năm", badgeDiscount: 70 },
] as const satisfies readonly {
  key: BlackFridayCycle;
  label: string;
  badgeDiscount: number;
}[];

const planResources = [
  { key: "cpu", unit: "vCore", icon: Cpu },
  { key: "ram", unit: "GB RAM", icon: MemoryStick },
  { key: "nvme", unit: "GB SSD NVMe", icon: HardDrive },
] as const;

const vipFlamePath =
  "M7.3 19.3C3.4 19.3 1 17 1 13.8c0-2.2 1.1-4.1 2.7-5.8-.2 1.5.4 2.7 1.6 3.2C4.9 7.3 8.1 5.1 7.6 1c3.4 1.4 5.5 4.2 5 7 1.3-.5 2.4-1.6 2.6-2.9 1.2 1 1.7 1.7 1.8 2.6h11.8c3.7 0 6.2 2.4 6.2 5.6s-2.5 6-6.2 6Z";

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

function VipBadge() {
  const gradientId = useId();

  return (
    <svg
      className={styles.vipBadge}
      viewBox="0 0 36 26"
      role="img"
      aria-label="VIP"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="2"
          y1="1"
          x2="27"
          y2="17"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="18%" stopColor="#e62a32" />
          <stop offset="43%" stopColor="#ff7a18" />
          <stop offset="68%" stopColor="#ffd45a" />
        </linearGradient>
      </defs>
      <g transform="scale(1 1.27)">
        <path
          d={vipFlamePath}
          fill={`url(#${gradientId})`}
          stroke="#ae3d14"
          strokeWidth="0.7"
          strokeLinejoin="round"
        />
        <path
          d="M8 17.3c-2.5-.2-3.9-2-3.4-4.2.5.9 1.1 1.4 1.9 1.5-.3-2.1 1.3-4.2 2-5.9 1.5 2.5 2.2 5.9-.5 8.6Z"
          fill="#ffe98a"
          opacity="0.85"
        />
        <path
          className={styles.vipRim}
          d={vipFlamePath}
          fill="none"
          stroke="#fff3be"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </g>
      <text
        x="21"
        y="20.9"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize="12"
        fontWeight="800"
        letterSpacing="0.35"
        fill="#551800"
      >
        VIP
      </text>
    </svg>
  );
}

function Specs({ product }: { product: BlackFridayProduct }) {
  const { resources } = product;
  const networkSpecs = [
    { label: product.ipv4, icon: Globe2 },
    { label: product.port, icon: Network },
    { label: product.bandwidth, icon: ArrowDownUp },
  ];

  return (
    <ul className={styles.specs} aria-label="Cấu hình" role="list">
      {resources &&
        planResources.map(({ key, unit, icon: Icon }) => (
          <li key={key}>
            <Icon size={17} aria-hidden="true" />
            <span>
              {resources[key]} {unit}
            </span>
          </li>
        ))}
      {networkSpecs.map(
        ({ label, icon: Icon }) =>
          label && (
            <li key={label}>
              <Icon size={17} aria-hidden="true" />
              <span>{label}</span>
            </li>
          ),
      )}
      {product.firewall && (
        <li className={styles.firewallSpec}>
          <ShieldCheck size={17} aria-hidden="true" />
          <span className={styles.firewallLabel}>
            <span>{product.firewall}</span>
            <VipBadge />
          </span>
        </li>
      )}
    </ul>
  );
}

function PlanGifts({ gifts }: { gifts: readonly string[] }) {
  return (
    <div className={styles.planGifts}>
      <p className={styles.giftTitle}>
        <Gift size={17} aria-hidden="true" />
        Quà Tặng
      </p>
      <ul className={styles.giftList} role="list">
        {gifts.map((gift) => (
          <li key={gift}>
            <BadgeCheck size={16} aria-hidden="true" />
            <span>{gift}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BlackFridayPage({
  vps,
  coupons,
  flashSaleCheckoutLinks,
}: {
  vps: BlackFridayProduct[];
  coupons: BlackFridayCouponGroup[];
  flashSaleCheckoutLinks: FlashSaleCheckoutLinks;
}) {
  const [selectedCycle, setCycle] = useState<BlackFridayCycle>("triennially");
  const cycleTabs = useRef<(HTMLButtonElement | null)[]>([]);
  const planGrid = useRef<HTMLDivElement>(null);
  const flashSaleVisible = useFlashSaleVisibility();
  const [activeSection, setActiveSection] = useState("best-plans");
  const products = vps;
  const period = bestPlanCycles.find(({ key }) => key === selectedCycle)?.label;
  const hasReferencePrice = products.some(
    (product) => product.referencePrices[selectedCycle] !== undefined,
  );

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

  useEffect(() => {
    const badges = planGrid.current?.querySelectorAll(`.${styles.vipBadge}`);
    if (!badges?.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.toggleAttribute(
            "data-highlighted",
            entry.intersectionRatio >= 0.8,
          );
        }
      },
      { threshold: 0.8 },
    );
    badges.forEach((badge) => observer.observe(badge));
    return () => observer.disconnect();
  }, [products]);

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

      <section
        id="best-plans"
        className={styles.bestPlans}
        aria-labelledby="best-plans-title"
      >
        <svg
          className={styles.bestPlansCircuit}
          viewBox="0 0 1200 480"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <g fill="none" stroke="currentColor" strokeWidth="1.3" opacity=".69">
            <path d="M0 45h90l30 30h121M0 81h64l32 32h36m-132 42h32l36 36h118M0 330h71l40-40h101m-212 87h91l42 42h130M1200 82h-73l-32 32h-99l-36 36h-95m335-22h-45l-53 53h-59m157 104h-108l-38-38H936m264 133h-74l-52-52H939m261 98h-168l-37-37h-71m276 66h-213l-41-41h-58" />
            <circle cx="241" cy="75" r="3" />
            <circle cx="132" cy="113" r="3" />
            <circle cx="186" cy="191" r="3" />
            <circle cx="212" cy="290" r="3" />
            <circle cx="263" cy="419" r="3" />
            <circle cx="865" cy="150" r="3" />
            <circle cx="1043" cy="181" r="3" />
            <circle cx="936" cy="247" r="3" />
            <circle cx="939" cy="328" r="3" />
            <circle cx="924" cy="389" r="3" />
            <circle cx="888" cy="414" r="3" />
          </g>
          <g fill="#ff8753">
            <circle cx="90" cy="45" r="2.5" />
            <circle cx="111" cy="290" r="2.5" />
            <circle cx="1095" cy="114" r="2.5" />
            <circle cx="1054" cy="247" r="2.5" />
            <circle cx="1074" cy="328" r="2.5" />
          </g>
        </svg>
        <div className={`container ${styles.bestPlansInner}`}>
          <div
            className={`${styles.sectionHeading} ${styles.bestPlansHeading}`}
          >
            <div>
              <EyebrowBadge icon={Sparkles} className={styles.sectionEyebrow}>
                HOT DEALS
              </EyebrowBadge>
              <h2 id="best-plans-title">VPS PLATINUM BLACK FRIDAY</h2>
              <p>Hiệu năng mạnh mẽ cho mọi dự án</p>
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
                  {bestPlanCycles.map(
                    ({ key, label, badgeDiscount }, index) => (
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
                        <span className={styles.cycleSavingsTag}>
                          <span className="sr-only">Giảm {badgeDiscount}%</span>
                          <span aria-hidden="true">-{badgeDiscount}%</span>
                        </span>
                      </button>
                    ),
                  )}
                </div>
              </div>
              <ul
                className={styles.planHighlights}
                aria-label="Điểm nổi bật của Best Plans"
                role="list"
              >
                {[
                  "Intel® Platinum Gen 2",
                  "SSD NVMe U.2 Gen 4",
                  "AntiDDoS 120Gbps",
                  "Quà Tặng Ngập Tràn",
                ].map((highlight) => (
                  <li key={highlight}>
                    <Check size={17} strokeWidth={2.5} aria-hidden="true" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
              <MobilePricingSlider
                id="bf-plans"
                ref={planGrid}
                className={styles.planGrid}
                role="tabpanel"
                aria-labelledby={`bf-cycle-${selectedCycle}`}
                tabIndex={0}
                aria-live="polite"
              >
                {products.map((product, index) => {
                  const total = product.pricing.VND[selectedCycle];
                  const hasPrice = total !== undefined;
                  const referencePrice = product.referencePrices[selectedCycle];
                  const isEstimate = referencePrice?.source === "estimate";
                  const referenceLabel = isEstimate
                    ? "Giá tham chiếu ước tính theo bảng tài nguyên VPS Platinum Viettel"
                    : "Giá tham chiếu VPS Platinum Viettel";
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
                        <Image
                          className={styles.planChip}
                          src="/images/black-friday/intel-xeon-platinum-8000-angled.webp"
                          alt=""
                          width={256}
                          height={256}
                          sizes="(max-width: 360px) 74px, (max-width: 767px) 82px, (min-width: 1024px) and (max-width: 1100px) 70px, 88px"
                        />
                      </div>
                      {hasReferencePrice && (
                        <div className={styles.originalPrice}>
                          {referencePrice !== undefined && (
                            <del title={referenceLabel}>
                              <span className="sr-only">{referenceLabel} </span>
                              {formatVnd(referencePrice.amount)} / {period}
                            </del>
                          )}
                        </div>
                      )}
                      <div className={styles.price}>
                        <strong>{formatVnd(total)}</strong>
                        {hasPrice && <span>/ {period}</span>}
                      </div>
                      <Specs product={product} />
                      {selectedCycle === "triennially" &&
                        hasPrice &&
                        product.gifts.length > 0 && (
                          <PlanGifts gifts={product.gifts} />
                        )}
                      <a
                        className={`button ${styles.blueButton}`}
                        href={
                          hasPrice
                            ? checkoutUrl(product, selectedCycle)
                            : "/lien-he/"
                        }
                        aria-label={`${hasPrice ? "Đăng ký ngay gói" : "Liên hệ tư vấn gói"} ${product.name}`}
                      >
                        {hasPrice ? "Đăng ký ngay" : "Liên hệ tư vấn"}
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

      <div className={styles.offersArea}>
        {flashSaleVisible && (
          <FlashSaleOffers checkoutLinks={flashSaleCheckoutLinks} />
        )}

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
    </main>
  );
}
