import { NextRequest, NextResponse } from 'next/server';
import { analyzeItemPhoto } from '@/lib/gemini-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, fileName } = body;

    const analysis = await analyzeItemPhoto(imageBase64 || '', fileName);
    return NextResponse.json({ success: true, analysis });
  } catch (error) {
    console.error('API Error in /api/ai/vision-tag:', error);
    return NextResponse.json({ success: false, error: 'Failed to analyze image' }, { status: 500 });
  }
}
