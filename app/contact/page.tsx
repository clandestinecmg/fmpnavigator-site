// app/contact/page.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';

type FormState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success' }
  | { status: 'error'; message: string };

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

/** Load & execute reCAPTCHA v3 */
function useRecaptcha(siteKey: string) {
  useEffect(() => {
    if (!siteKey || typeof window === 'undefined') return;

    if ((window as any).grecaptcha?.execute) return;
    if (document.querySelector('script[data-recaptcha="1"]')) return;

    const s = document.createElement('script');
    s.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    s.async = true;
    s.defer = true;
    s.dataset.recaptcha = '1';
    document.head.appendChild(s);
  }, [siteKey]);

  const execute = async (action: string): Promise<string> => {
    if (!siteKey) throw new Error('Missing NEXT_PUBLIC_RECAPTCHA_SITE_KEY');

    await new Promise<void>((resolve) => {
      const go = () => (window as any).grecaptcha.ready(() => resolve());
      if ((window as any).grecaptcha?.ready) go();
      else {
        let tries = 0;
        const id = setInterval(() => {
          tries++;
          if ((window as any).grecaptcha?.ready) { clearInterval(id); go(); }
          else if (tries > 60) { clearInterval(id); resolve(); }
        }, 100);
      }
    });

    return await (window as any).grecaptcha.execute(siteKey, { action });
  };

  return { execute };
}

export default function ContactPage() {
  const [state, setState] = useState<FormState>({ status: 'idle' });
  const recaptcha = useRecaptcha(SITE_KEY);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const disabled = useMemo(() => state.status === 'submitting', [state.status]);

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
    if (!SITE_KEY) {
      setState({ status: 'error', message: 'reCAPTCHA is not configured.' });
      return;
    }

    try {
      setState({ status: 'submitting' });

      // Local dev bypass if DEV_RECAPTCHA_BYPASS=1 (server honors token "dev-bypass")
      const token =
        process.env.NODE_ENV !== 'production' &&
        process.env.NEXT_PUBLIC_SITE_URL?.includes('localhost') &&
        process.env.DEV_RECAPTCHA_BYPASS === '1'
          ? 'dev-bypass'
          : await recaptcha.execute('contact');

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, name, email, subject, message }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || 'Failed to send message');

      setState({ status: 'success' });
      if (nameRef.current) nameRef.current.value = '';
      if (emailRef.current) emailRef.current.value = '';
      if (subjectRef.current) subjectRef.current.value = '';
      if (messageRef.current) messageRef.current.value = '';
    } catch (err: any) {
      setState({ status: 'error', message: err?.message || 'Something went wrong' });
    }
  }

  return (
    <section className="relative overflow-hidden">
      {/* Decorative patriotic hero */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(800px 300px at 10% -10%, rgba(14,165,233,0.10), transparent 60%), radial-gradient(600px 250px at 90% 0%, rgba(220,38,38,0.10), transparent 60%)',
        }}
      />
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-[1.1fr_.9fr] items-start">
          {/* Left: Hero copy */}
          <div className="fade-in">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card-2)] px-3 py-1 small">
              <span className="inline-block h-4 w-6 overflow-hidden rounded-sm ring-1 ring-[var(--border)]">
                <Image src="/file.svg" alt="" width={24} height={16} />
              </span>
              U.S. Veterans Overseas
            </div>

            <h1 className="h1 mt-3">Contact FMP Navigator</h1>
            <p className="mt-3 text-lg text-[var(--muted-foreground)]">
              We’re here to help you navigate direct-billing care abroad. Send us a note—no question is too small.
            </p>

            {/* Branch badges */}
            <div className="mt-6 flex flex-wrap gap-2">
              {['Army','Navy','Air Force','Marines','Coast Guard','Space Force'].map((b) => (
                <span key={b} className="rounded-full bg-[var(--card)] border border-[var(--border)] px-3 py-1 small">
                  {b}
                </span>
              ))}
            </div>

            {/* Assurance card */}
            <div className="card mt-6">
              <p className="text-sm">
                We typically reply within 1–2 business days. Your information is protected by reCAPTCHA and used only to respond to your inquiry.
              </p>
            </div>
          </div>

          {/* Right: Form */}
          <form onSubmit={onSubmit} className="card fade-in elevate" noValidate>
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

            <div className="mt-4">
              <label htmlFor="subject" className="label">Subject</label>
              <input id="subject" ref={subjectRef} type="text" required className="input" disabled={disabled} />
            </div>

            <div className="mt-4">
              <label htmlFor="message" className="label">Message</label>
              <textarea id="message" ref={messageRef} required rows={6} className="textarea" disabled={disabled} />
            </div>

            <div className="mt-6 flex items-center gap-3">
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

            <p className="small muted mt-6">
              This site is protected by reCAPTCHA and the Google{' '}
              <a className="link-underline" href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and{' '}
              <a className="link-underline" href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a> apply.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}