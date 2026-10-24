"use client";

import { useEffect, useMemo, useState } from "react";
import { ORIGINAL_PRICE_BY_PID, type DealProgram } from "./data";
import type { ApiProduct, PricingPeriod } from "@/lib/canh-me-pricing";
import {
  formatVNDPrice,
  parseDescriptionSpecs,
  PERIOD_LABEL,
  PERIOD_SUFFIX,
} from "@/lib/canh-me-pricing";
import { CheckIcon } from "./Icons";

function getCollapsedSpecCount(specs: string[]) {
  const networkPortIndex = specs.findIndex(
    (spec) =>
      spec.toLowerCase().includes("network port") ||
      spec.toLowerCase().includes("đường truyền"),
  );
  return networkPortIndex >= 0 ? networkPortIndex + 1 : specs.length;
}

function getEndOfMonthTime(reference = new Date()) {
  const vietnam = new Date(reference.getTime() + 7 * 3600000);
  return (
    Date.UTC(vietnam.getUTCFullYear(), vietnam.getUTCMonth() + 1, 1) -
    7 * 3600000 -
    1
  );
}

function useEndOfMonthCountdown() {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const updateLeft = () => {
      const now = new Date();
      setLeft(Math.max(0, getEndOfMonthTime(now) - now.getTime()));
    };

    const initial = window.setTimeout(updateLeft, 0);
    const timer = window.setInterval(() => {
      updateLeft();
    }, 1000);

    return () => {
      window.clearTimeout(initial);
      window.clearInterval(timer);
    };
  }, []);

  return useMemo(() => {
    if (left === null) {
      return { days: "00", hours: "00", minutes: "00", seconds: "00" };
    }

    let seconds = Math.floor(left / 1000);
    const days = Math.floor(seconds / 86400);
    seconds -= days * 86400;
    const hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;
    const pad = (value: number) => String(value).padStart(2, "0");

    return {
      days: pad(days),
      hours: pad(hours),
      minutes: pad(minutes),
      seconds: pad(seconds),
    };
  }, [left]);
}

function ProgramCountdown({
  countdown,
}: {
  countdown: ReturnType<typeof useEndOfMonthCountdown>;
}) {
  return (
    <div className="cm-program-countdown" aria-label="Sắp kết thúc">
      <div className="cm-program-countdown-label">Sắp kết thúc</div>
      <div className="cm-program-countdown-time">
        {[
          ["Ngày", countdown.days],
          ["Giờ", countdown.hours],
          ["Phút", countdown.minutes],
          ["Giây", countdown.seconds],
        ].map(([label, value]) => (
          <span key={label}>
            <strong>{value}</strong>
            <small>{label}</small>
          </span>
        ))}
      </div>
    </div>
  );
}

const PROGRAM_URGENCY_NOTE =
  "Có thể kết thúc sớm hơn dự kiến, do số lượng ưu đãi có hạn";

const PERIOD_MONTHS: Record<PricingPeriod, number> = {
  monthly: 1,
  quarterly: 3,
  semiannually: 6,
  annually: 12,
  biennially: 24,
  triennially: 36,
};

function getProgramPeriods(program: DealProgram): PricingPeriod[] {
  return program.pricingPeriods?.length
    ? program.pricingPeriods
    : [program.pricingPeriod ?? "annually"];
}

function getDefaultProgramPeriod(program: DealProgram): PricingPeriod {
  const periods = getProgramPeriods(program);
  return program.defaultPricingPeriod &&
    periods.includes(program.defaultPricingPeriod)
    ? program.defaultPricingPeriod
    : periods[0];
}

function getProductOrderUrl(product: ApiProduct, period: PricingPeriod) {
  return `https://support.interdata.vn/cart.php?a=add&pid=${product.pid}&billingcycle=${period}`;
}

function parseFormattedVNDPrice(value: string): number {
  const normalized = value.replace(/[^\d]/g, "");
  return normalized ? Number(normalized) : 0;
}

function formatMonthlyEquivalentVNDPrice(
  value: string,
  period: PricingPeriod,
): string {
  const num = parseFloat(value);
  if (!num || num <= 0) return "";
  return (
    Math.round(num / PERIOD_MONTHS[period]).toLocaleString("vi-VN") + "\u0111"
  );
}

function formatOriginalMonthlyEquivalentVNDPrice(
  value: string | undefined,
  period: PricingPeriod,
): string | undefined {
  if (!value) return undefined;
  const num = parseFormattedVNDPrice(value);
  if (!num || num <= 0) return undefined;
  return (
    Math.round(num / PERIOD_MONTHS[period]).toLocaleString("vi-VN") + " \u0111"
  );
}

function ProgramIcon({
  variant = "cloud",
}: {
  variant?: DealProgram["iconVariant"];
}) {
  return (
    <div className={`cm-program-icon is-${variant}`} aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  );
}

function DealCard({
  name,
  specs,
  href,
  featured,
  price,
  originalPrice,
  period,
  billingSummary,
  isExpanded,
  onToggle,
  toggleKey,
}: {
  name: string;
  specs: string[];
  href: string;
  featured: boolean;
  price: string;
  originalPrice?: string;
  period: string;
  billingSummary?: string;
  isExpanded: boolean;
  onToggle: (key: string) => void;
  toggleKey: string;
}) {
  const collapsedSpecCount = getCollapsedSpecCount(specs);
  const visibleSpecs = isExpanded ? specs : specs.slice(0, collapsedSpecCount);
  const hasHiddenSpecs = specs.length > collapsedSpecCount;

  return (
    <article className={`cm-deal-card ${featured ? "is-featured" : ""}`}>
      {featured ? (
        <div className="cm-featured-label">Gói được lựa chọn nhiều</div>
      ) : null}
      <div className="cm-deal-body">
        <div className="cm-deal-top">
          <h3>{name}</h3>
        </div>
        <ul>
          {visibleSpecs.map((spec) => (
            <li key={spec}>
              <CheckIcon />
              {spec}
            </li>
          ))}
        </ul>
        {hasHiddenSpecs ? (
          <button
            className="cm-deal-toggle"
            onClick={() => onToggle(toggleKey)}
            type="button"
            aria-expanded={isExpanded}
          >
            {isExpanded ? "Thu gọn" : "Xem chi tiết"}
            <span>{isExpanded ? "⌃" : "⌄"}</span>
          </button>
        ) : null}
        <div className="cm-price-wrap">
          {originalPrice && price ? (
            <del className="cm-original-price">
              {originalPrice}
              <span>{period}</span>
            </del>
          ) : null}
          <div className="cm-price">
            {price || "Liên hệ"}
            {price && <span>{period}</span>}
          </div>
        </div>
        {billingSummary && <p className="cm-price-summary">{billingSummary}</p>}
        <a
          href={href || "https://www.facebook.com/interdata.com.vn"}
          target="_blank"
          rel="noopener noreferrer"
        >
          {price ? "Đăng ký ngay" : "Liên hệ tư vấn"}
        </a>
      </div>
    </article>
  );
}

export default function HotDeals({
  deals,
  pricingByGid,
}: {
  deals: DealProgram[];
  pricingByGid?: Record<number, ApiProduct[]>;
}) {
  const countdown = useEndOfMonthCountdown();
  const visibleDeals = useMemo(
    () => deals.filter((program) => !program.hidden),
    [deals],
  );

  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(
        visibleDeals.flatMap((program) => {
          const products = pricingByGid?.[program.gid] ?? [];
          return products.map((_, i) => [`${program.gid}:${i}`, false]);
        }),
      ),
  );
  const [collapsedPrograms, setCollapsedPrograms] = useState<
    Record<string, boolean>
  >({});
  const [activePeriods, setActivePeriods] = useState<
    Record<string, PricingPeriod>
  >(() =>
    Object.fromEntries(
      visibleDeals.map((program) => [
        program.eyebrow,
        getDefaultProgramPeriod(program),
      ]),
    ),
  );

  const toggleCard = (key: string) =>
    setExpandedCards((current) => ({ ...current, [key]: !current[key] }));
  const toggleProgram = (key: string) =>
    setCollapsedPrograms((current) => ({ ...current, [key]: !current[key] }));
  const selectPeriod = (key: string, period: PricingPeriod) =>
    setActivePeriods((current) => ({ ...current, [key]: period }));

  return (
    <section className="cm-section cm-hotdeals" id="hotdeals">
      <div className="cm-section-heading">
        <div className="cm-pill">Tối ưu chi phí đến 81%</div>
        <h2>BEST OFFER PLANS</h2>
        <p>
          Các chương trình ưu đãi VPS và Cloud Server nổi bật, tối ưu chi phí
          cho từng nhu cầu triển khai.
        </p>
      </div>
      {visibleDeals.map((program) => {
        const programKey = program.eyebrow;
        const isProgramCollapsed = collapsedPrograms[programKey] ?? false;
        const pricingGridId = `canhme-pricing-${program.gid}`;
        const apiProducts = pricingByGid?.[program.gid] ?? [];
        const visibleApiProducts = program.hiddenProductPids?.length
          ? apiProducts.filter(
              (product) => !program.hiddenProductPids?.includes(product.pid),
            )
          : apiProducts;
        const availablePeriods = getProgramPeriods(program);
        const period = availablePeriods.includes(activePeriods[programKey])
          ? activePeriods[programKey]
          : availablePeriods[0];
        const periodSuffix = program.showMonthlyEquivalentPrice
          ? PERIOD_SUFFIX.monthly
          : PERIOD_SUFFIX[period];
        const gridCols =
          program.gridColumns ?? (visibleApiProducts.length === 4 ? 4 : 3);
        const gridClass =
          gridCols === 2 ? "is-two" : gridCols === 4 ? "is-four" : "";

        return (
          <div className="cm-deal-program" key={programKey}>
            <div className="cm-program-intro">
              <ProgramIcon variant={program.iconVariant} />
              <div className="cm-program-copy">
                <h3 className="cm-program-eyebrow">{program.eyebrow}</h3>
                <p className="cm-program-subheadline">{program.title}</p>
                <div className="cm-program-note">{PROGRAM_URGENCY_NOTE}</div>
                <p>{program.description}</p>
                <div className="cm-program-footer">
                  <ProgramCountdown countdown={countdown} />
                  <button
                    aria-controls={pricingGridId}
                    aria-expanded={!isProgramCollapsed}
                    className="cm-program-pricing-toggle"
                    onClick={() => toggleProgram(programKey)}
                    type="button"
                  >
                    {isProgramCollapsed ? "Chi tiết ↓" : "Thu gọn ↑"}
                  </button>
                </div>
              </div>
            </div>
            {isProgramCollapsed ? null : (
              <>
                {availablePeriods.length > 1 ? (
                  <div
                    className="cm-period-tabs"
                    role="group"
                    aria-label={`Chu kỳ thanh toán ${program.eyebrow}`}
                  >
                    {availablePeriods.map((item) => (
                      <button
                        className={item === period ? "is-active" : ""}
                        key={item}
                        onClick={() => selectPeriod(programKey, item)}
                        type="button"
                        aria-pressed={item === period}
                      >
                        {PERIOD_LABEL[item]}
                      </button>
                    ))}
                  </div>
                ) : null}
                <div className={`cm-deal-grid ${gridClass}`} id={pricingGridId}>
                  {visibleApiProducts.length === 0 && (
                    <p className="cm-pricing-unavailable" role="status">
                      Bảng giá đang được cập nhật. Vui lòng liên hệ InterData để
                      nhận báo giá phù hợp.
                    </p>
                  )}
                  {visibleApiProducts.map((product, i) => {
                    const specs = parseDescriptionSpecs(product.description);
                    const rawPrice = product.pricing?.VND?.[period];
                    const price = rawPrice
                      ? program.showMonthlyEquivalentPrice
                        ? formatMonthlyEquivalentVNDPrice(rawPrice, period)
                        : formatVNDPrice(rawPrice)
                      : "";
                    const originalPrice = program.showMonthlyEquivalentPrice
                      ? formatOriginalMonthlyEquivalentVNDPrice(
                          ORIGINAL_PRICE_BY_PID[product.pid]?.[period],
                          period,
                        )
                      : ORIGINAL_PRICE_BY_PID[product.pid]?.[period];
                    const toggleKey = `${program.gid}:${i}`;

                    return (
                      <DealCard
                        key={product.pid}
                        name={product.name}
                        specs={specs}
                        href={
                          price
                            ? getProductOrderUrl(product, period)
                            : "/lien-he/"
                        }
                        featured={
                          program.featuredPid
                            ? program.featuredPid === product.pid
                            : program.featuredIndex === i
                        }
                        price={price}
                        originalPrice={originalPrice}
                        period={periodSuffix}
                        billingSummary={
                          price &&
                          program.showMonthlyEquivalentPrice &&
                          rawPrice
                            ? `Thanh toán ${formatVNDPrice(rawPrice)} / ${PERIOD_LABEL[period]}`
                            : undefined
                        }
                        isExpanded={expandedCards[toggleKey] ?? false}
                        onToggle={toggleCard}
                        toggleKey={toggleKey}
                      />
                    );
                  })}
                </div>
              </>
            )}
          </div>
        );
      })}
    </section>
  );
}
