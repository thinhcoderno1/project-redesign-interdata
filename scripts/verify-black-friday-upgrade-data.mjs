import assert from "node:assert/strict";
import fs from "node:fs/promises";
import ts from "typescript";
import { decodeHTML } from "entities";

async function loadData(file, imports) {
  const exported = {};
  new Function(
    "exports",
    "require",
    ts.transpileModule(await fs.readFile(file, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        esModuleInterop: true,
      },
    }).outputText,
  )(exported, (name) => {
    assert(name in imports, `Unexpected import: ${name}`);
    return imports[name];
  });
  return exported;
}
const content = JSON.parse(
  await fs.readFile("src/data/vps-content.json", "utf8"),
);
const pricing = await loadData("src/data/vps-pricing.ts", {
  "./vps-content.json": content,
  entities: { decodeHTML },
});
const { getBlackFridayUpgrade: compare } = await loadData(
  "src/data/black-friday.ts",
  {
    "./vps-content.json": content,
    "./vps-pricing": pricing,
    "./content": await loadData("src/data/content.ts", {
      "./articles.json": JSON.parse(
        await fs.readFile("src/data/articles.json", "utf8"),
      ),
    }),
  },
);
const cycles = ["annually", "biennially", "triennially"];
const fixture = (plan, specs, prices) => ({
  gid: 100,
  name: `INTER PLATINUM ${plan}`,
  description: `<strong>GIA HẠN KHÔNG ĐỔI GIÁ</strong>\n${specs}`,
  pricing: {
    VND: Object.fromEntries(cycles.map((key, i) => [key, String(prices[i])])),
  },
});
const plans = [
  fixture(1, "2 vCore\n3 GB RAM\n30 GB SSD NVMe", [998000, 1796400, 2395200]),
  fixture(2, "5 vCore\n8 GB RAM\n70 GB SSD NVMe", [2666000, 4798800, 6398400]),
  fixture(
    3,
    "9 vCore\n16 GB RAM\n140 GB SSD NVMe",
    [5888000, 10598400, 14131200],
  ),
];
for (const [i, cycle] of cycles.entries()) {
  const first = compare(plans[1], plans[0], cycle);
  const second = compare(plans[2], plans[1], cycle);
  assert.equal(first.months, [12, 24, 36][i]);
  assert.equal(first.difference, [1668000, 3002400, 4003200][i]);
  assert.equal(first.monthlyEquivalent, [139000, 125100, 111200][i]);
  assert.equal(second.difference, [3222000, 5799600, 7732800][i]);
  assert.equal(second.monthlyEquivalent, [268500, 241650, 214800][i]);
  assert.deepEqual(
    first.resources.map(({ value }) => value),
    [3, 5, 40],
  );
  assert.deepEqual(
    second.resources.map(({ value }) => value),
    [4, 8, 70],
  );
}
const withPrice = (product, value) => ({
  ...product,
  pricing: { VND: { annually: value } },
});
for (const value of [
  undefined,
  "",
  " ",
  "NaN",
  "Infinity",
  "-1",
  "998000",
  "1",
]) {
  assert.equal(compare(withPrice(plans[1], value), plans[0], "annually"), null);
}
for (const value of [undefined, "", " ", "NaN", "Infinity", "-1"]) {
  assert.equal(compare(plans[1], withPrice(plans[0], value), "annually"), null);
}
assert.equal(compare(plans[0], undefined, "annually"), null);
assert.equal(compare(plans[2], plans[0], "annually"), null);
assert.equal(compare(plans[1], plans[0], "monthly"), null);
assert.equal(compare({ ...plans[1], gid: 101 }, plans[0], "annually"), null);
assert.equal(compare(plans[1], { ...plans[0], gid: 101 }, "annually"), null);
for (const description of [
  "5 vCore\n8 GB RAM",
  "5 vCore\n8 GB RAM\n1 TB SSD NVMe",
  "5 vCore\n6 vCore\n8 GB RAM\n70 GB SSD NVMe",
  "1 vCore\n8 GB RAM\n70 GB SSD NVMe",
  "0 vCore\n8 GB RAM\n70 GB SSD NVMe",
  plans[0].description,
]) {
  assert.equal(
    compare({ ...plans[1], description }, plans[0], "annually"),
    null,
  );
}
const fractional = compare(
  withPrice(plans[1], "100"),
  withPrice(plans[0], "0"),
  "annually",
);
assert.equal(fractional.difference, 100);
assert.equal(fractional.monthlyEquivalent, 9);
const onlyRam = compare(
  { ...plans[1], description: "2 vCore\n8 GB RAM\n30 GB SSD NVMe" },
  plans[0],
  "annually",
);
assert.deepEqual(
  onlyRam.resources.map(({ key, value }) => [key, value]),
  [["ram", 5]],
);
assert.equal(
  compare(
    { ...plans[1], description: "5 vCore<br>8&nbsp;GB RAM<br>70 GB SSD NVMe" },
    plans[0],
    "annually",
  ).resources.length,
  3,
);
console.log(
  "Black Friday upgrades: all cycles, resource increases, monthly rounding and invalid/missing data guards passed.",
);
