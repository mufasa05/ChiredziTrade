-- ====================================================================
-- ZIMBARTER - PRODUCTION ROW LEVEL SECURITY (RLS) HARDENING
-- Restricts trade_orders and barter_proposals SELECT to verified participants.
-- Removes "OR auth.uid() IS NULL" bypasses from users and listings.
-- ====================================================================

-- 1. USERS TABLE POLICIES
DROP POLICY IF EXISTS "Allow user self update" ON public.users;
CREATE POLICY "Allow user self update" ON public.users 
  FOR UPDATE TO authenticated 
  USING (id = auth.uid()::text);

-- 2. LISTINGS TABLE POLICIES
DROP POLICY IF EXISTS "Allow listing owner update" ON public.listings;
CREATE POLICY "Allow listing owner update" ON public.listings 
  FOR UPDATE TO authenticated 
  USING (user_id = auth.uid()::text);

-- 3. BARTER PROPOSALS TABLE POLICIES
-- Only the proposer OR the seller owning the target listing can view proposals
DROP POLICY IF EXISTS "Allow public read barter_proposals" ON public.barter_proposals;
DROP POLICY IF EXISTS "Allow participant read barter_proposals" ON public.barter_proposals;

CREATE POLICY "Allow participant read barter_proposals" ON public.barter_proposals
  FOR SELECT TO authenticated
  USING (
    proposer_id = auth.uid()::text 
    OR listing_id IN (SELECT id FROM public.listings WHERE user_id = auth.uid()::text)
  );

-- 4. TRADE ORDERS TABLE POLICIES
-- Only the seller owning the target listing can view cash trade orders
DROP POLICY IF EXISTS "Allow public read trade_orders" ON public.trade_orders;
DROP POLICY IF EXISTS "Allow seller read trade_orders" ON public.trade_orders;

CREATE POLICY "Allow seller read trade_orders" ON public.trade_orders
  FOR SELECT TO authenticated
  USING (
    listing_id IN (SELECT id FROM public.listings WHERE user_id = auth.uid()::text)
  );
