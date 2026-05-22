import { createServerClient } from "@supabase/ssr";
import type { CookieMethodsServer } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import type { Database } from "@/types/database";
import { getSupabaseEnv } from "./env";

const protectedPrefixes = ["/dashboard", "/expenses", "/upload", "/budgets", "/settings"];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { url, anonKey } = getSupabaseEnv();

  const cookieMethods: CookieMethodsServer = {
    getAll() {
      return request.cookies.getAll();
    },
    setAll(cookiesToSet) {
      cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
      response = NextResponse.next({ request });
      cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
    }
  };

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: cookieMethods
  });

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const isProtected = protectedPrefixes.some((prefix) => request.nextUrl.pathname.startsWith(prefix));
  if (isProtected && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/";
    redirectUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (request.nextUrl.pathname === "/" && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}
