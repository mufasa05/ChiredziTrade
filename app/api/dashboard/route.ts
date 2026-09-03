import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { checkRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { allowed } = checkRateLimit(req, 60, 60 * 1000);
    if (!allowed) {
      return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const phone = searchParams.get('phone');

    if (!userId && !phone) {
      return NextResponse.json({ success: false, error: 'userId or phone query parameter required' }, { status: 400 });
    }

    // 1. Fetch all listings
    const allListings = await db.getListings();

    // 2. Filter listings belonging to this seller
    const userListings = allListings.filter((l) => {
      const matchId = userId && (l.userId === userId || l.user?.id === userId);
      const cleanTargetPhone = phone ? phone.replace(/\D/g, '') : '';
      const cleanUserPhone = l.user?.phoneNumber ? l.user.phoneNumber.replace(/\D/g, '') : '';
      const matchPhone = cleanTargetPhone && cleanUserPhone && (cleanTargetPhone.endsWith(cleanUserPhone) || cleanUserPhone.endsWith(cleanTargetPhone));
      return matchId || matchPhone;
    });

    const listingIds = userListings.map((l) => l.id);

    // 3. Fetch proposals and orders for these listings
    const [proposals, orders] = await Promise.all([
      db.getProposalsForSeller(listingIds),
      db.getOrdersForSeller(listingIds),
    ]);

    // 4. Calculate summary stats
    const activeCount = userListings.filter((l) => l.status === 'active').length;
    const soldCount = userListings.filter((l) => l.status === 'sold').length;
    const totalOrderValue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    return NextResponse.json({
      success: true,
      stats: {
        totalListings: userListings.length,
        activeListings: activeCount,
        soldListings: soldCount,
        pendingProposals: proposals.length,
        totalOrders: orders.length,
        totalOrderValue,
      },
      listings: userListings,
      proposals,
      orders,
    });
  } catch (error) {
    console.error('API Error in GET /api/dashboard:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { allowed } = checkRateLimit(req, 30, 60 * 1000);
    if (!allowed) {
      return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 });
    }

    const body = await req.json();
    const { listingId, status } = body;

    if (!listingId || !status) {
      return NextResponse.json({ success: false, error: 'listingId and status are required' }, { status: 400 });
    }

    const updated = await db.updateListingStatus(listingId, status);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Listing not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, listing: updated });
  } catch (error) {
    console.error('API Error in PATCH /api/dashboard:', error);
    return NextResponse.json({ success: false, error: 'Failed to update listing' }, { status: 500 });
  }
}
