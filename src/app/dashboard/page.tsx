import Link from "next/link";
import { Plus, UploadCloud } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { buttonClassName } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BudgetProgress } from "@/features/budgets/budget-progress";
import { ExpenseList } from "@/features/expenses/expense-list";
import { summarizeBudgets } from "@/lib/budget/calculate";
import { ensureUserWorkspace } from "@/lib/supabase/onboarding";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/");
  await ensureUserWorkspace(supabase, user);

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
    budgets.filter((budget) => budget.period === period)
  );
  const summaries = summarizeBudgets(orderedBudgets, expenses);

  return (
    <AppShell>
      <div className="grid gap-5">
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-accent">Overview</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink">Today’s spending</h1>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <Link href="/expenses/new" className={buttonClassName({ variant: "secondary", className: "w-full" })}>
              <Plus className="h-4 w-4" />
              Quick add
            </Link>
            <Link href="/upload" className={buttonClassName({ className: "w-full" })}>
              <UploadCloud className="h-4 w-4" />
              Upload slip
            </Link>
          </div>
        </section>
        <section className="grid gap-3 md:grid-cols-3">
          {summaries.map((summary) => (
            <Card key={summary.period}>
              <BudgetProgress summary={summary} />
            </Card>
          ))}
        </section>
        <section className="grid gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink">Recent expenses</h2>
            <Link href="/expenses" className="text-sm font-medium text-accent">
              View all
            </Link>
          </div>
          <ExpenseList expenses={expenses.slice(0, 8)} />
        </section>
      </div>
    </AppShell>
  );
}
