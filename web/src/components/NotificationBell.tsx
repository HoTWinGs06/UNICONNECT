'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Notification } from '@/lib/supabase/types';

const typeIcon: Record<Notification['type'], string> = {
  comment: 'chat_bubble',
  like: 'favorite',
  dm: 'mail',
  group_join_request: 'group_add',
  group_join_approved: 'check_circle',
  help_status: 'support',
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
}

export default function NotificationBell({ align = 'right' }: { align?: 'left' | 'right' }) {
  const [items, setItems] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState('');
  const router = useRouter();
  const supabase = createClient();
  const panelRef = useRef<HTMLDivElement>(null);

  const unread = items.filter((n) => !n.is_read).length;

  const fetchNotifications = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserId(user.id);
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30);
    if (data) setItems(data as Notification[]);
  }, [supabase]);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  // Live updates
  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel(`notifications-${userId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
        (payload) => { setItems((prev) => [payload.new as Notification, ...prev].slice(0, 30)); }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [userId, supabase]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  async function markAllRead() {
    const unreadIds = items.filter((n) => !n.is_read).map((n) => n.id);
    if (unreadIds.length === 0) return;
    setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
    await supabase.from('notifications').update({ is_read: true }).in('id', unreadIds);
  }

  async function handleClick(n: Notification) {
    if (!n.is_read) {
      setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, is_read: true } : x)));
      await supabase.from('notifications').update({ is_read: true }).eq('id', n.id);
    }
    setOpen(false);
    if (n.link) router.push(n.link);
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors relative"
        title="Notifications"
        aria-label="Notifications"
      >
        <span className="material-symbols-outlined text-[22px]">notifications</span>
        {unread > 0 && (
          <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 bg-error text-white rounded-full flex items-center justify-center text-[9px] font-bold">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          className={`absolute mt-2 w-80 max-w-[calc(100vw-2rem)] bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg z-50 animate-scale-up overflow-hidden ${
            align === 'left' ? 'left-0' : 'right-0'
          }`}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant">
            <h3 className="font-semibold text-on-surface text-sm">Notifications</h3>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] font-medium text-secondary hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto thin-scrollbar">
            {items.length === 0 ? (
              <div className="text-center py-12 text-on-surface-variant">
                <span className="material-symbols-outlined text-[40px] mb-2 block opacity-30">
                  notifications_off
                </span>
                <p className="text-sm font-medium">No notifications yet</p>
              </div>
            ) : (
              items.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={`w-full text-left px-4 py-3 flex items-start gap-3 border-b border-outline-variant/50 transition-colors hover:bg-surface-container-low ${
                    n.is_read ? '' : 'bg-secondary-container/40'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] text-secondary mt-0.5 shrink-0">
                    {typeIcon[n.type] ?? 'notifications'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-on-surface truncate">{n.title}</p>
                    <p className="text-xs text-on-surface-variant line-clamp-2">{n.body}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[10px] text-on-surface-variant">{timeAgo(n.created_at)}</span>
                    {!n.is_read && <span className="w-2 h-2 bg-secondary rounded-full" />}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
