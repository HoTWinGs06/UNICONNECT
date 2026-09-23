-- =============================================
-- 013_security_hardening.sql — Security audit remediation
-- =============================================
-- Fixes applied by this migration:
--   C1  profiles: self-service privilege escalation (role='admin') + email rewrite
--   H1  conversation_members: any user could join any conversation
--   H2  server_members: users could join a server as 'owner'/'admin'
--   M1  posts: any student could forge type='announcement' (insert AND update)
--   M2  mark_conversation_read: SECURITY DEFINER RPC lacked membership check
--   H4  storage: unrestricted upload paths + no extension control on public buckets
-- Idempotent: safe to re-run (drop policy if exists / create or replace).

-- ---------------------------------------------
-- C1a: profiles UPDATE guard.
-- The RLS update policy only checked ownership (auth.uid() = id), so any
-- authenticated client could PATCH its own row with role='admin' — instantly
-- unlocking all-grades access, course management, and private help requests —
-- or rewrite the email column. This trigger locks both down at the DB level:
--   * email is never writable through profiles (it belongs to auth.users)
--   * role may be chosen exactly once, during the first onboarding save
--     (old.onboarded = false), and only as 'student' or 'faculty'
-- ---------------------------------------------
create or replace function public.guard_profile_write()
returns trigger
language plpgsql
as $$
begin
  -- Email is owned by auth.users; silently keep the existing value.
  new.email := old.email;

  if new.role is distinct from old.role then
    if old.onboarded then
      raise exception 'role cannot be changed after onboarding';
    end if;
    if new.role not in ('student', 'faculty') then
      raise exception 'role must be student or faculty';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists on_profile_guard_write on public.profiles;
create trigger on_profile_guard_write
  before update on public.profiles
  for each row execute function public.guard_profile_write();

-- C1b: the manual-insert policy also allowed role='admin' on the inserted row.
drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles
  for insert to authenticated
  with check (auth.uid() = id and role in ('student', 'faculty'));

-- ---------------------------------------------
-- H1: conversation_members INSERT.
-- Was: with check (true) — any user could add themselves to ANY conversation
-- and read every message in it. Legitimate member-adds happen inside the
-- SECURITY DEFINER create_conversation() RPC (bypasses RLS), so restricting
-- direct inserts to "self only" breaks nothing that is supposed to work.
-- ---------------------------------------------
drop policy if exists "Users can add members" on public.conversation_members;
create policy "Users can add only themselves to conversations" on public.conversation_members
  for insert to authenticated
  with check (auth.uid() = user_id);

-- ---------------------------------------------
-- H2: server_members INSERT.
-- Was: with check (auth.uid() = user_id) with no constraint on `role`, so a
-- user could join any server as 'owner'/'admin' and gain channel-management
-- rights. Now: joining is always as 'member'; 'owner' is allowed only for
-- the server's creator (used by the create-server flow).
-- ---------------------------------------------
drop policy if exists "Users can join servers" on public.server_members;
create policy "Users can join servers as members" on public.server_members
  for insert to authenticated
  with check (
    auth.uid() = user_id
    and (
      role = 'member'
      or (
        role = 'owner'
        and exists (
          select 1 from public.servers
          where servers.id = server_members.server_id
            and servers.created_by = auth.uid()
        )
      )
    )
  );

-- ---------------------------------------------
-- M1: posts — 'announcement' type must come from faculty/admin.
-- Applied to BOTH insert and update (an author could previously create a
-- normal post and then edit its type to 'announcement').
-- ---------------------------------------------
drop policy if exists "Authenticated users can create posts" on public.posts;
create policy "Authenticated users can create posts" on public.posts
  for insert to authenticated
  with check (
    auth.uid() = author_id
    and (
      type <> 'announcement'
      or exists (
        select 1 from public.profiles
        where profiles.id = auth.uid()
          and profiles.role in ('faculty', 'admin')
      )
    )
  );

drop policy if exists "Authors can update own posts" on public.posts;
create policy "Authors can update own posts" on public.posts
  for update to authenticated
  using (auth.uid() = author_id)
  with check (
    auth.uid() = author_id
    and (
      type <> 'announcement'
      or exists (
        select 1 from public.profiles
        where profiles.id = auth.uid()
          and profiles.role in ('faculty', 'admin')
      )
    )
  );

-- ---------------------------------------------
-- M2: mark_conversation_read — add membership guard.
-- SECURITY DEFINER bypasses RLS, so without this check any authenticated user
-- could flip unread/is_read state in conversations they do not belong to.
-- Also pins search_path.
-- ---------------------------------------------
create or replace function public.mark_conversation_read(conv_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_conversation_member(conv_id) then
    raise exception 'Not a member of this conversation';
  end if;

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

-- ---------------------------------------------
-- H4: storage — scope uploads to the caller's own folder and restrict
-- extensions. Buckets are public-read, so a hostile .html/.svg upload was a
-- stored-XSS vector, and the old policy let any user write to ANY path
-- (including overwriting other users' avatars via upsert).
-- Path convention used by the app: "<user_id>/<filename>".
-- ---------------------------------------------
drop policy if exists "Authenticated users can upload media" on storage.objects;
create policy "Authenticated users can upload media" on storage.objects
  for insert to authenticated
  with check (
    bucket_id in ('avatars', 'post-media', 'event-covers', 'attachments')
    and (storage.foldername(name))[1] = auth.uid()::text
    and lower(storage.extension(name)) in (
      'png', 'jpg', 'jpeg', 'webp', 'gif',
      'pdf', 'doc', 'docx', 'txt', 'md',
      'py', 'java', 'cpp'
    )
  );

drop policy if exists "Owners can update their media" on storage.objects;
create policy "Owners can update their media" on storage.objects
  for update to authenticated
  using (owner = auth.uid())
  with check (
    owner = auth.uid()
    and (storage.foldername(name))[1] = auth.uid()::text
  );