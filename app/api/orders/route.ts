import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { checkRateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

const CreateOrderSchema = z.object({
  listingId: z.string().min(1, 'Listing ID required'),
  buyerName: z.string().min(2, 'Name too short').max(100),
  buyerPhone: z.string().min(6, 'Phone too short').max(30),
  pickupLocation: z.string().max(100).optional().default('Tshovani'),
  currencyChoice: z.enum(['USD', 'ZAR', 'ZWG']).default('USD'),
  quantity: z.number().int().positive().max(1000).default(1),
  notes: z.string().max(500).optional().default(''),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limit Order Creation (max 15 orders per minute per IP)
    const { allowed } = checkRateLimit(req, 15, 60 * 1000);
    if (!allowed) {
      return NextResponse.json({ success: false, error: 'Rate limit exceeded. Try again later.' }, { status: 429 });
    }

    // 2. Validate input schema
    const rawBody = await req.json();
    const validatedData = CreateOrderSchema.parse(rawBody);

    // 3. SECURITY CRITICAL: Server-Side Price Verification
    // Fetch original listing from DB to prevent client-side price tampering
    const listing = await db.getListingById(validatedData.listingId);
    if (!listing) {
      return NextResponse.json({ success: false, error: 'Target listing not found or archived' }, { status: 404 });
    }

    if (!listing.price || listing.price <= 0) {
      return NextResponse.json({ success: false, error: 'This listing is not available for cash purchase' }, { status: 400 });
    }

    // Calculate actual total price on server (NEVER trust client totalPrice!)
    const verifiedTotalPrice = Number((listing.price * validatedData.quantity).toFixed(2));

    const order = await db.createOrder({
      listingId: validatedData.listingId,
      buyerName: validatedData.buyerName,
      buyerPhone: validatedData.buyerPhone,
      pickupLocation: validatedData.pickupLocation,
      currencyChoice: validatedData.currencyChoice,
      quantity: validatedData.quantity,
      totalPrice: verifiedTotalPrice,
      notes: validatedData.notes,
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    console.error('API Error in POST /api/orders:', error);
    return NextResponse.json({ success: false, error: 'Failed to create cash order' }, { status: 500 });
  }
}

