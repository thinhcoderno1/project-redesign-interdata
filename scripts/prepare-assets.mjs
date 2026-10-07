import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
const destination = path.resolve("public/images");
await fs.mkdir(destination, { recursive: true });
const assets = [
  [
    "D:/InterData-Project-News-Website-2026/public/images/logo.webp",
    "logo",
    500,
  ],
  [
    "D:/InterData-Project-News-Website-2026/public/images/hero.webp",
    "datacenter",
    1500,
  ],
  [
    "D:/InterData/thue-vps/public/images/skin/testimonial/balico.png",
    "balico-person",
    320,
  ],
  [
    "D:/InterData/thue-vps/public/images/skin/testimonial/thang-nguyen.jpg",
    "umix-person",
    160,
  ],
  [
    "D:/InterData/thue-vps/public/images/skin/testimonial/vu-minh-dao-realdev.jpg",
    "realdev-person",
    160,
  ],
  [
    "D:/InterData/thue-vps/public/images/skin/customer/balico.png",
    "balico-logo",
    200,
  ],
  [
    "D:/InterData/thue-vps/public/images/skin/customer/logo-umix-vietnam.png",
    "umix-logo",
    200,
  ],
  [
    "D:/InterData/thue-vps/public/images/skin/customer/logo-realdev.png",
    "realdev-logo",
    200,
  ],
  [
    "D:/InterData/thue-vps/public/images/skin/news/news.png",
    "press-vnexpress",
    720,
  ],
  [
    "D:/InterData/thue-vps/public/images/skin/news/news-1.png",
    "press-thanhnien",
    720,
  ],
  ["D:/InterData/thue-vps/public/images/skin/news/vtv.png", "press-vtv", 720],
  [
    "D:/InterData/home/public/assets/promotions/banner-inter-platinum-series-2026.webp",
    "promo-platinum",
    1100,
  ],
  [
    "D:/InterData/home/public/assets/promotions/banner-real-cloud-2026.webp",
    "promo-cloud",
    1100,
  ],
];
const schools = [
  "dai-hoc-bach-khoa",
  "FPT_Polytechnic",
  "dai-hoc-cong-thuong",
  "dai-hoc-yersin",
  "cao-dang-kinh-te-doi-ngoai",
  "dai-hoc-gia-dinh",
  "Melbourne-Polytechnic",
];
for (const name of schools)
  assets.push([`D:/InterData/home/public/assets/logo/${name}.png`, name, 240]);
const manifest = [];
for (const [source, name, width] of assets) {
  const output = path.join(destination, `${name}.webp`);
  await sharp(source)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 84 })
    .toFile(output);
  const meta = await sharp(output).metadata();
  manifest.push({
    source,
    asset: `/images/${name}.webp`,
    width: meta.width,
    height: meta.height,
  });
}
const slugs = [
  "cac-thong-so-can-biet-khi-thue-vps",
  "huong-dan-su-dung-vps",
  "tao-bot-giam-sat-tai-nguyen-vps",
  "interdata-hop-tac-chien-luoc-cung-vnpt",
];
const articles = [];
for (const slug of slugs) {
  const response = await fetch(
    `https://interdata.vn/blog/wp-json/wp/v2/posts?slug=${slug}&_embed`,
  );
  if (!response.ok) throw new Error(`Article API ${response.status}: ${slug}`);
  const [post] = await response.json();
  if (!post) throw new Error(`Missing article ${slug}`);
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  const source = media?.source_url;
  const output = path.join(destination, `${slug}.webp`);
  if (source) {
    const blob = Buffer.from(await (await fetch(source)).arrayBuffer());
    await sharp(blob)
      .resize({ width: 960, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(output);
    const meta = await sharp(output).metadata();
    manifest.push({
      source,
      asset: `/images/${slug}.webp`,
      width: meta.width,
      height: meta.height,
    });
  }
  articles.push({
    title: post.title.rendered
      .replace(/&#8211;/g, "–")
      .replace(/&#038;/g, "&")
      .replace(/<[^>]+>/g, ""),
    href: post.link,
    date: post.date,
    image: source ? `/images/${slug}.webp` : null,
    source: `https://interdata.vn/blog/wp-json/wp/v2/posts/${post.id}`,
  });
}
await fs.mkdir("src/data", { recursive: true });
await fs.writeFile("src/data/articles.json", JSON.stringify(articles, null, 2));
await fs.writeFile(
  "docs/asset-manifest.json",
  JSON.stringify(manifest, null, 2),
);
const css = await (
  await fetch(
    "https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap",
    { headers: { "User-Agent": "Mozilla/5.0" } },
  )
).text();
await fs.mkdir("public/fonts", { recursive: true });
let index = 0;
let localCss = css;
for (const url of [
  ...new Set([...css.matchAll(/url\((https:[^)]+)\)/g)].map((m) => m[1])),
]) {
  const file = `be-vietnam-${index++}.${url.includes(".woff2") ? "woff2" : "ttf"}`;
  await fs.writeFile(
    `public/fonts/${file}`,
    Buffer.from(await (await fetch(url)).arrayBuffer()),
  );
  localCss = localCss.split(url).join(`/fonts/${file}`);
}
await fs.mkdir("src/app", { recursive: true });
await fs.writeFile("src/app/fonts.css", localCss);
console.log(
  `Prepared ${manifest.length} assets and ${articles.length} verified article records; font subsets: ${index}.`,
);
