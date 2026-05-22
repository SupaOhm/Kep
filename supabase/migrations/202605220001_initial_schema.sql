create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  base_currency_code text not null default 'THB',
  theme_preference text not null default 'system' check (theme_preference in ('system', 'light', 'dark')),
  slip_storage_preference text not null default 'delete_after_confirm'
    check (slip_storage_preference in ('delete_after_confirm', 'store_private')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text,
  icon text,
  is_default boolean not null default false,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  amount_minor bigint not null check (amount_minor >= 0),
  currency_code text not null default 'THB',
  base_amount_minor bigint not null check (base_amount_minor >= 0),
  base_currency_code text not null default 'THB',
  exchange_rate_to_base numeric,
  occurred_at timestamptz not null,
  merchant_name text,
  receiver_name text,
  bank_name text,
  reference_id text,
  note text,
  payment_method text,
  source text not null default 'manual' check (source in ('manual', 'slip_ocr', 'future_api')),
  raw_ocr_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  period text not null check (period in ('daily', 'weekly', 'monthly')),
  is_enabled boolean not null default true,
  limit_minor bigint not null check (limit_minor >= 0),
  currency_code text not null default 'THB',
  rollover_mode text not null default 'none' check (rollover_mode in ('none')),
  warning_threshold numeric not null default 0.8 check (warning_threshold > 0 and warning_threshold <= 1),
  week_starts_on text not null default 'monday' check (week_starts_on in ('monday', 'sunday')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, period)
);

create index if not exists categories_user_id_idx on public.categories(user_id);
create index if not exists categories_user_archived_idx on public.categories(user_id, is_archived);
create index if not exists expenses_user_occurred_at_idx on public.expenses(user_id, occurred_at desc);
create index if not exists expenses_user_category_idx on public.expenses(user_id, category_id);
create index if not exists budgets_user_id_idx on public.budgets(user_id);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists expenses_set_updated_at on public.expenses;
create trigger expenses_set_updated_at
before update on public.expenses
for each row execute function public.set_updated_at();

drop trigger if exists budgets_set_updated_at on public.budgets;
create trigger budgets_set_updated_at
before update on public.budgets
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.expenses enable row level security;
alter table public.budgets enable row level security;

drop policy if exists "profiles select own" on public.profiles;
create policy "profiles select own"
on public.profiles for select
using (id = auth.uid());

drop policy if exists "profiles insert own" on public.profiles;
create policy "profiles insert own"
on public.profiles for insert
with check (id = auth.uid());

drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "profiles delete own" on public.profiles;
create policy "profiles delete own"
on public.profiles for delete
using (id = auth.uid());

drop policy if exists "categories select own" on public.categories;
create policy "categories select own"
on public.categories for select
using (user_id = auth.uid());

drop policy if exists "categories insert own" on public.categories;
create policy "categories insert own"
on public.categories for insert
with check (user_id = auth.uid());

drop policy if exists "categories update own" on public.categories;
create policy "categories update own"
on public.categories for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "categories delete own" on public.categories;
create policy "categories delete own"
on public.categories for delete
using (user_id = auth.uid());

drop policy if exists "expenses select own" on public.expenses;
create policy "expenses select own"
on public.expenses for select
using (user_id = auth.uid());

drop policy if exists "expenses insert own" on public.expenses;
create policy "expenses insert own"
on public.expenses for insert
with check (
  user_id = auth.uid()
  and (
    category_id is null
    or exists (
      select 1 from public.categories
      where categories.id = expenses.category_id
      and categories.user_id = auth.uid()
    )
  )
);

drop policy if exists "expenses update own" on public.expenses;
create policy "expenses update own"
on public.expenses for update
using (user_id = auth.uid())
with check (
  user_id = auth.uid()
  and (
    category_id is null
    or exists (
      select 1 from public.categories
      where categories.id = expenses.category_id
      and categories.user_id = auth.uid()
    )
  )
);

drop policy if exists "expenses delete own" on public.expenses;
create policy "expenses delete own"
on public.expenses for delete
using (user_id = auth.uid());

drop policy if exists "budgets select own" on public.budgets;
create policy "budgets select own"
on public.budgets for select
using (user_id = auth.uid());

drop policy if exists "budgets insert own" on public.budgets;
create policy "budgets insert own"
on public.budgets for insert
with check (user_id = auth.uid());

drop policy if exists "budgets update own" on public.budgets;
create policy "budgets update own"
on public.budgets for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "budgets delete own" on public.budgets;
create policy "budgets delete own"
on public.budgets for delete
using (user_id = auth.uid());
