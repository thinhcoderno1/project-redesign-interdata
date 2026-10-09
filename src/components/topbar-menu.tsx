"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./icon";

export function TopbarMenu({
  id,
  label,
  items,
}: {
  id: string;
  label: string;
  items: { name: string; href: string }[];
}) {
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div
      className="utility-menu"
      ref={container}
      data-open={open || undefined}
      onPointerEnter={(event) => {
        if (
          event.pointerType !== "mouse" ||
          !window.matchMedia("(hover: hover) and (pointer: fine)").matches
        )
          return;
        if (closeTimer.current) clearTimeout(closeTimer.current);
        setOpen(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "mouse") return;
        if (closeTimer.current) clearTimeout(closeTimer.current);
        closeTimer.current = setTimeout(() => {
          if (!container.current?.contains(document.activeElement))
            setOpen(false);
        }, 150);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node))
          setOpen(false);
      }}
    >
      <button
        type="button"
        ref={toggle}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((previous) => !previous)}
      >
        {label} <Icon name="down" />
      </button>
      <div id={id} className="utility-dropdown" hidden={!open}>
        {items.map((item) => (
          <a key={item.name} href={item.href} onClick={() => setOpen(false)}>
            {item.name}
          </a>
        ))}
      </div>
    </div>
  );
}
