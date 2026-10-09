import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';

/**
 * Supabase client bound to the current request's auth cookies.
 * Use inside Route Handlers / Server Components. Queries run as the
 * signed-in user, so Row Level Security applies with auth.uid().
 */
export function createSupabaseServerClient(): SupabaseClient {
  const cookieStore = cookies();

  return createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Called from a Server Component where cookies are read-only.
            // Safe to ignore: middleware refreshes the session.
          }
        },
      },
    }
  );
}

/**
 * Returns the verified user for this request, or null.
 * getUser() validates the JWT with Supabase Auth — never trust getSession() alone on the server.
 */
export async function getAuthUser(): Promise<{ user: User | null; supabase: SupabaseClient }> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  return { user: error ? null : data.user, supabase };
}
