import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * OAuth (Google) and email magic-link landing route.
 * Exchanges the one-time ?code= for a session cookie, then redirects.
 */
export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get('code');
  const errorDescription = searchParams.get('error_description') || searchParams.get('error');
  const nextParam = searchParams.get('next') || '/';
  // Only allow same-site relative redirects (prevents open-redirect abuse)
  const next = nextParam.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '/';

  if (errorDescription) {
    console.error('OAuth provider error:', errorDescription);
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorDescription)}`);
  }

  if (code) {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (data?.user) {
        try {
          const userMeta = data.user.user_metadata || {};
          const fallbackName =
            userMeta.full_name ||
            userMeta.name ||
            (data.user.email ? data.user.email.split('@')[0] : 'Trader');
          const avatar = userMeta.avatar_url || userMeta.picture || null;

          await supabase.from('users').upsert(
            {
              id: data.user.id,
              email: data.user.email,
              full_name: fallbackName,
              avatar_url: avatar,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'id' }
          );
        } catch (provisionErr) {
          console.warn('Auto-provisioning user record warning:', provisionErr);
        }
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error('Auth callback exchange failed:', error.message);
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`);
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}

