import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./legal-document.module.css";

export function LegalDocumentLayout({
  title,
  label = title,
  titleId = "policy-title",
  sections,
  children,
}: {
  title: string;
  label?: string;
  titleId?: string;
  sections: { id: string; title: string }[];
  children: ReactNode;
}) {
  return (
    <main id="noi-dung" className={styles.page}>
      <div className={`container ${styles.container}`}>
        <nav className={styles.breadcrumb} aria-label="Đường dẫn trang">
          <Link href="/">Trang chủ</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{label}</span>
        </nav>
        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <details className={styles.toc} open>
              <summary>Mục lục</summary>
              <nav
                className={styles.tocLinks}
                aria-label={`Mục lục ${label.toLocaleLowerCase("vi")}`}
              >
                <ul>
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a href={`#${section.id}`}>{section.title}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            </details>
          </aside>
          <article className={styles.article} aria-labelledby={titleId}>
            <h1 id={titleId}>{title}</h1>
            {children}
          </article>
        </div>
      </div>
    </main>
  );
}
