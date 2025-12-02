// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ContactBody = {
  name: string;
  email: string;
  subject?: string;
  message: string;
  token?: string; // reCAPTCHA v3 token OR "dev-bypass" in local dev
  attachment?: { filename: string; content: string } | null; // data:*/*;base64,...
};

function jsonError(
  status: number,
  code: string,
  message: string,
  extra?: Record<string, unknown>,
) {
  return NextResponse.json(
    { ok: false, error: { code, message, ...(extra ?? {}) } },
    { status },
  );
}

function reqEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`[contact] Missing env: ${name}`);
  return v;
}

async function fetchWithTimeout(
  url: string,
  opts: RequestInit & { timeout?: number } = {},
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
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd && fwd.length > 0) return fwd.split(",")[0]!.trim();
  return undefined;
}

function isLocalHost(url: URL) {
  return url.hostname === "localhost" || url.hostname === "127.0.0.1";
}

function parseDataUrlMeta(dataUrl: string) {
  const m = /^data:([^;,]+)?(;base64)?,/i.exec(dataUrl);
  const mime = m?.[1]?.toLowerCase() || "application/octet-stream";
  const isBase64 = m?.[2]?.toLowerCase() === ";base64";
  return { mime, isBase64 };
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"]/g, (ch) => {
    switch (ch) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return ch;
    }
  });
}

export async function POST(req: NextRequest) {
  const requestId =
    req.headers.get("x-vercel-id") || Math.random().toString(36).slice(2, 10);

  // ===== Env: server-only =====
  const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY || "";
  const DEV_BYPASS = process.env.NEXT_PUBLIC_DEV_RECAPTCHA_BYPASS === "1";

  // SMTP (Zoho or any other provider)
  const SMTP_HOST = reqEnv("SMTP_HOST"); // e.g. "smtp.zoho.com"
  const SMTP_PORT = Number(process.env.SMTP_PORT ?? "465"); // "465" (SSL) or "587" (STARTTLS)
  const SMTP_USER = reqEnv("SMTP_USER"); // e.g. "support@fmpnavigator.org"
  const SMTP_PASS = reqEnv("SMTP_PASS"); // Zoho app password
  const CONTACT_TO = reqEnv("CONTACT_TO"); // e.g. "support@fmpnavigator.org"

  // ===== Body validation =====
  let body: ContactBody;
  try {
    body = (await req.json()) as ContactBody;
  } catch {
    return jsonError(400, "BAD_JSON", "Invalid JSON body.");
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const subject = (body.subject || "").trim();
  const message = (body.message || "").trim();
  const token = (body.token || "").trim();
  const attachment = body.attachment ?? null;

  if (!name || name.length < 2)
    return jsonError(400, "BAD_NAME", "Please provide your full name.");
  if (!email || !/^\S+@\S+\.\S+$/.test(email))
    return jsonError(400, "BAD_EMAIL", "Please provide a valid email address.");
  if (!subject || subject.length < 3)
    return jsonError(400, "BAD_SUBJECT", "Please include a subject.");
  if (!message || message.length < 10)
    return jsonError(400, "BAD_MESSAGE", "Please include a longer message.");

  // Attachment ≤ 5MB (base64 length accounting)
  if (attachment) {
    if (!attachment.filename || !attachment.content?.startsWith("data:")) {
      return jsonError(
        400,
        "BAD_ATTACHMENT",
        "Attachment must be a data URL with a filename.",
      );
    }
    const { isBase64 } = parseDataUrlMeta(attachment.content);
    if (!isBase64)
      return jsonError(
        400,
        "BAD_ATTACHMENT_ENCODING",
        "Attachment must be base64-encoded.",
      );
    const b64 = attachment.content.split(",")[1] || "";
    const bytes = Math.floor((b64.length * 3) / 4);
    if (bytes > 5 * 1024 * 1024)
      return jsonError(
        400,
        "ATTACHMENT_TOO_LARGE",
        "Attachment must be ≤ 5 MB.",
      );
  }

  const ip = getClientIp(req);
  const ua = req.headers.get("user-agent") || "";
  const referer = req.headers.get("referer") || "";
  const originUrl = new URL(req.url);
  const page_url =
    referer && /^https?:\/\//i.test(referer)
      ? referer
      : `${originUrl.origin}/contact`;

  // ===== reCAPTCHA (same behavior as before) =====
  const shouldBypass =
    (DEV_BYPASS && isLocalHost(originUrl)) || token === "dev-bypass";

  if (!shouldBypass) {
    if (!RECAPTCHA_SECRET)
      return jsonError(
        500,
        "SERVER_MISCONFIG",
        "reCAPTCHA is not configured on the server.",
      );
    if (!token)
      return jsonError(400, "MISSING_RECAPTCHA", "reCAPTCHA token missing.");
    try {
      const form = new URLSearchParams();
      form.set("secret", RECAPTCHA_SECRET);
      form.set("response", token);
      if (ip) form.set("remoteip", ip);

      const resp = await fetchWithTimeout(
        "https://www.google.com/recaptcha/api/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: form.toString(),
          timeout: 8000,
        },
      );

      const recaptchaJson = await resp.json();
      const success = !!recaptchaJson?.success;
      const score = Number(recaptchaJson?.score ?? 0);
      if (!success || score < 0.4) {
        console.warn("[contact][recaptcha][denied]", { requestId, ip, score });
        return jsonError(
          400,
          "RECAPTCHA_FAILED",
          "reCAPTCHA verification failed.",
          { score },
        );
      }
    } catch (e: any) {
      console.error("[contact][recaptcha][network]", {
        requestId,
        err: String(e),
      });
      return jsonError(
        502,
        "RECAPTCHA_UNREACHABLE",
        "reCAPTCHA verification failed.",
      );
    }
  }

  // ===== Build email =====
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message);
  const safePageUrl = escapeHtml(page_url);

  const textBody = [
    `New message via FMPNavigator.org`,
    ``,
    `From: ${name} <${email}>`,
    `Subject: ${subject}`,
    ``,
    message,
    ``,
    `Page: ${page_url}`,
    `IP: ${ip ?? "unknown"}`,
    `User-Agent: ${ua}`,
    `Request ID: ${requestId}`,
    `Submitted at: ${new Date().toISOString()}`,
  ].join("\n");

  const htmlBody = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>New website message</title>
    <style>
      body {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text",
          "Segoe UI", sans-serif;
        background-color: #0c1220;
        color: #e3e8f4;
        padding: 24px;
        line-height: 1.6;
      }
      .card {
        background-color: #0f172a;
        border-radius: 16px;
        border: 1px solid #1e293b;
        max-width: 640px;
        margin: 0 auto;
        overflow: hidden;
      }
      .inner {
        padding: 20px 24px;
      }
      h1 {
        margin: 0 0 6px;
        font-size: 18px;
      }
      p {
        margin: 0;
      }
      .muted {
        color: #9ca3af;
        font-size: 13px;
      }
      .meta {
        font-size: 12px;
        color: #9ca3af;
        margin-top: 4px;
      }
      .hr {
        border: none;
        border-top: 1px solid #1f2937;
        margin: 0;
      }
      .label {
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #9ca3af;
        margin-bottom: 4px;
      }
      .msg {
        margin-top: 4px;
        background: #020617;
        border-radius: 12px;
        border: 1px solid #1f2937;
        padding: 12px 14px;
        white-space: pre-wrap;
        font-size: 14px;
        color: #e5e7eb;
      }
      a {
        color: #60a5fa;
        text-decoration: none;
      }
      .footer {
        padding: 16px 24px;
        background: #020617;
        color: #6b7280;
        font-size: 11px;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="inner">
        <h1>New website message</h1>
        <p class="muted">
          from <strong>${safeName}</strong> &lt;${safeEmail}&gt;
        </p>
        <p class="meta"><strong>Subject:</strong> ${safeSubject}</p>
      </div>

      <hr class="hr" />

      <div class="inner">
        <div class="label">Message</div>
        <div class="msg">${safeMessage}</div>
      </div>

      <div class="inner">
        <p class="meta">
          Submitted from:
          <a href="${safePageUrl}">${safePageUrl}</a><br />
          IP: ${escapeHtml(ip ?? "unknown")}<br />
          User-Agent: ${escapeHtml(ua)}<br />
          Request ID: ${escapeHtml(requestId)}
        </p>
      </div>

      <div class="footer">
        © FMP Navigator • fmpnavigator.org
      </div>
    </div>
  </body>
</html>`;

  // ===== Nodemailer transport (Zoho SMTP) =====
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465, // true = SSL, false = STARTTLS (587)
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  // Attachment mapping
  const mailAttachments: {
    filename: string;
    content: Buffer;
    contentType?: string;
  }[] = [];

  if (attachment) {
    const { mime } = parseDataUrlMeta(attachment.content);
    const base64 = attachment.content.split(",")[1] || "";
    const buf = Buffer.from(base64, "base64");
    mailAttachments.push({
      filename: attachment.filename,
      content: buf,
      contentType: mime,
    });
  }

  // ===== Send mail =====
  try {
    await transporter.sendMail({
      from: `"FMP Navigator Contact" <${SMTP_USER}>`,
      to: CONTACT_TO,
      replyTo: `"${name}" <${email}>`,
      subject: subject || "New message via FMPNavigator.org",
      text: textBody,
      html: htmlBody,
      attachments: mailAttachments.length ? mailAttachments : undefined,
    });
  } catch (err: any) {
    console.error("[contact][smtp][error]", {
      requestId,
      err: String(err),
    });
    return jsonError(
      502,
      "SMTP_ERROR",
      "Unable to send email via SMTP.",
      { detail: String(err) },
    );
  }

  console.info("[contact][ok]", { requestId, name, email, ip });
  return NextResponse.json({ ok: true }, { status: 200 });
}

export async function GET() {
  return NextResponse.json(
    { ok: false, error: { code: "METHOD_NOT_ALLOWED" } },
    { status: 405 },
  );
}