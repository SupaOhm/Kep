"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { getSupabaseEnv } from "./env";
import type { AppSupabaseClient } from "./types";

export function createClient(): AppSupabaseClient {
  const { url, anonKey } = getSupabaseEnv();
  // @supabase/ssr 0.5.x returns an older SupabaseClient generic shape when paired
  // with newer supabase-js. Keep the assertion at the factory boundary.
  return createBrowserClient<Database>(url, anonKey) as unknown as AppSupabaseClient;
}
