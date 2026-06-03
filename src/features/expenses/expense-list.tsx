import Link from "next/link";
import { Pencil } from "lucide-react";
import { buttonClassName } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { formatMoney } from "@/lib/currency/money";
import type { Category, Expense } from "@/types/database";
import { DeleteExpenseButton } from "./delete-expense-button";

type ExpenseWithCategory = Expense & {
  categories?: Pick<Category, "name" | "color"> | null;
};

export function ExpenseList({ expenses }: { expenses: ExpenseWithCategory[] }) {
  if (!expenses.length) {
    return (
      <EmptyState
        title="No expenses yet"
        description="Add a manual expense or upload a slip to start tracking."
        action={
          <Link href="/expenses/new" className={buttonClassName()}>
            Add expense
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid gap-2">
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className="flex items-center justify-between gap-3 rounded-2xl border border-line/60 bg-surface p-4 transition-colors hover:bg-elevated"
        >
          <div className="flex min-w-0 items-center gap-3">
            <span
              className="h-10 w-10 flex-none rounded-xl"
              style={{ background: expense.categories?.color ?? "#94a3b8" }}
            />
            <div className="min-w-0">
              <p className="truncate font-semibold text-ink">
                {expense.merchant_name ||
                  expense.receiver_name ||
                  expense.categories?.name ||
                  "Expense"}
              </p>
              <p className="mt-0.5 text-xs text-muted">
                {new Intl.DateTimeFormat("th-TH", {
                  dateStyle: "medium",
                  timeStyle: "short"
                }).format(new Date(expense.occurred_at))}
                {expense.categories?.name
                  ? ` · ${expense.categories.name}`
                  : ""}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <p className="tabular-nums text-base font-bold text-ink">
              {formatMoney(expense.amount_minor, expense.currency_code)}
            </p>
            <Link
              href={`/expenses/${expense.id}/edit`}
              className={buttonClassName({ variant: "ghost", size: "icon" })}
              aria-label="Edit expense"
            >
              <Pencil className="h-4 w-4" />
            </Link>
            <DeleteExpenseButton id={expense.id} />
          </div>
        </div>
      ))}
    </div>
  );
}
