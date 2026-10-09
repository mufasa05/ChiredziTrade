import { NextRequest, NextResponse } from 'next/server';
import { initiatePaynowPayment } from '@/lib/paynow';
import { checkRateLimit } from '@/lib/rate-limit';
import { getAuthUser } from '@/lib/supabase/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { allowed } = checkRateLimit(req, 20, 60 * 1000);
    if (!allowed) {
      return NextResponse.json({ success: false, error: 'Too many requests. Please wait a moment.' }, { status: 429 });
    }

    const { user } = await getAuthUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Please sign in to make a payment' }, { status: 401 });
    }

    const body = await req.json();
    const { listingId, amount, quantity, buyerName, buyerPhone, pickupLocation, currencyChoice, notes } = body;

    if (!listingId || !amount || amount <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid order amount' }, { status: 400 });
    }

    const orderReference = `ZT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Create the order in database
    const order = await db.createOrder({
      listingId,
      buyerName: buyerName || user.user_metadata?.full_name || 'Trader',
      buyerPhone: buyerPhone || '',
      pickupLocation: pickupLocation || 'Harare CBD',
      currencyChoice: currencyChoice || 'USD',
      quantity: quantity || 1,
      totalPrice: amount,
      notes: notes ? `[PAYNOW REF: ${orderReference}] ${notes}` : `[PAYNOW REF: ${orderReference}]`,
    });

    const origin = req.nextUrl.origin;
    const returnUrl = `${origin}/listing/${listingId}?orderId=${order.id}&paid=true`;
    const resultUrl = `${origin}/api/payments/paynow/webhook`;

    const paynowResult = await initiatePaynowPayment({
      reference: orderReference,
      amount,
      additionalInfo: `ZimBarter Order ${orderReference}`,
      returnUrl,
      resultUrl,
      authEmail: user.email,
      authPhone: buyerPhone,
    });

    if (!paynowResult.success) {
      return NextResponse.json({ success: false, error: paynowResult.error || 'Failed to initiate Paynow transaction' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderReference,
      redirectUrl: paynowResult.redirectUrl,
      isSimulated: paynowResult.isSimulated,
    });
  } catch (err: any) {
    console.error('API Error in /api/payments/paynow:', err);
    return NextResponse.json({ success: false, error: 'Internal payment error' }, { status: 500 });
  }
}
