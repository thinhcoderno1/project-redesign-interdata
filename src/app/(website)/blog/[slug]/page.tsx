import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  UserRound,
} from "lucide-react";
import { getBlogCategories, getBlogListing, getBlogPost } from "@/lib/blog-api";
import { prepareBlogContent } from "@/lib/blog-content";
import { frameBlogContent } from "@/lib/blog-frame";
import { PostArticle } from "@/components/blog/post-article";
import { blogListingHref } from "@/lib/blog-links";
import {
  PostGrid,
  dateLabel,
  SectionHeading,
} from "@/components/blog/blog-components";
import styles from "@/components/blog/blog.module.css";

export const revalidate = 300;
export function generateStaticParams() {
  return [];
}
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getBlogCategories();
  if (categories.some((category) => category.slug === slug))
    redirect(blogListingHref({ category: slug }));
  const post = await getBlogPost(slug);
  if (!post) notFound();
  return {
    title: `${post.title} | InterData Blog`,
    description: post.excerpt,
    alternates: { canonical: `https://interdata.vn${post.href}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://interdata.vn${post.href}`,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.modifiedAt,
      locale: "vi_VN",
      ...(post.image ? { images: [{ url: post.image }] } : {}),
    },
  };
}

export default async function SinglePost({ params }: Props) {
  const { slug } = await params;
  const categories = await getBlogCategories();
  if (categories.some((category) => category.slug === slug))
    redirect(blogListingHref({ category: slug }));
  const post = await getBlogPost(slug);
  if (!post) notFound();
  const { html, toc, readingMinutes } = prepareBlogContent(
    post.content,
    categories,
  );
  const { opening, body } = frameBlogContent(html);
  const contents = toc.filter((item) => item.level === 2);
  const related = await getBlogListing(categories, {
    category: post.categories[0]?.slug,
    perPage: 3,
    exclude: [post.id],
  });
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.modifiedAt,
    mainEntityOfPage: `https://interdata.vn${post.href}`,
    ...(post.image ? { image: post.image } : {}),
    ...(post.author
      ? { author: { "@type": "Person", name: post.author } }
      : {}),
    publisher: { "@type": "Organization", name: "InterData" },
  };
  return (
    <main id="main-content" className={`${styles.page} ${styles.postPage}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <header className={styles.postHeader}>
        <div className={styles.container}>
          <nav className={styles.breadcrumb} aria-label="Đường dẫn">
            <Link href="/">Trang chủ</Link>
            <span>/</span>
            <Link href="/blog/">Blog</Link>
            {post.categories[0] && (
              <>
                <span>/</span>
                <Link
                  href={blogListingHref({ category: post.categories[0].slug })}
                >
                  {post.categories[0].name}
                </Link>
              </>
            )}
          </nav>
          <div className={styles.postCategories}>
            {post.categories.map((category) => (
              <Link
                key={category.id}
                href={blogListingHref({ category: category.slug })}
              >
                {category.name}
              </Link>
            ))}
          </div>
          <h1>{post.title}</h1>
          <div className={styles.postMeta}>
            {post.author && (
              <span>
                <UserRound size={16} aria-hidden="true" />
                {post.author}
              </span>
            )}
            <span>
              <CalendarDays size={16} aria-hidden="true" />
              <time dateTime={post.publishedAt}>
                {dateLabel(post.publishedAt)}
              </time>
            </span>
            <span>
              <Clock3 size={16} aria-hidden="true" />
              {readingMinutes} phút đọc
            </span>
          </div>
          {post.excerpt && <p className={styles.postIntro}>{post.excerpt}</p>}
        </div>
      </header>
      <div className={`${styles.container} ${styles.articleGrid}`}>
        <aside
          className={styles.articleAside}
          data-has-toc={contents.length > 0}
        >
          {!!contents.length && (
            <nav className={styles.toc} aria-label="Mục lục">
              <p>NỘI DUNG BÀI VIẾT</p>
              <ul>
                {contents.map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`}>{item.title}</a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          <div className={styles.asideCta}>
            <span>HẠ TẦNG CHO DỰ ÁN CỦA BẠN</span>
            <h2>Bắt đầu cùng InterData</h2>
            <p>
              VPS và Cloud Server linh hoạt cho website, ứng dụng và hệ thống
              doanh nghiệp.
            </p>
            <Link href="/thue-vps/">
              Khám phá dịch vụ <ArrowRight size={17} />
            </Link>
          </div>
        </aside>
        <PostArticle>
          {opening.trim() && (
            <div
              data-article-opening
              dangerouslySetInnerHTML={{ __html: opening }}
            />
          )}
          <div data-article-body dangerouslySetInnerHTML={{ __html: body }} />
        </PostArticle>
      </div>
      <div className={`${styles.container} ${styles.articleFooter}`}>
        <Link href="/blog/" className={styles.sectionLink}>
          <ArrowLeft size={18} />
          Trở về Blog
        </Link>
        <span>
          Cập nhật:{" "}
          <time dateTime={post.modifiedAt}>{dateLabel(post.modifiedAt)}</time>
        </span>
      </div>
      <section
        className={`${styles.container} ${styles.related}`}
        aria-labelledby="related-title"
      >
        <SectionHeading
          id="related-title"
          eyebrow="TIẾP TỤC KHÁM PHÁ"
          title="Bài viết liên quan"
          href={blogListingHref({ category: post.categories[0]?.slug })}
        />
        <PostGrid listing={related} />
      </section>
    </main>
  );
}
