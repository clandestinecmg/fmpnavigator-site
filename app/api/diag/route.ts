// app/api/diag/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const keys = [
    'NEXT_PUBLIC_FB_API_KEY',
    'NEXT_PUBLIC_FB_AUTH_DOMAIN',
    'NEXT_PUBLIC_FB_PROJECT_ID',
    'NEXT_PUBLIC_FB_STORAGE_BUCKET',
    'NEXT_PUBLIC_FB_SENDER_ID',
    'NEXT_PUBLIC_FB_APP_ID',
    'NEXT_PUBLIC_MAPS_API_KEY',
    'NEXT_PUBLIC_MAP_ID',
    'NEXT_PUBLIC_RECAPTCHA_SITE_KEY',
  ] as const;

  return NextResponse.json(Object.fromEntries(keys.map(k => [k, Boolean(process.env[k])])));
}