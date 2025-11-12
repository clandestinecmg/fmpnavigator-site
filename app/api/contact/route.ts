// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";

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

export async function POST(req: NextRequest) {
  const requestId =
    req.headers.get("x-vercel-id") || Math.random().toString(36).slice(2, 10);

  // ===== Env: server-only (no NEXT_PUBLIC fallbacks) =====
  const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY || "";
  const DEV_BYPASS = process.env.NEXT_PUBLIC_DEV_RECAPTCHA_BYPASS === "1";

  const EMAILJS_SERVICE_ID = reqEnv("EMAILJS_SERVICE_ID");
  const EMAILJS_TEMPLATE_ID = reqEnv("EMAILJS_TEMPLATE_ID");
  const EMAILJS_PUBLIC_KEY = reqEnv("EMAILJS_PUBLIC_KEY");
  const EMAILJS_PRIVATE_KEY = reqEnv("EMAILJS_PRIVATE_KEY");
  const EMAILJS_AUTOREPLY_TEMPLATE_ID =
    process.env.EMAILJS_AUTOREPLY_TEMPLATE_ID || "";

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

  // reCAPTCHA (skip only for localhost + dev-bypass OR explicit 'dev-bypass' token)
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

  // EmailJS payload (server REST)
  const template_params: Record<string, string> = {
    from_name: name,
    from_email: email,
    subject,
    message,
    page_url,
    user_agent: ua,
    ip: ip ?? "",
    request_id: requestId,
    submitted_at: new Date().toISOString(),
  };

  const basePayload: Record<string, any> = {
    service_id: EMAILJS_SERVICE_ID,
    template_id: EMAILJS_TEMPLATE_ID,
    template_params,
    user_id: EMAILJS_PUBLIC_KEY, // EmailJS public key (aka user_id)
  };

  if (token && token !== "dev-bypass") {
    basePayload["g-recaptcha-response"] = token;
  }
  if (attachment) {
    const base64 = attachment.content.split(",")[1] || "";
    basePayload.attachments = [{ name: attachment.filename, data: base64 }];
  }

  // Send via EmailJS REST (try with Bearer first, then fallback to public key mode)
  let emailResp: Response;
  let diagnosticsMode = "bearer";
  try {
    // Mode A: Bearer (private key)
    emailResp = await fetchWithTimeout(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${EMAILJS_PRIVATE_KEY}`,
        },
        body: JSON.stringify(basePayload),
        timeout: 15_000,
      },
    );

    // Fallback to public-key mode if EmailJS returns a 400 with "parameters are invalid"
    if (emailResp.status === 400) {
      const peek = await emailResp.text().catch(() => "");
      if (/parameters are invalid/i.test(peek)) {
        diagnosticsMode = "public_key";
        emailResp = await fetchWithTimeout(
          "https://api.emailjs.com/api/v1.0/email/send",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(basePayload), // user_id is included
            timeout: 15_000,
          },
        );
      } else {
        // re-create a Response-like object to pass along text later
        emailResp = new Response(peek, { status: 400 });
      }
    }
  } catch (e: any) {
    console.error("[contact][emailjs][network]", { requestId, err: String(e) });
    return jsonError(502, "EMAILJS_UNREACHABLE", "Email service unreachable.");
  }

  if (!emailResp.ok) {
    const text = await emailResp.text();
    console.error("[contact][emailjs][bad_status]", {
      requestId,
      status: emailResp.status,
      body: text,
      diagnostics: {
        mode: diagnosticsMode, // 'bearer' or 'public_key'
        have_public_key: !!EMAILJS_PUBLIC_KEY,
        public_key_len: EMAILJS_PUBLIC_KEY.length,
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
      },
    });
    const code =
      emailResp.status === 401 ? "EMAILJS_UNAUTHORIZED" : "EMAILJS_ERROR";
    return jsonError(502, code, "Email service returned an error.", {
      status: emailResp.status,
      body: text.slice(0, 500),
    });
  }

  // Optional: server-side autoresponder
  if (EMAILJS_AUTOREPLY_TEMPLATE_ID) {
    try {
      await fetchWithTimeout("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${EMAILJS_PRIVATE_KEY}`,
        },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_AUTOREPLY_TEMPLATE_ID,
          template_params: { from_name: name, from_email: email, message },
          public_key: EMAILJS_PUBLIC_KEY,
          user_id: EMAILJS_PUBLIC_KEY,
        }),
        timeout: 12_000,
      });
    } catch {
      // non-fatal
    }
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