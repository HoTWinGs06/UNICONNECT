-- =============================================
-- 007_groups.sql — Study Groups & Membership
-- =============================================

create table public.study_groups (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  description  text default '',
  icon_emoji   text default '📚',
  course_id    uuid references public.courses(id) on delete set null,
  schedule     text,                -- e.g., "Wed & Fri, 3–5 PM"
  max_members  int default 10,
  member_count int default 0,
  is_active    boolean default true,
  created_by   uuid not null references public.profiles(id) on delete cascade,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create index idx_groups_course on public.study_groups(course_id);
create index idx_groups_active on public.study_groups(is_active);

create table public.group_members (
  group_id    uuid not null references public.study_groups(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  role        text not null default 'member' check (role in ('owner', 'member')),
  status      text not null default 'pending' check (status in ('approved', 'pending', 'rejected')),
  joined_at   timestamptz default now(),
  primary key (group_id, user_id)
);

create index idx_group_members_user on public.group_members(user_id);

-- Trigger: update member_count (only approved members)
create or replace function public.update_group_member_count()
returns trigger
language plpgsql
security definer
as $$
begin
  if TG_OP = 'INSERT' and new.status = 'approved' then
    update public.study_groups set member_count = member_count + 1 where id = new.group_id;
  elsif TG_OP = 'DELETE' and old.status = 'approved' then
    update public.study_groups set member_count = member_count - 1 where id = old.group_id;
  elsif TG_OP = 'UPDATE' then
    if old.status != 'approved' and new.status = 'approved' then
      update public.study_groups set member_count = member_count + 1 where id = new.group_id;
    elsif old.status = 'approved' and new.status != 'approved' then
      update public.study_groups set member_count = member_count - 1 where id = new.group_id;
    end if;
  end if;
  return coalesce(new, old);
end;
$$;

create trigger on_group_member_change
  after insert or update or delete on public.group_members
  for each row execute function public.update_group_member_count();

-- Trigger: updated_at
create trigger groups_updated_at
  before update on public.study_groups
  for each row execute function public.update_updated_at();

-- =============================================
-- Row Level Security
-- =============================================
alter table public.study_groups enable row level security;
alter table public.group_members enable row level security;

-- Groups: all authenticated can browse
create policy "Groups are viewable" on public.study_groups
  for select to authenticated using (true);

-- Groups: authenticated can create
create policy "Users can create groups" on public.study_groups
  for insert to authenticated
  with check (auth.uid() = created_by);

-- Groups: owner can update
create policy "Owner can update group" on public.study_groups
  for update to authenticated
  using (auth.uid() = created_by);

-- Groups: owner can delete
create policy "Owner can delete group" on public.study_groups
  for delete to authenticated
  using (auth.uid() = created_by);

-- Group members: approved members visible to other members; pending visible to owner
create policy "Members are viewable" on public.group_members
  for select to authenticated
  using (
    status = 'approved'
    or auth.uid() = user_id
    or exists (
      select 1 from public.study_groups g
      where g.id = group_members.group_id
        and g.created_by = auth.uid()
    )
  );

-- Group members: users can request to join
create policy "Users can request join" on public.group_members
  for insert to authenticated
  with check (auth.uid() = user_id);

-- Group members: owner can approve/reject; user can leave
create policy "Owner can manage or user can leave" on public.group_members
  for update to authenticated
  using (
    auth.uid() = user_id
    or exists (
      select 1 from public.study_groups g
      where g.id = group_members.group_id
        and g.created_by = auth.uid()
    )
  );

-- Group members: user can leave; owner can remove
create policy "Users can leave or owner can remove" on public.group_members
  for delete to authenticated
  using (
    auth.uid() = user_id
    or exists (
      select 1 from public.study_groups g
      where g.id = group_members.group_id
        and g.created_by = auth.uid()
    )
  );
