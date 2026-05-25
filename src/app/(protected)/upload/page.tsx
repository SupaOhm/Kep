import { SlipUploadForm } from "@/features/slips/slip-upload-form";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function UploadPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/");
  const { data: categoriesData } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_archived", false)
    .order("name");
  const categories = categoriesData ?? [];

  return (
    <div className="mx-auto grid max-w-2xl gap-5">
      <div>
        <p className="text-sm font-medium text-accent">Slip OCR</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink">
          Upload slip
        </h1>
        <p className="mt-2 text-sm text-muted">
          OCR is best-effort and never saves automatically. Slip images are not
          uploaded by default.
        </p>
      </div>
      <SlipUploadForm categories={categories} />
    </div>
  );
}
