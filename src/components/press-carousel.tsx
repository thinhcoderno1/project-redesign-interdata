"use client";

import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import styles from "./press.module.css";

type PressItem = {
  publication: string;
  title: string;
  image: string;
  logo: string;
  logoWidth: number;
  logoHeight: number;
  href: string;
};

export function PressCarousel({ items }: { items: PressItem[] }) {
  const [perSlide, setPerSlide] = useState(3);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const activeIndex = useRef(0);
  const pageSize = useRef(3);
  const observedWidth = useRef(0);
  const resizing = useRef(false);
  const suppressClick = useRef(false);
  const drag = useRef<{
    pointer: number;
    x: number;
    scroll: number;
    moved: boolean;
  } | null>(null);
  const slides = Array.from(
    { length: Math.ceil(items.length / perSlide) },
    (_, index) => items.slice(index * perSlide, (index + 1) * perSlide),
  );
  const slideCount = slides.length;

  function slidePosition(index: number) {
    const viewport = track.current;
    const slide = viewport?.children[index];
    if (!viewport || !slide) return 0;
    return (
      slide.getBoundingClientRect().left -
      viewport.getBoundingClientRect().left +
      viewport.scrollLeft
    );
  }

  function goTo(index: number, instant = false) {
    const next = Math.max(0, Math.min(slideCount - 1, index));
    track.current?.scrollTo({
      left: slidePosition(next),
      behavior:
        instant || window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
    });
  }

  useEffect(() => {
    const viewport = track.current;
    if (!viewport) return;
    const observer = new ResizeObserver(() => {
      observedWidth.current = viewport.clientWidth;
      const nextSize =
        window.innerWidth < 640 ? 1 : window.innerWidth < 960 ? 2 : 3;
      if (nextSize !== pageSize.current) {
        resizing.current = true;
        const articleIndex = activeIndex.current * pageSize.current;
        pageSize.current = nextSize;
        activeIndex.current = Math.floor(articleIndex / nextSize);
        setActive(activeIndex.current);
        setPerSlide(nextSize);
      } else if (!drag.current) {
        viewport.scrollTo({
          left: slidePosition(activeIndex.current),
          behavior: "instant",
        });
      }
    });
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const viewport = track.current;
    const carousel = root.current;
    if (!viewport || !carousel) return;
    carousel.dataset.enhanced = "true";
    viewport.scrollTo({
      left: slidePosition(activeIndex.current),
      behavior: "instant",
    });
    resizing.current = false;
    let frame = 0;
    let settle = 0;
    let touching = false;
    function update() {
      frame = 0;
      if (!viewport) return;
      // Ignore browser scroll/clamping while responsive groups are being rebuilt.
      const expectedSize =
        window.innerWidth < 640 ? 1 : window.innerWidth < 960 ? 2 : 3;
      if (
        resizing.current ||
        expectedSize !== pageSize.current ||
        viewport.clientWidth !== observedWidth.current
      )
        return;
      const step =
        viewport.children.length > 1
          ? viewport.children[1].getBoundingClientRect().left -
            viewport.children[0].getBoundingClientRect().left
          : viewport.clientWidth;
      const next = Math.max(
        0,
        Math.min(slideCount - 1, Math.round(viewport.scrollLeft / step)),
      );
      activeIndex.current = next;
      setActive(next);
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
      window.clearTimeout(settle);
      if (!touching && !drag.current)
        settle = window.setTimeout(onScrollEnd, 150);
    }
    function onScrollEnd() {
      if (!viewport || touching || drag.current) return;
      window.clearTimeout(settle);
      update();
      const left = slidePosition(activeIndex.current);
      if (Math.abs(viewport.scrollLeft - left) > 1)
        viewport.scrollTo({ left, behavior: "instant" });
    }
    function onTouchStart() {
      touching = true;
      window.clearTimeout(settle);
    }
    function onTouchEnd() {
      touching = false;
      onScroll();
    }
    viewport.addEventListener("scroll", onScroll, { passive: true });
    viewport.addEventListener("scrollend", onScrollEnd);
    viewport.addEventListener("touchstart", onTouchStart, { passive: true });
    viewport.addEventListener("touchend", onTouchEnd, { passive: true });
    viewport.addEventListener("touchcancel", onTouchEnd, { passive: true });
    return () => {
      viewport.removeEventListener("scroll", onScroll);
      viewport.removeEventListener("scrollend", onScrollEnd);
      viewport.removeEventListener("touchstart", onTouchStart);
      viewport.removeEventListener("touchend", onTouchEnd);
      viewport.removeEventListener("touchcancel", onTouchEnd);
      cancelAnimationFrame(frame);
      window.clearTimeout(settle);
      delete carousel.dataset.enhanced;
    };
  }, [slideCount]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    const destinations: Record<string, number> = {
      ArrowLeft: activeIndex.current - 1,
      ArrowRight: activeIndex.current + 1,
      Home: 0,
      End: slideCount - 1,
    };
    if (event.key in destinations) {
      event.preventDefault();
      goTo(destinations[event.key]);
    }
  }

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    suppressClick.current = false;
    drag.current = {
      pointer: event.pointerId,
      x: event.clientX,
      scroll: event.currentTarget.scrollLeft,
      moved: false,
    };
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    const gesture = drag.current;
    if (!gesture || gesture.pointer !== event.pointerId) return;
    if (!gesture.moved && Math.abs(event.clientX - gesture.x) < 6) return;
    if (!gesture.moved) {
      gesture.moved = true;
      event.currentTarget.dataset.dragging = "true";
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.focus({ preventScroll: true });
    }
    event.preventDefault();
    event.currentTarget.scrollLeft = gesture.scroll + gesture.x - event.clientX;
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    const gesture = drag.current;
    if (!gesture || gesture.pointer !== event.pointerId) return;
    drag.current = null;
    delete event.currentTarget.dataset.dragging;
    if (gesture.moved) {
      suppressClick.current = true;
      const step =
        slideCount > 1
          ? slidePosition(1) - slidePosition(0)
          : event.currentTarget.clientWidth;
      goTo(Math.round(event.currentTarget.scrollLeft / step));
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  }

  return (
    <div
      className={styles.carousel}
      ref={root}
      role="region"
      aria-roledescription="bộ trình chiếu"
      aria-label="Bài viết báo chí về InterData"
    >
      <div
        id="press-track"
        className={styles.track}
        ref={track}
        tabIndex={0}
        aria-label="Các bài báo; dùng phím trái, phải để chuyển slide"
        onKeyDown={onKeyDown}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={endDrag}
        onPointerLeave={(event) => {
          if (!drag.current?.moved) drag.current = null;
          else endDrag(event);
        }}
        onDragStart={(event) => event.preventDefault()}
        onClickCapture={(event) => {
          if (suppressClick.current) {
            event.preventDefault();
            event.stopPropagation();
            suppressClick.current = false;
          }
        }}
      >
        {slides.map((group, index) => (
          <div
            className={styles.slide}
            key={group[0].href}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} / ${slideCount}: ${group.length} bài báo`}
          >
            {group.map((item) => (
              <article key={item.href} className={styles.card}>
                <a
                  href={item.href}
                  className={styles.link}
                  draggable={false}
                  aria-label={`Đọc bài viết trên ${item.publication}: ${item.title}`}
                >
                  <div className={styles.visual}>
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      draggable={false}
                      sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 959px) calc((100vw - 88px) / 2), (max-width: 1343px) calc((100vw - 144px) / 3), 400px"
                      className={styles.photo}
                    />
                    <span className={styles.logo}>
                      <Image
                        src={item.logo}
                        alt=""
                        width={item.logoWidth}
                        height={item.logoHeight}
                        sizes="106px"
                        draggable={false}
                      />
                    </span>
                  </div>
                  <div className={styles.body}>
                    <h3>{item.title}</h3>
                    <span className={styles.readMore}>
                      Đọc bài viết{" "}
                      <ArrowRight aria-hidden="true" strokeWidth={1.6} />
                    </span>
                  </div>
                </a>
              </article>
            ))}
          </div>
        ))}
      </div>
      <div className={styles.controls}>
        <span className={styles.count} aria-live="polite" aria-atomic="true">
          <span className="sr-only">Slide </span>
          {String(active + 1).padStart(2, "0")}
          <span aria-hidden="true"> / </span>
          <span className="sr-only"> trên </span>
          {String(slideCount).padStart(2, "0")}
        </span>
        <div
          className={styles.pagination}
          role="group"
          aria-label="Chọn slide báo chí"
        >
          {slides.map((group, index) => (
            <button
              key={group[0].href}
              type="button"
              aria-label={`Xem slide báo chí ${index + 1}: ${group.map((item) => item.publication).join(", ")}`}
              aria-current={active === index ? "true" : undefined}
              aria-controls="press-track"
              onClick={() => goTo(index)}
            >
              <span />
            </button>
          ))}
        </div>
        <div className={styles.arrows}>
          <button
            type="button"
            aria-label="Slide báo chí trước"
            aria-controls="press-track"
            disabled={active === 0}
            onClick={() => goTo(activeIndex.current - 1)}
          >
            <ChevronLeft aria-hidden="true" size={22} />
          </button>
          <button
            type="button"
            aria-label="Slide báo chí tiếp theo"
            aria-controls="press-track"
            disabled={active === slideCount - 1}
            onClick={() => goTo(activeIndex.current + 1)}
          >
            <ChevronRight aria-hidden="true" size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
