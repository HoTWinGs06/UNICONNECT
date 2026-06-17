-- Enable Realtime for tables the web client subscribes to via postgres_changes.
-- The frontend already opens channels on these tables
-- (feed comments, server channel messages, direct messages),
-- but without adding them to the supabase_realtime publication
-- no INSERT/UPDATE/DELETE events are ever delivered.

-- Idempotent: skip tables already in the publication (re-running this migration,
-- e.g. `supabase db reset` against an existing DB, would otherwise abort with
-- 42710 "relation is already member of publication").
do $$
declare
  t text;
begin
  foreach t in array array['post_comments', 'channel_messages', 'direct_messages'] loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;

-- REPLICA IDENTITY FULL so UPDATE/DELETE events include old row data
-- (needed for client-side filtering on columns other than the primary key).
alter table public.post_comments replica identity full;
alter table public.channel_messages replica identity full;
alter table public.direct_messages replica identity full;
