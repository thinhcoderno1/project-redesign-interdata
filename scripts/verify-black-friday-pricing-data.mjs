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

const pricing = await loadData("src/data/vps-pricing.ts", {
  "./vps-content.json": JSON.parse(
    await fs.readFile("src/data/vps-content.json", "utf8"),
  ),
  entities: { decodeHTML },
});
const cycles = ["annually", "biennially", "triennially"];
const testPlans = Array.from({ length: 8 }, (_, index) => {
  const pid = 570 + index;
  const slug = `bf26-platinum-p${index + 1}`;
  const description =
    `${index ? "<strong>Tặng Ly sứ + Nón bảo hiểm InterData + 100GB S3 Storage khi đăng ký chu kỳ 3 Năm</strong>\n" : ""}` +
    `<strong>GIA HẠN KHÔNG ĐỔI GIÁ</strong>\n${index + 2} vCore<br>2&nbsp;GB RAM\n30 GB SSD NVMe\n1 IPv4 Public Global\n1Gbps Network Port\nUnlimited Bandwidth\n<strong>FIREWALL 120 Gbps</strong>`;
  return {
    gid: 105,
    pid,
    slug,
    name: `BF26-Platinum P${index + 1}`,
    product_url: `https://support.interdata.vn/index.php?rp=/store/black-friday-26-vps-intel-platinum-gen2/${slug}`,
    description,
    pricing: {
      VND: {
        annually: "1234000.00",
        biennially: "2344600.00",
        triennially: "3331800.00",
      },
    },
  };
});
const referencePlan = {
  description: "2 vCPU Platinum Gen2\n2 GB RAM\n30 GB NVMe U.2",
  pricing: { VND: { annually: "2853600.00" } },
};

const loadPricing = (fetcher, getViettelPlans = async () => [referencePlan]) =>
  loadData(
    "src/lib/black-friday-pricing.ts",
    {
      "@/data/vps-pricing": pricing,
      "./vps-platinum-pricing": {
        getPlatinumProducts: (gid) => {
          assert.equal(gid, 101);
          return getViettelPlans();
        },
      },
    },
    fetcher,
  );
const respond = (products) => async (url, options) => {
  assert.equal(url, "https://support.interdata.vn/packages.php?gid=105&module");
  assert.equal(options.next.revalidate, 60);
  return { ok: true, json: async () => ({ success: true, products }) };
};
const loader = await loadPricing(respond([...testPlans].reverse()));
const products = await loader.getBlackFridayProducts();
assert.deepEqual(
  products.map(({ pid }) => pid),
  testPlans.map(({ pid }) => pid),
);
assert.deepEqual(
  products.map(({ pricing }) => pricing),
  testPlans.map(({ pricing }) => pricing),
);
assert.equal(products[0].name, "BF26 PLATINUM P1");
assert.deepEqual(products[0].resources, { cpu: 2, ram: 2, nvme: 30 });
assert.equal(products[0].ipv4, "01 IPv4 Public");
assert.equal(products[0].port, "1Gbps Network Port");
assert.equal(products[0].bandwidth, "Unlimited Bandwidth");
assert.equal(products[0].firewall, "Firewall Anti DDoS 120Gbps");
assert.deepEqual(products[0].gifts, []);
assert.deepEqual(products[1].gifts, [
  "Nón bảo hiểm InterData",
  "Ly sứ InterData",
  "100GB S3 Storage",
]);
assert.deepEqual(products[0].referencePrices, {
  annually: { amount: 2_853_600, source: "portal" },
});
assert.deepEqual(products[1].referencePrices, {
  annually: { amount: 4_236_000, source: "estimate" },
  biennially: { amount: 8_028_000, source: "estimate" },
  triennially: { amount: 11_376_000, source: "estimate" },
});
const offlineReferences = await loadPricing(respond(testPlans), async () => {
  throw new Error("Reference catalog is unavailable");
});
const [first, second] = await offlineReferences.getBlackFridayProducts();
assert.deepEqual(first.referencePrices, {});
assert.deepEqual(second.referencePrices, products[1].referencePrices);

const updateFirst = (products, changes) => [
  { ...products[0], ...changes },
  ...products.slice(1),
];
for (const mutate of [
  (products) => products.slice(1),
  (products) => [...products, products[0]],
  (products) => updateFirst(products, { gid: 103 }),
  (products) => updateFirst(products, { slug: "bf26-start" }),
  (products) => updateFirst(products, { product_url: "https://example.com/" }),
  (products) =>
    updateFirst(products, {
      product_url: products[0].product_url + "&billingcycle=annually",
    }),
  (products) => updateFirst(products, { pricing: { VND: { annually: "-1" } } }),
]) {
  const invalid = await loadPricing(respond(mutate(testPlans)));
  await assert.rejects(() => invalid.getBlackFridayProducts());
}

const unavailableCycle = await loadPricing(
  respond(
    updateFirst(testPlans, {
      pricing: {
        VND: { ...testPlans[0].pricing.VND, annually: "-1", monthly: "100" },
      },
    }),
  ),
);
const [missingAnnual] = await unavailableCycle.getBlackFridayProducts();
assert.deepEqual(Object.keys(missingAnnual.pricing.VND), cycles.slice(1));
assert.equal(missingAnnual.referencePrices.annually, undefined);
for (const response of [
  { ok: false, status: 503 },
  { ok: true, json: async () => ({ success: false, products: testPlans }) },
  { ok: true, json: async () => ({ success: true }) },
]) {
  const invalid = await loadPricing(async () => response);
  await assert.rejects(() => invalid.getBlackFridayProducts());
}
console.log(
  "Black Friday Platinum catalog, configuration, gifts, reference prices and failure handling passed.",
);
