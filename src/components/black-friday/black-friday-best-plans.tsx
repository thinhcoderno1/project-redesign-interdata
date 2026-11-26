"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Cpu,
  Crown,
  Gift,
  HardDrive,
  Headset,
  Shield,
  Sparkles,
} from "lucide-react";
import { MobilePricingSlider } from "@/components/shared/mobile-pricing-slider";
import {
  blackFridayAmdBestPlans,
  blackFridayPlatinumBestPlans,
} from "@/data/black-friday";
import { checkoutUrl, formatVnd } from "@/data/vps-pricing";
import type { BestPlansCatalog } from "@/lib/black-friday-best-plans";
import type { BlackFridayCycle } from "@/lib/black-friday-pricing";
import { EyebrowBadge } from "./eyebrow-badge";
import { LegacyBestPlanCard } from "./legacy-best-plan-card";
import { PlatinumPlanSpecs } from "./platinum-plan-specs";
import { useBestPlansRelease } from "./use-best-plans-release";
import styles from "./black-friday.module.css";
import legacyStyles from "./black-friday-legacy-plans.module.css";

const bestPlanCycles = blackFridayPlatinumBestPlans.cycles;

function PlanGifts({ gifts }: { gifts: readonly string[] }) {
  return (
    <div className={styles.planGifts}>
      <p className={styles.giftTitle}>
        <Gift size={17} aria-hidden="true" />
        Quà Tặng Chu Kỳ 3 Năm
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

export function BestPlansCircuit() {
  return (
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
  );
}

export function BlackFridayBestPlans({
  bestPlans,
  id = "best-plans",
  grouped = false,
}: {
  bestPlans: BestPlansCatalog;
  id?: string;
  grouped?: boolean;
}) {
  const controlsId = id === "best-plans" ? "bf" : id;
  const cycleLabelId = `${controlsId}-cycle-label`;
  const panelId = `${controlsId}-plans`;
  const [selection, setSelection] = useState<{
    edition: BestPlansCatalog["edition"];
    cycle: BlackFridayCycle;
  }>();
  const cycleTabs = useRef<(HTMLButtonElement | null)[]>([]);
  const planGrid = useRef<HTMLDivElement>(null);
  const { edition, products } = bestPlans;
  const legacy = edition === "legacy";
  const amd = edition === "amd";
  const platinum = bestPlans.edition === "platinum";
  const presentation = amd
    ? blackFridayAmdBestPlans
    : blackFridayPlatinumBestPlans;
  const selectedCycle =
    selection?.edition === edition
      ? selection.cycle
      : legacy
        ? "triennially"
        : "annually";
  const period = bestPlanCycles.find(({ key }) => key === selectedCycle)?.label;
  const hasReferencePrice =
    platinum &&
    bestPlans.products.some(
      (product) => product.referencePrices[selectedCycle] !== undefined,
    );
  useBestPlansRelease(legacy);

  function setCycle(cycle: BlackFridayCycle) {
    setSelection({ edition, cycle });
  }

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
    const badges = planGrid.current?.querySelectorAll("[data-plan-vip]");
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
    <section
      id={id}
      className={`${styles.bestPlans}${grouped ? "" : ` ${styles.bestPlansBackground}`}${platinum ? ` ${styles.platinumBestPlans}` : ""}`}
      aria-labelledby={`${id}-title`}
    >
      {!grouped && <BestPlansCircuit />}
      <div
        className={legacy ? "container" : `container ${styles.bestPlansInner}`}
      >
        <div className={`${styles.sectionHeading} ${styles.bestPlansHeading}`}>
          <div>
            <EyebrowBadge icon={Sparkles} className={styles.sectionEyebrow}>
              {legacy ? "ƯU ĐÃI NỔI BẬT" : "HOT DEALS"}
            </EyebrowBadge>
            <h2 id={`${id}-title`}>
              {legacy
                ? "BEST PLANS VPS BLACK FRIDAY"
                : presentation.title.toUpperCase()}
            </h2>
            <p>
              {legacy
                ? "Chọn cấu hình phù hợp với nhu cầu của bạn."
                : presentation.subtitle}
            </p>
          </div>
        </div>
        {products.length ? (
          <>
            <div className={styles.billingControl}>
              <span id={cycleLabelId} className={styles.cycleLabel}>
                Chu kỳ thanh toán
              </span>
              <div
                className={styles.billingTabs}
                role="tablist"
                aria-labelledby={cycleLabelId}
              >
                {bestPlanCycles.map(({ key, label, badgeDiscount }, index) => (
                  <button
                    key={key}
                    ref={(element) => {
                      cycleTabs.current[index] = element;
                    }}
                    type="button"
                    role="tab"
                    id={`${controlsId}-cycle-${key}`}
                    aria-controls={panelId}
                    aria-selected={selectedCycle === key}
                    tabIndex={selectedCycle === key ? 0 : -1}
                    onClick={() => setCycle(key)}
                    onKeyDown={(event) => cycleKeyboard(event, index)}
                  >
                    {label}
                    {legacy ? (
                      key === "triennially" && (
                        <span className={styles.cycleSavingsTag}>
                          Miễn phí 1 năm
                        </span>
                      )
                    ) : (
                      <span className={styles.cycleSavingsTag}>
                        <span className="sr-only">Giảm {badgeDiscount}%</span>
                        <span aria-hidden="true">-{badgeDiscount}%</span>
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
              {(legacy
                ? [
                    { label: "Intel Xeon Platinum", icon: Cpu },
                    { label: "SSD NVMe U.2 Gen 4", icon: HardDrive },
                    { label: "Uptime 99.9%", icon: Activity },
                    { label: "Support 24/7", icon: Headset },
                  ]
                : [
                    { label: presentation.cpu, icon: Cpu },
                    { label: presentation.storage, icon: HardDrive },
                    { label: "AntiDDoS 120Gbps", icon: Shield },
                    { label: "Quà Tặng Hấp Dẫn", icon: Gift },
                  ]
              ).map(({ label, icon: Icon }) => (
                <li key={label}>
                  <Icon size={17} strokeWidth={2.5} aria-hidden="true" />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
            <MobilePricingSlider
              id={panelId}
              ref={planGrid}
              className={
                legacy
                  ? `${styles.planGrid} ${legacyStyles.grid}`
                  : styles.planGrid
              }
              role="tabpanel"
              aria-labelledby={`${controlsId}-cycle-${selectedCycle}`}
              tabIndex={0}
              aria-live="polite"
            >
              {bestPlans.edition === "legacy"
                ? bestPlans.products.map((product, index) => (
                    <LegacyBestPlanCard
                      key={product.pid}
                      product={product}
                      next={bestPlans.products[index + 1]}
                      index={index}
                      selectedCycle={selectedCycle}
                    />
                  ))
                : bestPlans.products.map((product) => {
                    const isFeatured = product.pid === presentation.featuredPid;
                    const total = product.pricing.VND[selectedCycle];
                    const hasPrice = total !== undefined;
                    const referencePrice =
                      product.referencePrices[selectedCycle];
                    const isEstimate = referencePrice?.source === "estimate";
                    const referenceLabel = isEstimate
                      ? "Giá tham chiếu ước tính theo bảng tài nguyên VPS Platinum Viettel"
                      : "Giá tham chiếu VPS Platinum Viettel";
                    return (
                      <article
                        key={product.pid}
                        data-pid={product.pid}
                        className={`${styles.planCard} ${isFeatured ? styles.featured : ""}`}
                      >
                        {isFeatured && (
                          <span className={styles.recommendationTag}>
                            <Crown size={16} aria-hidden="true" />
                            {presentation.featuredLabel}
                          </span>
                        )}
                        <div className={styles.planHeader}>
                          <h3>{product.name}</h3>
                          <span className={styles.planChip}>
                            <Image
                              {...presentation.chip}
                              alt=""
                              sizes="(max-width: 360px) 74px, (max-width: 767px) 82px, (min-width: 1024px) and (max-width: 1100px) 70px, 88px"
                            />
                          </span>
                        </div>
                        {hasReferencePrice && (
                          <div className={styles.originalPrice}>
                            {referencePrice !== undefined && (
                              <del title={referenceLabel}>
                                <span className="sr-only">
                                  {referenceLabel}{" "}
                                </span>
                                {formatVnd(referencePrice.amount)} / {period}
                              </del>
                            )}
                          </div>
                        )}
                        <div className={styles.price}>
                          <strong>{formatVnd(total)}</strong>
                          {hasPrice && <span>/ {period}</span>}
                        </div>
                        <PlatinumPlanSpecs product={product} />
                        {product.pricing.VND.triennially !== undefined &&
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
  );
}
