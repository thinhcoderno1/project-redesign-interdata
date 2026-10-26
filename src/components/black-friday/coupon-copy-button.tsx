"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import styles from "./black-friday.module.css";

export function CouponCopyButton({
  code,
  label,
  className,
}: {
  code: string;
  label: string;
  className: string;
}) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copying = useRef(false);

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    [],
  );

  async function copyCode() {
    if (copying.current) return;
    copying.current = true;
    if (resetTimer.current) clearTimeout(resetTimer.current);
    setStatus("idle");
    try {
      await navigator.clipboard.writeText(code);
      setStatus("copied");
    } catch {
      setStatus("error");
    } finally {
      copying.current = false;
      resetTimer.current = setTimeout(() => setStatus("idle"), 2500);
    }
  }

  const Icon = status === "copied" ? Check : Copy;
  return (
    <div className={styles.codeCopy}>
      <button
        type="button"
        className={`${styles.codeCopyButton} ${className}`}
        aria-label={`Sao chép mã ${label}: ${code}`}
        onClick={copyCode}
      >
        <span>{code}</span>
        <Icon size={16} aria-hidden="true" />
      </button>
      <span
        className={styles.copyFeedback}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {status === "copied"
          ? "Đã sao chép"
          : status === "error"
            ? "Không thể sao chép. Vui lòng thử lại."
            : ""}
      </span>
    </div>
  );
}
