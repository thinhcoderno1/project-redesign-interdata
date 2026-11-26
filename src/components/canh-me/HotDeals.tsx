"use client";

import { MobilePricingSlider } from "@/components/shared/mobile-pricing-slider";
import { blackFridayPlatinumBestPlans } from "@/data/black-friday";
import { checkoutUrl, formatVnd } from "@/data/vps-pricing";
import { Gift } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ORIGINAL_PRICE_BY_PID, type DealProgram } from "./data";
import type { BlackFridayProduct } from "@/lib/black-friday-pricing";
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

function getBlackFridaySpecs(product: BlackFridayProduct, cpu?: string) {
  const { resources, ipv4, port, bandwidth, firewall } = product;
  return [
    ...(resources
      ? [
          `${resources.cpu} vCore${cpu ? ` ${cpu}` : ""}`,
          `${resources.ram} GB RAM`,
          `${resources.nvme} GB SSD NVMe`,
        ]
      : []),
    ipv4,
    port,
    bandwidth,
    firewall,
  ].filter((spec) => spec !== undefined);
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

function getDealCardDetails(
  product: ApiProduct | BlackFridayProduct,
  program: DealProgram,
  period: PricingPeriod,
) {
  const rawPrice = product.pricing.VND[period];
  if ("referencePrices" in product) {
    const cycle = blackFridayPlatinumBestPlans.cycles.find(
      ({ key }) => key === period,
    )?.key;
    const referencePrice = cycle && product.referencePrices[cycle];
    const price = rawPrice === undefined ? "" : formatVnd(rawPrice);
    return {
      specs: getBlackFridaySpecs(product, program.blackFriday?.cpu),
      gifts:
        product.pricing.VND.triennially !== undefined
          ? product.gifts
          : undefined,
      price,
      originalPrice: referencePrice && formatVnd(referencePrice.amount),
      originalPriceLabel:
        referencePrice &&
        (referencePrice.source === "estimate"
          ? "Giá tham chiếu ước tính theo bảng tài nguyên VPS Platinum Viettel"
          : "Giá tham chiếu VPS Platinum Viettel"),
      href: price ? checkoutUrl(product, period) : "/lien-he/",
    };
  }

  const monthlyEquivalent = program.showMonthlyEquivalentPrice;
  const price = rawPrice
    ? monthlyEquivalent
      ? formatMonthlyEquivalentVNDPrice(rawPrice, period)
      : formatVNDPrice(rawPrice)
    : "";
  const originalPrice = ORIGINAL_PRICE_BY_PID[product.pid]?.[period];
  return {
    specs: parseDescriptionSpecs(product.description),
    price,
    originalPrice: monthlyEquivalent
      ? formatOriginalMonthlyEquivalentVNDPrice(originalPrice, period)
      : originalPrice,
    billingSummary:
      price && monthlyEquivalent && rawPrice
        ? `Thanh toán ${formatVNDPrice(rawPrice)} / ${PERIOD_LABEL[period]}`
        : undefined,
    href: price ? getProductOrderUrl(product, period) : "/lien-he/",
  };
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
  gifts,
  href,
  featured,
  featuredLabel = "Gói được lựa chọn nhiều",
  price,
  originalPrice,
  originalPriceLabel,
  period,
  billingSummary,
  isExpanded,
  onToggle,
  toggleKey,
}: {
  name: string;
  specs: string[];
  gifts?: readonly string[];
  href: string;
  featured: boolean;
  featuredLabel?: string;
  price: string;
  originalPrice?: string;
  originalPriceLabel?: string;
  period: string;
  billingSummary?: string;
  isExpanded: boolean;
  onToggle?: (key: string) => void;
  toggleKey: string;
}) {
  const collapsedSpecCount = getCollapsedSpecCount(specs);
  const showsAllSpecs = !onToggle || isExpanded;
  const visibleSpecs = showsAllSpecs
    ? specs
    : specs.slice(0, collapsedSpecCount);
  const hasDetails =
    specs.length > collapsedSpecCount || Boolean(gifts?.length);
  const giftListTitle = "Quà tặng chu kỳ 3 năm";

  return (
    <article className={`cm-deal-card ${featured ? "is-featured" : ""}`}>
      {featured ? (
        <div className="cm-featured-label">{featuredLabel}</div>
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
        {showsAllSpecs && gifts?.length ? (
          <div className="cm-deal-gifts">
            <p>{giftListTitle}</p>
            <ul role="list" aria-label={giftListTitle}>
              {gifts.map((gift) => (
                <li key={gift}>
                  <Gift size={18} aria-hidden="true" />
                  {gift}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {onToggle && hasDetails ? (
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
            <del className="cm-original-price" title={originalPriceLabel}>
              {originalPriceLabel && (
                <span className="sr-only">{originalPriceLabel} </span>
              )}
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
  pricingByGid: Record<number, (ApiProduct | BlackFridayProduct)[]>;
}) {
  const countdown = useEndOfMonthCountdown();

  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>(
    {},
  );
  const [collapsedPrograms, setCollapsedPrograms] = useState<
    Record<string, boolean>
  >({});
  const [activePeriods, setActivePeriods] = useState<
    Partial<Record<string, PricingPeriod>>
  >({});

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
      {deals.map((program) => {
        const programKey = program.id
          ? `${program.id}-pricing`
          : `canhme-pricing-${program.gid}`;
        const isBlackFriday = Boolean(program.blackFriday);
        const isProgramCollapsed =
          !isBlackFriday && (collapsedPrograms[programKey] ?? false);
        const apiProducts = pricingByGid[program.gid] ?? [];
        const visibleApiProducts = program.hiddenProductPids?.length
          ? apiProducts.filter(
              (product) => !program.hiddenProductPids?.includes(product.pid),
            )
          : apiProducts;
        const availablePeriods = getProgramPeriods(program);
        const selectedPeriod = activePeriods[programKey];
        const period =
          selectedPeriod && availablePeriods.includes(selectedPeriod)
            ? selectedPeriod
            : getDefaultProgramPeriod(program);
        const periodSuffix = program.showMonthlyEquivalentPrice
          ? PERIOD_SUFFIX.monthly
          : PERIOD_SUFFIX[period];
        const gridCols =
          program.gridColumns ?? (visibleApiProducts.length === 4 ? 4 : 3);
        const gridClass = isBlackFriday
          ? "cm-deal-grid-platinum"
          : gridCols === 2
            ? "is-two"
            : gridCols === 4
              ? "is-four"
              : "";

        return (
          <div className="cm-deal-program" id={program.id} key={programKey}>
            <div className="cm-program-intro">
              <ProgramIcon variant={program.iconVariant} />
              <div className="cm-program-copy">
                <h3 className="cm-program-eyebrow">{program.eyebrow}</h3>
                <p className="cm-program-subheadline">{program.title}</p>
                <div className="cm-program-note">
                  {program.showCountdown === false
                    ? program.note
                    : PROGRAM_URGENCY_NOTE}
                </div>
                <p>{program.description}</p>
                {!isBlackFriday && (
                  <div className="cm-program-footer">
                    {program.showCountdown !== false && (
                      <ProgramCountdown countdown={countdown} />
                    )}
                    <button
                      aria-controls={programKey}
                      aria-expanded={!isProgramCollapsed}
                      className="cm-program-pricing-toggle"
                      onClick={() => toggleProgram(programKey)}
                      type="button"
                    >
                      {isProgramCollapsed ? "Chi tiết ↓" : "Thu gọn ↑"}
                    </button>
                  </div>
                )}
              </div>
            </div>
            {isProgramCollapsed ? null : (
              <>
                {availablePeriods.length > 1 ? (
                  <div
                    className={
                      isBlackFriday
                        ? "cm-period-tabs cm-period-tabs-platinum"
                        : "cm-period-tabs"
                    }
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
                <MobilePricingSlider
                  className={`cm-deal-grid ${gridClass}`}
                  id={programKey}
                >
                  {visibleApiProducts.length === 0 && (
                    <p className="cm-pricing-unavailable" role="status">
                      Bảng giá đang được cập nhật. Vui lòng liên hệ InterData để
                      nhận báo giá phù hợp.
                    </p>
                  )}
                  {visibleApiProducts.map((product, i) => {
                    const toggleKey = `${programKey}:${product.pid}`;

                    return (
                      <DealCard
                        {...getDealCardDetails(product, program, period)}
                        key={product.pid}
                        name={product.name}
                        featured={
                          program.featuredPid
                            ? program.featuredPid === product.pid
                            : program.featuredIndex === i
                        }
                        featuredLabel={program.featuredLabel}
                        period={periodSuffix}
                        isExpanded={expandedCards[toggleKey] ?? false}
                        onToggle={isBlackFriday ? undefined : toggleCard}
                        toggleKey={toggleKey}
                      />
                    );
                  })}
                </MobilePricingSlider>
              </>
            )}
          </div>
        );
      })}
    </section>
  );
}
