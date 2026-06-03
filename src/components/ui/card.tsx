import type { HTMLAttributes } from "react";
import { clsx } from "clsx";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-line/60 bg-surface/95 p-5 shadow-card backdrop-blur",
        className
      )}
      {...props}
    />
  );
}
