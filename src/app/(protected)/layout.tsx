import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { ensureUserWorkspace } from "@/lib/supabase/onboarding";
import { createClient } from "@/lib/supabase/server";

export default async function ProtectedLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const startedAt = performance.now();
  await ensureUserWorkspace(supabase, user);

  if (process.env.NODE_ENV === "development") {
    console.info(
      `ensureUserWorkspace completed in ${Math.round(performance.now() - startedAt)}ms`
    );
  }

  return <AppShell>{children}</AppShell>;
}
