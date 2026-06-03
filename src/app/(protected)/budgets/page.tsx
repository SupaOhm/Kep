import { Card } from "@/components/ui/card";
import { BudgetForm } from "@/features/budgets/budget-form";
import { BudgetProgress } from "@/features/budgets/budget-progress";
import { summarizeBudgets } from "@/lib/budget/calculate";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function BudgetsPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/");
  const userId = user.id;

  const [{ data: budgetsData }, { data: expensesData }] = await Promise.all([
    supabase.from("budgets").select("*").eq("user_id", userId).order("period"),
    supabase.from("expenses").select("*").eq("user_id", userId)
  ]);
  const budgets = budgetsData ?? [];
  const expenses = expensesData ?? [];
  const orderedBudgets = ["daily", "weekly", "monthly"].flatMap((period) =>
    budgets.filter((budget) => budget.period === period)
  );
  const summaries = summarizeBudgets(orderedBudgets, expenses);

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted">Limits</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink">Budgets</h1>
        <p className="mt-1.5 text-sm text-muted">No rollover is applied in this MVP.</p>
      </div>

      <section>
        <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted">
          Current period
        </h2>
        <div className="grid gap-3 md:grid-cols-3">
          {summaries.map((summary) => (
            <Card key={summary.period}>
              <BudgetProgress summary={summary} variant="compact" />
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted">
          Settings
        </h2>
        <div className="grid gap-3 md:grid-cols-3">
          {orderedBudgets.map((budget) => (
            <Card key={budget.id}>
              <BudgetForm budget={budget} />
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
