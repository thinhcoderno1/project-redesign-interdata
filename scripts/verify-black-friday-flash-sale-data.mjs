import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import ts from "typescript";

function load(source, imports = {}) {
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

const source = await fs.readFile("src/lib/black-friday-flash-sale.ts", "utf8");
const data = load(await fs.readFile("src/data/black-friday.ts", "utf8"), {
  "./vps-content.json": JSON.parse(
    await fs.readFile("src/data/vps-content.json", "utf8"),
  ),
  "./content": { links: { vps: "/thue-vps/", cloud: "/cloud-server/" } },
  "./vps-pricing": {},
});
const publicSource = await fs.readFile(
  "src/data/black-friday-flash-sale.ts",
  "utf8",
);
const {
  blackFridayFlashSaleFreeOffer: freeOffer,
  blackFridayFlashSaleGroups: groups,
} = load(publicSource);
const publicOffers = [freeOffer, ...groups.flatMap((group) => group.offers)];
const expected = {
  free: { code: "BF26FLASH20-FREE", quantity: 3 },
  vps81: { code: "BF26FLASH20-VPS81", quantity: 3 },
  vps71: { code: "BF26FLASH20-VPS71", quantity: 3 },
  vps61: { code: "BF26FLASH20-VPS61", quantity: 10 },
  cloud61: { code: "BF26FLASH20-CLOUD61", quantity: 3 },
  cloud51: { code: "BF26FLASH20-CLOUD51", quantity: 3 },
  cloud41: { code: "BF26FLASH20-CLOUD41", quantity: 10 },
};
assert.equal(data.blackFridayFlashSale.mode, "preview");
assert.equal(data.blackFridayFlashSale.startsAt, "2026-11-20T11:00:00+07:00");
const start = Date.parse(data.blackFridayFlashSale.startsAt);
assert.equal(start, Date.parse("2026-11-20T04:00:00Z"));
const imports = {
  "server-only": {},
  "@/data/black-friday": data,
  "./flash-sale": load(await fs.readFile("src/lib/flash-sale.ts", "utf8")),
};
const { getBlackFridayFlashSaleRelease: release } = load(source, imports);
for (const now of [start - 86400000, start - 1000, start - 1]) {
  assert.equal(release(now).status, "upcoming");
  assert.deepEqual(release(now).offers, {});
  assert(!/BF26FLASH20|quantity/.test(JSON.stringify(release(now))));
}
for (const now of [start, start + 1, start + 86400000]) {
  assert.equal(release(now).status, "live");
  assert.deepEqual(release(now).offers, expected);
}
assert.deepEqual(
  publicOffers.map(({ id }) => id),
  Object.keys(expected),
);
assert.deepEqual(
  groups.flatMap((group) => group.offers.map(({ discount }) => discount)),
  [81, 71, 61, 61, 51, 41],
);
assert(!/BF26FLASH20/.test(publicSource));
assert(!/quantity/.test(JSON.stringify(publicOffers)));
assert.deepEqual(
  publicOffers.map(({ plan, specs }) => `${plan} ${specs}`),
  [
    "VPS Platinum 2 vCPU - 2GB RAM - 30GB SSD",
    "VPS Platinum 2 vCPU - 2GB RAM - 30GB SSD",
    "VPS Platinum 2 vCPU - 4GB RAM - 50GB SSD",
    "VPS Platinum 4 vCPU - 8GB RAM - 80GB SSD",
    "Cloud Platinum 2 vCPU - 2GB RAM - 30GB SSD",
    "Cloud Platinum 2 vCPU - 4GB RAM - 50GB SSD",
    "Cloud Platinum 4 vCPU - 8GB RAM - 80GB SSD",
  ],
);
const hidden = load(source, {
  ...imports,
  "@/data/black-friday": {
    blackFridayFlashSale: { ...data.blackFridayFlashSale, mode: "hidden" },
  },
});
assert.deepEqual(hidden.getBlackFridayFlashSaleRelease(start).offers, {});
const invalid = load(source, {
  ...imports,
  "@/data/black-friday": {
    blackFridayFlashSale: { ...data.blackFridayFlashSale, startsAt: null },
  },
});
assert.deepEqual(invalid.getBlackFridayFlashSaleRelease(start).offers, {});
const scheduled = load(source, {
  ...imports,
  "@/data/black-friday": {
    blackFridayFlashSale: {
      mode: "scheduled",
      visibleFrom: "2026-11-20T10:00:00+07:00",
      startsAt: data.blackFridayFlashSale.startsAt,
      endsAt: "2026-11-20T12:00:00+07:00",
    },
  },
}).getBlackFridayFlashSaleRelease;
assert.deepEqual(scheduled(start - 1).offers, {});
assert.deepEqual(scheduled(start).offers, expected);
assert.deepEqual(scheduled(start + 3600000).offers, {});
const checkoutSource = await fs.readFile(
  "src/lib/black-friday-flash-sale-checkout.ts",
  "utf8",
);
const vpsProduct = {
  pid: 533,
  slug: "plan-2-2c-2g-30g-platinum-vt",
  product_url:
    "https://support.interdata.vn/index.php?rp=/store/vps-platinum-viettel-hcm/plan-2-2c-2g-30g-platinum-vt",
  pricing: { VND: { quarterly: "300000" } },
};
const checkoutImports = {
  "server-only": {},
  "@/data/black-friday": data,
  "@/data/vps-pricing": {
    checkoutUrl: (product, cycle) =>
      `${product.product_url}&billingcycle=${cycle}`,
  },
  "./vps-platinum-pricing": {
    getPlatinumProducts: async (gid) => {
      assert.equal(gid, 101);
      return [vpsProduct];
    },
  },
  "./platinum-cloud-server-pricing": {
    getPlatinumCloudProducts: async () => {
      throw new Error("Catalog unavailable");
    },
  },
};
const { getBlackFridayFlashSaleCheckoutLinks: getCheckoutLinks } = load(
  checkoutSource,
  checkoutImports,
);
const vpsCheckout = `${vpsProduct.product_url}&billingcycle=quarterly`;
assert.deepEqual(await getCheckoutLinks(), {
  free: vpsCheckout,
  vps81: vpsCheckout,
});
const invalidCheckout = load(checkoutSource, {
  ...checkoutImports,
  "./vps-platinum-pricing": {
    getPlatinumProducts: async () => [
      {
        ...vpsProduct,
        product_url: vpsProduct.product_url.replace(
          "vps-platinum-viettel-hcm",
          "vps-platinum",
        ),
      },
    ],
  },
}).getBlackFridayFlashSaleCheckoutLinks;
assert.deepEqual(await invalidCheckout(), {});
const { GET } = load(
  await fs.readFile("src/app/api/black-friday-flash-sale/route.ts", "utf8"),
  {
    "@/lib/black-friday-flash-sale": {
      getBlackFridayFlashSaleRelease: () => release(start - 1),
    },
  },
);
const response = GET(
  new Request(
    "http://localhost/api/black-friday-flash-sale/?now=9999999999999",
  ),
);
assert(response.headers.get("cache-control").includes("no-store"));
assert.equal(response.headers.get("cdn-cache-control"), "no-store");
assert.deepEqual((await response.json()).offers, {});
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
    assert(
      !(await fs.readFile(file, "utf8")).includes("BF26FLASH20"),
      `Flash Sale code shipped in ${file}`,
    );
    checked++;
  }
  assert(checked > 0);
  for (const file of [
    ".next/server/app/blackfriday.html",
    ".next/server/app/blackfriday.rsc",
  ]) {
    const content = await fs.readFile(file, "utf8");
    assert(
      !content.includes("BF26FLASH20"),
      `Flash Sale code prerendered in ${file}`,
    );
    assert(
      !content.includes("Số lượng:"),
      `Flash Sale quantity prerendered in ${file}`,
    );
  }
  console.log(
    `Flash Sale production privacy: ${checked} client assets and prerendered HTML/RSC contain no release codes or quantities.`,
  );
}
console.log(
  "Flash Sale data: 11:00 Vietnam timezone, millisecond release boundary, exact seven offers, hidden/invalid config, server-only codes and quantities, no-store response and ignored client timestamps passed.",
);
