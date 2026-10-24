import Link from "next/link";
import styles from "@/components/blog/blog.module.css";
export default function PostNotFound() {
  return (
    <main id="main-content" className={`${styles.container} ${styles.loading}`}>
      <span className={styles.eyebrow}>INTERDATA BLOG</span>
      <h1>Không tìm thấy bài viết</h1>
      <p>Bài viết có thể đã được chuyển hoặc không còn tồn tại.</p>
      <Link className={styles.sectionLink} href="/blog/">
        Khám phá các bài viết khác →
      </Link>
    </main>
  );
}
