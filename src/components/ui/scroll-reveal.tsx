"use client";

import { useEffect } from "react";

export function ScrollReveal({ rootId }: { rootId: string }) {
  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root || !("IntersectionObserver" in window)) return;

    // Animate whole sections, without stacking effects on nested sections.
    const sections = Array.from(
      root.querySelectorAll<HTMLElement>("section"),
    ).filter((section) => !section.parentElement?.closest("section"));
    const revealed = new Set<HTMLElement>();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;

    const reveal = (section: HTMLElement) => {
      section.dataset.scrollReveal = "visible";
      revealed.add(section);
      observer?.unobserve(section);
    };

    const reset = () => {
      observer?.disconnect();
      sections.forEach((section) => {
        section.removeAttribute("data-scroll-reveal");
      });
    };

    const configure = () => {
      reset();
      if (reducedMotion.matches) return;

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) reveal(entry.target as HTMLElement);
          });
        },
        { threshold: 0, rootMargin: "0px 0px -40px 0px" },
      );

      sections.forEach((section) => {
        // Keep the hero, restored scroll positions and visible content steady.
        if (
          revealed.has(section) ||
          section.getBoundingClientRect().top < window.innerHeight
        ) {
          revealed.add(section);
          return;
        }
        section.dataset.scrollReveal = "pending";
        observer?.observe(section);
      });
    };

    const handleFocus = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      const section = event.target.closest<HTMLElement>(
        '[data-scroll-reveal="pending"]',
      );
      if (section) reveal(section);
    };

    configure();
    root.addEventListener("focusin", handleFocus);
    reducedMotion.addEventListener("change", configure);
    return () => {
      reset();
      root.removeEventListener("focusin", handleFocus);
      reducedMotion.removeEventListener("change", configure);
    };
  }, [rootId]);

  return null;
}
