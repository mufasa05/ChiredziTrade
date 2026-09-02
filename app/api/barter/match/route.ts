import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { findSmartBarterMatches } from '@/lib/barter-engine';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const listingId = searchParams.get('listingId');

    if (!listingId) {
      return NextResponse.json({ success: false, error: 'listingId query param required' }, { status: 400 });
    }

    const listing = await db.getListingById(listingId);
    if (!listing) {
      return NextResponse.json({ success: false, error: 'Listing not found' }, { status: 404 });
    }

    const matches = await findSmartBarterMatches(listing);
    return NextResponse.json({ success: true, listingId, count: matches.length, matches });
  } catch (error) {
    console.error('API Error in /api/barter/match:', error);
    return NextResponse.json({ success: false, error: 'Failed to calculate barter matches' }, { status: 500 });
  }
}
