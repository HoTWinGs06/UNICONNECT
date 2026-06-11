'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Profile, NavItem } from '@/lib/supabase/types';

const navItems: NavItem[] = [
  { path: '/feed', icon: 'home', label: 'Feed', mobileNav: true },
  { path: '/servers', icon: 'dns', label: 'Servers', mobileNav: true },
  { path: '/messages', icon: 'chat', label: 'Messages', mobileNav: true, badge: 0 },
  { path: '/grades', icon: 'school', label: 'Grades', mobileNav: true },
  { path: '/events', icon: 'event', label: 'Events', mobileNav: true },
  { path: '/groups', icon: 'group', label: 'Groups', mobileNav: false },
  { path: '/help', icon: 'help_outline', label: 'Get Help', mobileNav: false },
];

export default function Sidebar({ profile }: { profile: Profile }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <aside className="hidden md:flex w-64 bg-surface border-r border-outline-variant flex-col shrink-0 sticky top-0 h-screen">
      {/* Brand */}
      <div className="p-5 border-b border-outline-variant">
        <Link
          href="/feed"
          className="flex items-center gap-2 text-primary-container hover:text-secondary transition-colors"
        >
          <span
            className="material-symbols-outlined text-secondary text-[28px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            hub
          </span>
          <span className="text-headline-md font-bold text-on-surface">
            UniConnect
          </span>
        </Link>
      </div>

      {/* Profile Card */}
      <div className="p-4 border-b border-outline-variant">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary-container font-semibold text-sm overflow-hidden border border-outline-variant">
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
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success border-2 border-surface rounded-full" />
          </div>
          <div className="min-w-0">
            <p className="text-label-md text-on-surface truncate font-semibold">
              {profile.display_name}
            </p>
            <p className="text-label-sm text-on-surface-variant truncate">
              {profile.branch || profile.role} • {profile.year ? `Year ${profile.year}` : profile.role}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto thin-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-label-md ${
                isActive
                  ? 'bg-surface-container-low text-on-surface font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              }`}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{
                  fontVariationSettings: isActive ? "'FILL' 1" : '',
                }}
              >
                {item.icon}
              </span>
              {item.label}
              {item.badge ? (
                <span className="ml-auto w-5 h-5 bg-secondary text-on-secondary rounded-full flex items-center justify-center text-[10px] font-bold">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      {/* Quick Actions */}
      <div className="p-3 border-t border-outline-variant space-y-1">
        <Link
          href="/onboarding"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-all text-label-md"
        >
          <span className="material-symbols-outlined text-[20px]">settings</span>
          Settings
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-all text-label-md w-full text-left"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          Log Out
        </button>
      </div>
    </aside>
  );
}
