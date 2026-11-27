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
const publicData = load(publicSource);
const {
  blackFridayFlashSaleFreeOffers: freeOffers,
  blackFridayFlashSaleGroups: groups,
} = publicData;
const discountOffers = groups.flatMap((group) => group.offers);
const expectedOffers = {
  freeAmd: { code: "FLASHBF26-AMDFREE", quantity: 5 },
  freePlatinum: { code: "FLASHBF26-VPSFREE", quantity: 5 },
  free: { code: "FLASHBF26-DOMAINFREE", quantity: 5 },
  vps99: { code: "BF26-HOTDEAL99", quantity: 5 },
  vps70: { code: "BF26-HOTDEAL70", quantity: 5 },
  vps60: { code: "BF26-HOTDEAL60", quantity: 5 },
};
const unpublishedCodes = [
  "FLASH27-AMD0D",
  "FLASH27-FREE0D",
  "FLASH27-DOMAIN0D",
  "FLASHBF26-DEAL99",
  "FLASHBF26-DEAL70",
  "FLASHBF26-DEAL60",
  "FREEAMD-BF26FLASH",
  "FREEVPS27-BF26FLASH",
  "FREEDOMAIN-BF26FLASH",
  "VPS99-FLASHBF27",
  "VPS70-FLASHBF27",
  "VPS60-FLASHBF27",
  "VPS81-FLASHBF27",
  "VPS71-FLASHBF27",
  "VPS61-FLASHBF27",
  "CLOUD61-BF26FLASH27",
  "CLOUD51-BF26FLASH27",
  "CLOUD41-BF26FLASH27",
];
const containsReleaseCode = (content) =>
  [
    ...Object.values(expectedOffers).map(({ code }) => code),
    ...unpublishedCodes,
  ].some((code) => content.includes(code));
assert.equal(data.blackFridayFlashSale.mode, "preview");
assert.equal(data.blackFridayFlashSale.startsAt, "2026-11-27T20:00:00+07:00");
assert.deepEqual(data.blackFridayFlashSaleUpcomingDates, []);
const start = Date.parse(data.blackFridayFlashSale.startsAt);
assert.equal(start, Date.parse("2026-11-27T13:00:00Z"));
const imports = {
  "server-only": {},
  "@/data/black-friday": data,
  "@/data/black-friday-flash-sale": publicData,
  "./flash-sale": load(await fs.readFile("src/lib/flash-sale.ts", "utf8")),
};
const { getBlackFridayFlashSaleRelease: release } = load(source, imports);
for (const now of [
  Date.parse("2026-11-20T11:00:00+07:00"),
  Date.parse("2026-11-23T11:00:00+07:00"),
  Date.parse("2026-11-25T11:00:00+07:00"),
  Date.parse("2026-11-27T11:00:00+07:00"),
  Date.parse("2026-11-27T14:30:00+07:00"),
  Date.parse("2026-11-27T15:00:00+07:00"),
  Date.parse("2026-11-27T19:59:59+07:00"),
  start - 1000,
  start - 1,
]) {
  assert.equal(release(now).status, "upcoming");
  assert.deepEqual(release(now).offers, {});
  assert(!containsReleaseCode(JSON.stringify(release(now))));
}
for (const now of [start, start + 1, start + 86400000]) {
  assert.equal(release(now).status, "live");
  assert.deepEqual(release(now).offers, expectedOffers);
  assert(
    !unpublishedCodes.some((code) =>
      JSON.stringify(release(now)).includes(code),
    ),
  );
}
assert.deepEqual(
  discountOffers.map(({ id }) => id),
  ["vps99", "vps70", "vps60"],
);
assert.deepEqual(
  discountOffers.map(({ discount }) => discount),
  [99, 70, 60],
);
assert(!containsReleaseCode(publicSource));
assert(!/quantity/.test(JSON.stringify([...freeOffers, ...discountOffers])));
assert.deepEqual(freeOffers, [
  {
    id: "freeAmd",
    plan: "VPS AMD",
    specs: "2 vCore - 2GB RAM - 30GB SSD NVMe",
    cycle: "3–12 tháng",
    checkoutHref: "https://support.interdata.vn/index.php?rp=/store/amd-g3-vps",
  },
  {
    id: "freePlatinum",
    plan: "VPS Platinum",
    specs: "2 vCore - 2GB RAM - 30GB SSD NVMe",
    cycle: "3–12 tháng",
    checkoutHref:
      "https://support.interdata.vn/index.php?rp=/store/vps-platinum-viettel-hcm",
  },
  {
    id: "free",
    plan: "tên miền .COM",
    subtitle: "Săn Tên Miền Đẹp Cho Thương Hiệu Của Bạn",
    cycle: "1 năm",
    checkoutHref: "https://support.interdata.vn/cart.php?a=add&domain=register",
  },
]);
assert.deepEqual(
  groups.map(({ checkoutHref }) => checkoutHref),
  ["https://support.interdata.vn/index.php?rp=/store/vps-platinum-viettel-hcm"],
);
assert.deepEqual(
  discountOffers.map(({ plan, specs }) => `${plan} ${specs}`),
  [
    "VPS Platinum 2 vCPU - 2GB RAM - 30GB SSD",
    "VPS Platinum Tối đa 4 vCPU - 8GB RAM - 80GB SSD",
    "VPS Platinum Tối đa 4 vCPU - 8GB RAM - 80GB SSD",
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
      visibleFrom: "2026-11-27T19:00:00+07:00",
      startsAt: data.blackFridayFlashSale.startsAt,
      endsAt: "2026-11-27T21:00:00+07:00",
    },
  },
}).getBlackFridayFlashSaleRelease;
assert.equal(scheduled(start - 1).status, "upcoming");
assert.equal(scheduled(start).status, "live");
assert.deepEqual(scheduled(start).offers, expectedOffers);
assert.equal(scheduled(start + 3600000).status, "upcoming");
assert.deepEqual(scheduled(start + 3600000).offers, {});
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
assert.equal(response.headers.get("vercel-cdn-cache-control"), "no-store");
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
      !containsReleaseCode(await fs.readFile(file, "utf8")),
      `Flash Sale code shipped in ${file}`,
    );
    checked++;
  }
  assert(checked > 0);
  const base = process.env.TEST_BASE_URL || "http://localhost:3100";
  for (const [format, headers] of [
    ["HTML", {}],
    ["RSC", { rsc: "1" }],
  ]) {
    const response = await fetch(`${base}/blackfriday/`, { headers });
    assert(response.ok, `Black Friday ${format} HTTP ${response.status}`);
    const content = await response.text();
    assert(
      !containsReleaseCode(content),
      `Flash Sale code exposed in ${format}`,
    );
    assert(
      !/Chỉ (?:03|05|10) mã/i.test(content),
      `Flash Sale quantity exposed in ${format}`,
    );
  }
  console.log(
    `Flash Sale production privacy: ${checked} client assets and HTML/RSC contain no release codes or quantities.`,
  );
}
console.log(
  "Flash Sale data: November 27 opening boundary, VPS tiers, unpublished codes, registration links and no-store response passed.",
);
