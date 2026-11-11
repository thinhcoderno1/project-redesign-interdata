import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { loadProjectModule } from "./load-project-typescript.mjs";

const { publicPagePaths, getBlogSitemapEntries } = loadProjectModule(
  "src/lib/seo-sitemap.ts",
);
const { default: robots } = loadProjectModule("src/app/robots.ts");
const { metadata: rootMetadata } = loadProjectModule("src/app/layout.tsx");
const { metadata: reviewMetadata } = loadProjectModule(
  "src/app/content-review/page.tsx",
);

async function routes(directory, segments = []) {
  const found = [];
  for (const file of await fs.readdir(directory, { withFileTypes: true })) {
    if (file.isDirectory() && !file.name.startsWith("[")) {
      found.push(
        ...(await routes(
          path.join(directory, file.name),
          file.name.startsWith("(") ? segments : [...segments, file.name],
        )),
      );
    } else if (file.name === "page.tsx") {
      found.push(`/${segments.join("/")}${segments.length ? "/" : ""}`);
    }
  }
  return found;
}
assert.deepEqual(
  [...publicPagePaths].sort(),
  (await routes("src/app/(website)")).sort(),
);
assert.equal(rootMetadata.robots.index, true);
assert.equal(rootMetadata.robots.follow, true);
assert.equal(rootMetadata.robots.googleBot["max-image-preview"], "large");
assert.equal(reviewMetadata.robots.index, false);
assert.deepEqual(robots(), {
  rules: { userAgent: "*", allow: "/" },
  sitemap: "https://interdata.vn/sitemap.xml",
});

const requests = [];
const post = (id, overrides = {}) => ({
  id,
  slug: `post-${id}`,
  status: "publish",
  date_gmt: "2026-10-10T01:00:00",
  modified_gmt: "2026-11-11T02:00:00",
  content: { protected: false },
  ...overrides,
});
const result = await getBlogSitemapEntries(async (input, options) => {
  const url = new URL(input);
  requests.push({ url, options });
  const page = Number(url.searchParams.get("page"));
  return Response.json(
    page === 1
      ? [
          post(1),
          post(2, { status: "draft" }),
          post(3, { content: { protected: true } }),
          post(4, { slug: "../bad" }),
          post(5, { slug: ".." }),
          null,
        ]
      : page === 2
        ? [post(1), post(6)]
        : [post(7, { modified_gmt: 123 })],
    { headers: { "x-wp-totalpages": "3" } },
  );
});
assert.equal(result.length, 3);
assert.deepEqual(
  result.map((entry) => entry.url),
  [
    "https://interdata.vn/blog/post-1/",
    "https://interdata.vn/blog/post-6/",
    "https://interdata.vn/blog/post-7/",
  ],
);
assert.equal(result[0].lastModified.toISOString(), "2026-11-11T02:00:00.000Z");
assert.ok(
  !("lastModified" in result[2]),
  "Malformed modification times are omitted",
);
assert.deepEqual(
  requests.map((request) => request.url.searchParams.get("page")),
  ["1", "2", "3"],
);
for (const { url, options } of requests) {
  assert.equal(url.origin, "https://admin.interdata.vn");
  assert.equal(url.pathname, "/wp-json/wp/v2/posts");
  assert.equal(url.searchParams.get("status"), "publish");
  assert.equal(url.searchParams.get("per_page"), "100");
  assert.match(url.searchParams.get("_fields"), /content.protected/);
  assert.equal(options.next.revalidate, 3600);
}
await assert.rejects(
  getBlogSitemapEntries(async () => Response.json({ error: true })),
  /Invalid/,
);
await assert.rejects(
  getBlogSitemapEntries(async () => new Response("offline", { status: 503 })),
  /503/,
);
await assert.rejects(
  getBlogSitemapEntries(async () =>
    Response.json([], { headers: { "x-wp-totalpages": "500" } }),
  ),
  /splitting/,
);
console.log(
  `SEO data: ${publicPagePaths.length} public routes, open robots, private review, paginated CMS posts, drafts/protected posts, deduplication, accurate lastmod and failure handling passed.`,
);
