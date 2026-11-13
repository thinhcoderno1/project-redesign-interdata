import { parseDocument, DomUtils } from "htmlparser2";
import type { IOptions } from "sanitize-html";

const buttonStyle =
  /(?:background(?:-color)?\s*:|display\s*:\s*inline-(?:block|flex))/i;
const panelStyle =
  /(?:background(?:-color)?|border(?:-(?:left|right|top|bottom))?)\s*:/i;

export function articleButtonKind(attrs: Record<string, string>) {
  if (
    !buttonStyle.test(attrs.style || "") &&
    !/(?:^|\s)(?:[\w-]*-)?(?:button|btn)(?:[\w-]*)(?:\s|$)|\bwp-block-button__link\b/.test(
      attrs.class || "",
    )
  )
    return "";
  try {
    const url = new URL(attrs.href, "https://interdata.vn");
    if (
      !["interdata.vn", "support.interdata.vn"].includes(url.hostname) ||
      !/^https?:$/.test(url.protocol) ||
      url.username ||
      url.password ||
      url.port
    )
      return "";
    if (url.hostname === "support.interdata.vn") return "service";
    return (
      (
        {
          "/thue-vps/": "vps",
          "/canhme/": "deals",
          "/cloud-server/": "cloud",
        } as Record<string, string>
      )[`${url.pathname.replace(/\/$/, "")}/`] || "service"
    );
  } catch {
    return "";
  }
}

// Only visual declarations are accepted: no URLs, variables, positioning,
// transforms, generated content or arbitrary CSS from the CMS.
const color =
  /^(?:#[\da-f]{3,8}|[a-z]+|(?:rgb|rgba|hsl|hsla)\([\d\s.,%/+\-]+\))$/i;
const background =
  /^(?:#[\da-f]{3,8}|[a-z]+|(?:rgb|rgba|hsl|hsla)\([\d\s.,%/+\-]+\)|(?:linear|radial)-gradient\((?:[#\da-f\s.,%()+\-]|deg|rgba?|hsla?|circle|ellipse|at|to|top|right|bottom|left)+\))$/i;
const lengths = /^(?:(?:\d+(?:\.\d+)?(?:px|rem|em|%)?|auto)\s*){1,4}$/;
const border =
  /^(?:\d+(?:\.\d+)?(?:px|rem|em)\s+)?(?:solid|dashed|dotted|none)(?:\s+(?:#[\da-f]{3,8}|[a-z]+|rgba?\([\d\s.,%]+\)))?$/i;
const shadow =
  /^(?:none|[\d.pxrem\s,]+(?:#[\da-f]{3,8}|rgba?\([\d\s.,%]+\)))$/i;

export const articleCtaAllowedStyles: NonNullable<IOptions["allowedStyles"]> = {
  "*": {
    color: [color],
    background: [background],
    "background-color": [color],
    border: [border],
    "border-top": [border],
    "border-bottom": [border],
    "border-left": [border],
    "border-right": [border],
    "border-color": [color],
    "border-width": [lengths],
    "border-style": [/^(?:solid|dashed|dotted|none)$/],
    "border-radius": [lengths],
    "box-shadow": [shadow],
    padding: [lengths],
    "padding-top": [lengths],
    "padding-bottom": [lengths],
    "padding-left": [lengths],
    "padding-right": [lengths],
    margin: [lengths],
    "margin-top": [lengths],
    "margin-bottom": [lengths],
    "margin-left": [lengths],
    "margin-right": [lengths],
    width: [lengths],
    "max-width": [lengths],
    "min-width": [lengths],
    "min-height": [lengths],
    display: [/^(?:block|inline|inline-block|flex|inline-flex|grid)$/],
    flex: [/^(?:\d+(?:\.\d+)?\s*){1,2}(?:\d+(?:\.\d+)?(?:px|rem|em|%)|auto)?$/],
    "flex-wrap": [/^wrap$/],
    "flex-direction": [/^(?:row|column)$/],
    "align-items": [/^(?:center|stretch|flex-start|flex-end)$/],
    "align-self": [/^(?:center|stretch|flex-start|flex-end)$/],
    "justify-content": [
      /^(?:center|space-between|space-around|flex-start|flex-end)$/,
    ],
    gap: [lengths],
    "font-size": [/^\d+(?:\.\d+)?(?:px|rem|em|%)$/],
    "font-weight": [/^(?:[1-9]00|normal|bold|bolder)$/],
    "font-style": [/^(?:normal|italic)$/],
    "line-height": [/^\d+(?:\.\d+)?(?:px|rem|em|%)?$/],
    "letter-spacing": [/^\d+(?:\.\d+)?(?:px|rem|em)$/],
    "text-align": [/^(?:left|right|center|justify)$/],
    "text-decoration": [/^(?:none|underline)$/],
    "text-transform": [/^(?:none|uppercase|lowercase|capitalize)$/],
    overflow: [/^hidden$/],
  },
};

export function prepareBlogCtaMarkup(raw: string) {
  const document = parseDocument(raw);
  const nodes = DomUtils.findAll(() => true, document.children);
  // Presentation markers are generated here, never trusted from source HTML.
  for (const node of nodes) {
    for (const attr of Object.keys(node.attribs))
      if (attr.startsWith("data-article-")) delete node.attribs[attr];
    if (node.name === "div" && panelStyle.test(node.attribs.style || ""))
      node.attribs["data-article-panel"] = "true";
    if (
      node.name === "div" &&
      /border-top\s*:[^;]*dashed/i.test(node.attribs.style || "")
    )
      node.attribs["data-article-section"] = "conclusion";
  }

  const styled = new Set<(typeof nodes)[number]>();
  for (const button of nodes) {
    if (button.name !== "a") continue;
    const kind = articleButtonKind(button.attribs);
    if (!kind) continue;
    let parent = button.parent;
    let panel: (typeof nodes)[number] | undefined;
    while (parent?.type === "tag") {
      if (
        !["div", "section", "aside", "p"].includes(parent.name) ||
        DomUtils.existsOne((node) => node.name === "h2", parent.children)
      )
        break;
      if (
        ["div", "section", "aside"].includes(parent.name) &&
        panelStyle.test(parent.attribs.style || "")
      )
        panel = parent;
      parent = parent.parent;
    }
    if (!panel) continue;
    panel.attribs["data-article-cta"] = kind;
    panel.attribs["data-article-cta-source"] = "";
    styled.add(panel);
    for (const node of DomUtils.findAll(() => true, panel.children))
      styled.add(node);
  }
  for (const node of nodes) {
    if (!styled.has(node)) {
      // Cell backgrounds can be article content, such as a color chart.
      // Keep solid colors only; the article layout still uses local styles.
      const cellBackground =
        node.name === "td"
          ? (node.attribs.style || "")
              .split(";")
              .flatMap((declaration) => {
                const match = declaration.match(
                  /^\s*(background(?:-color)?)\s*:\s*(.*?)\s*$/i,
                );
                return match && color.test(match[2])
                  ? [`${match[1].toLowerCase()}:${match[2]}`]
                  : [];
              })
              .join(";")
          : "";
      if (cellBackground) node.attribs.style = cellBackground;
      else delete node.attribs.style;
    }
    // wpautop leaves empty paragraphs around HTML comments in flex layouts.
    if (
      styled.has(node) &&
      node.name === "p" &&
      !DomUtils.textContent(node).trim() &&
      !DomUtils.existsOne((child) => child.name !== "br", node.children)
    )
      DomUtils.removeElement(node);
  }
  return DomUtils.getOuterHTML(document);
}
