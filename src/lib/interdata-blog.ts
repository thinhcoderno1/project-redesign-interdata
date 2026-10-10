import "server-only";
import { decodeHTML } from "entities";
import {
  resourceTopics,
  type ResourceArticle,
  type ResourceFeed,
  type ResourceTopic,
} from "../data/resource-topics";

const API = "https://interdata.vn/blog/wp-json/wp/v2/";
export const BLOG_REVALIDATE_SECONDS = 300;
const POST_LIMIT = 4;
const TIMEOUT_MS = 8000;
type Category = { id: number; slug: string; name: string; parent: number };
type Fetcher = typeof fetch;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function htmlToText(value: unknown): string {
  if (typeof value !== "string") return "";
  return decodeHTML(
    value
      .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, " ")
      .replace(/<[^>]*>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

function renderedText(value: unknown): string {
  return isRecord(value) ? htmlToText(value.rendered) : "";
}

function blogUrl(value: unknown, image = false): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      url.hostname !== "interdata.vn" ||
      url.port ||
      url.username ||
      url.password ||
      !url.pathname.startsWith(image ? "/blog/wp-content/uploads/" : "/blog/")
    )
      return null;
    if (image && !/\.(avif|gif|jpe?g|png|webp)$/i.test(url.pathname))
      return null;
    return url.href;
  } catch {
    return null;
  }
}

function featuredImage(post: Record<string, unknown>): string | null {
  const embedded = post._embedded;
  if (!isRecord(embedded)) return null;
  const media = embedded["wp:featuredmedia"];
  if (!Array.isArray(media) || !isRecord(media[0])) return null;
  const details = media[0].media_details;
  const sizes =
    isRecord(details) && isRecord(details.sizes) ? details.sizes : {};
  for (const key of ["large", "medium_large", "full"]) {
    const size = sizes[key];
    const url = isRecord(size) ? blogUrl(size.source_url, true) : null;
    if (url) return url;
  }
  return blogUrl(media[0].source_url, true);
}

function normalizeArticle(
  value: unknown,
  categories: Category[],
  topic: ResourceTopic,
): ResourceArticle | null {
  if (!isRecord(value) || !Number.isInteger(value.id) || Number(value.id) <= 0)
    return null;
  if (value.status !== "publish") return null;
  const title = renderedText(value.title);
  const href = blogUrl(value.link);
  const gmt = typeof value.date_gmt === "string" ? value.date_gmt : "";
  const local = typeof value.date === "string" ? value.date : "";
  const date = new Date(gmt ? `${gmt.replace(/Z$/, "")}Z` : `${local}+07:00`);
  if (!title || !href || !Number.isFinite(date.getTime())) return null;
  const ids = Array.isArray(value.categories) ? value.categories : [];
  const category = categories.find((item) => ids.includes(item.id));
  const excerpt = renderedText(value.excerpt);
  return {
    id: Number(value.id),
    title,
    excerpt:
      excerpt.length > 220 ? `${excerpt.slice(0, 217).trimEnd()}…` : excerpt,
    href,
    image: featuredImage(value),
    category: category?.name || topic.label,
    publishedAt: date.toISOString(),
    dateLabel: new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "Asia/Ho_Chi_Minh",
    }).format(date),
  };
}

async function request(path: string, fetcher: Fetcher) {
  const response = await fetcher(`${API}${path}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: BLOG_REVALIDATE_SECONDS, tags: ["interdata-blog"] },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`Blog API returned ${response.status}`);
  const data: unknown = await response.json();
  if (!Array.isArray(data))
    throw new Error("Blog API returned an invalid list");
  return { data, response };
}

async function getCategories(fetcher: Fetcher): Promise<Category[]> {
  const first = await request(
    "categories?per_page=100&_fields=id,slug,name,parent",
    fetcher,
  );
  const pages = Number(first.response.headers.get("x-wp-totalpages") || "1");
  const remaining = await Promise.all(
    Array.from({ length: Math.max(0, pages - 1) }, (_, i) =>
      request(
        `categories?per_page=100&page=${i + 2}&_fields=id,slug,name,parent`,
        fetcher,
      ),
    ),
  );
  return [...first.data, ...remaining.flatMap((page) => page.data)].flatMap(
    (value) => {
      if (
        !isRecord(value) ||
        typeof value.id !== "number" ||
        typeof value.slug !== "string"
      )
        return [];
      return [
        {
          id: value.id,
          slug: value.slug,
          name: htmlToText(value.name),
          parent: typeof value.parent === "number" ? value.parent : 0,
        },
      ];
    },
  );
}

function familyIds(categories: Category[], slug: string): number[] {
  const root = categories.find((category) => category.slug === slug);
  if (!root) return [];
  const ids = new Set([root.id]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const category of categories) {
      if (ids.has(category.parent) && !ids.has(category.id)) {
        ids.add(category.id);
        changed = true;
      }
    }
  }
  return [...ids];
}

export async function getResourceFeeds(
  fetcher: Fetcher = fetch,
): Promise<ResourceFeed[]> {
  const unavailable = (topic: ResourceTopic): ResourceFeed => ({
    topic,
    articles: [],
    status: "unavailable",
  });
  let categories: Category[];
  try {
    categories = await getCategories(fetcher);
  } catch (error) {
    console.error("[interdata-blog] Categories unavailable:", error);
    return resourceTopics.map(unavailable);
  }
  const exclusions = resourceTopics
    .filter((topic) => topic.slug !== null)
    .map((topic) => familyIds(categories, topic.slug!));
  return Promise.all(
    resourceTopics.map(async (topic): Promise<ResourceFeed> => {
      const ids = topic.slug
        ? familyIds(categories, topic.slug)
        : exclusions.flat();
      if (
        !ids.length ||
        (topic.slug === null && exclusions.some((family) => !family.length))
      )
        return unavailable(topic);
      const query = new URLSearchParams({
        per_page: String(POST_LIMIT),
        orderby: "date",
        order: "desc",
        status: "publish",
        _embed: "wp:featuredmedia",
        _fields:
          "id,status,date,date_gmt,link,title,excerpt,categories,_links,_embedded",
        [topic.slug ? "categories" : "categories_exclude"]: ids.join(","),
      });
      try {
        const { data } = await request(`posts?${query}`, fetcher);
        const seen = new Set<number>();
        const articles = data
          .flatMap((value) => {
            if (!isRecord(value) || !Array.isArray(value.categories)) return [];
            const matches = value.categories.some((id) =>
              ids.includes(Number(id)),
            );
            if (topic.slug ? !matches : matches) return [];
            const article = normalizeArticle(value, categories, topic);
            if (!article || seen.has(article.id)) return [];
            seen.add(article.id);
            return [article];
          })
          .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
          .slice(0, POST_LIMIT);
        return { topic, articles, status: "ready" };
      } catch (error) {
        console.error(`[interdata-blog] ${topic.id} unavailable:`, error);
        return unavailable(topic);
      }
    }),
  );
}
