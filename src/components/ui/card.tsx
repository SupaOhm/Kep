import type { HTMLAttributes } from "react";
import { clsx } from "clsx";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "rounded-lg border border-line bg-surface/90 p-4 shadow-sm backdrop-blur",
        className
      )}
      {...props}
    />
  );
}
