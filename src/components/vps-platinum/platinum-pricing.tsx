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
  platinumBillingCycles,
  platinumGroups,
  type PlatinumGid,
  type PlatinumPrices,
} from "@/data/vps-platinum";
import {
  checkoutUrl,
  formatVnd,
  productSpecs,
  type BillingCycle,
} from "@/data/vps-pricing";
import styles from "./platinum.module.css";

const benefits = [
  {
    icon: Headphones,
    title: "Hỗ trợ 24/7",
    text: "Tiếp nhận yêu cầu qua cổng khách hàng",
  },
  {
    icon: Zap,
    title: "Chủ động quản trị",
    text: "Cài đặt phần mềm với quyền root",
  },
  {
    icon: ShieldCheck,
    title: "Backup định kỳ",
    text: "Xác nhận lịch sao lưu theo gói",
  },
  {
    icon: Layers,
    title: "Dễ dàng nâng cấp",
    text: "Tư vấn tài nguyên theo tải thực tế",
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

export function PlatinumPricing({
  initialPrices,
}: {
  initialPrices: PlatinumPrices;
}) {
  const [prices, setPrices] = useState(initialPrices);
  const [gid, setGid] = useState<PlatinumGid>(101);
  const products =
    prices[gid]?.filter(
      (product) =>
        !/HN|custom/i.test(product.name) && !product.slug.startsWith("custom"),
    ) ?? null;
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [expanded, setExpanded] = useState(false);
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const controller = useRef<AbortController | null>(null);
  const cycleTabs = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => () => controller.current?.abort(), []);
  const available = platinumBillingCycles.filter(({ key }) =>
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
      const response = await fetch(`/api/vps-platinum-pricing/?gid=${gid}`, {
        signal: request.signal,
      });
      if (!response.ok) throw new Error("Pricing unavailable");
      const result = await response.json();
      if (!Array.isArray(result.products) || !result.products.length)
        throw new Error("No products");
      setPrices((previous) => ({ ...previous, [gid]: result.products }));
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
      aria-labelledby="platinum-pricing-title"
    >
      <div className={`container ${styles.pricingLayout}`}>
        <div className={styles.pricingIntro}>
          <span className={styles.lightEyebrow}>
            <ReceiptText size={16} aria-hidden="true" />
            BẢNG GIÁ VPS PLATINUM
          </span>
          <h2 id="platinum-pricing-title">Đa dạng cấu hình, phù hợp nhu cầu</h2>
          <p>
            Chọn số vCPU, RAM, dung lượng NVMe và băng thông theo ứng dụng của
            bạn. Giá và cấu hình được cập nhật từ hệ thống đăng ký InterData.
          </p>
          <a className="text-link" href="/lien-he/">
            Tư vấn cấu hình phù hợp <ArrowRight size={17} aria-hidden="true" />
          </a>
        </div>
        <div className={styles.groupControl}>
          <label htmlFor="platinum-group">Dòng VPS PLATINUM</label>
          <select
            id="platinum-group"
            value={gid}
            onChange={(event) => {
              controller.current?.abort();
              setPending(false);
              setFailed(false);
              setExpanded(false);
              setGid(Number(event.target.value) as PlatinumGid);
            }}
          >
            {platinumGroups.map((group) => (
              <option key={group.gid} value={group.gid}>
                {group.label}
              </option>
            ))}
          </select>
          <p>
            Giá hiển thị là tổng tiền của chu kỳ đã chọn. Kiểm tra thuế, tùy
            chọn và giá gia hạn tại trang đăng ký.
          </p>
        </div>
        <noscript>
          <p className={styles.noScriptNote}>
            Bật JavaScript để đổi dòng VPS, chu kỳ và mở rộng bảng giá. Bạn cũng
            có thể xem toàn bộ cấu hình tại{" "}
            <a href="https://support.interdata.vn/index.php?rp=/store/vps-platinum">
              VPS PLATINUM FPT
            </a>
            ,{" "}
            <a href="https://support.interdata.vn/index.php?rp=/store/vps-platinum-viettel-hcm">
              VPS PLATINUM VIETTEL
            </a>{" "}
            hoặc{" "}
            <a href="https://support.interdata.vn/index.php?rp=/store/inter-platinum-series-2026">
              Hot Deals Inter Platinum
            </a>
            .
          </p>
        </noscript>
        <div className={styles.pricingBody}>
          {products?.length && selected ? (
            <>
              <div className={styles.pricingControls}>
                <div className={styles.billingControl}>
                  <span id="platinum-cycle-label" className={styles.cycleLabel}>
                    Chu kỳ thanh toán
                  </span>
                  <div
                    className={styles.billingTabs}
                    role="tablist"
                    aria-labelledby="platinum-cycle-label"
                  >
                    {available.map((item, index) => (
                      <button
                        key={item.key}
                        ref={(element) => {
                          cycleTabs.current[index] = element;
                        }}
                        type="button"
                        role="tab"
                        id={`platinum-cycle-${item.key}`}
                        aria-selected={selected.key === item.key}
                        aria-controls="platinum-plans"
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
                id="platinum-plans"
                role="tabpanel"
                aria-labelledby={`platinum-cycle-${selected.key}`}
                tabIndex={0}
              >
                {displayed.map((product) => {
                  const price = product.pricing.VND[selected.key];
                  const purchasable = price !== undefined;
                  const popular =
                    gid === 100
                      ? product.slug === "inter-platinum-2"
                      : product.slug.startsWith("plan-3");
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
                    aria-controls="platinum-plans"
                    onClick={() => setExpanded(!expanded)}
                  >
                    <span className={styles.moreButtonLabel}>
                      {expanded
                        ? "Thu gọn bảng giá"
                        : "Xem tất cả các gói VPS PLATINUM"}
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
              <h3>Chưa tải được bảng giá VPS PLATINUM</h3>
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
          aria-label="Tiện ích VPS PLATINUM"
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
