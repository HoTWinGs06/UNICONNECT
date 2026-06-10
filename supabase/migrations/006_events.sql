-- =============================================
-- 006_events.sql — Campus Events & RSVPs
-- =============================================

create table public.events (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  description    text default '',
  category       text not null default 'academic' check (category in ('academic', 'social', 'career', 'workshop', 'sports', 'cultural')),
  start_time     timestamptz not null,
  end_time       timestamptz not null,
  location       text not null,
  organizer_id   uuid not null references public.profiles(id) on delete cascade,
  organizer_name text,                -- denormalized for display
  cover_image    text,                -- URL to cover image
  max_attendees  int,                 -- null = unlimited
  attendee_count int default 0,
  is_featured    boolean default false,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

create index idx_events_start on public.events(start_time);
create index idx_events_category on public.events(category);
create index idx_events_organizer on public.events(organizer_id);

create table public.event_rsvps (
  event_id    uuid not null references public.events(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  status      text not null default 'going' check (status in ('going', 'interested', 'saved')),
  created_at  timestamptz default now(),
  primary key (event_id, user_id)
);

create index idx_rsvps_user on public.event_rsvps(user_id);

-- Trigger: update attendee_count
create or replace function public.update_event_attendee_count()
returns trigger
language plpgsql
security definer
as $$
begin
  if TG_OP = 'INSERT' and new.status = 'going' then
    update public.events set attendee_count = attendee_count + 1 where id = new.event_id;
  elsif TG_OP = 'DELETE' and old.status = 'going' then
    update public.events set attendee_count = attendee_count - 1 where id = old.event_id;
  elsif TG_OP = 'UPDATE' then
    if old.status = 'going' and new.status != 'going' then
      update public.events set attendee_count = attendee_count - 1 where id = new.event_id;
    elsif old.status != 'going' and new.status = 'going' then
      update public.events set attendee_count = attendee_count + 1 where id = new.event_id;
    end if;
  end if;
  return coalesce(new, old);
end;
$$;

create trigger on_rsvp_change
  after insert or update or delete on public.event_rsvps
  for each row execute function public.update_event_attendee_count();

-- Trigger: updated_at
create trigger events_updated_at
  before update on public.events
  for each row execute function public.update_updated_at();

-- =============================================
-- Row Level Security
-- =============================================
alter table public.events enable row level security;
alter table public.event_rsvps enable row level security;

-- Events: all authenticated can view
create policy "Events are viewable" on public.events
  for select to authenticated using (true);

-- Events: authenticated can create
create policy "Users can create events" on public.events
  for insert to authenticated
  with check (auth.uid() = organizer_id);

-- Events: organizer can update
create policy "Organizer can update event" on public.events
  for update to authenticated
  using (auth.uid() = organizer_id);

-- Events: organizer can delete
create policy "Organizer can delete event" on public.events
  for delete to authenticated
  using (auth.uid() = organizer_id);

-- RSVPs: all authenticated can view
create policy "RSVPs are viewable" on public.event_rsvps
  for select to authenticated using (true);

-- RSVPs: users can RSVP
create policy "Users can RSVP" on public.event_rsvps
  for insert to authenticated
  with check (auth.uid() = user_id);

-- RSVPs: users can update own RSVP
create policy "Users can update RSVP" on public.event_rsvps
  for update to authenticated
  using (auth.uid() = user_id);

-- RSVPs: users can cancel RSVP
create policy "Users can cancel RSVP" on public.event_rsvps
  for delete to authenticated
  using (auth.uid() = user_id);
