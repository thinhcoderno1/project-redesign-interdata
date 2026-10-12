import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { readVpsSource } from "./vps-source.mjs";

const root = process.argv[2];
if (!root) throw new Error("Provide the old VPS project directory.");
const { data, assets, files } = await readVpsSource(root);
await fs.mkdir("public/images/vps", { recursive: true });
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const copied = [];
for (const asset of assets) {
  const original = path.join(root, "public", asset);
  const destination = path.join("public", "images", "vps", asset);
  const bytes = await fs.readFile(original);
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.writeFile(destination, bytes);
  copied.push({
    source: `public${asset}`,
    target: `public/images/vps${asset}`,
    sha256: hash(bytes),
  });
}
await fs.writeFile(
  "src/data/vps-content.json",
  JSON.stringify(data, null, 2) + "\n",
);
await fs.mkdir("docs", { recursive: true });
await fs.writeFile(
  "docs/vps-source-manifest.json",
  JSON.stringify(
    {
      sourceProject: "D:/InterData/thue-vps",
      files: Object.entries(files).map(([file, text]) => ({
        file,
        sha256: hash(text),
      })),
      assets: copied,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  JSON.stringify(
    {
      assets: copied.length,
      services: data.pricing.services,
      faqs: data.faq.items.length,
      definitions: data.landing.definitionCards,
      inlineArrays: data.learning.inlineArrays,
      blocks: data.learning.blocks,
    },
    null,
    2,
  ),
);
