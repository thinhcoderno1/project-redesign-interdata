"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./blog.module.css";

export function PostArticle({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const article = ref.current;
    if (!article) return;
    const viewports = article.querySelectorAll<HTMLElement>(
      ".interdata-plan-viewport",
    );
    function updateControls() {
      for (const viewport of viewports) {
        const scrollable = viewport.scrollWidth > viewport.clientWidth + 1;
        for (const button of viewport
          .closest(".interdata-plan-carousel")
          ?.querySelectorAll<HTMLButtonElement>(".interdata-carousel-arrow") ||
          [])
          button.disabled = !scrollable;
      }
    }
    const observer = new ResizeObserver(updateControls);
    for (const viewport of viewports) observer.observe(viewport);
    updateControls();
    function scrollPlans(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const button = event.target.closest(".interdata-carousel-arrow");
      const carousel = button?.closest(".interdata-plan-carousel");
      const viewport = carousel?.querySelector<HTMLElement>(
        ".interdata-plan-viewport",
      );
      if (!button || !viewport) return;
      const cards = [
        ...viewport.querySelectorAll<HTMLElement>(".interdata-plan-card"),
      ];
      if (!cards.length) return;
      const start = cards[0].offsetLeft;
      const end = viewport.scrollWidth - viewport.clientWidth;
      const step = cards[1]
        ? cards[1].offsetLeft - start
        : viewport.clientWidth;
      const visible = Math.max(
        1,
        Math.round((viewport.clientWidth + 12) / step),
      );
      const stops = [0];
      for (let index = visible; index < cards.length; index += visible) {
        const left = Math.min(end, cards[index].offsetLeft - start);
        if (left > stops[stops.length - 1] + 1) stops.push(left);
      }
      if (end > stops[stops.length - 1] + 1) stops.push(end);
      const previous = button.classList.contains("interdata-carousel-prev");
      const left = previous
        ? (stops.findLast((stop) => stop < viewport.scrollLeft - 2) ?? end)
        : (stops.find((stop) => stop > viewport.scrollLeft + 2) ?? 0);
      viewport.scrollTo({
        left,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    }
    article.addEventListener("click", scrollPlans);
    return () => {
      article.removeEventListener("click", scrollPlans);
      observer.disconnect();
    };
  }, [children]);
  return (
    <article
      ref={ref}
      className={styles.articleContent}
      aria-label="Nội dung bài viết"
    >
      {children}
    </article>
  );
}
