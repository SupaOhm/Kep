import type { User } from "@supabase/supabase-js";
import type { AppSupabaseClient } from "./types";

const defaultCategories = [
  ["Food", "#10b981", "utensils"],
  ["Transport", "#38bdf8", "car"],
  ["Shopping", "#f472b6", "shopping-bag"],
  ["Bills", "#f59e0b", "receipt"],
  ["Subscriptions", "#8b5cf6", "repeat"],
  ["Entertainment", "#ef4444", "ticket"],
  ["Family", "#14b8a6", "users"],
  ["Education", "#6366f1", "book-open"],
  ["Health", "#22c55e", "heart"],
  ["Transfer", "#64748b", "arrow-right-left"],
  ["Other", "#94a3b8", "circle"]
] as const;

const defaultBudgets = [
  { period: "daily", limit_minor: 0 },
  { period: "weekly", limit_minor: 0 },
  { period: "monthly", limit_minor: 0 }
] as const;

export async function ensureUserWorkspace(supabase: AppSupabaseClient, user: User) {
  const metadata = user.user_metadata;
  await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email ?? null,
      display_name: typeof metadata.name === "string" ? metadata.name : null,
      avatar_url: typeof metadata.avatar_url === "string" ? metadata.avatar_url : null
    },
    { onConflict: "id" }
  );

  const { count } = await supabase
    .from("categories")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (!count) {
    await supabase.from("categories").insert(
      defaultCategories.map(([name, color, icon]) => ({
        user_id: user.id,
        name,
        color,
        icon,
        is_default: true
      }))
    );
  }

  await supabase.from("budgets").upsert(
    defaultBudgets.map((budget) => ({
      user_id: user.id,
      period: budget.period,
      limit_minor: budget.limit_minor,
      is_enabled: false,
      currency_code: "THB"
    })),
    { onConflict: "user_id,period" }
  );
}
