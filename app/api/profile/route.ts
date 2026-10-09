import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAuthUser } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

const ProfileSchema = z.object({
  fullName: z.string().trim().min(2, 'Name too short').max(100),
  phoneNumber: z
    .string()
    .trim()
    .transform((v) => v.replace(/[^\d+]/g, ''))
    .refine((v) => /^\+?\d{9,15}$/.test(v), 'Enter a valid WhatsApp number, e.g. +263 77 123 4567')
    .transform((v) => (v.startsWith('+') ? v : `+${v.startsWith('0') ? '263' + v.slice(1) : v}`)),
  locationArea: z.string().trim().min(2).max(100),
});

function toProfile(row: any, email?: string | null) {
  return {
    id: row.id,
    fullName: row.full_name,
    phoneNumber: row.phone_number || '',
    email: row.email || email || '',
    locationArea: row.location_area || 'Harare CBD',
    avatarUrl: row.avatar_url || undefined,
    createdAt: row.created_at,
  };
}

// GET /api/profile — the signed-in user's profile (null if not yet created)
export async function GET() {
  const { user, supabase } = await getAuthUser();
  if (!user) {
    return NextResponse.json({ success: false, error: 'Not signed in' }, { status: 401 });
  }

  const { data, error } = await supabase.from('users').select('*').eq('id', user.id).maybeSingle();
  if (error) {
    console.error('Profile fetch error:', error.message);
    return NextResponse.json({ success: false, error: 'Failed to load profile' }, { status: 500 });
  }

  return NextResponse.json({ success: true, profile: data ? toProfile(data, user.email) : null });
}

// PUT /api/profile — create or update the signed-in user's profile
export async function PUT(req: NextRequest) {
  const { allowed } = checkRateLimit(req, 10, 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 });
  }

  const { user, supabase } = await getAuthUser();
  if (!user) {
    return NextResponse.json({ success: false, error: 'Not signed in' }, { status: 401 });
  }

  let input: z.infer<typeof ProfileSchema>;
  try {
    input = ProfileSchema.parse(await req.json());
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: err.issues[0]?.message || 'Invalid input' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
  }

  const meta = user.user_metadata || {};
  // id and email come from the verified session, never from the request body.
  // Trust fields (verified_artisan, rating, trade_count) are intentionally not writable here.
  const { data, error } = await supabase
    .from('users')
    .upsert(
      {
        id: user.id,
        email: user.email,
        full_name: input.fullName,
        phone_number: input.phoneNumber,
        location_area: input.locationArea,
        avatar_url: meta.avatar_url || meta.picture || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    )
    .select('*')
    .single();

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json(
        { success: false, error: 'This WhatsApp number is already linked to another account.' },
        { status: 409 }
      );
    }
    console.error('Profile upsert error:', error.message);
    return NextResponse.json({ success: false, error: 'Failed to save profile' }, { status: 500 });
  }

  return NextResponse.json({ success: true, profile: toProfile(data, user.email) });
}
