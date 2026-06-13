import { clsx } from "clsx";
import { formatMoney } from "@/lib/currency/money";
import type { BudgetSummary } from "@/lib/budget/calculate";

export function BudgetProgress({
  summary,
  variant = "compact",
}: {
  summary: BudgetSummary;
  variant?: "hero" | "compact";
}) {
  const width = `${Math.min(summary.progress * 100, 100)}%`;

  const barColor =
    summary.status === "exceeded"
      ? "bg-danger"
      : summary.status === "warning"
        ? "bg-warning"
        : "bg-accent";

  const statusLabel =
    !summary.is_enabled
      ? null
      : summary.exceeded_minor > 0
        ? `${formatMoney(summary.exceeded_minor, summary.currency_code)} over`
        : `${formatMoney(summary.remaining_minor, summary.currency_code)} left`;

  if (variant === "hero") {
    return (
      <div className="grid gap-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted">Today</p>
            <p className="mt-2 tabular-nums text-4xl font-bold tracking-tight text-ink">
              {formatMoney(summary.spent_minor, summary.currency_code)}
            </p>
          </div>
          {summary.is_enabled && statusLabel && (
            <span
              className={clsx(
                "shrink-0 rounded-full px-3 py-1 text-xs font-bold",
                summary.status === "exceeded"
                  ? "bg-danger/15 text-danger"
                  : summary.status === "warning"
                    ? "bg-warning/15 text-warning"
                    : "bg-accent/10 text-accent-ink dark:bg-accent/15"
              )}
            >
              {statusLabel}
            </span>
          )}
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-track">
          <div
            className={clsx("h-full rounded-full transition-all duration-700", barColor)}
            style={{ width }}
          />
        </div>
        {summary.is_enabled ? (
          <p className="text-sm text-muted">
            of {formatMoney(summary.limit_minor, summary.currency_code)} daily limit
          </p>
        ) : (
          <p className="text-sm text-muted">
            Daily budget is off — set a limit in Budgets.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-2.5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted">
            {summary.period}
          </p>
          <p className="mt-1 tabular-nums text-xl font-bold tracking-tight text-ink">
            {formatMoney(summary.spent_minor, summary.currency_code)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted">Limit</p>
          <p className="text-sm font-semibold text-ink">
            {summary.is_enabled
              ? formatMoney(summary.limit_minor, summary.currency_code)
              : "Off"}
          </p>
        </div>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-track">
        <div
          className={clsx("h-full rounded-full transition-all duration-700", barColor)}
          style={{ width }}
        />
      </div>
      <p
        className={clsx(
          "text-xs font-medium",
          summary.status === "exceeded" ? "text-danger" : "text-muted"
        )}
      >
        {!summary.is_enabled
          ? "Budget disabled"
          : summary.exceeded_minor > 0
            ? `${formatMoney(summary.exceeded_minor, summary.currency_code)} exceeded`
            : `${formatMoney(summary.remaining_minor, summary.currency_code)} left`}
      </p>
    </div>
  );
}
