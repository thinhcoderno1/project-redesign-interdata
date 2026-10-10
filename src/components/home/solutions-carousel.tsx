"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import { Icon } from "@/components/ui/icon";
import { links, solutions } from "@/data/content";
import styles from "./solutions-slider.module.css";

const backgrounds = [
  { src: "/images/solutions/giai-phap-private-cloud.jpg", position: "50% 50%" },
  { src: "/images/solutions/giai-phap-proxmox-ceph.jpg", position: "50% 50%" },
  { src: "/images/solutions/giai-phap-kubernetes.jpg", position: "50% 50%" },
  { src: "/images/solutions/giai-phap-vmware.jpg", position: "70% 50%" },
  { src: "/images/solutions/giai-phap-s3-storage.jpg", position: "55% 50%" },
];
const count = solutions.length;
const logicalIndex = (physical: number) => (physical - 1 + count) % count;
// Two inert previews let the first/last solution also have a card on either side.
const panels = [
  { index: count - 1, preview: true },
  ...solutions.map((_, index) => ({ index, preview: false })),
  { index: 0, preview: true },
];

function CardContent({ index, preview }: { index: number; preview: boolean }) {
  const solution = solutions[index];
  return (
    <>
      <Image
        src={backgrounds[index].src}
        alt=""
        fill
        sizes="(max-width: 639px) calc(100vw - 64px), (max-width: 1023px) calc(100vw - 160px), (max-width: 1352px) 68vw, 920px"
        className={styles.photo}
        style={{ objectPosition: backgrounds[index].position }}
        draggable={false}
      />
      <div className={styles.content}>
        {preview ? (
          <span className={styles.title}>{solution.name}</span>
        ) : (
          <h3>{solution.name}</h3>
        )}
        <p>{solution.description}</p>
        {preview ? (
          <span className={styles.cta}>
            Trao đổi về {solution.shortName} <Icon name="external" />
          </span>
        ) : (
          <a href={links.contact} className={styles.cta}>
            Trao đổi về {solution.shortName} <Icon name="external" />
          </a>
        )}
      </div>
    </>
  );
}

export function SolutionsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const targetRef = useRef<number | null>(null);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragRef = useRef<{
    pointerId: number;
    x: number;
    scroll: number;
    moved: boolean;
  } | null>(null);
  const suppressClick = useRef(false);
  const [active, setActive] = useState(0);
  const [physical, setPhysical] = useState(1);
  const [enhanced, setEnhanced] = useState(false);

  const positions = useCallback(() => {
    const track = trackRef.current;
    if (!track) return [];
    return Array.from(track.children, (child) => {
      const panel = child as HTMLElement;
      return panel.offsetLeft - (track.clientWidth - panel.offsetWidth) / 2;
    });
  }, []);

  const goTo = useCallback(
    (index: number, instant = false) => {
      const track = trackRef.current;
      if (!track) return;
      const next = (index + count) % count;
      const slot = instant
        ? next + 1
        : index < 0
          ? 0
          : index >= count
            ? count + 1
            : next + 1;
      if (settleTimer.current) clearTimeout(settleTimer.current);
      targetRef.current = instant ? null : slot;
      activeRef.current = next;
      setActive(next);
      setPhysical(slot);
      track.scrollTo({
        left: positions()[slot],
        behavior:
          instant ||
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
      });
    },
    [positions],
  );

  const nearestPanel = useCallback(() => {
    const track = trackRef.current;
    const offsets = positions();
    if (!track || !offsets.length) return 1;
    return offsets.reduce(
      (best, offset, index) =>
        Math.abs(offset - track.scrollLeft) <
        Math.abs(offsets[best] - track.scrollLeft)
          ? index
          : best,
      0,
    );
  }, [positions]);

  const settle = useCallback(() => {
    if (dragRef.current?.moved) return;
    const target = targetRef.current;
    if (
      target !== null &&
      Math.abs((trackRef.current?.scrollLeft ?? 0) - positions()[target]) > 1
    )
      return;
    targetRef.current = null;
    // Return from a decorative edge preview to its real, accessible panel.
    goTo(logicalIndex(nearestPanel()), true);
  }, [goTo, nearestPanel, positions]);

  function syncActive() {
    if (dragRef.current?.moved) return;
    const target = targetRef.current;
    if (
      target !== null &&
      Math.abs((trackRef.current?.scrollLeft ?? 0) - positions()[target]) > 1
    )
      return;
    targetRef.current = null;
    const slot = nearestPanel();
    const index = logicalIndex(slot);
    activeRef.current = index;
    setActive(index);
    setPhysical(slot);
    if (settleTimer.current) clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(settle, 180);
  }

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    setEnhanced(true);
    const revealHash = () => {
      const index = solutions.findIndex(
        (solution) => `#${solution.id}` === location.hash,
      );
      if (index < 0) return;
      document.getElementById(solutions[index].id)?.scrollIntoView({
        block: "start",
        inline: "center",
        behavior: "instant",
      });
      goTo(index, true);
    };
    const frame = requestAnimationFrame(() => {
      goTo(activeRef.current, true);
      revealHash();
    });
    const observer = new ResizeObserver(() => goTo(activeRef.current, true));
    observer.observe(track);
    window.addEventListener("hashchange", revealHash);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("hashchange", revealHash);
      if (settleTimer.current) clearTimeout(settleTimer.current);
    };
  }, [goTo]);

  useEffect(() => {
    const tabs = tabsRef.current;
    const tab = tabs?.children[active] as HTMLElement | undefined;
    if (!tabs || !tab) return;
    tabs.scrollTo({
      left: tab.offsetLeft - (tabs.clientWidth - tab.offsetWidth) / 2,
      behavior: "instant",
    });
  }, [active]);

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    suppressClick.current = false;
    dragRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      scroll: event.currentTarget.scrollLeft,
      moved: false,
    };
  }
  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const delta = drag.x - event.clientX;
    if (!drag.moved && Math.abs(delta) < 6) return;
    if (!drag.moved) {
      drag.moved = true;
      targetRef.current = null;
      if (settleTimer.current) clearTimeout(settleTimer.current);
      event.currentTarget.dataset.dragging = "true";
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.focus({ preventScroll: true });
    }
    event.preventDefault();
    event.currentTarget.scrollLeft = drag.scroll + delta;
  }
  function endDrag(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    delete event.currentTarget.dataset.dragging;
    if (drag.moved) {
      suppressClick.current = true;
      settle();
    }
    if (event.currentTarget.hasPointerCapture(drag.pointerId))
      event.currentTarget.releasePointerCapture(drag.pointerId);
  }

  return (
    <div
      className={styles.carousel}
      role="region"
      aria-roledescription="bộ trình chiếu"
      aria-label="Giải pháp triển khai InterData"
      data-enhanced={enhanced || undefined}
    >
      <div className={styles.menu}>
        <button
          type="button"
          className={styles.arrow}
          aria-label="Giải pháp trước"
          aria-controls="solutions-track"
          onClick={() => goTo(activeRef.current - 1)}
        >
          <ArrowLeft size={20} aria-hidden="true" />
        </button>
        <div
          ref={tabsRef}
          className={styles.tabs}
          role={enhanced ? "tablist" : undefined}
          aria-label="Chọn giải pháp"
        >
          {solutions.map((solution, index) => (
            <a
              key={solution.id}
              id={`solution-tab-${solution.id}`}
              href={`#${solution.id}`}
              role={enhanced ? "tab" : undefined}
              aria-controls={
                enhanced ? `solution-panel-${solution.id}` : undefined
              }
              aria-selected={enhanced ? active === index : undefined}
              tabIndex={enhanced ? (active === index ? 0 : -1) : undefined}
              data-selected={active === index || undefined}
              onClick={(event) => {
                event.preventDefault();
                goTo(index);
              }}
              onKeyDown={(event) => {
                if (event.key === " ") {
                  event.preventDefault();
                  goTo(index);
                  return;
                }
                const next = {
                  ArrowLeft: (index - 1 + count) % count,
                  ArrowRight: (index + 1) % count,
                  Home: 0,
                  End: count - 1,
                }[event.key];
                if (next === undefined) return;
                event.preventDefault();
                (tabsRef.current?.children[next] as HTMLElement)?.focus({
                  preventScroll: true,
                });
                goTo(next);
              }}
            >
              {solution.shortName}
            </a>
          ))}
        </div>
        <button
          type="button"
          className={styles.arrow}
          aria-label="Giải pháp tiếp theo"
          aria-controls="solutions-track"
          onClick={() => goTo(activeRef.current + 1)}
        >
          <ArrowRight size={20} aria-hidden="true" />
        </button>
      </div>
      <div
        id="solutions-track"
        ref={trackRef}
        className={styles.track}
        tabIndex={0}
        aria-label="Các giải pháp; dùng phím mũi tên để chuyển slide"
        onScroll={syncActive}
        onScrollEnd={settle}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={endDrag}
        onPointerLeave={(event) => {
          if (!dragRef.current?.moved) dragRef.current = null;
          else endDrag(event);
        }}
        onDragStart={(event) => event.preventDefault()}
        onClickCapture={(event) => {
          if (!suppressClick.current) return;
          event.preventDefault();
          event.stopPropagation();
          suppressClick.current = false;
        }}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          const target = {
            ArrowLeft: activeRef.current - 1,
            ArrowRight: activeRef.current + 1,
            Home: 0,
            End: count - 1,
          }[event.key];
          if (target === undefined) return;
          event.preventDefault();
          goTo(target);
        }}
      >
        {panels.map(({ index, preview }, slot) => {
          const solution = solutions[index];
          return (
            <div
              key={slot}
              className={`${styles.panel}${preview ? ` ${styles.preview}` : ""}`}
              data-physical-index={slot}
              data-active={physical === slot || undefined}
              id={preview ? undefined : `solution-panel-${solution.id}`}
              role={!preview && enhanced ? "tabpanel" : undefined}
              aria-labelledby={
                !preview && enhanced ? `solution-tab-${solution.id}` : undefined
              }
              aria-hidden={
                preview || (enhanced && active !== index) || undefined
              }
              inert={preview || (enhanced && active !== index)}
            >
              {preview ? (
                <div className={styles.card}>
                  <CardContent index={index} preview />
                </div>
              ) : (
                <article
                  id={solution.id}
                  className={styles.card}
                  data-slide-index={index}
                  aria-roledescription="slide"
                  aria-label={`${index + 1} / ${count}: ${solution.name}`}
                >
                  <CardContent index={index} preview={false} />
                </article>
              )}
            </div>
          );
        })}
      </div>
      <span className={styles.counter} aria-live="polite" aria-atomic="true">
        <strong>{String(active + 1).padStart(2, "0")}</strong>
        <span aria-hidden="true"> / </span>
        <span>{String(count).padStart(2, "0")}</span>
      </span>
    </div>
  );
}
