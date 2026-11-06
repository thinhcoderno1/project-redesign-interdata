import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import ts from "typescript";

function load(source, imports) {
  const exports = {};
  new Function(
    "exports",
    "require",
    ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        esModuleInterop: true,
      },
    }).outputText,
  )(exports, (name) => {
    assert(name in imports, `Unexpected import: ${name}`);
    return imports[name];
  });
  return exports;
}

const data = load(await fs.readFile("src/data/black-friday.ts", "utf8"), {
  "./vps-content.json": JSON.parse(
    await fs.readFile("src/data/vps-content.json", "utf8"),
  ),
  "./content": { links: { vps: "/thue-vps/", cloud: "/cloud-server/" } },
  "./vps-pricing": {},
});
const source = await fs.readFile("src/lib/black-friday-coupons.ts", "utf8");
const imports = { "server-only": {}, "@/data/black-friday": data };
const expected = [
  ["VPS", 36, 71, "BF26-VPS71"],
  ["VPS", 24, 61, "BF26-VPS61"],
  ["VPS", 12, 51, "BF26-VPS51"],
  ["Cloud Server", 36, 61, "BF26-CLOUD61"],
  ["Cloud Server", 24, 51, "BF26-CLOUD51"],
  ["Cloud Server", 12, 41, "BF26-CLOUD41"],
];
const hidden = load(
  source.replace(
    "const publishCouponCodes = true;",
    "const publishCouponCodes = false;",
  ),
  imports,
).getBlackFridayCoupons();
assert.deepEqual(
  hidden.flatMap((group) =>
    group.offers.map((offer) => [
      group.service,
      offer.months,
      offer.discount,
      offer.code,
    ]),
  ),
  expected.map(([service, months, discount]) => [
    service,
    months,
    discount,
    "BF26-XXXXX",
  ]),
);
for (const [, , , code] of expected)
  assert(!JSON.stringify(hidden).includes(code));
assert.equal(data.blackFridayCouponConditions.length, 3);

// The active configuration publishes the exact code for each service and cycle.
const published = load(source, imports).getBlackFridayCoupons();
assert.deepEqual(
  published.flatMap((group) =>
    group.offers.map((offer) => [
      group.service,
      offer.months,
      offer.discount,
      offer.code,
    ]),
  ),
  expected,
);

if (process.argv.includes("--built")) {
  async function* files(directory) {
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) yield* files(file);
      else yield file;
    }
  }
  let checked = 0;
  for await (const file of files(".next/static")) {
    if (!/\.(?:js|map|json)$/.test(file)) continue;
    const content = await fs.readFile(file, "utf8");
    for (const [, , , code] of expected)
      assert(!content.includes(code), `Unpublished coupon exposed in ${file}`);
    checked++;
  }
  assert(checked > 0);
  for (const file of [
    ".next/server/app/blackfriday.html",
    ".next/server/app/blackfriday.rsc",
  ]) {
    const content = await fs.readFile(file, "utf8");
    assert(!content.includes("BF26-XXXXX"));
    for (const [, , , code] of expected)
      assert(content.includes(code), `Published coupon missing in ${file}`);
  }
  console.log(
    `Coupons: ${checked} production client assets keep code definitions server-side; prerendered HTML and RSC contain all published codes.`,
  );
}
console.log(
  "Coupons: exact published service/cycle/discount mapping and disabled-mode placeholders passed.",
);
