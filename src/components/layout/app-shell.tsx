import Link from "next/link";
import { Plus, WalletCards } from "lucide-react";
import { NavBar } from "./nav-bar";
import { SignOutButton } from "@/features/auth/sign-out-button";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 pb-24 pt-4 sm:px-6 lg:px-8">
      <header className="sticky top-0 z-20 -mx-4 mb-6 border-b border-line bg-canvas/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 font-bold tracking-tight text-ink"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-black text-slate-950">
              K
            </span>
            <span className="text-base">Kep</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/expenses/new"
              className="hidden min-h-9 items-center justify-center gap-1.5 rounded-xl border border-line bg-elevated px-3 text-sm font-semibold text-ink transition hover:bg-surface sm:inline-flex"
            >
              <Plus className="h-3.5 w-3.5" />
              Add
            </Link>
            <Link
              href="/upload"
              className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-xl bg-accent px-3 text-sm font-semibold text-slate-950 transition hover:bg-accent/90"
            >
              <WalletCards className="h-3.5 w-3.5" />
              Upload slip
            </Link>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <NavBar />
    </div>
  );
}
