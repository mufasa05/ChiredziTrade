import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { checkRateLimit } from '@/lib/rate-limit';
import { getAuthUser } from '@/lib/supabase/server';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const ProposeBarterSchema = z.object({
  listingId: z.string().min(1, 'Listing ID required'),
  listingTitle: z.string().optional(),
  proposerName: z.string().min(2, 'Name too short').max(100),
  proposerPhone: z.string().min(6, 'Phone too short').max(30),
  proposerLocation: z.string().max(100).optional().default('Harare CBD'),
  offeredItemTitle: z.string().min(2, 'Offered item title required').max(140),
  offeredDescription: z.string().max(1000).optional().default(''),
  cashTopUp: z.string().max(50).optional(),
});

const UpdateStatusSchema = z.object({
  proposalId: z.string().min(1, 'Proposal ID required'),
  status: z.enum(['pending', 'accepted', 'declined']),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const listingId = searchParams.get('listingId');
    if (listingId) {
      const proposals = await db.getProposalsForListing(listingId);
      return NextResponse.json({ success: true, count: proposals.length, proposals });
    }
    const all = await db.getAllProposals();
    return NextResponse.json({ success: true, count: all.length, proposals: all });
  } catch (error) {
    console.error('API Error in GET /api/barter/propose:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch proposals' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { allowed } = checkRateLimit(req, 20, 60 * 1000);
    if (!allowed) {
      return NextResponse.json({ success: false, error: 'Rate limit exceeded. Try again later.' }, { status: 429 });
    }

    const { user } = await getAuthUser();
    const rawBody = await req.json();
    const validatedData = ProposeBarterSchema.parse(rawBody);

    const proposal = await db.createProposal({
      listingId: validatedData.listingId,
      listingTitle: validatedData.listingTitle,
      proposerId: user?.id || undefined,
      proposerName: validatedData.proposerName,
      proposerPhone: validatedData.proposerPhone,
      proposerLocation: validatedData.proposerLocation,
      offeredItemTitle: validatedData.offeredItemTitle,
      offeredDescription: validatedData.offeredDescription,
      cashTopUp: validatedData.cashTopUp || undefined,
    });

    return NextResponse.json({ success: true, proposal });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    console.error('API Error in POST /api/barter/propose:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit proposal' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const { proposalId, status } = UpdateStatusSchema.parse(rawBody);

    const updated = await db.updateProposalStatus(proposalId, status);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Proposal not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, proposal: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    console.error('API Error in PATCH /api/barter/propose:', error);
    return NextResponse.json({ success: false, error: 'Failed to update proposal status' }, { status: 500 });
  }
}
