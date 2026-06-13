-- Remove duplicate categories and enforce per-user uniqueness.
--
-- Root cause: ensureUserWorkspace used a check-then-insert pattern (read existing
-- category names, insert the missing ones) with no DB-level uniqueness. On first
-- login the browser fires several concurrent requests, so two of them could each
-- read zero categories and insert the full default set, producing two copies of
-- every category. The isDuplicateKeyError guard in onboarding assumed a unique
-- constraint existed to absorb the race; this migration adds that constraint.

-- 1. Re-point expenses from duplicate categories to the surviving (oldest) row,
--    so historical expenses keep their category instead of being orphaned.
with ranked as (
  select
    id,
    first_value(id) over (
      partition by user_id, name
      order by created_at, id
    ) as keep_id
  from public.categories
)
update public.expenses e
set category_id = r.keep_id
from ranked r
where e.category_id = r.id
  and r.id <> r.keep_id;

-- 2. Delete the duplicate rows, keeping the oldest per (user_id, name).
with ranked as (
  select
    id,
    row_number() over (
      partition by user_id, name
      order by created_at, id
    ) as rn
  from public.categories
)
delete from public.categories
where id in (select id from ranked where rn > 1);

-- 3. Enforce uniqueness so the race can never reintroduce duplicates, and so
--    user-created categories with a duplicate name are rejected at the DB level.
alter table public.categories
  add constraint categories_user_id_name_key unique (user_id, name);
