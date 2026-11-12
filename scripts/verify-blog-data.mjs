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
const { prepareBlogContent, firstBlogImage } = load("src/lib/blog-content.ts");
const { frameBlogContent } = load("src/lib/blog-frame.ts");
const { htmlToText } = load("src/lib/interdata-blog.ts");
const { localBlogHref } = load("src/lib/blog-links.ts");
for (const number of [
  "0966039166",
  "0966 039 166",
  "096.603.9166",
  "+84 (966) 039 166",
  "0966&nbsp;039&nbsp;166",
  "+84 1900 636 822",
]) {
  assert.equal(htmlToText(`<p>Hotline ${number}</p>`), "Hotline 1900 636 822");
  assert.equal(
    prepareBlogContent(`<p>Hotline ${number}</p>`).html,
    "<p>Hotline 1900 636 822</p>",
  );
}
for (const number of ["0966039166", "+84966039166", "+841900636822"]) {
  const phoneContent = prepareBlogContent(
    `<a href="tel:${number}" title="Call 0966 039 166">0966039166</a>`,
  ).html;
  assert.match(phoneContent, /href="tel:1900636822"/);
  assert.match(phoneContent, /title="Call 1900 636 822"/);
  assert.match(phoneContent, />1900 636 822<\/a>/);
}
const unrelatedPhoneContent = prepareBlogContent(
  '<a href="tel:18001234">18001234</a><a href="https://example.com/0966039166/">External</a><img src="https://example.com/0966039166.jpg" alt="Hotline 0966039166">',
).html;
assert.match(unrelatedPhoneContent, /href="tel:18001234"/);
assert.match(
  unrelatedPhoneContent,
  /href="https:\/\/example.com\/0966039166\/"/,
);
assert.match(
  unrelatedPhoneContent,
  /src="https:\/\/example.com\/0966039166.jpg"/,
);
assert.match(unrelatedPhoneContent, /alt="Hotline 1900 636 822"/);
assert.equal(htmlToText("109660391660"), "109660391660");
assert.deepEqual(
  firstBlogImage(
    '<p>Opening</p><img data-src="/wp-content/uploads/first.jpg" src="data:image/gif;base64,placeholder" alt="First &amp; image"><img src="https://example.com/second.jpg">',
  ),
  {
    url: "https://admin.interdata.vn/wp-content/uploads/first.jpg",
    alt: "First & image",
  },
);
assert.deepEqual(
  firstBlogImage(
    '<img data-lazy-src="https://example.com/first.webp"><img src="https://example.com/second.jpg">',
  ),
  { url: "https://example.com/first.webp", alt: "" },
);
assert.equal(
  firstBlogImage(
    '<script>"<img src=\"https://example.com/tracker.jpg\">"</script><img src="javascript:alert(1)"><img src="https://example.com/icon.svg">',
  ),
  null,
);
assert.equal(firstBlogImage("<p>No images</p>"), null);
const emojiIcons = ["🌐", "☎️", "🏢", "👩🏽‍💻", "🇻🇳", "1️⃣"];
for (const className of ["emoji", "wp-smiley", "alignnone emoji extra"]) {
  for (const icon of emojiIcons) {
    const markup = `<img class="${className}" src="https://s.w.org/images/core/emoji/17.0.2/svg/1f310.svg" alt="${icon}" width="16" height="16" onerror="alert(1)">`;
    const content = prepareBlogContent(`<p>${markup} Website</p>`).html;
    assert.equal(
      content,
      `<p><span class="interdata-emoji">${icon}</span> Website</p>`,
    );
    assert.equal(firstBlogImage(markup), null);
  }
}
const pngEmoji =
  '<img class="emoji" data-src="https://s.w.org/images/core/emoji/17.0.2/72x72/1f310.png" alt="🌐">';
assert.deepEqual(
  firstBlogImage(
    `${pngEmoji}<img src="https://example.com/article.webp" alt="Article image">`,
  ),
  { url: "https://example.com/article.webp", alt: "Article image" },
);
assert.equal(
  prepareBlogContent(pngEmoji).html,
  '<span class="interdata-emoji">🌐</span>',
);
assert.equal(
  prepareBlogContent(
    '<h2><img class="emoji" alt="🌐" src="https://s.w.org/images/core/emoji/17.0.2/svg/1f310.svg"> Website</h2>',
  ).toc[0].title,
  "🌐 Website",
);
const unsafeEmoji = prepareBlogContent(
  '<img class="emoji" alt="&lt;img src=x onerror=alert(1)&gt;" src="https://s.w.org/images/core/emoji/17.0.2/svg/1f310.svg">',
).html;
assert.ok(!unsafeEmoji.includes("<img"));
assert.match(unsafeEmoji, /&lt;img/);
assert.equal(
  firstBlogImage(
    '<img class="emoji-illustration" src="https://example.com/photo.webp" alt="Photo">',
  ).url,
  "https://example.com/photo.webp",
);
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
  _embedded: {
    author: [
      {
        name: "InterData",
        link: "https://admin.interdata.vn/author/interdata/",
      },
    ],
    "wp:featuredmedia": [
      {
        source_url:
          "https://admin.interdata.vn/wp-content/uploads/2026/11/test.jpg",
      },
    ],
  },
};
assert.deepEqual(categoryFamily(categories, "vps"), [1, 2]);
assert.equal(normalizeBlogPost(post, categories).href, "/blog/huong-dan-vps/");
assert.equal(
  normalizeBlogPost(post, categories).image,
  post._embedded["wp:featuredmedia"][0].source_url,
);
assert.equal(
  normalizeBlogPost(post, categories).authorUrl,
  post._embedded.author[0].link,
);
for (const source_url of [
  "https://admin.interdata.vn.evil.example/wp-content/uploads/test.jpg",
  "https://admin.interdata.vn:8443/wp-content/uploads/test.jpg",
  "https://user:password@admin.interdata.vn/wp-content/uploads/test.jpg",
  "https://admin.interdata.vn/wp-content/plugins/test.jpg",
  "http://admin.interdata.vn/wp-content/uploads/test.jpg",
  "https://admin.interdata.vn/wp-content/uploads/test.svg",
])
  assert.equal(
    normalizeBlogPost(
      { ...post, _embedded: { "wp:featuredmedia": [{ source_url }] } },
      categories,
    ).image,
    null,
  );
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
assert.equal(requests.at(-1).url.origin, "https://admin.interdata.vn");
assert.equal(requests.at(-1).url.pathname, "/wp-json/wp/v2/posts");
assert.equal(requests.at(-1).options.next.revalidate, 300);
const guidePost = {
  ...post,
  id: 11,
  slug: "huong-dan-linux",
  title: { rendered: "Linux: Tiêu đề gốc &amp; hướng dẫn" },
};
const guidesSource = createBlogSource(async (input) => {
  const params = new URL(input).searchParams;
  assert.equal(params.get("slug"), `${post.slug},${guidePost.slug},missing`);
  assert.equal(params.get("per_page"), "3");
  assert.equal(params.get("status"), "publish");
  assert.equal(params.has("search"), false);
  // The CMS can return date order, unrelated records or omit a selected article.
  return Response.json([
    guidePost,
    post,
    { ...post, id: 12, slug: "unrelated" },
    { ...post, id: 13, slug: "missing", status: "draft" },
  ]);
});
const guides = await guidesSource.listing(categories, {
  slugs: [post.slug, guidePost.slug, "missing"],
  perPage: 3,
});
assert.equal(guides.status, "ready");
assert.deepEqual(
  guides.posts.map(({ slug }) => slug),
  [post.slug, guidePost.slug],
);
assert.equal(guides.posts[1].title, "Linux: Tiêu đề gốc & hướng dẫn");
assert.equal(guides.posts[1].href, `/blog/${guidePost.slug}/`);
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
  localBlogHref("https://admin.interdata.vn/huong-dan-vps/#stable", categories),
  "/blog/huong-dan-vps/#stable",
);
assert.equal(
  localBlogHref("https://admin.interdata.vn/category/vps/", categories),
  "/blog/?category=vps",
);
assert.equal(
  localBlogHref("https://admin.interdata.vn/", categories),
  "/blog/",
);
for (const path of [
  "wp-admin/",
  "wp-json/wp/v2/posts/",
  "wp-content/uploads/test.jpg",
  "author/interdata/",
])
  assert.equal(
    localBlogHref(`https://admin.interdata.vn/${path}`, categories),
    `https://admin.interdata.vn/${path}`,
  );
assert.equal(
  localBlogHref("https://admin.interdata.vn.evil.example/post/", categories),
  "https://admin.interdata.vn.evil.example/post/",
);
assert.match(
  prepareBlogContent('<img src="/wp-content/uploads/test.jpg">').html,
  /src="https:\/\/admin.interdata.vn\/wp-content\/uploads\/test.jpg"/,
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

// WordPress campaigns and support CTAs keep their styles through both passes.
const sourceCta = prepareBlogContent(`
  <p style="color:red;position:fixed">Ordinary article text</p>
  <section style="background:linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);border:2px dashed #2563eb;border-radius:14px;padding:30px;text-align:center">
    <p><!-- wpautop comment --></p>
    <span style="background:#10b981;color:#ffffff;font-size:11px;padding:4px 10px;border-radius:20px">Original badge</span>
    <h3 style="color:#ffffff;font-size:28px;line-height:1.2">Original campaign title</h3>
    <p style="color:#bfdbfe">Original campaign copy</p>
    <a href="https://interdata.vn/blackfriday/#best-plans" target="_blank" style="display:inline-block;background:linear-gradient(90deg, #F97316 0%, #DC2626 100%);color:#fff;padding:12px 30px;border-radius:8px;box-shadow:0 5px 15px rgba(220,38,38,0.3);position:fixed;z-index:999999;background-image:url(https://evil.example/track);width:expression(alert(1));--unsafe:red;transform:scale(50)" onclick="alert(1)">Original campaign button</a>
    <a href="https://support.interdata.vn/" style="display:inline-flex;background:#2563eb;color:#fff">Contact support</a>
  </section>`);
const sourceCtaFrame = frameBlogContent(sourceCta.html);
const sourceCtaHtml = sourceCtaFrame.opening + sourceCtaFrame.body;
assert.match(sourceCtaHtml, /data-article-cta="service"/);
assert.match(sourceCtaHtml, /data-article-cta-source/);
assert.match(
  sourceCtaHtml,
  /background:linear-gradient\(135deg, #0f172a 0%, #1e3a8a 100%\)/,
);
assert.match(sourceCtaHtml, /border:2px dashed #2563eb/);
assert.match(sourceCtaHtml, /box-shadow:0 5px 15px rgba\(220,38,38,0.3\)/);
assert.match(sourceCtaHtml, /color:#ffffff;font-size:28px;line-height:1.2/);
assert.match(
  sourceCtaHtml,
  /href="https:\/\/interdata.vn\/blackfriday\/#best-plans"/,
);
assert.match(sourceCtaHtml, /href="https:\/\/support.interdata.vn\/"/);
assert.match(sourceCtaHtml, /rel="noopener noreferrer"/);
assert.match(sourceCtaHtml, /<p>Ordinary article text<\/p>/);
assert.ok(
  !/position:|z-index|url\(|expression\(|--unsafe|transform:|onclick|evil\.example|<p>\s*<\/p>/.test(
    sourceCtaHtml,
  ),
);
assert.equal(htmlToText(sourceCtaHtml), htmlToText(sourceCta.html));
const forgedCta = prepareBlogContent(
  '<div data-article-cta="deals" data-article-cta-source style="background:red"><p style="color:red">Forged panel</p></div>',
);
assert.ok(!/style=|data-article-cta/.test(forgedCta.html));
const externalCta = prepareBlogContent(
  '<div style="background:red"><a href="https://interdata.vn.evil.example/" style="background:red">External button</a></div>',
);
assert.ok(!/data-article-cta|style=/.test(externalCta.html));

const uxBlock = fs.readFileSync("scripts/fixtures/blog-ux-bf26.html", "utf8");
const uxPrepared = prepareBlogContent(
  `<style>body{display:none}</style>${uxBlock}`,
);
const uxFrame = frameBlogContent(uxPrepared.html);
assert.equal(htmlToText(uxPrepared.html), htmlToText(uxBlock));
assert.match(uxFrame.body, /data-article-plan-theme="bf26"/);
assert.ok(!uxFrame.opening.includes("interdata-plan-carousel"));
assert.equal(
  (uxPrepared.html.match(/class="interdata-plan-card"/g) || []).length,
  3,
);
assert.equal(
  (uxPrepared.html.match(/class="interdata-plan-button"/g) || []).length,
  3,
);
assert.equal(
  (uxPrepared.html.match(/interdata-plan-icon-cpu/g) || []).length,
  3,
);
assert.equal(
  (uxPrepared.html.match(/interdata-plan-icon-network/g) || []).length,
  9,
);
assert.match(uxPrepared.html, /class="interdata-plan-spacer"/);
assert.match(uxPrepared.html, /tabindex="0"/);
assert.match(uxPrepared.html, /role="region"/);
assert.match(uxPrepared.html, /aria-hidden="true"/);
assert.match(uxPrepared.html, /bf26-start&amp;billingcycle=annually/);
assert.match(uxPrepared.html, /rel="noopener noreferrer"/);
assert.ok(
  !/<style|<script|<svg|<use|onclick|data-inline-page|id-bf26-icon-|class="interdata-bf26/.test(
    uxPrepared.html,
  ),
);
const repeatedUx = prepareBlogContent(uxBlock + uxBlock);
assert.equal(
  (repeatedUx.html.match(/data-article-plan-theme="bf26"/g) || []).length,
  2,
);
assert.equal(
  new Set(repeatedUx.toc.map((entry) => entry.id)).size,
  repeatedUx.toc.length,
);
const legacyPlans = prepareBlogContent(
  '<div class="interdata-plan-carousel"><div class="interdata-plan-viewport"><div class="interdata-plan-track"><article class="interdata-plan-card"><h3 class="interdata-plan-title">Legacy plan</h3><a class="interdata-plan-button" href="https://support.interdata.vn/">Register</a></article></div></div></div>',
);
assert.match(legacyPlans.html, /class="interdata-plan-card"/);
assert.ok(!legacyPlans.html.includes('data-article-plan-theme="bf26"'));
console.log(
  "Blog data: queries, protected posts, sanitization, TOC, links, CTA styles and service UX Blocks passed.",
);
