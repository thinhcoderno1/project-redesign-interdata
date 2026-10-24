import type { BlogCategory } from "@/data/blog";

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
      url.hostname !== "interdata.vn" ||
      !/^https?:$/.test(url.protocol) ||
      url.username ||
      url.password ||
      url.port
    )
      return value;
    if (!url.pathname.startsWith("/blog/")) return value;
    if (
      url.pathname.startsWith("/blog/wp-") ||
      /\.[a-z\d]+$/i.test(url.pathname)
    )
      return value;
    const segments = url.pathname.split("/").filter(Boolean);
    const category = categories.find(
      (item) => item.slug === segments[1] && segments.length === 2,
    );
    return category
      ? `${blogListingHref({ category: category.slug })}${url.hash}`
      : `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return value;
  }
}
