"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { parseMoneyToMinor } from "@/lib/currency/money";
import { createClient } from "@/lib/supabase/server";
import { budgetSchema, type BudgetFormValues } from "@/lib/validation/schemas";

export async function updateBudget(values: BudgetFormValues) {
  const parsed = budgetSchema.parse(values);
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const limitMinor = parseMoneyToMinor(parsed.limit || "0", parsed.currency_code);
  const { error } = await supabase.from("budgets").upsert(
    {
      user_id: user.id,
      period: parsed.period,
      is_enabled: parsed.is_enabled,
      limit_minor: Math.max(limitMinor, 0),
      currency_code: parsed.currency_code,
      rollover_mode: "none",
      warning_threshold: parsed.warning_threshold,
      week_starts_on: parsed.week_starts_on
    },
    { onConflict: "user_id,period" }
  );

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
  revalidatePath("/budgets");
}
