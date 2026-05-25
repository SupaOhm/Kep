import { Chrome } from "lucide-react";
import { signInWithGoogle } from "./actions";
import { Button } from "@/components/ui/button";

export function GoogleSignInButton({ nextPath = "/dashboard" }: { nextPath?: string }) {
  return (
    <form action={signInWithGoogle}>
      <input type="hidden" name="next" value={nextPath} />
      <Button type="submit" className="w-full">
        <Chrome className="h-4 w-4" />
        Continue with Google
      </Button>
    </form>
  );
}
