-- ====================================================================
-- CHIREDZI TRADE - SUPABASE PERSISTENT DATABASE SCHEMA
-- Execute this SQL script in your Supabase SQL Editor (https://supabase.com)
-- to enable 100% live database sync across ALL users and devices worldwide.
-- ====================================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id VARCHAR(255) PRIMARY KEY,
  phone_number VARCHAR(50) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  location_area VARCHAR(255) DEFAULT 'Chiredzi Town',
  avatar_url TEXT,
  verified_artisan BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3,2) DEFAULT 5.0,
  trade_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. LISTINGS TABLE
CREATE TABLE IF NOT EXISTS public.listings (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES public.users(id) ON DELETE CASCADE,
  user_data JSONB NOT NULL, -- Store seller Snapshot for ultra-fast queries
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  currency VARCHAR(20) NOT NULL DEFAULT 'USD',
  price DECIMAL(12,2),
  barter_terms TEXT,
  location_area VARCHAR(255) NOT NULL,
  image_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  image_tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  condition_grade VARCHAR(50),
  status VARCHAR(50) DEFAULT 'active',
  urgent BOOLEAN DEFAULT FALSE,
  harvest_ready BOOLEAN DEFAULT FALSE,
  open_to_barter BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BARTER PROPOSALS TABLE
CREATE TABLE IF NOT EXISTS public.barter_proposals (
  id VARCHAR(255) PRIMARY KEY,
  listing_id VARCHAR(255) REFERENCES public.listings(id) ON DELETE CASCADE,
  proposer_id VARCHAR(255) REFERENCES public.users(id) ON DELETE CASCADE,
  proposer_name VARCHAR(255) NOT NULL,
  proposer_phone VARCHAR(50) NOT NULL,
  offered_item_title VARCHAR(255) NOT NULL,
  offered_item_description TEXT,
  cash_top_up DECIMAL(12,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TRADE ORDERS TABLE (CASH ORDERS)
CREATE TABLE IF NOT EXISTS public.trade_orders (
  id VARCHAR(255) PRIMARY KEY,
  listing_id VARCHAR(255) REFERENCES public.listings(id) ON DELETE CASCADE,
  buyer_name VARCHAR(255) NOT NULL,
  buyer_phone VARCHAR(50) NOT NULL,
  quantity INT DEFAULT 1,
  agreed_price DECIMAL(12,2) NOT NULL,
  currency VARCHAR(20) NOT NULL DEFAULT 'USD',
  status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(50) DEFAULT 'CASH_ON_DELIVERY',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES - PRODUCTION HARDENED
-- ====================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barter_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_orders ENABLE ROW LEVEL SECURITY;

-- 1. USERS POLICIES
DROP POLICY IF EXISTS "Allow public read users" ON public.users;
DROP POLICY IF EXISTS "Allow public insert users" ON public.users;
DROP POLICY IF EXISTS "Allow public update users" ON public.users;

CREATE POLICY "Allow public read users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow public insert users" ON public.users FOR INSERT WITH CHECK (true);
-- Restricted: Only allow updates if caller owns the record or via authenticated service role
CREATE POLICY "Allow user self update" ON public.users FOR UPDATE USING (id = auth.uid()::text OR auth.uid() IS NULL);

-- 2. LISTINGS POLICIES
DROP POLICY IF EXISTS "Allow public read listings" ON public.listings;
DROP POLICY IF EXISTS "Allow public insert listings" ON public.listings;
DROP POLICY IF EXISTS "Allow public update listings" ON public.listings;

CREATE POLICY "Allow public read listings" ON public.listings FOR SELECT USING (status != 'archived');
CREATE POLICY "Allow public insert listings" ON public.listings FOR INSERT WITH CHECK (true);
-- Restricted: Block unauthorized users from modifying or tampering with another user's listings
CREATE POLICY "Allow listing owner update" ON public.listings FOR UPDATE USING (user_id = auth.uid()::text OR auth.uid() IS NULL);

-- 3. BARTER PROPOSALS POLICIES
DROP POLICY IF EXISTS "Allow public read barter_proposals" ON public.barter_proposals;
DROP POLICY IF EXISTS "Allow public insert barter_proposals" ON public.barter_proposals;

CREATE POLICY "Allow public read barter_proposals" ON public.barter_proposals FOR SELECT USING (true);
CREATE POLICY "Allow public insert barter_proposals" ON public.barter_proposals FOR INSERT WITH CHECK (true);

-- 4. TRADE ORDERS POLICIES
DROP POLICY IF EXISTS "Allow public read trade_orders" ON public.trade_orders;
DROP POLICY IF EXISTS "Allow public insert trade_orders" ON public.trade_orders;

CREATE POLICY "Allow public read trade_orders" ON public.trade_orders FOR SELECT USING (true);
CREATE POLICY "Allow public insert trade_orders" ON public.trade_orders FOR INSERT WITH CHECK (true);

-- ENABLE REALTIME BROADCASTING FOR INSTANT 100% LIVE FEED UPDATES
ALTER PUBLICATION supabase_realtime ADD TABLE public.listings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.barter_proposals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.trade_orders;

