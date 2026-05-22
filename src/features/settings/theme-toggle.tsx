"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { updateProfileSettings } from "./actions";
import type { Profile } from "@/types/database";

type Theme = Profile["theme_preference"];

const themes: Array<{ value: Theme; label: string; icon: React.ReactNode }> = [
  { value: "system", label: "System", icon: <Monitor className="h-4 w-4" /> },
  { value: "light", label: "Light", icon: <Sun className="h-4 w-4" /> },
  { value: "dark", label: "Dark", icon: <Moon className="h-4 w-4" /> }
];

export function ThemeToggle({ initialTheme }: { initialTheme: Theme }) {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [, startTransition] = useTransition();

  useEffect(() => {
    localStorage.setItem("kep-theme", theme);
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", theme === "dark" || (theme === "system" && systemDark));
  }, [theme]);

  return (
    <div className="grid grid-cols-3 gap-2 rounded-lg border border-line bg-elevated p-1">
      {themes.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => {
            setTheme(item.value);
            startTransition(() => updateProfileSettings({ theme_preference: item.value }));
          }}
          className={`flex min-h-10 items-center justify-center gap-2 rounded-md text-sm transition ${
            theme === item.value ? "bg-accent text-slate-950" : "text-muted hover:bg-surface hover:text-ink"
          }`}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  );
}
