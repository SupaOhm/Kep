"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/field";
import type { Profile } from "@/types/database";
import { updateProfileSettings } from "./actions";

export function GeneralSettingsForm({ profile }: { profile: Profile }) {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="grid gap-4"
      action={(formData) => {
        startTransition(() =>
          updateProfileSettings({
            base_currency_code: String(formData.get("base_currency_code") ?? "THB"),
            slip_storage_preference: formData.get("slip_storage_preference") as Profile["slip_storage_preference"]
          })
        );
      }}
    >
      <div className="grid gap-2">
        <Label>Base currency</Label>
        <Input name="base_currency_code" defaultValue={profile.base_currency_code} maxLength={8} />
      </div>
      <div className="grid gap-2">
        <Label>Slip image storage</Label>
        <Select name="slip_storage_preference" defaultValue={profile.slip_storage_preference}>
          <option value="delete_after_confirm">Do not store after confirmation</option>
          <option value="store_private" disabled>
            Store privately later
          </option>
        </Select>
        <p className="text-sm text-muted">The MVP processes images in-browser and does not upload them.</p>
      </div>
      <Button type="submit" disabled={isPending} variant="secondary">
        {isPending ? "Saving..." : "Save settings"}
      </Button>
    </form>
  );
}
