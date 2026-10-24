import { parseDocument, DomUtils } from "htmlparser2";

type Element = ReturnType<typeof DomUtils.findAll>[number];
const fold = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
const elements = (node: Element) =>
  node.children.filter((child): child is Element => child.type === "tag");
const containsHeading = (node: Element) =>
  node.name === "h2" ||
  DomUtils.existsOne((child) => child.name === "h2", node.children);

export function frameBlogContent(html: string) {
  const document = parseDocument(html);
  // Only presentation is changed; no article copy is generated or rewritten.
  const panels = DomUtils.findAll(
    (node) => node.name === "div" || node.name === "nav",
    document.children,
  );
  for (const panel of panels) {
    const title = elements(panel)[0];
    const links = DomUtils.findAll((node) => node.name === "a", panel.children);
    if (
      title &&
      ["noi dung bai viet", "noi dung", "muc luc"].includes(
        fold(DomUtils.textContent(title)),
      ) &&
      links.length &&
      links.every((link) => link.attribs.href?.startsWith("#")) &&
      !containsHeading(panel)
    )
      DomUtils.removeElement(panel);
  }

  const buttons = DomUtils.findAll(
    (node) =>
      node.name === "a" &&
      ["vps", "deals", "cloud"].includes(node.attribs["data-article-button"]),
    document.children,
  );
  for (const button of buttons) {
    let parent = button.parent;
    let panel: Element | undefined;
    while (parent && parent.type === "tag" && parent.name !== "section") {
      const candidates = DomUtils.findAll(
        (node) => node.name === "a" && !!node.attribs["data-article-button"],
        parent.children,
      );
      if (containsHeading(parent) || candidates.length !== 1) break;
      if (parent.attribs["data-article-panel"] === "true") panel = parent;
      parent = parent.parent;
    }
    if (!panel) continue;
    panel.attribs["data-article-cta"] = button.attribs["data-article-button"];
    const children = elements(panel);
    const hasCopyColumn = children.some(
      (child) =>
        child.name === "div" &&
        DomUtils.existsOne((node) => node === button, child.children),
    );
    for (const child of children) {
      if (child.name !== "div") continue;
      if (
        (DomUtils.existsOne((node) => node.name === "img", child.children) ||
          (hasCopyColumn && DomUtils.textContent(child).trim())) &&
        !DomUtils.existsOne((node) => node === button, child.children)
      )
        child.attribs["data-article-cta-media"] = "";
      if (DomUtils.existsOne((node) => node === button, child.children))
        child.attribs["data-article-cta-copy"] = "";
    }
    const copy =
      children.find((child) => "data-article-cta-copy" in child.attribs) ||
      panel;
    if (
      !DomUtils.existsOne((node) => /^h[2-4]$/.test(node.name), copy.children)
    ) {
      const firstParagraph = elements(copy).find((node) => node.name === "p");
      if (firstParagraph) firstParagraph.attribs["data-article-cta-title"] = "";
    }
  }

  const paragraphs = DomUtils.findAll(
    (node) => node.name === "p",
    document.children,
  );
  for (const paragraph of paragraphs) {
    if (
      /^noi dung (?:chi )?mang tinh (?:chat )?tham khao\b/.test(
        fold(DomUtils.textContent(paragraph)),
      )
    )
      paragraph.attribs["data-article-disclaimer"] = "";
  }
  const headings = DomUtils.findAll(
    (node) => node.name === "h2",
    document.children,
  );
  for (const heading of headings) {
    const title = fold(DomUtils.textContent(heading)).replace(
      /^(?:\d+|[ivx]+)[.)]\s*/,
      "",
    );
    const kind = /^(?:(?:nhung|cac) )?cau hoi thuong gap\b|^faqs?\b/.test(title)
      ? "faq"
      : /^(?:ket luan|tong ket|loi ket|tom lai)\b/.test(title)
        ? "conclusion"
        : "";
    if (!kind || !heading.parent) continue;
    const parent = heading.parent;
    if (parent.type === "tag" && parent.attribs["data-article-section"])
      continue;
    if (
      parent.type === "tag" &&
      parent.name === "div" &&
      DomUtils.findAll((node) => node.name === "h2", parent.children).length ===
        1
    ) {
      parent.attribs["data-article-section"] = kind;
      continue;
    }
    const siblings = [...parent.children];
    const start = siblings.indexOf(heading);
    const group = [];
    for (const node of siblings.slice(start)) {
      if (
        node !== heading &&
        node.type === "tag" &&
        (containsHeading(node) ||
          node.attribs["data-article-section"] ||
          "data-article-disclaimer" in node.attribs)
      )
        break;
      group.push(node);
    }
    const wrapper = parseDocument(
      `<section data-article-section="${kind}"></section>`,
    ).children[0];
    if (wrapper.type !== "tag") continue;
    DomUtils.prepend(heading, wrapper);
    for (const node of group) DomUtils.appendChild(wrapper, node);
  }
  for (const node of DomUtils.findAll(() => true, document.children)) {
    delete node.attribs["data-article-panel"];
    if (!node.attribs["data-article-section"])
      delete node.attribs["data-article-section"];
    if (!node.attribs["data-article-button"])
      delete node.attribs["data-article-button"];
  }
  const split = document.children.findIndex(
    (node) =>
      node.type === "tag" &&
      (containsHeading(node) ||
        node.attribs.class?.split(/\s+/).includes("interdata-plan-carousel")),
  );
  const serialize = (nodes: typeof document.children) =>
    nodes.map((node) => DomUtils.getOuterHTML(node)).join("");
  return split < 0
    ? { opening: "", body: serialize(document.children) }
    : {
        opening: serialize(document.children.slice(0, split)),
        body: serialize(document.children.slice(split)),
      };
}
