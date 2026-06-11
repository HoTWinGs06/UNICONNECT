import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import AppShellClient from './AppShellClient';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    redirect('/login');
  }

  // If not onboarded, redirect to onboarding (but allow onboarding page itself)
  // This is handled at the page level for the onboarding page

  return (
    <div className="flex min-h-screen">
      <Sidebar profile={profile} />

      <div className="flex-1 flex flex-col min-w-0">
        <AppShellClient profile={profile}>
          {children}
        </AppShellClient>

        <BottomNav />
      </div>
    </div>
  );
}
