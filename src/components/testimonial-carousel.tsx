"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";

type Testimonial = {
  name: string;
  company: string;
  logo: string;
  logoWidth: number;
  logoHeight: number;
  quote: string;
};

export function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const carousel = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const activeIndex = useRef(0);
  const drag = useRef<{ pointer: number; x: number; scroll: number } | null>(
    null,
  );
  const [active, setActive] = useState(0);

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
    const next = Math.max(0, Math.min(items.length - 1, index));
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
    root.dataset.enhanced = "true";
    let frame = 0;
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
        Math.min(items.length - 1, Math.round(viewport.scrollLeft / step)),
      );
      activeIndex.current = next;
      setActive(next);
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
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
    return () => {
      observer.disconnect();
      viewport.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
      delete root.dataset.enhanced;
    };
  }, [items.length]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const destinations: Record<string, number> = {
      ArrowLeft: activeIndex.current - 1,
      ArrowRight: activeIndex.current + 1,
      Home: 0,
      End: items.length - 1,
    };
    if (event.key in destinations) {
      event.preventDefault();
      goTo(destinations[event.key]);
    }
  }

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
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
      items.length > 1
        ? slidePosition(1) - slidePosition(0)
        : event.currentTarget.clientWidth;
    goTo(Math.round(event.currentTarget.scrollLeft / step));
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  }

  return (
    <div
      className="testimonial-carousel"
      ref={carousel}
      role="region"
      aria-roledescription="bộ trình chiếu"
      aria-label="Phản hồi khách hàng"
    >
      <div
        id="testimonial-track"
        className="testimonial-track"
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
        {items.map((item, index) => (
          <article
            className="testimonial-slide"
            key={item.company}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} / ${items.length}: ${item.company}`}
          >
            <div className="testimonial-media">
              <Image
                src={item.logo}
                alt={`Logo ${item.company}`}
                width={item.logoWidth}
                height={item.logoHeight}
                sizes="(max-width: 639px) 150px, 200px"
                draggable={false}
              />
            </div>
            <div className="testimonial-copy">
              <span className="testimonial-quote-mark" aria-hidden="true">
                “
              </span>
              <blockquote>{item.quote}</blockquote>
              <div className="testimonial-author">
                <strong>{item.name}</strong>
                <span>{item.company}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="testimonial-controls">
        <span
          className="testimonial-count"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="sr-only">Phản hồi </span>
          {String(active + 1).padStart(2, "0")}
          <span aria-hidden="true"> / </span>
          <span className="sr-only"> trên </span>
          {String(items.length).padStart(2, "0")}
        </span>
        <div
          className="testimonial-pagination"
          role="group"
          aria-label="Chọn phản hồi"
        >
          {items.map((item, index) => (
            <button
              key={item.company}
              type="button"
              aria-label={`Xem phản hồi ${index + 1} từ ${item.company}`}
              aria-current={active === index ? "true" : undefined}
              aria-controls="testimonial-track"
              onClick={() => goTo(index)}
            >
              <span />
            </button>
          ))}
        </div>
        <div className="testimonial-arrows">
          <button
            type="button"
            aria-label="Phản hồi trước"
            aria-controls="testimonial-track"
            disabled={active === 0}
            onClick={() => goTo(activeIndex.current - 1)}
          >
            <ChevronLeft aria-hidden="true" size={22} />
          </button>
          <button
            type="button"
            aria-label="Phản hồi tiếp theo"
            aria-controls="testimonial-track"
            disabled={active === items.length - 1}
            onClick={() => goTo(activeIndex.current + 1)}
          >
            <ChevronRight aria-hidden="true" size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
