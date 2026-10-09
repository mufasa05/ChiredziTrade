import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { checkRateLimit } from '@/lib/rate-limit';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { allowed } = checkRateLimit(req, 60, 60 * 1000);
    if (!allowed) {
      return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 });
    }

    const listing = await db.getListingById(params.id);
    if (!listing) {
      return NextResponse.json({ success: false, error: 'Listing not found' }, { status: 404 });
    }

    // Public listing detail endpoint — strictly returns listing details.
    // Proposals contain proposer PII and are fetched only by the seller via /api/dashboard.
    return NextResponse.json({ success: true, listing });
  } catch (error) {
    console.error('API Error in GET /api/listings/[id]:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch listing' }, { status: 500 });
  }
}
