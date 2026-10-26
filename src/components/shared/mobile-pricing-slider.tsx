import type { ComponentProps } from "react";
import styles from "./mobile-pricing-slider.module.css";

/** Native mobile swiping; the page's existing grid remains in use on desktop. */
export function MobilePricingSlider({
  className,
  children,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      {...props}
      data-pricing-slider
      className={`${styles.track}${className ? ` ${className}` : ""}`}
    >
      {children}
    </div>
  );
}
