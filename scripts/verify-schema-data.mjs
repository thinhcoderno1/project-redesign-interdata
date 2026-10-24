import assert from "node:assert/strict";
import { loadProjectModule } from "./load-project-typescript.mjs";
import { schemaNodes } from "./schema-helpers.mjs";

const {
  buildSiteSchema,
  buildPageSchema,
  buildBlogPostSchema,
  buildBlogListingSchema,
  serializeSchema,
  schemaIds,
} = loadProjectModule("src/lib/structured-data.ts");
const { schemaServices, pageProfile } = loadProjectModule(
  "src/data/schema-pages.ts",
);
const { createBlogSource, normalizeBlogPost } = loadProjectModule(
  "src/lib/blog-api.ts",
);
const site = schemaNodes([buildSiteSchema()]);
assert.equal(
  site.find((node) => node["@type"] === "Organization").taxID,
  "0316918910",
);
assert.equal(
  site.find((node) => node["@type"] === "Organization").sameAs.length,
  5,
);
assert.equal(
  site.find((node) => node["@type"] === "WebSite").publisher["@id"],
  schemaIds.organization,
);

for (const service of schemaServices) {
  const profile = pageProfile(service.href);
  const graph = buildPageSchema({
    path: service.href,
    metadata: { title: service.name, description: service.description },
    profile,
  });
  const nodes = schemaNodes([graph]);
  assert.equal(nodes.filter((node) => node["@type"] === "Service").length, 1);
  assert.equal(
    nodes.find((node) => node["@type"] === "Service").provider["@id"],
    schemaIds.organization,
  );
  const faq = nodes.find((node) => node["@type"] === "FAQPage");
  assert.equal(faq.mainEntity.length, profile.faqs.length);
  assert.deepEqual(
    faq.mainEntity.map((item) => item.acceptedAnswer.text),
    profile.faqs.map((item) => item.answer),
  );
  const ids = nodes.map((node) => node["@id"]);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(
    !/"(?:aggregateRating|offers|review)"/.test(serializeSchema(graph)),
  );
}
const categories = [
  { id: 7, name: "Hướng dẫn VPS", slug: "huong-dan-vps", parent: 0, count: 1 },
];
let cmsPost = {
  id: 987654,
  slug: "bai-moi-tu-cms-khong-can-cau-hinh",
  status: "publish",
  title: { rendered: "Hướng dẫn VPS &amp; Cloud" },
  excerpt: { rendered: "<p>Thông tin từ CMS</p>" },
  date_gmt: "2026-10-24T01:30:00",
  modified_gmt: "2026-10-24T02:00:00",
  categories: [7],
  content: { rendered: "<h2>Nội dung bài mới</h2>" },
  _embedded: {
    author: [
      {
        name: "Tác giả CMS",
        link: "https://interdata.vn/blog/author/tac-gia-cms/",
      },
    ],
    "wp:featuredmedia": [
      {
        source_url:
          "https://interdata.vn/blog/wp-content/uploads/2026/10/post.webp",
        alt_text: "Ảnh bài viết",
      },
    ],
  },
};
const requests = [];
const source = createBlogSource(async (url, options) => {
  requests.push({ url: new URL(url), options });
  return Response.json([cmsPost]);
});
let post = await source.post(cmsPost.slug, categories);
assert.equal(post.slug, cmsPost.slug);
assert.equal(requests.at(-1).url.searchParams.get("slug"), cmsPost.slug);
assert.equal(requests.at(-1).options.next.revalidate, 300);
let article = schemaNodes([buildBlogPostSchema(post, 4)]).find(
  (node) => node["@type"] === "BlogPosting",
);
assert.equal(article.headline, "Hướng dẫn VPS & Cloud");
assert.equal(article.url, `https://interdata.vn/blog/${cmsPost.slug}/`);
assert.equal(article.datePublished, "2026-10-24T01:30:00.000Z");
assert.equal(article.dateModified, "2026-10-24T02:00:00.000Z");
assert.equal(article.author.name, "Tác giả CMS");
assert.equal(article.author.url, cmsPost._embedded.author[0].link);
assert.deepEqual(article.image, [
  cmsPost._embedded["wp:featuredmedia"][0].source_url,
]);
assert.equal(article.publisher["@id"], schemaIds.organization);
assert.equal(article.timeRequired, "PT4M");
cmsPost = {
  ...cmsPost,
  title: { rendered: "Nội dung đã cập nhật" },
  modified_gmt: "2026-10-24T03:00:00",
};
post = await source.post(cmsPost.slug, categories);
article = schemaNodes([buildBlogPostSchema(post, 5)]).find(
  (node) => node["@type"] === "BlogPosting",
);
assert.equal(article.headline, "Nội dung đã cập nhật");
assert.equal(article.dateModified, "2026-10-24T03:00:00.000Z");
const bare = normalizeBlogPost({ ...cmsPost, _embedded: {} }, []);
const bareArticle = schemaNodes([buildBlogPostSchema(bare, 0)]).find(
  (node) => node["@type"] === "BlogPosting",
);
assert.ok(!("author" in bareArticle));
assert.ok(!("image" in bareArticle));
assert.ok(!("articleSection" in bareArticle));
assert.equal(
  normalizeBlogPost({ ...cmsPost, status: "draft" }, categories),
  null,
);
assert.equal(
  normalizeBlogPost({ ...cmsPost, date_gmt: "invalid" }, categories),
  null,
);
assert.equal(
  normalizeBlogPost(
    {
      ...cmsPost,
      _embedded: { author: [{ name: "CMS", link: "javascript:alert(1)" }] },
    },
    categories,
  ).authorUrl,
  undefined,
);
assert.equal(
  schemaNodes([buildBlogPostSchema({ ...bare, author: "InterData" }, 1)]).find(
    (node) => node["@type"] === "BlogPosting",
  ).author["@id"],
  schemaIds.organization,
);
const hostile = {
  headline: '</script><script>alert("cms")</script>',
  extra: "\u2028\u2029",
};
assert.ok(!serializeSchema(hostile).includes("</script>"));
assert.deepEqual(JSON.parse(serializeSchema(hostile)), hostile);
const listing = buildBlogListingSchema({
  path: "/blog/?category=huong-dan-vps&page=2",
  title: "Hướng dẫn VPS",
  description: "Bài viết",
  posts: [post],
});
assert.equal(
  schemaNodes([listing]).find((node) => node["@type"] === "ItemList")
    .itemListElement[0].url,
  article.url,
);
assert.equal(
  schemaNodes([listing])[0].url,
  "https://interdata.vn/blog/?category=huong-dan-vps&page=2",
);
assert.equal(
  schemaNodes([
    buildBlogListingSchema({
      path: "/blog/?q=VPS",
      title: "VPS",
      description: "",
      posts: [],
      search: true,
    }),
  ])[0]["@type"],
  "SearchResultsPage",
);
console.log(
  `PASS: ${schemaServices.length} service/FAQ graphs; CMS new posts, updates, UTC dates, authors/images, omissions, canonical queries and script escaping.`,
);
