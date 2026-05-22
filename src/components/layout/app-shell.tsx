import Link from "next/link";
import { redirect } from "next/navigation";
import { BarChart3, Home, Plus, ReceiptText, Settings, UploadCloud, WalletCards } from "lucide-react";
import { SignOutButton } from "@/features/auth/sign-out-button";
import { createClient } from "@/lib/supabase/server";
import { ensureUserWorkspace } from "@/lib/supabase/onboarding";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/expenses", label: "Expenses", icon: ReceiptText },
  { href: "/upload", label: "Upload", icon: UploadCloud, primary: true },
  { href: "/budgets", label: "Budgets", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings }
];

export async function AppShell({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  await ensureUserWorkspace(supabase, user);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 pb-24 pt-4 sm:px-6 lg:px-8">
      <header className="sticky top-0 z-20 -mx-4 mb-4 border-b border-line bg-canvas/85 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold tracking-tight text-ink">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink text-sm font-bold text-canvas">
              K
            </span>
            <span>Kep</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/expenses/new"
              className="hidden min-h-10 items-center justify-center gap-2 rounded-lg border border-line bg-elevated px-3 text-sm font-medium text-ink hover:bg-surface sm:inline-flex"
            >
              <Plus className="h-4 w-4" />
              Add
            </Link>
            <Link
              href="/upload"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-accent bg-accent px-3 text-sm font-medium text-slate-950 hover:bg-accent/90"
            >
              <WalletCards className="h-4 w-4" />
              Upload slip
            </Link>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 px-2 pt-2 backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-medium ${
                  item.primary ? "bg-accent text-slate-950" : "text-muted hover:bg-elevated hover:text-ink"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
