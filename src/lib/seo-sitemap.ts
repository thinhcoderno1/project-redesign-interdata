import "server-only";
import type { MetadataRoute } from "next";
import { services, solutions } from "../data/content";
import { cloudCatalog, vpsCatalog } from "../data/service-catalog";
import { legalDocuments } from "../data/legal-documents";
import { siteIdentity } from "../data/site-identity";
import { BLOG_API_URL } from "./blog-source";

export const publicPagePaths = [
  ...new Set([
    "/",
    "/gioi-thieu/",
    "/lien-he/",
    "/blog/",
    "/canhme/",
    "/blackfriday/",
    "/chinh-sach-bao-mat/",
    ...services.map((service) => service.href),
    ...solutions.map((solution) => solution.href),
    ...vpsCatalog.map((service) => service.href),
    ...cloudCatalog.map((service) => service.href),
    ...legalDocuments.map((document) => `/${document.slug}/`),
  ]),
];

type SitemapPost = {
  id: number;
  slug: string;
  status: string;
  date_gmt?: string;
  modified_gmt?: string;
  content?: { protected?: boolean };
};

export async function getBlogSitemapEntries(
  fetcher: typeof fetch = fetch,
): Promise<MetadataRoute.Sitemap> {
  const query = new URLSearchParams({
    per_page: "100",
    status: "publish",
    orderby: "id",
    order: "asc",
    _fields: "id,slug,status,date_gmt,modified_gmt,content.protected",
  });
  const request = async (page: number) => {
    const params = new URLSearchParams(query);
    params.set("page", String(page));
    const response = await fetcher(`${BLOG_API_URL}posts?${params}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600, tags: ["interdata-blog"] },
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error(`Blog sitemap API: ${response.status}`);
    const data: unknown = await response.json();
    if (!Array.isArray(data)) throw new Error("Invalid blog sitemap response");
    return {
      posts: data as SitemapPost[],
      pages: Number(response.headers.get("x-wp-totalpages")) || 1,
    };
  };

  const first = await request(1);
  if (
    !Number.isSafeInteger(first.pages) ||
    first.pages < 1 ||
    first.pages > 499
  )
    throw new Error("Blog sitemap requires splitting into smaller sitemaps");
  const posts = [...first.posts];
  // Limit concurrency so sitemap refreshes do not overload WordPress.
  for (let page = 2; page <= first.pages; page += 4) {
    const batch = await Promise.all(
      Array.from({ length: Math.min(4, first.pages - page + 1) }, (_, index) =>
        request(page + index),
      ),
    );
    posts.push(...batch.flatMap((result) => result.posts));
  }
  const seen = new Set<string>();
  return posts.flatMap((post) => {
    if (
      !post ||
      !Number.isInteger(post.id) ||
      post.id <= 0 ||
      post.status !== "publish" ||
      typeof post.slug !== "string" ||
      !post.slug ||
      /[/?#\s]/.test(post.slug) ||
      /^\.{1,2}$/.test(post.slug) ||
      post.content?.protected
    )
      return [];
    const url = `${siteIdentity.origin}/blog/${encodeURIComponent(post.slug)}/`;
    if (seen.has(url)) return [];
    seen.add(url);
    const modified = post.modified_gmt || post.date_gmt;
    const date =
      typeof modified === "string" && /^\d{4}-\d{2}-\d{2}T/.test(modified)
        ? new Date(`${modified.replace(/Z$/, "")}Z`)
        : null;
    return [
      {
        url,
        ...(date && Number.isFinite(date.getTime())
          ? { lastModified: date }
          : {}),
      },
    ];
  });
}
