import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { checkRateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const CreateReviewSchema = z.object({
  sellerId: z.string().min(1, 'Seller ID is required').max(100),
  listingId: z.string().max(100).optional(),
  reviewerName: z.string().min(2, 'Name too short').max(100),
  reviewerLocation: z.string().min(2).max(100).default('Chiredzi'),
  rating: z.number().int().min(1).max(5),
  tradeType: z.string().min(2).max(100).default('General Trade'),
  comment: z.string().min(5, 'Review comment must be at least 5 characters').max(1000),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get('sellerId');

    if (!sellerId) {
      return NextResponse.json({ success: false, error: 'sellerId query parameter required' }, { status: 400 });
    }

    const reviews = await db.getReviewsForSeller(sellerId);
    const avgRating = reviews.length > 0
      ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1))
      : 5.0;

    return NextResponse.json({
      success: true,
      count: reviews.length,
      avgRating,
      reviews,
    });
  } catch (error) {
    console.error('API Error in GET /api/reviews:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { allowed } = checkRateLimit(req, 10, 60 * 1000); // 10 reviews per minute per IP
    if (!allowed) {
      return NextResponse.json({ success: false, error: 'Too many reviews submitted. Please wait.' }, { status: 429 });
    }

    const rawBody = await req.json();
    const validatedData = CreateReviewSchema.parse(rawBody);

    const review = await db.createReview(validatedData);
    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    console.error('API Error in POST /api/reviews:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit review' }, { status: 500 });
  }
}
