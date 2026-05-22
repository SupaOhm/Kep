import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { ExpenseForm } from "@/features/expenses/expense-form";
import { minorToInputValue } from "@/lib/currency/money";
import { toDateTimeLocalValue } from "@/lib/date/periods";
import { ensureUserWorkspace } from "@/lib/supabase/onboarding";
import { createClient } from "@/lib/supabase/server";

export default async function EditExpensePage({ params }: { params: Promise<{ id: string }> }) {
  const routeParams = await params;
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) notFound();
  await ensureUserWorkspace(supabase, user);
  const userId = user.id;

  const [{ data: expense }, { data: categoriesData }] = await Promise.all([
    supabase.from("expenses").select("*").eq("id", routeParams.id).eq("user_id", userId).single(),
    supabase.from("categories").select("*").eq("user_id", userId).order("name")
  ]);
  const categories = categoriesData ?? [];

  if (!expense) notFound();

  return (
    <AppShell>
      <div className="mx-auto grid max-w-2xl gap-5">
        <div>
          <p className="text-sm font-medium text-accent">Edit transaction</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink">Edit expense</h1>
        </div>
        <Card>
          <ExpenseForm
            categories={categories}
            submitLabel="Update expense"
            initialValues={{
              id: expense.id,
              amount: minorToInputValue(expense.amount_minor, expense.currency_code),
              currency_code: expense.currency_code,
              occurred_at: toDateTimeLocalValue(new Date(expense.occurred_at)),
              category_id: expense.category_id ?? "",
              merchant_name: expense.merchant_name ?? "",
              receiver_name: expense.receiver_name ?? "",
              bank_name: expense.bank_name ?? "",
              reference_id: expense.reference_id ?? "",
              note: expense.note ?? "",
              payment_method: expense.payment_method ?? "",
              source: expense.source,
              raw_ocr_text: expense.raw_ocr_text ?? ""
            }}
          />
        </Card>
      </div>
    </AppShell>
  );
}
