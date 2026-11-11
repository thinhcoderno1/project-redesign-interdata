import type { BlogCategory } from "@/data/blog";
import { BLOG_CMS_ORIGIN } from "./blog-source";

export function blogListingHref({
  q = "",
  category = "",
  page,
}: { q?: string; category?: string; page?: number } = {}) {
  const query = new URLSearchParams();
  if (q) query.set("q", q);
  if (category) query.set("category", category);
  if (page !== undefined) query.set("page", String(page));
  return `/blog/${query.size ? `?${query}` : ""}`;
}

export function localBlogHref(value: string, categories: BlogCategory[] = []) {
  try {
    const url = new URL(value, "https://interdata.vn/blog/");
    if (
      (url.hostname !== "interdata.vn" && url.origin !== BLOG_CMS_ORIGIN) ||
      !/^https?:$/.test(url.protocol) ||
      url.username ||
      url.password ||
      url.port
    )
      return value;
    const cms = url.origin === BLOG_CMS_ORIGIN;
    if (!cms && !url.pathname.startsWith("/blog/")) return value;
    const pathname = cms ? `/blog${url.pathname}` : url.pathname;
    const path = pathname.slice("/blog".length);
    if (
      /^\/(?:wp-admin|wp-json|wp-content|wp-includes)(?:\/|$)/.test(path) ||
      /^\/(?:author|tag|feed)(?:\/|$)/.test(path) ||
      /\.[a-z\d]+$/i.test(path)
    )
      return value;
    const segments = path.split("/").filter(Boolean);
    const category = categories.find(
      (item) =>
        (segments.length === 1 && item.slug === segments[0]) ||
        (segments[0] === "category" && item.slug === segments.at(-1)),
    );
    if (cms && segments.length > 1 && !category) return value;
    return category
      ? `${blogListingHref({ category: category.slug })}${url.hash}`
      : `${pathname}${url.search}${url.hash}`;
  } catch {
    return value;
  }
}
