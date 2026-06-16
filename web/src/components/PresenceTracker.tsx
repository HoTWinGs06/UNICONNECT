'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

// Keeps the current user's is_online / last_seen fields fresh.
// Mounted once in the app shell.
export default function PresenceTracker({ userId }: { userId: string }) {
  useEffect(() => {
    if (!userId) return;
    const supabase = createClient();

    const setOnline = () =>
      supabase
        .from('profiles')
        .update({ is_online: true, last_seen: new Date().toISOString() })
        .eq('id', userId);

    const setOffline = () =>
      supabase
        .from('profiles')
        .update({ is_online: false, last_seen: new Date().toISOString() })
        .eq('id', userId);

    setOnline();

    // Heartbeat to refresh last_seen
    const interval = setInterval(setOnline, 60_000);

    const onVisibility = () => {
      if (document.visibilityState === 'visible') setOnline();
      else setOffline();
    };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('beforeunload', setOffline);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('beforeunload', setOffline);
      setOffline();
    };
  }, [userId]);

  return null;
}
