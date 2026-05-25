import Link from "next/link";
import { Plus } from "lucide-react";
import { Button, buttonClassName } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label, Select } from "@/components/ui/field";
import { ExpenseList } from "@/features/expenses/expense-list";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ExpensesPage({
  searchParams
}: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    from?: string;
    to?: string;
  }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/");
  const userId = user.id;

  const { data: categoriesData } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", userId)
    .order("name");
  const categories = categoriesData ?? [];

  let query = supabase
    .from("expenses")
    .select("*, categories(name,color)")
    .eq("user_id", userId)
    .order("occurred_at", { ascending: false });

  if (params.category) query = query.eq("category_id", params.category);
  if (params.from)
    query = query.gte("occurred_at", new Date(params.from).toISOString());
  if (params.to)
    query = query.lte(
      "occurred_at",
      new Date(`${params.to}T23:59:59`).toISOString()
    );
  if (params.q) {
    const term = `%${params.q}%`;
    query = query.or(
      `merchant_name.ilike.${term},receiver_name.ilike.${term},note.ilike.${term}`
    );
  }

  const { data: expensesData } = await query.limit(100);
  const expenses = expensesData ?? [];

  return (
    <div className="grid gap-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-accent">Transactions</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink">
            Expenses
          </h1>
        </div>
        <Link href="/expenses/new" className={buttonClassName()}>
          <Plus className="h-4 w-4" />
          Add
        </Link>
      </div>
      <Card>
        <form className="grid gap-3 sm:grid-cols-5">
          <div className="grid gap-2 sm:col-span-2">
            <Label>Search</Label>
            <Input
              name="q"
              defaultValue={params.q}
              placeholder="Merchant, note, receiver"
            />
          </div>
          <div className="grid gap-2">
            <Label>Category</Label>
            <Select name="category" defaultValue={params.category ?? ""}>
              <option value="">All</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>From</Label>
            <Input type="date" name="from" defaultValue={params.from} />
          </div>
          <div className="grid gap-2">
            <Label>To</Label>
            <Input type="date" name="to" defaultValue={params.to} />
          </div>
          <div className="sm:col-span-5">
            <Button type="submit" variant="secondary">
              Apply filters
            </Button>
          </div>
        </form>
      </Card>
      <ExpenseList expenses={expenses} />
    </div>
  );
}
