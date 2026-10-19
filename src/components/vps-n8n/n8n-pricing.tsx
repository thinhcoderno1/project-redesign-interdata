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
import { linuxBillingCycles as n8nBillingCycles } from "@/data/vps-linux";
import {
  n8nDefaultGid,
  n8nServices,
  type N8nGid,
  type N8nPrices,
} from "@/data/vps-n8n";
import {
  checkoutUrl,
  formatVnd,
  productSpecs,
  type BillingCycle,
} from "@/data/vps-pricing";
import styles from "./n8n.module.css";

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
const defaultService = n8nServices.find(({ gid }) => gid === n8nDefaultGid)!;

function specIcon(spec: string) {
  if (/\bvCPU\b/i.test(spec)) return Cpu;
  if (/\bRAM\b/i.test(spec)) return MemoryStick;
  if (/SSD|NVMe/i.test(spec)) return HardDrive;
  if (/băng thông|Bandwidth/i.test(spec)) return ArrowDownUp;
  if (/Network|[GM]bps/i.test(spec)) return Network;
  if (/IPv4|IPv6/i.test(spec)) return Globe2;
  return Check;
}

export function N8nPricing({ initialPrices }: { initialPrices: N8nPrices }) {
  const [prices, setPrices] = useState(initialPrices);
  const [gid, setGid] = useState<N8nGid>(n8nDefaultGid);
  const service = n8nServices.find((item) => item.gid === gid)!;
  const products = prices[gid];
  const serviceTabs = useRef<(HTMLButtonElement | null)[]>([]);
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [expanded, setExpanded] = useState(false);
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const controller = useRef<AbortController | null>(null);
  const cycleTabs = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => () => controller.current?.abort(), []);
  const available = n8nBillingCycles.filter(({ key }) =>
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
  function changeService(next: N8nGid) {
    controller.current?.abort();
    setPending(false);
    setFailed(false);
    setGid(next);
    setCycle(next === 20 ? "quarterly" : "monthly");
    setExpanded(false);
  }
  function serviceKeyboard(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % n8nServices.length;
    else if (event.key === "ArrowLeft")
      next = (index - 1 + n8nServices.length) % n8nServices.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = n8nServices.length - 1;
    else return;
    event.preventDefault();
    changeService(n8nServices[next].gid);
    serviceTabs.current[next]?.focus();
  }
  async function retry() {
    controller.current?.abort();
    const request = new AbortController();
    controller.current = request;
    setPending(true);
    setFailed(false);
    try {
      const response = await fetch(`/api/vps-n8n-pricing/?gid=${gid}`, {
        signal: request.signal,
      });
      if (!response.ok) throw new Error("Pricing unavailable");
      const result = await response.json();
      if (!Array.isArray(result.products) || !result.products.length)
        throw new Error("No products");
      if (!request.signal.aborted)
        setPrices((current) => ({ ...current, [gid]: result.products }));
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
      aria-labelledby="n8n-pricing-title"
    >
      <div className={`container ${styles.pricingLayout}`}>
        <div className={styles.pricingIntro}>
          <span className={styles.lightEyebrow}>
            <ReceiptText size={16} aria-hidden="true" />
            CHỌN VPS ĐỂ SELF-HOST N8N
          </span>
          <h2 id="n8n-pricing-title">Chọn dịch vụ VPS, bắt đầu với n8n</h2>
          <p>
            Tất cả dịch vụ VPS InterData đều hỗ trợ template hệ điều hành cài
            sẵn n8n. Chọn cấu hình VPS theo số workflow, mức chạy đồng thời và
            lượng dữ liệu cần xử lý.
          </p>
          <a className="text-link" href="/lien-he/">
            Tư vấn cấu hình phù hợp <ArrowRight size={17} aria-hidden="true" />
          </a>
        </div>
        <noscript>
          <p className={styles.noScriptNote}>
            Bật JavaScript để đổi dịch vụ, chu kỳ và mở rộng bảng giá, hoặc xem
            tại <a href={defaultService.store}>cổng đăng ký VPS Linux</a>. Các
            dòng VPS khác:
            {n8nServices
              .filter(({ gid }) => gid !== n8nDefaultGid)
              .map((item) => (
                <a key={item.gid} href={item.store}>
                  {" "}
                  {item.label}
                </a>
              ))}
            .
          </p>
        </noscript>
        <div
          className={styles.serviceTabs}
          role="tablist"
          aria-label="Dịch vụ VPS hỗ trợ template n8n"
        >
          {n8nServices.map((item, index) => (
            <button
              key={item.gid}
              type="button"
              role="tab"
              ref={(element) => {
                serviceTabs.current[index] = element;
              }}
              id={`n8n-service-${item.gid}`}
              aria-controls="n8n-service-panel"
              aria-selected={gid === item.gid}
              tabIndex={gid === item.gid ? 0 : -1}
              onClick={() => changeService(item.gid)}
              onKeyDown={(event) => serviceKeyboard(event, index)}
            >
              {item.label}
              {item.gid === n8nDefaultGid && (
                <span className={styles.servicePopular}>Phổ biến nhất</span>
              )}
            </button>
          ))}
        </div>
        <div
          className={styles.servicePanel}
          id="n8n-service-panel"
          role="tabpanel"
          aria-labelledby={`n8n-service-${gid}`}
          tabIndex={0}
        >
          <div className={styles.pricingBody}>
            {products?.length && selected ? (
              <>
                <div className={styles.pricingControls}>
                  <div className={styles.billingControl}>
                    <span id="n8n-cycle-label" className={styles.cycleLabel}>
                      Chu kỳ thanh toán
                    </span>
                    <div
                      className={styles.billingTabs}
                      role="tablist"
                      aria-labelledby="n8n-cycle-label"
                    >
                      {available.map((item, index) => (
                        <button
                          key={item.key}
                          ref={(element) => {
                            cycleTabs.current[index] = element;
                          }}
                          type="button"
                          role="tab"
                          id={`n8n-cycle-${item.key}`}
                          aria-selected={selected.key === item.key}
                          aria-controls="n8n-plans"
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
                  id="n8n-plans"
                  role="tabpanel"
                  aria-labelledby={`n8n-cycle-${selected.key}`}
                  tabIndex={0}
                >
                  {displayed.map((product) => {
                    const price = product.pricing.VND[selected.key];
                    const purchasable = price !== undefined;
                    const featured = /^plan-3(?:-|$)/i.test(product.slug);
                    return (
                      <article
                        key={product.pid}
                        data-pid={product.pid}
                        data-featured={featured || undefined}
                        className={`${styles.plan} ${featured ? styles.accentPlan : ""}`}
                      >
                        {featured && (
                          <span className={styles.popularTag}>
                            <Crown size={16} aria-hidden="true" />
                            Mua nhiều
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
                          className={`button ${styles.planButton} ${featured ? "primary" : styles.outlineButton}`}
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
                      aria-controls="n8n-plans"
                      onClick={() => setExpanded(!expanded)}
                    >
                      <span className={styles.moreButtonLabel}>
                        {expanded
                          ? "Thu gọn bảng giá"
                          : `Xem tất cả các gói ${service.label}`}
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
                <h3>Chưa tải được bảng giá {service.label}</h3>
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
        <ul
          className={styles.pricingBenefits}
          aria-label="Tiện ích khi triển khai"
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
