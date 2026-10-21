"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  ArrowDownUp,
  ArrowRight,
  Check,
  ChevronDown,
  Cpu,
  Crown,
  Globe2,
  HardDrive,
  Headphones,
  Layers,
  MemoryStick,
  Network,
  RefreshCw,
  ReceiptText,
  ShieldCheck,
  Zap,
} from "lucide-react";
import {
  dedicatedBillingCycles,
  dedicatedOriginalPrices,
  type DedicatedProduct,
} from "@/data/dedicated-server";
import {
  checkoutUrl,
  formatVnd,
  productSpecs,
  type BillingCycle,
} from "@/data/vps-pricing";
import styles from "@/components/platinum-cloud-server/platinum-cloud.module.css";
import dedicatedStyles from "./dedicated.module.css";

const benefits = [
  {
    icon: Headphones,
    title: "Hỗ trợ 24/7",
    text: "Tiếp nhận yêu cầu qua cổng khách hàng",
  },
  {
    icon: Zap,
    title: "Chủ động quản trị",
    text: "Chủ động cài đặt và cấu hình dịch vụ",
  },
  {
    icon: ShieldCheck,
    title: "Remote KVM",
    text: "Truy cập quản trị máy chủ từ xa",
  },
  {
    icon: Layers,
    title: "Dễ dàng nâng cấp",
    text: "Tư vấn tài nguyên theo tải thực tế",
  },
];

function specIcon(spec: string) {
  if (/CPU/i.test(spec)) return Cpu;
  if (/RAM|DDR4/i.test(spec)) return MemoryStick;
  if (/SSD|NVMe/i.test(spec)) return HardDrive;
  if (/băng thông|Bandwidth/i.test(spec)) return ArrowDownUp;
  if (/Network|[GM]bps/i.test(spec)) return Network;
  if (/IPv4|IPv6/i.test(spec)) return Globe2;
  return Check;
}

export function DedicatedPricing({
  initialProducts,
}: {
  initialProducts: DedicatedProduct[] | null;
}) {
  const [products, setProducts] = useState(initialProducts);
  const [cycle, setCycle] = useState<BillingCycle>("biennially");
  const [expanded, setExpanded] = useState(false);
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const controller = useRef<AbortController | null>(null);
  const cycleTabs = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => () => controller.current?.abort(), []);
  const available = dedicatedBillingCycles.filter(({ key }) =>
    products?.some((p) => p.pricing.VND[key] !== undefined),
  );
  const selected = available.find((item) => item.key === cycle) || available[0];
  const displayed =
    products?.filter(
      (p) =>
        expanded || p.available || !products.some((item) => item.available),
    ) || [];
  function cycleKeyboard(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % available.length;
    else if (event.key === "ArrowLeft")
      next = (index - 1 + available.length) % available.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = available.length - 1;
    else return;
    event.preventDefault();
    setCycle(available[next].key);
    cycleTabs.current[next]?.focus();
    cycleTabs.current[next]?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
    });
  }
  async function retry() {
    controller.current?.abort();
    const request = new AbortController();
    controller.current = request;
    setPending(true);
    setFailed(false);
    try {
      const response = await fetch("/api/dedicated-server-pricing/", {
        signal: request.signal,
      });
      if (!response.ok) throw new Error("Pricing unavailable");
      const result = await response.json();
      if (!Array.isArray(result.products) || !result.products.length)
        throw new Error("No products");
      setProducts(result.products);
    } catch {
      if (!request.signal.aborted) setFailed(true);
    } finally {
      if (!request.signal.aborted) setPending(false);
    }
  }
  return (
    <section
      id="bang-gia"
      className={`${styles.section} ${styles.pricingSection}`}
      aria-labelledby="dedicated-pricing-title"
    >
      <div className={`container ${styles.pricingLayout}`}>
        <div className={styles.pricingIntro}>
          <span className={styles.lightEyebrow}>
            <ReceiptText size={16} aria-hidden="true" />
            INTER DEDI POWER SERIES
          </span>
          <h2 id="dedicated-pricing-title">
            Chọn cấu hình máy chủ cho hệ thống của bạn
          </h2>
          <p>
            CPU Intel Xeon, RAM DDR4 ECC và SSD RAID 1. Ưu đãi tặng server khi
            đăng ký 36 tháng theo điều kiện chương trình.
          </p>
          <a className="text-link" href="/lien-he/">
            Tư vấn cấu hình phù hợp <ArrowRight size={17} aria-hidden="true" />
          </a>
        </div>
        <noscript>
          <p className={styles.noScriptNote}>
            Bật JavaScript để đổi chu kỳ và mở rộng bảng giá, hoặc xem đầy đủ
            cấu hình tại{" "}
            <a href="https://support.interdata.vn/index.php?rp=/store/inter-dedi-power-series">
              cổng đăng ký Thuê Máy Chủ
            </a>
            .
          </p>
        </noscript>
        <div className={styles.pricingBody}>
          {products?.length && selected ? (
            <>
              <div className={styles.pricingControls}>
                <div className={styles.billingControl}>
                  <span
                    id="dedicated-cycle-label"
                    className={styles.cycleLabel}
                  >
                    Chu kỳ thanh toán
                  </span>
                  <div
                    className={styles.billingTabs}
                    role="tablist"
                    aria-labelledby="dedicated-cycle-label"
                  >
                    {available.map((item, index) => (
                      <button
                        key={item.key}
                        ref={(element) => {
                          cycleTabs.current[index] = element;
                        }}
                        type="button"
                        role="tab"
                        id={`dedicated-cycle-${item.key}`}
                        aria-selected={selected.key === item.key}
                        aria-controls="dedicated-plans"
                        tabIndex={selected.key === item.key ? 0 : -1}
                        onClick={() => setCycle(item.key)}
                        onKeyDown={(event) => cycleKeyboard(event, index)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div
                className={styles.planGrid}
                id="dedicated-plans"
                role="tabpanel"
                aria-labelledby={`dedicated-cycle-${selected.key}`}
                tabIndex={0}
              >
                {displayed.map((product) => {
                  const price = product.pricing.VND[selected.key];
                  const monthlyPrice =
                    price === undefined
                      ? undefined
                      : Math.round(Number(price) / selected.months);
                  const originalPrice =
                    dedicatedOriginalPrices[product.pid]?.[selected.key];
                  const originalMonthlyPrice =
                    price !== undefined &&
                    originalPrice !== undefined &&
                    originalPrice > Number(price)
                      ? Math.round(originalPrice / selected.months)
                      : undefined;
                  const purchasable = price !== undefined && product.available;
                  const popular = product.slug === "inter-dedi-pro";
                  return (
                    <article
                      key={product.pid}
                      data-pid={product.pid}
                      data-popular={popular || undefined}
                      className={`${styles.plan} ${popular ? styles.accentPlan : ""}`}
                    >
                      {popular && (
                        <span className={styles.popularTag}>
                          <Crown size={16} aria-hidden="true" /> Gợi ý cấu hình
                        </span>
                      )}
                      <h3>{product.name}</h3>
                      <div
                        className={`${styles.planPrice} ${dedicatedStyles.priceBlock}`}
                        data-highlighted={popular || undefined}
                      >
                        {originalMonthlyPrice !== undefined && (
                          <del className={dedicatedStyles.originalPrice}>
                            <span className="sr-only">Giá gốc: </span>
                            {formatVnd(originalMonthlyPrice)}
                            <span>/tháng</span>
                          </del>
                        )}
                        <div className={dedicatedStyles.monthlyPrice}>
                          <strong
                            className={
                              formatVnd(monthlyPrice).length > 10
                                ? styles.longPrice
                                : undefined
                            }
                          >
                            {formatVnd(monthlyPrice)}
                          </strong>
                          {monthlyPrice !== undefined && <span>/tháng</span>}
                        </div>
                      </div>
                      {!product.available && (
                        <p className={styles.availabilityNote}>
                          Tạm hết tài nguyên · Liên hệ kiểm tra
                        </p>
                      )}
                      <ul>
                        {productSpecs(product)
                          .filter((spec) => !/^Giá chỉ/i.test(spec))
                          .map((spec, i) => {
                            const Icon = specIcon(spec);
                            return (
                              <li key={i}>
                                <Icon size={20} aria-hidden="true" />
                                <span>{spec}</span>
                              </li>
                            );
                          })}
                      </ul>
                      <a
                        className={`button ${styles.planButton} ${popular ? "primary" : styles.outlineButton}`}
                        href={
                          purchasable
                            ? checkoutUrl(product, selected.key)
                            : "/lien-he/"
                        }
                        rel={purchasable ? "nofollow" : undefined}
                        aria-label={`${purchasable ? "Đăng ký" : "Tư vấn"} ${product.name}`}
                      >
                        {purchasable ? "Đăng ký ngay" : "Liên hệ tư vấn"}
                        <ArrowRight size={15} aria-hidden="true" />
                      </a>
                    </article>
                  );
                })}
              </div>
              {products.some((p) => !p.available) && (
                <div className={styles.center}>
                  <button
                    className={styles.moreButton}
                    type="button"
                    aria-expanded={expanded}
                    aria-controls="dedicated-plans"
                    onClick={() => setExpanded(!expanded)}
                  >
                    <span className={styles.moreButtonLabel}>
                      {expanded
                        ? "Thu gọn bảng giá"
                        : "Xem thêm cấu hình tạm hết hàng"}
                      <ChevronDown
                        size={16}
                        aria-hidden="true"
                        className={expanded ? styles.flipped : undefined}
                      />
                    </span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div
              className={styles.pricingError}
              role="status"
              aria-live="polite"
            >
              <RefreshCw size={28} aria-hidden="true" />
              <h3>Chưa tải được bảng giá Thuê Máy Chủ</h3>
              <p>
                {failed
                  ? "Kết nối chưa thành công. Bạn có thể thử lại hoặc liên hệ để được tư vấn cấu hình và chi phí."
                  : "Vui lòng thử lại để xem cấu hình và giá hiện tại."}
              </p>
              <button
                type="button"
                className="button primary"
                disabled={pending}
                onClick={retry}
              >
                {pending ? "Đang tải bảng giá…" : "Thử lại"}
              </button>
            </div>
          )}
        </div>
        <ul
          className={styles.pricingBenefits}
          aria-label="Tiện ích Thuê Máy Chủ"
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
