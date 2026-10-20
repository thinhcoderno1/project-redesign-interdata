"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Gauge,
  HardDrive,
  History,
  MapPin,
  MoveHorizontal,
  Network,
  Wifi,
} from "lucide-react";
import styles from "./comparison.module.css";

type Column = {
  key: string;
  label: string;
  featured?: boolean;
  description: string;
  href: string;
};
const criterionIcons = [HardDrive, Cpu, Gauge, Network, Wifi, MapPin, History];
const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export function CloudComparisonRail({
  columns,
  rows,
  label,
}: {
  columns: Column[];
  rows: Record<string, string>[];
  label: string;
}) {
  const rail = useRef<HTMLDivElement>(null);
  const drag = useRef<{
    id: number;
    x: number;
    left: number;
    moved: boolean;
  } | null>(null);
  const suppressClick = useRef(false);
  const [position, setPosition] = useState({
    start: true,
    end: false,
    first: 1,
    last: Math.min(2, columns.length),
  });
  const enhanced = useSyncExternalStore(
    subscribe,
    clientSnapshot,
    serverSnapshot,
  );

  useEffect(() => {
    const node = rail.current!;
    function update() {
      const cells = Array.from(
        node.querySelectorAll<HTMLTableCellElement>("thead th[data-service]"),
      );
      const left = node.getBoundingClientRect().left + node.clientLeft;
      const edge = left + node.clientWidth;
      const stickyWidth = node
        .querySelector("thead th")!
        .getBoundingClientRect().width;
      const visible = cells.flatMap((cell, index) => {
        const bounds = cell.getBoundingClientRect();
        return bounds.right > left + stickyWidth + 2 && bounds.left < edge - 2
          ? [index + 1]
          : [];
      });
      setPosition({
        start: node.scrollLeft < 2,
        end: node.scrollLeft >= node.scrollWidth - node.clientWidth - 2,
        first: visible[0] || 1,
        last: visible.at(-1) || columns.length,
      });
    }
    const observer = new ResizeObserver(update);
    observer.observe(node);
    node.addEventListener("scroll", update, { passive: true });
    return () => {
      observer.disconnect();
      node.removeEventListener("scroll", update);
    };
  }, [columns.length]);

  function scroll(direction: number) {
    const node = rail.current!;
    const width = node
      .querySelector("thead th[data-service]")!
      .getBoundingClientRect().width;
    node.scrollTo({
      left: Math.round(node.scrollLeft / width + direction) * width,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }

  function onKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      scroll(event.key === "ArrowRight" ? 1 : -1);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      rail.current!.scrollTo({
        left: event.key === "Home" ? 0 : rail.current!.scrollWidth,
        behavior: "instant",
      });
    }
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    // Touch/pen retain native horizontal swiping and vertical page scrolling.
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    suppressClick.current = false;
    drag.current = {
      id: event.pointerId,
      x: event.clientX,
      left: event.currentTarget.scrollLeft,
      moved: false,
    };
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const start = drag.current;
    if (!start || start.id !== event.pointerId) return;
    const distance = event.clientX - start.x;
    if (!start.moved && Math.abs(distance) < 6) return;
    if (!start.moved) {
      start.moved = true;
      suppressClick.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.dataset.dragging = "true";
    }
    event.currentTarget.scrollLeft = start.left - distance;
    event.preventDefault();
  }

  function stopDrag(event: PointerEvent<HTMLDivElement>) {
    if (drag.current?.id !== event.pointerId) return;
    drag.current = null;
    delete event.currentTarget.dataset.dragging;
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function serviceLink(column: Column) {
    return (
      <a
        href={column.href}
        className={styles.detailLink}
        aria-label={`Xem chi tiết ${column.label}`}
      >
        Xem chi tiết <ArrowRight size={16} aria-hidden="true" />
      </a>
    );
  }

  return (
    <>
      <div className={styles.toolbar}>
        <p id="cloud-comparison-hint" className={styles.hint}>
          <MoveHorizontal size={18} aria-hidden="true" />
          Kéo ngang để so sánh các dòng Cloud Server
        </p>
        <div className={styles.controls} hidden={!enhanced}>
          <span
            className={styles.position}
            aria-live="polite"
            aria-atomic="true"
          >
            {position.first}–{position.last} / {columns.length} dòng Cloud
            Server
          </span>
          <button
            type="button"
            aria-label="Xem dòng Cloud Server trước"
            aria-controls="cloud-comparison-scroll"
            disabled={position.start}
            onClick={() => scroll(-1)}
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Xem dòng Cloud Server tiếp theo"
            aria-controls="cloud-comparison-scroll"
            disabled={position.end}
            onClick={() => scroll(1)}
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div
        className={styles.frame}
        style={{ "--service-count": columns.length } as CSSProperties}
      >
        <div
          ref={rail}
          id="cloud-comparison-scroll"
          className={styles.rail}
          role="region"
          aria-label={`Bảng so sánh: ${label}`}
          aria-describedby="cloud-comparison-hint"
          tabIndex={0}
          onKeyDown={onKey}
          onFocusCapture={(event) => {
            const node = event.currentTarget;
            const cell = (event.target as HTMLElement).closest(
              "td, th[data-service]",
            );
            if (!cell) return;
            const bounds = node.getBoundingClientRect();
            const stickyWidth = node
              .querySelector("thead th")!
              .getBoundingClientRect().width;
            const target = cell.getBoundingClientRect();
            if (target.left < bounds.left + stickyWidth)
              node.scrollLeft += target.left - bounds.left - stickyWidth;
            else if (target.right > bounds.left + node.clientWidth)
              node.scrollLeft += target.right - bounds.left - node.clientWidth;
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
          onLostPointerCapture={stopDrag}
          onPointerLeave={(event) => {
            if (!drag.current?.moved) stopDrag(event);
          }}
          onDragStart={(event) => event.preventDefault()}
          onClickCapture={(event) => {
            if (suppressClick.current && event.detail !== 0) {
              event.preventDefault();
              event.stopPropagation();
              suppressClick.current = false;
            }
          }}
        >
          <table className={styles.table}>
            <caption className={styles.srOnly}>{label}</caption>
            <colgroup>
              <col className={styles.criterionColumn} />
              {columns.map((column) => (
                <col key={column.key} />
              ))}
            </colgroup>
            <thead>
              <tr>
                <th scope="col" rowSpan={2} className={styles.corner}>
                  Tiêu chí
                  <span>Đối chiếu từng thông số</span>
                </th>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    data-service={column.key}
                    data-featured={column.featured || undefined}
                  >
                    <div className={styles.serviceHeading}>
                      <span className={styles.serviceName}>{column.label}</span>
                      <p>{column.description}</p>
                    </div>
                  </th>
                ))}
              </tr>
              <tr className={styles.headerActions}>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    data-featured={column.featured || undefined}
                  >
                    {serviceLink(column)}
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => {
                const Icon = criterionIcons[index] || Gauge;
                return (
                  <tr key={row.criteria}>
                    <th scope="row">
                      <span className={styles.criterionLabel}>
                        <Icon size={18} aria-hidden="true" />
                        {row.criteria}
                      </span>
                    </th>
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        data-featured={column.featured || undefined}
                      >
                        {row[column.key]}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <th scope="row">
                  <span className={styles.srOnly}>Chi tiết dịch vụ</span>
                </th>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    data-featured={column.featured || undefined}
                  >
                    {serviceLink(column)}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  );
}
