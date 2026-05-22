export type BudgetPeriod = "daily" | "weekly" | "monthly";

export function toDateTimeLocalValue(date = new Date()) {
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

export function fromDateTimeLocalValue(value: string) {
  return new Date(value).toISOString();
}

export function getPeriodRange(period: BudgetPeriod, now = new Date(), weekStartsOn: "monday" | "sunday" = "monday") {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  if (period === "weekly") {
    const day = start.getDay();
    const offset = weekStartsOn === "monday" ? (day + 6) % 7 : day;
    start.setDate(start.getDate() - offset);
  }

  if (period === "monthly") {
    start.setDate(1);
  }

  const end = new Date(start);
  if (period === "daily") end.setDate(end.getDate() + 1);
  if (period === "weekly") end.setDate(end.getDate() + 7);
  if (period === "monthly") end.setMonth(end.getMonth() + 1);

  return { start, end };
}
