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

const vpsContent = JSON.parse(
  await fs.readFile("src/data/vps-content.json", "utf8"),
);
const pricing = await loadData("src/data/vps-pricing.ts", {
  "./vps-content.json": vpsContent,
  entities: { decodeHTML },
});
const legacy = await loadData("src/data/black-friday-legacy-plans.ts", {
  "./vps-content.json": vpsContent,
  "./vps-pricing": pricing,
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

const loadPricing = (
  fetcher,
  getViettelPlans = async () => [referencePlan],
  getAmdPlans = async () => [],
) =>
  loadData(
    "src/lib/black-friday-pricing.ts",
    {
      "@/data/vps-pricing": pricing,
      "@/data/black-friday-legacy-plans": legacy,
      "./vps-platinum-pricing": {
        getPlatinumProducts: (gid) => {
          assert.equal(gid, 101);
          return getViettelPlans();
        },
      },
      "./vps-amd-pricing": { getAmdProducts: getAmdPlans },
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

const amdResources = [
  [2, 2, 20],
  [4, 4, 30],
  [5, 6, 60],
  [6, 8, 70],
  [8, 10, 90],
  [12, 14, 120],
  [14, 18, 140],
  [18, 32, 160],
];
const amdTestPlans = testPlans.map((plan, index) => {
  const [cpu, ram, disk] = amdResources[index];
  const slug = `bf26-amd-e${index + 1}`;
  return {
    ...plan,
    pid: 586 + index,
    gid: 107,
    slug,
    name: `BF26-AMD E${index + 1}`,
    description: `${cpu} vCore\n${ram} GB RAM\n${disk} GB SSD NVMe`,
    product_url: `https://support.interdata.vn/index.php?rp=/store/black-friday-26-vps-amd-epyc-gen2/${slug}`,
  };
});
const amdReferences = [
  [371, 1, 2, 20, 2_160_000, 4_080_000, 5_760_000],
  [372, 2, 2, 30, 3_024_000, 5_712_000, 8_064_000],
  [375, 4, 6, 60, 7_128_000, 13_464_000, 19_008_000],
  [376, 4, 8, 80, 8_640_000, 16_320_000, 23_040_000],
  [377, 6, 8, 120, 10_800_000, 20_400_000, 28_800_000],
  [378, 8, 12, 160, 15_120_000, 28_560_000, 40_320_000],
].map(([pid, cpu, ram, disk, annually, biennially, triennially]) => ({
  pid,
  description: `${cpu} vCPU AMD G2&G3\n${ram} GB RAM\n${disk} GB SSD NVMe G4 R10`,
  pricing: {
    VND: {
      annually: String(annually),
      biennially: String(biennially),
      triennially: String(triennially),
    },
  },
}));
const amdRespond =
  (plans = amdTestPlans) =>
  async (url, options) => {
    assert.equal(
      url,
      "https://support.interdata.vn/packages.php?gid=107&module",
    );
    assert.equal(options.next.revalidate, 60);
    return { ok: true, json: async () => ({ success: true, products: plans }) };
  };
const amdLoader = await loadPricing(amdRespond(), undefined, async () =>
  [...amdReferences].reverse(),
);
const amdProducts = await amdLoader.getBlackFridayAmdProducts();
const expectedAmdPrices = [
  [2_880_000, 5_520_000, 7_920_000],
  [5_664_000, 10_992_000, 15_984_000],
  [7_848_000, 14_904_000, 21_168_000],
  [10_248_000, 19_704_000, 28_368_000],
  [13_200_000, 25_440_000, 36_720_000],
  [18_720_000, 36_240_000, 52_560_000],
  [23_520_000, 45_840_000, 66_960_000],
  [34_320_000, 66_960_000, 97_920_000],
];
assert.deepEqual(
  amdProducts.map(({ pricing }) => pricing),
  amdTestPlans.map(({ pricing }) => pricing),
);
for (const [index, product] of amdProducts.entries()) {
  for (const [cycleIndex, cycle] of cycles.entries()) {
    assert.deepEqual(product.referencePrices[cycle], {
      amount: expectedAmdPrices[index][cycleIndex],
      source: "estimate",
    });
  }
}
const exactAmdReference = {
  ...amdReferences[0],
  description: "2 vCPU\n2 GB RAM\n20 GB SSD NVMe",
};
const exactAmd = await loadPricing(amdRespond(), undefined, async () => [
  exactAmdReference,
]);
assert.deepEqual(
  (await exactAmd.getBlackFridayAmdProducts())[0].referencePrices.annually,
  { amount: 2_160_000, source: "portal" },
);
// A plan with more disk cannot be used by subtracting resources to inflate a reference.
const oversizedAmd = await loadPricing(amdRespond(), undefined, async () => [
  amdReferences[1],
]);
assert.deepEqual(
  (await oversizedAmd.getBlackFridayAmdProducts())[0].referencePrices,
  {},
);
const unavailableAmd = await loadPricing(amdRespond(), undefined, async () => {
  throw new Error("Portal offline");
});
assert(
  (await unavailableAmd.getBlackFridayAmdProducts()).every(
    (product) => Object.keys(product.referencePrices).length === 0,
  ),
);
const missingAmdCycle = await loadPricing(amdRespond(), undefined, async () => [
  {
    ...exactAmdReference,
    pricing: { VND: { annually: "-1", biennially: "4080000" } },
  },
]);
assert.deepEqual(
  (await missingAmdCycle.getBlackFridayAmdProducts())[0].referencePrices,
  { biennially: { amount: 4_080_000, source: "portal" } },
);
const cheaperAmdReference = await loadPricing(
  amdRespond(),
  undefined,
  async () => [
    {
      ...exactAmdReference,
      pricing: { VND: { annually: "100" } },
    },
  ],
);
assert.deepEqual(
  (await cheaperAmdReference.getBlackFridayAmdProducts())[0].referencePrices,
  {},
);

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
const legacyPlans = legacy.blackFridayPlans.map(({ pid, slug }, index) => ({
  ...testPlans[index],
  pid,
  slug,
  gid: 103,
  name: ["BF26 - Start", "BF26 - Core", "BF26 - Plus"][index],
  product_url: `https://support.interdata.vn/index.php?rp=/store/black-friday-2026/${slug}`,
}));
const groups = [];
const allPricing = await loadPricing(async (url, options) => {
  const gid = new URL(url).searchParams.get("gid");
  groups.push(gid);
  assert.equal(options.next.revalidate, 60);
  const products = gid === "103" ? legacyPlans : testPlans;
  return { ok: true, json: async () => ({ success: true, products }) };
});
const release = await loadData("src/lib/black-friday-best-plans.ts", {
  "server-only": {},
  "./black-friday-pricing": allPricing,
});
const launch = Date.parse("2026-11-23T04:30:00Z");
const flashSaleStart = Date.parse("2026-11-23T04:00:00Z");
assert.equal(release.getBestPlansRelease(flashSaleStart).delayMs, 30 * 60_000);
assert.equal(release.getBestPlansRelease(launch - 1).delayMs, 1);
assert.deepEqual(await release.getBestPlansCatalog(launch - 1), {
  edition: "legacy",
  products: legacyPlans,
});
assert.equal(release.getBestPlansRelease(launch).delayMs, 0);
const launched = await release.getBestPlansCatalog(launch);
assert.equal(launched.edition, "platinum");
assert.deepEqual(
  launched.products.map(({ pid }) => pid),
  testPlans.map(({ pid }) => pid),
);
assert.deepEqual(groups, ["103", "105"]);
const { GET } = await loadData("src/app/api/black-friday-best-plans/route.ts", {
  "@/lib/black-friday-best-plans": {
    getBestPlansRelease: () => release.getBestPlansRelease(launch - 1),
  },
});
const timingResponse = GET(
  new Request(
    "http://localhost/api/black-friday-best-plans/?now=9999999999999",
  ),
);
assert.match(timingResponse.headers.get("cache-control"), /no-store/);
assert.deepEqual(await timingResponse.json(), { delayMs: 1 });
console.log(
  "Black Friday catalogs, configuration, gifts, reference prices and the independent 11:30 launch passed.",
);
