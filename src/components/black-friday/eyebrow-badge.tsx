import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import styles from "./black-friday.module.css";

export function EyebrowBadge({
  icon: Icon,
  children,
  className,
}: {
  icon: LucideIcon;
  children: ReactNode;
  className: string;
}) {
  return (
    <span className={`${styles.eyebrowBadge} ${className}`}>
      <Icon aria-hidden="true" focusable="false" />
      <span>{children}</span>
    </span>
  );
}
