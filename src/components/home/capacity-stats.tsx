"use client";

import { useEffect, useRef } from "react";
import styles from "./capacity-stats.module.css";

export type CapacityStat = { id: string; value: string; label: string };

export function CapacityStats({ items }: { items: CapacityStat[] }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = container.current;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!element || motion.matches || !("IntersectionObserver" in window))
      return;

    const counters = Array.from(
      element.querySelectorAll<HTMLElement>("[data-count-value]"),
    ).flatMap((node) => {
      const value = node.dataset.countValue || "";
      const match = /^(\d+(?:\.\d{3})*)(,\d+)?([+%]?)$/.exec(value);
      if (!match) return [];
      const decimals = match[2]?.length ? match[2].length - 1 : 0;
      return [
        {
          node,
          value,
          target: Number(
            match[1].replaceAll(".", "") + (match[2] || "").replace(",", "."),
          ),
          suffix: match[3],
          decimals,
          formatter: new Intl.NumberFormat("vi-VN", {
            useGrouping: match[1].includes("."),
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          }),
        },
      ];
    });
    if (!counters.length) return;

    let frame = 0;
    let started = false;
    let startTime: number | undefined;
    const render = (progress: number) => {
      for (const counter of counters) {
        const precision = 10 ** counter.decimals;
        const value =
          Math.floor(counter.target * progress * precision) / precision;
        counter.node.textContent =
          progress === 1
            ? counter.value
            : `${counter.formatter.format(value)}${counter.suffix}`;
      }
    };
    const animate = (timestamp: number) => {
      startTime ??= timestamp;
      const progress = Math.min((timestamp - startTime) / 1600, 1);
      render(1 - (1 - progress) ** 3);
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        observer.disconnect();
        frame = requestAnimationFrame(animate);
      },
      { threshold: 0.25 },
    );
    const stopForReducedMotion = () => {
      if (!motion.matches) return;
      cancelAnimationFrame(frame);
      observer.disconnect();
      render(1);
    };

    render(0);
    observer.observe(element);
    motion.addEventListener("change", stopForReducedMotion);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      motion.removeEventListener("change", stopForReducedMotion);
      render(1);
    };
  }, [items]);

  return (
    <div className="stat-grid" ref={container}>
      {items.map((item) => (
        <div key={item.id}>
          <strong
            className={styles.number}
            data-final-value={item.value}
            aria-hidden="true"
          >
            <span className={styles.digits} data-count-value={item.value}>
              {item.value}
            </span>
          </strong>
          <span className="sr-only">{item.value}</span>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
