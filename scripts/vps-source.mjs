import fs from "node:fs/promises";
import path from "node:path";
import ts from "typescript";
import { decodeHTML } from "entities";

const assetPrefix = "/images/vps";

// Read content expressions without running the old app or its build scripts.
function evaluate(node, context) {
  if (ts.isStringLiteralLike(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (ts.isIdentifier(node)) return context[node.text] ?? node.text;
  if (ts.isParenthesizedExpression(node))
    return evaluate(node.expression, context);
  if (ts.isConditionalExpression(node))
    return evaluate(
      evaluate(node.condition, context) ? node.whenTrue : node.whenFalse,
      context,
    );
  if (ts.isArrayLiteralExpression(node))
    return node.elements.flatMap((element) =>
      ts.isSpreadElement(element)
        ? evaluate(element.expression, context)
        : [evaluate(element, context)],
    );
  if (ts.isObjectLiteralExpression(node))
    return Object.fromEntries(
      node.properties
        .map((property) => {
          if (!ts.isPropertyAssignment(property))
            throw new Error("Unsupported content object");
          return [property.name.text, evaluate(property.initializer, context)];
        })
        .filter(([key]) => key !== "logoClass"),
    );
  if (ts.isCallExpression(node) && node.expression.getText() === "publicAsset")
    return evaluate(node.arguments[0], context);
  throw new Error(
    `Unsupported content expression: ${node.getText().slice(0, 100)}`,
  );
}

function inlineText(node, context) {
  if (ts.isJsxText(node))
    return decodeHTML(node.text.replace(/\s+/g, " ").trim());
  if (ts.isJsxExpression(node)) {
    if (!node.expression) return "";
    if (
      !ts.isStringLiteralLike(node.expression) &&
      !ts.isConditionalExpression(node.expression)
    )
      return null;
    try {
      const value = evaluate(node.expression, context);
      return typeof value === "string" ? value : null;
    } catch {
      return null;
    }
  }
  if (ts.isJsxSelfClosingElement(node)) return "";
  if (ts.isJsxElement(node) || ts.isJsxFragment(node)) {
    const children = node.children.map((child) => inlineText(child, context));
    if (children.some((child) => child === null)) return null;
    return children.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
  }
  return "";
}

function readContent(text, context) {
  const source = ts.createSourceFile(
    "source.jsx",
    text,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.JSX,
  );
  const declarations = {};
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (!declaration.initializer || !ts.isIdentifier(declaration.name))
        continue;
      try {
        declarations[declaration.name.text] = evaluate(
          declaration.initializer,
          { ...context, ...declarations },
        );
      } catch {
        /* Functions and implementation expressions are not content. */
      }
    }
  }
  const blocks = [];
  const headers = {};
  const arrays = {};
  function walk(node, inTextBlock = false, functionName = "default") {
    if (ts.isFunctionDeclaration(node))
      functionName = node.name?.text || "default";
    const isElement = ts.isJsxElement(node);
    const tag = isElement ? node.openingElement.tagName.getText(source) : "";
    const isTextBlock = [
      "h1",
      "h2",
      "h3",
      "p",
      "span",
      "a",
      "summary",
      "button",
    ].includes(tag);
    if (isTextBlock && !inTextBlock) {
      const value = inlineText(node, context);
      if (value && !["“ ”"].includes(value))
        blocks.push({ function: functionName, tag, text: value });
    }
    if (
      ts.isJsxSelfClosingElement(node) &&
      node.tagName.getText(source) === "SectionHeader"
    ) {
      headers[functionName] = Object.fromEntries(
        node.attributes.properties
          .filter(ts.isJsxAttribute)
          .flatMap((attr) => {
            if (!attr.initializer) return [];
            if (ts.isStringLiteral(attr.initializer))
              return [[attr.name.text, attr.initializer.text]];
            if (
              ts.isJsxExpression(attr.initializer) &&
              attr.initializer.expression
            ) {
              try {
                return [
                  [
                    attr.name.text,
                    evaluate(attr.initializer.expression, context),
                  ],
                ];
              } catch {
                return [];
              }
            }
            return [];
          })
          .filter(([key]) => key !== "tone"),
      );
    }
    if (functionName !== "default" && ts.isArrayLiteralExpression(node)) {
      try {
        (arrays[functionName] ??= []).push(evaluate(node, context));
      } catch {}
    }
    ts.forEachChild(node, (child) =>
      walk(child, inTextBlock || isTextBlock, functionName),
    );
  }
  walk(source);
  return { declarations, blocks, headers, arrays };
}

export async function readVpsSource(root) {
  const files = {};
  const read = async (file) =>
    (files[file] ??= await fs.readFile(path.join(root, file), "utf8"));
  const visibility = readContent(
    await read("lib/content-visibility.js"),
    {},
  ).declarations;
  const pricingVisibility = readContent(
    await read("lib/pricing-visibility.js"),
    {},
  ).declarations;
  const parse = async (file) => readContent(await read(file), visibility);
  const hero = await parse("components/header/index.js");
  const landing = await parse("components/landing-sections.js");
  const comparison = await parse("components/vps-type.js");
  const testimonials = await parse("components/testimonials-2.jsx");
  const press = await parse("components/partners.js");
  const faqData = await parse("components/data/faqs.js");
  const faq = await parse("components/faq.js");
  const cta = await parse("components/cta-section.jsx");
  const learning = await parse("components/vps-learning-section.jsx");
  const pricing = await parse("components/pricing/index.js");
  const pricingServices = await parse("components/pricing/services.js");
  const hotDeals = await parse("components/hot-deals-client.jsx");
  const hotOriginal = await parse(
    "components/data/hot-deals-original-prices.js",
  );
  const metadata = await parse("app/page.js");
  const menus = JSON.parse(await read("app/menu.json"));
  const services = menus
    .filter((item, index) => item.type === "vps" && index !== 0)
    .flatMap((item) => item.items)
    .filter((item) => item.gid && item.gid !== 11 && item.gid !== 101);
  if (pricingVisibility.SHOW_VIETTEL_HCM_SERVICE)
    services.splice(
      services.findIndex((item) => item.gid === 29) + 1,
      0,
      pricingServices.declarations.VIETTEL_HCM_SERVICE,
    );
  const data = {
    metadata: {
      title: metadata.declarations.title,
      description: metadata.declarations.description,
    },
    hero: {
      ticks: hero.declarations.featureTicks,
      proof: hero.declarations.proofItems,
      blocks: hero.blocks,
      background: "/assets/images/hero-datacenter.jpg",
    },
    landing: {
      ...Object.fromEntries(
        [
          "infrastructure",
          "reasons",
          "apps",
          "operatingSystems",
          "useCases",
          "process",
          "benchmarkGroups",
        ].map((key) => [key, landing.declarations[key]]),
      ),
      headers: landing.headers,
      blocks: landing.blocks,
      definitionCards: landing.arrays.VpsDefinition?.[0],
      benchmarkChecklist: landing.arrays.Performance?.[0],
    },
    comparison: {
      rows: comparison.declarations.comparisonRows,
      columns: comparison.declarations.columns,
      blocks: comparison.blocks,
    },
    testimonials: {
      items: testimonials.declarations.testimonials,
      ratings: testimonials.declarations.ratings,
      blocks: testimonials.blocks,
    },
    press: { items: press.declarations.newsItems, blocks: press.blocks },
    faq: {
      items: [
        ...faqData.declarations.faqsLeft,
        ...faqData.declarations.faqsRight,
      ],
      blocks: faq.blocks,
    },
    cta: { blocks: cta.blocks },
    learning: {
      ...Object.fromEntries(
        ["resources", "comparisonRows", "workloads", "operationsChecklist"].map(
          (key) => [key, learning.declarations[key]],
        ),
      ),
      blocks: learning.blocks,
      inlineArrays: learning.arrays.VpsLearningSection,
    },
    pricing: {
      services: services.map((item) => ({
        gid: item.gid,
        label:
          pricingServices.declarations.PRICING_TAB_LABELS[item.gid] ||
          item.label,
        href: item.link,
      })),
      defaultGid: pricingVisibility.DEFAULT_PRICING_GID,
      blocks: pricing.blocks,
    },
    hotDeals: {
      originalPrices: hotOriginal.declarations.HOT_DEALS_ORIGINAL_PRICES,
      cycles: hotDeals.declarations.cycleDefinitions,
      blocks: hotDeals.blocks,
    },
  };
  const assets = new Set();
  function rewrite(value, key = "") {
    if (
      typeof value === "string" &&
      ["src", "logo", "thumb", "partnerLogo", "background"].includes(key) &&
      value.startsWith("/")
    ) {
      assets.add(value);
      return assetPrefix + value;
    }
    if (Array.isArray(value)) return value.map((item) => rewrite(item));
    if (value && typeof value === "object")
      return Object.fromEntries(
        Object.entries(value).map(([name, item]) => [
          name,
          rewrite(item, name),
        ]),
      );
    return value;
  }
  return { data: rewrite(data), assets: [...assets], files };
}
