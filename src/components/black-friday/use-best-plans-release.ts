"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const retryMs = 3000;
const maxTimeoutMs = 2_147_483_647;

export function useBestPlansRelease(waitForPlatinum: boolean) {
  const router = useRouter();

  useEffect(() => {
    if (!waitForPlatinum) return;

    const lifecycle = new AbortController();
    let timer: number | undefined;
    let syncing = false;

    async function sync() {
      if (lifecycle.signal.aborted || syncing) return;
      window.clearTimeout(timer);
      syncing = true;
      let delay = retryMs;
      try {
        const response = await fetch("/api/black-friday-best-plans/", {
          cache: "no-store",
          signal: AbortSignal.any([
            lifecycle.signal,
            AbortSignal.timeout(5000),
          ]),
        });
        if (!response.ok) return;
        const { delayMs } = await response.json();
        if (lifecycle.signal.aborted) return;
        if (delayMs === 0) router.refresh();
        else if (Number.isFinite(delayMs) && delayMs > 0)
          delay = Math.min(delayMs, maxTimeoutMs);
      } catch {
        // Retry using the server clock after a failed request.
      } finally {
        syncing = false;
        if (!lifecycle.signal.aborted)
          timer = window.setTimeout(() => void sync(), delay);
      }
    }

    function resume() {
      if (document.visibilityState === "visible") void sync();
    }

    void sync();
    document.addEventListener("visibilitychange", resume);
    window.addEventListener("pageshow", resume);
    return () => {
      lifecycle.abort();
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", resume);
      window.removeEventListener("pageshow", resume);
    };
  }, [router, waitForPlatinum]);
}
