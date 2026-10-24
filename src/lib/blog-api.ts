import "server-only";
import { cache } from "react";
import { htmlToText } from "./interdata-blog";
import type { BlogCategory, BlogPost, BlogListing } from "@/data/blog";

const API = "https://interdata.vn/blog/wp-json/wp/v2/";
const LIST_FIELDS =
  "id,slug,status,title,excerpt,date,date_gmt,modified_gmt,categories,_links,_embedded";
export class BlogApiError extends Error {}
type RecordValue = Record<string, unknown>;
const record = (value: unknown): value is RecordValue =>
  typeof value === "object" && value !== null && !Array.isArray(value);
function text(value: unknown) {
  return record(value) ? htmlToText(value.rendered) : "";
}
function excerpt(value: unknown) {
  const summary = text(value);
  return summary.length > 260
    ? `${summary.slice(0, 260).replace(/\s+\S*$/, "")}…`
    : summary;
}
function date(value: unknown) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T/.test(value))
    return "";
  const date = new Date(`${value.replace(/Z$/, "")}Z`);
  return Number.isFinite(date.getTime()) ? date.toISOString() : "";
}
function image(value: unknown) {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" &&
      url.hostname === "interdata.vn" &&
      !url.port &&
      !url.username &&
      !url.password &&
      url.pathname.startsWith("/blog/wp-content/uploads/") &&
      /\.(jpe?g|png|gif|webp|avif)$/i.test(url.pathname)
      ? url.href
      : null;
  } catch {
    return null;
  }
}
function authorProfile(value: unknown) {
  if (typeof value !== "string") return;
  try {
    const url = new URL(value);
    if (
      url.protocol === "https:" &&
      url.hostname === "interdata.vn" &&
      !url.port &&
      !url.username &&
      !url.password &&
      url.pathname.startsWith("/blog/author/")
    )
      return url.href;
  } catch {
    /* A missing or invalid CMS profile is omitted from schema. */
  }
}
export function normalizeBlogPost(
  value: unknown,
  categories: BlogCategory[],
): BlogPost | null {
  if (
    !record(value) ||
    !Number.isInteger(value.id) ||
    Number(value.id) <= 0 ||
    value.status !== "publish" ||
    typeof value.slug !== "string" ||
    !value.slug ||
    /[/?#\s]/.test(value.slug)
  )
    return null;
  const title = text(value.title),
    publishedAt = date(value.date_gmt);
  if (!title || !publishedAt) return null;
  const embedded = record(value._embedded) ? value._embedded : {};
  const media = Array.isArray(embedded["wp:featuredmedia"])
    ? embedded["wp:featuredmedia"][0]
    : null;
  const author = Array.isArray(embedded.author) ? embedded.author[0] : null;
  const details =
    record(media) && record(media.media_details) ? media.media_details : {};
  const sizes = record(details.sizes) ? details.sizes : {};
  const large = record(sizes.large) ? sizes.large.source_url : null;
  const categoryIds = Array.isArray(value.categories) ? value.categories : [];
  return {
    id: Number(value.id),
    slug: value.slug,
    title,
    href: `/blog/${encodeURIComponent(value.slug)}/`,
    excerpt: excerpt(value.excerpt),
    publishedAt,
    modifiedAt: date(value.modified_gmt) || publishedAt,
    image: image(large) || image(record(media) ? media.source_url : null),
    imageAlt: record(media) ? htmlToText(media.alt_text) : "",
    author: record(author) ? htmlToText(author.name) : "",
    ...(record(author) && authorProfile(author.link)
      ? { authorUrl: authorProfile(author.link) }
      : {}),
    categories: categories.filter((category) =>
      categoryIds.includes(category.id),
    ),
  };
}
export function categoryFamily(
  categories: BlogCategory[],
  slug: string,
): number[] {
  const root = categories.find((category) => category.slug === slug);
  if (!root) return [];
  const ids = new Set([root.id]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const category of categories)
      if (ids.has(category.parent) && !ids.has(category.id)) {
        ids.add(category.id);
        changed = true;
      }
  }
  return [...ids];
}
export function createBlogSource(fetcher: typeof fetch = fetch) {
  async function request(path: string, params: Record<string, string>) {
    let response: Response;
    try {
      response = await fetcher(`${API}${path}?${new URLSearchParams(params)}`, {
        headers: { Accept: "application/json" },
        next: { revalidate: 300, tags: ["interdata-blog"] },
        signal: AbortSignal.timeout(15000),
      });
    } catch {
      throw new BlogApiError("Không thể kết nối với nguồn bài viết.");
    }
    let data: unknown;
    try {
      data = await response.json();
    } catch {
      throw new BlogApiError("Nguồn bài viết trả về dữ liệu không hợp lệ.");
    }
    if (
      response.status === 400 &&
      record(data) &&
      data.code === "rest_post_invalid_page_number"
    )
      return { data: [], total: 0, pages: 0 };
    if (!response.ok || !Array.isArray(data))
      throw new BlogApiError("Chưa tải được dữ liệu từ blog InterData.");
    return {
      data,
      total: Number(response.headers.get("x-wp-total")) || data.length,
      pages:
        Number(response.headers.get("x-wp-totalpages")) ||
        (data.length ? 1 : 0),
    };
  }
  async function categories(): Promise<BlogCategory[]> {
    const first = await request("categories", {
      per_page: "100",
      hide_empty: "true",
      _fields: "id,slug,name,count,parent",
    });
    const rest = await Promise.all(
      Array.from(
        { length: Math.max(0, Math.min(first.pages, 20) - 1) },
        (_, index) =>
          request("categories", {
            per_page: "100",
            page: String(index + 2),
            hide_empty: "true",
            _fields: "id,slug,name,count,parent",
          }),
      ),
    );
    return [first, ...rest]
      .flatMap((page) => page.data)
      .flatMap((value) => {
        if (
          !record(value) ||
          !Number.isInteger(value.id) ||
          typeof value.slug !== "string" ||
          typeof value.name !== "string"
        )
          return [];
        return [
          {
            id: Number(value.id),
            slug: value.slug,
            name: htmlToText(value.name),
            count: Number(value.count) || 0,
            parent: Number(value.parent) || 0,
          },
        ];
      });
  }
  async function listing(
    categoryList: BlogCategory[],
    options: {
      q?: string;
      category?: string;
      page?: number;
      perPage?: number;
      popular?: boolean;
      exclude?: number[];
    } = {},
  ): Promise<BlogListing> {
    const params: Record<string, string> = {
      per_page: String(Math.min(24, Math.max(1, options.perPage || 12))),
      page: String(Math.max(1, options.page || 1)),
      status: "publish",
      order: "desc",
      orderby: options.popular
        ? "post_views"
        : options.q
          ? "relevance"
          : "date",
      _embed: "wp:featuredmedia,author",
      _fields: LIST_FIELDS,
    };
    if (options.q || options.popular) params.search = options.q || "hướng dẫn";
    if (options.category) {
      const ids = categoryFamily(categoryList, options.category);
      if (!ids.length)
        return { posts: [], total: 0, pages: 0, status: "ready" };
      params.categories = ids.join(",");
    }
    if (options.exclude?.length) params.exclude = options.exclude.join(",");
    if (options.popular)
      params.categories_exclude = ["su-kien", "khuyen-mai", "tuyen-dung"]
        .flatMap((slug) => categoryFamily(categoryList, slug))
        .join(",");
    try {
      const result = await request("posts", params);
      const seen = new Set<number>();
      const posts = result.data.flatMap((value) => {
        const post = normalizeBlogPost(value, categoryList);
        if (!post || seen.has(post.id)) return [];
        seen.add(post.id);
        return [post];
      });
      return {
        posts,
        total: result.total,
        pages: result.pages,
        status: "ready",
      };
    } catch {
      return { posts: [], total: 0, pages: 0, status: "unavailable" };
    }
  }
  async function post(slug: string, categoryList: BlogCategory[]) {
    const result = await request("posts", {
      slug,
      status: "publish",
      per_page: "1",
      _embed: "wp:featuredmedia,author",
      _fields: `${LIST_FIELDS},content`,
    });
    const value = result.data[0];
    const post = normalizeBlogPost(value, categoryList);
    if (
      !post ||
      post.slug !== slug ||
      !record(value) ||
      !record(value.content) ||
      typeof value.content.rendered !== "string" ||
      value.content.protected
    )
      return null;
    return { ...post, content: value.content.rendered };
  }
  return { categories, listing, post };
}
const source = createBlogSource();
export const getBlogCategories = cache(source.categories);
export const getBlogPost = cache(async (slug: string) =>
  source.post(slug, await getBlogCategories()),
);
export const getBlogListing = source.listing;
