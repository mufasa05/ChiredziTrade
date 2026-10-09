'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';

let browserClient: SupabaseClient | null = null;

/**
 * Singleton Supabase client for the browser.
 * Sessions are stored in cookies (not localStorage) so that API routes
 * can verify the signed-in user server-side.
 */
export function getSupabaseBrowserClient(): SupabaseClient {
  if (browserClient) return browserClient;

  browserClient = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return browserClient;
}


