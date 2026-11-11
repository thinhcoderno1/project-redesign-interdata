export const BLOG_CMS_ORIGIN = "https://admin.interdata.vn";
export const BLOG_API_URL = `${BLOG_CMS_ORIGIN}/wp-json/wp/v2/`;

export function blogImageUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    const uploads =
      url.origin === BLOG_CMS_ORIGIN
        ? "/wp-content/uploads/"
        : url.origin === "https://interdata.vn"
          ? "/blog/wp-content/uploads/"
          : null;
    return uploads &&
      !url.username &&
      !url.password &&
      !url.port &&
      url.pathname.startsWith(uploads) &&
      /\.(jpe?g|png|gif|webp|avif)$/i.test(url.pathname)
      ? url.href
      : null;
  } catch {
    return null;
  }
}
