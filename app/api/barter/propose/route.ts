import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { listingId, proposerName, proposerPhone, proposerLocation, offeredItemTitle, offeredDescription, cashTopUp } = body;

    if (!listingId || !proposerName || !proposerPhone || !offeredItemTitle) {
      return NextResponse.json({ success: false, error: 'Missing required proposal fields' }, { status: 400 });
    }

    const proposal = await db.createProposal({
      listingId,
      proposerName,
      proposerPhone,
      proposerLocation: proposerLocation || 'Chiredzi',
      offeredItemTitle,
      offeredDescription: offeredDescription || '',
      cashTopUp: cashTopUp || undefined,
    });

    return NextResponse.json({ success: true, proposal });
  } catch (error) {
    console.error('API Error in /api/barter/propose:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit proposal' }, { status: 500 });
  }
}
