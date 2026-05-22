# Architecture

Kep uses Next.js App Router with Supabase as the backend. The app avoids a separate API server for the MVP: authenticated server components read from Supabase, and server actions perform mutations.

## Structure

- `src/app`: routes, protected pages, callback route, global layout.
- `src/components`: reusable app shell and UI primitives.
- `src/features/expenses`: expense forms, list, and actions.
- `src/features/budgets`: budget forms, progress UI, and actions.
- `src/features/slips`: upload/OCR confirmation flow.
- `src/features/categories`: category manager and archive actions.
- `src/features/settings`: profile settings and theme controls.
- `src/lib/supabase`: browser, server, middleware, and onboarding helpers.
- `src/lib/currency`: integer minor-unit money parsing and formatting.
- `src/lib/date`: period/date helpers.
- `src/lib/budget`: budget calculations.
- `src/lib/ocr`: slip processor abstraction, local Tesseract processor, parser.
- `supabase/migrations`: SQL schema, constraints, indexes, triggers, and RLS.

## Auth

Supabase Auth handles Google login. Middleware refreshes sessions and protects app routes. The app runs idempotent onboarding after login to upsert a profile, create default categories, and create disabled default budget rows.

## Data Model

Money is stored as integer minor units:

- `amount_minor`: original transaction amount.
- `base_amount_minor`: amount in the user's base currency.
- `exchange_rate_to_base`: reserved for future manual or API exchange rates.

For the MVP, base amount equals original amount.

## OCR Adapter Boundary

`SlipProcessor` is the interface for slip ingestion. The current implementation is `localTesseractSlipProcessor`, which runs OCR in the browser and passes text to a regex parser.

Future adapters can fit this boundary:

- QR payload parser.
- SlipOK, EasySlip, or bank verification providers.
- Paid OCR provider.
- AI categorization and parsing.

## Security Model

RLS is enabled on all app tables. Policies restrict records to `auth.uid()`. Expense insert/update policies also ensure referenced categories belong to the same user. Slip images are not uploaded by default.

## PWA

The app includes a web manifest and mobile-safe UI. A service worker is intentionally not added yet to avoid stale-auth and stale-data complexity before offline behavior is designed.
