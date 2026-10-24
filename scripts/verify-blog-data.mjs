import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import ts from "typescript";

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
      esModuleInterop: true,
    },
  }).outputText;
  const localRequire = (id) =>
    id === "server-only"
      ? {}
      : id.startsWith(".")
        ? load(path.resolve(path.dirname(file), `${id}.ts`))
        : require(id);
  vm.runInThisContext(`(function(require,module,exports){${source}\n})`, {
    filename: file,
  })(localRequire, compiledModule, compiledModule.exports);
  modules.set(file, compiledModule.exports);
  return compiledModule.exports;
}
const { createBlogSource, categoryFamily, normalizeBlogPost, BlogApiError } =
  load("src/lib/blog-api.ts");
const { prepareBlogContent } = load("src/lib/blog-content.ts");
const { frameBlogContent } = load("src/lib/blog-frame.ts");
const { htmlToText } = load("src/lib/interdata-blog.ts");
const { localBlogHref } = load("src/lib/blog-links.ts");
const categories = [
  { id: 1, slug: "vps", name: "VPS", count: 5, parent: 0 },
  { id: 2, slug: "linux", name: "Linux", count: 2, parent: 1 },
  { id: 3, slug: "su-kien", name: "Tin tức", count: 3, parent: 0 },
  { id: 4, slug: "khuyen-mai", name: "Khuyến mãi", count: 1, parent: 0 },
  { id: 5, slug: "tuyen-dung", name: "Tuyển dụng", count: 2, parent: 0 },
];
const post = {
  id: 10,
  slug: "huong-dan-vps",
  status: "publish",
  title: { rendered: "VPS &amp; Cloud" },
  excerpt: { rendered: "<p>Nội dung</p>" },
  date_gmt: "2026-10-22T01:00:00",
  categories: [2],
  content: { rendered: "<h2>Hướng dẫn</h2>" },
};
assert.deepEqual(categoryFamily(categories, "vps"), [1, 2]);
assert.equal(normalizeBlogPost(post, categories).href, "/blog/huong-dan-vps/");
for (const override of [
  { status: "draft" },
  { slug: "../bad" },
  { id: -1 },
  { date_gmt: "invalid" },
])
  assert.equal(normalizeBlogPost({ ...post, ...override }, categories), null);
const requests = [];
const source = createBlogSource(async (input, options) => {
  const url = new URL(input);
  requests.push({ url, options });
  return Response.json(
    url.pathname.endsWith("categories")
      ? categories
      : [post, post, { ...post, status: "draft" }],
    { headers: { "x-wp-total": "25", "x-wp-totalpages": "3" } },
  );
});
const listing = await source.listing(categories, {
  category: "vps",
  q: "VPS",
  page: 2,
});
assert.equal(listing.status, "ready");
assert.equal(listing.posts.length, 1);
assert.equal(listing.total, 25);
assert.equal(listing.pages, 3);
assert.equal(requests.at(-1).url.searchParams.get("categories"), "1,2");
assert.equal(requests.at(-1).url.searchParams.get("page"), "2");
assert.equal(requests.at(-1).url.searchParams.get("search"), "VPS");
assert.equal(requests.at(-1).url.searchParams.get("orderby"), "relevance");
assert.equal(requests.at(-1).options.next.revalidate, 300);
await source.listing(categories, { popular: true });
assert.equal(requests.at(-1).url.searchParams.get("orderby"), "post_views");
assert.equal(
  requests.at(-1).url.searchParams.get("categories_exclude"),
  "3,4,5",
);
assert.equal(
  (await source.post(post.slug, categories)).content,
  post.content.rendered,
);
const failed = createBlogSource(async () => {
  throw new Error("offline");
});
assert.equal((await failed.listing(categories)).status, "unavailable");
await assert.rejects(failed.post("missing", categories), BlogApiError);
const absent = createBlogSource(async () => Response.json([]));
assert.equal(await absent.post("missing", categories), null);
const invalidPage = createBlogSource(async () =>
  Response.json({ code: "rest_post_invalid_page_number" }, { status: 400 }),
);
assert.equal(
  (await invalidPage.listing(categories, { page: 99999 })).status,
  "ready",
);
assert.equal((await invalidPage.listing(categories)).posts.length, 0);
const protectedPost = createBlogSource(async () =>
  Response.json([
    { ...post, content: { rendered: "secret", protected: true } },
  ]),
);
assert.equal(await protectedPost.post(post.slug, categories), null);

const prepared = prepareBlogContent(
  `<script>alert(1)</script><style>body{display:none}</style><div id="ez-toc-container">Old TOC</div><h1 onclick="alert(1)">Tiêu đề</h1><h2>Tiêu đề</h2><h3 id="stable">Phần con</h3><a href="javascript:alert(1)">bad</a><a href="https://interdata.vn/blog/vps/">category</a><a target="_blank" href="https://interdata.vn/blog/huong-dan-vps/#stable">post</a><img data-src="https://interdata.vn/blog/wp-content/uploads/test.jpg" onerror="alert(1)" style="position:fixed"><img src="data:image/svg+xml,evil"><iframe src="https://evil.example/embed"></iframe><iframe src="https://www.youtube.com/embed/abc"></iframe><pre><code>&lt;script&gt;safe code&lt;/script&gt;</code></pre><table><tr><th scope="col">CPU</th><td colspan="2">4</td></tr></table>`,
  categories,
);
assert.ok(
  !/<script|<style|onclick|onerror|style=|javascript:|data:image|evil\.example|Old TOC|<h1/.test(
    prepared.html,
  ),
);
assert.match(prepared.html, /&lt;script&gt;safe code/);
assert.match(prepared.html, /scope="col"/);
assert.match(prepared.html, /colspan="2"/);
assert.match(prepared.html, /href="\/blog\/\?category=vps"/);
assert.match(prepared.html, /href="\/blog\/huong-dan-vps\/#stable"/);
assert.match(prepared.html, /rel="noopener noreferrer"/);
assert.match(
  prepared.html,
  /src="https:\/\/interdata.vn\/blog\/wp-content\/uploads\/test.jpg"/,
);
assert.match(prepared.html, /www.youtube.com\/embed\/abc/);
assert.equal(prepared.toc.length, 3);
assert.equal(new Set(prepared.toc.map((item) => item.id)).size, 3);
for (const item of prepared.toc)
  assert.ok(prepared.html.includes(`id="${item.id}"`));
assert.equal(
  localBlogHref("https://external.example/blog/post/", categories),
  "https://external.example/blog/post/",
);
assert.equal(
  localBlogHref(
    "https://interdata.vn/blog/wp-content/uploads/test.jpg",
    categories,
  ),
  "https://interdata.vn/blog/wp-content/uploads/test.jpg",
);
const frameSource = `<!-- SAPO --><p>Mở đầu giữ nguyên với <strong>VPS</strong>.</p><h2 id="start">Khái niệm ban đầu</h2><p>Nội dung gốc, không viết lại.</p><div style="display:flex;background:#fff;padding:20px"><div><img src="https://interdata.vn/blog/wp-content/uploads/test.jpg" alt="Ảnh gốc"></div><div><h3>CTA gốc</h3><p>Mô tả gốc.</p><a href="https://interdata.vn/canhme/" style="background:#2563eb;display:inline-block">Nút gốc</a></div></div><table><tr><th>CPU</th><td>4 vCore</td></tr></table><pre><code>chmod 600 file</code></pre><h2>Câu hỏi thường gặp về VPS</h2><h3>Câu hỏi gốc?</h3><p>Câu trả lời gốc.</p><h2>Kết luận</h2><p>Kết luận gốc.</p><p><em>Nội dung mang tính tham khảo. Giữ nguyên lời nhắc.</em></p><!-- END -->`;
const safeFrame = prepareBlogContent(frameSource, categories);
const frame = frameBlogContent(safeFrame.html);
assert.equal(
  htmlToText(frame.opening + frame.body),
  htmlToText(safeFrame.html),
);
assert.match(htmlToText(frame.opening), /Mở đầu giữ nguyên/);
assert.ok(!frame.opening.includes("<h2"));
assert.match(frame.body, /data-article-cta="deals"/);
assert.match(frame.body, /data-article-cta-media/);
assert.match(frame.body, /data-article-cta-copy/);
assert.match(frame.body, /data-article-section="faq"/);
assert.match(frame.body, /data-article-section="conclusion"/);
assert.match(frame.body, /data-article-disclaimer/);
assert.match(frame.body, /<table>/);
assert.match(frame.body, /chmod 600 file/);
assert.ok(!frame.body.includes("<!--") && !frame.opening.includes("<!--"));
assert.ok(!frame.body.includes("data-article-panel"));
const flushCta = frameBlogContent(
  prepareBlogContent(
    '<div style="display:flex; background:#fff; border:1px solid blue"><div><img src="https://interdata.vn/blog/wp-content/uploads/test.jpg"></div><div style="padding:28px"><h3>Tiêu đề gốc</h3><p>Mô tả.</p><a href="https://interdata.vn/cloud-server/" style="background:blue">Xem Cloud</a></div></div>',
  ).html,
);
assert.match(flushCta.body, /data-article-cta="cloud"/);
assert.match(flushCta.body, /data-article-cta-copy/);
assert.match(flushCta.body, /data-article-cta-media/);
const textMedia = frameBlogContent(
  prepareBlogContent(
    '<div style="background:#fff; border:1px solid blue"><div><p>Thuê VPS InterData</p><p>Mô tả cột gốc.</p></div><div><h3>Tiêu đề</h3><p>Nội dung gốc.</p><a href="/thue-vps/" style="background:blue">Xem VPS</a></div></div>',
  ).html,
);
assert.match(textMedia.body, /data-article-cta-media/);
assert.match(htmlToText(textMedia.body), /Thuê VPS InterData/);
const oldToc = frameBlogContent(
  prepareBlogContent(
    '<p>Sapo.</p><div><p>NỘI DUNG BÀI VIẾT</p><ul><li><a href="#one">Tiêu đề</a></li></ul></div><h2 id="one">Tiêu đề</h2><p>Bài viết.</p>',
  ).html,
);
assert.ok(!(oldToc.opening + oldToc.body).includes("NỘI DUNG BÀI VIẾT"));
assert.match(oldToc.body, /id="one"/);
const plain = frameBlogContent(
  prepareBlogContent("<p>Tin không có tiêu đề phụ.</p>").html,
);
assert.equal(htmlToText(plain.body), "Tin không có tiêu đề phụ.");
const hostile = frameBlogContent(
  prepareBlogContent(
    '<div class="evil" style="background:red;padding:10px"><a href="https://evil.example/" data-article-button="deals">Link thường</a></div><button onclick="alert(1)" type="button" class="interdata-carousel-arrow">Next</button>',
  ).html,
);
assert.ok(!/onclick|class="evil"|data-article-cta=/.test(hostile.body));
console.log(
  "Blog data: live-source query contract, failure states, unpublished/protected posts, sanitization, TOC and internal links passed.",
);
