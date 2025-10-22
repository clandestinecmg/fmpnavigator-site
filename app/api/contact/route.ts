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

export async function POST(req: Request) {
  try {
    const { token, name, email, subject, message, attachment } = (await req.json()) as Body;

    // 1) Verify reCAPTCHA v3 token on the server
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    if (!secret) {
      return NextResponse.json({ error: 'Missing RECAPTCHA_SECRET_KEY' }, { status: 500 });
    }

    const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }),
    });
    const verify = await verifyRes.json();

    if (!verify.success || (typeof verify.score === 'number' && verify.score < 0.5)) {
      return NextResponse.json({ error: 'reCAPTCHA check failed' }, { status: 400 });
    }

    // 2) Send via EmailJS REST
    const service_id = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
    const template_id = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
    const public_key = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;
    const private_key = process.env.EMAILJS_PRIVATE_KEY; // optional server-only

    if (!service_id || !template_id || !public_key) {
      return NextResponse.json({ error: 'EmailJS env missing' }, { status: 500 });
    }

    const template_params = { from_name: name, reply_to: email, subject, message };
    const attachments = attachment ? [{ name: attachment.filename, data: attachment.content }] : [];

    const payload: Record<string, any> = { service_id, template_id, template_params, attachments };
    if (!private_key) payload.user_id = public_key; // legacy auth

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (private_key) headers.Authorization = `Bearer ${private_key}`;

    const ejRes = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!ejRes.ok) {
      const text = await ejRes.text();
      return NextResponse.json({ error: `EmailJS failed: ${text}` }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}