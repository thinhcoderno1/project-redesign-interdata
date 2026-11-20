"use client";

import { useEffect, useState } from "react";
import type { FlashSaleRelease } from "@/data/black-friday-flash-sale";

export function useFlashSaleRelease() {
  const [release, setRelease] = useState<FlashSaleRelease | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [syncFailed, setSyncFailed] = useState(false);

  useEffect(() => {
    let clock: {
      serverNow: number;
      measuredAt: number;
      startsAt: number;
      openingConfirmed: boolean;
    } | null = null;
    let published = false;
    let stopped = false;
    let request: AbortController | null = null;
    let lastAttempt = -Infinity;

    async function sync() {
      if (request || published || stopped) return;
      const controller = new AbortController();
      request = controller;
      lastAttempt = performance.now();
      const timeout = window.setTimeout(() => controller.abort(), 10000);
      try {
        const response = await fetch("/api/black-friday-flash-sale/", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Unable to load Flash Sale");
        const data: FlashSaleRelease = await response.json();
        const startsAt = Date.parse(data.startsAt);
        if (!Number.isFinite(startsAt) || !Number.isFinite(data.serverNow))
          throw new Error("Invalid Flash Sale clock");
        if (controller.signal.aborted) return;
        clock = {
          serverNow: data.serverNow,
          measuredAt: performance.now(),
          startsAt,
          openingConfirmed: data.status === "live",
        };
        published =
          clock.openingConfirmed && Object.keys(data.offers).length > 0;
        setRelease(data);
        setRemainingSeconds(
          Math.max(0, Math.ceil((startsAt - data.serverNow) / 1000)),
        );
        setSyncFailed(false);
      } catch {
        if (!stopped) setSyncFailed(true);
      } finally {
        window.clearTimeout(timeout);
        request = null;
      }
    }

    function tick() {
      if (published) return;
      const elapsed = performance.now();
      let remaining = Infinity;
      if (clock) {
        // Use server time plus a monotonic clock; changing device time cannot unlock codes.
        remaining =
          clock.startsAt - (clock.serverNow + elapsed - clock.measuredAt);
        setRemainingSeconds(Math.max(0, Math.ceil(remaining / 1000)));
      }
      const awaitingOpening =
        clock && !clock.openingConfirmed && remaining <= 0;
      const retryAfter = !clock || awaitingOpening ? 1000 : 30000;
      const reachedOpening =
        clock && awaitingOpening && lastAttempt < clock.measuredAt;
      if (reachedOpening || elapsed - lastAttempt >= retryAfter) void sync();
    }

    function resume() {
      if (document.visibilityState === "visible") void sync();
    }
    void sync();
    const timer = window.setInterval(tick, 250);
    document.addEventListener("visibilitychange", resume);
    window.addEventListener("pageshow", resume);
    return () => {
      stopped = true;
      request?.abort();
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", resume);
      window.removeEventListener("pageshow", resume);
    };
  }, []);

  return { release, remainingSeconds, syncFailed };
}
