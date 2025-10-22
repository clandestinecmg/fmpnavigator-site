// app/api/contact/route.ts
import { NextResponse } from 'next/server';

type Attachment = { filename: string; content: string }; // data:*/*;base64,....
type Body = {
  token: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  attachment: Attachment | null;
};

function json(x: unknown, status = 200) {
  return NextResponse.json(x, { status });
}

export async function POST(req: Request) {
  try {
    const {
      token,
      name,
      email,
      subject,
      message,
      attachment,
    } = (await req.json()) as Body;

    // ─────────────────────────────────────────────────────────────
    // 0) Local-only reCAPTCHA bypass (for dev)
    //    Set DEV_RECAPTCHA_BYPASS=1 in .env.local to use.
    // ─────────────────────────────────────────────────────────────
    const bypass = process.env.DEV_RECAPTCHA_BYPASS === '1' && process.env.NODE_ENV !== 'production';

    // 1) Verify reCAPTCHA v3 (unless bypassing)
    if (!bypass) {
      const secret = process.env.RECAPTCHA_SECRET_KEY;
      if (!secret) return json({ error: 'Missing RECAPTCHA_SECRET_KEY' }, 500);

      const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ secret, response: token }),
      });
      const verify = await verifyRes.json();

      if (!verify.success || (typeof verify.score === 'number' && verify.score < 0.5)) {
        return json({ error: 'reCAPTCHA check failed', details: verify }, 400);
      }
    }

    // 2) Send via EmailJS REST
    const service_id = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const template_id = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const public_key = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY; // must start with "public_"
    const private_key = process.env.EMAILJS_PRIVATE_KEY; // preferred (server-only)

    if (!service_id || !template_id || !public_key) {
      return json(
        {
          error: 'EmailJS env missing',
          missing: {
            NEXT_PUBLIC_EMAILJS_SERVICE_ID: !!service_id,
            NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: !!template_id,
            NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: !!public_key,
          },
        },
        500
      );
    }

    // Template variables: must match your EmailJS template variable names
    const template_params = {
      from_name: name,
      reply_to: email,
      subject,
      message,
    };

    const attachments =
      attachment
        ? [{ name: attachment.filename, data: attachment.content }]
        : [];

    const endpoint = 'https://api.emailjs.com/api/v1.0/email/send';

    const payload: Record<string, any> = {
      service_id,
      template_id,
      template_params,
      attachments,
    };

    // Auth:
    // - If private_key is set, use Bearer (recommended in prod)
    // - Else, fall back to legacy user_id = public_...
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (private_key && private_key.trim().length > 0) {
      headers.Authorization = `Bearer ${private_key}`;
    } else {
      payload.user_id = public_key;
    }

    const ejRes = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!ejRes.ok) {
      const text = await ejRes.text();
      // Try to parse JSON error if present
      let details: any = text;
      try { details = JSON.parse(text); } catch {}
      return json({ error: 'EmailJS failed', details }, 502);
    }

    return json({ ok: true });
  } catch (err: any) {
    return json({ error: err?.message || 'Server error' }, 500);
  }
}