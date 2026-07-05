-- Run this in the Supabase SQL Editor
-- This creates the tables expected by CampusConnect.

create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text not null unique,
  password_hash text not null,
  role text not null check (role in ('student', 'faculty', 'admin')),
  department text,
  year text,
  created_at timestamptz not null default now()
);

create table if not exists public.clubs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.user_clubs (
  user_id uuid not null references public.users(id) on delete cascade,
  club_id uuid not null references public.clubs(id) on delete cascade,
  role text not null default 'member',
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  primary key (user_id, club_id)
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  type text not null,
  department text,
  club_id uuid references public.clubs(id) on delete set null,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text,
  department text,
  event_date timestamptz,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.saved_announcements (
  user_id uuid not null references public.users(id) on delete cascade,
  item_id uuid not null,
  saved_at timestamptz not null default now(),
  primary key (user_id, item_id)
);

create table if not exists public.saved_events (
  user_id uuid not null references public.users(id) on delete cascade,
  item_id uuid not null,
  saved_at timestamptz not null default now(),
  primary key (user_id, item_id)
);

create index if not exists idx_announcements_created_at on public.announcements (created_at desc);
create index if not exists idx_events_created_at on public.events (created_at desc);
create index if not exists idx_user_clubs_status on public.user_clubs (status);
create index if not exists idx_saved_announcements_user on public.saved_announcements (user_id);
create index if not exists idx_saved_events_user on public.saved_events (user_id);
