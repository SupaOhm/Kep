import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { CookieMethodsServer } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { getSupabaseEnv } from "./env";
import type { AppSupabaseClient } from "./types";

export async function createClient(): Promise<AppSupabaseClient> {
  const cookieStore = await cookies();
  const { url, anonKey } = getSupabaseEnv();

  const cookieMethods: CookieMethodsServer = {
    getAll() {
      return cookieStore.getAll();
    },
    setAll(cookiesToSet) {
      try {
        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
      } catch {
        // Server Components cannot set cookies; middleware refreshes sessions.
      }
    }
  };

  // @supabase/ssr 0.5.x returns an older SupabaseClient generic shape when paired
  // with newer supabase-js. Keep the assertion at the factory boundary.
  return createServerClient<Database>(url, anonKey, {
    cookies: cookieMethods
  }) as unknown as AppSupabaseClient;
}
