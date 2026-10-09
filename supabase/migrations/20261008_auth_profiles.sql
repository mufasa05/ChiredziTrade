-- ====================================================================
-- ZIMBARTER - SUPABASE AUTH PROFILES
-- Links public.users rows to Supabase Auth users (id = auth.uid()).
-- Run in the Supabase SQL Editor after the initial schema.
-- ====================================================================

-- Users who sign in with Google / email don't have a phone number until they
-- complete their profile, so phone_number must be nullable.
ALTER TABLE public.users ALTER COLUMN phone_number DROP NOT NULL;

-- Store the verified email from Supabase Auth
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS email VARCHAR(255);
CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON public.users (lower(email)) WHERE email IS NOT NULL;

-- Allow signed-in users to create/update ONLY their own profile row.
-- (The remaining open policies are tightened in the next RLS hardening step.)
DROP POLICY IF EXISTS "Allow authenticated self insert" ON public.users;
CREATE POLICY "Allow authenticated self insert" ON public.users
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid()::text);
