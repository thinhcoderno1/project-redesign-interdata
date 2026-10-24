"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useSyncExternalStore } from "react";
import styles from "./promotion-carousel.module.css";

const banners = [
  {
    title: "Ưu đãi VPS / Cloud Server",
    image: "/images/promotion/vps-cloud-warm.webp",
    alt: "Săn ưu đãi VPS / Cloud Server – tối ưu đến 80% chi phí",
  },
  {
    title: "VPS Platinum Viettel IDC",
    image: "/images/promotion/vps-platinum-viettel-idc.jpg",
    alt: "VPS Platinum Viettel IDC trên nền tảng Intel Xeon Platinum",
  },
  {
    title: "VPS n8n",
    image: "/images/promotion/vps-n8n.jpg",
    alt: "VPS n8n dành cho workflow tự động hóa công việc",
  },
  {
    title: "VPS Vibe Coding",
    image: "/images/promotion/vps-vibe-coding.jpg",
    alt: "VPS Vibe Coding dành cho môi trường lập trình cùng AI",
  },
];
const subscribeHydration = () => () => {};
const hydratedSnapshot = () => true;
const serverSnapshot = () => false;

export function PromotionCarousel({ href }: { href: string }) {
  const root = useRef<HTMLDivElement>(null);
  const gesture = useRef<{ x: number; y: number } | null>(null);
  const suppressClick = useRef(false);
  const [active, setActive] = useState(0);
  const enhanced = useSyncExternalStore(
    subscribeHydration,
    hydratedSnapshot,
    serverSnapshot,
  );
  function goTo(index: number) {
    const next = (index + banners.length) % banners.length;
    setActive(next);
    return next;
  }

  return (
    <div
      ref={root}
      className={styles.carousel}
      data-enhanced={enhanced || undefined}
      data-active-slide={active + 1}
      role="region"
      aria-roledescription="slideshow"
      aria-label="Banner ưu đãi InterData"
    >
      <div className={styles.stage}>
        <div
          className={styles.viewport}
          onKeyDown={(event) => {
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
            event.preventDefault();
            const next = goTo(active + (event.key === "ArrowRight" ? 1 : -1));
            requestAnimationFrame(() => {
              root.current
                ?.querySelector<HTMLAnchorElement>(
                  `[data-promotion-page="${next}"] [data-promotion-link]`,
                )
                ?.focus({ preventScroll: true });
            });
          }}
          onPointerDown={(event) => {
            suppressClick.current = false;
            if (event.pointerType === "mouse") return;
            gesture.current = { x: event.clientX, y: event.clientY };
          }}
          onPointerUp={(event) => {
            const start = gesture.current;
            gesture.current = null;
            if (!start) return;
            const dx = event.clientX - start.x;
            const dy = event.clientY - start.y;
            if (Math.abs(dx) < 40 || Math.abs(dx) <= Math.abs(dy)) return;
            suppressClick.current = true;
            goTo(active + (dx < 0 ? 1 : -1));
          }}
          onPointerCancel={() => {
            gesture.current = null;
          }}
          onClickCapture={(event) => {
            if (!suppressClick.current) return;
            event.preventDefault();
            event.stopPropagation();
            suppressClick.current = false;
          }}
        >
          <div
            id="promotion-slides"
            className={styles.track}
            style={{
              transform: enhanced ? `translateX(-${active * 100}%)` : undefined,
            }}
            aria-live="polite"
          >
            {banners.map((banner, index) => (
              <div
                key={banner.image}
                className={styles.slide}
                data-promotion-page={index}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} / ${banners.length}: ${banner.title}`}
                aria-hidden={enhanced && active !== index ? true : undefined}
                inert={enhanced && active !== index ? true : undefined}
              >
                <a className={styles.banner} href={href} data-promotion-link>
                  <Image
                    src={banner.image}
                    alt={banner.alt}
                    width={2048}
                    height={432}
                    sizes="(max-width: 1343px) calc(100vw - 40px), 1248px"
                    loading={index < 2 ? "eager" : "lazy"}
                    draggable={false}
                  />
                </a>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.arrows}>
          <button
            type="button"
            aria-label="Banner trước"
            aria-controls="promotion-slides"
            onClick={() => goTo(active - 1)}
          >
            <ChevronLeft aria-hidden="true" size={20} />
          </button>
          <button
            type="button"
            aria-label="Banner tiếp theo"
            aria-controls="promotion-slides"
            onClick={() => goTo(active + 1)}
          >
            <ChevronRight aria-hidden="true" size={20} />
          </button>
        </div>
      </div>
      <div className={styles.controls}>
        <div
          className={styles.pagination}
          role="group"
          aria-label="Chọn chương trình ưu đãi"
        >
          {banners.map((banner, index) => (
            <button
              key={banner.image}
              type="button"
              aria-label={`Xem banner ${index + 1}: ${banner.title}`}
              aria-current={active === index ? "true" : undefined}
              aria-controls="promotion-slides"
              onClick={() => goTo(index)}
            >
              <span aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
