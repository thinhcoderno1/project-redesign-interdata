import type { MetadataRoute } from "next";
import { siteIdentity } from "@/data/site-identity";
import { getBlogSitemapEntries, publicPagePaths } from "@/lib/seo-sitemap";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getBlogSitemapEntries();
  return [
    ...publicPagePaths.map((path) => ({
      url: `${siteIdentity.origin}${path}`,
    })),
    ...posts,
  ];
}
