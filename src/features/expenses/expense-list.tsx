import Link from "next/link";
import { Pencil } from "lucide-react";
import { buttonClassName } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { formatMoney } from "@/lib/currency/money";
import type { Category, Expense } from "@/types/database";
import { DeleteExpenseButton } from "./delete-expense-button";

type ExpenseWithCategory = Expense & { categories?: Pick<Category, "name" | "color"> | null };

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
          className="flex items-center justify-between gap-3 rounded-lg border border-line bg-surface p-3"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: expense.categories?.color ?? "#94a3b8" }}
              />
              <p className="truncate font-medium text-ink">
                {expense.merchant_name || expense.receiver_name || expense.categories?.name || "Expense"}
              </p>
            </div>
            <p className="mt-1 text-sm text-muted">
              {new Intl.DateTimeFormat("th-TH", {
                dateStyle: "medium",
                timeStyle: "short"
              }).format(new Date(expense.occurred_at))}
              {expense.categories?.name ? ` · ${expense.categories.name}` : ""}
            </p>
            {expense.note ? <p className="mt-1 truncate text-sm text-muted">{expense.note}</p> : null}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <p className="text-right font-semibold text-ink">
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
