import { parseDocument, DomUtils } from "htmlparser2";

const planClass =
  /^interdata-bf26-(plan-(?:carousel|viewport|track|card|title|price|badge|features|icon|spacer|button)|carousel-(?:heading|arrow|prev|next|mark))$/;
const icons = new Set(["cpu", "ram", "storage", "network", "gift"]);

// Adapt the service UX Block's known markup to locally maintained styles and
// controls. Source CSS, inline scripts and arbitrary SVG are still discarded.
export function prepareBlogPlans(raw: string) {
  const document = parseDocument(raw);
  const blocks = DomUtils.findAll(
    (node) =>
      node.attribs.class
        ?.split(/\s+/)
        .includes("interdata-bf26-plan-carousel") || false,
    document.children,
  );
  for (const block of blocks) {
    const nodes = [block, ...DomUtils.findAll(() => true, block.children)];
    for (const node of nodes) {
      if (node.attribs.class)
        node.attribs.class = node.attribs.class
          .split(/\s+/)
          .map((name) => name.replace(planClass, "interdata-$1"))
          .join(" ");
      if (node.attribs.class?.split(/\s+/).includes("interdata-plan-icon")) {
        const reference = DomUtils.findOne(
          (child) => child.name === "use",
          node.children,
        );
        const icon = reference?.attribs.href?.match(
          /^#id-bf26-icon-(\w+)$/,
        )?.[1];
        if (icon && icons.has(icon))
          node.attribs.class += ` interdata-plan-icon-${icon}`;
        node.attribs["aria-hidden"] = "true";
      }
      if (
        node.attribs.class?.split(/\s+/).includes("interdata-plan-viewport")
      ) {
        node.attribs.tabindex = "0";
        node.attribs["aria-label"] = "Danh sách gói dịch vụ ưu đãi";
        node.attribs.role = "group";
      }
    }
    block.attribs["data-article-plan-theme"] = "bf26";
    block.attribs.role = "region";
    const heading = nodes.find(
      (node) => node.attribs.class === "interdata-carousel-heading",
    );
    block.attribs["aria-label"] = heading
      ? DomUtils.textContent(heading).trim()
      : "Gói dịch vụ ưu đãi";
    for (const svg of DomUtils.findAll(
      (node) => node.name === "svg",
      block.children,
    ))
      DomUtils.removeElement(svg);
  }
  return DomUtils.getOuterHTML(document);
}
