import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  // H3 fix: validate the `next` redirect target. Only same-origin relative
  // paths are accepted — blocks `?next=//evil.com` style open redirects.
  const nextRaw = searchParams.get('next') ?? '/feed';
  const next =
    nextRaw.startsWith('/') && !nextRaw.startsWith('//') && !nextRaw.includes('\\')
      ? nextRaw
      : '/feed';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
