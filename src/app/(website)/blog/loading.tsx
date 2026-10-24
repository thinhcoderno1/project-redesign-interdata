import styles from "@/components/blog/blog.module.css";
export default function Loading() {
  return (
    <main
      id="main-content"
      className={`${styles.container} ${styles.loading}`}
      aria-busy="true"
    >
      <span className={styles.eyebrow}>INTERDATA BLOG</span>
      <h1>Đang tải bài viết…</h1>
      <p role="status">Nội dung sẽ sẵn sàng trong giây lát.</p>
      <div className={styles.skeleton} />
      <div className={styles.skeleton} />
    </main>
  );
}
