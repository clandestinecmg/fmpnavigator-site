// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';

/**
 * CONTACT API — hardened
 * - Validates input (name, email, subject, message, token)
 * - Verifies reCAPTCHA v3 on the server (with local bypass option)
 * - Sends email via EmailJS using PRIVATE bearer key
 * - Defensive timeouts & structured error responses
 *
 * Required env:
 *  - RECAPTCHA_SECRET_KEY
 *  - NEXT_PUBLIC_EMAILJS_SERVICE_ID
 *  - NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
 *  - EMAILJS_PRIVATE_KEY
 * Optional env (dev):
 *  - DEV_RECAPTCHA_BYPASS=1   // lets local client send "dev-bypass" as token
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type ContactBody = {
  name: string;
  email: string;
  subject: string;
  message: string;
  token: string;
  // NOTE: Attachments are NOT forwarded to EmailJS REST here.
  // If needed in the future, upload to Storage and pass a URL in template_params.
};

type EmailJsSendPayload = {
  service_id: string;
  template_id: string;
  template_params: Record<string, string>;
};

function mustEnv(name: string): string {
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
  if (fwd && fwd.length > 0) return fwd.split(',')[0]!.trim();
  return undefined;
}

export async function POST(req: NextRequest) {
  const requestId =
    req.headers.get('x-vercel-id') ||
    Math.random().toString(36).slice(2, 10);

  // Narrow envs once so TS treats them as non-optional strings
  const RECAPTCHA_SECRET = mustEnv('RECAPTCHA_SECRET_KEY');
  const EMAILJS_SERVICE_ID = mustEnv('NEXT_PUBLIC_EMAILJS_SERVICE_ID');
  const EMAILJS_TEMPLATE_ID = mustEnv('NEXT_PUBLIC_EMAILJS_TEMPLATE_ID');
  const EMAILJS_PRIVATE_KEY = mustEnv('EMAILJS_PRIVATE_KEY');

  try {
    const raw = (await req.json()) as Partial<ContactBody>;
    const name = (raw.name || '').trim();
    const email = (raw.email || '').trim();
    const subject = (raw.subject || '').trim();
    const message = (raw.message || '').trim();
    const token = (raw.token || '').trim();

    if (!name || name.length < 2)
      return jsonError(400, 'BAD_NAME', 'Please provide your full name.');
    if (!email || !/^\S+@\S+\.\S+$/.test(email))
      return jsonError(400, 'BAD_EMAIL', 'Please provide a valid email address.');
    if (!subject || subject.length < 3)
      return jsonError(400, 'BAD_SUBJECT', 'Please include a subject.');
    if (!message || message.length < 10)
      return jsonError(400, 'BAD_MESSAGE', 'Please include a longer message.');
    if (!token)
      return jsonError(400, 'MISSING_RECAPTCHA', 'reCAPTCHA token missing.');

    const ip = getClientIp(req);
    const ua = req.headers.get('user-agent') || '';

    // --- Verify reCAPTCHA (allow local bypass) ---
    const allowBypass =
      process.env.NODE_ENV !== 'production' &&
      (process.env.DEV_RECAPTCHA_BYPASS === '1');

    let score = 0;
    if (allowBypass && token === 'dev-bypass') {
      score = 0.9;
    } else {
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
      score = Number(recaptchaJson?.score ?? 0);
      if (!success || score < 0.4) {
        console.warn('[contact][recaptcha][denied]', { requestId, ip, score });
        return jsonError(400, 'RECAPTCHA_FAILED', 'reCAPTCHA verification failed.', { score });
      }
    }

    // --- Send Email via EmailJS (Bearer key) ---
    // NOTE: Attachments are not sent here; include basic metadata inside the message if needed.
    const payload: EmailJsSendPayload = {
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      template_params: {
        from_name: name,
        from_email: email,
        subject,
        message,
        user_agent: ua,
        ip: ip ?? '',
        request_id: requestId,
        submitted_at: new Date().toISOString(),
        recaptcha_score: String(score),
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