import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, title, desc, link, metadata } = body;

    if (!title || !desc) {
      return NextResponse.json({ success: false, error: 'Title and desc are required' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      notification: {
        id: `notif-${Date.now()}`,
        type: type || 'system',
        title,
        desc,
        link,
        metadata,
        timestamp: Date.now(),
        unread: true,
      },
    });
  } catch (err) {
    console.error('Error handling notification POST:', err);
    return NextResponse.json({ success: false, error: 'Failed to record notification' }, { status: 500 });
  }
}
