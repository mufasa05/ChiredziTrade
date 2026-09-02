import { NextRequest, NextResponse } from 'next/server';
import { processWhatsAppMessage } from '@/lib/whatsapp-engine';

export const maxDuration = 30; // Max execution timeout for Vercel serverless functions

// 1. Meta Webhook Subscription Verification (GET)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN || 'chiredzi_trade_verify_token';

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse('Forbidden', { status: 403 });
}

// 2. Incoming Messages Handler (POST)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Check if message is a direct testing payload or Meta Graph Cloud API payload
    if (body.from && (body.body || body.text)) {
      const reply = await processWhatsAppMessage({
        from: body.from,
        body: body.body || body.text,
        senderName: body.senderName,
      });
      return NextResponse.json({ status: 'success', reply });
    }

    // Standard Meta Cloud API Payload Parser
    const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    const contact = body.entry?.[0]?.changes?.[0]?.value?.contacts?.[0];

    if (message) {
      const sender = message.from;
      const text = message.type === 'text' ? message.text?.body : '';
      const senderName = contact?.profile?.name;

      const reply = await processWhatsAppMessage({
        from: sender,
        body: text,
        senderName,
      });

      // If official credentials are configured, dispatch outbound message
      const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
      const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

      if (WHATSAPP_TOKEN && PHONE_NUMBER_ID) {
        try {
          await fetch(`https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${WHATSAPP_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              recipient_type: 'individual',
              to: sender,
              type: 'text',
              text: { body: reply.text },
            }),
          });
        } catch (dispatchErr) {
          console.error('Error dispatching outbound WhatsApp message:', dispatchErr);
        }
      }

      return NextResponse.json({ status: 'received', processed: true, reply });
    }

    return NextResponse.json({ status: 'ignored' }, { status: 200 });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ status: 'error', message: String(err) }, { status: 500 });
  }
}
