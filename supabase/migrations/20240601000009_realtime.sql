-- Enable Realtime for tables the web client subscribes to via postgres_changes.
-- The frontend already opens channels on these tables
-- (feed comments, server channel messages, direct messages),
-- but without adding them to the supabase_realtime publication
-- no INSERT/UPDATE/DELETE events are ever delivered.

alter publication supabase_realtime add table public.post_comments;
alter publication supabase_realtime add table public.channel_messages;
alter publication supabase_realtime add table public.direct_messages;

-- REPLICA IDENTITY FULL so UPDATE/DELETE events include old row data
-- (needed for client-side filtering on columns other than the primary key).
alter table public.post_comments replica identity full;
alter table public.channel_messages replica identity full;
alter table public.direct_messages replica identity full;
