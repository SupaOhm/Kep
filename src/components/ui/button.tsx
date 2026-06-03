import type { ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "md" | "sm" | "icon";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function buttonClassName({
  className,
  variant = "primary",
  size = "md"
}: {
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
} = {}) {
  return clsx(
    "inline-flex items-center justify-center gap-2 rounded-xl border font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50",
    size === "md" && "min-h-11 px-4 py-2.5 text-sm",
    size === "sm" && "min-h-9 px-3 py-2 text-sm",
    size === "icon" && "h-10 w-10 p-0",
    variant === "primary" &&
      "border-transparent bg-accent text-slate-950 shadow-sm shadow-accent/20 hover:bg-accent/90",
    variant === "secondary" &&
      "border-line bg-elevated text-ink hover:border-accent/30 hover:bg-surface",
    variant === "ghost" &&
      "border-transparent bg-transparent text-muted hover:bg-elevated hover:text-ink",
    variant === "danger" &&
      "border-danger/20 bg-danger/10 text-danger hover:bg-danger/15",
    className
  );
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonClassName({ className, variant, size })}
      {...props}
    />
  );
}
