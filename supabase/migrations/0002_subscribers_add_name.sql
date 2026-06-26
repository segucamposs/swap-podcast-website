-- Add name fields to subscribers table
alter table subscribers
  add column if not exists first_name text,
  add column if not exists last_name  text;
