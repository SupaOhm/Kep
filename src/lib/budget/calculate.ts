import type { Budget, Expense } from "@/types/database";
import { getPeriodRange } from "@/lib/date/periods";

export type BudgetStatus = "safe" | "warning" | "exceeded";

export type BudgetSummary = {
  period: Budget["period"];
  is_enabled: boolean;
  spent_minor: number;
  limit_minor: number;
  remaining_minor: number;
  exceeded_minor: number;
  progress: number;
  status: BudgetStatus;
  currency_code: string;
};

export function calculateBudgetSummary(
  budget: Budget,
  expenses: Expense[],
  now = new Date()
): BudgetSummary {
  const { start, end } = getPeriodRange(budget.period, now, budget.week_starts_on);
  const spent = expenses
    .filter((expense) => {
      const occurredAt = new Date(expense.occurred_at);
      return occurredAt >= start && occurredAt < end;
    })
    .reduce((sum, expense) => sum + expense.base_amount_minor, 0);

  const progress = budget.limit_minor > 0 ? Math.min(spent / budget.limit_minor, 1.5) : 0;
  const remaining = Math.max(budget.limit_minor - spent, 0);
  const exceeded = Math.max(spent - budget.limit_minor, 0);
  const status: BudgetStatus =
    budget.is_enabled && budget.limit_minor > 0 && spent > budget.limit_minor
      ? "exceeded"
      : budget.is_enabled && budget.limit_minor > 0 && spent >= budget.limit_minor * budget.warning_threshold
        ? "warning"
        : "safe";

  return {
    period: budget.period,
    is_enabled: budget.is_enabled,
    spent_minor: spent,
    limit_minor: budget.limit_minor,
    remaining_minor: remaining,
    exceeded_minor: exceeded,
    progress,
    status,
    currency_code: budget.currency_code
  };
}

export function summarizeBudgets(budgets: Budget[], expenses: Expense[]) {
  return budgets.map((budget) => calculateBudgetSummary(budget, expenses));
}
