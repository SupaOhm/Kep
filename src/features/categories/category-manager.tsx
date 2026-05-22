"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Archive, RotateCcw, Save } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";
import { categorySchema, type CategoryFormValues } from "@/lib/validation/schemas";
import type { Category } from "@/types/database";
import { archiveCategory, restoreCategory, saveCategory } from "./actions";

export function CategoryManager({ categories }: { categories: Category[] }) {
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, reset } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", color: "#10b981", icon: "" }
  });

  return (
    <div className="grid gap-4">
      <form
        className="grid gap-3 rounded-lg border border-line bg-elevated p-3"
        onSubmit={handleSubmit((values) =>
          startTransition(async () => {
            await saveCategory(values);
            reset({ name: "", color: "#10b981", icon: "" });
          })
        )}
      >
        <div className="grid gap-2">
          <Label>Name</Label>
          <Input placeholder="Coffee" {...register("name")} />
        </div>
        <div className="grid grid-cols-[1fr_1fr_auto] items-end gap-3">
          <div className="grid gap-2">
            <Label>Color</Label>
            <Input placeholder="#10b981" {...register("color")} />
          </div>
          <div className="grid gap-2">
            <Label>Icon</Label>
            <Input placeholder="coffee" {...register("icon")} />
          </div>
          <Button type="submit" disabled={isPending} size="icon" aria-label="Save category">
            <Save className="h-4 w-4" />
          </Button>
        </div>
      </form>
      <div className="grid gap-2">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-line bg-elevated p-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span
                className="h-3 w-3 rounded-full"
                style={{ background: category.color ?? "#94a3b8" }}
              />
              <div className="min-w-0">
                <p className="truncate font-medium text-ink">{category.name}</p>
                <p className="text-xs text-muted">
                  {category.is_default ? "Default" : "Custom"}
                  {category.is_archived ? " · Archived" : ""}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={category.is_archived ? "Restore category" : "Archive category"}
              onClick={() =>
                startTransition(() =>
                  category.is_archived ? restoreCategory(category.id) : archiveCategory(category.id)
                )
              }
            >
              {category.is_archived ? <RotateCcw className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
