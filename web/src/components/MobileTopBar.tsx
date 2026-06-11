'use client';

import type { Profile } from '@/lib/supabase/types';

// Maps pathnames to page titles
const pageTitles: Record<string, string> = {
  '/feed': 'Campus Feed',
  '/servers': 'Servers',
  '/messages': 'Messages',
  '/grades': 'Academics',
  '/events': 'Events',
  '/groups': 'Study Groups',
  '/help': 'Help Request',
  '/onboarding': 'Onboarding',
};

export default function MobileTopBar({
  pathname,
  profile,
}: {
  pathname: string;
  profile: Profile;
}) {
  const title = pageTitles[pathname] || 'UniConnect';

  return (
    <header className="sticky top-0 z-30 bg-surface/95 backdrop-blur-sm border-b border-outline-variant px-4 h-14 flex items-center gap-3 md:hidden">
      <div className="relative">
        <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary-container font-semibold text-xs overflow-hidden">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt={profile.display_name}
              className="w-full h-full object-cover"
            />
          ) : (
            profile.display_name.charAt(0).toUpperCase()
          )}
        </div>
        <span className="absolute bottom-0 right-0 w-2 h-2 bg-success border border-surface rounded-full" />
      </div>

      <h1 className="font-semibold text-on-surface text-[16px] flex-1">
        {title}
      </h1>

      <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors relative">
        <span className="material-symbols-outlined text-[22px]">notifications</span>
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
      </button>
      <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
        <span className="material-symbols-outlined text-[22px]">search</span>
      </button>
    </header>
  );
}
