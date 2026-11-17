const hour = 60 * 60 * 1000;
const day = 24 * hour;

/** Vietnam is UTC+7 year round. Use UTC methods to ignore the device timezone. */
export function getSwedDaySchedule(now: number) {
  const vietnam = new Date(now + 7 * hour);
  const midnight =
    Date.UTC(
      vietnam.getUTCFullYear(),
      vietnam.getUTCMonth(),
      vietnam.getUTCDate(),
    ) -
    7 * hour;
  let startsAt =
    midnight + ((3 - vietnam.getUTCDay() + 7) % 7) * day + 10 * hour;
  if (now >= startsAt + 3 * hour) startsAt += 7 * day;
  const endsAt = startsAt + 3 * hour;
  const live = now >= startsAt && now < endsAt;
  return {
    live,
    startsAt,
    endsAt,
    remainingSeconds: Math.max(
      0,
      Math.ceil(((live ? endsAt : startsAt) - now) / 1000),
    ),
  };
}
