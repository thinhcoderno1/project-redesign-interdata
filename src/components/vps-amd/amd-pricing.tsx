"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowRight, Check, ChevronDown, RefreshCw } from "lucide-react";
import { amdBillingCycles } from "@/data/vps-amd";
import {
  checkoutUrl,
  formatVnd,
  productSpecs,
  type BillingCycle,
  type VpsProduct,
} from "@/data/vps-pricing";
import styles from "./amd.module.css";

const ranges = [
  { key: "all", label: "Tất cả cấu hình", min: 0, max: Infinity },
  { key: "small", label: "1–2 vCPU", min: 1, max: 2 },
  { key: "medium", label: "3–8 vCPU", min: 3, max: 8 },
  { key: "large", label: "Từ 10 vCPU", min: 10, max: Infinity },
] as const;
type RangeKey = (typeof ranges)[number]["key"];

export function AmdPricing({
  initialProducts,
}: {
  initialProducts: VpsProduct[] | null;
}) {
  const [products, setProducts] = useState(initialProducts);
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [range, setRange] = useState<RangeKey>("all");
  const [expanded, setExpanded] = useState(false);
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const controller = useRef<AbortController | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => () => controller.current?.abort(), []);
  const available = amdBillingCycles.filter(({ key }) =>
    products?.some((p) => p.pricing.VND[key] !== undefined),
  );
  const selected = available.find((item) => item.key === cycle) || available[0];
  const rangeDefinition = ranges.find((item) => item.key === range)!;
  const filtered =
    products?.filter((product) => {
      if (range === "all") return true;
      const line =
        productSpecs(product).find((spec) => /\bvCPU\b/i.test(spec)) || "";
      const cores = Number(line.match(/(\d+)\s*vCPU/i)?.[1]);
      return cores >= rangeDefinition.min && cores <= rangeDefinition.max;
    }) || [];
  const displayed = expanded ? filtered : filtered.slice(0, 4);
  function selectRange(key: RangeKey) {
    setRange(key);
    setExpanded(false);
  }
  function keyboard(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % ranges.length;
    else if (event.key === "ArrowLeft")
      next = (index - 1 + ranges.length) % ranges.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = ranges.length - 1;
    else return;
    event.preventDefault();
    selectRange(ranges[next].key);
    tabs.current[next]?.focus();
    tabs.current[next]?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }
  async function retry() {
    controller.current?.abort();
    const request = new AbortController();
    controller.current = request;
    setPending(true);
    setFailed(false);
    try {
      const response = await fetch("/api/vps-amd-pricing/", {
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
      aria-labelledby="amd-pricing-title"
    >
      <div className={`container ${styles.pricingLayout}`}>
        <div className={styles.pricingIntro}>
          <span className={styles.lightEyebrow}>BẢNG GIÁ VPS AMD</span>
          <h2 id="amd-pricing-title">
            Đa dạng cấu hình,
            <br />
            phù hợp nhu cầu
          </h2>
          <p>
            Chọn số vCPU, RAM, dung lượng NVMe và băng thông theo ứng dụng của
            bạn. Giá và cấu hình được cập nhật từ hệ thống đăng ký InterData.
          </p>
          <a className="text-link" href="/lien-he/">
            Tư vấn cấu hình phù hợp <ArrowRight size={17} aria-hidden="true" />
          </a>
        </div>
        <div className={styles.pricingBody}>
          {products?.length && selected ? (
            <>
              <div className={styles.pricingControls}>
                <div
                  className={styles.rangeTabs}
                  role="tablist"
                  aria-label="Chọn cấu hình theo vCPU"
                >
                  {ranges.map((item, index) => (
                    <button
                      key={item.key}
                      ref={(element) => {
                        tabs.current[index] = element;
                      }}
                      type="button"
                      role="tab"
                      id={`amd-filter-${item.key}`}
                      aria-selected={range === item.key}
                      aria-controls="amd-plans"
                      tabIndex={range === item.key ? 0 : -1}
                      onClick={() => selectRange(item.key)}
                      onKeyDown={(event) => keyboard(event, index)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <label className={styles.cycleLabel}>
                  Chu kỳ thanh toán
                  <select
                    value={selected.key}
                    onChange={(event) =>
                      setCycle(event.target.value as BillingCycle)
                    }
                    aria-label="Chu kỳ thanh toán"
                  >
                    {available.map((item) => (
                      <option key={item.key} value={item.key}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div
                className={styles.planGrid}
                id="amd-plans"
                role="tabpanel"
                aria-labelledby={`amd-filter-${range}`}
                tabIndex={0}
              >
                {displayed.map((product, index) => {
                  const price = product.pricing.VND[selected.key];
                  const purchasable = price !== undefined;
                  return (
                    <article
                      key={product.pid}
                      data-pid={product.pid}
                      className={`${styles.plan} ${index === 1 ? styles.accentPlan : ""}`}
                    >
                      <span className={styles.planPlatform}>
                        AMD EPYC / NVMe
                      </span>
                      <h3>{product.name}</h3>
                      <div className={styles.planPrice}>
                        <strong>{formatVnd(price)}</strong>
                        <span>/ {selected.label}</span>
                      </div>
                      <ul>
                        {productSpecs(product).map((spec, i) => (
                          <li key={i}>
                            <Check size={14} aria-hidden="true" />
                            <span>{spec}</span>
                          </li>
                        ))}
                      </ul>
                      <a
                        className={`button ${styles.planButton} ${index === 1 ? "primary" : styles.outlineButton}`}
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
                {!displayed.length && (
                  <p className={styles.emptyPlans}>
                    Chưa có gói trong nhóm cấu hình này. Hãy chọn nhóm khác hoặc
                    liên hệ tư vấn.
                  </p>
                )}
              </div>
              <p className={styles.billingNote}>
                Giá hiển thị là tổng tiền cho {selected.label}. Kiểm tra thuế,
                tùy chọn bổ sung và tình trạng cung cấp tại trang đăng ký.
              </p>
              {filtered.length > 4 && (
                <div className={styles.center}>
                  <button
                    className={styles.moreButton}
                    type="button"
                    aria-expanded={expanded}
                    aria-controls="amd-plans"
                    onClick={() => setExpanded(!expanded)}
                  >
                    {expanded
                      ? "Thu gọn bảng giá"
                      : `Xem tất cả ${filtered.length} gói VPS AMD`}
                    <ChevronDown
                      size={16}
                      aria-hidden="true"
                      className={expanded ? styles.flipped : undefined}
                    />
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
              <h3>Chưa tải được bảng giá VPS AMD</h3>
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
      </div>
    </section>
  );
}
