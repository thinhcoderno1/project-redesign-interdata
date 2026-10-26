"use client";

import { MobilePricingSlider } from "@/components/shared/mobile-pricing-slider";
import {
  ArrowDownUp,
  ArrowRight,
  Check,
  Cpu,
  Crown,
  Globe2,
  HardDrive,
  MemoryStick,
  Network,
  ReceiptText,
  RefreshCw,
} from "lucide-react";
import linuxStyles from "../vps-linux/linux.module.css";
import styles from "./pricing.module.css";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  vibeBillingCycles,
  vibeOrderUrl,
  type VibeCycle,
  type VibePlan,
} from "@/data/vps-vibe-coding";

function specIcon(spec: string) {
  if (/\bv(?:CPU|Core)\b/i.test(spec)) return Cpu;
  if (/\bRAM\b/i.test(spec)) return MemoryStick;
  if (/SSD|NVMe/i.test(spec)) return HardDrive;
  if (/băng thông|Bandwidth/i.test(spec)) return ArrowDownUp;
  if (/Network|[GM]bps/i.test(spec)) return Network;
  if (/IPv4|IPv6/i.test(spec)) return Globe2;
  return Check;
}

export default function PricingSection({
  initialPlans,
}: {
  initialPlans: VibePlan[];
}) {
  const [plans, setPlans] = useState(initialPlans);
  const [cycle, setCycle] = useState<VibeCycle>("monthly");
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const request = useRef<AbortController | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => () => request.current?.abort(), []);
  const available = vibeBillingCycles.filter(({ key }) =>
    plans.some((plan) => plan.prices[key]),
  );
  const selected = available.find(({ key }) => key === cycle) || available[0];
  const showAnnualOffer =
    selected?.key === "monthly" || selected?.key === "quarterly";
  function keyboard(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % available.length;
    else if (event.key === "ArrowLeft")
      next = (index - 1 + available.length) % available.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = available.length - 1;
    else return;
    event.preventDefault();
    setCycle(available[next].key);
    tabs.current[next]?.focus();
  }
  async function retry() {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setPending(true);
    setFailed(false);
    try {
      const response = await fetch("/api/vps-vibe-coding-pricing/", {
        signal: controller.signal,
      });
      if (!response.ok) throw new Error("Pricing unavailable");
      const data = await response.json();
      if (!Array.isArray(data.plans) || !data.plans.length)
        throw new Error("No plans");
      setPlans(data.plans);
    } catch {
      if (!controller.signal.aborted) setFailed(true);
    } finally {
      if (!controller.signal.aborted) setPending(false);
    }
  }
  return (
    <section
      id="gia"
      data-vibe-pricing
      className={`${linuxStyles.section} ${linuxStyles.pricingSection} ${styles.root}`}
      aria-labelledby="vibe-pricing-title"
    >
      <div className={`container ${linuxStyles.pricingLayout}`}>
        <div className={linuxStyles.pricingIntro}>
          <span className={linuxStyles.lightEyebrow}>
            <ReceiptText size={16} aria-hidden="true" />
            PRICE TABLE
          </span>
          <h2 id="vibe-pricing-title">Bảng Giá VPS Vibe Coding</h2>
          <p>Cấu hình được lựa chọn tối ưu cho nhu cầu vibe coding</p>
        </div>
        <noscript>
          <p className={linuxStyles.noScriptNote}>
            Bật JavaScript để đổi chu kỳ, hoặc{" "}
            <a href="https://support.interdata.vn/index.php?rp=/store/vps-vibe-coding-2026">
              xem bảng giá tại cổng đăng ký
            </a>
            .
          </p>
        </noscript>
        <div className={linuxStyles.pricingBody}>
          {plans.length && selected ? (
            <>
              <div className={linuxStyles.pricingControls}>
                <div className={linuxStyles.billingControl}>
                  <span
                    id="vibe-cycle-label"
                    className={linuxStyles.cycleLabel}
                  >
                    Chu kỳ thanh toán
                  </span>
                  <div
                    className={`${linuxStyles.billingTabs} ${styles.billingTabs}`}
                    role="tablist"
                    aria-labelledby="vibe-cycle-label"
                  >
                    {available.map((item, index) => (
                      <button
                        key={item.key}
                        type="button"
                        role="tab"
                        ref={(element) => {
                          tabs.current[index] = element;
                        }}
                        id={`vibe-cycle-${item.key}`}
                        aria-controls="vibe-plans"
                        aria-selected={selected.key === item.key}
                        tabIndex={selected.key === item.key ? 0 : -1}
                        onClick={() => setCycle(item.key)}
                        onKeyDown={(event) => keyboard(event, index)}
                      >
                        <span>{item.label}</span>
                        {item.discount && (
                          <small className={styles.discount}>
                            {item.discount}
                          </small>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <MobilePricingSlider
                className={linuxStyles.planGrid}
                id="vibe-plans"
                role="tabpanel"
                aria-labelledby={`vibe-cycle-${selected.key}`}
                tabIndex={0}
              >
                {plans.map((plan, index) => (
                  <article
                    key={plan.id}
                    data-pid={plan.id}
                    data-popular={index === 1 || undefined}
                    className={`${linuxStyles.plan} ${index === 1 ? linuxStyles.accentPlan : ""}`}
                  >
                    {index === 1 && (
                      <span className={linuxStyles.popularTag}>
                        <Crown size={16} aria-hidden="true" />
                        Gói phổ biến
                      </span>
                    )}
                    <h3>{plan.name}</h3>
                    <div
                      className={linuxStyles.planPrice}
                      data-vibe-price
                      aria-live="polite"
                    >
                      <strong
                        className={
                          (plan.prices[selected.key]?.length || 0) > 10
                            ? linuxStyles.longPrice
                            : undefined
                        }
                      >
                        {plan.prices[selected.key] || "Liên hệ"}
                      </strong>
                      <span>/ {selected.label}</span>
                    </div>
                    <ul>
                      {plan.specs.map((spec) => {
                        const Icon = specIcon(spec);
                        return (
                          <li key={spec}>
                            <Icon size={20} aria-hidden="true" />
                            <span>{spec}</span>
                          </li>
                        );
                      })}
                    </ul>
                    {showAnnualOffer && plan.prices.annually && (
                      <div
                        data-annual-offer
                        className={`${styles.annualOffer} ${index === 1 ? styles.featuredOffer : ""}`}
                      >
                        <div>
                          <small>Mua 1 năm chỉ</small>
                          <strong>{plan.prices.annually}</strong>
                        </div>
                        <span>-70%</span>
                      </div>
                    )}
                    {plan.prices[selected.key] ? (
                      <a
                        className={`button ${linuxStyles.planButton} ${index === 1 ? "primary" : linuxStyles.outlineButton} ${styles.planButton}`}
                        href={vibeOrderUrl(plan.productUrl, selected.key)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Đăng ký ngay
                        <ArrowRight size={15} aria-hidden="true" />
                      </a>
                    ) : (
                      <a
                        className={`button ${linuxStyles.planButton} ${linuxStyles.outlineButton} ${styles.planButton}`}
                        href="https://www.facebook.com/interdata.com.vn/"
                      >
                        Cần tư vấn?
                      </a>
                    )}
                  </article>
                ))}
              </MobilePricingSlider>
            </>
          ) : (
            <div
              className={linuxStyles.pricingError}
              role="status"
              aria-live="polite"
            >
              <RefreshCw size={28} aria-hidden="true" />
              <p>
                {failed
                  ? "Chưa thể tải bảng giá. Vui lòng thử lại hoặc liên hệ tư vấn."
                  : "Bảng giá đang được cập nhật."}
              </p>
              <button
                type="button"
                className="button primary"
                disabled={pending}
                onClick={retry}
              >
                {pending ? "Đang tải…" : "Tải lại bảng giá"}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
