"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import {
  ArrowDownUp,
  ArrowRight,
  Check,
  ChevronDown,
  Cpu,
  Crown,
  Globe2,
  HardDrive,
  MemoryStick,
  Network,
} from "lucide-react";
import content from "@/data/vps-content.json";
import { amdBillingCycles } from "@/data/vps-amd";
import {
  checkoutUrl,
  formatVnd,
  productSpecs,
  visibleProducts,
  standardPricingGids,
  type BillingCycle,
  type VpsPrices,
  type VpsProduct,
} from "@/data/vps-pricing";
import styles from "./pricing.module.css";

function TabButtons({
  items,
  selected,
  select,
  label,
  prefix,
  cycles = false,
  panelId,
}: {
  items: { key: string; label: string }[];
  selected: string;
  select: (key: string) => void;
  label: string;
  prefix: string;
  cycles?: boolean;
  panelId?: string;
}) {
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    const button =
      buttons.current[items.findIndex((item) => item.key === selected)];
    const list = button?.parentElement;
    if (!button || !list) return;
    const reveal = () => {
      const itemBounds = button.getBoundingClientRect();
      const listBounds = list.getBoundingClientRect();
      if (itemBounds.left < listBounds.left)
        list.scrollLeft += itemBounds.left - listBounds.left - 4;
      else if (itemBounds.right > listBounds.right)
        list.scrollLeft += itemBounds.right - listBounds.right + 4;
    };
    const observer = new ResizeObserver(reveal);
    observer.observe(list);
    observer.observe(button);
    return () => observer.disconnect();
  }, [items, selected]);
  function keyboard(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % items.length;
    else if (event.key === "ArrowLeft")
      next = (index - 1 + items.length) % items.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;
    else return;
    event.preventDefault();
    select(items[next].key);
    buttons.current[next]?.focus();
  }
  return (
    <div
      className={cycles ? styles.billingTabs : styles.serviceTabs}
      role="tablist"
      aria-label={label}
      style={
        cycles ? ({ "--tab-count": items.length } as CSSProperties) : undefined
      }
    >
      {items.map((item, index) => (
        <button
          key={item.key}
          ref={(element) => {
            buttons.current[index] = element;
          }}
          type="button"
          role="tab"
          id={`${prefix}-tab-${item.key}`}
          aria-controls={panelId || `${prefix}-panel-${item.key}`}
          aria-selected={selected === item.key}
          tabIndex={selected === item.key ? 0 : -1}
          onClick={() => select(item.key)}
          onKeyDown={(event) => keyboard(event, index)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function specIcon(spec: string) {
  if (/\b(?:vCPU|vCore)\b/i.test(spec)) return Cpu;
  if (/\bRAM\b/i.test(spec)) return MemoryStick;
  if (/SSD|NVMe/i.test(spec)) return HardDrive;
  if (/băng thông|bandwidth/i.test(spec)) return ArrowDownUp;
  if (/Network|Gbps/i.test(spec)) return Network;
  if (/IPv4|IPv6/i.test(spec)) return Globe2;
  return Check;
}

function ProductCard({
  product,
  index,
  cycle,
  period,
}: {
  product: VpsProduct;
  index: number;
  cycle: BillingCycle;
  period: string;
}) {
  const price = { value: product.pricing.VND[cycle], period };
  const purchasable = Number(price.value) > 0;
  const featured = index === 2;
  return (
    <article
      className={`${styles.plan} ${featured ? styles.accentPlan : ""}`}
      data-pid={product.pid}
    >
      {featured && (
        <span className={styles.popularTag}>
          <Crown size={16} aria-hidden="true" />
          Gói phổ biến
        </span>
      )}
      <h3>{product.name}</h3>
      <div className={styles.planPrice}>
        <strong
          className={
            formatVnd(price.value).length > 10 ? styles.longPrice : undefined
          }
        >
          {purchasable ? formatVnd(price.value) : "Liên hệ"}
        </strong>
        <span className={styles.period}>/ {price.period}</span>
      </div>
      <ul>
        {productSpecs(product).map((spec, specIndex) => {
          const Icon = specIcon(spec);
          return (
            <li key={`${specIndex}-${spec}`}>
              <Icon size={20} aria-hidden="true" />
              <span>{spec}</span>
            </li>
          );
        })}
      </ul>
      <a
        className={`button ${styles.planButton} ${featured ? "primary" : styles.outlineButton}`}
        href={purchasable ? checkoutUrl(product, cycle) : "/lien-he/"}
        target="_blank"
        rel="nofollow noopener noreferrer"
        title={product.name}
      >
        {purchasable ? "Đăng ký" : "Liên hệ tư vấn"}
        <ArrowRight size={15} aria-hidden="true" />
      </a>
    </article>
  );
}

function ProductTable({
  products,
  label,
  gid,
}: {
  products: VpsProduct[];
  label: string;
  gid: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const filtered = visibleProducts(products);
  const [cycle, setCycle] = useState<BillingCycle>(
    Number(filtered[0]?.pricing.VND.monthly) > 0 ? "monthly" : "quarterly",
  );
  const available = amdBillingCycles.filter(({ key }) =>
    filtered.some((product) => Number(product.pricing.VND[key]) > 0),
  );
  const selected = available.find((item) => item.key === cycle) || available[0];
  const displayed = expanded ? filtered : filtered.slice(0, 4);
  const panelId = `vps-plans-${gid}`;
  if (!selected)
    return (
      <p role="status">
        Chưa có chu kỳ thanh toán khả dụng. Vui lòng liên hệ tư vấn.
      </p>
    );
  return (
    <>
      <div className={styles.pricingControls}>
        <div className={styles.billingControl}>
          <span className={styles.cycleLabel}>Chu kỳ thanh toán</span>
          <TabButtons
            items={available}
            selected={selected.key}
            select={(key) => setCycle(key as BillingCycle)}
            label={`Chu kỳ thanh toán ${label}`}
            prefix={`vps-cycle-${gid}`}
            panelId={panelId}
            cycles
          />
          <p className={styles.cycleNote}>
            Giá hiển thị là tổng tiền cho chu kỳ đã chọn.
          </p>
        </div>
      </div>
      <div
        className={styles.planGrid}
        id={panelId}
        role="tabpanel"
        aria-labelledby={`vps-cycle-${gid}-tab-${selected.key}`}
        tabIndex={0}
      >
        {displayed.map((product, index) => (
          <ProductCard
            key={product.pid}
            product={product}
            index={index}
            cycle={selected.key}
            period={selected.label}
          />
        ))}
      </div>
      {filtered.length > 4 && (
        <div className={styles.center}>
          <button
            type="button"
            className={styles.more}
            aria-expanded={expanded}
            aria-controls={panelId}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Thu gọn" : "Xem thêm"}
            <ChevronDown
              size={17}
              aria-hidden="true"
              className={expanded ? styles.flipped : undefined}
            />
          </button>
        </div>
      )}
    </>
  );
}

export function Pricing({ initialPrices }: { initialPrices: VpsPrices }) {
  const [selected, setSelected] = useState(content.pricing.defaultGid);
  const [prices, setPrices] = useState(initialPrices);
  const [pending, setPending] = useState<number | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const missing = standardPricingGids.filter((gid) => !initialPrices[gid]);
    for (const gid of missing) {
      fetch(`/api/vps-pricing/?gid=${gid}`, { signal: controller.signal })
        .then(async (response) => {
          if (!response.ok) return;
          const result = await response.json();
          if (active)
            setPrices((previous) => ({ ...previous, [gid]: result.products }));
        })
        .catch(() => {
          /* The visible retry action remains available. */
        });
    }
    return () => {
      active = false;
      controller.abort();
    };
  }, [initialPrices]);
  async function retry(gid: number) {
    if (pending !== null) return;
    setPending(gid);
    try {
      const response = await fetch(`/api/vps-pricing/?gid=${gid}`);
      if (!response.ok) throw new Error("Pricing unavailable");
      const result = await response.json();
      setPrices((previous) => ({ ...previous, [gid]: result.products }));
    } catch {
      setPrices((previous) => ({ ...previous, [gid]: null }));
    } finally {
      setPending(null);
    }
  }
  function unavailable(gid: number) {
    return (
      <div className={styles.unavailable} role="status">
        <p>Chưa tải được bảng giá. Vui lòng thử lại hoặc liên hệ tư vấn.</p>
        <button
          type="button"
          className={styles.more}
          disabled={pending !== null}
          onClick={() => retry(gid)}
        >
          {pending === gid ? "Đang tải…" : "Thử lại"}
        </button>
      </div>
    );
  }
  return (
    <>
      <section
        className={styles.pricingSection}
        id="pricing"
        aria-labelledby="pricing-title"
      >
        <div className={`container ${styles.pricingLayout}`}>
          <div className={styles.pricingIntro}>
            <span className={styles.eyebrow}>BẢNG GIÁ VPS</span>
            <h2 id="pricing-title">
              {content.pricing.blocks.find((item) => item.tag === "h2")?.text}
            </h2>
            <p>
              {content.pricing.blocks.find((item) => item.tag === "p")?.text}
            </p>
          </div>
          <TabButtons
            items={content.pricing.services.map((service) => ({
              key: String(service.gid),
              label: service.label,
            }))}
            selected={String(selected)}
            select={(key) => setSelected(Number(key))}
            label="Chọn dòng VPS"
            prefix="vps"
          />
          {content.pricing.services.map((service) => (
            <div
              key={service.gid}
              id={`vps-panel-${service.gid}`}
              role="tabpanel"
              aria-labelledby={`vps-tab-${service.gid}`}
              hidden={selected !== service.gid}
              tabIndex={0}
            >
              {prices[service.gid]?.length ? (
                <ProductTable
                  products={prices[service.gid]!}
                  label={service.label}
                  gid={service.gid}
                />
              ) : (
                unavailable(service.gid)
              )}
            </div>
          ))}
          <noscript>
            <div className={styles.noScript}>
              {content.pricing.services.map((service) => (
                <a key={service.gid} href={service.href}>
                  {service.label}
                </a>
              ))}
            </div>
          </noscript>
        </div>
      </section>
    </>
  );
}
