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

function throwIfSupabaseError(error: { message: string } | null, context: string) {
  if (error) {
    throw new Error(`${context}: ${error.message}`);
  }
}

export async function ensureUserWorkspace(supabase: AppSupabaseClient, user: User) {
  const metadata = user.user_metadata;
  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email ?? null,
      display_name: typeof metadata.name === "string" ? metadata.name : null,
      avatar_url: typeof metadata.avatar_url === "string" ? metadata.avatar_url : null
    },
    { onConflict: "id" }
  );
  throwIfSupabaseError(profileError, "Unable to upsert profile");

  const { data: existingDefaultCategories, error: categoriesReadError } = await supabase
    .from("categories")
    .select("name")
    .eq("user_id", user.id)
    .eq("is_default", true);
  throwIfSupabaseError(categoriesReadError, "Unable to read categories");

  const existingCategoryNames = new Set((existingDefaultCategories ?? []).map((category) => category.name));
  const missingCategories = defaultCategories.filter(([name]) => !existingCategoryNames.has(name));

  if (missingCategories.length > 0) {
    const { error: categoriesInsertError } = await supabase.from("categories").insert(
      missingCategories.map(([name, color, icon]) => ({
        user_id: user.id,
        name,
        color,
        icon,
        is_default: true
      }))
    );
    throwIfSupabaseError(categoriesInsertError, "Unable to create default categories");
  }

  const { data: existingBudgets, error: budgetsReadError } = await supabase
    .from("budgets")
    .select("period")
    .eq("user_id", user.id);
  throwIfSupabaseError(budgetsReadError, "Unable to read budgets");

  const existingBudgetPeriods = new Set((existingBudgets ?? []).map((budget) => budget.period));
  const missingBudgets = defaultBudgets.filter((budget) => !existingBudgetPeriods.has(budget.period));

  if (missingBudgets.length > 0) {
    const { error: budgetsInsertError } = await supabase.from("budgets").insert(
      missingBudgets.map((budget) => ({
        user_id: user.id,
        period: budget.period,
        limit_minor: budget.limit_minor,
        is_enabled: false,
        currency_code: "THB"
      }))
    );
    throwIfSupabaseError(budgetsInsertError, "Unable to create default budgets");
  }
}
