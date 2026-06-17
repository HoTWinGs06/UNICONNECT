import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ProfileClient from '@/components/ProfileClient';
import type { Post, Profile } from '@/lib/supabase/types';

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Viewing your own profile -> use the editable route
  if (id === user.id) redirect('/profile');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();
  if (!profile) notFound();

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('author_id', id)
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <ProfileClient
      profile={profile as Profile}
      isOwner={false}
      posts={(posts as Post[]) ?? []}
    />
  );
}
