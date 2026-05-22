"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/field";
import { minorToInputValue } from "@/lib/currency/money";
import { budgetSchema, type BudgetFormValues } from "@/lib/validation/schemas";
import type { Budget } from "@/types/database";
import { updateBudget } from "./actions";

export function BudgetForm({ budget }: { budget: Budget }) {
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, watch } = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      period: budget.period,
      is_enabled: budget.is_enabled,
      limit: minorToInputValue(budget.limit_minor, budget.currency_code),
      currency_code: budget.currency_code,
      warning_threshold: budget.warning_threshold,
      week_starts_on: budget.week_starts_on
    }
  });
  const enabled = watch("is_enabled");

  return (
    <form className="grid gap-3" onSubmit={handleSubmit((values) => startTransition(() => updateBudget(values)))}>
      <input type="hidden" {...register("period")} />
      <label className="flex items-center justify-between gap-3">
        <span className="font-medium capitalize text-ink">{budget.period}</span>
        <input
          type="checkbox"
          className="h-5 w-5 accent-emerald-500"
          {...register("is_enabled")}
        />
      </label>
      <div className="grid grid-cols-[1fr_7rem] gap-3">
        <div className="grid gap-2">
          <Label>Limit</Label>
          <Input inputMode="decimal" disabled={!enabled} {...register("limit")} />
        </div>
        <div className="grid gap-2">
          <Label>Currency</Label>
          <Input maxLength={8} disabled={!enabled} {...register("currency_code")} />
        </div>
      </div>
      <div className="grid gap-2">
        <Label>Warning threshold</Label>
        <Select disabled={!enabled} {...register("warning_threshold", { valueAsNumber: true })}>
          <option value={0.7}>70%</option>
          <option value={0.8}>80%</option>
          <option value={0.9}>90%</option>
        </Select>
      </div>
      {budget.period === "weekly" ? (
        <div className="grid gap-2">
          <Label>Week starts on</Label>
          <Select disabled={!enabled} {...register("week_starts_on")}>
            <option value="monday">Monday</option>
            <option value="sunday">Sunday</option>
          </Select>
        </div>
      ) : (
        <input type="hidden" defaultValue={budget.week_starts_on} {...register("week_starts_on")} />
      )}
      <Button type="submit" variant="secondary" disabled={isPending}>
        {isPending ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
