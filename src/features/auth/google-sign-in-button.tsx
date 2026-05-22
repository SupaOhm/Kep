import { Chrome } from "lucide-react";
import { signInWithGoogle } from "./actions";
import { Button } from "@/components/ui/button";

export function GoogleSignInButton() {
  return (
    <form action={signInWithGoogle}>
      <Button type="submit" className="w-full">
        <Chrome className="h-4 w-4" />
        Continue with Google
      </Button>
    </form>
  );
}
