-- =============================================
-- 004_messages.sql — Direct Messages (1:1 and Group)
-- =============================================

create table public.conversations (
  id          uuid primary key default gen_random_uuid(),
  is_group    boolean default false,
  name        text,  -- nullable, used for group chats
  created_at  timestamptz default now()
);

create table public.conversation_members (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id         uuid not null references public.profiles(id) on delete cascade,
  unread_count    int default 0,
  last_read_at    timestamptz default now(),
  joined_at       timestamptz default now(),
  primary key (conversation_id, user_id)
);

create index idx_conv_members_user on public.conversation_members(user_id);

create table public.direct_messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id       uuid not null references public.profiles(id) on delete cascade,
  content         text not null,
  attachments     text[] default '{}',
  is_read         boolean default false,
  created_at      timestamptz default now()
);

create index idx_dm_conversation on public.direct_messages(conversation_id, created_at desc);
create index idx_dm_sender on public.direct_messages(sender_id);

-- Trigger: increment unread_count for all members except sender
create or replace function public.increment_unread_count()
returns trigger
language plpgsql
security definer
as $$
begin
  update public.conversation_members
  set unread_count = unread_count + 1
  where conversation_id = new.conversation_id
    and user_id != new.sender_id;
  return new;
end;
$$;

create trigger on_new_dm
  after insert on public.direct_messages
  for each row execute function public.increment_unread_count();

-- Function: mark conversation as read
create or replace function public.mark_conversation_read(conv_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update public.conversation_members
  set unread_count = 0, last_read_at = now()
  where conversation_id = conv_id
    and user_id = auth.uid();

  update public.direct_messages
  set is_read = true
  where conversation_id = conv_id
    and sender_id != auth.uid()
    and is_read = false;
end;
$$;

-- =============================================
-- Row Level Security
-- =============================================
alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.direct_messages enable row level security;

-- Conversations: only members can view
create policy "Members can view conversations" on public.conversations
  for select to authenticated
  using (
    exists (
      select 1 from public.conversation_members
      where conversation_members.conversation_id = conversations.id
        and conversation_members.user_id = auth.uid()
    )
  );

-- Conversations: authenticated users can create
create policy "Users can create conversations" on public.conversations
  for insert to authenticated with check (true);

-- Conversation members: only members can view other members
create policy "Members can view membership" on public.conversation_members
  for select to authenticated
  using (
    exists (
      select 1 from public.conversation_members cm
      where cm.conversation_id = conversation_members.conversation_id
        and cm.user_id = auth.uid()
    )
  );

-- Conversation members: users can add members (for creating new convos)
create policy "Users can add members" on public.conversation_members
  for insert to authenticated with check (true);

-- Conversation members: users can update own membership (read status)
create policy "Users can update own membership" on public.conversation_members
  for update to authenticated
  using (auth.uid() = user_id);

-- Direct messages: only conversation members can read
create policy "Members can read messages" on public.direct_messages
  for select to authenticated
  using (
    exists (
      select 1 from public.conversation_members
      where conversation_members.conversation_id = direct_messages.conversation_id
        and conversation_members.user_id = auth.uid()
    )
  );

-- Direct messages: members can send messages
create policy "Members can send messages" on public.direct_messages
  for insert to authenticated
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.conversation_members
      where conversation_members.conversation_id = direct_messages.conversation_id
        and conversation_members.user_id = auth.uid()
    )
  );

-- Direct messages: sender can update own (for edit)
create policy "Sender can update own messages" on public.direct_messages
  for update to authenticated
  using (auth.uid() = sender_id);
