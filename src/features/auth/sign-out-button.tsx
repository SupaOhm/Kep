import { LogOut } from "lucide-react";
import { signOut } from "./actions";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <Button type="submit" variant="ghost" size="icon" aria-label="Sign out">
        <LogOut className="h-4 w-4" />
      </Button>
    </form>
  );
}
