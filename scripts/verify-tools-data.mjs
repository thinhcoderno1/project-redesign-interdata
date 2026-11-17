import assert from "node:assert/strict";
import fs from "node:fs/promises";
import ts from "typescript";
import { loadProjectModule } from "./load-project-typescript.mjs";

const source = await fs.readFile(
  new URL("../src/lib/tool-generators.ts", import.meta.url),
  "utf8",
);
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
  },
});
const {
  parseCron,
  nextCronRuns,
  cronCommandError,
  generateNginx,
  nginxErrors,
  defaultNginxOptions,
} = await import(
  `data:text/javascript;base64,${Buffer.from(compiled.outputText).toString("base64")}`
);
const next = (expression, start, offset = 0, count = 1) =>
  nextCronRuns(expression, new Date(start), offset, count).map((date) =>
    date.toISOString(),
  );

const { cronCommandTemplates } = loadProjectModule(
  "src/data/cron-command-templates.ts",
);
assert.equal(
  new Set(cronCommandTemplates.map((template) => template.id)).size,
  cronCommandTemplates.length,
);
for (const template of cronCommandTemplates) {
  assert.equal(
    cronCommandError(template.command),
    "",
    `${template.id}: command must be valid in crontab, including escaped percent signs`,
  );
  assert.ok(
    next(template.schedule.expression, "2026-11-14T00:00:00Z").length,
    `${template.id}: suggested schedule must have a next run`,
  );
  assert.ok(
    template.replacements.length,
    `${template.id}: beginners need replacement instructions`,
  );
}
for (const template of cronCommandTemplates.filter(
  (template) => template.category === "backup",
)) {
  assert.ok(
    template.command.startsWith("umask 077 && "),
    `${template.id}: newly created backups should be private`,
  );
  assert.ok(
    template.command.includes("\\%Y"),
    `${template.id}: timestamp must be escaped for cron`,
  );
}

assert.deepEqual(next("*/5 * * * *", "2026-11-14T10:03:00Z", 0, 3), [
  "2026-11-14T10:05:00.000Z",
  "2026-11-14T10:10:00.000Z",
  "2026-11-14T10:15:00.000Z",
]);
assert.deepEqual(next("0 0 * * *", "2026-11-14T16:59:00Z", 420), [
  "2026-11-14T17:00:00.000Z",
]);
assert.deepEqual(next("0 0 29 2 *", "2026-11-14T00:00:00Z"), [
  "2028-02-29T00:00:00.000Z",
]);
assert.deepEqual(next("0 0 30 2 *", "2026-11-14T00:00:00Z"), []);
assert.equal(next("0 0 29 2 *", "2097-01-01T00:00:00Z", 0, 5).length, 5);
assert.deepEqual(next("0 0 29 2 *", "2097-01-01T00:00:00Z"), [
  "2104-02-29T00:00:00.000Z",
]);
assert.deepEqual(
  next("0 0 * * 7", "2026-11-14T00:00:00Z"),
  next("0 0 * * 0", "2026-11-14T00:00:00Z"),
);
assert.deepEqual(next("0 9 1 * 1", "2026-11-14T00:00:00Z"), [
  "2026-11-16T09:00:00.000Z",
]);
assert.deepEqual(next("0 9 */2 * 1", "2026-11-14T00:00:00Z"), [
  "2026-11-23T09:00:00.000Z",
]);
assert.deepEqual(next("0 9 * * 1-5", "2026-11-13T09:00:00Z"), [
  "2026-11-16T09:00:00.000Z",
]);
assert.deepEqual(
  parseCron("1,15,30 9-17/2 * * *").values[1],
  [9, 11, 13, 15, 17],
);
for (const expression of [
  "* * * *",
  "* * * * * *",
  "60 * * * *",
  "*/0 * * * *",
  "0 25 * * *",
  "0 0 0 * *",
  "0 0 * 13 *",
  "0 0 * * 8",
  "0 0 * * 5-1",
  "0 0 * * MON",
  "1,,2 * * * *",
])
  assert.throws(() => parseCron(expression), expression);
assert.ok(cronCommandError("echo hello\nreboot"));
assert.ok(cronCommandError("date +%F"));
assert.equal(cronCommandError("date +\\%F"), "");

const proxy = generateNginx(defaultNginxOptions);
assert.match(proxy, /proxy_pass http:\/\/127\.0\.0\.1:3000;/);
assert.doesNotMatch(proxy, /ssl_certificate|map \$http_upgrade/);
const ssl = generateNginx({
  ...defaultNginxOptions,
  ssl: true,
  www: true,
  websocket: true,
});
assert.match(ssl, /listen 443 ssl;/);
assert.match(ssl, /server_name example\.com www\.example\.com;/);
assert.match(ssl, /return 301 https:\/\/example\.com\$request_uri;/);
assert.match(ssl, /map \$http_upgrade \$interdata_connection_upgrade/);
assert.match(
  ssl,
  /proxy_set_header Connection \$interdata_connection_upgrade;/,
);
const staticConfig = generateNginx({
  ...defaultNginxOptions,
  mode: "static",
  spa: true,
  gzip: false,
});
assert.match(staticConfig, /try_files \$uri \$uri\/ \/index\.html;/);
assert.doesNotMatch(staticConfig, /proxy_pass|gzip on/);
assert.match(
  generateNginx({ ...defaultNginxOptions, mode: "static" }),
  /try_files \$uri \$uri\/ =404;/,
);
for (const update of [
  { domain: "example.com; include /tmp/evil" },
  { upstream: "127.0.0.1\n}" },
  { upstream: "999.0.0.1" },
  { port: "0" },
  { port: "65536" },
  { port: "3000;" },
  { mode: "static", root: "/var/www/a;" },
  { ssl: true, certificate: "/etc/a\n}" },
]) {
  const options = { ...defaultNginxOptions, ...update };
  assert.ok(Object.keys(nginxErrors(options)).length);
  assert.equal(generateNginx(options), "");
}
console.log(
  "Tools data checks passed: cron schedules, timezone, leap dates, validation and Nginx variants.",
);

const {
  defaultVpsSizingInput,
  estimateVpsSizing,
  validateVpsSizing,
  summarizeVpsSizing,
  vpsSizingProfiles,
} = loadProjectModule("src/lib/vps-sizing.ts");
const defaultSizing = estimateVpsSizing(defaultVpsSizingInput);
assert.equal(defaultSizing.vCpu, 2);
assert.equal(defaultSizing.ramGb, 4);
assert.equal(defaultSizing.diskGb, 60);
assert.equal(defaultSizing.requestsPerSecond, 5);
assert.equal(defaultSizing.activeRequests, 2.5);
assert.equal(defaultSizing.futureDataGb, 32);
assert.equal(defaultSizing.largeWorkload, false);
for (const update of [
  { users: 0 },
  { users: 1.5 },
  { dataGb: -1 },
  { headroom: NaN },
  { months: Infinity },
  { cpuMs: 0 },
  { requestsPerMinute: 121 },
  { app: "unknown" },
]) {
  assert.ok(
    Object.keys(validateVpsSizing({ ...defaultVpsSizingInput, ...update }))
      .length,
  );
  assert.throws(() =>
    estimateVpsSizing({ ...defaultVpsSizingInput, ...update }),
  );
}
const moreUsers = estimateVpsSizing({ ...defaultVpsSizingInput, users: 1000 });
assert.ok(moreUsers.raw.cpu > defaultSizing.raw.cpu);
assert.ok(moreUsers.raw.ramGb > defaultSizing.raw.ramGb);
assert.equal(moreUsers.diskGb, defaultSizing.diskGb);
const moreGrowth = estimateVpsSizing({ ...defaultVpsSizingInput, months: 12 });
assert.ok(moreGrowth.diskGb > defaultSizing.diskGb);
assert.equal(moreGrowth.vCpu, defaultSizing.vCpu);
assert.equal(moreGrowth.ramGb, defaultSizing.ramGb);
const withoutDatabase = estimateVpsSizing({
  ...defaultVpsSizingInput,
  localDatabase: false,
  databaseRamGb: NaN,
});
assert.ok(withoutDatabase.raw.ramGb < defaultSizing.raw.ramGb);
const noHeadroom = estimateVpsSizing({ ...defaultVpsSizingInput, headroom: 0 });
assert.ok(noHeadroom.raw.cpu < defaultSizing.raw.cpu);
assert.ok(noHeadroom.raw.ramGb < defaultSizing.raw.ramGb);
assert.ok(noHeadroom.raw.diskGb < defaultSizing.raw.diskGb);
const large = estimateVpsSizing({ ...defaultVpsSizingInput, users: 100000 });
assert.ok(large.vCpu > 32);
assert.ok(large.largeWorkload);
for (const profile of vpsSizingProfiles) {
  const sized = estimateVpsSizing({
    ...defaultVpsSizingInput,
    ...profile,
    app: profile.id,
  });
  assert.ok(sized.vCpu >= 1 && sized.ramGb >= 2 && sized.diskGb >= 20);
}
assert.match(
  summarizeVpsSizing(defaultVpsSizingInput),
  /2 vCPU \| 4 GB RAM \| 60 GB SSD/,
);
assert.match(summarizeVpsSizing(defaultVpsSizingInput), /120 ms/);
console.log(
  "VPS sizing passed: worked example, validation, monotonic demand, growth, headroom, database, large workload and summary.",
);
