import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { SectorCategory, TradeCurrency } from '@/lib/types';
import { checkRateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

// Strict Zod schema for listing creation (Blocks field tampering and prototype pollution)
const CreateListingSchema = z.object({
  userId: z.string().min(1, 'User ID is required').max(100),
  user: z.object({
    id: z.string().min(1).max(100),
    phoneNumber: z.string().min(6).max(30),
    fullName: z.string().min(2).max(100),
    locationArea: z.string().min(2).max(100),
    avatarUrl: z.string().optional().nullable().transform((v) => v || undefined),
    verifiedArtisan: z.boolean().optional(),
    rating: z.number().min(0).max(5).optional(),
    tradeCount: z.number().int().nonnegative().optional(),
  }),
  title: z.string().min(3, 'Title too short').max(140, 'Title too long'),
  description: z.string().min(10, 'Description too short').max(2000, 'Description too long'),
  category: z.enum([
    'livestock_agric',
    'grocery_wholesale',
    'clothing_textiles',
    'building_construction',
    'industrial_services',
    'transport_logistics',
    'general_services',
    'woodwork_construction',
    'retail_hardware'
  ]),
  currency: z.enum(['USD', 'ZAR', 'ZWG', 'BARTER']),
  price: z.number().nonnegative().max(10000000).nullable().optional(),
  barterTerms: z.string().max(500).nullable().optional(),
  locationArea: z.string().min(2).max(100),
  imageUrls: z.array(z.string().min(1)).max(10),
  imageTags: z.array(z.string().max(40)).max(15).optional(),
  conditionGrade: z.enum(['New', 'Used - Good', 'Used - Fair', 'Service Showcase']).optional(),
  status: z.enum(['active', 'sold', 'archived', 'pending_review']).default('active'),
  urgent: z.boolean().default(false),
  harvestReady: z.boolean().default(false),
  openToBarter: z.boolean().default(true),
});

export async function GET(req: NextRequest) {
  try {
    const { allowed } = checkRateLimit(req, 60, 60 * 1000); // 60 requests per minute
    if (!allowed) {
      return NextResponse.json({ success: false, error: 'Too many requests. Please slow down.' }, { status: 429 });
    }

    const { searchParams } = new URL(req.url);
    const category = (searchParams.get('category') as SectorCategory) || 'all';
    const location = searchParams.get('location') || 'all';
    const currency = (searchParams.get('currency') as TradeCurrency) || 'all';
    const search = (searchParams.get('search') || '').slice(0, 100); // Truncate search input to prevent DoS
    const barterOnly = searchParams.get('barterOnly') === 'true';
    const harvestReady = searchParams.get('harvestReady') === 'true';

    const listings = await db.getListings({
      category,
      location,
      currency,
      search,
      barterOnly,
      harvestReady,
    });

    const response = NextResponse.json({ success: true, count: listings.length, listings });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    return response;
  } catch (error) {
    console.error('API Error in GET /api/listings:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch listings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limit listing creation (max 10 new listings per minute per IP)
    const { allowed } = checkRateLimit(req, 10, 60 * 1000);
    if (!allowed) {
      return NextResponse.json({ success: false, error: 'Rate limit exceeded. Try again later.' }, { status: 429 });
    }

    // 2. Strict Zod Schema Validation & Sanitization
    const rawBody = await req.json();
    const validatedData = CreateListingSchema.parse(rawBody);

    // 3. Persist validated and sanitized payload
    const newListing = await db.createListing(validatedData);
    return NextResponse.json({ success: true, listing: newListing }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    console.error('API Error in POST /api/listings:', error);
    return NextResponse.json({ success: false, error: 'Failed to create listing' }, { status: 500 });
  }
}
