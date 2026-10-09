import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { checkRateLimit } from '@/lib/rate-limit';
import { getAuthUser } from '@/lib/supabase/server';
import { z } from 'zod';

const ProposeBarterSchema = z.object({
  listingId: z.string().min(1, 'Listing ID required'),
  proposerName: z.string().min(2, 'Name too short').max(100),
  proposerPhone: z.string().min(6, 'Phone too short').max(30),
  proposerLocation: z.string().max(100).optional().default('Harare CBD'),
  offeredItemTitle: z.string().min(2, 'Offered item title required').max(140),
  offeredDescription: z.string().max(1000).optional().default(''),
  cashTopUp: z.string().max(50).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const { allowed } = checkRateLimit(req, 15, 60 * 1000);
    if (!allowed) {
      return NextResponse.json({ success: false, error: 'Rate limit exceeded. Try again later.' }, { status: 429 });
    }

    const { user } = await getAuthUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Please sign in to propose a barter swap.' }, { status: 401 });
    }

    const rawBody = await req.json();
    const validatedData = ProposeBarterSchema.parse(rawBody);

    const proposal = await db.createProposal({
      listingId: validatedData.listingId,
      proposerId: user?.id,
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
    console.error('API Error in /api/barter/propose:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit proposal' }, { status: 500 });
  }
}
