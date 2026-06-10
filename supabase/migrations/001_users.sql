-- =============================================
-- 001_users.sql — User Profiles
-- Extends Supabase Auth with app-specific fields
-- =============================================

-- Profiles table (linked to auth.users)
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text unique not null,
  display_name text not null default '',
  avatar_url  text,
  role        text not null default 'student' check (role in ('student', 'faculty', 'admin')),
  branch      text,
  year        int check (year between 1 and 6),
  bio         text default '',
  is_online   boolean default false,
  last_seen   timestamptz default now(),
  onboarded   boolean default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Index for searching users
create index idx_profiles_role on public.profiles(role);
create index idx_profiles_branch on public.profiles(branch);
create index idx_profiles_display_name on public.profiles using gin (to_tsvector('english', display_name));

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-update updated_at timestamp
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at();

-- =============================================
-- Row Level Security
-- =============================================
alter table public.profiles enable row level security;

-- Anyone authenticated can view profiles
create policy "Profiles are viewable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

-- Users can update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Users can insert their own profile (for edge cases)
create policy "Users can insert own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);
