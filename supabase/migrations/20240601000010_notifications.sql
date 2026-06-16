-- =============================================
-- 010_notifications.sql — Activity Notifications
-- =============================================

create table public.notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade, -- recipient
  actor_id    uuid references public.profiles(id) on delete set null,         -- who triggered it
  type        text not null check (type in (
    'comment', 'like', 'dm', 'group_join_request', 'group_join_approved', 'help_status'
  )),
  entity_type text,                       -- 'post' | 'conversation' | 'study_group' | 'help_request'
  entity_id   uuid,
  title       text not null,
  body        text default '',
  link        text,                       -- in-app route to open
  is_read     boolean default false,
  created_at  timestamptz default now()
);

create index idx_notifications_user on public.notifications(user_id, created_at desc);
create index idx_notifications_unread on public.notifications(user_id) where is_read = false;

-- =============================================
-- Row Level Security
-- Notifications are written exclusively by SECURITY DEFINER triggers,
-- so there is no INSERT policy — clients cannot forge notifications.
-- =============================================
alter table public.notifications enable row level security;

create policy "Users can view own notifications" on public.notifications
  for select to authenticated
  using (auth.uid() = user_id);

create policy "Users can update own notifications" on public.notifications
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own notifications" on public.notifications
  for delete to authenticated
  using (auth.uid() = user_id);

-- =============================================
-- Trigger functions
-- =============================================

-- New comment on a post -> notify the post author
create or replace function public.notify_on_comment()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  post_author uuid;
  actor_name  text;
begin
  select author_id into post_author from public.posts where id = new.post_id;
  if post_author is null or post_author = new.author_id then
    return new;
  end if;
  select display_name into actor_name from public.profiles where id = new.author_id;
  insert into public.notifications (user_id, actor_id, type, entity_type, entity_id, title, body, link)
  values (post_author, new.author_id, 'comment', 'post', new.post_id,
          'New comment',
          coalesce(actor_name, 'Someone') || ' commented on your post', '/feed');
  return new;
end;
$$;

create trigger on_comment_notify
  after insert on public.post_comments
  for each row execute function public.notify_on_comment();

-- New like on a post -> notify the post author
create or replace function public.notify_on_like()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  post_author uuid;
  actor_name  text;
begin
  select author_id into post_author from public.posts where id = new.post_id;
  if post_author is null or post_author = new.user_id then
    return new;
  end if;
  select display_name into actor_name from public.profiles where id = new.user_id;
  insert into public.notifications (user_id, actor_id, type, entity_type, entity_id, title, body, link)
  values (post_author, new.user_id, 'like', 'post', new.post_id,
          'New like',
          coalesce(actor_name, 'Someone') || ' liked your post', '/feed');
  return new;
end;
$$;

create trigger on_like_notify
  after insert on public.post_likes
  for each row execute function public.notify_on_like();

-- New direct message -> notify every other conversation member
create or replace function public.notify_on_dm()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  actor_name text;
begin
  select display_name into actor_name from public.profiles where id = new.sender_id;
  insert into public.notifications (user_id, actor_id, type, entity_type, entity_id, title, body, link)
  select cm.user_id, new.sender_id, 'dm', 'conversation', new.conversation_id,
         'New message',
         coalesce(actor_name, 'Someone') || ' sent you a message', '/messages'
  from public.conversation_members cm
  where cm.conversation_id = new.conversation_id
    and cm.user_id <> new.sender_id;
  return new;
end;
$$;

create trigger on_dm_notify
  after insert on public.direct_messages
  for each row execute function public.notify_on_dm();

-- Study group join request -> notify the group owner
create or replace function public.notify_on_group_join()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  owner_id   uuid;
  group_name text;
  actor_name text;
begin
  if new.status <> 'pending' then
    return new;
  end if;
  select created_by, name into owner_id, group_name from public.study_groups where id = new.group_id;
  if owner_id is null or owner_id = new.user_id then
    return new;
  end if;
  select display_name into actor_name from public.profiles where id = new.user_id;
  insert into public.notifications (user_id, actor_id, type, entity_type, entity_id, title, body, link)
  values (owner_id, new.user_id, 'group_join_request', 'study_group', new.group_id,
          'New join request',
          coalesce(actor_name, 'Someone') || ' asked to join ' || coalesce(group_name, 'your group'), '/groups');
  return new;
end;
$$;

create trigger on_group_join_notify
  after insert on public.group_members
  for each row execute function public.notify_on_group_join();

-- Study group request approved -> notify the requesting member
create or replace function public.notify_on_group_approved()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  group_name text;
begin
  if old.status = 'approved' or new.status <> 'approved' then
    return new;
  end if;
  select name into group_name from public.study_groups where id = new.group_id;
  insert into public.notifications (user_id, actor_id, type, entity_type, entity_id, title, body, link)
  values (new.user_id, null, 'group_join_approved', 'study_group', new.group_id,
          'Request approved',
          'Your request to join ' || coalesce(group_name, 'the group') || ' was approved', '/groups');
  return new;
end;
$$;

create trigger on_group_approved_notify
  after update on public.group_members
  for each row execute function public.notify_on_group_approved();

-- Help request status changed -> notify the author (unless they changed it themselves)
create or replace function public.notify_on_help_status()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if old.status = new.status or new.author_id = auth.uid() then
    return new;
  end if;
  insert into public.notifications (user_id, actor_id, type, entity_type, entity_id, title, body, link)
  values (new.author_id, auth.uid(), 'help_status', 'help_request', new.id,
          'Help request updated',
          'Your request "' || new.title || '" is now ' || new.status, '/help');
  return new;
end;
$$;

create trigger on_help_status_notify
  after update on public.help_requests
  for each row execute function public.notify_on_help_status();

-- Enable realtime so the client receives new notifications live
alter publication supabase_realtime add table public.notifications;
alter table public.notifications replica identity full;
