-- =============================================
-- 002_feed.sql — Campus Feed (Posts, Likes, Comments)
-- =============================================

create table public.posts (
  id            uuid primary key default gen_random_uuid(),
  author_id     uuid not null references public.profiles(id) on delete cascade,
  content       text not null,
  type          text not null default 'post' check (type in ('post', 'announcement', 'research')),
  media_urls    text[] default '{}',
  hashtags      text[] default '{}',
  likes_count   int default 0,
  comments_count int default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create index idx_posts_author on public.posts(author_id);
create index idx_posts_type on public.posts(type);
create index idx_posts_created on public.posts(created_at desc);
create index idx_posts_hashtags on public.posts using gin (hashtags);

create table public.post_likes (
  user_id   uuid not null references public.profiles(id) on delete cascade,
  post_id   uuid not null references public.posts(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, post_id)
);

create table public.post_comments (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references public.posts(id) on delete cascade,
  author_id  uuid not null references public.profiles(id) on delete cascade,
  content    text not null,
  created_at timestamptz default now()
);

create index idx_comments_post on public.post_comments(post_id, created_at);

-- Trigger: update likes_count on posts when a like is added/removed
create or replace function public.update_post_likes_count()
returns trigger
language plpgsql
security definer
as $$
begin
  if TG_OP = 'INSERT' then
    update public.posts set likes_count = likes_count + 1 where id = new.post_id;
    return new;
  elsif TG_OP = 'DELETE' then
    update public.posts set likes_count = likes_count - 1 where id = old.post_id;
    return old;
  end if;
end;
$$;

create trigger on_like_change
  after insert or delete on public.post_likes
  for each row execute function public.update_post_likes_count();

-- Trigger: update comments_count on posts
create or replace function public.update_post_comments_count()
returns trigger
language plpgsql
security definer
as $$
begin
  if TG_OP = 'INSERT' then
    update public.posts set comments_count = comments_count + 1 where id = new.post_id;
    return new;
  elsif TG_OP = 'DELETE' then
    update public.posts set comments_count = comments_count - 1 where id = old.post_id;
    return old;
  end if;
end;
$$;

create trigger on_comment_change
  after insert or delete on public.post_comments
  for each row execute function public.update_post_comments_count();

-- Trigger: updated_at
create trigger posts_updated_at
  before update on public.posts
  for each row execute function public.update_updated_at();

-- =============================================
-- Row Level Security
-- =============================================
alter table public.posts enable row level security;
alter table public.post_likes enable row level security;
alter table public.post_comments enable row level security;

-- Posts: anyone authenticated can read
create policy "Posts are viewable by authenticated users"
  on public.posts for select to authenticated using (true);

-- Posts: authenticated users can create
create policy "Authenticated users can create posts"
  on public.posts for insert to authenticated
  with check (auth.uid() = author_id);

-- Posts: only author can update
create policy "Authors can update own posts"
  on public.posts for update to authenticated
  using (auth.uid() = author_id);

-- Posts: only author can delete
create policy "Authors can delete own posts"
  on public.posts for delete to authenticated
  using (auth.uid() = author_id);

-- Announcements: only faculty/admin can create
-- (enforced at app level — type='announcement' requires role check)

-- Likes: anyone can read
create policy "Likes are viewable" on public.post_likes
  for select to authenticated using (true);

-- Likes: users can toggle own
create policy "Users can like" on public.post_likes
  for insert to authenticated with check (auth.uid() = user_id);

create policy "Users can unlike" on public.post_likes
  for delete to authenticated using (auth.uid() = user_id);

-- Comments: anyone can read
create policy "Comments are viewable" on public.post_comments
  for select to authenticated using (true);

-- Comments: authenticated users can create
create policy "Users can comment" on public.post_comments
  for insert to authenticated with check (auth.uid() = author_id);

-- Comments: only author can delete
create policy "Users can delete own comments" on public.post_comments
  for delete to authenticated using (auth.uid() = author_id);
