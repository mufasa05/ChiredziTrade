import { NextRequest, NextResponse } from 'next/server';
import { uploadListingImage } from '@/lib/storage';
import { checkRateLimit } from '@/lib/rate-limit';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { allowed } = checkRateLimit(req, 15, 60 * 1000);
    if (!allowed) {
      return NextResponse.json({ success: false, error: 'Upload rate limit exceeded. Try again later.' }, { status: 429 });
    }

    const body = await req.json();
    const { imageBase64, fileName } = body;

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return NextResponse.json({ success: false, error: 'imageBase64 string is required' }, { status: 400 });
    }

    const publicUrl = await uploadListingImage(imageBase64, fileName);
    return NextResponse.json({ success: true, url: publicUrl });
  } catch (err) {
    console.error('API Error in /api/upload:', err);
    return NextResponse.json({ success: false, error: 'Failed to process image upload' }, { status: 500 });
  }
}
