"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { Zap } from "lucide-react";
import { formatMoney } from "@/lib/currency/money";
import type { BudgetSummary } from "@/lib/budget/calculate";

export type TrendBar = {
  label: string;
  total_minor: number;
  isToday: boolean;
};

export type CategorySlice = {
  name: string;
  color: string | null;
  amount_minor: number;
};

const PERIODS: { key: BudgetSummary["period"]; label: string }[] = [
  { key: "daily", label: "Day" },
  { key: "weekly", label: "Week" },
  { key: "monthly", label: "Month" },
];

const PERIOD_NOUN: Record<BudgetSummary["period"], string> = {
  daily: "today's",
  weekly: "this week's",
  monthly: "this month's",
};

const DOT_FALLBACK = ["#7C8AA5", "#B08968", "#9B8AC4"];

function statusFill(status: BudgetSummary["status"]) {
  if (status === "exceeded") return "rgb(var(--color-danger))";
  if (status === "warning") return "rgb(var(--color-warning))";
  return "rgb(var(--color-accent))";
}

export function DashboardHero({
  summaries,
  categories,
  trend,
  trendLimitMinor,
  avgPerDayMinor,
}: {
  summaries: BudgetSummary[];
  categories: CategorySlice[];
  trend: TrendBar[];
  trendLimitMinor: number;
  avgPerDayMinor: number;
}) {
  const available = PERIODS.filter((p) =>
    summaries.some((s) => s.period === p.key)
  );
  const [period, setPeriod] = useState<BudgetSummary["period"]>(
    available[0]?.key ?? "daily"
  );
  const summary =
    summaries.find((s) => s.period === period) ?? summaries[0];

  if (!summary) return null;

  const cur = summary.currency_code;
  const pct = Math.round(Math.min(summary.progress, 1.5) * 100);
  const fill = statusFill(summary.status);

  // ring geometry — r=64, C=2πr
  const C = 2 * Math.PI * 64;
  const offset = C * (1 - Math.min(summary.progress, 1));

  const over = summary.exceeded_minor > 0;
  const trackMax = Math.max(
    trendLimitMinor,
    ...trend.map((t) => t.total_minor),
    1
  );
  const catMax = Math.max(...categories.map((c) => c.amount_minor), 1);

  return (
    <div className="grid gap-3.5">
      {/* period toggle */}
      {available.length > 1 && (
        <div className="flex gap-1 rounded-[14px] bg-track p-1">
          {available.map((p) => {
            const active = p.key === period;
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => setPeriod(p.key)}
                className={clsx(
                  "flex-1 rounded-[10px] py-2 text-sm font-bold transition-colors",
                  active
                    ? "bg-surface text-ink shadow-sm"
                    : "font-semibold text-muted hover:text-ink"
                )}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      )}

      {/* hero ring */}
      <div className="rounded-card border border-line bg-surface p-6 shadow-card">
        <div className="flex items-center gap-5">
          <div className="relative h-[148px] w-[148px] shrink-0">
            <svg
              width="148"
              height="148"
              viewBox="0 0 148 148"
              className="-rotate-90"
            >
              <circle
                cx="74"
                cy="74"
                r="64"
                fill="none"
                stroke="rgb(var(--color-track))"
                strokeWidth="13"
              />
              <circle
                cx="74"
                cy="74"
                r="64"
                fill="none"
                stroke={fill}
                strokeWidth="13"
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={offset}
                style={{ transition: "stroke-dashoffset 700ms ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="tabular-nums text-[34px] font-bold leading-none tracking-tight text-ink">
                {formatMoney(summary.spent_minor, cur)}
              </p>
              {summary.is_enabled && (
                <p className="mt-1 text-[11px] font-semibold text-muted">
                  of {formatMoney(summary.limit_minor, cur)}
                </p>
              )}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.09em] text-muted">
              Spent {period === "daily" ? "today" : period === "weekly" ? "this week" : "this month"}
            </p>
            {summary.is_enabled ? (
              <>
                <p className="mt-2 text-[13px] leading-snug text-ink-soft">
                  You&apos;ve used{" "}
                  <span className="font-bold text-ink">{pct}%</span> of{" "}
                  {PERIOD_NOUN[period]} limit.
                </p>
                <div
                  className={clsx(
                    "mt-3 inline-flex h-8 items-center gap-2 rounded-full px-3 text-[13px] font-bold",
                    over
                      ? "bg-danger/15 text-danger"
                      : summary.status === "warning"
                        ? "bg-warning/15 text-warning"
                        : "bg-accent/10 text-accent-ink dark:bg-accent/15"
                  )}
                >
                  <span
                    className="h-[7px] w-[7px] rounded-full"
                    style={{ background: fill }}
                  />
                  {over
                    ? `${formatMoney(summary.exceeded_minor, cur)} over`
                    : `${formatMoney(summary.remaining_minor, cur)} left`}
                </div>
                <p className="mt-2.5 tabular-nums text-xs text-muted">
                  Avg {formatMoney(avgPerDayMinor, cur)}/day this week
                </p>
              </>
            ) : (
              <p className="mt-2 text-[13px] leading-snug text-ink-soft">
                {period === "daily" ? "Daily" : period === "weekly" ? "Weekly" : "Monthly"}{" "}
                budget is off — set a limit in Budgets.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* weekly trend */}
      <div className="rounded-card border border-line bg-surface p-5 shadow-card">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-[15px] font-bold tracking-tight text-ink">
            Last 7 days
          </h2>
          {trendLimitMinor > 0 && (
            <span className="tabular-nums text-[13px] font-semibold text-muted">
              {formatMoney(trendLimitMinor, cur)}/day limit
            </span>
          )}
        </div>
        <div className="relative mt-2.5 h-[84px]">
          {trendLimitMinor > 0 && (
            <div
              className="absolute inset-x-0 border-t-[1.5px] border-dashed border-line"
              style={{ top: `${(1 - trendLimitMinor / trackMax) * 84}px` }}
            />
          )}
          <div className="absolute inset-x-0 bottom-0 flex h-[84px] items-end gap-2.5">
            {trend.map((bar, i) => {
              const h = Math.max((bar.total_minor / trackMax) * 84, 4);
              const overDay =
                trendLimitMinor > 0 && bar.total_minor > trendLimitMinor;
              return (
                <div
                  key={i}
                  className="flex-1 rounded-md"
                  style={{
                    height: `${h}px`,
                    background: overDay
                      ? "rgb(var(--color-warning))"
                      : "rgb(var(--color-accent))",
                    opacity: bar.total_minor === 0 ? 1 : bar.isToday ? 1 : overDay ? 0.85 : 0.4,
                    ...(bar.total_minor === 0
                      ? { background: "rgb(var(--color-track))", height: "7px" }
                      : {}),
                  }}
                />
              );
            })}
          </div>
        </div>
        <div className="mt-2 flex gap-2.5">
          {trend.map((bar, i) => (
            <span
              key={i}
              className={clsx(
                "flex-1 text-center text-[11px]",
                bar.isToday
                  ? "font-extrabold text-accent-ink"
                  : "font-semibold text-muted"
              )}
            >
              {bar.label}
            </span>
          ))}
        </div>
      </div>

      {/* today breakdown */}
      {period === "daily" && categories.length > 0 && (
        <div className="rounded-card border border-line bg-surface p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[15px] font-bold tracking-tight text-ink">
              Today&apos;s breakdown
            </h2>
            <span className="text-[13px] font-semibold text-muted">
              {categories.length}{" "}
              {categories.length === 1 ? "category" : "categories"}
            </span>
          </div>
          <div className="flex flex-col gap-4">
            {categories.map((cat, i) => {
              const dot = cat.color ?? DOT_FALLBACK[i % DOT_FALLBACK.length];
              const w = `${Math.max((cat.amount_minor / catMax) * 100, 4)}%`;
              return (
                <div key={cat.name + i}>
                  <div className="mb-1.5 flex items-center gap-2.5">
                    <span
                      className="h-[9px] w-[9px] rounded-full"
                      style={{ background: dot }}
                    />
                    <span className="flex-1 truncate text-sm font-semibold text-ink">
                      {cat.name}
                    </span>
                    <span className="tabular-nums text-sm font-bold text-ink">
                      {formatMoney(cat.amount_minor, cur)}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-track">
                    <div
                      className="h-full rounded-full"
                      style={{ width: w, background: dot }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* insight strip */}
      {summary.is_enabled && !over && summary.remaining_minor > 0 && period === "daily" && (
        <div className="flex items-center gap-3.5 rounded-stat border border-line bg-accent/10 p-4 dark:bg-accent/15">
          <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[11px] bg-accent">
            <Zap className="h-5 w-5 text-white" fill="white" strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-ink">On track today</p>
            <p className="mt-0.5 text-[13px] text-ink-soft">
              You&apos;re {formatMoney(summary.remaining_minor, cur)} under
              today&apos;s limit.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
