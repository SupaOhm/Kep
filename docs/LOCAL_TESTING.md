# Local Runtime Testing

Use this checklist after creating a real Supabase project.

## A. Supabase Setup

- Create a Supabase project.
  - Expected: project URL and anon key are available in Project Settings > API.
- Apply `supabase/migrations/202605220001_initial_schema.sql`.
  - Expected: `profiles`, `categories`, `expenses`, and `budgets` exist.
  - Expected: RLS is enabled on all four tables.
- Enable the Google auth provider in Supabase.
  - Expected: Google provider is marked enabled.
- Configure Google OAuth redirect URLs.
  - Local callback: `http://localhost:3000/auth/callback`
  - Production callback: `https://YOUR_DOMAIN/auth/callback`
  - Expected: Supabase and Google Cloud Console both allow the callback URL you are testing.
- Fill `.env.local`.
  - Expected: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set.
  - Optional: `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.
- Run `pnpm check:env`.
  - Expected: prints `Environment variables are present.`

## B. Auth Test

- Run `pnpm dev` and open `http://localhost:3000`.
  - Expected: landing page loads with Kep and Google sign-in.
- Click Google sign-in.
  - Expected: browser leaves the app for Google/Supabase auth.
- Complete Google login.
  - Expected: `/auth/callback` completes and redirects to `/dashboard`.
- Open a protected URL while signed out, such as `/expenses`.
  - Expected: redirects to `/` with a `next` query.
- Sign in from that redirected page.
  - Expected: callback returns to the originally requested protected page.
- Click sign out.
  - Expected: returns to the landing/login page.

## C. Onboarding Test

- After first login, inspect Supabase table rows for the user.
  - Expected: one `profiles` row exists for `auth.users.id`.
  - Expected: default categories exist.
  - Expected: daily, weekly, and monthly budget rows exist.
- Refresh and sign out/sign in again.
  - Expected: default categories are not duplicated.
  - Expected: customized budget rows are not reset.
- Delete one default budget row manually in Supabase, then reload `/dashboard`.
  - Expected: the missing budget row is recreated.

## D. Expense CRUD Test

- Open `/expenses/new`.
  - Expected: manual expense form loads with THB and current date/time.
- Add a manual expense.
  - Expected: redirects to `/expenses` and the expense appears in the list.
- Open `/dashboard`.
  - Expected: recent expenses includes the expense and budget totals update.
- Edit the expense.
  - Expected: updated values are saved and shown in the list.
- Delete the expense.
  - Expected: it disappears from `/expenses` and dashboard totals update.

## E. Budget Test

- Open `/budgets` and enable the daily budget.
  - Expected: daily budget card shows the configured limit.
- Set a daily limit above your next test expense.
  - Expected: dashboard shows leftover amount after saving the expense.
- Add another expense that pushes spending above the daily limit.
  - Expected: dashboard and budget page show exceeded status.

## F. Category Test

- Open `/settings/categories`.
  - Expected: default categories are listed.
- Add a custom category.
  - Expected: category appears in the list.
- Create an expense using the custom category.
  - Expected: expense list shows the category.
- Archive the custom category.
  - Expected: existing expense still renders and does not break.
  - Expected: archived category is not shown in new expense category choices.

## G. Upload/OCR Smoke Test

- Open `/upload`.
  - Expected: upload CTA is visible and easy to access.
- Upload a PNG/JPG/WebP image.
  - Expected: OCR progress starts.
- Use a poor image or cancel/ignore OCR output.
  - Expected: manual fields remain editable.
- Confirm and save a draft.
  - Expected: expense is created with source `slip_ocr`.
- Inspect Supabase Storage.
  - Expected: no slip image is uploaded or stored by default.

## H. Light/Dark Visual Test

- Open `/settings` and switch theme to light.
  - Expected: dashboard, forms, cards, nav, and upload flow are readable.
- Switch theme to dark.
  - Expected: the same screens remain readable with no pure black/white glare.
