import assert from "node:assert/strict";
import fs from "node:fs/promises";
import ts from "typescript";

const exported = {};
new Function(
  "exports",
  ts.transpileModule(await fs.readFile("src/lib/flash-sale.ts", "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText,
)(exported);
const { getFlashSaleState: state, splitCountdown } = exported;
const schedule = {
  mode: "scheduled",
  visibleFrom: "2026-11-26T10:00:00+07:00",
  startsAt: "2026-11-27T10:00:00+07:00",
  endsAt: "2026-11-27T12:00:00+07:00",
};
const visibleFrom = Date.parse(schedule.visibleFrom);
const start = Date.parse(schedule.startsAt);
const end = Date.parse(schedule.endsAt);

assert.equal(state(schedule, visibleFrom - 1).visible, false);
assert.deepEqual(state(schedule, visibleFrom), {
  visible: true,
  phase: "upcoming",
  remainingSeconds: 86400,
});
assert.deepEqual(state(schedule, start - 1), {
  visible: true,
  phase: "upcoming",
  remainingSeconds: 1,
});
assert.deepEqual(state(schedule, start), {
  visible: true,
  phase: "live",
  remainingSeconds: 7200,
});
assert.equal(state(schedule, start + 1000).remainingSeconds, 7199);
assert.equal(state(schedule, end - 1).remainingSeconds, 1);
assert.equal(state(schedule, end).visible, false);
assert.equal(state(schedule, end + 1000).visible, false);
assert.equal(start, Date.parse("2026-11-27T03:00:00Z"));
for (const now of [0, visibleFrom, start, end]) {
  assert.deepEqual(state({ ...schedule, mode: "preview" }, now), {
    visible: true,
    phase: "preview",
    remainingSeconds: 0,
  });
  assert.equal(state({ ...schedule, mode: "hidden" }, now).visible, false);
}
for (const invalid of [
  { startsAt: null },
  { startsAt: "invalid" },
  { startsAt: "2026-11-27T10:00:00" },
  { visibleFrom: schedule.endsAt },
  { endsAt: schedule.startsAt },
])
  assert.equal(state({ ...schedule, ...invalid }, start).visible, false);
assert.deepEqual(splitCountdown(0), ["00", "00", "00", "00"]);
assert.deepEqual(splitCountdown(-1), ["00", "00", "00", "00"]);
assert.deepEqual(splitCountdown(90061), ["01", "01", "01", "01"]);
assert.deepEqual(splitCountdown(86400), ["01", "00", "00", "00"]);
assert.deepEqual(splitCountdown(86399), ["00", "23", "59", "59"]);
console.log(
  "Flash Sale: static preview, visibility window, start/end boundaries, timezone, invalid schedules and countdown rollover passed.",
);
