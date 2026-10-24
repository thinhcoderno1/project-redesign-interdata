import sanitizeHtml from "sanitize-html";
import { Parser } from "htmlparser2";
import { htmlToText } from "./interdata-blog";
import { localBlogHref } from "./blog-links";
import type { BlogCategory } from "@/data/blog";

export type TocEntry = { id: string; title: string; level: number };
const tags = [
  ...sanitizeHtml.defaults.allowedTags,
  "img",
  "figure",
  "figcaption",
  "iframe",
  "details",
  "summary",
  "button",
];
const allowedClasses = {
  "*": [
    /^interdata-(?:plan-(?:carousel|viewport|track|card|title|price|badge|features|icon|button)|carousel-(?:heading|arrow|prev|next|mark))$/,
  ],
};
const attributes = {
  "*": ["id", "class"],
  a: ["href", "target", "rel", "title", "data-article-button"],
  div: ["data-article-panel", "data-article-section"],
  button: ["type", "aria-label"],
  img: ["src", "alt", "width", "height", "loading", "decoding"],
  iframe: [
    "src",
    "title",
    "width",
    "height",
    "allowfullscreen",
    "loading",
    "referrerpolicy",
  ],
  td: ["colspan", "rowspan"],
  th: ["colspan", "rowspan", "scope"],
  ol: ["start", "reversed"],
};
function serviceButton(attrs: Record<string, string>) {
  if (
    !/(?:background(?:-color)?\s*:|display\s*:\s*inline-block)/i.test(
      attrs.style || "",
    ) &&
    !/\b(?:button|btn|wp-block-button__link)\b/.test(attrs.class || "")
  )
    return "";
  try {
    const url = new URL(attrs.href, "https://interdata.vn");
    if (
      url.hostname !== "interdata.vn" ||
      !/^https?:$/.test(url.protocol) ||
      url.username ||
      url.password ||
      url.port
    )
      return "";
    return (
      (
        {
          "/thue-vps/": "vps",
          "/canhme/": "deals",
          "/cloud-server/": "cloud",
        } as Record<string, string>
      )[`${url.pathname.replace(/\/$/, "")}/`] || ""
    );
  } catch {
    return "";
  }
}
function safeImage(value: string | undefined) {
  if (!value) return "";
  try {
    const url = new URL(value, "https://interdata.vn");
    return url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      !/\.svg$/i.test(url.pathname)
      ? url.href
      : "";
  } catch {
    return "";
  }
}

export function prepareBlogContent(
  raw: string,
  categories: BlogCategory[] = [],
) {
  const safe = sanitizeHtml(raw, {
    allowedTags: tags,
    allowedAttributes: attributes,
    allowedClasses,
    allowedSchemes: ["https", "http", "mailto", "tel"],
    allowProtocolRelative: false,
    allowedIframeHostnames: [
      "www.youtube.com",
      "www.youtube-nocookie.com",
      "player.vimeo.com",
    ],
    exclusiveFilter: (frame) => frame.attribs.id === "ez-toc-container",
    transformTags: {
      h1: "h2",
      div: (tagName, attrs) => ({
        tagName,
        attribs: {
          ...attrs,
          "data-article-panel":
            /(?:background(?:-color)?|border(?:-left)?)\s*:/i.test(
              attrs.style || "",
            )
              ? "true"
              : "",
          "data-article-section": /border-top\s*:[^;]*dashed/i.test(
            attrs.style || "",
          )
            ? "conclusion"
            : "",
        },
      }),
      a: (tagName, attrs) => {
        const href = attrs.href?.startsWith("#")
          ? attrs.href
          : localBlogHref(attrs.href || "", categories);
        return {
          tagName,
          attribs: {
            ...attrs,
            href,
            "data-article-button": serviceButton(attrs),
            ...(attrs.target === "_blank"
              ? { rel: "noopener noreferrer" }
              : {}),
          },
        };
      },
      img: (tagName, attrs) => ({
        tagName,
        attribs: {
          src: safeImage(attrs["data-src"]) || safeImage(attrs.src),
          alt: attrs.alt || "",
          loading: "lazy",
          decoding: "async",
          ...(/^\d+$/.test(attrs.width || "") ? { width: attrs.width } : {}),
          ...(/^\d+$/.test(attrs.height || "") ? { height: attrs.height } : {}),
        },
      }),
      iframe: (tagName, attrs) => ({
        tagName,
        attribs: {
          ...attrs,
          title: attrs.title || "Video trong bài viết",
          loading: "lazy",
          referrerpolicy: "strict-origin-when-cross-origin",
        },
      }),
    },
  });
  const toc: TocEntry[] = [];
  const ids = new Set<string>();
  let heading: { tag: string; id: string; title: string } | null = null;
  const parser = new Parser({
    onopentag(name, attrs) {
      if (name === "h2" || name === "h3")
        heading = { tag: name, id: attrs.id || "", title: "" };
    },
    ontext(text) {
      if (heading) heading.title += text;
    },
    onclosetag(name) {
      if (!heading || name !== heading.tag) return;
      const title = heading.title.replace(/\s+/g, " ").trim();
      const base =
        heading.id ||
        `noi-dung-${
          title
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .toLowerCase()
            .replace(/[^a-z\d]+/g, "-")
            .replace(/^-|-$/g, "") || toc.length + 1
        }`;
      let id = base,
        suffix = 2;
      while (ids.has(id)) id = `${base}-${suffix++}`;
      ids.add(id);
      toc.push({
        id,
        title: title || "Nội dung bài viết",
        level: Number(name.slice(1)),
      });
      heading = null;
    },
  });
  parser.write(safe);
  parser.end();
  let index = 0;
  const html = sanitizeHtml(safe, {
    allowedTags: tags,
    allowedAttributes: attributes,
    allowedClasses,
    allowedSchemes: ["https", "http", "mailto", "tel"],
    allowProtocolRelative: false,
    allowedIframeHostnames: [
      "www.youtube.com",
      "www.youtube-nocookie.com",
      "player.vimeo.com",
    ],
    transformTags: {
      h2: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, id: toc[index++]?.id || "" },
      }),
      h3: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, id: toc[index++]?.id || "" },
      }),
    },
  });
  return {
    html,
    toc,
    readingMinutes: Math.max(
      1,
      Math.ceil(htmlToText(html).split(/\s+/).length / 220),
    ),
  };
}
