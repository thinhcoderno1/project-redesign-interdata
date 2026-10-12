"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent } from "react";
import content from "@/data/vps-content.json";
import styles from "./vps.module.css";

export function Environments() {
  const [selected, setSelected] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const header = content.landing.headers.OneClickApps;
  function keyboard(event: KeyboardEvent<HTMLButtonElement>) {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next =
      event.key === "Home" ? 0 : event.key === "End" ? 1 : 1 - selected;
    setSelected(next);
    refs.current[next]?.focus();
  }
  return (
    <section
      className={`${styles.section} ${styles.subtle}`}
      aria-labelledby={header.id}
    >
      <div className="container">
        <div className={styles.sectionHeading}>
          <span className="eyebrow">{header.eyebrow}</span>
          <h2 id={header.id}>{header.title}</h2>
          <p>{header.text}</p>
        </div>
        <div
          className={styles.tabs}
          role="tablist"
          aria-label="Chọn môi trường triển khai"
        >
          {["Hệ điều hành", "1-Click Applications"].map((label, index) => (
            <button
              key={label}
              ref={(element) => {
                refs.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`environment-tab-${index}`}
              aria-controls={`environment-panel-${index}`}
              aria-selected={selected === index}
              tabIndex={selected === index ? 0 : -1}
              onClick={() => setSelected(index)}
              onKeyDown={keyboard}
            >
              {label}
            </button>
          ))}
        </div>
        <div
          id="environment-panel-0"
          role="tabpanel"
          aria-labelledby="environment-tab-0"
          hidden={selected !== 0}
          tabIndex={0}
        >
          <div className={styles.environmentGrid}>
            {content.landing.operatingSystems.map((item) => (
              <article key={item.name} className={styles.environment}>
                <Image
                  src={item.logo}
                  alt={`${item.name} logo`}
                  width={160}
                  height={80}
                  unoptimized
                />
                <small>Hệ điều hành</small>
                <h3>{item.name}</h3>
                <p>Sẵn sàng cài đặt khi khởi tạo VPS.</p>
              </article>
            ))}
          </div>
        </div>
        <div
          id="environment-panel-1"
          role="tabpanel"
          aria-labelledby="environment-tab-1"
          hidden={selected !== 1}
          tabIndex={0}
        >
          <div className={styles.environmentGrid}>
            {content.landing.apps.map((item) => (
              <article key={item.name} className={styles.environment}>
                <Image
                  src={item.logo}
                  alt={`${item.name} logo`}
                  width={160}
                  height={80}
                  unoptimized
                />
                <small>{item.label}</small>
                <h3>{item.name}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
