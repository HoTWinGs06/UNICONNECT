-- =============================================
-- 008_help.sql — Help Requests
-- =============================================

create table public.help_requests (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text not null,
  category     text not null check (category in (
    'tutoring', 'study_partner', 'assignment', 'lab_project',
    'technical', 'career', 'other'
  )),
  course_id    uuid references public.courses(id) on delete set null,
  urgency      text not null default 'medium' check (urgency in ('low', 'medium', 'high')),
  visibility   text not null default 'public' check (visibility in ('public', 'private')),
  author_id    uuid not null references public.profiles(id) on delete cascade,
  attachments  text[] default '{}',
  status       text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed')),
  resolved_by  uuid references public.profiles(id) on delete set null,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create index idx_help_author on public.help_requests(author_id);
create index idx_help_status on public.help_requests(status);
create index idx_help_category on public.help_requests(category);
create index idx_help_urgency on public.help_requests(urgency);
create index idx_help_created on public.help_requests(created_at desc);

-- Trigger: updated_at
create trigger help_updated_at
  before update on public.help_requests
  for each row execute function public.update_updated_at();

-- =============================================
-- Row Level Security
-- =============================================
alter table public.help_requests enable row level security;

-- Public help requests: viewable by all authenticated
-- Private help requests: viewable by author + faculty/admin
create policy "Help requests viewable" on public.help_requests
  for select to authenticated
  using (
    visibility = 'public'
    or auth.uid() = author_id
    or exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role in ('faculty', 'admin')
    )
  );

-- Users can create help requests
create policy "Users can create help requests" on public.help_requests
  for insert to authenticated
  with check (auth.uid() = author_id);

-- Author can update own request
create policy "Author can update request" on public.help_requests
  for update to authenticated
  using (
    auth.uid() = author_id
    or exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role in ('faculty', 'admin')
    )
  );

-- Author can delete own request
create policy "Author can delete request" on public.help_requests
  for delete to authenticated
  using (auth.uid() = author_id);
