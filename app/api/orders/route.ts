import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { listingId, buyerName, buyerPhone, pickupLocation, currencyChoice, quantity, totalPrice, notes } = body;

    if (!listingId || !buyerName || !buyerPhone) {
      return NextResponse.json({ success: false, error: 'Missing required order fields' }, { status: 400 });
    }

    const order = await db.createOrder({
      listingId,
      buyerName,
      buyerPhone,
      pickupLocation: pickupLocation || 'Tshovani',
      currencyChoice: currencyChoice || 'USD',
      quantity: quantity || 1,
      totalPrice: totalPrice || 0,
      notes: notes || '',
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('API Error in POST /api/orders:', error);
    return NextResponse.json({ success: false, error: 'Failed to create cash order' }, { status: 500 });
  }
}
