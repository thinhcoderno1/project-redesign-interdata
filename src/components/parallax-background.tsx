"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function ParallaxBackground({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = ref.current;
    const section = layer?.parentElement;
    if (!layer || !section) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let stop = () => {};

    const configure = () => {
      stop();
      layer.removeAttribute("data-parallax-active");
      layer.removeAttribute("data-parallax-visible");
      layer.style.removeProperty("--parallax-offset");
      if (reducedMotion.matches) return;

      layer.dataset.parallaxActive = "true";
      let distance = parseFloat(
        getComputedStyle(layer).getPropertyValue("--parallax-travel"),
      );
      let frame: number | null = null;
      let visible = false;

      const update = () => {
        frame = null;
        const rect = section.getBoundingClientRect();
        const progress = Math.min(
          1,
          Math.max(
            0,
            (window.innerHeight - rect.top) /
              (window.innerHeight + rect.height),
          ),
        );
        layer.style.setProperty(
          "--parallax-offset",
          `${((progress - 0.5) * 2 * distance).toFixed(2)}px`,
        );
      };
      const schedule = () => {
        if (visible && frame === null) frame = requestAnimationFrame(update);
      };
      const resize = () => {
        distance = parseFloat(
          getComputedStyle(layer).getPropertyValue("--parallax-travel"),
        );
        schedule();
      };
      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        layer.dataset.parallaxVisible = String(visible);
        if (visible) schedule();
        else if (frame !== null) {
          cancelAnimationFrame(frame);
          frame = null;
        }
      });
      const sizeObserver = new ResizeObserver(schedule);
      observer.observe(section);
      sizeObserver.observe(section);
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", resize);
      document.addEventListener("visibilitychange", schedule);
      update();

      stop = () => {
        if (frame !== null) cancelAnimationFrame(frame);
        observer.disconnect();
        sizeObserver.disconnect();
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", resize);
        document.removeEventListener("visibilitychange", schedule);
      };
    };

    configure();
    reducedMotion.addEventListener("change", configure);
    return () => {
      stop();
      reducedMotion.removeEventListener("change", configure);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`parallax-background ${className}`}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}
