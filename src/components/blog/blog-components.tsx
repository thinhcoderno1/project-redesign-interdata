import Link from "next/link";
import {
  ArrowRight,
  Search,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  BookOpenText,
  Server,
  Cloud,
  Code2,
  ShieldCheck,
  Sparkles,
  Network,
} from "lucide-react";
import type { BlogPost, BlogCategory, BlogListing } from "@/data/blog";
import { blogListingHref } from "@/lib/blog-links";
import { BlogImage } from "./blog-image";
import styles from "./blog.module.css";

export function dateLabel(date: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date(date));
}
export function SearchForm({
  q = "",
  category = "",
  compact = false,
}: {
  q?: string;
  category?: string;
  compact?: boolean;
}) {
  return (
    <form
      className={`${styles.search} ${compact ? styles.searchCompact : ""}`}
      action="/blog/"
      method="get"
      role="search"
    >
      <Search size={22} aria-hidden="true" />
      <label className="sr-only" htmlFor="blog-search">
        Tìm kiếm bài viết
      </label>
      <input
        id="blog-search"
        name="q"
        type="search"
        placeholder="Bạn muốn tìm hiểu điều gì? VPS, Cloud, bảo mật…"
        defaultValue={q}
        maxLength={160}
      />
      {category && <input name="category" type="hidden" value={category} />}
      <button type="submit">
        <span>Tìm kiếm</span>
        <ArrowRight size={20} aria-hidden="true" />
      </button>
    </form>
  );
}
export function PostCard({
  post,
  compact = false,
}: {
  post: BlogPost;
  compact?: boolean;
}) {
  return (
    <article
      className={`${styles.card} ${compact ? styles.cardCompact : ""}`}
      data-post-id={post.id}
    >
      <Link
        prefetch={false}
        href={post.href}
        className={styles.cardImage}
        tabIndex={-1}
        aria-hidden="true"
      >
        <BlogImage src={post.image} />
      </Link>
      <div className={styles.cardBody}>
        <div className={styles.cardMeta}>
          <span>{post.categories[0]?.name || "InterData Blog"}</span>
          <time dateTime={post.publishedAt}>{dateLabel(post.publishedAt)}</time>
        </div>
        <h3>
          <Link prefetch={false} href={post.href}>
            {post.title}
          </Link>
        </h3>
        {!compact && post.excerpt && <p>{post.excerpt}</p>}
        <Link
          prefetch={false}
          href={post.href}
          className={styles.readMore}
          aria-label={`Đọc bài viết: ${post.title}`}
        >
          Đọc bài viết <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
export function PostGrid({
  listing,
  compact = false,
}: {
  listing: BlogListing;
  compact?: boolean;
}) {
  if (listing.status === "unavailable")
    return (
      <div className={styles.empty} role="status">
        <BookOpenText size={28} aria-hidden="true" />
        <h3>Chưa tải được bài viết</h3>
        <p>Vui lòng thử lại sau ít phút.</p>
        <Link prefetch={false} href="/blog/">
          Tải lại trang blog <ArrowRight size={16} />
        </Link>
      </div>
    );
  if (!listing.posts.length)
    return (
      <div className={styles.empty}>
        <BookOpenText size={28} aria-hidden="true" />
        <h3>Chưa có bài viết phù hợp</h3>
        <p>Thử từ khóa khác hoặc khám phá các chuyên mục bên dưới.</p>
        <Link prefetch={false} href="/blog/">
          Khám phá blog <ArrowRight size={16} />
        </Link>
      </div>
    );
  return (
    <div className={`${styles.grid} ${compact ? styles.gridCompact : ""}`}>
      {listing.posts.map((post) => (
        <PostCard post={post} key={post.id} compact={compact} />
      ))}
    </div>
  );
}
const categoryIcons: Record<string, typeof Server> = {
  vps: Server,
  "cloud-server": Cloud,
  "lap-trinh": Code2,
  "bao-mat-an-ninh-mang": ShieldCheck,
  ai: Sparkles,
  mang: Network,
};
export function CategoryNav({
  categories,
  selected = "",
  q = "",
}: {
  categories: BlogCategory[];
  selected?: string;
  q?: string;
}) {
  const preferred = [
    "vps",
    "cloud-server",
    "server",
    "bao-mat-an-ninh-mang",
    "lap-trinh",
    "ai",
    "huong-dan-chung",
    "su-kien",
  ];
  const primary = preferred.flatMap((slug) =>
    categories.filter((item) => item.slug === slug),
  );
  if (selected && !primary.some((item) => item.slug === selected))
    primary.push(...categories.filter((item) => item.slug === selected));
  const remaining = categories.filter((item) => !primary.includes(item));
  return (
    <nav className={styles.categories} aria-label="Chuyên mục bài viết">
      <div className={styles.categoryPrimary}>
        <Link
          prefetch={false}
          className={!selected ? styles.categoryActive : ""}
          href={blogListingHref({ q, page: 1 })}
          aria-current={!selected ? "page" : undefined}
        >
          <BookOpenText size={17} />
          Tất cả
        </Link>
        {primary.map((category) => {
          const Icon = categoryIcons[category.slug] || BookOpenText;
          return (
            <Link
              prefetch={false}
              key={category.id}
              href={blogListingHref({ q, category: category.slug })}
              className={
                selected === category.slug ? styles.categoryActive : ""
              }
              aria-current={selected === category.slug ? "page" : undefined}
            >
              <Icon size={17} />
              {category.name}
            </Link>
          );
        })}
      </div>
      {!!remaining.length && (
        <details className={styles.allCategories}>
          <summary>
            Tất cả chuyên mục <span>{categories.length}</span>
          </summary>
          <div>
            {remaining.map((category) => (
              <Link
                prefetch={false}
                key={category.id}
                href={blogListingHref({ q, category: category.slug })}
              >
                {category.name}
                <span>{category.count}</span>
              </Link>
            ))}
          </div>
        </details>
      )}
    </nav>
  );
}
export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  href,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  href?: string;
}) {
  return (
    <div className={styles.sectionHeading}>
      <div>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <h2 id={id}>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {href && (
        <Link prefetch={false} href={href} className={styles.sectionLink}>
          Xem tất cả <ArrowRight size={18} aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
export function FeaturedPosts({ posts }: { posts: BlogPost[] }) {
  const first = posts[0];
  if (!first) return null;
  return (
    <section className={styles.featured} aria-label="Bài viết nổi bật">
      <article className={styles.featureLead}>
        <BlogImage
          src={first.image}
          priority
          sizes="(max-width: 900px) 90vw, 760px"
        />
        <div className={styles.featureOverlay} />
        <div className={styles.featureLeadCopy}>
          <span className={styles.featureBadge}>TIÊU ĐIỂM</span>
          <span>{first.categories[0]?.name}</span>
          <h2>
            <Link prefetch={false} href={first.href}>
              {first.title}
            </Link>
          </h2>
          <div>
            <CalendarDays size={16} aria-hidden="true" />
            <time dateTime={first.publishedAt}>
              {dateLabel(first.publishedAt)}
            </time>
            <ArrowRight size={22} aria-hidden="true" />
          </div>
        </div>
      </article>
      <div className={styles.featureSide}>
        {posts.slice(1, 3).map((post) => (
          <PostCard compact post={post} key={post.id} />
        ))}
      </div>
    </section>
  );
}
export function Pagination({
  page,
  pages,
  q,
  category,
}: {
  page: number;
  pages: number;
  q?: string;
  category?: string;
}) {
  if (pages <= 1) return null;
  const numbers = [
    ...new Set([
      1,
      ...[page - 1, page, page + 1].filter((n) => n > 0 && n <= pages),
      pages,
    ]),
  ];
  return (
    <nav aria-label="Phân trang bài viết" className={styles.pagination}>
      {page > 1 && (
        <Link
          prefetch={false}
          href={blogListingHref({ q, category, page: page - 1 })}
          aria-label="Trang trước"
        >
          <ChevronLeft size={18} />
        </Link>
      )}
      {numbers.map((number, i) => (
        <span key={number}>
          {i > 0 && number > numbers[i - 1] + 1 && (
            <span className={styles.ellipsis}>…</span>
          )}
          <Link
            prefetch={false}
            href={blogListingHref({ q, category, page: number })}
            aria-current={page === number ? "page" : undefined}
          >
            {number}
          </Link>
        </span>
      ))}
      {page < pages && (
        <Link
          prefetch={false}
          href={blogListingHref({ q, category, page: page + 1 })}
          aria-label="Trang tiếp theo"
        >
          <ChevronRight size={18} />
        </Link>
      )}
    </nav>
  );
}
