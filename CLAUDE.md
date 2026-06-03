# CLAUDE.md

## Project: Kep

Kep is a personal expense tracking web app focused on fast daily use in Thailand.

The core idea is simple:

- Users can quickly record expenses manually.
- Users can upload Thai bank transfer/payment slips.
- OCR attempts to extract useful information from the slip.
- If OCR is incomplete or wrong, the user can manually fix the fields.
- Expenses are tracked against daily, weekly, and monthly budgets.
- The UI should feel modern, clean, fast, and trustworthy.

Kep is currently a PWA-first project, with a possible iOS app later if the product works well.

The name **Kep** comes from the Thai idea of “เก็บ” — to collect, keep, or save — but written in a short, catchy English-style brand name.

---

## User / Founder Context

The owner of this project is a Computer Engineering student in Thailand, majoring in cybersecurity, currently building this project as a real product and learning full-stack/AI development through it.

Assume the user is technical but still learning professional full-stack development.

When helping:

- Be direct and practical.
- Explain important architecture decisions.
- Avoid overengineering.
- Prefer working MVP improvements over theoretical perfection.
- Keep code readable and maintainable.
- Preserve the current direction unless explicitly asked to redesign.
- Give clear instructions that can be copied into Codex/Claude/terminal.

The user prefers concise but complete answers.

---

## Product Direction

Kep should be:

- Simple enough for daily personal use.
- Fast to open and record expenses.
- Mobile-friendly first.
- Good-looking in both light and dark mode.
- Designed around Thai financial behavior, especially PromptPay/bank slip usage.
- Reliable even when OCR fails.

The upload flow should eventually become the main experience:

1. User uploads a slip.
2. OCR/parser extracts amount, date, bank/reference/receiver if possible.
3. User confirms or edits the result.
4. Expense is saved.
5. Budget/dashboard updates immediately.

Manual entry must remain available as a fallback.

---

## Current Tech Stack

Use the existing stack unless there is a strong reason to change it.

- Framework: Next.js App Router
- Language: TypeScript
- Styling: Tailwind CSS
- Database/Auth: Supabase
- Auth provider: Google OAuth
- Package manager: pnpm
- OCR: tesseract.js / local OCR pipeline
- Validation: Zod
- Deployment target: likely Vercel or similar later

Do not introduce paid APIs unless explicitly approved.

Do not store slip images unless explicitly approved.

---

## Current MVP Status

The project already has:

- Supabase Google authentication
- Protected routes
- Onboarding flow
- Dashboard
- Expense CRUD
- Upload manual fallback save
- `slip_ocr` source tracking
- No slip image storage
- Faster navigation
- Passing:
  - `pnpm lint`
  - `pnpm typecheck`
  - `pnpm build`

The current foundation should be treated as working and should not be casually rewritten.

---

## Important Rules

### Do Not Break Existing MVP Behavior

Before making changes, preserve:

- Google login
- Protected route behavior
- Onboarding behavior
- Dashboard loading
- Expense CRUD
- Manual expense save from upload flow
- Budget initialization
- Category behavior
- Build/lint/typecheck passing

Any change that risks these areas should be small and tested.

---

### No Big Redesign Without Permission

Do not redesign the whole app, database, auth flow, OCR engine, UI system, or folder structure unless explicitly asked.

Prefer incremental improvement.

---

### OCR Rules

The OCR/parser is under development.

Current goal:

- Harden the parser using anonymized OCR text fixtures.
- Do not change OCR engine behavior unless asked.
- Do not add paid OCR APIs unless asked.
- Do not store slip images.
- Use sanitized fixture text only.
- Focus on extracting:
  - amount
  - date/time
  - bank
  - reference number
  - receiver/payee
  - sender if available

OCR may fail. The product must handle failure gracefully.

Manual correction is not a temporary hack; it is part of the UX.

---

### Privacy Rules

This app handles financial data.

Be conservative:

- Do not store original slip images by default.
- Do not log sensitive slip contents unnecessarily.
- Do not expose user IDs, auth tokens, or raw Supabase errors to the client.
- Sanitize test fixtures.
- Avoid committing real personal slip data.
- Avoid committing `.env` files.
- Keep RLS policies intact.

---

### Database Rules

Use Supabase carefully.

Always consider:

- Row Level Security
- User ownership
- Duplicate prevention
- Safe inserts
- Idempotent onboarding
- Graceful handling of existing default records

Known behavior:

- Default categories should only be created if missing.
- Budgets should be created if missing.
- Budget uniqueness is based on `user_id + period`.
- Duplicate budget creation may hit `23505`; handle safely where appropriate.
- Category duplicate names should be checked.

---

## Design Direction

Brand direction:

- Name: Kep
- Accent: Emerald
- Dark mode: Midnight black, not pure `#000000`
- Light mode: Clean and soft, not pure harsh white everywhere
- UI should look polished on both light and dark themes
- Upload button should always be easy to access
- The app should feel calm, financial, and modern

Avoid:

- Generic SaaS-looking clutter
- Overly playful UI
- Too many colors
- Low-contrast text
- Desktop-only layouts
- Hiding the upload action too deeply

---

## Expected Project Structure

The project may evolve, but keep roughly this mental model:

```txt
src/
  app/
    (auth)/
    (protected)/
      dashboard/
      expenses/
      upload/
      budgets/
      settings/
    auth/
      callback/
  features/
    expenses/
    slips/
    budgets/
    categories/
    dashboard/
  lib/
    supabase/
    validation/
    ocr/
    utils/
  components/
    ui/
    layout/
  styles/