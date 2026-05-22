# Kep

Kep is a Thai-first personal expense tracker. It helps users manually add expenses, upload Thai bank e-slip images, run client-side OCR to draft expense data, confirm the draft, and track daily, weekly, and monthly budget limits.

Tagline: **Know where your money went.**

## Features

- Google sign-in with Supabase Auth.
- Protected dashboard with daily, weekly, and monthly budget cards.
- Manual expense CRUD with Zod and React Hook Form validation.
- Client-side Thai + English OCR with Tesseract.js for e-slip draft extraction.
- Best-effort slip parsing for amount, date/time, receiver, bank, and reference ID.
- Expense list with search, date range, and category filters.
- Budget settings with enable/disable, limits, warning threshold, and Monday-start weeks.
- Category settings with default categories plus custom archive/restore behavior.
- General settings for base currency, theme preference, and slip storage preference placeholder.
- PWA manifest and mobile-first layout with bottom navigation.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth, Postgres, SSR helpers
- Tesseract.js
- React Hook Form
- Zod
- lucide-react icons
- ESLint and Prettier
- pnpm

## Local Setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open `http://localhost:3000`.

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Supabase Setup

1. Create a Supabase project.
2. Copy the project URL and anon key into `.env.local`.
3. Apply the migration in `supabase/migrations/202605220001_initial_schema.sql`.
4. Confirm RLS is enabled for `profiles`, `categories`, `expenses`, and `budgets`.
5. In Auth settings, add the local callback URL:

```text
http://localhost:3000/auth/callback
```

For production, also add:

```text
https://your-domain.com/auth/callback
```

## Google OAuth Setup

1. In Google Cloud Console, create or choose a project.
2. Configure the OAuth consent screen.
3. Create an OAuth client ID for a web application.
4. Add Supabase's Google callback URL from Supabase Auth provider settings to Google authorized redirect URIs.
5. Paste the Google client ID and secret into Supabase Auth > Providers > Google.
6. Add your app callback URLs in Supabase Auth URL configuration.

## Migrations

Apply SQL through the Supabase dashboard SQL editor, Supabase CLI, or your migration pipeline.

```bash
supabase db push
```

The app creates profile, default categories, and disabled default budgets idempotently after login.

## Development Commands

```bash
pnpm dev
pnpm lint
pnpm typecheck
pnpm build
pnpm format
pnpm format:check
```

## Deploying to Vercel

1. Import the repository in Vercel.
2. Set the same environment variables.
3. Set `NEXT_PUBLIC_SITE_URL` to the production origin.
4. Add the production auth callback URL in Supabase and Google OAuth.
5. Deploy with the default Next.js build command:

```bash
pnpm build
```

## OCR Notes

OCR is best-effort. Kep never auto-saves OCR results. The user must review and confirm the draft. Slip images are processed in the browser and are not uploaded or permanently stored by default.

## Current Limitations

- No live exchange rates.
- No paid OCR, QR parsing, bank API, or slip verification API.
- No slip image storage by default.
- Budget periods use practical local date calculations and no rollover.
- Analytics are intentionally minimal for the MVP.
