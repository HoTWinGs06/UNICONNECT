'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavItem } from '@/lib/supabase/types';

const mobileNavItems: NavItem[] = [
  { path: '/feed', icon: 'home', label: 'Feed', mobileNav: true },
  { path: '/servers', icon: 'dns', label: 'Servers', mobileNav: true },
  { path: '/messages', icon: 'chat', label: 'Messages', mobileNav: true },
  { path: '/grades', icon: 'school', label: 'Grades', mobileNav: true },
  { path: '/events', icon: 'event', label: 'Events', mobileNav: true },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-surface/95 backdrop-blur-sm border-t border-outline-variant pb-safe md:hidden">
      <div className="flex justify-around items-center px-2 py-1">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-lg transition-colors relative ${
                isActive ? 'text-secondary' : 'text-on-surface-variant'
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={{
                  fontVariationSettings: isActive ? "'FILL' 1" : '',
                }}
              >
                {item.icon}
              </span>
              <span className="text-[10px] font-medium">{item.label}</span>
              {item.badge ? (
                <span className="absolute -top-0.5 right-0 w-4 h-4 bg-secondary text-on-secondary rounded-full flex items-center justify-center text-[8px] font-bold">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
