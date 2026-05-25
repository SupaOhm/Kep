import { z } from "zod";

const optionalText = z.string().trim().max(240).optional().or(z.literal(""));
const currencyCode = z
  .string()
  .trim()
  .min(3)
  .max(8)
  .transform((value) => value.toUpperCase());
const optionalUuid = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().uuid().optional()
);

export const expenseSchema = z.object({
  id: optionalUuid,
  amount: z.string().trim().min(1, "Amount is required."),
  currency_code: currencyCode.default("THB"),
  occurred_at: z.string().trim().min(1, "Date and time are required."),
  category_id: z.string().uuid().nullable().optional().or(z.literal("")),
  merchant_name: optionalText,
  receiver_name: optionalText,
  bank_name: optionalText,
  reference_id: optionalText,
  note: z.string().trim().max(1000).optional().or(z.literal("")),
  payment_method: optionalText,
  source: z.enum(["manual", "slip_ocr", "future_api"]).default("manual"),
  raw_ocr_text: z.string().max(20_000).optional().or(z.literal(""))
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;

export const budgetSchema = z.object({
  period: z.enum(["daily", "weekly", "monthly"]),
  is_enabled: z.coerce.boolean().default(false),
  limit: z.string().trim().default("0"),
  currency_code: currencyCode.default("THB"),
  warning_threshold: z.coerce.number().min(0.1).max(1).default(0.8),
  week_starts_on: z.enum(["monday", "sunday"]).default("monday")
});

export type BudgetFormValues = z.infer<typeof budgetSchema>;

export const categorySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, "Name is required.").max(80),
  color: z.string().trim().max(40).optional().or(z.literal("")),
  icon: z.string().trim().max(80).optional().or(z.literal(""))
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

export const profileSettingsSchema = z.object({
  base_currency_code: currencyCode.optional(),
  theme_preference: z.enum(["system", "light", "dark"]).optional(),
  slip_storage_preference: z.enum(["delete_after_confirm", "store_private"]).optional()
});

export type ProfileSettingsValues = z.infer<typeof profileSettingsSchema>;
