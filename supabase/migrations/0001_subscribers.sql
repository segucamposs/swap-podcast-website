-- Newsletter subscribers table
-- Run this in the Supabase SQL editor or via the Supabase CLI:
--   supabase db push

create table if not exists subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  created_at timestamptz not null default now()
);

-- Index for fast duplicate-check on email
create unique index if not exists subscribers_email_idx on subscribers (email);

-- RLS: enable row-level security
alter table subscribers enable row level security;

-- Policy: anyone can INSERT (subscribe), but nobody can SELECT/UPDATE/DELETE
-- via the anon key. Only the service role (server admin) can read the list.
create policy "Public can subscribe"
  on subscribers
  for insert
  to anon
  with check (true);
