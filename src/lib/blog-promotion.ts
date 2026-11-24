import "server-only";
import { connection } from "next/server";
import { parseDocument, DomUtils } from "htmlparser2";
import {
  blogPromotionWeights,
  type BlogPromotionPlacement,
} from "@/data/promotions";

export function chooseBlogPromotionPlacement(
  random: number,
  middleAvailable = true,
): BlogPromotionPlacement {
  const options = (
    Object.entries(blogPromotionWeights) as [BlogPromotionPlacement, number][]
  ).filter(([placement]) => middleAvailable || placement !== "middle");
  const total = options.reduce((sum, [, weight]) => sum + weight, 0);
  let remaining = Math.min(1, Math.max(0, random)) * total;
  for (const [placement, weight] of options) {
    remaining -= weight;
    if (remaining < 0) return placement;
  }
  return "end";
}

export async function getBlogPromotionPlacement(middleAvailable = true) {
  // Choose once per request, outside the prerender cache, without client relocation.
  // WordPress data retains its existing five-minute fetch cache.
  await connection();
  return chooseBlogPromotionPlacement(Math.random(), middleAvailable);
}

/** Split only between complete top-level sections; preserve all source HTML. */
export function splitBlogPromotionBody(
  html: string,
): { before: string; after: string } | null {
  const nodes = parseDocument(html).children;
  const lengths = nodes.map((node) => DomUtils.textContent(node).trim().length);
  const total = lengths.reduce((sum, length) => sum + length, 0);
  let before = 0;
  let previousTag = "";
  let previousPromotion = false;
  let best = -1;
  let distance = Infinity;
  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index];
    if (node.type === "tag") {
      const startsSection =
        node.name === "h2" ||
        (["section", "div"].includes(node.name) &&
          !node.attribs["data-article-cta"] &&
          DomUtils.existsOne((child) => child.name === "h2", node.children));
      if (
        startsSection &&
        !previousPromotion &&
        !/^h[1-6]$/.test(previousTag) &&
        before >= 300 &&
        total - before >= 300
      ) {
        const current = Math.abs(before - total / 2);
        if (current < distance) {
          best = index;
          distance = current;
        }
      }
      previousTag = node.name;
      previousPromotion = !!node.attribs["data-article-cta"];
    }
    before += lengths[index];
  }
  if (best < 0) return null;
  const serialize = (parts: typeof nodes) =>
    parts.map((node) => DomUtils.getOuterHTML(node)).join("");
  return {
    before: serialize(nodes.slice(0, best)),
    after: serialize(nodes.slice(best)),
  };
}
