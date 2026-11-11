import { Megaphone } from "lucide-react";
import Link from "next/link";

const announcement =
  "Black Friday 2026, Tiết Kiệm Đến 99% Khi Mua VPS, Cloud Server, Hosting & Domain Tại InterData.";

export function TopbarPromotion() {
  return (
    <div className="utility-promotion">
      <Link
        href="/blackfriday/"
        className="utility-promotion-viewport"
        aria-label="Khuyến mãi Black Friday 2026"
        title={announcement}
      >
        <div className="utility-promotion-track">
          <span className="utility-promotion-copy">
            <Megaphone size={16} aria-hidden="true" />
            {announcement}
          </span>
          <span className="utility-promotion-copy" aria-hidden="true">
            <Megaphone size={16} aria-hidden="true" />
            {announcement}
          </span>
        </div>
      </Link>
    </div>
  );
}
