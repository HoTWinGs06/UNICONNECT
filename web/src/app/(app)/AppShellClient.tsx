'use client';

import { usePathname } from 'next/navigation';
import MobileTopBar from '@/components/MobileTopBar';
import type { Profile } from '@/lib/supabase/types';

export default function AppShellClient({
  profile,
  children,
}: {
  profile: Profile;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Hide mobile top bar on onboarding
  const hideNav = pathname === '/onboarding';

  return (
    <>
      {!hideNav && <MobileTopBar pathname={pathname} profile={profile} />}

      <div className="flex-1 animate-page-in">
        {children}
      </div>
    </>
  );
}
