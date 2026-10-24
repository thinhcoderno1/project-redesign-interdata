"use client";
import Link from "next/link";
import styles from "@/components/blog/blog.module.css";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main-content" className={`${styles.container} ${styles.loading}`}>
      <span className={styles.eyebrow}>INTERDATA BLOG</span>
      <h1>Chưa tải được nội dung</h1>
      <p>Kết nối với nguồn bài viết đang gián đoạn. Bạn vui lòng thử lại.</p>
      <div className={styles.errorActions}>
        <button onClick={reset}>Thử lại</button>
        <Link href="/blog/">Về trang blog</Link>
      </div>
    </main>
  );
}
