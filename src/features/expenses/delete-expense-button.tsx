"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deleteExpense } from "./actions";

export function DeleteExpenseButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="danger"
      size="sm"
      disabled={isPending}
      onClick={() => {
        if (window.confirm("Delete this expense?")) {
          startTransition(() => deleteExpense(id));
        }
      }}
    >
      <Trash2 className="h-4 w-4" />
      Delete
    </Button>
  );
}
