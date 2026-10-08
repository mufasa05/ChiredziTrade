import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { checkRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

const ADMIN_PIN = process.env.ADMIN_SECRET_PIN || process.env.ADMIN_PIN || 'Mufasa05';

function isAuthorizedAdmin(req: NextRequest): boolean {
  const pinHeader = req.headers.get('x-admin-pin') || new URL(req.url).searchParams.get('pin');
  if (!pinHeader) return false;
  const clean = pinHeader.trim();
  return clean === ADMIN_PIN;
}

export async function GET(req: NextRequest) {
  try {
    const { allowed } = checkRateLimit(req, 60, 60 * 1000);
    if (!allowed) {
      return NextResponse.json({ success: false, error: 'Rate limit exceeded' }, { status: 429 });
    }

    if (!isAuthorizedAdmin(req)) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Invalid Admin PIN' }, { status: 401 });
    }

    const stats = await db.getAdminStats();
    const listings = await db.getListings({ category: 'all' });
    const users = await db.getAllUsers();
    const proposals = await db.getAllProposals();
    const orders = await db.getAllOrders();

    return NextResponse.json({
      success: true,
      stats,
      listings,
      users,
      proposals,
      orders,
    });
  } catch (err) {
    console.error('API Error in GET /api/admin:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch admin data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { allowed } = checkRateLimit(req, 20, 60 * 1000);
    if (!allowed) {
      return NextResponse.json({ success: false, error: 'Rate limit exceeded' }, { status: 429 });
    }

    if (!isAuthorizedAdmin(req)) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Invalid Admin PIN' }, { status: 401 });
    }

    const body = await req.json();
    const { action, id, status } = body;

    if (action === 'delete_listing' && id) {
      await db.deleteListing(id);
      return NextResponse.json({ success: true, message: `Listing ${id} deleted` });
    }

    if (action === 'update_listing_status' && id && status) {
      await db.updateListingStatus(id, status);
      return NextResponse.json({ success: true, message: `Listing ${id} updated to ${status}` });
    }

    if (action === 'delete_proposal' && id) {
      await db.deleteProposal(id);
      return NextResponse.json({ success: true, message: `Proposal ${id} deleted` });
    }

    if (action === 'delete_order' && id) {
      await db.deleteOrder(id);
      return NextResponse.json({ success: true, message: `Order ${id} deleted` });
    }

    if (action === 'delete_review' && id) {
      await db.deleteReview(id);
      return NextResponse.json({ success: true, message: `Review ${id} deleted` });
    }

    return NextResponse.json({ success: false, error: 'Invalid admin action' }, { status: 400 });
  } catch (err) {
    console.error('API Error in POST /api/admin:', err);
    return NextResponse.json({ success: false, error: 'Failed to execute admin command' }, { status: 500 });
  }
}
