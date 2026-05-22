"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { fromDateTimeLocalValue } from "@/lib/date/periods";
import { parseMoneyToMinor } from "@/lib/currency/money";
import { createClient } from "@/lib/supabase/server";
import { expenseSchema, type ExpenseFormValues } from "@/lib/validation/schemas";

function normalizeOptionalText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

async function getUserId() {
  const supabase = await createClient();
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();
  if (error || !user) redirect("/");
  return { supabase, userId: user.id };
}

export async function saveExpense(values: ExpenseFormValues) {
  const parsed = expenseSchema.parse(values);
  const { supabase, userId } = await getUserId();
  const amountMinor = parseMoneyToMinor(parsed.amount, parsed.currency_code);

  const payload = {
    user_id: userId,
    category_id: parsed.category_id || null,
    amount_minor: amountMinor,
    currency_code: parsed.currency_code,
    base_amount_minor: amountMinor,
    base_currency_code: parsed.currency_code,
    exchange_rate_to_base: null,
    occurred_at: fromDateTimeLocalValue(parsed.occurred_at),
    merchant_name: normalizeOptionalText(parsed.merchant_name),
    receiver_name: normalizeOptionalText(parsed.receiver_name),
    bank_name: normalizeOptionalText(parsed.bank_name),
    reference_id: normalizeOptionalText(parsed.reference_id),
    note: normalizeOptionalText(parsed.note),
    payment_method: normalizeOptionalText(parsed.payment_method),
    source: parsed.source,
    raw_ocr_text: normalizeOptionalText(parsed.raw_ocr_text)
  };

  const { error } = parsed.id
    ? await supabase.from("expenses").update(payload).eq("id", parsed.id).eq("user_id", userId)
    : await supabase.from("expenses").insert(payload);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath("/expenses");
  redirect("/expenses");
}

export async function deleteExpense(id: string) {
  const parsedId = z.string().uuid().parse(id);
  const { supabase, userId } = await getUserId();
  const { error } = await supabase.from("expenses").delete().eq("id", parsedId).eq("user_id", userId);
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath("/expenses");
}
