import { NextRequest, NextResponse } from 'next/server';
import { initiatePaynowTransaction } from '@/lib/paynow';
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
    const body = await req.json();
    const { 
      listingId, 
      amount, 
      quantity, 
      buyerName, 
      buyerPhone, 
      buyerEmail,
      pickupLocation, 
      currencyChoice, 
      paymentMethod = 'ecocash',
      mobileNumber,
      transactionRef,
      notes 
    } = body;

    if (!listingId || !amount || amount <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid order amount' }, { status: 400 });
    }

    const listing = await db.getListingById(listingId);
    if (!listing) {
      return NextResponse.json({ success: false, error: 'Listing not found or expired' }, { status: 404 });
    }

    const finalBuyerName = (buyerName || user?.user_metadata?.full_name || 'Lowveld Trader').trim();
    const finalBuyerPhone = (buyerPhone || mobileNumber || user?.user_metadata?.phone_number || '').trim();
    const finalEmail = (buyerEmail || user?.email || `${finalBuyerPhone.replace(/\D/g, '') || 'trader'}@zimbarter.co.zw`).trim();

    const orderReference = `ZT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    let orderNotes = `[PAYMENT: ${paymentMethod.toUpperCase()}] [REF: ${orderReference}]`;
    if (transactionRef) {
      orderNotes += ` [TX_CODE: ${transactionRef.trim()}]`;
    }
    if (notes) {
      orderNotes += ` ${notes.trim()}`;
    }

    // Record order in database
    const order = await db.createOrder({
      listingId,
      buyerName: finalBuyerName,
      buyerPhone: finalBuyerPhone,
      pickupLocation: pickupLocation || 'Chiredzi Town',
      currencyChoice: currencyChoice || listing.currency || 'USD',
      quantity: quantity || 1,
      totalPrice: Number(amount.toFixed(2)),
      notes: orderNotes,
    });

    // 1. Direct Transfer to Seller or Cash Handover
    if (paymentMethod === 'direct_transfer' || paymentMethod === 'cash_handover') {
      return NextResponse.json({
        success: true,
        orderId: order.id,
        orderReference,
        status: 'order_recorded',
        instructions: paymentMethod === 'direct_transfer' 
          ? `Direct transfer of $${amount} recorded. Reference code: ${transactionRef || orderReference}.`
          : `Cash handover of $${amount} recorded for collection at ${pickupLocation}.`,
      });
    }

    // 2. Paynow Integration (EcoCash / OneMoney USSD Push or Card Web Checkout)
    const origin = req.nextUrl.origin;
    const returnUrl = `${origin}/listing/${listingId}?orderId=${order.id}&paid=true`;
    const resultUrl = `${origin}/api/payments/paynow/webhook`;

    const paynowResult = await initiatePaynowTransaction({
      reference: orderReference,
      amount,
      title: listing.title,
      authEmail: finalEmail,
      phone: mobileNumber || finalBuyerPhone,
      paymentMethod: paymentMethod === 'onemoney' ? 'onemoney' : paymentMethod === 'paynow_web' ? 'paynow_web' : 'ecocash',
      returnUrl,
      resultUrl,
    });

    if (!paynowResult.success) {
      return NextResponse.json({
        success: false,
        error: paynowResult.error || 'Failed to initiate payment',
        orderId: order.id,
        orderReference,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderReference,
      status: paynowResult.status,
      instructions: paynowResult.instructions,
      redirectUrl: paynowResult.redirectUrl,
      pollUrl: paynowResult.pollUrl,
      isSimulated: paynowResult.isSimulated,
    });
  } catch (err: any) {
    console.error('API Error in /api/payments/paynow:', err);
    return NextResponse.json({ success: false, error: 'Internal payment processing error' }, { status: 500 });
  }
}
