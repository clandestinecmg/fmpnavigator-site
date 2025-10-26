// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';

/**
 * CONTACT API — production-grade
 * - Validates input (name, email, message, token)
 * - Verifies reCAPTCHA v3 on the server
 * - Sends email via EmailJS with PRIVATE bearer key
 * - Resilient to network failures (timeouts, structured errors)
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type ContactBody = {
  name: string;
  email: string;
  message: string;
  token: string;
};

type EmailJsSendPayload = {
  service_id: string;
  template_id: string;
  user_id?: string;
  accessToken?: string;
  template_params: Record<string, string>;
};

function getEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`[contact] Missing env: ${name}`);
  return v;
}

function jsonError(
  status: number,
  code: string,
  message: string,
  extra?: Record<string, unknown>
) {
  return NextResponse.json(
    { ok: false, error: { code, message, ...(extra ?? {}) } },
    { status }
  );
}

async function fetchWithTimeout(
  url: string,
  opts: RequestInit & { timeout?: number } = {}
) {
  const { timeout = 10_000, ...rest } = opts;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(url, { ...rest, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

function getClientIp(req: NextRequest): string | undefined {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd && fwd.length > 0) {
    return fwd.split(',')[0]!.trim();
  }
  return undefined;
}

export async function POST(req: NextRequest) {
  const requestId =
    req.headers.get('x-vercel-id') ||
    Math.random().toString(36).slice(2, 10);

  // Read and *narrow* envs locally so TS knows they’re plain strings
  const RECAPTCHA_SECRET = getEnv('RECAPTCHA_SECRET_KEY');
  const EMAILJS_SERVICE_ID = getEnv('NEXT_PUBLIC_EMAILJS_SERVICE_ID');
  const EMAILJS_TEMPLATE_ID = getEnv('NEXT_PUBLIC_EMAILJS_TEMPLATE_ID');
  const EMAILJS_PRIVATE_KEY = getEnv('EMAILJS_PRIVATE_KEY');

  try {
    const body = (await req.json()) as Partial<ContactBody>;
    const name = (body.name || '').trim();
    const email = (body.email || '').trim();
    const message = (body.message || '').trim();
    const token = (body.token || '').trim();

    if (!name || name.length < 2)
      return jsonError(400, 'BAD_NAME', 'Please provide your full name.');
    if (!email || !/^\S+@\S+\.\S+$/.test(email))
      return jsonError(400, 'BAD_EMAIL', 'Please provide a valid email address.');
    if (!message || message.length < 10)
      return jsonError(400, 'BAD_MESSAGE', 'Please include a longer message.');
    if (!token)
      return jsonError(400, 'MISSING_RECAPTCHA', 'reCAPTCHA token missing.');

    const ip = getClientIp(req);
    const ua = req.headers.get('user-agent') || '';

    // --- Verify reCAPTCHA ---
    const form = new URLSearchParams();
    form.set('secret', RECAPTCHA_SECRET);
    form.set('response', token);
    if (ip) form.set('remoteip', ip);

    let recaptchaJson: any;
    try {
      const resp = await fetchWithTimeout(
        'https://www.google.com/recaptcha/api/siteverify',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: form.toString(),
          timeout: 8000,
        }
      );
      recaptchaJson = await resp.json();
    } catch (e: any) {
      console.error('[contact][recaptcha][network]', { requestId, err: String(e) });
      return jsonError(502, 'RECAPTCHA_UNREACHABLE', 'reCAPTCHA verification failed.');
    }

    const success = !!recaptchaJson?.success;
    const score = Number(recaptchaJson?.score ?? 0);
    if (!success || score < 0.4) {
      console.warn('[contact][recaptcha][denied]', { requestId, ip, score });
      return jsonError(400, 'RECAPTCHA_FAILED', 'reCAPTCHA verification failed.', { score });
    }

    // --- Send Email via EmailJS (Bearer key) ---
    const payload: EmailJsSendPayload = {
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      template_params: {
        from_name: name,
        from_email: email,
        message,
        user_agent: ua,
        ip: ip ?? '',
        request_id: requestId,
        submitted_at: new Date().toISOString(),
      },
    };

    let emailResp: Response;
    try {
      emailResp = await fetchWithTimeout(
        'https://api.emailjs.com/api/v1.0/email/send',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${EMAILJS_PRIVATE_KEY}`,
          },
          body: JSON.stringify(payload),
          timeout: 10_000,
        }
      );
    } catch (e: any) {
      console.error('[contact][emailjs][network]', { requestId, err: String(e) });
      return jsonError(502, 'EMAILJS_UNREACHABLE', 'Email service unreachable.');
    }

    if (!emailResp.ok) {
      const text = await emailResp.text();
      console.error('[contact][emailjs][bad_status]', {
        requestId,
        status: emailResp.status,
        body: text,
      });
      return jsonError(502, 'EMAILJS_ERROR', 'Email service returned an error.', {
        status: emailResp.status,
        body: text,
      });
    }

    console.info('[contact][ok]', { requestId, name, email, ip, score });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    console.error('[contact][unhandled]', { requestId, err: String(err) });
    return jsonError(500, 'INTERNAL_ERROR', 'Unexpected server error.');
  }
}

export async function GET() {
  return NextResponse.json(
    { ok: false, error: { code: 'METHOD_NOT_ALLOWED' } },
    { status: 405 }
  );
}