"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent } from "react";
import {
  vpsEnvironmentHeader,
  vpsLinuxSystems,
  vpsOneClickApps,
} from "@/data/vps-environments";
import styles from "./environments.module.css";

const appLogoClasses: Partial<Record<string, string>> = {
  OpenClaw: styles.openclawLogo,
  n8n: styles.n8nLogo,
};

export function Environments() {
  const [selected, setSelected] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const header = vpsEnvironmentHeader;
  function keyboard(event: KeyboardEvent<HTMLButtonElement>) {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next =
      event.key === "Home" ? 0 : event.key === "End" ? 1 : 1 - selected;
    setSelected(next);
    refs.current[next]?.focus();
  }
  return (
    <section className={styles.section} aria-labelledby={header.id}>
      <div className="container">
        <div className={styles.heading}>
          <span className={styles.eyebrow}>{header.eyebrow}</span>
          <h2 id={header.id}>{header.title}</h2>
          <p>{header.text}</p>
        </div>
        <div
          className={styles.tabs}
          role="tablist"
          aria-label="Chọn môi trường triển khai"
        >
          {["Linux OS", "1-Click Applications"].map((label, index) => (
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
          <div className={styles.osGrid}>
            {vpsLinuxSystems.map((item) => (
              <article key={item.name} className={styles.card}>
                <div className={styles.cardSurface}>
                  <Image
                    src={item.logo}
                    alt=""
                    className={
                      item.name === "Ubuntu" ? styles.ubuntuLogo : undefined
                    }
                    width={160}
                    height={80}
                    unoptimized
                  />
                  <h3>{item.name}</h3>
                </div>
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
          <div className={styles.appGrid}>
            {vpsOneClickApps.map((item) => (
              <article
                key={item.name}
                className={`${styles.card} ${styles.app}`}
              >
                <div className={styles.cardSurface}>
                  <Image
                    src={item.logo}
                    alt=""
                    className={appLogoClasses[item.name]}
                    width={160}
                    height={80}
                    unoptimized
                  />
                  <small>{item.label}</small>
                  <h3>{item.name}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
