"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown, Flame } from "lucide-react";
import content from "@/data/vps-content.json";
import {
  checkoutUrl,
  formatVnd,
  productSpecs,
  standardPrice,
  visibleProducts,
  pricingGids,
  type BillingCycle,
  type VpsPrices,
  type VpsProduct,
} from "@/data/vps-pricing";
import { CardRail } from "./card-rail";
import styles from "./vps.module.css";

function TabButtons({
  items,
  selected,
  select,
  label,
  prefix,
}: {
  items: { key: string; label: string }[];
  selected: string;
  select: (key: string) => void;
  label: string;
  prefix: string;
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
    <div className={styles.tabs} role="tablist" aria-label={label}>
      {items.map((item, index) => (
        <button
          key={item.key}
          ref={(element) => {
            buttons.current[index] = element;
          }}
          type="button"
          role="tab"
          id={`${prefix}-tab-${item.key}`}
          aria-controls={`${prefix}-panel-${item.key}`}
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

function ProductCard({
  product,
  index,
  cycle,
  period,
  hot = false,
}: {
  product: VpsProduct;
  index: number;
  cycle?: BillingCycle;
  period?: string;
  hot?: boolean;
}) {
  const price = hot
    ? { value: product.pricing.VND[cycle!], period: period! }
    : standardPrice(product);
  const featured = index === (hot ? 1 : 2);
  const originals = content.hotDeals.originalPrices as Record<
    string,
    Partial<Record<BillingCycle, number>>
  >;
  const original = cycle ? originals[product.name]?.[cycle] : undefined;
  return (
    <article
      className={`${styles.product} ${featured ? `${styles.featured} dark` : ""}`}
      data-pid={product.pid}
    >
      {featured && (
        <span className={styles.popular}>
          {hot ? "Phổ biến" : "Gói phổ biến"}
        </span>
      )}
      <h3>{product.name}</h3>
      <div className={styles.priceBlock}>
        {hot && original && (
          <del>
            {formatVnd(original)} / {period}
          </del>
        )}
        <strong className={styles.price}>{formatVnd(price.value)}</strong>
        <span className={styles.period}>/ {price.period}</span>
        {hot && <span className={styles.renewal}>Gia hạn không đổi giá</span>}
      </div>
      <a
        className={`button ${featured ? styles.whiteButton : "primary"}`}
        href={checkoutUrl(product, cycle)}
        target={hot ? undefined : "_blank"}
        rel="nofollow noopener noreferrer"
        title={product.name}
      >
        {hot ? `Đăng ký ${period}` : "Đăng ký"}
      </a>
      <ul>
        {productSpecs(product, hot).map((spec, specIndex) => (
          <li key={`${specIndex}-${spec}`}>
            <Check size={17} aria-hidden="true" />
            <span>{spec}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function ProductTable({
  products,
  label,
}: {
  products: VpsProduct[];
  label: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const filtered = visibleProducts(products);
  const displayed = expanded ? filtered : filtered.slice(0, 6);
  return (
    <>
      <CardRail
        label={label}
        count={displayed.length}
        grid
        key={String(expanded)}
      >
        {displayed.map((product, index) => (
          <ProductCard key={product.pid} product={product} index={index} />
        ))}
      </CardRail>
      {filtered.length > 6 && (
        <div className={styles.center}>
          <button
            type="button"
            className={styles.more}
            aria-expanded={expanded}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Thu gọn" : "Xem thêm"}
            <ChevronDown size={17} aria-hidden="true" />
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
  const [cycle, setCycle] = useState<BillingCycle>(
    (content.hotDeals.cycles.find((item) =>
      prices[100]?.some(
        (product) => Number(product.pricing.VND[item.key as BillingCycle]) > 0,
      ),
    )?.key as BillingCycle) || "annually",
  );
  const availableCycles = content.hotDeals.cycles.filter((item) =>
    prices[100]?.some(
      (product) => Number(product.pricing.VND[item.key as BillingCycle]) > 0,
    ),
  );
  const selectedCycle =
    availableCycles.find((item) => item.key === cycle) || availableCycles[0];
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const missing = pricingGids.filter((gid) => !initialPrices[gid]);
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
        <p>
          {gid === 100
            ? "Bảng giá Hot Deals đang được đồng bộ. Vui lòng tải lại trang hoặc liên hệ tư vấn để nhận cấu hình mới nhất."
            : "Chưa tải được bảng giá. Vui lòng thử lại hoặc liên hệ tư vấn."}
        </p>
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
        className={`${styles.section} ${styles.subtle}`}
        id="hot-deals"
        aria-labelledby="hot-deals-title"
      >
        <div className="container">
          <div className={styles.sectionHeading}>
            <span className={styles.dealEyebrow}>
              <Flame size={15} aria-hidden="true" />
              {
                content.hotDeals.blocks.find((item) => item.tag === "span")
                  ?.text
              }
            </span>
            <h2 id="hot-deals-title">
              {content.hotDeals.blocks.find((item) => item.tag === "h2")?.text}
            </h2>
            <p>
              {content.hotDeals.blocks.find((item) => item.tag === "p")?.text}
            </p>
          </div>
          {prices[100]?.length && selectedCycle ? (
            <>
              <TabButtons
                items={availableCycles}
                selected={selectedCycle.key}
                select={(key) => setCycle(key as BillingCycle)}
                label="Chọn chu kỳ Hot Deals"
                prefix="hot"
              />
              {availableCycles.map((item) => (
                <div
                  key={item.key}
                  id={`hot-panel-${item.key}`}
                  role="tabpanel"
                  aria-labelledby={`hot-tab-${item.key}`}
                  hidden={selectedCycle.key !== item.key}
                  tabIndex={0}
                >
                  <CardRail
                    label="Các gói Hot Deals"
                    count={prices[100]!.length}
                    grid
                  >
                    {prices[100]!.map((product, index) => (
                      <ProductCard
                        key={product.pid}
                        product={product}
                        index={index}
                        cycle={item.key as BillingCycle}
                        period={item.label}
                        hot
                      />
                    ))}
                  </CardRail>
                </div>
              ))}
            </>
          ) : (
            unavailable(100)
          )}
        </div>
      </section>
      <section
        className={styles.section}
        id="pricing"
        aria-labelledby="pricing-title"
      >
        <div className="container">
          <div className={styles.sectionHeading}>
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
