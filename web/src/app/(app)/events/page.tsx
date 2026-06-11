'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Event } from '@/lib/supabase/types';

const categories = ['all', 'academic', 'social', 'career', 'workshop', 'sports', 'cultural'] as const;

const categoryColors: Record<string, string> = {
  academic: 'from-blue-500 to-indigo-600',
  social: 'from-pink-500 to-rose-600',
  career: 'from-emerald-500 to-teal-600',
  workshop: 'from-amber-500 to-orange-600',
  sports: 'from-green-500 to-lime-600',
  cultural: 'from-purple-500 to-violet-600',
};

const categoryIcons: Record<string, string> = {
  academic: 'school',
  social: 'celebration',
  career: 'work',
  workshop: 'build',
  sports: 'sports',
  cultural: 'palette',
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [rsvpEvents, setRsvpEvents] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchEvents = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();

    let query = supabase
      .from('events')
      .select('*')
      .order('start_time', { ascending: true });

    if (filter !== 'all') {
      query = query.eq('category', filter);
    }

    const { data } = await query;
    if (data) setEvents(data);

    // Fetch user's RSVPs
    if (user) {
      const { data: rsvps } = await supabase
        .from('event_rsvps')
        .select('event_id')
        .eq('user_id', user.id)
        .eq('status', 'going');
      if (rsvps) {
        setRsvpEvents(new Set(rsvps.map((r) => r.event_id)));
      }
    }

    setLoading(false);
  }, [supabase, filter]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  async function toggleRsvp(eventId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const isGoing = rsvpEvents.has(eventId);

    if (isGoing) {
      setRsvpEvents((prev) => {
        const next = new Set(prev);
        next.delete(eventId);
        return next;
      });
      setEvents((prev) =>
        prev.map((e) =>
          e.id === eventId ? { ...e, attendee_count: e.attendee_count - 1 } : e
        )
      );
      await supabase
        .from('event_rsvps')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', user.id);
    } else {
      setRsvpEvents((prev) => new Set(prev).add(eventId));
      setEvents((prev) =>
        prev.map((e) =>
          e.id === eventId ? { ...e, attendee_count: e.attendee_count + 1 } : e
        )
      );
      await supabase.from('event_rsvps').insert({
        event_id: eventId,
        user_id: user.id,
        status: 'going',
      });
    }
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }

  function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-44 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 pb-24 md:pb-6">
      <h1 className="text-2xl font-bold text-on-background mb-2">Events</h1>
      <p className="text-body-md text-on-surface-variant mb-6">
        Discover what&apos;s happening on campus
      </p>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-6 pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all press-scale ${
              filter === cat
                ? 'bg-primary-container text-on-primary-container'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {events.length === 0 ? (
          <div className="text-center py-16 text-on-surface-variant">
            <span className="material-symbols-outlined text-[48px] mb-2 block opacity-30">
              event
            </span>
            <p className="font-medium">No events found</p>
            <p className="text-body-sm">Check back later for upcoming events</p>
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden hover-lift animate-fade-in"
            >
              {/* Gradient Header */}
              <div
                className={`h-3 bg-gradient-to-r ${
                  categoryColors[event.category] || 'from-gray-400 to-gray-500'
                }`}
              />

              <div className="p-5">
                <div className="flex items-start gap-4">
                  {/* Date Badge */}
                  <div className="w-14 h-14 rounded-xl bg-surface-container flex flex-col items-center justify-center shrink-0">
                    <span className="text-[11px] font-bold text-primary uppercase">
                      {new Date(event.start_time).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-xl font-bold text-on-surface leading-tight">
                      {new Date(event.start_time).getDate()}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-gradient-to-r ${
                        categoryColors[event.category] || 'from-gray-400 to-gray-500'
                      } text-white`}>
                        {event.category}
                      </span>
                      {event.is_featured && (
                        <span className="material-symbols-outlined text-warning text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          star
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-on-surface mb-1">
                      {event.title}
                    </h3>
                    <p className="text-body-sm text-on-surface-variant line-clamp-2 mb-3">
                      {event.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-label-sm text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        {formatDate(event.start_time)} • {formatTime(event.start_time)}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                        {event.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">group</span>
                        {event.attendee_count} going
                      </span>
                    </div>
                  </div>

                  {/* RSVP Button */}
                  <button
                    onClick={() => toggleRsvp(event.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all press-scale shrink-0 ${
                      rsvpEvents.has(event.id)
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {rsvpEvents.has(event.id) ? (
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          check_circle
                        </span>
                        Going
                      </span>
                    ) : (
                      'RSVP'
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
