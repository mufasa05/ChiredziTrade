-- ============================================================================
-- CHIREDZI TRADE - LOWVELD MARKETPLACE & BARTER ENGINE (PostgreSQL + pgvector)
-- ============================================================================

-- 1. Enable UUID & Vector Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Enumerated Types
CREATE TYPE trade_currency AS ENUM ('USD', 'ZAR', 'ZWG', 'BARTER');
CREATE TYPE listing_status AS ENUM ('active', 'sold', 'archived', 'pending_review');
CREATE TYPE sector_category AS ENUM (
  'livestock_agric',
  'industrial_services',
  'transport_logistics',
  'woodwork_construction',
  'retail_hardware'
);

-- 3. Users Table (Artisans, Farmers, Hauliers, Traders)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number VARCHAR(20) UNIQUE NOT NULL, -- E.164 format e.g. +263772849102
    full_name VARCHAR(100) NOT NULL,
    location_area VARCHAR(100) NOT NULL,      -- Tshovani, Triangle, Light Industry, Mkwasine
    avatar_url TEXT,
    verified_artisan BOOLEAN DEFAULT false,
    rating NUMERIC(3,2) DEFAULT 5.0,
    trade_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Listings Table (Multi-Currency & Vectorized Embeddings for Barter Match)
CREATE TABLE IF NOT EXISTS listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category sector_category NOT NULL,
    currency trade_currency NOT NULL DEFAULT 'USD',
    price NUMERIC(12, 2),                   -- Nullable if pure barter
    barter_terms TEXT,                      -- e.g. "Trade for 3 Brahman heifers or pump repair"
    location_area VARCHAR(100) NOT NULL,    -- Tshovani, Triangle, Light Industry, Mkwasine, etc.
    image_urls TEXT[] DEFAULT '{}',
    image_tags TEXT[] DEFAULT '{}',
    condition_grade VARCHAR(50) DEFAULT 'Service Showcase',
    status listing_status NOT NULL DEFAULT 'active',
    urgent BOOLEAN DEFAULT false,
    harvest_ready BOOLEAN DEFAULT false,
    open_to_barter BOOLEAN DEFAULT false,
    offer_embedding vector(768),            -- Semantic vector of what is offered
    want_embedding vector(768),             -- Semantic vector of what is wanted in return
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. WhatsApp Bot Finite State Machine Sessions
CREATE TABLE IF NOT EXISTS bot_sessions (
    phone_number VARCHAR(20) PRIMARY KEY,
    current_step VARCHAR(50) NOT NULL DEFAULT 'IDLE',
    draft_payload JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Barter Swap Proposals
CREATE TABLE IF NOT EXISTS barter_proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    proposer_name VARCHAR(100) NOT NULL,
    proposer_phone VARCHAR(20) NOT NULL,
    proposer_location VARCHAR(100) NOT NULL,
    offered_item_title VARCHAR(200) NOT NULL,
    offered_description TEXT NOT NULL,
    cash_top_up VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. High-Performance HNSW & B-Tree Indexes
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_location ON listings(location_area);
CREATE INDEX IF NOT EXISTS idx_listings_currency ON listings(currency);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_offer_embed ON listings USING hnsw (offer_embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_listings_want_embed ON listings USING hnsw (want_embedding vector_cosine_ops);
