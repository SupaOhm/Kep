create table if not exists public.heartbeat (
  id int primary key,
  touched_at timestamptz default now()
);

insert into public.heartbeat (id)
values (1)
on conflict (id) do nothing;

alter table public.heartbeat enable row level security;

drop policy if exists "Allow anon heartbeat read" on public.heartbeat;

create policy "Allow anon heartbeat read"
on public.heartbeat
for select
to anon
using (true);
