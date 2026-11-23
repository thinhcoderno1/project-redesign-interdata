"use client";

import { useCallback, useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { BlackFridayBannerArtwork } from "@/components/shared/black-friday-banner-artwork";
import {
  blackFriday2026Banner,
  type BlogPromotionPlacement,
  type BlogPromotionPageType,
} from "@/data/promotions";
import styles from "./blog-promotion.module.css";

export function BlogPromotion({
  placement,
  pageType,
}: {
  placement: BlogPromotionPlacement;
  pageType: BlogPromotionPageType;
}) {
  const root = useRef<HTMLElement>(null);
  const impressionSent = useRef(false);
  const track = useCallback(
    (event: "view_promotion" | "select_promotion") => {
      const analytics = window as Window & {
        dataLayer?: Record<string, unknown>[];
      };
      analytics.dataLayer ??= [];
      analytics.dataLayer.push({
        event,
        ecommerce: {
          promotion_id: "black-friday-2026",
          promotion_name: blackFriday2026Banner.title,
          creative_name: blackFriday2026Banner.creativeName,
          creative_slot: `blog_${pageType}_${placement}`,
        },
        page_path: window.location.pathname,
      });
    },
    [pageType, placement],
  );

  useEffect(() => {
    const element = root.current;
    const img = element?.querySelector("img");
    if (!element || !img) return;
    let intersecting = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const clear = () => {
      clearTimeout(timer);
      timer = undefined;
    };
    const update = () => {
      if (impressionSent.current) return;
      const visible =
        intersecting &&
        document.visibilityState === "visible" &&
        img.complete &&
        img.naturalWidth > 0;
      if (!visible) {
        clear();
        return;
      }
      if (timer) return;
      timer = setTimeout(() => {
        impressionSent.current = true;
        track("view_promotion");
        observer.disconnect();
      }, 1000);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        intersecting = entry.isIntersecting && entry.intersectionRatio >= 0.5;
        update();
      },
      { threshold: [0, 0.5] },
    );
    observer.observe(element);
    img.addEventListener("load", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      clear();
      observer.disconnect();
      img.removeEventListener("load", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, [track]);

  return (
    <aside
      ref={root}
      className={styles.promotion}
      aria-label="Ưu đãi InterData: Black Friday 2026"
      data-blog-promotion={`${pageType}-${placement}`}
    >
      <span className={styles.label}>ƯU ĐÃI TỪ INTERDATA</span>
      <a
        className={styles.banner}
        href={blackFriday2026Banner.href}
        onClick={() => track("select_promotion")}
        onAuxClick={(event) => {
          if (event.button === 1) track("select_promotion");
        }}
      >
        <BlackFridayBannerArtwork
          sizes={
            pageType === "article"
              ? "(max-width: 959px) calc(100vw - 40px), (max-width: 1343px) calc(100vw - 416px), 928px"
              : "(max-width: 639px) calc(100vw - 40px), (max-width: 1199px) calc(100vw - 64px), (max-width: 1343px) calc(100vw - 96px), 1248px"
          }
          loading={placement === "early" ? "eager" : "lazy"}
        />
        <span className={styles.caption}>
          <span>{blackFriday2026Banner.title}</span>
          <span className={styles.action}>
            Xem ưu đãi <ArrowUpRight size={18} aria-hidden="true" />
          </span>
        </span>
      </a>
    </aside>
  );
}
