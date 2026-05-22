"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { categorySchema, type CategoryFormValues } from "@/lib/validation/schemas";

async function getUserContext() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/");
  return { supabase, userId: user.id };
}

export async function saveCategory(values: CategoryFormValues) {
  const parsed = categorySchema.parse(values);
  const { supabase, userId } = await getUserContext();
  const payload = {
    user_id: userId,
    name: parsed.name,
    color: parsed.color || null,
    icon: parsed.icon || null
  };

  const { error } = parsed.id
    ? await supabase.from("categories").update(payload).eq("id", parsed.id).eq("user_id", userId)
    : await supabase.from("categories").insert(payload);

  if (error) throw new Error(error.message);
  revalidatePath("/settings");
}

export async function archiveCategory(id: string) {
  const parsedId = z.string().uuid().parse(id);
  const { supabase, userId } = await getUserContext();
  const { error } = await supabase
    .from("categories")
    .update({ is_archived: true })
    .eq("id", parsedId)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
  revalidatePath("/settings");
}

export async function restoreCategory(id: string) {
  const parsedId = z.string().uuid().parse(id);
  const { supabase, userId } = await getUserContext();
  const { error } = await supabase
    .from("categories")
    .update({ is_archived: false })
    .eq("id", parsedId)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
  revalidatePath("/settings");
}
