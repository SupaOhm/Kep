"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label, Select, Textarea } from "@/components/ui/field";
import { expenseSchema, type ExpenseFormValues } from "@/lib/validation/schemas";
import { saveExpense } from "./actions";
import type { Category } from "@/types/database";

type Props = {
  categories: Category[];
  initialValues: ExpenseFormValues;
  submitLabel?: string;
};

export function ExpenseForm({ categories, initialValues, submitLabel = "Save expense" }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: initialValues
  });

  return (
    <form
      className="grid gap-4"
      onSubmit={handleSubmit((values) => {
        setSubmitError(null);
        startTransition(async () => {
          try {
            const result = await saveExpense(values);
            if (!result.ok) {
              setSubmitError(result.error ?? "Unable to save expense.");
              return;
            }

            router.push("/expenses");
            router.refresh();
          } catch (error) {
            setSubmitError(error instanceof Error ? error.message : "Unable to save expense.");
          }
        });
      })}
    >
      <input type="hidden" {...register("id")} />
      <input type="hidden" {...register("source")} />
      <input type="hidden" {...register("raw_ocr_text")} />
      <div className="grid grid-cols-[1fr_7rem] gap-3">
        <div className="grid gap-2">
          <Label htmlFor="amount">Amount</Label>
          <Input id="amount" inputMode="decimal" placeholder="120.00" {...register("amount")} />
          <FieldError message={errors.amount?.message} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="currency">Currency</Label>
          <Input id="currency" maxLength={8} {...register("currency_code")} />
          <FieldError message={errors.currency_code?.message} />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="occurred_at">Date and time</Label>
        <Input id="occurred_at" type="datetime-local" {...register("occurred_at")} />
        <FieldError message={errors.occurred_at?.message} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="category_id">Category</Label>
        <Select id="category_id" {...register("category_id")}>
          <option value="">Uncategorized</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="merchant_name">Merchant</Label>
          <Input id="merchant_name" placeholder="Lotus, Grab, 7-Eleven" {...register("merchant_name")} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="receiver_name">Receiver</Label>
          <Input id="receiver_name" placeholder="Receiver name" {...register("receiver_name")} />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="payment_method">Payment method</Label>
          <Input id="payment_method" placeholder="PromptPay, card, cash" {...register("payment_method")} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="reference_id">Reference ID</Label>
          <Input id="reference_id" placeholder="Optional" {...register("reference_id")} />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="bank_name">Bank</Label>
        <Input id="bank_name" placeholder="KBank, SCB, Krungthai" {...register("bank_name")} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="note">Note</Label>
        <Textarea id="note" placeholder="Optional note" {...register("note")} />
      </div>
      {submitError ? <p className="text-sm text-danger">{submitError}</p> : null}
      <Button type="submit" disabled={isPending}>
        <Save className="h-4 w-4" />
        {isPending ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
