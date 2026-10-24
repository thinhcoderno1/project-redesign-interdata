import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, BookOpenText } from "lucide-react";
import { getBlogCategories, getBlogListing } from "@/lib/blog-api";
import { blogListingHref } from "@/lib/blog-links";
import { blogSections, type BlogCategory } from "@/data/blog";
import {
  CategoryNav,
  FeaturedPosts,
  Pagination,
  PostGrid,
  SearchForm,
  SectionHeading,
} from "@/components/blog/blog-components";
import styles from "@/components/blog/blog.module.css";

type Query = {
  q?: string | string[];
  category?: string | string[];
  page?: string | string[];
};
function normalizeQuery(query: Query) {
  return {
    q: typeof query.q === "string" ? query.q.trim().slice(0, 160) : "",
    category:
      typeof query.category === "string" ? query.category.slice(0, 100) : "",
    page:
      typeof query.page === "string" && /^\d{1,6}$/.test(query.page)
        ? Math.max(1, Number(query.page))
        : 1,
  };
}
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Query>;
}): Promise<Metadata> {
  const query = await searchParams;
  return {
    title: "InterData Blog — Kiến thức, hướng dẫn & tin tức công nghệ",
    description:
      "Khám phá kiến thức VPS, Cloud Server, bảo mật và lập trình. Hướng dẫn thực hành, tin tức, khuyến mãi và cơ hội nghề nghiệp từ InterData.",
    alternates: {
      canonical: `https://interdata.vn${blogListingHref({ ...normalizeQuery(query), page: query.page ? normalizeQuery(query).page : undefined })}`,
    },
    openGraph: {
      title: "InterData Blog",
      url: "https://interdata.vn/blog/",
      locale: "vi_VN",
      type: "website",
    },
  };
}

async function FeedSection({
  section,
  categories,
}: {
  section: (typeof blogSections)[number];
  categories: BlogCategory[];
}) {
  const popular = section.id === "popular";
  const listing = await getBlogListing(categories, {
    category: section.category || undefined,
    popular,
    perPage: popular ? 4 : 3,
  });
  return (
    <section
      id={section.id}
      className={`${styles.feedSection} ${popular ? styles.popular : ""}`}
      aria-labelledby={`${section.id}-title`}
    >
      <div className={styles.container}>
        <SectionHeading
          id={`${section.id}-title`}
          eyebrow={section.label}
          title={section.title}
          description={section.description}
          href={blogListingHref({
            category: section.category || undefined,
            q: popular ? "hướng dẫn" : undefined,
            page: 1,
          })}
        />
        <PostGrid listing={listing} compact={popular} />
      </div>
    </section>
  );
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<Query>;
}) {
  const query = await searchParams;
  const { q, category, page } = normalizeQuery(query);
  const filtered = !!(q || category || query.page);
  const categories = await getBlogCategories().catch(
    () => [] as BlogCategory[],
  );
  const listing = await getBlogListing(categories, {
    q,
    category,
    page,
    perPage: filtered ? 12 : 9,
  });
  const selected = categories.find((item) => item.slug === category);
  return (
    <main id="main-content" className={styles.page}>
      <section
        className={`${styles.hero} ${filtered ? styles.heroCompact : ""}`}
        aria-labelledby="blog-title"
      >
        <div className={styles.heroPattern} aria-hidden="true" />
        <div className={styles.container}>
          <span className={styles.heroEyebrow}>
            <BookOpenText size={16} aria-hidden="true" /> INTERDATA BLOG
          </span>
          <h1 id="blog-title">
            Kiến thức vững vàng.
            <br />
            <span>Hạ tầng vươn xa.</span>
          </h1>
          <p>
            Khám phá công nghệ, làm chủ hạ tầng và phát triển cùng InterData.
          </p>
          <SearchForm q={q} category={category} />
          {!filtered && (
            <div className={styles.quickSearch}>
              <span>Khám phá nhanh:</span>
              {["VPS", "Cloud Server", "n8n", "Bảo mật"].map((term) => (
                <Link href={blogListingHref({ q: term })} key={term}>
                  {term}
                  <ArrowRight size={13} aria-hidden="true" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      <div className={styles.container}>
        <CategoryNav categories={categories} selected={category} q={q} />
      </div>
      {filtered ? (
        <section
          className={`${styles.container} ${styles.results}`}
          aria-labelledby="results-title"
        >
          <div className={styles.resultHeader}>
            <div>
              <span className={styles.eyebrow}>
                {q ? "KẾT QUẢ TÌM KIẾM" : "KHÁM PHÁ BÀI VIẾT"}
              </span>
              <h2 id="results-title">
                {q
                  ? `Kết quả cho “${q}”`
                  : selected?.name ||
                    (category ? "Chuyên mục không tồn tại" : "Tất cả bài viết")}
              </h2>
              <p>
                {listing.status === "ready"
                  ? `${listing.total.toLocaleString("vi-VN")} bài viết${selected && q ? ` trong ${selected.name}` : ""}`
                  : "Đang gặp gián đoạn kết nối với nguồn bài viết."}
              </p>
            </div>
            <Link href="/blog/" className={styles.sectionLink}>
              Về trang blog <ArrowRight size={18} />
            </Link>
          </div>
          <PostGrid listing={listing} />
          <Pagination
            page={page}
            pages={listing.pages}
            q={q}
            category={category}
          />
        </section>
      ) : (
        <>
          <div className={styles.container}>
            <FeaturedPosts posts={listing.posts} />
          </div>
          <section
            className={`${styles.container} ${styles.latest}`}
            aria-labelledby="latest-title"
          >
            <SectionHeading
              id="latest-title"
              eyebrow="CẬP NHẬT MỖI NGÀY"
              title="Bài viết mới nhất"
              description="Kiến thức và góc nhìn mới để bạn bắt kịp nhịp phát triển công nghệ."
              href="/blog/?page=1"
            />
            <PostGrid
              listing={{
                ...listing,
                posts:
                  listing.posts.length > 3
                    ? listing.posts.slice(3)
                    : listing.posts,
              }}
            />
          </section>
          {blogSections.map((section) => (
            <Suspense
              key={section.id}
              fallback={
                <div
                  className={`${styles.container} ${styles.skeleton}`}
                  role="status"
                >
                  Đang tải {section.title.toLowerCase()}…
                </div>
              }
            >
              <FeedSection section={section} categories={categories} />
            </Suspense>
          ))}
          <section className={`${styles.container} ${styles.blogCta}`}>
            <div>
              <span className={styles.eyebrow}>TỪ KIẾN THỨC ĐẾN THỰC TẾ</span>
              <h2>Sẵn sàng cho dự án tiếp theo?</h2>
              <p>
                Khám phá hạ tầng VPS và Cloud Server phù hợp với nhu cầu của
                bạn.
              </p>
            </div>
            <Link href="/thue-vps/">
              Khám phá VPS <ArrowRight size={20} />
            </Link>
          </section>
        </>
      )}
    </main>
  );
}
