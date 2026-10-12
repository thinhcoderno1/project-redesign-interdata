import { readFileSync } from "node:fs";
import path from "node:path";
import MarkdownIt from "markdown-it";
import type { LegalDocument } from "@/data/legal-documents";
import images from "@/data/legal-images.json";

// These files are the company's supplied documents. Normalization below only
// translates their formatting; the checked-in Markdown is never rewritten.
function normalizeFormatting(source: string) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const result: string[] = [];
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    const heading = /^\*\*(\d+(?:\.\d+)*\.?\s+\S.*?)\*\*\s*$/.exec(line);
    if (heading) {
      const level = /^\d+\.\d+/.test(heading[1]) ? "###" : "##";
      result.push(`${level} ${heading[1]}`);
      continue;
    }
    // The payment document has one table cell spread over several paragraphs.
    // Keep all its words in that cell and preserve the line breaks visually.
    if (line.startsWith("|") && !line.trimEnd().endsWith("|")) {
      const cellLines = [line];
      while (index + 1 < lines.length) {
        const next = lines[++index];
        if (next) cellLines.push(next);
        if (next.trimEnd().endsWith("|")) break;
      }
      result.push(cellLines.join("\uE000"));
      continue;
    }
    result.push(line);
  }
  return result.join("\n");
}

export function renderLegalDocument(document: LegalDocument) {
  const source = readFileSync(
    path.join(process.cwd(), "content", "legal", `${document.slug}.md`),
    "utf8",
  );
  const markdown = new MarkdownIt({
    html: false,
    linkify: false,
    typographer: false,
    breaks: true,
  });
  const tokens = markdown.parse(normalizeFormatting(source), {});
  const titleIndex = tokens.findIndex(
    (token) => token.type === "heading_open" && token.tag === "h1",
  );
  if (titleIndex < 0)
    throw new Error(`Missing title in ${document.sourceFile}`);
  const title = tokens[titleIndex + 1].content;
  tokens.splice(titleIndex, 3);
  const firstMainHeadingIndex = tokens.findIndex(
    (token) => token.type === "heading_open" && token.tag === "h2",
  );

  const sections: { id: string; title: string }[] = [];
  const ids = new Set<string>();
  let precedingHeading = title;
  let description = "";
  const inlineText = (index: number) =>
    (tokens[index].children ?? [])
      .filter((child) => ["text", "code_inline"].includes(child.type))
      .map((child) => child.content)
      .join("");

  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index];
    if (token.type === "heading_open") {
      // The VNPAY document starts with H3s directly after H1. Render these
      // introductory sections at H2 level so the page outline does not skip H2.
      if (token.tag === "h3" && index < firstMainHeadingIndex) {
        token.tag = "h2";
        tokens[index + 2].tag = "h2";
      }
      const text = inlineText(index + 1);
      precedingHeading = text;
      const number = text.match(/^\d+(?:\.\d+)*/)?.[0];
      const stem = number
        ? number.replaceAll(".", "-")
        : text
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[đĐ]/g, "d")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
      let id = `muc-${stem}`;
      for (let suffix = 2; ids.has(id); suffix++) id = `muc-${stem}-${suffix}`;
      ids.add(id);
      token.attrSet("id", id);
      if (token.tag === "h2") {
        sections.push({ id, title: text });
      }
    }
    if (token.type === "table_open")
      token.attrSet("aria-label", precedingHeading);
    if (
      !description &&
      token.type === "paragraph_open" &&
      tokens[index + 1]?.type === "inline" &&
      !tokens[index + 1].children?.some((child) => child.type === "image")
    ) {
      description = inlineText(index + 1);
    }
    for (const child of token.children ?? []) {
      if (child.type !== "image") continue;
      const image = images.find(
        (asset) => asset.source === child.attrGet("src"),
      );
      if (!image)
        throw new Error(`Unrecognized image in ${document.sourceFile}`);
      child.attrSet("src", image.path);
      child.attrSet("width", String(image.width));
      child.attrSet("height", String(image.height));
      child.attrSet("loading", "lazy");
      child.attrSet("decoding", "async");
      child.content ||= precedingHeading;
      // markdown-it's image renderer derives alt text from these inline tokens.
      child.children = markdown.parseInline(child.content, {})[0].children;
    }
  }

  markdown.renderer.rules.text = (items, index) =>
    markdown.utils
      .escapeHtml(items[index].content)
      .replaceAll("\uE000", "<br>");
  markdown.renderer.rules.table_open = (items, index) => {
    const label = markdown.utils.escapeHtml(
      String(items[index].attrGet("aria-label") ?? title),
    );
    return `<div class="legal-table-scroll" role="region" aria-label="${label}" tabindex="0"><table>\n`;
  };
  markdown.renderer.rules.table_close = () => "</table></div>\n";

  return {
    title,
    description: description || title,
    sections,
    html: markdown.renderer.render(tokens, markdown.options, {}),
  };
}
