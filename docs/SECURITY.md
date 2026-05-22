# Security

## Authentication

Kep uses Supabase Auth with Google OAuth. The browser only receives the Supabase anon key. All user data access is constrained by Row Level Security.

## Row Level Security

RLS is enabled on:

- `profiles`
- `categories`
- `expenses`
- `budgets`

Users can only select, insert, update, or delete their own rows. Profiles use `id = auth.uid()`. Other tables use `user_id = auth.uid()`.

Expenses also check that `category_id`, when present, belongs to the same user.

## Slip Images

Slip image handling is privacy-first:

- Images are processed in the browser.
- Images are not uploaded by default.
- The app stores raw OCR text only when the user confirms and saves the expense.
- The storage preference exists for future behavior but private storage is not implemented in the MVP.

## OCR and Verification

OCR output is untrusted. The app never auto-saves an OCR result. Users must confirm and edit the draft before saving. OCR is not the same as bank slip verification.

## Operational Notes

- Keep Supabase service-role keys out of the frontend and Vercel public environment.
- Add production callback URLs in both Supabase and Google Cloud Console.
- Use generated Supabase types in a later milestone to keep schema and TypeScript synchronized.
- Consider rate limits and abuse controls before adding public paid providers.
