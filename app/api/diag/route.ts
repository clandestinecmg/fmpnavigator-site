// app/api/diag/route.ts
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function has(name: string) {
  return Boolean(process.env[name] && String(process.env[name]).length > 0);
}

export async function GET() {
  // Public (client-exposed) envs – should be set locally and on Vercel
  const publicVars = {
    NEXT_PUBLIC_FB_API_KEY: has('NEXT_PUBLIC_FB_API_KEY'),
    NEXT_PUBLIC_FB_AUTH_DOMAIN: has('NEXT_PUBLIC_FB_AUTH_DOMAIN'),
    NEXT_PUBLIC_FB_PROJECT_ID: has('NEXT_PUBLIC_FB_PROJECT_ID'),
    NEXT_PUBLIC_FB_STORAGE_BUCKET: has('NEXT_PUBLIC_FB_STORAGE_BUCKET'),
    NEXT_PUBLIC_FB_SENDER_ID: has('NEXT_PUBLIC_FB_SENDER_ID'),
    NEXT_PUBLIC_FB_APP_ID: has('NEXT_PUBLIC_FB_APP_ID'),
    NEXT_PUBLIC_FB_MEASUREMENT_ID: has('NEXT_PUBLIC_FB_MEASUREMENT_ID'), // ok if false if not using GA
    NEXT_PUBLIC_MAPS_API_KEY: has('NEXT_PUBLIC_MAPS_API_KEY'),
    NEXT_PUBLIC_MAP_ID: has('NEXT_PUBLIC_MAP_ID'),
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: has('NEXT_PUBLIC_RECAPTCHA_SITE_KEY'),
    NEXT_PUBLIC_EMAILJS_SERVICE_ID: has('NEXT_PUBLIC_EMAILJS_SERVICE_ID'),
    NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: has('NEXT_PUBLIC_EMAILJS_TEMPLATE_ID'),
    NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: has('NEXT_PUBLIC_EMAILJS_PUBLIC_KEY'),
    NEXT_PUBLIC_SENTRY_DSN: has('NEXT_PUBLIC_SENTRY_DSN'),               // optional
    NEXT_PUBLIC_SENTRY_PROJECT: has('NEXT_PUBLIC_SENTRY_PROJECT'),       // optional
    NEXT_PUBLIC_SENTRY_ORG: has('NEXT_PUBLIC_SENTRY_ORG'),               // optional
  };

  // Server-only secrets – must be set on Vercel (Sensitive) and may be set locally
  const serverSecrets = {
    RECAPTCHA_SECRET_KEY: has('RECAPTCHA_SECRET_KEY'),
    EMAILJS_PRIVATE_KEY: has('EMAILJS_PRIVATE_KEY'), // optional if using legacy user_id flow
    FIREBASE_PROJECT_ID: has('FIREBASE_PROJECT_ID'),
    FIREBASE_CLIENT_EMAIL: has('FIREBASE_CLIENT_EMAIL'),
    FIREBASE_PRIVATE_KEY: has('FIREBASE_PRIVATE_KEY'),
    // reference-only (optional)
    GCLOUD_PROJECT_ID: has('GCLOUD_PROJECT_ID'),
    GCLOUD_PROJECT_NUMBER: has('GCLOUD_PROJECT_NUMBER'),
    GCLOUD_CREDENTIAL_TYPE: has('GCLOUD_CREDENTIAL_TYPE'),
  };

  return NextResponse.json({ publicVars, serverSecrets });
}