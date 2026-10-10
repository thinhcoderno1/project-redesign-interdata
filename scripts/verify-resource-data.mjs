import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import ts from "typescript";

// Execute the actual TypeScript data loader without starting a Next.js server.
const require = createRequire(import.meta.url);
const modules = new Map();
function load(file) {
  file = path.resolve(file);
  if (modules.has(file)) return modules.get(file);
  const compiledModule = { exports: {} };
  const source = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText;
  const localRequire = (id) => {
    if (id === "server-only") return {};
    if (id.endsWith(".module.css"))
      return { default: new Proxy({}, { get: (_, key) => String(key) }) };
    if (id.startsWith("."))
      return load(path.resolve(path.dirname(file), `${id}.ts`));
    return require(id);
  };
  vm.runInThisContext(`(function(require,module,exports){${source}\n})`, {
    filename: file,
  })(localRequire, compiledModule, compiledModule.exports);
  modules.set(file, compiledModule.exports);
  return compiledModule.exports;
}
const { getResourceFeeds, htmlToText } = load("src/lib/interdata-blog.ts");
const categories = [
  { id: 701, slug: "su-kien", name: "Tin Tức - Sự kiện", parent: 0 },
  { id: 702, slug: "khuyen-mai", name: "Khuyến Mãi", parent: 0 },
  { id: 703, slug: "tuyen-dung", name: "Tuyển dụng", parent: 0 },
  { id: 704, slug: "kien-thuc", name: "Kiến thức &amp; Hướng dẫn", parent: 0 },
  { id: 705, slug: "su-kien-con", name: "Sự kiện con", parent: 701 },
];
function post(id, category, overrides = {}) {
  return {
    id,
    status: "publish",
    categories: [category],
    date_gmt: "2026-10-09T18:30:00",
    date: "2026-10-10T01:30:00",
    title: { rendered: `Bài ${id} &#038; “InterData”` },
    excerpt: {
      rendered: "<p>Hướng dẫn <strong>triển khai</strong> &amp; quản trị.</p>",
    },
    link: `https://interdata.vn/blog/bai-${id}/`,
    _embedded: {
      "wp:featuredmedia": [
        {
          source_url:
            "https://interdata.vn/blog/wp-content/uploads/2026/10/test.jpg",
        },
      ],
    },
    ...overrides,
  };
}
const requests = [];
function mockFetch({
  fail = "",
  omitCategory = false,
  paginate = false,
  empty = false,
  invalid = false,
} = {}) {
  return async (url, options) => {
    const query = new URL(url);
    requests.push({ query, options });
    if (query.pathname.endsWith("/categories")) {
      if (fail === "categories") throw new Error("Network unavailable");
      const data = omitCategory
        ? categories.filter((c) => c.id !== 703)
        : categories;
      if (paginate)
        return Response.json(
          query.searchParams.has("page") ? data.slice(3) : data.slice(0, 3),
          {
            headers: { "X-WP-TotalPages": "2" },
          },
        );
      return Response.json(data);
    }
    const included = query.searchParams.get("categories");
    const category = included ? Number(included.split(",")[0]) : 704;
    if (fail === "promotion" && category === 702)
      return new Response("Unavailable", { status: 503 });
    if (fail === "invalid") return Response.json({ code: "not_a_list" });
    if (empty) return Response.json([]);
    if (!invalid) return Response.json([post(category, category)]);
    return Response.json([
      post(1, category, { date_gmt: "2026-10-08T10:00:00" }),
      post(2, category),
      post(2, category),
      post(3, category, { status: "draft" }),
      post(4, category, { link: "javascript:alert(1)" }),
      post(5, category, { date_gmt: "invalid" }),
      post(6, category, { title: { rendered: "<script>alert(1)</script>" } }),
      post(7, category, {
        _embedded: {
          "wp:featuredmedia": [{ source_url: "https://example.com/image.jpg" }],
        },
      }),
      post(8, included ? 704 : 701),
    ]);
  };
}

assert.equal(
  htmlToText(
    "<p>A&nbsp;&amp;&nbsp;B &#8211; &#x1F680;</p><script>alert(1)</script><style>x</style>",
  ),
  "A & B – 🚀",
);
assert.equal(htmlToText(null), "");
const feeds = await getResourceFeeds(mockFetch({ paginate: true }));
assert.deepEqual(
  feeds.map((f) => f.topic.id),
  ["news", "blog", "promotion", "careers"],
);
assert.ok(feeds.every((f) => f.status === "ready" && f.articles.length === 1));
assert.equal(feeds[1].articles[0].category, "Kiến thức & Hướng dẫn");
assert.equal(feeds[0].articles[0].dateLabel, "10/10/2026");
assert.equal(feeds[0].articles[0].publishedAt, "2026-10-09T18:30:00.000Z");
assert.equal(feeds[0].articles[0].title, "Bài 701 & “InterData”");
assert.equal(feeds[0].articles[0].excerpt, "Hướng dẫn triển khai & quản trị.");
const postRequests = requests.filter((r) =>
  r.query.pathname.endsWith("/posts"),
);
assert.equal(postRequests.length, 4);
assert.equal(postRequests[0].query.searchParams.get("categories"), "701,705");
assert.equal(
  postRequests[1].query.searchParams.get("categories_exclude"),
  "701,705,702,703",
);
for (const { query, options } of postRequests) {
  assert.equal(query.searchParams.get("order"), "desc");
  assert.equal(query.searchParams.get("orderby"), "date");
  assert.equal(query.searchParams.get("per_page"), "4");
  assert.equal(query.searchParams.get("status"), "publish");
  assert.equal(options.next.revalidate, 300);
  assert.ok(options.signal instanceof AbortSignal);
}
const malformed = await getResourceFeeds(mockFetch({ invalid: true }));
assert.ok(malformed.every((f) => f.articles.length === 3));
assert.deepEqual(
  malformed[0].articles.map((a) => a.id),
  [2, 7, 1],
);
assert.equal(malformed[0].articles[1].image, null);
const emptyFeeds = await getResourceFeeds(mockFetch({ empty: true }));
assert.ok(
  emptyFeeds.every((f) => f.status === "ready" && f.articles.length === 0),
);

const originalError = console.error;
console.error = () => {};
try {
  const partial = await getResourceFeeds(mockFetch({ fail: "promotion" }));
  assert.deepEqual(
    partial.map((f) => f.status),
    ["ready", "ready", "unavailable", "ready"],
  );
  const offline = await getResourceFeeds(mockFetch({ fail: "categories" }));
  assert.ok(
    offline.every((f) => f.status === "unavailable" && f.articles.length === 0),
  );
  const { ResourceTabs } = load("src/components/home/resource-tabs.tsx");
  const React = require("react");
  const { renderToStaticMarkup } = require("react-dom/server");
  const unavailableHtml = renderToStaticMarkup(
    React.createElement(ResourceTabs, { feeds: offline }),
  );
  assert.equal(
    (unavailableHtml.match(/Chưa tải được bài viết/g) || []).length,
    4,
  );
  assert.ok(!unavailableHtml.includes("data-post-id"));
  const emptyHtml = renderToStaticMarkup(
    React.createElement(ResourceTabs, { feeds: emptyFeeds }),
  );
  assert.equal(
    (emptyHtml.match(/Chuyên mục chưa có bài viết mới/g) || []).length,
    4,
  );
  assert.ok(!emptyHtml.includes("data-post-id"));
  const missingImage = feeds.map((feed) => ({
    ...feed,
    articles: feed.articles.map((article) => ({ ...article, image: null })),
  }));
  const noImagesHtml = renderToStaticMarkup(
    React.createElement(ResourceTabs, { feeds: missingImage }),
  );
  assert.equal((noImagesHtml.match(/class="imageFallback"/g) || []).length, 4);
  const invalid = await getResourceFeeds(mockFetch({ fail: "invalid" }));
  assert.ok(invalid.every((f) => f.status === "unavailable"));
  const missing = await getResourceFeeds(mockFetch({ omitCategory: true }));
  assert.deepEqual(
    missing.map((f) => f.status),
    ["ready", "unavailable", "ready", "unavailable"],
  );
} finally {
  console.error = originalError;
}
console.log(
  "Resource data checks passed: live-category discovery, child categories, filtering, newest-first ordering, HTML entities, dates, unsafe data, cache options and isolated failures.",
);
