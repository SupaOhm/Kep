"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Home, ReceiptText, Settings, UploadCloud } from "lucide-react";
import { clsx } from "clsx";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  primary?: boolean;
};

const nav: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/expenses", label: "Expenses", icon: ReceiptText },
  { href: "/upload", label: "Upload", icon: UploadCloud, primary: true },
  { href: "/budgets", label: "Budgets", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/80 px-3.5 pt-2 backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-5 items-end">
        {nav.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));

          if (item.primary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1.5"
              >
                <span className="-mt-5 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-accent shadow-float">
                  <Icon className="h-6 w-6 stroke-[2.4] text-white" />
                </span>
                <span className="text-[10px] font-bold tracking-wide text-accent-ink">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex flex-col items-center gap-1 py-1 text-[10px] font-bold tracking-wide transition-colors",
                isActive ? "text-accent-ink" : "text-muted hover:text-ink"
              )}
            >
              <Icon
                className={clsx(
                  "h-[23px] w-[23px] transition-all",
                  isActive ? "stroke-[2.5]" : "stroke-2"
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
