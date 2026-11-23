import Image from "next/image";
import { blackFriday2026Banner } from "@/data/promotions";
import styles from "./black-friday-banner-artwork.module.css";

export function BlackFridayBannerArtwork({
  loading,
  sizes,
  banner = blackFriday2026Banner,
  unoptimized = true,
  width = 2172,
  height = 464,
}: {
  loading: "eager" | "lazy";
  sizes: string;
  banner?: { image: string; alt: string };
  unoptimized?: boolean;
  width?: number;
  height?: number;
}) {
  return (
    <span className={styles.artwork}>
      <Image
        className={styles.image}
        src={banner.image}
        alt={banner.alt}
        width={width}
        height={height}
        style={{ aspectRatio: `${width} / ${height}` }}
        sizes={sizes}
        loading={loading}
        draggable={false}
        unoptimized={unoptimized}
      />
    </span>
  );
}
