import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { CategoryManager } from "@/features/categories/category-manager";
import { createClient } from "@/lib/supabase/server";

export default async function CategoriesSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const { data: categoriesData } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", user.id)
    .order("name");
  const categories = categoriesData ?? [];

  return (
    <div className="mx-auto grid max-w-2xl gap-5">
      <div>
        <p className="text-sm font-medium text-accent">Categories</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink">
          Category settings
        </h1>
        <p className="mt-2 text-sm text-muted">
          Used categories are archived from the app instead of deleted.
        </p>
      </div>
      <Card>
        <CategoryManager categories={categories} />
      </Card>
    </div>
  );
}
