import { Card } from "@/components/ui/card";
import { CategoryManager } from "@/features/categories/category-manager";
import { GeneralSettingsForm } from "@/features/settings/general-settings-form";
import { ThemeToggle } from "@/features/settings/theme-toggle";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/");
  const userId = user.id;
  const [{ data: profile }, { data: categoriesData }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).single(),
    supabase.from("categories").select("*").eq("user_id", userId).order("name")
  ]);
  const categories = categoriesData ?? [];

  if (!profile) return null;

  return (
    <div className="grid gap-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted">Preferences</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink">
          Settings
        </h1>
      </div>
      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="grid gap-4">
          <div>
            <h2 className="text-lg font-semibold text-ink">General</h2>
            <p className="mt-1 text-sm text-muted">
              Currency, storage, and product defaults.
            </p>
          </div>
          <GeneralSettingsForm profile={profile} />
        </Card>
        <Card className="grid gap-4">
          <div>
            <h2 className="text-lg font-semibold text-ink">Theme</h2>
            <p className="mt-1 text-sm text-muted">
              Choose system, light, or dark.
            </p>
          </div>
          <ThemeToggle initialTheme={profile.theme_preference} />
        </Card>
      </section>
      <Card className="grid gap-4">
        <div>
          <h2 className="text-lg font-semibold text-ink">Categories</h2>
          <p className="mt-1 text-sm text-muted">
            Archive categories instead of deleting used records.
          </p>
        </div>
        <CategoryManager categories={categories} />
      </Card>
    </div>
  );
}
