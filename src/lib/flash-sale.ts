export type FlashSaleSchedule = {
  mode: "preview" | "scheduled" | "hidden";
  // Use ISO 8601 dates with an explicit timezone, e.g. +07:00 for Vietnam.
  visibleFrom: string | null;
  startsAt: string | null;
  endsAt: string | null;
};

export function getFlashSaleState(schedule: FlashSaleSchedule, now: number) {
  if (schedule.mode === "preview")
    return { visible: true, phase: "preview", remainingSeconds: 0 } as const;

  const parse = (value: string | null) =>
    value && /(?:Z|[+-]\d{2}:\d{2})$/.test(value) ? Date.parse(value) : NaN;
  const visibleFrom = parse(schedule.visibleFrom);
  const start = parse(schedule.startsAt);
  const end = parse(schedule.endsAt);
  if (
    schedule.mode === "hidden" ||
    ![now, visibleFrom, start, end].every(Number.isFinite) ||
    visibleFrom > start ||
    start >= end ||
    now < visibleFrom ||
    now >= end
  )
    return { visible: false, phase: "hidden", remainingSeconds: 0 } as const;

  const live = now >= start;
  return {
    visible: true,
    phase: live ? "live" : "upcoming",
    remainingSeconds: Math.max(
      0,
      Math.ceil(((live ? end : start) - now) / 1000),
    ),
  } as const;
}

export function splitCountdown(seconds: number) {
  const total = Math.max(0, Math.floor(seconds));
  return [
    Math.floor(total / 86400),
    Math.floor((total % 86400) / 3600),
    Math.floor((total % 3600) / 60),
    total % 60,
  ].map((value) => String(value).padStart(2, "0"));
}
