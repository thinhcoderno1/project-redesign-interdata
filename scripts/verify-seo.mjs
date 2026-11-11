import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { Parser } from "htmlparser2";
import { loadProjectModule } from "./load-project-typescript.mjs";

const base = process.env.QA_BASE_URL || "http://localhost:3100";
const { publicPagePaths } = loadProjectModule("src/lib/seo-sitemap.ts");
function inspect(html) {
  const robots = [];
  const ogImages = [];
  const twitterImages = [];
  const telephoneLinks = [];
  let text = "";
  let scriptDepth = 0;
  let firstArticleImage;
  let articleDepth = 0;
  let canonical;
  const parser = new Parser({
    onopentag(name, attrs) {
      if (name === "script" || name === "style") scriptDepth++;
      if (name === "a" && /^tel:/i.test(attrs.href || ""))
        telephoneLinks.push(attrs.href);
      if (name === "meta" && ["robots", "googlebot"].includes(attrs.name))
        robots.push(attrs.content);
      if (name === "link" && attrs.rel === "canonical") canonical = attrs.href;
      if (name === "meta" && attrs.property === "og:image")
        ogImages.push(attrs.content);
      if (name === "meta" && attrs.name === "twitter:image")
        twitterImages.push(attrs.content);
      if (
        name === "article" &&
        (articleDepth || attrs["aria-label"] === "Nội dung bài viết")
      )
        articleDepth++;
      if (articleDepth && name === "img" && !firstArticleImage && attrs.src)
        firstArticleImage = attrs.src;
    },
    onclosetag(name) {
      if (name === "script" || name === "style") scriptDepth--;
      if (name === "article" && articleDepth) articleDepth--;
    },
    ontext(value) {
      if (!scriptDepth) text += value;
    },
  });
  parser.end(html);
  return {
    robots,
    canonical,
    ogImages,
    twitterImages,
    firstArticleImage,
    telephoneLinks,
    hasRetiredPhone:
      /(?:0|\+?84)[\s.()-]*9[\s.()-]*6[\s.()-]*6[\s.()-]*0[\s.()-]*3[\s.()-]*9[\s.()-]*1[\s.()-]*6[\s.()-]*6/.test(
        text,
      ),
  };
}
async function page(path) {
  const response = await fetch(`${base}${path}`, {
    headers: { "User-Agent": "Googlebot" },
    signal: AbortSignal.timeout(30000),
  });
  const metadata = inspect(await response.text());
  return {
    status: response.status,
    httpRobots: response.headers.get("x-robots-tag"),
    ...metadata,
  };
}
const robotsResponse = await fetch(`${base}/robots.txt`);
assert.equal(robotsResponse.status, 200);
const rules = await robotsResponse.text();
assert.match(rules, /User-Agent: \*/);
assert.match(rules, /Allow: \//);
assert.match(rules, /Sitemap: https:\/\/interdata.vn\/sitemap.xml/);
assert.doesNotMatch(rules, /Disallow: \/(?:\s|$)/);

const sitemapResponse = await fetch(`${base}/sitemap.xml`, {
  signal: AbortSignal.timeout(60000),
});
assert.equal(sitemapResponse.status, 200);
assert.match(sitemapResponse.headers.get("content-type"), /xml/);
const xml = await sitemapResponse.text();
const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (match) => match[1],
);
assert.ok(locations.length > publicPagePaths.length);
assert.equal(new Set(locations).size, locations.length);
assert.ok(
  locations.every(
    (url) =>
      url.startsWith("https://interdata.vn/") &&
      !url.includes("?") &&
      !url.includes("content-review"),
  ),
);
for (const path of publicPagePaths)
  assert.ok(locations.includes(`https://interdata.vn${path}`), path);

const results = [];
for (const path of [
  ...publicPagePaths,
  new URL(
    locations.find(
      (url) =>
        new URL(url).pathname.startsWith("/blog/") &&
        new URL(url).pathname !== "/blog/",
    ),
  ).pathname,
]) {
  const metadata = await page(path);
  assert.equal(metadata.status, 200, path);
  assert.equal(metadata.hasRetiredPhone, false, `No retired phone on ${path}`);
  assert.ok(metadata.telephoneLinks.includes("tel:1900636822"), path);
  if (publicPagePaths.includes(path))
    assert.ok(
      metadata.telephoneLinks.every((href) => href === "tel:1900636822"),
      `One company hotline on ${path}`,
    );
  assert.ok(
    !/noindex|nofollow/i.test(metadata.httpRobots || ""),
    `No blocking HTTP header on ${path}`,
  );
  assert.ok(metadata.robots.length, `Robots metadata on ${path}`);
  assert.ok(
    metadata.robots.every((value) => !/noindex|nofollow/.test(value)),
    `Indexable page ${path}`,
  );
  assert.equal(metadata.canonical, `https://interdata.vn${path}`, path);
  if (path.startsWith("/blog/") && path !== "/blog/") {
    assert.equal(metadata.ogImages.length, 1);
    if (metadata.firstArticleImage)
      assert.deepEqual(metadata.ogImages, [metadata.firstArticleImage]);
  } else {
    assert.deepEqual(
      metadata.ogImages,
      [
        `https://interdata.vn${path === "/blackfriday/" ? "/images/black-friday/og-image.png" : "/images/og/interdata.png"}`,
      ],
      path,
    );
  }
  assert.deepEqual(
    metadata.twitterImages,
    metadata.ogImages,
    `Consistent Twitter/OG image on ${path}`,
  );
  results.push({ path, ...metadata });
}
const imagePost = await page(
  "/blog/cach-va-php-tren-aapanel-directadmin-cloudpanel/",
);
assert.equal(imagePost.status, 200);
assert.ok(imagePost.firstArticleImage);
assert.deepEqual(
  imagePost.ogImages,
  [imagePost.firstArticleImage],
  "Blog sharing uses its first content image",
);
assert.deepEqual(imagePost.twitterImages, imagePost.ogImages);
const sharedImage = await fetch(`${base}/images/og/interdata.png`);
assert.equal(sharedImage.status, 200);
assert.match(sharedImage.headers.get("content-type"), /image\/png/);
assert.ok(
  (await fs.readFile("public/images/og/interdata.png")).equals(
    Buffer.from(await sharedImage.arrayBuffer()),
  ),
);
const search = await page("/blog/?q=VPS");
assert.ok(search.robots.some((value) => /noindex/.test(value)));
assert.ok(search.robots.every((value) => !/nofollow/.test(value)));
const review = await page("/content-review/");
assert.ok(review.robots.some((value) => /noindex/.test(value)));
const missing = await page("/blog/seo-no-such-post-9927/");
assert.ok(missing.robots.some((value) => /noindex/.test(value)));
const firstPage = await page("/blog/?page=1&utm_source=qa");
assert.equal(firstPage.canonical, "https://interdata.vn/blog/");
const secondPage = await page("/blog/?page=2");
assert.equal(secondPage.canonical, "https://interdata.vn/blog/?page=2");
await fs.mkdir("artifacts/seo", { recursive: true });
await fs.writeFile(
  "artifacts/seo/verification.json",
  JSON.stringify(
    {
      sitemapUrls: locations.length,
      pages: results,
      search,
      review,
      missing,
      firstPage,
      secondPage,
    },
    null,
    2,
  ),
);
console.log(
  `SEO HTTP: ${results.length} public pages allow indexing, ${locations.length} canonical sitemap URLs, open robots, noindex search/review/404 and normalized pagination passed.`,
);
