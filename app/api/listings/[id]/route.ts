import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const listing = await db.getListingById(params.id);
    if (!listing) {
      return NextResponse.json({ success: false, error: 'Listing not found' }, { status: 404 });
    }
    const proposals = await db.getProposalsForListing(params.id);
    return NextResponse.json({ success: true, listing, proposals });
  } catch (error) {
    console.error('API Error in GET /api/listings/[id]:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch listing' }, { status: 500 });
  }
}
