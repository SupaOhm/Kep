import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const envFiles = [".env.local", ".env"];

for (const file of envFiles) {
  const path = resolve(process.cwd(), file);
  if (!existsSync(path)) continue;

  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const name = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/g, "");

    process.env[name] ??= value;
  }
}

const requiredEnv = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"];

const missing = requiredEnv.filter((name) => !process.env[name]?.trim());

if (missing.length > 0) {
  console.error("Missing required environment variables:");
  for (const name of missing) {
    console.error(`- ${name}`);
  }
  console.error("\nCreate .env.local from .env.example and set the missing values.");
  process.exit(1);
}

console.log("Environment variables are present.");
