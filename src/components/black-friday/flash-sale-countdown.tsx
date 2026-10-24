"use client";

import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";
import { blackFridayFlashSale } from "@/data/black-friday";
import { getFlashSaleState, splitCountdown } from "@/lib/flash-sale";
import styles from "./black-friday.module.css";

export function useFlashSaleVisibility() {
  const [visible, setVisible] = useState(
    blackFridayFlashSale.mode === "preview",
  );

  useEffect(() => {
    if (blackFridayFlashSale.mode !== "scheduled") return;
    const refresh = () =>
      setVisible(getFlashSaleState(blackFridayFlashSale, Date.now()).visible);
    const initial = window.setTimeout(refresh, 0);
    const interval = window.setInterval(refresh, 1000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(interval);
    };
  }, []);

  return visible;
}

export function FlashSaleCountdown() {
  const [state, setState] = useState(() =>
    getFlashSaleState(blackFridayFlashSale, 0),
  );

  useEffect(() => {
    // The design preview stays still until the official schedule is configured.
    if (blackFridayFlashSale.mode !== "scheduled") return;
    const refresh = () =>
      setState(getFlashSaleState(blackFridayFlashSale, Date.now()));
    const initial = window.setTimeout(refresh, 0);
    const interval = window.setInterval(refresh, 1000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(interval);
    };
  }, []);

  const values = splitCountdown(state.remainingSeconds);
  const labels = ["Ngày", "Giờ", "Phút", "Giây"];

  return (
    <div className={styles.schedule}>
      <span className={styles.scheduleHeading}>
        <Clock3 size={16} aria-hidden="true" />
        NHANH TAY KẺO HẾT
      </span>
      <div
        className={styles.countdown}
        role="timer"
        aria-live="off"
        aria-label={values
          .map((value, i) => `${value} ${labels[i]}`)
          .join(", ")}
      >
        {values.map((value, index) => (
          <div
            className={styles.countdownUnit}
            key={labels[index]}
            aria-hidden="true"
          >
            <strong>{value}</strong>
            <span>{labels[index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
