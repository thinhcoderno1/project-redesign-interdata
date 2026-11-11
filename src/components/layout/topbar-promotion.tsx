"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";
import Link from "next/link";

const announcement =
  "Black Friday 2026, Tiết Kiệm Đến 99% Khi Mua VPS, Cloud Server, Hosting & Domain Tại InterData.";

export function TopbarPromotion() {
  const [paused, setPaused] = useState(false);
  const PlaybackIcon = paused ? Play : Pause;

  return (
    <div className="utility-promotion" data-paused={paused || undefined}>
      <Link
        href="/blackfriday/"
        className="utility-promotion-viewport"
        aria-label="Khuyến mãi Black Friday 2026"
        title={announcement}
      >
        <div className="utility-promotion-track">
          <span className="utility-promotion-copy">{announcement}</span>
          <span className="utility-promotion-copy" aria-hidden="true">
            {announcement}
          </span>
        </div>
      </Link>
      <button
        type="button"
        className="utility-promotion-toggle"
        aria-label={
          paused
            ? "Tiếp tục chạy thông tin khuyến mãi"
            : "Tạm dừng thông tin khuyến mãi"
        }
        onClick={() => setPaused((previous) => !previous)}
      >
        <PlaybackIcon size={14} aria-hidden="true" />
      </button>
    </div>
  );
}
