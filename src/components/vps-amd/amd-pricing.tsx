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
  ShieldCheck,
  Tags,
  Zap,
} from "lucide-react";
import { amdBillingCycles } from "@/data/vps-amd";
import {
  checkoutUrl,
  formatVnd,
  productSpecs,
  type BillingCycle,
  type VpsProduct,
} from "@/data/vps-pricing";
import styles from "./amd.module.css";

const benefits = [
  { icon: Headphones, title: "Hỗ trợ 24/7", text: "Luôn sẵn sàng hỗ trợ bạn" },
  {
    icon: Zap,
    title: "Triển khai nhanh",
    text: "Kích hoạt chỉ trong vài phút",
  },
  {
    icon: ShieldCheck,
    title: "Bảo mật toàn diện",
    text: "Chống DDoS, Backup định kỳ",
  },
  {
    icon: Layers,
    title: "Dễ dàng nâng cấp",
    text: "Linh hoạt theo nhu cầu sử dụng",
  },
];

function specIcon(spec: string) {
  if (/\bvCPU\b/i.test(spec)) return Cpu;
  if (/\bRAM\b/i.test(spec)) return MemoryStick;
  if (/SSD|NVMe/i.test(spec)) return HardDrive;
  if (/băng thông/i.test(spec)) return ArrowDownUp;
  if (/Network|Gbps/i.test(spec)) return Network;
  if (/IPv4|IPv6/i.test(spec)) return Globe2;
  return Check;
}

export function AmdPricing({
  initialProducts,
}: {
  initialProducts: VpsProduct[] | null;
}) {
  const [products, setProducts] = useState(initialProducts);
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [expanded, setExpanded] = useState(false);
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const controller = useRef<AbortController | null>(null);
  const cycleTabs = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => () => controller.current?.abort(), []);
  const available = amdBillingCycles.filter(({ key }) =>
    products?.some((p) => p.pricing.VND[key] !== undefined),
  );
  const selected = available.find((item) => item.key === cycle) || available[0];
  const displayed = expanded ? products || [] : products?.slice(0, 4) || [];
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
          <span className={styles.lightEyebrow}>
            <Tags size={16} aria-hidden="true" />
            BẢNG GIÁ VPS AMD
          </span>
          <h2 id="amd-pricing-title">Đa dạng cấu hình, phù hợp nhu cầu</h2>
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
                <div className={styles.billingControl}>
                  <span id="amd-cycle-label" className={styles.cycleLabel}>
                    Chu kỳ thanh toán
                  </span>
                  <div
                    className={styles.billingTabs}
                    role="tablist"
                    aria-labelledby="amd-cycle-label"
                  >
                    {available.map((item, index) => (
                      <button
                        key={item.key}
                        ref={(element) => {
                          cycleTabs.current[index] = element;
                        }}
                        type="button"
                        role="tab"
                        id={`amd-cycle-${item.key}`}
                        aria-selected={selected.key === item.key}
                        aria-controls="amd-plans"
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
                id="amd-plans"
                role="tabpanel"
                aria-labelledby={`amd-cycle-${selected.key}`}
                tabIndex={0}
              >
                {displayed.map((product) => {
                  const price = product.pricing.VND[selected.key];
                  const purchasable = price !== undefined;
                  const popular = product.slug === "plan-3";
                  return (
                    <article
                      key={product.pid}
                      data-pid={product.pid}
                      data-popular={popular || undefined}
                      className={`${styles.plan} ${popular ? styles.accentPlan : ""}`}
                    >
                      {popular && (
                        <span className={styles.popularTag}>
                          <Crown size={16} aria-hidden="true" /> Phổ biến
                        </span>
                      )}
                      <h3>{product.name}</h3>
                      <div className={styles.planPrice}>
                        <strong
                          className={
                            formatVnd(price).length > 10
                              ? styles.longPrice
                              : undefined
                          }
                        >
                          {formatVnd(price)}
                        </strong>
                        <span>/ {selected.label}</span>
                      </div>
                      <ul>
                        {productSpecs(product).map((spec, i) => {
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
              {products.length > 4 && (
                <div className={styles.center}>
                  <button
                    className={styles.moreButton}
                    type="button"
                    aria-expanded={expanded}
                    aria-controls="amd-plans"
                    onClick={() => setExpanded(!expanded)}
                  >
                    <span className={styles.moreButtonLabel}>
                      {expanded
                        ? "Thu gọn bảng giá"
                        : "Xem tất cả các gói VPS AMD"}
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
        <ul className={styles.pricingBenefits} aria-label="Tiện ích VPS AMD">
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
