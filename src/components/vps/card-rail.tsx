"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import styles from "./vps.module.css";

export function CardRail({
  children,
  label,
  count,
  grid = false,
}: {
  children: ReactNode;
  label: string;
  count: number;
  grid?: boolean;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const update = useCallback(() => {
    const element = track.current;
    const child = element?.firstElementChild as HTMLElement | null;
    if (!element || !child) return;
    const gap = parseFloat(getComputedStyle(element).columnGap) || 0;
    setIndex(
      Math.min(
        count - 1,
        Math.round(element.scrollLeft / (child.offsetWidth + gap)),
      ),
    );
    setAtStart(element.scrollLeft <= 1);
    setAtEnd(
      element.scrollLeft + element.clientWidth >= element.scrollWidth - 2,
    );
  }, [count]);
  useEffect(() => {
    if (!track.current) return;
    const observer = new ResizeObserver(update);
    observer.observe(track.current);
    return () => observer.disconnect();
  }, [update]);
  function move(direction: number) {
    const element = track.current;
    const child = element?.firstElementChild as HTMLElement | null;
    if (!element || !child) return;
    const gap = parseFloat(getComputedStyle(element).columnGap) || 0;
    element.scrollBy({
      left: direction * (child.offsetWidth + gap),
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  return (
    <div className={grid ? styles.gridRail : styles.railGroup}>
      <div
        ref={track}
        onScroll={update}
        className={styles.rail}
        role="group"
        aria-label={label}
        tabIndex={0}
      >
        {children}
      </div>
      {count > 1 && !(atStart && atEnd) && (
        <div className={styles.railControls}>
          <button
            type="button"
            aria-label={`${label}: trước`}
            disabled={atStart}
            onClick={() => move(-1)}
          >
            <ArrowLeft size={18} aria-hidden="true" />
          </button>
          <span aria-live="polite">
            {index + 1} / {count}
          </span>
          <button
            type="button"
            aria-label={`${label}: sau`}
            disabled={atEnd}
            onClick={() => move(1)}
          >
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
