import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { SectorCategory, TradeCurrency } from '@/lib/types';
import { checkRateLimit } from '@/lib/rate-limit';
import { getAuthUser } from '@/lib/supabase/server';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const CreateListingSchema = z.object({
  title: z.string().trim().min(2, 'Title too short').max(140, 'Title too long'),
  description: z.string().trim().min(1, 'Description required').max(2000, 'Description too long'),
  category: z.enum([
    'livestock_agric',
    'grocery_wholesale',
    'clothing_textiles',
    'building_construction',
    'industrial_services',
    'transport_logistics',
    'general_services',
    'woodwork_construction',
    'retail_hardware',
  ]),
  currency: z.enum(['USD', 'ZAR', 'ZWG', 'BARTER']),
  price: z.number().nonnegative().max(10000000).nullable().optional(),
  barterTerms: z.string().max(500).nullable().optional(),
  locationArea: z.string().trim().min(2).max(100),
  imageUrls: z.array(z.string().min(1)).max(10),
  imageTags: z.array(z.string().max(40)).max(15).optional(),
  conditionGrade: z.enum(['New', 'Used - Good', 'Used - Fair', 'Service Showcase']).optional(),
  urgent: z.boolean().default(false),
  harvestReady: z.boolean().default(false),
  openToBarter: z.boolean().default(true),
});

export async function GET(req: NextRequest) {
  try {
    const { allowed } = checkRateLimit(req, 60, 60 * 1000);
    if (!allowed) {
      return NextResponse.json({ success: false, error: 'Too many requests. Please slow down.' }, { status: 429 });
    }

    const { searchParams } = new URL(req.url);
    const category = (searchParams.get('category') as SectorCategory) || 'all';
    const location = searchParams.get('location') || 'all';
    const currency = (searchParams.get('currency') as TradeCurrency) || 'all';
    const search = (searchParams.get('search') || '').slice(0, 100);
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
    const { allowed } = checkRateLimit(req, 10, 60 * 1000);
    if (!allowed) {
      return NextResponse.json({ success: false, error: 'Rate limit exceeded. Try again later.' }, { status: 429 });
    }

    // 1. Verify authenticated user session
    const { user, supabase } = await getAuthUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'You must be signed in to post a listing.' }, { status: 401 });
    }

    // 2. Fetch authenticated seller profile from DB
    const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).maybeSingle();

    const fullName = profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Trader';
    const phoneNumber = profile?.phone_number || '';
    const locationArea = profile?.location_area || 'Harare CBD';

    if (!phoneNumber) {
      return NextResponse.json({ success: false, error: 'Please complete your profile with a valid WhatsApp phone number before posting.' }, { status: 400 });
    }

    // 3. Validate form input
    const rawBody = await req.json();
    const validatedData = CreateListingSchema.parse(rawBody);

    // 4. Construct trusted listing payload (userId and seller profile come from server session)
    const newListing = await db.createListing({
      ...validatedData,
      userId: user.id,
      user: {
        id: user.id,
        phoneNumber,
        fullName,
        locationArea: validatedData.locationArea || locationArea,
        avatarUrl: profile?.avatar_url || user.user_metadata?.avatar_url,
        verifiedArtisan: profile?.verified_artisan ?? false,
        rating: profile?.rating ? Number(profile.rating) : 5.0,
        tradeCount: profile?.trade_count || 0,
      },
      status: 'active',
    });

    return NextResponse.json({ success: true, listing: newListing }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    console.error('API Error in POST /api/listings:', error);
    return NextResponse.json({ success: false, error: 'Failed to create listing' }, { status: 500 });
  }
}
