"use client";
import Image from "next/image";
import { useState } from "react";
import { BookOpenText } from "lucide-react";
import styles from "./blog.module.css";

export function BlogImage({
  src,
  alt = "",
  priority = false,
  sizes = "(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 400px",
}: {
  src: string | null;
  alt?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const [failed, setFailed] = useState(false);
  return src && !failed ? (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
    />
  ) : (
    <div className={styles.imageFallback}>
      <BookOpenText size={42} aria-hidden="true" />
      <span>InterData Blog</span>
    </div>
  );
}
