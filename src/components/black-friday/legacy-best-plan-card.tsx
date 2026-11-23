import Image from "next/image";
import {
  ArrowDownUp,
  ArrowRight,
  ArrowUp,
  Check,
  ChevronDown,
  Cpu,
  Crown,
  Gift,
  Globe2,
  HardDrive,
  MemoryStick,
  Network,
} from "lucide-react";
import { checkoutUrl, formatVnd, type VpsProduct } from "@/data/vps-pricing";
import {
  blackFridaySpecs,
  getBlackFridaySavings,
  getBlackFridayUpgrade,
} from "@/data/black-friday-legacy-plans";
import type { BlackFridayCycle } from "@/lib/black-friday-pricing";
import styles from "./black-friday.module.css";
import legacy from "./black-friday-legacy-plans.module.css";

const periodLabels = {
  annually: "12 tháng",
  biennially: "24 tháng",
  triennially: "36 tháng",
} satisfies Record<BlackFridayCycle, string>;

function LegacySpecs({ product }: { product: VpsProduct }) {
  const specs = blackFridaySpecs(product);
  const isExtra = (spec: string) =>
    /IPv[46]|Network\s*Port|Unlimited\s*Bandwidth/i.test(spec);
  const primary = specs.filter((spec) => !isExtra(spec));
  const extra = specs.filter(isExtra);
  function specLine(spec: string) {
    const Icon = /vCPU|vCore/i.test(spec)
      ? Cpu
      : /RAM/i.test(spec)
        ? MemoryStick
        : /NVMe|SSD/i.test(spec)
          ? HardDrive
          : /IPv4|IPv6/i.test(spec)
            ? Globe2
            : /Network|Mbps|Gbps/i.test(spec)
              ? Network
              : /Bandwidth|băng thông/i.test(spec)
                ? ArrowDownUp
                : Check;
    return (
      <li key={spec}>
        <Icon size={20} aria-hidden="true" />
        <span>{spec}</span>
      </li>
    );
  }
  return (
    <div className={legacy.specs}>
      <ul className={legacy.specList}>{primary.map(specLine)}</ul>
      {extra.length > 0 && (
        <details className={legacy.specDetails}>
          <summary>
            <span className={legacy.showMore}>Xem thêm</span>
            <span className={legacy.showLess}>Thu gọn</span>
            <ChevronDown size={16} aria-hidden="true" />
          </summary>
          <ul className={legacy.specList}>{extra.map(specLine)}</ul>
        </details>
      )}
    </div>
  );
}

function PlanUpgrade({
  product,
  next,
}: {
  product: VpsProduct;
  next: VpsProduct | undefined;
}) {
  // Promote the 3-year offer (48 months of service) on every billing tab.
  const upgrade = next && getBlackFridayUpgrade(next, product, "triennially");
  if (!next || !upgrade) return null;
  return (
    <div className={legacy.planUpgrade}>
      <p className={legacy.upgradeTitle}>
        <ArrowUp size={16} aria-hidden="true" />
        Chỉ thêm
      </p>
      <div className={legacy.upgradeMonthly}>
        <strong>{formatVnd(upgrade.monthlyEquivalent)}</strong>
        <span> /tháng</span>
      </div>
      <p className={legacy.upgradeLabel}>Nhận thêm:</p>
      <ul className={legacy.upgradeResources} role="list">
        {upgrade.resources.map(({ key, value, unit }) => {
          const Icon =
            key === "cpu" ? Cpu : key === "ram" ? MemoryStick : HardDrive;
          return (
            <li key={key}>
              <Icon size={14} aria-hidden="true" />
              <span>
                +{new Intl.NumberFormat("vi-VN").format(value)}{" "}
                {key === "storage" ? "GB NVMe" : unit}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function LegacyBestPlanCard({
  product,
  next,
  index,
  selectedCycle,
}: {
  product: VpsProduct;
  next?: VpsProduct;
  index: number;
  selectedCycle: BlackFridayCycle;
}) {
  const savings = getBlackFridaySavings(product, selectedCycle);
  const price = product.pricing.VND[selectedCycle];
  const hasPrice = price !== undefined;
  return (
    <article
      data-pid={product.pid}
      className={`${styles.planCard} ${legacy.card} ${index === 1 ? styles.featured : ""}`}
    >
      {index === 1 && (
        <span className={styles.recommendationTag}>
          <Crown size={16} aria-hidden="true" />
          Phù hợp nhất
        </span>
      )}
      <div className={styles.planHeader}>
        <h3>{product.name}</h3>
        <span className={legacy.planIconStage} aria-hidden="true">
          <Image
            className={legacy.planServerIcon}
            src="/images/black-friday/3d-server-icon.png"
            alt=""
            width={300}
            height={300}
            sizes="(max-width: 360px) 76px, (max-width: 700px) 92px, (max-width: 800px) 52px, (max-width: 900px) 60px, (max-width: 1100px) 80px, 108px"
          />
        </span>
      </div>
      {selectedCycle === "triennially" && hasPrice && (
        <div className={legacy.giftTag}>
          <Gift size={17} aria-hidden="true" />
          <span>TẶNG THÊM 1 NĂM</span>
        </div>
      )}
      {savings && (
        <div className={legacy.originalPrice}>
          <del>
            {formatVnd(savings.originalPrice)} / {periodLabels[selectedCycle]}
          </del>
        </div>
      )}
      <div className={legacy.price}>
        <strong>{formatVnd(price)}</strong>
        {hasPrice && (
          <span>
            /{" "}
            {selectedCycle === "triennially"
              ? "48 tháng"
              : periodLabels[selectedCycle]}
          </span>
        )}
      </div>
      <PlanUpgrade product={product} next={next} />
      <LegacySpecs product={product} />
      <a
        className={`button ${styles.blueButton}`}
        href={hasPrice ? checkoutUrl(product, selectedCycle) : "/lien-he/"}
        aria-label={`${hasPrice ? "Đăng ký ngay gói" : "Liên hệ tư vấn gói"} ${product.name}`}
      >
        {hasPrice ? "Đăng ký ngay" : "Liên hệ tư vấn"}
        <ArrowRight size={17} aria-hidden="true" />
      </a>
    </article>
  );
}
