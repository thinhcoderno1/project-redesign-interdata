"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./blog.module.css";

export function PostArticle({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const article = ref.current;
    function scrollPlans(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const button = event.target.closest(".interdata-carousel-arrow");
      const carousel = button?.closest(".interdata-plan-carousel");
      const viewport = carousel?.querySelector<HTMLElement>(
        ".interdata-plan-viewport",
      );
      if (!button || !viewport) return;
      viewport.scrollBy({
        left:
          viewport.clientWidth *
          (button.classList.contains("interdata-carousel-prev") ? -1 : 1),
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    }
    article?.addEventListener("click", scrollPlans);
    return () => article?.removeEventListener("click", scrollPlans);
  }, []);
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
