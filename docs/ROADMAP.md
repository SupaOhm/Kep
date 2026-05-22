# Roadmap

## Milestone 1: Production-Ready MVP Foundation

- Google auth.
- Supabase schema and RLS.
- Manual expense CRUD.
- Budget CRUD and calculations.
- Category settings with archive behavior.
- Client-side OCR slip upload and confirmation.
- PWA manifest.
- Documentation.

## Milestone 2: Reliability and UX

- Generated Supabase types in CI.
- Toast notifications and richer form error states.
- Optimistic UI where useful.
- CSV export.
- Date/timezone preference.
- Basic recurring expense templates.
- Better Thai slip parser test fixtures.

## Milestone 3: Verification and Automation

- QR payload extraction from Thai slips.
- Slip verification provider adapter.
- Optional private slip storage with Supabase Storage.
- AI-assisted categorization with user confirmation.
- Duplicate slip/reference detection.

## Milestone 4: Money and Reporting

- Manual exchange rates.
- Optional exchange-rate API adapter.
- Category and merchant summaries.
- Budget rollover modes.
- Monthly insights without overbuilding analytics.

## Milestone 5: Native-Ready Scale

- Shared domain package for future native iOS.
- Push notification reminders.
- Passkeys or additional auth options if needed.
- Subscription and paid feature gating.
