"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./blog-best-plans.module.css";

function getSlide(viewport: HTMLUListElement) {
  const css = getComputedStyle(viewport);
  const perSlide = Number(css.getPropertyValue("--plans-per-slide"));
  const total = Math.ceil(viewport.children.length / perSlide);
  const step = viewport.clientWidth + parseFloat(css.columnGap);
  const index = Math.max(
    0,
    Math.min(total - 1, Math.round(viewport.scrollLeft / step)),
  );
  return { index, step, total };
}

export function BlogPlanCarousel({ children }: { children: ReactNode }) {
  const track = useRef<HTMLUListElement>(null);
  const [{ index, total }, setSlide] = useState({ index: 0, total: 1 });

  function update(viewport: HTMLUListElement) {
    const { index, total } = getSlide(viewport);
    setSlide((current) =>
      current.index === index && current.total === total
        ? current
        : { index, total },
    );
  }

  useEffect(() => {
    const viewport = track.current;
    if (!viewport) return;
    const observer = new ResizeObserver(() => update(viewport));
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  function move(direction: number) {
    const viewport = track.current;
    if (!viewport) return;
    const { index, step, total } = getSlide(viewport);
    const next = index + direction;
    if (next >= 0 && next < total) viewport.scrollTo({ left: next * step });
  }

  return (
    <>
      <h2 id="blog-best-plans-title" className={styles.heading}>
        BEST OFFERS VPS PLATINUM TIẾT KIỆM ĐẾN 80%
      </h2>
      <div className={styles.carousel}>
        <button
          className={`${styles.arrow} ${styles.previous}`}
          type="button"
          aria-label="Nhóm gói trước"
          aria-controls="blog-best-plans-track"
          aria-disabled={index === 0}
          hidden={total <= 1}
          onClick={() => move(-1)}
        >
          <ArrowLeft size={18} aria-hidden="true" />
        </button>
        <button
          className={`${styles.arrow} ${styles.next}`}
          type="button"
          aria-label="Nhóm gói tiếp theo"
          aria-controls="blog-best-plans-track"
          aria-disabled={index === total - 1}
          hidden={total <= 1}
          onClick={() => move(1)}
        >
          <ArrowRight size={18} aria-hidden="true" />
        </button>
        <ul
          id="blog-best-plans-track"
          ref={track}
          className={styles.track}
          aria-label="Các gói ưu đãi VPS Platinum"
          role="list"
          tabIndex={0}
          onScroll={(event) => update(event.currentTarget)}
          onKeyDown={(event) => {
            if (event.target !== event.currentTarget) return;
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
            event.preventDefault();
            move(event.key === "ArrowRight" ? 1 : -1);
          }}
        >
          {children}
        </ul>
      </div>
    </>
  );
}
