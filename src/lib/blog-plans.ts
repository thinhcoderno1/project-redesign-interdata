import { DomUtils, parseDocument } from "htmlparser2";

const serviceCarouselClass =
  /(?:^|\s)interdata-(?:bf26-)?plan-carousel(?:\s|$)/;
const serviceShortcode =
  /^\[block\s+id\s*=\s*(?:"slide-dich-vu"|'slide-dich-vu'|slide-dich-vu)\s*\/?\]$/i;

export function removeBlogPlanBlocks(raw: string) {
  const document = parseDocument(raw);
  const blocks = DomUtils.findAll((node) => {
    if (
      serviceCarouselClass.test(node.attribs.class || "") ||
      Object.hasOwn(node.attribs, "data-interdata-bf26-carousel")
    )
      return true;

    const [text] = node.children;
    return (
      node.name === "p" &&
      node.children.length === 1 &&
      text?.type === "text" &&
      serviceShortcode.test(text.data.trim())
    );
  }, document.children);
  for (const block of blocks) DomUtils.removeElement(block);

  let changed = blocks.length > 0;
  // The shortcode can also appear on its own line without a WordPress paragraph.
  for (const node of document.children) {
    if (node.type !== "text") continue;
    const text = node.data
      .split("\n")
      .filter((line) => !serviceShortcode.test(line.trim()))
      .join("\n");
    if (text !== node.data) {
      node.data = text;
      changed = true;
    }
  }

  return changed ? DomUtils.getOuterHTML(document) : raw;
}
