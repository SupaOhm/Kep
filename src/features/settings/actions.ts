"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { profileSettingsSchema, type ProfileSettingsValues } from "@/lib/validation/schemas";

export async function updateProfileSettings(values: ProfileSettingsValues) {
  const parsed = profileSettingsSchema.parse(values);
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const { error } = await supabase.from("profiles").update(parsed).eq("id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/settings");
}
