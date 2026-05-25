import { Card } from "@/components/ui/card";
import { ExpenseForm } from "@/features/expenses/expense-form";
import { toDateTimeLocalValue } from "@/lib/date/periods";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function NewExpensePage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/");
  const { data: categoriesData } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_archived", false)
    .order("name");
  const categories = categoriesData ?? [];

  return (
    <div className="mx-auto grid max-w-2xl gap-5">
      <div>
        <p className="text-sm font-medium text-accent">Manual entry</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink">
          Add expense
        </h1>
      </div>
      <Card>
        <ExpenseForm
          categories={categories}
          initialValues={{
            amount: "",
            currency_code: "THB",
            occurred_at: toDateTimeLocalValue(),
            category_id: "",
            merchant_name: "",
            receiver_name: "",
            bank_name: "",
            reference_id: "",
            note: "",
            payment_method: "",
            source: "manual",
            raw_ocr_text: ""
          }}
        />
      </Card>
    </div>
  );
}
