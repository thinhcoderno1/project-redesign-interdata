import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { Parser } from "htmlparser2";
import { schemaNodes } from "./schema-helpers.mjs";
import { loadProjectModule } from "./load-project-typescript.mjs";

const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3100";
const { pageProfile } = loadProjectModule("src/data/schema-pages.ts");
const { htmlToText } = loadProjectModule("src/lib/interdata-blog.ts");
async function files(directory) {
  return (
    await Promise.all(
      (await fs.readdir(directory, { withFileTypes: true })).map((entry) =>
        entry.isDirectory()
          ? files(path.join(directory, entry.name))
          : [path.join(directory, entry.name)],
      ),
    )
  ).flat();
}
function parsePage(html) {
  const scripts = [];
  let canonical,
    title = "",
    body = "",
    script = "",
    inScript = false,
    isSchema = false,
    inStyle = false,
    inTitle = false;
  const parser = new Parser({
    onopentag(name, attributes) {
      if (name === "link" && attributes.rel === "canonical")
        canonical = attributes.href;
      if (name === "script") {
        inScript = true;
        isSchema = attributes.type === "application/ld+json";
        script = "";
      }
      if (name === "style") inStyle = true;
      if (name === "title") inTitle = true;
    },
    ontext(text) {
      if (isSchema) script += text;
      if (inTitle) title += text;
      if (!inScript && !inStyle) body += ` ${text}`;
    },
    onclosetag(name) {
      if (name === "script") {
        if (isSchema) scripts.push(script);
        inScript = false;
        isSchema = false;
      }
      if (name === "style") inStyle = false;
      if (name === "title") inTitle = false;
    },
  });
  parser.end(html);
  return {
    scripts,
    nodes: schemaNodes(scripts),
    canonical,
    title,
    body: body.replace(/\s+/g, " ").trim(),
  };
}
const reports = [];
async function check(route, expectedArticle = false) {
  const response = await fetch(`${base}${route}`, {
    signal: AbortSignal.timeout(90000),
  });
  assert.equal(response.status, 200, route);
  const parsed = parsePage(await response.text());
  const { nodes, scripts, canonical, body } = parsed;
  assert.equal(
    scripts.length,
    2,
    `${route}: one page graph and one site graph`,
  );
  const ids = nodes.map((node) => node["@id"]);
  assert.ok(ids.every(Boolean), `${route}: stable entity IDs`);
  assert.equal(
    new Set(ids).size,
    ids.length,
    `${route}: duplicate entity definitions`,
  );
  const organization = nodes.filter((node) => node["@type"] === "Organization");
  assert.equal(organization.length, 1);
  assert.equal(organization[0].taxID, "0316918910");
  assert.equal(nodes.filter((node) => node["@type"] === "WebSite").length, 1);
  const webPage = nodes.find((node) =>
    [
      "WebPage",
      "AboutPage",
      "ContactPage",
      "CollectionPage",
      "SearchResultsPage",
    ].includes(node["@type"]),
  );
  assert.ok(webPage, route);
  assert.equal(
    webPage.url,
    canonical,
    `${route}: canonical and schema must agree`,
  );
  assert.ok(webPage.url.startsWith("https://interdata.vn/"));
  assert.equal(webPage.inLanguage, "vi-VN");
  assert.ok(
    !scripts.some((script) =>
      /https?:\/\/(?:localhost|127\.0\.0\.1)/.test(script),
    ),
  );
  const breadcrumb = nodes.find((node) => node["@type"] === "BreadcrumbList");
  if (route !== "/") {
    assert.ok(breadcrumb?.itemListElement.length >= 2);
    breadcrumb.itemListElement.forEach((item, index) =>
      assert.equal(item.position, index + 1),
    );
    assert.equal(breadcrumb.itemListElement.at(-1).item, canonical);
  }
  const profile = pageProfile(new URL(route, base).pathname);
  const service = nodes.filter((node) => node["@type"] === "Service");
  assert.equal(service.length, profile.service ? 1 : 0);
  if (service[0]) {
    assert.equal(service[0].url, canonical);
    assert.equal(service[0].provider["@id"], organization[0]["@id"]);
    assert.ok(!service[0].offers && !service[0].aggregateRating);
  }
  const faq = nodes.find((node) => node["@type"] === "FAQPage");
  if (profile.faqs?.length) {
    assert.equal(faq.mainEntity.length, profile.faqs.length);
    for (const question of faq.mainEntity) {
      assert.ok(
        body.includes(htmlToText(question.name)),
        `${route}: FAQ question absent from rendered content: ${question.name}`,
      );
      assert.ok(
        body.includes(htmlToText(question.acceptedAnswer.text)),
        `${route}: FAQ answer absent from rendered content`,
      );
    }
  } else assert.ok(!faq);
  const article = nodes.find((node) => node["@type"] === "BlogPosting");
  if (expectedArticle) {
    assert.ok(
      article?.headline && article.datePublished && article.dateModified,
    );
    assert.equal(article.url, canonical);
    assert.ok(body.includes(article.headline));
    assert.equal(article.publisher["@id"], organization[0]["@id"]);
    assert.equal(article.mainEntityOfPage["@id"], webPage["@id"]);
  }
  const report = {
    route,
    canonical,
    types: nodes.map((node) => node["@type"]),
    passed: true,
  };
  reports.push(report);
  console.log(`PASS ${route}: ${report.types.join(", ")}`);
  return parsed;
}
const routes = [];
for (const file of await files("src/app/(website)")) {
  if (!file.endsWith("page.tsx") || file.split(path.sep).includes("blog"))
    continue;
  const source = await fs.readFile(file, "utf8");
  const match = source.match(/withPageSchema\([\s\S]*?path:\s*"([^"]+)"/);
  assert.ok(match, `Route missing schema: ${file}`);
  routes.push(match[1]);
}
for (const route of routes) await check(route);
const blog = await check("/blog/");
await check("/blog/?q=VPS");
await check("/blog/?category=tuyen-dung&page=1");
const list = blog.nodes.find((node) => node["@type"] === "ItemList");
assert.ok(
  list?.itemListElement.length,
  "Live CMS listing must provide a published post for integration verification",
);
await check(new URL(list.itemListElement[0].url).pathname, true);
const privatePage = await fetch(`${base}/content-review/`);
assert.ok(
  !parsePage(await privatePage.text()).scripts.length,
  "Internal review page must not receive public schema",
);
await fs.mkdir("artifacts", { recursive: true });
await fs.writeFile(
  "artifacts/schema-verification.json",
  JSON.stringify(reports, null, 2),
);
console.log(
  `PASS: ${reports.length} server-rendered routes; canonical URLs, unique identities, visible FAQ, CMS article and review exclusion.`,
);
