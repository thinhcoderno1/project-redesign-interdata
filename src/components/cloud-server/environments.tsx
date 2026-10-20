"use client";

import Image from "next/image";
import {
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
} from "react";
import { Terminal } from "lucide-react";
import {
  cloudEnvironmentHeader,
  cloudOperatingSystems,
  cloudOneClickApps,
} from "@/data/cloud-environments";
import styles from "./environments.module.css";

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;
const tabs = ["Linux OS", "1-Click Applications"];
const appLogoClasses: Partial<Record<string, string>> = {
  OpenClaw: styles.openclawLogo,
  n8n: styles.n8nLogo,
};

export function CloudDeployment() {
  const [selected, setSelected] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const enhanced = useSyncExternalStore(
    subscribe,
    clientSnapshot,
    serverSnapshot,
  );
  function keyboard(event: KeyboardEvent<HTMLButtonElement>) {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const current = refs.current.indexOf(event.currentTarget);
    const next =
      event.key === "Home" ? 0 : event.key === "End" ? 1 : 1 - current;
    setSelected(next);
    refs.current[next]?.focus();
  }
  return (
    <section
      id="cloud-deployment"
      className={styles.section}
      aria-labelledby="cloud-deployment-title"
    >
      <div className="container">
        <div className={styles.heading}>
          <span className={styles.eyebrow}>
            <Terminal size={16} aria-hidden="true" />
            {cloudEnvironmentHeader.eyebrow}
          </span>
          <h2 id="cloud-deployment-title">{cloudEnvironmentHeader.title}</h2>
          <p>{cloudEnvironmentHeader.text}</p>
        </div>
        <div
          className={styles.tabs}
          role="tablist"
          aria-label="Chọn môi trường triển khai Cloud Server"
          hidden={!enhanced}
        >
          {tabs.map((label, index) => (
            <button
              key={label}
              ref={(node) => {
                refs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`cloud-environment-tab-${index}`}
              aria-controls={`cloud-environment-panel-${index}`}
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
          id="cloud-environment-panel-0"
          role={enhanced ? "tabpanel" : "group"}
          aria-labelledby={
            enhanced
              ? "cloud-environment-tab-0"
              : "cloud-environment-fallback-0"
          }
          hidden={enhanced && selected !== 0}
          tabIndex={enhanced ? 0 : undefined}
        >
          <h3
            id="cloud-environment-fallback-0"
            className={styles.fallbackTitle}
            hidden={enhanced}
          >
            Linux OS
          </h3>
          <div className={styles.osGrid}>
            {cloudOperatingSystems.map((item) => (
              <article className={styles.card} key={item.name}>
                <div className={styles.cardSurface}>
                  <Image
                    src={item.logo}
                    alt=""
                    width={160}
                    height={80}
                    unoptimized
                    className={
                      item.name === "Ubuntu" ? styles.ubuntuLogo : undefined
                    }
                  />
                  <h3>{item.name}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div
          id="cloud-environment-panel-1"
          role={enhanced ? "tabpanel" : "group"}
          aria-labelledby={
            enhanced
              ? "cloud-environment-tab-1"
              : "cloud-environment-fallback-1"
          }
          hidden={enhanced && selected !== 1}
          tabIndex={enhanced ? 0 : undefined}
        >
          <h3
            id="cloud-environment-fallback-1"
            className={styles.fallbackTitle}
            hidden={enhanced}
          >
            1-Click Applications
          </h3>
          <div className={styles.appGrid}>
            {cloudOneClickApps.map((item) => (
              <article
                className={`${styles.card} ${styles.app}`}
                key={item.name}
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
