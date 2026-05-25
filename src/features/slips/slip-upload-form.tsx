"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileImage, ScanText, Save, UploadCloud } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FieldError,
  Input,
  Label,
  Select,
  Textarea
} from "@/components/ui/field";
import { toDateTimeLocalValue } from "@/lib/date/periods";
import type { OcrProgress } from "@/lib/ocr/slip-processor";
import {
  expenseSchema,
  type ExpenseFormValues
} from "@/lib/validation/schemas";
import type { Category } from "@/types/database";
import { saveExpense } from "@/features/expenses/actions";

export function SlipUploadForm({ categories }: { categories: Category[] }) {
  const [progress, setProgress] = useState<OcrProgress | null>(null);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [isOcrRunning, setIsOcrRunning] = useState(false);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: "",
      currency_code: "THB",
      occurred_at: toDateTimeLocalValue(),
      category_id: "",
      merchant_name: "",
      receiver_name: "",
      bank_name: "",
      reference_id: "",
      note: "",
      payment_method: "",
      source: "slip_ocr",
      raw_ocr_text: ""
    }
  });

  const rawText = watch("raw_ocr_text");

  async function runOcr(file: File) {
    setOcrError(null);
    setIsOcrRunning(true);
    setProgress({ status: "starting", progress: 0 });

    try {
      const { localTesseractSlipProcessor } =
        await import("@/lib/ocr/local-tesseract-processor");
      const draft = await localTesseractSlipProcessor.process(
        file,
        setProgress
      );
      setValue("raw_ocr_text", draft.raw_text);
      if (draft.amount) setValue("amount", draft.amount);
      if (draft.occurred_at) setValue("occurred_at", draft.occurred_at);
      if (draft.receiver_name) setValue("receiver_name", draft.receiver_name);
      if (draft.merchant_name) setValue("merchant_name", draft.merchant_name);
      if (draft.bank_name) setValue("bank_name", draft.bank_name);
      if (draft.reference_id) setValue("reference_id", draft.reference_id);
      setProgress({ status: "complete", progress: 1 });
    } catch (error) {
      setOcrError(error instanceof Error ? error.message : "OCR failed.");
    } finally {
      setIsOcrRunning(false);
    }
  }

  return (
    <div className="grid gap-4">
      <Card className="grid gap-4 border-accent/30">
        <div className="flex items-start gap-3">
          <UploadCloud className="mt-1 h-5 w-5 text-accent" />
          <div>
            <h2 className="font-semibold text-ink">Upload Thai bank e-slip</h2>
            <p className="mt-1 text-sm leading-6 text-muted">
              OCR runs locally in your browser. Review every field before
              saving.
            </p>
          </div>
        </div>
        <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-line bg-elevated p-4 text-center transition hover:border-accent/60">
          <FileImage className="h-8 w-8 text-accent" />
          <span className="text-sm font-medium text-ink">
            Choose slip image
          </span>
          <span className="text-xs text-muted">PNG or JPG from photos</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void runOcr(file);
            }}
          />
        </label>
        {progress ? (
          <div className="grid gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">{progress.status}</span>
              <span className="font-medium text-ink">
                {Math.round(progress.progress * 100)}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: `${progress.progress * 100}%` }}
              />
            </div>
          </div>
        ) : null}
        {ocrError ? <p className="text-sm text-danger">{ocrError}</p> : null}
      </Card>

      <Card>
        <form
          className="grid gap-4"
          onSubmit={handleSubmit((values) =>
            startTransition(() => saveExpense(values))
          )}
        >
          <input type="hidden" {...register("source")} />
          <div className="flex items-center gap-2">
            <ScanText className="h-5 w-5 text-accent" />
            <h2 className="font-semibold text-ink">Confirm expense draft</h2>
          </div>
          <div className="grid grid-cols-[1fr_7rem] gap-3">
            <div className="grid gap-2">
              <Label>Amount</Label>
              <Input
                inputMode="decimal"
                placeholder="1234.56"
                {...register("amount")}
              />
              <FieldError message={errors.amount?.message} />
            </div>
            <div className="grid gap-2">
              <Label>Currency</Label>
              <Input maxLength={8} {...register("currency_code")} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Date and time</Label>
            <Input type="datetime-local" {...register("occurred_at")} />
            <FieldError message={errors.occurred_at?.message} />
          </div>
          <div className="grid gap-2">
            <Label>Category</Label>
            <Select {...register("category_id")}>
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
              <Label>Merchant</Label>
              <Input {...register("merchant_name")} />
            </div>
            <div className="grid gap-2">
              <Label>Receiver</Label>
              <Input {...register("receiver_name")} />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Bank</Label>
              <Input {...register("bank_name")} />
            </div>
            <div className="grid gap-2">
              <Label>Reference ID</Label>
              <Input {...register("reference_id")} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Note</Label>
            <Textarea placeholder="Optional note" {...register("note")} />
          </div>
          <details className="rounded-lg border border-line bg-elevated p-3">
            <summary className="cursor-pointer text-sm font-medium text-ink">
              Raw OCR text
            </summary>
            <Textarea
              className="mt-3 font-mono text-xs"
              {...register("raw_ocr_text")}
            />
            {!rawText ? (
              <p className="mt-2 text-sm text-muted">
                OCR text will appear here after scanning.
              </p>
            ) : null}
          </details>
          <Button type="submit" disabled={isPending || isOcrRunning}>
            <Save className="h-4 w-4" />
            {isPending ? "Saving..." : "Confirm and save"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
