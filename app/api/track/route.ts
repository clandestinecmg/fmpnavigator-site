// app/api/track/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: NextRequest) {
  try {
    const { event, meta } = await req.json().catch(() => ({ event: 'unknown', meta: {} }));

    const fwd = req.headers.get('x-forwarded-for') ?? '';
    const real = req.headers.get('x-real-ip') ?? '';
    const ip = (fwd.split(',')[0] || real || '').trim();
    const ua = req.headers.get('user-agent') ?? '';

    await adminDb
      .collection('metrics')
      .doc('site')
      .collection('hits')
      .add({
        ts: FieldValue.serverTimestamp(),
        event,
        ip,
        ua,
        meta: meta ?? {},
      });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'fail' }, { status: 500 });
  }
}