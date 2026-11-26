import Link from "next/link";
import { ArrowRight, ChevronDown, Gift } from "lucide-react";
import { PlatinumPlanSpecs } from "@/components/black-friday/platinum-plan-specs";
import { checkoutUrl, formatVnd } from "@/data/vps-pricing";
import type { BestPlansCatalog } from "@/lib/black-friday-best-plans";
import type { BlackFridayProduct } from "@/lib/black-friday-pricing";
import { BlogPlanCarousel } from "./blog-plan-carousel";
import styles from "./blog-best-plans.module.css";

const bestPlansHref = "/blackfriday/#best-plans-clone";

function BlogPlanGifts({ products }: { products: BlackFridayProduct[] }) {
  const groups = new Map<string, string[]>();
  const giftTypes = new Set<string>();
  for (const product of products) {
    if (product.pricing.VND.triennially === undefined || !product.gifts.length)
      continue;
    const gifts = product.gifts.join(" · ");
    const name = product.name.replace(/^BF26 PLATINUM /, "");
    const names = groups.get(gifts) ?? [];
    names.push(name);
    groups.set(gifts, names);
    for (const gift of product.gifts)
      giftTypes.add(
        gift.replace(/^\d+(?:[.,]\d+)?\s*(?:GB|TB)\s+(?=S3 Storage$)/i, ""),
      );
  }
  if (!groups.size) return null;

  return (
    <details className={styles.gifts}>
      <summary>
        <Gift size={17} aria-hidden="true" />
        <strong>Quà Tặng Chu Kỳ 3 Năm</strong>
        <span className={styles.giftOverview}>
          {[...giftTypes].join(" · ")} tùy gói
        </span>
        <span className={styles.giftAction}>Chi tiết</span>
        <ChevronDown size={16} aria-hidden="true" />
      </summary>
      <dl>
        {[...groups].map(([gifts, names]) => (
          <div key={gifts}>
            <dt>{names.join(", ")}</dt>
            <dd>{gifts}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}

export function BlogBestPlansLoading() {
  return <div className={styles.loading} aria-hidden="true" />;
}

export async function BlogBestPlans({
  catalog,
}: {
  catalog: Promise<BestPlansCatalog>;
}) {
  const bestPlans = await catalog;
  if (bestPlans.edition !== "platinum") return null;
  const { products } = bestPlans;
  if (!products.length)
    return (
      <div className={styles.fallback}>
        <Link href={bestPlansHref}>
          Xem ưu đãi VPS Platinum <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    );

  return (
    <section aria-labelledby="blog-best-plans-title" className={styles.section}>
      <BlogPlanCarousel>
        {products.map((product) => {
          const price = product.pricing.VND.annually;
          return (
            <li
              key={product.pid}
              className={styles.card}
              data-plan-id={product.pid}
            >
              <h3>{product.name}</h3>
              <PlatinumPlanSpecs product={product} className={styles.specs} />
              <div className={styles.footer}>
                <p className={styles.price}>
                  <strong>{formatVnd(price)}</strong>
                  {price !== undefined && <span>/ 1 năm</span>}
                </p>
                <a
                  className={styles.link}
                  href={
                    price === undefined
                      ? bestPlansHref
                      : checkoutUrl(product, "annually")
                  }
                  aria-label={`Đăng ký gói ${product.name}`}
                >
                  Đăng ký <ArrowRight size={14} aria-hidden="true" />
                </a>
              </div>
            </li>
          );
        })}
      </BlogPlanCarousel>
      <BlogPlanGifts products={products} />
    </section>
  );
}
