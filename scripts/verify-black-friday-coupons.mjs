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
const hidden = load(source, imports).getBlackFridayCoupons();
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

// Exercise future publication in memory, without changing the disabled source flag.
const published = load(
  source.replace(
    "const publishCouponCodes = false;",
    "const publishCouponCodes = true;",
  ),
  imports,
).getBlackFridayCoupons();
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
    ".next/server/app/black-friday.html",
    ".next/server/app/black-friday.rsc",
  ]) {
    const content = await fs.readFile(file, "utf8");
    assert(content.includes("BF26-XXXXX"));
    for (const [, , , code] of expected)
      assert(!content.includes(code), `Unpublished coupon exposed in ${file}`);
  }
  console.log(
    `Coupon privacy: ${checked} production client assets, prerendered HTML and RSC contain no unpublished codes.`,
  );
}
console.log(
  "Coupons: exact service/cycle/discount mapping, hidden placeholders and future publication passed.",
);
