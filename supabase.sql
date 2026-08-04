create extension if not exists pgcrypto;

create table if not exists public.writeups (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  platform text default '',
  difficulty text default 'Laboratório',
  summary text not null,
  tools text[] default '{}',
  content text not null,
  published boolean default true,
  author_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.writeups enable row level security;

create policy "Public can read published writeups"
on public.writeups for select
to anon, authenticated
using (published = true or auth.uid() = author_id);

create policy "Authenticated users can insert own writeups"
on public.writeups for insert
to authenticated
with check (auth.uid() = author_id);

create policy "Authors can update own writeups"
on public.writeups for update
to authenticated
using (auth.uid() = author_id)
with check (auth.uid() = author_id);

create policy "Authors can delete own writeups"
on public.writeups for delete
to authenticated
using (auth.uid() = author_id);
