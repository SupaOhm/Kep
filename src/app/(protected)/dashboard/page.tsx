import Link from "next/link";
import { Plus, UploadCloud } from "lucide-react";
import { buttonClassName } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BudgetProgress } from "@/features/budgets/budget-progress";
import { ExpenseList } from "@/features/expenses/expense-list";
import { summarizeBudgets } from "@/lib/budget/calculate";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const [{ data: expensesData }, { data: budgetsData }] = await Promise.all([
    supabase
      .from("expenses")
      .select("*, categories(name,color)")
      .eq("user_id", user.id)
      .order("occurred_at", { ascending: false })
      .limit(20),
    supabase.from("budgets").select("*").eq("user_id", user.id).order("period")
  ]);
  const expenses = expensesData ?? [];
  const budgets = budgetsData ?? [];

  const orderedBudgets = ["daily", "weekly", "monthly"].flatMap((period) =>
    budgets.filter((b) => b.period === period)
  );
  const summaries = summarizeBudgets(orderedBudgets, expenses);
  const dailySummary = summaries.find((s) => s.period === "daily");
  const secondarySummaries = summaries.filter((s) => s.period !== "daily");

  return (
    <div className="grid gap-6">
      <section className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted">Overview</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink">Dashboard</h1>
        </div>
        <div className="flex gap-2">
          <Link
            href="/expenses/new"
            className={buttonClassName({ variant: "secondary", size: "sm" })}
          >
            <Plus className="h-3.5 w-3.5" />
            Quick add
          </Link>
          <Link
            href="/upload"
            className={buttonClassName({ size: "sm" })}
          >
            <UploadCloud className="h-3.5 w-3.5" />
            Upload slip
          </Link>
        </div>
      </section>

      {dailySummary && (
        <Card>
          <BudgetProgress summary={dailySummary} variant="hero" />
        </Card>
      )}

      {secondarySummaries.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {secondarySummaries.map((summary) => (
            <Card key={summary.period}>
              <BudgetProgress summary={summary} variant="compact" />
            </Card>
          ))}
        </div>
      )}

      <section className="grid gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-ink">Recent expenses</h2>
          <Link
            href="/expenses"
            className="text-sm font-semibold text-accent hover:text-accent/80"
          >
            View all →
          </Link>
        </div>
        <ExpenseList expenses={expenses.slice(0, 8)} />
      </section>
    </div>
  );
}
