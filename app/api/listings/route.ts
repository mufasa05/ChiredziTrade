import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { SectorCategory, TradeCurrency } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = (searchParams.get('category') as SectorCategory) || 'all';
    const location = searchParams.get('location') || 'all';
    const currency = (searchParams.get('currency') as TradeCurrency) || 'all';
    const search = searchParams.get('search') || '';
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

    return NextResponse.json({ success: true, count: listings.length, listings });
  } catch (error) {
    console.error('API Error in GET /api/listings:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch listings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newListing = await db.createListing(body);
    return NextResponse.json({ success: true, listing: newListing }, { status: 201 });
  } catch (error) {
    console.error('API Error in POST /api/listings:', error);
    return NextResponse.json({ success: false, error: 'Failed to create listing' }, { status: 500 });
  }
}
