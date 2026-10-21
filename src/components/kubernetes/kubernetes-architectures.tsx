"use client";

import Image from "next/image";
import { useRef, useState, useSyncExternalStore } from "react";
import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { kubernetesOptions } from "@/data/kubernetes";
import styles from "@/components/vps/service-range.module.css";

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;
const count = kubernetesOptions.length;

export function KubernetesArchitectures() {
  const enhanced = useSyncExternalStore(
    subscribe,
    clientSnapshot,
    serverSnapshot,
  );
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabList = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; pointer: number } | null>(null);

  function select(index: number, focus = false) {
    const next = (index + count) % count;
    setActive(next);
    const tab = tabs.current[next];
    if (focus) tab?.focus({ preventScroll: true });
    const list = tabList.current;
    if (tab && list) {
      const item = tab.getBoundingClientRect();
      const bounds = list.getBoundingClientRect();
      if (item.left < bounds.left || item.right > bounds.right) {
        list.scrollTo({
          left:
            list.scrollLeft +
            item.left -
            bounds.left -
            (bounds.width - item.width) / 2,
          behavior: "instant",
        });
      }
    }
  }

  function onTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const target =
      event.key === "ArrowRight"
        ? index + 1
        : event.key === "ArrowLeft"
          ? index - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? count - 1
              : null;
    if (target === null) return;
    event.preventDefault();
    select(target, true);
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (
      event.pointerType === "mouse" ||
      (event.target as Element).closest("a,button")
    )
      return;
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      pointer: event.pointerId,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    const start = drag.current;
    drag.current = null;
    if (!start || start.pointer !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) >= 50 && Math.abs(dx) > Math.abs(dy) * 1.3)
      select(active + (dx < 0 ? 1 : -1));
  }

  return (
    <section
      className={styles.range}
      aria-labelledby="kubernetes-architecture-title"
      aria-roledescription={enhanced ? "băng chuyền" : undefined}
    >
      <div className={styles.container}>
        <div className={styles.heading}>
          <div className={styles.eyebrow}>
            <span>ĐA DẠNG LỰA CHỌN</span>
          </div>
          <h2 id="kubernetes-architecture-title">
            KUBERNETES THEO <span>NHU CẦU CỦA BẠN</span>
          </h2>
          <p>
            <span>
              Từ dev / staging đến production và kiến trúc có dự phòng.
            </span>
            <span>
              Chọn mô hình theo ứng dụng, dữ liệu và khả năng vận hành.
            </span>
          </p>
        </div>
        <div className={styles.controls} hidden={!enhanced}>
          <button
            type="button"
            className={styles.arrow}
            aria-label="Mô hình trước"
            onClick={() => select(active - 1)}
          >
            <ChevronLeft size={22} aria-hidden="true" />
          </button>
          <div
            className={styles.tabs}
            role="tablist"
            aria-label="Chọn mô hình Kubernetes"
            ref={tabList}
          >
            {kubernetesOptions.map((service, index) => (
              <button
                key={service.id}
                type="button"
                role="tab"
                id={`kubernetes-architecture-tab-${service.id}`}
                aria-selected={active === index}
                aria-controls={`kubernetes-architecture-panel-${service.id}`}
                tabIndex={active === index ? 0 : -1}
                ref={(element) => {
                  tabs.current[index] = element;
                }}
                onClick={() => select(index)}
                onKeyDown={(event) => onTabKey(event, index)}
              >
                {service.name}
              </button>
            ))}
          </div>
          <button
            type="button"
            className={styles.arrow}
            aria-label="Mô hình tiếp theo"
            onClick={() => select(active + 1)}
          >
            <ChevronRight size={22} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div
        className={styles.viewport}
        data-enhanced={enhanced}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          drag.current = null;
        }}
      >
        {kubernetesOptions.map((service, index) => {
          let position = (index - active + count) % count;
          if (position > count / 2) position -= count;
          const selected = index === active;
          return (
            <div
              key={service.id}
              className={styles.slide}
              data-active={selected}
              data-visible={Math.abs(position) <= 1}
              id={`kubernetes-architecture-panel-${service.id}`}
              role={enhanced ? "tabpanel" : "group"}
              aria-labelledby={
                enhanced
                  ? `kubernetes-architecture-tab-${service.id}`
                  : `kubernetes-architecture-heading-${service.id}`
              }
              aria-hidden={enhanced && !selected ? true : undefined}
              inert={enhanced && !selected}
              style={{ "--position": position } as CSSProperties}
            >
              <Image
                src={service.image}
                alt=""
                fill
                sizes="(min-width: 1000px) 840px, (min-width: 640px) calc(100vw - 128px), calc(100vw - 40px)"
                className={styles.background}
              />
              <article
                className={styles.slideContent}
                data-kubernetes-model={service.id}
              >
                <h3 id={`kubernetes-architecture-heading-${service.id}`}>
                  {service.name}
                </h3>
                <p className={styles.description}>{service.description}</p>
                <a className={styles.detailLink} href={service.href}>
                  Xem phương án{" "}
                  <span className={styles.srOnly}>{service.name}</span>
                  <ArrowRight size={18} aria-hidden="true" />
                </a>
              </article>
            </div>
          );
        })}
      </div>
    </section>
  );
}
