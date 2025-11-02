// app/contact/page.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type Attachment = { filename: string; content: string | null }; // data:*/*;base64,...
type FormState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success' }
  | { status: 'error'; message: string };

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';
const DEV_BYPASS = process.env.NEXT_PUBLIC_DEV_RECAPTCHA_BYPASS === '1';

function useRecaptcha(siteKey: string, devBypass: boolean) {
  useEffect(() => {
    if (devBypass) return;
    if (!siteKey || typeof window === 'undefined') return;
    if ((window as any).grecaptcha?.execute) return;

    const existing = document.querySelector<HTMLScriptElement>('script[data-recaptcha="1"]');
    if (existing) return;

    const s = document.createElement('script');
    s.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    s.async = true;
    s.defer = true;
    s.dataset.recaptcha = '1';
    document.head.appendChild(s);
  }, [siteKey, devBypass]);

  const execute = async (action: string): Promise<string> => {
    if (devBypass) return 'dev-bypass';
    if (!siteKey) throw new Error('Missing NEXT_PUBLIC_RECAPTCHA_SITE_KEY');

    await new Promise<void>((resolve) => {
      const go = () => (window as any).grecaptcha.ready(() => resolve());
      if ((window as any).grecaptcha?.ready) go();
      else {
        let tries = 0;
        const id = setInterval(() => {
          tries++;
          if ((window as any).grecaptcha?.ready) { clearInterval(id); go(); }
          else if (tries > 40) { clearInterval(id); resolve(); } // ~4s soft wait
        }, 100);
      }
    });

    const token = await (window as any).grecaptcha.execute(siteKey, { action });
    if (!token) throw new Error('Failed to obtain reCAPTCHA token');
    return token;
  };

  return { execute };
}

export default function ContactPage() {
  const [state, setState] = useState<FormState>({ status: 'idle' });
  const [fileName, setFileName] = useState<string>('');
  const [fileDataUrl, setFileDataUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recaptcha = useRecaptcha(SITE_KEY, DEV_BYPASS);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const disabled = useMemo(() => state.status === 'submitting', [state.status]);

  function triggerFilePicker() {
    fileInputRef.current?.click();
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.currentTarget.files?.[0];
    if (!f) { setFileName(''); setFileDataUrl(null); return; }
    if (f.size > 5 * 1024 * 1024) {
      setState({ status: 'error', message: 'Attachment must be ≤ 5 MB.' });
      e.currentTarget.value = '';
      return;
    }
    setState({ status: 'idle' });
    setFileName(f.name);
    const reader = new FileReader();
    reader.onload = () => setFileDataUrl(reader.result as string);
    reader.onerror = () => setFileDataUrl(null);
    reader.readAsDataURL(f);
  }

  function clearAttachment() {
    setFileName('');
    setFileDataUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (disabled) return;

    const name = nameRef.current?.value.trim() || '';
    const email = emailRef.current?.value.trim() || '';
    const subject = subjectRef.current?.value.trim() || '';
    const message = messageRef.current?.value.trim() || '';

    if (!name || !email || !subject || !message) {
      setState({ status: 'error', message: 'Please fill in all fields.' });
      return;
    }

    try {
      setState({ status: 'submitting' });

      const token = await recaptcha.execute('contact');
      const attachment: Attachment | null = fileDataUrl
        ? { filename: fileName, content: fileDataUrl }
        : null;

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          name,            // becomes from_name on the server
          email,           // becomes from_email on the server
          subject,
          message,
          attachment,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const detail = data?.error?.message || 'Failed to send message';
        throw new Error(detail);
      }

      setState({ status: 'success' });
      if (nameRef.current) nameRef.current.value = '';
      if (emailRef.current) emailRef.current.value = '';
      if (subjectRef.current) subjectRef.current.value = '';
      if (messageRef.current) messageRef.current.value = '';
      clearAttachment();
    } catch (err: any) {
      setState({ status: 'error', message: err?.message || 'Something went wrong' });
    }
  }

  return (
    <section className="container py-12">
      {/* Hero / header */}
      <div className="mb-8 grid grid-cols-1 lg:grid-cols-[1.2fr_.8fr] gap-8 items-stretch">
        <div className="card flex flex-col justify-center p-8">
          <h1 className="h1 mb-3">Contact FMP Navigator</h1>
          <p className="muted text-lg">
            Questions about the VA Foreign Medical Program or our provider lists?
            Send us a note and we’ll get back to you asap.
          </p>
          <ul className="mt-4 small space-y-1">
            <li>• Secure form with reCAPTCHA v3{DEV_BYPASS ? ' (dev bypass active)' : ''}</li>
            <li>• Optional attachment (≤ 5 MB)</li>
          </ul>
        </div>

        {/* Accent card */}
        <div className="card p-0 overflow-hidden">
          <div
            aria-hidden
            className="h-full w-full"
            style={{
              background:
                'linear-gradient(135deg, rgba(2,132,199,0.12), rgba(15,23,42,0.08))',
              minHeight: 220,
            }}
          />
        </div>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="max-w-2xl space-y-5 card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="label">Name</label>
            <input id="name" ref={nameRef} type="text" autoComplete="name" required className="input" disabled={disabled} />
          </div>
          <div>
            <label htmlFor="email" className="label">Email</label>
            <input id="email" ref={emailRef} type="email" autoComplete="email" required className="input" disabled={disabled} />
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="label">Subject</label>
          <input id="subject" ref={subjectRef} type="text" required className="input" disabled={disabled} />
        </div>

        <div>
          <label htmlFor="message" className="label">Message</label>
          <textarea id="message" ref={messageRef} required rows={6} className="textarea" disabled={disabled} />
        </div>

        {/* Attachment */}
        <div>
          <span className="label">Attachment (optional)</span>
          <div className="flex items-center gap-3 mt-1">
            <button
              type="button"
              onClick={triggerFilePicker}
              className="btn btn-secondary"
              disabled={disabled}
            >
              Add attachment
            </button>
            {fileName ? (
              <>
                <span className="small">Selected: <span className="font-medium">{fileName}</span></span>
                <button type="button" onClick={clearAttachment} className="small link-underline">Remove</button>
              </>
            ) : null}
          </div>
          <input
            ref={fileInputRef}
            id="file"
            type="file"
            onChange={onFileChange}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.txt"
            disabled={disabled}
          />
        </div>

        <div className="pt-2 flex items-center gap-3">
          <button type="submit" className="btn btn-primary" disabled={disabled}>
            {state.status === 'submitting' ? 'Sending…' : 'Send message'}
          </button>
          {state.status === 'success' && (
            <span role="status" className="small text-green-600">Sent! We’ll reply soon.</span>
          )}
          {state.status === 'error' && (
            <span role="alert" className="small text-red-600">{state.message}</span>
          )}
        </div>

        <p className="small muted">
          This site is protected by reCAPTCHA and the Google{' '}
          <a className="link-underline" href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and{' '}
          <a className="link-underline" href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a> apply.
        </p>
      </form>
    </section>
  );
}