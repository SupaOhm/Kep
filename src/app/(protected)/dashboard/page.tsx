import Link from "next/link";
import { redirect } from "next/navigation";
import {
  DashboardHero,
  type CategorySlice,
  type TrendBar,
} from "@/features/dashboard/dashboard-hero";
import { ExpenseList } from "@/features/expenses/expense-list";
import { summarizeBudgets } from "@/lib/budget/calculate";
import { getPeriodRange } from "@/lib/date/periods";
import { createClient } from "@/lib/supabase/server";

const WEEKDAY = ["S", "M", "T", "W", "T", "F", "S"];

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const [{ data: expensesData }, { data: budgetsData }] = await Promise.all([
    supabase
      .from("expenses")
      .select("*, categories(name,color)")
      .eq("user_id", user.id)
      .order("occurred_at", { ascending: false })
      .limit(200),
    supabase.from("budgets").select("*").eq("user_id", user.id).order("period"),
  ]);
  const expenses = expensesData ?? [];
  const budgets = budgetsData ?? [];

  const orderedBudgets = ["daily", "weekly", "monthly"].flatMap((period) =>
    budgets.filter((b) => b.period === period)
  );
  const summaries = summarizeBudgets(orderedBudgets, expenses);
  const dailySummary = summaries.find((s) => s.period === "daily");
  const weekStart = budgets[0]?.week_starts_on ?? "monday";

  const now = new Date();

  // today's spend grouped by category
  const today = getPeriodRange("daily", now, weekStart);
  const catMap = new Map<string, CategorySlice>();
  for (const e of expenses) {
    const at = new Date(e.occurred_at);
    if (at < today.start || at >= today.end) continue;
    const name = e.categories?.name ?? "Uncategorized";
    const existing = catMap.get(name);
    if (existing) {
      existing.amount_minor += e.base_amount_minor;
    } else {
      catMap.set(name, {
        name,
        color: e.categories?.color ?? null,
        amount_minor: e.base_amount_minor,
      });
    }
  }
  const categories = [...catMap.values()].sort(
    (a, b) => b.amount_minor - a.amount_minor
  );

  // last 7 rolling days
  const trend: TrendBar[] = [];
  for (let i = 6; i >= 0; i--) {
    const dayStart = new Date(now);
    dayStart.setHours(0, 0, 0, 0);
    dayStart.setDate(dayStart.getDate() - i);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);
    const total = expenses
      .filter((e) => {
        const at = new Date(e.occurred_at);
        return at >= dayStart && at < dayEnd;
      })
      .reduce((sum, e) => sum + e.base_amount_minor, 0);
    trend.push({
      label: WEEKDAY[dayStart.getDay()],
      total_minor: total,
      isToday: i === 0,
    });
  }

  // weekly average per elapsed day
  const week = getPeriodRange("weekly", now, weekStart);
  const weekSpent = expenses
    .filter((e) => {
      const at = new Date(e.occurred_at);
      return at >= week.start && at < week.end;
    })
    .reduce((sum, e) => sum + e.base_amount_minor, 0);
  const elapsedDays = Math.max(
    Math.ceil((now.getTime() - week.start.getTime()) / 86_400_000),
    1
  );
  const avgPerDayMinor = Math.round(weekSpent / elapsedDays);

  const trendLimitMinor =
    dailySummary?.is_enabled ? dailySummary.limit_minor : 0;

  const greeting =
    now.getHours() < 12
      ? "Good morning"
      : now.getHours() < 18
        ? "Good afternoon"
        : "Good evening";
  const firstName =
    (user.user_metadata?.full_name as string | undefined)?.split(" ")[0] ??
    user.email?.split("@")[0] ??
    "there";

  return (
    <div className="grid gap-3.5">
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.09em] text-muted">
          {new Intl.DateTimeFormat("en-US", {
            weekday: "short",
            day: "numeric",
            month: "short",
          }).format(now)}
        </p>
        <h1 className="mt-1 text-[22px] font-bold tracking-tight text-ink">
          {greeting}, {firstName}
        </h1>
      </section>

      {summaries.length > 0 ? (
        <DashboardHero
          summaries={summaries}
          categories={categories}
          trend={trend}
          trendLimitMinor={trendLimitMinor}
          avgPerDayMinor={avgPerDayMinor}
        />
      ) : null}

      <section className="grid gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-ink">Recent</h2>
          <Link
            href="/expenses"
            className="text-sm font-semibold text-accent-ink hover:opacity-80"
          >
            View all →
          </Link>
        </div>
        <ExpenseList expenses={expenses.slice(0, 8)} />
      </section>
    </div>
  );
}
