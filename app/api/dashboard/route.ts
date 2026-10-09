import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { checkRateLimit } from '@/lib/rate-limit';
import { getAuthUser } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { allowed } = checkRateLimit(req, 60, 60 * 1000);
    if (!allowed) {
      return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 });
    }

    // 1. Verify caller session
    const { user, supabase } = await getAuthUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Sign-in required to access dashboard' }, { status: 401 });
    }

    // Fetch verified seller profile
    const { data: profile } = await supabase.from('users').select('phone_number').eq('id', user.id).maybeSingle();
    const phone = profile?.phone_number || '';

    // 2. Fetch all listings
    const allListings = await db.getListings();

    // 3. Filter listings belonging to this verified seller
    const userListings = allListings.filter((l) => {
      const matchId = l.userId === user.id || l.user?.id === user.id;
      const cleanTargetPhone = phone ? phone.replace(/\D/g, '') : '';
      const cleanUserPhone = l.user?.phoneNumber ? l.user.phoneNumber.replace(/\D/g, '') : '';
      const matchPhone = cleanTargetPhone && cleanUserPhone && (cleanTargetPhone.endsWith(cleanUserPhone) || cleanUserPhone.endsWith(cleanTargetPhone));
      return matchId || matchPhone;
    });

    const listingIds = userListings.map((l) => l.id);

    // 4. Fetch private proposals and orders strictly for this seller's listings
    const [proposals, orders] = await Promise.all([
      db.getProposalsForSeller(listingIds),
      db.getOrdersForSeller(listingIds),
    ]);

    // 5. Calculate summary stats
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

    const { user } = await getAuthUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { listingId, status } = body;

    if (!listingId || !status) {
      return NextResponse.json({ success: false, error: 'listingId and status are required' }, { status: 400 });
    }

    // Verify ownership: check that target listing belongs to authenticated user
    const listing = await db.getListingById(listingId);
    if (!listing) {
      return NextResponse.json({ success: false, error: 'Listing not found' }, { status: 404 });
    }

    if (listing.userId !== user.id && listing.user?.id !== user.id) {
      return NextResponse.json({ success: false, error: 'Forbidden: You do not own this listing' }, { status: 403 });
    }

    const updated = await db.updateListingStatus(listingId, status);
    return NextResponse.json({ success: true, listing: updated });
  } catch (error) {
    console.error('API Error in PATCH /api/dashboard:', error);
    return NextResponse.json({ success: false, error: 'Failed to update listing' }, { status: 500 });
  }
}
