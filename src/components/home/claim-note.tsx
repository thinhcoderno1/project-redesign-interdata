import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { reviewMode, showEditorialNotes } from "@/data/content";

export function ClaimNote() {
  return reviewMode && showEditorialNotes ? (
    <p className="review-note">
      Nội dung theo brief, đang chờ duyệt.{" "}
      <Link href="/content-review">
        Xem trạng thái xác nhận <Icon name="external" />
      </Link>
    </p>
  ) : null;
}
