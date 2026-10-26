import assert from "node:assert/strict";
import fs from "node:fs/promises";
import ts from "typescript";
import { decodeHTML } from "entities";

async function loadData(file, imports, fetcher = fetch) {
  const exported = {};
  new Function(
    "exports",
    "require",
    "fetch",
    ts.transpileModule(await fs.readFile(file, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        esModuleInterop: true,
      },
    }).outputText,
  )(
    exported,
    (name) => {
      assert(name in imports, `Unexpected import: ${name}`);
      return imports[name];
    },
    fetcher,
  );
  return exported;
}
const content = JSON.parse(
  await fs.readFile("src/data/vps-content.json", "utf8"),
);
const pricing = await loadData("src/data/vps-pricing.ts", {
  "./vps-content.json": content,
  entities: { decodeHTML },
});
const blackFriday = await loadData("src/data/black-friday.ts", {
  "./vps-content.json": content,
  "./vps-pricing": pricing,
  "./content": await loadData("src/data/content.ts", {
    "./articles.json": JSON.parse(
      await fs.readFile("src/data/articles.json", "utf8"),
    ),
  }),
});
const {
  getBlackFridayUpgrade: compare,
  getBlackFridaySavings: savings,
  blackFridaySpecs,
  blackFridayPlans,
} = blackFriday;
const cycles = ["annually", "biennially", "triennially"];
const fixture = (plan, specs, prices) => ({
  gid: 103,
  pid: blackFridayPlans[plan - 1].pid,
  slug: blackFridayPlans[plan - 1].slug,
  name: ["BF26 - Start", "BF26 - Core", "BF26 - Plus"][plan - 1],
  product_url: `https://support.interdata.vn/index.php?rp=/store/black-friday-2026/${blackFridayPlans[plan - 1].slug}`,
  description: `<strong><em>Tặng 1 Năm HSD khi đăng ký chu kỳ 3 Năm</em></strong>\n<strong>GIA HẠN KHÔNG ĐỔI GIÁ</strong>\n${specs}`,
  pricing: {
    VND: Object.fromEntries(cycles.map((key, i) => [key, String(prices[i])])),
  },
});
const plans = [
  fixture(1, "2 vCore\n3 GB RAM\n30 GB SSD NVMe", [998000, 1996000, 2994000]),
  fixture(2, "5 vCore\n8 GB RAM\n70 GB SSD NVMe", [2666000, 5332000, 7998000]),
  fixture(
    3,
    "9 vCore\n16 GB RAM\n140 GB SSD NVMe",
    [5888000, 11776000, 17664000],
  ),
];
for (const [i, cycle] of cycles.entries()) {
  const first = compare(plans[1], plans[0], cycle);
  const second = compare(plans[2], plans[1], cycle);
  assert.equal(first.months, [12, 24, 36][i]);
  assert.equal(first.difference, 1668000 * (i + 1));
  assert.equal(first.monthlyEquivalent, 139000);
  assert.equal(second.difference, 3222000 * (i + 1));
  assert.equal(second.monthlyEquivalent, 268500);
  assert.deepEqual(
    first.resources.map(({ value }) => value),
    [3, 5, 40],
  );
  assert.deepEqual(
    second.resources.map(({ value }) => value),
    [4, 8, 70],
  );
}
for (const [index, product] of plans.entries()) {
  const annualOriginal = [3093600, 7908000, 15132000][index];
  for (const [years, cycle] of cycles.entries()) {
    assert.deepEqual(savings(product, cycle), {
      originalPrice: annualOriginal * (years + 1),
      percent: [67, 66, 61][index],
    });
    assert.equal(
      Number(product.pricing.VND[cycle]),
      Number(product.pricing.VND.annually) * (years + 1),
    );
  }
  assert.equal(blackFridaySpecs(product).length, 3);
  assert(!blackFridaySpecs(product).some((line) => /Tặng|GIA HẠN/i.test(line)));
  assert.equal(savings(product, "monthly"), null);
  assert.equal(savings({ ...product, gid: 100 }, "annually"), null);
  assert.equal(savings({ ...product, pid: 999 }, "annually"), null);
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
  "3093600",
  "3093601",
]) {
  assert.equal(savings(withPrice(plans[0], value), "annually"), null);
}
assert.equal(savings(withPrice(plans[0], "0"), "annually").percent, 100);
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
  "Black Friday savings and upgrades: annual originals × years, constant discounts, gift filtering, resource increases, monthly rounding and invalid/missing data guards passed.",
);

const loadPricing = (fetcher) =>
  loadData(
    "src/lib/black-friday-pricing.ts",
    {
      "@/data/black-friday": blackFriday,
    },
    fetcher,
  );
const respond = (products) => async (url, options) => {
  assert.equal(url, "https://support.interdata.vn/packages.php?gid=103&module");
  assert.equal(options.next.revalidate, 60);
  return { ok: true, json: async () => ({ success: true, products }) };
};
const loader = await loadPricing(respond([...plans].reverse()));
assert.deepEqual(await loader.getBlackFridayProducts(), plans);
for (const mutate of [
  (products) => products.slice(1),
  (products) => [...products, products[0]],
  (products) => products.map((p, i) => (i ? p : { ...p, gid: 100 })),
  (products) =>
    products.map((p, i) => (i ? p : { ...p, slug: "inter-platinum-1" })),
  (products) =>
    products.map((p, i) =>
      i ? p : { ...p, product_url: "https://example.com/" },
    ),
  (products) =>
    products.map((p, i) =>
      i
        ? p
        : {
            ...p,
            product_url:
              "https://support.interdata.vn/index.php?rp=/store/inter-platinum-series-2026/inter-platinum-1",
          },
    ),
  (products) =>
    products.map((p, i) =>
      i ? p : { ...p, pricing: { VND: { annually: "-1" } } },
    ),
]) {
  const invalid = await loadPricing(respond(mutate(plans)));
  await assert.rejects(() => invalid.getBlackFridayProducts());
}
const unavailableCycle = await loadPricing(
  respond(
    plans.map((p) => ({
      ...p,
      pricing: { VND: { ...p.pricing.VND, annually: "-1", monthly: "100" } },
    })),
  ),
);
for (const product of await unavailableCycle.getBlackFridayProducts()) {
  assert.equal(product.pricing.VND.annually, undefined);
  assert.equal(product.pricing.VND.monthly, undefined);
  assert(product.pricing.VND.biennially);
}
for (const response of [
  { ok: false, status: 503 },
  { ok: true, json: async () => ({ success: false, products: plans }) },
  { ok: true, json: async () => ({ success: true }) },
]) {
  const invalid = await loadPricing(async () => response);
  await assert.rejects(() => invalid.getBlackFridayProducts());
}
console.log(
  "Black Friday API: official IDs/order, checkout destinations, cycle validation and failure guards passed.",
);
