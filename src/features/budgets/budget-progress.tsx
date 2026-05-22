import { clsx } from "clsx";
import { formatMoney } from "@/lib/currency/money";
import type { BudgetSummary } from "@/lib/budget/calculate";

export function BudgetProgress({ summary }: { summary: BudgetSummary }) {
  const width = `${Math.min(summary.progress * 100, 100)}%`;
  const accent =
    summary.status === "exceeded"
      ? "bg-danger"
      : summary.status === "warning"
        ? "bg-warning"
        : "bg-accent";

  return (
    <div className="grid gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm capitalize text-muted">{summary.period}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-ink">
            {formatMoney(summary.spent_minor, summary.currency_code)}
          </p>
        </div>
        <div className="text-right text-sm">
          <p className="text-muted">Limit</p>
          <p className="font-medium text-ink">
            {summary.is_enabled ? formatMoney(summary.limit_minor, summary.currency_code) : "Off"}
          </p>
        </div>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-line">
        <div className={clsx("h-full rounded-full", accent)} style={{ width }} />
      </div>
      <p className={clsx("text-sm", summary.status === "exceeded" ? "text-danger" : "text-muted")}>
        {!summary.is_enabled
          ? "Budget is disabled."
          : summary.exceeded_minor > 0
            ? `${formatMoney(summary.exceeded_minor, summary.currency_code)} exceeded`
            : `${formatMoney(summary.remaining_minor, summary.currency_code)} left`}
      </p>
    </div>
  );
}
