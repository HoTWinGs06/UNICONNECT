-- =============================================
-- 012_messaging_rls_fix.sql — Fix conversation RLS recursion + atomic creation
-- =============================================
-- Two bugs this migration repairs:
--   1. The conversation_members SELECT policy in 0004 queried conversation_members
--      from inside its own USING clause -> Postgres raises 42P17
--      "infinite recursion detected in policy". This broke EVERY read that embeds
--      conversation_members (the whole messages list, group creation, DM open).
--   2. Creating a conversation client-side via insert().select() returned no row,
--      because the conversations SELECT policy requires a membership row that does
--      not exist yet at insert time. Result: orphaned conversations, chats never open.
-- The fix routes membership checks through a SECURITY DEFINER helper (which bypasses
-- RLS internally, breaking the cycle) and makes creation atomic via an RPC.

-- ---------------------------------------------
-- Helper: is the current user a member of a conversation?
-- SECURITY DEFINER so the inner read does NOT re-trigger conversation_members RLS.
-- ---------------------------------------------
create or replace function public.is_conversation_member(conv uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.conversation_members
    where conversation_id = conv
      and user_id = auth.uid()
  );
$$;

grant execute on function public.is_conversation_member(uuid) to authenticated;

-- ---------------------------------------------
-- Rewrite the recursive / membership-dependent SELECT policies to use the helper.
-- ---------------------------------------------
drop policy if exists "Members can view membership" on public.conversation_members;
create policy "Members can view membership" on public.conversation_members
  for select to authenticated
  using (public.is_conversation_member(conversation_id));

drop policy if exists "Members can view conversations" on public.conversations;
create policy "Members can view conversations" on public.conversations
  for select to authenticated
  using (public.is_conversation_member(id));

-- ---------------------------------------------
-- Atomic conversation creation.
-- Inserts the conversation plus the creator and every member in one transaction,
-- bypassing the SELECT-after-INSERT RLS gap. Returns the new conversation id.
-- ---------------------------------------------
create or replace function public.create_conversation(
  p_is_group  boolean,
  p_name      text,
  p_member_ids uuid[]
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_conv_id uuid;
  v_uid     uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  insert into public.conversations (is_group, name)
  values (coalesce(p_is_group, false), p_name)
  returning id into v_conv_id;

  -- Creator + provided members, de-duplicated, nulls dropped.
  insert into public.conversation_members (conversation_id, user_id)
  select v_conv_id, uid
  from (
    select distinct unnest(array_append(coalesce(p_member_ids, '{}'::uuid[]), v_uid)) as uid
  ) m
  where uid is not null
  on conflict (conversation_id, user_id) do nothing;

  return v_conv_id;
end;
$$;

grant execute on function public.create_conversation(boolean, text, uuid[]) to authenticated;
