-- =============================================
-- 011_storage.sql — Storage buckets for user-uploaded media
-- =============================================

insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('post-media', 'post-media', true),
  ('event-covers', 'event-covers', true),
  ('attachments', 'attachments', true)
on conflict (id) do nothing;

-- Anyone can read public media
create policy "Public read access to media"
  on storage.objects for select
  to public
  using (bucket_id in ('avatars', 'post-media', 'event-covers', 'attachments'));

-- Authenticated users can upload to these buckets
create policy "Authenticated users can upload media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id in ('avatars', 'post-media', 'event-covers', 'attachments'));

-- Owners can update their own objects
create policy "Owners can update their media"
  on storage.objects for update
  to authenticated
  using (owner = auth.uid())
  with check (owner = auth.uid());

-- Owners can delete their own objects
create policy "Owners can delete their media"
  on storage.objects for delete
  to authenticated
  using (owner = auth.uid());
