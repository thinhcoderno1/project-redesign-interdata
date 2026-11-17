import assert from "node:assert/strict";
import fs from "node:fs/promises";
import ts from "typescript";

async function load(file, imports = {}, fetcher) {
  const exported = {};
  new Function(
    "exports",
    "require",
    "fetch",
    ts.transpileModule(await fs.readFile(file, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS },
    }).outputText,
  )(
    exported,
    (name) => {
      assert(name in imports, `Unexpected import ${name}`);
      return imports[name];
    },
    fetcher,
  );
  return exported;
}

const { getSwedDaySchedule: schedule } = await load(
  "src/lib/swed-day-schedule.ts",
);
const start = Date.parse("2026-11-18T10:00:00+07:00");
const end = Date.parse("2026-11-18T13:00:00+07:00");
assert.deepEqual(schedule(start - 1), {
  live: false,
  startsAt: start,
  endsAt: end,
  remainingSeconds: 1,
});
assert.deepEqual(schedule(start), {
  live: true,
  startsAt: start,
  endsAt: end,
  remainingSeconds: 10800,
});
assert.equal(schedule(end - 1).remainingSeconds, 1);
assert.equal(schedule(end).live, false);
assert.equal(schedule(end).startsAt, Date.parse("2026-11-25T10:00:00+07:00"));
assert.equal(schedule(Date.parse("2026-11-17T22:00:00-05:00")).live, true);
assert.equal(schedule(Date.parse("2026-11-18T06:00:00Z")).live, false);
assert.equal(
  schedule(Date.parse("2026-12-31T23:59:59+07:00")).startsAt,
  Date.parse("2027-01-06T10:00:00+07:00"),
);
for (let day = 0; day < 365; day++) {
  const now = Date.parse("2026-01-01T00:00:00Z") + day * 86400000;
  const current = schedule(now);
  assert.equal(new Date(current.startsAt + 7 * 3600000).getUTCDay(), 3);
  assert.equal(new Date(current.startsAt + 7 * 3600000).getUTCHours(), 10);
  assert(current.remainingSeconds > 0 && current.remainingSeconds <= 7 * 86400);
}

const campaign = await load("src/data/swed-day.ts");
const response = await fetch(
  `https://support.interdata.vn/packages.php?gid=${campaign.swedDayGid}&module`,
);
assert(response.ok);
const feed = await response.json();
async function pricing(data, ok = true) {
  const { getSwedDayProducts } = await load(
    "src/lib/swed-day-pricing.ts",
    {
      "server-only": {},
      "@/data/swed-day": campaign,
    },
    async (url, options) => {
      assert.equal(
        url,
        "https://support.interdata.vn/packages.php?gid=94&module",
      );
      assert.equal(options.next.revalidate, 60);
      return { ok, status: ok ? 200 : 503, json: async () => data };
    },
  );
  return getSwedDayProducts();
}
const products = await pricing(feed);
assert.equal(products.length, 4);
for (const product of products) {
  const source = feed.products.find((item) => item.pid === product.pid);
  for (const { cycle } of campaign.swedDayOffers)
    assert.equal(product.pricing.VND[cycle], source.pricing.VND[cycle]);
  assert.equal(product.product_url, source.product_url);
  assert.equal(product.description, source.description);
  assert.equal(product.available, source.quantity_available > 0);
}
await assert.rejects(pricing({}, false), /HTTP 503/);
await assert.rejects(pricing({ success: false, products: [] }), /unavailable/);
await assert.rejects(
  pricing({ ...feed, products: feed.products.slice(1) }),
  /Invalid/,
);
await assert.rejects(
  pricing({ ...feed, products: [...feed.products, feed.products[0]] }),
  /Invalid/,
);
for (const mutation of [
  { gid: 88 },
  { slug: "wrong" },
  { product_url: "https://example.com/" },
  { description: null },
  {
    pricing: {
      VND: { annually: "-1", biennially: "", triennially: "invalid" },
    },
  },
]) {
  const changed = structuredClone(feed);
  Object.assign(changed.products[0], mutation);
  await assert.rejects(pricing(changed));
}
const partial = structuredClone(feed);
partial.products[0].pricing.VND.biennially = "-1.00";
assert.equal((await pricing(partial))[0].pricing.VND.biennially, undefined);
console.log(
  "SWED DAY: weekly/timezone boundaries, annual rollover, official API identities, prices, stock, invalid feeds and unavailable cycles passed.",
);
