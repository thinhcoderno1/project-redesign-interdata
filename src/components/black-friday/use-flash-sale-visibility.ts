"use client";

import { useEffect, useState } from "react";
import { blackFridayFlashSale } from "@/data/black-friday";
import { getFlashSaleState } from "@/lib/flash-sale";

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
