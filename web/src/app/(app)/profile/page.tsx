import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ProfileClient from '@/components/ProfileClient';
import type { Post, Profile } from '@/lib/supabase/types';

export default async function MyProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  if (!profile) redirect('/login');

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('author_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <ProfileClient
      profile={profile as Profile}
      isOwner
      posts={(posts as Post[]) ?? []}
    />
  );
}
