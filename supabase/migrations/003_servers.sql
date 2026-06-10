-- =============================================
-- 003_servers.sql — Discord-style Servers & Channels
-- =============================================

create table public.servers (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  icon_emoji  text default '🌐',
  type        text not null default 'custom' check (type in ('year', 'faculty', 'club', 'custom')),
  description text default '',
  created_by  uuid not null references public.profiles(id) on delete cascade,
  member_count int default 0,
  created_at  timestamptz default now()
);

create index idx_servers_type on public.servers(type);

create table public.channels (
  id          uuid primary key default gen_random_uuid(),
  server_id   uuid not null references public.servers(id) on delete cascade,
  name        text not null,
  type        text not null default 'text' check (type in ('text', 'voice', 'video', 'announcements')),
  description text default '',
  position    int default 0,
  created_at  timestamptz default now()
);

create index idx_channels_server on public.channels(server_id, position);

create table public.server_members (
  server_id   uuid not null references public.servers(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  role        text not null default 'member' check (role in ('owner', 'admin', 'member')),
  joined_at   timestamptz default now(),
  primary key (server_id, user_id)
);

create index idx_server_members_user on public.server_members(user_id);

create table public.channel_messages (
  id          uuid primary key default gen_random_uuid(),
  channel_id  uuid not null references public.channels(id) on delete cascade,
  author_id   uuid not null references public.profiles(id) on delete cascade,
  content     text not null,
  attachments text[] default '{}',
  reactions   jsonb default '{}',
  edited_at   timestamptz,
  created_at  timestamptz default now()
);

create index idx_channel_msgs_channel on public.channel_messages(channel_id, created_at desc);
create index idx_channel_msgs_author on public.channel_messages(author_id);

-- Trigger: update server member_count
create or replace function public.update_server_member_count()
returns trigger
language plpgsql
security definer
as $$
begin
  if TG_OP = 'INSERT' then
    update public.servers set member_count = member_count + 1 where id = new.server_id;
    return new;
  elsif TG_OP = 'DELETE' then
    update public.servers set member_count = member_count - 1 where id = old.server_id;
    return old;
  end if;
end;
$$;

create trigger on_member_change
  after insert or delete on public.server_members
  for each row execute function public.update_server_member_count();

-- =============================================
-- Row Level Security
-- =============================================
alter table public.servers enable row level security;
alter table public.channels enable row level security;
alter table public.server_members enable row level security;
alter table public.channel_messages enable row level security;

-- Servers: all authenticated can browse
create policy "Servers are viewable" on public.servers
  for select to authenticated using (true);

-- Servers: authenticated users can create
create policy "Users can create servers" on public.servers
  for insert to authenticated with check (auth.uid() = created_by);

-- Servers: only creator can update
create policy "Server owner can update" on public.servers
  for update to authenticated using (auth.uid() = created_by);

-- Channels: viewable by server members
create policy "Channels viewable by server members" on public.channels
  for select to authenticated
  using (
    exists (
      select 1 from public.server_members
      where server_members.server_id = channels.server_id
        and server_members.user_id = auth.uid()
    )
  );

-- Channels: server admins/owners can create
create policy "Admins can create channels" on public.channels
  for insert to authenticated
  with check (
    exists (
      select 1 from public.server_members
      where server_members.server_id = channels.server_id
        and server_members.user_id = auth.uid()
        and server_members.role in ('owner', 'admin')
    )
  );

-- Server members: viewable by other members
create policy "Members viewable by server members" on public.server_members
  for select to authenticated
  using (
    exists (
      select 1 from public.server_members sm
      where sm.server_id = server_members.server_id
        and sm.user_id = auth.uid()
    )
  );

-- Server members: users can join (insert self)
create policy "Users can join servers" on public.server_members
  for insert to authenticated
  with check (auth.uid() = user_id);

-- Server members: users can leave (delete self)
create policy "Users can leave servers" on public.server_members
  for delete to authenticated
  using (auth.uid() = user_id);

-- Channel messages: viewable by server members
create policy "Messages viewable by server members" on public.channel_messages
  for select to authenticated
  using (
    exists (
      select 1 from public.channels c
      join public.server_members sm on sm.server_id = c.server_id
      where c.id = channel_messages.channel_id
        and sm.user_id = auth.uid()
    )
  );

-- Channel messages: server members can post
create policy "Members can post messages" on public.channel_messages
  for insert to authenticated
  with check (
    auth.uid() = author_id
    and exists (
      select 1 from public.channels c
      join public.server_members sm on sm.server_id = c.server_id
      where c.id = channel_messages.channel_id
        and sm.user_id = auth.uid()
    )
  );

-- Channel messages: author can update own
create policy "Authors can edit messages" on public.channel_messages
  for update to authenticated
  using (auth.uid() = author_id);

-- Channel messages: author can delete own
create policy "Authors can delete messages" on public.channel_messages
  for delete to authenticated
  using (auth.uid() = author_id);
