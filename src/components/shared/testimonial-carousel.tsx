"use client";

import Image from "next/image";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import cardControls from "@/components/shared/carousel-card-controls.module.css";
import styles from "./testimonial-carousel.module.css";

type Testimonial = {
  name: string;
  company: string;
  logo: string;
  logoWidth: number;
  logoHeight: number;
  quote: string;
};

function previewQuote(quote: string) {
  const words = quote.trim().split(/\s+/);
  const excerpt = words
    .slice(0, Math.max(1, Math.round(words.length * 0.25)))
    .join(" ")
    .replace(/[,;:.!?…]+$/, "");
  return `${excerpt}…`;
}

function subscribeLayout(onChange: () => void) {
  const query = window.matchMedia("(min-width: 960px)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getCardsPerSlide() {
  return window.matchMedia("(min-width: 960px)").matches ? 3 : 1;
}

function getServerCardsPerSlide() {
  return 3;
}

export function TestimonialCarousel({
  items,
  controlsOnCards = false,
}: {
  items: Testimonial[];
  controlsOnCards?: boolean;
}) {
  const cardsPerSlide = useSyncExternalStore(
    subscribeLayout,
    getCardsPerSlide,
    getServerCardsPerSlide,
  );
  const slides = Array.from(
    { length: Math.ceil(items.length / cardsPerSlide) },
    (_, index) =>
      items.slice(index * cardsPerSlide, (index + 1) * cardsPerSlide),
  );
  const slideCount = slides.length;
  const carousel = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const activeIndex = useRef(0);
  const previousCardsPerSlide = useRef(cardsPerSlide);
  const drag = useRef<{ pointer: number; x: number; scroll: number } | null>(
    null,
  );
  const [active, setActive] = useState(0);
  const indicatorCount = Math.min(3, slideCount);
  const activeIndicator =
    slideCount > 1
      ? Math.round((active / (slideCount - 1)) * (indicatorCount - 1))
      : 0;

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
    const root = carousel.current;
    if (!viewport || !root) return;
    // Keep the first visible customer in view when crossing the breakpoint.
    const firstItem = activeIndex.current * previousCardsPerSlide.current;
    activeIndex.current = Math.min(
      slideCount - 1,
      Math.floor(firstItem / cardsPerSlide),
    );
    previousCardsPerSlide.current = cardsPerSlide;
    root.dataset.enhanced = "true";
    let frame = requestAnimationFrame(() => {
      const slide = viewport.children[activeIndex.current];
      if (slide) {
        viewport.scrollTo({
          left:
            slide.getBoundingClientRect().left -
            viewport.getBoundingClientRect().left +
            viewport.scrollLeft,
          behavior: "instant",
        });
      }
      update();
    });
    let settle = 0;
    let touching = false;
    function update() {
      frame = 0;
      if (!viewport) return;
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
      if (!touching && !drag.current) {
        settle = window.setTimeout(onScrollEnd, 150);
      }
    }
    function onTouchStart() {
      touching = true;
      window.clearTimeout(settle);
    }
    function onTouchEnd() {
      touching = false;
      onScroll();
    }
    function onScrollEnd() {
      if (!viewport || drag.current || touching) return;
      window.clearTimeout(settle);
      update();
      const slide = viewport.children[activeIndex.current];
      if (!slide) return;
      const left =
        slide.getBoundingClientRect().left -
        viewport.getBoundingClientRect().left +
        viewport.scrollLeft;
      // Unequal slide heights can leave native touch scrolling between groups.
      if (Math.abs(viewport.scrollLeft - left) > 1) {
        viewport.scrollTo({ left, behavior: "instant" });
      }
    }
    const observer = new ResizeObserver(() => {
      const slide = viewport.children[activeIndex.current];
      if (slide && !drag.current) {
        viewport.scrollTo({
          left:
            slide.getBoundingClientRect().left -
            viewport.getBoundingClientRect().left +
            viewport.scrollLeft,
          behavior: "instant",
        });
      }
    });
    observer.observe(viewport);
    viewport.addEventListener("scroll", onScroll, { passive: true });
    viewport.addEventListener("scrollend", onScrollEnd);
    viewport.addEventListener("touchstart", onTouchStart, { passive: true });
    viewport.addEventListener("touchend", onTouchEnd, { passive: true });
    viewport.addEventListener("touchcancel", onTouchEnd, { passive: true });
    return () => {
      observer.disconnect();
      viewport.removeEventListener("scroll", onScroll);
      viewport.removeEventListener("scrollend", onScrollEnd);
      viewport.removeEventListener("touchstart", onTouchStart);
      viewport.removeEventListener("touchend", onTouchEnd);
      viewport.removeEventListener("touchcancel", onTouchEnd);
      cancelAnimationFrame(frame);
      window.clearTimeout(settle);
      delete root.dataset.enhanced;
    };
  }, [cardsPerSlide, slideCount]);

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
    if (
      event.target instanceof Element &&
      event.target.closest("summary, button, a")
    )
      return;
    drag.current = {
      pointer: event.pointerId,
      x: event.clientX,
      scroll: event.currentTarget.scrollLeft,
    };
    event.currentTarget.dataset.dragging = "true";
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.focus({ preventScroll: true });
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current || drag.current.pointer !== event.pointerId) return;
    event.preventDefault();
    event.currentTarget.scrollLeft =
      drag.current.scroll + drag.current.x - event.clientX;
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current || drag.current.pointer !== event.pointerId) return;
    drag.current = null;
    delete event.currentTarget.dataset.dragging;
    const step =
      slideCount > 1
        ? slidePosition(1) - slidePosition(0)
        : event.currentTarget.clientWidth;
    goTo(Math.round(event.currentTarget.scrollLeft / step));
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  }

  return (
    <div
      className={`testimonial-carousel ${styles.carousel}${controlsOnCards ? ` ${cardControls.carousel}` : ""}`}
      ref={carousel}
      role="region"
      aria-roledescription="bộ trình chiếu"
      aria-label="Phản hồi khách hàng"
    >
      <div
        id="testimonial-track"
        className="testimonial-track"
        data-carousel-track
        ref={track}
        tabIndex={0}
        aria-label="Các phản hồi; dùng phím trái, phải để chuyển slide"
        onKeyDown={onKeyDown}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={endDrag}
        onDragStart={(event) => event.preventDefault()}
      >
        {slides.map((group, index) => (
          <div
            className="testimonial-slide"
            key={group[0].company}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} / ${slideCount}: ${group.length} phản hồi`}
          >
            {group.map((item) => (
              <article className="testimonial-card" key={item.company}>
                <div className="testimonial-card-top">
                  <div className="testimonial-media">
                    <Image
                      src={item.logo}
                      alt={`Logo ${item.company}`}
                      width={item.logoWidth}
                      height={item.logoHeight}
                      sizes="(max-width: 1199px) 100px, 116px"
                      draggable={false}
                    />
                  </div>
                  <div className="testimonial-stars" aria-hidden="true">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star key={index} />
                    ))}
                  </div>
                </div>
                <div className="testimonial-copy">
                  <span className="testimonial-quote-mark" aria-hidden="true">
                    “
                  </span>
                  <blockquote className="testimonial-preview">
                    {previewQuote(item.quote)}
                  </blockquote>
                  <details className="testimonial-details">
                    <summary>
                      <span className="testimonial-expand">
                        Xem đầy đủ <ArrowDown aria-hidden="true" size={17} />
                      </span>
                      <span className="testimonial-collapse">
                        Thu gọn <ArrowUp aria-hidden="true" size={17} />
                      </span>
                      <span className="sr-only"> phản hồi của {item.name}</span>
                    </summary>
                    <blockquote className="testimonial-full">
                      {item.quote}
                    </blockquote>
                  </details>
                </div>
                <div className="testimonial-author">
                  <strong>{item.name}</strong>
                  <span>{item.company}</span>
                </div>
              </article>
            ))}
          </div>
        ))}
      </div>
      <div className="testimonial-controls" data-carousel-controls>
        <span
          className={controlsOnCards ? "sr-only" : "testimonial-count"}
          data-carousel-count
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="sr-only">Slide </span>
          {String(active + 1).padStart(2, "0")}
          <span aria-hidden="true"> / </span>
          <span className="sr-only"> trên </span>
          {String(slideCount).padStart(2, "0")}
        </span>
        <div
          className="testimonial-pagination"
          data-carousel-pagination
          aria-hidden="true"
        >
          {Array.from({ length: indicatorCount }, (_, index) => (
            <span
              className="testimonial-dot"
              key={index}
              data-active={activeIndicator === index || undefined}
            />
          ))}
        </div>
        <div className="testimonial-arrows" data-carousel-arrows>
          <button
            type="button"
            aria-label="Slide phản hồi trước"
            aria-controls="testimonial-track"
            disabled={active === 0}
            onClick={() => goTo(activeIndex.current - 1)}
          >
            <ChevronLeft aria-hidden="true" size={22} />
          </button>
          <button
            type="button"
            aria-label="Slide phản hồi tiếp theo"
            aria-controls="testimonial-track"
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
