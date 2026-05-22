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
    "inline-flex items-center justify-center gap-2 rounded-lg border font-medium transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60",
    size === "md" && "min-h-11 px-4 py-2.5 text-sm",
    size === "sm" && "min-h-9 px-3 py-1.5 text-sm",
    size === "icon" && "h-10 w-10 p-0",
    variant === "primary" && "border-accent bg-accent text-slate-950 shadow-sm hover:bg-accent/90",
    variant === "secondary" && "border-line bg-elevated text-ink hover:border-accent/40 hover:bg-surface",
    variant === "ghost" && "border-transparent bg-transparent text-muted hover:bg-surface hover:text-ink",
    variant === "danger" && "border-danger/30 bg-danger/10 text-danger hover:bg-danger/15",
    className
  );
}

export function Button({ className, variant = "primary", size = "md", ...props }: ButtonProps) {
  return (
    <button
      className={buttonClassName({ className, variant, size })}
      {...props}
    />
  );
}
